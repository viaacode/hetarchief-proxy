import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CampaignMonitorController } from './controllers/campaign-monitor.controller';
import { CampaignMonitorService } from './services/campaign-monitor.service';

import { EventsModule } from '~modules/events';

@Module({
	controllers: [CampaignMonitorController],
	imports: [ConfigModule, EventsModule],
	providers: [CampaignMonitorService],
	exports: [CampaignMonitorService],
})
export class CampaignMonitorModule {}
