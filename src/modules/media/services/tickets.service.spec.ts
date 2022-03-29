import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import nock from 'nock';

import { Configuration } from '~config';

import { TicketsService } from './tickets.service';

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
		return key;
	}),
};

describe('TicketsService', () => {
	let ticketsService: TicketsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TicketsService,
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		}).compile();

		ticketsService = module.get<TicketsService>(TicketsService);
	});

	it('services should be defined', () => {
		expect(ticketsService).toBeDefined();
	});

	describe('getPlayerToken', () => {
		it('returns a token for a playable item', async () => {
			nock('http://ticketservice/')
				.get('/vrt/browse.mp4')
				.query(true)
				.reply(200, { jwt: 'secret-jwt-token' });

			const url = await ticketsService.getPlayerToken('vrt/browse.mp4', 'referer');
			expect(url).toEqual('secret-jwt-token');
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
				.reply(200, { jwt: 'secret-jwt-token' });
			const url = await ticketsService.getPlayerToken('vrt/browse.mp4', undefined);
			expect(url).toEqual('secret-jwt-token');
		});
	});

	describe('getThumbnailToken', () => {
		it('returns a thumbnail token', async () => {
			nock('http://ticketservice/')
				.get('/*/keyframes_all')
				.query(true)
				.reply(200, { jwt: 'secret-jwt-token' });
			const url = await ticketsService.getThumbnailToken('referer');
			expect(url).toEqual('secret-jwt-token');
		});

		it('uses the fallback referer if none was set', async () => {
			nock('http://ticketservice/')
				.get('/*/keyframes_all')
				.query({
					app: 'OR-*',
					client: '',
					referer: 'host',
					maxage: 'ticketServiceMaxAge',
				})
				.reply(200, { jwt: 'secret-jwt-token' });
			const url = await ticketsService.getThumbnailToken(undefined);
			expect(url).toEqual('secret-jwt-token');
		});
	});
});
