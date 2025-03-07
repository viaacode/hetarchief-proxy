import fs from 'fs/promises';
import * as path from 'node:path';

interface IeObject {
	document: string;
	id: string;
	index: string;
}

async function createIndex(index: string) {
	const response = await fetch(`http://localhost:9200/${index}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (response.status < 200 || response.status >= 400) {
		throw new Error(
			JSON.stringify({
				message: 'Failed to create index',
				innerException: await response.json(),
				additionalInfo: {
					index,
				},
			})
		);
	}
}

async function loadMapping(): Promise<any> {
	// Load mapping from json file and set in on the localhost:9200 elasticsearch instance
	const mappingFilePath = path.resolve('./mapping-without-matchbox.json');
	return JSON.parse((await fs.readFile(mappingFilePath, 'utf-8')).toString());
}

async function setMapping(index: string, mapping: any) {
	const response = await fetch(`http://localhost:9200/${index}/_mapping`, {
		method: 'PUT',
		body: JSON.stringify(mapping),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (response.status < 200 || response.status >= 400) {
		const responseJson = await response.json();
		throw new Error(
			JSON.stringify({
				message: 'Failed to set mapping for index',
				innerException: responseJson,
				additionalInfo: {
					index,
				},
			})
		);
	}
}

async function loadIeObjects(): Promise<IeObject[]> {
	const response = await fetch('http://localhost:9000/v1/graphql', {
		method: 'POST',
		body: JSON.stringify({
			query: `
				query getAllIeObjectIndexDocuments {
					graph__index_intellectual_entity {
						document
						id
						index
					}
				}
			`,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const { data } = await response.json();
	return data.graph__index_intellectual_entity;
}

async function insertIeObjects(ieObjects: IeObject[]): Promise<void> {
	const bulkData: string[] = ieObjects.flatMap((ieObject) => [
		JSON.stringify({ index: { _index: ieObject.index, _id: ieObject.id } }),
		JSON.stringify(ieObject.document),
	]);

	const response = await fetch('http://localhost:9200/_bulk', {
		method: 'POST',
		body: bulkData.join('\n') + '\n',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (response.status < 200 || response.status >= 400) {
		throw new Error(
			JSON.stringify({
				message: 'Failed to insert ie-objects in elasticsearch',
				innerException: await response.json(),
			})
		);
	}
}

async function initElasticsearch() {
	// Load ie-objects from the local hasura database graph.index table with columns: id, index, document
	const ieObjects = await loadIeObjects();

	const mapping = await loadMapping();
	const indexes = ieObjects.map((ieObject) => ieObject.index);
	const uniqueIndexes = [...new Set(indexes)];

	// For all unique indexes in the ie-objects, create an index in the elasticsearch instance
	for (const index of uniqueIndexes) {
		await createIndex(index);
	}

	// For all unique indexes in the ie-objects, set the mapping for each index
	for (const index of uniqueIndexes) {
		await setMapping(index, mapping);
	}

	// Bulk insert ie-objects in the elasticsearch instance using the fetch api
	await insertIeObjects(ieObjects);
}

initElasticsearch()
	.then(() => console.log('Elasticsearch loaded'))
	.catch((error) => console.error(error));
