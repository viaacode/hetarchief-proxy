import { AdminCoreModule, DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import config, { configValidationSchema } from '~config';

import { MaterialRequestsModule } from './modules/material-requests';

import { AssetsModule } from '~modules/assets';
import { AuthModule } from '~modules/auth';
import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { ClientCacheModule } from '~modules/client-cache/client-cache.module';
import { CollectionsModule } from '~modules/collections';
import { ContentPartnersModule } from '~modules/content-partners';
import { EventsModule } from '~modules/events';
import { IeObjectsModule } from '~modules/ie-objects';
import { MediaModule } from '~modules/media';
import { NotFoundModule } from '~modules/not-found/not-found.module';
import { NotificationsModule } from '~modules/notifications';
import { OrganisationsModule } from '~modules/organisations/organisations.module';
import { SpacesModule } from '~modules/spaces';
import { StatusModule } from '~modules/status';
import { TosModule } from '~modules/tos';
import { TranslationsModule } from '~modules/translations';
import { UsersModule } from '~modules/users';
import { VisitsModule } from '~modules/visits';
import { PermissionGuard } from '~shared/guards/permission.guard';
import { SessionService } from '~shared/services/session.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true, // loading .env manually with dotenv so we can get correct config behavior
			load: [config],
			validationSchema: configValidationSchema,
			expandVariables: true,
		}),
		ScheduleModule.forRoot(),

		AuthModule,
		CampaignMonitorModule,
		CollectionsModule,
		ContentPartnersModule,
		AssetsModule,
		DataModule,
		EventsModule,
		OrganisationsModule,
		MediaModule,
		NotificationsModule,
		SpacesModule,
		StatusModule,
		TosModule,
		TranslationsModule,
		UsersModule,
		VisitsModule,
		ClientCacheModule,
		NotFoundModule,
		AdminCoreModule,
		MaterialRequestsModule,
		IeObjectsModule,
	],
	controllers: [],
	providers: [
		SessionService,
		ConfigService,
		{
			provide: APP_GUARD,
			useClass: PermissionGuard,
		},
	],
	exports: [ConfigService],
})
export class AppModule {}
