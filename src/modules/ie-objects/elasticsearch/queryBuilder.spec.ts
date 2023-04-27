import { buildFreeTextFilter } from '../helpers/convert-node-to-es-query-filter-objects';
import { IeObjectSector, MediaFormat } from '../ie-objects.types';

import { IeObjectsSearchFilterField, Operator, OrderProperty } from './elasticsearch.consts';
import { QueryBuilder } from './queryBuilder';
import creatorSearchQueryExact from './templates/exact/creator-search-query.json';

import { mockUser } from '~modules/ie-objects/mocks/ie-objects.mock';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupId, GroupName } from '~modules/users/types';
import { SortDirection } from '~shared/types';

const mockInputInfo = {
	user: new SessionUserEntity({
		id: '3bbfcc61-8a1e-42b5-bc28-7a29181475d0',
		fullName: 'John Doe',
		firstName: 'John',
		lastName: 'Doe',
		email: 'johndoe@gmail.com',
		acceptedTosAt: '',
		groupId: GroupId.MEEMOO_ADMIN,
		groupName: GroupName.MEEMOO_ADMIN,
		permissions: [],
		idp: null,
		isKeyUser: false,
		maintainerId: '',
		visitorSpaceSlug: 'vrt',
		sector: IeObjectSector.CULTURE,
		organisationName: 'vrt',
		organisationId: null,
		lastAccessAt: null,
		createdAt: null,
	}),
	visitorSpaceInfo: {
		visitorSpaceIds: [],
		objectIds: [],
	},
};

describe('QueryBuilder', () => {
	describe('build', () => {
		it('should build a valid search query', () => {
			// const query = ;
			expect(() => QueryBuilder.build(null, mockInputInfo as any)).toThrowError(
				'Failed to build query object'
			);
		});

		it('should return a empty filter array query when no filters are specified', () => {
			const esQuery = QueryBuilder.build(
				{ size: 10, page: 1, filters: [] },
				mockInputInfo as any
			);
			expect(esQuery.query).toEqual({
				bool: {
					should: [
						{
							bool: {
								filter: [],
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
												{
													terms: {
														'schema_maintainer.schema_identifier': [],
													},
												},
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
			const esQuery = QueryBuilder.build(
				{ size: 10, page: 3, filters: [] },
				mockInputInfo as any as any
			);
			expect(esQuery.from).toEqual(20);
			expect(esQuery.size).toEqual(10);
		});

		it('should return a empty filter array query when empty filters are specified', () => {
			const esQuery = QueryBuilder.build(
				{ filters: [], size: 10, page: 1 },
				mockInputInfo as any
			);

			expect(esQuery.query).toEqual({
				bool: {
					should: [
						{
							bool: {
								filter: [],
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
												{
													terms: {
														'schema_maintainer.schema_identifier': [],
													},
												},
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
							field: IeObjectsSearchFilterField.QUERY,
							value: 'searchme',
							operator: Operator.CONTAINS,
						},
					],
					size: 10,
					page: 1,
				},
				mockInputInfo as any
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
								field: IeObjectsSearchFilterField.QUERY,
								value: '',
								operator: Operator.CONTAINS,
							},
						],
						size: 10,
						page: 1,
					},
					mockInputInfo as any
				);
			} catch (e) {
				error = e;
			}
			expect(error.response.error.message).toEqual(
				`Value cannot be empty when filtering on field '${IeObjectsSearchFilterField.QUERY}'`
			);
		});

		it('should return an advanced search query when an advancedQuery filter is specified', () => {
			const esQuery = QueryBuilder.build(
				{
					filters: [
						{
							field: IeObjectsSearchFilterField.ADVANCED_QUERY,
							value: 'searchme',
							operator: Operator.CONTAINS,
						},
					],
					size: 10,
					page: 1,
				},
				mockInputInfo as any
			);
			expect(JSON.stringify(esQuery.query)).not.toContain('schema_transcript');
		});

		it('should filter on format', () => {
			const esQuery = QueryBuilder.build(
				{
					filters: [
						{
							field: IeObjectsSearchFilterField.FORMAT,
							value: MediaFormat.VIDEO,
							operator: Operator.IS,
						},
					],
					size: 10,
					page: 1,
				},
				mockInputInfo as any
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
												{
													terms: {
														'schema_maintainer.schema_identifier': [],
													},
												},
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
							field: IeObjectsSearchFilterField.DURATION,
							value: '01:00:00',
							operator: Operator.GTE,
						},
					],
					size: 10,
					page: 1,
				},
				mockInputInfo as any
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
												{
													terms: {
														'schema_maintainer.schema_identifier': [],
													},
												},
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

		it('should the is operator on the query field and should return an exact query object', () => {
			const queryObject = QueryBuilder.build(
				{
					filters: [
						{
							field: IeObjectsSearchFilterField.QUERY,
							operator: Operator.IS,
							value: 'testvalue',
						},
					],
					size: 10,
					page: 1,
				},
				mockInputInfo as any
			);
			expect(queryObject.query.bool.should[0].bool.must[0].bool.should).toHaveLength(8);
		});

		it('throws an internal server exception when an unknown filter value is passed', () => {
			let error;
			try {
				QueryBuilder.build(
					{
						filters: [
							{
								field: 'unknown filter' as any,
								value: null,
								operator: Operator.CONTAINS,
							},
						],
						size: 10,
						page: 1,
					},
					mockInputInfo as any
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('Failed to build query object');
		});

		it('throws an internal server exception when an unknown aggregate value is passed', () => {
			let error;
			try {
				QueryBuilder.build(
					{
						filters: [],
						size: 10,
						page: 1,
						requestedAggs: ['unknown agg' as any],
					},
					mockInputInfo as any
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('Failed to build query object');
		});

		it('should create a wildcard filter when the contains operator is used', () => {
			const esQuery = QueryBuilder.build(
				{
					filters: [
						{
							field: IeObjectsSearchFilterField.GENRE,
							value: 'intervi',
							operator: Operator.CONTAINS,
						},
					],
					size: 10,
					page: 1,
					requestedAggs: [IeObjectsSearchFilterField.FORMAT],
				},
				mockInputInfo as any
			);

			expect(esQuery.query.bool.should[0]).toEqual({
				bool: {
					filter: [
						{
							query_string: {
								default_field: 'schema_genre',
								query: 'intervi*',
							},
						},
					],
				},
			});
		});

		it('should add agg suffixes when required', () => {
			const esQuery = QueryBuilder.build(
				{
					filters: [
						{
							field: IeObjectsSearchFilterField.FORMAT,
							value: MediaFormat.VIDEO,
							operator: Operator.CONTAINS,
						},
					],
					size: 10,
					page: 1,
					requestedAggs: [IeObjectsSearchFilterField.MEDIUM],
				},
				mockInputInfo as any
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
				mockInputInfo as any
			);

			const received = esQuery.sort.find((rule) => rule['schema_name.keyword']);
			const expected = { 'schema_name.keyword': { order: orderDirection } };

			expect(received).toEqual(expected);
		});

		it('Should return a fuzzy filter object for free text search without quotes', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 39,
					orderProp: OrderProperty.RELEVANCE,
					orderDirection: SortDirection.asc,
					filters: [
						{
							field: IeObjectsSearchFilterField.QUERY,
							operator: Operator.CONTAINS,
							value: 'Wielrennen', // Does not contain quotes because we're searching for a fuzzy value
						},
					],
					requestedAggs: [
						IeObjectsSearchFilterField.FORMAT,
						IeObjectsSearchFilterField.GENRE,
						IeObjectsSearchFilterField.MEDIUM,
						IeObjectsSearchFilterField.CREATOR,
						IeObjectsSearchFilterField.LANGUAGE,
						IeObjectsSearchFilterField.MAINTAINER_ID,
					],
				},
				{
					user: new SessionUserEntity(mockUser),
					visitorSpaceInfo: {
						objectIds: [],
						visitorSpaceIds: [],
					},
				}
			);
			expect(queryObject.query.bool.should[0].bool.must[0].bool.should).toHaveLength(12);
		});

		it('Should return an exact filter object for free text search with quotes', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 39,
					orderProp: OrderProperty.RELEVANCE,
					orderDirection: SortDirection.asc,
					filters: [
						{
							field: IeObjectsSearchFilterField.QUERY,
							operator: Operator.CONTAINS,
							value: '"Wielrennen"', // Contains quotes because we're searching for an exact value
						},
					],
					requestedAggs: [
						IeObjectsSearchFilterField.FORMAT,
						IeObjectsSearchFilterField.GENRE,
						IeObjectsSearchFilterField.MEDIUM,
						IeObjectsSearchFilterField.CREATOR,
						IeObjectsSearchFilterField.LANGUAGE,
						IeObjectsSearchFilterField.MAINTAINER_ID,
					],
				},
				{
					user: new SessionUserEntity(mockUser),
					visitorSpaceInfo: {
						objectIds: [],
						visitorSpaceIds: [],
					},
				}
			);
			expect(queryObject.query.bool.should[0].bool.must[0].bool.should).toHaveLength(8);
		});

		it('Should not set a filter when consultable remote is set to true (since the value is inverted from the filter in the UI)', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 39,
					orderProp: OrderProperty.RELEVANCE,
					orderDirection: SortDirection.asc,
					filters: [
						{
							field: IeObjectsSearchFilterField.QUERY,
							operator: Operator.CONTAINS,
							value: 'Wielrennen',
						},
					],
					requestedAggs: [
						IeObjectsSearchFilterField.FORMAT,
						IeObjectsSearchFilterField.GENRE,
						IeObjectsSearchFilterField.MEDIUM,
						IeObjectsSearchFilterField.CREATOR,
						IeObjectsSearchFilterField.LANGUAGE,
						IeObjectsSearchFilterField.MAINTAINER_ID,
					],
				},
				{
					user: new SessionUserEntity(mockUser),
					visitorSpaceInfo: {
						objectIds: [],
						visitorSpaceIds: [],
					},
				}
			);
			expect(queryObject.query.bool.should[0].bool.filter).toHaveLength(0);
		});

		it('Should set a filter when consultableOnlyOnLocation is set to true', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 39,
					orderProp: OrderProperty.RELEVANCE,
					orderDirection: SortDirection.asc,
					filters: [
						{
							field: IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION,
							operator: Operator.IS,
							value: 'true',
						},
					],
					requestedAggs: [
						IeObjectsSearchFilterField.FORMAT,
						IeObjectsSearchFilterField.GENRE,
						IeObjectsSearchFilterField.MEDIUM,
						IeObjectsSearchFilterField.CREATOR,
						IeObjectsSearchFilterField.LANGUAGE,
						IeObjectsSearchFilterField.MAINTAINER_ID,
					],
				},
				{
					user: new SessionUserEntity(mockUser),
					visitorSpaceInfo: {
						objectIds: [],
						visitorSpaceIds: [],
					},
				}
			);
			expect(queryObject.query.bool.should[0].bool.filter).toHaveLength(2);
		});

		it('Should set two filter when consultableOnlyOnLocation and isConsultableMedia are set to true', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 39,
					orderProp: OrderProperty.RELEVANCE,
					orderDirection: SortDirection.asc,
					filters: [
						{
							field: IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION,
							operator: Operator.IS,
							value: 'true',
						},
						{
							field: IeObjectsSearchFilterField.CONSULTABLE_MEDIA,
							operator: Operator.IS,
							value: 'true',
						},
					],
					requestedAggs: [
						IeObjectsSearchFilterField.FORMAT,
						IeObjectsSearchFilterField.GENRE,
						IeObjectsSearchFilterField.MEDIUM,
						IeObjectsSearchFilterField.CREATOR,
						IeObjectsSearchFilterField.LANGUAGE,
						IeObjectsSearchFilterField.MAINTAINER_ID,
					],
				},
				{
					user: new SessionUserEntity({
						...mockUser,
						isKeyUser: true,
						sector: IeObjectSector.CULTURE,
					}),
					visitorSpaceInfo: {
						objectIds: [],
						visitorSpaceIds: [],
					},
				}
			);
			expect(queryObject.query.bool.should[0].bool.filter).toHaveLength(4);
		});

		it('Should generate a fuzzy search query objects based on a multi value filter', () => {
			const queryObject = buildFreeTextFilter(creatorSearchQueryExact, {
				field: IeObjectsSearchFilterField.CREATOR,
				multiValue: ['a', 'b'],
				operator: Operator.IS,
			});
			expect(queryObject.bool.should).toHaveLength(creatorSearchQueryExact.length * 2);
			expect(queryObject.bool.should[0].multi_match.query).toEqual('a');
			expect(
				queryObject.bool.should[creatorSearchQueryExact.length * 1].multi_match.query
			).toEqual('b');
		});
	});
});
