import {
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { fromPairs, get, isEmpty, set } from 'lodash';
import moment from 'moment';

import {
	ContentBlock,
	ContentPage,
	ContentPageLabel,
	ContentWidth,
	GqlContentPage,
	LabelObj,
	MediaItemResponse,
} from '../types';

import {
	GET_COLLECTION_TILE_BY_ID,
	GET_CONTENT_PAGE_BY_PATH,
	GET_CONTENT_PAGE_LABELS_BY_TYPE_AND_ID,
	GET_CONTENT_PAGE_LABELS_BY_TYPE_AND_LABEL,
	GET_CONTENT_PAGES,
	GET_CONTENT_PAGES_BY_IDS,
	GET_CONTENT_PAGES_WITH_BLOCKS,
	GET_ITEM_BY_EXTERNAL_ID,
	GET_ITEM_TILE_BY_ID,
	GET_PUBLIC_CONTENT_PAGES,
	UPDATE_CONTENT_PAGE_PUBLISH_DATES,
} from './queries.gql';

import {
	ContentPageFilters,
	ContentPagesQueryDto,
} from '~modules/admin/content-pages/dto/content-pages.dto';
import { DataService } from '~modules/data/services/data.service';
import { SpacesQueryDto } from '~modules/spaces/dto/spaces.dto';
import { FIND_SPACE_BY_ID, FIND_SPACES } from '~modules/spaces/services/queries.gql';
import { Space } from '~modules/spaces/types';
import { UsersService } from '~modules/users/services/users.service';
import { User } from '~modules/users/types';
import { PaginationHelper } from '~shared/helpers/pagination';

@Injectable()
export class ContentPagesService {
	private logger: Logger = new Logger(ContentPagesService.name, { timestamp: true });

	constructor(protected dataService: DataService, protected usersService: UsersService) {}

	/**
	 * Adapt a space as returned by a typical graphQl response to our internal space data model
	 */
	public adapt(gqlContentPage: GqlContentPage): ContentPage {
		return {
			id: get(gqlContentPage, 'id'),
			thumbnailPath: get(gqlContentPage, 'thumbnail_path'),
			title: get(gqlContentPage, 'title'),
			description: get(gqlContentPage, 'description'),
			seoDescription: get(gqlContentPage, 'seo_description'),
			metaDescription: get(gqlContentPage, 'meta_description'),
			path: get(gqlContentPage, 'path'),
			isPublic: get(gqlContentPage, 'is_public'),
			publishedAt: get(gqlContentPage, 'published_at'),
			publishAt: get(gqlContentPage, 'publish_at'),
			depublishAt: get(gqlContentPage, 'depublish_at'),
			createdAt: get(gqlContentPage, 'created_at'),
			updatedAt: get(gqlContentPage, 'updated_at'),
			isProtected: get(gqlContentPage, 'is_protected'),
			contentType: get(gqlContentPage, 'content_type'),
			contentWidth: get(gqlContentPage, 'content_width'),
			owner: this.usersService.adapt(get(gqlContentPage, 'owner')),
			userProfileId: get(gqlContentPage, 'user_profile_id'),
			userGroupIds: get(gqlContentPage, 'user_group_ids'),
			contentBlocks: get(gqlContentPage, 'content_blocks'),
			labels: get(gqlContentPage, 'labels'),
		};
	}

	private getLabelFilter(labelIds: string[]): any[] {
		if (labelIds.length) {
			// The user selected some block labels at the top of the page overview component
			return [
				{
					content_content_labels: {
						content_label: { id: { _in: labelIds } },
					},
				},
			];
		}
		return [];
	}

	public async getContentPagesForOverview(
		inputQuery: ContentPagesQueryDto
	): Promise<IPagination<ContentPage> & { labelCounts: Record<string, number> }> {
		const { page, size, orderProp, orderDirection, withBlocks } = inputQuery;
		const filters: ContentPageFilters = inputQuery.filters;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const now = new Date().toISOString();
		const contentPagesResponse = await this.dataService.execute(
			withBlocks ? GET_CONTENT_PAGES_WITH_BLOCKS : GET_CONTENT_PAGES,
			{
				where: {
					_and: [
						{
							// Get content pages with the selected content type
							content_type: { _in: filters.contentTypes },
						},
						{
							// Get pages that are visible to the current user
							_or: filters.userGroupIds.map((userGroupId) => ({
								user_group_ids: { _contains: userGroupId },
							})),
						},
						...this.getLabelFilter(filters.labelIds),
						// publish state
						{
							_or: [
								{ is_public: { _eq: true } },
								{ publish_at: { _is_null: true }, depublish_at: { _gte: now } },
								{ publish_at: { _lte: now }, depublish_at: { _is_null: true } },
								{ publish_at: { _lte: now }, depublish_at: { _gte: now } },
							],
						},
						{ is_deleted: { _eq: false } },
					],
				},
				orderBy: { [orderProp]: orderDirection },
				orUserGroupIds: filters.userGroupIds.map((userGroupId) => ({
					content: { user_group_ids: { _contains: userGroupId } },
				})),
				offset,
				limit,
			}
		);

		const paginatedResponse = Pagination<ContentPage>({
			items: get(contentPagesResponse, 'data.app_content', []).map(this.adapt),
			page,
			size,
			total: get(contentPagesResponse, 'data.cms_content_aggregate.aggregate.count', 0),
		});
		return {
			...paginatedResponse,
			labelCounts: fromPairs(
				get(contentPagesResponse, 'data.cms_content_labels', []).map(
					(labelInfo: any): [number, number] => [
						get(labelInfo, 'id'),
						get(labelInfo, 'content_content_labels_aggregate.aggregate.count'),
					]
				)
			),
		};
	}

	public async getContentPageByPath(path: string): Promise<ContentPage | null> {
		const response = await this.dataService.execute(GET_CONTENT_PAGE_BY_PATH, {
			path,
		});
		const contentPage: ContentPage | undefined = get(response, 'data.cms_content[0]');

		return contentPage || null;
	}

	// public async getContentPageByPath(path: string): Promise<ContentPage | null> {
	// 	try {
	// 		const response = await this.dataService.execute(GET_CONTENT_PAGE_BY_PATH, {
	// 			path,
	// 		});
	// 		const contentPage: ContentPage | undefined = get(response, 'data.app_content[0]');
	//
	// 		return contentPage || null;
	// 	} catch (err) {
	// 		throw new InternalServerErrorException({
	// 			message: 'Failed to get content page',
	// 			innerException: err,
	// 		});
	// 	}
	// }
	//
	// public async fetchCollectionOrItem(
	// 	type: 'IE_OBJECT',
	// 	id: string
	// ): Promise<MediaItemResponse | null> {
	// 	try {
	// 		const response = await this.dataService.execute(
	// 			type === 'ITEM' ? GET_ITEM_TILE_BY_ID : GET_COLLECTION_TILE_BY_ID,
	// 			{ id }
	// 		);
	//
	// 		const itemOrCollection = get(response, 'data.obj[0]', null);
	// 		if (itemOrCollection) {
	// 			itemOrCollection.count =
	// 				get(response, 'data.view_counts_aggregate.aggregate.sum.count') || 0;
	// 		}
	//
	// 		return itemOrCollection;
	// 	} catch (err) {
	// 		throw new InternalServerErrorException({message: 'Failed to fetch collection or item', innerException: err, additionalInfo: { type, id }});
	// 	}
	// }
	//
	// public async fetchItemByExternalId(externalId: string): Promise<Partial<Media> | null> {
	// 	try {
	// 		const response = await this.dataService.execute(GET_ITEM_BY_EXTERNAL_ID, {
	// 			externalId,
	// 		});
	//
	// 		return get(response, 'data.app_item_meta[0]', null);
	// 	} catch (err) {
	// 		throw new InternalServerErrorException({message: 'Failed to fetch item by external id', innerException: err, additionalInfo: { externalId }});
	// 	}
	// }
	//
	// public async fetchSearchQuery(
	// 	limit: number,
	// 	filters: Partial<Avo.Search.Filters>,
	// 	orderProperty: Avo.Search.OrderProperty,
	// 	orderDirection: Avo.Search.OrderDirection
	// ): Promise<Avo.Search.Search | null> {
	// 	try {
	// 		return await SearchController.search({
	// 			filters,
	// 			orderProperty,
	// 			orderDirection,
	// 			from: 0,
	// 			size: limit,
	// 			index: 'all' as Avo.Search.EsIndex,
	// 		});
	// 	} catch (err) {
	// 		throw new InternalServerErrorException({'Failed to fetch search results for content page', err, {
	// 			limit,
	// 			filters,
	// 		});
	// 	}
	// }
	//
	// private getLabelFilter(labelIds: number[]): any[] {
	// 	if (labelIds.length) {
	// 		// The user selected some block labels at the top of the page overview component
	// 		return [
	// 			{
	// 				content_content_labels: {
	// 					content_label: { id: { _in: labelIds } },
	// 				},
	// 			},
	// 		];
	// 	}
	// 	return [];
	// }
	//
	// public async fetchContentPages(
	// 	withBlock: boolean,
	// 	userGroupIds: number[],
	// 	contentType: string,
	// 	labelIds: number[],
	// 	selectedLabelIds: number[],
	// 	orderByProp: string,
	// 	orderByDirection: 'asc' | 'desc',
	// 	offset = 0,
	// 	limit: number
	// ): Promise<ContentPageOverviewResponse> {
	// 	const now = new Date().toISOString();
	// 	const variables = {
	// 		limit,
	// 		labelIds,
	// 		offset,
	// 		where: {
	// 			_and: [
	// 				{
	// 					// Get content pages with the selected content type
	// 					content_type: { _eq: contentType },
	// 				},
	// 				{
	// 					// Get pages that are visible to the current user
	// 					_or: userGroupIds.map((userGroupId) => ({
	// 						user_group_ids: { _contains: userGroupId },
	// 					})),
	// 				},
	// 				...this.getLabelFilter(selectedLabelIds),
	// 				// publish state
	// 				{
	// 					_or: [
	// 						{ is_public: { _eq: true } },
	// 						{ publish_at: { _is_null: true }, depublish_at: { _gte: now } },
	// 						{ publish_at: { _lte: now }, depublish_at: { _is_null: true } },
	// 						{ publish_at: { _lte: now }, depublish_at: { _gte: now } },
	// 					],
	// 				},
	// 				{ is_deleted: { _eq: false } },
	// 			],
	// 		},
	// 		orderBy: { [orderByProp]: orderByDirection },
	// 		orUserGroupIds: userGroupIds.map((userGroupId) => ({
	// 			content: { user_group_ids: { _contains: userGroupId } },
	// 		})),
	// 	};
	// 	const response = await this.dataService.execute(
	// 		withBlock ? GET_CONTENT_PAGES_WITH_BLOCKS : GET_CONTENT_PAGES,
	// 		variables
	// 	);
	// 	if (response.errors) {
	// 		throw new InternalServerErrorException('GraphQL has errors', null, { response });
	// 	}
	// 	return {
	// 		pages: get(response, 'data.app_content') || [],
	// 		count: get(response, 'data.app_content_aggregate.aggregate.count', 0),
	// 		labelCounts: fromPairs(
	// 			get(response, 'data.app_content_labels', []).map(
	// 				(labelInfo: any): [number, number] => [
	// 					get(labelInfo, 'id'),
	// 					get(labelInfo, 'content_content_labels_aggregate.aggregate.count'),
	// 				]
	// 			)
	// 		),
	// 	};
	// }
	//
	// public async fetchPublicContentPages(): Promise<
	// 	{
	// 		path: string;
	// 		updated_at: string;
	// 	}[]
	// > {
	// 	try {
	// 		const now = new Date().toISOString();
	// 		const response = await this.dataService.execute(GET_PUBLIC_CONTENT_PAGES, {
	// 			where: {
	// 				_and: [
	// 					{
	// 						user_group_ids: { _contains: SpecialPermissionGroups.loggedOutUsers },
	// 					},
	// 					// publish state
	// 					{
	// 						_or: [
	// 							{ is_public: { _eq: true } },
	// 							{ publish_at: { _eq: null }, depublish_at: { _gte: now } },
	// 							{ publish_at: { _lte: now }, depublish_at: { _eq: null } },
	// 							{ publish_at: { _lte: now }, depublish_at: { _gte: now } },
	// 						],
	// 					},
	// 					{ is_deleted: { _eq: false } },
	// 				],
	// 			},
	// 		});
	// 		if (response.errors) {
	// 			throw new InternalServerErrorException({
	// 				message: 'GraphQL has errors',
	// 				additionalInfo: { response },
	// 			});
	// 		}
	// 		return get(response, 'data.app_content') || [];
	// 	} catch (err) {
	// 		throw new InternalServerErrorException('Failed to fetch all public content pages');
	// 	}
	// }
	//
	// public async updatePublishDates(): Promise<{ published: number; unpublished: number }> {
	// 	try {
	// 		const response = await this.dataService.execute(UPDATE_CONTENT_PAGE_PUBLISH_DATES, {
	// 			now: new Date().toISOString(),
	// 			publishedAt: moment().hours(7).minutes(0).toISOString(),
	// 		});
	// 		if (response.errors) {
	// 			throw new InternalServerErrorException({
	// 				message: 'Graphql mutation returned errors',
	// 				additionalInfo: { response },
	// 			});
	// 		}
	// 		return {
	// 			published: get(response, 'data.publish_content_pages.affected_rows', 0),
	// 			unpublished: get(response, 'data.unpublish_content_pages.affected_rows', 0),
	// 		};
	// 	} catch (err) {
	// 		throw new InternalServerErrorExceptionException(
	// 			'Failed to update content page publish dates',
	// 			err
	// 		);
	// 	}
	// }
	//
	// public async getContentPagesByIds(contentPageIds: number[]): Promise<ContentPage[]> {
	// 	try {
	// 		const response = await this.dataService.execute(GET_CONTENT_PAGES_BY_IDS, {
	// 			ids: contentPageIds,
	// 		});
	// 		if (response.errors) {
	// 			throw new InternalServerErrorException({
	// 				message: 'GraphQL has errors',
	// 				additionalInfo: { response },
	// 			});
	// 		}
	// 		return get(response, 'data.app_content') || [];
	// 	} catch (err) {
	// 		throw new InternalServerErrorException('Failed to fetch content pages by ids');
	// 	}
	// }
	//
	// public async getContentPageLabelsByTypeAndLabels(
	// 	contentType: string,
	// 	labels: string[]
	// ): Promise<LabelObj[]> {
	// 	try {
	// 		const response = await this.dataService.execute(
	// 			GET_CONTENT_PAGE_LABELS_BY_TYPE_AND_LABEL,
	// 			{
	// 				contentType,
	// 				labels,
	// 			}
	// 		);
	//
	// 		if (response.errors) {
	// 			throw new InternalServerErrorException({
	// 				message: 'graphql response contains errors',
	// 				additionalInfo: { response },
	// 			});
	// 		}
	//
	// 		return get(response, 'data.app_content_labels') || [];
	// 	} catch (err) {
	// 		throw new InternalServerErrorException({
	// 			message: 'Failed to get content page label objects by type and labels',
	// 			innerException: err,
	// 			additionalInfo: {
	// 				query: 'GET_CONTENT_PAGE_LABELS_BY_TYPE_AND_LABEL',
	// 				variables: { contentType, labels },
	// 			},
	// 		});
	// 	}
	// }
	//
	// async getContentPageLabelsByTypeAndIds(
	// 	contentType: string,
	// 	labelIds: string[]
	// ): Promise<LabelObj[]> {
	// 	try {
	// 		const response = await this.dataService.execute(
	// 			GET_CONTENT_PAGE_LABELS_BY_TYPE_AND_ID,
	// 			{
	// 				contentType,
	// 				labelIds,
	// 			}
	// 		);
	//
	// 		if (response.errors) {
	// 			throw new InternalServerErrorException({
	// 				message: 'graphql response contains errors',
	// 				additionalInfo: { response },
	// 			});
	// 		}
	//
	// 		return get(response, 'data.app_content_labels') || [];
	// 	} catch (err) {
	// 		throw new InternalServerErrorException({
	// 			message: 'Failed to get content page label objects by type and label ids',
	// 			innerException: err,
	// 			additionalInfo: {
	// 				query: 'GET_CONTENT_PAGE_LABELS_BY_TYPE_AND_ID',
	// 				variables: { contentType, labelIds },
	// 			},
	// 		});
	// 	}
	// }
}
