import { InternalServerErrorException } from '@nestjs/common';
import _ from 'lodash';

import { MediaQueryDto, SearchFilter } from '../dto/media.dto';
import { Operator, QueryBuilderConfig, SearchFilterField } from '../types';

import {
	AGGS_PROPERTIES,
	DEFAULT_QUERY_TYPE,
	MAX_COUNT_SEARCH_RESULTS,
	MAX_NUMBER_SEARCH_RESULTS,
	NEEDS_FILTER_SUFFIX,
	NUMBER_OF_FILTER_OPTIONS,
	OCCURRENCE_TYPE,
	READABLE_TO_ELASTIC_FILTER_NAMES,
	VALUE_OPERATORS,
} from './consts';
import searchQueryTemplate from './templates/search-query.json';

import { PaginationHelper } from '~shared/helpers/pagination';

const searchQueryObjectTemplate = _.values(searchQueryTemplate);

export class QueryBuilder {
	private static config: QueryBuilderConfig = {
		AGGS_PROPERTIES,
		MAX_COUNT_SEARCH_RESULTS,
		MAX_NUMBER_SEARCH_RESULTS,
		NEEDS_FILTER_SUFFIX,
		NUMBER_OF_FILTER_OPTIONS,
		READABLE_TO_ELASTIC_FILTER_NAMES,
		DEFAULT_QUERY_TYPE,
		OCCURRENCE_TYPE,
		VALUE_OPERATORS,
	};

	public static getConfig(): QueryBuilderConfig {
		return this.config;
	}

	public static setConfig(config: QueryBuilderConfig) {
		this.config = config;
	}

	/**
	 * Convert filters, order, aggs properties (created by the ui) to elasticsearch query object
	 * @param searchRequest the search query parameters
	 * @return elastic search query
	 */
	public static build(searchRequest: MediaQueryDto): any {
		try {
			const { offset, limit } = PaginationHelper.convertPagination(
				searchRequest.page,
				searchRequest.size
			);
			const queryObject: any = {};
			delete queryObject.default; // Side effect of importing a json file as a module

			// Avoid huge queries
			queryObject.size = Math.min(searchRequest.size, this.config.MAX_NUMBER_SEARCH_RESULTS);
			const max = Math.max(0, this.config.MAX_COUNT_SEARCH_RESULTS - limit);
			queryObject.from = _.clamp(offset, 0, max);

			// Add the filters and search terms to the query object
			_.set(queryObject, 'query', this.buildFilterObject(searchRequest.filters));

			// Specify the aggs objects with optional search terms
			_.set(queryObject, 'aggs', this.buildAggsObject(searchRequest));
			// Add sorting
			queryObject.sort = [
				'_score',
				{
					[searchRequest.orderProp]: {
						order: searchRequest.orderDirection,
					},
				},
			];

			return queryObject;
		} catch (err) {
			throw new InternalServerErrorException('Failed to build query object', err);
		}
	}

	protected static getOccurrenceType(operator: Operator): string {
		return this.config.OCCURRENCE_TYPE[operator] || 'filter';
	}

	protected static buildValue(searchFilter: SearchFilter): any {
		if (this.config.VALUE_OPERATORS.includes(searchFilter.operator)) {
			return {
				[searchFilter.operator]: searchFilter.value,
			};
		}
		return searchFilter.value;
	}

	protected static buildFilter(elasticKey: string, searchFilter: SearchFilter): any {
		const occurrenceType = this.getOccurrenceType(searchFilter.operator);
		return {
			occurrenceType,
			query: {
				[this.config.DEFAULT_QUERY_TYPE[searchFilter.field]]: {
					[elasticKey + this.suffix(searchFilter.field)]: this.buildValue(searchFilter),
				},
			},
		};
	}

	protected static buildFreeTextFilter(searchFilter: SearchFilter): any {
		// Replace {{query}} in the template with the escaped search terms
		const textQueryFilterArray = _.cloneDeep(searchQueryObjectTemplate);
		const escapedQueryString = searchFilter.value;
		_.forEach(textQueryFilterArray, (matchObj) => {
			_.set(matchObj, 'multi_match.query', escapedQueryString);
		});

		return textQueryFilterArray;
	}

	/**
	 * Creates the filter portion of the elasticsearch query object
	 * Containing the search terms and the checked filters
	 * @param filters
	 */
	private static buildFilterObject(filters: SearchFilter[] | undefined) {
		if (!filters || _.isEmpty(filters)) {
			// Return query object that will match all results
			return { match_all: {} };
		}

		const filterObject: any = {};

		// Add additional filters to the query object
		const filterArray: any[] = [];
		_.set(filterObject, 'bool.filter', filterArray);
		_.forEach(filters, (searchFilter: SearchFilter) => {
			if (searchFilter.field === 'query') {
				const textFilters = this.buildFreeTextFilter(searchFilter);

				textFilters.forEach((filter) =>
					this.applyFilter(filterObject, {
						occurrenceType: this.getOccurrenceType(searchFilter.operator),
						query: filter,
					})
				);
				return;
			}

			// // Map frontend filter names to elasticsearch names
			const elasticKey = this.config.READABLE_TO_ELASTIC_FILTER_NAMES[searchFilter.field];
			if (!elasticKey) {
				throw new InternalServerErrorException(
					`Failed to resolve agg property: ${searchFilter.field}`
				);
			}

			const advancedFilter = this.buildFilter(elasticKey, searchFilter);
			this.applyFilter(filterObject, advancedFilter);
		});

		return filterObject;
	}

	protected static applyAdvancedFilter(filterObject: any, advancedFilter: any): void {
		advancedFilter.forEach((filter) => {
			if (!filterObject.bool[filter.occurrenceType]) {
				filterObject.bool[filter.occurrenceType] = [];
			}

			filterObject.bool[filter.occurrenceType].push(filter.query);
		});
	}

	protected static applyFilter(filterObject: any, newFilter: any): void {
		if (!filterObject.bool[newFilter.occurrenceType]) {
			filterObject.bool[newFilter.occurrenceType] = [];
		}

		filterObject.bool[newFilter.occurrenceType].push(newFilter.query);
	}
	/**
	 * Builds up an object containing the elasticsearch  aggregation objects
	 * The result of these aggregations will be used to show in the multi select options lists in the search page
	 * The results will show:
	 * {
	 *   "key": "video",
	 *   "doc_count": 10
	 * },
	 * {
	 *   "key": "audio",
	 *   "doc_count": 2
	 * }
	 * @param searchRequest
	 */
	private static buildAggsObject(searchRequest: MediaQueryDto): any {
		const aggs: any = {};
		_.forEach(searchRequest.requestedAggs || this.config.AGGS_PROPERTIES, (aggProperty) => {
			const elasticProperty =
				this.config.READABLE_TO_ELASTIC_FILTER_NAMES[aggProperty as SearchFilterField];
			if (!elasticProperty) {
				throw new InternalServerErrorException(
					`Failed to resolve agg property: ${aggProperty}`
				);
			}

			aggs[elasticProperty] = {
				terms: {
					field: elasticProperty + this.suffix(aggProperty),
					size: (searchRequest as any).aggsSize || this.config.NUMBER_OF_FILTER_OPTIONS,
				},
			};
			// }
		});
		return aggs;
	}

	/**
	 * Some properties in elasticsearch need a ".filter" suffix to work correctly
	 * This helper function makes it easier to get a suffix if one is required
	 * eg:
	 * "dc_titles_serie.filter": {
	 *   "terms": {
	 *     "field": "dc_titles_serie.filter"
	 *   }
	 * },
	 * @param prop
	 */
	private static suffix(prop: SearchFilterField): string {
		return this.config.NEEDS_FILTER_SUFFIX[prop] ? '.filter' : '';
	}
}
