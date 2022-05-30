import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ContentPagesController } from './controllers/content-pages.controller';
import { ContentPagesService } from './services/content-pages.service';

import { AdminOrganisationsModule } from '~modules/admin/organisations/admin-organisations.module';
import { PlayerTicketModule } from '~modules/admin/player-ticket/player-ticket.module';
import { DataModule } from '~modules/data';

@Module({
	controllers: [ContentPagesController],
	imports: [
		ConfigModule,
		PlayerTicketModule,
		AdminOrganisationsModule,
		forwardRef(() => DataModule),
	],
	providers: [ContentPagesService, ConfigService],
	exports: [ContentPagesService],
})
export class ContentPagesModule {}
