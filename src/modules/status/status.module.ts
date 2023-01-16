import { DataModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';

import { MediaModule } from '~modules/media';
import { StatusController } from '~modules/status/controllers/status.controller';
import { StatusService } from '~modules/status/services/status.service';

@Module({
	controllers: [StatusController],
	imports: [forwardRef(() => DataModule), MediaModule],
	providers: [StatusService],
	exports: [StatusService],
})
export class StatusModule {}
