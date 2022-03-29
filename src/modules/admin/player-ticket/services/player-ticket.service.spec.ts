import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import nock from 'nock';

import { Configuration } from '~config';

import { PlayerTicketService } from '~modules/admin/player-ticket/services/player-ticket.service';
import { DataService } from '~modules/data/services/data.service';

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
			return 'hetArchief';
		}
		return key;
	}),
};

const mockDataService = {
	execute: jest.fn(),
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
			],
		}).compile();

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
			mockDataService.execute.mockResolvedValueOnce({
				data: { object_file: [{ schema_embed_url: 'vrt/item-1' }] },
			});
			const url = await playerTicketService.getEmbedUrl('vrt-id');
			expect(url).toEqual('vrt/item-1');
		});

		it('throws a not found exception if the item was not found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					object_file: [],
				},
			});
			let error;
			try {
				await playerTicketService.getEmbedUrl('unknown-id');
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				error: 'Not Found',
				message: "Object with id 'unknown-id' not found",
				statusCode: 404,
			});
		});
	});
});
