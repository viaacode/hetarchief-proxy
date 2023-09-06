import { DataModule, PlayerTicketModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { IeObjectsController } from './controllers/ie-objects.controller';
import { IeObjectsService } from './services/ie-objects.service';

import { EventsModule } from '~modules/events';
import { OrganisationsModule } from '~modules/organisations/organisations.module';
import { SpacesModule } from '~modules/spaces';
import { VisitsModule } from '~modules/visits';

@Module({
	controllers: [IeObjectsController],
	imports: [
		ConfigModule,
		DataModule,
		EventsModule,
		PlayerTicketModule,
		VisitsModule,
		OrganisationsModule,
		SpacesModule,
	],
	providers: [IeObjectsService],
	exports: [IeObjectsService],
})
export class IeObjectsModule {}
