import { AssetsModule, DataModule } from '@meemoo/admin-core-api';
import { Module } from '@nestjs/common';

import { MaterialRequestMessagesController } from './controllers/material-request-messages.controller';
import { MaterialRequestMessagesService } from './services/material-request-messages.service';

import { ConfigModule } from '@nestjs/config';
import { MaterialRequestsModule } from '~modules/material-requests';

@Module({
	controllers: [MaterialRequestMessagesController],
	providers: [MaterialRequestMessagesService],
	imports: [ConfigModule, DataModule, MaterialRequestsModule, AssetsModule],
	exports: [MaterialRequestMessagesService],
})
export class MaterialRequestMessagesModule {}
