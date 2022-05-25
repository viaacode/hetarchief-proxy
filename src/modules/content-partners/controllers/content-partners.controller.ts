import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPagination } from '@studiohyperdrive/pagination';

import { ContentPartnersQueryDto } from '../dto/content-partners.dto';
import { ContentPartnersService } from '../services/content-partners.service';
import { ContentPartner } from '../types';

import { Permission } from '~modules/users/types';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';

@ApiTags('Content-partners')
@Controller('content-partners')
@RequireAllPermissions(Permission.UPDATE_ALL_SPACES)
export class ContentPartnersController {
	private logger: Logger = new Logger(ContentPartnersController.name, { timestamp: true });

	constructor(private contentPartnersService: ContentPartnersService) {}

	@Get()
	public async getContentPartners(
		@Query() queryDto: ContentPartnersQueryDto
	): Promise<IPagination<ContentPartner>> {
		const contentPartners = await this.contentPartnersService.getContentPartners(queryDto);
		return contentPartners;
	}
}
