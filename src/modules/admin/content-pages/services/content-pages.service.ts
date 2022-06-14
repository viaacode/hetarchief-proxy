import {
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPagination } from '@studiohyperdrive/pagination';
import { Avo } from '@viaa/avo2-types';
import { SearchResultItem } from '@viaa/avo2-types/types/search';
import * as promiseUtils from 'blend-promise-utils';
import { Request } from 'express';
import { compact, fromPairs, get, isEmpty, keys, set } from 'lodash';
import moment from 'moment';

import { getConfig } from '~config';

import {
	AvoOrHetArchief,
	ContentBlock,
	ContentPage,
	ContentPageLabel,
	ContentPageOverviewResponse,
	ContentPageType,
	ContentPageUser,
	ContentWidth,
	FetchSearchQueryFunctionAvo,
	GqlAvoUser,
	GqlContentBlock,
	GqlContentPage,
	GqlHetArchiefUser,
	GqlUser,
	LabelObj,
	MediaItemResponse,
	MediaItemType,
	ResolvedItemOrCollection,
} from '../content-pages.types';

import {
	GetCollectionTileByIdDocument,
	GetItemByExternalIdDocument,
	GetItemTileByIdDocument,
} from '~generated/graphql-db-types-avo';
import {
	CONTENT_PAGE_QUERIES,
	DEFAULT_AUDIO_STILL,
	MEDIA_PLAYER_BLOCKS,
} from '~modules/admin/content-pages/content-pages.consts';
import { ContentPageOverviewParams } from '~modules/admin/content-pages/dto/content-pages.dto';
import { MediaItemsDto } from '~modules/admin/content-pages/dto/resolve-media-grid-blocks.dto';
import { Organisation } from '~modules/admin/organisations/admin-organisations.types';
import { AdminOrganisationsService } from '~modules/admin/organisations/services/admin-organisations.service';
import { PlayerTicketService } from '~modules/admin/player-ticket/services/player-ticket.service';
import { DataService } from '~modules/data/services/data.service';
import { SpecialPermissionGroups } from '~shared/types/types';

@Injectable()
export class ContentPagesService {
	private logger: Logger = new Logger(ContentPagesService.name, { timestamp: true });
	private readonly avoOrHetArchief: string;
	private queries:
		| typeof CONTENT_PAGE_QUERIES[AvoOrHetArchief.avo]
		| typeof CONTENT_PAGE_QUERIES[AvoOrHetArchief.hetArchief];
	private fetchSearchQueryAvo: FetchSearchQueryFunctionAvo | null = null;

	constructor(
		@Inject(forwardRef(() => DataService)) protected dataService: DataService,
		protected configService: ConfigService,
		protected playerTicketService: PlayerTicketService,
		protected organisationsService: AdminOrganisationsService
	) {
		this.avoOrHetArchief = getConfig(this.configService, 'databaseApplicationType');
		this.queries = CONTENT_PAGE_QUERIES[this.avoOrHetArchief];
	}

	public setSearchQueryFunction(fetchSearchQuery: FetchSearchQueryFunctionAvo) {
		this.fetchSearchQueryAvo = fetchSearchQuery;
	}

	/**
	 * Adapt a space as returned by a typical graphQl response to our internal space data model
	 */
	public adaptContentPage(gqlContentPage: GqlContentPage): ContentPage | null {
		if (!gqlContentPage) {
			return null;
		}
		/* istanbul ignore next */
		return {
			id: gqlContentPage?.id,
			thumbnailPath: gqlContentPage?.thumbnail_path,
			title: gqlContentPage?.title,
			description: gqlContentPage?.description,
			seoDescription: gqlContentPage?.seo_description,
			metaDescription: gqlContentPage?.meta_description,
			path: gqlContentPage?.path,
			isPublic: gqlContentPage?.is_public,
			publishedAt: gqlContentPage?.published_at,
			publishAt: gqlContentPage?.publish_at,
			depublishAt: gqlContentPage?.depublish_at,
			createdAt: gqlContentPage?.created_at,
			updatedAt: gqlContentPage?.updated_at,
			isProtected: gqlContentPage?.is_protected,
			contentType: gqlContentPage?.content_type as ContentPageType,
			contentWidth: gqlContentPage?.content_width as ContentWidth,
			owner: this.adaptUser(
				(gqlContentPage as any)?.owner_profile || (gqlContentPage as any)?.profile
			),
			userProfileId: gqlContentPage?.user_profile_id,
			userGroupIds: gqlContentPage?.user_group_ids,
			content_blocks: (
				(gqlContentPage as any)?.content_blocks ||
				(gqlContentPage as any)?.contentBlockssBycontentId ||
				[]
			).map(this.adaptContentBlock),
			labels: (gqlContentPage?.content_content_labels || []).flatMap(
				(labelLink): ContentPageLabel[] => {
					return labelLink.map(
						(labelObj): ContentPageLabel => ({
							id: labelObj?.content_label?.id,
							content_type: gqlContentPage?.content_type as ContentPageType,
							label: labelObj?.content_label?.label,
							link_to: labelObj?.content_label?.link_to,
						})
					);
				}
			),
		};
	}

	public adaptContentBlock(contentBlock: GqlContentBlock): ContentBlock | null {
		if (!contentBlock) {
			return null;
		}
		/* istanbul ignore next */
		return {
			id: contentBlock?.id,
			content_block_type: contentBlock?.content_block_type,
			created_at: contentBlock?.created_at,
			updated_at: contentBlock?.updated_at,
			position: contentBlock?.position,
			variables: contentBlock?.variables,
		};
	}

	public adaptUser(gqlUser: GqlUser): ContentPageUser | null {
		if (!gqlUser) {
			return null;
		}
		const mergedUser = {
			gqlUser,
			...(gqlUser as GqlAvoUser)?.user,
		} as unknown as GqlHetArchiefUser & GqlAvoUser & GqlAvoUser['user'];
		/* istanbul ignore next */
		return {
			id: mergedUser?.id,
			fullName: mergedUser?.first_name + ' ' + mergedUser?.last_name,
			firstName: mergedUser?.first_name,
			lastName: mergedUser?.last_name,
			groupId: mergedUser?.role?.id || mergedUser?.group?.id,
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
		inputQuery: ContentPageOverviewParams,
		userGroupIds: string[]
	): Promise<IPagination<ContentPage> & { labelCounts: Record<string, number> }> {
		const {
			withBlock,
			contentType,
			labelIds,
			selectedLabelIds,
			orderProp,
			orderDirection,
			page,
			size,
		} = inputQuery;
		const now = new Date().toISOString();
		const variables = {
			limit: size,
			labelIds: compact(labelIds || []),
			offset: (page - 1) * size,
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
					...this.getLabelFilter(selectedLabelIds || []),
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
		if (response.errors) {
			throw new InternalServerErrorException({
				message: 'GraphQL has errors',
				additionalInfo: { response },
			});
		}
		const count =
			get(response, 'data.app_content_aggregate.aggregate.count') ||
			get(response, 'data.app_content_page_aggregate.aggregate.count') ||
			0;
		const contentPageLabels =
			get(response, 'data.app_content_labels') ||
			get(response, 'data.app_content_page_content_label') ||
			[];
		return {
			items:
				get(response, 'data.app_content') || get(response, 'data.app_content_page') || [],
			page,
			size,
			total: count,
			pages: Math.ceil(count / size),
			labelCounts: fromPairs(
				contentPageLabels.map((labelInfo: any): [number, number] => [
					get(labelInfo, 'id'),
					get(labelInfo, 'content_content_labels_aggregate.aggregate.count') ||
						get(labelInfo, 'content_page_content_label_aggregate.aggregate.count'),
				])
			),
		};
	}

	public async getContentPageByPath(path: string): Promise<ContentPage | null> {
		const response = await this.dataService.execute(this.queries.GetContentPageByPathDocument, {
			path,
		});
		const contentPage: GqlContentPage | undefined =
			get(response, 'data.cms_content[0]') || get(response, 'data.app_content_page[0]');

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
		userGroupIds: (string | number)[],
		contentType: string,
		labelIds: number[],
		selectedLabelIds: number[],
		orderProp: string,
		orderDirection: 'asc' | 'desc',
		offset = 0,
		limit: number
	): Promise<ContentPageOverviewResponse> {
		const now = new Date().toISOString();
		const variables = {
			limit,
			labelIds: compact(labelIds),
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
			orderBy: { [orderProp]: orderDirection },
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

	public async getContentPagesByIds(contentPageIds: string[]): Promise<Avo.ContentPage.Page[]> {
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
		if (!labelIds.length) {
			return [];
		}
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

	public async resolveMediaTileItemsInPage(contentPage: ContentPage, request: Request) {
		const mediaGridBlocks = contentPage.content_blocks.filter(
			(contentBlock) => contentBlock.content_block_type === 'MEDIA_GRID'
		);
		if (mediaGridBlocks.length) {
			await promiseUtils.mapLimit(mediaGridBlocks, 2, async (mediaGridBlock: any) => {
				try {
					const searchQuery = get(
						mediaGridBlock,
						'variables.blockState.searchQuery.value'
					);
					const searchQueryLimit = get(
						mediaGridBlock,
						'variables.blockState.searchQueryLimit'
					);
					const mediaItems = get(mediaGridBlock, 'variables.componentState', []).filter(
						(item: any) => item.mediaItem
					);

					const results: any[] = await this.resolveMediaTileItems(
						searchQuery,
						searchQueryLimit,
						mediaItems,
						request
					);

					set(mediaGridBlock, 'variables.blockState.results', results);
				} catch (err) {
					this.logger.error({
						message: 'Failed to resolve media grid content',
						innerException: err,
						additionalInfo: {
							mediaGridBlocks,
							mediaGridBlock,
						},
					});
				}
			});
		}
	}

	public async resolveMediaPlayersInPage(contentPage: ContentPage, request: Request) {
		const mediaPlayerBlocks = contentPage.content_blocks.filter((contentBlock) =>
			keys(MEDIA_PLAYER_BLOCKS).includes(contentBlock.content_block_type)
		);
		if (mediaPlayerBlocks.length) {
			await promiseUtils.mapLimit(mediaPlayerBlocks, 2, async (mediaPlayerBlock: any) => {
				try {
					const blockInfo = MEDIA_PLAYER_BLOCKS[mediaPlayerBlock.content_block_type];
					const externalId = get(mediaPlayerBlock, blockInfo.getItemExternalIdPath);
					if (externalId) {
						const itemInfo = await this.fetchItemByExternalId(externalId);
						let videoSrc: string | undefined;
						if (itemInfo && itemInfo.browse_path) {
							videoSrc = await this.playerTicketService.getPlayableUrl(
								itemInfo.browse_path,
								request.header('Referer') || 'http://localhost:3200/'
							);
						}

						// Copy all required properties to be able to render the video player without having to use the data route to fetch item information
						if (videoSrc && !get(mediaPlayerBlock, blockInfo.setVideoSrcPath)) {
							set(mediaPlayerBlock, blockInfo.setVideoSrcPath, videoSrc);
						}
						[
							['external_id', 'setItemExternalIdPath'],
							['thumbnail_path', 'setPosterSrcPath'],
							['title', 'setTitlePath'],
							['description', 'setDescriptionPath'],
							['issued', 'setIssuedPath'],
							['organisation', 'setOrganisationPath'],
							['duration', 'setDurationPath'],
						].forEach((props) => {
							if (
								itemInfo &&
								(itemInfo as any)[props[0]] &&
								!get(mediaPlayerBlock, (blockInfo as any)[props[1]])
							) {
								if (
									props[0] === 'thumbnail_path' &&
									itemInfo.type.label === 'audio'
								) {
									// Replace poster for audio items with default still
									set(
										mediaPlayerBlock,
										(blockInfo as any)[props[1]],
										DEFAULT_AUDIO_STILL
									);
								} else {
									set(
										mediaPlayerBlock,
										(blockInfo as any)[props[1]],
										(itemInfo as any)[props[0]]
									);
								}
							}
						});
					}
				} catch (err) {
					this.logger.error({
						message: 'Failed to resolve media grid content',
						innerException: err,
						additionalInfo: {
							mediaPlayerBlocks,
							mediaPlayerBlock,
						},
					});
				}
			});
		}
	}

	public async resolveMediaTileItems(
		searchQuery: string | undefined,
		searchQueryLimit: string | undefined,
		mediaItems: MediaItemsDto[] | undefined,
		request: Request
	): Promise<Partial<Avo.Item.Item | Avo.Collection.Collection>[]> {
		let manualResults: any[] = [];
		let searchResults: any[] = [];

		// Check for items/collections
		const nonEmptyMediaItems = mediaItems.filter((mediaItem) => !isEmpty(mediaItem));
		if (nonEmptyMediaItems.length) {
			manualResults = await promiseUtils.mapLimit(
				nonEmptyMediaItems,
				10,
				async (itemInfo) => {
					const result: MediaItemResponse | null = await this.fetchCollectionOrItem(
						itemInfo.mediaItem.type === MediaItemType.BUNDLE
							? MediaItemType.COLLECTION
							: itemInfo.mediaItem.type,
						itemInfo.mediaItem.value
					);
					if (result) {
						// Replace audio thumbnail
						if (get(result, 'type.label') === 'audio') {
							result.thumbnailUrl = DEFAULT_AUDIO_STILL;
						}

						// Set video play url
						if ((result as any).browse_path) {
							(result as any).src = await this.getPlayableUrlByBrowsePathSilent(
								(result as any).browse_path,
								request
							);
							delete (result as any).browse_path; // Do not expose browse_path to the world
						}
					}
					return result;
				}
			);
		}

		// Check for search queries
		if (searchQuery) {
			if (!this.fetchSearchQueryAvo) {
				this.logger.warn(
					'resolveMediaTileItems through search queries is not supported for this app. Use ContentPagesController.setSearchQueryFunction to enable it'
				);
				searchResults = [];
			}
			// resolve search query to a list of results
			const parsedSearchQuery = JSON.parse(searchQuery);
			let searchQueryLimitNum: number = parseInt(searchQueryLimit, 10);
			if (isNaN(searchQueryLimitNum)) {
				searchQueryLimitNum = 8;
			}
			const searchResponse = await this.fetchSearchQueryAvo(
				searchQueryLimitNum - manualResults.length, // Fetch less search results if the user already specified some manual results
				parsedSearchQuery.filters || {},
				parsedSearchQuery.orderProperty || 'relevance',
				parsedSearchQuery.orderDirection || 'desc'
			);
			searchResults = await promiseUtils.mapLimit(searchResponse.results || [], 8, (result) =>
				this.mapSearchResultToItemOrCollection(result, request)
			);
		}

		return [...manualResults, ...searchResults];
	}

	private async mapSearchResultToItemOrCollection(
		searchResult: SearchResultItem,
		request: Request
	): Promise<ResolvedItemOrCollection> {
		const isItem =
			searchResult.administrative_type === 'video' ||
			searchResult.administrative_type === 'audio';
		const isAudio = searchResult.administrative_type === 'audio';

		if (isItem) {
			const item = {
				external_id: searchResult.external_id,
				title: searchResult.dc_title,
				created_at: searchResult.dcterms_issued,
				description: searchResult.dcterms_abstract,
				duration: searchResult.duration_time,
				lom_classification: searchResult.lom_classification,
				lom_context: searchResult.lom_context,
				lom_intended_enduser_role: searchResult.lom_intended_enduser_role,
				lom_keywords: searchResult.lom_keywords,
				lom_languages: searchResult.lom_languages,
				lom_typical_age_range: searchResult.lom_typical_age_range,
				issued: searchResult.dcterms_issued,
				thumbnail_path: isAudio ? DEFAULT_AUDIO_STILL : searchResult.thumbnail_path,
				org_id: searchResult.original_cp_id,
				organisation: {
					name: searchResult.original_cp,
					or_id: searchResult.original_cp_id,
				} as Avo.Organization.Organization,
				series: searchResult.dc_titles_serie,
				type: {
					label: searchResult.administrative_type,
				} as any,
				view_counts_aggregate: {
					aggregate: {
						sum: {
							count: searchResult.views_count,
						},
					},
				},
			} as Partial<Avo.Item.Item> & { src?: string };
			if (isItem) {
				item.src = await this.getPlayableUrlByExternalIdSilent(
					searchResult.external_id,
					request
				);
			}
			try {
				// TODO cache logos for quicker access
				const org: Organisation = await this.organisationsService.getOrganisation(
					searchResult.original_cp_id
				);
				item.organisation.logo_url = org?.logo_url || null;
			} catch (err) {
				this.logger.error({
					message: 'Failed to set organization logo_url for item',
					innerException: err,
					additionalInfo: {
						external_id: searchResult.external_id,
						original_cp_id: searchResult.original_cp_id,
					},
				});
			}
			return item;
		}
		return {
			id: searchResult.id,
			title: searchResult.dc_title,
			created_at: searchResult.dcterms_issued,
			description: searchResult.dcterms_abstract,
			duration: searchResult.duration_time,
			lom_classification: searchResult.lom_classification,
			lom_context: searchResult.lom_context,
			lom_intended_enduser_role: searchResult.lom_intended_enduser_role,
			lom_keywords: searchResult.lom_keywords,
			lom_languages: searchResult.lom_languages,
			lom_typical_age_range: searchResult.lom_typical_age_range,
			issued: searchResult.dcterms_issued,
			thumbnail_path: searchResult.thumbnail_path,
			org_id: searchResult.original_cp_id,
			organisation: {
				name: searchResult.original_cp,
				or_id: searchResult.original_cp_id,
			} as Avo.Organization.Organization,
			series: searchResult.dc_titles_serie,
			type: {
				label: searchResult.administrative_type,
			} as Avo.Core.MediaType,
			collection_fragments_aggregate: {
				aggregate: {
					count: (searchResult as any).fragment_count || 0, // TODO add to typings repo after completion of: https://meemoo.atlassian.net/browse/AVO-1107
				},
			},
			view_counts_aggregate: {
				aggregate: {
					sum: {
						count: searchResult.views_count,
					},
				},
			},
		} as Partial<Avo.Collection.Collection>;
	}

	private async getPlayableUrlByExternalIdSilent(
		externalId: string,
		request: Request
	): Promise<string | null> {
		try {
			return (
				(await this.playerTicketService.getPlayableUrl(
					externalId,
					request.header('Referer') || 'http://localhost:8080/'
				)) || null
			);
		} catch (err) {
			this.logger.error({
				message: 'Failed to get playable url for item',
				innerException: err,
				additionalInfo: {
					externalId,
				},
			});
			return null;
		}
	}

	private async getPlayableUrlByBrowsePathSilent(
		browsePath: string,
		request: Request
	): Promise<string | null> {
		try {
			return (
				(await this.playerTicketService.getPlayableUrl(
					browsePath,
					request.header('Referer') || 'http://localhost:8080/'
				)) || null
			);
		} catch (err) {
			this.logger.error({
				message: 'Failed to get playable url for item',
				innerException: err,
				additionalInfo: {
					browsePath,
				},
			});
			return null;
		}
	}
}
