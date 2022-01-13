import { Body, Controller, Post } from '@nestjs/common';

import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { DataService } from '../services/data.service';

@Controller('data')
export class DataController {
	constructor(private dataService: DataService) {}

	@Post()
	public async post(@Body() dataQueryDto: GraphQlQueryDto): Promise<any> {
		return this.dataService.executeClientQuery(dataQueryDto);
	}
}
