import { Test, TestingModule } from '@nestjs/testing';

import { ContentPagesService } from '~modules/admin/content-pages/services/content-pages.service';
import { DataService } from '~modules/data/services/data.service';
import { Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';

const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	full_name: 'Test Testers',
	email: 'test.testers@meemoo.be',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	permissions: [Permission.EDIT_ANY_CONTENT_PAGES],
};

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
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
			],
		}).compile();

		contentPagesService = module.get<ContentPagesService>(ContentPagesService);
	});

	it('services should be defined', () => {
		expect(contentPagesService).toBeDefined();
	});

	describe('adapt', () => {
		it('should adapt a graphql contentPage response to our contentPage interface', () => {
			// const adapted = contentPagesService.adaptContentPage(mockGqlContentPage);
			// // test some sample keys
			// expect(adapted.id).toEqual(mockGqlContentPage.id);
			// expect(adapted.type).toEqual(mockGqlContentPage.type);
			// expect(adapted.visitId).toEqual(mockGqlContentPage.visit_id);
		});

		it('should return undefined in the gql contentPage is undefined', () => {
			const adapted = contentPagesService.adaptContentPage(undefined);
			expect(adapted).toBeUndefined();
		});
	});
});
