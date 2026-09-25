import {
	ContentPagesModule,
	DataModule,
	PlayerTicketModule,
	VideoStillsModule,
} from '@meemoo/admin-core-api';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { IeObjectsDebugController } from './controllers/ie-objects-debug.controller';
import { IeObjectsController } from './controllers/ie-objects.controller';
import { IeObjectsService } from './services/ie-objects.service';
import { PlayableDisplayDataService } from './services/playable-display-data.service';

import { EventsModule } from '~modules/events';
import { OrganisationsModule } from '~modules/organisations/organisations.module';
import { SpacesModule } from '~modules/spaces';
import { UsersModule } from '~modules/users';
import { VisitsModule } from '~modules/visits';

@Module({
	controllers: [IeObjectsDebugController, IeObjectsController],
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
		UsersModule,
		CacheModule.register({
			max: 1000,
		}),
	],
	providers: [IeObjectsService, PlayableDisplayDataService, IeObjectsController],
	exports: [IeObjectsService, PlayableDisplayDataService, IeObjectsController],
})
export class IeObjectsModule {}
