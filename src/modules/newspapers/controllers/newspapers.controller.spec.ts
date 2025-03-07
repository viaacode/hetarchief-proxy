/* eslint-disable @typescript-eslint/consistent-type-imports */
// Disable consistent imports since they try to import IeObjectsQueryDto as a type
// But that breaks the endpoint body validation

import { type ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';

import { NewspapersService } from '../services/newspapers.service';

import { NewspapersController } from './newspapers.controller';

import { EventsService } from '~modules/events/services/events.service';
import { IeObjectsController } from '~modules/ie-objects/controllers/ie-objects.controller';
import { TestingLogger } from '~shared/logging/test-logger';

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn(),
};

const mockNewspapersService: Partial<Record<keyof NewspapersService, jest.SpyInstance>> = {};

describe('NewspapersController', () => {
	let newspapersController: NewspapersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [NewspapersController],
			imports: [],
			providers: [
				{
					provide: NewspapersService,
					useValue: mockNewspapersService,
				},
				{
					provide: IeObjectsController,
					useValue: {},
				},
				{
					provide: EventsService,
					useValue: {},
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		newspapersController = module.get<NewspapersController>(NewspapersController);
	});

	afterEach(() => {
		mockConfigService.get.mockRestore();
	});

	it('should be defined', () => {
		expect(newspapersController).toBeDefined();
	});
});
