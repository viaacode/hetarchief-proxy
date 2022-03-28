import {
	BadRequestException,
	Controller,
	Get,
	Logger,
	Post,
	Query,
	Req,
	Session,
	UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';
import { Avo } from '@viaa/avo2-types';
import { SearchResultItem } from '@viaa/avo2-types/types/search';
import * as promiseUtils from 'blend-promise-utils';
import { Request } from 'express';
import { get, intersection, isEmpty, keys, set } from 'lodash';

import {
	ContentPage,
	LabelObj,
	MediaItemResponse,
	ResolvedItemOrCollection,
} from '../content-pages.types';

import {
	DEFAULT_AUDIO_STILL,
	MEDIA_PLAYER_BLOCKS,
} from '~modules/admin/content-pages/content-pages.consts';
import { ContentPagesQueryDto } from '~modules/admin/content-pages/dto/content-pages.dto';
import { ContentPagesService } from '~modules/admin/content-pages/services/content-pages.service';
import { PlayerTicketService } from '~modules/admin/player-ticket/services/player-ticket.service';
import { Permission } from '~modules/users/types';
import { SessionHelper } from '~shared/auth/session-helper';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('ContentPages')
@Controller('contentPages')
export class ContentPagesController {
	private logger: Logger = new Logger(ContentPagesController.name, { timestamp: true });

	constructor(
		private contentPagesService: ContentPagesService,
		private configService: ConfigService,
		private playerTicketService: PlayerTicketService
	) {}

	@Post('/overview')
	public async getContentPagesForOverview(
		@Query() queryDto: ContentPagesQueryDto
	): Promise<IPagination<ContentPage>> {
		const contentPages = await this.contentPagesService.getContentPagesForOverview(queryDto);
		return contentPages;
	}

	@Get('')
	public async getContentPageByPath(
		@Query('path') path: string,
		@Req() request,
		@Session() session
	): Promise<ContentPage> {
		const user = SessionHelper.getArchiefUserInfo(session);
		const contentPage: ContentPage | undefined =
			await this.contentPagesService.getContentPageByPath(path);

		const permissions = get(user, 'permissions', []);
		const userId = get(user, 'id', []);
		const canEditContentPage =
			permissions.includes(Permission.EDIT_ANY_CONTENT_PAGES) ||
			(permissions.includes(Permission.EDIT_OWN_CONTENT_PAGES) &&
				contentPage.owner.id === userId);

		if (!contentPage) {
			return null;
		}

		// People that can edit the content page are not restricted by the publish_at, depublish_at, is_public settings
		if (!canEditContentPage) {
			if (
				contentPage.publishAt &&
				new Date().getTime() < new Date(contentPage.publishAt).getTime()
			) {
				return null; // Not yet published
			}

			if (
				contentPage.depublishAt &&
				new Date().getTime() > new Date(contentPage.depublishAt).getTime()
			) {
				throw new BadRequestException({
					message: 'The content page was depublished',
					additionalInfo: {
						code: 'CONTENT_PAGE_DEPUBLISHED',
						contentPageType: get(contentPage, 'content_type'),
					},
				});
			}

			if (!contentPage.isPublic) {
				return null;
			}
		}

		// Check if content page is accessible for the user who requested the content page
		if (!intersection(contentPage.userGroupIds, SessionHelper.getUserGroupIds(user)).length) {
			return null;
		}

		// Check if content page contains any search query content bocks (eg: media grids)
		await this.resolveMediaTileItemsInPage(contentPage, request);

		// Check if content page contains any media player content blocks (eg: mediaplayer, mediaPlayerTitleTextButton, hero)
		if (request) {
			await this.resolveMediaPlayersInPage(contentPage, request);
		}

		return contentPage;
	}

	private async resolveMediaTileItemsInPage(contentPage: ContentPage, request: Request) {
		const mediaGridBlocks = contentPage.contentBlocks.filter(
			(contentBlock) => contentBlock.blockType === 'MEDIA_GRID'
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

	private async resolveMediaPlayersInPage(contentPage: ContentPage, request: Request) {
		const mediaPlayerBlocks = contentPage.contentBlocks.filter((contentBlock) =>
			keys(MEDIA_PLAYER_BLOCKS).includes(contentBlock.blockType)
		);
		if (mediaPlayerBlocks.length) {
			await promiseUtils.mapLimit(mediaPlayerBlocks, 2, async (mediaPlayerBlock: any) => {
				try {
					const blockInfo = MEDIA_PLAYER_BLOCKS[mediaPlayerBlock.content_block_type];
					const externalId = get(mediaPlayerBlock, blockInfo.getItemExternalIdPath);
					if (externalId) {
						const itemInfo = await this.contentPagesService.fetchItemByExternalId(
							externalId
						);
						let videoSrc: string | undefined;
						if (itemInfo && itemInfo.browse_path) {
							videoSrc = await this.playerTicketService.getPlayableUrl(
								itemInfo.browse_path,
								await SessionHelper.getIp(request),
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
		mediaItems:
			| {
					mediaItem: {
						type: 'ITEM' | 'COLLECTION' | 'BUNDLE';
						value: string;
					};
			  }[]
			| undefined,
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
				async (itemInfo: {
					mediaItem: {
						type: 'ITEM' | 'COLLECTION' | 'BUNDLE';
						value: string;
					};
				}) => {
					const result: MediaItemResponse | null =
						await this.contentPagesService.fetchCollectionOrItem(
							itemInfo.mediaItem.type === 'BUNDLE'
								? 'COLLECTION'
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
			// resolve search query to a list of results
			const parsedSearchQuery = JSON.parse(searchQuery);
			let searchQueryLimitNum: number = parseInt(searchQueryLimit, 10);
			if (isNaN(searchQueryLimitNum)) {
				searchQueryLimitNum = 8;
			}
			const searchResponse = await this.contentPagesService.fetchSearchQuery(
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
				const org = await OrganisationService.fetchOrganization(
					searchResult.original_cp_id
				);
				item.organisation.logo_url = get(org, 'logo_url') || null;
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
					await SessionHelper.getIp(request),
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
					await SessionHelper.getIp(request),
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

	private async updatePublishDates() {
		return this.contentPagesService.updatePublishDates();
	}

	private async getContentPageLabelsByTypeAndLabels(
		contentType: string,
		labels: string[]
	): Promise<LabelObj[]> {
		return this.contentPagesService.getContentPageLabelsByTypeAndLabels(contentType, labels);
	}

	private async getContentPageLabelsByTypeAndIds(
		contentType: string,
		labelIds: string[]
	): Promise<LabelObj[]> {
		return this.contentPagesService.getContentPageLabelsByTypeAndIds(contentType, labelIds);
	}
}
