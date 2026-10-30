import {
	BadRequestException,
	Controller,
	Get,
	HttpStatus,
	Param,
	ParseIntPipe,
	Query,
	Res,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { ImageQueryDto } from '~modules/images/dto/images.dto';
import { IMAGE_WIDTHS } from '~modules/images/images.consts';
import { ImagesService } from '~modules/images/services/images.service';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
	constructor(private imagesService: ImagesService) {}

	@Get(':width')
	@ApiOperation({
		description:
			'Returns a resized webp version of an image on the asset server. Redirects to the cached copy on the asset server if it exists, or to the original image if resizing fails.',
	})
	@ApiParam({ name: 'width', enum: IMAGE_WIDTHS })
	public async getImage(
		@Param('width', ParseIntPipe) width: number,
		@Query() query: ImageQueryDto,
		@Res() res: Response
	): Promise<void> {
		if (!this.imagesService.isAllowedWidth(width)) {
			throw new BadRequestException(`Width must be one of: ${IMAGE_WIDTHS.join(', ')}`);
		}
		const sourceUrl = this.imagesService.parseSourceUrl(query.url);
		if (!sourceUrl) {
			throw new BadRequestException('Url must point to an image on one of the asset servers');
		}

		const image = await this.imagesService.getImage(width, sourceUrl);

		res.setHeader('Cache-Control', image.cacheControl);
		// Images are loaded from the client domain, helmet only allows same-origin by default
		res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
		if (image.type === 'redirect') {
			res.redirect(HttpStatus.FOUND, image.url);
			return;
		}
		res.setHeader('Content-Type', 'image/webp');
		res.send(image.buffer);
	}
}
