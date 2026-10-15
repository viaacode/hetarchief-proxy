import * as path from 'node:path';

import { TranslationsService } from '@meemoo/admin-core-api';
import { Controller, Get, Header, HttpCode, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs-extra';
import { escape as escapeHtml } from 'lodash';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { SessionUser } from '~shared/decorators/user.decorator';

@ApiTags('Not found')
@Controller('not-found')
export class NotFoundController {
	private notFoundTemplate: string | undefined;

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
		// Only cache the template, the title, message and language differ per request
		if (!this.notFoundTemplate) {
			const notFoundPagePath: string = path.join(__dirname, '../template/404.html');
			this.notFoundTemplate = (await fs.readFile(notFoundPagePath))
				.toString('utf8')
				.replace(/\{\{CLIENT_HOST\}\}/g, process.env.CLIENT_HOST);
		}
		const userLanguage = user.getLanguage();
		// The title and message come from the url, escape them to avoid html injection
		// Use a replacer function, so $ characters in the text are not treated as replacement patterns
		const pageTitle = escapeHtml(
			title ||
				this.translationsService.tText(
					'modules/not-found/controllers/not-found___404',
					null,
					userLanguage
				)
		);
		const pageMessage = escapeHtml(
			message ||
				this.translationsService.tText(
					'modules/not-found/controllers/not-found___sorry-deze-pagina-konden-we-niet-terugvinden-de-link-die-je-volgde-kan-stuk-zijn-of-de-pagina-kan-niet-meer-bestaan',
					null,
					userLanguage
				)
		);
		return this.notFoundTemplate
			.replace(/\{\{TITLE\}\}/g, () => pageTitle)
			.replace(/\{\{MESSAGE\}\}/g, () => pageMessage);
	}
}
