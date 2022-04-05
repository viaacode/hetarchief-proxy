import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { Configuration } from '~config';

import { AvoOrHetArchief } from '~modules/admin/content-pages/content-pages.types';
import { Organisation } from '~modules/admin/organisations/organisations.types';
import { OrganisationsService } from '~modules/admin/organisations/services/organisations.service';
import { DataService } from '~modules/data/services/data.service';

const mockGqlHetArchiefOrganisation = {
	data: {
		cp_maintainer: [
			{
				information: {
					logo: {
						iri: 'http://meemoo.be/some-url',
					},
				},
				schema_name: 'VRT',
				schema_identifier: 'or-639k481',
			},
		],
	},
};

const mockGqlAvOOrganisation = {
	data: {
		shared_organisations: [
			{
				or_id: 'or-639k481',
				name: 'VRT',
				logo_url: 'http://meemoo.be/some-url',
			},
		],
	},
};

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'databaseApplicationType') {
			return AvoOrHetArchief.hetArchief;
		}
		return key;
	}),
};

const mockDataService = {
	execute: jest.fn(),
};

describe('OrganisationsService', () => {
	let organisationsService: OrganisationsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				OrganisationsService,
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

		organisationsService = module.get<OrganisationsService>(OrganisationsService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(organisationsService).toBeDefined();
	});

	describe('getOrganisations', () => {
		it('should return an organisations from the hetArchief database', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlHetArchiefOrganisation);
			const organisation: Organisation = await organisationsService.getOrganisation(
				'or-639k481'
			);
			expect(organisation.logo_url).toEqual(
				mockGqlHetArchiefOrganisation.data.cp_maintainer[0].information.logo.iri
			);
		});

		it('should return an organisations from the AvO database', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlAvOOrganisation);
			const organisation: Organisation = await organisationsService.getOrganisation(
				'or-639k481'
			);
			expect(organisation.logo_url).toEqual(
				mockGqlAvOOrganisation.data.shared_organisations[0].logo_url
			);
		});

		it('should return null if the organisations was not found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					shared_organisations: [],
				},
			});
			const organisation: Organisation = await organisationsService.getOrganisation(
				'or-639k481'
			);
			expect(organisation).toBeNull();
		});
	});
});
