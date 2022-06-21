import { Test, TestingModule } from '@nestjs/testing';

import { DataService } from '../services/data.service';

import { DataController } from './data.controller';

import { TranslationsService } from '~modules/translations/services/translations.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';

const mockDataService = {
	executeClientQuery: () => ({
		data: {
			username: 'archief2.0',
		},
	}),
};

const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: Group.CP_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: [Permission.EDIT_ANY_CONTENT_PAGES],
};

describe('DataController', () => {
	let dataController: DataController;
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DataController],
			providers: [
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
			],
		}).compile();

		dataController = module.get<DataController>(DataController);
	});

	it('should be defined', () => {
		expect(dataController).toBeDefined();
	});

	describe('data', () => {
		it('should get a result for a graphQl query', async () => {
			const result = await dataController.post(
				{ query: 'query testQuery { username }' },
				new SessionUserEntity(mockUser)
			);
			expect(result).toEqual({
				data: {
					username: 'archief2.0',
				},
			});
		});
	});
});
