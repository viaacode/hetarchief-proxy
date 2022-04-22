import { Test, TestingModule } from '@nestjs/testing';

import { SpacesService } from '../services/spaces.service';

import { SpacesController } from './spaces.controller';

import { Lookup_Maintainer_Visitor_Space_Status_Enum as VisitorSpaceStatus } from '~generated/graphql-db-types-hetarchief';
import { AssetsService } from '~modules/assets/services/assets.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
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
	groupId: Group.CP_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: [Permission.READ_CP_VISIT_REQUESTS],
	idp: Idp.HETARCHIEF,
};

const mockSpacesService: Partial<Record<keyof SpacesService, jest.SpyInstance>> = {
	findAll: jest.fn(),
	findById: jest.fn(),
	findSpaceByCpUserId: jest.fn(),
	getMaintainerProfiles: jest.fn(),
	findBySlug: jest.fn(),
	update: jest.fn(),
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
			expect(spaces.items.length).toEqual(2);
		});

		it('should return all spaces if no user is logged in', async () => {
			mockSpacesService.findAll.mockResolvedValueOnce(mockSpacesResponse);
			const spaces = await spacesController.getSpaces({}, new SessionUserEntity(undefined));
			expect(spaces.items.length).toEqual(2);
		});

		it('should only return active spaces if the user does not have the READ_ALL_SPACES permission', async () => {
			mockSpacesService.findAll.mockResolvedValueOnce(mockSpacesResponse);
			const spaces = await spacesController.getSpaces({}, new SessionUserEntity(mockUser));
			expect(spaces.items.length).toEqual(2);
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
	});

	describe('getSpaceBySlug', () => {
		it('should return a space by slug', async () => {
			mockSpacesService.findBySlug.mockResolvedValueOnce(mockSpacesResponse.items[0]);
			const space = await spacesController.getSpaceBySlug('huis-van-alijn');
			expect(space.id).toEqual('1');
		});

		it("should throw a not found exception for space that doesn't exist", async () => {
			mockSpacesService.findBySlug.mockResolvedValueOnce(null);

			let error;
			try {
				await spacesController.getSpaceBySlug('huis-van-alijn');
			} catch (err) {
				error = err;
			}
			expect(error?.response).toEqual({
				statusCode: 404,
				message: 'Space with slug "huis-van-alijn" not found',
				error: 'Not Found',
			});
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

		it('throws an UnauthorizedException when updating another maintainers space', async () => {
			mockSpacesService.findById.mockResolvedValueOnce(mockSpacesResponse.items[0]);
			mockUser.permissions.push(Permission.UPDATE_OWN_SPACE);
			let error;
			try {
				await spacesController.updateSpace('1', {}, null, new SessionUserEntity(mockUser));
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				error: 'Unauthorized',
				statusCode: 401,
				message: 'You are not authorized to update this visitor space',
			});
			mockUser.permissions.pop();
		});
	});
});
