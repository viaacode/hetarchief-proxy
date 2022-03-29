import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class ContentLabelsRequestDto {
	@IsString()
	@ApiPropertyOptional({
		type: String,
		description: 'Get labels for this content page type. Options are: [PAGINA]',
		default: 'PAGINA',
	})
	contentType: string;

	@IsArray()
	@IsOptional()
	@Transform((labelIds) => {
		if (typeof labelIds.value == 'string') {
			return labelIds.value.split(',');
		}
		return labelIds.value;
	})
	@ApiPropertyOptional({
		type: String,
		description: 'Get the labels with these ids',
		required: false,
		example: ['1a1bd2fa-535d-49e3-8a1d-3d8564edafff'],
	})
	labelIds?: string[];

	@IsArray()
	@IsOptional()
	@Transform((labels) => {
		if (typeof labels.value == 'string') {
			return labels.value.split(',');
		}
		return labels.value;
	})
	@ApiPropertyOptional({
		type: String,
		description: 'Get labels with these label values',
		required: false,
		example: ['Aanmelden'],
	})
	labels?: string[];
}
