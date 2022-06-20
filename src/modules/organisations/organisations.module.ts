import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DataModule } from '~modules/data';
import { OrganisationsController } from '~modules/organisations/controllers/organisations.controller';
import OrganisationsService from '~modules/organisations/services/organisations.service';
import { TranslationsModule } from '~modules/translations';

@Module({
	controllers: [OrganisationsController],
	imports: [forwardRef(() => DataModule), TranslationsModule],
	providers: [OrganisationsService, ConfigService],
	exports: [OrganisationsService],
})
export class OrganisationsModule {}
