import { DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';

import { MaterialRequestsController } from './controllers/material-requests.controller';
import { MaterialRequestsService } from './services/material-requests.service';

import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { EventsModule } from '~modules/events';
import { OrganisationsModule } from '~modules/organisations/organisations.module';
import { SpacesModule } from '~modules/spaces';

@Module({
	controllers: [MaterialRequestsController],
	providers: [MaterialRequestsService],
	imports: [DataModule, CampaignMonitorModule, OrganisationsModule, EventsModule, SpacesModule],
	exports: [MaterialRequestsService],
})
export class MaterialRequestsModule {}
