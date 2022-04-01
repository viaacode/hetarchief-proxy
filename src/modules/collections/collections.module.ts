import { Module } from '@nestjs/common';

import { CollectionsController } from './controllers/collections.controller';
import { CollectionsService } from './services/collections.service';

import { DataModule } from '~modules/data';
import { MediaModule } from '~modules/media';

@Module({
	controllers: [CollectionsController],
	imports: [DataModule, MediaModule],
	providers: [CollectionsService],
	exports: [CollectionsService],
})
export class CollectionsModule {}
