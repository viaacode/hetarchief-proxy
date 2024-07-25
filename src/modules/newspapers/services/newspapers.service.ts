import { DataService } from '@meemoo/admin-core-api';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { type Configuration } from '~config';

@Injectable()
export class NewspapersService {
	constructor(
		private configService: ConfigService<Configuration>,
		protected dataService: DataService
	) {}
}
