import { MediaFormat, QueryBuilderConfig } from '../types';

import { QueryType } from './consts';
import { QueryBuilder } from './queryBuilder';

const incompleteConfig = {
	MAX_NUMBER_SEARCH_RESULTS: 2000,
	MAX_COUNT_SEARCH_RESULTS: 10000,
	NUMBER_OF_FILTER_OPTIONS: 40,

	READABLE_TO_ELASTIC_FILTER_NAMES: {
		query: 'query',
		// format: 'dcterms_format', // disabled
	},

	// By default add the 'format' aggregation
	AGGS_PROPERTIES: ['format'],

	NEEDS_FILTER_SUFFIX: {
		query: false,
		// no format property
	},
	DEFAULT_QUERY_TYPE: {
		format: QueryType.TERM,
		duration: QueryType.RANGE,
	},
};

describe('QueryBuilder', () => {
	describe('build', () => {
		it('should build a valid search query', () => {
			// const query = ;
			expect(() => QueryBuilder.build(null)).toThrowError('Failed to build query object');
		});

		it('should return a match_all query when no filters are specified', () => {
			const esQuery = QueryBuilder.build({ size: 10, page: 1 });
			expect(esQuery.query).toEqual({ match_all: {} });
			expect(esQuery.from).toEqual(0);
			expect(esQuery.size).toEqual(10);
		});

		it('should correctly convert the page to a from value', () => {
			const esQuery = QueryBuilder.build({ size: 10, page: 3 });
			expect(esQuery.from).toEqual(20);
			expect(esQuery.size).toEqual(10);
		});

		it('should return a match_all query when empty filters are specified', () => {
			const esQuery = QueryBuilder.build({ filters: {}, size: 10, page: 1 });
			expect(esQuery.query).toEqual({ match_all: {} });
		});

		it('should return a search query when a query filter is specified', () => {
			const esQuery = QueryBuilder.build({
				filters: { query: 'searchme' },
				size: 10,
				page: 1,
			});
			expect(esQuery.query.bool.must.length).toBeGreaterThanOrEqual(3);
		});

		it('should return an empty query when empty query filter is specified', () => {
			const esQuery = QueryBuilder.build({
				filters: { query: '' },
				size: 10,
				page: 1,
			});
			expect(esQuery.query).toEqual({ bool: { filter: [] } });
		});

		it('should filter on format', () => {
			const esQuery = QueryBuilder.build({
				filters: { format: MediaFormat.VIDEO },
				size: 10,
				page: 1,
			});

			expect(esQuery.query).toEqual({
				bool: { filter: [{ term: { dcterms_format: 'video' } }] },
			});
		});

		it('should use a range filter to filter on duration', () => {
			const rangeQuery = { gte: '01:00:00' };
			const esQuery = QueryBuilder.build({
				filters: { duration: rangeQuery },
				size: 10,
				page: 1,
			});

			expect(esQuery.query).toEqual({
				bool: { filter: [{ range: { schema_duration: rangeQuery } }] },
			});
		});

		it('throws an internal server exception when an unkown filter value is passed', () => {
			// Set incomplete config
			const originalConfig = QueryBuilder.getConfig();
			QueryBuilder.setConfig(incompleteConfig as QueryBuilderConfig);
			let error;
			try {
				QueryBuilder.build({
					filters: { query: '', format: null },
					size: 10,
					page: 1,
				});
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('Failed to build query object');

			// reset
			QueryBuilder.setConfig(originalConfig);
		});

		it('throws an internal server exception when an unknown aggregate value is passed', () => {
			// Set incomplete config
			const originalConfig = QueryBuilder.getConfig();
			QueryBuilder.setConfig(incompleteConfig as QueryBuilderConfig);
			let error;
			try {
				QueryBuilder.build({
					filters: { query: '' },
					size: 10,
					page: 1,
					requestedAggs: ['format'],
				});
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('Failed to build query object');

			// reset
			QueryBuilder.setConfig(originalConfig);
		});

		it('should add filter suffixes when required', () => {
			const originalConfig = QueryBuilder.getConfig();
			QueryBuilder.setConfig({
				...(incompleteConfig as QueryBuilderConfig),
				READABLE_TO_ELASTIC_FILTER_NAMES: {
					query: 'query',
					format: 'dcterms_format',
				},
				NEEDS_FILTER_SUFFIX: {
					format: true,
				},
			});
			const esQuery = QueryBuilder.build({
				filters: { query: '', format: MediaFormat.VIDEO },
				size: 10,
				page: 1,
				requestedAggs: ['format'],
			});
			expect(esQuery.aggs).toEqual({
				dcterms_format: { terms: { field: 'dcterms_format.filter', size: 40 } },
			});

			// reset
			QueryBuilder.setConfig(originalConfig);
		});
	});
});
