import { AdminTranslationsModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from '~modules/events';
import { UsersModule } from '~modules/users';
import { CampaignMonitorController } from './controllers/campaign-monitor.controller';
import { CampaignMonitorService } from './services/campaign-monitor.service';

@Module({
	controllers: [CampaignMonitorController],
	imports: [ConfigModule, EventsModule, AdminTranslationsModule, UsersModule],
	providers: [CampaignMonitorService],
	exports: [CampaignMonitorService],
})
export class CampaignMonitorModule {}
