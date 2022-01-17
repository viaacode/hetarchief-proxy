import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './controllers/auth.controller';
import { HetArchiefController } from './controllers/het-archief.controller';
import { MeemooController } from './controllers/meemoo.controller';
import { HetArchiefService } from './services/het-archief.service';
import { MeemooService } from './services/meemoo.service';

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
	imports: [ConfigModule],
	providers: [archiefServiceFactory, meemooServiceFactory],
})
export class AuthModule {}
