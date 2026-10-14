import { NotFoundException } from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NoSuchKey } from '@aws-sdk/client-s3';
import { SubtitlesService } from './subtitles.service';

const mockSend = vi.fn();
const mockS3Client = vi.fn();

vi.mock('@aws-sdk/client-s3', () => ({
	S3Client: class {
		constructor(config: unknown) {
			mockS3Client(config);
		}
		send = mockSend;
	},
	GetObjectCommand: class {
		constructor(public input: unknown) {}
	},
	NoSuchKey: class NoSuchKey extends Error {},
}));

const mockConfigService = { get: vi.fn() };

const srt = '1\n00:00:01,500 --> 00:00:03,000\nHallo\n';
const storedAt = 'https://s3-int.do.viaa.be/alto/give-speech/transcripts/9z9089fx9s.srt';

describe('SubtitlesService', () => {
	let service: SubtitlesService;

	beforeEach(() => {
		service = new SubtitlesService(mockConfigService as any);
		mockConfigService.get.mockImplementation((key: string) => {
			const values: Record<string, string> = {
				ALTO_S3_ACCESS_KEY_ID: 'access-key',
				ALTO_S3_SECRET_ACCESS_KEY: 'secret-key',
				ALTO_S3_ENDPOINT: 's3-int.do.viaa.be',
			};
			return values[key];
		});
		mockSend.mockResolvedValue({ Body: { transformToString: async () => srt } });
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('reads the file from the bucket in the stored_at and converts it to vtt', async () => {
		const vtt = await service.getVtt(storedAt);

		expect(vtt).toEqual('WEBVTT\n\n1\n00:00:01.500 --> 00:00:03.000\nHallo\n');
		expect(mockS3Client).toHaveBeenCalledWith(
			expect.objectContaining({
				endpoint: 'https://s3-int.do.viaa.be',
				forcePathStyle: true,
				credentials: { accessKeyId: 'access-key', secretAccessKey: 'secret-key' },
			})
		);
		expect(mockSend.mock.calls[0][0].input).toEqual({
			Bucket: 'alto',
			Key: 'give-speech/transcripts/9z9089fx9s.srt',
		});
	});

	it('refuses a location that is not on the s3 gateway', async () => {
		await expect(service.getVtt('https://example.com/alto/file.srt')).rejects.toThrow(
			'Failed to read subtitle file'
		);

		expect(mockSend).not.toHaveBeenCalled();
	});

	it.each([
		['plain http', 'http://s3-int.do.viaa.be/alto/file.srt'],
		['another port', 'https://s3-int.do.viaa.be:8443/alto/file.srt'],
	])('refuses the gateway host over %s', async (_label, location) => {
		await expect(service.getVtt(location)).rejects.toThrow('Failed to read subtitle file');

		expect(mockS3Client).not.toHaveBeenCalled();
		expect(mockSend).not.toHaveBeenCalled();
	});

	it('refuses a location without a bucket and key', async () => {
		await expect(service.getVtt('https://s3-int.do.viaa.be/alto')).rejects.toThrow();

		expect(mockSend).not.toHaveBeenCalled();
	});

	it('reuses the s3 client for the same gateway', async () => {
		await service.getVtt(storedAt);
		await service.getVtt(storedAt);

		expect(mockS3Client).toHaveBeenCalledTimes(1);
		expect(mockSend).toHaveBeenCalledTimes(2);
	});

	it('responds with a not found when the file does not exist in the bucket', async () => {
		mockSend.mockRejectedValueOnce(new NoSuchKey({ message: 'nope', $metadata: {} }));

		await expect(service.getVtt(storedAt)).rejects.toThrow(NotFoundException);
	});

	it('refuses every location when the gateway host is not configured', async () => {
		mockConfigService.get.mockImplementation((key: string) =>
			key === 'ALTO_S3_ENDPOINT' ? undefined : 'value'
		);

		await expect(service.getVtt(storedAt)).rejects.toThrow('Failed to read subtitle file');
		expect(mockS3Client).not.toHaveBeenCalled();
		expect(mockSend).not.toHaveBeenCalled();
	});

	it('fails when the s3 credentials are not configured', async () => {
		mockConfigService.get.mockImplementation((key: string) =>
			key === 'ALTO_S3_ENDPOINT' ? 's3-int.do.viaa.be' : undefined
		);

		await expect(service.getVtt(storedAt)).rejects.toThrow('Failed to read subtitle file');
		expect(mockS3Client).not.toHaveBeenCalled();
		expect(mockSend).not.toHaveBeenCalled();
	});
});
