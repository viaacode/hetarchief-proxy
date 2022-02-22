import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import config, { configValidationSchema } from '~config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from '~modules/auth';
import { CollectionsModule } from '~modules/collections';
import { DataModule } from '~modules/data';
import { MediaModule } from '~modules/media';
import { SpacesModule } from '~modules/spaces';
import { VisitsModule } from '~modules/visits';
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
		DataModule,
		AuthModule,
		SpacesModule,
		MediaModule,
		VisitsModule,
		CollectionsModule,
	],
	controllers: [AppController],
	providers: [AppService, SessionService],
})
export class AppModule {}
