import { Test, TestingModule } from '@nestjs/testing';
import { IPagination } from '@studiohyperdrive/pagination';
import { Request } from 'express';

import { CollectionsService } from '../services/collections.service';

import { CollectionsController } from './collections.controller';

import { Collection } from '~modules/collections/types';
import { EventsService } from '~modules/events/services/events.service';
import { MediaService } from '~modules/media/services/media.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { SessionHelper } from '~shared/auth/session-helper';
import { TestingLogger } from '~shared/logging/test-logger';

const mockCollectionsResponse: IPagination<Collection> = {
	items: [
		{
			id: '0018c1b6-97ae-435f-abef-31a2cde011fd',
			name: 'Favorieten',
			userProfileId: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
			isDefault: true,
			createdAt: '2022-02-18T09:19:09.487977',
			updatedAt: '2022-02-18T09:19:09.487977',
		},
		{
			id: 'be84632b-1f80-4c4f-b61c-e7f3b437a56b',
			name: 'my favorite movies',
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

const mockCollectionObjectsResponse = {
	items: [
		{
			name: 'CGSO. De mannenbeweging - mannenemancipatie - 1982',
			termsAvailable: '2015-09-19T12:08:24',
			creator: null,
			format: 'video',
			numberOfPages: null,
			thumbnailUrl:
				'/viaa/AMSAB/5dc89b7e75e649e191cd86196c255147cd1a0796146d4255acfde239296fa534/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
			collectionEntryCreatedAt: '2022-02-02T10:55:16.542503',
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
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: Group.CP_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: [Permission.EDIT_ANY_CONTENT_PAGES],
};

const mockCollectionsService: Partial<Record<keyof CollectionsService, jest.SpyInstance>> = {
	findCollectionsByUser: jest.fn(),
	findCollectionById: jest.fn(),
	findObjectInCollectionBySchemaIdentifier: jest.fn(),
	findObjectsByCollectionId: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
	addObjectToCollection: jest.fn(),
	removeObjectFromCollection: jest.fn(),
};

const mockEventsService: Partial<Record<keyof EventsService, jest.SpyInstance>> = {
	insertEvents: jest.fn(),
};

const mockRequest = { path: '/collections', headers: {} } as unknown as Request;

const mockMediaService: Partial<Record<keyof MediaService, jest.SpyInstance>> = {
	findAllObjectMetadataByCollectionId: jest.fn(),
	convertObjectsToXml: jest.fn(),
};

describe('CollectionsController', () => {
	let collectionsController: CollectionsController;
	let sessionHelperSpy: jest.SpyInstance;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CollectionsController],
			imports: [],
			providers: [
				{
					provide: CollectionsService,
					useValue: mockCollectionsService,
				},
				{
					provide: EventsService,
					useValue: mockEventsService,
				},
				{
					provide: MediaService,
					useValue: mockMediaService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		collectionsController = module.get<CollectionsController>(CollectionsController);

		sessionHelperSpy = jest
			.spyOn(SessionHelper, 'getArchiefUserInfo')
			.mockReturnValue(mockUser);
	});

	afterEach(async () => {
		sessionHelperSpy.mockRestore();
	});

	it('should be defined', () => {
		expect(collectionsController).toBeDefined();
	});

	describe('getCollections', () => {
		it('should return all collections of a specific user', async () => {
			mockCollectionsService.findCollectionsByUser.mockResolvedValueOnce(
				mockCollectionsResponse
			);
			const collections = await collectionsController.getCollections(
				'referer',
				new SessionUserEntity(mockUser)
			);
			expect(collections.items.length).toEqual(2);
		});
	});

	describe('getCollectionObjectsById', () => {
		it('should return the objects in the collection', async () => {
			mockCollectionsService.findObjectsByCollectionId.mockResolvedValueOnce(
				mockCollectionObjectsResponse
			);
			const collectionObjects = await collectionsController.getCollectionObjects(
				'referer',
				mockCollectionsResponse.items[0].id,
				{},
				new SessionUserEntity(mockUser)
			);
			expect(collectionObjects.items[0].name).toEqual(
				mockCollectionObjectsResponse.items[0].name
			);
		});
	});

	describe('exportCollection', () => {
		it('should export a collection as xml', async () => {
			mockMediaService.findAllObjectMetadataByCollectionId.mockResolvedValueOnce([]);
			mockMediaService.convertObjectsToXml.mockReturnValueOnce('</objects>');
			const result = await collectionsController.exportCollection(
				'referer',
				'collection-id',
				new SessionUserEntity(mockUser),
				mockRequest
			);
			expect(result).toEqual('</objects>');
		});
	});

	describe('createCollection', () => {
		it('should create a collection by id', async () => {
			mockCollectionsService.create.mockResolvedValueOnce(mockCollectionsResponse.items[0]);
			const collection = await collectionsController.createCollection(
				'referer',
				{
					name: 'test collection',
				},
				new SessionUserEntity(mockUser)
			);
			expect(collection).toEqual(mockCollectionsResponse.items[0]);
		});
	});

	describe('updateCollection', () => {
		it('should update a collection by id', async () => {
			mockCollectionsService.update.mockResolvedValueOnce(mockCollectionsResponse.items[0]);
			const collection = await collectionsController.updateCollection(
				'referer',
				mockCollectionsResponse.items[0].id,
				{
					name: 'test collection',
				},
				new SessionUserEntity(mockUser)
			);
			expect(collection).toEqual(mockCollectionsResponse.items[0]);
		});
	});

	describe('deleteCollection', () => {
		it('should delete a collection by id', async () => {
			mockCollectionsService.delete.mockResolvedValueOnce(1);

			const response = await collectionsController.deleteCollection(
				mockCollectionsResponse.items[0].id,
				new SessionUserEntity(mockUser)
			);
			expect(response).toEqual({ status: 'collection has been deleted' });
		});

		it('should delete a collection by id', async () => {
			mockCollectionsService.delete.mockResolvedValueOnce(0);

			const response = await collectionsController.deleteCollection(
				mockCollectionsResponse.items[0].id,
				new SessionUserEntity(mockUser)
			);
			expect(response).toEqual({ status: 'no collections found with that id' });
		});
	});

	describe('createCollectionObject', () => {
		it('should add an object to a collection', async () => {
			mockCollectionsService.addObjectToCollection.mockResolvedValueOnce(
				mockCollectionObjectsResponse.items[0]
			);
			mockCollectionsService.findCollectionById.mockResolvedValueOnce(
				mockCollectionsResponse.items[0]
			);
			const collectionObject = await collectionsController.addObjectToCollection(
				mockRequest,
				'referer',
				mockCollectionsResponse.items[0].id,
				mockSchemaIdentifier,
				new SessionUserEntity(mockUser)
			);
			expect(collectionObject).toEqual(mockCollectionObjectsResponse.items[0]);
		});

		it('should not add an object to a collection that is not owned', async () => {
			mockCollectionsService.addObjectToCollection.mockResolvedValueOnce(
				mockCollectionObjectsResponse.items[0]
			);
			mockCollectionsService.findCollectionById.mockResolvedValueOnce({
				...mockCollectionsResponse.items[0],
				userProfileId: 'other-profile-id',
			});

			let error;
			try {
				await collectionsController.addObjectToCollection(
					mockRequest,
					'referer',
					mockCollectionsResponse.items[0].id,
					mockSchemaIdentifier,
					new SessionUserEntity(mockUser)
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('You can only add objects to your own collections');
		});
	});

	describe('deleteCollectionObject', () => {
		it('should remove an object from a collection', async () => {
			mockCollectionsService.removeObjectFromCollection.mockResolvedValueOnce(1);
			mockCollectionsService.findCollectionById.mockResolvedValueOnce(
				mockCollectionsResponse.items[0]
			);
			const collectionObject = await collectionsController.removeObjectFromCollection(
				'referer',
				mockCollectionsResponse.items[0].id,
				mockSchemaIdentifier,
				new SessionUserEntity(mockUser)
			);
			expect(collectionObject).toEqual({ status: 'object has been deleted' });
		});

		it('should not complain about removing non existing objects from a collection', async () => {
			mockCollectionsService.removeObjectFromCollection.mockResolvedValueOnce(0);
			mockCollectionsService.findCollectionById.mockResolvedValueOnce(
				mockCollectionsResponse.items[0]
			);
			const collectionObject = await collectionsController.removeObjectFromCollection(
				'referer',
				mockCollectionsResponse.items[0].id,
				'non-existing-object-id',
				new SessionUserEntity(mockUser)
			);
			expect(collectionObject).toEqual({
				status: 'no object found with that id in that collection',
			});
		});

		it('should not remove an object from a collection that are not owned', async () => {
			mockCollectionsService.removeObjectFromCollection.mockResolvedValueOnce(1);
			mockCollectionsService.findCollectionById.mockResolvedValueOnce({
				...mockCollectionsResponse.items[0],
				userProfileId: 'other-profile-id',
			});

			let error;
			try {
				await collectionsController.removeObjectFromCollection(
					'referer',
					mockCollectionsResponse.items[0].id,
					mockSchemaIdentifier,
					new SessionUserEntity(mockUser)
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('You can only delete objects from your own collections');
		});
	});

	describe('moveObjectToAnotherCollection', () => {
		it('should move object to another collection', async () => {
			mockCollectionsService.addObjectToCollection.mockResolvedValueOnce(
				mockCollectionObjectsResponse.items[0]
			);
			mockCollectionsService.removeObjectFromCollection.mockResolvedValueOnce(1);
			mockCollectionsService.findCollectionById.mockResolvedValue(
				mockCollectionsResponse.items[0]
			);
			mockCollectionsService.findObjectInCollectionBySchemaIdentifier.mockResolvedValue(null);

			const collectionObject = await collectionsController.moveObjectToAnotherCollection(
				'referer',
				mockCollectionsResponse.items[0].id,
				mockSchemaIdentifier,
				mockCollectionsResponse.items[1].id,
				new SessionUserEntity(mockUser)
			);
			expect(collectionObject).toEqual(mockCollectionObjectsResponse.items[0]);
		});

		it('should not move object if requester does not own "from" collection', async () => {
			mockCollectionsService.addObjectToCollection.mockResolvedValueOnce(
				mockCollectionObjectsResponse.items[0]
			);
			mockCollectionsService.removeObjectFromCollection.mockResolvedValueOnce(1);
			mockCollectionsService.findCollectionById
				.mockResolvedValueOnce({
					...mockCollectionsResponse.items[0],
					userProfileId: 'not-the-owner-id',
				})
				.mockResolvedValue(mockCollectionsResponse.items[0]);
			mockCollectionsService.findObjectInCollectionBySchemaIdentifier.mockResolvedValue(null);

			let error;
			try {
				await collectionsController.moveObjectToAnotherCollection(
					'referer',
					mockCollectionsResponse.items[0].id,
					mockSchemaIdentifier,
					mockCollectionsResponse.items[1].id,
					new SessionUserEntity(mockUser)
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('You can only move objects from your own collections');
		});

		it('should not move object if requester does not own "to" collection', async () => {
			mockCollectionsService.addObjectToCollection.mockResolvedValueOnce(
				mockCollectionObjectsResponse.items[0]
			);
			mockCollectionsService.removeObjectFromCollection.mockResolvedValueOnce(1);
			mockCollectionsService.findCollectionById
				.mockResolvedValueOnce(mockCollectionsResponse.items[0])
				.mockResolvedValue({
					...mockCollectionsResponse.items[0],
					userProfileId: 'not-the-owner-id',
				});
			mockCollectionsService.findObjectInCollectionBySchemaIdentifier.mockResolvedValue(null);

			let error;
			try {
				await collectionsController.moveObjectToAnotherCollection(
					'referer',
					mockCollectionsResponse.items[0].id,
					mockSchemaIdentifier,
					mockCollectionsResponse.items[1].id,
					new SessionUserEntity(mockUser)
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('You can only move objects to your own collections');
		});
	});
});
