import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import config, { configValidationSchema } from '~config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { NavigationsModule } from '~modules/admin/navigations';
import { AuthModule } from '~modules/auth';
import { DataModule } from '~modules/data';
import { MediaModule } from '~modules/media';
import { SpacesModule } from '~modules/spaces';
import { TosModule } from '~modules/tos';
import { UsersModule } from '~modules/users';
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
		AuthModule,
		DataModule,
		MediaModule,
		SpacesModule,
		MediaModule,
		NavigationsModule,
		TosModule,
		UsersModule,
		VisitsModule,
	],
	controllers: [AppController],
	providers: [AppService, SessionService],
})
export class AppModule {}
