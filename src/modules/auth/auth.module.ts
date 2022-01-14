import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './controllers/auth.controller';
import { HetArchiefController } from './controllers/het-archief.controller';
import { HetArchiefService } from './services/het-archief.service';

export const archiefServiceFactory = {
	provide: HetArchiefService,
	useFactory: async (configService: ConfigService) => {
		const archiefSercice = new HetArchiefService(configService);
		await archiefSercice.init();
		return archiefSercice;
	},
	inject: [ConfigService],
};

@Module({
	controllers: [AuthController, HetArchiefController],
	imports: [ConfigModule],
	providers: [archiefServiceFactory],
})
export class AuthModule {}
