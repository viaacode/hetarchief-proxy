import { Test, TestingModule } from '@nestjs/testing';

import { CollectionsService } from './collections.service';

import {
	DeleteCollectionMutation,
	FindCollectionObjectsByCollectionIdQuery,
	FindCollectionsByUserQuery,
	FindObjectBySchemaIdentifierQuery,
	FindObjectInCollectionQuery,
	InsertCollectionsMutation,
	InsertObjectIntoCollectionMutation,
	RemoveObjectFromCollectionMutation,
	UpdateCollectionMutation,
} from '~generated/graphql-db-types-hetarchief';
import { PlayerTicketService } from '~modules/admin/player-ticket/services/player-ticket.service';
import { mockGqlCollection } from '~modules/collections/services/__mocks__/users_collection';
import { CollectionObjectLink, GqlObject, IeObject } from '~modules/collections/types';
import { DataService } from '~modules/data/services/data.service';
import { TestingLogger } from '~shared/logging/test-logger';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockPlayerTicketService: Partial<Record<keyof PlayerTicketService, jest.SpyInstance>> = {
	resolveThumbnailUrl: jest.fn(),
};

const mockGqlCollection1: FindCollectionsByUserQuery['users_folder'][0] = {
	id: '0018c1b6-97ae-435f-abef-31a2cde011fd',
	name: 'Favorieten',
	user_profile_id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	is_default: true,
	created_at: '2022-02-18T09:19:09.487977',
	updated_at: '2022-02-18T09:19:09.487977',
	ies: [],
};

const mockGqlCollection2: FindCollectionsByUserQuery['users_folder'][0] = {
	id: 'be84632b-1f80-4c4f-b61c-e7f3b437a56b',
	name: 'my favorite movies',
	user_profile_id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	is_default: false,
	created_at: '2022-02-22T13:51:01.995293',
	updated_at: '2022-02-22T13:51:01.995293',
	ies: [],
};

const mockGqlCollectionObject: GqlObject = {
	schema_name: 'CGSO. De mannenbeweging - mannenemancipatie - 1982',
	schema_creator: null,
	dcterms_available: '2015-09-19T12:08:24',
	schema_thumbnail_url:
		'/viaa/AMSAB/5dc89b7e75e649e191cd86196c255147cd1a0796146d4255acfde239296fa534/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
	dcterms_format: 'video',
	schema_number_of_pages: null,
	meemoo_identifier: '8s4jm2514q',
	schema_identifier:
		'ec124bb2bd7b43a8b3dec94bd6567fec3f723d4c91cb418ba6eb26ded1ca1ef04b9ddbc8e98149858cc58dfebad3e6f5',
};

const mockGqlCollectionObjectLink: CollectionObjectLink = {
	created_at: '2022-02-02T10:55:16.542503',
	ie: mockGqlCollectionObject,
};

const mockGqlCollectionsResult: { data: FindCollectionsByUserQuery } = {
	data: {
		users_folder: [mockGqlCollection1, mockGqlCollection2],
		users_folder_aggregate: {
			aggregate: {
				count: 2,
			},
		},
	},
};

const mockGqlCollectionResult: { data: FindCollectionsByUserQuery } = {
	data: {
		users_folder: [mockGqlCollection1],
		users_folder_aggregate: {
			aggregate: {
				count: 0,
			},
		},
	},
};

const mockGqlCollectionResultEmpty: { data: FindCollectionsByUserQuery } = {
	data: {
		users_folder: [],
		users_folder_aggregate: {
			aggregate: {
				count: 0,
			},
		},
	},
};

const mockGqlCollectionObjectsResult: { data: FindCollectionObjectsByCollectionIdQuery } = {
	data: {
		users_folder_ie: [
			{
				created_at: '2022-02-02T10:55:16.542503',
				ie: {
					schema_name: 'CGSO. De mannenbeweging - mannenemancipatie - 1982',
					schema_creator: null,
					dcterms_available: '2015-09-19T12:08:24',
					schema_thumbnail_url:
						'/viaa/AMSAB/5dc89b7e75e649e191cd86196c255147cd1a0796146d4255acfde239296fa534/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
					dcterms_format: 'video',
					schema_number_of_pages: null,
					meemoo_identifier: '8s4jm2514q',
					schema_identifier:
						'ec124bb2bd7b43a8b3dec94bd6567fec3f723d4c91cb418ba6eb26ded1ca1ef04b9ddbc8e98149858cc58dfebad3e6f5',
				},
			},
		],
		users_folder_ie_aggregate: {
			aggregate: {
				count: 1,
			},
		},
	},
};

const mockGqlCollectionObjectResult: { data: FindObjectInCollectionQuery } = {
	data: {
		users_folder_ie: [
			{
				created_at: '2022-02-02T10:55:16.542503',
				ie: {
					schema_name: 'CGSO. De mannenbeweging - mannenemancipatie - 1982',
					schema_creator: null,
					dcterms_available: '2015-09-19T12:08:24',
					schema_thumbnail_url:
						'/viaa/AMSAB/5dc89b7e75e649e191cd86196c255147cd1a0796146d4255acfde239296fa534/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
					dcterms_format: 'video',
					schema_number_of_pages: null,
					meemoo_identifier: '8s4jm2514q',
					schema_identifier:
						'ec124bb2bd7b43a8b3dec94bd6567fec3f723d4c91cb418ba6eb26ded1ca1ef04b9ddbc8e98149858cc58dfebad3e6f5',
				},
			},
		],
	},
};

const mockCollectionObject: IeObject = {
	schemaIdentifier:
		'ec124bb2bd7b43a8b3dec94bd6567fec3f723d4c91cb418ba6eb26ded1ca1ef04b9ddbc8e98149858cc58dfebad3e6f5',
	meemooIdentifier: '8s4jm2514q',
	name: 'CGSO. De mannenbeweging - mannenemancipatie - 1982',
	termsAvailable: '2015-09-19T12:08:24',
	creator: null,
	format: 'video',
	numberOfPages: null,
	thumbnailUrl:
		'/viaa/AMSAB/5dc89b7e75e649e191cd86196c255147cd1a0796146d4255acfde239296fa534/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
	collectionEntryCreatedAt: '2022-02-02T10:55:16.542503',
	description: 'A description for this collection',
	maintainerId: 'OR-1v5bc86',
	maintainerName: 'Huis van Alijn',
	readingRoomId: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
	series: ['Serie'],
	programs: ['Programma'],
};

const mockUser = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	email: 'test.testers@meemoo.be',
};

describe('CollectionsService', () => {
	let collectionsService: CollectionsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CollectionsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: PlayerTicketService,
					useValue: mockPlayerTicketService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		collectionsService = module.get<CollectionsService>(CollectionsService);
	});

	afterEach(async () => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(collectionsService).toBeDefined();
	});

	describe('adapt', () => {
		it('returns undefined if no graphQl object was given', () => {
			const adapted = collectionsService.adaptIeObject(undefined);
			expect(adapted).toBeUndefined();
		});

		it('can adapt a graphql collection response to our collection interface', async () => {
			const adapted = await collectionsService.adaptCollection(mockGqlCollection, 'referer');
			// test some sample keys
			expect(adapted.id).toEqual(mockGqlCollection.id);
			expect(adapted.name).toEqual(mockGqlCollection.name);
			expect(adapted.userProfileId).toEqual(mockGqlCollection.user_profile_id);
			expect(adapted.objects[0].schemaIdentifier).toEqual(
				mockGqlCollection.ies[0].ie.schema_identifier
			);
		});

		it('can adapt a graphql collection response without objects to our collection interface', async () => {
			const adapted = await collectionsService.adaptCollection(
				{
					...mockGqlCollection,
					ies: [],
				},
				'referer'
			);
			// test some sample keys
			expect(adapted.id).toEqual(mockGqlCollection.id);
			expect(adapted.name).toEqual(mockGqlCollection.name);
			expect(adapted.userProfileId).toEqual(mockGqlCollection.user_profile_id);
			expect(adapted.objects).toHaveLength(0);
		});

		it('can adapt an undefined collection object', async () => {
			const adapted = await collectionsService.adaptCollection(undefined, 'referer');
			expect(adapted).toBeUndefined();
		});

		it('can adapt a graphql collection object response to our object interface', async () => {
			const adapted = await collectionsService.adaptCollectionObjectLink(
				mockGqlCollectionObjectLink,
				'referer'
			);
			// test some sample keys
			expect(adapted.schemaIdentifier).toEqual(
				mockGqlCollectionObjectLink.ie.schema_identifier
			);
			expect(adapted.meemooIdentifier).toEqual(
				mockGqlCollectionObjectLink.ie.meemoo_identifier
			);
			expect(adapted.name).toEqual(mockGqlCollectionObjectLink.ie.schema_name);
			expect(adapted.termsAvailable).toEqual(
				mockGqlCollectionObjectLink.ie.dcterms_available
			);
			expect(adapted.collectionEntryCreatedAt).toEqual(
				mockGqlCollectionObjectLink.created_at
			);
		});

		it('can adapt an undefined collection object link', async () => {
			const adapted = await collectionsService.adaptCollectionObjectLink(
				undefined,
				'referer'
			);
			expect(adapted).toBeUndefined();
		});
	});

	describe('findCollectionsByUser', () => {
		it('returns a paginated response with all collections for a user', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlCollectionsResult);
			const response = await collectionsService.findCollectionsByUser(
				mockGqlCollectionsResult.data.users_folder[0].user_profile_id,
				'referer'
			);
			expect(response.items.length).toBe(2);
			expect(response.page).toBe(1);
			expect(response.size).toBe(1000);
			expect(response.total).toBe(2);
		});
	});

	describe('findCollectionById', () => {
		it('should return once collection', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlCollectionResult);
			const response = await collectionsService.findCollectionById(
				mockGqlCollectionResult.data.users_folder[0].id,
				'referer'
			);
			expect(response.id).toBe(mockGqlCollectionResult.data.users_folder[0].id);
		});

		it('should return undefined if collection does not exist', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlCollectionResultEmpty);
			const response = await collectionsService.findCollectionById(
				mockGqlCollectionResult.data.users_folder[0].id,
				'referer'
			);
			expect(response).toBeUndefined();
		});
	});

	describe('findObjectsByCollectionId', () => {
		it('returns all objects in a collection', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlCollectionObjectsResult);
			const response = await collectionsService.findObjectsByCollectionId(
				mockGqlCollection1.id,
				mockUser.id,
				{},
				'referer'
			);
			expect(response.items[0].schemaIdentifier).toBe(
				mockGqlCollectionObjectsResult.data.users_folder_ie[0].ie.schema_identifier
			);
		});

		it('throws a NotFoundException if the collection was not found', async () => {
			const mockData: FindCollectionObjectsByCollectionIdQuery = {
				users_folder_ie: [],
				users_folder_ie_aggregate: {
					aggregate: {
						count: 0,
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			let error;
			try {
				await collectionsService.findObjectsByCollectionId(
					'unknown-id',
					mockUser.id,
					{},
					'referer'
				);
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				message: 'Not Found',
				statusCode: 404,
			});
		});
	});

	describe('findObjectInCollection', () => {
		it('returns one objects in a collection', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlCollectionObjectResult);
			const response = await collectionsService.findObjectInCollectionBySchemaIdentifier(
				mockGqlCollection1.id,
				mockCollectionObject.schemaIdentifier,
				'referer'
			);
			expect(response.schemaIdentifier).toBe(mockCollectionObject.schemaIdentifier);
		});
	});

	describe('create', () => {
		it('can create a new collection', async () => {
			const mockData: InsertCollectionsMutation = {
				insert_users_folder: {
					returning: [mockGqlCollection1],
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, ies, ...mockCollection } = mockGqlCollection1;
			const response = await collectionsService.create(mockCollection, 'referer');
			expect(response.id).toBe(mockGqlCollection1.id);
		});
	});

	describe('update', () => {
		it('can update a collection', async () => {
			const mockData: UpdateCollectionMutation = {
				update_users_folder: {
					returning: [mockGqlCollection1],
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, user_profile_id, ...mockCollection } =
				mockGqlCollection1;
			const response = await collectionsService.update(
				id,
				user_profile_id,
				mockCollection,
				'referer'
			);
			expect(response.id).toBe(mockGqlCollection1.id);
		});
	});

	describe('delete', () => {
		it('can delete a collection', async () => {
			const mockData: DeleteCollectionMutation = {
				delete_users_folder: {
					affected_rows: 1,
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const { id, user_profile_id } = mockGqlCollection1;
			const affectedRows = await collectionsService.delete(id, user_profile_id);
			expect(affectedRows).toBe(1);
		});

		it('can delete a non existing collection', async () => {
			const mockData: DeleteCollectionMutation = {
				delete_users_folder: {
					affected_rows: 0,
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const { user_profile_id } = mockGqlCollection1;
			const affectedRows = await collectionsService.delete('unknown-id', user_profile_id);
			expect(affectedRows).toBe(0);
		});
	});

	describe('findObjectBySchemaIdentifier', () => {
		it('can find an object by schema identifier', async () => {
			const mockData: FindObjectBySchemaIdentifierQuery = {
				object_ie: [mockGqlCollectionObject],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const object = await collectionsService.findObjectBySchemaIdentifier(
				mockCollectionObject.schemaIdentifier
			);
			expect(object.schemaIdentifier).toEqual(mockCollectionObject.schemaIdentifier);
		});
	});

	describe('addObjectToCollection', () => {
		it('can add object to a collection', async () => {
			const findObjectInCollectionSpy = jest
				.spyOn(collectionsService, 'findObjectInCollectionBySchemaIdentifier')
				.mockResolvedValueOnce(null);
			const findObjectBySchemaIdentifierSpy = jest
				.spyOn(collectionsService, 'findObjectBySchemaIdentifier')
				.mockResolvedValueOnce(mockCollectionObject);
			const mockData: InsertObjectIntoCollectionMutation = {
				insert_users_folder_ie: {
					returning: [mockGqlCollectionObjectLink],
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });

			const response = await collectionsService.addObjectToCollection(
				mockGqlCollection1.id,
				mockGqlCollectionObjectLink.ie.schema_identifier,
				'referer'
			);
			expect(response.schemaIdentifier).toBe(
				mockGqlCollectionObjectLink.ie.schema_identifier
			);
			findObjectInCollectionSpy.mockRestore();
			findObjectBySchemaIdentifierSpy.mockRestore();
		});

		it('can not add object to a collection if it already exists', async () => {
			const findObjectInCollectionSpy = jest
				.spyOn(collectionsService, 'findObjectInCollectionBySchemaIdentifier')
				.mockResolvedValueOnce(mockCollectionObject);

			let error;
			try {
				await collectionsService.addObjectToCollection(
					mockGqlCollection1.id,
					mockGqlCollectionObjectLink.ie.schema_identifier,
					'referer'
				);
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				code: 'OBJECT_ALREADY_EXISTS',
				message: 'Object already exists in collection',
			});

			findObjectInCollectionSpy.mockRestore();
		});

		it('throws a NotFoundException when the objectInfo was not found', async () => {
			const findObjectInCollectionSpy = jest
				.spyOn(collectionsService, 'findObjectInCollectionBySchemaIdentifier')
				.mockResolvedValueOnce(null);
			const findObjectBySchemaIdentifierSpy = jest
				.spyOn(collectionsService, 'findObjectBySchemaIdentifier')
				.mockResolvedValueOnce(null);

			let error;
			try {
				await collectionsService.addObjectToCollection(
					mockGqlCollection1.id,
					mockGqlCollectionObjectLink.ie.schema_identifier,
					'referer'
				);
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				error: 'Not Found',
				statusCode: 404,
				message: `Object with schema identifier ${mockGqlCollectionObjectLink.ie.schema_identifier} was not found`,
			});
			findObjectInCollectionSpy.mockRestore();
			findObjectBySchemaIdentifierSpy.mockRestore();
		});
	});

	describe('remove object from collection', () => {
		it('can remove an object from a collection', async () => {
			const mockData: RemoveObjectFromCollectionMutation = {
				delete_users_folder_ie: {
					affected_rows: 1,
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const affectedRows = await collectionsService.removeObjectFromCollection(
				mockGqlCollection1.id,
				mockGqlCollectionObjectLink.ie.schema_identifier,
				mockUser.id
			);
			expect(affectedRows).toBe(1);
		});

		it('can remove a non existing object from a collection', async () => {
			const mockData: RemoveObjectFromCollectionMutation = {
				delete_users_folder_ie: {
					affected_rows: 0,
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const affectedRows = await collectionsService.removeObjectFromCollection(
				mockGqlCollection1.id,
				'unknown-id',
				mockUser.id
			);
			expect(affectedRows).toBe(0);
		});
	});
});
