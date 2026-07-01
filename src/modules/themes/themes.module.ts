import { DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';

import { ThemesController } from './controllers/themes.controller';
import { ThemesService } from './services/themes.service';

@Module({
	imports: [DataModule],
	controllers: [ThemesController],
	providers: [ThemesService],
	exports: [ThemesService],
})
export class ThemesModule {}
