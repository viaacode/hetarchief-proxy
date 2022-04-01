import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

import { ContentPageType } from '~modules/admin/content-pages/content-pages.types';
import { commaSeparatedStringToArray } from '~shared/helpers/comma-separated-string-to-array';

export class ContentLabelsRequestDto {
	@IsString()
	@ApiPropertyOptional({
		type: String,
		description: `Get labels for this content page type. Options are: [${Object.values(
			ContentPageType
		).join(', ')}]`,
		default: ContentPageType.PAGINA,
	})
	contentType: ContentPageType;

	@IsArray()
	@IsOptional()
	@Transform(commaSeparatedStringToArray)
	@ApiPropertyOptional({
		type: String,
		description: 'Get the labels with these ids',
		required: false,
		example: ['1a1bd2fa-535d-49e3-8a1d-3d8564edafff'],
	})
	labelIds?: string[];

	@IsArray()
	@IsOptional()
	@Transform(commaSeparatedStringToArray)
	@ApiPropertyOptional({
		type: String,
		description: 'Get labels with these label values',
		required: false,
		example: ['Aanmelden'],
	})
	labels?: string[];
}
