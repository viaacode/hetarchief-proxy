import { ValidationPipe } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
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

	/** Api data size limitations */
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
	if (configService.get('environment') !== 'production') {
		const swaggerConfig = new DocumentBuilder()
			.setTitle('HetArchief2.0 Leeszalen tool API docs')
			.setDescription('Documentatie voor de leeszalen tool api calls')
			.setVersion('0.1.0')
			.addCookieAuth('connect.sid')
			.build();
		const document = SwaggerModule.createDocument(app, swaggerConfig);
		SwaggerModule.setup('docs', app, document);
	}

	/** All good, start listening */
	await app.listen(port);
}

bootstrap();
