import { BadRequestException } from '@nestjs/common';
import { type baseTypes, type Expression } from 'jsep';

import { type SearchFilter } from '../dto/ie-objects.dto';

import { decodeSearchterm } from './encode-search-term';

export const convertNodeToEsQueryFilterObjects = (
	node: Expression,
	searchTemplates?: { fuzzy: any[]; exact: any[] },
	searchFilter?: SearchFilter
): any => {
	node.value = decodeSearchterm(node.value as string);
	node.name = decodeSearchterm(node.name as string);
	switch (node.type) {
		case 'Compound': {
			const bodyNodes = (node.body || []) as Expression[];
			if (!bodyNodes.find((bodyNode) => bodyNode.type !== 'Identifier')) {
				// Compound query with only identifier nodes below it. This is a simple text search, so we want to simplify the query
				return buildFreeTextFilter(searchTemplates.fuzzy, {
					...searchFilter,
					value: bodyNodes.map((bodyNode) => bodyNode.name).join(' '),
				});
			}

			// Compound query with other nodes below it => follow the regular recursive building of the elasticsearch query
			return {
				bool: {
					should: ((node.body || []) as Expression[]).map((bodyNode) =>
						convertNodeToEsQueryFilterObjects(bodyNode, searchTemplates, searchFilter)
					),
					minimum_should_match: ((node.body || []) as Expression[]).length,
				},
			};
		}

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
		case 'ThisExpression':
			return buildFreeTextFilter(searchTemplates.exact, {
				...searchFilter,
				value: 'this',
			});
		default:
			throw new BadRequestException(`Unknown expression (${node})`);
	}
};

export const buildFreeTextFilter = (searchTemplate: any[], searchFilter: SearchFilter): any => {
	let values: string[];
	if (searchFilter.multiValue) {
		values = searchFilter.multiValue;
	} else {
		values = [searchFilter.value];
	}

	// Replace {{query}} in the template with the escaped search terms
	const stringifiedSearchTemplate = JSON.stringify(searchTemplate);

	const shouldArray = values.flatMap((value) => {
		return JSON.parse(stringifiedSearchTemplate.replace(/\{\{query}}/g, value));
	});

	return {
		bool: {
			should: shouldArray,
			minimum_should_match: 1, // At least one of the search patterns has to match, but not all of them
		},
	};
};
