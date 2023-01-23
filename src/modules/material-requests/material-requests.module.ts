import { DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';

import { MaterialRequestsController } from './controllers/material-requests.controller';
import { MaterialRequestsService } from './services/material-requests.service';

@Module({
	controllers: [MaterialRequestsController],
	providers: [MaterialRequestsService],
	imports: [DataModule],
	exports: [MaterialRequestsService],
})
export class MaterialRequestsModule {}
