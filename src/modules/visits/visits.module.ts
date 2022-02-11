import { Module } from '@nestjs/common';

import { VisitsController } from './controllers/visits.controller';
import { VisitsService } from './services/visits.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [VisitsController],
	imports: [DataModule],
	providers: [VisitsService],
})
export class VisitsModule {}
