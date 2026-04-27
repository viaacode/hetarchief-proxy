import { AdminTranslationsModule, AssetsModule, DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';

import { MaterialRequestMessagesController } from './controllers/material-request-messages.controller';
import { MaterialRequestMessagesService } from './services/material-request-messages.service';

import { ConfigModule } from '@nestjs/config';
import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { MaterialRequestPdfGeneratorService } from '~modules/material-request-messages/services/material-request-pdf-generator';
import { MaterialRequestsModule } from '~modules/material-requests';
import { UsersModule } from '~modules/users';

@Module({
	controllers: [MaterialRequestMessagesController],
	providers: [MaterialRequestMessagesService, MaterialRequestPdfGeneratorService],
	imports: [
		ConfigModule,
		DataModule,
		MaterialRequestsModule,
		AssetsModule,
		AdminTranslationsModule,
		CampaignMonitorModule,
		UsersModule,
	],
	exports: [MaterialRequestMessagesService, MaterialRequestPdfGeneratorService],
})
export class MaterialRequestMessagesModule {}
