import { forwardRef, Module } from '@nestjs/common';

import { UserGroupsController } from './controllers/user-groups.controller';
import { UserGroupsService } from './services/user-groups.service';

import { DataModule } from '~modules/data';

@Module({
	imports: [forwardRef(() => DataModule)],
	controllers: [UserGroupsController],
	providers: [UserGroupsService],
})
export class AdminUserGroupsModule {}
