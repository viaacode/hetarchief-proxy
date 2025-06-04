import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { IPagination } from '@studiohyperdrive/pagination';

import type { ContentPartnersQueryDto } from '../dto/content-partners.dto';
// biome-ignore lint/style/useImportType: We need the full class for dependency injection to work with nestJS
import { ContentPartnersService } from '../services/content-partners.service';
import type { ContentPartner } from '../types';

@ApiTags('Content-partners')
@Controller('content-partners')
export class ContentPartnersController {
	constructor(private contentPartnersService: ContentPartnersService) {}

	@Get()
	public async getContentPartners(
		@Query() queryDto: ContentPartnersQueryDto
	): Promise<IPagination<ContentPartner>> {
		return await this.contentPartnersService.getContentPartners(queryDto);
	}
}
