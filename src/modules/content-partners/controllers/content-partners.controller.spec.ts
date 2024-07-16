import { Test, type TestingModule } from '@nestjs/testing';

import { ContentPartnersService } from '../services/content-partners.service';

import { ContentPartnersController } from './content-partners.controller';

import { TestingLogger } from '~shared/logging/test-logger';

const mockContentPartnerResponse = {
	items: [
		{
			id: 'OR-test',
			name: 'cp-test',
		},
	],
	total: 1,
	pages: 1,
	page: 1,
	size: 1,
};

const mockContentPartnersService = {
	getContentPartners: jest.fn(),
};

describe('ContentPartnersController', () => {
	let contentPartnersController: ContentPartnersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ContentPartnersController],
			imports: [],
			providers: [
				{
					provide: ContentPartnersService,
					useValue: mockContentPartnersService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		contentPartnersController =
			module.get<ContentPartnersController>(ContentPartnersController);
	});

	it('should be defined', () => {
		expect(contentPartnersController).toBeDefined();
	});

	describe('getContentPartners', () => {
		it('should return all content partners', async () => {
			mockContentPartnersService.getContentPartners.mockResolvedValueOnce(
				mockContentPartnerResponse
			);

			const contentPartners = await contentPartnersController.getContentPartners({});

			expect(contentPartners.items.length).toBe(1);
			expect(contentPartners.size).toBe(1);
		});
	});
});
