import { DataModule, PlayerTicketModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';

import { CollectionsController } from './controllers/collections.controller';
import { CollectionsService } from './services/collections.service';

import { EventsModule } from '~modules/events';
import { IeObjectsModule } from '~modules/ie-objects';
import { VisitsModule } from '~modules/visits';

@Module({
	controllers: [CollectionsController],
	imports: [
		forwardRef(() => DataModule),
		PlayerTicketModule,
		IeObjectsModule,
		EventsModule,
		VisitsModule,
	],
	providers: [CollectionsService],
	exports: [CollectionsService],
})
export class CollectionsModule {}
