import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import jsep from 'jsep';
import { clamp, forEach, isArray, isEmpty, isNil } from 'lodash';

import { IeObjectsQueryDto, SearchFilter } from '../dto/ie-objects.dto';
import {
	buildFreeTextFilter,
	convertNodeToEsQueryFilterObjects,
} from '../helpers/convert-node-to-es-query-filter-objects';
import { encodeSearchterm } from '../helpers/encode-search-term';
import { IeObjectLicense } from '../ie-objects.types';

import {
	AGGS_PROPERTIES,
	DEFAULT_QUERY_TYPE,
	ElasticsearchField,
	type ElasticsearchSubQuery,
	FLATTENED_FIELDS,
	IE_OBJECTS_SEARCH_FILTER_FIELD_IN_METADATA_ALL,
	IE_OBJECTS_SEARCH_FILTER_FIELD_IN_METADATA_LIMITED,
	IeObjectsSearchFilterField,
	MAX_COUNT_SEARCH_RESULTS,
	MAX_NUMBER_SEARCH_RESULTS,
	MULTI_MATCH_FIELDS,
	MULTI_MATCH_QUERY_MAPPING,
	MetadataAccessType,
	NEEDS_AGG_SUFFIX,
	NEEDS_FILTER_SUFFIX,
	NUMBER_OF_FILTER_OPTIONS_DEFAULT,
	NUMBER_OF_OPTIONS_PER_AGGREGATE,
	OCCURRENCE_TYPE,
	ORDER_MAPPINGS,
	Operator,
	OrderProperty,
	type QueryBuilderInputInfo,
	QueryType,
	READABLE_TO_ELASTIC_FILTER_NAMES,
	VALUE_OPERATORS,
} from './elasticsearch.consts';

import { AND, OR, applyFilter } from '~modules/ie-objects/elasticsearch/queryBuilder.helpers';
import { GroupId, GroupName } from '~modules/users/types';
import { PaginationHelper } from '~shared/helpers/pagination';
import type { SortDirection } from '~shared/types';

(jsep as any).removeAllBinaryOps();
(jsep as any).removeAllUnaryOps();

jsep.addBinaryOp('AND', 2);
jsep.addBinaryOp('OR', 1);

jsep.addUnaryOp('NOT');

export class QueryBuilder {
	/**
	 * Convert filters, order, aggs properties (created by the ui) to elasticsearch query object
	 * @param searchRequest the search query parameters
	 * @param inputInfo
	 * @return elastic search query
	 */
	public static build(searchRequest: IeObjectsQueryDto, inputInfo: QueryBuilderInputInfo): any {
		// Check if all filter fields are known
		(searchRequest?.filters || []).find((searchFilter) => {
			if (!Object.values(IeObjectsSearchFilterField).includes(searchFilter.field)) {
				throw new BadRequestException(
					`Field '${searchFilter.field}' is not a valid search filter field.`
				);
			}
			return false;
		});
		try {
			// Build the elasticsearch query object in 2 parts
			// * search terms and filters in metadata limited fields
			// * search terms and filters in metadata all fields
			//
			// This is required because a user can only search in the fields that he is allowed to see
			// https://meemoo.atlassian.net/wiki/spaces/HA2/pages/4210786408/TA+Zoeken+via+de+zoekbalk#backend-Herwerk-elasticsearch-zoek-om-enkel-te-zoeken-op-velden-die-je-mag-zien
			const filtersMetadataLimited: SearchFilter[] = searchRequest.filters.filter((filter) =>
				IE_OBJECTS_SEARCH_FILTER_FIELD_IN_METADATA_LIMITED.includes(filter.field)
			);
			const filtersMetadataAll: SearchFilter[] = searchRequest.filters.filter((filter) =>
				IE_OBJECTS_SEARCH_FILTER_FIELD_IN_METADATA_ALL.includes(filter.field)
			);

			let queryFromMetadataLimitedFilters: ElasticsearchSubQuery | Record<string, never> | null =
				null;

			if (filtersMetadataLimited.length === filtersMetadataAll.length) {
				// If there are filters that can only be applied to the full metadata set and not to the limited metadata set
				// Then we skip searching the limited metadata set, since the result ie objects might not fully comply with all filters
				queryFromMetadataLimitedFilters = QueryBuilder.buildFilterObject(
					filtersMetadataLimited,
					inputInfo,
					MetadataAccessType.LIMITED
				);
				if (!isEmpty(queryFromMetadataLimitedFilters)) {
					queryFromMetadataLimitedFilters.bool._name = 'METADATA-LTD-FILTERS';
				}
			}

			const queryFromMetadataAllFilters: ElasticsearchSubQuery | Record<string, never> | null =
				QueryBuilder.buildFilterObject(filtersMetadataAll, inputInfo, MetadataAccessType.ALL);
			if (!isEmpty(queryFromMetadataAllFilters)) {
				queryFromMetadataAllFilters.bool._name = 'METADATA-ALL-FILTERS';
			}

			// If the filter is set to only consultable media, we only return objects with the PUBLIEK_CONTENT license
			// https://meemoo.atlassian.net/browse/ARC-3050
			const containsOnlyConsultableFilter: boolean = !!searchRequest.filters.find(
				(filter) =>
					filter.field === IeObjectsSearchFilterField.CONSULTABLE_MEDIA && filter.value === 'true'
			);

			// Build the license checks for the elastic search query in 6 parts:
			// 1) Check schema_license contains "PUBLIC-METADATA-LTD"
			// 2) Check schema_license contains "PUBLIC-METADATA-ALL" or "PUBLIC-CONTENT"
			// 3) Check if the user has visitor space access (full) and object has BEZOEKERTOOL_METADATA_ALL or BEZOEKERTOOL_CONTENT license
			// 4) Check if the user has visitor space access (folder) and object has BEZOEKERTOOL_METADATA_ALL or BEZOEKERTOOL_CONTENT license
			// 5) Check if the user is a KIOSK or CP_ADMIN user
			// 6) Check if the user is a key user and object has INTRA_CP_METADATA_ALL or INTRA_CP_CONTENT license
			const licensesFilterPublicLimited: ElasticsearchSubQuery[] =
				QueryBuilder.buildLicensesFilterPublicLimited();
			const licensesFilterPublicAll: ElasticsearchSubQuery[] =
				QueryBuilder.buildLicensesFilterPublicAll(containsOnlyConsultableFilter);
			const licensesFilterVisitorSpaceFullAccess: ElasticsearchSubQuery[] =
				QueryBuilder.buildLicensesFilterVisitorSpaceFullAccess(
					inputInfo,
					containsOnlyConsultableFilter
				);
			const licensesFilterVisitorSpaceFolderAccess: ElasticsearchSubQuery[] =
				QueryBuilder.buildLicensesFilterVisitorSpaceFolderAccess(
					inputInfo,
					containsOnlyConsultableFilter
				);
			const licensesFilterIntraCpFullAccess: ElasticsearchSubQuery[] =
				QueryBuilder.buildLicensesFilterKioskAndCpAdmin(inputInfo, containsOnlyConsultableFilter);
			const licensesFilterKeyUsers: ElasticsearchSubQuery[] =
				QueryBuilder.buildLicensesFilterKeyUsers(inputInfo, containsOnlyConsultableFilter);

			const { offset, limit } = PaginationHelper.convertPagination(
				searchRequest.page,
				searchRequest.size
			);
			// delete queryObject.default; // Side effect of importing a json file as a module

			// Avoid huge queries
			const size = Math.min(searchRequest.size, MAX_NUMBER_SEARCH_RESULTS);
			const max = Math.max(0, MAX_COUNT_SEARCH_RESULTS - limit);
			const from = clamp(offset, 0, max);

			// Specify the aggs objects with optional search terms
			const aggs = QueryBuilder.buildAggsObject(searchRequest);

			// Add sorting
			const sort = QueryBuilder.buildSortArray(
				searchRequest.orderProp,
				searchRequest.orderDirection
			);

			/**
			 * Assemble the complete query object:
			 * 	* metadata limited
			 *		* object with VIAA-PUBLIC-METADATA-LTD
			 *		* AND
			 * 		* filters in METADATA-LTD fields
			 * 	* OR
			 * 	* metadata all
			 * 		* filters in METADATA-ALL fields
			 * 		* AND
			 * 		* one of
			 * 			* object with VIAA-PUBLIC-METADATA-ALL
			 * 			* object with VIAA-PUBLIC-CONTENT
			 * 			* OR
			 * 			* visitor space full access
			 * 				* object license
			 * 				* AND
			 * 				* user access
			 * 			* OR
			 * 			* visitor space folder access
			 * 					* object license
			 * 					* AND
			 * 					* object id in folders
			 * 			* OR
			 * 			* key users
			 * 				* intra cp license
			 * 				* AND
			 * 				* organisation with correct sector
			 */
			return {
				query: OR([
					// metadata limited
					AND([queryFromMetadataLimitedFilters, ...licensesFilterPublicLimited]),
					// metadata all
					AND([
						queryFromMetadataAllFilters,
						OR([
							...licensesFilterPublicAll,
							...licensesFilterVisitorSpaceFullAccess,
							...licensesFilterVisitorSpaceFolderAccess,
							...licensesFilterIntraCpFullAccess,
							...licensesFilterKeyUsers,
						]),
					]),
				]),
				size,
				from,
				aggs,
				sort,
			};
		} catch (err) {
			throw new InternalServerErrorException('Failed to build query object', err);
		}
	}

	/**
	 * Converts a sort property and direction to an elasticsearch sort array
	 * eg:
	 *     orderProperty: 'name',
	 *     orderDirection: 'asc'
	 * is converted into:
	 *     [
	 *        {
	 *          "schema_name": {
	 *            "order": "asc"
	 *          }
	 *        },
	 *        "_score"
	 *     ]
	 * @param orderProperty
	 * @param orderDirection
	 */
	private static buildSortArray(orderProperty: OrderProperty, orderDirection: SortDirection) {
		const mappedOrderProperty = ORDER_MAPPINGS[orderProperty];
		const sortArray: any[] = [];
		if (orderProperty !== OrderProperty.RELEVANCE) {
			const sortItem = {
				[mappedOrderProperty]: {
					order: orderDirection,
				},
			};

			sortArray.push(sortItem);
		}

		// Always order by relevance if 2 search items have identical primary sort values
		sortArray.push(ORDER_MAPPINGS[OrderProperty.RELEVANCE]);

		// If all the above is identical, sort by most recent created date
		sortArray.push({
			schema_date_created: {
				order: 'desc',
				missing: '_last',
			},
		});
		return sortArray;
	}

	private static getOccurrenceType(operator: Operator): string {
		return OCCURRENCE_TYPE[operator] || 'filter';
	}

	private static buildValue(searchFilter: SearchFilter): any {
		if (VALUE_OPERATORS.includes(searchFilter.operator)) {
			return {
				[searchFilter.operator]: searchFilter.value,
			};
		}
		return searchFilter.multiValue || searchFilter.value;
	}

	private static getQueryType(searchFilter: SearchFilter, value: any): QueryType {
		const defaultQueryType = DEFAULT_QUERY_TYPE[searchFilter.field];
		if (defaultQueryType === QueryType.TERMS && !isArray(value)) {
			return QueryType.TERM;
		}
		return defaultQueryType;
	}

	private static buildFilter(
		elasticKey: string,
		searchFilter: SearchFilter
	): { occurrenceType: string; query: any } {
		if (searchFilter.field === IeObjectsSearchFilterField.CREATOR) {
			// Creator is always the full name, so we can collapse "contains" under "is" and collapse "contains_not" under "is_not"
			// https://meemoo.atlassian.net/browse/ARC-1844?focusedCommentId=58372
			return {
				occurrenceType: OCCURRENCE_TYPE[searchFilter.operator],
				query: {
					term: {
						'schema_creator_text.keyword': searchFilter.value,
					},
				},
			};
		}
		if (
			FLATTENED_FIELDS.includes(searchFilter.field) &&
			[Operator.CONTAINS, Operator.CONTAINS_NOT].includes(searchFilter.operator)
		) {
			// Publisher/Creator are a special cases since they are flattened fields
			return {
				occurrenceType: OCCURRENCE_TYPE[searchFilter.operator],
				query: {
					wildcard: {
						[elasticKey]: {
							value: `*${searchFilter.value}*`,
							case_insensitive: true,
						},
					},
				},
			};
		}

		// Contains, ContainsNot
		if (
			searchFilter.operator === Operator.CONTAINS ||
			searchFilter.operator === Operator.CONTAINS_NOT
		) {
			return {
				occurrenceType: OCCURRENCE_TYPE[searchFilter.operator],
				query: {
					query_string: {
						query: `${searchFilter.value.toLowerCase()}*`,
						default_field: elasticKey,
					},
				},
			};
		}

		// Is, IsNot

		// must, must_not, filter
		const occurrenceType = QueryBuilder.getOccurrenceType(searchFilter.operator);

		// Filter value the user typed in
		const value = QueryBuilder.buildValue(searchFilter);

		// term, terms, range, match, query_string
		const queryType: QueryType = QueryBuilder.getQueryType(searchFilter, value);

		// Append .keyword if needed
		const queryKey = elasticKey + QueryBuilder.filterSuffix(searchFilter.field);

		return {
			occurrenceType,
			query: {
				[queryType]: {
					[queryKey]: value,
				},
			},
		};
	}

	private static isBooleanSearchTerm(searchTerm: string): boolean {
		return (
			searchTerm.includes('AND') ||
			searchTerm.includes('OR') ||
			searchTerm.includes('NOT') ||
			searchTerm.includes('"') ||
			searchTerm.includes('(')
		);
	}

	/**
	 * Creates the filter portion of the elasticsearch query object
	 * Containing the search terms and the checked filters
	 * @param filters
	 * @param inputInfo
	 * @param metadataAccessType See https://meemoo.atlassian.net/wiki/spaces/HA2/pages/edit-v2/4210786408#backend-Herwerk-elasticsearch-zoek-om-enkel-te-zoeken-op-velden-die-je-mag-zien
	 */
	private static buildFilterObject(
		filters: SearchFilter[] | undefined,
		inputInfo: QueryBuilderInputInfo,
		metadataAccessType: MetadataAccessType
	): ElasticsearchSubQuery | Record<string, never> | null {
		// Add additional filters to the query object
		const filterArray: ElasticsearchSubQuery[] = [];
		const filterObject: ElasticsearchSubQuery = {
			bool: {},
		};

		// Kiosk users are only allowed to view objects from their maintainer
		if (inputInfo.user?.getGroupName() === GroupName.KIOSK_VISITOR) {
			filterArray.push({
				terms: {
					[`${ElasticsearchField.schema_maintainer}.${ElasticsearchField.schema_identifier}`]: [
						inputInfo.user?.getOrganisationId(),
					],
				},
			});
		}
		// Determine consultable filters are present and strip them from standard filter list to be processed later on
		// Remark: this needs to happen after the line that checks if filters are empty.
		// This because if we strip it before it will just return match_all
		const customSearchFilterFields: IeObjectsSearchFilterField[] = [
			IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION,
			IeObjectsSearchFilterField.CONSULTABLE_MEDIA,
			IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN,
			IeObjectsSearchFilterField.RELEASE_DATE,
		];
		let validatedFilters = filters;
		if (filters?.some((filter: SearchFilter) => customSearchFilterFields.includes(filter.field))) {
			const customFilters = QueryBuilder.determineCustomFilters(filters, inputInfo);

			// apply determined consultable filters if there are any
			for (const customFilter of customFilters) {
				applyFilter(filterObject, customFilter);
			}
			// Remove CONSULTABLE_ONLY_ON_LOCATION and CONSULTABLE_MEDIA filter entries from the filter list,
			// since they have been handled above and should not be handled by the standard field filtering logic.
			validatedFilters = filters.filter(
				(filter: SearchFilter) => !customSearchFilterFields.includes(filter.field)
			);
		}

		for (const searchFilter of validatedFilters) {
			// First, check for special 'multi match fields'. Fields like query, name and description
			// query multiple fields at once
			if (MULTI_MATCH_FIELDS.includes(searchFilter.field)) {
				if (!searchFilter.value && !searchFilter.multiValue?.length) {
					throw new BadRequestException(
						`Value cannot be empty when filtering on field '${searchFilter.field}'`
					);
				}
				if (QueryBuilder.isFuzzyOperator(searchFilter.operator)) {
					// Use a multi field search template to fuzzy search in elasticsearch across multiple fields

					let textFilters: any[];
					if (searchFilter.field === IeObjectsSearchFilterField.QUERY) {
						// We only want to parse a boolean query if it contains some boolean operators or quotes or parentheses
						if (QueryBuilder.isBooleanSearchTerm(searchFilter.value)) {
							try {
								textFilters = [
									convertNodeToEsQueryFilterObjects(
										jsep(encodeSearchterm(searchFilter.value)),
										{
											fuzzy: MULTI_MATCH_QUERY_MAPPING.fuzzy.query[metadataAccessType],
											exact: MULTI_MATCH_QUERY_MAPPING.exact.query[metadataAccessType],
										},
										searchFilter
									),
								];
							} catch (err) {
								// Search term with logical operators could not be parsed
								// Fall back to regular text search
								const searchTemplate = MULTI_MATCH_QUERY_MAPPING.fuzzy.query[metadataAccessType];
								textFilters = [buildFreeTextFilter(searchTemplate, searchFilter)];
							}
						} else {
							// If no boolean operators were found, do a simple text search using the fuzzy search term template
							const searchTemplate = MULTI_MATCH_QUERY_MAPPING.fuzzy.query[metadataAccessType];
							textFilters = [buildFreeTextFilter(searchTemplate, searchFilter)];
						}
					} else {
						const searchTemplate =
							MULTI_MATCH_QUERY_MAPPING.fuzzy[searchFilter.field][metadataAccessType];
						textFilters = [buildFreeTextFilter(searchTemplate, searchFilter)];
					}

					for (const filter of textFilters) {
						applyFilter(filterObject, {
							occurrenceType: QueryBuilder.getOccurrenceType(searchFilter.operator),
							query: filter,
						});
					}
					continue;
				}
				// Exact match
				// Use a multi field search template to exact search in elasticsearch across multiple fields
				const searchTemplate =
					MULTI_MATCH_QUERY_MAPPING.exact[searchFilter.field][metadataAccessType];

				if (!searchTemplate) {
					throw new BadRequestException(
						`An exact search is not supported for multi field: '${searchFilter.field}'`
					);
				}

				const textFilter = buildFreeTextFilter(searchTemplate, searchFilter);

				applyFilter(filterObject, {
					occurrenceType: QueryBuilder.getOccurrenceType(searchFilter.operator),
					query: textFilter,
				});
				continue;
			}
			/**
			 * query/advanced query fields are NOT allowed to be queried with the is/isNot operator
			 * name is a multi_match field, but is allowed to be queried using is/isNot operator
			 */
			if (searchFilter.field === IeObjectsSearchFilterField.QUERY) {
				throw new BadRequestException(
					`Field '${searchFilter.field}' cannot be queried with the '${searchFilter.operator}' operator.`
				);
			}

			// Map frontend filter names to elasticsearch names
			const elasticKey = READABLE_TO_ELASTIC_FILTER_NAMES[searchFilter.field];
			if (!elasticKey) {
				throw new InternalServerErrorException(
					`Failed to resolve field to the ES fieldname: ${searchFilter.field}`
				);
			}

			const advancedFilter = QueryBuilder.buildFilter(elasticKey, searchFilter);
			applyFilter(filterObject, advancedFilter);
		}

		if (filterArray.length > 0) {
			applyFilter(filterObject, {
				occurrenceType: 'filter',
				query: filterArray,
			});
		}

		if (!filterObject.bool?.must && !filterObject.bool?.must_not && !filterObject.bool?.filter) {
			return {};
		}

		return filterObject;
	}

	/**
	 *  This function checks if the isConsultableFilters are present in the searchRequestFilters and returns the correct filter objects
	 *
	 * @param searchRequestFilters
	 * @param inputInfo
	 * @returns
	 */
	public static determineCustomFilters(
		searchRequestFilters: SearchFilter[],
		inputInfo: QueryBuilderInputInfo
	): any {
		const toBeAppliedCustomFilters: any = [];

		const consultableOnlyOnLocationFilter = searchRequestFilters.find(
			(filter: SearchFilter) =>
				filter.field === IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION
		);
		const consultableMediaFilter = searchRequestFilters.find(
			(filter: SearchFilter) => filter.field === IeObjectsSearchFilterField.CONSULTABLE_MEDIA
		);
		const consultablePublicDomain = searchRequestFilters.find(
			(filter: SearchFilter) =>
				filter.field === IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN
		);
		const releaseDates = searchRequestFilters.filter(
			(filter: SearchFilter) => filter.field === IeObjectsSearchFilterField.RELEASE_DATE
		);

		// add consultable filters
		// This filter is inverted, so we only run the filter if the value is false. Don't run it if the value is undefined/null
		if (
			consultableOnlyOnLocationFilter?.value?.toLowerCase() === 'true' &&
			inputInfo.user.getGroupId() !== GroupId.KIOSK_VISITOR &&
			inputInfo?.spacesIds?.length
		) {
			toBeAppliedCustomFilters.push({
				occurrenceType: 'filter',
				query: [
					{
						terms: {
							_name: 'CONSULTABLE_ONLY_ON_LOCATION',
							[`${ElasticsearchField.schema_maintainer}.${ElasticsearchField.schema_identifier}`]:
								inputInfo?.spacesIds,
						},
					},
					{
						terms: {
							[ElasticsearchField.schema_license]: [IeObjectLicense.BEZOEKERTOOL_CONTENT],
						},
					},
				],
			});
		}

		// User can access anything in combo with
		// Object has VIAA_INTRA_CP-CONTENT license
		// ACM: user has catpro (key user)
		// ACM: sector or id the user connected to
		if (
			consultableMediaFilter?.value?.toLowerCase() === 'true' &&
			inputInfo.user.getIsKeyUser() &&
			!isNil(inputInfo.user.getSector()) &&
			!isNil(inputInfo.user.getOrganisationId())
		) {
			toBeAppliedCustomFilters.push({
				occurrenceType: 'filter',
				query: AND([
					{
						exists: {
							_name: 'CONSULTABLE_MEDIA',
							field: 'schema_thumbnail_url',
						},
					},
					OR([
						{
							terms: {
								[ElasticsearchField.schema_license]: [IeObjectLicense.PUBLIEK_CONTENT],
							},
						},
						{
							terms: {
								[ElasticsearchField.schema_license]: [IeObjectLicense.BEZOEKERTOOL_CONTENT],
							},
						},
						{
							terms: {
								[ElasticsearchField.schema_license]: [IeObjectLicense.INTRA_CP_CONTENT],
							},
						},
					]),
				]),
			});
		}

		// User can access items with license "PUBLIC_DOMAIN"
		if (consultablePublicDomain?.value?.toLowerCase() === 'true') {
			toBeAppliedCustomFilters.push({
				occurrenceType: 'filter',
				query: [
					{
						terms: {
							_name: 'CONSULTABLE_PUBLIC_DOMAIN',
							[ElasticsearchField.schema_license]: [IeObjectLicense.PUBLIC_DOMAIN],
						},
					},
				],
			});
		}

		if (releaseDates.length) {
			const dateFilters = releaseDates.map(QueryBuilder.buildValue);
			/**
			 * Convert array to single object
			 * ```
			 * [
			 *   { gte: '2021-11-25T23:00:00.000Z' },
			 *   { lte: '2021-11-27T23:00:00.000Z' }
			 * ]
			 * ```
			 * to
			 * ```
			 * {
			 *   gte: '2021-11-25T23:00:00.000Z',
			 *   lte: '2021-11-27T23:00:00.000Z'
			 * }
			 * ```
			 */
			const singleObjectDateFilter = Object.fromEntries(
				dateFilters.flatMap((dateFilter) => Object.entries(dateFilter))
			);
			toBeAppliedCustomFilters.push({
				occurrenceType: 'filter',
				query: [
					OR([
						{
							range: {
								[ElasticsearchField.schema_date_created]: singleObjectDateFilter,
							},
						},
						{
							range: {
								[ElasticsearchField.schema_date_published]: singleObjectDateFilter,
							},
						},
					]),
				],
			});
		}

		// Return empty object if no consultable filter matches the requirements
		return toBeAppliedCustomFilters;
	}

	/**
	 * 1) Check schema_license contains "PUBLIC-METADATA-LTD"
	 * @private
	 */
	private static buildLicensesFilterPublicLimited(): ElasticsearchSubQuery[] {
		return [
			{
				terms: {
					_name: 'PUBLIC-METDATA_LTD',
					[ElasticsearchField.schema_license]: [IeObjectLicense.PUBLIEK_METADATA_LTD],
				},
			},
		];
	}

	/**
	 * 2) Check schema_license contains PUBLIC-METADATA-ALL"
	 * @private
	 */
	private static buildLicensesFilterPublicAll(
		containsOnlyConsultableFilter: boolean
	): ElasticsearchSubQuery[] {
		return [
			{
				terms: {
					_name: 'PUBLIC-METDATA_ALL',
					// If the filter is set to only consultable media, we only return objects with the PUBLIEK_CONTENT license
					// https://meemoo.atlassian.net/browse/ARC-3050
					[ElasticsearchField.schema_license]: containsOnlyConsultableFilter
						? [IeObjectLicense.PUBLIEK_CONTENT]
						: [
								IeObjectLicense.PUBLIEK_METADATA_ALL,
								IeObjectLicense.PUBLIEK_CONTENT, // Does this license contain PUBLIEK_METADATA_ALL?
							],
				},
			},
		];
	}

	/**
	 * 3) Check or-id is part of visitorSpaceIds
	 * Remark: ES does not allow maintainer and schema license to be both under 1 terms object
	 * @param inputInfo
	 * @param containsOnlyConsultableFilter
	 * @private
	 */
	private static buildLicensesFilterVisitorSpaceFullAccess(
		inputInfo: QueryBuilderInputInfo,
		containsOnlyConsultableFilter: boolean
	): ElasticsearchSubQuery[] {
		const { visitorSpaceInfo } = inputInfo;

		if (!visitorSpaceInfo.visitorSpaceIds?.length) {
			return [];
		}

		return [
			AND([
				{
					terms: {
						_name: 'BEZOEKERTOOL_METADATA_ALL',
						[`${ElasticsearchField.schema_maintainer}.${ElasticsearchField.schema_identifier}`]:
							visitorSpaceInfo.visitorSpaceIds,
					},
				},
				{
					terms: {
						// If the filter is set to only consultable media, we only return objects with the PUBLIEK_CONTENT license
						// https://meemoo.atlassian.net/browse/ARC-3050
						[ElasticsearchField.schema_license]: containsOnlyConsultableFilter
							? [IeObjectLicense.BEZOEKERTOOL_CONTENT]
							: [IeObjectLicense.BEZOEKERTOOL_METADATA_ALL, IeObjectLicense.BEZOEKERTOOL_CONTENT],
					},
				},
			]),
		];
	}

	/**
	 * 4) Check object id is part of folderObjectIds
	 * Remark: ES does not allow ids and should be added under bool should
	 * @param inputInfo
	 * @param containsOnlyConsultableFilter
	 * @private
	 */
	private static buildLicensesFilterVisitorSpaceFolderAccess(
		inputInfo: QueryBuilderInputInfo,
		containsOnlyConsultableFilter: boolean
	): ElasticsearchSubQuery[] {
		const { visitorSpaceInfo } = inputInfo;

		if (!visitorSpaceInfo.objectIds?.length) {
			// The user does not have access to any visitor space folders
			return [];
		}

		return [
			AND([
				{
					terms: {
						_name: 'BEZOEKERTOOL_FOLDER_ACCESS',
						// If the filter is set to only consultable media, we only return objects with the PUBLIEK_CONTENT license
						// https://meemoo.atlassian.net/browse/ARC-3050
						[ElasticsearchField.schema_license]: containsOnlyConsultableFilter
							? [IeObjectLicense.BEZOEKERTOOL_CONTENT]
							: [IeObjectLicense.BEZOEKERTOOL_METADATA_ALL, IeObjectLicense.BEZOEKERTOOL_CONTENT],
					},
				},
				{
					ids: {
						values: visitorSpaceInfo.objectIds,
					},
				},
			]),
		];
	}

	/**
	 * 5) KIOSK users and CP_ADMINs always have access to the visitor space that they are linked to.
	 * @param inputInfo
	 * @param containsOnlyConsultableFilter
	 * @private
	 */
	private static buildLicensesFilterKioskAndCpAdmin(
		inputInfo: QueryBuilderInputInfo,
		containsOnlyConsultableFilter: boolean
	): ElasticsearchSubQuery[] {
		const { user } = inputInfo;

		if (
			[GroupName.CP_ADMIN, GroupName.KIOSK_VISITOR].includes(user?.getGroupName()) &&
			user?.getOrganisationId()
		) {
			return [
				AND([
					{
						terms: {
							_name: 'KIOSK_OR_CP_ADMIN',
							[`${ElasticsearchField.schema_maintainer}.${ElasticsearchField.schema_identifier}`]:
								isNil(user?.getOrganisationId()) ? [] : [user?.getOrganisationId()],
						},
					},
					{
						terms: {
							// If the filter is set to only consultable media, we only return objects with the PUBLIEK_CONTENT license
							// https://meemoo.atlassian.net/browse/ARC-3050
							[ElasticsearchField.schema_license]: containsOnlyConsultableFilter
								? [IeObjectLicense.BEZOEKERTOOL_CONTENT]
								: [IeObjectLicense.BEZOEKERTOOL_METADATA_ALL, IeObjectLicense.BEZOEKERTOOL_CONTENT],
						},
					},
				]),
			];
		}
		return [];
	}

	/**
	 * 6) Check that the user is a key user (intra cp) and what sector he belongs to and
	 * that the object has the INTRA CP license
	 * @param inputInfo
	 * @param containsOnlyConsultableFilter
	 * @private
	 */
	private static buildLicensesFilterKeyUsers(
		inputInfo: QueryBuilderInputInfo,
		containsOnlyConsultableFilter: boolean
	): ElasticsearchSubQuery[] {
		const { user } = inputInfo;

		if (user?.getIsKeyUser() && !isNil(user?.getSector())) {
			const subQueries: ElasticsearchSubQuery[] = [
				// 6.1) Check if object is part of organisation with favorable sector
				{
					terms: {
						[ElasticsearchField.schema_license]: containsOnlyConsultableFilter
							? [IeObjectLicense.INTRA_CP_CONTENT]
							: [IeObjectLicense.INTRA_CP_METADATA_ALL, IeObjectLicense.INTRA_CP_CONTENT],
					},
				},
			];
			if (user?.getOrganisationId()) {
				subQueries.push(
					// 6.2) Check if object is part of own organisation
					{
						bool: {
							_name: 'INTRA_CP_USERS',
							minimum_should_match: 2,
							should: [
								{
									terms: {
										[`${ElasticsearchField.schema_maintainer}.${ElasticsearchField.schema_identifier}`]:
											[user?.getOrganisationId()],
									},
								},
								{
									terms: {
										// If the filter is set to only consultable media, we only return objects with the PUBLIEK_CONTENT license
										// https://meemoo.atlassian.net/browse/ARC-3050
										[ElasticsearchField.schema_license]: containsOnlyConsultableFilter
											? [IeObjectLicense.INTRA_CP_CONTENT]
											: [IeObjectLicense.INTRA_CP_METADATA_ALL, IeObjectLicense.INTRA_CP_CONTENT],
									},
								},
							],
						},
					}
				);
			}
			return subQueries;
		}
		return [];
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
	private static buildAggsObject(searchRequest: IeObjectsQueryDto): any {
		const aggs: any = {};
		forEach(searchRequest.requestedAggs || AGGS_PROPERTIES, (aggProperty) => {
			const elasticProperty =
				READABLE_TO_ELASTIC_FILTER_NAMES[aggProperty as IeObjectsSearchFilterField];
			if (!elasticProperty) {
				throw new InternalServerErrorException(`Failed to resolve agg property: ${aggProperty}`);
			}

			aggs[elasticProperty] = {
				terms: {
					field: elasticProperty + QueryBuilder.aggSuffix(aggProperty),
					size:
						NUMBER_OF_OPTIONS_PER_AGGREGATE[aggProperty as IeObjectsSearchFilterField] ??
						NUMBER_OF_FILTER_OPTIONS_DEFAULT,
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
	private static filterSuffix(prop: IeObjectsSearchFilterField): string {
		return NEEDS_FILTER_SUFFIX[prop] ? `.${NEEDS_FILTER_SUFFIX[prop]}` : '';
	}

	/**
	 * Some properties in elasticsearch need a ".keyword" or other suffix to work correctly
	 * This helper function makes it easier to get a suffix if one is required
	 * eg:
	 * "dcterms_medium.keyword": {
	 *   "terms": {
	 *     "field": "dcterms_medium.keyword"
	 *   }
	 * },
	 * @param prop
	 */
	private static aggSuffix(prop: IeObjectsSearchFilterField): `.keyword` | '' {
		return NEEDS_AGG_SUFFIX[prop] ? `.${NEEDS_AGG_SUFFIX[prop]}` : '';
	}

	public static isFuzzyOperator(operator: Operator): boolean {
		return [Operator.CONTAINS, Operator.CONTAINS_NOT].includes(operator);
	}
}
