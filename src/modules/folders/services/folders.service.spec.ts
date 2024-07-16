import { DataService, PlayerTicketService } from '@meemoo/admin-core-api';
import { Test, type TestingModule } from '@nestjs/testing';
import { format } from 'date-fns';

import { FoldersService } from './folders.service';

import {
	type FindFolderIeObjectsByFolderIdQuery,
	type FindFoldersByUserQuery,
	type FindIeObjectBySchemaIdentifierQuery,
	type FindIeObjectInFolderQuery,
	type InsertFolderMutation,
	type InsertIeObjectIntoFolderMutation,
	type RemoveObjectFromFolderMutation,
	type SoftDeleteFolderMutation,
	type UpdateFolderMutation,
} from '~generated/graphql-db-types-hetarchief';
import { mockGqlFolder } from '~modules/folders/services/__mocks__/users_folder';
import { type FolderObjectLink, type GqlObject } from '~modules/folders/types';
import { type IeObject, IsPartOfKey } from '~modules/ie-objects/ie-objects.types';
import { VisitsService } from '~modules/visits/services/visits.service';
import { TestingLogger } from '~shared/logging/test-logger';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const mockPlayerTicketService: Partial<Record<keyof PlayerTicketService, jest.SpyInstance>> = {
	resolveThumbnailUrl: jest.fn(),
};

const mockVisitsService: Partial<Record<keyof VisitsService, jest.SpyInstance>> = {
	findEndDatesByFolderId: jest.fn(),
};

const mockGqlFolder1: FindFoldersByUserQuery['users_folder'][0] = {
	id: '0018c1b6-97ae-435f-abef-31a2cde011fd',
	name: 'Favorieten',
	description: 'Favorieten',
	user_profile_id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	is_default: true,
	created_at: '2022-02-18T09:19:09.487977',
	updated_at: '2022-02-18T09:19:09.487977',
	intellectualEntities: [],
};

const mockGqlFolder2: FindFoldersByUserQuery['users_folder'][0] = {
	id: 'be84632b-1f80-4c4f-b61c-e7f3b437a56b',
	name: 'mijn favorite films',
	description: 'mijn favorite films',
	user_profile_id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	is_default: false,
	created_at: '2022-02-22T13:51:01.995293',
	updated_at: '2022-02-22T13:51:01.995293',
	intellectualEntities: [],
};

const mockGqlFolderObject: GqlObject = {
	schema_name: 'CGSO. De mannenbeweging - mannenemancipatie - 1982',
	schema_creator: null,
	dcterms_available: '2015-09-19T12:08:24',
	dcterms_format: 'video',
	schema_number_of_pages: null,
	schema_identifier: '8s4jm2514q',
};

const mockGqlFolderObjectLink: FolderObjectLink = {
	created_at: '2022-02-02T10:55:16.542503',
	intellectualEntity: mockGqlFolderObject,
};

const mockGqlFoldersResult: FindFoldersByUserQuery = {
	users_folder: [mockGqlFolder1, mockGqlFolder2],
	users_folder_aggregate: {
		aggregate: {
			count: 2,
		},
	},
};

const mockGqlFolderResult: FindFoldersByUserQuery = {
	users_folder: [mockGqlFolder1],
	users_folder_aggregate: {
		aggregate: {
			count: 0,
		},
	},
};

const mockGqlFolderResultEmpty: FindFoldersByUserQuery = {
	users_folder: [],
	users_folder_aggregate: {
		aggregate: {
			count: 0,
		},
	},
};

const mockGqlFolderObjectsResult = {
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
				schema_identifier: '8s4jm2514q',
			},
		},
	],
	users_folder_ie_aggregate: {
		aggregate: {
			count: 1,
		},
	},
};

const mockGqlFolderObjectResult: FindIeObjectInFolderQuery = {
	users_folder_ie: [
		{
			created_at: '2022-02-02T10:55:16.542503',
			intellectualEntity: {
				schema_name: 'CGSO. De mannenbeweging - mannenemancipatie - 1982',
				schema_creator: null,
				dcterms_available: '2015-09-19T12:08:24',
				schema_thumbnail_url:
					'/viaa/AMSAB/5dc89b7e75e649e191cd86196c255147cd1a0796146d4255acfde239296fa534/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
				dcterms_format: 'video',
				schema_number_of_pages: null,
				schema_identifier: '8s4jm2514q',
			},
		},
	],
};

const mockFolderObject: Partial<IeObject> & { folderEntryCreatedAt: string } = {
	schemaIdentifier: '8s4jm2514q',
	name: 'CGSO. De mannenbeweging - mannenemancipatie - 1982',
	dctermsAvailable: '2015-09-19T12:08:24',
	creator: null,
	dctermsFormat: 'video',
	numberOfPages: null,
	thumbnailUrl:
		'/viaa/AMSAB/5dc89b7e75e649e191cd86196c255147cd1a0796146d4255acfde239296fa534/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
	folderEntryCreatedAt: '2022-02-02T10:55:16.542503',
	description: 'A description for this collection',
	maintainerId: 'OR-1v5bc86',
	maintainerName: 'Huis van Alijn',
	maintainerSlug: 'amsab',
	meemooLocalId: 'WP00032225',
	isPartOf: {
		[IsPartOfKey.serie]: ['Serie'],
		[IsPartOfKey.programma]: ['Programma'],
	},
	duration: '01:01:59',
};

const mockUser = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	email: 'test.testers@meemoo.be',
};

describe('FoldersService', () => {
	let foldersService: FoldersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FoldersService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: PlayerTicketService,
					useValue: mockPlayerTicketService,
				},
				{
					provide: VisitsService,
					useValue: mockVisitsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		foldersService = module.get<FoldersService>(FoldersService);
	});

	afterEach(async () => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(foldersService).toBeDefined();
	});

	describe('adapt', () => {
		it('returns undefined if no graphQl object was given', () => {
			const adapted = foldersService.adaptIeObject(undefined);
			expect(adapted).toBeUndefined();
		});

		it('can adapt a graphql collection response to our collection interface', async () => {
			const mockVisitEndDates = [
				new Date('2022-02-18T09:19:09.487977'),
				new Date('2022-02-19T09:19:09.487977'),
			];
			mockVisitsService.findEndDatesByFolderId.mockResolvedValue(mockVisitEndDates);
			const adapted = await foldersService.adaptFolder(mockGqlFolder, 'referer', '');
			// test some sample keys
			expect(adapted.id).toEqual(mockGqlFolder.id);
			expect(adapted.name).toEqual(mockGqlFolder.name);
			expect(adapted.usedForLimitedAccessUntil).toEqual(
				format(mockVisitEndDates[1], 'yyyy-MM-dd')
			);
			expect(adapted.userProfileId).toEqual(mockGqlFolder.user_profile_id);
			expect(adapted.objects[0].schemaIdentifier).toEqual(
				mockGqlFolder.intellectualEntities[0].intellectualEntity.schema_identifier
			);
		});

		it('can adapt a graphql collection response without objects to our collection interface', async () => {
			const adapted = await foldersService.adaptFolder(
				{
					...mockGqlFolder,
					intellectualEntities: [],
				},
				'referer',
				''
			);
			// test some sample keys
			expect(adapted.id).toEqual(mockGqlFolder.id);
			expect(adapted.name).toEqual(mockGqlFolder.name);
			expect(adapted.userProfileId).toEqual(mockGqlFolder.user_profile_id);
			expect(adapted.objects).toHaveLength(0);
		});

		it('can adapt an undefined collection object', async () => {
			const adapted = await foldersService.adaptFolder(undefined, 'referer', '');
			expect(adapted).toBeUndefined();
		});

		it('can adapt a graphql collection object response to our object interface', async () => {
			const adapted = await foldersService.adaptFolderObjectLink(
				mockGqlFolderObjectLink,
				'referer',
				''
			);
			// test some sample keys
			expect(adapted.schemaIdentifier).toEqual(
				mockGqlFolderObjectLink.intellectualEntity.schema_identifier
			);
			expect(adapted.name).toEqual(mockGqlCollectionObjectLink.ie.schema_name);
			expect(adapted.dctermsAvailable).toEqual(
				mockGqlFolderObjectLink.intellectualEntity.dcterms_available
			);
			expect(adapted.folderEntryCreatedAt).toEqual(mockGqlFolderObjectLink.created_at);
		});

		it('can adapt an undefined collection object link', async () => {
			const adapted = await foldersService.adaptFolderObjectLink(undefined, 'referer', '');
			expect(adapted).toBeUndefined();
		});
	});

	describe('findFoldersByUser', () => {
		it('returns a paginated response with all folders for a user', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlFoldersResult);
			const response = await foldersService.findFoldersByUser(
				mockGqlFoldersResult.users_folder[0].user_profile_id,
				'referer',
				''
			);
			expect(response.items.length).toBe(2);
			expect(response.page).toBe(1);
			expect(response.size).toBe(1000);
			expect(response.total).toBe(2);
		});
	});

	describe('findFolderById', () => {
		it('should return once collection', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlFolderResult);
			const response = await foldersService.findFolderById(
				mockGqlFolderResult.users_folder[0].id,
				'referer',
				''
			);
			expect(response.id).toBe(mockGqlFolderResult.users_folder[0].id);
		});

		it('should return undefined if collection does not exist', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlFolderResultEmpty);
			const response = await foldersService.findFolderById(
				mockGqlFolderResult.users_folder[0].id,
				'referer',
				''
			);
			expect(response).toBeUndefined();
		});
	});

	describe('findObjectsByFolderId', () => {
		it('returns all objects in a collection', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlFolderObjectsResult);
			const response = await foldersService.findObjectsByFolderId(
				mockGqlFolder1.id,
				mockUser.id,
				{},
				'referer',
				''
			);
			expect(response.items[0].schemaIdentifier).toBe(
				mockGqlFolderObjectsResult.users_folder_ie[0].ie.schema_identifier
			);
		});

		it('throws a NotFoundException if the collection was not found', async () => {
			const mockData: FindFolderIeObjectsByFolderIdQuery = {
				users_folder_ie: [],
				users_folder_ie_aggregate: {
					aggregate: {
						count: 0,
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			let error;
			try {
				await foldersService.findObjectsByFolderId(
					'unknown-id',
					mockUser.id,
					{},
					'referer',
					''
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

	describe('findObjectInFolder', () => {
		it('returns one objects in a collection', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGqlFolderObjectResult);
			const response = await foldersService.findObjectInFolderBySchemaIdentifier(
				mockGqlFolder1.id,
				mockFolderObject.schemaIdentifier,
				'referer',
				''
			);
			expect(response.schemaIdentifier).toBe(mockFolderObject.schemaIdentifier);
		});
	});

	describe('create', () => {
		it('can create a new collection', async () => {
			const mockData: InsertFolderMutation = {
				insert_users_folder: {
					returning: [mockGqlFolder1],
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, intellectualEntities, ...mockFolder } =
				mockGqlFolder1;
			const response = await foldersService.create(mockFolder, 'referer', '');
			expect(response.id).toBe(mockGqlFolder1.id);
		});
	});

	describe('update', () => {
		it('can update a collection', async () => {
			const mockData: UpdateFolderMutation = {
				update_users_folder: {
					returning: [mockGqlFolder1],
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { id, created_at, updated_at, user_profile_id, ...mockFolder } = mockGqlFolder1;
			const response = await foldersService.update(
				id,
				user_profile_id,
				mockFolder,
				'referer',
				''
			);
			expect(response.id).toBe(mockGqlFolder1.id);
		});
	});

	describe('delete', () => {
		it('can delete a collection', async () => {
			const mockData: SoftDeleteFolderMutation = {
				update_users_folder: {
					affected_rows: 1,
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const { id, user_profile_id } = mockGqlFolder1;
			const affectedRows = await foldersService.delete(id, user_profile_id);
			expect(affectedRows).toBe(1);
		});

		it('can delete a non existing collection', async () => {
			const mockData: SoftDeleteFolderMutation = {
				update_users_folder: {
					affected_rows: 0,
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const { user_profile_id } = mockGqlFolder1;
			const affectedRows = await foldersService.delete('unknown-id', user_profile_id);
			expect(affectedRows).toBe(0);
		});
	});

	describe('findObjectBySchemaIdentifier', () => {
		it('can find an object by schema identifier', async () => {
			const mockData: FindIeObjectBySchemaIdentifierQuery = {
				graph__intellectual_entity: [mockGqlFolderObject],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const object = await foldersService.findObjectBySchemaIdentifier(
				mockFolderObject.schemaIdentifier
			);
			expect(object.schemaIdentifier).toEqual(mockFolderObject.schemaIdentifier);
		});
	});

	describe('addObjectToFolder', () => {
		it('can add object to a collection', async () => {
			const findObjectInFolderSpy = jest
				.spyOn(foldersService, 'findObjectInFolderBySchemaIdentifier')
				.mockResolvedValueOnce(null);
			const findObjectBySchemaIdentifierSpy = jest
				.spyOn(foldersService, 'findObjectBySchemaIdentifier')
				.mockResolvedValueOnce(mockFolderObject);
			const mockData: InsertIeObjectIntoFolderMutation = {
				insert_users_folder_ie: {
					returning: [
						mockGqlFolderObjectLink as InsertIeObjectIntoFolderMutation['insert_users_folder_ie']['returning'][0],
					],
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const response = await foldersService.addObjectToFolder(
				mockGqlFolder1.id,
				mockGqlFolderObjectLink.intellectualEntity.schema_identifier,
				'referer',
				''
			);
			expect(response.schemaIdentifier).toBe(
				mockGqlFolderObjectLink.intellectualEntity.schema_identifier
			);
			findObjectInFolderSpy.mockRestore();
			findObjectBySchemaIdentifierSpy.mockRestore();
		});

		it('can not add object to a collection if it already exists', async () => {
			const findObjectInFolderSpy = jest
				.spyOn(foldersService, 'findObjectInFolderBySchemaIdentifier')
				.mockResolvedValueOnce(mockFolderObject);

			let error;
			try {
				await foldersService.addObjectToFolder(
					mockGqlFolder1.id,
					mockGqlFolderObjectLink.intellectualEntity.schema_identifier,
					'referer',
					''
				);
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				code: 'OBJECT_ALREADY_EXISTS',
				message: 'Object already exists in collection',
			});

			findObjectInFolderSpy.mockRestore();
		});

		it('throws a NotFoundException when the objectInfo was not found', async () => {
			const findObjectInFolderSpy = jest
				.spyOn(foldersService, 'findObjectInFolderBySchemaIdentifier')
				.mockResolvedValueOnce(null);
			const findObjectBySchemaIdentifierSpy = jest
				.spyOn(foldersService, 'findObjectBySchemaIdentifier')
				.mockResolvedValueOnce(null);

			let error;
			try {
				await foldersService.addObjectToFolder(
					mockGqlFolder1.id,
					mockGqlFolderObjectLink.intellectualEntity.schema_identifier,
					'referer',
					''
				);
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				error: 'Not Found',
				statusCode: 404,
				message: `Object with schema identifier ${mockGqlFolderObjectLink.intellectualEntity.schema_identifier} was not found`,
			});
			findObjectInFolderSpy.mockRestore();
			findObjectBySchemaIdentifierSpy.mockRestore();
		});
	});

	describe('remove object from collection', () => {
		it('can remove an object from a collection', async () => {
			const mockData: RemoveObjectFromFolderMutation = {
				delete_users_folder_ie: {
					affected_rows: 1,
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const affectedRows = await foldersService.removeObjectFromFolder(
				mockGqlFolder1.id,
				mockGqlFolderObjectLink.intellectualEntity.schema_identifier,
				mockUser.id
			);
			expect(affectedRows).toBe(1);
		});

		it('can remove a non existing object from a collection', async () => {
			const mockData: RemoveObjectFromFolderMutation = {
				delete_users_folder_ie: {
					affected_rows: 0,
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const affectedRows = await foldersService.removeObjectFromFolder(
				mockGqlFolder1.id,
				'unknown-id',
				mockUser.id
			);
			expect(affectedRows).toBe(0);
		});
	});
});
