import { DataService } from '@meemoo/admin-core-api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { type Cache } from 'cache-manager';
import nock from 'nock';

import { type Configuration } from '~config';

import {
	getMockOrganisationResponse,
	mockGqlOrganisation,
	mockOrganisation1,
} from '../mocks/organisations.mocks';

import { OrganisationsService } from './organisations.service';

import { TestingLogger } from '~shared/logging/test-logger';

const mockConfigService = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'ORGANIZATIONS_API_V2_URL') {
			return 'http://fake-organisations-url.be';
		}

		return key;
	}),
};

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockCacheService: Partial<Record<keyof Cache, jest.SpyInstance>> = {
	wrap: jest.fn().mockImplementation((key, cb) => cb()),
};

describe('OrganisationService', () => {
	let organisationsService: OrganisationsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OrganisationsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
				{
					provide: CACHE_MANAGER,
					useValue: mockCacheService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		organisationsService = module.get<OrganisationsService>(OrganisationsService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	describe('findOrganisationsBySchemaIdentifiers', () => {
		it('should successfully find organisation by schema identifier', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				maintainer_organisation: [mockGqlOrganisation],
			});
			const result = await organisationsService.findOrganisationsBySchemaIdentifiers([
				'OR-rf5kf25',
			]);
			expect(result).toEqual([mockOrganisation1]);
		});
		it('should return empty array when the dataservice returns null', async () => {
			mockDataService.execute.mockResolvedValueOnce(null);
			const result = await organisationsService.findOrganisationsBySchemaIdentifiers([
				'non-existing-id',
			]);
			expect(result).toEqual([]);
		});
		it('should return null when the dataservice response has no organisations', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				maintainer_organisation: [],
			});
			const result = await organisationsService.findOrganisationsBySchemaIdentifiers([
				'non-existing-id',
			]);
			expect(result).toEqual([]);
		});
	});

	describe('adapt', () => {
		it('should successfully adapt a GqlOrganisation to an Organisation', async () => {
			const result = organisationsService.adapt(mockGqlOrganisation);

			expect(result).toEqual(mockOrganisation1);
		});
	});

	describe('updateOrganisationsCache', () => {
		it('should successfully updates the organisations cache', async () => {
			nock('http://fake-organisations-url.be')
				.post('/')
				.reply(200, getMockOrganisationResponse(51));

			mockDataService.execute.mockResolvedValueOnce(Promise.resolve()); // execute in emptyOrganizations method
			mockDataService.execute.mockResolvedValueOnce(Promise.resolve()); // execute in insertOrganizations method

			try {
				await organisationsService.updateOrganisationsCache();
			} catch (err) {
				expect(err).toBeUndefined();
			}
		});

		it("should throw InternalServerErrorException when there are less than 50 cp's", async () => {
			nock('http://fake-organisations-url.be')
				.post('/')
				.reply(200, getMockOrganisationResponse(0));

			mockDataService.execute.mockResolvedValueOnce(Promise.resolve()); // execute in emptyOrganizations method
			mockDataService.execute.mockResolvedValueOnce(Promise.resolve()); // execute in insertOrganizations method

			try {
				await organisationsService.updateOrganisationsCache();
				fail('updateOrganisationsCache should have thrown an error');
			} catch (err) {
				expect(err.name).toEqual('InternalServerErrorException');
				expect(err.message).toEqual('Failed to make update organization cache');
				expect(err.response.innerException.message).toEqual(
					'Request to organizations api was unsuccessful'
				);
			}
		});

		it('should throw InternalServerErrorException when organizations api throws an error', async () => {
			nock('http://fake-organisations-url.be').post('/').replyWithError('');

			mockDataService.execute.mockResolvedValueOnce(Promise.resolve()); // execute in emptyOrganizations method
			mockDataService.execute.mockResolvedValueOnce(Promise.resolve()); // execute in insertOrganizations method

			try {
				await organisationsService.updateOrganisationsCache();
				fail('updateOrganisationsCache should have thrown an error');
			} catch (err) {
				expect(err.name).toEqual('InternalServerErrorException');
				expect(err.message).toEqual('Failed to make update organization cache');
				expect(err.response.innerException.name).toEqual('RequestError');
			}
		});

		it('should throw InternalServerErrorException when emptyOrganizations() throws an error', async () => {
			nock('http://fake-organisations-url.be')
				.post('/')
				.reply(200, getMockOrganisationResponse(51));

			mockDataService.execute.mockRejectedValueOnce(''); // execute in emptyOrganizations method
			mockDataService.execute.mockResolvedValueOnce(Promise.resolve()); // execute in insertOrganizations method

			try {
				await organisationsService.updateOrganisationsCache();
				fail('updateOrganisationsCache should have thrown an error');
			} catch (err) {
				expect(err.name).toEqual('InternalServerErrorException');
				expect(err.message).toEqual('Failed to make update organization cache');
				expect(err.response.innerException.message).toEqual(
					'Failed to empty organizations'
				);
			}
		});
		it('should throw InternalServerErrorException when insertOrganizations() throws an error', async () => {
			nock('http://fake-organisations-url.be')
				.post('/')
				.reply(200, getMockOrganisationResponse(51));

			mockDataService.execute.mockResolvedValueOnce(Promise.resolve()); // execute in emptyOrganizations method
			mockDataService.execute.mockRejectedValueOnce(''); // execute in insertOrganizations method

			try {
				await organisationsService.updateOrganisationsCache();
				fail('updateOrganisationsCache should have thrown an error');
			} catch (err) {
				expect(err.name).toEqual('InternalServerErrorException');
				expect(err.message).toEqual('Failed to make update organization cache');
				expect(err.response.innerException.message).toEqual(
					'Failed to insert organizations'
				);
			}
		});
	});
	describe('onApplicationBootstrap', () => {
		it('should succesfully cache organisations', async () => {
			nock('http://fake-organisations-url.be')
				.post('/')
				.reply(200, getMockOrganisationResponse(51));

			mockDataService.execute.mockResolvedValueOnce(Promise.resolve()); // execute in emptyOrganizations method
			mockDataService.execute.mockResolvedValueOnce(Promise.resolve()); // execute in insertOrganizations method

			try {
				await organisationsService.onApplicationBootstrap();
			} catch (err) {
				expect(err).toBeUndefined();
			}
		});

		it('should throw an error when in fails to cache organisations', async () => {
			nock('http://fake-organisations-url.be')
				.post('/')
				.reply(200, getMockOrganisationResponse(0));

			mockDataService.execute.mockRejectedValueOnce(''); // execute in emptyOrganizations method
			mockDataService.execute.mockRejectedValueOnce(''); // execute in insertOrganizations method

			try {
				await organisationsService.onApplicationBootstrap();
				fail('onApplicationBootstrap should have logged an error');
			} catch (err) {
				expect(err).toBeDefined();
			}
		});
	});
});
