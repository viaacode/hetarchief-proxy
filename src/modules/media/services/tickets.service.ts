import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';

import { PlayerTicket } from '../types';

@Injectable()
export class TicketsService {
	private logger: Logger = new Logger(TicketsService.name, { timestamp: true });
	private playerTicketsGotInstance: Got;
	private ticketServiceMaxAge: number;
	private host: string;

	constructor(private configService: ConfigService) {
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
		this.host = this.configService.get('host');
	}

	public async getPlayerToken(embedUrl: string, referer: string): Promise<string> {
		const data = {
			app: 'OR-*',
			client: '', // TODO: Wait for reply on ARC-536 and implement resolution
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

		return playerTicket.jwt;
	}

	public async getThumbnailToken(referer: string): Promise<string> {
		const thumbnailPath = '*/keyframes_all';

		const data = {
			app: 'OR-*',
			client: '', // TODO: Wait for reply on ARC-536 and implement resolution
			referer: '', // referer || this.host,
			maxage: this.ticketServiceMaxAge,
		};
		// TODO delete log once this works on all envs
		this.logger.debug(data);
		const playerTicket: PlayerTicket = await this.playerTicketsGotInstance.get<PlayerTicket>(
			thumbnailPath,
			{
				searchParams: data,
				resolveBodyOnly: true,
			}
		);
		this.logger.debug(playerTicket);
		return playerTicket.jwt;
	}
}
