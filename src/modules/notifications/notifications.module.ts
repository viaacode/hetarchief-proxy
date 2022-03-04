import { Module } from '@nestjs/common';

import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [NotificationsController],
	imports: [DataModule],
	providers: [NotificationsService],
	exports: [NotificationsService],
})
export class NotificationsModule {}
