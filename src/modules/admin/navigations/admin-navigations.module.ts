import { Module } from '@nestjs/common';

import { AdminNavigationsController } from './controllers/admin-navigations.controller';
import { AdminNavigationsService } from './services/admin-navigations.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [AdminNavigationsController],
	imports: [DataModule],
	providers: [AdminNavigationsService],
})
export class AdminNavigationsModule {}
