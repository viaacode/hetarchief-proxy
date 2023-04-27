import jsep, { Expression } from 'jsep';

import { decodeSearchterm, encodeSearchterm } from './encode-search-term';

(jsep as any).removeAllBinaryOps();
(jsep as any).removeAllUnaryOps();

jsep.addBinaryOp('AND', 2);
jsep.addBinaryOp('OR', 1);

jsep.addUnaryOp('NOT');

export function convertStringToSearchTerms(searchQuery: string): string[] {
	if (!searchQuery) {
		return [];
	}
	const node = jsep(encodeSearchterm(searchQuery));
	return convertNodeToSearchTerms(node);
}

export function convertNodeToSearchTerms(node: Expression): string[] {
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
