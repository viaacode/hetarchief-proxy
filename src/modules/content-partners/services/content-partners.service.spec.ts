import { Test, TestingModule } from '@nestjs/testing';

import { ContentPartnersService } from './content-partners.service';

import { GetTosLastUpdatedAtQuery } from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';
import { TestingLogger } from '~shared/logging/test-logger';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

describe('ContentPartnersService', () => {
	let contentPartnersService: ContentPartnersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ContentPartnersService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		contentPartnersService = module.get<ContentPartnersService>(ContentPartnersService);
	});

	it('services should be defined', () => {
		expect(contentPartnersService).toBeDefined();
	});

	describe('adapt', () => {
		it('can adapt a hasura response to our tos interface', () => {
			const adapted = contentPartnersService.adapt({
				schema_identifier: 'OR-test',
				schema_name: 'test-org',
			});
			// test some sample keys
			expect(adapted).toEqual({
				id: 'OR-test',
				name: 'test-org',
			});
		});
	});

	describe('getContentPartners', () => {
		it('returns all content partners', async () => {
			const mockData = {
				maintainer_content_partner: [
					{
						schema_identifier: 'OR-test',
						schema_name: 'test-org',
					},
				],
				maintainer_content_partner_aggregate: {
					aggregate: {
						count: 1,
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });

			const response = await contentPartnersService.getContentPartners({});
			expect(response.items.length).toBe(1);
			expect(response.items[0].id).toEqual('OR-test');
			expect(response.total).toBe(1);
		});

		it('filters on hasSpace', async () => {
			const mockData = {
				maintainer_content_partner: [
					{
						schema_identifier: 'OR-test',
						schema_name: 'test-org',
					},
				],
				maintainer_content_partner_aggregate: {
					aggregate: {
						count: 1,
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });

			const response = await contentPartnersService.getContentPartners({ hasSpace: false });
			expect(response.items.length).toBe(1);
			expect(response.items[0].id).toEqual('OR-test');
			expect(response.total).toBe(1);
		});
	});
});
