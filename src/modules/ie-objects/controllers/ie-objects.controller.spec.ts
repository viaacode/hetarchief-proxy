import {
	PlayerTicketController,
	PlayerTicketService,
	TranslationsService,
} from '@meemoo/admin-core-api';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import type { IPagination } from '@studiohyperdrive/pagination';
import type { Request, Response } from 'express';
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
import type { VisitRequest } from '~modules/visits/types';
import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';
import { TestingLogger } from '~shared/logging/test-logger';
import { mockConfigService } from '~shared/test/mock-config-service';

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

const mockIeObjectsService: Partial<Record<keyof IeObjectsService, jest.SpyInstance>> = {
	findAll: jest.fn(),
	findByIeObjectId: jest.fn(),
	findMetadataByIeObjectId: jest.fn(),
	getParentIeObject: jest.fn(),
	getChildIeObjects: jest.fn(),
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

const mockRequest = { path: '/ie-objects/export', headers: {} } as unknown as Request;

describe('IeObjectsController', () => {
	let ieObjectsController: IeObjectsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [IeObjectsController],
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
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		ieObjectsController = module.get<IeObjectsController>(IeObjectsController);
	});

	afterEach(() => {
		mockVisitsService.hasAccess.mockRestore();
		mockIeObjectsService.findAll.mockRestore();
		mockIeObjectsService.getSimilar.mockRestore();
		mockIeObjectsService.getParentIeObject.mockRestore();
		mockIeObjectsService.getChildIeObjects.mockRestore();
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
				'127.0.0.1',
				null,
				mockSessionUser
			);
			expect(ieObjects.items.length).toEqual(3);
		});
	});

	describe('getPlayableUrl', () => {
		it('should return a playable url', async () => {
			mockPlayerTicketController.getPlayableUrlFromBrowsePath.mockResolvedValueOnce(
				'http://playme'
			);
			const url = await ieObjectsController.getPlayableUrl('referer', '127.0.0.1', {
				browsePath: '/path/to/file',
			});
			expect(url).toEqual('http://playme');
		});
	});

	describe('getThumbnailUrl', () => {
		it('should return a thumbnail url', async () => {
			mockPlayerTicketService.getThumbnailUrl.mockResolvedValueOnce('http://playme');
			const url = await ieObjectsController.getThumbnailUrl('referer', '127.0.0.1', {
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
			mockIeObjectsService.findByIeObjectId.mockResolvedValueOnce(mockResponse);

			const ieObjects = await ieObjectsController.getIeObjectsByIds(
				['1'],
				'referer',
				'127.0.0.1',
				mockSessionUser
			);

			expect(ieObjects[0]).toBeDefined();
		});

		it('should throw a no access exception if the object has no valid license', async () => {
			const mockResponse = {
				...mockIeObject1,
				licenses: [],
			};
			mockIeObjectsService.findByIeObjectId.mockResolvedValueOnce(mockResponse);

			try {
				await ieObjectsController.getIeObjectsByIds(['1'], 'referer', '127.0.0.1', mockSessionUser);
				fail('Expected an error to be thrown if the object does not exist');
			} catch (err) {
				expect(err.message).toEqual('You do not have access to this object');
				expect(err.status).toEqual(403);
			}
		});

		it('should throw a not found exception if the object does not exist', async () => {
			mockIeObjectsService.findByIeObjectId.mockRejectedValueOnce(
				new NotFoundException(`Object IE with id '${mockIeObject1.schemaIdentifier}' not found`)
			);

			try {
				await ieObjectsController.getIeObjectsByIds(['1'], 'referer', '127.0.0.1', mockSessionUser);
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
			mockIeObjectsService.findByIeObjectId.mockResolvedValueOnce(mockResponse);

			const ieObjects = await ieObjectsController.getIeObjectsByIds(
				['1'],
				'referer',
				'127.0.0.1',
				mockSessionUser
			);

			expect(ieObjects[0].schemaIdentifier).toEqual(mockIeObject1.schemaIdentifier);
			expect(ieObjects[0].thumbnailUrl).toBeUndefined();
			expect(ieObjects[0].pages).toBeUndefined();
			expect(ieObjects[0].mentions).toBeUndefined();
		});

		it('should return full metadata without essence if the object has no content license', async () => {
			const mockResponse = {
				...mockIeObject1,
				license: [IeObjectLicense.BEZOEKERTOOL_METADATA_ALL],
				representations: [{ name: 'test' }],
			};
			mockIeObjectsService.findByIeObjectId.mockResolvedValueOnce(mockResponse);

			const ieObjects = await ieObjectsController.getIeObjectsByIds(
				['1'],
				'referer',
				'127.0.0.1',
				mockSessionUser
			);

			expect(ieObjects[0].thumbnailUrl).toBeUndefined();
			expect(ieObjects[0].pages).toBeUndefined();
			expect(ieObjects[0].mentions).toBeUndefined();
		});

		it('should return limited metadata if licenses are ignored but the user does not have access', async () => {
			const mockResponse = {
				...mockIeObject1,
				license: [],
			};
			mockIeObjectsService.findByIeObjectId.mockResolvedValueOnce(mockResponse);

			const ieObjects = await ieObjectsController.getIeObjectsByIds(
				['1'],
				'referer',
				'127.0.0.1',
				mockSessionUser
			);

			expect(ieObjects[0].schemaIdentifier).toEqual(mockResponse.schemaIdentifier);
			expect(ieObjects[0].thumbnailUrl).toBeUndefined();
			expect(ieObjects[0].pages).toBeUndefined();
		});
	});

	describe('getIeObjectSeoById', () => {
		it('should return the ieObjectSeo when object has license: PUBLIEK_METADATA_LTD', async () => {
			const mockResponse = {
				...mockIeObject1,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.PUBLIC_DOMAIN],
			};
			mockIeObjectsService.findByIeObjectId.mockResolvedValueOnce(mockResponse);

			const result = await ieObjectsController.getIeObjectSeoById('referer', '127.0.0.1', '1');

			expect(result).toEqual({
				name: mockIeObject1.name,
				description: mockIeObject1.description,
				thumbnailUrl: 'undefined/images/og.jpg',
				maintainerSlug: 'vrt',
			});
		});

		it('should return the ieObjectSeo when object has license: PUBLIEK_CONTENT', async () => {
			const mockResponse = {
				...mockIeObject1,
				licenses: [IeObjectLicense.PUBLIEK_CONTENT, IeObjectLicense.PUBLIC_DOMAIN],
			};
			mockIeObjectsService.findByIeObjectId.mockResolvedValueOnce(mockResponse);

			const result = await ieObjectsController.getIeObjectSeoById('referer', '127.0.0.1', '1');

			expect(result).toEqual({
				name: mockIeObject1.name,
				description: mockIeObject1.description,
				thumbnailUrl: mockIeObject1.thumbnailUrl,
				maintainerSlug: 'vrt',
			});
		});

		it('should return name = null when object has no valid licence', async () => {
			const mockResponse = {
				...mockIeObject1,
				licenses: [IeObjectLicense.PUBLIC_DOMAIN],
			};
			mockIeObjectsService.findByIeObjectId.mockResolvedValueOnce(mockResponse);

			const result = await ieObjectsController.getIeObjectSeoById('referer', '127.0.0.1', '1');

			expect(result).toEqual({
				name: null,
				description: null,
				thumbnailUrl: 'undefined/images/og.jpg',
				maintainerSlug: 'vrt',
			});
		});
	});

	describe('exportXml', () => {
		it('should export an ieObject item as xml', async () => {
			mockIeObjectsService.findMetadataByIeObjectId.mockResolvedValueOnce(mockIeObject1);
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);

			const mockResponseObject = {
				set: jest.fn(),
				send: jest.fn(),
			} as unknown as Response;

			await ieObjectsController.exportXml(
				'1',
				'https://hetarchief.be/zoeken/test-maintainer-id/test-id/test-name',
				'https://hetarchief.be',
				'127.0.0.1',
				mockRequest,
				mockResponseObject,
				mockSessionUser
			);
			expect(mockResponseObject.send).toBeCalledWith(mockIeObjectWithMetadataSetLtdXml);
		});
	});

	describe('exportCsv', () => {
		it('should export an ieObject item as csv', async () => {
			mockIeObjectsService.findMetadataByIeObjectId.mockResolvedValueOnce(mockIeObject1);
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);

			const mockResponseObject = {
				set: jest.fn(),
				send: jest.fn(),
			} as unknown as Response;

			await ieObjectsController.exportCsv(
				'1',
				'https://hetarchief.be/zoeken/test-maintainer-id/test-id/test-name',
				'https://hetarchief.be',
				'127.0.0.1',
				mockRequest,
				mockResponseObject,
				mockSessionUser
			);
			expect(mockResponseObject.send).toBeCalledWith(mockIeObjectWithMetadataSetLtdCsv);
		});
	});

	describe('getRelatedIeObjects', () => {
		it('should get ieObject children', async () => {
			const mockResponse = [
				{
					...mockIeObjectWithMetadataSetALLWithEssence,
					schemaIdentifier: '1111111111',
					iri: 'https://data-int.hetarchief.be/id/entity/1111111111',
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
			mockIeObjectsService.getParentIeObject.mockResolvedValueOnce(null);
			mockIeObjectsService.getChildIeObjects.mockResolvedValueOnce(mockResponse);
			mockIeObjectsService.getVisitorSpaceAccessInfoFromUser.mockResolvedValueOnce({
				visitorSpaceIds: ['OR-test'],
				objectIds: [],
			});
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);

			const relatedIeObjects = await ieObjectsController.getRelatedIeObjects(
				'https://data-int.hetarchief.be/id/entity/99999999',
				'referer',
				'127.0.0.1',
				mockSessionUser
			);
			expect(relatedIeObjects.parent).toBeNull();

			expect(relatedIeObjects.children).toHaveLength(2);
			expect(relatedIeObjects.children[0]?.schemaIdentifier).toEqual('1111111111');
			expect(relatedIeObjects.children[1]?.schemaIdentifier).toEqual('2222222222');
		});

		it('should get related ieObject parent', async () => {
			const mockResponse = {
				...mockIeObjectWithMetadataSetALLWithEssence,
				schemaIdentifier: '9999999999',
				iri: 'https://data-int.hetarchief.be/id/entity/9999999999',
				premisIsPartOf: null,
				maintainerId: 'OR-test',
				licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL],
			} as RelatedIeObject;
			mockIeObjectsService.getParentIeObject.mockResolvedValueOnce(mockResponse);
			mockIeObjectsService.getChildIeObjects.mockResolvedValueOnce([]);
			mockIeObjectsService.getVisitorSpaceAccessInfoFromUser.mockResolvedValueOnce({
				visitorSpaceIds: ['OR-test'],
				objectIds: [],
			});
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);

			const relatedIeObjects = await ieObjectsController.getRelatedIeObjects(
				'https://data-int.hetarchief.be/id/entity/1111111111',
				'referer',
				'127.0.0.1',
				mockSessionUser
			);
			expect(relatedIeObjects.parent).toBeDefined();
			expect(relatedIeObjects.parent.schemaIdentifier).toEqual('9999999999');

			expect(relatedIeObjects.children).toHaveLength(0);
		});
	});

	describe('getSimilar', () => {
		it('should get similar ieObject items', async () => {
			mockIeObjectsService.getSimilar.mockResolvedValueOnce(getMockMediaResponse());
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);
			const ieObject = await ieObjectsController.getSimilar(
				'referer',
				'127.0.0.1',
				'1',
				{ maintainerId: '' },
				mockSessionUser
			);
			expect(ieObject.items.length).toEqual(3);
		});
	});
});
