import { DataModule } from '@meemoo/admin-core-api';
import { Module, forwardRef } from '@nestjs/common';

import { CacheModule } from '@nestjs/cache-manager';
import { KeyvCacheableMemory } from 'cacheable';
import { TosController } from './controllers/tos.controller';
import { TosService } from './services/tos.service';

@Module({
	controllers: [TosController],
	imports: [
		forwardRef(() => DataModule),
		CacheModule.register({
			stores: [new KeyvCacheableMemory({ lruSize: 1000 })],
		}),
	],
	providers: [TosService],
})
export class TosModule {}
