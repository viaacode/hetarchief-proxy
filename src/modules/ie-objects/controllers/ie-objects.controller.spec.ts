import { PlayerTicketService, TranslationsService } from '@meemoo/admin-core-api';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { IPagination } from '@studiohyperdrive/pagination';
import { cloneDeep } from 'lodash';

import { IeObject, IeObjectLicense } from '../ie-objects.types';
import {
	mockIeObject,
	mockIeObjectWithMetadataSetALL,
	mockIeObjectWithMetadataSetLTD,
	mockUser,
} from '../mocks/ie-objects.mock';
import { IeObjectsService } from '../services/ie-objects.service';

import { IeObjectsController } from './ie-objects.controller';

import { EventsService } from '~modules/events/services/events.service';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { mockVisitRequest } from '~modules/visits/services/__mocks__/cp_visit';
import { VisitsService } from '~modules/visits/services/visits.service';
import { Visit } from '~modules/visits/types';
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
	findBySchemaIdentifier: jest.fn(),
	findMetadataBySchemaIdentifier: jest.fn(),
	getRelated: jest.fn(),
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

const mockEventsService: Partial<Record<keyof EventsService, jest.SpyInstance>> = {
	insertEvents: jest.fn(),
};

const mockVisitsService: Partial<Record<keyof VisitsService, jest.SpyInstance>> = {
	hasAccess: jest.fn(),
	findAll: jest.fn(),
};

const mockOrganisationsService: Partial<Record<keyof OrganisationsService, jest.SpyInstance>> = {
	findOrganisationBySchemaIdentifier: jest.fn(),
};

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
			} as IPagination<Visit>);
			mockIeObjectsService.findAll.mockResolvedValueOnce(getMockMediaResponse());
			const ieObjects = await ieObjectsController.getIeObjects(
				'referer',
				null,
				mockSessionUser
			);
			expect(ieObjects.items.length).toEqual(3);
		});
	});

	describe('getPlayableUrl', () => {
		it('should return a playable url', async () => {
			mockPlayerTicketService.getPlayableUrl.mockResolvedValueOnce('http://playme');
			const url = await ieObjectsController.getPlayableUrl('referer', { id: '1' });
			expect(url).toEqual('http://playme');
		});
	});

	describe('getThumbnailUrl', () => {
		it('should return a thumbnail url', async () => {
			mockPlayerTicketService.getThumbnailUrl.mockResolvedValueOnce('http://playme');
			const url = await ieObjectsController.getThumbnailUrl('referer', { id: '1' });
			expect(url).toEqual('http://playme');
		});
	});

	describe('getIeObjectById', () => {
		it('should return a ie object item by id', async () => {
			const mockResponse = {
				...mockIeObject,
				license: [IeObjectLicense.BEZOEKERTOOL_CONTENT],
			};
			mockIeObjectsService.findBySchemaIdentifier.mockResolvedValueOnce(mockResponse);

			const ieObject = await ieObjectsController.getIeObjectById(
				'referer',
				'1',
				mockSessionUser
			);

			expect(ieObject).toBeDefined();
		});

		it('should throw a notfound exception if the object has no valid license', async () => {
			const mockResponse = {
				...mockIeObject,
				licenses: [],
			};
			mockIeObjectsService.findBySchemaIdentifier.mockResolvedValueOnce(mockResponse);

			const object = await ieObjectsController.getIeObjectById(
				'referer',
				'1',
				mockSessionUser
			);

			expect(object).toBeNull();
		});

		it('should return limited metadata if the user no longer has access', async () => {
			const mockResponse = {
				...mockIeObject,
				license: [IeObjectLicense.BEZOEKERTOOL_METADATA_ALL],
				representations: [{ name: 'test' }],
			};
			mockIeObjectsService.findBySchemaIdentifier.mockResolvedValueOnce(mockResponse);

			const ieObject = await ieObjectsController.getIeObjectById(
				'referer',
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
			mockIeObjectsService.findBySchemaIdentifier.mockResolvedValueOnce(mockResponse);

			const ieObject = await ieObjectsController.getIeObjectById(
				'referer',
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
			mockIeObjectsService.findBySchemaIdentifier.mockResolvedValueOnce(mockResponse);

			const ieObject = await ieObjectsController.getIeObjectById(
				'referer',
				'1',
				mockSessionUser
			);

			expect(ieObject.schemaIdentifier).toEqual(mockResponse.schemaIdentifier);
			expect(ieObject.thumbnailUrl).toBeUndefined();
			expect(ieObject.representations).toBeUndefined();
		});
	});

	// TODO: rewrite tests for export
	describe('export', () => {
		// it('should export a ieObject item as xml', async () => {
		// 	mockIeObjectsService.findMetadataBySchemaIdentifier.mockResolvedValueOnce({
		// 		maintainerId: 'or-vrt',
		// 	});
		// 	mockVisitsService.hasAccess.mockResolvedValueOnce(true);
		// 	mockConfigService.get.mockReturnValueOnce(false); // Do not ignore licenses
		// 	const mockXmlResponse = '<object><schemaIdentifier>1</schemaIdentifier></object>';
		// 	convertObjectToXml.mockReturnValueOnce(mockXmlResponse);
		// 	const xml = await ieObjectsController.export('1', mockRequest, mockSessionUser);
		// 	expect(xml).toEqual(mockXmlResponse);
		// });
	});

	describe('getRelated', () => {
		it('should get related ieObject items', async () => {
			const mockResponse = { items: [{ id: 2 }, { id: 3 }] };
			mockIeObjectsService.getRelated.mockResolvedValueOnce(mockResponse);
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);

			const ieObject = await ieObjectsController.getRelated(
				'referer',
				'1',
				'8911p09j1g',
				{ maintainerId: '' },
				mockSessionUser
			);
			expect(ieObject.items.length).toEqual(2);
		});
	});

	describe('getSimilar', () => {
		it('should get similar ieObject items', async () => {
			mockIeObjectsService.getSimilar.mockResolvedValueOnce(getMockMediaResponse());
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);
			const ieObject = await ieObjectsController.getSimilar(
				'referer',
				'1',
				{ maintainerId: '' },
				mockSessionUser
			);
			expect(ieObject.items.length).toEqual(3);
		});
	});
});
