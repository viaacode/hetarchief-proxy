import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { addHours } from 'date-fns';
import nock from 'nock';

import { Configuration } from '~config';

import {
	GetFileByRepresentationSchemaIdentifierQuery,
	GetThumbnailUrlByIdQuery,
} from '~generated/graphql-db-types-hetarchief';
import { AvoOrHetArchief } from '~modules/admin/content-pages/content-pages.types';
import { PlayerTicket } from '~modules/admin/player-ticket/player-ticket.types';
import { PlayerTicketService } from '~modules/admin/player-ticket/services/player-ticket.service';
import { DataService } from '~modules/data/services/data.service';
import { TestingLogger } from '~shared/logging/test-logger';

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'elasticSearchUrl') {
			return 'http://elasticsearch'; // should be a syntactically valid url
		}
		if (key === 'ticketServiceUrl') {
			return 'http://ticketservice';
		}
		if (key === 'mediaServiceUrl') {
			return 'http://mediaservice';
		}
		if (key === 'databaseApplicationType') {
			return AvoOrHetArchief.hetArchief;
		}
		return key;
	}),
};

const mockDataService = {
	execute: jest.fn(),
};

const mockCacheManager: Partial<Record<keyof Cache, jest.SpyInstance>> = {
	wrap: jest.fn(),
};

const mockPlayerTicket: PlayerTicket = {
	jwt: 'secret-jwt-token',
	context: {
		app: 'OR-*',
		name: 'TESTBEELD/keyframes_all',
		referer: 'http://localhost:3200',
		ip: '',
		fragment: null,
		expiration: addHours(new Date(), 4).toISOString(),
		aud: '',
		exp: new Date().getTime() + 5000000,
		sub: '',
	},
};

describe('PlayerTicketService', () => {
	let playerTicketService: PlayerTicketService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PlayerTicketService,
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: CACHE_MANAGER,
					useValue: mockCacheManager,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		playerTicketService = module.get<PlayerTicketService>(PlayerTicketService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(playerTicketService).toBeDefined();
	});

	describe('getPlayableUrl', () => {
		it('returns a playable url', async () => {
			nock('http://ticketservice/')
				.get('/vrt/item-1')
				.query(true)
				.reply(200, { jwt: 'secret-jwt-token' });
			const url = await playerTicketService.getPlayableUrl('vrt/item-1', 'referer');
			expect(url).toEqual('http://mediaservice/vrt/item-1?token=secret-jwt-token');
		});

		it('uses the fallback referer if none was set', async () => {
			nock('http://ticketservice/')
				.get('/vrt/item-1')
				.query({
					app: 'OR-*',
					client: '',
					referer: 'host',
					maxage: 'ticketServiceMaxAge',
				})
				.reply(200, { jwt: 'secret-jwt-token' });
			const url = await playerTicketService.getPlayableUrl('vrt/item-1', undefined);
			expect(url).toEqual('http://mediaservice/vrt/item-1?token=secret-jwt-token');
		});
	});

	describe('getEmbedUrl', () => {
		it('returns the embedUrl for an item', async () => {
			const mockData: GetFileByRepresentationSchemaIdentifierQuery = {
				object_file: [{ schema_embed_url: 'vrt/item-1' }],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const url = await playerTicketService.getEmbedUrl('vrt-id');
			expect(url).toEqual('vrt/item-1');
		});

		it('returns the embedUrl for an avo item', async () => {
			const mockData: GetFileByRepresentationSchemaIdentifierQuery = {
				object_file: [{ schema_embed_url: 'vrt/item-1' }],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			mockConfigService.get.mockResolvedValueOnce(AvoOrHetArchief.avo);
			const url = await playerTicketService.getEmbedUrl('vrt-id');
			expect(url).toEqual('vrt/item-1');
		});

		it('throws a not found exception if the item was not found', async () => {
			const mockData: GetFileByRepresentationSchemaIdentifierQuery = {
				object_file: [],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			let error;
			try {
				await playerTicketService.getEmbedUrl('unknown-id');
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				error: 'Not Found',
				message: "Object file with representation_id 'unknown-id' not found",
				statusCode: 404,
			});
		});
	});

	describe('getPlayerToken', () => {
		it('returns a token for a playable item', async () => {
			nock('http://ticketservice/')
				.get('/vrt/browse.mp4')
				.query(true)
				.reply(200, mockPlayerTicket);

			const token = await playerTicketService.getPlayerToken('vrt/browse.mp4', 'referer');
			expect(token).toEqual('secret-jwt-token');
		});

		it('uses the fallback referer if none was set', async () => {
			nock('http://ticketservice/')
				.get('/vrt/browse.mp4')
				.query({
					app: 'OR-*',
					client: '',
					referer: 'host',
					maxage: 'ticketServiceMaxAge',
				})
				.reply(200, mockPlayerTicket);
			const token = await playerTicketService.getPlayerToken('vrt/browse.mp4', undefined);
			expect(token).toEqual('secret-jwt-token');
		});
	});

	describe('getThumbnailToken', () => {
		it('returns a thumbnail token', async () => {
			nock('http://ticketservice/')
				.get('/TESTBEELD/keyframes_all')
				.query(true)
				.reply(200, mockPlayerTicket);

			mockCacheManager.wrap.mockImplementationOnce(async (key, fn, options) => {
				const ticket = await fn();
				await options.ttl(ticket);
				return ticket;
			});
			const token = await playerTicketService.getThumbnailToken('referer');
			expect(token).toEqual('secret-jwt-token');
		});

		it('throws an InternalServerErrorException on error', async () => {
			mockCacheManager.wrap.mockRejectedValueOnce('error');
			let error;
			try {
				await playerTicketService.getThumbnailToken('referer');
			} catch (e) {
				error = e;
			}
			expect(error.name).toEqual('InternalServerErrorException');
			expect(error.message).toEqual('Could not get a thumbnail token');
		});
	});

	describe('getThumbnailUrl', () => {
		it('returns a thumbnail url', async () => {
			const mockData: GetThumbnailUrlByIdQuery = {
				object_ie: [
					{ schema_thumbnail_url: 'vrt/item-1' },
				] as GetThumbnailUrlByIdQuery['object_ie'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const getThumbnailTokenSpy = jest
				.spyOn(playerTicketService, 'getThumbnailToken')
				.mockResolvedValueOnce('secret-jwt-token');

			const url = await playerTicketService.getThumbnailUrl('vrt-id', 'referer');
			expect(url).toEqual('http://mediaservice/vrt/item-1?token=secret-jwt-token');

			getThumbnailTokenSpy.mockRestore();
		});
	});

	describe('resolveThumbnailUrl', () => {
		it('does not get a token for an invalid path', async () => {
			const getThumbnailTokenSpy = jest.spyOn(playerTicketService, 'getThumbnailToken');

			const url = await playerTicketService.resolveThumbnailUrl('', 'referer');
			expect(url).toEqual('');
			expect(getThumbnailTokenSpy).not.toBeCalled();

			getThumbnailTokenSpy.mockRestore();
		});

		it('does not get a token for an invalid referer', async () => {
			const getThumbnailTokenSpy = jest.spyOn(playerTicketService, 'getThumbnailToken');

			const url = await playerTicketService.resolveThumbnailUrl('http://thumbnail.jpg', null);
			expect(url).toEqual('http://thumbnail.jpg');
			expect(getThumbnailTokenSpy).not.toBeCalled();

			getThumbnailTokenSpy.mockRestore();
		});
	});

	describe('getThumbnailPath', () => {
		it('returns the thumbnail url for an item', async () => {
			const mockData: GetThumbnailUrlByIdQuery = {
				object_ie: [
					{ schema_thumbnail_url: 'vrt/item-1' },
				] as GetThumbnailUrlByIdQuery['object_ie'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const url = await playerTicketService.getThumbnailPath('vrt-id');
			expect(url).toEqual('vrt/item-1');
		});

		it('throws a notfoundexception if the item was not found', async () => {
			const mockData: GetThumbnailUrlByIdQuery = {
				object_ie: [],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			let error;
			try {
				await playerTicketService.getThumbnailPath('unknown-id');
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				error: 'Not Found',
				message: "Object IE with id 'unknown-id' not found",
				statusCode: 404,
			});
		});
	});
});
