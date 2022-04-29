import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { MediaService } from '../services/media.service';
import { MediaFormat, Operator, SearchFilterField } from '../types';

import { MediaController } from './media.controller';

import { PlayerTicketService } from '~modules/admin/player-ticket/services/player-ticket.service';
import { EventsService } from '~modules/events/services/events.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Group, GroupIdToName, Permission } from '~modules/users/types';
import { VisitsService } from '~modules/visits/services/visits.service';
import { Idp } from '~shared/auth/auth.types';
import { TestingLogger } from '~shared/logging/test-logger';

// Use function to return object to avoid cross contaminating the tests. Always a fresh object
const getMockMediaResponse = () => ({
	hits: {
		total: {
			value: 2,
		},
		hits: [
			{
				_id: '4f1mg9x363',
				schema_name: 'Op de boerderij',
			},
			{
				_id: '8911p09j1g',
				schema_name: 'Durf te vragen R002 A0001',
			},
		],
	},
});

const mockRequest = { path: '/media', headers: {} } as unknown as Request;

const mockUser = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: Group.CP_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: [Permission.EDIT_ANY_CONTENT_PAGES],
};

const mockSessionUser: SessionUserEntity = new SessionUserEntity(mockUser);

const mockConfigService: Partial<Record<keyof ConfigService, jest.SpyInstance>> = {
	get: jest.fn(),
};

const mockMediaService: Partial<Record<keyof MediaService, jest.SpyInstance>> = {
	findAll: jest.fn(),
	findBySchemaIdentifier: jest.fn(),
	findMetadataBySchemaIdentifier: jest.fn(),
	convertObjectToXml: jest.fn(),
	getRelated: jest.fn(),
	getSimilar: jest.fn(),
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
};

describe('MediaController', () => {
	let mediaController: MediaController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [MediaController],
			imports: [],
			providers: [
				{
					provide: MediaService,
					useValue: mockMediaService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
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
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		mediaController = module.get<MediaController>(MediaController);
	});

	afterEach(() => {
		mockVisitsService.hasAccess.mockRestore();
		mockMediaService.findAll.mockRestore();
		mockMediaService.getSimilar.mockRestore();
		mockMediaService.getRelated.mockRestore();
	});

	it('should be defined', () => {
		expect(mediaController).toBeDefined();
	});

	describe('getMedia', () => {
		it('should throw a Forbidden exception on production environment', async () => {
			mockConfigService.get.mockReturnValueOnce('production');
			let error;
			try {
				await mediaController.getMedia('referer', null);
			} catch (e) {
				error = e;
			}
			expect(error.response.message).toEqual('Forbidden');
			expect(error.response.statusCode).toEqual(403);
		});

		it('should return all media items', async () => {
			mockMediaService.findAll.mockResolvedValueOnce(getMockMediaResponse());
			const media = await mediaController.getMedia('referer', null);
			expect(media.hits.total.value).toEqual(2);
			expect(media.hits.hits.length).toEqual(2);
		});
	});

	describe('getPlayableUrl', () => {
		it('should return a playable url', async () => {
			mockPlayerTicketService.getPlayableUrl.mockResolvedValueOnce('http://playme');
			const url = await mediaController.getPlayableUrl('referer', { id: '1' });
			expect(url).toEqual('http://playme');
		});
	});

	describe('getThumbnailUrl', () => {
		it('should return a thumbnail url', async () => {
			mockPlayerTicketService.getThumbnailUrl.mockResolvedValueOnce('http://playme');
			const url = await mediaController.getThumbnailUrl('referer', { id: '1' });
			expect(url).toEqual('http://playme');
		});
	});

	describe('getMediaById', () => {
		it('should return a media item by id', async () => {
			const mockResponse = getMockMediaResponse();
			mockResponse.hits.total.value = 1;
			mockResponse.hits.hits.shift();
			mockMediaService.findBySchemaIdentifier.mockResolvedValueOnce(mockResponse);
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);
			const media = await mediaController.getMediaById('referer', '1', mockSessionUser);
			expect(media).toBeDefined();
		});

		it('should throw forbidden exception if user has no longer access', async () => {
			const mockResponse = getMockMediaResponse();
			mockResponse.hits.total.value = 1;
			mockResponse.hits.hits.shift();
			mockMediaService.findBySchemaIdentifier.mockResolvedValueOnce(mockResponse);
			mockVisitsService.hasAccess.mockResolvedValueOnce(false);

			let error: any;
			try {
				await mediaController.getMediaById('referer', '1', mockSessionUser);
			} catch (err) {
				error = err;
			}
			expect(error.response.message).toEqual('You do not have access to this visitor space');
		});
	});

	describe('export', () => {
		it('should export a media item as xml', async () => {
			mockMediaService.findMetadataBySchemaIdentifier.mockResolvedValueOnce({
				maintainerId: 'or-vrt',
			});
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);

			const mockXmlResponse = '<object><schemaIdentifier>1</schemaIdentifier></object>';
			mockMediaService.convertObjectToXml.mockReturnValueOnce(mockXmlResponse);
			const xml = await mediaController.export('1', mockRequest, mockSessionUser);
			expect(xml).toEqual(mockXmlResponse);
		});

		it('should throw forbidden exception if user has no longer access', async () => {
			mockMediaService.findMetadataBySchemaIdentifier.mockResolvedValueOnce({
				maintainerId: 'or-vrt',
			});
			mockVisitsService.hasAccess.mockResolvedValueOnce(false);

			let error: any;
			try {
				await mediaController.export('1', mockRequest, mockSessionUser);
			} catch (err) {
				error = err;
			}
			expect(error.response.message).toEqual(
				'You do not have access to the visitor space of this object'
			);
		});
	});

	describe('getRelated', () => {
		it('should get related media items', async () => {
			const mockResponse = { items: [{ id: 2 }, { id: 3 }] };
			mockMediaService.getRelated.mockResolvedValueOnce(mockResponse);
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);
			const media = await mediaController.getRelated(
				'referer',
				'es-index-1',
				'1',
				'8911p09j1g',
				mockSessionUser
			);
			expect(media.items.length).toEqual(2);
		});

		it('should throw forbidden exception if user has no longer access', async () => {
			mockVisitsService.hasAccess.mockResolvedValueOnce(false);

			let error: any;
			try {
				await mediaController.getRelated(
					'referer',
					'es-index-1',
					'1',
					'8911p09j1g',
					mockSessionUser
				);
			} catch (err) {
				error = err;
			}
			expect(error.response.message).toEqual('You do not have access to this visitor space');
		});
	});

	describe('getSimilar', () => {
		it('should get similar media items', async () => {
			mockMediaService.getSimilar.mockResolvedValueOnce(getMockMediaResponse());
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);
			const media = await mediaController.getSimilar(
				'referer',
				'1',
				'or-rf5kf25',
				mockSessionUser
			);
			expect(media.hits.hits.length).toEqual(2);
		});

		it('should throw forbidden exception if user has no longer access', async () => {
			mockVisitsService.hasAccess.mockResolvedValueOnce(false);

			let error: any;
			try {
				await mediaController.getSimilar('referer', '1', 'or-rf5kf25', mockSessionUser);
			} catch (err) {
				error = err;
			}
			expect(error.response.message).toEqual('You do not have access to this visitor space');
		});
	});

	describe('getMediaOnIndex', () => {
		it('should return all media items in a specific index', async () => {
			mockMediaService.findAll.mockResolvedValueOnce(getMockMediaResponse());
			mockVisitsService.hasAccess.mockResolvedValueOnce(true);
			const media = await mediaController.getMediaOnIndex(
				'referer',
				{ filters: [] },
				'test-index',
				mockSessionUser
			);
			expect(media.hits.total.value).toEqual(2);
			expect(media.hits.hits.length).toEqual(2);
		});

		it('should throw forbidden exception if user does not have an active visit request', async () => {
			mockMediaService.findAll.mockResolvedValueOnce(getMockMediaResponse());
			mockVisitsService.hasAccess.mockResolvedValueOnce(false);

			let error: any;
			try {
				await mediaController.getMediaOnIndex(
					'referer',
					{ filters: [] },
					'test-index',
					mockSessionUser
				);
			} catch (err) {
				error = err;
			}
			expect(error.response.message).toEqual('You do not have access to this visitor space');
		});

		it('should return media objects if user is the cp admin of the space', async () => {
			mockMediaService.findAll.mockResolvedValueOnce(getMockMediaResponse());
			mockVisitsService.hasAccess.mockResolvedValueOnce(false);
			const media = await mediaController.getMediaOnIndex(
				'referer',
				{ filters: [] },
				'or-id-maintainer-1',
				new SessionUserEntity({
					...mockUser,
					maintainerId: 'or-id-maintainer-1',
				})
			);
			expect(media.hits.total.value).toEqual(2);
			expect(media.hits.hits.length).toEqual(2);
		});

		it('should return media objects if user is a meemoo admin', async () => {
			mockMediaService.findAll.mockResolvedValueOnce(getMockMediaResponse());
			mockVisitsService.hasAccess.mockResolvedValueOnce(false);
			const media = await mediaController.getMediaOnIndex(
				'referer',
				{ filters: [] },
				'or-id-maintainer-1',
				new SessionUserEntity({
					...mockUser,
					permissions: [Permission.SEARCH_ALL_OBJECTS],
				})
			);
			expect(media.hits.total.value).toEqual(2);
			expect(media.hits.hits.length).toEqual(2);
		});
	});

	describe('checkAndFixFormatFilter', () => {
		it('should add film to a video format query', () => {
			const fixedQuery = mediaController.checkAndFixFormatFilter({
				filters: [
					{
						field: SearchFilterField.FORMAT,
						value: MediaFormat.VIDEO,
						operator: Operator.IS,
					},
				],
			});
			expect(fixedQuery.filters[0].multiValue).toEqual(['video', 'film']);
		});

		it('should add film to a query on video in a multivalue', () => {
			const fixedQuery = mediaController.checkAndFixFormatFilter({
				filters: [
					{
						field: SearchFilterField.FORMAT,
						multiValue: [MediaFormat.VIDEO],
						operator: Operator.IS,
					},
				],
			});
			expect(fixedQuery.filters[0].multiValue).toEqual(['video', 'film']);
		});
	});
});
