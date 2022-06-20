import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import config, { configValidationSchema } from '~config';

import { ContentPagesModule } from '~modules/admin/content-pages';
import { AdminNavigationsModule } from '~modules/admin/navigations';
import { AdminPermissionsModule } from '~modules/admin/permissions';
import { SiteVariablesService } from '~modules/admin/site-variables/services/site-variables.service';
import { AdminTranslationsModule } from '~modules/admin/translations';
import { AdminUserGroupsModule } from '~modules/admin/user-groups';
import { AssetsModule } from '~modules/assets';
import { AuthModule } from '~modules/auth';
import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { ClientCacheModule } from '~modules/client-cache/client-cache.module';
import { CollectionsModule } from '~modules/collections';
import { ContentPartnersModule } from '~modules/content-partners';
import { DataModule } from '~modules/data';
import { EventsModule } from '~modules/events';
import { MediaModule } from '~modules/media';
import { NavigationsModule } from '~modules/navigations';
import { NotificationsModule } from '~modules/notifications';
import { OrganisationsModule } from '~modules/organisations/organisations.module';
import { SpacesModule } from '~modules/spaces';
import { StatusModule } from '~modules/status';
import { TosModule } from '~modules/tos';
import { TranslationsModule } from '~modules/translations';
import { TranslationsService } from '~modules/translations/services/translations.service';
import { UsersModule } from '~modules/users';
import { VisitsModule } from '~modules/visits';
import { PermissionGuard } from '~shared/guards/permission.guard';
import { SessionService } from '~shared/services/session.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env/.env.local',
			load: [config],
			validationSchema: configValidationSchema,
			expandVariables: true,
		}),
		ScheduleModule.forRoot(),
		AdminNavigationsModule,
		AdminPermissionsModule,
		AdminTranslationsModule,
		AdminUserGroupsModule,
		AuthModule,
		CampaignMonitorModule,
		CollectionsModule,
		ContentPartnersModule,
		ContentPagesModule,
		AssetsModule,
		DataModule,
		EventsModule,
		OrganisationsModule,
		MediaModule,
		MediaModule,
		NavigationsModule,
		NotificationsModule,
		SpacesModule,
		StatusModule,
		TosModule,
		TranslationsModule,
		UsersModule,
		VisitsModule,
		ClientCacheModule,
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
