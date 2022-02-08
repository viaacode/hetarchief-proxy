import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';

import { MediaQueryDto } from '../dto/media.dto';
import { QueryBuilder } from '../elasticsearch/queryBuilder';

@Injectable()
export class MediaService {
	private logger: Logger = new Logger(MediaService.name, { timestamp: true });
	private gotInstance: Got;

	constructor(private configService: ConfigService) {
		this.gotInstance = got.extend({
			prefixUrl: this.configService.get('elasticSearchUrl'),
			resolveBodyOnly: true,
			responseType: 'json',
		});
	}

	public getSearchEndpoint(esIndex: string): string {
		if (!esIndex) {
			return '_search';
		}
		return `${esIndex}/_search`;
	}

	private async executeQuery(esIndex: string, esQuery: any) {
		try {
			return await this.gotInstance.post(this.getSearchEndpoint(esIndex), {
				json: esQuery,
				resolveBodyOnly: true,
			});
		} catch (e) {
			if (e.response?.statusCode === 404) {
				this.logger.error(e.response.body);
				throw new NotFoundException();
			}
			this.logger.error(e);
			throw e;
		}
	}

	public async findAll(inputQuery: MediaQueryDto, esIndex: string = null): Promise<any> {
		const esQuery = QueryBuilder.build(inputQuery);
		const mediaResponse = await this.executeQuery(esIndex, esQuery);

		return mediaResponse;
	}

	public async findById(id: string, esIndex: string = null): Promise<any> {
		const esQuery = QueryBuilder.queryById(id);
		const mediaResponse = await this.executeQuery(esIndex, esQuery);

		return mediaResponse;
	}
}
