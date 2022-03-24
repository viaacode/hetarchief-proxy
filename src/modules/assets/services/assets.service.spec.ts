import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import nock from 'nock';

import { Configuration } from '~config';

import { AssetFileType } from '../types';

import { AssetsService } from './assets.service';

const mockConfigService = {
	get: jest.fn((key: keyof Configuration): string | boolean => {
		if (key === 'assetServerTokenEndpoint') {
			return 'http://assettoken/s3';
		}
		if (key === 'assetServerEndpoint') {
			return 'http://hetarchief.assets/';
		}

		return key;
	}),
};

const mockFile: Express.Multer.File = {
	fieldname: 'file',
	originalname: 'image.jpg',
	encoding: '7bit',
	mimetype: 'image/png',
	size: 6714,
	filename: 'ee1c7ce7dc5a8b49ca95fc2f62425edc',
	path: '',
	buffer: null,
	stream: null,
	destination: null,
};

const mockS3Instance = {
	putObject: jest.fn((obj, cb) => cb()),
	deleteObject: jest.fn((obj, cb) => cb()),
};

jest.mock('aws-sdk', () => ({
	S3: jest.fn(() => mockS3Instance),
}));

jest.mock('fs-extra', () => ({
	unlink: jest.fn(),
	readFile: jest.fn(),
	bambajee: jest.fn(),
}));

describe('AssetsService', () => {
	let assetsService: AssetsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AssetsService,
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		}).compile();

		assetsService = module.get<AssetsService>(AssetsService);
	});

	it('services should be defined', () => {
		expect(assetsService).toBeDefined();
	});

	describe('upload', () => {
		it('can upload a file to S3', async () => {
			nock('http://assettoken/s3').post('/').reply(201, {});
			const url = await assetsService.upload(AssetFileType.SPACE_IMAGE, mockFile);
			expect(
				url.startsWith('http://hetarchief.assets/assetServerBucketName/SPACE_IMAGE')
			).toBeTruthy();
		});

		it('throws an exception when the S3 client could not be created', async () => {
			// don't nock the token request triggers the error
			let error;
			try {
				await assetsService.upload(AssetFileType.SPACE_IMAGE, mockFile);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('Failed to get s3 client');
		});

		it('requests a new token if the current token is almost expired', async () => {
			assetsService.setToken({
				token: '2e2fdbeb1d6df787428964f3574ed4d6',
				owner: 'hetarchief-s3',
				scope: '+hetarchief-int',
				expiration: new Date().toISOString(),
				creation: '2019-12-17T19:10:38.000Z',
				secret: 'jWX47N9Sa6v2txQDaD7kyjfXa3gA2m2m',
			});
			nock('http://assettoken/s3').post('/').reply(201, {});
			const url = await assetsService.upload(AssetFileType.SPACE_IMAGE, mockFile);
			expect(
				url.startsWith('http://hetarchief.assets/assetServerBucketName/SPACE_IMAGE')
			).toBeTruthy();
		});

		it('throws an exception if the file could not be uploaded to S3', async () => {
			nock('http://assettoken/s3').post('/').reply(201, {});
			mockS3Instance.putObject.mockImplementationOnce(() => {
				throw new Error('AWS error');
			});
			let error;
			try {
				await assetsService.upload(AssetFileType.SPACE_IMAGE, mockFile);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('Failed to upload asset to the s3 asset service');
		});

		it('the promise is rejected if file could not be uploaded to S3', async () => {
			nock('http://assettoken/s3').post('/').reply(201, {});
			mockS3Instance.putObject.mockImplementationOnce((obj, cb) => {
				cb(new Error('AWS error'));
			});
			let error;
			try {
				await assetsService.upload(AssetFileType.SPACE_IMAGE, mockFile);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('Failed to upload asset to the s3 asset service');
		});
	});

	describe('delete', () => {
		it('can delete a file from S3', async () => {
			nock('http://assettoken/s3').post('/').reply(201, {});
			const deleted = await assetsService.delete(
				'http://hetarchief.assets/assetServerBucketName/SPACE_IMAGE/image.jpg'
			);
			expect(deleted).toBeTruthy();
		});

		it('throws an exception if the file could not be deleted from S3', async () => {
			nock('http://assettoken/s3').post('/').reply(201, {});
			mockS3Instance.deleteObject.mockImplementationOnce(() => {
				throw new Error('AWS error');
			});
			let error;
			try {
				await assetsService.delete(
					'http://hetarchief.assets/assetServerBucketName/SPACE_IMAGE/image.jpg'
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('Failed to delete asset from S3');
		});

		it('the promise is rejected if file could not be deleted from S3', async () => {
			nock('http://assettoken/s3').post('/').reply(201, {});
			mockS3Instance.deleteObject.mockImplementationOnce((obj, cb) => {
				cb(new Error('AWS error'));
			});
			let error;
			try {
				await assetsService.delete(
					'http://hetarchief.assets/assetServerBucketName/SPACE_IMAGE/image.jpg'
				);
			} catch (e) {
				error = e;
			}
			expect(error.message).toEqual('Failed to delete asset from S3');
		});
	});
});
