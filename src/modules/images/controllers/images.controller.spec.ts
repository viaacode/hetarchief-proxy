import { BadRequestException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import type { Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CACHE_CONTROL_IMMUTABLE } from '~modules/images/images.consts';
import { ImagesService } from '~modules/images/services/images.service';
import { TestingLogger } from '~shared/logging/test-logger';

import { ImagesController } from './images.controller';

const CMS_IMAGE_URL =
	'https://assets-qas.hetarchief.be/hetarchiefv3/CONTENT_BLOCK_IMAGE/image-uuid.png';

const mockImagesService = {
	isAllowedWidth: vi.fn(),
	parseSourceUrl: vi.fn(),
	getImage: vi.fn(),
};

function getMockResponse() {
	return {
		setHeader: vi.fn(),
		redirect: vi.fn(),
		send: vi.fn(),
	};
}

describe('ImagesController', () => {
	let imagesController: ImagesController;

	beforeEach(async () => {
		vi.clearAllMocks();
		mockImagesService.isAllowedWidth.mockReturnValue(true);
		mockImagesService.parseSourceUrl.mockReturnValue(new URL(CMS_IMAGE_URL));

		const module: TestingModule = await Test.createTestingModule({
			controllers: [ImagesController],
			providers: [{ provide: ImagesService, useValue: mockImagesService }],
		})
			.setLogger(new TestingLogger())
			.compile();

		imagesController = module.get<ImagesController>(ImagesController);
	});

	it('should reject widths that are not allowed', async () => {
		mockImagesService.isAllowedWidth.mockReturnValueOnce(false);
		const res = getMockResponse();

		await expect(
			imagesController.getImage(641, { url: CMS_IMAGE_URL }, res as unknown as Response)
		).rejects.toThrow(BadRequestException);
	});

	it('should reject urls outside the asset servers', async () => {
		mockImagesService.parseSourceUrl.mockReturnValueOnce(null);
		const res = getMockResponse();

		await expect(
			imagesController.getImage(640, { url: 'https://evil.com/a.png' }, res as unknown as Response)
		).rejects.toThrow(BadRequestException);
		expect(res.redirect).not.toHaveBeenCalled();
	});

	it('should redirect with cache headers', async () => {
		mockImagesService.getImage.mockResolvedValueOnce({
			type: 'redirect',
			url: 'https://assets-qas.hetarchief.be/hetarchiefv3/IMAGE_CACHE/640/a.webp',
			cacheControl: CACHE_CONTROL_IMMUTABLE,
		});
		const res = getMockResponse();

		await imagesController.getImage(640, { url: CMS_IMAGE_URL }, res as unknown as Response);

		expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', CACHE_CONTROL_IMMUTABLE);
		expect(res.setHeader).toHaveBeenCalledWith('Cross-Origin-Resource-Policy', 'cross-origin');
		expect(res.redirect).toHaveBeenCalledWith(
			302,
			'https://assets-qas.hetarchief.be/hetarchiefv3/IMAGE_CACHE/640/a.webp'
		);
	});

	it('should send the resized image', async () => {
		const buffer = Buffer.from('webp-bytes');
		mockImagesService.getImage.mockResolvedValueOnce({
			type: 'image',
			buffer,
			cacheControl: CACHE_CONTROL_IMMUTABLE,
		});
		const res = getMockResponse();

		await imagesController.getImage(640, { url: CMS_IMAGE_URL }, res as unknown as Response);

		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/webp');
		expect(res.send).toHaveBeenCalledWith(buffer);
	});
});
