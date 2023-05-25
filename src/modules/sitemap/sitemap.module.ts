import { ContentPagesModule, DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';

import { SitemapController } from './controllers/sitemap.controller';
import { SitemapService } from './services/sitemap.service';

import { AssetsModule } from '~modules/assets';
import { IeObjectsModule } from '~modules/ie-objects';
import { OrganisationsModule } from '~modules/organisations/organisations.module';
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
		OrganisationsModule,
	],
})
export class SitemapModule {}
