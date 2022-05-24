import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DataController } from './controllers/data.controller';
import { DataPermissionsService } from './services/data-permissions.service';
import { DataService } from './services/data.service';

import { ContentPagesModule } from '~modules/admin/content-pages';

@Module({
	controllers: [DataController],
	imports: [ConfigModule, forwardRef(() => ContentPagesModule)],
	providers: [DataService, DataPermissionsService],
	exports: [DataService, DataPermissionsService],
})
export class DataModule {}
