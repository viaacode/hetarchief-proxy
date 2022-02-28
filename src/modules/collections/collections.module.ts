import { Module } from '@nestjs/common';

import { CollectionsController } from './controllers/collections.controller';
import { CollectionsService } from './services/collections.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [CollectionsController],
	imports: [DataModule],
	providers: [CollectionsService],
	exports: [CollectionsService],
})
export class CollectionsModule {}
