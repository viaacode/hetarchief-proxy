import { Module } from '@nestjs/common';

import { SpacesController } from './controllers/spaces.controller';
import { SpacesService } from './services/spaces.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [SpacesController],
	imports: [DataModule],
	providers: [SpacesService],
})
export class SpacesModule {}
