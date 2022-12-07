import { DataModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';

import { TosController } from './controllers/tos.controller';
import { TosService } from './services/tos.service';

@Module({
	controllers: [TosController],
	imports: [forwardRef(() => DataModule)],
	providers: [TosService],
})
export class TosModule {}
