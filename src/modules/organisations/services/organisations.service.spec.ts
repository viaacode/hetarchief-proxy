import { DataService } from '@meemoo/admin-core-api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, type TestingModule } from '@nestjs/testing';
import { type Cache } from 'cache-manager';

import { mockGqlOrganisation, mockOrganisation1 } from '../mocks/organisations.mocks';

import { OrganisationsService } from './organisations.service';

import type { FindOrganisationsBySchemaIdsQuery } from '~generated/graphql-db-types-hetarchief';
import { TestingLogger } from '~shared/logging/test-logger';

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
				graph_organization: [mockGqlOrganisation],
			} as FindOrganisationsBySchemaIdsQuery);
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
});
