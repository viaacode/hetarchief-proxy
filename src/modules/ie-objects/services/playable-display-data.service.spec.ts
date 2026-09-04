import { DataService, PlayerTicketService, VideoStillsService } from '@meemoo/admin-core-api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import type { Cache } from 'cache-manager';
import { hoursToSeconds } from 'date-fns';
import {
	type MockInstance,
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest';

import { HetArchiefIeObjectLicense, HetArchiefIeObjectType } from '@viaa/avo2-types';
import { mockIeObject2, mockUser } from '../mocks/ie-objects.mock';

import { IeObjectsService } from './ie-objects.service';
import { PlayableDisplayDataService } from './playable-display-data.service';

import type { GetIeObjectPlayableDisplayDataQuery } from '~generated/graphql-db-types-hetarchief';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { VisitsService } from '~modules/visits/services/visits.service';
import { AUDIO_WAVE_FORM_URL } from '~shared/consts/audio-wave-form-url';
import { TestingLogger } from '~shared/logging/test-logger';
import { mockConfigService } from '~shared/test/mock-config-service';

const mockDataService: Partial<Record<keyof DataService, MockInstance>> = {
	execute: vi.fn(),
};

const mockPlayerTicketService: Partial<Record<keyof PlayerTicketService, MockInstance>> = {
	getPlayerToken: vi.fn(),
	getPlayableUrl: vi.fn(),
	getBrowseUrl: vi.fn(),
	resolveThumbnailUrl: vi.fn(),
	getThumbnailUrl: vi.fn(),
	getThumbnailPath: vi.fn(),
};

const mockVideoStillsService: Partial<Record<keyof VideoStillsService, MockInstance>> = {
	getFirstVideoStills: vi.fn(),
};

// Minimal - IeObjectsService only needs these to be constructed by DI. The methods this
// service delegates to (getIeObjectIdFromObjectSchemaIdentifier, getVisitorSpaceAccessInfoFromUser)
// are spied on directly below instead of exercising their real implementation.
const mockVisitsService: Partial<Record<keyof VisitsService, MockInstance>> = {
	findAll: vi.fn(),
};
const mockSpacesService: Partial<Record<keyof SpacesService, MockInstance>> = {
	findAll: vi.fn(),
};

const mockCacheService: Partial<Record<keyof Cache, MockInstance>> = {
	wrap: vi.fn().mockImplementation((key, cb) => cb()),
};

// Mock fetch globally, used to fetch and inline the IIIF newspaper image
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockObjectId = mockIeObject2.getIeObject[0].id;

describe('PlayableDisplayDataService', () => {
	let module: TestingModule;
	let ieObjectsService: IeObjectsService;
	let playableDisplayDataService: PlayableDisplayDataService;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			providers: [
				IeObjectsService,
				PlayableDisplayDataService,
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: PlayerTicketService,
					useValue: mockPlayerTicketService,
				},
				{
					provide: VisitsService,
					useValue: mockVisitsService,
				},
				{
					provide: SpacesService,
					useValue: mockSpacesService,
				},
				{
					provide: VideoStillsService,
					useValue: mockVideoStillsService,
				},
				{
					provide: CACHE_MANAGER,
					useValue: mockCacheService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		ieObjectsService = module.get<IeObjectsService>(IeObjectsService);
		playableDisplayDataService = module.get<PlayableDisplayDataService>(PlayableDisplayDataService);
	});

	afterAll(async () => {
		await module.close();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('services should be defined', () => {
		expect(ieObjectsService).toBeDefined();
		expect(playableDisplayDataService).toBeDefined();
	});

	describe('getIeObjectsPlayableDisplayData', () => {
		const mockVideoFile = {
			id: 'file-1',
			ebucore_has_mime_type: 'video/mp4',
			premis_stored_at: 'OR-rf5kf25/file-1.mp4',
			hasMediaFragment: [],
		};

		const mockRepresentation = {
			id: 'representation-1',
			is_media_fragment_of: null,
			includes: [{ file: mockVideoFile }],
		};

		const buildMockDbResponse = (
			overrides: Partial<GetIeObjectPlayableDisplayDataQuery> = {}
		): GetIeObjectPlayableDisplayDataQuery =>
			({
				ieObject: [
					{
						schema_identifier: 'mock-schema-identifier',
						schema_name: 'Mock playable object',
						dctermsFormat: [{ dcterms_format: HetArchiefIeObjectType.VIDEO }],
						schemaMaintainer: {
							org_identifier: 'OR-rf5kf25',
							skos_pref_label: 'VRT',
							ha_org_has_logo: 'https://assets.viaa.be/images/OR-rf5kf25',
							ha_org_sector: null,
							hasPreference: [],
						},
					},
				],
				schemaThumbnailUrl: [{ schema_thumbnail_url: ['https://example.com/thumb.jpg'] }],
				schemaLicense: [{ schema_license: HetArchiefIeObjectLicense.PUBLIEK_CONTENT }],
				getHasPart: [],
				getIsRepresentedBy: [{ isRepresentedBy: [mockRepresentation] }],
				...overrides,
			}) as unknown as GetIeObjectPlayableDisplayDataQuery;

		const mockCpAdminUser = new SessionUserEntity(mockUser);

		beforeEach(() => {
			// mockResolvedValueOnce queued by earlier tests in this file is not cleared by
			// vi.clearAllMocks() (only mockClear semantics) - reset fully to avoid bleed-through
			mockDataService.execute.mockReset();
			mockFetch.mockReset();
			vi.spyOn(ieObjectsService, 'getIeObjectIdFromObjectSchemaIdentifier').mockResolvedValue(
				mockObjectId
			);
			vi.spyOn(ieObjectsService, 'getVisitorSpaceAccessInfoFromUser').mockResolvedValue({
				objectIds: [],
				visitorSpaceIds: [],
			});
			mockPlayerTicketService.resolveThumbnailUrl.mockResolvedValue(
				'https://example.com/thumb-with-token.jpg'
			);
			mockPlayerTicketService.getPlayableUrl.mockResolvedValue('https://example.com/playable.mp4');
		});

		it('returns full playable display data for an object with essence access', async () => {
			mockDataService.execute.mockResolvedValueOnce(buildMockDbResponse());

			const [result] = await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier' }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(result.schemaIdentifier).toEqual('mock-schema-identifier');
			expect(result.name).toEqual('Mock playable object');
			expect(result.dctermsFormat).toEqual(HetArchiefIeObjectType.VIDEO);
			expect(result.maintainerName).toEqual('VRT');
			expect(result.thumbnailUrl).toEqual('https://example.com/thumb-with-token.jpg');
			expect(result.playableUrl).toEqual('https://example.com/playable.mp4');
			expect(result.mimeType).toEqual('video/mp4');
			expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith('OR-rf5kf25/file-1.mp4', {
				referer: 'referer',
				ip: '127.0.0.1',
				isPublicDomain: false,
				startTime: undefined,
				endTime: undefined,
			});
			expect(result.snipPoint).toBeUndefined();
			expect(result).not.toHaveProperty('newspaperImage');
		});

		it('returns a self-contained data uri instead of playableUrl/mimeType/peakfileData for non audio/video objects', async () => {
			const mockImageFile = {
				id: 'image-file-1',
				ebucore_has_mime_type: 'image/jp2',
				premis_stored_at: 'https://iiif-qas.meemoo.be/image/3/public/newspaper-page-1.jp2',
				hasMediaFragment: [],
			};
			mockPlayerTicketService.getPlayerToken.mockResolvedValue('mock-bearer-token');
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: { get: () => 'image/jpeg' },
				arrayBuffer: () => Promise.resolve(new TextEncoder().encode('fake-jpeg-bytes').buffer),
			});

			mockDataService.execute.mockResolvedValueOnce(
				buildMockDbResponse({
					ieObject: [
						{
							...buildMockDbResponse().ieObject[0],
							dctermsFormat: [{ dcterms_format: HetArchiefIeObjectType.NEWSPAPER }],
						},
					],
					getIsRepresentedBy: [
						{ isRepresentedBy: [{ ...mockRepresentation, includes: [{ file: mockImageFile }] }] },
					],
				}) as GetIeObjectPlayableDisplayDataQuery
			);

			const [result] = await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier' }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			// The token is requested for the base url, without the /full/.../default.jpg suffix,
			// since the ticket must be a substring of the final requested url
			expect(mockPlayerTicketService.getPlayerToken).toHaveBeenCalledWith(
				'https://iiif-qas.meemoo.be/image/3/hetarchief/newspaper-page-1.jp2',
				{ referer: 'referer', ip: '127.0.0.1', isPublicDomain: false }
			);
			expect(mockFetch).toHaveBeenCalledWith(
				'https://iiif-qas.meemoo.be/image/3/hetarchief/newspaper-page-1.jp2/full/1000,/0/default.jpg',
				{
					headers: { Authorization: 'Bearer mock-bearer-token', Referer: 'referer' },
					signal: expect.any(AbortSignal),
				}
			);
			expect(mockPlayerTicketService.getPlayableUrl).not.toHaveBeenCalled();
			const expectedBase64 = Buffer.from('fake-jpeg-bytes').toString('base64');
			expect(result.newspaperImage).toEqual(`data:image/jpeg;base64,${expectedBase64}`);
			expect(result).not.toHaveProperty('playableUrl');
			expect(result).not.toHaveProperty('mimeType');
			expect(result).not.toHaveProperty('peakfileData');
			// The rendered image is cached per file (independent of referer/ip) for 1 hour, so
			// repeat carousel views don't re-hit the ticket service and IIIF server
			expect(mockCacheService.wrap).toHaveBeenCalledWith(
				`ie-objects-newspaper-image__${mockImageFile.premis_stored_at}`,
				expect.any(Function),
				hoursToSeconds(1)
			);
		});

		it('falls back to a storedAt ending in jp2 when no image/jp2 mime type is present (ARC-3156)', async () => {
			const mockLegacyImageFile = {
				id: 'image-file-1',
				ebucore_has_mime_type: null,
				premis_stored_at: 'https://iiif-qas.meemoo.be/image/3/public/newspaper-page-1.jp2',
				hasMediaFragment: [],
			};
			mockPlayerTicketService.getPlayerToken.mockResolvedValue('mock-bearer-token');
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: { get: () => 'image/jpeg' },
				arrayBuffer: () => Promise.resolve(new TextEncoder().encode('fake-jpeg-bytes').buffer),
			});

			mockDataService.execute.mockResolvedValueOnce(
				buildMockDbResponse({
					ieObject: [
						{
							...buildMockDbResponse().ieObject[0],
							dctermsFormat: [{ dcterms_format: HetArchiefIeObjectType.NEWSPAPER }],
						},
					],
					getIsRepresentedBy: [
						{
							isRepresentedBy: [
								{ ...mockRepresentation, includes: [{ file: mockLegacyImageFile }] },
							],
						},
					],
				}) as GetIeObjectPlayableDisplayDataQuery
			);

			const [result] = await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier' }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			const expectedBase64 = Buffer.from('fake-jpeg-bytes').toString('base64');
			expect(result.newspaperImage).toEqual(`data:image/jpeg;base64,${expectedBase64}`);
		});

		it("falls through to a child page's representation for newspaperImage when the object's own representation has no image file", async () => {
			const mockOwnAltoFile = {
				id: 'own-file-1',
				ebucore_has_mime_type: 'application/xml',
				premis_stored_at: 'OR-rf5kf25/newspaper-alto.xml',
				hasMediaFragment: [],
			};
			const mockPageImageFile = {
				id: 'page-image-file-1',
				ebucore_has_mime_type: 'image/jp2',
				premis_stored_at: 'https://iiif-qas.meemoo.be/image/3/public/newspaper-page-1.jp2',
				hasMediaFragment: [],
			};
			mockPlayerTicketService.getPlayerToken.mockResolvedValue('mock-bearer-token');
			mockFetch.mockResolvedValueOnce({
				ok: true,
				headers: { get: () => 'image/jpeg' },
				arrayBuffer: () => Promise.resolve(new TextEncoder().encode('fake-jpeg-bytes').buffer),
			});

			mockDataService.execute.mockResolvedValueOnce(
				buildMockDbResponse({
					ieObject: [
						{
							...buildMockDbResponse().ieObject[0],
							dctermsFormat: [{ dcterms_format: HetArchiefIeObjectType.NEWSPAPER }],
						},
					],
					// The newspaper's own representation only has a non-image (ALTO) file
					getIsRepresentedBy: [
						{
							isRepresentedBy: [{ ...mockRepresentation, includes: [{ file: mockOwnAltoFile }] }],
						},
					],
					// The real page-1 image lives on a child part
					getHasPart: [
						{
							isRepresentedBy: [
								{
									...mockRepresentation,
									id: 'page-1-representation',
									includes: [{ file: mockPageImageFile }],
								},
							],
						},
					],
				}) as GetIeObjectPlayableDisplayDataQuery
			);

			const [result] = await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier' }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			// Must resolve the image from the child page's file, not fail because the own
			// representation's (non-image) file didn't match
			expect(mockPlayerTicketService.getPlayerToken).toHaveBeenCalledWith(
				'https://iiif-qas.meemoo.be/image/3/hetarchief/newspaper-page-1.jp2',
				{ referer: 'referer', ip: '127.0.0.1', isPublicDomain: false }
			);
			const expectedBase64 = Buffer.from('fake-jpeg-bytes').toString('base64');
			expect(result.newspaperImage).toEqual(`data:image/jpeg;base64,${expectedBase64}`);
		});

		it('returns null newspaperImage (but keeps the rest of the object) when the IIIF fetch fails', async () => {
			const mockImageFile = {
				id: 'image-file-1',
				ebucore_has_mime_type: 'image/jp2',
				premis_stored_at: 'https://iiif-qas.meemoo.be/image/3/public/newspaper-page-1.jp2',
				hasMediaFragment: [],
			};
			mockPlayerTicketService.getPlayerToken.mockResolvedValue('mock-bearer-token');
			mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

			mockDataService.execute.mockResolvedValueOnce(
				buildMockDbResponse({
					ieObject: [
						{
							...buildMockDbResponse().ieObject[0],
							dctermsFormat: [{ dcterms_format: HetArchiefIeObjectType.NEWSPAPER }],
						},
					],
					getIsRepresentedBy: [
						{ isRepresentedBy: [{ ...mockRepresentation, includes: [{ file: mockImageFile }] }] },
					],
				}) as GetIeObjectPlayableDisplayDataQuery
			);

			const [result] = await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier' }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(result).toBeDefined();
			expect(result.name).toEqual('Mock playable object');
			expect(result.newspaperImage).toBeNull();
		});

		it('omits thumbnailUrl and playableUrl when the user only has metadata access', async () => {
			mockDataService.execute.mockResolvedValueOnce(
				buildMockDbResponse({
					schemaLicense: [{ schema_license: HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD }],
				}) as GetIeObjectPlayableDisplayDataQuery
			);

			const [result] = await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier' }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(result).toBeDefined();
			expect(result.name).toEqual('Mock playable object');
			expect(result.thumbnailUrl).toBeNull();
			expect(result.playableUrl).toBeNull();
			expect(result.mimeType).toBeNull();
			expect(mockPlayerTicketService.getPlayableUrl).not.toHaveBeenCalled();
		});

		it('cuts the playable url when the representation is a media fragment', async () => {
			mockDataService.execute.mockResolvedValueOnce(
				buildMockDbResponse({
					getIsRepresentedBy: [
						{
							isRepresentedBy: [
								{
									...mockRepresentation,
									is_media_fragment_of: 'parent-representation-id',
									includes: [
										{
											file: {
												...mockVideoFile,
												hasMediaFragment: [
													{ schema_start_time: '00:00:10', schema_end_time: '00:00:20' },
												],
											},
										},
									],
								},
							],
						},
					],
				}) as GetIeObjectPlayableDisplayDataQuery
			);

			await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier' }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith('OR-rf5kf25/file-1.mp4', {
				referer: 'referer',
				ip: '127.0.0.1',
				isPublicDomain: false,
				startTime: 10,
				endTime: 20,
			});
		});

		it('hides cut-fragment representations when a main representation also exists', async () => {
			const fragmentRepresentation = {
				...mockRepresentation,
				id: 'fragment-representation',
				is_media_fragment_of: 'main-representation',
				includes: [
					{
						file: {
							...mockVideoFile,
							id: 'fragment-file',
							premis_stored_at: 'OR-rf5kf25/fragment-file.mp4',
						},
					},
				],
			};
			const mainRepresentation = {
				...mockRepresentation,
				id: 'main-representation',
				is_media_fragment_of: null,
				includes: [
					{
						file: {
							...mockVideoFile,
							id: 'main-file',
							premis_stored_at: 'OR-rf5kf25/main-file.mp4',
						},
					},
				],
			};

			mockDataService.execute.mockResolvedValueOnce(
				buildMockDbResponse({
					getIsRepresentedBy: [{ isRepresentedBy: [fragmentRepresentation, mainRepresentation] }],
				}) as GetIeObjectPlayableDisplayDataQuery
			);

			await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier' }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith(
				'OR-rf5kf25/main-file.mp4',
				expect.anything()
			);
		});

		it('skips m4a representations and prefers mp4 over mpeg audio representations on the same page', async () => {
			const m4aRepresentation = {
				...mockRepresentation,
				id: 'm4a-representation',
				includes: [
					{
						file: {
							...mockVideoFile,
							ebucore_has_mime_type: 'audio/m4a',
							premis_stored_at: 'OR-rf5kf25/audio.m4a',
						},
					},
				],
			};
			const mpegRepresentation = {
				...mockRepresentation,
				id: 'mpeg-representation',
				includes: [
					{
						file: {
							...mockVideoFile,
							ebucore_has_mime_type: 'audio/mpeg',
							premis_stored_at: 'OR-rf5kf25/audio.mp3',
						},
					},
				],
			};
			const mp4Representation = {
				...mockRepresentation,
				id: 'mp4-representation',
				includes: [
					{
						file: {
							...mockVideoFile,
							ebucore_has_mime_type: 'audio/mp4',
							premis_stored_at: 'OR-rf5kf25/audio.mp4',
						},
					},
				],
			};

			mockDataService.execute.mockResolvedValueOnce(
				buildMockDbResponse({
					getIsRepresentedBy: [
						{
							isRepresentedBy: [m4aRepresentation, mpegRepresentation, mp4Representation],
						},
					],
				}) as GetIeObjectPlayableDisplayDataQuery
			);

			const [result] = await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier' }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith(
				'OR-rf5kf25/audio.mp4',
				expect.anything()
			);
			expect(result.mimeType).toEqual('audio/mp4');
		});

		it('resolves both playableUrl (the audio file) and peakfileData (just the peak sample array) for audio fragments', async () => {
			const mockPeakFile = {
				id: 'peak-file-1',
				ebucore_has_mime_type: 'application/json',
				premis_stored_at: 'http://mediaservice/OR-rf5kf25/peak-file-1.json',
				hasMediaFragment: [],
			};
			const mockAudioFile = {
				id: 'audio-file-1',
				ebucore_has_mime_type: 'audio/mpeg',
				premis_stored_at: 'OR-rf5kf25/audio-file-1.mp3',
				hasMediaFragment: [],
			};
			const mockWaveformData = {
				version: 2,
				channels: 1,
				sample_rate: 48000,
				samples_per_pixel: 512,
				bits: 8,
				length: 3,
				data: [0, 1, 0],
			};

			mockDataService.execute.mockResolvedValueOnce(
				buildMockDbResponse({
					ieObject: [
						{
							...buildMockDbResponse().ieObject[0],
							dctermsFormat: [{ dcterms_format: HetArchiefIeObjectType.AUDIO_FRAGMENT }],
						},
					],
					getIsRepresentedBy: [
						{
							isRepresentedBy: [
								{
									...mockRepresentation,
									includes: [{ file: mockAudioFile }, { file: mockPeakFile }],
								},
							],
						},
					],
				}) as GetIeObjectPlayableDisplayDataQuery
			);
			mockPlayerTicketService.getPlayableUrl.mockImplementation((storedAt: string) =>
				Promise.resolve(`https://example.com/ticket/${storedAt}`)
			);
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockWaveformData),
			});

			const [result] = await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier' }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith(
				'OR-rf5kf25/audio-file-1.mp3',
				expect.anything()
			);
			// Peak files 403 through the ticket service, so they're fetched directly from the
			// archief-media host instead (mapMediaServiceUrlToArchiefMediaUrl)
			expect(mockPlayerTicketService.getPlayableUrl).not.toHaveBeenCalledWith(
				mockPeakFile.premis_stored_at,
				expect.anything()
			);
			expect(mockFetch).toHaveBeenCalledWith(
				'http://archief-mediaservice/viaa/OR-rf5kf25/peak-file-1.json',
				{ signal: expect.any(AbortSignal) }
			);
			expect(result.playableUrl).toEqual('https://example.com/ticket/OR-rf5kf25/audio-file-1.mp3');
			expect(result.mimeType).toEqual('audio/mpeg');
			expect(result.peakfileData).toEqual(mockWaveformData.data);
			// The parsed waveform data is cached per file (independent of referer/ip) for 1 hour, so
			// repeat carousel views don't re-hit the ticket service and media service
			expect(mockCacheService.wrap).toHaveBeenCalledWith(
				`ie-objects-peakfile-data__${mockPeakFile.premis_stored_at}`,
				expect.any(Function),
				hoursToSeconds(1)
			);
		});

		it('refuses to fetch a peak file that is not a json file, to avoid bypassing the ticket service', async () => {
			// fetchPeakFileDataCached is private and bypasses the ticket service by design, so it
			// must never be usable to fetch/expose a non-json (e.g. essence) file - called directly
			// here since the public getIeObjectsPlayableDisplayData path only ever selects a json file
			const warnSpy = vi.spyOn((playableDisplayDataService as any).logger, 'warn');
			const mockNonJsonFile = {
				id: 'audio-file-1',
				ebucore_has_mime_type: 'audio/mpeg',
				premis_stored_at: 'http://mediaservice/OR-rf5kf25/audio-file-1.mp3',
				hasMediaFragment: [],
			};

			const result = await (playableDisplayDataService as any).fetchPeakFileDataCached(
				mockNonJsonFile
			);

			expect(result).toBeNull();
			expect(mockFetch).not.toHaveBeenCalled();
			expect(warnSpy).toHaveBeenCalledWith(
				expect.stringContaining(mockNonJsonFile.premis_stored_at)
			);
		});

		it('does not resolve peakfileData for video objects', async () => {
			mockDataService.execute.mockResolvedValueOnce(buildMockDbResponse());

			const [result] = await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier' }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(result.peakfileData).toBeNull();
		});

		it('returns null when the user has no access at all', async () => {
			mockDataService.execute.mockResolvedValueOnce(
				buildMockDbResponse({ schemaLicense: [] }) as GetIeObjectPlayableDisplayDataQuery
			);

			const [result] = await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier' }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(result).toBeNull();
		});

		it('returns null when the ie-object cannot be found', async () => {
			mockDataService.execute.mockResolvedValueOnce(
				buildMockDbResponse({ ieObject: [] }) as GetIeObjectPlayableDisplayDataQuery
			);

			const [result] = await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier' }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(result).toBeNull();
		});

		it('returns the waveform thumbnail for audio objects, ignoring cuepoints', async () => {
			mockDataService.execute.mockResolvedValueOnce(
				buildMockDbResponse({
					ieObject: [
						{
							...buildMockDbResponse().ieObject[0],
							dctermsFormat: [{ dcterms_format: HetArchiefIeObjectType.AUDIO }],
						},
					],
				}) as GetIeObjectPlayableDisplayDataQuery
			);

			const [result] = await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier', start: 10 }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(result.thumbnailUrl).toEqual(AUDIO_WAVE_FORM_URL);
			expect(mockVideoStillsService.getFirstVideoStills).not.toHaveBeenCalled();
			expect(result.snipPoint).toEqual({ start: 10, end: undefined });
		});

		it('uses a video still as the thumbnail when a start cuepoint is provided', async () => {
			mockDataService.execute.mockResolvedValueOnce(buildMockDbResponse());
			mockVideoStillsService.getFirstVideoStills.mockResolvedValueOnce([
				{ thumbnailImagePath: 'https://example.com/still-at-10s.jpg' },
			]);

			const [result] = await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier', start: 10, end: 20 }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(mockVideoStillsService.getFirstVideoStills).toHaveBeenCalledWith([
				{
					id: 'file-1',
					storedAt: 'OR-rf5kf25/file-1.mp4',
					type: 'video',
					startTime: 10000,
				},
			]);
			expect(result.thumbnailUrl).toEqual('https://example.com/still-at-10s.jpg');
			expect(result.snipPoint).toEqual({ start: 10, end: 20 });
		});

		it('cuts the playable url ticket to the requested snippet', async () => {
			mockDataService.execute.mockResolvedValueOnce(buildMockDbResponse());

			await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier', start: 10, end: 20 }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith('OR-rf5kf25/file-1.mp4', {
				referer: 'referer',
				ip: '127.0.0.1',
				isPublicDomain: false,
				startTime: 10,
				endTime: 20,
			});
		});

		it('ignores a snippet without an end time, since the ticket service would hand out an uncut url anyway', async () => {
			mockDataService.execute.mockResolvedValueOnce(buildMockDbResponse());

			await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier', start: 10 }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith('OR-rf5kf25/file-1.mp4', {
				referer: 'referer',
				ip: '127.0.0.1',
				isPublicDomain: false,
				startTime: undefined,
				endTime: undefined,
			});
		});

		it('shifts the snippet into the parent file timeline and clamps it to the media fragment window', async () => {
			const fragmentRepresentation = {
				...mockRepresentation,
				id: 'fragment-representation',
				is_media_fragment_of: 'main-representation',
				includes: [
					{
						file: {
							...mockVideoFile,
							id: 'fragment-file',
							premis_stored_at: 'OR-rf5kf25/fragment-file.mp4',
							hasMediaFragment: [{ schema_start_time: '00:01:40', schema_end_time: '00:02:00' }],
						},
					},
				],
			};

			mockDataService.execute.mockResolvedValueOnce(
				buildMockDbResponse({
					getIsRepresentedBy: [{ isRepresentedBy: [fragmentRepresentation] }],
				}) as GetIeObjectPlayableDisplayDataQuery
			);

			await playableDisplayDataService.getIeObjectsPlayableDisplayData(
				[{ schemaIdentifier: 'mock-schema-identifier', start: 5, end: 60 }],
				mockCpAdminUser,
				'referer',
				'127.0.0.1',
				{} as any
			);

			expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith(
				'OR-rf5kf25/fragment-file.mp4',
				{
					referer: 'referer',
					ip: '127.0.0.1',
					isPublicDomain: false,
					startTime: 105,
					endTime: 120,
				}
			);
		});
	});
});
