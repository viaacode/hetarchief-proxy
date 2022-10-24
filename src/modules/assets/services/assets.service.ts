import path from 'path';

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import AWS, { AWSError, S3 } from 'aws-sdk';
import fse from 'fs-extra';
import got, { Got } from 'got';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { Configuration } from '~config';

import { AssetFileType, AssetToken } from '../types';

@Injectable()
export class AssetsService {
	private logger: Logger = new Logger(AssetsService.name, { timestamp: true });
	private token: AssetToken;

	private gotInstance: Got;
	private s3: S3;

	constructor(protected configService: ConfigService<Configuration>) {
		this.gotInstance = got.extend({
			prefixUrl: this.configService.get('ASSET_SERVER_TOKEN_ENDPOINT'),
			resolveBodyOnly: true,
			username: this.configService.get('ASSET_SERVER_TOKEN_USERNAME'),
			password: this.configService.get('ASSET_SERVER_TOKEN_PASSWORD'),
			responseType: 'json',
			headers: {
				'cache-control': 'no-cache',
				'X-User-Secret-Key-Meta': this.configService.get('ASSET_SERVER_TOKEN_SECRET'),
			},
		});
	}

	public setToken(assetToken: AssetToken) {
		this.token = assetToken;
	}

	@Cron('0 4 * * *')
	public async emptyUploadFolder(): Promise<boolean> {
		try {
			await fse.emptyDir(this.configService.get('TEMP_ASSET_FOLDER'));
			this.logger.log(
				`CRON: upload folder '${this.configService.get('TEMP_ASSET_FOLDER')}' emptied`
			);
		} catch (e) {
			this.logger.error({
				message: `CRON error emptying upload folder ${this.configService.get(
					'TEMP_ASSET_FOLDER'
				)} `,
				error: new Error(),
			});
			return false;
		}

		return true;
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
							'ASSET_SERVER_ENDPOINT'
						)}/${this.configService.get('ASSET_SERVER_BUCKET_NAME')}`,
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
		const key = `${assetFiletype}/${_.kebabCase(parsedFilename.name)}-${uuidv4()}${
			parsedFilename.ext
		}`;

		return this.uploadToObjectStore(key, file);
	}

	public async uploadToObjectStore(key: string, file: Express.Multer.File): Promise<string> {
		const s3Client = await this.getS3Client();

		let fileBody;
		if (file.buffer) {
			fileBody = file.buffer;
		} else {
			fileBody = await fse.readFile(file.path);
		}

		// eslint-disable-next-line no-async-promise-executor
		return new Promise<string>(async (resolve, reject) => {
			try {
				s3Client.putObject(
					{
						Key: key,
						Body: fileBody,
						ACL: 'public-read',
						ContentType: file.mimetype,
						Bucket: this.configService.get('ASSET_SERVER_BUCKET_NAME'),
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
							const url = new URL(this.configService.get('ASSET_SERVER_ENDPOINT'));
							url.pathname = `${this.configService.get(
								'ASSET_SERVER_BUCKET_NAME'
							)}/${key}`;
							resolve(url.href);
						}
					}
				);
			} catch (err) {
				const error = new InternalServerErrorException({
					message: 'Failed to upload asset to the s3 asset service',
					error: err,
				});
				this.logger.error(error);
				reject(error);
			}
			if (!file.buffer) {
				fse.unlink(file.path)?.catch((err) =>
					this.logger.error({
						message: 'Failed to remove file from tmp folder after upload to s3',
						innerException: err,
					})
				);
			}
		});
	}

	public async delete(url: string) {
		const s3Client: S3 = await this.getS3Client();
		return new Promise<boolean>((resolve, reject) => {
			try {
				s3Client.deleteObject(
					{
						Key: url
							.split(`/${this.configService.get('ASSET_SERVER_BUCKET_NAME')}/`)
							.pop(),
						Bucket: this.configService.get('ASSET_SERVER_BUCKET_NAME'),
					},
					(err: AWSError) => {
						if (err) {
							const error = new InternalServerErrorException({
								message: 'Failed to delete asset from S3',
								error: err,
								url,
							});
							this.logger.error(error);
							reject(error);
						} else {
							resolve(true);
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
