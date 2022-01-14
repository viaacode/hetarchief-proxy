import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config, { configValidationSchema } from '~config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from '~modules/auth';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env/.env.local',
			load: [config],
			validationSchema: configValidationSchema,
			expandVariables: true,
		}),
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
