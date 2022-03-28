import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import { Avo } from '@viaa/avo2-types';
import { fromPairs, get } from 'lodash';
import moment from 'moment';

import {
	GetCollectionTileByIdDocument,
	GetItemByExternalIdDocument,
	GetItemTileByIdDocument,
} from '../../../../generated/graphql-db-types-avo';
import {
	AvoOrHetArchief,
	ContentBlock,
	ContentPage,
	ContentPageOverviewResponse,
	ContentWidth,
	GqlContentBlock,
	GqlContentPage,
	LabelObj,
	MediaItemResponse,
} from '../content-pages.types';

import { CONTENT_PAGE_QUERIES } from '~modules/admin/content-pages/content-pages.consts';
import {
	ContentPageFiltersDto,
	ContentPagesQueryDto,
} from '~modules/admin/content-pages/dto/content-pages.dto';
import { DataService } from '~modules/data/services/data.service';
import { UsersService } from '~modules/users/services/users.service';
import { PaginationHelper } from '~shared/helpers/pagination';
import { SpecialPermissionGroups } from '~shared/types/types';

@Injectable()
export class ContentPagesService {
	private logger: Logger = new Logger(ContentPagesService.name, { timestamp: true });
	private readonly avoOrHetArchief: string;
	private queries: typeof CONTENT_PAGE_QUERIES['avo'] | typeof CONTENT_PAGE_QUERIES['hetArchief'];

	constructor(
		protected dataService: DataService,
		protected usersService: UsersService,
		protected configService: ConfigService
	) {
		this.avoOrHetArchief = this.configService.get('databaseApplicationType');
		this.queries = CONTENT_PAGE_QUERIES[this.avoOrHetArchief];
	}

	/**
	 * Adapt a space as returned by a typical graphQl response to our internal space data model
	 */
	public adaptContentPage(gqlContentPage: GqlContentPage): ContentPage {
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
			contentWidth: get(gqlContentPage, 'content_width') as ContentWidth,
			owner:
				this.usersService.adapt(get(gqlContentPage, 'owner')) ||
				this.usersService.adapt(get(gqlContentPage, '')),
			userProfileId: get(gqlContentPage, 'user_profile_id'),
			userGroupIds: get(gqlContentPage, 'user_group_ids'),
			contentBlocks: get(gqlContentPage, 'content_blocks', []).map(this.adaptContentBlock),
			labels: get(gqlContentPage, 'labels'),
		};
	}

	public adaptContentBlock(contentBlock: GqlContentBlock): ContentBlock {
		return {
			id: get(contentBlock, 'id'),
			blockType: get(contentBlock, 'blockType'),
			createdAt: get(contentBlock, 'created_at'),
			updatedAt: get(contentBlock, 'updated_at'),
			position: get(contentBlock, 'position'),
			variables: get(contentBlock, 'variables'),
		};
	}

	private getLabelFilter(labelIds: (string | number)[]): any[] {
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
		const filters: ContentPageFiltersDto = inputQuery.filters;
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const now = new Date().toISOString();
		const contentPagesResponse = await this.dataService.execute(
			withBlocks
				? this.queries.GetContentPagesWithBlocksDocument
				: this.queries.GetContentPagesDocument,
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
			items: get(contentPagesResponse, 'data.app_content', []).map(this.adaptContentPage),
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
		const response = await this.dataService.execute(this.queries.GetContentPageByPathDocument, {
			path,
		});
		const contentPage: GqlContentPage | undefined =
			get(response, 'data.cms_content[0]') || get(response, 'data.app_content[0]');

		return this.adaptContentPage(contentPage);
	}

	public async fetchCollectionOrItem(
		type: 'ITEM' | 'COLLECTION',
		id: string
	): Promise<MediaItemResponse | null> {
		if (this.avoOrHetArchief === AvoOrHetArchief.hetArchief) {
			throw new InternalServerErrorException({
				message:
					'Trying to resolve item or collection from AvO inside the hetArchief database. Only objects are supported.',
				additionalInfo: {
					type,
					id,
				},
			});
		}
		const response = await this.dataService.execute(
			type === 'ITEM' ? GetItemTileByIdDocument : GetCollectionTileByIdDocument,
			{ id }
		);

		const itemOrCollection = get(response, 'data.obj[0]', null);
		if (itemOrCollection) {
			itemOrCollection.count =
				get(response, 'data.view_counts_aggregate.aggregate.sum.count') || 0;
		}

		return itemOrCollection;
	}

	public async fetchItemByExternalId(externalId: string): Promise<Partial<Avo.Item.Item> | null> {
		if (this.avoOrHetArchief === AvoOrHetArchief.hetArchief) {
			throw new InternalServerErrorException({
				message:
					'Trying to fetch item from AvO inside the hetArchief database. Only objects are supported.',
				additionalInfo: {
					externalId,
				},
			});
		}

		const response = await this.dataService.execute(GetItemByExternalIdDocument, {
			externalId,
		});

		return get(response, 'data.app_item_meta[0]', null);
	}

	private static getLabelFilter(labelIds: number[]): any[] {
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

	public async fetchContentPages(
		withBlock: boolean,
		userGroupIds: number[],
		contentType: string,
		labelIds: number[],
		selectedLabelIds: number[],
		orderByProp: string,
		orderByDirection: 'asc' | 'desc',
		offset = 0,
		limit: number
	): Promise<ContentPageOverviewResponse> {
		const now = new Date().toISOString();
		const variables = {
			limit,
			labelIds,
			offset,
			where: {
				_and: [
					{
						// Get content pages with the selected content type
						content_type: { _eq: contentType },
					},
					{
						// Get pages that are visible to the current user
						_or: userGroupIds.map((userGroupId) => ({
							user_group_ids: { _contains: userGroupId },
						})),
					},
					...this.getLabelFilter(selectedLabelIds),
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
			orderBy: { [orderByProp]: orderByDirection },
			orUserGroupIds: userGroupIds.map((userGroupId) => ({
				content: { user_group_ids: { _contains: userGroupId } },
			})),
		};
		const response = await this.dataService.execute(
			withBlock
				? this.queries.GetContentPagesWithBlocksDocument
				: this.queries.GetContentPagesDocument,
			variables
		);
		return {
			pages: get(response, 'data.app_content') || [],
			count: get(response, 'data.app_content_aggregate.aggregate.count', 0),
			labelCounts: fromPairs(
				get(response, 'data.app_content_labels', []).map(
					(labelInfo: any): [number, number] => [
						get(labelInfo, 'id'),
						get(labelInfo, 'content_content_labels_aggregate.aggregate.count'),
					]
				)
			),
		};
	}

	public async fetchPublicContentPages(): Promise<
		{
			path: string;
			updated_at: string;
		}[]
	> {
		try {
			const now = new Date().toISOString();
			const response = await this.dataService.execute(
				this.queries.GetPublicContentPagesDocument,
				{
					where: {
						_and: [
							{
								user_group_ids: {
									_contains: SpecialPermissionGroups.loggedOutUsers,
								},
							},
							// publish state
							{
								_or: [
									{ is_public: { _eq: true } },
									{ publish_at: { _eq: null }, depublish_at: { _gte: now } },
									{ publish_at: { _lte: now }, depublish_at: { _eq: null } },
									{ publish_at: { _lte: now }, depublish_at: { _gte: now } },
								],
							},
							{ is_deleted: { _eq: false } },
						],
					},
				}
			);
			if (response.errors) {
				throw new InternalServerErrorException({
					message: 'GraphQL has errors',
					additionalInfo: { response },
				});
			}
			return get(response, 'data.app_content') || [];
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to fetch all public content pages',
				innerException: err,
			});
		}
	}

	public async updatePublishDates(): Promise<{ published: number; unpublished: number }> {
		const response = await this.dataService.execute(
			this.queries.UpdateContentPagePublishDatesDocument,
			{
				now: new Date().toISOString(),
				publishedAt: moment().hours(7).minutes(0).toISOString(),
			}
		);
		return {
			published: get(response, 'data.publish_content_pages.affected_rows', 0),
			unpublished: get(response, 'data.unpublish_content_pages.affected_rows', 0),
		};
	}

	public async getContentPagesByIds(contentPageIds: number[]): Promise<Avo.ContentPage.Page[]> {
		const response = await this.dataService.execute(this.queries.GetContentByIdDocument, {
			ids: contentPageIds,
		});
		return get(response, 'data.app_content') || [];
	}

	public async getContentPageLabelsByTypeAndLabels(
		contentType: string,
		labels: string[]
	): Promise<LabelObj[]> {
		const response = await this.dataService.execute(
			this.queries.GetContentPageLabelsByTypeAndLabelsDocument,
			{
				contentType,
				labels,
			}
		);

		return (
			get(response, 'data.app_content_labels') ||
			get(response, 'data.cms_content_labels') ||
			[]
		);
	}

	public async getContentPageLabelsByTypeAndIds(
		contentType: string,
		labelIds: string[]
	): Promise<LabelObj[]> {
		const response = await this.dataService.execute(
			this.queries.GetContentPageLabelsByTypeAndIdsDocument,
			{
				contentType,
				labelIds,
			}
		);

		return (
			get(response, 'data.cms_content_labels') ||
			get(response, 'data.app_content_labels') ||
			[]
		);
	}
}
