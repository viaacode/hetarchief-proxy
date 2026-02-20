import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DataService, MediahavenService } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAfter, isPast, parseISO, subHours, subMinutes } from 'date-fns';
import { compact } from 'lodash';
import { stringifyUrl } from 'query-string';
import { Configuration } from '~config';
import {
	GetFileStoredAtByIeObjectIdDocument,
	GetFileStoredAtByIeObjectIdQuery,
	GetFileStoredAtByIeObjectIdQueryVariables,
	GetFileStoredAtByRepresentationIdDocument,
	GetFileStoredAtByRepresentationIdQuery,
	GetFileStoredAtByRepresentationIdQueryVariables,
	GetMhIdentifiersFromPartialMhIdentifierDocument,
	GetMhIdentifiersFromPartialMhIdentifierQuery,
	GetMhIdentifiersFromPartialMhIdentifierQueryVariables,
	Lookup_App_Material_Request_Download_Status_Enum,
} from '~generated/graphql-db-types-hetarchief';
import { EmailTemplate } from '~modules/campaign-monitor/campaign-monitor.types';
import { MaterialRequest, MaterialRequestForDownload } from '~modules/material-requests/material-requests.types';
import { MaterialRequestsService } from '~modules/material-requests/services/material-requests.service';
import {
	CreateMamJob,
	GetMamExportsResponse,
	MamAccessToken,
	MamExportQuality,
	MamJobStatus,
	MediahavenJobInfo,
	MediaHavenRecord,
	S3ExportLocationToken,
} from '~modules/mediahaven-jobs-watcher/mediahaven-jobs-watcher.types';
import { UsersService } from '~modules/users/services/users.service';

@Injectable()
export class MediahavenJobsWatcherService {
	private s3DownloadLocationToken: S3ExportLocationToken | null = null;

	constructor(
		private configService: ConfigService<Configuration>,
		@Inject(forwardRef(() => MaterialRequestsService))
		private materialRequestsService: MaterialRequestsService,
		private dataService: DataService,
		private mediahavenService: MediahavenService,
		private usersService: UsersService
	) {}

	private async getAccessToken(): Promise<MamAccessToken> {
		return this.mediahavenService.getAccessToken({
			tokenEndpoint: this.configService.get('MEDIAHAVEN_TOKEN_ENDPOINT'),
			username: this.configService.get('MEDIAHAVEN_TOKEN_USERNAME'),
			password: this.configService.get('MEDIAHAVEN_TOKEN_PASSWORD'),
			clientId: this.configService.get('MEDIAHAVEN_TOKEN_CLIENT_ID'),
			clientSecret: this.configService.get('MEDIAHAVEN_TOKEN_CLIENT_SECRET'),
		});
	}

	/**
	 * Try to create a new job, since the last one failed to timed-out. If the number of retries in not too high and not too fast after the last try.
	 * @param materialRequest
	 * @return boolean indicating whether the job failed (true), was delayed (false) or was retried (false)
	 */
	private async retryDownloadJobOrFail(
		materialRequest: MaterialRequestForDownload
	): Promise<boolean> {
		// No jobs present in Mediahaven for this material request
		const updatedAt = new Date(materialRequest.updatedAt);
		// If the material request was updated less than 1 hour ago, wait before retrying
		if (isAfter(updatedAt, subHours(new Date(), 1))) {
			// Skip this material request for now
			// Maybe there is an issue with the api, so we'll try again in 1 hour after the last attempt
			return false;
		}
		// Check if we can retry creating the export job
		if ((materialRequest.downloadRetries || 0) < 3) {
			// Retry creating the export job
			await this.createExportJob(materialRequest);
			return false;
		}
		// Max retries reached, mark as failed
		await this.materialRequestsService.updateMaterialRequest(materialRequest.id, {
			download_status: Lookup_App_Material_Request_Download_Status_Enum.Failed,
			updated_at: new Date().toISOString(),
		});
		return true;
	}

	public async checkUnresolvedJobs() {
		try {
			const jobs: MediahavenJobInfo[] = await this.getJobsFromMediahaven();
			const unresolvedMaterialRequests: MaterialRequestForDownload[] =
				await this.materialRequestsService.findAllWithUnresolvedDownload();

			/**
			 * This follows the flow diagram for checking Mediahaven jobs for material requests:
			 * https://drive.google.com/file/d/1w2MRcTxzTsXjivATFEvaDkv99tMxnUqF/view?usp=sharing
			 */
			const reportItems = {
				started: 0,
				pending: 0,
				completed: 0,
				restarted: 0,
				failed: 0,
				alreadyExists: 0,
			};
			for (const materialRequest of unresolvedMaterialRequests) {
				const relatedJob = jobs.find((job) => {
					return materialRequest.downloadJobId === job.ExportJobId;
				});
				if (!relatedJob) {
					await this.retryDownloadJobOrFail(materialRequest);
					reportItems.started += 1;
				} else {
					// One job found
					switch (relatedJob.Status) {
						case MamJobStatus.Waiting:
						case MamJobStatus.InProgress:
							// Job is still in progress, set material request download status to PENDING
							await this.materialRequestsService.updateMaterialRequest(materialRequest.id, {
								download_status: Lookup_App_Material_Request_Download_Status_Enum.Pending,
								updated_at: new Date().toISOString(),
							});
							reportItems.pending += 1;
							break;
						case MamJobStatus.Completed: {
							// Job is completed, update material request with download URL and set status to SUCCEEDED
							const updatedRequest = await this.materialRequestsService.updateMaterialRequest(
								materialRequest.id,
								{
									download_url: `${this.getDownloadFolderPath(materialRequest)}/${relatedJob.Name}`,
									download_status: Lookup_App_Material_Request_Download_Status_Enum.Succeeded,
									updated_at: new Date().toISOString(),
									download_available_at: relatedJob.FinishDate,
								}
							);
							const requester = await this.usersService.getById(updatedRequest.requesterId);
							reportItems.completed += 1;

							try {
								await Promise.all([
									this.materialRequestsService.sentStatusUpdateEmail(
										EmailTemplate.MATERIAL_REQUEST_DOWNLOAD_READY_MAINTAINER,
										updatedRequest,
										requester
									),
									this.materialRequestsService.sentStatusUpdateEmail(
										EmailTemplate.MATERIAL_REQUEST_DOWNLOAD_READY_REQUESTER,
										updatedRequest,
										requester
									),
								]);
							} catch (err) {
								// Log the error but don't throw, since the main flow of updating the material request is successful
								console.error('Failed to send material request export job completed emails', err, {
									materialRequestId: materialRequest.id,
									requesterId: updatedRequest.requesterId,
								});
							}

							break;
						}

						case MamJobStatus.Failed:
						case MamJobStatus.Cancelled: {
							const hasFailed = await this.retryDownloadJobOrFail(materialRequest);
							if (hasFailed) {
								reportItems.failed += 1;
							} else {
								reportItems.restarted += 1;
							}
							break;
						}

						case MamJobStatus.AlreadyExists:
							await this.materialRequestsService.updateMaterialRequest(materialRequest.id, {
								download_status: Lookup_App_Material_Request_Download_Status_Enum.Failed,
								updated_at: new Date().toISOString(),
							});
							reportItems.alreadyExists += 1;
							break;

						default:
							throw new CustomError('Unknown Mediahaven job status received', null, {
								materialRequestId: materialRequest.id,
								jobStatus: relatedJob.Status,
							});
					}
				}
			}
			console.log('Mediahaven jobs check report', reportItems);
		} catch (err) {
			throw new CustomError('Error checking mediahaven jobs', err);
		}
	}

	public async checkAlmostExpiredDownloads() {
		try {
			const almostExpiredMaterialRequests: MaterialRequest[] =
				await this.materialRequestsService.findAllWithAlmostExpiredDownload();

			for (const materialRequest of almostExpiredMaterialRequests) {
				try {
					const requester = await this.usersService.getById(materialRequest.profileId);
					await this.materialRequestsService.sentStatusUpdateEmail(
						EmailTemplate.MATERIAL_REQUEST_DOWNLOAD_EXPIRE_SOON,
						materialRequest,
						requester
					);
					await this.materialRequestsService.updateMaterialRequest(materialRequest.id, {
						download_expiry_warning_email_sent: true,
					});
				} catch (err) {
					// Log the error but don't throw, since the main flow of updating the material request is successful
					console.error('Failed to send material request almost expired download email', err, {
						materialRequestId: materialRequest.id,
						requesterId: materialRequest.requesterId,
					});
				}
			}
		} catch (err) {
			throw new CustomError('Error checking almost expired material request downloads', err);
		}
	}

	private getDownloadFolderPath(materialRequest: MaterialRequestForDownload): string {
		return `${materialRequest.id}/${materialRequest?.downloadRetries ?? 0}`;
	}

	/**
	 * Create an export job in Mediahaven for the given material request.
	 * @param materialRequest
	 * @return The ID of the created export job.
	 */
	public async createExportJob(materialRequest: MaterialRequestForDownload): Promise<string> {
		let url: string | null = null;
		let body: CreateMamJob | null = null;
		try {
			if (materialRequest.objectRepresentationId) {
				// User has access to essence of the ie object, and wants to export a specific video (representation)
				const mhFragmentId = await this.getMhFragmentIdByRepresentationId(
					materialRequest.objectRepresentationId
				);
				const startTime = materialRequest.reuseForm.startTime;
				const endTime = materialRequest.reuseForm.endTime;

				let partial = null;
				if (startTime || endTime) {
					const record = await this.getMediaHavenMetadataByRecordId(mhFragmentId);
					const framerate: number = Number.parseInt(record?.Technical?.VideoFps || '25', 10);
					partial = {
						Type: 'Frames',
						Start: startTime * framerate,
						End: endTime * framerate,
					};
				}

				body = {
					Records: [
						{
							RecordId: mhFragmentId,
							...(partial ? { Partial: partial } : {}),
						},
					],
					ExportLocationId: this.configService.get('MEDIAHAVEN_EXPORT_LOCATION_ID'),
					DestinationPath: this.getDownloadFolderPath(materialRequest),
					ExportSource:
						materialRequest.reuseForm.downloadQuality === 'HIGH'
							? MamExportQuality.ORIGINAL
							: MamExportQuality.ACCESS,
					Reason: `Export for hetarchief.be material request ${materialRequest.id}`,
					Tag: this.configService.get('MEDIAHAVEN_EXPORT_JOBS_TAG'),
				};
			} else {
				// User does not have access to the essence of the ie object, export all materials linked to the ie object
				const mhFragmentIds = await this.getAllMhFragmentIdsByIeObjectId(materialRequest.objectId);
				body = {
					Records: mhFragmentIds.map((mhFragmentId) => ({
						RecordId: mhFragmentId,
					})),
					ExportLocationId: this.configService.get('MEDIAHAVEN_EXPORT_LOCATION_ID'),
					DestinationPath: this.getDownloadFolderPath(materialRequest),
					ExportSource:
						materialRequest.reuseForm.downloadQuality === 'HIGH'
							? MamExportQuality.ORIGINAL
							: MamExportQuality.ACCESS,
					Reason: `Export for hetarchief.be material request ${materialRequest.id}`,
					Tag: this.configService.get('MEDIAHAVEN_EXPORT_JOBS_TAG'),
				};
			}

			const accessToken = await this.getAccessToken();
			url = stringifyUrl({
				url: `${this.configService.get('MEDIAHAVEN_API_ENDPOINT')}/exports`,
			});
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: `bearer ${accessToken.token.access_token}`,
				},
				body: JSON.stringify(body),
			});
			if (response.status < 200 || response.status >= 400) {
				let responseBody: any;
				try {
					responseBody = await response.json();
				} catch (err) {
					// ignore error, we don't need the response body perse
				}
				throw new CustomError(
					'Error received when creating mediahaven export job',
					response?.statusText,
					{
						status: response.status,
						statusText: response.statusText,
						responseBody,
					}
				);
			}
			const responseJobs = (await response.json()) as MediahavenJobInfo[];
			const job = responseJobs[0];
			if (!job) {
				throw new CustomError(
					'No export job returned from mediahaven when creating export job',
					null,
					{
						response,
					}
				);
			}
			const jobId = job.ExportJobId;

			// Update material request with these export job ids and increment retries
			await this.materialRequestsService.updateMaterialRequest(materialRequest.id, {
				download_job_id: jobId,
				download_status: Lookup_App_Material_Request_Download_Status_Enum.New,
				updated_at: new Date().toISOString(),
			});

			return jobId;
		} catch (err) {
			throw new CustomError('Failed to create mediahaven export job', err, {
				materialRequestId: materialRequest.id,
				url,
				body,
			});
		}
	}

	private async getJobsFromMediahaven(): Promise<MediahavenJobInfo[]> {
		const accessToken = await this.getAccessToken();
		const url = stringifyUrl({
			url: `${this.configService.get('MEDIAHAVEN_API_ENDPOINT')}/exports`,
			query: {
				tag: this.configService.get('MEDIAHAVEN_EXPORT_JOBS_TAG'),
			},
		});
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `bearer ${accessToken.token.access_token}`,
			},
		});
		if (response.status < 200 || response.status >= 400) {
			throw new CustomError('Error received when fetching mediahaven jobs', response?.statusText, {
				status: response.status,
				statusText: response.statusText,
				responseBody: response.body,
			});
		}
		const responseJson = (await response.json()) as GetMamExportsResponse;
		return responseJson.Results;
	}

	/**
	 * Material request contains representation id => https://data-qas.hetarchief.be/id/entity/55638edcc4a9b8f665c9c3552473517a
	 * Fetch the representation through the graph.representation table by id => https://data-qas.hetarchief.be/id/entity/55638edcc4a9b8f665c9c3552473517a
	 * Get the file ids below the representation use graph.includes filtered by representation id
	 * Get the file info in the graph.file table by file id
	 * Get the first file of ebucore_has_type === 'video/mp4' => https://data-qas.hetarchief.be/id/entity/6eedd53f51f9721b8ea7c111ebf7604f
	 * premis_stored_at => extract long id => https://media-qas.viaa.be/play/v2/SBS/aaf815a5a39e414291c14603edbe336a0cf599d0da2146c7a9578def535362cd/browse.mp4 => aaf815a5a39e414291c14603edbe336a0cf599d0da2146c7a9578def535362cd
	 * lookup id in graph.mh_fragment_identifier => ilike id + '%' to get the full id
	 * mh_fragment_identifier => is de record id to use in mediahaven export job
	 * @param representationId
	 * @returns The Mediahaven fragment ID
	 */
	private async getMhFragmentIdByRepresentationId(representationId: string): Promise<string> {
		try {
			// TODO check if video/mp4 is the correct media type to fetch audio files, or we need to switch to audio/mp3 for audio
			const responseFileInfo = await this.dataService.execute<
				GetFileStoredAtByRepresentationIdQuery,
				GetFileStoredAtByRepresentationIdQueryVariables
			>(GetFileStoredAtByRepresentationIdDocument, {
				representationId,
			});
			const fileStoredAtUrl = responseFileInfo.graph_includes?.[0]?.file?.premis_stored_at;
			if (!fileStoredAtUrl) {
				throw new CustomError('audio/video file was not found under representation', null, {
					representationId,
					query: 'GetFileStoredAtByRepresentationId',
				});
			}
			// Get second to last part of the URL
			// https://media-qas.viaa.be/play/v2/SBS/aaf815a5a39e414291c14603edbe336a0cf599d0da2146c7a9578def535362cd/browse.mp4 => aaf815a5a39e414291c14603edbe336a0cf599d0da2146c7a9578def535362cd
			const partialMhFragmentIdentifier = fileStoredAtUrl.split('/').at(-2);

			if (!partialMhFragmentIdentifier) {
				throw new CustomError(
					'Could not extract Mediahaven fragment identifier from stored at URL',
					null,
					{
						representationId,
						fileStoredAtUrl,
					}
				);
			}

			return (await this.getMhFragmentIdByPartialMhFragmentId([partialMhFragmentIdentifier]))?.[0];
		} catch (err) {
			throw new CustomError('Failed to get Mediahaven fragment ID by representation ID', err, {
				representationId,
			});
		}
	}

	/**
	 * Material request contains ie object id => https://data-qas.hetarchief.be/id/entity/qs6d5p9579
	 * This ie-object contains multiple representations => graph.representation => premis_represents === ie object id
	 * Get the file ids below the representations use graph.includes filtered by representation id
	 * Get the file infos in the graph.file table by file ids
	 * Get the files of ebucore_has_type === 'video/mp4' => https://data-qas.hetarchief.be/id/entity/6eedd53f51f9721b8ea7c111ebf7604f
	 * premis_stored_at => extract long id => https://media-qas.viaa.be/play/v2/SBS/aaf815a5a39e414291c14603edbe336a0cf599d0da2146c7a9578def535362cd/browse.mp4 => aaf815a5a39e414291c14603edbe336a0cf599d0da2146c7a9578def535362cd
	 * lookup id in graph.mh_fragment_identifier => ilike id + '%' to get the full id
	 * mh_fragment_identifier => is de record id to use in mediahaven export job
	 * @returns The Mediahaven fragment IDs
	 * @param ieObjectId
	 */
	private async getAllMhFragmentIdsByIeObjectId(ieObjectId: string): Promise<string[]> {
		try {
			// TODO check if video/mp4 is the correct media type to fetch audio files, or we need to switch to audio/mp3 for audio
			const responseFileInfo = await this.dataService.execute<
				GetFileStoredAtByIeObjectIdQuery,
				GetFileStoredAtByIeObjectIdQueryVariables
			>(GetFileStoredAtByIeObjectIdDocument, {
				ieObjectId,
			});
			const fileStoredAtUrls = responseFileInfo.graph_representation?.flatMap((representation) => {
				return representation?.includes?.flatMap((include) => {
					return include?.file?.premis_stored_at;
				});
			});
			// Get second to last part of the URL
			// https://media-qas.viaa.be/play/v2/SBS/aaf815a5a39e414291c14603edbe336a0cf599d0da2146c7a9578def535362cd/browse.mp4 => aaf815a5a39e414291c14603edbe336a0cf599d0da2146c7a9578def535362cd
			const partialMhFragmentIdentifiers = compact(
				fileStoredAtUrls.map((fileStoredAtUrl) => fileStoredAtUrl.split('/').at(-2).trim())
			);

			if (partialMhFragmentIdentifiers.length === 0) {
				throw new CustomError(
					'Could not extract Mediahaven fragment identifiers from stored at URLs',
					null,
					{
						ieObjectId,
						fileStoredAtUrls,
					}
				);
			}

			return await this.getMhFragmentIdByPartialMhFragmentId(partialMhFragmentIdentifiers);
		} catch (err) {
			throw new CustomError('Failed to get all Mediahaven fragment IDs by ie object ID', err, {
				ieObjectId,
			});
		}
	}

	/**
	 * Get the full Mediahaven fragment IDs by their partial fragment IDs.
	 * @param partialMhFragmentIds Array of partial Mediahaven fragment IDs.
	 * @returns Array of full Mediahaven fragment IDs.
	 */
	private async getMhFragmentIdByPartialMhFragmentId(
		partialMhFragmentIds: string[]
	): Promise<string[]> {
		try {
			return await Promise.all(
				partialMhFragmentIds.map(async (partialMhFragmentId): Promise<string> => {
					const responseMhFragment = await this.dataService.execute<
						GetMhIdentifiersFromPartialMhIdentifierQuery,
						GetMhIdentifiersFromPartialMhIdentifierQueryVariables
					>(GetMhIdentifiersFromPartialMhIdentifierDocument, {
						partialMhIdentifierStartsWith: `${partialMhFragmentId}%`,
					});

					const mhFragmentId =
						responseMhFragment.graph_mh_fragment_identifier?.[0]?.mh_fragment_identifier;

					if (!mhFragmentId) {
						throw new CustomError(
							'Could not find Mediahaven fragment identifier by partial mediahaven identifier in database',
							null,
							{
								partialMhFragmentId,
							}
						);
					}

					return mhFragmentId;
				})
			);
		} catch (err) {
			throw new CustomError(
				'Failed to get Mediahaven fragment ID by partial Mediahaven fragment ID',
				err,
				{
					partialMhFragmentIds,
				}
			);
		}
	}

	private async getMediaHavenMetadataByRecordId(recordId: string): Promise<MediaHavenRecord> {
		try {
			const accessToken = await this.getAccessToken();
			const url = `${this.configService.get('MEDIAHAVEN_API_ENDPOINT')}/records/${recordId}`;
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					accept: 'application/json',
					Authorization: `bearer ${accessToken.token.access_token}`,
				},
			});
			if (response.status < 200 || response.status >= 400) {
				throw new CustomError(
					'Error received when fetching a mediahaven record by id',
					response?.statusText,
					{
						status: response.status,
						statusText: response.statusText,
						responseBody: response.body,
						recordId,
						url,
					}
				);
			}
			return (await response.json()) as MediaHavenRecord;
		} catch (err) {
			throw new CustomError('Failed to fetch Mediahaven metadata by recordId', err, {
				recordId,
			});
		}
	}

	/**
	 * Fetches a token for the dl s3 bucket location
	 * @private
	 */
	private async getS3DownloadLocationToken(): Promise<S3ExportLocationToken> {
		try {
			const TOKEN_ENDPOINT = this.configService.get('MEDIAHAVEN_S3_EXPORT_LOCATION_TOKEN_ENDPOINT');
			const TOKEN_USERNAME = this.configService.get('MEDIAHAVEN_S3_EXPORT_LOCATION_TOKEN_USERNAME');
			const TOKEN_PASSWORD = this.configService.get('MEDIAHAVEN_S3_EXPORT_LOCATION_TOKEN_PASSWORD');
			const TOKEN_SECRET = this.configService.get(
				'MEDIAHAVEN_S3_EXPORT_LOCATION_TOKEN_X_USER_SECRET_KEY_META'
			);

			const credentials = Buffer.from(`${TOKEN_USERNAME}:${TOKEN_PASSWORD}`).toString('base64');

			const result = await fetch(TOKEN_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Basic ${credentials}`,
					'X-User-Secret-Key-Meta': TOKEN_SECRET,
				},
			});
			const token = (await result.json()) as S3ExportLocationToken;
			return token;
		} catch (err) {
			throw new CustomError('Failed to fetch S3 export location token', err);
		}
	}

	/**
	 * Fetches a token for the dl s3 bucket location, if the token is expired or not cached yet, it will be refreshed
	 * @private
	 */
	private async getS3DownloadLocationTokenCached(): Promise<S3ExportLocationToken> {
		if (
			!this.s3DownloadLocationToken ||
			isPast(subMinutes(parseISO(this.s3DownloadLocationToken.expiration), 5))
		) {
			// No token yet, or taken is expired
			this.s3DownloadLocationToken = await this.getS3DownloadLocationToken();
		}
		return this.s3DownloadLocationToken;
	}

	/**
	 * Gets a download url for the mediahaven export s3 bucket location from an export job file name
	 * any permission checks need to happen before this point, since this endpoint will not check any permissions
	 * @param fileRelativePath The filename with extension in the s3 bucket to generate a signed URL for
	 * @param desiredFileName The filename that should show up in the browser of the user when downloading the file
	 * @returns A presigned URL that allows the client to download the file
	 */
	public async getS3DownloadSignedUrl(
		fileRelativePath: string,
		desiredFileName?: string
	): Promise<string> {
		try {
			const EXPORT_LOCATION_URL = this.configService.get('MEDIAHAVEN_S3_EXPORT_LOCATION_URL');
			const EXPORT_LOCATION_BUCKET_URL = this.configService.get(
				'MEDIAHAVEN_S3_EXPORT_LOCATION_BUCKET_URL'
			);
			const SIGNED_URL_EXPIRY_SECONDS = this.configService.get(
				'MEDIAHAVEN_S3_EXPORT_LOCATION_SIGNED_URL_EXPIRY_SECONDS'
			);

			const token = await this.getS3DownloadLocationTokenCached();
			const s3Client = new S3Client({
				endpoint: EXPORT_LOCATION_URL,
				credentials: {
					accessKeyId: token.token,
					secretAccessKey: token.secret,
				},
				region: 'eu-west-1', // Required but often ignored by S3-compatible storage
				forcePathStyle: false,
				bucketEndpoint: true,
			});

			const command = new GetObjectCommand({
				Bucket: EXPORT_LOCATION_BUCKET_URL,
				Key: fileRelativePath,
				ResponseContentDisposition: `attachment; filename="${desiredFileName || fileRelativePath}"`,
			});

			// Generate a presigned URL valid for 1 hour (configurable env var)
			const signedUrl = await getSignedUrl(s3Client, command, {
				expiresIn: SIGNED_URL_EXPIRY_SECONDS,
			});

			return signedUrl;
		} catch (err) {
			throw new CustomError('Failed to generate S3 presigned download URL', err, {
				downloadPath: fileRelativePath,
			});
		}
	}
}
