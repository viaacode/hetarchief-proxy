import {
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';
import { get } from 'lodash';

import { PlayerTicket } from '../player-ticket.types';

import { GetItemBrowsePathByExternalIdDocument } from '~generated/graphql-db-types-avo';
import { GetFileByRepresentationSchemaIdentifierDocument } from '~generated/graphql-db-types-hetarchief';
import { AvoOrHetArchief } from '~modules/admin/content-pages/content-pages.types';
import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class PlayerTicketService {
	private logger: Logger = new Logger(PlayerTicketService.name, { timestamp: true });
	private playerTicketsGotInstance: Got;
	private readonly ticketServiceMaxAge: number;
	private readonly mediaServiceUrl: string;
	private readonly host: string;

	constructor(protected configService: ConfigService, protected dataService: DataService) {
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
		let response;
		if (this.configService.get('avoOrHetArchief') === AvoOrHetArchief.hetArchief) {
			// Het archief
			response = await this.dataService.execute(
				GetFileByRepresentationSchemaIdentifierDocument,
				{
					id,
				}
			);
		} else {
			// AVO
			response = await this.dataService.execute(GetItemBrowsePathByExternalIdDocument, {
				externalId: id,
			});
		}

		const browsePath: string =
			get(response, 'data.app_item_meta[0].browse_path') ||
			get(response, 'data.object_file[0].schema_embed_url');
		if (!browsePath) {
			throw new NotFoundException(`Object with id '${id}' not found`);
		}

		return browsePath;
	}
}
