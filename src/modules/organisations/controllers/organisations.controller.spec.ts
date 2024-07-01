import { ConfigService } from '@nestjs/config/dist/config.service';
import { Test, type TestingModule } from '@nestjs/testing';

import { type Configuration } from '~config';

import { OrganisationsService } from '../services/organisations.service';

import { OrganisationsController } from './organisations.controller';

const mockConfigService = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'PROXY_API_KEY') {
			return 'fakeApiKey';
		}

		return key;
	}),
};

const mockOrganisationsService: Partial<Record<keyof OrganisationsService, jest.SpyInstance>> = {
	updateOrganisationsCache: jest.fn(),
};

describe('OrganisationController', () => {
	let organisationsController: OrganisationsController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [OrganisationsController],
			providers: [
				{
					provide: OrganisationsService,
					useValue: mockOrganisationsService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		}).compile();

		organisationsController = app.get<OrganisationsController>(OrganisationsController);
	});

	describe('getOrganisationElementsForUser', () => {
		it('should return a message when the update is succesful', async () => {
			mockOrganisationsService.updateOrganisationsCache.mockResolvedValueOnce({});

			const result =
				await organisationsController.getOrganisationElementsForUser('fakeApiKey');

			expect(result).toEqual({ message: 'cache has been updated successfully' });
		});
	});
});
