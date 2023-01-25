import { Body, Controller, ForbiddenException, Headers, Logger, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { Configuration } from '~config';

import { ObjectsQueryDto } from '../dto/objects.dto';
import { ObjectWithAggregations } from '../objects.types';
import { ObjectsService } from '../services/objects.service';

import { TranslationsService } from '~modules/translations/services/translations.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Permission } from '~modules/users/types';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';

@ApiTags('Objects')
@Controller('objects')
export class ObjectsController {
	private logger: Logger = new Logger(ObjectsController.name, { timestamp: true });

	constructor(
		private objectsService: ObjectsService,
		private configService: ConfigService<Configuration>,
		private translationsService: TranslationsService
	) {}

	@Post(':esIndex')
	@ApiParam({ name: 'esIndex', example: 'or-154dn75' })
	@RequireAllPermissions(Permission.SEARCH_OBJECTS)
	public async getObjectOnIndex(
		@Headers('referer') referer: string,
		@Body() queryDto: ObjectsQueryDto,
		@Param('esIndex') esIndex: string,
		@SessionUser() user: SessionUserEntity
	): Promise<ObjectWithAggregations> {
		// Check if the user can search in all index (meemoo admin)
		const canSearchInAllSpaces = user.has(Permission.SEARCH_ALL_OBJECTS);

		if (
			!canSearchInAllSpaces &&
			!(await this.objectsService.userHasAccessToVisitorSpaceOrId(user, esIndex))
		) {
			throw new ForbiddenException(
				this.translationsService.t(
					'modules/media/controllers/media___you-do-not-have-access-to-this-visitor-space'
				)
			);
		}

		// Filter on format video should also include film format
		this.objectsService.checkAndFixFormatFilter(queryDto);

		const searchResult = await this.objectsService.findAll(
			queryDto,
			esIndex.toLowerCase(),
			referer
		);

		const userHasAccessToSpace =
			canSearchInAllSpaces ||
			(await this.objectsService.userHasAccessToVisitorSpaceOrId(user, esIndex));

		if (this.configService.get('IGNORE_OBJECT_LICENSES')) {
			return searchResult;
		}

		return this.objectsService.applyLicensesToSearchResult(searchResult, userHasAccessToSpace);
	}
}
