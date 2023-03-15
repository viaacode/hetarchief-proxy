import { DataModule } from '@meemoo/admin-core-api';
import { forwardRef, Module } from '@nestjs/common';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

import { OrganisationsModule } from '~modules/organisations/organisations.module';

@Module({
	controllers: [UsersController],
	imports: [forwardRef(() => DataModule), OrganisationsModule],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
