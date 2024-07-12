import { DataModule, PlayerTicketModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';

import { FoldersController } from './controllers/folders.controller';
import { FoldersService } from './services/folders.service';

import { EventsModule } from '~modules/events';
import { IeObjectsModule } from '~modules/ie-objects';
import { VisitsModule } from '~modules/visits';

@Module({
	controllers: [FoldersController],
	imports: [
		forwardRef(() => DataModule),
		PlayerTicketModule,
		IeObjectsModule,
		EventsModule,
		VisitsModule,
	],
	providers: [FoldersService],
	exports: [FoldersService],
})
export class FoldersModule {}
