import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { VisitsController } from './controllers/visits.controller';
import { VisitsService } from './services/visits.service';

import { DataModule } from '~modules/data';
import { EventsModule } from '~modules/events';
import { NotificationsModule } from '~modules/notifications';
import { SpacesModule } from '~modules/spaces';
import { TranslationsModule } from '~modules/translations';

@Module({
	controllers: [VisitsController],
	imports: [
		DataModule,
		SpacesModule,
		ConfigModule,
		forwardRef(() => NotificationsModule),
		EventsModule,
		TranslationsModule,
	],
	providers: [VisitsService],
	exports: [VisitsService],
})
export class VisitsModule {}
