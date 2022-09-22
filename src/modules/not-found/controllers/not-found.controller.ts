import * as path from 'path';

import { Controller, Get, Header, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs-extra';

@ApiTags('Not found')
@Controller('not-found')
export class NotFoundController {
	private notFoundHtml: string;

	@ApiOperation({
		description: 'Returns a not found 404 page with 404 http code',
	})
	@Get('/')
	@Header('content-type', 'text/html')
	@HttpCode(404)
	async getNotFoundPage(): Promise<string> {
		if (!this.notFoundHtml) {
			const notFoundPagePath: string = path.join(__dirname, '../template/404.html');
			this.notFoundHtml = (await fs.readFile(notFoundPagePath)).toString('utf8');
			this.notFoundHtml = this.notFoundHtml.replace(
				/\{\{CLIENT_HOST\}\}/g,
				process.env.CLIENT_HOST
			);
		}
		return this.notFoundHtml;
	}
}
