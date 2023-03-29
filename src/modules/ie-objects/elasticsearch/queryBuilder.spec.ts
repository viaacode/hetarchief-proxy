import { IeObjectSector, MediaFormat } from '../ie-objects.types';

import { Operator, OrderProperty, SearchFilterField } from './elasticsearch.consts';
import { QueryBuilder } from './queryBuilder';

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

		it('should return a match_all query when no filters are specified', () => {
			const esQuery = QueryBuilder.build(
				{ size: 10, page: 1, filters: [] },
				mockInputInfo as any
			);
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

		it('should return a match_all query when empty filters are specified', () => {
			const esQuery = QueryBuilder.build(
				{ filters: [], size: 10, page: 1 },
				mockInputInfo as any
			);

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
							field: SearchFilterField.QUERY,
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
								field: SearchFilterField.QUERY,
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
				mockInputInfo as any
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
							field: SearchFilterField.DURATION,
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
					mockInputInfo as any
				);
			} catch (e) {
				error = e;
			}
			expect(error.response.error.message).toEqual(
				"An exact search is not supported for multi field: 'query'"
			);
		});

		it('throws an internal server exception when an unkown filter value is passed', () => {
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
							field: SearchFilterField.GENRE,
							value: 'intervi',
							operator: Operator.CONTAINS,
						},
					],
					size: 10,
					page: 1,
					requestedAggs: [SearchFilterField.FORMAT],
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
							field: SearchFilterField.FORMAT,
							value: MediaFormat.VIDEO,
							operator: Operator.CONTAINS,
						},
					],
					size: 10,
					page: 1,
					requestedAggs: [SearchFilterField.MEDIUM],
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
	});
});
