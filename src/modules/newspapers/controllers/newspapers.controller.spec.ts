import { type MockInstance, beforeEach, describe, expect, it, vi } from 'vitest';
/* eslint-disable @typescript-eslint/consistent-type-imports */
// Disable consistent imports since they try to import IeObjectsQueryDto as a type
// But that breaks the endpoint body validation

import { PlayerTicketService } from '@meemoo/admin-core-api';
import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import type { Request, Response } from 'express';

import { NewspapersService } from '../services/newspapers.service';

import { NewspapersController } from './newspapers.controller';

import { EventsService } from '~modules/events/services/events.service';
import { IeObjectsController } from '~modules/ie-objects/controllers/ie-objects.controller';
import { TestingLogger } from '~shared/logging/test-logger';
import { mockConfigService } from '~shared/test/mock-config-service';

const mockNewspapersService: Partial<Record<keyof NewspapersService, MockInstance>> = {};
const mockIeObjectsController = {
	getIeObjectsByIds: vi.fn(),
};

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
					useValue: mockIeObjectsController,
				},
				{
					provide: EventsService,
					useValue: {},
				},
				{
					provide: PlayerTicketService,
					useValue: {},
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		newspapersController = module.get<NewspapersController>(NewspapersController);
	});

	it('should be defined', () => {
		expect(newspapersController).toBeDefined();
	});

	it('should reject zip downloads for non-newspaper objects', async () => {
		mockIeObjectsController.getIeObjectsByIds.mockResolvedValueOnce([
			{
				dctermsFormat: 'video',
			},
		]);

		await expect(
			newspapersController.downloadNewspaperAsZip(
				'ie-object-id',
				undefined,
				'current-page-url',
				'referer',
				'127.0.0.1',
				{ path: '/newspapers/export/zip' } as Request,
				{} as Response,
				null
			)
		).rejects.toThrow(ForbiddenException);
	});

	it('should reject selection downloads for non-newspaper objects', async () => {
		mockIeObjectsController.getIeObjectsByIds.mockResolvedValueOnce([
			{
				dctermsFormat: 'video',
			},
		]);

		await expect(
			newspapersController.downloadSelectionInPage(
				'schema-id',
				0,
				0,
				0,
				100,
				100,
				'current-page-url',
				'referer',
				'127.0.0.1',
				{ path: '/newspapers/schema-id/export/jpg/selection' } as Request,
				{} as Response,
				null
			)
		).rejects.toThrow(ForbiddenException);
	});
});
