import jsep, { type Expression } from 'jsep';
import { compact } from 'lodash';

import { decodeSearchterm, encodeSearchterm } from './encode-search-term';

(jsep as any).removeAllBinaryOps();
(jsep as any).removeAllUnaryOps();

jsep.addBinaryOp('AND', 2);
jsep.addBinaryOp('OR', 1);

jsep.addUnaryOp('NOT');

export interface SearchTermParseResult {
	plainTextSearchTerms: string[];
	parsedSuccessfully: boolean;
}

export function convertStringToSearchTerms(searchQuery: string): SearchTermParseResult {
	if (!searchQuery) {
		return { plainTextSearchTerms: [], parsedSuccessfully: true };
	}
	try {
		const node = jsep(encodeSearchterm(searchQuery));
		const plainTextSearchTerms = convertNodeToSearchTerms(node);
		return { plainTextSearchTerms, parsedSuccessfully: true };
	} catch (err) {
		const plainTextSearchTerms = compact(searchQuery.replace(/[^a-zA-Z0-9]+/g, ' ').split(' '));
		return { plainTextSearchTerms, parsedSuccessfully: false };
	}
}

export function convertNodeToSearchTerms(node: Expression): string[] {
	node.value = decodeSearchterm(node.value as string);
	node.name = decodeSearchterm(node.name as string);

	switch (node.type) {
		case 'Compound':
			return ((node.body || []) as Expression[]).flatMap(convertNodeToSearchTerms);

		case 'SequenceExpression':
			return ((node.expressions || []) as Expression[]).flatMap(convertNodeToSearchTerms);

		case 'BinaryExpression':
			return [
				...convertNodeToSearchTerms(node.left as Expression),
				...convertNodeToSearchTerms(node.right as Expression),
			];

		case 'UnaryExpression':
			return convertNodeToSearchTerms(node.argument as Expression);

		case 'Identifier':
			return [node.name as string];

		case 'Literal':
			return [node.value as string];

		default:
			return [];
	}
}
