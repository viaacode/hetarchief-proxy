import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ContentPagesController } from './controllers/content-pages.controller';
import { ContentPagesService } from './services/content-pages.service';

import { DataModule } from '~modules/data';
import { VisitsModule } from '~modules/visits';

@Module({
	controllers: [ContentPagesController],
	imports: [DataModule, forwardRef(() => VisitsModule), ConfigService],
	providers: [ContentPagesService, ConfigService],
	exports: [ContentPagesService],
})
export class ContentPagesModule {}
