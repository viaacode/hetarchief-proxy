import { Injectable, Logger } from '@nestjs/common';

import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class SpacesService {
	private logger: Logger = new Logger(SpacesService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	public findAll() {
		return [
			{
				id: 1,
				name: 'space mountain',
			},
		];
	}
}
