import { DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';

import { MaterialRequestsController } from './controllers/material-requests.controller';
import { MaterialRequestsService } from './services/material-requests.service';

import { CampaignMonitorModule } from '~modules/campaign-monitor';

@Module({
	controllers: [MaterialRequestsController],
	providers: [MaterialRequestsService],
	imports: [DataModule, CampaignMonitorModule],
	exports: [MaterialRequestsService],
})
export class MaterialRequestsModule {}
