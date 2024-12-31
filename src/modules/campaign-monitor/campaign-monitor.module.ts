import { AdminTranslationsModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CampaignMonitorController } from './controllers/campaign-monitor.controller';
import { CampaignMonitorService } from './services/campaign-monitor.service';

import { EventsModule } from '~modules/events';
import { UsersModule } from '~modules/users';

@Module({
	controllers: [CampaignMonitorController],
	imports: [ConfigModule, EventsModule, AdminTranslationsModule, UsersModule],
	providers: [CampaignMonitorService],
	exports: [CampaignMonitorService],
})
export class CampaignMonitorModule {}
