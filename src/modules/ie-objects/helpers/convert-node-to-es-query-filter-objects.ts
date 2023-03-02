import { BadRequestException } from '@nestjs/common';
import { Expression } from 'jsep';

import { SearchFilter } from '../dto/ie-objects.dto';

export const convertNodeToEsQueryFilterObjects = (
	node: Expression,
	searchTemplate?: any[],
	searchFilter?: SearchFilter
): any => {
	switch (node.type) {
		case 'Compound':
			return {
				bool: {
					should: ((node.body || []) as Expression[]).map((bodyNode) =>
						convertNodeToEsQueryFilterObjects(bodyNode, searchTemplate, searchFilter)
					),
				},
			};

		case 'BinaryExpression':
			return {
				bool: {
					should: [
						convertNodeToEsQueryFilterObjects(
							node.left as any,
							searchTemplate,
							searchFilter
						),
						convertNodeToEsQueryFilterObjects(
							node.right as any,
							searchTemplate,
							searchFilter
						),
					],
					minimum_should_match: (node.operator as any) === 'AND' ? 2 : 1,
				},
			};

		case 'UnaryExpression':
			return {
				bool: {
					must_not: convertNodeToEsQueryFilterObjects(
						node.argument as any,
						searchTemplate,
						searchFilter
					),
				},
			};

		case 'Identifier':
			return buildFreeTextFilter(searchTemplate, {
				...searchFilter,
				value: node.name as string,
			});

		case 'Literal':
			return buildFreeTextFilter(searchTemplate, {
				...searchFilter,
				value: node.value as string,
			});
		default:
			throw new BadRequestException(`Unknown expression (${node})`);
	}
};

const buildFreeTextFilter = (searchTemplate: any[], searchFilter: SearchFilter): any => {
	// Replace {{query}} in the template with the escaped search terms
	let stringifiedSearchTemplate = JSON.stringify(searchTemplate);
	stringifiedSearchTemplate = stringifiedSearchTemplate.replace(
		/\{\{query\}\}/g,
		searchFilter.value
	);

	return {
		bool: {
			should: JSON.parse(stringifiedSearchTemplate),
			minimum_should_match: 1, // At least one of the search patterns has to match, but not all of them
		},
	};
};

enum LOGICAL_OPERATOR {
	AND = 'AND',
	OR = 'OR',
	NOT = 'NOT',
}

export const LOGICAL_OCCURRENCE_TYPE: { [prop in LOGICAL_OPERATOR]?: string } = {
	[LOGICAL_OPERATOR.AND]: 'must',
	[LOGICAL_OPERATOR.OR]: 'should',
	[LOGICAL_OPERATOR.NOT]: 'must_not',
};
