import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { DataService } from '../services/data.service';

// import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
// import { SessionUser } from '~shared/decorators/user.decorator';

// TODO Admin core: fix
const mockUser: User = {
	id: 'd285a546-b42b-4fb3-bfa7-ef8be9208bc0',
	firstName: 'Meemoo',
	lastName: 'Admin',
	fullName: 'Meemoo Admin',
	email: 'meemoo.admin@example.com',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: Group.MEEMOO_ADMIN,
	groupName: GroupIdToName[Group.MEEMOO_ADMIN],
	permissions: Object.values(Permission),
};

@ApiTags('GraphQL')
@Controller('data')
export class DataController {
	constructor(private dataService: DataService) {}

	@Post()
	public async post(
		@Body() dataQueryDto: GraphQlQueryDto
		// @SessionUser() user: SessionUserEntity
	): Promise<any> {
		// return this.dataService.executeClientQuery(user.getUser(), dataQueryDto);
		return this.dataService.executeClientQuery(mockUser, dataQueryDto);
	}
}
