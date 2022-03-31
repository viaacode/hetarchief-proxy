import { Test, TestingModule } from '@nestjs/testing';

import { SpacesService } from '../services/spaces.service';

import { SpacesController } from './spaces.controller';

import { AssetsService } from '~modules/assets/services/assets.service';
import { Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';

const mockSpacesResponse = {
	items: [
		{
			id: '1',
			name: 'Space Mountain',
			image: 'http://assets-int.hetarchief.be/hetarchief/SPACE_IMAGE/image.jpg',
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
	email: 'test@studiohyperdrive.be',
	acceptedTosAt: '2022-02-21T14:00:00',
	permissions: [Permission.CAN_READ_CP_VISIT_REQUESTS],
	idp: Idp.HETARCHIEF,
};

const mockSpacesService: Partial<Record<keyof SpacesService, jest.SpyInstance>> = {
	findAll: jest.fn(),
	findById: jest.fn(),
	update: jest.fn(),
	findSpaceByCpUserId: jest.fn(),
	getMaintainerProfiles: jest.fn(),
	findBySlug: jest.fn(),
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
		}).compile();

		spacesController = module.get<SpacesController>(SpacesController);
	});

	it('should be defined', () => {
		expect(spacesController).toBeDefined();
	});

	describe('getSpaces', () => {
		it('should return all spaces', async () => {
			mockSpacesService.findAll.mockResolvedValueOnce(mockSpacesResponse);
			const spaces = await spacesController.getSpaces(null, mockUser);
			expect(spaces.items.length).toEqual(2);
		});

		it('should return all spaces if no user is logged in', async () => {
			mockSpacesService.findAll.mockResolvedValueOnce(mockSpacesResponse);
			const spaces = await spacesController.getSpaces(null, undefined);
			expect(spaces.items.length).toEqual(2);
		});
	});

	describe('getSpaceById', () => {
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
			const space = await spacesController.updateSpace('1', {}, null);
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
				}
			);
			expect(space.id).toEqual('1');
		});

		it('can delete an image when set empty', async () => {
			mockSpacesService.findById.mockResolvedValueOnce(mockSpacesResponse.items[0]);
			mockSpacesService.update.mockResolvedValueOnce(mockSpacesResponse.items[0]);
			const space = await spacesController.updateSpace('1', { image: '' }, null);
			expect(space.id).toEqual('1');
		});
	});
});
