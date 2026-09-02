import { describe, expect, it } from 'vitest';
import { IeObjectSector, IeObjectType } from '../ie-objects.types';

import {
	ElasticsearchField,
	type ElasticsearchSubQuery,
	IeObjectsSearchFilterField,
	MULTI_MATCH_QUERY_MAPPING,
	Operator,
	OrderProperty,
	ReusabilityCategory,
	RightsLabel,
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
		isEvaluator: false,
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

const QUERY_FIELDS_LIMITED = MULTI_MATCH_QUERY_MAPPING.fuzzy.query.limited.find(
	(field) => !!field.multi_match
).multi_match.fields;
const QUERY_FIELDS_ALL = MULTI_MATCH_QUERY_MAPPING.fuzzy.query.all.find(
	(field) => !!field.multi_match
).multi_match.fields;

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
			const esQuery = QueryBuilder.build({ size: 10, page: 1, filters: [] }, mockInputInfo as any);
			expect(esQuery.query).toEqual({
				bool: {
					minimum_should_match: 1,
					should: [
						{
							terms: {
								_name: 'PUBLIC-METDATA_LTD',
								schema_license: ['VIAA-PUBLIEK-METADATA-LTD'],
							},
						},
						{
							terms: {
								_name: 'PUBLIC-METDATA_ALL',
								schema_license: ['VIAA-PUBLIEK-METADATA-ALL', 'VIAA-PUBLIEK-CONTENT'],
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
			const esQuery = QueryBuilder.build({ filters: [], size: 10, page: 1 }, mockInputInfo as any);

			expect(esQuery.query).toEqual({
				bool: {
					minimum_should_match: 1,
					should: [
						{
							terms: {
								_name: 'PUBLIC-METDATA_LTD',
								schema_license: ['VIAA-PUBLIEK-METADATA-LTD'],
							},
						},
						{
							terms: {
								_name: 'PUBLIC-METDATA_ALL',
								schema_license: ['VIAA-PUBLIEK-METADATA-ALL', 'VIAA-PUBLIEK-CONTENT'],
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
			).toEqual(11);
			// Only search the "limited" metadata fields
			expect(getMultiMatchFieldsForQuery(esQuery.query, true)).toEqual(QUERY_FIELDS_LIMITED);

			// All metadata needs to be searched for the keyword in the all metadata fields
			expect(
				esQuery?.query?.bool?.should?.[1]?.bool?.should?.[0]?.bool?.must?.[0]?.bool?.should
					?.length || 0
			).toEqual(11);
			// Search the "all" metadata fields
			expect(getMultiMatchFieldsForQuery(esQuery.query, false)).toEqual(QUERY_FIELDS_ALL);
		});

		it('should return an empty query when empty query filter is specified', () => {
			let error: any;
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

		it('should filter on format', () => {
			const esQuery = QueryBuilder.build(
				{
					filters: [
						{
							field: IeObjectsSearchFilterField.FORMAT,
							value: IeObjectType.VIDEO,
							operator: Operator.IS,
						},
					],
					size: 10,
					page: 1,
				},
				mockInputInfo as any
			);

			const queryString = JSON.stringify(esQuery.query, null, 2);
			expect(queryString).toContain('"dcterms_format": "video"');
			expect(queryString).toContain('METADATA-ALL-FILTERS');
			expect(queryString).toContain('PUBLIC-METDATA_ALL');
			expect(queryString).toContain('VIAA-PUBLIEK-METADATA-ALL');
			expect(queryString).toContain('VIAA-PUBLIEK-CONTENT');
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

			const queryString = JSON.stringify(esQuery.query, null, 2);
			expect(queryString).toContain('"gte": "01:00:00"');
			expect(queryString).toContain('METADATA-ALL-FILTERS');
			expect(queryString).toContain('PUBLIC-METDATA_ALL');
			expect(queryString).toContain('VIAA-PUBLIEK-METADATA-ALL');
			expect(queryString).toContain('VIAA-PUBLIEK-CONTENT');
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
			expect(getMultiMatchFieldsForQuery(queryObject?.query, true)).toEqual(QUERY_FIELDS_LIMITED);
			expect(getMultiMatchFieldsForQuery(queryObject?.query, false)).toEqual(QUERY_FIELDS_ALL);
		});

		it('throws an internal server exception when an unknown filter value is passed', () => {
			let error: any;
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
			expect(error.message).toEqual("Field 'unknown filter' is not a valid search filter field.");
		});

		it('throws an internal server exception when an unknown aggregate value is passed', () => {
			let error: any;
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

			const queryString = JSON.stringify(esQuery.query, null, 2);
			expect(queryString).toContain('"query": "intervi*"');
			// Every word of a "bevat" condition has to be in the object, not just one of them.
			// https://meemoo.atlassian.net/browse/ARC-3806
			expect(queryString).toContain('"default_operator": "AND"');
			expect(queryString).toContain('METADATA-LTD-FILTERS');
			expect(queryString).toContain('PUBLIC-METDATA_LTD');
			expect(queryString).toContain('VIAA-PUBLIEK-METADATA-ALL');
			expect(queryString).toContain('VIAA-PUBLIEK-CONTENT');
		});

		it('should add agg suffixes when required', () => {
			const esQuery = QueryBuilder.build(
				{
					filters: [
						{
							field: IeObjectsSearchFilterField.FORMAT,
							value: IeObjectType.VIDEO,
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

		it('should turn multiple selected themes into a single OR-ed terms query', () => {
			const esQuery = QueryBuilder.build(
				{
					filters: [
						{
							field: IeObjectsSearchFilterField.THEME,
							multiValue: ['education-learning', 'culture-society'],
							operator: Operator.IS,
						},
					],
					size: 10,
					page: 1,
				},
				mockInputInfo as any
			);

			const queryString = JSON.stringify(esQuery.query, null, 2);
			// A single terms query means the values are OR-ed: https://meemoo.atlassian.net/browse/ARC-3797
			expect(queryString).toContain('"theme": [');
			expect(queryString).toContain('"education-learning"');
			expect(queryString).toContain('"culture-society"');
			// Themes are in the limited metadata set, so anonymous users can filter on them too
			expect(queryString).toContain('METADATA-LTD-FILTERS');
		});

		it('should create two separate aggregations for the RIGHTS field', () => {
			const esQuery = QueryBuilder.build(
				{
					filters: [],
					size: 10,
					page: 1,
					requestedAggs: [IeObjectsSearchFilterField.RIGHTS],
				},
				mockInputInfo as any
			);
			expect(esQuery.aggs.dcterms_rights_statement.terms).toEqual({
				field: 'dcterms_rights_statement',
				size: 500,
			});
			expect(esQuery.aggs['reuse_category.id'].terms).toEqual({
				field: 'reuse_category.id',
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
			expect(getMultiMatchFieldsForQuery(queryObject?.query, true)).toEqual(QUERY_FIELDS_LIMITED);
			expect(getMultiMatchFieldsForQuery(queryObject?.query, false)).toEqual(QUERY_FIELDS_ALL);
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
			expect(getMultiMatchFieldsForQuery(queryObject?.query, true)).toEqual(QUERY_FIELDS_LIMITED);
			expect(getMultiMatchFieldsForQuery(queryObject?.query, false)).toEqual(QUERY_FIELDS_ALL);
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
			expect(JSON.stringify(queryObject)).toContain('VIAA-INTRA_CP-CONTENT');
			expect(JSON.stringify(queryObject)).toContain('schema_thumbnail_url');
		});

		it('Should filter on the accessible object sectors for a key user when consultable media is set to false', () => {
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
			const stringified = JSON.stringify(queryObject);
			// A government key user can access all object sectors, so the sector filter should be present
			expect(stringified).toContain(
				`${ElasticsearchField.schema_maintainer}.${ElasticsearchField.organization_sector}`
			);
			expect(stringified).toContain(IeObjectSector.CULTURE);
			expect(stringified).toContain(IeObjectSector.RURAL);
			// The own-organisation clause should be present because the user has an organisation
			expect(stringified).toContain('KEY_USERS_OWN_ORGANISATION_OBJECTS');
		});

		it('Should not set the own-organisation filter for a key user without an organisation', () => {
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
			const stringified = JSON.stringify(queryObject);
			// The sector filter is still applied based on the user's sector
			expect(stringified).toContain(
				`${ElasticsearchField.schema_maintainer}.${ElasticsearchField.organization_sector}`
			);
			// But the own-organisation clause should be absent because the user has no organisation
			expect(stringified).not.toContain('KEY_USERS_OWN_ORGANISATION_OBJECTS');
		});

		it('Should restrict the accessible object sectors based on the key user sector', () => {
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
						sector: IeObjectSector.REGIONAL,
						organisationId: 'OR-00000001',
					}),
					visitorSpaceInfo: {
						objectIds: [],
						visitorSpaceIds: [],
					},
				}
			);
			// A regional key user can access intra cp content of culture/government/regional objects,
			// but not of public or rural objects (those are only metadata, not consultable content)
			const stringified = JSON.stringify(queryObject);
			// Culture, Government and Regional all share the same license set (INTRA_CP_CONTENT),
			// so they are merged into one clause
			expect(stringified).toContain(IeObjectSector.CULTURE);
			expect(stringified).toContain(IeObjectSector.GOVERNMENT);
			expect(stringified).toContain(IeObjectSector.REGIONAL);
			// Public and rural objects do not expose intra cp content to a regional user,
			// so their sectors should not appear in the consultable-only query
			expect(stringified).not.toContain(IeObjectSector.PUBLIC);
			expect(stringified).not.toContain(IeObjectSector.RURAL);
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

		it('Should produce a bool/should query on dcterms_rights_statement and reuse_category when freely-reusable is selected', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 10,
					filters: [
						{
							field: IeObjectsSearchFilterField.REUSABILITY,
							operator: Operator.IS,
							multiValue: [ReusabilityCategory.FREELY_REUSABLE],
						},
					],
				},
				mockInputInfo as any
			);
			const queryString = JSON.stringify(queryObject);
			expect(queryString).toContain('"dcterms_rights_statement":');
			expect(queryString).toContain('"reuse_category.id":');
			expect(queryString).toContain('https://creativecommons.org/publicdomain/mark/1.0/');
			// Should not include URIs from other categories
			expect(queryString).not.toContain('https://rightsstatements.org/page/InC/1.0/');
		});

		it('Should apply reusability filter using dcterms rights statements and reuse_category for all 3 reusability categories', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 10,
					filters: [
						{
							field: IeObjectsSearchFilterField.REUSABILITY,
							operator: Operator.IS,
							multiValue: [
								ReusabilityCategory.FREELY_REUSABLE,
								ReusabilityCategory.REUSABLE_WITH_CONDITIONS,
								ReusabilityCategory.POSSIBLY_REUSABLE,
							],
						},
					],
				},
				mockInputInfo as any
			);
			const queryString = JSON.stringify(queryObject);
			expect(queryString).toContain('https://creativecommons.org/publicdomain/mark/1.0/');
			expect(queryString).toContain('https://rightsstatements.org/page/UND/1.0/');
			expect(queryString).toContain('REUSABILITY_DCTERMS_RIGHTS_STATEMENT_NEWSPAPERS');
			expect(queryString).toContain('REUSABILITY_REUSE_CATEGORY_AUDIO_VIDEO');
			expect(queryString).toContain('"reuse_category.id":');
		});

		it('Should apply reusability filters in the public limited metadata branch', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 10,
					filters: [
						{
							field: IeObjectsSearchFilterField.REUSABILITY,
							operator: Operator.IS,
							multiValue: [ReusabilityCategory.POSSIBLY_REUSABLE],
						},
					],
				},
				mockInputInfo as any
			);

			const publicLimitedBranch = JSON.stringify(queryObject.query.bool.should[0]);
			expect(publicLimitedBranch).toContain('PUBLIC-METDATA_LTD');
			expect(publicLimitedBranch).toContain('REUSABILITY_DCTERMS_RIGHTS_STATEMENT_NEWSPAPERS');
			expect(publicLimitedBranch).toContain('REUSABILITY_REUSE_CATEGORY_AUDIO_VIDEO');
			expect(publicLimitedBranch).toContain('"reuse_category.id":');
			expect(publicLimitedBranch).toContain('https://rightsstatements.org/page/UND/1.0/');
		});

		it('Should produce no reusability filter clause when multiValue is empty', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 10,
					filters: [
						{
							field: IeObjectsSearchFilterField.REUSABILITY,
							operator: Operator.IS,
							multiValue: [],
						},
					],
				},
				mockInputInfo as any
			);
			const queryString = JSON.stringify(queryObject);
			expect(queryString).not.toContain('dcterms_rights_statement');
		});

		it('Should apply dcterms rights statements and reuse_category for reusable-with-conditions category', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 10,
					filters: [
						{
							field: IeObjectsSearchFilterField.REUSABILITY,
							operator: Operator.IS,
							multiValue: [ReusabilityCategory.REUSABLE_WITH_CONDITIONS],
						},
					],
				},
				mockInputInfo as any
			);

			const queryString = JSON.stringify(queryObject);
			expect(queryString).toContain('REUSABILITY_DCTERMS_RIGHTS_STATEMENT_NEWSPAPERS');
			expect(queryString).toContain('REUSABILITY_REUSE_CATEGORY_AUDIO_VIDEO');
			expect(queryString).toContain('"reuse_category.id":');
			expect(queryString).toContain('https://rightsstatements.org/page/NoC-CR/1.0/');
		});

		it('Should silently ignore unknown reusability category keys', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 10,
					filters: [
						{
							field: IeObjectsSearchFilterField.REUSABILITY,
							operator: Operator.IS,
							multiValue: ['unknown-category', ReusabilityCategory.FREELY_REUSABLE],
						},
					],
				},
				mockInputInfo as any
			);
			const queryString = JSON.stringify(queryObject);
			// Known key still works
			expect(queryString).toContain('https://creativecommons.org/publicdomain/mark/1.0/');
			// Unknown key produces no URIs — no crash
			expect(queryString).not.toContain('unknown-category');
		});

		it('Should apply dcterms rights statements for selected rights labels', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 10,
					filters: [
						{
							field: IeObjectsSearchFilterField.RIGHTS,
							operator: Operator.IS,
							multiValue: [RightsLabel.PUBLIC_DOMAIN, RightsLabel.CC0],
						},
					],
				},
				mockInputInfo as any
			);
			const queryString = JSON.stringify(queryObject);
			expect(queryString).toContain('RIGHTS_DCTERMS_RIGHTS_STATEMENT_FOR_NEWSPAPERS');
			expect(queryString).toContain('RIGHTS_REUSE_CATEGORY_FOR_AUDIO_VIDEO');
			expect(queryString).toContain('"dcterms_rights_statement":');
			expect(queryString).toContain('"reuse_category.id":');
			expect(queryString).toContain('https://creativecommons.org/publicdomain/mark/1.0/');
			expect(queryString).toContain('https://creativecommons.org/publicdomain/zero/1.0/');
		});

		it('Should pass unknown rights label values through to dcterms filter', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 10,
					filters: [
						{
							field: IeObjectsSearchFilterField.RIGHTS,
							operator: Operator.IS,
							multiValue: ['unknown-rights-label'],
						},
					],
				},
				mockInputInfo as any
			);

			const queryString = JSON.stringify(queryObject);
			expect(queryString).toContain('RIGHTS_DCTERMS_RIGHTS_STATEMENT_FOR_NEWSPAPERS');
			expect(queryString).toContain('RIGHTS_REUSE_CATEGORY_FOR_AUDIO_VIDEO');
			expect(queryString).toContain('"dcterms_rights_statement":');
			expect(queryString).toContain('"reuse_category.id":');
			expect(queryString).toContain('unknown-rights-label');
		});

		it('Should place rights query under must_not when operator is isNot', () => {
			const queryObject = QueryBuilder.build(
				{
					page: 1,
					size: 10,
					filters: [
						{
							field: IeObjectsSearchFilterField.RIGHTS,
							operator: Operator.IS_NOT,
							multiValue: [RightsLabel.IN_COPYRIGHT],
						},
					],
				},
				mockInputInfo as any
			);
			const queryString = JSON.stringify(queryObject);
			expect(queryString).toContain('must_not');
			expect(queryString).toContain('"dcterms_rights_statement":');
			expect(queryString).toContain('"reuse_category.id":');
			expect(queryString).toContain('https://rightsstatements.org/page/InC/1.0/');
		});

		it('should wrap the query in a function_score with a random_score when orderProp is random', () => {
			const esQuery = QueryBuilder.build(
				{
					size: 10,
					page: 1,
					filters: [],
					orderProp: OrderProperty.RANDOM,
					orderDirection: SortDirection.asc,
				},
				mockInputInfo as any
			);

			// No explicit sort array is needed, the random_score already determines the order
			expect(esQuery.sort).toEqual({});
			expect(esQuery.query.function_score).toBeDefined();
			expect(esQuery.query.function_score.random_score.field).toEqual('_seq_no');
			// The seed is randomized, so we only assert it falls within the expected range
			// rather than asserting an exact value, to avoid flaky test failures
			expect(esQuery.query.function_score.random_score.seed).toBeGreaterThanOrEqual(0);
			expect(esQuery.query.function_score.random_score.seed).toBeLessThan(20);
			// The underlying bool query should still be present, wrapped inside the function_score
			expect(esQuery.query.function_score.query.bool).toBeDefined();
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
			const limitedMetadataFilters = queryObject.query?.bool?.should?.find(
				(filter) => filter?.bool?._name === 'METADATA-LTD-FILTERS'
			);
			const allMetadataFilters = queryObject.query?.bool?.should?.find(
				(filter) => filter?.bool?._name === 'METADATA-ALL-FILTERS'
			);
			expect(limitedMetadataFilters).toBeUndefined(); // When filtering on isConsultableMedia we should only filter on all metadata
			expect(allMetadataFilters).toBeDefined();
			const allMetadataFiltersString = JSON.stringify(allMetadataFilters, null, 2);
			expect(allMetadataFiltersString).toContain('visitor-space-id');
			expect(allMetadataFiltersString).toContain('VIAA-INTRA_CP-CONTENT');
		});
	});

	describe('or relations inside one filter (ARC-3806)', () => {
		const collectBools = (node: any, acc: any[] = []): any[] => {
			if (!node || typeof node !== 'object') {
				return acc;
			}
			if (node.bool) {
				acc.push(node.bool);
			}
			for (const value of Object.values(node)) {
				if (Array.isArray(value)) {
					for (const entry of value) {
						collectBools(entry, acc);
					}
				} else if (value && typeof value === 'object') {
					collectBools(value, acc);
				}
			}
			return acc;
		};

		const getFilterBool = (esQuery: any): any =>
			collectBools(esQuery.query).find((bool) => bool._name === 'METADATA-ALL-FILTERS');

		const build = (filters: any[]) =>
			QueryBuilder.build(
				{ filters, size: 10, page: 1, requestedAggs: [IeObjectsSearchFilterField.FORMAT] },
				mockInputInfo as any
			);

		it('or-s two values of the same filter into one should group', () => {
			const filterBool = getFilterBool(
				build([
					{ field: IeObjectsSearchFilterField.GENRE, value: 'concert', operator: Operator.IS },
					{ field: IeObjectsSearchFilterField.GENRE, value: 'dans', operator: Operator.IS },
				])
			);

			expect(filterBool.must).toHaveLength(1);
			expect(filterBool.must[0].bool.minimum_should_match).toEqual(1);
			expect(filterBool.must[0].bool.should).toHaveLength(2);
			expect(JSON.stringify(filterBool.must[0].bool.should)).toContain('concert');
			expect(JSON.stringify(filterBool.must[0].bool.should)).toContain('dans');
		});

		it('and-s values of two different filters', () => {
			const filterBool = getFilterBool(
				build([
					{ field: IeObjectsSearchFilterField.GENRE, value: 'concert', operator: Operator.IS },
					{ field: IeObjectsSearchFilterField.MEDIUM, value: 'dvd', operator: Operator.IS },
				])
			);

			expect(filterBool.must).toHaveLength(2);
			for (const clause of filterBool.must) {
				expect(clause.bool).toBeUndefined();
			}
		});

		it('or-s the conditions of one text filter into one should group', () => {
			const filterBool = getFilterBool(
				build([
					{
						field: IeObjectsSearchFilterField.CAST,
						value: 'Magriet Hermans',
						operator: Operator.CONTAINS,
					},
					{
						field: IeObjectsSearchFilterField.CAST,
						value: 'Luc Appermont',
						operator: Operator.CONTAINS,
					},
				])
			);

			expect(filterBool.must).toHaveLength(1);
			expect(filterBool.must[0].bool.minimum_should_match).toEqual(1);
			expect(filterBool.must[0].bool.should).toHaveLength(2);
		});

		it('keeps a "bevat niet" condition as an exclusion next to the or group', () => {
			const filterBool = getFilterBool(
				build([
					{
						field: IeObjectsSearchFilterField.CAST,
						value: 'Magriet Hermans',
						operator: Operator.CONTAINS,
					},
					{
						field: IeObjectsSearchFilterField.CAST,
						value: 'Luc Appermont',
						operator: Operator.CONTAINS_NOT,
					},
				])
			);

			expect(filterBool.must).toHaveLength(1);
			expect(JSON.stringify(filterBool.must)).toContain('magriet hermans');
			expect(filterBool.must_not).toHaveLength(1);
			expect(JSON.stringify(filterBool.must_not)).toContain('luc appermont');
		});

		it('keeps a between range and-ed, not or-ed', () => {
			const filterBool = getFilterBool(
				build([
					{
						field: IeObjectsSearchFilterField.CREATED,
						value: '2020-01-01',
						operator: Operator.GTE,
					},
					{
						field: IeObjectsSearchFilterField.CREATED,
						value: '2021-01-01',
						operator: Operator.LTE,
					},
				])
			);

			expect(filterBool.filter).toHaveLength(2);
			for (const clause of filterBool.filter) {
				expect(clause.range).toBeDefined();
			}
		});

		it('keeps two search bar terms and-ed', () => {
			const filterBool = getFilterBool(
				build([
					{ field: IeObjectsSearchFilterField.QUERY, value: 'kat', operator: Operator.CONTAINS },
					{ field: IeObjectsSearchFilterField.QUERY, value: 'hond', operator: Operator.CONTAINS },
				])
			);

			expect(filterBool.must).toHaveLength(2);
		});

		it('leaves a single value filter as it was', () => {
			const filterBool = getFilterBool(
				build([
					{ field: IeObjectsSearchFilterField.GENRE, value: 'concert', operator: Operator.IS },
				])
			);

			expect(filterBool.must).toHaveLength(1);
			expect(filterBool.must[0].bool).toBeUndefined();
			expect(filterBool.must[0].term['schema_genre.keyword']).toEqual('concert');
		});

		it('builds a terms query for a creator filter with several values', () => {
			const filterBool = getFilterBool(
				build([
					{
						field: IeObjectsSearchFilterField.CREATOR,
						multiValue: ['VRT', 'Amsab-ISG'],
						operator: Operator.IS,
					},
				])
			);

			expect(filterBool.must).toHaveLength(1);
			expect(filterBool.must[0].terms['schema_creator_text.keyword']).toEqual(['VRT', 'Amsab-ISG']);
		});

		it('or-s the maintainers of the FA example while and-ing them with the series', () => {
			const filterBool = getFilterBool(
				build([
					{
						field: IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME,
						multiValue: ['Reeks A', 'Reeks B'],
						operator: Operator.IS,
					},
					{
						field: IeObjectsSearchFilterField.MAINTAINER_ID,
						multiValue: ['OR-1', 'OR-2'],
						operator: Operator.IS,
					},
				])
			);

			expect(filterBool.must).toHaveLength(2);
			const asString = JSON.stringify(filterBool.must);
			expect(asString).toContain('Reeks A');
			expect(asString).toContain('Reeks B');
			expect(asString).toContain('OR-1');
			expect(asString).toContain('OR-2');
			// Each filter is one terms clause, so the values inside it are or-ed by elasticsearch
			for (const clause of filterBool.must) {
				expect(clause.terms).toBeDefined();
			}
		});
	});
});
