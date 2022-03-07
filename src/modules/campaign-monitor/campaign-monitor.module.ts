import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CampaignMonitorService } from './services/campaign-monitor.service';

@Module({
	imports: [ConfigModule],
	providers: [CampaignMonitorService],
})
export class CampaignMonitorModule {}
