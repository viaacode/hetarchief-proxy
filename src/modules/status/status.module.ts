import { DataModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';
import { StatusController } from '~modules/status/controllers/status.controller';
import { StatusService } from '~modules/status/services/status.service';
import { IeObjectsModule } from '../ie-objects';

@Module({
	controllers: [StatusController],
	imports: [forwardRef(() => DataModule), IeObjectsModule],
	providers: [StatusService],
	exports: [StatusService],
})
export class StatusModule {}
