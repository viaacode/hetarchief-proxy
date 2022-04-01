import { Module } from '@nestjs/common';

import { SiteVariablesService } from './services/site-variables.service';

import { DataModule } from '~modules/data';

@Module({
	imports: [DataModule],
	providers: [SiteVariablesService],
	exports: [SiteVariablesService],
})
export class SiteVariablesModule {}
