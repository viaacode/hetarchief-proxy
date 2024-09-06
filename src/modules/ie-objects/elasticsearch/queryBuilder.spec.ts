import { IeObjectSector, MediaFormat } from '../ie-objects.types';

import {
	ElasticsearchField,
	type ElasticsearchSubQuery,
	IeObjectsSearchFilterField,
	MULTI_MATCH_QUERY_MAPPING,
	Operator,
	OrderProperty,
} from './elasticsearch.consts';
import { QueryBuilder } from './queryBuilder';

import { mockUser } from '~modules/ie-objects/mocks/ie-objects.mock';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupId, GroupName } from '~modules/users/types';
import { SortDirection } from '~shared/types';
import { Locale } from '~shared/types/types';

const mockInputInfo = {
	user: new SessionUserEntity({
		id: '3bbfcc61-8a1e-42b5-bc28-7a29181475d0',
		fullName: 'John Doe',
		firstName: 'John',
		lastName: 'Doe',
		email: 'johndoe@gmail.com',
		language: Locale.Nl,
		acceptedTosAt: '',
		groupId: GroupId.MEEMOO_ADMIN,
		groupName: GroupName.MEEMOO_ADMIN,
		permissions: [],
		idp: null,
		isKeyUser: false,
		sector: IeObjectSector.CULTURE,
		organisationId: null,
		organisationName: 'vrt',
		visitorSpaceSlug: 'vrt',
		lastAccessAt: null,
		createdAt: null,
	}),
	visitorSpaceInfo: {
		visitorSpaceIds: [],
		objectIds: [],
	},
};

const QUERY_FIELDS_LIMITED =
	MULTI_MATCH_QUERY_MAPPING.fuzzy.query.limited.at(-1).multi_match.fields;
const QUERY_FIELDS_ALL = MULTI_MATCH_QUERY_MAPPING.fuzzy.query.all.at(-1).multi_match.fields;

function getMultiMatchFieldsForQuery(
	query: ElasticsearchSubQuery,
	limitedMetadata: boolean
): string[] {
	return query?.bool?.should?.[limitedMetadata ? 0 : 1]?.bool?.should?.[0]?.bool?.must?.[0]?.bool
		?.should[6]?.multi_match?.fields;
}

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
					minimum_should_match: 1,
					should: [
						{
							terms: {
								schema_license: ['VIAA-PUBLIEK-METADATA-LTD'],
							},
						},
						{
							terms: {
								schema_license: [
									'VIAA-PUBLIEK-METADATA-ALL',
									'VIAA-PUBLIEK-CONTENT',
								],
							},
						},
					],
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
					minimum_should_match: 1,
					should: [
						{
							terms: {
								schema_license: ['VIAA-PUBLIEK-METADATA-LTD'],
							},
						},
						{
							terms: {
								schema_license: [
									'VIAA-PUBLIEK-METADATA-ALL',
									'VIAA-PUBLIEK-CONTENT',
								],
							},
						},
					],
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

			// Limited metadata needs to be searched for the keyword in the limited metadata fields
			expect(
				esQuery?.query?.bool?.should?.[0]?.bool?.should?.[0]?.bool?.must?.[0]?.bool?.should
					?.length || 0
			).toEqual(7);
			// Only search the "limited" metadata fields
			expect(getMultiMatchFieldsForQuery(esQuery.query, true)).toEqual(QUERY_FIELDS_LIMITED);

			// All metadata needs to be searched for the keyword in the all metadata fields
			expect(
				esQuery?.query?.bool?.should?.[1]?.bool?.should?.[0]?.bool?.must?.[0]?.bool?.should
					?.length || 0
			).toEqual(7);
			// Search the "all" metadata fields
			expect(getMultiMatchFieldsForQuery(esQuery.query, false)).toEqual(QUERY_FIELDS_ALL);
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
			expect(error?.response?.message).toEqual('Failed to build query object');
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
			const queryJson = JSON.stringify(esQuery.query);
			expect(queryJson).toContain(ElasticsearchField.schema_name);
			expect(queryJson).toContain(
				ElasticsearchField.schema_is_part_of + '.' + ElasticsearchField.newspaper
			);
			expect(queryJson).toContain(ElasticsearchField.schema_transcript);
			expect(queryJson).toContain(ElasticsearchField.schema_mentions);
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
					minimum_should_match: 1,
					should: [
						{
							bool: {
								minimum_should_match: 2,
								should: [
									{
										bool: {
											must: [
												{
													term: {
														dcterms_format: 'video',
													},
												},
											],
										},
									},
									{
										terms: {
											schema_license: ['VIAA-PUBLIEK-METADATA-LTD'],
										},
									},
								],
							},
						},
						{
							bool: {
								minimum_should_match: 2,
								should: [
									{
										bool: {
											must: [
												{
													term: {
														dcterms_format: 'video',
													},
												},
											],
										},
									},
									{
										terms: {
											schema_license: [
												'VIAA-PUBLIEK-METADATA-ALL',
												'VIAA-PUBLIEK-CONTENT',
											],
										},
									},
								],
							},
						},
					],
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
					minimum_should_match: 1,
					should: [
						{
							bool: {
								minimum_should_match: 2,
								should: [
									{
										bool: {
											filter: [
												{
													range: {
														schema_duration: {
															gte: '01:00:00',
														},
													},
												},
											],
										},
									},
									{
										terms: {
											schema_license: ['VIAA-PUBLIEK-METADATA-LTD'],
										},
									},
								],
							},
						},
						{
							bool: {
								minimum_should_match: 2,
								should: [
									{
										bool: {
											filter: [
												{
													range: {
														schema_duration: {
															gte: '01:00:00',
														},
													},
												},
											],
										},
									},
									{
										terms: {
											schema_license: [
												'VIAA-PUBLIEK-METADATA-ALL',
												'VIAA-PUBLIEK-CONTENT',
											],
										},
									},
								],
							},
						},
					],
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
			expect(getMultiMatchFieldsForQuery(queryObject?.query, true)).toEqual(
				QUERY_FIELDS_LIMITED
			);
			expect(getMultiMatchFieldsForQuery(queryObject?.query, false)).toEqual(
				QUERY_FIELDS_ALL
			);
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
			expect(error.message).toEqual(
				"Field 'unknown filter' is not a valid search filter field."
			);
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

			// TODO performance: we can check if the bool.should[0] === bool.should[1] while omitting the schema_license array
			// TODO If they are equal, we can combine them into one object, which should search more efficiently
			expect(esQuery.query).toEqual({
				bool: {
					minimum_should_match: 1,
					should: [
						{
							bool: {
								minimum_should_match: 2,
								should: [
									{
										bool: {
											must: [
												{
													query_string: {
														query: 'intervi*',
														default_field: 'schema_genre',
													},
												},
											],
										},
									},
									{
										terms: {
											schema_license: ['VIAA-PUBLIEK-METADATA-LTD'],
										},
									},
								],
							},
						},
						{
							bool: {
								minimum_should_match: 2,
								should: [
									{
										bool: {
											must: [
												{
													query_string: {
														query: 'intervi*',
														default_field: 'schema_genre',
													},
												},
											],
										},
									},
									{
										terms: {
											schema_license: [
												'VIAA-PUBLIEK-METADATA-ALL',
												'VIAA-PUBLIEK-CONTENT',
											],
										},
									},
								],
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
				size: 500,
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
			expect(getMultiMatchFieldsForQuery(queryObject?.query, true)).toEqual(
				QUERY_FIELDS_LIMITED
			);
			expect(getMultiMatchFieldsForQuery(queryObject?.query, false)).toEqual(
				QUERY_FIELDS_ALL
			);
			// Disabled matchbox filters for lemma split words
			// https://meemoo.atlassian.net/browse/ARC-2405
			// expect(queryObject.query.bool.should[0].bool.must[0].bool.should).toHaveLength(12);
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
			expect(getMultiMatchFieldsForQuery(queryObject?.query, true)).toEqual(
				QUERY_FIELDS_LIMITED
			);
			expect(getMultiMatchFieldsForQuery(queryObject?.query, false)).toEqual(
				QUERY_FIELDS_ALL
			);
		});

		it('Should set a filter when consultable media is set to true', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 39,
					orderProp: OrderProperty.RELEVANCE,
					orderDirection: SortDirection.asc,
					filters: [
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
						IeObjectsSearchFilterField.LANGUAGE,
						IeObjectsSearchFilterField.MAINTAINER_ID,
					],
				},
				{
					user: new SessionUserEntity({
						...mockUser,
						isKeyUser: true,
						sector: IeObjectSector.GOVERNMENT,
						organisationId: 'OR-00000001',
					}),
					visitorSpaceInfo: {
						objectIds: [],
						visitorSpaceIds: [],
					},
				}
			);
			expect(JSON.stringify(queryObject)).toContain('schema_maintainer.organization_type');
		});

		it('Should not set a filter when consultable media is set to false', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 39,
					orderProp: OrderProperty.RELEVANCE,
					orderDirection: SortDirection.asc,
					filters: [
						{
							field: IeObjectsSearchFilterField.CONSULTABLE_MEDIA,
							operator: Operator.IS,
							value: 'false',
						},
					],
					requestedAggs: [
						IeObjectsSearchFilterField.FORMAT,
						IeObjectsSearchFilterField.GENRE,
						IeObjectsSearchFilterField.MEDIUM,
						IeObjectsSearchFilterField.LANGUAGE,
						IeObjectsSearchFilterField.MAINTAINER_ID,
					],
				},
				{
					user: new SessionUserEntity({
						...mockUser,
						isKeyUser: true,
						sector: IeObjectSector.GOVERNMENT,
						organisationId: 'OR-00000001',
					}),
					visitorSpaceInfo: {
						objectIds: [],
						visitorSpaceIds: [],
					},
				}
			);
			expect(JSON.stringify(queryObject)).not.toContain(
				'schema_maintainer.organization_type'
			);
		});

		it('Should not set a filter when consultable media is set to true, but the user does not have an organisation', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 39,
					orderProp: OrderProperty.RELEVANCE,
					orderDirection: SortDirection.asc,
					filters: [
						{
							field: IeObjectsSearchFilterField.CONSULTABLE_MEDIA,
							operator: Operator.IS,
							value: 'false',
						},
					],
					requestedAggs: [
						IeObjectsSearchFilterField.FORMAT,
						IeObjectsSearchFilterField.GENRE,
						IeObjectsSearchFilterField.MEDIUM,
						IeObjectsSearchFilterField.LANGUAGE,
						IeObjectsSearchFilterField.MAINTAINER_ID,
					],
				},
				{
					user: new SessionUserEntity({
						...mockUser,
						isKeyUser: true,
						sector: IeObjectSector.GOVERNMENT,
						organisationId: null,
					}),
					visitorSpaceInfo: {
						objectIds: [],
						visitorSpaceIds: [],
					},
				}
			);
			expect(JSON.stringify(queryObject)).not.toContain(
				'schema_maintainer.organization_type'
			);
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
						IeObjectsSearchFilterField.LANGUAGE,
						IeObjectsSearchFilterField.MAINTAINER_ID,
					],
				},
				{
					user: new SessionUserEntity({
						...mockUser,
						isKeyUser: true,
						sector: IeObjectSector.GOVERNMENT,
						organisationId: 'OR-00000001',
					}),
					visitorSpaceInfo: {
						objectIds: [],
						visitorSpaceIds: [],
					},
					spacesIds: ['visitor-space-id'],
				}
			);
			// One part is the filter and the other is the license checks
			expect(queryObject?.query?.bool?.should).toHaveLength(2);

			// The filter part should also filter on visitor space
			expect(JSON.stringify(queryObject?.query?.bool?.should?.[0]?.bool, null, 2)).toContain(
				'visitor-space-id'
			);
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
						IeObjectsSearchFilterField.LANGUAGE,
						IeObjectsSearchFilterField.MAINTAINER_ID,
					],
				},
				{
					user: new SessionUserEntity({
						...mockUser,
						isKeyUser: true,
						sector: IeObjectSector.GOVERNMENT,
						organisationId: 'OR-00000001',
					}),
					visitorSpaceInfo: {
						objectIds: [],
						visitorSpaceIds: [],
					},
					spacesIds: ['visitor-space-id'],
				}
			);
			expect(queryObject.query?.bool?.should).toHaveLength(2);
			const limitedMetadataFilters = JSON.stringify(
				queryObject.query?.bool?.should?.[0]?.bool,
				null,
				2
			);
			const allMetadataFilters = JSON.stringify(
				queryObject.query?.bool?.should?.[1]?.bool,
				null,
				2
			);
			expect(limitedMetadataFilters).toContain('visitor-space-id');
			expect(limitedMetadataFilters).toContain('OR-00000001');
			expect(allMetadataFilters).toContain('visitor-space-id');
			expect(allMetadataFilters).toContain('OR-00000001');
		});
	});
});
