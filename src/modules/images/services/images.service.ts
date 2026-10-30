import { createHmac } from 'node:crypto';

import { AssetsService } from '@meemoo/admin-core-api';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';

import type { Configuration } from '~config';
import {
	CACHE_CONTROL_IMMUTABLE,
	CACHE_CONTROL_MUTABLE,
	CACHE_CONTROL_NO_STORE,
	CACHED_KEY_TTL_IMMUTABLE_MS,
	CACHED_KEY_TTL_MUTABLE_MS,
	FAILED_KEY_TTL_MS,
	IMAGE_CACHE_FOLDER,
	IMAGE_SOURCE_HOST_REGEX,
	IMAGE_WIDTHS,
	IMAGOR_TIMEOUT_MS,
	MUTABLE_IMAGE_MAX_AGE_MS,
	MUTABLE_IMAGE_SOURCE_HOST_REGEX,
} from '~modules/images/images.consts';
import type { ImageResponse } from '~modules/images/images.types';
import { customError } from '~shared/helpers/custom-error';

const CACHE_KEY_PREFIX_CACHED = 'IMAGE_CACHED_';
const CACHE_KEY_PREFIX_FAILED = 'IMAGE_FAILED_';

class ImagorUnavailableError extends Error {}

@Injectable()
export class ImagesService {
	private logger: Logger = new Logger(ImagesService.name, { timestamp: true });

	// Concurrent requests for the same variant share one imagor call and upload
	private inFlightRequests = new Map<string, Promise<ImageResponse>>();

	constructor(
		private configService: ConfigService<Configuration>,
		private assetsService: AssetsService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {}

	public isAllowedWidth(width: number): boolean {
		return IMAGE_WIDTHS.includes(width);
	}

	/**
	 * Returns the parsed url if it points to one of our asset servers, otherwise null
	 */
	public parseSourceUrl(url: string): URL | null {
		try {
			const parsedUrl = new URL(url);
			if (parsedUrl.protocol !== 'https:' || !IMAGE_SOURCE_HOST_REGEX.test(parsedUrl.hostname)) {
				return null;
			}
			return parsedUrl;
		} catch {
			return null;
		}
	}

	/**
	 * Keep in sync with getImageCacheUrl in hetarchief-client src/modules/shared/helpers/optimized-image-urls.ts
	 * eg: IMAGE_CACHE/640/assets-qas.hetarchief.be/hetarchiefv3/CONTENT_BLOCK_IMAGE/image-uuid.webp
	 */
	public getCacheKey(width: number, sourceUrl: URL): string {
		const pathWithoutExtension = sourceUrl.pathname.replace(/\.[a-z0-9]+$/i, '');
		return `${IMAGE_CACHE_FOLDER}/${width}/${sourceUrl.hostname}${pathWithoutExtension}.webp`;
	}

	/**
	 * Imagor must run with IMAGOR_SIGNER_TYPE=sha256 and the same IMAGOR_SECRET
	 * https://docs.imagor.net/security
	 */
	public signImagorPath(imagorPath: string, secret: string): string {
		const signature = createHmac('sha256', secret)
			.update(imagorPath)
			.digest('base64')
			.replace(/\+/g, '-')
			.replace(/\//g, '_');
		return `${signature}/${imagorPath}`;
	}

	public async getImage(width: number, sourceUrl: URL): Promise<ImageResponse> {
		const key = this.getCacheKey(width, sourceUrl);
		const isMutable = MUTABLE_IMAGE_SOURCE_HOST_REGEX.test(sourceUrl.hostname);
		const cacheControl = isMutable ? CACHE_CONTROL_MUTABLE : CACHE_CONTROL_IMMUTABLE;
		const originalResponse: ImageResponse = {
			type: 'redirect',
			url: sourceUrl.href,
			cacheControl: CACHE_CONTROL_NO_STORE,
		};

		if (await this.cacheManager.get(CACHE_KEY_PREFIX_CACHED + key)) {
			return { type: 'redirect', url: this.assetsService.getUrlFromKey(key), cacheControl };
		}
		if (await this.cacheManager.get(CACHE_KEY_PREFIX_FAILED + key)) {
			return originalResponse;
		}

		let inFlightRequest = this.inFlightRequests.get(key);
		if (!inFlightRequest) {
			inFlightRequest = this.getCachedOrGenerateImage(width, sourceUrl, key, isMutable)
				.then((buffer): ImageResponse => {
					if (!buffer) {
						return { type: 'redirect', url: this.assetsService.getUrlFromKey(key), cacheControl };
					}
					return { type: 'image', buffer, cacheControl };
				})
				.catch(async (err): Promise<ImageResponse> => {
					if (err instanceof ImagorUnavailableError) {
						this.logger.error(`${err.message}, falling back to the original: ${sourceUrl.href}`);
					} else {
						this.logger.error(
							customError('Failed to resize image, falling back to the original', err, {
								width,
								sourceUrl: sourceUrl.href,
							})
						);
					}
					await this.cacheManager.set(CACHE_KEY_PREFIX_FAILED + key, true, FAILED_KEY_TTL_MS);
					return originalResponse;
				})
				.finally(() => this.inFlightRequests.delete(key));
			this.inFlightRequests.set(key, inFlightRequest);
		}
		return inFlightRequest;
	}

	/**
	 * Returns null if the image is already cached on the asset server, otherwise the resized image
	 */
	private async getCachedOrGenerateImage(
		width: number,
		sourceUrl: URL,
		key: string,
		isMutable: boolean
	): Promise<Buffer | null> {
		const cachedKeyTtl = isMutable ? CACHED_KEY_TTL_MUTABLE_MS : CACHED_KEY_TTL_IMMUTABLE_MS;

		if (await this.isCachedOnAssetServer(key, isMutable)) {
			await this.cacheManager.set(CACHE_KEY_PREFIX_CACHED + key, true, cachedKeyTtl);
			return null;
		}

		const buffer = await this.resizeImage(width, sourceUrl);

		try {
			await this.assetsService.uploadToObjectStore(key, {
				originalname: key.split('/').pop(),
				buffer,
			});
			await this.cacheManager.set(CACHE_KEY_PREFIX_CACHED + key, true, cachedKeyTtl);
		} catch (err) {
			// The resized image can still be served, it will be uploaded again on the next request
			this.logger.error(
				customError('Failed to upload resized image to the asset server', err, { key })
			);
		}
		return buffer;
	}

	private async isCachedOnAssetServer(key: string, isMutable: boolean): Promise<boolean> {
		try {
			const metadata = await this.assetsService.metadata(key);
			if (!metadata) {
				return false;
			}
			if (isMutable && metadata.LastModified) {
				return Date.now() - metadata.LastModified.getTime() < MUTABLE_IMAGE_MAX_AGE_MS;
			}
			return true;
		} catch {
			// metadata() already logs the error, try to generate the image instead
			return false;
		}
	}

	private async resizeImage(width: number, sourceUrl: URL): Promise<Buffer> {
		const imagorUrl = this.configService.get('IMAGOR_URL');
		const imagorSecret = this.configService.get('IMAGOR_SECRET');
		if (!imagorUrl || !imagorSecret) {
			throw new Error('IMAGOR_URL and IMAGOR_SECRET are not configured');
		}

		const imagorPath = `${width}x0/filters:format(webp):quality(80):no_upscale()/${encodeURIComponent(sourceUrl.href)}`;
		let response: Response;
		try {
			response = await fetch(`${imagorUrl}/${this.signImagorPath(imagorPath, imagorSecret)}`, {
				signal: AbortSignal.timeout(IMAGOR_TIMEOUT_MS),
			});
		} catch {
			throw new ImagorUnavailableError(
				`Imagor image optimization service is not available at: ${imagorUrl}`
			);
		}
		if (!response.ok) {
			if (response.status === 403) {
				throw new Error(
					'Imagor rejected the signature (403), check that IMAGOR_SECRET matches and imagor runs with IMAGOR_SIGNER_TYPE=sha256'
				);
			}
			throw new Error(`Imagor responded with status ${response.status}`);
		}
		return Buffer.from(await response.arrayBuffer());
	}
}
