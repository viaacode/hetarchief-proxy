import { AssetsService } from '@meemoo/admin-core-api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	CACHE_CONTROL_IMMUTABLE,
	CACHE_CONTROL_MUTABLE,
	CACHE_CONTROL_NO_STORE,
} from '~modules/images/images.consts';
import { TestingLogger } from '~shared/logging/test-logger';
import { mockConfigService } from '~shared/test/mock-config-service';

import { ImagesService } from './images.service';

const CMS_IMAGE_URL =
	'https://assets-qas.hetarchief.be/hetarchiefv3/CONTENT_BLOCK_IMAGE/image-uuid.png';
const LOGO_URL = 'https://assets.viaa.be/images/OR-154dn75';
const CMS_IMAGE_KEY =
	'IMAGE_CACHE/640/assets-qas.hetarchief.be/hetarchiefv3/CONTENT_BLOCK_IMAGE/image-uuid.webp';
const ASSET_SERVER_URL = 'https://assets-qas.hetarchief.be/hetarchiefv3';

const mockAssetsService = {
	metadata: vi.fn(),
	uploadToObjectStore: vi.fn(),
	getUrlFromKey: vi.fn((key: string) => `${ASSET_SERVER_URL}/${key}`),
};

const cacheStore = new Map<string, unknown>();
const mockCacheManager = {
	get: vi.fn(async (key: string) => cacheStore.get(key)),
	set: vi.fn(async (key: string, value: unknown) => {
		cacheStore.set(key, value);
	}),
};

const mockFetch = vi.fn();

function imagorResponse(): Response {
	return new Response(Buffer.from('webp-bytes'), { status: 200 });
}

describe('ImagesService', () => {
	let imagesService: ImagesService;

	beforeEach(async () => {
		cacheStore.clear();
		vi.stubGlobal('fetch', mockFetch);
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ImagesService,
				{ provide: ConfigService, useValue: mockConfigService },
				{ provide: AssetsService, useValue: mockAssetsService },
				{ provide: CACHE_MANAGER, useValue: mockCacheManager },
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		imagesService = module.get<ImagesService>(ImagesService);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.clearAllMocks();
	});

	describe('signImagorPath', () => {
		it('should sign the path with hmac sha256 like the imagor docs', () => {
			// Example from https://docs.imagor.net/security with IMAGOR_SIGNER_TYPE=sha256
			expect(
				imagesService.signImagorPath(
					'500x500/top/raw.githubusercontent.com/cshum/imagor/master/testdata/gopher.png',
					'mysecret'
				)
			).toEqual(
				'IGEn3TxngivD0jy4uuiZim2bdUCvhcnVi1Nm0xGyd9E=/500x500/top/raw.githubusercontent.com/cshum/imagor/master/testdata/gopher.png'
			);
		});
	});

	describe('isAllowedWidth', () => {
		it('should only allow the fixed widths', () => {
			expect(imagesService.isAllowedWidth(640)).toEqual(true);
			expect(imagesService.isAllowedWidth(641)).toEqual(false);
		});
	});

	describe('parseSourceUrl', () => {
		it('should accept images on the asset servers', () => {
			expect(imagesService.parseSourceUrl(CMS_IMAGE_URL)?.hostname).toEqual(
				'assets-qas.hetarchief.be'
			);
			expect(imagesService.parseSourceUrl(LOGO_URL)?.hostname).toEqual('assets.viaa.be');
		});

		it('should reject other hosts, protocols and invalid urls', () => {
			expect(imagesService.parseSourceUrl('https://evil.com/image.png')).toBeNull();
			expect(
				imagesService.parseSourceUrl('https://assets.hetarchief.be.evil.com/a.png')
			).toBeNull();
			expect(imagesService.parseSourceUrl('http://assets.hetarchief.be/a.png')).toBeNull();
			expect(imagesService.parseSourceUrl('not a url')).toBeNull();
		});
	});

	describe('getCacheKey', () => {
		it('should replace the extension with webp', () => {
			expect(imagesService.getCacheKey(640, new URL(CMS_IMAGE_URL))).toEqual(CMS_IMAGE_KEY);
		});

		it('should add webp to paths without an extension', () => {
			expect(imagesService.getCacheKey(320, new URL(LOGO_URL))).toEqual(
				'IMAGE_CACHE/320/assets.viaa.be/images/OR-154dn75.webp'
			);
		});
	});

	describe('getImage', () => {
		it('should redirect to the cached copy if it exists on the asset server', async () => {
			mockAssetsService.metadata.mockResolvedValueOnce({ LastModified: new Date() });

			const result = await imagesService.getImage(640, new URL(CMS_IMAGE_URL));

			expect(result).toEqual({
				type: 'redirect',
				url: `${ASSET_SERVER_URL}/${CMS_IMAGE_KEY}`,
				cacheControl: CACHE_CONTROL_IMMUTABLE,
			});
			expect(mockFetch).not.toHaveBeenCalled();
		});

		it('should remember cached copies in memory', async () => {
			mockAssetsService.metadata.mockResolvedValueOnce({ LastModified: new Date() });

			await imagesService.getImage(640, new URL(CMS_IMAGE_URL));
			const result = await imagesService.getImage(640, new URL(CMS_IMAGE_URL));

			expect(result.type).toEqual('redirect');
			expect(mockAssetsService.metadata).toHaveBeenCalledTimes(1);
		});

		it('should resize, upload and return the image if it is not cached yet', async () => {
			mockAssetsService.metadata.mockResolvedValueOnce(null);
			mockFetch.mockResolvedValueOnce(imagorResponse());

			const result = await imagesService.getImage(640, new URL(CMS_IMAGE_URL));

			expect(result).toEqual({
				type: 'image',
				buffer: Buffer.from('webp-bytes'),
				cacheControl: CACHE_CONTROL_IMMUTABLE,
			});
			const imagorUrl: string = mockFetch.mock.calls[0][0];
			expect(imagorUrl).toMatch(
				/^http:\/\/imagor\/[A-Za-z0-9_=-]+\/640x0\/filters:format\(webp\):quality\(80\):no_upscale\(\)\/https%3A%2F%2Fassets-qas\.hetarchief\.be%2F/
			);
			expect(mockAssetsService.uploadToObjectStore).toHaveBeenCalledWith(CMS_IMAGE_KEY, {
				originalname: 'image-uuid.webp',
				buffer: Buffer.from('webp-bytes'),
			});
		});

		it('should still return the resized image if the upload fails', async () => {
			mockAssetsService.metadata.mockResolvedValueOnce(null);
			mockAssetsService.uploadToObjectStore.mockRejectedValueOnce(new Error('upload failed'));
			mockFetch.mockResolvedValueOnce(imagorResponse());

			const result = await imagesService.getImage(640, new URL(CMS_IMAGE_URL));

			expect(result.type).toEqual('image');
		});

		it('should only call imagor once for concurrent requests', async () => {
			mockAssetsService.metadata.mockResolvedValue(null);
			mockFetch.mockResolvedValue(imagorResponse());

			const results = await Promise.all([
				imagesService.getImage(640, new URL(CMS_IMAGE_URL)),
				imagesService.getImage(640, new URL(CMS_IMAGE_URL)),
			]);

			expect(results.map((result) => result.type)).toEqual(['image', 'image']);
			expect(mockFetch).toHaveBeenCalledTimes(1);
			mockAssetsService.metadata.mockReset();
			mockFetch.mockReset();
		});

		it('should redirect to the original image if imagor fails, and not retry for a while', async () => {
			mockAssetsService.metadata.mockResolvedValue(null);
			mockFetch.mockResolvedValueOnce(new Response(null, { status: 429 }));

			const result = await imagesService.getImage(640, new URL(CMS_IMAGE_URL));
			const secondResult = await imagesService.getImage(640, new URL(CMS_IMAGE_URL));

			const originalResponse = {
				type: 'redirect',
				url: CMS_IMAGE_URL,
				cacheControl: CACHE_CONTROL_NO_STORE,
			};
			expect(result).toEqual(originalResponse);
			expect(secondResult).toEqual(originalResponse);
			expect(mockFetch).toHaveBeenCalledTimes(1);
			mockAssetsService.metadata.mockReset();
		});

		it('should log a clear message and redirect to the original if imagor is unreachable', async () => {
			mockAssetsService.metadata.mockResolvedValueOnce(null);
			mockFetch.mockRejectedValueOnce(new TypeError('fetch failed'));
			const loggerSpy = vi.spyOn(imagesService['logger'], 'error');

			const result = await imagesService.getImage(640, new URL(CMS_IMAGE_URL));

			expect(result).toEqual({
				type: 'redirect',
				url: CMS_IMAGE_URL,
				cacheControl: CACHE_CONTROL_NO_STORE,
			});
			expect(loggerSpy).toHaveBeenCalledWith(
				`Imagor image optimization service is not available at: http://imagor, falling back to the original: ${CMS_IMAGE_URL}`
			);
		});

		it('should use a short cache time for logos and regenerate them when the cached copy is old', async () => {
			mockAssetsService.metadata.mockResolvedValueOnce({
				LastModified: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
			});
			mockFetch.mockResolvedValueOnce(imagorResponse());

			const result = await imagesService.getImage(320, new URL(LOGO_URL));

			expect(result).toEqual({
				type: 'image',
				buffer: Buffer.from('webp-bytes'),
				cacheControl: CACHE_CONTROL_MUTABLE,
			});
			expect(mockAssetsService.uploadToObjectStore).toHaveBeenCalled();
		});

		it('should redirect to a recent cached logo', async () => {
			mockAssetsService.metadata.mockResolvedValueOnce({ LastModified: new Date() });

			const result = await imagesService.getImage(320, new URL(LOGO_URL));

			expect(result).toEqual({
				type: 'redirect',
				url: `${ASSET_SERVER_URL}/IMAGE_CACHE/320/assets.viaa.be/images/OR-154dn75.webp`,
				cacheControl: CACHE_CONTROL_MUTABLE,
			});
		});
	});
});
