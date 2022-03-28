import {
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';
import { get } from 'lodash';

import { GetItemBrowsePathByExternalIdDocument } from '../../../../generated/graphql-db-types-avo';
import { PlayerTicket } from '../player-ticket.types';

import { GetFileByRepresentationSchemaIdentifierDocument } from 'src/generated/graphql-db-types-hetarchief';
import { AvoOrHetArchief } from '~modules/admin/content-pages/content-pages.types';
import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class PlayerTicketService {
	private logger: Logger = new Logger(PlayerTicketService.name, { timestamp: true });
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

	public async getPlayableUrl(embedUrl: string, referer: string, ip = ''): Promise<string> {
		const data = {
			app: 'OR-*',
			client: ip, // TODO: Wait for reply on ARC-536 and implement resolution
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
		if (this.configService.get('avoOrHetArchief') === AvoOrHetArchief.hetArchief) {
			// Het archief
			const {
				data: { object_file: objectFile },
			} = await this.dataService.execute(GetFileByRepresentationSchemaIdentifierDocument, {
				id,
			});

			if (!objectFile[0]) {
				throw new NotFoundException(`Object IE with id '${id}' not found`);
			}

			return objectFile[0].schema_embed_url;
		} else {
			// AVO
			const response = await this.dataService.execute(GetItemBrowsePathByExternalIdDocument, {
				externalId: id,
			});

			const browsePath: string = get(response, 'data.app_item_meta[0].browse_path');

			if (!browsePath) {
				throw new InternalServerErrorException({
					message:
						'Failed to get token for item since the item was not found or it does not have a browse_path',

					additionalInfo: {
						browsePath,
						id,
					},
				});
			}

			return browsePath;
		}
	}
}
