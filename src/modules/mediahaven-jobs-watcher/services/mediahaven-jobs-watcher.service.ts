import { DataService, MediahavenService } from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isAfter, subHours } from 'date-fns';
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
import { MaterialRequestForDownload } from '~modules/material-requests/material-requests.types';
import { MaterialRequestsService } from '~modules/material-requests/services/material-requests.service';
import {
	CreateMamJob,
	GetMamExportsResponse,
	MamAccessToken,
	MamExportQuality,
	MamJobStatus,
	MediahavenJobInfo,
} from '~modules/mediahaven-jobs-watcher/mediahaven-jobs-watcher.types';

@Injectable()
export class MediahavenJobsWatcherService {
	constructor(
		private configService: ConfigService<Configuration>,
		private materialRequestsService: MaterialRequestsService,
		private dataService: DataService,
		private mediahavenService: MediahavenService
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

	private async retryDownloadJobOrFail(materialRequest: MaterialRequestForDownload): Promise<void> {
		// No jobs present in Mediahaven for this material request
		const updatedAt = new Date(materialRequest.updatedAt);
		// If the material request was updated less than 1 hour ago, wait before retrying
		if (isAfter(updatedAt, subHours(new Date(), 1))) {
			// Skip this material request for now
			// Maybe there is an issue with the api, so we'll try again in 1 hour after the last attempt
		} else {
			// Check if we can retry creating the export job
			if ((materialRequest.downloadRetries || 0) < 3) {
				// Retry creating the export job
				await this.createExportJob(materialRequest);
			} else {
				// Max retries reached, mark as failed
				await this.materialRequestsService.updateMaterialRequest(materialRequest.id, {
					download_status: Lookup_App_Material_Request_Download_Status_Enum.Failed,
					updated_at: new Date().toISOString(),
				});
			}
		}
	}

	public async checkJobs() {
		try {
			const jobs: MediahavenJobInfo[] = await this.getJobsFromMediahaven();
			const unresolvedMaterialRequests: MaterialRequestForDownload[] =
				await this.materialRequestsService.findAllWithUnresolvedDownload();

			/**
			 * This follows the flow diagram for checking Mediahaven jobs for material requests:
			 * https://drive.google.com/file/d/1w2MRcTxzTsXjivATFEvaDkv99tMxnUqF/view?usp=sharing
			 */
			for (const materialRequest of unresolvedMaterialRequests) {
				const relatedJob = jobs.find((job) => {
					return materialRequest.downloadJobId === job.ExportJobId;
				});
				if (!relatedJob) {
					await this.retryDownloadJobOrFail(materialRequest);
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
							break;
						case MamJobStatus.Completed:
							// Job is completed, update material request with download URL and set status to SUCCEEDED
							await this.materialRequestsService.updateMaterialRequest(materialRequest.id, {
								download_url: relatedJob.DownloadUrl,
								download_status: Lookup_App_Material_Request_Download_Status_Enum.Succeeded,
								updated_at: new Date().toISOString(),
							});
							break;

						case MamJobStatus.Failed:
						case MamJobStatus.Cancelled:
							await this.retryDownloadJobOrFail(materialRequest);
							break;

						case MamJobStatus.AlreadyExists:
							await this.materialRequestsService.updateMaterialRequest(materialRequest.id, {
								download_status: Lookup_App_Material_Request_Download_Status_Enum.Failed,
								updated_at: new Date().toISOString(),
							});
							break;

						default:
							throw new CustomError('Unknown Mediahaven job status received', null, {
								materialRequestId: materialRequest.id,
								jobStatus: relatedJob.Status,
							});
					}
				}
			}
		} catch (err) {
			throw new CustomError('Error checking mediahaven jobs', err);
		}
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
			const accessToken = await this.getAccessToken();
			url = stringifyUrl({
				url: `${this.configService.get('MEDIAHAVEN_API_ENDPOINT')}/exports`,
			});
			if (materialRequest.objectRepresentationId) {
				// User has access to essence of the ie object, and wants to export a specific video (representation)
				const mhFragmentId = await this.getMhFragmentIdByRepresentationId(
					materialRequest.objectRepresentationId
				);
				body = {
					Records: [
						{
							RecordId: mhFragmentId,
							// TODO if material request has cue points
							// Partial: {
							// 	Type: 'Full',
							// 	Start: '',
							// 	End: '',
							// },
						},
					],
					ExportLocationId: this.configService.get('MEDIAHAVEN_EXPORT_LOCATION_ID'),
					// DestinationPath: `/exports/${materialRequest.id}`,
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
					// DestinationPath: `/exports/${materialRequest.id}`,
					ExportSource:
						materialRequest.reuseForm.downloadQuality === 'HIGH'
							? MamExportQuality.ORIGINAL
							: MamExportQuality.ACCESS,
					Reason: `Export for hetarchief.be material request ${materialRequest.id}`,
					Tag: this.configService.get('MEDIAHAVEN_EXPORT_JOBS_TAG'),
				};
			}

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
				throw new CustomError(
					'Error received when creating mediahaven export job',
					response?.statusText,
					{
						status: response.status,
						statusText: response.statusText,
						responseBody: response.body,
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
			throw new CustomError('Failed to create mediahaven export job', null, {
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
		// TODO check if video/mp4 is the correct media type to fetch audio files, or we need to switch to audio/mp3 for audio
		const responseFileInfo = await this.dataService.execute<
			GetFileStoredAtByRepresentationIdQuery,
			GetFileStoredAtByRepresentationIdQueryVariables
		>(GetFileStoredAtByRepresentationIdDocument, {
			representationId,
		});
		const fileStoredAtUrl = responseFileInfo.graph_includes?.[0]?.file?.premis_stored_at;
		// Get second to last part of the URL
		// https://media-qas.viaa.be/play/v2/SBS/aaf815a5a39e414291c14603edbe336a0cf599d0da2146c7a9578def535362cd/browse.mp4 => aaf815a5a39e414291c14603edbe336a0cf599d0da2146c7a9578def535362cd
		// @ts-ignore: TODO: Fix this .at(-2) stuff since the method does not exist
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
				// @ts-ignore: TODO: Fix this .at(-2) stuff since the method does not exist
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
	}
}
