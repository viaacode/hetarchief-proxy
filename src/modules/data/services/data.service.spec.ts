import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import nock from 'nock';

import { QueryOrigin } from '../types';

import { DataPermissionsService } from './data-permissions.service';
import { DataService } from './data.service';

const mockDataPermissionsService = {
	verify: jest.fn(),
};

const mockConfigService = {
	get: jest.fn((key: string): string | boolean => {
		if (key === 'GRAPHQL_URL') {
			return 'http://localhost/v1/graphql/';
		}
		if (key === 'GRAPHQL_SECRET') {
			return 'graphQl-$ecret';
		}
		return key;
	}),
};

const mockQuery = { query: 'query testQuery { username }' };

describe('DataService', () => {
	let dataService: DataService;
	let configService: ConfigService;
	let dataPermissionsService: DataPermissionsService;

	beforeEach(async () => {
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
			mockConfigService.get.mockReturnValueOnce(false); // return a value for GRAPHQL_ENABLE_WHITELIST
			mockDataPermissionsService.verify.mockResolvedValueOnce(true);
			const result = await dataService.isAllowedToExecuteQuery(mockQuery, QueryOrigin.CLIENT);
			expect(result).toEqual(true);
			expect(mockDataPermissionsService.verify).toHaveBeenCalled();
		});

		it('should NOT allow a query when permissions are not verified', async () => {
			mockConfigService.get.mockReturnValueOnce(false); // return a value for GRAPHQL_ENABLE_WHITELIST
			mockDataPermissionsService.verify.mockResolvedValueOnce(false);
			const result = await dataService.isAllowedToExecuteQuery(mockQuery, QueryOrigin.CLIENT);
			expect(result).toEqual(false);
			expect(mockDataPermissionsService.verify).toHaveBeenCalled();
		});
	});

	describe('isWhitelist', () => {
		it('should return the GRAPHQL_ENABLE_WHITELIST variable from the ConfigService', () => {
			mockConfigService.get.mockReturnValueOnce(false);
			expect(dataService.isWhitelistEnabled()).toEqual(false);

			mockConfigService.get.mockReturnValueOnce(true);
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
	});
});
