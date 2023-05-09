import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import jsep from 'jsep';
import { clamp, forEach, isArray, isNil, set } from 'lodash';

import { IeObjectsQueryDto, SearchFilter } from '../dto/ie-objects.dto';
import {
	buildFreeTextFilter,
	convertNodeToEsQueryFilterObjects,
} from '../helpers/convert-node-to-es-query-filter-objects';
import { encodeSearchterm } from '../helpers/encode-search-term';
import { getSectorsWithEssenceAccess } from '../helpers/get-sectors-with-essence-access';
import { IeObjectLicense } from '../ie-objects.types';

import {
	AGGS_PROPERTIES,
	DEFAULT_QUERY_TYPE,
	IeObjectsSearchFilterField,
	MAX_COUNT_SEARCH_RESULTS,
	MAX_NUMBER_SEARCH_RESULTS,
	MULTI_MATCH_FIELDS,
	MULTI_MATCH_QUERY_MAPPING,
	NEEDS_AGG_SUFFIX,
	NEEDS_FILTER_SUFFIX,
	NUMBER_OF_FILTER_OPTIONS_DEFAULT,
	NUMBER_OF_OPTIONS_PER_AGGREGATE,
	OCCURRENCE_TYPE,
	Operator,
	ORDER_MAPPINGS,
	OrderProperty,
	QueryBuilderInputInfo,
	QueryType,
	READABLE_TO_ELASTIC_FILTER_NAMES,
	VALUE_OPERATORS,
} from './elasticsearch.consts';

import { GroupId, GroupName } from '~modules/users/types';
import { PaginationHelper } from '~shared/helpers/pagination';
import { SortDirection } from '~shared/types';

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
		try {
			const { offset, limit } = PaginationHelper.convertPagination(
				searchRequest.page,
				searchRequest.size
			);
			const queryObject: any = {};
			delete queryObject.default; // Side effect of importing a json file as a module

			// Avoid huge queries
			queryObject.size = Math.min(searchRequest.size, MAX_NUMBER_SEARCH_RESULTS);
			const max = Math.max(0, MAX_COUNT_SEARCH_RESULTS - limit);
			queryObject.from = clamp(offset, 0, max);

			// Add the filters and search terms to the query object
			set(
				queryObject,
				'query.bool.should[0]',
				this.buildFilterObject(searchRequest.filters, inputInfo)
			);

			// Add the licenses to the query object
			set(queryObject, 'query.bool.should[1]', this.buildLicensesFilter(inputInfo));

			// Both the filters the user selected and the access to the object should match, before we return the object as a search result
			set(queryObject, 'query.bool.minimum_should_match', 2);

			// Specify the aggs objects with optional search terms
			set(queryObject, 'aggs', this.buildAggsObject(searchRequest));

			// Add sorting
			set(
				queryObject,
				'sort',
				this.buildSortArray(searchRequest.orderProp, searchRequest.orderDirection)
			);

			return queryObject;
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
	 *     			"schema_name": {
	 *     				"order": "asc"
	 *     			}
	 *     		},
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

	protected static getOccurrenceType(operator: Operator): string {
		return OCCURRENCE_TYPE[operator] || 'filter';
	}

	protected static buildValue(searchFilter: SearchFilter): any {
		if (VALUE_OPERATORS.includes(searchFilter.operator)) {
			return {
				[searchFilter.operator]: searchFilter.value,
			};
		}
		return searchFilter.multiValue || searchFilter.value;
	}

	protected static getQueryType(searchFilter: SearchFilter, value: any): any {
		const defaultQueryType = DEFAULT_QUERY_TYPE[searchFilter.field];
		if (defaultQueryType === QueryType.TERMS && !isArray(value)) {
			return QueryType.TERM;
		}
		return defaultQueryType;
	}

	protected static buildFilter(elasticKey: string, searchFilter: SearchFilter): any {
		// Used for other advanced filter fields
		const occurrenceType = this.getOccurrenceType(searchFilter.operator);
		const value = this.buildValue(searchFilter);
		const queryType = this.getQueryType(searchFilter, value);
		const queryKey = elasticKey + this.filterSuffix(searchFilter.field);

		// Contains, ContainsNot
		if (
			searchFilter.operator === Operator.CONTAINS ||
			searchFilter.operator === Operator.CONTAINS_NOT
		) {
			return {
				occurrenceType: OCCURRENCE_TYPE[searchFilter.operator],
				query: {
					query_string: {
						query: searchFilter.value + '*',
						default_field: elasticKey,
					},
				},
			};
		}

		// Is, IsNot
		return {
			occurrenceType,
			query: {
				[queryType]: {
					[queryKey]: value,
				},
			},
		};
	}

	/**
	 * Creates the filter portion of the elasticsearch query object
	 * Containing the search terms and the checked filters
	 * @param filters
	 * @param inputInfo
	 */
	private static buildFilterObject(
		filters: SearchFilter[] | undefined,
		inputInfo: QueryBuilderInputInfo
	) {
		const filterObject: any = {};
		// Add additional filters to the query object
		const filterArray: any[] = [];
		set(filterObject, 'bool.filter', filterArray);

		// Kiosk users are only allowed to view objects from their maintainer
		if (inputInfo.user.getGroupName() === GroupName.KIOSK_VISITOR) {
			filterArray.push({
				terms: {
					'schema_maintainer.schema_identifier': [inputInfo.user.getMaintainerId()],
				},
			});
		}
		// Determine consultable filters are present and strip them from standard filter list to be processed later on
		// Remark: this needs to happen after the line that checks if filters are empty.
		// This because if we strip it before it will just return match_all
		const consultableSearchFilterFields: IeObjectsSearchFilterField[] = [
			IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION,
			IeObjectsSearchFilterField.CONSULTABLE_MEDIA,
		];
		if (
			filters &&
			filters.some((filter: SearchFilter) =>
				consultableSearchFilterFields.includes(filter.field)
			)
		) {
			const consultableFilters = this.determineIsConsultableFilters(filters, inputInfo);

			// apply determined consultable filters if there are any
			consultableFilters.forEach((consultableFilter) =>
				this.applyFilter(filterObject, consultableFilter)
			);
			// Remove CONSULTABLE_ONLY_ON_LOCATION and CONSULTABLE_MEDIA filter entries from the filter list,
			// since they have been handled above and should not be handled by the standard field filtering logic.
			filters = filters.filter(
				(filter: SearchFilter) => !consultableSearchFilterFields.includes(filter.field)
			);
		}

		forEach(filters, (searchFilter: SearchFilter) => {
			// First, check for special 'multi match fields'. Fields like query, advancedQuery, name and description
			// query multiple fields at once
			if (MULTI_MATCH_FIELDS.includes(searchFilter.field)) {
				if (!searchFilter.value && !searchFilter.multiValue?.length) {
					throw new BadRequestException(
						`Value cannot be empty when filtering on field '${searchFilter.field}'`
					);
				}
				if (this.isFuzzyOperator(searchFilter.operator)) {
					// Use a multi field search template to fuzzy search in elasticsearch across multiple fields

					let textFilters;
					if (searchFilter.field === IeObjectsSearchFilterField.QUERY) {
						textFilters = [
							convertNodeToEsQueryFilterObjects(
								jsep(encodeSearchterm(searchFilter.value)),
								{
									fuzzy: MULTI_MATCH_QUERY_MAPPING.fuzzy.query,
									exact: MULTI_MATCH_QUERY_MAPPING.exact.query,
								},
								searchFilter
							),
						];
					} else {
						const searchTemplate = MULTI_MATCH_QUERY_MAPPING.fuzzy[searchFilter.field];
						textFilters = [buildFreeTextFilter(searchTemplate, searchFilter)];
					}

					textFilters.forEach((filter) =>
						this.applyFilter(filterObject, {
							occurrenceType: this.getOccurrenceType(searchFilter.operator),
							query: filter,
						})
					);
					return;
				} else {
					// Exact match
					// Use a multi field search template to exact search in elasticsearch across multiple fields
					const searchTemplate = MULTI_MATCH_QUERY_MAPPING.exact[searchFilter.field];

					if (!searchTemplate) {
						throw new BadRequestException(
							`An exact search is not supported for multi field: '${searchFilter.field}'`
						);
					}

					const textFilter = buildFreeTextFilter(searchTemplate, searchFilter);

					this.applyFilter(filterObject, {
						occurrenceType: this.getOccurrenceType(searchFilter.operator),
						query: textFilter,
					});
					return;
				}
			}
			/**
			 * query/advanced query fields are NOT allowed to be queried with the is/isNot operator
			 * name and description are also multi_match fields, but they are allowed to be queried using is/isNot operator
			 */
			if (
				MULTI_MATCH_FIELDS.includes(searchFilter.field) &&
				[
					IeObjectsSearchFilterField.ADVANCED_QUERY,
					IeObjectsSearchFilterField.QUERY,
				].includes(searchFilter.field)
			) {
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

			const advancedFilter = this.buildFilter(elasticKey, searchFilter);
			this.applyFilter(filterObject, advancedFilter);
		});

		return filterObject;
	}

	/**
	 *	This function checks if the isConsultableFilters are present in the searchRequestFilters and returns the correct filter objects
	 *
	 * @param searchRequestFilters
	 * @param inputInfo
	 * @returns
	 */
	public static determineIsConsultableFilters(
		searchRequestFilters: SearchFilter[],
		inputInfo: QueryBuilderInputInfo
	): any {
		const toBeAppliedConsultableFilters: any = [];

		const consultableOnlyOnLocationFilter = searchRequestFilters.find(
			(filter: SearchFilter) =>
				filter.field === IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION
		);
		const consultableMediaFilter = searchRequestFilters.find(
			(filter: SearchFilter) => filter.field === IeObjectsSearchFilterField.CONSULTABLE_MEDIA
		);

		// add consultable filters
		// This filter is inverted, so we only run the filter if the value is false. Don't run it if the value is undefined/null
		if (
			consultableOnlyOnLocationFilter?.value?.toLowerCase() === 'true' &&
			inputInfo.user.getGroupId() !== GroupId.KIOSK_VISITOR
		) {
			toBeAppliedConsultableFilters.push({
				occurrenceType: 'filter',
				query: [
					{
						terms: {
							'schema_maintainer.schema_identifier': inputInfo.spaces,
							// inputInfo.visitorSpaceInfo.visitorSpaceIds, //Hier alle visitor space ids
						},
					},
					{
						terms: {
							schema_license: [IeObjectLicense.BEZOEKERTOOL_CONTENT],
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
			!isNil(inputInfo.user.getSector())
		) {
			toBeAppliedConsultableFilters.push({
				occurrenceType: 'filter',
				query: [
					{
						terms: {
							'schema_maintainer.organization_type': getSectorsWithEssenceAccess(
								inputInfo.user.getSector()
							),
						},
					},
					{
						terms: {
							schema_license: [IeObjectLicense.INTRA_CP_CONTENT],
						},
					},
				],
			});
		}

		// Return empty object if no consultable filter matches the requirements
		return toBeAppliedConsultableFilters;
	}

	protected static buildLicensesFilter(inputInfo: QueryBuilderInputInfo): any {
		const { user, visitorSpaceInfo } = inputInfo;

		let checkSchemaLicenses: any = [
			// 1) Check schema_license contains "PUBLIC-METADATA-LTD" or PUBLIC-METADATA-ALL"
			{
				terms: {
					schema_license: [
						IeObjectLicense.PUBLIEK_METADATA_LTD,
						IeObjectLicense.PUBLIEK_METADATA_ALL,
					],
				},
			},
			// 4) Check or-id is part of visitorSpaceIds
			// Remark: ES does not allow maintainer and schema license to be both under 1 terms object
			{
				bool: {
					should: [
						{
							terms: {
								'schema_maintainer.schema_identifier': isNil(
									visitorSpaceInfo.visitorSpaceIds
								)
									? []
									: visitorSpaceInfo.visitorSpaceIds,
							},
						},
						{
							terms: {
								schema_license: [
									IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
									IeObjectLicense.BEZOEKERTOOL_CONTENT,
								],
							},
						},
					],
					minimum_should_match: 2,
				},
			},
			// 5) Check object id is part of folderObjectIds
			// Remark: ES does not allow ids and should be added under bool should
			{
				bool: {
					should: [
						{
							ids: {
								values: visitorSpaceInfo.objectIds,
							},
						},
						{
							terms: {
								schema_license: [
									IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
									IeObjectLicense.BEZOEKERTOOL_CONTENT,
								],
							},
						},
					],
					minimum_should_match: 2,
				},
			},
		];

		// KIOSK users and CP Admins always have access to the visitor space that they are linked to.
		if (user.getMaintainerId()) {
			checkSchemaLicenses = [
				...checkSchemaLicenses,
				{
					bool: {
						should: [
							{
								terms: {
									'schema_maintainer.schema_identifier': isNil(
										user.getMaintainerId()
									)
										? []
										: [user.getMaintainerId()],
								},
							},
							{
								terms: {
									schema_license: [
										IeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
										IeObjectLicense.BEZOEKERTOOL_CONTENT,
									],
								},
							},
						],
						minimum_should_match: 2,
					},
				},
			];
		}

		if (user.getIsKeyUser() && !isNil(user.getSector())) {
			checkSchemaLicenses = [
				...checkSchemaLicenses,
				// 2) Check or-id is part of sectorOrIds and key user
				{
					terms: {
						schema_license: [
							IeObjectLicense.INTRA_CP_METADATA_ALL,
							IeObjectLicense.INTRA_CP_CONTENT,
						],
					},
				},

				// 3) or-id is its own or-id and key user
				{
					bool: {
						should: [
							{
								terms: {
									'schema_maintainer.schema_identifier': [user.getMaintainerId()],
								},
							},
							{
								terms: {
									schema_license: [
										IeObjectLicense.INTRA_CP_METADATA_ALL,
										IeObjectLicense.INTRA_CP_CONTENT,
									],
								},
							},
						],
						minimum_should_match: 2,
					},
				},
			];
		}

		return {
			bool: {
				should: checkSchemaLicenses,
				minimum_should_match: 1,
			},
		};
	}

	protected static applyFilter(filterObject: any, newFilter: any): void {
		if (!filterObject.bool[newFilter.occurrenceType]) {
			filterObject.bool[newFilter.occurrenceType] = [];
		}

		// isConsultable filters have array of items to be processed
		if (isArray(newFilter.query)) {
			return filterObject.bool[newFilter.occurrenceType].push(...newFilter.query);
		}

		filterObject.bool[newFilter.occurrenceType].push(newFilter.query);
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
				throw new InternalServerErrorException(
					`Failed to resolve agg property: ${aggProperty}`
				);
			}

			aggs[elasticProperty] = {
				terms: {
					field: elasticProperty + this.aggSuffix(aggProperty),
					size:
						NUMBER_OF_OPTIONS_PER_AGGREGATE[
							aggProperty as IeObjectsSearchFilterField
						] ?? NUMBER_OF_FILTER_OPTIONS_DEFAULT,
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
	private static aggSuffix(prop: IeObjectsSearchFilterField): string {
		return NEEDS_AGG_SUFFIX[prop] ? `.${NEEDS_AGG_SUFFIX[prop]}` : '';
	}

	public static isFuzzyOperator(operator: Operator): boolean {
		return [Operator.CONTAINS, Operator.CONTAINS_NOT].includes(operator);
	}
}
