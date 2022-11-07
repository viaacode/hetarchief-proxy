import { PlayerTicketModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';

import { CollectionsController } from './controllers/collections.controller';
import { CollectionsService } from './services/collections.service';

import { DataModule } from '~modules/data';
import { EventsModule } from '~modules/events';
import { MediaModule } from '~modules/media';
import { VisitsModule } from '~modules/visits';

@Module({
	controllers: [CollectionsController],
	imports: [
		forwardRef(() => DataModule),
		PlayerTicketModule,
		MediaModule,
		EventsModule,
		VisitsModule,
	],
	providers: [CollectionsService],
	exports: [CollectionsService],
})
export class CollectionsModule {}
