import { DataService } from '@meemoo/admin-core-api';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { Configuration } from '~config';

import { mockGqlOrganisation, mockOrganisation } from '../mocks/organisations.mocks';

import { OrganisationsService } from './organisations.service';

import { TestingLogger } from '~shared/logging/test-logger';

const mockConfigService = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'PROXY_API_KEY') {
			return 'fakeApiKey';
		}

		return key;
	}),
};
const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
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
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		organisationsService = module.get<OrganisationsService>(OrganisationsService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	describe('findOrganisationBySchemaIdentifier', () => {
		it('successfully find organisation by schema identifier', async () => {
			mockDataService.execute.mockResolvedValueOnce(''); //todo
			expect(1).toEqual(1);
		});
	});
	describe('adapt', () => {
		it('successfully adapt a GqlOrganisation to an Organisation', async () => {
			const result = organisationsService.adapt(mockGqlOrganisation);

			expect(result).toEqual(mockOrganisation);
		});
	});
});
