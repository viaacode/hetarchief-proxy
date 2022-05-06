import { Module } from '@nestjs/common';

import { PermissionsController } from './controllers/permissions.controller';
import { PermissionsService } from './services/permissions.service';

import { DataModule } from '~modules/data';

@Module({
	imports: [DataModule],
	controllers: [PermissionsController],
	providers: [PermissionsService],
})
export class AdminPermissionsModule {}
