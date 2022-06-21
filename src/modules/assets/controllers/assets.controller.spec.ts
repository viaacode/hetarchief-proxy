import { Test, TestingModule } from '@nestjs/testing';

import { AssetsService } from '../services/assets.service';

import { AssetsController } from './assets.controller';

import { TranslationsService } from '~modules/translations/services/translations.service';
import { mockTranslationsService } from '~shared/helpers/mockTranslationsService';

const mockAssetsService: Partial<Record<keyof AssetsService, jest.SpyInstance>> = {
	upload: jest.fn(),
	delete: jest.fn(),
};

const mockUploadUrl = 'http//my-s3-bucket.com/my-asset.png';

describe('AssetsController', () => {
	let assetsController: AssetsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AssetsController],
			imports: [],
			providers: [
				{
					provide: AssetsService,
					useValue: mockAssetsService,
				},
				{
					provide: TranslationsService,
					useValue: mockTranslationsService,
				},
			],
		}).compile();

		assetsController = module.get<AssetsController>(AssetsController);
	});

	it('should be defined', () => {
		expect(assetsController).toBeDefined();
	});

	describe('uploadAsset', () => {
		it('should return the asset url', async () => {
			mockAssetsService.upload.mockResolvedValueOnce(mockUploadUrl);

			const response = await assetsController.uploadAsset({} as Express.Multer.File);

			expect(response).toEqual({
				url: mockUploadUrl,
			});
		});
	});

	describe('deleteAsset', () => {
		it('should delete asset from s3', async () => {
			await assetsController.deleteAsset({
				url: mockUploadUrl,
			});

			expect(mockAssetsService.delete).toHaveBeenCalledTimes(1);
		});
	});
});
