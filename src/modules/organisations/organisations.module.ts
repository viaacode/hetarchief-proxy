import { AdminTranslationsModule, DataModule } from '@meemoo/admin-core-api';
import { CacheModule } from '@nestjs/cache-manager';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OrganisationsController } from '~modules/organisations/controllers/organisations.controller';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';

@Module({
	controllers: [OrganisationsController],
	imports: [
		forwardRef(() => DataModule),
		ConfigModule,
		AdminTranslationsModule,
		CacheModule.register(),
	],
	providers: [OrganisationsService],
	exports: [OrganisationsService],
})
export class OrganisationsModule {}
