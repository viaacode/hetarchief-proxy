import { Test, TestingModule } from '@nestjs/testing';

import { SiteVariablesService } from './site-variables.service';

import {
	GetSiteVariableByNameQuery,
	UpdateSiteVariableByNameMutation,
} from '~generated/graphql-db-types-hetarchief';
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
			const mockData: GetSiteVariableByNameQuery = {
				app_config_by_pk: {
					name: 'variable-name',
					value: {
						key: 'value',
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await siteVariablesService.getSiteVariable<Record<string, string>>(
				'variable-name'
			);
			expect(response.key).toEqual('value');
		});
	});

	describe('updateSiteVariable', () => {
		it('can update the value for a site variable', async () => {
			const mockData: UpdateSiteVariableByNameMutation = {
				update_app_config: {
					affected_rows: 1,
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await siteVariablesService.updateSiteVariable(
				'variable-name',
				'new-value'
			);
			expect(response).toEqual({ affectedRows: 1 });
		});
	});
});
