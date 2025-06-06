import https, { type RequestOptions } from 'node:https';

import { DataService } from '@meemoo/admin-core-api';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { sortBy } from 'lodash';

import type { Configuration } from '~config';

import {
	GetNewspaperTitlesDocument,
	type GetNewspaperTitlesQuery,
} from '~generated/graphql-db-types-hetarchief';
import type { NewspaperTitle } from '~modules/ie-objects/ie-objects.types';
import { customError } from '~shared/helpers/custom-error';

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

	public httpsGetAsync(options: RequestOptions): Promise<any> {
		return new Promise((resolve, reject) => {
			https
				.get(options, (urlStream) => {
					if (urlStream.statusCode >= 200 && urlStream.statusCode < 400) {
						resolve(urlStream);
					} else {
						reject(
							customError('https request failed', null, {
								hostname: options.hostname,
								path: options.path,
								referer: options.headers?.Referer,
								statusMessage: urlStream.statusMessage,
								statusCode: urlStream.statusCode,
							})
						);
					}
				})
				.on('error', (err) => {
					reject(err);
				});
		});
	}
}
