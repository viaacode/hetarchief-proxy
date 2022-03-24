import path from 'path';

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AWS, { AWSError, S3 } from 'aws-sdk';
import fse from 'fs-extra';
import got, { Got } from 'got';
import _, { kebabCase } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { AssetFileType, AssetToken } from '../types';

import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class AssetsService {
	private logger: Logger = new Logger(AssetsService.name, { timestamp: true });
	private token: AssetToken;

	private gotInstance: Got;
	private s3: S3;

	constructor(protected dataService: DataService, protected configService: ConfigService) {
		this.gotInstance = got.extend({
			prefixUrl: this.configService.get('assetServerTokenEndpoint'),
			resolveBodyOnly: true,
			username: this.configService.get('assetServerTokenUsername'),
			password: this.configService.get('assetServerTokenPassword'),
			responseType: 'json',
			headers: {
				'cache-control': 'no-cache',
				'X-User-Secret-Key-Meta': this.configService.get('assetServerTokenSecret'),
			},
		});
	}

	/**
	 * Returns an s3 client object which contains an up-to-date token to communicate with the s3 server
	 *
	 * A token is requested using this post request:
	 * curl
	 *   -X POST
	 *   -H "X-User-Secret-Key-Meta: myLittleSecret"
	 *   -u hetarchief-s3:*****************
	 *   https://s3-qas.do.viaa.be/_admin/manage/tenants/hetarchief-int/tokens
	 *
	 * Example token:
	 * {
	 * 	"token": "2e2fdbeb1d6df787428964f3574ed4d6",
	 * 	"owner": "hetarchief-s3",
	 * 	"scope": "+hetarchief-int",
	 * 	"expiration": "2019-12-18T19:10:38.947Z",
	 * 	"creation": "2019-12-17T19:10:38.000Z",
	 * 	"secret": "jWX47N9Sa6v2txQDaD7kyjfXa3gA2m2m"
	 * }
	 */
	private async getS3Client(): Promise<S3> {
		try {
			const tokenExpiry = new Date(_.get(this.token, 'expiration')).getTime();
			const now = new Date().getTime();
			const fiveMinutes = 5 * 60 * 1000;
			if (!this.token || tokenExpiry - fiveMinutes < now) {
				// Take 5 minutes margin, to ensure we get a new token well before is expires
				try {
					const response = await this.gotInstance.post<AssetToken>('', {
						resolveBodyOnly: true, // this is duplicate but fixes a typing error
					});
					this.token = response;
					this.logger.log(response);

					this.s3 = new AWS.S3({
						accessKeyId: this.token.token,
						secretAccessKey: this.token.secret,
						endpoint: `${this.configService.get(
							'assetServerEndpoint'
						)}/${this.configService.get('assetServerBucketName')}`,
						s3BucketEndpoint: true,
					});
				} catch (err) {
					throw new InternalServerErrorException({
						message: 'Failed to get new s3 token for the asset service',
						error: err,
					});
				}
			}

			return this.s3;
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to get s3 client',
				error: err,
				token: this.token,
			});
		}
	}

	public async upload(assetFiletype: AssetFileType, file: Express.Multer.File): Promise<string> {
		const parsedFilename = path.parse(file.originalname);
		const key = `${assetFiletype}/${kebabCase(parsedFilename.name)}-${uuidv4()}${
			parsedFilename.ext
		}`;

		// Save meta info in the database so we can find this file when we implement the asset library
		const url = await this.uploadToObjectStore(key, file);

		// Remove temp file from temp folder, since it should be uploaded to the asset server now
		await fse.unlink(file.path);
		return url;
	}

	public async uploadToObjectStore(key: string, file: Express.Multer.File): Promise<string> {
		const [s3Client, fileContents] = await Promise.all([
			this.getS3Client(),
			fse.readFile(file.path),
		]);
		return new Promise<string>((resolve, reject) => {
			try {
				s3Client.putObject(
					{
						Key: key,
						Body: fileContents,
						ACL: 'public-read',
						ContentType: file.mimetype,
						Bucket: this.configService.get('assetServerBucketName'),
					},
					(err: AWSError) => {
						if (err) {
							const error = new InternalServerErrorException({
								message: 'Failed to upload asset to the s3 asset service',
								error: err,
							});
							this.logger.error(error);
							reject(error);
						} else {
							const url = new URL(this.configService.get('assetServerEndpoint'));
							url.pathname = `${this.configService.get(
								'assetServerBucketName'
							)}/${key}`;
							resolve(url.href);
						}
					}
				);
			} catch (err) {
				const error = new InternalServerErrorException({
					message: 'Failed to upload asset to the asset service',
					error: err,
				});
				this.logger.error(error);
				reject(error);
			}
		});
	}

	public async delete(url: string) {
		const s3Client: S3 = await this.getS3Client();
		return new Promise<void>((resolve, reject) => {
			try {
				s3Client.deleteObject(
					{
						Key: url
							.split(`/${this.configService.get('assetServerBucketName')}/`)
							.pop(),
						Bucket: this.configService.get('assetServerBucketName'),
					},
					(err: AWSError) => {
						if (err) {
							const error = new InternalServerErrorException({
								message: 'Failed to delete asset from the s3 asset service',
								error: err,
								url,
							});
							this.logger.error(error);
							reject(error);
						} else {
							resolve();
						}
					}
				);
			} catch (err) {
				const error = new InternalServerErrorException({
					message: 'Failed to delete asset from S3',
					error: err,
				});
				this.logger.error(error);
				reject(error);
			}
		});
	}
}
