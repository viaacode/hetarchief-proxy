import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import fse from 'fs-extra';
import nock from 'nock';

import { QueryOrigin } from '../types';

import { DataPermissionsService } from './data-permissions.service';
import { DataService } from './data.service';

jest.mock('fs-extra');

const mockedFse = fse as any;

const mockDataPermissionsService: Partial<Record<keyof DataPermissionsService, jest.SpyInstance>> =
	{
		verify: jest.fn(),
	};

const mockConfigService = {
	get: jest.fn((key: string): string | boolean => {
		if (key === 'graphQlUrl') {
			return 'http://localhost/v1/graphql/';
		}
		if (key === 'graphQlSecret') {
			return 'graphQl-$ecret';
		}
		if (key == 'graphQlEnableWhitelist') {
			return false; // For testing we disable the whitelist by default
		}
		return key;
	}),
};

const mockQuery = { query: 'query testQuery { username }' };

describe('DataService - no whitelist', () => {
	let dataService: DataService;
	let configService: ConfigService;
	let dataPermissionsService: DataPermissionsService;

	const mockFiles = {};

	beforeEach(async () => {
		mockedFse.__setMockFiles(mockFiles);
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DataService,
				{
					provide: DataPermissionsService,
					useValue: mockDataPermissionsService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		}).compile();

		dataService = module.get<DataService>(DataService);
		configService = module.get<ConfigService>(ConfigService);
		dataPermissionsService = module.get<DataPermissionsService>(DataPermissionsService);
	});

	it('services should be defined', () => {
		expect(dataService).toBeDefined();
		expect(configService).toBeDefined();
		expect(dataPermissionsService).toBeDefined();
	});

	describe('isAllowedToExecuteQuery', () => {
		it('should allow a query when permissions are verified', async () => {
			mockDataPermissionsService.verify.mockResolvedValueOnce(true);
			const result = await dataService.isAllowedToExecuteQuery(mockQuery, QueryOrigin.CLIENT);
			expect(result).toEqual(true);
			expect(mockDataPermissionsService.verify).toHaveBeenCalled();
		});

		it('should NOT allow a query when permissions are not verified', async () => {
			mockDataPermissionsService.verify.mockResolvedValueOnce(false);
			const result = await dataService.isAllowedToExecuteQuery(mockQuery, QueryOrigin.CLIENT);
			expect(result).toEqual(false);
			expect(mockDataPermissionsService.verify).toHaveBeenCalled();
		});
	});

	describe('isWhitelist', () => {
		it('should return the setting variable from the ConfigService', () => {
			expect(dataService.isWhitelistEnabled()).toEqual(false);
		});

		it('should be able to update the whitelist setting', () => {
			dataService.setWhitelistEnabled(true);
			expect(dataService.isWhitelistEnabled()).toEqual(true);
		});
	});

	describe('executeClientQuery', () => {
		it('should execute a query and return a result', async () => {
			nock('http://localhost/').post('/v1/graphql/').reply(201, {
				data: 'ok',
			});
			mockDataPermissionsService.verify.mockReturnValueOnce(true);
			const result = await dataService.executeClientQuery(mockQuery);
			expect(result).toEqual({
				data: 'ok',
			});
		});

		it('should throw an UnauthorizedException when the query is not allowed to be executed', async () => {
			mockDataPermissionsService.verify.mockReturnValueOnce(false);
			let error;
			try {
				await dataService.executeClientQuery(mockQuery);
			} catch (e) {
				error = e.response;
			}
			expect(error).toEqual({
				error: 'Unauthorized',
				statusCode: 401,
				message: 'You are not authorized to execute this query',
			});
		});

		it('should return an internal server exception when the query could not be executed', async () => {
			nock('http://localhost/').post('/v1/graphql/').reply(500, {
				statusCode: 500,
				message: 'Internal Server Error',
			});
			mockDataPermissionsService.verify.mockReturnValueOnce(true);
			let error;
			try {
				await dataService.executeClientQuery(mockQuery);
			} catch (e) {
				error = e.response;
			}

			expect(error).toEqual({ message: 'Internal Server Error', statusCode: 500 });
		});

		it('should not execute a not-whitelisted query', async () => {
			dataService.setWhitelistEnabled(true);
			let error;
			try {
				await dataService.executeClientQuery(mockQuery);
			} catch (e) {
				error = e.response;
			}
			expect(error).toEqual({
				error: 'Unauthorized',
				statusCode: 401,
				message: 'You are not authorized to execute this query',
			});
		});

		it('should throw an internal server error when the graphql server returns errors', async () => {
			nock('http://localhost/')
				.post('/v1/graphql/')
				.reply(201, {
					errors: [
						{
							message: 'unknown graphql error',
						},
					],
				});
			mockDataPermissionsService.verify.mockReturnValueOnce(true);
			let error;
			try {
				await dataService.executeClientQuery(mockQuery);
			} catch (e) {
				error = e.response;
			}

			expect(error).toEqual({ message: 'Internal Server Error', statusCode: 500 });
		});
	});
});

describe('DataService - with whitelist', () => {
	let dataService: DataService;

	const mockFiles = {
		'proxy-whitelist.json': '{ "GET_PROXY_QUERY": "query getProxyQuery() {}"	}',
		'client-whitelist.json': '{	"GET_CLIENT_QUERY": "query getClientQuery() {}" }',
	};

	beforeEach(async () => {
		mockedFse.__setMockFiles(mockFiles);

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DataService,
				{
					provide: DataPermissionsService,
					useValue: mockDataPermissionsService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		}).compile();

		dataService = module.get<DataService>(DataService);
	});

	describe('executeClientQuery', () => {
		it('should execute a query with whitelist enabled and return a result', async () => {
			nock('http://localhost/').post('/v1/graphql/').reply(201, {
				data: 'ok',
			});
			dataService.setWhitelistEnabled(true);
			mockDataPermissionsService.verify.mockReturnValueOnce(true);
			const result = await dataService.executeClientQuery({
				query: 'query getClientQuery()',
			});
			expect(result).toEqual({
				data: 'ok',
			});
		});

		it('should not execute a not whitelisted query', async () => {
			nock('http://localhost/').post('/v1/graphql/').reply(201, {
				data: 'ok',
			});
			dataService.setWhitelistEnabled(true);
			mockDataPermissionsService.verify.mockReturnValueOnce(true);
			let error;
			try {
				await dataService.executeClientQuery({
					query: 'query unknown()',
				});
			} catch (e) {
				error = e.response;
			}
			expect(error).toEqual({
				error: 'Unauthorized',
				statusCode: 401,
				message: 'You are not authorized to execute this query',
			});
		});
	});
});

describe('DataService - no whitelist files', () => {
	let dataService: DataService;
	let configService: ConfigService;
	let dataPermissionsService: DataPermissionsService;

	beforeEach(async () => {
		mockedFse.existsSync = () => false;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DataService,
				{
					provide: DataPermissionsService,
					useValue: mockDataPermissionsService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		}).compile();

		dataService = module.get<DataService>(DataService);
		configService = module.get<ConfigService>(ConfigService);
		dataPermissionsService = module.get<DataPermissionsService>(DataPermissionsService);
	});

	it('services should be defined when no whitelist files are available', () => {
		expect(dataService).toBeDefined();
		expect(configService).toBeDefined();
		expect(dataPermissionsService).toBeDefined();
	});
});
