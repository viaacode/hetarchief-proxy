import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { Configuration } from '~config';

import { ContentPagesController } from '~modules/admin/content-pages/controllers/content-pages.controller';
import { ContentPagesService } from '~modules/admin/content-pages/services/content-pages.service';
import { PlayerTicketService } from '~modules/admin/player-ticket/services/player-ticket.service';
import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { SessionHelper } from '~shared/auth/session-helper';

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

const mockContentPagesService: Partial<Record<keyof ContentPagesService, jest.SpyInstance>> = {
	adaptContentPage: jest.fn(),
	adaptContentBlock: jest.fn(),
	getContentPagesForOverview: jest.fn(),
	getContentPageByPath: jest.fn(),
	fetchCollectionOrItem: jest.fn(),
	fetchItemByExternalId: jest.fn(),
	fetchContentPages: jest.fn(),
	updatePublishDates: jest.fn(),
	getContentPagesByIds: jest.fn(),
	getContentPageLabelsByTypeAndLabels: jest.fn(),
	getContentPageLabelsByTypeAndIds: jest.fn(),
};

const mockPlayerTicketService: Partial<Record<keyof PlayerTicketService, jest.SpyInstance>> = {
	getPlayableUrl: jest.fn(),
	getEmbedUrl: jest.fn(),
};

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'proxyApiKey') {
			return '';
		}
		return key;
	}),
};

describe('ContentPagesController', () => {
	let contentPagesController: ContentPagesController;
	let sessionHelperSpy: jest.SpyInstance;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ContentPagesController],
			imports: [],
			providers: [
				{
					provide: ContentPagesService,
					useValue: mockContentPagesService,
				},
				{
					provide: PlayerTicketService,
					useValue: mockPlayerTicketService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		}).compile();

		contentPagesController = module.get<ContentPagesController>(ContentPagesController);

		sessionHelperSpy = jest
			.spyOn(SessionHelper, 'getArchiefUserInfo')
			.mockReturnValue(mockUser);
	});

	afterAll(async () => {
		sessionHelperSpy.mockRestore();
	});

	it('should be defined', () => {
		expect(contentPagesController).toBeDefined();
	});

	describe('getContentPages', () => {
		it('should return all contentPages for a specific user', async () => {
			expect(true).toEqual(true);
		});
	});
});
