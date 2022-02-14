import { Test, TestingModule } from '@nestjs/testing';

import cpSpace from './__mocks__/cp_space';
import { SpacesService } from './spaces.service';

import { DataService } from '~modules/data/services/data.service';

const mockDataService = {
	execute: jest.fn(),
};

describe('SpacesService', () => {
	let spacesService: SpacesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SpacesService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		}).compile();

		spacesService = module.get<SpacesService>(SpacesService);
	});

	it('services should be defined', () => {
		expect(spacesService).toBeDefined();
	});

	describe('adapt', () => {
		it('can adapt a hasura response to our space interface', () => {
			const adapted = spacesService.adapt(cpSpace);
			// test some sample keys
			expect(adapted.id).toEqual('65790f8f-6365-4891-8ce2-4563f360db89');
			expect(adapted.name).toEqual('VRT');
			expect(adapted.logo).toEqual('https://assets.viaa.be/images/OR-rf5kf25');
			expect(adapted.contactInfo.address.postalCode).toEqual('1043');
		});
	});

	describe('findAll', () => {
		it('returns a paginated response with all spaces', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_space: [
						{
							id: '1',
						},
					],
					cp_space_aggregate: {
						aggregate: {
							count: 100,
						},
					},
				},
			});
			const response = await spacesService.findAll({ query: '%%', page: 1, size: 10 });
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});
	});

	describe('findById', () => {
		it('returns a single space', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_space: [
						{
							id: '1',
						},
					],
				},
			});
			const response = await spacesService.findById('1');
			expect(response.id).toBe('1');
		});

		it('throws a notfoundexception if the space was not found', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				data: {
					cp_space: [],
				},
			});
			let error;
			try {
				await spacesService.findById('unknown-id');
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				message: 'Not Found',
				statusCode: 404,
			});
		});
	});
});
