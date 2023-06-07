import { ContentPagesModule, DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SitemapController } from './controllers/sitemap.controller';
import { SitemapService } from './services/sitemap.service';

import { AssetsModule } from '~modules/assets';
import { IeObjectsModule } from '~modules/ie-objects';
import { SpacesModule } from '~modules/spaces';

@Module({
	controllers: [SitemapController],
	providers: [SitemapService],
	imports: [
		DataModule,
		SpacesModule,
		IeObjectsModule,
		AssetsModule,
		ContentPagesModule,
		ConfigModule,
	],
})
export class SitemapModule {}
