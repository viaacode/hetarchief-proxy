import { AdminTranslationsModule, DataModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OrganisationsController } from '~modules/organisations/controllers/organisations.controller';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';

@Module({
	controllers: [OrganisationsController],
	imports: [forwardRef(() => DataModule), AdminTranslationsModule],
	providers: [OrganisationsService, ConfigService],
	exports: [OrganisationsService],
})
export class OrganisationsModule {}
