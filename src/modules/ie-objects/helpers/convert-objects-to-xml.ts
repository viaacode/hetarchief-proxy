import convert from 'xml-js';

import {
	IE_OBJECT_PROPERTY_TO_DUBLIN_CORE,
	IE_OBJECT_PROPS_METADATA_EXPORT,
	type XmlNode,
} from '../ie-objects.conts';
import { type IeObject, IeObjectLicense } from '../ie-objects.types';

export const convertObjectToXml = (object: Partial<IeObject>, clientHost: string): string => {
	const dcElements: XmlNode[] = [];

	for (const key of IE_OBJECT_PROPS_METADATA_EXPORT) {
		const value = object[key as keyof IeObject];
		if (value) {
			const dcField = IE_OBJECT_PROPERTY_TO_DUBLIN_CORE[key](value);

			if (dcField) {
				dcElements.push(...dcField);
			}
		}
	}

	// Permalink
	dcElements.push(
		...IE_OBJECT_PROPERTY_TO_DUBLIN_CORE.permalink(`${clientHost}/pid/${object.schemaIdentifier}`)
	);

	// Rights
	let rights: string | null;
	if (object.licenses?.includes(IeObjectLicense.PUBLIC_DOMAIN)) {
		rights = 'public domain';
	} else if (object.licenses?.includes(IeObjectLicense.COPYRIGHT_UNDETERMINED)) {
		rights = 'copyright undetermined';
	} else {
		rights = null;
	}
	if (rights) {
		dcElements.push(...IE_OBJECT_PROPERTY_TO_DUBLIN_CORE.rightsStatus(rights));
	}

	const xmlObj = {
		declaration: {
			attributes: {
				version: '1.0',
				encoding: 'UTF-8',
			},
		},
		doctype:
			'rdf:RDF PUBLIC "-//DUBLIN CORE//DCMES DTD 2002 01 24//EN" "http://dublincore.org/specifications/dublin-core/dcmes-xml/2002-01-24/dcmes-xml-dtd.dtd"',
		elements: [
			{
				type: 'element',
				name: 'rdf:RDF',
				attributes: {
					'xmlns:rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
					'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
					'xmlns:dcterms': 'http://purl.org/dc/terms/',
				},
				elements: [
					{
						type: 'element',
						name: 'rdf:Description',
						attributes: {
							'rdf:about': 'http://dublincore.org/',
						},
						elements: dcElements,
					},
				],
			},
		],
	};

	return convert.js2xml(xmlObj, { compact: false, spaces: 2 });
};
