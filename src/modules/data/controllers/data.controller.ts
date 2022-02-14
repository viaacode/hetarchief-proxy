import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { DataService } from '../services/data.service';

@ApiTags('GraphQL')
@Controller('data')
export class DataController {
	constructor(private dataService: DataService) {}

	@Post()
	public async post(@Body() dataQueryDto: GraphQlQueryDto): Promise<any> {
		return this.dataService.executeClientQuery(dataQueryDto);
	}
}
