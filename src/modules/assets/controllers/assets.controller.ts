import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Inject,
	InternalServerErrorException,
	Logger,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { DeleteAssetDto } from '~modules/assets/dto/assets.dto';
import { AssetsService } from '~modules/assets/services/assets.service';
import { AssetFileType } from '~modules/assets/types';
import { TranslationsService } from '~modules/translations/services/translations.service';
import { Permission } from '~modules/users/types';
import { RequireAnyPermissions } from '~shared/decorators/require-any-permissions.decorator';
import { LoggedInGuard } from '~shared/guards/logged-in.guard';

@UseGuards(LoggedInGuard)
@ApiTags('Assets')
@Controller('assets')
@RequireAnyPermissions(Permission.EDIT_ANY_CONTENT_PAGES, Permission.EDIT_OWN_CONTENT_PAGES)
export class AssetsController {
	private logger: Logger = new Logger(AssetsController.name, { timestamp: true });

	constructor(
		private assetsService: AssetsService,
		private readonly translationsService: TranslationsService
	) {}

	/**
	 * Upload a file to the asset server and track it in the asset table in graphql
	 */
	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	@ApiOperation({
		description: 'Upload a file and get back a url',
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@UseGuards(LoggedInGuard)
	@RequireAnyPermissions(Permission.EDIT_ANY_CONTENT_PAGES, Permission.EDIT_OWN_CONTENT_PAGES)
	async uploadAsset(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
		if (!file) {
			throw new BadRequestException(
				this.translationsService.t(
					'modules/assets/controllers/assets___the-request-should-contain-a-file-to-upload'
				)
			);
		}

		try {
			return {
				url: await this.assetsService.upload(AssetFileType.CONTENT_PAGE_IMAGE, file),
			};
		} catch (err) {
			const error = new InternalServerErrorException({
				message: 'Failed to upload file to asset server',
				innerException: err,
				additionalInfo: {
					file: {
						...file,
						buffer: '<<omitted>>',
					},
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
	async deleteAsset(
		@Body() deleteAssetDto: DeleteAssetDto
	): Promise<{ status: 'deleted' } | BadRequestException> {
		try {
			await this.assetsService.delete(deleteAssetDto.url);
			return { status: 'deleted' };
		} catch (err) {
			const error = new InternalServerErrorException({
				message: 'Failed to delete asset file',
				innerException: err,
				additionalInfo: {
					body: deleteAssetDto,
				},
			});
			this.logger.error(error);
			throw error;
		}
	}
}
