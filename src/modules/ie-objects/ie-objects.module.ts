import {
	ContentPagesModule,
	DataModule,
	PlayerTicketModule,
	VideoStillsModule,
} from '@meemoo/admin-core-api';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { IeObjectsController } from './controllers/ie-objects.controller';
import { IeObjectsService } from './services/ie-objects.service';
import { PlayableDisplayDataService } from './services/playable-display-data.service';

import { EventsModule } from '~modules/events';
import { OrganisationsModule } from '~modules/organisations/organisations.module';
import { SpacesModule } from '~modules/spaces';
import { VisitsModule } from '~modules/visits';

@Module({
	controllers: [IeObjectsController],
	imports: [
		ConfigModule,
		ContentPagesModule,
		DataModule,
		EventsModule,
		PlayerTicketModule,
		VisitsModule,
		VideoStillsModule,
		OrganisationsModule,
		SpacesModule,
		CacheModule.register({
			max: 1000,
		}),
	],
	providers: [IeObjectsService, PlayableDisplayDataService, IeObjectsController],
	exports: [IeObjectsService, PlayableDisplayDataService, IeObjectsController],
})
export class IeObjectsModule {}
