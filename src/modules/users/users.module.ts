import { DataModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';
import { CampaignMonitorModule } from '~modules/campaign-monitor';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
	controllers: [UsersController],
	imports: [forwardRef(() => DataModule), forwardRef(() => CampaignMonitorModule)],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
