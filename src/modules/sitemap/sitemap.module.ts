import { DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';

import { SitemapController } from './controllers/sitemap.controller';
import { SitemapService } from './services/sitemap.service';

import { SpacesModule } from '~modules/spaces';

@Module({
	controllers: [SitemapController],
	providers: [SitemapService],
	imports: [DataModule, SpacesModule],
})
export class SitemapModule {}
