// tslint:disable:no-console
/**
 * This script runs over all files that match *.gql.ts and extracts the gql queries and outputs them to the client-whitelist.json file in /scripts
 */
import * as fs from 'fs';
import * as path from 'path';

import glob from 'glob';

const extractNameRegex = /(query|mutation) ([^\s(]+)(.*)/gm;

function extractQueriesFromCode(globPattern: string, outputFileName: string) {
	const options = {
		cwd: path.join(__dirname, '../src'),
	};

	glob(globPattern, options, async (err: any, files: string[]) => {
		const queries: { [queryName: string]: string } = {};

		try {
			if (err) {
				console.error('Failed to find files using **/*.graphql', err);
				return;
			}

			// Find and extract queries
			files.forEach((relativeFilePath: string) => {
				try {
					const absoluteFilePath = `${options.cwd}/${relativeFilePath}`;
					const content: string = fs.readFileSync(absoluteFilePath).toString();

					let matches: RegExpExecArray | null;
					do {
						matches = extractNameRegex.exec(content);
						if (matches) {
							const name = matches[2];
							const query = content;

							if (queries[name]) {
								console.error(
									`Query with the same variable name is found twice. This will cause a conflicts in the query whitelist: ${name}`
								);
							}

							// Remove new lines and tabs
							// Trim whitespace
							queries[name] = query.replace(/[\t\r\n]+/gm, ' ').trim();
						}
					} while (matches);
				} catch (err) {
					console.error(`Failed to find queries in file: ${relativeFilePath}`, err);
				}
			});

			const outputFile = path.join(__dirname, outputFileName);

			fs.writeFileSync(outputFile, JSON.stringify(queries, null, 2));

			console.log(
				`Found ${
					Object.keys(queries).length
				} queries, outputted to: ${outputFile}. Copy this file to /scripts folder in the avo2 proxy`
			);
		} catch (err) {
			console.error('Failed to extract graphql query whitelist', JSON.stringify(err));
		}
	});
}

extractQueriesFromCode('**/queries/hetarchief/*.graphql', 'proxy-whitelist-hetarchief.json');
extractQueriesFromCode('**/queries/avo/*.graphql', 'proxy-whitelist-avo.json');
extractQueriesFromCode('**/queries/*.graphql', 'proxy-whitelist.json');
// tslint:enable:no-console
