import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { Configuration } from '~config';

import { ContentPagesService } from '~modules/admin/content-pages/services/content-pages.service';
import { AdminOrganisationsService } from '~modules/admin/organisations/services/admin-organisations.service';
import { PlayerTicketService } from '~modules/admin/player-ticket/services/player-ticket.service';
import { DataService } from '~modules/data/services/data.service';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'elasticSearchUrl') {
			return 'http://elasticsearch'; // should be a syntactically valid url
		}
		if (key === 'ticketServiceUrl') {
			return 'http://ticketservice';
		}
		if (key === 'mediaServiceUrl') {
			return 'http://mediaservice';
		}
		return key;
	}),
};

const mockPlayerTicketService: Partial<Record<keyof PlayerTicketService, jest.SpyInstance>> = {
	getPlayableUrl: jest.fn(),
	getEmbedUrl: jest.fn(),
};

const mockOrganisationsService: Partial<Record<keyof AdminOrganisationsService, jest.SpyInstance>> =
	{
		getOrganisation: jest.fn(),
		adapt: jest.fn(),
	};

describe('ContentPagesService', () => {
	let contentPagesService: ContentPagesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ContentPagesService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
				{
					provide: PlayerTicketService,
					useValue: mockPlayerTicketService,
				},
				{
					provide: AdminOrganisationsService,
					useValue: mockOrganisationsService,
				},
			],
		}).compile();

		contentPagesService = module.get<ContentPagesService>(ContentPagesService);
	});

	it('services should be defined', () => {
		expect(contentPagesService).toBeDefined();
	});

	describe('adaptContentPage', () => {
		it('should adapt a graphql contentPage response to our contentPage interface', () => {
			// const adapted = contentPagesService.adaptContentPage(mockGqlContentPage);
			// // test some sample keys
			// expect(adapted.id).toEqual(mockGqlContentPage.id);
			// expect(adapted.type).toEqual(mockGqlContentPage.type);
			// expect(adapted.visitId).toEqual(mockGqlContentPage.visit_id);
		});

		it('should return null in the gql contentPage is undefined', () => {
			const adapted = contentPagesService.adaptContentPage(undefined);
			expect(adapted).toBeNull();
		});
	});

	describe('adaptContentBlock', () => {
		it('should adapt a graphql content block response to our contentPage interface', () => {
			// const adapted = contentPagesService.adaptContentPage(mockGqlContentPage);
			// // test some sample keys
			// expect(adapted.id).toEqual(mockGqlContentPage.id);
			// expect(adapted.type).toEqual(mockGqlContentPage.type);
			// expect(adapted.visitId).toEqual(mockGqlContentPage.visit_id);
		});

		it('should return null in the gql content block is undefined', () => {
			const adapted = contentPagesService.adaptContentBlock(undefined);
			expect(adapted).toBeNull();
		});
	});

	describe('adaptUser', () => {
		it('should adapt a graphql contentPage owner to our contentPageUser interface', () => {
			// const adapted = contentPagesService.adaptContentPage(mockGqlContentPage);
			// // test some sample keys
			// expect(adapted.id).toEqual(mockGqlContentPage.id);
			// expect(adapted.type).toEqual(mockGqlContentPage.type);
			// expect(adapted.visitId).toEqual(mockGqlContentPage.visit_id);
		});

		it('should return null in the gql content page owner is undefined', () => {
			const adapted = contentPagesService.adaptUser(undefined);
			expect(adapted).toBeNull();
		});
	});
});
