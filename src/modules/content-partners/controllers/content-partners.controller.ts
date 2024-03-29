import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';

import { ContentPartnersQueryDto } from '../dto/content-partners.dto';
import { ContentPartnersService } from '../services/content-partners.service';
import { ContentPartner } from '../types';

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
