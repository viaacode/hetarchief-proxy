import { Body, Controller, ForbiddenException, Headers, Logger, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { Configuration } from '~config';

import { IeObjectsQueryDto } from '../dto/ie-objects.dto';
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
		this.ieObjectsService.checkAndFixFormatFilter(queryDto);

		const searchResult = await this.ieObjectsService.findAll(
			queryDto,
			esIndex.toLowerCase(),
			referer
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
}