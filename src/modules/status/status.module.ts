import { Module } from '@nestjs/common';

import { DataModule } from '~modules/data';
import { MediaModule } from '~modules/media';
import { StatusController } from '~modules/status/status.controller';
import { StatusService } from '~modules/status/status.service';

@Module({
	controllers: [StatusController],
	imports: [DataModule, MediaModule],
	providers: [StatusService],
	exports: [StatusService],
})
export class StatusModule {}
