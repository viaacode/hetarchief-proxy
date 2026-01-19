import { vi, type MockInstance } from 'vitest';
import { Test, type TestingModule } from '@nestjs/testing';
import type { IPagination } from '@studiohyperdrive/pagination';
import { AvoAuthIdpType, PermissionName } from '@viaa/avo2-types';
import type { Request } from 'express';

import { FoldersService } from '../services/folders.service';

import { FoldersController } from './folders.controller';

import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { EventsService } from '~modules/events/services/events.service';
import { type Folder, FolderStatus } from '~modules/folders/types';
import { type IeObject, IeObjectType } from '~modules/ie-objects/ie-objects.types';
import { mockIeObject1 } from '~modules/ie-objects/mocks/ie-objects.mock';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { UsersService } from '~modules/users/services/users.service';
import { GroupId, GroupName, type User } from '~modules/users/types';
import { VisitsService } from '~modules/visits/services/visits.service';
import { TestingLogger } from '~shared/logging/test-logger';
import { Locale } from '~shared/types/types';

const mockFoldersResponse: IPagination<Folder> = {
	items: [
		{
			id: '0018c1b6-97ae-435f-abef-31a2cde011fd',
			name: 'Favorieten',
			description: 'Mijn favoriete items',
			userProfileId: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
			isDefault: true,
			createdAt: '2022-02-18T09:19:09.487977',
			updatedAt: '2022-02-18T09:19:09.487977',
		},
		{
			id: 'be84632b-1f80-4c4f-b61c-e7f3b437a56b',
			name: 'mijn favorite films',
			description: 'Mijn favoriete films',
			userProfileId: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
			isDefault: false,
			createdAt: '2022-02-22T13:51:01.995293',
			updatedAt: '2022-02-22T13:51:01.995293',
		},
	],
	total: 2,
	pages: 1,
	page: 0,
	size: 1000,
};

const mockSchemaIdentifier =
	'ec124bb2bd7b43a8b3dec94bd6567fec3f723d4c91cb418ba6eb26ded1ca1ef04b9ddbc8e98149858cc58dfebad3e6f5';

const mockFolderObjectsResponse: IPagination<Partial<IeObject & { folderEntryCreatedAt: string }>> =
	{
		items: [
			{
				schemaIdentifier: '1',
				name: 'CGSO. De mannenbeweging - mannenemancipatie - 1982',
				datePublished: '2015-09-19T12:08:24',
				creator: null,
				dctermsFormat: IeObjectType.VIDEO,
				numberOfPages: null,
				thumbnailUrl:
					'/viaa/AMSAB/5dc89b7e75e649e191cd86196c255147cd1a0796146d4255acfde239296fa534/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
				folderEntryCreatedAt: '2022-02-02T10:55:16.542503',
			},
		],
		page: 1,
		size: 10,
		total: 1,
		pages: 1,
	};

const mockUser: User = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	language: Locale.Nl,
	idp: AvoAuthIdpType.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: GroupId.CP_ADMIN,
	groupName: GroupName.CP_ADMIN,
	permissions: [PermissionName.EDIT_ANY_CONTENT_PAGES],
	isKeyUser: false,
	isEvaluator: false,
};

const mockFoldersService: Partial<Record<keyof FoldersService, MockInstance>> = {
	findFoldersByUser: vi.fn(),
	findFolderById: vi.fn(),
	findObjectInFolderById: vi.fn(),
	findObjectsByFolderId: vi.fn(),
	create: vi.fn(),
	update: vi.fn(),
	delete: vi.fn(),
	addObjectToFolder: vi.fn(),
	removeObjectFromFolder: vi.fn(),
};

const mockEventsService: Partial<Record<keyof EventsService, MockInstance>> = {
	insertEvents: vi.fn(),
};

const mockCampaignMonitorService: Partial<Record<keyof CampaignMonitorService, MockInstance>> =
	{
		sendTransactionalMail: vi.fn(),
	};

const mockUserService: Partial<Record<keyof UsersService, MockInstance>> = {
	getUserByEmail: vi.fn(),
};

const mockRequest = { path: '/folders', headers: {} } as unknown as Request;

const mockIeObjectsService: Partial<Record<keyof IeObjectsService, MockInstance>> = {
	findAllIeObjectMetadataByFolderId: vi.fn(),
	findByIeObjectId: vi.fn(),
	getVisitorSpaceAccessInfoFromUser: vi.fn(),
	limitObjectInFolder: vi.fn((folderObjectItem: Partial<IeObject>) => folderObjectItem),
};

const mockVisitsService: Partial<Record<keyof VisitsService, MockInstance>> = {
	findAll: vi.fn().mockReturnValue({ items: [] }),
};

describe('FoldersController', () => {
	let foldersController: FoldersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [FoldersController],
			imports: [],
			providers: [
				{
					provide: FoldersService,
					useValue: mockFoldersService,
				},
				{
					provide: EventsService,
					useValue: mockEventsService,
				},
				{
					provide: IeObjectsService,
					useValue: mockIeObjectsService,
				},
				{
					provide: CampaignMonitorService,
					useValue: mockCampaignMonitorService,
				},
				{
					provide: UsersService,
					useValue: mockUserService,
				},
				{
					provide: VisitsService,
					useValue: mockVisitsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		foldersController = module.get<FoldersController>(FoldersController);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it('should be defined', () => {
		expect(foldersController).toBeDefined();
	});

	describe('getFolders', () => {
		it('should return all folders of a specific user', async () => {
			mockFoldersService.findFoldersByUser.mockResolvedValueOnce(mockFoldersResponse);
			const folders = await foldersController.getFolders(
				'referer',
				'127.0.0.1',
				new SessionUserEntity(mockUser)
			);
			expect(folders.items.length).toEqual(2);
		});
	});

	describe('getFolderObjectsById', () => {
		it('should return the objects in the folder', async () => {
			mockFoldersService.findObjectsByFolderId.mockResolvedValueOnce(mockFolderObjectsResponse);
			mockIeObjectsService.getVisitorSpaceAccessInfoFromUser.mockResolvedValue({
				objectIds: [mockFolderObjectsResponse.items[0].schemaIdentifier],
				visitorSpaceIds: [],
			});
			const folderObjects = await foldersController.getFolderObjects(
				'referer',
				'127.0.0.1',
				mockFoldersResponse.items[0].id,
				{},
				new SessionUserEntity(mockUser)
			);
			expect(folderObjects.items[0]?.name).toEqual(mockFolderObjectsResponse.items[0]?.name);
		});
	});

	// Export of folders will be disabled in fase2
	// describe('exportFolder', () => {
	// 	it('should export a folder as xml', async () => {
	// 		mockIeObjectsService.findAllObjectMetadataByFolderId.mockResolvedValueOnce([]);
	// 		mockIeObjectsService.convertObjectsToXml.mockReturnValueOnce('</objects>');
	// 		const result = await foldersController.exportFolder(
	// 			'referer', '',
	// 			'folder-id',
	// 			new SessionUserEntity(mockUser),
	// 			mockRequest
	// 		);
	// 		expect(result).toEqual('</objects>');
	// 	});
	// });

	describe('createFolder', () => {
		it('should create a folder by id', async () => {
			mockFoldersService.create.mockResolvedValueOnce(mockFoldersResponse.items[0]);
			const folder = await foldersController.createFolder(
				'referer',

				'127.0.0.1',
				{
					name: 'test folder',
				},
				new SessionUserEntity(mockUser)
			);
			expect(folder).toEqual(mockFoldersResponse.items[0]);
		});
	});

	describe('updateFolder', () => {
		it('should update a folder by id', async () => {
			mockFoldersService.update.mockResolvedValueOnce(mockFoldersResponse.items[0]);
			const folder = await foldersController.updateFolder(
				'referer',

				'127.0.0.1',
				mockFoldersResponse.items[0].id,
				{
					name: 'test folder',
				},
				new SessionUserEntity(mockUser)
			);
			expect(folder).toEqual(mockFoldersResponse.items[0]);
		});
	});

	describe('deleteFolder', () => {
		it('should delete a folder by id', async () => {
			mockFoldersService.delete.mockResolvedValueOnce(1);

			const response = await foldersController.deleteFolder(
				mockFoldersResponse.items[0].id,
				new SessionUserEntity(mockUser)
			);
			expect(response).toEqual({ status: 'the folder has been deleted' });
		});

		it('should delete a folder by id', async () => {
			mockFoldersService.delete.mockResolvedValueOnce(0);

			const response = await foldersController.deleteFolder(
				mockFoldersResponse.items[0].id,
				new SessionUserEntity(mockUser)
			);
			expect(response).toEqual({ status: 'no folders found with that id' });
		});
	});

	describe('createFolderObject', () => {
		it('should add an object to a folder', async () => {
			mockFoldersService.addObjectToFolder.mockResolvedValueOnce(
				mockFolderObjectsResponse.items[0]
			);
			mockFoldersService.findFolderById.mockResolvedValueOnce(mockFoldersResponse.items[0]);
			mockFoldersService.findFolderById.mockResolvedValueOnce(mockFoldersResponse.items[0]);
			mockFoldersService.findObjectInFolderById.mockResolvedValue(mockFoldersResponse.items[0]);
			mockIeObjectsService.findByIeObjectId.mockResolvedValue([mockIeObject1]);
			const folderObject = await foldersController.addObjectToFolder(
				mockRequest,
				'referer',
				'127.0.0.1',
				mockFoldersResponse.items[0].id,
				mockSchemaIdentifier,
				new SessionUserEntity(mockUser)
			);
			expect(folderObject).toEqual(mockFolderObjectsResponse.items[0]);
		});

		it('should not add an object to a folder that is not owned', async () => {
			mockFoldersService.addObjectToFolder.mockResolvedValueOnce(
				mockFolderObjectsResponse.items[0]
			);
			mockFoldersService.findFolderById.mockResolvedValueOnce({
				...mockFoldersResponse.items[0],
				userProfileId: 'other-profile-id',
			});
			mockIeObjectsService.findByIeObjectId.mockResolvedValueOnce([mockFoldersResponse.items[0]]);

			let error: any;
			try {
				await foldersController.addObjectToFolder(
					mockRequest,
					'127.0.0.1',
					'referer',
					mockFoldersResponse.items[0].id,
					mockSchemaIdentifier,
					new SessionUserEntity(mockUser)
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('You can only add objects to your own folders');
		});
	});

	describe('deleteFolderObject', () => {
		it('should remove an object from a folder', async () => {
			mockFoldersService.removeObjectFromFolder.mockResolvedValueOnce(1);
			mockFoldersService.findFolderById.mockResolvedValueOnce(mockFoldersResponse.items[0]);
			const folderObject = await foldersController.removeObjectFromFolder(
				'referer',
				mockFoldersResponse.items[0].id,
				mockSchemaIdentifier,
				'127.0.0.1',
				new SessionUserEntity(mockUser)
			);
			expect(folderObject).toEqual({ status: 'the object has been deleted' });
		});

		it('should not complain about removing non existing objects from a folder', async () => {
			mockFoldersService.removeObjectFromFolder.mockResolvedValueOnce(0);
			mockFoldersService.findFolderById.mockResolvedValueOnce(mockFoldersResponse.items[0]);
			const folderObject = await foldersController.removeObjectFromFolder(
				'referer',
				mockFoldersResponse.items[0].id,
				'non-existing-object-id',
				'127.0.0.1',
				new SessionUserEntity(mockUser)
			);
			expect(folderObject).toEqual({
				status: 'no object found with that id in that folder',
			});
		});

		it('should not remove an object from a folder that are not owned', async () => {
			mockFoldersService.removeObjectFromFolder.mockResolvedValueOnce(1);
			mockFoldersService.findFolderById.mockResolvedValueOnce({
				...mockFoldersResponse.items[0],
				userProfileId: 'other-profile-id',
			});

			let error: any;
			try {
				await foldersController.removeObjectFromFolder(
					'referer',
					mockFoldersResponse.items[0].id,
					mockSchemaIdentifier,
					'127.0.0.1',
					new SessionUserEntity(mockUser)
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('You can only delete objects from your own folders');
		});
	});

	describe('moveObjectToAnotherFolder', () => {
		it('should move object to another folder', async () => {
			mockFoldersService.addObjectToFolder.mockResolvedValueOnce(
				mockFolderObjectsResponse.items[0]
			);
			mockFoldersService.removeObjectFromFolder.mockResolvedValueOnce(1);
			mockFoldersService.findFolderById.mockResolvedValue(mockFoldersResponse.items[0]);
			mockFoldersService.findObjectInFolderById.mockResolvedValue(null);

			const folderObject = await foldersController.moveObjectToAnotherFolder(
				'referer',
				'127.0.0.1',
				mockFoldersResponse.items[0].id,
				mockSchemaIdentifier,
				mockFoldersResponse.items[1].id,
				new SessionUserEntity(mockUser)
			);
			expect(folderObject).toEqual(mockFolderObjectsResponse.items[0]);
		});

		it('should not move object if requester does not own "from" folder', async () => {
			mockFoldersService.addObjectToFolder.mockResolvedValueOnce(
				mockFolderObjectsResponse.items[0]
			);
			mockFoldersService.removeObjectFromFolder.mockResolvedValueOnce(1);
			mockFoldersService.findFolderById
				.mockResolvedValueOnce({
					...mockFoldersResponse.items[0],
					userProfileId: 'not-the-owner-id',
				})
				.mockResolvedValue(mockFoldersResponse.items[0]);
			mockFoldersService.findObjectInFolderById.mockResolvedValue(null);

			let error: any;
			try {
				await foldersController.moveObjectToAnotherFolder(
					'referer',
					'127.0.0.1',
					mockFoldersResponse.items[0].id,
					mockSchemaIdentifier,
					mockFoldersResponse.items[1].id,
					new SessionUserEntity(mockUser)
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('You can only move objects from your own folders');
		});

		it('should not move object if requester does not own "to" folder', async () => {
			mockFoldersService.addObjectToFolder.mockResolvedValueOnce(
				mockFolderObjectsResponse.items[0]
			);
			mockFoldersService.removeObjectFromFolder.mockResolvedValueOnce(1);
			mockFoldersService.findFolderById
				.mockResolvedValueOnce(mockFoldersResponse.items[0])
				.mockResolvedValue({
					...mockFoldersResponse.items[0],
					userProfileId: 'not-the-owner-id',
				});
			mockFoldersService.findObjectInFolderById.mockResolvedValue(null);

			let error: any;
			try {
				await foldersController.moveObjectToAnotherFolder(
					'referer',
					'127.0.0.1',
					mockFoldersResponse.items[0].id,
					mockSchemaIdentifier,
					mockFoldersResponse.items[1].id,
					new SessionUserEntity(mockUser)
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('You can only move objects to your own folders');
		});
	});

	describe('Share folder', () => {
		it('Should return status ALREADY OWNED', async () => {
			mockFoldersService.findFolderById.mockResolvedValueOnce(mockFoldersResponse.items[0]);

			const sharedFolder = await foldersController.acceptSharedFolder(
				'referer',
				'127.0.0.1',
				mockFoldersResponse.items[0].id,
				new SessionUserEntity({
					...mockUser,
				})
			);
			expect(sharedFolder?.status).toEqual(FolderStatus.ALREADY_OWNER);
		});

		it('Should return status ADDED', async () => {
			mockFoldersService.findFolderById.mockResolvedValueOnce({
				...mockFoldersResponse.items[0],
				userProfileId: '65e73ab2-4f2d-4603-a764-d27a3f9fa735',
			});

			mockFoldersService.create.mockResolvedValueOnce(mockFoldersResponse.items[0]);
			mockFoldersService.findObjectsByFolderId.mockResolvedValueOnce(mockFolderObjectsResponse);
			mockFoldersService.addObjectToFolder.mockResolvedValue(mockFolderObjectsResponse.items[0]);

			const sharedFolder = await foldersController.acceptSharedFolder(
				'referer',
				'127.0.0.1',
				mockFoldersResponse.items[0].id,
				new SessionUserEntity(mockUser)
			);

			expect(sharedFolder?.status).toEqual(FolderStatus.ADDED);
			mockFoldersService.addObjectToFolder.mockReset();
		});
	});
});
