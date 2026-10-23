import type { IPagination } from '@meemoo/admin-core-api';
import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import {
	AvoAuthIdpType,
	HetArchiefIeObject,
	HetArchiefIeObjectType,
	PermissionName,
} from '@viaa/avo2-types';
import type { Request } from 'express';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';
import { CampaignMonitorService } from '~modules/campaign-monitor/services/campaign-monitor.service';
import { EventsService } from '~modules/events/services/events.service';
import { type Folder, FolderStatus } from '~modules/folders/types';
import { mockIeObject1 } from '~modules/ie-objects/mocks/ie-objects.mock';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { UsersService } from '~modules/users/services/users.service';
import { GroupId, GroupName, type User } from '~modules/users/types';
import { VisitsService } from '~modules/visits/services/visits.service';
import { TestingLogger } from '~shared/logging/test-logger';
import { Locale } from '~shared/types/types';
import { FoldersService } from '../services/folders.service';
import { FoldersController } from './folders.controller';

const mockFoldersResponse: IPagination<Folder> = {
	items: [
		{
			id: '0018c1b6-97ae-435f-abef-31a2cde011fd',
			name: 'Favorieten',
			description: 'Mijn favoriete items',
			userProfileId: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
			ownerOrganisationId: null,
			isDefault: true,
			createdAt: '2022-02-18T09:19:09.487977',
			updatedAt: '2022-02-18T09:19:09.487977',
		},
		{
			id: 'be84632b-1f80-4c4f-b61c-e7f3b437a56b',
			name: 'mijn favorite films',
			description: 'Mijn favoriete films',
			userProfileId: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
			ownerOrganisationId: null,
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

const mockFolderObjectsResponse: IPagination<
	Partial<HetArchiefIeObject & { folderEntryCreatedAt: string }>
> = {
	items: [
		{
			schemaIdentifier: '1',
			name: 'CGSO. De mannenbeweging - mannenemancipatie - 1982',
			datePublished: '2015-09-19T12:08:24',
			creator: null,
			dctermsFormat: HetArchiefIeObjectType.VIDEO,
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

const mockOrganisationId = 'OR-rf5kf25';

const mockCpAdminUser: User = {
	...mockUser,
	organisationId: mockOrganisationId,
	permissions: [PermissionName.MANAGE_FOLDERS, PermissionName.MANAGE_ORGANISATION_FOLDERS],
};

const mockOrganisationFolder: Folder = {
	id: '6a0b5b0e-8f3e-4a43-9b7e-2b6f0c8c1d11',
	name: 'Organisatiemap 1',
	description: 'Gedeeld met alle CP admins',
	userProfileId: null,
	ownerOrganisationId: mockOrganisationId,
	isDefault: false,
	createdAt: '2026-10-20T09:19:09.487977',
	updatedAt: '2026-10-20T09:19:09.487977',
};

const mockFoldersService: Partial<Record<keyof FoldersService, MockInstance>> = {
	findFoldersForUser: vi.fn(),
	findFolderById: vi.fn(),
	findObjectInFolderById: vi.fn(),
	findObjectsByFolderId: vi.fn(),
	create: vi.fn(),
	update: vi.fn(),
	delete: vi.fn(),
	addObjectToFolder: vi.fn(),
	removeObjectFromFolder: vi.fn(),
	addObjectsToFolders: vi.fn(),
	updateObjectsInFolders: vi.fn(),
};

const mockEventsService: Partial<Record<keyof EventsService, MockInstance>> = {
	insertEvents: vi.fn(),
	mapUserToEventData: vi.fn(),
};

const mockCampaignMonitorService: Partial<Record<keyof CampaignMonitorService, MockInstance>> = {
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
	limitObjectInFolder: vi.fn((folderObjectItem: Partial<HetArchiefIeObject>) => folderObjectItem),
	getIeObjectIdFromObjectSchemaIdentifier: vi.fn(),
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
			mockFoldersService.findFoldersForUser.mockResolvedValueOnce(mockFoldersResponse);
			const folders = await foldersController.getFolders(
				'referer',
				'127.0.0.1',
				new SessionUserEntity(mockUser)
			);
			expect(folders.items.length).toEqual(2);
			expect(mockFoldersService.findFoldersForUser).toHaveBeenCalledWith(
				{ _or: [{ user_profile_id: { _eq: mockUser.id } }] },
				'referer',
				'127.0.0.1',
				1,
				1000
			);
		});

		it('should also return the organisation folders for users with the MANAGE_ORGANISATION_FOLDERS permission', async () => {
			mockFoldersService.findFoldersForUser.mockResolvedValueOnce(mockFoldersResponse);
			await foldersController.getFolders(
				'referer',
				'127.0.0.1',
				new SessionUserEntity(mockCpAdminUser)
			);
			expect(mockFoldersService.findFoldersForUser).toHaveBeenCalledWith(
				{
					_or: [
						{ user_profile_id: { _eq: mockUser.id } },
						{ owner_organisation_id: { _eq: mockOrganisationId } },
					],
				},
				'referer',
				'127.0.0.1',
				1,
				1000
			);
		});

		it('should not return organisation folders for users without the MANAGE_ORGANISATION_FOLDERS permission', async () => {
			mockFoldersService.findFoldersForUser.mockResolvedValueOnce(mockFoldersResponse);
			await foldersController.getFolders(
				'referer',
				'127.0.0.1',
				new SessionUserEntity({ ...mockUser, organisationId: mockOrganisationId })
			);
			expect(mockFoldersService.findFoldersForUser).toHaveBeenCalledWith(
				{ _or: [{ user_profile_id: { _eq: mockUser.id } }] },
				'referer',
				'127.0.0.1',
				1,
				1000
			);
		});
	});

	describe('getFolderObjectsById', () => {
		it('should return the objects in the folder', async () => {
			mockFoldersService.findFolderById.mockResolvedValueOnce(mockFoldersResponse.items[0]);
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

		it('should not return the objects of a folder of another user', async () => {
			mockFoldersService.findFolderById.mockResolvedValueOnce({
				...mockFoldersResponse.items[0],
				userProfileId: 'other-profile-id',
			});
			await expect(
				foldersController.getFolderObjects(
					'referer',
					'127.0.0.1',
					mockFoldersResponse.items[0].id,
					{},
					new SessionUserEntity(mockUser)
				)
			).rejects.toThrow('You can only view your own folders');
			expect(mockFoldersService.findObjectsByFolderId).not.toHaveBeenCalled();
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
			expect(mockFoldersService.create).toHaveBeenCalledWith(
				expect.objectContaining({ user_profile_id: mockUser.id, owner_organisation_id: null }),
				'referer',
				'127.0.0.1'
			);
		});

		it('should create an organisation folder', async () => {
			mockFoldersService.create.mockResolvedValueOnce(mockOrganisationFolder);
			const folder = await foldersController.createFolder(
				'referer',
				'127.0.0.1',
				{
					name: 'Organisatiemap 1',
					isOrganisation: true,
				},
				new SessionUserEntity(mockCpAdminUser)
			);
			expect(folder).toEqual(mockOrganisationFolder);
			expect(mockFoldersService.create).toHaveBeenCalledWith(
				expect.objectContaining({
					user_profile_id: null,
					owner_organisation_id: mockOrganisationId,
					is_default: false,
				}),
				'referer',
				'127.0.0.1'
			);
		});

		it('should not create an organisation folder without the MANAGE_ORGANISATION_FOLDERS permission', async () => {
			await expect(
				foldersController.createFolder(
					'referer',
					'127.0.0.1',
					{
						name: 'Organisatiemap 1',
						isOrganisation: true,
					},
					new SessionUserEntity({ ...mockUser, organisationId: mockOrganisationId })
				)
			).rejects.toThrow('You are not allowed to create organisation folders');
			expect(mockFoldersService.create).not.toHaveBeenCalled();
		});

		it('should not create an organisation folder for a user without organisation', async () => {
			await expect(
				foldersController.createFolder(
					'referer',
					'127.0.0.1',
					{
						name: 'Organisatiemap 1',
						isOrganisation: true,
					},
					new SessionUserEntity({ ...mockCpAdminUser, organisationId: undefined })
				)
			).rejects.toThrow('You need to be linked to an organisation to create organisation folders');
			expect(mockFoldersService.create).not.toHaveBeenCalled();
		});
	});

	describe('updateFolder', () => {
		it('should update an organisation folder for a cp admin of the same organisation', async () => {
			mockFoldersService.findFolderById.mockResolvedValueOnce(mockOrganisationFolder);
			mockFoldersService.update.mockResolvedValueOnce(mockOrganisationFolder);
			const folder = await foldersController.updateFolder(
				'referer',
				'127.0.0.1',
				mockOrganisationFolder.id,
				{
					name: 'Nieuwe naam',
				},
				new SessionUserEntity({ ...mockCpAdminUser, id: 'other-cp-admin-profile-id' })
			);
			expect(folder).toEqual(mockOrganisationFolder);
		});

		it('should not update an organisation folder of another organisation', async () => {
			mockFoldersService.findFolderById.mockResolvedValueOnce({
				...mockOrganisationFolder,
				ownerOrganisationId: 'OR-other',
			});
			await expect(
				foldersController.updateFolder(
					'referer',
					'127.0.0.1',
					mockOrganisationFolder.id,
					{
						name: 'Nieuwe naam',
					},
					new SessionUserEntity(mockCpAdminUser)
				)
			).rejects.toThrow('You can only edit your own folders');
			expect(mockFoldersService.update).not.toHaveBeenCalled();
		});

		it('should update a folder by id', async () => {
			mockFoldersService.findFolderById.mockResolvedValueOnce(mockFoldersResponse.items[0]);
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
			mockFoldersService.findFolderById.mockResolvedValueOnce(mockFoldersResponse.items[0]);
			mockFoldersService.delete.mockResolvedValueOnce(1);

			const response = await foldersController.deleteFolder(
				'referer',
				'127.0.0.1',
				mockFoldersResponse.items[0].id,
				new SessionUserEntity(mockUser)
			);
			expect(response).toEqual({ status: 'the folder has been deleted' });
		});

		it('should delete a folder by id', async () => {
			mockFoldersService.findFolderById.mockResolvedValueOnce(mockFoldersResponse.items[0]);
			mockFoldersService.delete.mockResolvedValueOnce(0);

			const response = await foldersController.deleteFolder(
				'referer',
				'127.0.0.1',
				mockFoldersResponse.items[0].id,
				new SessionUserEntity(mockUser)
			);
			expect(response).toEqual({ status: 'no folders found with that id' });
		});

		it('should not delete an organisation folder for a user without the MANAGE_ORGANISATION_FOLDERS permission', async () => {
			mockFoldersService.findFolderById.mockResolvedValueOnce(mockOrganisationFolder);

			await expect(
				foldersController.deleteFolder(
					'referer',
					'127.0.0.1',
					mockOrganisationFolder.id,
					new SessionUserEntity({ ...mockUser, organisationId: mockOrganisationId })
				)
			).rejects.toThrow('You can only delete your own folders');
			expect(mockFoldersService.delete).not.toHaveBeenCalled();
		});
	});

	describe('addObjectsToFolders', () => {
		it('should add all objects to all folders in one call', async () => {
			mockFoldersService.findFolderById
				.mockResolvedValueOnce(mockFoldersResponse.items[0])
				.mockResolvedValueOnce(mockOrganisationFolder);
			mockIeObjectsService.getIeObjectIdFromObjectSchemaIdentifier
				.mockResolvedValueOnce('ie-object-id-1')
				.mockResolvedValueOnce('ie-object-id-2');
			mockFoldersService.addObjectsToFolders.mockResolvedValueOnce(4);
			mockIeObjectsService.findByIeObjectId.mockResolvedValue(mockIeObject1);
			mockEventsService.insertEvents.mockResolvedValue([]);

			const result = await foldersController.addObjectsToFolders(
				mockRequest,
				'referer',
				'127.0.0.1',
				{
					folderIds: [mockFoldersResponse.items[0].id, mockOrganisationFolder.id],
					objectSchemaIdentifiers: ['schema-identifier-1', 'schema-identifier-2'],
				},
				new SessionUserEntity(mockCpAdminUser)
			);

			expect(result).toEqual({
				folderIds: [mockFoldersResponse.items[0].id, mockOrganisationFolder.id],
				objectSchemaIdentifiers: ['schema-identifier-1', 'schema-identifier-2'],
				notFoundSchemaIdentifiers: [],
				addedCount: 4,
			});
			expect(mockFoldersService.addObjectsToFolders).toHaveBeenCalledWith(
				[mockFoldersResponse.items[0].id, mockOrganisationFolder.id],
				['ie-object-id-1', 'ie-object-id-2']
			);
		});

		it('should not add anything if the user has no access to one of the folders', async () => {
			mockFoldersService.findFolderById
				.mockResolvedValueOnce(mockFoldersResponse.items[0])
				.mockResolvedValueOnce({ ...mockOrganisationFolder, ownerOrganisationId: 'OR-other' });

			await expect(
				foldersController.addObjectsToFolders(
					mockRequest,
					'referer',
					'127.0.0.1',
					{
						folderIds: [mockFoldersResponse.items[0].id, mockOrganisationFolder.id],
						objectSchemaIdentifiers: ['schema-identifier-1'],
					},
					new SessionUserEntity(mockCpAdminUser)
				)
			).rejects.toThrow('You can only add objects to your own folders');
			expect(mockFoldersService.addObjectsToFolders).not.toHaveBeenCalled();
		});

		it('should skip objects that do not exist', async () => {
			mockFoldersService.findFolderById.mockResolvedValueOnce(mockFoldersResponse.items[0]);
			mockIeObjectsService.getIeObjectIdFromObjectSchemaIdentifier
				.mockResolvedValueOnce('ie-object-id-1')
				.mockRejectedValueOnce(
					new NotFoundException('No object id was found for objectSchemaIdentifier')
				);
			mockFoldersService.addObjectsToFolders.mockResolvedValueOnce(1);
			mockIeObjectsService.findByIeObjectId.mockResolvedValue(mockIeObject1);
			mockEventsService.insertEvents.mockResolvedValue([]);

			const result = await foldersController.addObjectsToFolders(
				mockRequest,
				'referer',
				'127.0.0.1',
				{
					folderIds: [mockFoldersResponse.items[0].id],
					objectSchemaIdentifiers: ['schema-identifier-1', 'unknown'],
				},
				new SessionUserEntity(mockUser)
			);

			expect(result.objectSchemaIdentifiers).toEqual(['schema-identifier-1']);
			expect(result.notFoundSchemaIdentifiers).toEqual(['unknown']);
			expect(mockFoldersService.addObjectsToFolders).toHaveBeenCalledWith(
				[mockFoldersResponse.items[0].id],
				['ie-object-id-1']
			);
		});

		it('should return a 404 when none of the objects exist', async () => {
			mockFoldersService.findFolderById.mockResolvedValueOnce(mockFoldersResponse.items[0]);
			mockIeObjectsService.getIeObjectIdFromObjectSchemaIdentifier.mockRejectedValueOnce(
				new NotFoundException('No object id was found for objectSchemaIdentifier')
			);

			await expect(
				foldersController.addObjectsToFolders(
					mockRequest,
					'referer',
					'127.0.0.1',
					{
						folderIds: [mockFoldersResponse.items[0].id],
						objectSchemaIdentifiers: ['unknown'],
					},
					new SessionUserEntity(mockUser)
				)
			).rejects.toThrow('None of the objects were found');
			expect(mockFoldersService.addObjectsToFolders).not.toHaveBeenCalled();
		});

		it('should return a 404 if one of the folders does not exist', async () => {
			mockFoldersService.findFolderById.mockResolvedValueOnce(undefined);

			await expect(
				foldersController.addObjectsToFolders(
					mockRequest,
					'referer',
					'127.0.0.1',
					{
						folderIds: [mockFoldersResponse.items[0].id],
						objectSchemaIdentifiers: ['schema-identifier-1'],
					},
					new SessionUserEntity(mockUser)
				)
			).rejects.toThrow('Folder not found');
			expect(mockFoldersService.addObjectsToFolders).not.toHaveBeenCalled();
		});
	});

	describe('updateObjectsInFolders', () => {
		it('should add the objects to some folders and remove them from others in one call', async () => {
			mockFoldersService.findFolderById
				.mockResolvedValueOnce(mockFoldersResponse.items[0])
				.mockResolvedValueOnce(mockOrganisationFolder);
			mockIeObjectsService.getIeObjectIdFromObjectSchemaIdentifier
				.mockResolvedValueOnce('ie-object-id-1')
				.mockResolvedValueOnce('ie-object-id-2');
			mockFoldersService.updateObjectsInFolders.mockResolvedValueOnce({
				addedCount: 1,
				removedCount: 2,
			});
			mockIeObjectsService.findByIeObjectId.mockResolvedValue(mockIeObject1);
			mockEventsService.insertEvents.mockResolvedValue([]);

			const result = await foldersController.updateObjectsInFolders(
				mockRequest,
				'referer',
				'127.0.0.1',
				{
					addToFolderIds: [mockFoldersResponse.items[0].id],
					removeFromFolderIds: [mockOrganisationFolder.id],
					objectSchemaIdentifiers: ['schema-identifier-1', 'schema-identifier-2'],
				},
				new SessionUserEntity(mockCpAdminUser)
			);

			expect(result).toEqual({
				addToFolderIds: [mockFoldersResponse.items[0].id],
				removeFromFolderIds: [mockOrganisationFolder.id],
				objectSchemaIdentifiers: ['schema-identifier-1', 'schema-identifier-2'],
				notFoundSchemaIdentifiers: [],
				addedCount: 1,
				removedCount: 2,
			});
			expect(mockFoldersService.updateObjectsInFolders).toHaveBeenCalledWith(
				[mockFoldersResponse.items[0].id],
				[mockOrganisationFolder.id],
				['ie-object-id-1', 'ie-object-id-2'],
				{
					_or: [
						{ user_profile_id: { _eq: mockCpAdminUser.id } },
						{ owner_organisation_id: { _eq: mockOrganisationId } },
					],
				}
			);
		});

		it('should not change anything if the user has no access to one of the folders', async () => {
			mockFoldersService.findFolderById
				.mockResolvedValueOnce(mockFoldersResponse.items[0])
				.mockResolvedValueOnce({ ...mockOrganisationFolder, ownerOrganisationId: 'OR-other' });

			await expect(
				foldersController.updateObjectsInFolders(
					mockRequest,
					'referer',
					'127.0.0.1',
					{
						addToFolderIds: [mockFoldersResponse.items[0].id],
						removeFromFolderIds: [mockOrganisationFolder.id],
						objectSchemaIdentifiers: ['schema-identifier-1'],
					},
					new SessionUserEntity(mockCpAdminUser)
				)
			).rejects.toThrow('You can only delete objects from your own folders');
			expect(mockFoldersService.updateObjectsInFolders).not.toHaveBeenCalled();
		});

		it('should return a 400 when no folders are passed', async () => {
			await expect(
				foldersController.updateObjectsInFolders(
					mockRequest,
					'referer',
					'127.0.0.1',
					{
						addToFolderIds: [],
						removeFromFolderIds: [],
						objectSchemaIdentifiers: ['schema-identifier-1'],
					},
					new SessionUserEntity(mockUser)
				)
			).rejects.toThrow('At least one folder to add to or remove from is required');
			expect(mockFoldersService.updateObjectsInFolders).not.toHaveBeenCalled();
		});

		it('should return a 400 when a folder is both added to and removed from', async () => {
			await expect(
				foldersController.updateObjectsInFolders(
					mockRequest,
					'referer',
					'127.0.0.1',
					{
						addToFolderIds: [mockFoldersResponse.items[0].id],
						removeFromFolderIds: [mockFoldersResponse.items[0].id],
						objectSchemaIdentifiers: ['schema-identifier-1'],
					},
					new SessionUserEntity(mockUser)
				)
			).rejects.toThrow('A folder cannot be in both addToFolderIds and removeFromFolderIds');
			expect(mockFoldersService.updateObjectsInFolders).not.toHaveBeenCalled();
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
			mockIeObjectsService.getIeObjectIdFromObjectSchemaIdentifier.mockResolvedValue(
				mockIeObject1.iri
			);
			mockIeObjectsService.findByIeObjectId.mockResolvedValue([mockIeObject1]);
			mockEventsService.insertEvents.mockResolvedValueOnce([]);
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
				new SessionUserEntity(mockUser),
				{ path: '', params: {} } as unknown as Request
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
				new SessionUserEntity(mockUser),
				{ path: '', params: {} } as unknown as Request
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
					new SessionUserEntity(mockUser),
					{ path: '', params: {} } as unknown as Request
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
				new SessionUserEntity(mockUser),
				{ path: '', params: {} } as unknown as Request
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
					new SessionUserEntity(mockUser),
					{ path: '', params: {} } as unknown as Request
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
					new SessionUserEntity(mockUser),
					{ path: '', params: {} } as unknown as Request
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
			mockFoldersService.addObjectsToFolders.mockResolvedValue(1);

			const sharedFolder = await foldersController.acceptSharedFolder(
				'referer',
				'127.0.0.1',
				mockFoldersResponse.items[0].id,
				new SessionUserEntity(mockUser)
			);

			expect(sharedFolder?.status).toEqual(FolderStatus.ADDED);
		});

		it('Should refuse to accept an organisation folder', async () => {
			mockFoldersService.findFolderById.mockResolvedValueOnce(mockOrganisationFolder);

			await expect(
				foldersController.acceptSharedFolder(
					'referer',
					'127.0.0.1',
					mockOrganisationFolder.id,
					new SessionUserEntity(mockUser)
				)
			).rejects.toThrow('Organisation folders cannot be shared');
			expect(mockFoldersService.create).not.toHaveBeenCalled();
		});
	});
});
