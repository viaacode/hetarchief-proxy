import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { differenceInSeconds } from 'date-fns';
import got, { Got } from 'got';

import { PlayerTicket } from '../types';

@Injectable()
export class TicketsService {
	private logger: Logger = new Logger(TicketsService.name, { timestamp: true });
	private playerTicketsGotInstance: Got;
	private ticketServiceMaxAge: number;
	private host: string;

	constructor(
		private configService: ConfigService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {
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

	protected async getToken(path: string, referer: string): Promise<PlayerTicket> {
		const data = {
			app: 'OR-*',
			client: '', // TODO: Wait for reply on ARC-536 and implement resolution
			referer: referer || this.host,
			maxage: this.ticketServiceMaxAge,
		};

		const playerTicket: PlayerTicket = await this.playerTicketsGotInstance.get<PlayerTicket>(
			path,
			{
				searchParams: data,
				resolveBodyOnly: true,
			}
		);

		return playerTicket;
	}

	public async getPlayerToken(embedUrl: string, referer: string): Promise<string> {
		// no caching
		const token = await this.getToken(embedUrl, referer);
		return token.jwt;
	}

	public async getThumbnailToken(referer: string): Promise<string> {
		const thumbnailPath = 'TESTBEELD/keyframes_all';

		let token: PlayerTicket = await this.cacheManager.get(`thumbnailToken-${referer}`);
		if (!token) {
			token = await this.getToken(thumbnailPath, referer);
			const ttl = differenceInSeconds(new Date(token.context.expiration), new Date()) - 60; // 60s margin to get the new token
			await this.cacheManager.set(`thumbnailToken-${referer}`, token, { ttl });
		}

		return token.jwt;
	}
}
