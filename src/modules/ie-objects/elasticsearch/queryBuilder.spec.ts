import { IeObjectSector, MediaFormat } from '../ie-objects.types';

import {
	Operator,
	OrderProperty,
	QueryBuilderConfig,
	QueryType,
	SearchFilterField,
} from './elasticsearch.consts';
import { QueryBuilder } from './queryBuilder';

import { Group } from '~modules/users/types';
import { SortDirection } from '~shared/types';

const incompleteConfig: QueryBuilderConfig = {
	MAX_NUMBER_SEARCH_RESULTS: 2000,
	MAX_COUNT_SEARCH_RESULTS: 10000,
	NUMBER_OF_FILTER_OPTIONS: 40,

	READABLE_TO_ELASTIC_FILTER_NAMES: {
		query: 'query',
		// format: 'dcterms_format', // disabled
	},

	// By default add the 'format' aggregation
	AGGS_PROPERTIES: [SearchFilterField.FORMAT],

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
	MULTI_MATCH_QUERY_MAPPING: {} as any,
} as unknown as QueryBuilderConfig;

const mockInputInfo = {
	user: {
		isKeyUser: false,
		maintainerId: '',
		sector: IeObjectSector.CULTURE,
		groupId: Group.MEEMOO_ADMIN,
	},
	visitorSpaceInfo: {
		visitorSpaceIds: [],
		objectIds: [],
	},
};

describe('QueryBuilder', () => {
	describe('build', () => {
		it('should build a valid search query', () => {
			// const query = ;
			expect(() => QueryBuilder.build(null, mockInputInfo)).toThrowError(
				'Failed to build query object'
			);
		});

		it('should return a match_all query when no filters are specified', () => {
			const esQuery = QueryBuilder.build({ size: 10, page: 1, filters: [] }, mockInputInfo);
			expect(esQuery.query).toEqual({
				bool: {
					should: [
						{ match_all: {} },
						{
							bool: {
								should: [
									{
										terms: {
											schema_license: [
												'VIAA-PUBLIEK-METADATA-LTD',
												'VIAA-PUBLIEK-METADATA-ALL',
											],
										},
									},
									{
										bool: {
											should: [
												{ terms: { maintainer: [] } },
												{
													terms: {
														schema_license: [
															'BEZOEKERTOOL-METADATA-ALL',
															'BEZOEKERTOOL-CONTENT',
														],
													},
												},
											],
											minimum_should_match: 2,
										},
									},
									{
										bool: {
											should: [
												{ ids: { values: [] } },
												{
													terms: {
														schema_license: [
															'BEZOEKERTOOL-METADATA-ALL',
															'BEZOEKERTOOL-CONTENT',
														],
													},
												},
											],
											minimum_should_match: 2,
										},
									},
								],
								minimum_should_match: 1,
							},
						},
					],
					minimum_should_match: 2,
				},
			});
			expect(esQuery.from).toEqual(0);
			expect(esQuery.size).toEqual(10);
		});

		it('should correctly convert the page to a from value', () => {
			const esQuery = QueryBuilder.build({ size: 10, page: 3, filters: [] }, mockInputInfo);
			expect(esQuery.from).toEqual(20);
			expect(esQuery.size).toEqual(10);
		});

		it('should return a match_all query when empty filters are specified', () => {
			const esQuery = QueryBuilder.build({ filters: [], size: 10, page: 1 }, mockInputInfo);

			expect(esQuery.query).toEqual({
				bool: {
					should: [
						{ match_all: {} },
						{
							bool: {
								should: [
									{
										terms: {
											schema_license: [
												'VIAA-PUBLIEK-METADATA-LTD',
												'VIAA-PUBLIEK-METADATA-ALL',
											],
										},
									},
									{
										bool: {
											should: [
												{ terms: { maintainer: [] } },
												{
													terms: {
														schema_license: [
															'BEZOEKERTOOL-METADATA-ALL',
															'BEZOEKERTOOL-CONTENT',
														],
													},
												},
											],
											minimum_should_match: 2,
										},
									},
									{
										bool: {
											should: [
												{ ids: { values: [] } },
												{
													terms: {
														schema_license: [
															'BEZOEKERTOOL-METADATA-ALL',
															'BEZOEKERTOOL-CONTENT',
														],
													},
												},
											],
											minimum_should_match: 2,
										},
									},
								],
								minimum_should_match: 1,
							},
						},
					],
					minimum_should_match: 2,
				},
			});
		});

		it('should return a search query when a query filter is specified', () => {
			const esQuery = QueryBuilder.build(
				{
					filters: [
						{
							field: SearchFilterField.QUERY,
							value: 'searchme',
							operator: Operator.CONTAINS,
						},
					],
					size: 10,
					page: 1,
				},
				mockInputInfo
			);

			expect(
				esQuery.query.bool.should[0].bool.must[0].bool.should.length
			).toBeGreaterThanOrEqual(2);
		});

		it('should return an empty query when empty query filter is specified', () => {
			let error;
			try {
				QueryBuilder.build(
					{
						filters: [
							{
								field: SearchFilterField.QUERY,
								value: '',
								operator: Operator.CONTAINS,
							},
						],
						size: 10,
						page: 1,
					},
					mockInputInfo
				);
			} catch (e) {
				error = e;
			}
			expect(error.response.error.message).toEqual(
				`Value cannot be empty when filtering on field '${SearchFilterField.QUERY}'`
			);
		});

		it('should return an advanced search query when an advancedQuery filter is specified', () => {
			const esQuery = QueryBuilder.build(
				{
					filters: [
						{
							field: SearchFilterField.ADVANCED_QUERY,
							value: 'searchme',
							operator: Operator.CONTAINS,
						},
					],
					size: 10,
					page: 1,
				},
				mockInputInfo
			);
			expect(JSON.stringify(esQuery.query)).not.toContain('schema_transcript');
		});

		it('should filter on format', () => {
			const esQuery = QueryBuilder.build(
				{
					filters: [
						{
							field: SearchFilterField.FORMAT,
							value: MediaFormat.VIDEO,
							operator: Operator.IS,
						},
					],
					size: 10,
					page: 1,
				},
				mockInputInfo
			);

			expect(esQuery.query).toEqual({
				bool: {
					should: [
						{
							bool: {
								filter: [],
								must: [{ term: { dcterms_format: 'video' } }],
							},
						},
						{
							bool: {
								should: [
									{
										terms: {
											schema_license: [
												'VIAA-PUBLIEK-METADATA-LTD',
												'VIAA-PUBLIEK-METADATA-ALL',
											],
										},
									},
									{
										bool: {
											should: [
												{ terms: { maintainer: [] } },
												{
													terms: {
														schema_license: [
															'BEZOEKERTOOL-METADATA-ALL',
															'BEZOEKERTOOL-CONTENT',
														],
													},
												},
											],
											minimum_should_match: 2,
										},
									},
									{
										bool: {
											should: [
												{ ids: { values: [] } },
												{
													terms: {
														schema_license: [
															'BEZOEKERTOOL-METADATA-ALL',
															'BEZOEKERTOOL-CONTENT',
														],
													},
												},
											],
											minimum_should_match: 2,
										},
									},
								],
								minimum_should_match: 1,
							},
						},
					],
					minimum_should_match: 2,
				},
			});
		});

		it('should use a range filter to filter on duration', () => {
			const esQuery = QueryBuilder.build(
				{
					filters: [
						{
							field: SearchFilterField.DURATION,
							value: '01:00:00',
							operator: Operator.GTE,
						},
					],
					size: 10,
					page: 1,
				},
				mockInputInfo
			);

			expect(esQuery.query).toEqual({
				bool: {
					should: [
						{
							bool: {
								filter: [
									{
										range: {
											schema_duration: { gte: '01:00:00' },
										},
									},
								],
							},
						},
						{
							bool: {
								should: [
									{
										terms: {
											schema_license: [
												'VIAA-PUBLIEK-METADATA-LTD',
												'VIAA-PUBLIEK-METADATA-ALL',
											],
										},
									},
									{
										bool: {
											should: [
												{ terms: { maintainer: [] } },
												{
													terms: {
														schema_license: [
															'BEZOEKERTOOL-METADATA-ALL',
															'BEZOEKERTOOL-CONTENT',
														],
													},
												},
											],
											minimum_should_match: 2,
										},
									},
									{
										bool: {
											should: [
												{ ids: { values: [] } },
												{
													terms: {
														schema_license: [
															'BEZOEKERTOOL-METADATA-ALL',
															'BEZOEKERTOOL-CONTENT',
														],
													},
												},
											],
											minimum_should_match: 2,
										},
									},
								],
								minimum_should_match: 1,
							},
						},
					],
					minimum_should_match: 2,
				},
			});
		});

		it('should throw an exception when using the is operator on the query field', () => {
			let error;
			try {
				QueryBuilder.build(
					{
						filters: [
							{
								field: SearchFilterField.QUERY,
								operator: Operator.IS,
								value: 'testvalue',
							},
						],
						size: 10,
						page: 1,
					},
					mockInputInfo
				);
			} catch (e) {
				error = e;
			}
			expect(error.response.error.message).toEqual(
				"An exact search is not supported for multi field: 'query'"
			);
		});

		it('throws an internal server exception when an unkown filter value is passed', () => {
			// Set incomplete config
			const originalConfig = QueryBuilder.getConfig();
			QueryBuilder.setConfig(incompleteConfig as QueryBuilderConfig);
			let error;
			try {
				QueryBuilder.build(
					{
						filters: [
							{
								field: SearchFilterField.FORMAT,
								value: null,
								operator: Operator.CONTAINS,
							},
						],
						size: 10,
						page: 1,
					},
					mockInputInfo
				);
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
			QueryBuilder.setConfig(incompleteConfig);
			let error;
			try {
				QueryBuilder.build(
					{
						filters: [],
						size: 10,
						page: 1,
						requestedAggs: [SearchFilterField.FORMAT],
					},
					mockInputInfo
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('Failed to build query object');

			// reset
			QueryBuilder.setConfig(originalConfig);
		});

		it('should add filter suffixes when required', () => {
			const esQuery = QueryBuilder.build(
				{
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
				},
				mockInputInfo
			);

			expect(esQuery.query.bool.should[0].bool.must[0]).toEqual({
				term: { 'schema_genre.keyword': 'interview' },
			});
		});

		it('should add agg suffixes when required', () => {
			const esQuery = QueryBuilder.build(
				{
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
				},
				mockInputInfo
			);
			expect(esQuery.aggs.dcterms_medium.terms).toEqual({
				field: 'dcterms_medium',
				size: 40,
			});
		});

		it('should sort on a given order property', () => {
			const orderProp = OrderProperty.NAME;
			const orderDirection = SortDirection.asc;

			const esQuery = QueryBuilder.build(
				{
					filters: [],
					size: 10,
					page: 1,
					orderProp,
					orderDirection,
				},
				mockInputInfo
			);

			const received = esQuery.sort.find((rule) => rule['schema_name.keyword']);
			const expected = { 'schema_name.keyword': { order: orderDirection } };

			expect(received).toEqual(expected);
		});
	});
});
