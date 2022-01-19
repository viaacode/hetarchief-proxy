import { ValidationPipe } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import session from 'express-session';

import { ConfigService } from '~config';

import { AppModule } from './app.module';

import { SessionConfig } from '~config/session.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(NestConfigService);
	const port = configService.get('port');

	app.enableCors();
	app.useGlobalPipes(new ValidationPipe());

	/** Init sessions middleware */
	const sessionConfig = await new SessionConfig().get(
		configService.get('environment'),
		configService.get('cookieSecret'),
		configService.get('cookieMaxAge'),
		configService.get('redisConnectionString')
	);
	app.use(session(sessionConfig));

	await app.listen(port);
}
bootstrap();
