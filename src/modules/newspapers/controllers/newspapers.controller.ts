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
import { Request, Response } from 'express';
import { compact } from 'lodash';

import { convertObjectToCsv } from '~modules/ie-objects/helpers/convert-objects-to-csv';
import { convertObjectToXml } from '~modules/ie-objects/helpers/convert-objects-to-xml';
import type { IeObject } from '~modules/ie-objects/ie-objects.types';
import { IeObjectsService } from '~modules/ie-objects/services/ie-objects.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Permission } from '~modules/users/types';
import { RequireAllPermissions } from '~shared/decorators/require-permissions.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';
import { getIpFromRequest } from '~shared/helpers/get-ip-from-request';

@ApiTags('Newspapers')
@Controller('newspapers')
export class NewspapersController {
	constructor(private ieObjectsService: IeObjectsService) {}

	@Get(':id/export/zip')
	@Header('Content-Type', 'application/zip')
	@RequireAllPermissions(Permission.DOWNLOAD_OBJECT)
	public async downloadNewspaperAsZip(
		@Param('id') id: string,
		@Query('page') pageIndex: number,
		@Headers('referer') referer: string,
		@Req() request: Request,
		@Res() res: Response,
		@SessionUser() user: SessionUserEntity
	): Promise<void> {
		console.log({
			pageIndex,
			userId: user.getId(),
		});
		// const limitedObjectMetadata = await this.ieObjectsController.getIeObjectById(
		// 	id,
		// 	referer,
		// 	request,
		// 	user
		// );
		const ieObjects: IeObject[] = await this.ieObjectsService.findBySchemaIdentifiers(
			[id],
			referer,
			getIpFromRequest(request)
		);
		const limitedObjectMetadata = ieObjects[0];

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

		const pageImageUrls = compact(
			limitedObjectMetadata.representations.flatMap((representation) => {
				return representation.files.map((file) => {
					if (file.mimeType !== 'image/jpeg') {
						return null;
					}
					return file.storedAt;
				});
			})
		);
		const metadataXml = convertObjectToXml(limitedObjectMetadata);
		const metadataCsv = convertObjectToCsv(limitedObjectMetadata);
		const metadataJson = JSON.stringify(limitedObjectMetadata, null, 2);

		console.log({
			pageImageUrls,
			metadataXml,
			metadataJson,
		});

		// const outputStream = fs.createWriteStream(__dirname + '/example.zip');
		const archive = archiver('zip', {
			zlib: { level: 9 }, // Sets the compression level.
		});

		res.on('close', () => {
			console.log(archive.pointer() + ' total bytes');
			console.log('archiver has been finalized and the output file descriptor has closed.');
		});

		res.on('end', () => {
			console.log('Data has been drained');
		});

		res.on('warning', (err) => {
			if (err.code === 'ENOENT') {
				// log warning
				console.log('zip stream warning: ' + err);
			} else {
				// throw error
				throw err;
			}
		});

		res.set({
			'Content-Disposition': `attachment; filename=${'metadata-' + id}.zip`,
		});
		res.attachment(`${'metadata-' + id}.zip`);
		archive.pipe(res);

		archive.append(metadataXml, { name: 'metadata.xml' });
		archive.append(metadataCsv, { name: 'metadata.csv' });
		archive.append(metadataJson, { name: 'metadata.json' });

		await archive.finalize();
	}
}
