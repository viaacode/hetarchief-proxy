import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Headers,
	Logger,
	Param,
	Post,
	Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { Configuration } from '~config';

import { IeObjectMeemooIdentifiersQueryDto, IeObjectsQueryDto } from '../dto/ie-objects.dto';
import { checkAndFixFormatFilter } from '../helpers/check-and-fix-format-filter';
import { limitAccessToObjectDetails } from '../helpers/limit-access-to-object-details';
import { IeObjectsWithAggregations } from '../ie-objects.types';
import { IeObjectsService } from '../services/ie-objects.service';

import { TranslationsService } from '~modules/translations/services/translations.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Permission } from '~modules/users/types';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';

@ApiTags('Ie Objects')
@Controller('ie-objects')
export class IeObjectsController {
	private logger: Logger = new Logger(IeObjectsController.name, { timestamp: true });

	constructor(
		private ieObjectsService: IeObjectsService,
		private configService: ConfigService<Configuration>,
		private translationsService: TranslationsService
	) {}

	@Get('related/count')
	public async countRelated(
		@Query() countRelatedQuery: IeObjectMeemooIdentifiersQueryDto
	): Promise<Record<string, number>> {
		return this.ieObjectsService.countRelated(countRelatedQuery.meemooIdentifiers);
	}

	@Post(':esIndex')
	@ApiParam({ name: 'esIndex', example: 'or-154dn75' })
	@RequireAllPermissions(Permission.SEARCH_OBJECTS)
	public async getObjectOnIndex(
		@Headers('referer') referer: string,
		@Body() queryDto: IeObjectsQueryDto,
		@Param('esIndex') esIndex: string,
		@SessionUser() user: SessionUserEntity
	): Promise<IeObjectsWithAggregations> {
		// Check if the user can search in all index (meemoo admin)
		const canSearchInAllSpaces = user.has(Permission.SEARCH_ALL_OBJECTS);

		if (
			!canSearchInAllSpaces &&
			!(await this.ieObjectsService.userHasAccessToVisitorSpaceOrId(user, esIndex))
		) {
			throw new ForbiddenException(
				this.translationsService.t(
					'modules/media/controllers/media___you-do-not-have-access-to-this-visitor-space'
				)
			);
		}

		// Filter on format video should also include film format
		checkAndFixFormatFilter(queryDto);

		const searchResult = await this.ieObjectsService.findAll(
			queryDto,
			esIndex.toLowerCase(),
			referer,
			user
		);

		const userHasAccessToSpace =
			canSearchInAllSpaces ||
			(await this.ieObjectsService.userHasAccessToVisitorSpaceOrId(user, esIndex));

		if (this.configService.get('IGNORE_OBJECT_LICENSES')) {
			return searchResult;
		}

		return this.ieObjectsService.applyLicensesToSearchResult(
			searchResult,
			userHasAccessToSpace
		);
	}

	@Post()
	public async getIeObjects(
		@Headers('referer') referer: string,
		@Body() queryDto: IeObjectsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IeObjectsWithAggregations> {
		// Filter on format video should also include film format
		checkAndFixFormatFilter(queryDto);

		const searchResult = await this.ieObjectsService.findAll(queryDto, '_all', referer, user);

		if (this.configService.get('IGNORE_OBJECT_LICENSES')) {
			delete searchResult?.filters;
			return searchResult;
		}

		const licensedSearchResult = {
			...searchResult,
			items: searchResult.items.map((item) =>
				limitAccessToObjectDetails(item, {
					userId: user.getId() || null,
					isKeyUser: user.getIsKeyUser() || false,
					sector: null,
					groupId: user.getGroupId() || null,
					maintainerId: user.getMaintainerId() || null,
					accessibleObjectIdsThroughFolders: searchResult.filters.activeVisitsFolderIds,
					accessibleVisitorSpaceIds: searchResult.filters.activeVisitsVisitorSpaceIds,
				})
			),
		};
		delete licensedSearchResult.filters;

		return licensedSearchResult;
	}
}
