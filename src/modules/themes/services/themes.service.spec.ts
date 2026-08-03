import { DataService } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { Test, type TestingModule } from '@nestjs/testing';
import {
	type MockInstance,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest';

import { GetThemeWithObjectsInRandomOrderQuery } from '~generated/graphql-db-types-hetarchief';
import { IeObjectLicense } from '~modules/ie-objects/ie-objects.types';
import { mockUser } from '~modules/ie-objects/mocks/ie-objects.mock';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { AUDIO_WAVE_FORM_URL } from '~shared/consts/audio-wave-form-url';
import { TestingLogger } from '~shared/logging/test-logger';
import { SortDirectionWithRandom } from '~shared/types';
import { ThemesService } from './themes.service';

const mockThemeSlug = 'culture-society';
const mockThemeUuid = 'c619c4b1-5cd6-4277-95e8-8137f10a09ea';
const mockReferer = 'https://client.example.com';
const mockIp = '127.0.0.1';
// mockUser is a CP_ADMIN, which has access to VIAA-PUBLIEK-CONTENT licensed ie-objects
const mockSessionUser = new SessionUserEntity(mockUser);

const mockGetIeObjectsInThemeResponse: GetThemeWithObjectsInRandomOrderQuery = {
	app_theme_by_pk: {
		id: 'theme-uuid-1',
		slug: mockThemeSlug,
		name_nl: 'Cultuur en samenleving',
		name_en: 'Culture & Society',
		image_url: 'https://example.com/nature.jpg',
		updated_at: '2024-01-01T00:00:00.000Z',
		ieObjectLinksRandomOrder: [
			{
				ieObject: {
					id: 'ie-uuid-1',
					schema_name: 'Natuur documentaire',
					dctermsFormat: [{ dcterms_format: 'video' }],
					schemaThumbnail: { schema_thumbnail_url: ['https://example.com/thumb1.jpg'] },
					schemaMaintainer: {
						id: 'or-abc123',
						skos_pref_label: 'VRT',
						org_identifier: 'OR-abc123',
					},
					schemaLicense: { schema_license: [IeObjectLicense.PUBLIEK_CONTENT] },
				},
			},
			{
				ieObject: {
					id: 'ie-uuid-2',
					schema_name: 'Natuur foto',
					dctermsFormat: [{ dcterms_format: 'image' }],
					schemaThumbnail: null,
					schemaMaintainer: {
						id: 'or-def456',
						skos_pref_label: 'RTBF',
						org_identifier: 'OR-def456',
					},
					schemaLicense: { schema_license: [IeObjectLicense.PUBLIEK_CONTENT] },
				},
			},
			{
				ieObject: null,
			},
		],
	},
};

const mockIeObjectSchemaIdentifier = 'qsnk362q84';
const mockIeObjectEntityId = `https://data-qas.hetarchief.be/id/entity/${mockIeObjectSchemaIdentifier}`;

// Responses of getIeObjectIdBySchemaIdentifier, used to turn a schema identifier into an entity uri
const mockLookupHit = {
	graph_intellectual_entity: [
		{ id: mockIeObjectEntityId, schema_identifier: mockIeObjectSchemaIdentifier },
	],
};
const mockLookupMiss = { graph_intellectual_entity: [] };

const mockDataService: Partial<Record<keyof DataService, MockInstance>> = {
	execute: vi.fn(),
};

const mockIeObjectsService: Partial<Record<keyof IeObjectsService, MockInstance>> = {
	getThumbnailUrlWithToken: vi.fn(),
	getVisitorSpaceAccessInfoFromUser: vi.fn(),
};

describe('ThemesService', () => {
	let themesService: ThemesService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ThemesService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: IeObjectsService,
					useValue: mockIeObjectsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		themesService = module.get<ThemesService>(ThemesService);
	});

	beforeEach(() => {
		// Default: resolve to the raw thumbnail url unchanged, so tests that don't care about
		// token resolution can assert against the raw urls from the mock responses.
		mockIeObjectsService.getThumbnailUrlWithToken.mockImplementation(
			async (thumbnailUrl: string | undefined | null) => thumbnailUrl ?? undefined
		);
		// Default: no folder/visitor-space access, only the license-based checks apply
		mockIeObjectsService.getVisitorSpaceAccessInfoFromUser.mockResolvedValue({
			objectIds: [],
			visitorSpaceIds: [],
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should be defined', () => {
		expect(themesService).toBeDefined();
	});

	describe('getIeObjectsInTheme', () => {
		it('returns the theme with its linked ie-objects', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGetIeObjectsInThemeResponse);

			const result = await themesService.getIeObjectsByThemeUuid(
				mockThemeUuid,
				{
					size: 20,
					orderDirection: SortDirectionWithRandom.random,
					resolveThumbnailUrl: true,
				},
				mockSessionUser,
				mockReferer,
				mockIp
			);

			expect(result.slug).toEqual(mockThemeSlug);
			expect(result.nameNl).toEqual('Cultuur en samenleving');
			expect(result.nameEn).toEqual('Culture & Society');
			expect(result.imageUrl).toEqual('https://example.com/nature.jpg');
			// null ieObjects entries are filtered out
			expect(result.ieObjects).toHaveLength(2);
		});

		it('correctly maps ie-object fields', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGetIeObjectsInThemeResponse);

			const result = await themesService.getIeObjectsByThemeUuid(
				mockThemeUuid,
				{
					size: 20,
					orderDirection: SortDirectionWithRandom.random,
					resolveThumbnailUrl: true,
				},
				mockSessionUser,
				mockReferer,
				mockIp
			);
			const [first] = result.ieObjects;

			expect(first.id).toEqual('ie-uuid-1');
			expect(first.name).toEqual('Natuur documentaire');
			expect(first.format).toEqual('video');
			expect(first.thumbnailUrl).toEqual('https://example.com/thumb1.jpg');
			expect(first.maintainerId).toEqual('or-abc123');
			expect(first.maintainerName).toEqual('VRT');
		});

		it('returns an undefined thumbnailUrl when the raw ie-object has no thumbnail', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGetIeObjectsInThemeResponse);

			const result = await themesService.getIeObjectsByThemeUuid(
				mockThemeUuid,
				{
					size: 20,
					orderDirection: SortDirectionWithRandom.random,
					resolveThumbnailUrl: true,
				},
				mockSessionUser,
				mockReferer,
				mockIp
			);
			const second = result.ieObjects[1];

			expect(second.thumbnailUrl).toBeUndefined();
		});

		it('throws CustomError with 404 when the theme does not exist', async () => {
			mockDataService.execute.mockResolvedValueOnce({ app_theme_by_pk: null });

			await expect(
				themesService.getIeObjectsByThemeUuid(
					'non-existing-uuid',
					{
						size: 20,
						orderDirection: SortDirectionWithRandom.random,
					},
					mockSessionUser,
					mockReferer,
					mockIp
				)
			).rejects.toThrow(CustomError);
		});

		it('passes the limit to the query', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGetIeObjectsInThemeResponse);

			await themesService.getIeObjectsByThemeUuid(
				mockThemeUuid,
				{
					size: 5,
					orderDirection: SortDirectionWithRandom.random,
				},
				mockSessionUser,
				mockReferer,
				mockIp
			);

			expect(mockDataService.execute).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({ objectsLimit: 5 })
			);
		});
	});

	describe('getIeObjectsByThemeUuid - thumbnail resolution', () => {
		it('replaces the thumbnail with the audio waveform for audio ie-objects, without calling the token service', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				app_theme_by_pk: {
					...mockGetIeObjectsInThemeResponse.app_theme_by_pk,
					ieObjectLinksRandomOrder: [
						{
							ieObject: {
								id: 'ie-uuid-audio',
								schema_name: 'Natuur podcast',
								dctermsFormat: [{ dcterms_format: 'audio' }],
								schemaThumbnail: { schema_thumbnail_url: ['https://example.com/audio-thumb.jpg'] },
								schemaMaintainer: {
									id: 'or-abc123',
									skos_pref_label: 'VRT',
									org_identifier: 'OR-abc123',
								},
								schemaLicense: { schema_license: [IeObjectLicense.PUBLIEK_CONTENT] },
							},
						},
					],
				},
			});

			const result = await themesService.getIeObjectsByThemeUuid(
				mockThemeUuid,
				{ size: 20, orderDirection: SortDirectionWithRandom.random, resolveThumbnailUrl: true },
				mockSessionUser,
				mockReferer,
				mockIp
			);

			expect(result.ieObjects[0].thumbnailUrl).toEqual(AUDIO_WAVE_FORM_URL);
			expect(mockIeObjectsService.getThumbnailUrlWithToken).not.toHaveBeenCalled();
		});

		it('does not resolve the thumbnail url when resolveThumbnailUrl is not set', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGetIeObjectsInThemeResponse);

			const result = await themesService.getIeObjectsByThemeUuid(
				mockThemeUuid,
				{ size: 20, orderDirection: SortDirectionWithRandom.random },
				mockSessionUser,
				mockReferer,
				mockIp
			);

			expect(result.ieObjects[0].thumbnailUrl).toBeUndefined();
			expect(mockIeObjectsService.getVisitorSpaceAccessInfoFromUser).not.toHaveBeenCalled();
			expect(mockIeObjectsService.getThumbnailUrlWithToken).not.toHaveBeenCalled();
		});

		it('does not resolve the thumbnail url when the user has no license granting access to it', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				app_theme_by_pk: {
					...mockGetIeObjectsInThemeResponse.app_theme_by_pk,
					ieObjectLinksRandomOrder: [
						{
							ieObject: {
								id: 'ie-uuid-no-access',
								schema_name: 'Niet-publiek werk',
								dctermsFormat: [{ dcterms_format: 'video' }],
								schemaThumbnail: {
									schema_thumbnail_url: ['https://example.com/private-thumb.jpg'],
								},
								schemaMaintainer: {
									id: 'or-abc123',
									skos_pref_label: 'VRT',
									org_identifier: 'OR-abc123',
								},
								// No licenses at all, so the censor logic strips the thumbnailUrl
								schemaLicense: { schema_license: [] },
							},
						},
					],
				},
			});

			const result = await themesService.getIeObjectsByThemeUuid(
				mockThemeUuid,
				{ size: 20, orderDirection: SortDirectionWithRandom.random, resolveThumbnailUrl: true },
				mockSessionUser,
				mockReferer,
				mockIp
			);

			expect(result.ieObjects[0].thumbnailUrl).toBeUndefined();
			expect(mockIeObjectsService.getThumbnailUrlWithToken).not.toHaveBeenCalled();
		});

		it('resolves the thumbnail url through the token service, passing the referer and ip through', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGetIeObjectsInThemeResponse);

			await themesService.getIeObjectsByThemeUuid(
				mockThemeUuid,
				{ size: 20, orderDirection: SortDirectionWithRandom.random, resolveThumbnailUrl: true },
				mockSessionUser,
				mockReferer,
				mockIp
			);

			expect(mockIeObjectsService.getVisitorSpaceAccessInfoFromUser).toHaveBeenCalledWith(
				mockSessionUser
			);

			// ie-uuid-1 only carries VIAA-PUBLIEK-CONTENT, not the public domain license, so
			// isPublicDomain should be false
			expect(mockIeObjectsService.getThumbnailUrlWithToken).toHaveBeenCalledWith(
				'https://example.com/thumb1.jpg',
				mockReferer,
				mockIp,
				false
			);
		});

		it('marks the token as valid for the public domain when both required licenses are present', async () => {
			mockDataService.execute.mockResolvedValueOnce({
				app_theme_by_pk: {
					...mockGetIeObjectsInThemeResponse.app_theme_by_pk,
					ieObjectLinksRandomOrder: [
						{
							ieObject: {
								id: 'ie-uuid-public-domain',
								schema_name: 'Publiek werk',
								dctermsFormat: [{ dcterms_format: 'video' }],
								schemaThumbnail: { schema_thumbnail_url: ['https://example.com/public-thumb.jpg'] },
								schemaMaintainer: {
									id: 'or-abc123',
									skos_pref_label: 'VRT',
									org_identifier: 'OR-abc123',
								},
								schemaLicense: {
									schema_license: [IeObjectLicense.PUBLIEK_CONTENT, IeObjectLicense.PUBLIC_DOMAIN],
								},
							},
						},
					],
				},
			});

			await themesService.getIeObjectsByThemeUuid(
				mockThemeUuid,
				{ size: 20, orderDirection: SortDirectionWithRandom.random, resolveThumbnailUrl: true },
				mockSessionUser,
				mockReferer,
				mockIp
			);

			expect(mockIeObjectsService.getThumbnailUrlWithToken).toHaveBeenCalledWith(
				'https://example.com/public-thumb.jpg',
				mockReferer,
				mockIp,
				true
			);
		});

		it('uses the token url resolved by the ie-objects service as the response thumbnailUrl', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockGetIeObjectsInThemeResponse);
			mockIeObjectsService.getThumbnailUrlWithToken.mockResolvedValueOnce(
				'https://example.com/thumb1.jpg?token=abc123'
			);

			const result = await themesService.getIeObjectsByThemeUuid(
				mockThemeUuid,
				{ size: 20, orderDirection: SortDirectionWithRandom.random, resolveThumbnailUrl: true },
				mockSessionUser,
				mockReferer,
				mockIp
			);

			expect(result.ieObjects[0].thumbnailUrl).toEqual(
				'https://example.com/thumb1.jpg?token=abc123'
			);
		});
	});

	describe('addIeObjectsToTheme', () => {
		it('resolves schema identifiers and reports one result per submitted identifier', async () => {
			// One lookup per unique identifier, in submission order, then the insert
			mockDataService.execute
				.mockResolvedValueOnce(mockLookupHit)
				.mockResolvedValueOnce(mockLookupMiss)
				.mockResolvedValueOnce({
					insert_app_theme_intellectual_entity: {
						returning: [
							{
								id: 'link-1',
								theme_id: mockThemeUuid,
								intellectual_entity_id: mockIeObjectEntityId,
							},
						],
					},
				});

			const result = await themesService.addIeObjectsToTheme(mockThemeUuid, [
				mockIeObjectSchemaIdentifier,
				mockIeObjectSchemaIdentifier,
				'does-not-exist',
			]);

			expect(result).toEqual([
				{ schemaIdentifier: mockIeObjectSchemaIdentifier, result: 'added' },
				{ schemaIdentifier: mockIeObjectSchemaIdentifier, result: 'alreadyLinked' },
				{ schemaIdentifier: 'does-not-exist', result: 'notFound' },
			]);
		});

		it('links the resolved entity uri, not the schema identifier', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockLookupHit).mockResolvedValueOnce({
				insert_app_theme_intellectual_entity: { returning: [] },
			});

			await themesService.addIeObjectsToTheme(mockThemeUuid, [mockIeObjectSchemaIdentifier]);

			expect(mockDataService.execute).toHaveBeenLastCalledWith(
				expect.anything(),
				expect.objectContaining({
					objects: [{ theme_id: mockThemeUuid, intellectual_entity_id: mockIeObjectEntityId }],
				})
			);
		});

		it('reports alreadyLinked when the insert returns no new rows', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockLookupHit).mockResolvedValueOnce({
				insert_app_theme_intellectual_entity: { returning: [] },
			});

			const result = await themesService.addIeObjectsToTheme(mockThemeUuid, [
				mockIeObjectSchemaIdentifier,
			]);

			expect(result).toEqual([
				{ schemaIdentifier: mockIeObjectSchemaIdentifier, result: 'alreadyLinked' },
			]);
		});

		it('skips the insert entirely when nothing resolves', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockLookupMiss);

			const result = await themesService.addIeObjectsToTheme(mockThemeUuid, ['does-not-exist']);

			expect(result).toEqual([{ schemaIdentifier: 'does-not-exist', result: 'notFound' }]);
			// Only the lookup ran, no insert
			expect(mockDataService.execute).toHaveBeenCalledTimes(1);
		});
	});

	describe('deleteIeObjectFromTheme', () => {
		it('resolves the schema identifier and deletes by entity uri', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockLookupHit).mockResolvedValueOnce({
				delete_app_theme_intellectual_entity: { affected_rows: 1 },
			});

			const affectedRows = await themesService.deleteIeObjectFromTheme(
				mockThemeUuid,
				mockIeObjectSchemaIdentifier
			);

			expect(affectedRows).toEqual(1);
			expect(mockDataService.execute).toHaveBeenLastCalledWith(
				expect.anything(),
				expect.objectContaining({ themeId: mockThemeUuid, ieObjectId: mockIeObjectEntityId })
			);
		});

		it('returns 0 without deleting when the schema identifier does not resolve', async () => {
			mockDataService.execute.mockResolvedValueOnce(mockLookupMiss);

			const affectedRows = await themesService.deleteIeObjectFromTheme(
				mockThemeUuid,
				'does-not-exist'
			);

			expect(affectedRows).toEqual(0);
			expect(mockDataService.execute).toHaveBeenCalledTimes(1);
		});
	});
});
