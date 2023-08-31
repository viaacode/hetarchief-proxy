import { AssetsService, TranslationsService } from '@meemoo/admin-core-api';
import { Test, TestingModule } from '@nestjs/testing';

import { SpacesService } from '../services/spaces.service';

import { SpacesController } from './spaces.controller';

import { VisitorSpaceStatus } from '~generated/database-aliases';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupId, GroupName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';
import { TestingLogger } from '~shared/logging/test-logger';

const mockSpacesResponse = {
	items: [
		{
			id: '1',
			name: 'Space Mountain',
			image: 'http://assets-int.hetarchief.be/hetarchief/SPACE_IMAGE/image.jpg',
			maintainerId: 'OR-rf5kf25',
		},
		{
			id: '2',
			name: 'Space X',
			maintainerId: 'OR-spacex',
		},
		{
			id: '3',
			name: 'Space Y',
			maintainerId: 'OR-spacey',
			status: VisitorSpaceStatus.Inactive,
		},
	],
};

const mockUser: User = {
	id: '0f5e3c9d-cf2a-4213-b888-dbf69b773c8e',
	firstName: 'Tom',
	lastName: 'Testerom',
	fullName: 'Test Testers',
	email: 'test@studiohyperdrive.be',
	acceptedTosAt: '2022-02-21T14:00:00',
	groupId: GroupId.CP_ADMIN,
	groupName: GroupName.CP_ADMIN,
	permissions: [Permission.READ_CP_VISIT_REQUESTS],
	idp: Idp.HETARCHIEF,
	organisationId: 'OR-rf5kf25',
	organisationName: 'VRT',
	isKeyUser: false,
};
const mockSpacesService: Partial<Record<keyof SpacesService, jest.SpyInstance>> = {
	findAll: jest.fn(),
	findById: jest.fn(),
	findSpaceByCpUserId: jest.fn(),
	getMaintainerProfiles: jest.fn(),
	findBySlug: jest.fn(),
	update: jest.fn(),
	create: jest.fn(),
};

const mockAssetsService: Partial<Record<keyof AssetsService, jest.SpyInstance>> = {
	upload: jest.fn(),
	delete: jest.fn(),
};

describe('SpacesController', () => {
	let spacesController: SpacesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SpacesController],
			imports: [],
			providers: [
				{
					provide: SpacesService,
					useValue: mockSpacesService,
				},
				{
					provide: AssetsService,
					useValue: mockAssetsService,
				},
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		spacesController = module.get<SpacesController>(SpacesController);
	});

	it('should be defined', () => {
		expect(spacesController).toBeDefined();
	});

	describe('getSpaces', () => {
		it('should return all spaces', async () => {
			mockSpacesService.findAll.mockResolvedValueOnce(mockSpacesResponse);
			const spaces = await spacesController.getSpaces({}, new SessionUserEntity(mockUser));
			expect(spaces.items.length).toEqual(mockSpacesResponse.items.length);
		});

		it('should return all spaces if no user is logged in', async () => {
			mockSpacesService.findAll.mockResolvedValueOnce(mockSpacesResponse);
			const spaces = await spacesController.getSpaces({}, new SessionUserEntity(undefined));
			expect(spaces.items.length).toEqual(mockSpacesResponse.items.length);
		});

		it('should only return active spaces if the user does not have the READ_ALL_SPACES permission', async () => {
			mockSpacesService.findAll.mockResolvedValueOnce(mockSpacesResponse);
			const spaces = await spacesController.getSpaces({}, new SessionUserEntity(mockUser));
			expect(spaces.items.length).toEqual(mockSpacesResponse.items.length);
			expect(mockSpacesService.findAll).toHaveBeenCalledWith(
				{
					status: [VisitorSpaceStatus.Active],
				},
				mockUser.id
			);
		});

		it('should throw an exception on illegal querying of INACTIVE spaces', async () => {
			let error;
			try {
				await spacesController.getSpaces(
					{ status: [VisitorSpaceStatus.Inactive] },
					new SessionUserEntity(undefined)
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual(
				'You do not have the right permissions to query this data'
			);
		});

		it('should throw an exception on illegal querying of PENDING spaces', async () => {
			let error;
			try {
				await spacesController.getSpaces(
					{ status: [VisitorSpaceStatus.Requested] },
					new SessionUserEntity(undefined)
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual(
				'You do not have the right permissions to query this data'
			);
		});
	});

	describe('getSpaceBySlug', () => {
		it('should return a space by slug', async () => {
			mockSpacesService.findBySlug.mockResolvedValueOnce(mockSpacesResponse.items[0]);
			const space = await spacesController.getSpaceBySlug(
				'huis-van-alijn',
				new SessionUserEntity(mockUser)
			);
			expect(space.id).toEqual('1');
		});

		it("should throw a not found exception for space that doesn't exist", async () => {
			mockSpacesService.findBySlug.mockResolvedValueOnce(null);

			let error;
			try {
				await spacesController.getSpaceBySlug(
					'huis-van-alijn',
					new SessionUserEntity(mockUser)
				);
			} catch (err) {
				error = err;
			}
			expect(error?.response).toEqual({
				statusCode: 404,
				message: 'Space with slug "huis-van-alijn" not found',
				error: 'Not Found',
			});
		});

		it('should throw a gone exception for space that is inactive', async () => {
			mockSpacesService.findBySlug.mockResolvedValueOnce(mockSpacesResponse.items[2]);

			try {
				await spacesController.getSpaceBySlug(
					'huis-van-alijn',
					new SessionUserEntity(mockUser)
				);
				fail('getSpaceBySlug should throw an error when the space is inactive');
			} catch (err) {
				expect(err?.response).toEqual({
					statusCode: 410,
					message: 'Space with slug "huis-van-alijn" is inactive',
					error: 'Gone',
				});
			}
		});
	});

	describe('updateSpace', () => {
		it('should update a space', async () => {
			mockSpacesService.update.mockResolvedValueOnce(mockSpacesResponse.items[0]);
			mockSpacesService.findById.mockResolvedValueOnce(mockSpacesResponse.items[0]);
			const space = await spacesController.updateSpace(
				'1',
				{},
				null,
				new SessionUserEntity(mockUser)
			);
			expect(space.id).toEqual('1');
		});

		it('can upload an image for a space', async () => {
			mockSpacesService.findById.mockResolvedValueOnce(mockSpacesResponse.items[0]);
			mockAssetsService.upload.mockResolvedValueOnce('http://image.jpg');
			mockSpacesService.update.mockResolvedValueOnce(mockSpacesResponse.items[0]);
			const space = await spacesController.updateSpace(
				'1',
				{},
				{
					fieldname: 'file',
					originalname: 'image.jpg',
					encoding: '7bit',
					mimetype: 'image/png',
					size: 6714,
					filename: 'ee1c7ce7dc5a8b49ca95fc2f62425edc',
					path: '',
					buffer: null,
					stream: null,
					destination: null,
				},
				new SessionUserEntity(mockUser)
			);
			expect(space.id).toEqual('1');
		});

		it('can delete an image when set empty', async () => {
			mockSpacesService.findById.mockResolvedValueOnce(mockSpacesResponse.items[0]);
			mockSpacesService.update.mockResolvedValueOnce(mockSpacesResponse.items[0]);
			const space = await spacesController.updateSpace(
				'1',
				{ image: '' },
				null,
				new SessionUserEntity(mockUser)
			);
			expect(space.id).toEqual('1');
		});

		it('throws an ForbiddenException when updating another maintainers space', async () => {
			mockSpacesService.findById.mockResolvedValueOnce(mockSpacesResponse.items[1]);
			mockUser.permissions.push(Permission.UPDATE_OWN_SPACE);
			let error;
			try {
				await spacesController.updateSpace('1', {}, null, new SessionUserEntity(mockUser));
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				error: 'Forbidden',
				statusCode: 403,
				message: 'You are not authorized to update this visitor space',
			});
			mockUser.permissions.pop();
		});

		it('throws an ForbiddenException when not allowed to update the slug', async () => {
			mockSpacesService.findById.mockResolvedValueOnce(mockSpacesResponse.items[0]);
			mockUser.permissions.push(Permission.UPDATE_OWN_SPACE);
			let error;
			try {
				await spacesController.updateSpace(
					'1',
					{ slug: 'forbidden' },
					null,
					new SessionUserEntity(mockUser)
				);
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				error: 'Forbidden',
				statusCode: 403,
				message: 'You are not allowed to update the slug',
			});
			mockUser.permissions.pop();
		});
	});

	describe('createSpace', () => {
		it('should create a space', async () => {
			mockAssetsService.upload.mockResolvedValueOnce('http://image.jpg');
			mockSpacesService.create.mockResolvedValueOnce({ id: '1' });
			const space = await spacesController.createSpace(
				{
					orId: 'OR-test',
					slug: 'test',
				},
				{
					fieldname: 'file',
					originalname: 'image.jpg',
					encoding: '7bit',
					mimetype: 'image/png',
					size: 6714,
					filename: 'ee1c7ce7dc5a8b49ca95fc2f62425edc',
					path: '',
					buffer: null,
					stream: null,
					destination: null,
				}
			);
			expect(space.id).toEqual('1');
		});

		it('should throw an exception if slug was not  a space', async () => {
			mockAssetsService.upload.mockResolvedValueOnce('http://image.jpg');
			mockSpacesService.create.mockResolvedValueOnce({ id: '1' });
			let error;
			try {
				await spacesController.createSpace(
					{
						orId: 'OR-test',
					},
					null
				);
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				error: 'Bad Request',
				statusCode: 400,
				message: ['slug must be a string'],
			});
		});
	});
});
