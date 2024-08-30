import {
	PlayerTicketController,
	PlayerTicketService,
	TranslationsService,
} from '@meemoo/admin-core-api';
import { NotFoundException } from '@nestjs/common';
import { type ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { type IPagination } from '@studiohyperdrive/pagination';
import { type Request, type Response } from 'express';
import { cloneDeep } from 'lodash';

import { type IeObject, IeObjectLicense, type RelatedIeObject } from '../ie-objects.types';
import {
	mockIeObject1,
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
import { type VisitRequest } from '~modules/visits/types';
import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';
import { TestingLogger } from '~shared/logging/test-logger';

// Use function to return object to avoid cross contaminating the tests. Always a fresh object
const getMockMediaResponse = (): IPagination<Partial<IeObject>> =>
	cloneDeep({
		items: [mockIeObject1, mockIeObjectWithMetadataSetLTD, mockIeObjectWithMetadataSetALL],
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
	getRelatedIeObjects: jest.fn(),
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
		mockIeObjectsService.getRelatedIeObjects.mockRestore();
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
				...mockIeObject1,
				license: [IeObjectLicense.BEZOEKERTOOL_CONTENT],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			const ieObject = await ieObjectsController.getIeObjectById(
				'1',
				'referer',
				mockRequest,
				mockSessionUser
			);

			expect(ieObject).toBeDefined();
		});

		it('should throw a no access exception if the object has no valid license', async () => {
			const mockResponse = {
				...mockIeObject1,
				licenses: [],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			try {
				await ieObjectsController.getIeObjectById(
					'1',
					'referer',
					mockRequest,
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
					`Object IE with id '${mockIeObject1.schemaIdentifier}' not found`
				)
			);

			try {
				await ieObjectsController.getIeObjectById(
					'1',
					'referer',
					mockRequest,
					mockSessionUser
				);
				fail('Expected an error to be thrown if the object does not exist');
			} catch (err) {
				expect(err.message).toEqual(
					`Object IE with id '${mockIeObject1.schemaIdentifier}' not found`
				);
				expect(err.status).toEqual(404);
			}
		});

		it('should return limited metadata if the user no longer has access', async () => {
			const mockResponse = {
				...mockIeObject1,
				license: [IeObjectLicense.BEZOEKERTOOL_METADATA_ALL],
				representations: [{ name: 'test' }],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			const ieObject = await ieObjectsController.getIeObjectById(
				'1',
				'referer',
				mockRequest,
				mockSessionUser
			);

			expect(ieObject.schemaIdentifier).toEqual(mockIeObject1.schemaIdentifier);
			expect(ieObject.thumbnailUrl).toBeUndefined();
			expect(ieObject.pageRepresentations).toBeUndefined();
		});

		it('should return full metadata without essence if the object has no content license', async () => {
			const mockResponse = {
				...mockIeObject1,
				license: [IeObjectLicense.BEZOEKERTOOL_METADATA_ALL],
				representations: [{ name: 'test' }],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			const ieObject = await ieObjectsController.getIeObjectById(
				'1',
				'referer',
				mockRequest,
				mockSessionUser
			);

			expect(ieObject.pageRepresentations).toBeUndefined();
		});

		it('should return limited metadata if licenses are ignored but the user does not have access', async () => {
			const mockResponse = {
				...mockIeObject1,
				license: [],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			const ieObject = await ieObjectsController.getIeObjectById(
				'1',
				'referer',
				mockRequest,
				mockSessionUser
			);

			expect(ieObject.schemaIdentifier).toEqual(mockResponse.schemaIdentifier);
			expect(ieObject.thumbnailUrl).toBeUndefined();
			expect(ieObject.pageRepresentations).toBeUndefined();
		});
	});

	describe('getIeObjectSeoById', () => {
		it('should return the ieObjectSeo when object has license: PUBLIEK_METADATA_LTD', async () => {
			const mockResponse = {
				...mockIeObject1,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			const result = await ieObjectsController.getIeObjectSeoById(
				'referer',
				mockRequest,
				'1'
			);

			expect(result).toEqual({
				name: mockIeObject1.name,
				description: mockIeObject1.description,
				thumbnailUrl: null,
			});
		});

		it('should return the ieObjectSeo when object has license: PUBLIEK_METADATA_ALL', async () => {
			const mockResponse = {
				...mockIeObject1,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL],
			};
			mockIeObjectsService.findBySchemaIdentifiers.mockResolvedValueOnce([mockResponse]);

			const result = await ieObjectsController.getIeObjectSeoById(
				'referer',
				mockRequest,
				'1'
			);

			expect(result).toEqual({
				name: mockIeObject1.name,
				description: mockIeObject1.description,
				thumbnailUrl: mockIeObject1.thumbnailUrl,
			});
		});

		it('should return name = null when object has no valid licence', async () => {
			const mockResponse = {
				...mockIeObject1,
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
			mockIeObjectsService.findMetadataBySchemaIdentifier.mockResolvedValueOnce(
				mockIeObject1
			);
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
			mockIeObjectsService.findMetadataBySchemaIdentifier.mockResolvedValueOnce(
				mockIeObject1
			);
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

	describe('getRelatedIeObjects', () => {
		it('should get related ieObject children items', async () => {
			const mockResponse = [
				{
					...mockIeObjectWithMetadataSetALLWithEssence,
					schemaIdentifier: '1111111111',
					iri: 'https://data-int.hetarchief.be/id/entity/1111111111',
					premisIsPartOf: 'https://data-int.hetarchief.be/id/entity/99999999',
					maintainerId: 'OR-test',
					licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL],
				},
				{
					...mockIeObjectWithMetadataSetALLWithEssence,
					schemaIdentifier: '2222222222',
					iri: 'https://data-int.hetarchief.be/id/entity/2222222222',
					premisIsPartOf: 'https://data-int.hetarchief.be/id/entity/99999999',
					maintainerId: 'OR-test',
					licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL],
				},
			] as RelatedIeObject[];
			mockIeObjectsService.getRelatedIeObjects.mockResolvedValueOnce(mockResponse);
			mockIeObjectsService.getVisitorSpaceAccessInfoFromUser.mockResolvedValueOnce({
				visitorSpaceIds: ['OR-test'],
				objectIds: [],
			});
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);

			const relatedIeObjects = await ieObjectsController.getRelatedIeObjects(
				'https://data-int.hetarchief.be/id/entity/99999999',
				null,
				'referer',
				mockRequest,
				mockSessionUser
			);
			expect(relatedIeObjects.parent).toBeNull();

			expect(relatedIeObjects.children).toHaveLength(2);
			expect(relatedIeObjects.children[0]?.schemaIdentifier).toEqual('1111111111');
			expect(relatedIeObjects.children[1]?.schemaIdentifier).toEqual('2222222222');
		});

		it('should get related ieObject parent and sibling', async () => {
			const mockResponse = [
				{
					...mockIeObjectWithMetadataSetALLWithEssence,
					schemaIdentifier: '9999999999',
					iri: 'https://data-int.hetarchief.be/id/entity/9999999999',
					premisIsPartOf: null,
					maintainerId: 'OR-test',
					licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL],
				},
				{
					...mockIeObjectWithMetadataSetALLWithEssence,
					schemaIdentifier: '2222222222',
					iri: 'https://data-int.hetarchief.be/id/entity/2222222222',
					premisIsPartOf: 'https://data-int.hetarchief.be/id/entity/9999999999',
					maintainerId: 'OR-test',
					licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL],
				},
			] as RelatedIeObject[];
			mockIeObjectsService.getRelatedIeObjects.mockResolvedValueOnce(mockResponse);
			mockIeObjectsService.getVisitorSpaceAccessInfoFromUser.mockResolvedValueOnce({
				visitorSpaceIds: ['OR-test'],
				objectIds: [],
			});
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);

			const relatedIeObjects = await ieObjectsController.getRelatedIeObjects(
				'https://data-int.hetarchief.be/id/entity/1111111111',
				'https://data-int.hetarchief.be/id/entity/9999999999',
				'referer',
				mockRequest,
				mockSessionUser
			);
			expect(relatedIeObjects.parent).toBeDefined();
			expect(relatedIeObjects.parent.schemaIdentifier).toEqual('9999999999');

			expect(relatedIeObjects.children).toHaveLength(1);
			expect(relatedIeObjects.children[0].schemaIdentifier).toEqual('2222222222');
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
