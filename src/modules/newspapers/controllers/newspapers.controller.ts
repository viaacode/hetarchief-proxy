import { PlayerTicketService } from '@meemoo/admin-core-api';
import {
	Controller,
	ForbiddenException,
	Get,
	Header,
	Param,
	Query,
	Req,
	Res,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import archiver from 'archiver';
import { mapLimit } from 'blend-promise-utils';
import type { Request, Response } from 'express';
import { cloneDeep, isNil } from 'lodash';

import type { Configuration } from '~config';

import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';

import { IeObjectsController } from '~modules/ie-objects/controllers/ie-objects.controller';
import { convertObjectToCsv } from '~modules/ie-objects/helpers/convert-objects-to-csv';
import { convertObjectToXml } from '~modules/ie-objects/helpers/convert-objects-to-xml';
import type { IeObjectPage, NewspaperTitle } from '~modules/ie-objects/ie-objects.types';
import {
	NEWSPAPER_MIME_TYPE_ALTO,
	NEWSPAPER_MIME_TYPE_BROWSE_COPY,
	NEWSPAPER_MIME_TYPE_IMAGE_API,
} from '~modules/newspapers/newspapers.consts';

import { NewspapersService } from '~modules/newspapers/services/newspapers.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Ip } from '~shared/decorators/ip.decorator';
import { Referer } from '~shared/decorators/referer.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { customError } from '~shared/helpers/custom-error';
import { EventsHelper } from '~shared/helpers/events';

@ApiTags('Newspapers')
@Controller('newspapers')
export class NewspapersController {
	constructor(
		private ieObjectsController: IeObjectsController,
		private newspapersService: NewspapersService,
		private eventsService: EventsService,
		private playerTicketService: PlayerTicketService,
		private configService: ConfigService<Configuration>
	) {}

	@Get(':id/export/zip')
	@Header('Content-Type', 'application/zip')
	public async downloadNewspaperAsZip(
		@Param('id') id: string,
		@Query('page') pageIndex: number | undefined,
		@Query('currentPageUrl') currentPageUrl: string,
		@Referer() referer: string,
		@Ip() ip: string,
		@Req() request: Request,
		@Res() res: Response,
		@SessionUser() user: SessionUserEntity
	): Promise<void> {
		const limitedObjectMetadatas = await this.ieObjectsController.getIeObjectsByIds(
			[id],
			null, // No need to add player tickets to the thumbnail urls
			ip,
			user
		);
		const limitedObjectMetadata = limitedObjectMetadatas[0];

		if (!limitedObjectMetadata) {
			throw new ForbiddenException('Object not found or you do not have permission to see it');
		}

		if (limitedObjectMetadata.dctermsFormat !== 'newspaper') {
			throw new ForbiddenException(
				'This object does not appear to be a newspaper. Only public newspapers can be downloaded'
			);
		}

		const zipEntries: {
			filename: string;
			type: 'iiif-image' | 'alto-xml' | 'string';
			value: string;
		}[] = [];

		// Extract images and alto xml urls from the object
		const exportSinglePage = !isNil(pageIndex) && !Number.isNaN(pageIndex);
		const pagesToExport: IeObjectPage[] = exportSinglePage
			? limitedObjectMetadata.pages.slice(pageIndex, pageIndex + 1)
			: limitedObjectMetadata.pages;

		// Pages correspond to pages of the newspaper
		for (const page of pagesToExport) {
			// Each page has multiple representations, e.g. browse copy image, alto xml, image api url, etc.
			for (const representation of page.representations) {
				// Each representation can have multiple files, but usually it's just one
				for (const file of representation.files) {
					const pageNumber = String(page.pageNumber).padStart(3, '0');
					if (file.mimeType === NEWSPAPER_MIME_TYPE_BROWSE_COPY) {
						zipEntries.push({
							filename: `page-${pageNumber}.jpg`,
							type: 'iiif-image',
							value: file.storedAt,
						});
					} else if (file.mimeType === NEWSPAPER_MIME_TYPE_ALTO) {
						zipEntries.push({
							filename: `page-${pageNumber}--ocr-alto.xml`,
							type: 'alto-xml',
							value: file.storedAt,
						});
					}

					null;
				}
			}
		}

		// Add metadata in different formats to zipEntries array
		const metadataInfo = cloneDeep(limitedObjectMetadata);
		metadataInfo.pages = undefined;
		metadataInfo.mentions = undefined;
		metadataInfo.accessThrough = undefined;
		zipEntries.push({
			filename: 'metadata.xml',
			type: 'string',
			value: convertObjectToXml(metadataInfo, this.configService.get('CLIENT_HOST')),
		});
		zipEntries.push({
			filename: 'metadata.csv',
			type: 'string',
			value: convertObjectToCsv(metadataInfo),
		});
		zipEntries.push({
			filename: 'metadata.json',
			type: 'string',
			value: JSON.stringify(metadataInfo, null, 2),
		});

		// const outputStream = fs.createWriteStream(__dirname + '/example.zip');
		const archive = archiver('zip', {
			zlib: { level: 9 }, // Sets the compression level.
		});

		res.on('warning', (err) => {
			if (err.code === 'ENOENT') {
				// log warning
				console.warn(`zip stream warning: ${err}`);
			} else {
				// throw error
				throw err;
			}
		});

		const pageSuffix = exportSinglePage ? `-page-${pageIndex + 1}` : '';
		const filename = `${`newspaper-${id}`}${pageSuffix}.zip`;
		res.set({
			'Content-Disposition': `attachment; filename=${filename}`,
		});
		res.attachment(filename);

		archive.pipe(res);

		// Append all zipEntries to the zip archive
		await mapLimit(zipEntries, 5, async (entry) => {
			try {
				if (entry.type === 'iiif-image' || entry.type === 'alto-xml') {
					// Newspaper iiif images or Alto xml => pass ticket as query param
					const urlWithTicket = await this.playerTicketService.getPlayableUrl(
						entry.value,
						referer,
						ip
					);
					const parsedUrl = new URL(urlWithTicket);
					const options = {
						hostname: parsedUrl.hostname,
						path: parsedUrl.pathname + parsedUrl.search,
						headers: {
							Referer: referer,
						},
					};
					const urlStream = await this.newspapersService.httpsGetAsync(options);
					archive.append(urlStream, { name: entry.filename });
				} else {
					// Csv and xml metadata
					// No ticket needed
					archive.append(entry.value, { name: entry.filename });
				}
			} catch (err) {
				console.error(customError('Failed to add file to zip', err, { entry, referer, ip }));
			}
		});

		await archive.finalize();

		// Log event for download zip
		this.eventsService.insertEvents([
			{
				id: EventsHelper.getEventId(request),
				type: LogEventType.DOWNLOAD,
				source: currentPageUrl || referer || request.path,
				subject: user.getId(),
				time: new Date().toISOString(),
				data: {
					download_type: 'zip',
					type: 'newspaper',
					user_group_name: user.getGroupName(),
					user_group_id: user.getGroupId(),
					pid: limitedObjectMetadata.schemaIdentifier,
					fragment_id: limitedObjectMetadata.fragmentId,
					or_id: limitedObjectMetadata.maintainerId,
				},
			},
		]);
	}

	@Get(':id/export/jpg/selection')
	@Header('Content-Type', 'application/zip')
	public async downloadSelectionInPage(
		@Param('id') id: string,
		@Query('page') pageIndex: number,
		@Query('startX') startX: number,
		@Query('startY') startY: number,
		@Query('width') width: number,
		@Query('height') height: number,
		@Query('currentPageUrl') currentPageUrl: string,
		@Referer() referer: string,
		@Ip() ip: string,
		@Req() request: Request,
		@Res() res: Response,
		@SessionUser() user: SessionUserEntity
	): Promise<void> {
		const limitedObjectMetadatas = await this.ieObjectsController.getIeObjectsByIds(
			[id],
			referer,
			ip,
			user
		);
		const limitedObjectMetadata = limitedObjectMetadatas[0];

		if (!limitedObjectMetadata) {
			throw new ForbiddenException('Object not found or you do not have permission to see it');
		}

		if (limitedObjectMetadata.dctermsFormat !== 'newspaper') {
			throw new ForbiddenException(
				'This object does not appear to be a newspaper. Only public newspapers can be downloaded'
			);
		}

		const page: IeObjectPage = limitedObjectMetadata.pages[pageIndex];
		let pageImageApi: string | null = null;
		page.representations.find((representation) => {
			return representation.files.find((file) => {
				if (file.mimeType === NEWSPAPER_MIME_TYPE_IMAGE_API) {
					pageImageApi = file.storedAt;
				}
				return false;
			});
		});

		if (!pageImageApi) {
			throw new ForbiddenException(
				'This newspaper page does not have an image API representation url'
			);
		}

		const filename = `${`newspaper-${id}`}-selectie.jpg`;
		res.set({
			'Content-Disposition': `attachment; filename=${filename}`,
		});
		res.attachment(filename);

		const selectionUrl = `${pageImageApi}/${Math.floor(startX)},${Math.floor(
			startY
		)},${Math.ceil(width)},${Math.ceil(height)}/full/0/default.jpg`;
		const token = await this.playerTicketService.getPlayerToken(selectionUrl, referer, ip);
		const parsedUrl = new URL(selectionUrl);
		const options = {
			hostname: parsedUrl.hostname,
			path: parsedUrl.pathname + parsedUrl.search,
			headers: {
				Authorization: `Bearer ${token}`,
				Referer: referer,
			},
		};
		const urlStream = await this.newspapersService.httpsGetAsync(options);
		urlStream.pipe(res);

		// Log event for download jpg selection
		// No await since we don't want to fail the request if the event insertion fails
		this.eventsService.insertEvents([
			{
				id: EventsHelper.getEventId(request),
				type: LogEventType.DOWNLOAD,
				source: currentPageUrl || referer || request.path,
				subject: user.getId(),
				time: new Date().toISOString(),
				data: {
					type: 'newspaper',
					user_group_name: user.getGroupName(),
					user_group_id: user.getGroupId(),
					pid: limitedObjectMetadata.schemaIdentifier,
					fragment_id: limitedObjectMetadata.fragmentId,
					or_id: limitedObjectMetadata.maintainerId,
				},
			},
		]);
	}

	@Get('newspaper-titles')
	public async getNewspaperTitles(): Promise<NewspaperTitle[]> {
		return this.newspapersService.getNewspaperTitles();
	}
}
