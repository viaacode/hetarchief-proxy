import { Module } from '@nestjs/common';

import { NavigationsController } from './controllers/navigations.controller';
import { NavigationsService } from './services/navigations.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [NavigationsController],
	imports: [DataModule],
	providers: [NavigationsService],
})
export class NavigationsModule {}
