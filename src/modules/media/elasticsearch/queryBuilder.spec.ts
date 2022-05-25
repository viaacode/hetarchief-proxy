import {
	MediaFormat,
	Operator,
	OrderProperty,
	QueryBuilderConfig,
	SearchFilterField,
} from '../media.types';

import { QueryType } from './consts';
import { QueryBuilder } from './queryBuilder';

import { SortDirection } from '~shared/types';

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
		genre: 'keyword',
		// no format property
	},
	DEFAULT_QUERY_TYPE: {
		format: QueryType.TERMS,
		duration: QueryType.RANGE,
	},
	MULTI_MATCH_FIELDS: [
		SearchFilterField.QUERY,
		SearchFilterField.ADVANCED_QUERY,
		SearchFilterField.NAME,
		SearchFilterField.DESCRIPTION,
	],
	MULTI_MATCH_QUERY_MAPPING: {},
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
			const esQuery = QueryBuilder.build({ filters: [], size: 10, page: 1 });
			expect(esQuery.query).toEqual({ match_all: {} });
		});

		it('should return a search query when a query filter is specified', () => {
			const esQuery = QueryBuilder.build({
				filters: [
					{
						field: SearchFilterField.QUERY,
						value: 'searchme',
						operator: Operator.CONTAINS,
					},
				],
				size: 10,
				page: 1,
			});
			expect(esQuery.query.bool.must.length).toBeGreaterThanOrEqual(2);
		});

		it('should return an empty query when empty query filter is specified', () => {
			let error;
			try {
				QueryBuilder.build({
					filters: [
						{
							field: SearchFilterField.QUERY,
							value: '',
							operator: Operator.CONTAINS,
						},
					],
					size: 10,
					page: 1,
				});
			} catch (e) {
				error = e;
			}
			expect(error.response.error.message).toEqual(
				`Value cannot be empty when filtering on field '${SearchFilterField.QUERY}'`
			);
		});

		it('should return an advanced search query when an advancedQuery filter is specified', () => {
			const esQuery = QueryBuilder.build({
				filters: [
					{
						field: SearchFilterField.ADVANCED_QUERY,
						value: 'searchme',
						operator: Operator.CONTAINS,
					},
				],
				size: 10,
				page: 1,
			});
			expect(esQuery.query.bool.must[0].multi_match.fields).not.toContain(
				'schema_transcript'
			);
		});

		it('should filter on format', () => {
			const esQuery = QueryBuilder.build({
				filters: [
					{
						field: SearchFilterField.FORMAT,
						value: MediaFormat.VIDEO,
						operator: Operator.IS,
					},
				],
				size: 10,
				page: 1,
			});

			expect(esQuery.query).toEqual({
				bool: {
					filter: [],
					must: [
						{
							term: {
								dcterms_format: 'video',
							},
						},
					],
				},
			});
		});

		it('should use a range filter to filter on duration', () => {
			const rangeQuery = { gte: '01:00:00' };
			const esQuery = QueryBuilder.build({
				filters: [
					{
						field: SearchFilterField.DURATION,
						value: '01:00:00',
						operator: Operator.GTE,
					},
				],
				size: 10,
				page: 1,
			});

			expect(esQuery.query).toEqual({
				bool: {
					filter: [{ range: { schema_duration: rangeQuery } }],
				},
			});
		});

		it('should throw an exception when using the is operator on the query field', () => {
			let error;
			try {
				QueryBuilder.build({
					filters: [
						{
							field: SearchFilterField.QUERY,
							operator: Operator.IS,
							value: 'testvalue',
						},
					],
					size: 10,
					page: 1,
				});
			} catch (e) {
				error = e;
			}
			expect(error.response.error.message).toEqual(
				"Field 'query' cannot be queried with the 'is' operator."
			);
		});

		it('throws an internal server exception when an unkown filter value is passed', () => {
			// Set incomplete config
			const originalConfig = QueryBuilder.getConfig();
			QueryBuilder.setConfig(incompleteConfig as QueryBuilderConfig);
			let error;
			try {
				QueryBuilder.build({
					filters: [
						{
							field: SearchFilterField.FORMAT,
							value: null,
							operator: Operator.CONTAINS,
						},
					],
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
					filters: [],
					size: 10,
					page: 1,
					requestedAggs: [SearchFilterField.FORMAT],
				});
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('Failed to build query object');

			// reset
			QueryBuilder.setConfig(originalConfig);
		});

		it('should add filter suffixes when required', () => {
			const esQuery = QueryBuilder.build({
				filters: [
					{
						field: SearchFilterField.GENRE,
						value: 'interview',
						operator: Operator.CONTAINS,
					},
				],
				size: 10,
				page: 1,
				requestedAggs: [SearchFilterField.FORMAT],
			});
			expect(esQuery.query.bool.must[0]).toEqual({
				term: { 'schema_genre.keyword': 'interview' },
			});
		});

		it('should add agg suffixes when required', () => {
			const esQuery = QueryBuilder.build({
				filters: [
					{
						field: SearchFilterField.FORMAT,
						value: MediaFormat.VIDEO,
						operator: Operator.CONTAINS,
					},
				],
				size: 10,
				page: 1,
				requestedAggs: [SearchFilterField.MEDIUM],
			});
			expect(esQuery.aggs.dcterms_medium.terms).toEqual({
				field: 'dcterms_medium.keyword',
				size: 40,
			});
		});

		it('should sort on a given order property', () => {
			const esQuery = QueryBuilder.build({
				filters: [],
				size: 10,
				page: 1,
				orderProp: OrderProperty.NAME,
				orderDirection: SortDirection.asc,
			});
			expect(esQuery.sort).toEqual([{ 'schema_name.keyword': { order: 'asc' } }, '_score']);
		});
	});
});
