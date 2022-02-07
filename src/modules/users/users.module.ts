import { Module } from '@nestjs/common';

import { UsersService } from './services/users.service';

import { DataModule } from '~modules/data';

@Module({
	imports: [DataModule],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
