import { DataModule } from '@meemoo/admin-core-api';
import { CacheModule } from '@nestjs/cache-manager';
import { forwardRef, Module } from '@nestjs/common';
import { TosController } from './controllers/tos.controller';
import { TosService } from './services/tos.service';

@Module({
	controllers: [TosController],
	imports: [
		forwardRef(() => DataModule),
		CacheModule.register({
			max: 1000,
		}),
	],
	providers: [TosService],
})
export class TosModule {}
