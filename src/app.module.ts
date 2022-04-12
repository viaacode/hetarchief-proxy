import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import config, { configValidationSchema } from '~config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ContentPagesModule } from '~modules/admin/content-pages';
import { NavigationsModule } from '~modules/admin/navigations';
import { AdminTranslationsModule } from '~modules/admin/translations';
import { AuthModule } from '~modules/auth';
import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { CollectionsModule } from '~modules/collections';
import { DataModule } from '~modules/data';
import { MediaModule } from '~modules/media';
import { NotificationsModule } from '~modules/notifications';
import { SpacesModule } from '~modules/spaces';
import { TosModule } from '~modules/tos';
import { TranslationsModule } from '~modules/translations';
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
		AuthModule,
		CampaignMonitorModule,
		DataModule,
		MediaModule,
		SpacesModule,
		MediaModule,
		NavigationsModule,
		TosModule,
		UsersModule,
		VisitsModule,
		CollectionsModule,
		NotificationsModule,
		ContentPagesModule,
		TranslationsModule,
		AdminTranslationsModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
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
