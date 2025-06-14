import * as path from 'node:path';

import { TranslationsService } from '@meemoo/admin-core-api';
import { Controller, Get, Header, HttpCode, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs-extra';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { SessionUser } from '~shared/decorators/user.decorator';

@ApiTags('Not found')
@Controller('not-found')
export class NotFoundController {
	private notFoundHtml: string;

	constructor(private readonly translationsService: TranslationsService) {}

	@ApiOperation({
		description: 'Returns a not found 404 page with 404 http code',
	})
	@Get('/')
	@Header('content-type', 'text/html')
	@HttpCode(404)
	async getNotFoundPage(
		@Query('message') message: string | undefined,
		@Query('title') title: string | undefined,
		@SessionUser() user: SessionUserEntity
	): Promise<string> {
		if (!this.notFoundHtml) {
			const notFoundPagePath: string = path.join(__dirname, '../template/404.html');
			this.notFoundHtml = (await fs.readFile(notFoundPagePath)).toString('utf8');
			const userLanguage = user.getLanguage();
			this.notFoundHtml = this.notFoundHtml
				.replace(/\{\{CLIENT_HOST\}\}/g, process.env.CLIENT_HOST)
				.replace(
					/\{\{TITLE\}\}/g,
					title ||
						this.translationsService.tText(
							'modules/not-found/controllers/not-found___404',
							null,
							userLanguage
						)
				)
				.replace(
					/\{\{MESSAGE\}\}/g,
					message ||
						this.translationsService.tText(
							'modules/not-found/controllers/not-found___sorry-deze-pagina-konden-we-niet-terugvinden-de-link-die-je-volgde-kan-stuk-zijn-of-de-pagina-kan-niet-meer-bestaan',
							null,
							userLanguage
						)
				);
		}
		return this.notFoundHtml;
	}
}
