import { Module } from '@nestjs/common';

import { ContentPartnersController } from './controllers/content-partners.controller';
import { ContentPartnersService } from './services/content-partners.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [ContentPartnersController],
	imports: [DataModule],
	providers: [ContentPartnersService],
})
export class ContentPartnersModule {}
