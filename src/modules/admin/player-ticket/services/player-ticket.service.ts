import { CACHE_MANAGER, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { differenceInSeconds } from 'date-fns';
import got, { Got } from 'got';
import { get } from 'lodash';

import { Configuration, getConfig } from '~config';

import { PlayerTicket } from '../player-ticket.types';

import { GetItemBrowsePathByExternalIdDocument } from '~generated/graphql-db-types-avo';
import {
	GetFileByRepresentationSchemaIdentifierDocument,
	GetThumbnailUrlByIdDocument,
} from '~generated/graphql-db-types-hetarchief';
import { AvoOrHetArchief } from '~modules/admin/content-pages/content-pages.types';
import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class PlayerTicketService {
	private logger: Logger = new Logger(PlayerTicketService.name, { timestamp: true });
	private playerTicketsGotInstance: Got;
	private readonly ticketServiceMaxAge: number;
	private readonly mediaServiceUrl: string;
	private readonly host: string;

	constructor(
		protected configService: ConfigService,
		protected dataService: DataService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {
		this.playerTicketsGotInstance = got.extend({
			prefixUrl: getConfig(this.configService, 'ticketServiceUrl'),
			resolveBodyOnly: true,
			responseType: 'json',
			https: {
				rejectUnauthorized: false,
				certificate: getConfig(this.configService, 'ticketServiceCertificate'),
				key: getConfig(this.configService, 'ticketServiceKey'),
				passphrase: getConfig(this.configService, 'ticketServicePassphrase'),
			},
		});
		this.ticketServiceMaxAge = getConfig(this.configService, 'ticketServiceMaxAge');
		this.mediaServiceUrl = getConfig(this.configService, 'mediaServiceUrl');
		this.host = getConfig(this.configService, 'host');
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

	public async getPlayableUrl(embedUrl: string, referer: string): Promise<string> {
		const token = await this.getPlayerToken(embedUrl, referer);

		return `${this.mediaServiceUrl}/${embedUrl}?token=${token}`;
	}

	public async getEmbedUrl(id: string): Promise<string> {
		let response;
		if (
			getConfig(this.configService, 'databaseApplicationType') === AvoOrHetArchief.hetArchief
		) {
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
			throw new NotFoundException(`Object file with representation_id '${id}' not found`);
		}

		return browsePath;
	}

	public async resolveThumbnailUrl(path: string, referer: string): Promise<string> {
		if (!path) {
			return path;
		}
		const token = await this.getThumbnailToken(referer);
		return `${this.mediaServiceUrl}/${path}?token=${token}`;
	}

	public async getThumbnailUrl(id: string, referer: string): Promise<string> {
		const thumbnailPath = await this.getThumbnailPath(id);
		return this.resolveThumbnailUrl(thumbnailPath, referer);
	}

	public async getThumbnailPath(id: string): Promise<string> {
		const {
			data: { object_ie: objectIe },
		} = await this.dataService.execute(GetThumbnailUrlByIdDocument, { id });
		if (!objectIe[0]) {
			throw new NotFoundException(`Object IE with id '${id}' not found`);
		}

		return objectIe[0].schema_thumbnail_url;
	}
}
