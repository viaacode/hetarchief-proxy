import { DataService } from '@meemoo/admin-core-api';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sortBy } from 'lodash';

import { type Configuration } from '~config';

import {
	GetNewspaperTitlesDocument,
	type GetNewspaperTitlesQuery,
} from '~generated/graphql-db-types-hetarchief';
import type { NewspaperTitle } from '~modules/ie-objects/ie-objects.types';

@Injectable()
export class NewspapersService {
	constructor(
		private configService: ConfigService<Configuration>,
		private dataService: DataService
	) {}

	public async getNewspaperTitles(): Promise<NewspaperTitle[]> {
		const response = await this.dataService.execute<GetNewspaperTitlesQuery>(
			GetNewspaperTitlesDocument
		);

		return sortBy(
			response.graph__newspaper_public_content.map((newspaperTitle) => ({
				title: newspaperTitle.schema_name,
			})),
			(item) => item.title
		);
	}
}
