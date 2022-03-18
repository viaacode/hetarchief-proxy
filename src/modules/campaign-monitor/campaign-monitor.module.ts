import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CampaignMonitorService } from './services/campaign-monitor.service';

@Module({
	imports: [ConfigModule],
	providers: [CampaignMonitorService],
	exports: [CampaignMonitorService],
})
export class CampaignMonitorModule {}
