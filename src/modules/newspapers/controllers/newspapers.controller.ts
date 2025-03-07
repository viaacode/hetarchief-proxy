import https from 'https';

import {
	Controller,
	ForbiddenException,
	Get,
	Header,
	Headers,
	Param,
	Query,
	Req,
	Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Idp } from '@viaa/avo2-types';
import archiver from 'archiver';
import { mapLimit } from 'blend-promise-utils';
import { Request, Response } from 'express';
import { cloneDeep, isNil } from 'lodash';

import { EventsService } from '~modules/events/services/events.service';
import { LogEventType } from '~modules/events/types';
import { IeObjectsController } from '~modules/ie-objects/controllers/ie-objects.controller';
import { convertObjectToCsv } from '~modules/ie-objects/helpers/convert-objects-to-csv';
import { convertObjectToXml } from '~modules/ie-objects/helpers/convert-objects-to-xml';
import type { NewspaperTitle } from '~modules/ie-objects/ie-objects.types';
import {
	NEWSPAPER_MIME_TYPE_ALTO,
	NEWSPAPER_MIME_TYPE_BROWSE_COPY,
	NEWSPAPER_MIME_TYPE_IMAGE_API,
} from '~modules/newspapers/newspapers.consts';
import { NewspapersService } from '~modules/newspapers/services/newspapers.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { SessionUser } from '~shared/decorators/user.decorator';
import { EventsHelper } from '~shared/helpers/events';

@ApiTags('Newspapers')
@Controller('newspapers')
export class NewspapersController {
	constructor(
		private ieObjectsController: IeObjectsController,
		private newspapersService: NewspapersService,
		private eventsService: EventsService
	) {}

	@Get(':id/export/zip')
	@Header('Content-Type', 'application/zip')
	public async downloadNewspaperAsZip(
		@Param('id') id: string,
		@Query('page') pageIndex: number | undefined,
		@Headers('referer') referer: string,
		@Req() request: Request,
		@Res() res: Response,
		@SessionUser() user: SessionUserEntity
	): Promise<void> {
		const limitedObjectMetadata = await this.ieObjectsController.getIeObjectById(
			id,
			referer,
			request,
			user
		);

		if (!limitedObjectMetadata) {
			throw new ForbiddenException(
				'Object not found or you do not have permission to see it'
			);
		}

		if (limitedObjectMetadata.dctermsFormat !== 'newspaper') {
			throw new ForbiddenException(
				'This object does not appear to be a newspaper. Only public newspapers can be downloaded'
			);
		}

		const zipEntries: { filename: string; type: 'url' | 'string'; value: string }[] = [];

		// Extract images and alto xml urls from the object
		const exportSinglePage = !isNil(pageIndex) && !isNaN(pageIndex);
		const pagesToExport = exportSinglePage
			? limitedObjectMetadata.pageRepresentations.slice(pageIndex, pageIndex + 1)
			: limitedObjectMetadata.pageRepresentations;

		// Pages correspond to pages of the newspaper
		pagesToExport.forEach((pageRepresentation, pageRepresentationIndex) => {
			// Each page has multiple representations, e.g. browse copy image, alto xml, image api url, etc.
			return pageRepresentation.representations.forEach((representation) => {
				// Each representation can have multiple files, but usually it's just one
				return representation.files.forEach((file) => {
					const currentPageIndex = exportSinglePage ? pageIndex : pageRepresentationIndex;
					const pageNumber = String(currentPageIndex + 1).padStart(3, '0');
					if (file.mimeType === NEWSPAPER_MIME_TYPE_BROWSE_COPY) {
						zipEntries.push({
							filename: `page-${pageNumber}.jpg`,
							type: 'url',
							value: file.storedAt,
						});
					} else if (file.mimeType === NEWSPAPER_MIME_TYPE_ALTO) {
						zipEntries.push({
							filename: `page-${pageNumber}--ocr-alto.xml`,
							type: 'url',
							value: file.storedAt,
						});
					}

					return null;
				});
			});
		});

		// Add metadata in different formats to zipEntries array
		const metadataInfo = cloneDeep(limitedObjectMetadata);
		delete metadataInfo.pageRepresentations;
		delete metadataInfo.accessThrough;
		zipEntries.push({
			filename: 'metadata.xml',
			type: 'string',
			value: convertObjectToXml(metadataInfo),
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
				console.warn('zip stream warning: ' + err);
			} else {
				// throw error
				throw err;
			}
		});

		const pageSuffix = exportSinglePage ? '-page-' + (pageIndex + 1) : '';
		const filename = `${'newspaper-' + id}${pageSuffix}.zip`;
		res.set({
			'Content-Disposition': `attachment; filename=${filename}`,
		});
		res.attachment(filename);

		archive.pipe(res);

		// Append all zipEntries to the zip archive
		await mapLimit(zipEntries, 5, async (entry) => {
			return new Promise<void>((resolve) => {
				if (entry.type === 'url') {
					https.get(entry.value, (urlStream) => {
						archive.append(urlStream, { name: entry.filename });
						resolve();
					});
				} else {
					archive.append(entry.value, { name: entry.filename });
					resolve();
				}
			});
		});

		await archive.finalize();

		// Log event for download zip
		this.eventsService.insertEvents([
			{
				id: EventsHelper.getEventId(request),
				type: LogEventType.DOWNLOAD,
				source: request.path,
				subject: user.getId(),
				time: new Date().toISOString(),
				data: {
					download_type: 'zip',
					idp: Idp.HETARCHIEF,
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
		@Headers('referer') referer: string,
		@Req() request: Request,
		@Res() res: Response,
		@SessionUser() user: SessionUserEntity
	): Promise<void> {
		const limitedObjectMetadata = await this.ieObjectsController.getIeObjectById(
			id,
			referer,
			request,
			user
		);

		if (!limitedObjectMetadata) {
			throw new ForbiddenException(
				'Object not found or you do not have permission to see it'
			);
		}

		if (limitedObjectMetadata.dctermsFormat !== 'newspaper') {
			throw new ForbiddenException(
				'This object does not appear to be a newspaper. Only public newspapers can be downloaded'
			);
		}

		const pageRepresentation = limitedObjectMetadata.pageRepresentations[pageIndex];
		let pageImageApi: string | null = null;
		pageRepresentation.representations.find((representation) => {
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

		const filename = `${'newspaper-' + id}-selectie.jpg`;
		res.set({
			'Content-Disposition': `attachment; filename=${filename}`,
		});
		res.attachment(filename);

		https.get(
			`${pageImageApi}/${Math.floor(startX)},${Math.floor(startY)},${Math.ceil(
				width
			)},${Math.ceil(height)}/full/0/default.jpg`,
			(urlStream) => {
				urlStream.pipe(res);
			}
		);

		// Log event for download jpg selection
		this.eventsService.insertEvents([
			{
				id: EventsHelper.getEventId(request),
				type: LogEventType.DOWNLOAD,
				source: request.path,
				subject: user.getId(),
				time: new Date().toISOString(),
				data: {
					download_type: 'jpg',
					idp: Idp.HETARCHIEF,
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
