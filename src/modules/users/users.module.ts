import { DataModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
	controllers: [UsersController],
	imports: [forwardRef(() => DataModule)],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
