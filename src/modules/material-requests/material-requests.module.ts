import { DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';

import { MaterialRequestsController } from './controllers/material-requests.controller';
import { MaterialRequestsService } from './services/material-requests.service';

import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { OrganisationsModule } from '~modules/organisations/organisations.module';

@Module({
	controllers: [MaterialRequestsController],
	providers: [MaterialRequestsService],
	imports: [DataModule, CampaignMonitorModule, OrganisationsModule],
	exports: [MaterialRequestsService],
})
export class MaterialRequestsModule {}
