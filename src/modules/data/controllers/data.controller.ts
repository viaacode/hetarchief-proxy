import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { DataService } from '../services/data.service';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { SessionUser } from '~shared/decorators/user.decorator';

const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: Group.MEEMOO_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: Object.values(Permission),
};

@ApiTags('GraphQL')
@Controller('data')
export class DataController {
	constructor(private dataService: DataService) {}

	@Post()
	public async post(
		@Body() dataQueryDto: GraphQlQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<any> {
		// return this.dataService.executeClientQuery(user.getUser(), dataQueryDto);
		return this.dataService.executeClientQuery(mockUser, dataQueryDto);
	}
}
