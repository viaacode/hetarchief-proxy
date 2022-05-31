import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AdminOrganisationsService } from './services/admin-organisations.service';

import { DataModule } from '~modules/data';

@Module({
	controllers: [],
	imports: [forwardRef(() => DataModule), ConfigModule],
	providers: [AdminOrganisationsService, ConfigService],
	exports: [AdminOrganisationsService],
})
export class AdminOrganisationsModule {}
