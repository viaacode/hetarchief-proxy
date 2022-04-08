import { Test, TestingModule } from '@nestjs/testing';

import { SiteVariablesService } from './site-variables.service';

import { DataService } from '~modules/data/services/data.service';

const mockDataService = {
	execute: jest.fn(),
};

describe('SiteVariablesService', () => {
	let siteVariablesService: SiteVariablesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SiteVariablesService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		}).compile();

		siteVariablesService = module.get<SiteVariablesService>(SiteVariablesService);
	});

	it('services should be defined', () => {
		expect(siteVariablesService).toBeDefined();
	});

	describe('getSiteVariable', () => {
		it('returns the value for a site variable', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cms_site_variables_by_pk: {
						name: 'variable-name',
						value: {
							key: 'value',
						},
					},
				},
			});
			const response = await siteVariablesService.getSiteVariable<Record<string, string>>(
				'variable-name'
			);
			expect(response.key).toEqual('value');
		});
	});

	describe('updateSiteVariable', () => {
		it('can update the value for a site variable', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					update_cms_site_variables: {
						affected_rows: 1,
					},
				},
			});
			const response = await siteVariablesService.updateSiteVariable(
				'variable-name',
				'new-value'
			);
			expect(response).toEqual({ affected_rows: 1 });
		});
	});
});
