import { DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';

import { ContentPartnersController } from './controllers/content-partners.controller';
import { ContentPartnersService } from './services/content-partners.service';

@Module({
	controllers: [ContentPartnersController],
	imports: [DataModule],
	providers: [ContentPartnersService],
})
export class ContentPartnersModule {}
