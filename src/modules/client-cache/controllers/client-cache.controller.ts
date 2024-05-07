import { LanguageCode } from '@meemoo/admin-core-api';
import { Controller, Headers, Post, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import got from 'got';
import { stringifyUrl } from 'query-string';

import { Configuration } from '~config';

import { Permission } from '~modules/users/types';
import { RequireAnyPermissions } from '~shared/decorators/require-any-permissions.decorator';
import { APIKEY } from '~shared/guards/api-key.guard';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@ApiTags('Client Cache')
@Controller('client-cache')
export class ClientCacheController {
	constructor(private configService: ConfigService<Configuration>) {}

	@ApiOperation({
		description: 'Clears the nextjs cache for a specific page',
	})
	@Post('clear-cache')
	@UseGuards(LoggedInGuard)
	@RequireAnyPermissions(Permission.EDIT_ANY_CONTENT_PAGES, Permission.EDIT_OWN_CONTENT_PAGES)
	async getOrganisationElementsForUser(
		@Query('language') language: LanguageCode,
		@Query('path') path: string,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		@Headers(APIKEY) apikey: string
	): Promise<{ message: string }> {
		const clientHost: string = this.configService.get('CLIENT_HOST');
		const clientApiKey: string = this.configService.get('CLIENT_API_KEY');

		return got
			.post({
				url: stringifyUrl({
					url: clientHost + '/api/clear-cache',
					query: {
						language,
						path,
					},
				}),
				headers: {
					apikey: clientApiKey, // Hide client api key in the backend, backend can check permissions for currently logged in user
				},
			})
			.json();
	}
}
