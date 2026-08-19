import {
	DataService,
	PlayerTicketService,
	StillsObjectType,
	VideoStillsService,
} from '@meemoo/admin-core-api';
import { CustomError } from '@meemoo/admin-core-api/dist/src/modules/shared/helpers/error';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AvoStillsStillInfo } from '@viaa/avo2-types';
import { mapLimit } from 'blend-promise-utils';
import type { Cache } from 'cache-manager';
import { hoursToSeconds } from 'date-fns';
import { Request } from 'express';
import { compact, isNil } from 'lodash';

import type { Configuration } from '~config';
import {
	GetIeObjectPlayableDisplayDataDocument,
	GetIeObjectPlayableDisplayDataQuery,
	GetIeObjectPlayableDisplayDataQueryVariables,
} from '~generated/graphql-db-types-hetarchief';
import {
	findFirstPlayableRepresentation,
	findIiifImageFile,
} from '~modules/ie-objects/helpers/find-playable-representation';
import { limitAccessToObjectDetails } from '~modules/ie-objects/helpers/limit-access-to-object-details';
import { mapDcTermsFormatToSimpleType } from '~modules/ie-objects/helpers/map-dc-terms-format-to-simple-type';
import {
	FLOWPLAYER_FORMATS,
	IE_OBJECT_AV_TYPES,
	JSON_FORMATS,
} from '~modules/ie-objects/ie-objects.conts';
import {
	type IeObject,
	type IeObjectForAccessCheck,
	IeObjectLicense,
	type IeObjectPlayableDisplayData,
	type IeObjectSector,
	IeObjectType,
	type IeObjectsVisitorSpaceInfo,
	type JsonWaveformData,
} from '~modules/ie-objects/ie-objects.types';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import {
	CACHE_KEY_PREFIX_IE_OBJECT_NEWSPAPER_IMAGE,
	CACHE_KEY_PREFIX_IE_OBJECT_PEAKFILE_DATA,
	CACHE_KEY_PREFIX_IE_OBJECT_PLAYABLE_DISPLAY_DATA,
} from '~modules/ie-objects/services/ie-objects.service.consts';
import type { PlayableDisplayDataFile } from '~modules/ie-objects/services/ie-objects.service.types';
import { OrganisationPreference } from '~modules/organisations/organisations.types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { AUDIO_WAVE_FORM_URL } from '~shared/consts/audio-wave-form-url';
import { formattedDurationToSeconds } from '~shared/helpers/formatted-duration-to-seconds';

interface PlayableDisplayAccess {
	dbResponse: GetIeObjectPlayableDisplayDataQuery;
	limitedObject: Partial<IeObject>;
	dctermsFormat: IeObjectType;
	isPublicDomain: boolean;
	hasEssenceAccess: boolean;
}

interface AvFileData {
	playableUrl: string | null;
	mimeType: string | null;
	peakfileData: number[] | null;
	thumbnailUrl: string | null;
}

/**
 * Lightweight, batch-capable alternative to IeObjectsService.findByIeObjectId for rendering
 * playable preview tiles (e.g. a carousel). Depends on IeObjectsService only for the handful of
 * generic pieces it shares with the rest of the module (schema identifier resolution, visitor
 * space access, thumbnail token resolution) - everything specific to this endpoint lives here.
 */
// Bounds how long a single IIIF image / peak file fetch may hang - without it, a slow or dead
// upstream would stall its mapLimit worker (and the batch item waiting on it) indefinitely.
const EXTERNAL_FETCH_TIMEOUT_MS = 10_000;

@Injectable()
export class PlayableDisplayDataService {
	private logger: Logger = new Logger(PlayableDisplayDataService.name, { timestamp: true });

	constructor(
		private configService: ConfigService<Configuration>,
		private dataService: DataService,
		private playerTicketService: PlayerTicketService,
		private videoStillsService: VideoStillsService,
		private ieObjectsService: IeObjectsService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {}

	/**
	 * Lightweight, batch-capable alternative to findByIeObjectId for rendering playable preview
	 * tiles (e.g. a carousel): schemaIdentifier, name, thumbnailUrl, dctermsFormat, maintainer info,
	 * and a ready-to-play url for the first playable file (same selection as the object detail
	 * page). An object the current user has no access to at all resolves to null in the returned
	 * array instead of failing the whole batch.
	 */
	public async getIeObjectsPlayableDisplayData(
		items: { schemaIdentifier: string; start?: number; end?: number }[],
		user: SessionUserEntity,
		referer: string,
		ip: string,
		request: Request
	): Promise<(IeObjectPlayableDisplayData | null)[]> {
		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);

		// Duplicate schemaIdentifiers in the same batch (e.g. the same object shown twice in a
		// carousel with different cuepoints) share one in-flight access resolution instead of each
		// racing the cache and triggering their own duplicate DB lookup.
		const accessPerSchemaIdentifier = new Map<string, Promise<PlayableDisplayAccess | null>>();
		const resolveAccessOnce = (schemaIdentifier: string): Promise<PlayableDisplayAccess | null> => {
			if (!accessPerSchemaIdentifier.has(schemaIdentifier)) {
				accessPerSchemaIdentifier.set(
					schemaIdentifier,
					this.resolvePlayableDisplayAccess(schemaIdentifier, user, visitorSpaceAccessInfo, request)
				);
			}
			return accessPerSchemaIdentifier.get(schemaIdentifier);
		};

		const failedSchemaIdentifiers: string[] = [];

		const results = await mapLimit(
			items,
			12,
			async (item: {
				schemaIdentifier: string;
				start?: number;
				end?: number;
			}): Promise<IeObjectPlayableDisplayData | null> => {
				try {
					const access = await resolveAccessOnce(item.schemaIdentifier);
					if (!access) {
						return null;
					}
					const { dbResponse, limitedObject, dctermsFormat, isPublicDomain, hasEssenceAccess } =
						access;

					const isAvObject = IE_OBJECT_AV_TYPES.includes(dctermsFormat);
					const isAudio = mapDcTermsFormatToSimpleType(dctermsFormat) === IeObjectType.AUDIO;
					let thumbnailUrl: string | null = isAudio ? AUDIO_WAVE_FORM_URL : null; // avoid the ugly speaker
					let playableUrl: string | null = null;
					let mimeType: string | null = null;
					let peakfileData: number[] | null = null;
					let newspaperImage: string | null = null;

					if (hasEssenceAccess) {
						// Essence access was granted: look up the first playable file, same
						// selection as the object detail page
						const representation = findFirstPlayableRepresentation(dbResponse, isAvObject);
						const files = compact((representation?.includes || []).map((include) => include.file));
						const isMediaFragmentOf = !!representation?.is_media_fragment_of;

						if (isAvObject) {
							const avData = await this.resolveAvFileData(
								files,
								item,
								isAudio,
								isMediaFragmentOf,
								referer,
								ip,
								isPublicDomain
							);
							playableUrl = avData.playableUrl;
							mimeType = avData.mimeType;
							peakfileData = avData.peakfileData;
							if (avData.thumbnailUrl) {
								thumbnailUrl = avData.thumbnailUrl;
							}
						} else {
							// Non audio/video objects (mainly newspapers): resolve the IIIF detail
							// image right away and inline it as a data uri, instead of a plain
							// playable url - the IIIF image server requires an Authorization header,
							// so it can't be exposed as a plain, ready-to-use url like
							// playableUrl/peakfileData without a separate proxy endpoint
							const imageFile = findIiifImageFile(files);
							if (imageFile) {
								newspaperImage = await this.fetchIiifNewspaperImageDataUri(
									imageFile,
									referer,
									ip,
									isPublicDomain
								);
							}
						}

						if (!isAudio && !thumbnailUrl) {
							thumbnailUrl =
								(await this.ieObjectsService.getThumbnailUrlWithToken(
									limitedObject.thumbnailUrl,
									referer,
									ip,
									isPublicDomain
								)) || null;
						}
					}

					const snipPoint =
						item.start !== undefined || item.end !== undefined
							? { start: item.start, end: item.end }
							: undefined;

					return {
						schemaIdentifier: limitedObject.schemaIdentifier,
						name: limitedObject.name,
						thumbnailUrl,
						dctermsFormat: limitedObject.dctermsFormat,
						maintainerName: limitedObject.maintainerName,
						maintainerLogo: limitedObject.maintainerLogo,
						maintainerOverlay: limitedObject.maintainerOverlay,
						snipPoint,
						...(isAvObject ? { playableUrl, mimeType, peakfileData } : { newspaperImage }),
					};
				} catch (err) {
					// Logged individually at debug (kept for troubleshooting) and summarized below at
					// warn, rather than one error-level log per item - a single batch can contain up to
					// PLAYABLE_DISPLAY_DATA_MAX_OBJECTS items, and a client sending mostly bad/unknown
					// identifiers shouldn't flood error-level logs/alerts.
					this.logger.debug(
						new CustomError('Failed to get playable display data for ie-object', err, {
							schemaIdentifier: item.schemaIdentifier,
						})
					);
					failedSchemaIdentifiers.push(item.schemaIdentifier);
					return null;
				}
			}
		);

		if (failedSchemaIdentifiers.length) {
			this.logger.error(
				`Failed to get playable display data for ${failedSchemaIdentifiers.length}/${
					items.length
				} ie-object(s): ${failedSchemaIdentifiers.slice(0, 10).join(', ')}${
					failedSchemaIdentifiers.length > 10 ? ', ...' : ''
				}`
			);
		}

		return results;
	}

	/**
	 * Resolves the audio/video branch of a playable representation's files: the ready-to-play
	 * url (+ mime type) for the first flowplayer-compatible file, the waveform peak sample array
	 * for audio/audio fragments, and a video-still thumbnail when a start cuepoint was requested.
	 */
	private async resolveAvFileData(
		files: PlayableDisplayDataFile[],
		item: { start?: number; end?: number },
		isAudio: boolean,
		isMediaFragmentOf: boolean,
		referer: string,
		ip: string,
		isPublicDomain: boolean
	): Promise<AvFileData> {
		let playableUrl: string | null = null;
		let mimeType: string | null = null;
		let peakfileData: number[] | null = null;
		let thumbnailUrl: string | null = null;

		const playableFile = files.find((file) =>
			FLOWPLAYER_FORMATS.includes(file.ebucore_has_mime_type)
		);
		if (playableFile) {
			mimeType = playableFile.ebucore_has_mime_type;
			playableUrl = await this.resolveFileTicketUrl(
				playableFile,
				isMediaFragmentOf,
				referer,
				ip,
				isPublicDomain
			);

			if (!isAudio && item.start) {
				thumbnailUrl = await this.getVideoStillThumbnail(playableFile, item.start);
			}
		}

		if (isAudio) {
			// Audio and audio fragments render a waveform on top of the player,
			// sourced from a separate json peak file - additive data, never a
			// substitute for playableUrl
			const peakFile = files.find((file) => JSON_FORMATS.includes(file.ebucore_has_mime_type));
			if (peakFile) {
				peakfileData = await this.fetchPeakFileDataCached(peakFile);
			}
		}

		return { playableUrl, mimeType, peakfileData, thumbnailUrl };
	}

	/**
	 * Fetches a representation's IIIF image-api file and inlines it as a self-contained base64 data
	 * uri, ready to use directly as an <img src> with zero further requests - rendered down to a
	 * reasonably-sized (~1000px wide) jpeg, since these source images are ~8k and a full-size render
	 * is neither needed nor wanted for a preview tile.
	 *
	 * The IIIF image server sits behind Authorization-header auth, not the query-param ticket
	 * getPlayableUrl/resolveThumbnailUrl use for their media-service proxy (which doesn't understand
	 * IIIF image requests) - so rather than handing the client a url it can't directly load (or
	 * adding a whole separate proxy endpoint just to attach that header), the image is fetched here
	 * and inlined directly into the response. The rendered image is cached per file for 1 hour
	 * (same as the playable-display-data db response) since it's independent of who's asking for
	 * it, saving both the ticket-service and IIIF round trips on repeat carousel views. Failures
	 * are swallowed to null (and not cached) so one broken image doesn't take down the rest of the
	 * object's metadata in the batch response.
	 */
	private async fetchIiifNewspaperImageDataUri(
		imageFile: PlayableDisplayDataFile,
		referer: string,
		ip: string,
		isPublicDomain: boolean
	): Promise<string | null> {
		if (!imageFile.premis_stored_at) {
			return null;
		}
		try {
			return await this.cacheManager.wrap(
				CACHE_KEY_PREFIX_IE_OBJECT_NEWSPAPER_IMAGE + imageFile.premis_stored_at,
				() => this.fetchAndEncodeIiifImage(imageFile.premis_stored_at, referer, ip, isPublicDomain),
				// cache for 1 hour
				hoursToSeconds(1)
			);
		} catch (err) {
			this.logger.error(
				new CustomError('Failed to fetch IIIF detail image for playable display data', err, {
					storedAt: imageFile.premis_stored_at,
				})
			);
			return null;
		}
	}

	/**
	 * Requests a ticket for and fetches a IIIF image-api identifier, rendered down to a
	 * reasonably-sized (~1000px wide) jpeg, and returns it as a base64 data uri.
	 */
	private async fetchAndEncodeIiifImage(
		storedAt: string,
		referer: string,
		ip: string,
		isPublicDomain: boolean
	): Promise<string> {
		const imageUrl = storedAt.replace(
			'https://iiif-qas.meemoo.be/image/3/public',
			'https://iiif-qas.meemoo.be/image/3/hetarchief'
		);
		// The ticket must be requested for the base url, without the /full/.../default.jpg
		// suffix, since the ticket service requires it to be a substring of the final requested url
		const token = await this.playerTicketService.getPlayerToken(imageUrl, {
			referer,
			ip,
			isPublicDomain,
		});

		// The ticket is bound to the referer it was requested with - unlike a browser, Node's
		// fetch doesn't send a Referer header automatically, so it has to be set explicitly or
		// the IIIF server rejects the token with a 403
		const response = await fetch(`${imageUrl}/full/1000,/0/default.jpg`, {
			headers: { Authorization: `Bearer ${token}`, Referer: referer },
			signal: AbortSignal.timeout(EXTERNAL_FETCH_TIMEOUT_MS),
		});
		if (!response.ok) {
			throw new CustomError('Failed to fetch IIIF detail image', null, {
				imageUrl,
				status: response.status,
			});
		}

		const contentType = response.headers.get('content-type') || 'image/jpeg';
		const base64 = Buffer.from(await response.arrayBuffer()).toString('base64');
		return `data:${contentType};base64,${base64}`;
	}

	/**
	 * Fetches an audio/audio-fragment's json peak/waveform file, returning only the peak sample
	 * array (the client renders this directly into a waveform overlay) - the rest of the peak
	 * file's metadata (version, channels, sample_rate, ...) is discarded since nothing consumes it,
	 * keeping the batch response payload small. Peak files are served directly from the
	 * archief-media host, not through the ticket service - that returned a 403 for this file type.
	 *
	 * WARNING: this deliberately bypasses the ticket service, i.e. no access-control check is
	 * done on the file it fetches. It must NEVER be used to fetch/expose an actual essence file
	 * (audio/video). only ever call it for small, non-sensitive json peak/waveform files, and
	 * only ever return the parsed data array from it, never the resolved url or raw response.
	 */
	private async fetchPeakFileData(peakFile: PlayableDisplayDataFile): Promise<number[]> {
		const mediaServiceUrl = this.configService.get('MEDIA_SERVICE_URL');
		// The archief-media host that serves peak files directly (unticketed) only ever
		// differs from MEDIA_SERVICE_URL's host by an "archief-" prefix, keeping whatever
		// environment suffix (-int/-tst/-qas/-prd, or none) follows "media" - deriving it
		// this way avoids a second, hand-kept env var per environment.
		const archiefMediaUrl = new URL(mediaServiceUrl);
		archiefMediaUrl.hostname = archiefMediaUrl.hostname.replace(/^media/, 'archief-media');
		const peakFileUrl = peakFile.premis_stored_at.replace(
			mediaServiceUrl,
			`${archiefMediaUrl.origin}/viaa`
		);
		const response = await fetch(peakFileUrl, {
			signal: AbortSignal.timeout(EXTERNAL_FETCH_TIMEOUT_MS),
		});
		if (!response.ok) {
			throw new CustomError('Failed to fetch peak file', null, {
				peakFileUrl,
				status: response.status,
			});
		}
		const json = (await response.json()) as JsonWaveformData;
		return json.data;
	}

	/**
	 * Cached, guarded entry point for fetchPeakFileData: refuses anything that isn't a json peak
	 * file up front (see the WARNING on fetchPeakFileData), then caches the parsed peak sample
	 * array per file for 1 hour (same as the newspaper image and the playable-display-data db
	 * response), since the waveform data is independent of who's asking for it. Failures are
	 * swallowed to null (and not cached) so one broken peak file doesn't take down the rest of the
	 * object's metadata in the batch response.
	 */
	private async fetchPeakFileDataCached(
		peakFile: PlayableDisplayDataFile
	): Promise<number[] | null> {
		if (!JSON_FORMATS.includes(peakFile.ebucore_has_mime_type)) {
			// Refuse to fetch anything that isn't a json peak file - this method skips the ticket
			// service, so blindly fetching whatever file it's given would let it be repurposed to
			// expose essence files (audio/video) without an access check.
			this.logger.warn(
				`fetchPeakFileDataCached refused to fetch a non-json file to avoid bypassing the ticket service: ${peakFile.premis_stored_at} (${peakFile.ebucore_has_mime_type})`
			);
			return null;
		}

		try {
			return await this.cacheManager.wrap(
				CACHE_KEY_PREFIX_IE_OBJECT_PEAKFILE_DATA + peakFile.premis_stored_at,
				() => this.fetchPeakFileData(peakFile),
				// cache for 1 hour
				hoursToSeconds(1)
			);
		} catch (err) {
			this.logger.error(
				new CustomError('Failed to fetch peak file data for playable display data', err, {
					storedAt: peakFile.premis_stored_at,
				})
			);
			return null;
		}
	}

	private async getPlayableDisplayDataFromDb(
		ieObjectId: string
	): Promise<GetIeObjectPlayableDisplayDataQuery> {
		return this.dataService.execute<
			GetIeObjectPlayableDisplayDataQuery,
			GetIeObjectPlayableDisplayDataQueryVariables
		>(GetIeObjectPlayableDisplayDataDocument, { ieObjectId });
	}

	private async getPlayableDisplayDataFromDbCached(
		ieObjectId: string
	): Promise<GetIeObjectPlayableDisplayDataQuery> {
		return this.cacheManager.wrap(
			CACHE_KEY_PREFIX_IE_OBJECT_PLAYABLE_DISPLAY_DATA + ieObjectId,
			() => this.getPlayableDisplayDataFromDb(ieObjectId),
			// cache for 1 hour
			hoursToSeconds(1)
		);
	}

	/**
	 * Resolves an ie-object's playable-display-data db response and applies the license-based
	 * access check. `pages` is only ever picked when the license grants the essence metadata set,
	 * regardless of whether it holds real data - its mere presence on the limited object tells us
	 * if essence access was granted, without needing to look up representations first.
	 */
	private async resolvePlayableDisplayAccess(
		schemaIdentifier: string,
		user: SessionUserEntity,
		visitorSpaceAccessInfo: IeObjectsVisitorSpaceInfo,
		request: Request
	): Promise<PlayableDisplayAccess | null> {
		const ieObjectId = await this.ieObjectsService.getIeObjectIdFromObjectSchemaIdentifier(
			schemaIdentifier,
			request
		);

		const dbResponse = await this.getPlayableDisplayDataFromDbCached(ieObjectId);

		const ie = dbResponse?.ieObject?.[0];
		if (!ie) {
			return null;
		}

		const licenses = compact(
			dbResponse.schemaLicense?.map((license) => license.schema_license)
		) as IeObjectLicense[];
		const dctermsFormat = ie.dctermsFormat?.[0]?.dcterms_format as IeObjectType;
		const schemaMaintainer = ie.schemaMaintainer;
		const isPublicDomain: boolean =
			licenses.includes(IeObjectLicense.PUBLIEK_CONTENT) &&
			licenses.includes(IeObjectLicense.PUBLIC_DOMAIN);

		const limitedObject = limitAccessToObjectDetails(
			{
				schemaIdentifier: ie.schema_identifier,
				licenses,
				maintainerId: schemaMaintainer?.org_identifier,
				sector: schemaMaintainer?.ha_org_sector as IeObjectSector,
				name: ie.schema_name,
				dctermsFormat,
				maintainerName: schemaMaintainer?.skos_pref_label,
				maintainerLogo: schemaMaintainer?.ha_org_has_logo
					// TODO remove this workaround once the INT organisations assets are available
					?.replace('https://assets-int.viaa.be/images/', 'https://assets.viaa.be/images/')
					?.replace('https://assets-tst.viaa.be/images/', 'https://assets.viaa.be/images/'),
				maintainerOverlay: !!schemaMaintainer?.hasPreference?.find(
					(pref) => pref.ha_pref === OrganisationPreference.logoEmbedding
				),
				thumbnailUrl: dbResponse.schemaThumbnailUrl?.[0]?.schema_thumbnail_url?.[0],
				pages: [],
			} as IeObjectForAccessCheck,
			{
				userId: user?.getId(),
				isKeyUser: user.getIsKeyUser(),
				sector: user.getSector(),
				groupId: user.getGroupId(),
				maintainerId: user.getOrganisationId(),
				accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
				accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
			}
		);

		if (!limitedObject) {
			// User has no access to this object at all
			return null;
		}

		return {
			dbResponse,
			limitedObject,
			dctermsFormat,
			isPublicDomain,
			hasEssenceAccess: 'pages' in limitedObject,
		};
	}

	/**
	 * Resolves a file to a ready-to-play, signed url, cutting it to the file's own mediaFragment
	 * start/end when it belongs to a cut-fragment representation
	 * (same logic as IeObjectsController.getPlayableUrl).
	 * https://meemoo.atlassian.net/browse/ARC-3690?focusedCommentId=87432
	 */
	private async resolveFileTicketUrl(
		file: PlayableDisplayDataFile,
		isMediaFragmentOf: boolean,
		referer: string,
		ip: string,
		isPublicDomain: boolean
	): Promise<string> {
		let startTime: number | undefined;
		let endTime: number | undefined;
		const fragment = file.hasMediaFragment?.[0];
		if (isMediaFragmentOf && fragment?.schema_start_time && fragment?.schema_end_time) {
			startTime = formattedDurationToSeconds(fragment.schema_start_time);
			endTime = formattedDurationToSeconds(fragment.schema_end_time);
		}

		return this.playerTicketService.getPlayableUrl(file.premis_stored_at, {
			referer,
			ip,
			isPublicDomain,
			startTime,
			endTime,
		});
	}

	/**
	 * Gets the video still closest to the given cut point
	 * Should only be used for video files, audio uses the default wave form and newspapers don't need stills
	 */
	private async getVideoStillThumbnail(
		file: PlayableDisplayDataFile,
		startTimeSeconds: number
	): Promise<string | null> {
		if (
			!startTimeSeconds ||
			startTimeSeconds <= 0 ||
			!file.ebucore_has_mime_type?.startsWith('video/')
		) {
			return null;
		}
		const stillInfos = await this.videoStillsService.getFirstVideoStills([
			{
				id: file.id,
				storedAt: file.premis_stored_at,
				type: StillsObjectType.video,
				startTime: startTimeSeconds * 1000,
			},
		]);
		const filteredInfos = (stillInfos?.filter((info) => !isNil(info)) ||
			[]) as AvoStillsStillInfo[];

		return filteredInfos[0]?.thumbnailImagePath || null;
	}
}
