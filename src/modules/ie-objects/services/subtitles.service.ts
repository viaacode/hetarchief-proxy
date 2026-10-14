import { GetObjectCommand, NoSuchKey, S3Client } from '@aws-sdk/client-s3';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { convertSrtToVtt, decodeSubtitleBytes } from '../helpers/subtitles';

import { Configuration } from '~config';
import { customError } from '~shared/helpers/custom-error';

@Injectable()
export class SubtitlesService {
	// One client per gateway origin (in practice only the ALTO_S3_ENDPOINT), reused across requests
	private s3Clients = new Map<string, S3Client>();

	constructor(private configService: ConfigService<Configuration>) {}

	/**
	 * Reads the subtitle file from its s3 location and returns it as WebVTT.
	 * Any permission checks need to happen before this point, this does not check any permissions.
	 * @param storedAt The premis_stored_at of the subtitle file, eg: https://s3-int.do.viaa.be/alto/<path>.srt
	 */
	public async getVtt(storedAt: string): Promise<string> {
		try {
			// The AI transcripts live in a private bucket on the meemoo S3 gateway, next to the ALTO files.
			// Only a stored_at on exactly that gateway origin is ever read, whatever the graph says.
			// Fails closed when not configured. The origin includes scheme and port, since the signed request goes there.
			const gatewayHost = this.configService.get('ALTO_S3_ENDPOINT');
			if (!gatewayHost) {
				throw new Error('ALTO_S3_ENDPOINT is not configured');
			}
			const { origin, pathname } = new URL(storedAt);
			if (origin !== `https://${gatewayHost.toLowerCase()}`) {
				throw new Error(`Subtitle file is not stored on a whitelisted the s3 bucket: ${origin}`);
			}

			// Path style: /<bucket>/<key>
			const [bucket, ...keyParts] = decodeURIComponent(pathname).replace(/^\//, '').split('/');
			const key = keyParts.join('/');
			if (!bucket || !key) {
				throw new Error('Subtitle file location has no bucket or key');
			}

			const response = await this.getS3Client(origin).send(
				new GetObjectCommand({ Bucket: bucket, Key: key })
			);
			return convertSrtToVtt(decodeSubtitleBytes(await response.Body.transformToByteArray()));
		} catch (err) {
			if (err instanceof NoSuchKey) {
				throw new NotFoundException('The subtitle file does not exist');
			}
			throw customError('Failed to read subtitle file', err, { storedAt });
		}
	}

	private getS3Client(origin: string): S3Client {
		const accessKeyId = this.configService.get('ALTO_S3_ACCESS_KEY_ID');
		const secretAccessKey = this.configService.get('ALTO_S3_SECRET_ACCESS_KEY');
		if (!accessKeyId || !secretAccessKey) {
			throw new Error('ALTO_S3_ACCESS_KEY_ID and ALTO_S3_SECRET_ACCESS_KEY are not configured');
		}

		let s3Client = this.s3Clients.get(origin);
		if (!s3Client) {
			s3Client = new S3Client({
				endpoint: origin,
				credentials: { accessKeyId, secretAccessKey },
				region: 'eu-west-1', // Required but ignored by S3-compatible storage
				forcePathStyle: true,
			});
			this.s3Clients.set(origin, s3Client);
		}
		return s3Client;
	}
}
