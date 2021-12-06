import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config, { configValidationSchema } from '~config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env/.env.local',
			load: [config],
			validationSchema: configValidationSchema,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
