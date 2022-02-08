import { InternalServerErrorException } from '@nestjs/common';
import _ from 'lodash';

import { MediaQueryDto, SearchFilters } from '../dto/media.dto';
import { MAX_COUNT_SEARCH_RESULTS, MAX_NUMBER_SEARCH_RESULTS } from '../services/consts';

import searchQueryTemplate from './templates/search-query.json';

const searchQueryObjectTemplate = _.values(searchQueryTemplate);

export class QueryBuilder {
	/**
	 * Convert filters, order, aggs properties (created by the ui) to elasticsearch query object
	 * @param searchRequest the search query parameters
	 * @return elastic search query
	 */
	public static build(searchRequest: MediaQueryDto): any {
		try {
			const queryObject: any = {};
			delete queryObject.default; // Side effect of importing a json file as a module

			// Avoid huge queries
			queryObject.size = Math.min(searchRequest.size, MAX_NUMBER_SEARCH_RESULTS);
			const max = Math.max(0, MAX_COUNT_SEARCH_RESULTS - queryObject.size);
			queryObject.from = _.clamp(searchRequest.from, 0, max);

			// Add the filters and search terms to the query object
			_.set(queryObject, 'query', this.buildFilterObject(searchRequest.filters));

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

			_.set(filterObject, 'bool.should', textQueryObjectArray);

			if (_.keys(filters).length === 1) {
				// Only a string query is passed, no need to add further filters
				return filterObject;
			}
		}

		return filterObject;
	}
}
