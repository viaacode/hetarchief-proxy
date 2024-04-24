import {
	AdminTranslationsModule,
	DataModule,
	MaintenanceAlertsModule,
} from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';

import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { VisitsModule } from '~modules/visits';

@Module({
	controllers: [NotificationsController],
	imports: [
		forwardRef(() => DataModule),
		forwardRef(() => VisitsModule),
		ConfigModule,
		CampaignMonitorModule,
		AdminTranslationsModule,
		MaintenanceAlertsModule,
	],
	providers: [NotificationsService, ConfigService],
	exports: [NotificationsService],
})
export class NotificationsModule {}
