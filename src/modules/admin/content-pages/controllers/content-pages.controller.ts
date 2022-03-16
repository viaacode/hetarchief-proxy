import {
	Controller,
	Get,
	Headers,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	Req,
	Session,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';
import { get } from 'lodash';

import { ContentPage } from '../types';

import { ContentPagesQueryDto } from '~modules/admin/content-pages/dto/content-pages.dto';
import { ContentPagesService } from '~modules/admin/content-pages/services/content-pages.service';
import { SessionHelper } from '~shared/auth/session-helper';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('ContentPages')
@Controller('contentPages')
export class ContentPagesController {
	constructor(private contentPagesService: ContentPagesService) {}

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
			permissions.includes('EDIT_ANY_CONTENT_PAGES') ||
			(permissions.includes('EDIT_OWN_CONTENT_PAGES') &&
				contentPage.user_profile_id === userId);

		if (!contentPage) {
			return null;
		}

		// People that can edit the content page are not restricted by the publish_at, depublish_at, is_public settings
		if (!canEditContentPage) {
			if (
				contentPage.publish_at &&
				new Date().getTime() < new Date(contentPage.publish_at).getTime()
			) {
				return null; // Not yet published
			}

			if (
				contentPage.depublish_at &&
				new Date().getTime() > new Date(contentPage.depublish_at).getTime()
			) {
				throw new BadRequestError('The content page was depublished', null, {
					error: 'CONTENT_PAGE_DEPUBLISHED',
					contentPageType: get(contentPage, 'content_type'),
				});
			}

			if (!contentPage.is_public) {
				return null;
			}
		}

		// Check if content page is accessible for the user who requested the content page
		if (!intersection(contentPage.user_group_ids, getUserGroupIds(user)).length) {
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

	// @Get()
	// async getContentPageByPath(
	// 	@Query('path') path: string
	// ): Promise<ContentPage | { error: string }> {
	// 	let content: ContentPage | string = null;
	// 	try {
	// 		const user: User | null = SessionHelper.getAvoUserInfoFromSession(
	// 			this.context.request
	// 		);
	// 		content = await ContentPageController.getContentPageByPath(
	// 			path,
	// 			user,
	// 			this.context.request
	// 		);
	// 	} catch (err) {
	// 		if (get(err, 'innerException.additionalInfo.error') === 'CONTENT_PAGE_DEPUBLISHED') {
	// 			await this.context.response.status(403).json(
	// 				new NotFoundError('content page was depublished', null, {
	// 					...(err as CustomError).innerException.additionalInfo,
	// 				})
	// 			);
	// 			return;
	// 		}
	// 		logger.error(new InternalServerError('Failed to get content page', err));
	// 		throw new InternalServerError('Failed to get content page', null, { path });
	// 	}
	// 	if (content) {
	// 		return content;
	// 	}
	// 	throw new NotFoundError(
	// 		'The content page was not found or you do not have rights to see it',
	// 		null,
	// 		{ path }
	// 	);
	// }
	//
	// @Get('path-exist')
	// async doesContentPageExist(
	// 	@Query('path') path: string
	// ): Promise<{ exists: boolean; title: string; id: number }> {
	// 	try {
	// 		const contentPage = await ContentPageService.getContentPageByPath(path);
	// 		return {
	// 			exists: !!contentPage,
	// 			title: get(contentPage, 'title') || null,
	// 			id: get(contentPage, 'id', null),
	// 		};
	// 	} catch (err) {
	// 		throw new InternalServerError('Failed to get content page', null, { path });
	// 	}
	// }
	//
	// @Post('/overview')
	// async getContentPagesForOverview(
	// 	body: ContentPageOverviewParams
	// ): Promise<ContentPageOverviewResponse> {
	// 	try {
	// 		return ContentPageController.getContentPagesForOverview(
	// 			body.withBlock,
	// 			body.contentType,
	// 			body.labelIds,
	// 			body.selectedLabelIds,
	// 			body.orderByProp || 'published_at',
	// 			body.orderByDirection || 'desc',
	// 			body.offset,
	// 			body.limit,
	// 			IdpHelper.getAvoUserInfoFromSession(this.context.request)
	// 		);
	// 	} catch (err) {
	// 		logger.error(new InternalServerError('Failed to get content page for overview', err));
	// 		throw new InternalServerError('Failed to get content page for overview', null, {
	// 			body,
	// 		});
	// 	}
	// }
	//
	// /**
	//  * Resolves the objects (items, collections, bundles, search queries) that are references inside the media grid blocks to their actual objects
	//  * @param body
	//  * @Return Promise<any[]>: the media grid blocks with their content stored under the results property
	//  */
	// @Post('')
	// @UseGuards(LoggedInGuard)
	// async resolveMediaGridBlocks(body: {
	// 	searchQuery: string | undefined;
	// 	searchQueryLimit: string | undefined;
	// 	mediaItems:
	// 		| {
	// 				mediaItem: {
	// 					type: 'ITEM' | 'COLLECTION' | 'BUNDLE';
	// 					value: string;
	// 				};
	// 		  }[]
	// 		| undefined;
	// }): Promise<any[]> {
	// 	try {
	// 		const user = IdpHelper.getAvoUserInfoFromSession(this.context.request);
	// 		if (!user.profile.permissions.includes('SEARCH')) {
	// 			throw new UnauthorizedError(
	// 				'You do not have the required permission for this route'
	// 			);
	// 		}
	// 		return await ContentPageController.resolveMediaTileItems(
	// 			body.searchQuery,
	// 			body.searchQueryLimit,
	// 			body.mediaItems,
	// 			this.context.request
	// 		);
	// 	} catch (err) {
	// 		throw new NotFoundError(
	// 			'Something went wrong while resolving the media grid blocks',
	// 			err,
	// 			{ body }
	// 		);
	// 	}
	// }
	//
	// @UseGuards(ApiKeyGuard)
	// @Post('update-published-dates')
	// async updatePublishDates(): Promise<{ message: string }> {
	// 	try {
	// 		const response = await ContentPageController.updatePublishDates();
	//
	// 		return {
	// 			message: `content page publish dates have been updated, ${response.published} published, ${response.unpublished} unpublished`,
	// 		};
	// 	} catch (err) {
	// 		const error = new CustomError('Failed to update content page publish dates', err);
	// 		logger.error(error);
	// 		throw new InternalServerError(error.message);
	// 	}
	// }
	//
	// @Post('labels')
	// async getContentPageLabelsByTypeAndIds(body: ContentLabelsRequestBody): Promise<LabelObj[]> {
	// 	try {
	// 		if ((body as any).labelIds) {
	// 			return await ContentPageController.getContentPageLabelsByTypeAndIds(
	// 				body.contentType,
	// 				(body as any).labelIds
	// 			);
	// 		}
	//
	// 		// else labels query param is set
	// 		return await ContentPageController.getContentPageLabelsByTypeAndLabels(
	// 			body.contentType,
	// 			(body as any).labels
	// 		);
	// 	} catch (err) {
	// 		const error = new InternalServerError(
	// 			'Failed to get content page labels by type and labels or labelIds',
	// 			err,
	// 			{ body }
	// 		);
	// 		logger.error(error);
	// 		throw new InternalServerError(error.message, null, error.additionalInfo);
	// 	}
	// }
}
