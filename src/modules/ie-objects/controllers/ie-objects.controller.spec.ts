import {
	PlayerTicketController,
	PlayerTicketService,
	TranslationsService,
} from '@meemoo/admin-core-api';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { IPagination } from '@studiohyperdrive/pagination';
import { Request, Response } from 'express';
import { cloneDeep } from 'lodash';

import { IeObject, IeObjectLicense } from '../ie-objects.types';
import {
	mockIeObject,
	mockIeObjectWithMetadataSetALL,
	mockIeObjectWithMetadataSetALLWithEssence,
	mockIeObjectWithMetadataSetLTD,
	mockIeObjectWithMetadataSetLtdCsv,
	mockIeObjectWithMetadataSetLtdXml,
	mockUser,
} from '../mocks/ie-objects.mock';
import { IeObjectsService } from '../services/ie-objects.service';

import { IeObjectsController } from './ie-objects.controller';

import { EventsService } from '~modules/events/services/events.service';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { mockVisitRequest } from '~modules/visits/services/__mocks__/cp_visit';
import { VisitsService } from '~modules/visits/services/visits.service';
import { VisitRequest } from '~modules/visits/types';
import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';
import { TestingLogger } from '~shared/logging/test-logger';

// Use function to return object to avoid cross contaminating the tests. Always a fresh object
const getMockMediaResponse = (): IPagination<Partial<IeObject>> =>
	cloneDeep({
		items: [mockIeObject, mockIeObjectWithMetadataSetLTD, mockIeObjectWithMetadataSetALL],
		page: 1,
		size: 3,
		total: 3,
		pages: 1,
	});

const mockSessionUser: SessionUserEntity = new SessionUserEntity(mockUser);

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn(),
};

const mockIeObjectsService: Partial<Record<keyof IeObjectsService, jest.SpyInstance>> = {
	findAll: jest.fn(),
	findBySchemaIdentifiers: jest.fn(),
	findMetadataBySchemaIdentifier: jest.fn(),
	getRelated: jest.fn(),
	countRelated: jest.fn(),
	getSimilar: jest.fn(),
	getVisitorSpaceAccessInfoFromUser: jest.fn(() => ({
		objectIds: [],
		visitorSpaceIds: [],
	})),
};

const mockPlayerTicketService: Partial<Record<keyof PlayerTicketService, jest.SpyInstance>> = {
	getPlayableUrl: jest.fn(),
	getEmbedUrl: jest.fn(),
	getThumbnailUrl: jest.fn(),
};

const mockPlayerTicketController: Partial<Record<keyof PlayerTicketController, jest.SpyInstance>> =
	{
		getPlayableUrl: jest.fn(),
		getPlayableUrlFromBrowsePath: jest.fn(),
		getPlayableUrlByExternalId: jest.fn(),
	};

const mockEventsService: Partial<Record<keyof EventsService, jest.SpyInstance>> = {
	insertEvents: jest.fn(),
};

const mockVisitsService: Partial<Record<keyof VisitsService, jest.SpyInstance>> = {
	hasAccess: jest.fn(),
	findAll: jest.fn(),
};

const mockOrganisationsService: Partial<Record<keyof OrganisationsService, jest.SpyInstance>> = {
	findOrganisationsBySchemaIdentifiers: jest.fn(),
};

const mockResponseObject = {
	set: jest.fn(),
	send: jest.fn(),
} as unknown as Response;

const mockRequest = { path: '/ie-objects/export', headers: {} } as unknown as Request;

describe('IeObjectsController', () => {
	let ieObjectsController: IeObjectsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [IeObjectsController],
			imports: [],
			providers: [
				{
					provide: IeObjectsService,
					useValue: mockIeObjectsService,
				},
				{
					provide: PlayerTicketService,
					useValue: mockPlayerTicketService,
				},
				{
					provide: PlayerTicketController,
					useValue: mockPlayerTicketController,
				},
				{
					provide: EventsService,
					useValue: mockEventsService,
				},
				{
					provide: VisitsService,
					useValue: mockVisitsService,
				},
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
				{
					provide: OrganisationsService,
					useValue: mockOrganisationsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		ieObjectsController = module.get<IeObjectsController>(IeObjectsController);
	});

	afterEach(() => {
		mockConfigService.get.mockRestore();
		mockVisitsService.hasAccess.mockRestore();
		mockIeObjectsService.findAll.mockRestore();
		mockIeObjectsService.getSimilar.mockRestore();
		mockIeObjectsService.getRelated.mockRestore();
		mockIeObjectsService.countRelated.mockRestore();
	});

	it('should be defined', () => {
		expect(ieObjectsController).toBeDefined();
	});

	describe('getIeObjects', () => {
		it('should return all ie objects items', async () => {
			mockVisitsService.findAll.mockResolvedValue({
				items: [mockVisitRequest],
				page: 1,
				size: 1,
				total: 1,
				pages: 1,
			} as IPagination<VisitRequest>);
			mockIeObjectsService.findAll.mockResolvedValueOnce(getMockMediaResponse());
			const ieObjects = await ieObjectsController.getIeObjects(
				'referer',
				null,
				mockSessionUser,
				mockRequest
			);
			expect(ieObjects.items.length).toEqual(3);
		});
	});

	describe('getPlayableUrl', () => {
		it('should return a playable url', async () => {
			mockPlayerTicketController.getPlayableUrlFromBrowsePath.mockResolvedValueOnce(
				'http://playme'
			);
			const url = await ieObjectsController.getPlayableUrl('referer', mockRequest, {
				schemaIdentifier: '1',
			});
			expect(url).toEqual('http://playme');
		});
	});

	describe('getThumbnailUrl', () => {
		it('should return a thumbnail url', async () => {
			mockPlayerTicketService.getThumbnailUrl.mockResolvedValueOnce('http://playme');
			const url = await ieObjectsController.getThumbnailUrl('referer', mockRequest, {
				id: '1',
			});
			expect(url).toEqual('http://playme');
		});
	});

	describe('getIeObjectById', () => {
		it('should return a ie object item by id', async () => {
			const mockResponse = {
				...mockIeObject,
				license: [IeObjectLicense.BEZOEKERTOOL_CONTENT],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			const ieObject = await ieObjectsController.getIeObjectById(
				'referer',
				mockRequest,
				'1',
				mockSessionUser
			);

			expect(ieObject).toBeDefined();
		});

		it('should throw a no access exception if the object has no valid license', async () => {
			const mockResponse = {
				...mockIeObject,
				licenses: [],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			try {
				await ieObjectsController.getIeObjectById(
					'referer',
					mockRequest,
					'1',
					mockSessionUser
				);
				fail('Expected an error to be thrown if the object does not exist');
			} catch (err) {
				expect(err.message).toEqual('You do not have access to this object');
				expect(err.status).toEqual(403);
			}
		});

		it('should throw a not found exception if the object does not exist', async () => {
			mockIeObjectsService.findBySchemaIdentifiers.mockRejectedValueOnce(
				new NotFoundException(
					`Object IE with id '${mockIeObject.schemaIdentifier}' not found`
				)
			);

			try {
				await ieObjectsController.getIeObjectById(
					'referer',
					mockRequest,
					'1',
					mockSessionUser
				);
				fail('Expected an error to be thrown if the object does not exist');
			} catch (err) {
				expect(err.message).toEqual(
					`Object IE with id '${mockIeObject.schemaIdentifier}' not found`
				);
				expect(err.status).toEqual(404);
			}
		});

		it('should return limited metadata if the user no longer has access', async () => {
			const mockResponse = {
				...mockIeObject,
				license: [IeObjectLicense.BEZOEKERTOOL_METADATA_ALL],
				representations: [{ name: 'test' }],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			const ieObject = await ieObjectsController.getIeObjectById(
				'referer',
				mockRequest,
				'1',
				mockSessionUser
			);

			expect(ieObject.schemaIdentifier).toEqual(mockIeObject.schemaIdentifier);
			expect(ieObject.thumbnailUrl).toBeUndefined();
			expect(ieObject.representations).toBeUndefined();
		});

		it('should return full metadata without essence if the object has no content license', async () => {
			const mockResponse = {
				...mockIeObject,
				license: [IeObjectLicense.BEZOEKERTOOL_METADATA_ALL],
				representations: [{ name: 'test' }],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			const ieObject = await ieObjectsController.getIeObjectById(
				'referer',
				mockRequest,
				'1',
				mockSessionUser
			);

			expect(ieObject.representations).toBeUndefined();
		});

		it('should return limited metadata if licenses are ignored but the user does not have access', async () => {
			const mockResponse = {
				...mockIeObject,
				license: [],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			const ieObject = await ieObjectsController.getIeObjectById(
				'referer',
				mockRequest,
				'1',
				mockSessionUser
			);

			expect(ieObject.schemaIdentifier).toEqual(mockResponse.schemaIdentifier);
			expect(ieObject.thumbnailUrl).toBeUndefined();
			expect(ieObject.representations).toBeUndefined();
		});
	});

	describe('getIeObjectSeoById', () => {
		it('should return the ieObjectSeo when object has license: PUBLIEK_METADATA_LTD', async () => {
			const mockResponse = {
				...mockIeObject,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			const result = await ieObjectsController.getIeObjectSeoById(
				'referer',
				mockRequest,
				'1'
			);

			expect(result).toEqual({
				name: mockIeObject.name,
				description: mockIeObject.description,
				thumbnailUrl: null,
			});
		});

		it('should return the ieObjectSeo when object has license: PUBLIEK_METADATA_ALL', async () => {
			const mockResponse = {
				...mockIeObject,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			const result = await ieObjectsController.getIeObjectSeoById(
				'referer',
				mockRequest,
				'1'
			);

			expect(result).toEqual({
				name: mockIeObject.name,
				description: mockIeObject.description,
				thumbnailUrl: mockIeObject.thumbnailUrl,
			});
		});

		it('should return name = null when object has no valid licence', async () => {
			const mockResponse = {
				...mockIeObject,
				licenses: [IeObjectLicense.BEZOEKERTOOL_CONTENT],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			const result = await ieObjectsController.getIeObjectSeoById(
				'referer',
				mockRequest,
				'1'
			);

			expect(result).toEqual({
				name: null,
				description: null,
				thumbnailUrl: null,
			});
		});
	});

	describe('exportXml', () => {
		it('should export an ieObject item as xml', async () => {
			mockIeObjectsService.findMetadataBySchemaIdentifier.mockResolvedValueOnce(mockIeObject);
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);
			mockConfigService.get.mockReturnValueOnce(false); // Do not ignore licenses

			await ieObjectsController.exportXml(
				'1',
				mockRequest,
				mockResponseObject,
				mockSessionUser
			);
			expect(mockResponseObject.send).toBeCalledWith(mockIeObjectWithMetadataSetLtdXml);
		});
	});

	describe('exportCsv', () => {
		it('should export an ieObject item as csv', async () => {
			mockIeObjectsService.findMetadataBySchemaIdentifier.mockResolvedValueOnce(mockIeObject);
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);
			mockConfigService.get.mockReturnValueOnce(false); // Do not ignore licenses

			await ieObjectsController.exportCsv(
				'1',
				mockRequest,
				mockResponseObject,
				mockSessionUser
			);
			expect(mockResponseObject.send).toBeCalledWith(mockIeObjectWithMetadataSetLtdCsv);
		});
	});

	describe('getRelated', () => {
		it('should get related ieObject items', async () => {
			const mockResponse = {
				items: [
					{
						...mockIeObjectWithMetadataSetALLWithEssence,
						schemaIdentifier: '2',
						maintainerId: 'OR-test',
						licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL],
					},
					{
						...mockIeObjectWithMetadataSetALLWithEssence,
						schemaIdentifier: '3',
						maintainerId: 'OR-test',
						licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL],
					},
				] as IeObject[],
			};
			mockIeObjectsService.getRelated.mockResolvedValueOnce(mockResponse);
			mockIeObjectsService.getVisitorSpaceAccessInfoFromUser.mockResolvedValueOnce({
				visitorSpaceIds: ['OR-test'],
				objectIds: [],
			});
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);

			const ieObject = await ieObjectsController.getRelated(
				'referer',
				mockRequest,
				'1',
				'8911p09j1g',
				{ maintainerId: '' },
				mockSessionUser
			);
			expect(ieObject.items.length).toEqual(2);
		});
	});
	describe('countRelated', () => {
		it('should get the number of related ieObject items', async () => {
			mockIeObjectsService.countRelated.mockResolvedValueOnce({});

			const result = await ieObjectsController.countRelated({
				meemooIdentifiers: ['1', '2', '3'],
			});

			expect(result).toEqual({});
		});
	});

	describe('getSimilar', () => {
		it('should get similar ieObject items', async () => {
			mockIeObjectsService.getSimilar.mockResolvedValueOnce(getMockMediaResponse());
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);
			const ieObject = await ieObjectsController.getSimilar(
				'referer',
				mockRequest,
				'1',
				{ maintainerId: '' },
				mockSessionUser
			);
			expect(ieObject.items.length).toEqual(3);
		});
	});
});
