import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';
import { trimStart } from 'lodash';

import { MediaQueryDto } from '../dto/media.dto';
import { QueryBuilder } from '../elasticsearch/queryBuilder';
import { PlayerTicket } from '../types';

import { GET_OBJECT_IE_PLAY_INFO_BY_ID } from './queries.gql';

import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class MediaService {
	private logger: Logger = new Logger(MediaService.name, { timestamp: true });
	private gotInstance: Got;
	private playerTicketsGotInstance: Got;
	private ticketServiceMaxAge: number;
	private mediaServiceUrl: string;
	private host: string;

	constructor(private configService: ConfigService, protected dataService: DataService) {
		this.gotInstance = got.extend({
			prefixUrl: this.configService.get('elasticSearchUrl'),
			resolveBodyOnly: true,
			responseType: 'json',
		});

		this.playerTicketsGotInstance = got.extend({
			prefixUrl: this.configService.get('ticketServiceUrl'),
			resolveBodyOnly: true,
			responseType: 'json',
			https: {
				rejectUnauthorized: false,
				certificate: this.configService.get('ticketServiceCertificate'),
				key: this.configService.get('ticketServiceKey'),
				passphrase: this.configService.get('ticketServicePassphrase'),
			},
		});
		this.ticketServiceMaxAge = this.configService.get('ticketServiceMaxAge');
		this.mediaServiceUrl = this.configService.get('mediaServiceUrl');
		this.host = this.configService.get('host');
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
			if (e.response.statusCode === 404) {
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

	public async getPlayableUrl(id: string, referer: string): Promise<string> {
		const embedUrl = trimStart(await this.getEmbedUrl(id), '/');

		const data = {
			app: 'OR-avo2',
			client: '', // TODO Required? -- SEE ARC-536
			referer: referer || this.host,
			maxage: this.ticketServiceMaxAge,
		};

		const playerTicket: PlayerTicket = await this.playerTicketsGotInstance.get<PlayerTicket>(
			embedUrl,
			{
				searchParams: data,
				resolveBodyOnly: true,
			}
		);

		return `${this.mediaServiceUrl}/${embedUrl}?token=${playerTicket.jwt}`;
	}

	public async getEmbedUrl(id: string): Promise<string> {
		const {
			data: { object_ie_by_pk: objectIe },
		} = await this.dataService.execute(GET_OBJECT_IE_PLAY_INFO_BY_ID, { id });
		if (!objectIe) {
			throw new NotFoundException(`Object IE with id '${id}' not found`);
		}

		return objectIe.schema_embed_url;
	}
}
