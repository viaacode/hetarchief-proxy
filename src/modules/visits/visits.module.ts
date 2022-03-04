import { Module } from '@nestjs/common';

import { VisitsController } from './controllers/visits.controller';
import { VisitsService } from './services/visits.service';

import { DataModule } from '~modules/data';
import { NotificationsModule } from '~modules/notifications';
import { SpacesModule } from '~modules/spaces';

@Module({
	controllers: [VisitsController],
	imports: [DataModule, NotificationsModule, SpacesModule],
	providers: [VisitsService],
})
export class VisitsModule {}
