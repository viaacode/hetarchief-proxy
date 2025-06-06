import { AdminTranslationsModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import type { Configuration } from '~config';

import { AuthController } from './controllers/auth.controller';
import { HetArchiefController } from './controllers/het-archief.controller';
import { HetArchiefService } from './services/het-archief.service';
import { IdpService } from './services/idp.service';

import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { EventsModule } from '~modules/events';
import { FoldersModule } from '~modules/folders';
import { OrganisationsModule } from '~modules/organisations/organisations.module';
import { SpacesModule } from '~modules/spaces';
import { UsersModule } from '~modules/users';
import { SessionService } from '~shared/services/session.service';

export const archiefServiceFactory = {
	provide: HetArchiefService,
	useFactory: async (configService: ConfigService<Configuration>) => {
		const archiefService = new HetArchiefService(configService);
		await archiefService.initialize();
		return archiefService;
	},
	inject: [ConfigService],
};

@Module({
	controllers: [AuthController, HetArchiefController],
	imports: [
		ConfigModule,
		UsersModule,
		FoldersModule,
		SpacesModule,
		EventsModule,
		AdminTranslationsModule,
		OrganisationsModule,
		CampaignMonitorModule,
	],
	providers: [archiefServiceFactory, IdpService, SessionService],
})
export class AuthModule {}
