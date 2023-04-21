import { BadRequestException } from '@nestjs/common';
import { baseTypes, Expression } from 'jsep';

import { SearchFilter } from '../dto/ie-objects.dto';

export const convertNodeToEsQueryFilterObjects = (
	node: Expression,
	searchTemplates?: { fuzzy: any[]; exact: any[] },
	searchFilter?: SearchFilter
): any => {
	switch (node.type) {
		case 'Compound':
			return {
				bool: {
					should: ((node.body || []) as Expression[]).map((bodyNode) =>
						convertNodeToEsQueryFilterObjects(bodyNode, searchTemplates, searchFilter)
					),
					minimum_should_match: ((node.body || []) as Expression[]).length,
				},
			};

		case 'SequenceExpression':
			return {
				bool: {
					should: ((node.expressions || []) as Expression[]).map((bodyNode) =>
						convertNodeToEsQueryFilterObjects(bodyNode, searchTemplates, searchFilter)
					),
					minimum_should_match: ((node.expressions || []) as Expression[]).length,
				},
			};

		case 'BinaryExpression':
			return {
				bool: {
					should: [
						convertNodeToEsQueryFilterObjects(
							node.left as Expression,
							searchTemplates,
							searchFilter
						),
						convertNodeToEsQueryFilterObjects(
							node.right as Expression,
							searchTemplates,
							searchFilter
						),
					],
					minimum_should_match: (node.operator as baseTypes) === 'AND' ? 2 : 1,
				},
			};

		case 'UnaryExpression':
			return {
				bool: {
					must_not: convertNodeToEsQueryFilterObjects(
						node.argument as Expression,
						searchTemplates,
						searchFilter
					),
				},
			};

		case 'Identifier':
			return buildFreeTextFilter(searchTemplates.fuzzy, {
				...searchFilter,
				value: node.name as string,
			});

		case 'Literal':
			return buildFreeTextFilter(searchTemplates.exact, {
				...searchFilter,
				value: node.value as string,
			});
		default:
			throw new BadRequestException(`Unknown expression (${node})`);
	}
};

export const buildFreeTextFilter = (searchTemplate: any[], searchFilter: SearchFilter): any => {
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
