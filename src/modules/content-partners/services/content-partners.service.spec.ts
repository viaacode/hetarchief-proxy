import { DataService } from '@meemoo/admin-core-api';
import { Test, type TestingModule } from '@nestjs/testing';
import { type MockInstance, beforeEach, describe, expect, it, vi } from 'vitest';

import { ContentPartnersService } from './content-partners.service';

import type { FindContentPartnersQuery } from '~generated/graphql-db-types-hetarchief';
import { TestingLogger } from '~shared/logging/test-logger';

const mockDataService: Partial<Record<keyof DataService, MockInstance>> = {
	execute: vi.fn(),
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
				id: 'https://data-int.hetarchief.be/id/organization/OR-test',
				org_identifier: 'OR-test',
				skos_pref_label: 'Test org',
			});
			// test some sample keys
			expect(adapted).toEqual({
				id: 'OR-test',
				name: 'Test org',
			});
		});
	});

	describe('getContentPartners', () => {
		it('returns all content partners', async () => {
			const mockData = {
				graph_organisations_with_objects: [
					{
						org_identifier: 'OR-test',
						skos_pref_label: 'Test org',
					},
				],
				graph_organisations_with_objects_aggregate: {
					aggregate: {
						count: 1,
					},
				},
			} as FindContentPartnersQuery;
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const response = await contentPartnersService.getContentPartners({});
			expect(response.items.length).toBe(1);
			expect(response.items[0].id).toEqual('OR-test');
			expect(response.total).toBe(1);
		});

		it('filters on hasSpace', async () => {
			const mockData = {
				graph_organisations_with_objects: [
					{
						org_identifier: 'OR-test',
						skos_pref_label: 'Test org',
					},
				],
				graph_organisations_with_objects_aggregate: {
					aggregate: {
						count: 1,
					},
				},
			} as FindContentPartnersQuery;
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const response = await contentPartnersService.getContentPartners({ hasSpace: false });
			expect(response.items.length).toBe(1);
			expect(response.items[0].id).toEqual('OR-test');
			expect(response.total).toBe(1);
		});
	});
});
