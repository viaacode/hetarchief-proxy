import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { MaterialRequestAttachmentOrderProp } from '../material-request-messages.types';

import { SortDirection } from '~shared/types';

export class MaterialRequestAttachmentsQueryDto {
	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'Which page of results to fetch. Counting starts at 1',
		default: 1,
	})
	page? = 1;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'The max. number of results to return',
		default: 20,
	})
	size? = 20;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Property to sort the results by',
		default: MaterialRequestAttachmentOrderProp.CREATED_AT,
		enum: MaterialRequestAttachmentOrderProp,
	})
	orderProp? = MaterialRequestAttachmentOrderProp.CREATED_AT;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Direction to sort in. either desc or asc',
		default: SortDirection.asc,
		enum: [SortDirection.asc, SortDirection.desc],
	})
	orderDirection? = SortDirection.asc;
}

export class CreateMaterialRequestMessageDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: String,
		description: 'The message text to send',
		required: true,
	})
	message: string;

	@IsOptional()
	@ApiPropertyOptional({
		type: 'array',
		items: { type: 'string', format: 'binary' },
		description:
			'Optional file attachments. Allowed types: pdf, doc, docx, xls, xlsx, jpg, jpeg, png, csv, gif, tiff, tif. Max 30 MB per file, max 20 files.',
	})
	files?: any[];
}
