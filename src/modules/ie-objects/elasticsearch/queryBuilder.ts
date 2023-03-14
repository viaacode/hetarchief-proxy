import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import jsep from 'jsep';
import { clamp, forEach, isArray, isEmpty, isNil, set } from 'lodash';

import { IeObjectsQueryDto, SearchFilter } from '../dto/ie-objects.dto';
import { convertNodeToEsQueryFilterObjects } from '../helpers/convert-node-to-es-query-filter-objects';
import { IeObjectLicense, IeObjectSector, IeObjectsVisitorSpaceInfo } from '../ie-objects.types';

import {
	AGGS_PROPERTIES,
	DEFAULT_QUERY_TYPE,
	MAX_COUNT_SEARCH_RESULTS,
	MAX_NUMBER_SEARCH_RESULTS,
	MULTI_MATCH_FIELDS,
	MULTI_MATCH_QUERY_MAPPING,
	NEEDS_AGG_SUFFIX,
	NEEDS_FILTER_SUFFIX,
	NUMBER_OF_FILTER_OPTIONS,
	OCCURRENCE_TYPE,
	Operator,
	ORDER_MAPPINGS,
	OrderProperty,
	QueryBuilderConfig,
	QueryType,
	READABLE_TO_ELASTIC_FILTER_NAMES,
	SearchFilterField,
	VALUE_OPERATORS,
} from './elasticsearch.consts';

import { PaginationHelper } from '~shared/helpers/pagination';
import { SortDirection } from '~shared/types';

(jsep as any).removeAllBinaryOps();
(jsep as any).removeAllUnaryOps();

jsep.addBinaryOp('AND', 2);
jsep.addBinaryOp('OR', 1);

jsep.addUnaryOp('NOT');

export class QueryBuilder {
	private static config: QueryBuilderConfig = {
		AGGS_PROPERTIES,
		MAX_COUNT_SEARCH_RESULTS,
		MAX_NUMBER_SEARCH_RESULTS,
		NEEDS_FILTER_SUFFIX,
		NUMBER_OF_FILTER_OPTIONS,
		READABLE_TO_ELASTIC_FILTER_NAMES,
		DEFAULT_QUERY_TYPE,
		OCCURRENCE_TYPE,
		VALUE_OPERATORS,
		ORDER_MAPPINGS,
		MULTI_MATCH_FIELDS,
		MULTI_MATCH_QUERY_MAPPING,
		NEEDS_AGG_SUFFIX,
	};

	public static getConfig(): QueryBuilderConfig {
		return this.config;
	}

	public static setConfig(config: QueryBuilderConfig) {
		this.config = config;
	}

	/**
	 * Convert filters, order, aggs properties (created by the ui) to elasticsearch query object
	 * @param searchRequest the search query parameters
	 * @param inputInfo
	 * @return elastic search query
	 */
	public static build(
		searchRequest: IeObjectsQueryDto,
		inputInfo: {
			user: { isKeyUser: boolean; maintainerId: string; sector: IeObjectSector };
			visitorSpaceInfo?: IeObjectsVisitorSpaceInfo;
		}
	): any {
		try {
			const { offset, limit } = PaginationHelper.convertPagination(
				searchRequest.page,
				searchRequest.size
			);
			const queryObject: any = {};
			delete queryObject.default; // Side effect of importing a json file as a module

			// Avoid huge queries
			queryObject.size = Math.min(searchRequest.size, this.config.MAX_NUMBER_SEARCH_RESULTS);
			const max = Math.max(0, this.config.MAX_COUNT_SEARCH_RESULTS - limit);
			queryObject.from = clamp(offset, 0, max);

			// Add the filters and search terms to the query object
			set(queryObject, 'query.bool.should[0]', this.buildFilterObject(searchRequest.filters));

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
		const mappedOrderProperty = this.config.ORDER_MAPPINGS[orderProperty];
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
		sortArray.push(this.config.ORDER_MAPPINGS[OrderProperty.RELEVANCE]);

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
		return this.config.OCCURRENCE_TYPE[operator] || 'filter';
	}

	protected static buildValue(searchFilter: SearchFilter): any {
		if (this.config.VALUE_OPERATORS.includes(searchFilter.operator)) {
			return {
				[searchFilter.operator]: searchFilter.value,
			};
		}
		return searchFilter.multiValue || searchFilter.value;
	}

	protected static getQueryType(searchFilter: SearchFilter, value: any): any {
		const defaultQueryType = this.config.DEFAULT_QUERY_TYPE[searchFilter.field];
		if (defaultQueryType === QueryType.TERMS && !isArray(value)) {
			return QueryType.TERM;
		}
		return defaultQueryType;
	}

	protected static buildFilter(elasticKey: string, searchFilter: SearchFilter): any {
		const occurrenceType = this.getOccurrenceType(searchFilter.operator);
		const value = this.buildValue(searchFilter);
		return {
			occurrenceType,
			query: {
				[this.getQueryType(searchFilter, value)]: {
					[elasticKey + this.filterSuffix(searchFilter.field)]: value,
				},
			},
		};
	}

	protected static buildLicensesFilter(inputInfo: {
		user: {
			isKeyUser: boolean;
			maintainerId: string;
			sector: IeObjectSector | null;
		};
		visitorSpaceInfo?: IeObjectsVisitorSpaceInfo;
	}): any {
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
								maintainer: visitorSpaceInfo.visitorSpaceIds,
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
		if (user?.maintainerId) {
			checkSchemaLicenses = [
				...checkSchemaLicenses,
				{
					bool: {
						should: [
							{
								terms: {
									maintainer: [user.maintainerId],
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

		if (user.isKeyUser && !isNil(user.sector)) {
			checkSchemaLicenses = [
				...checkSchemaLicenses,
				// 2) Check or-id is part of sectorOrIds and key user
				{
					term: {
						'schema_maintainer.organization_type': user.sector,
					},
					terms: {
						schema_license: [
							IeObjectLicense.INTRA_CP_METADATA_ALL,
							IeObjectLicense.INTRA_CP_CONTENT,
						],
					},
				},
				// 3) or-id is its own or-id and key user
				{
					term: {
						schema_maintainer: user.maintainerId,
					},
					terms: {
						schema_license: [
							IeObjectLicense.INTRA_CP_METADATA_ALL,
							IeObjectLicense.INTRA_CP_CONTENT,
						],
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

	protected static buildFreeTextFilter(searchTemplate: any[], searchFilter: SearchFilter): any {
		// Replace {{query}} in the template with the escaped search terms
		let stringifiedSearchTemplate = JSON.stringify(searchTemplate);
		stringifiedSearchTemplate = stringifiedSearchTemplate.replace(
			/\{\{query\}\}/g,
			searchFilter.value
		);

		return [
			{
				bool: {
					should: JSON.parse(stringifiedSearchTemplate),
					minimum_should_match: 1, // At least one of the search patterns has to match, but not all of them
				},
			},
		];
	}

	/**
	 * Creates the filter portion of the elasticsearch query object
	 * Containing the search terms and the checked filters
	 * @param filters
	 */
	private static buildFilterObject(filters: SearchFilter[] | undefined) {
		if (!filters || isEmpty(filters)) {
			// Return query object that will match all results
			return { match_all: {} };
		}

		const filterObject: any = {};

		// Add additional filters to the query object
		const filterArray: any[] = [];
		set(filterObject, 'bool.filter', filterArray);
		forEach(filters, (searchFilter: SearchFilter) => {
			// First, check for special 'multi match fields'. Fields like query, advancedQuery, name and description
			// query multiple fields at once
			if (this.config.MULTI_MATCH_FIELDS.includes(searchFilter.field)) {
				if (!searchFilter.value) {
					throw new BadRequestException(
						`Value cannot be empty when filtering on field '${searchFilter.field}'`
					);
				}
				if (this.isFuzzyOperator(searchFilter.operator)) {
					// Use a multi field search template to fuzzy search in elasticsearch across multiple fields

					const searchTemplate =
						this.config.MULTI_MATCH_QUERY_MAPPING.fuzzy[searchFilter.field];

					let textFilters;
					if (searchFilter.field === SearchFilterField.QUERY) {
						textFilters = [
							convertNodeToEsQueryFilterObjects(
								jsep(searchFilter.value),
								this.config.MULTI_MATCH_QUERY_MAPPING.fuzzy.booleanQuery,
								searchFilter
							),
						];
					} else {
						textFilters = this.buildFreeTextFilter(searchTemplate, searchFilter);
					}

					textFilters.forEach((filter) =>
						this.applyFilter(filterObject, {
							occurrenceType: this.getOccurrenceType(searchFilter.operator),
							query: filter,
						})
					);
					return;
				} else {
					// Use a multi field search template to exact search in elasticsearch across multiple fields
					const searchTemplate =
						this.config.MULTI_MATCH_QUERY_MAPPING.exact[searchFilter.field];

					if (!searchTemplate) {
						throw new BadRequestException(
							`An exact search is not supported for multi field: '${searchFilter.field}'`
						);
					}

					const textFilters = this.buildFreeTextFilter(searchTemplate, searchFilter);

					textFilters.forEach((filter) =>
						this.applyFilter(filterObject, {
							occurrenceType: this.getOccurrenceType(searchFilter.operator),
							query: filter,
						})
					);
					return;
				}
			}
			/**
			 * query/advanced query fields are NOT allowed to be queried with the is/isNot operator
			 * name and description are also multi_match fields, but they are allowed to be queried using is/isNot operator
			 */
			if (
				this.config.MULTI_MATCH_FIELDS.includes(searchFilter.field) &&
				[SearchFilterField.ADVANCED_QUERY, SearchFilterField.QUERY].includes(
					searchFilter.field
				)
			) {
				throw new BadRequestException(
					`Field '${searchFilter.field}' cannot be queried with the '${searchFilter.operator}' operator.`
				);
			}

			// Map frontend filter names to elasticsearch names
			const elasticKey = this.config.READABLE_TO_ELASTIC_FILTER_NAMES[searchFilter.field];
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

	protected static applyFilter(filterObject: any, newFilter: any): void {
		if (!filterObject.bool[newFilter.occurrenceType]) {
			filterObject.bool[newFilter.occurrenceType] = [];
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
		forEach(searchRequest.requestedAggs || this.config.AGGS_PROPERTIES, (aggProperty) => {
			const elasticProperty =
				this.config.READABLE_TO_ELASTIC_FILTER_NAMES[aggProperty as SearchFilterField];
			if (!elasticProperty) {
				throw new InternalServerErrorException(
					`Failed to resolve agg property: ${aggProperty}`
				);
			}

			aggs[elasticProperty] = {
				terms: {
					field: elasticProperty + this.aggSuffix(aggProperty),
					size: this.config.NUMBER_OF_FILTER_OPTIONS,
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
	private static filterSuffix(prop: SearchFilterField): string {
		return this.config.NEEDS_FILTER_SUFFIX[prop]
			? `.${this.config.NEEDS_FILTER_SUFFIX[prop]}`
			: '';
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
	private static aggSuffix(prop: SearchFilterField): string {
		return this.config.NEEDS_AGG_SUFFIX[prop] ? `.${this.config.NEEDS_AGG_SUFFIX[prop]}` : '';
	}

	public static isFuzzyOperator(operator: Operator): boolean {
		return [Operator.CONTAINS, Operator.CONTAINS_NOT].includes(operator);
	}
}
