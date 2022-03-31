import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';
import { addHours } from 'date-fns';
import nock from 'nock';

import { Configuration } from '~config';

import { PlayerTicket } from '../types';

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

const mockCacheManager: Partial<Record<keyof Cache, jest.SpyInstance>> = {
	get: jest.fn(),
	set: jest.fn(),
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
	},
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
				{
					provide: CACHE_MANAGER,
					useValue: mockCacheManager,
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
				.reply(200, mockPlayerTicket);

			const token = await ticketsService.getPlayerToken('vrt/browse.mp4', 'referer');
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
			const token = await ticketsService.getPlayerToken('vrt/browse.mp4', undefined);
			expect(token).toEqual('secret-jwt-token');
		});
	});

	describe('getThumbnailToken', () => {
		it('returns a thumbnail token', async () => {
			nock('http://ticketservice/')
				.get('/TESTBEELD/keyframes_all')
				.query(true)
				.reply(200, mockPlayerTicket);
			const token = await ticketsService.getThumbnailToken('referer');
			expect(token).toEqual('secret-jwt-token');
		});

		it('uses the fallback referer if none was set', async () => {
			nock('http://ticketservice/')
				.get('/TESTBEELD/keyframes_all')
				.query({
					app: 'OR-*',
					client: '',
					referer: 'host',
					maxage: 'ticketServiceMaxAge',
				})
				.reply(200, mockPlayerTicket);
			const token = await ticketsService.getThumbnailToken(undefined);
			expect(token).toEqual('secret-jwt-token');
		});

		it('returns the cached token if available', async () => {
			mockCacheManager.get.mockResolvedValueOnce(mockPlayerTicket);
			const token = await ticketsService.getThumbnailToken('referer');
			expect(token).toEqual('secret-jwt-token');
		});
	});
});
