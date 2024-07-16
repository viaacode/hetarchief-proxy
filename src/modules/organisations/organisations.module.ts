import { AdminTranslationsModule, DataModule } from '@meemoo/admin-core-api';
import { CacheModule } from '@nestjs/cache-manager';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OrganisationsController } from '~modules/organisations/controllers/organisations.controller';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';

@Module({
	controllers: [OrganisationsController],
	imports: [forwardRef(() => DataModule), AdminTranslationsModule, CacheModule.register()],
	providers: [OrganisationsService, ConfigService],
	exports: [OrganisationsService],
})
export class OrganisationsModule {}
