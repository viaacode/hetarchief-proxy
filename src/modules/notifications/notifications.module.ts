import {
	AdminTranslationsModule,
	DataModule,
	MaintenanceAlertsModule,
} from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { VisitsModule } from '~modules/visits';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';

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
