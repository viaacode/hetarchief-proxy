import { AdminCoreModule, DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import config, { configValidationSchema } from '~config';

import { AuthModule } from '~modules/auth';
import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { ClientCacheModule } from '~modules/client-cache/client-cache.module';
import { ContentPartnersModule } from '~modules/content-partners';
import { EventsModule } from '~modules/events';
import { FoldersModule } from '~modules/folders';
import { IeObjectsModule } from '~modules/ie-objects';
import { MaterialRequestsModule } from '~modules/material-requests';
import { NotFoundModule } from '~modules/not-found/not-found.module';
import { NotificationsModule } from '~modules/notifications';
import { OrganisationsModule } from '~modules/organisations/organisations.module';
import { SitemapModule } from '~modules/sitemap';
import { SpacesModule } from '~modules/spaces';
import { StatusModule } from '~modules/status';
import { TosModule } from '~modules/tos';
import { UsersModule } from '~modules/users';
import { VisitsModule } from '~modules/visits';
import { ZendeskModule } from '~modules/zendesk';
import { ZendeskService } from '~modules/zendesk/services/zendesk.service';
import { PermissionGuard } from '~shared/guards/permission.guard';
import { checkRequiredEnvs } from '~shared/helpers/env-check';
import { SessionService } from '~shared/services/session.service';

checkRequiredEnvs(['ADMIN_CORE_ROUTES_PREFIX']);

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
		FoldersModule,
		ContentPartnersModule,
		DataModule,
		EventsModule,
		OrganisationsModule,
		NotificationsModule,
		SpacesModule,
		StatusModule,
		TosModule,
		UsersModule,
		VisitsModule,
		ClientCacheModule,
		NotFoundModule,
		AdminCoreModule,
		MaterialRequestsModule,
		IeObjectsModule,
		ZendeskModule,
		SitemapModule,
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
export class AppModule {
	constructor() {
		ZendeskService.initialize();
	}
}
