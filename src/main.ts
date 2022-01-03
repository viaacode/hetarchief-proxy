import { ConfigService as NestConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { ConfigService } from '~config';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(NestConfigService);
	const port = configService.get('port');

	app.enableCors();

	await app.listen(port);
}
bootstrap();
