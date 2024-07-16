import { ValidationPipe } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import session from 'express-session';
import helmet from 'helmet';

import { type ConfigService } from '~config';

import packageJson from '../package.json';

import { AppModule } from './app.module';

import { SessionService } from '~shared/services/session.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(NestConfigService);
	const port = configService.get('PORT');

	/** Security */
	app.enableCors(configService.get('CORS_OPTIONS'));
	app.use(helmet());

	/** Increase POST json body size */
	app.use(json({ limit: '500kb' }));

	/** Validation */
	app.useGlobalPipes(
		new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })
	);

	/** Session middleware */
	const sessionService = app.get<SessionService>(SessionService);
	const sessionConfig = await sessionService.getSessionConfig();
	app.use(session(sessionConfig));

	/** Swagger docs **/
	if (configService.get('ENVIRONMENT') !== 'production') {
		const swaggerConfig = new DocumentBuilder()
			.setTitle('HetArchief2.0 Leeszalen tool API docs')
			.setDescription('Documentatie voor de leeszalen tool api calls')
			.setVersion(packageJson.version)
			.addCookieAuth('connect.sid')
			.build();
		const document = SwaggerModule.createDocument(app, swaggerConfig);
		SwaggerModule.setup('docs', app, document);
	}

	/** All good, start listening */
	await app.listen(port);
}

bootstrap();
