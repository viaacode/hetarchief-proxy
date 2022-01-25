/**
 * This script runs over all files that match *.gql.ts and extracts the gql queries and whitelists them into the graphql database
 */
import * as path from 'path';

import fse from 'fs-extra';
import glob from 'glob';
import _ from 'lodash';

const logger = {
	error: (message, err = null) => {
		const now = new Date().toISOString();
		console.log(`${now} [ERROR] ${message}`, err?.stack);
	},
	warn: (message, obj = null) => {
		const now = new Date().toISOString();
		console.log(`${now} [WARN] ${message}`, obj);
	},
	info: (message, obj = null) => {
		const now = new Date().toISOString();
		console.log(`${now} [info] ${message}`, obj);
	},
};

if (!process.env.GRAPHQL_URL) {
	logger.error(
		'Failed to whitelist graphql queries because environment variable GRAPHQL_URL is not set'
	);
}
if (!process.env.GRAPHQL_SECRET) {
	logger.error(
		'Failed to whitelist graphql queries because environment variable GRAPHQL_SECRET is not set'
	);
}

const gqlRegex = /const ([^\s]+) = `([^`]+?)`/gm;

/**
 * Extracts label of query
 * example: query getCollectionNamesByOwner($owner_profile_id: uuid) { app_collections( wher...
 * would return: getCollectionNamesByOwner
 * @param query
 */
function getQueryLabel(query: string): string {
	return _.split(query, /[ ({]/)[1];
}

function whitelistQueries() {
	const options = {
		cwd: path.join(__dirname, '../src'),
	};

	glob('**/*.gql.ts', options, async (err, files) => {
		const queries: { [queryName: string]: string } = {};
		const queryLabels: string[] = [];

		try {
			if (err) {
				logger.error('Failed to find files using **/*.gql.ts', err);
				return;
			}

			// Find and extract queries
			files.forEach((relativeFilePath: string) => {
				try {
					const absoluteFilePath = `${options.cwd}/${relativeFilePath}`;
					const content: string = fse.readFileSync(absoluteFilePath).toString();

					let matches: RegExpExecArray | null;
					do {
						matches = gqlRegex.exec(content);
						if (matches) {
							const name = matches[1];
							const query = matches[2];
							if (query.includes('${')) {
								logger.warn(
									`Extracting graphql queries with javascript template parameters isn't supported: ${name}`
								);
							}

							if (queries[name]) {
								logger.warn(
									`Query with the same variable name is found twice. This will cause a conflicts in the query whitelist: ${name}`
								);
							}

							const label = getQueryLabel(query);
							if (queryLabels.includes(label)) {
								logger.warn(
									`Query with the same label is found twice. This will cause a conflicts in the query whitelist: ${label}`
								);
							}
							queryLabels.push(label);

							// Remove new lines and tabs
							// Trim whitespace
							queries[name] = query.replace(/[\t\r\n]+/gm, ' ').trim();
						}
					} while (matches);
				} catch (err) {
					logger.error(`Failed to find queries in file: ${relativeFilePath}`, err);
				}
			});

			const outputFile = path.join(__dirname, 'proxy-whitelist.json');
			await fse.writeFile(outputFile, JSON.stringify(queries, null, 2));

			logger.info(
				`[QUERY WHITELISTING]: Whitelisted ${
					Object.keys(queries).length
				} queries in the graphql database. Full list: ${outputFile}`
			);
		} catch (err) {
			logger.error('Failed to extract and upload graphql query whitelist', err);
		}
	});
}

whitelistQueries();
