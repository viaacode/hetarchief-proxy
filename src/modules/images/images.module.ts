import { AssetsModule } from '@meemoo/admin-core-api';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ImagesController } from './controllers/images.controller';
import { ImagesService } from './services/images.service';

@Module({
	controllers: [ImagesController],
	imports: [AssetsModule, ConfigModule, CacheModule.register({ max: 10_000 })],
	providers: [ImagesService],
})
export class ImagesModule {}
