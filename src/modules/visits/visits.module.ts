import { AdminTranslationsModule, DataModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { VisitsController } from './controllers/visits.controller';
import { VisitsService } from './services/visits.service';

import { EventsModule } from '~modules/events';
import { NotificationsModule } from '~modules/notifications';
import { SpacesModule } from '~modules/spaces';

@Module({
	controllers: [VisitsController],
	imports: [
		DataModule,
		SpacesModule,
		ConfigModule,
		forwardRef(() => NotificationsModule),
		EventsModule,
		AdminTranslationsModule,
	],
	providers: [VisitsService],
	exports: [VisitsService],
})
export class VisitsModule {}
