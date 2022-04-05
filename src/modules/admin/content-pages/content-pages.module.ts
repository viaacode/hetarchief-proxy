import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ContentPagesController } from './controllers/content-pages.controller';
import { ContentPagesService } from './services/content-pages.service';

import { OrganisationsModule } from '~modules/admin/organisations/organisations.module';
import { PlayerTicketModule } from '~modules/admin/player-ticket/player-ticket.module';
import { DataModule } from '~modules/data';

@Module({
	controllers: [ContentPagesController],
	imports: [DataModule, ConfigModule, PlayerTicketModule, OrganisationsModule],
	providers: [ContentPagesService, ConfigService],
	exports: [ContentPagesService],
})
export class ContentPagesModule {}
