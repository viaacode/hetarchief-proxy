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
import archiver from 'archiver';
import { mapLimit } from 'blend-promise-utils';
import { Request, Response } from 'express';
import { isNil } from 'lodash';

import { IeObjectsController } from '~modules/ie-objects/controllers/ie-objects.controller';
import { convertObjectToCsv } from '~modules/ie-objects/helpers/convert-objects-to-csv';
import { convertObjectToXml } from '~modules/ie-objects/helpers/convert-objects-to-xml';
import {
	NEWSPAPER_MIME_TYPE_ALTO,
	NEWSPAPER_MIME_TYPE_BROWSE_COPY,
} from '~modules/newspapers/newspapers.consts';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Permission } from '~modules/users/types';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';

@ApiTags('Newspapers')
@Controller('newspapers')
export class NewspapersController {
	constructor(private ieObjectsController: IeObjectsController) {}

	@Get(':id/export/zip')
	@Header('Content-Type', 'application/zip')
	@RequireAllPermissions(Permission.DOWNLOAD_OBJECT)
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
		pagesToExport.forEach((representations, pageRepresentationIndex) => {
			return representations.forEach((representation) => {
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
						zipEntries.push({
							filename: `page-${pageNumber}--ocr-text.txt`,
							type: 'string',
							value: representation.schemaTranscript,
						});
					}

					return null;
				});
			});
		});

		// Add metadata in different formats to zipEntries array
		zipEntries.push({
			filename: 'metadata.xml',
			type: 'string',
			value: convertObjectToXml(limitedObjectMetadata),
		});
		zipEntries.push({
			filename: 'metadata.csv',
			type: 'string',
			value: convertObjectToCsv(limitedObjectMetadata),
		});
		zipEntries.push({
			filename: 'metadata.json',
			type: 'string',
			value: JSON.stringify(limitedObjectMetadata, null, 2),
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

		res.set({
			'Content-Disposition': `attachment; filename=${'newspaper-' + id}.zip`,
		});
		res.attachment(`${'newspaper-' + id}.zip`);
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
	}
}
