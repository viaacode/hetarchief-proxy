import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './controllers/auth.controller';
import { HetArchiefController } from './controllers/het-archief.controller';
import { MeemooController } from './controllers/meemoo.controller';
import { HetArchiefService } from './services/het-archief.service';
import { IdpService } from './services/idp.service';
import { MeemooService } from './services/meemoo.service';

import { CollectionsModule } from '~modules/collections';
import { EventsModule } from '~modules/events';
import { SpacesModule } from '~modules/spaces';
import { TranslationsModule } from '~modules/translations';
import { UsersModule } from '~modules/users';
import { SessionService } from '~shared/services/session.service';

export const archiefServiceFactory = {
	provide: HetArchiefService,
	useFactory: async (configService: ConfigService) => {
		const archiefService = new HetArchiefService(configService);
		await archiefService.initialize();
		return archiefService;
	},
	inject: [ConfigService],
};

export const meemooServiceFactory = {
	provide: MeemooService,
	useFactory: async (configService: ConfigService) => {
		const meemooService = new MeemooService(configService);
		await meemooService.initialize();
		return meemooService;
	},
	inject: [ConfigService],
};

@Module({
	controllers: [AuthController, HetArchiefController, MeemooController],
	imports: [
		ConfigModule,
		UsersModule,
		CollectionsModule,
		SpacesModule,
		EventsModule,
		TranslationsModule,
	],
	providers: [archiefServiceFactory, meemooServiceFactory, IdpService, SessionService],
})
export class AuthModule {}
