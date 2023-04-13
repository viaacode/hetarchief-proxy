import { DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';

import { SitemapController } from './controllers/sitemap.controller';
import { SitemapService } from './services/sitemap.service';

@Module({
	controllers: [SitemapController],
	providers: [SitemapService],
	imports: [DataModule],
})
export class SitemapModule {}
