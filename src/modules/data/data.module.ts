import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DataController } from './controllers/data.controller';
import { DataPermissionsService } from './services/data-permissions.service';
import { DataService } from './services/data.service';

@Module({
	controllers: [DataController],
	imports: [ConfigModule],
	providers: [DataService, DataPermissionsService],
})
export class DataModule {}
