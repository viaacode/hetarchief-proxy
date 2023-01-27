import { Module } from '@nestjs/common';

import { ZendeskController } from './controllers/zendesk.controller';
import { ZendeskService } from './services/zendesk.service';

@Module({
	controllers: [ZendeskController],
	imports: [],
	providers: [ZendeskService],
	exports: [ZendeskService],
})
export class ZendeskModule {}
