import {
	BadRequestException,
	Controller,
	Delete,
	InternalServerErrorException,
	Logger,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Avo } from '@viaa/avo2-types';

import { AssetsService } from '~modules/assets/services/assets.service';
import { AssetFileType } from '~modules/assets/types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { SessionUser } from '~shared/decorators/user.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

// @UseGuards(LoggedInGuard)
@ApiTags('Permissions')
@Controller('admin/permissions')
// @RequireAllPermissions(Permission.EDIT_PERMISSION_GROUPS)
export class AssetsController {
	private logger: Logger = new Logger(AssetsController.name, { timestamp: true });

	constructor(private assetsService: AssetsService) {}

	/**
	 * Upload a file to the asset server and track it in the asset table in graphql
	 */
	@Post('upload')
	@UseGuards(LoggedInGuard)
	async uploadAsset(
		@Req() request: Request & { files: Express.Multer.File[] }
	): Promise<{ url: string }> {
		if (!request.files || !request.files.length) {
			throw new BadRequestException('The request should contain some files to upload');
		}

		try {
			return {
				url: await this.assetsService.upload(
					AssetFileType.CONTENT_PAGE_IMAGE,
					request.files[0]
				),
			};
		} catch (err) {
			const error = new InternalServerErrorException({
				message: 'Failed to upload file to asset server',
				innerException: err,
				additionalInfo: {
					files: request?.files,
				},
			});
			this.logger.error(error);
			throw error;
		}
	}

	/**
	 * Delete a file from the asset server and remove it from the asset table in graphql
	 */
	@Delete('delete')
	@UseGuards(LoggedInGuard)
	async deleteAsset(body: { url: string }): Promise<{ status: 'deleted' } | BadRequestException> {
		if (!body || !body.url) {
			throw new BadRequestException(
				'the body must contain the url of the to-be-deleted asset  {url: string}'
			);
		}

		try {
			await this.assetsService.delete(body.url);
			return { status: 'deleted' };
		} catch (err) {
			const error = new InternalServerErrorException({
				message: 'Failed to delete asset file',
				innerException: err,
				additionalInfo: {
					body,
				},
			});
			this.logger.error(error);
			throw error;
		}
	}
}
