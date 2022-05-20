import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { OrganisationsService } from './services/organisations.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [],
	imports: [forwardRef(() => DataModule), ConfigModule],
	providers: [OrganisationsService, ConfigService],
	exports: [OrganisationsService],
})
export class OrganisationsModule {}
