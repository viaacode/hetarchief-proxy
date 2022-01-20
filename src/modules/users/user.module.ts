import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersService } from './services/users.service';

import { DataModule } from '~modules/data';

@Module({
	imports: [ConfigModule, DataModule],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
