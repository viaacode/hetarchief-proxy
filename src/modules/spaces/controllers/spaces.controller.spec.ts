import { Test, TestingModule } from '@nestjs/testing';

import { SpacesService } from '../services/spaces.service';

import { SpacesController } from './spaces.controller';

import { Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';

const mockSpacesResponse = {
	items: [
		{
			id: '1',
			name: 'Space Mountain',
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
	permissions: [Permission.CAN_READ_CP_VISIT_REQUESTS],
	idp: Idp.HETARCHIEF,
};

const mockSpacesService: Partial<Record<keyof SpacesService, jest.SpyInstance>> = {
	findAll: jest.fn(),
	findById: jest.fn(),
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
		it('should return a space by id', async () => {
			mockSpacesService.findById.mockResolvedValueOnce(mockSpacesResponse.items[0]);
			const space = await spacesController.getSpaceById('1');
			expect(space.id).toEqual('1');
		});

		it("should throw a not found exception for space that doesn't exist", async () => {
			mockSpacesService.findById.mockResolvedValueOnce(null);

			let error;
			try {
				await spacesController.getSpaceById('1');
			} catch (err) {
				error = err;
			}
			expect(error?.response).toEqual({
				statusCode: 404,
				message: 'Space with id 1 not found',
				error: 'Not Found',
			});
		});
	});
});
