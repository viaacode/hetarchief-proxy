import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ClientCacheController } from '~modules/client-cache/controllers/client-cache.controller';

@Module({
	controllers: [ClientCacheController],
	imports: [],
	providers: [ConfigService],
	exports: [],
})
export class ClientCacheModule {}
