import { Test, type TestingModule } from '@nestjs/testing';

import type { Organisation } from '../organisations.types';
import { OrganisationsService } from '../services/organisations.service';

import { OrganisationsController } from './organisations.controller';

describe('OrganisationsController', () => {
	let organisationsController: OrganisationsController;
	let organisationsService: Partial<Record<keyof OrganisationsService, jest.Mock>>;

	beforeEach(async () => {
		organisationsService = {
			findOrganisationBySlug: jest.fn(),
			fetchRandomContentPartnersForMaintainerGrid: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			controllers: [OrganisationsController],
			providers: [
				{
					provide: OrganisationsService,
					useValue: organisationsService,
				},
			],
		}).compile();

		organisationsController = module.get<OrganisationsController>(OrganisationsController);
	});

	describe('getOrganisationBySlug', () => {
		it('should return an organisation by slug', async () => {
			const mockOrganisation: Organisation = {
				schemaIdentifier: 'OR-w66976m',
				contactPoint: null,
				description: null,
				logo: null,
				sector: null,
				schemaName: 'VRT',
				slug: 'vrt',
				createdAt: null,
				updatedAt: null,
				formUrl: null,
			};
			organisationsService.findOrganisationBySlug.mockResolvedValue(mockOrganisation);

			const result = await organisationsController.getOrganisationBySlug('test-slug');
			expect(result).toEqual(mockOrganisation);
			expect(organisationsService.findOrganisationBySlug).toHaveBeenCalledWith('test-slug');
		});

		it('should return null if organisation is not found', async () => {
			organisationsService.findOrganisationBySlug.mockResolvedValue(null);

			const result = await organisationsController.getOrganisationBySlug('non-existent-slug');
			expect(result).toBeNull();
			expect(organisationsService.findOrganisationBySlug).toHaveBeenCalledWith('non-existent-slug');
		});
	});

	describe('fetchOrganisationsForMaintainerGrid', () => {
		it('should return organisations for maintainer grid', async () => {
			const mockOrganisations = [
				/* mock organisations data */
			];
			organisationsService.fetchRandomContentPartnersForMaintainerGrid.mockResolvedValue(
				mockOrganisations
			);

			const result = await organisationsController.fetchOrganisationsForMaintainerGrid(10);
			expect(result).toEqual(mockOrganisations);
			expect(organisationsService.fetchRandomContentPartnersForMaintainerGrid).toHaveBeenCalledWith(
				10
			);
		});
	});
});
