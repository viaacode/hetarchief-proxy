import { DataModule } from '@meemoo/admin-core-api';
import { Module, forwardRef } from '@nestjs/common';

import { IeObjectsModule } from '../ie-objects';

import { StatusController } from '~modules/status/controllers/status.controller';
import { StatusService } from '~modules/status/services/status.service';

@Module({
	controllers: [StatusController],
	imports: [forwardRef(() => DataModule), IeObjectsModule],
	providers: [StatusService],
	exports: [StatusService],
})
export class StatusModule {}
