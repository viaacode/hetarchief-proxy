import { AdminTranslationsModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ZendeskController } from './controllers/zendesk.controller';
import { ZendeskService } from './services/zendesk.service';

import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { OrganisationsModule } from '~modules/organisations/organisations.module';

@Module({
	controllers: [ZendeskController],
	imports: [ConfigModule, AdminTranslationsModule, CampaignMonitorModule, OrganisationsModule],
	providers: [ZendeskService],
	exports: [ZendeskService],
})
export class ZendeskModule {}
