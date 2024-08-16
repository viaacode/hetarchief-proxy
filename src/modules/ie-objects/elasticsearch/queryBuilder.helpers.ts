import { compact, isArray, isEmpty, isNil } from 'lodash';

import { type ElasticsearchSubQuery } from '~modules/ie-objects/elasticsearch/elasticsearch.consts';

/**
 * Output a bool query with AND logic for each of the subQueries
 * eg:
 * [subQuery1, subQuery2, subQuery3]
 * becomes
 * {
 *     bool: {
 *         minimum_should_match: 3
 *         should: [subQuery1, subQuery2, subQuery3],
 *     }
 * }
 *
 * if one of the subQueries is null, the whole query is null
 * if one of the subqueries is empty, then it is omitted from the query
 * if only one subquery is present, then the bool query wrapper is omitted
 * @param subQueries
 * @constructor
 */
export function AND(subQueries: ElasticsearchSubQuery[]): ElasticsearchSubQuery | null {
	if (subQueries.some(isNil)) {
		// Null means the sub query cannot produce results. eg: if no visitor spaces are accessible
		return null;
	}
	const nonEmptySubQueries = subQueries.filter((subQuery) => !isEmpty(subQuery));
	if (nonEmptySubQueries.length === 0) {
		return null;
	}
	if (nonEmptySubQueries.length === 1) {
		return nonEmptySubQueries[0];
	}
	return {
		bool: {
			minimum_should_match: nonEmptySubQueries.length,
			// Empty object means there are no filter requirements, so we can omit this bool entry
			should: nonEmptySubQueries,
		},
	};
}

/**
 * Output a bool query with OR logic for each of the subQueries
 * eg:
 * [subQuery1, subQuery2, subQuery3]
 * becomes
 * {
 *    bool: {
 *        minimum_should_match: 1
 *        should: [subQuery1, subQuery2, subQuery3],
 *    }
 * }
 * if one of the subQueries is null, it is omitted from the query
 * if one of the subqueries is empty, then it is omitted from the query
 * if only one subquery is present, then the bool query wrapper is omitted
 * @param subQueries
 * @constructor
 */
export function OR(subQueries: ElasticsearchSubQuery[]): ElasticsearchSubQuery | null {
	const cleanedSubQueries = compact(subQueries).filter((subQuery) => !isEmpty(subQuery));
	if (cleanedSubQueries.length === 0) {
		return null;
	}
	if (cleanedSubQueries.length === 1) {
		return cleanedSubQueries[0];
	}
	return {
		bool: {
			minimum_should_match: 1,
			should: compact(subQueries),
		},
	};
}

export function applyFilter(filterObject: ElasticsearchSubQuery, newFilter: any): void {
	if (!filterObject.bool[newFilter.occurrenceType]) {
		filterObject.bool[newFilter.occurrenceType] = [];
	}

	// isConsultable filters have array of items to be processed
	if (isArray(newFilter.query)) {
		return filterObject.bool[newFilter.occurrenceType].push(...newFilter.query);
	}

	filterObject.bool[newFilter.occurrenceType].push(newFilter.query);
}
