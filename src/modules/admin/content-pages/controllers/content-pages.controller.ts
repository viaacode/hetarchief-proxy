import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Logger,
	Post,
	Query,
	Req,
	Session,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';
import { get, intersection } from 'lodash';

import { ContentPage, LabelObj } from '../content-pages.types';

import { ContentLabelsRequestDto } from '~modules/admin/content-pages/dto/content-labels-request.dto';
import { ContentPagesQueryDto } from '~modules/admin/content-pages/dto/content-pages.dto';
import { ResolveMediaGridBlocksDto } from '~modules/admin/content-pages/dto/resolve-media-grid-blocks.dto';
import { ContentPagesService } from '~modules/admin/content-pages/services/content-pages.service';
import { Permission } from '~modules/users/types';
import { SessionHelper } from '~shared/auth/session-helper';
import { SessionUser } from '~shared/decorators/user.decorator';
import { ApiKeyGuard } from '~shared/guards/api-key.guard';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('ContentPages')
@Controller('admin/content-pages')
export class ContentPagesController {
	private logger: Logger = new Logger(ContentPagesController.name, { timestamp: true });

	constructor(private contentPagesService: ContentPagesService) {}

	@Post('overview')
	public async getContentPagesForOverview(
		@Query() queryDto: ContentPagesQueryDto
	): Promise<IPagination<ContentPage>> {
		const contentPages = await this.contentPagesService.getContentPagesForOverview(queryDto);
		return contentPages;
	}

	@Get('')
	@ApiOperation({
		summary: 'Get content page by its path',
	})
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
		await this.contentPagesService.resolveMediaTileItemsInPage(contentPage, request);

		// Check if content page contains any media player content blocks (eg: mediaplayer, mediaPlayerTitleTextButton, hero)
		if (request) {
			await this.contentPagesService.resolveMediaPlayersInPage(contentPage, request);
		}

		return contentPage;
	}

	@Get('path-exist')
	async doesContentPageExist(
		@Query('path') path: string
	): Promise<{ exists: boolean; title: string; id: number }> {
		const contentPage = await this.contentPagesService.getContentPageByPath(path);
		return {
			exists: !!contentPage,
			title: get(contentPage, 'title') || null,
			id: get(contentPage, 'id', null),
		};
	}

	@Post('')
	@ApiOperation({
		summary:
			'Resolves the objects (items, collections, bundles, search queries) that are references inside the media grid blocks to their actual objects',
	})
	@ApiResponse({
		status: 200,
		description: 'the media grid blocks with their content stored under the results property',
		type: Array,
	})
	@UseGuards(LoggedInGuard)
	async resolveMediaGridBlocks(
		body: ResolveMediaGridBlocksDto,
		@SessionUser() user,
		@Req() request
	): Promise<any[]> {
		const permissions = get(user, 'profile.permissions') || get(user, 'permissions');
		if (!permissions.includes(Permission.SEARCH)) {
			throw new UnauthorizedException(
				'You do not have the required permission for this route'
			);
		}
		return await this.contentPagesService.resolveMediaTileItems(
			body.searchQuery,
			body.searchQueryLimit,
			body.mediaItems,
			request
		);
	}

	@Post('update-published-dates')
	@UseGuards(ApiKeyGuard)
	async updatePublishDates(): Promise<{ message: string }> {
		const response = await this.contentPagesService.updatePublishDates();

		return {
			message: `content page publish dates have been updated, ${response.published} published, ${response.unpublished} unpublished`,
		};
	}

	@Post('labels')
	async getContentPageLabelsByTypeAndIds(
		@Body() body: ContentLabelsRequestDto
	): Promise<LabelObj[]> {
		if ((body as any).labelIds) {
			return await this.contentPagesService.getContentPageLabelsByTypeAndIds(
				body.contentType,
				(body as any).labelIds
			);
		}

		// else labels query param is set
		return await this.contentPagesService.getContentPageLabelsByTypeAndLabels(
			body.contentType,
			(body as any).labels
		);
	}
}