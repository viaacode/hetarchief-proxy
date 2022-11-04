import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { DataService } from '../services/data.service';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { SessionUser } from '~shared/decorators/user.decorator';

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
		return this.dataService.execute(dataQueryDto.query, dataQueryDto.variables);
	}
}
