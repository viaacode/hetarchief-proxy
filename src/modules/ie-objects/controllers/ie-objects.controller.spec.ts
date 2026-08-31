import {
	ContentPagesService,
	PlayerTicketController,
	PlayerTicketService,
	TranslationsService,
} from '@meemoo/admin-core-api';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import type { IPagination } from '@studiohyperdrive/pagination';
import type { Request, Response } from 'express';
import { cloneDeep } from 'lodash';
import { type MockInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	type IeObject,
	IeObjectLicense,
	IeObjectType,
	type RelatedIeObject,
} from '../ie-objects.types';
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
import { PlayableDisplayDataService } from '../services/playable-display-data.service';

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

const mockIeObjectsService: Partial<Record<keyof IeObjectsService, MockInstance>> = {
	findAll: vi.fn(),
	findByIeObjectId: vi.fn(),
	findMetadataByIeObjectId: vi.fn(),
	getParentIeObject: vi.fn(),
	getChildIeObjects: vi.fn(),
	getSimilar: vi.fn(),
	getVisitorSpaceAccessInfoFromUser: vi.fn(() => ({
		objectIds: [],
		visitorSpaceIds: [],
	})),
	getIeObjectIdFromObjectSchemaIdentifier: vi.fn().mockResolvedValue('mock-ie-object-id'),
	getRepresentationAndFileInIeObject: vi.fn(),
};

const mockPlayableDisplayDataService: Partial<
	Record<keyof PlayableDisplayDataService, MockInstance>
> = {
	getIeObjectsPlayableDisplayData: vi.fn(),
};

const mockContentPagesService: Partial<Record<keyof ContentPagesService, MockInstance>> = {
	getContentPageBlockById: vi.fn(),
};

const mockPlayerTicketService: Partial<Record<keyof PlayerTicketService, MockInstance>> = {
	getPlayableUrl: vi.fn(),
	getBrowseUrl: vi.fn(),
	getThumbnailUrl: vi.fn(),
};

const mockPlayerTicketController: Partial<Record<keyof PlayerTicketController, MockInstance>> = {
	getPlayableUrl: vi.fn(),
	getPlayableUrlFromBrowsePath: vi.fn(),
	getPlayableUrlByExternalId: vi.fn(),
	getTicketServiceTokenForFilePath: vi.fn(),
};

const mockEventsService: Partial<Record<keyof EventsService, MockInstance>> = {
	insertEvents: vi.fn(),
	mapUserToEventData: vi.fn(),
};

const mockVisitsService: Partial<Record<keyof VisitsService, MockInstance>> = {
	hasAccess: vi.fn(),
	findAll: vi.fn(),
};

const mockOrganisationsService: Partial<Record<keyof OrganisationsService, MockInstance>> = {
	findOrganisationsBySchemaIdentifiers: vi.fn(),
};

const mockRequest = { path: '/ie-objects/export', headers: {} } as unknown as Request;

describe('IeObjectsController', () => {
	let ieObjectsController: IeObjectsController;

	beforeEach(async () => {
		process.env.CLIENT_HOST = 'fakeClientHost';

		const module: TestingModule = await Test.createTestingModule({
			controllers: [IeObjectsController],
			providers: [
				{
					provide: IeObjectsService,
					useValue: mockIeObjectsService,
				},
				{
					provide: PlayableDisplayDataService,
					useValue: mockPlayableDisplayDataService,
				},
				{
					provide: ContentPagesService,
					useValue: mockContentPagesService,
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
			vi.spyOn(ieObjectsController, 'getIeObjectsByIds').mockResolvedValueOnce([
				{
					dctermsFormat: IeObjectType.VIDEO,
					pages: [
						{
							pageNumber: 1,
							representations: [
								{
									files: [
										{
											id: 'website/id/entity/file-id',
											storedAt: '/path/to/file',
											mimeType: 'video/mp4',
										},
									],
								},
							],
						},
					],
				},
			] as Partial<IeObject>[]);
			mockPlayerTicketService.getPlayableUrl.mockResolvedValueOnce('http://playme');
			mockIeObjectsService.getRepresentationAndFileInIeObject.mockReturnValueOnce([
				{
					id: 'website/id/entity/file-id',
					storedAt: '/path/to/file',
					mimeType: 'video/mp4',
				},
				{ id: 'representation-id' },
			]);
			const url = await ieObjectsController.getPlayableUrl(
				'referer',
				'127.0.0.1',
				{
					schemaIdentifier: 'schema-id',
					fileId: 'website/id/entity/file-id',
				},
				mockSessionUser
			);
			expect(url).toEqual('http://playme');
		});

		it('should reject playable urls when the file is not part of the object', async () => {
			vi.spyOn(ieObjectsController, 'getIeObjectsByIds').mockResolvedValueOnce([
				{
					dctermsFormat: IeObjectType.VIDEO,
					pages: [
						{
							pageNumber: 1,
							representations: [
								{
									files: [
										{
											storedAt: '/path/to/other-file',
											mimeType: 'video/mp4',
										},
									],
								},
							],
						},
					],
				},
			] as Partial<IeObject>[]);

			await expect(
				ieObjectsController.getPlayableUrl(
					'referer',
					'127.0.0.1',
					{
						schemaIdentifier: 'schema-id',
						fileId: 'website/id/entity/file-id',
					},
					mockSessionUser
				)
			).rejects.toThrow(ForbiddenException);
		});

		it('should reject player-ticket requests without schemaIdentifier', async () => {
			await expect(
				ieObjectsController.getPlayableUrl(
					'referer',
					'127.0.0.1',
					{ schemaIdentifier: '', fileId: 'website/id/entity/file-id' },
					mockSessionUser
				)
			).rejects.toThrow(BadRequestException);
		});

		/**
		 * Snippet playback for the "Videoblok" content block.
		 * https://meemoo.atlassian.net/browse/ARC-3832
		 */
		describe('snippet start and end time', () => {
			// The file-level afterEach does not restore the player ticket service, so clear the
			// call history here: the rejection tests below assert it is never reached.
			beforeEach(() => {
				mockPlayerTicketService.getPlayableUrl.mockClear();
			});

			// Mocks an accessible video object containing a single file, optionally as a graph-defined
			// media fragment (the ARC-3690 path) so we can check which times win.
			const mockAccessibleVideo = (mediaFragment?: { startTime: number; endTime: number }) => {
				const file = {
					id: 'website/id/entity/file-id',
					storedAt: '/path/to/file',
					mimeType: 'video/mp4',
					mediaFragment: mediaFragment ?? null,
				};
				vi.spyOn(ieObjectsController, 'getIeObjectsByIds').mockResolvedValueOnce([
					{
						dctermsFormat: IeObjectType.VIDEO,
						pages: [{ pageNumber: 1, representations: [{ files: [file] }] }],
					},
				] as Partial<IeObject>[]);
				mockPlayerTicketService.getPlayableUrl.mockResolvedValueOnce('http://playme');
				mockIeObjectsService.getRepresentationAndFileInIeObject.mockReturnValueOnce([
					file,
					{
						id: 'representation-id',
						isMediaFragmentOf: mediaFragment ? 'website/id/entity/parent-file-id' : undefined,
					},
				]);
			};

			const getPlayableUrl = (times: { startTime?: number; endTime?: number }) =>
				ieObjectsController.getPlayableUrl(
					'referer',
					'127.0.0.1',
					{
						schemaIdentifier: 'schema-id',
						fileId: 'website/id/entity/file-id',
						...times,
					},
					mockSessionUser
				);

			it('should forward an explicitly requested snippet to the ticket service', async () => {
				mockAccessibleVideo();

				await getPlayableUrl({ startTime: 10, endTime: 25 });

				expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith(
					'/path/to/file',
					expect.objectContaining({ startTime: 10, endTime: 25 })
				);
			});

			it('should not cut a main object when no times are requested', async () => {
				mockAccessibleVideo();

				await getPlayableUrl({});

				expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith(
					'/path/to/file',
					expect.objectContaining({ startTime: undefined, endTime: undefined })
				);
			});

			it('should still use the graph media fragment when no times are requested', async () => {
				mockAccessibleVideo({ startTime: 60, endTime: 90 });

				await getPlayableUrl({});

				expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith(
					'/path/to/file',
					expect.objectContaining({ startTime: 60, endTime: 90 })
				);
			});

			it('should let a requested snippet win over the graph media fragment', async () => {
				mockAccessibleVideo({ startTime: 60, endTime: 90 });

				await getPlayableUrl({ startTime: 10, endTime: 25 });

				expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith(
					'/path/to/file',
					expect.objectContaining({ startTime: 10, endTime: 25 })
				);
			});

			// The ticket service only cuts when it gets an end time, so half a snippet would
			// silently hand out an uncut url. These must be rejected before any object is fetched.
			it('should reject a start time without an end time', async () => {
				await expect(getPlayableUrl({ startTime: 10 })).rejects.toThrow(BadRequestException);
				expect(mockPlayerTicketService.getPlayableUrl).not.toHaveBeenCalled();
			});

			it('should reject an end time without a start time', async () => {
				await expect(getPlayableUrl({ endTime: 25 })).rejects.toThrow(BadRequestException);
				expect(mockPlayerTicketService.getPlayableUrl).not.toHaveBeenCalled();
			});

			it('should reject an end time that is not after the start time', async () => {
				await expect(getPlayableUrl({ startTime: 25, endTime: 10 })).rejects.toThrow(
					BadRequestException
				);
				await expect(getPlayableUrl({ startTime: 25, endTime: 25 })).rejects.toThrow(
					BadRequestException
				);
				expect(mockPlayerTicketService.getPlayableUrl).not.toHaveBeenCalled();
			});
		});
	});

	describe('getTicketServiceTokens', () => {
		it('should reject ticket-service requests without schemaIdentifier', async () => {
			await expect(
				ieObjectsController.getTicketServiceTokens(
					'referer',
					'127.0.0.1',
					['/path/to/file'],
					'',
					mockSessionUser
				)
			).rejects.toThrow(BadRequestException);
		});

		it('should reject ticket-service requests for AV files', async () => {
			vi.spyOn(ieObjectsController, 'getIeObjectsByIds').mockResolvedValueOnce([
				{
					dctermsFormat: IeObjectType.VIDEO,
					pages: [
						{
							pageNumber: 1,
							representations: [
								{
									files: [
										{
											storedAt: '/path/to/file',
											mimeType: 'video/mp4',
										},
									],
								},
							],
						},
					],
				},
			] as Partial<IeObject>[]);

			await expect(
				ieObjectsController.getTicketServiceTokens(
					'referer',
					'127.0.0.1',
					['/path/to/file'],
					'schema-id',
					mockSessionUser
				)
			).rejects.toThrow(ForbiddenException);
		});

		it('should return ticket-service tokens for newspaper image files', async () => {
			vi.spyOn(ieObjectsController, 'getIeObjectsByIds').mockResolvedValueOnce([
				{
					dctermsFormat: IeObjectType.NEWSPAPER,
					pages: [
						{
							pageNumber: 1,
							representations: [
								{
									files: [
										{
											storedAt: 'https://iiif-qas.meemoo.be/image/3/public/newspaper.jp2',
											mimeType: 'image/jp2',
										},
									],
								},
							],
						},
					],
				},
			] as Partial<IeObject>[]);
			mockPlayerTicketController.getTicketServiceTokenForFilePath.mockResolvedValueOnce('token');

			const tokens = await ieObjectsController.getTicketServiceTokens(
				'referer',
				'127.0.0.1',
				['https://iiif-qas.meemoo.be/image/3/hetarchief/newspaper.jp2'],
				'schema-id',
				mockSessionUser
			);

			expect(tokens).toEqual(['token']);
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
				undefined,
				mockSessionUser,
				'false',
				undefined,
				undefined,
				{ path: '', params: {} } as unknown as Request
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
				await ieObjectsController.getIeObjectsByIds(
					['1'],
					undefined,
					mockSessionUser,
					'false',
					undefined,
					undefined,
					{ path: '', params: {} } as unknown as Request
				);
				fail('Expected an error to be thrown if the object does not exist');
			} catch (err) {
				expect(err.status).toEqual(403);
				expect(err.message).toContain('You do not have access to this object');
			}
		});

		it('should throw a not found exception if the object does not exist', async () => {
			mockIeObjectsService.findByIeObjectId.mockRejectedValueOnce(
				new NotFoundException(`Object IE with id '${mockIeObject1.schemaIdentifier}' not found`)
			);

			try {
				await ieObjectsController.getIeObjectsByIds(
					['1'],
					undefined,
					mockSessionUser,
					'false',
					undefined,
					undefined,
					{ path: '', params: {} } as unknown as Request
				);
				fail('Expected an error to be thrown if the object does not exist');
			} catch (err) {
				expect(err.message).toEqual('Failed to retrieve object details in getIeObjectsByIds');
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
				undefined,
				mockSessionUser,
				'true',
				'referer',
				'127.0.0.1',
				{ path: '', params: {} } as unknown as Request
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
				undefined,
				mockSessionUser,
				'true',
				'referer',
				'127.0.0.1',
				{ path: '', params: {} } as unknown as Request
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
				undefined,
				mockSessionUser,
				'true',
				'referer',
				'127.0.0.1',
				{ path: '', params: {} } as unknown as Request
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
				licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD],
			};
			mockIeObjectsService.findByIeObjectId.mockResolvedValueOnce(mockResponse);

			const result = await ieObjectsController.getIeObjectSeoById('referer', '127.0.0.1', '1', {
				path: '',
				params: {},
			} as unknown as Request);

			expect(result).toEqual({
				name: mockIeObject1.name,
				description: mockIeObject1.description,
				thumbnailUrl: 'fakeClientHost/images/og.jpg',
				maintainerSlug: 'vrt',
			});
		});

		it('should return the ieObjectSeo when object has license: PUBLIEK_METADATA_ALL', async () => {
			const mockResponse = {
				...mockIeObject1,
				licenses: [IeObjectLicense.PUBLIEK_METADATA_ALL],
			};
			mockIeObjectsService.findByIeObjectId.mockResolvedValueOnce(mockResponse);

			const result = await ieObjectsController.getIeObjectSeoById('referer', '127.0.0.1', '1', {
				path: '',
				params: {},
			} as unknown as Request);

			expect(result).toEqual({
				name: mockIeObject1.name,
				description: mockIeObject1.description,
				thumbnailUrl: 'fakeClientHost/images/og.jpg',
				maintainerSlug: 'vrt',
			});
		});

		it('should return the ieObjectSeo with thumbnail when object has license: PUBLIEK_CONTENT and PUBLIC_DOMAIN', async () => {
			const mockResponse = {
				...mockIeObject1,
				licenses: [IeObjectLicense.PUBLIEK_CONTENT, IeObjectLicense.PUBLIC_DOMAIN],
			};
			mockIeObjectsService.findByIeObjectId.mockResolvedValue(mockResponse);

			const result = await ieObjectsController.getIeObjectSeoById('referer', '127.0.0.1', '1', {
				path: '',
				params: {},
			} as unknown as Request);

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
				licenses: [IeObjectLicense.BEZOEKERTOOL_CONTENT],
			};
			mockIeObjectsService.findByIeObjectId.mockResolvedValueOnce(mockResponse);

			const result = await ieObjectsController.getIeObjectSeoById('referer', '127.0.0.1', '1', {
				path: '',
				params: {},
			} as unknown as Request);

			expect(result).toEqual({
				name: null,
				description: null,
				thumbnailUrl: 'fakeClientHost/images/og.jpg',
				maintainerSlug: 'vrt',
			});
		});
	});

	describe('exportXml', () => {
		it('should export an ieObject item as xml', async () => {
			mockIeObjectsService.findMetadataByIeObjectId.mockResolvedValueOnce(mockIeObject1);
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);

			const mockResponseObject = {
				set: vi.fn(),
				send: vi.fn(),
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
				set: vi.fn(),
				send: vi.fn(),
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

	describe('getIeObjectsPlayableDisplayData', () => {
		const blockId = 'c9c9f4b1-1a6f-4f0e-9d2e-9e5f1a2b3c4d';

		beforeEach(() => {
			mockContentPagesService.getContentPageBlockById.mockClear();
			mockPlayableDisplayDataService.getIeObjectsPlayableDisplayData.mockClear();
		});

		it('resolves the objects and cuepoints of a HETARCHIEF_VIDEO block', async () => {
			mockContentPagesService.getContentPageBlockById.mockResolvedValueOnce({
				id: blockId,
				type: 'HETARCHIEF_VIDEO',
				components: {
					mediaItem: { type: 'IE_OBJECT', value: '086348mc8s' },
					startTime: '00:01:30',
					endTime: '00:02:00',
				},
			});
			mockPlayableDisplayDataService.getIeObjectsPlayableDisplayData.mockResolvedValueOnce([null]);

			await ieObjectsController.getIeObjectsPlayableDisplayData(
				{ blockId },
				mockSessionUser,
				'referer',
				'127.0.0.1',
				mockRequest
			);

			expect(mockPlayableDisplayDataService.getIeObjectsPlayableDisplayData).toHaveBeenCalledWith(
				[{ schemaIdentifier: '086348mc8s', start: 90, end: 120 }],
				mockSessionUser,
				'referer',
				'127.0.0.1',
				mockRequest
			);
		});

		it('keeps the position of elements without an object in the response', async () => {
			mockContentPagesService.getContentPageBlockById.mockResolvedValueOnce({
				id: blockId,
				type: 'TIMELINE',
				components: {
					elements: [
						{ visualType: 'IMAGE', image: 'https://example.com/image.jpg' },
						{ visualType: 'OBJECT', mediaItem: { type: 'IE_OBJECT', value: 'qstt4fps28' } },
					],
				},
			});
			mockPlayableDisplayDataService.getIeObjectsPlayableDisplayData.mockResolvedValueOnce([
				{ schemaIdentifier: 'qstt4fps28' },
			]);

			const response = await ieObjectsController.getIeObjectsPlayableDisplayData(
				{ blockId },
				mockSessionUser,
				'referer',
				'127.0.0.1',
				mockRequest
			);

			expect(mockPlayableDisplayDataService.getIeObjectsPlayableDisplayData).toHaveBeenCalledWith(
				[{ schemaIdentifier: 'qstt4fps28' }],
				mockSessionUser,
				'referer',
				'127.0.0.1',
				mockRequest
			);
			expect(response).toEqual([null, { schemaIdentifier: 'qstt4fps28' }]);
		});

		it('throws a BadRequestException when neither blockId nor objects is given', async () => {
			await expect(
				ieObjectsController.getIeObjectsPlayableDisplayData(
					{} as any,
					mockSessionUser,
					'referer',
					'127.0.0.1',
					mockRequest
				)
			).rejects.toBeInstanceOf(BadRequestException);
		});

		it('resolves objects passed for an unsaved block for a content page editor', async () => {
			mockPlayableDisplayDataService.getIeObjectsPlayableDisplayData.mockResolvedValueOnce([null]);

			await ieObjectsController.getIeObjectsPlayableDisplayData(
				{ objects: [{ schemaIdentifier: '086348mc8s', start: 10, end: 20 }] },
				mockSessionUser,
				'referer',
				'127.0.0.1',
				mockRequest
			);

			expect(mockContentPagesService.getContentPageBlockById).not.toHaveBeenCalled();
			expect(mockPlayableDisplayDataService.getIeObjectsPlayableDisplayData).toHaveBeenCalledWith(
				[{ schemaIdentifier: '086348mc8s', start: 10, end: 20 }],
				mockSessionUser,
				'referer',
				'127.0.0.1',
				mockRequest
			);
		});

		it('strips objects passed by a user without content page edit permissions', async () => {
			const visitor = new SessionUserEntity({ ...mockUser, permissions: [] });

			const response = await ieObjectsController.getIeObjectsPlayableDisplayData(
				{ objects: [{ schemaIdentifier: '086348mc8s', start: 10, end: 20 }] },
				visitor,
				'referer',
				'127.0.0.1',
				mockRequest
			);

			expect(response).toEqual([]);
			expect(mockPlayableDisplayDataService.getIeObjectsPlayableDisplayData).toHaveBeenCalledWith(
				[],
				visitor,
				'referer',
				'127.0.0.1',
				mockRequest
			);
		});

		it('throws a BadRequestException when both blockId and objects are given', async () => {
			await expect(
				ieObjectsController.getIeObjectsPlayableDisplayData(
					{ blockId, objects: [{ schemaIdentifier: 'qstt4fps28', start: 10, end: 20 }] },
					mockSessionUser,
					'referer',
					'127.0.0.1',
					mockRequest
				)
			).rejects.toBeInstanceOf(BadRequestException);

			expect(mockContentPagesService.getContentPageBlockById).not.toHaveBeenCalled();
			expect(mockPlayableDisplayDataService.getIeObjectsPlayableDisplayData).not.toHaveBeenCalled();
		});

		it('throws a NotFoundException when no block exists with the given id', async () => {
			mockContentPagesService.getContentPageBlockById.mockResolvedValueOnce(null);

			await expect(
				ieObjectsController.getIeObjectsPlayableDisplayData(
					{ blockId },
					mockSessionUser,
					'referer',
					'127.0.0.1',
					mockRequest
				)
			).rejects.toBeInstanceOf(NotFoundException);
		});

		it('throws a BadRequestException when the block type is not supported', async () => {
			mockContentPagesService.getContentPageBlockById.mockResolvedValueOnce({
				id: blockId,
				type: 'RICH_TEXT',
				components: {},
			});

			await expect(
				ieObjectsController.getIeObjectsPlayableDisplayData(
					{ blockId },
					mockSessionUser,
					'referer',
					'127.0.0.1',
					mockRequest
				)
			).rejects.toBeInstanceOf(BadRequestException);
		});
	});
});
