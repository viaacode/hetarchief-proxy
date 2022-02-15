import { InternalServerErrorException } from '@nestjs/common';
import _ from 'lodash';

import { MediaQueryDto, SearchFilters } from '../dto/media.dto';
import { QueryBuilderConfig } from '../types';

import {
	AGGS_PROPERTIES,
	MAX_COUNT_SEARCH_RESULTS,
	MAX_NUMBER_SEARCH_RESULTS,
	NEEDS_FILTER_SUFFIX,
	NUMBER_OF_FILTER_OPTIONS,
	READABLE_TO_ELASTIC_FILTER_NAMES,
} from './consts';
import searchQueryTemplate from './templates/search-query.json';

import { PaginationHelper } from '~shared/helpers/pagination';

const searchQueryObjectTemplate = _.values(searchQueryTemplate);

export class QueryBuilder {
	private static config = {
		AGGS_PROPERTIES,
		MAX_COUNT_SEARCH_RESULTS,
		MAX_NUMBER_SEARCH_RESULTS,
		NEEDS_FILTER_SUFFIX,
		NUMBER_OF_FILTER_OPTIONS,
		READABLE_TO_ELASTIC_FILTER_NAMES,
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

			return queryObject;
		} catch (err) {
			throw new InternalServerErrorException('Failed to build query object', err);
		}
	}

	/**
	 * Build a query to get a media item by id
	 * @param id the id to query
	 * @returns elastic search query
	 */
	public static queryById(id: string): any {
		return {
			query: {
				term: {
					_id: id,
				},
			},
		};
	}

	/**
	 * AND filter: https://stackoverflow.com/a/52206289/373207
	 * @param elasticKey
	 * @param readableKey
	 * @param values
	 */
	private static generateAndFilter(
		elasticKey: string,
		readableKey: keyof SearchFilters,
		value: string
	): any {
		return {
			bool: {
				must: {
					term: {
						[elasticKey + this.suffix(readableKey)]: value,
					},
				},
			},
		};
	}

	/**
	 * Creates the filter portion of the elsaticsearch query object
	 * Containing the search terms and the checked filters
	 * @param filters
	 */
	private static buildFilterObject(filters: Partial<SearchFilters> | undefined) {
		if (!filters || _.isEmpty(filters)) {
			// Return query object that will match all results
			return { match_all: {} };
		}

		const filterObject: any = {};
		const stringQuery = _.get(filters, 'query');
		if (stringQuery) {
			// Replace {{query}} in the template with the escaped search terms
			const textQueryObjectArray = _.cloneDeep(searchQueryObjectTemplate);
			const escapedQueryString = stringQuery;
			_.forEach(textQueryObjectArray, (matchObj) => {
				_.set(matchObj, 'multi_match.query', escapedQueryString);
			});

			_.set(filterObject, 'bool.must', textQueryObjectArray);

			if (_.keys(filters).length === 1) {
				// Only a string query is passed, no need to add further filters
				return filterObject;
			}
		}

		// Add additional filters to the query object
		const filterArray: any[] = [];
		_.set(filterObject, 'bool.filter', filterArray);
		_.forEach(filters, (value: any, readableKey: keyof SearchFilters) => {
			if (readableKey === 'query') {
				return; // Query filter has already been handled, skip this foreach iteration
			}

			// // Map frontend filter names to elasticsearch names
			const elasticKey = this.config.READABLE_TO_ELASTIC_FILTER_NAMES[readableKey];
			if (!elasticKey) {
				throw new InternalServerErrorException(
					`Failed to resolve agg property: ${readableKey}`
				);
			}
			if (!_.isArray(value)) {
				// TODO @Bert in Avo is alles van values een array, weet niet hoe je dat hier ziet?
				filterArray.push(this.generateAndFilter(elasticKey, readableKey, value));
			}
		});

		return filterObject;
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
				this.config.READABLE_TO_ELASTIC_FILTER_NAMES[aggProperty as keyof SearchFilters];
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
	private static suffix(prop: keyof SearchFilters): string {
		return this.config.NEEDS_FILTER_SUFFIX[prop] ? '.filter' : '';
	}
}
