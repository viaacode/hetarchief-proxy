import { TranslationsService } from '@meemoo/admin-core-api';
import { Test, type TestingModule } from '@nestjs/testing';

import { NotFoundController } from './not-found.controller';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupId, GroupName, Permission, type User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';
import { Locale } from '~shared/types/types';

export const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	language: Locale.Nl,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: GroupId.CP_ADMIN,
	groupName: GroupName.CP_ADMIN,
	permissions: [Permission.MANAGE_ALL_VISIT_REQUESTS, Permission.CREATE_VISIT_REQUEST],
	idp: Idp.HETARCHIEF,
	isKeyUser: false,
};

describe('NotFoundController', () => {
	let notFoundController: NotFoundController;
	const OLD_ENV = process.env;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NotFoundController],
			imports: [],
			providers: [
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
			],
		}).compile();

		notFoundController = module.get<NotFoundController>(NotFoundController);
		process.env = { ...OLD_ENV }; // Make a copy
	});

	afterAll(() => {
		process.env = OLD_ENV; // Restore old environment
	});

	describe('getNotFoundPage', () => {
		it('should return the not found page html code', async () => {
			process.env.CLIENT_HOST = 'http://localhost:3200';
			const notFound = await notFoundController.getNotFoundPage(
				undefined,
				undefined,
				new SessionUserEntity(mockUser)
			);
			expect(notFound).toContain('<title>');
			expect(notFound).toContain(process.env.CLIENT_HOST);
		});
	});
});
