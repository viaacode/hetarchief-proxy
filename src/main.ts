import { ValidationPipe } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import session from 'express-session';
import helmet from 'helmet';

import { ConfigService } from '~config';

import { AppModule } from './app.module';

import { SessionService } from '~shared/services/session.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(NestConfigService);
	const port = configService.get('port');

	/** Security */
	app.enableCors(configService.get('corsOptions'));
	app.use(helmet());

	/** Validation */
	app.useGlobalPipes(new ValidationPipe());

	/** Session middleware */
	const sessionService = app.get<SessionService>(SessionService);
	const sessionConfig = await sessionService.getSessionConfig();
	app.use(session(sessionConfig));

	/** All good, start listening */
	await app.listen(port);
}
bootstrap();
