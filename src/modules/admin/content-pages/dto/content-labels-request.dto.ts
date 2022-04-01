import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

import {
	ContentPageType,
	ContentPageTypeValues,
} from '~modules/admin/content-pages/content-pages.types';
import { commaSeparatedStringToArray } from '~shared/helpers/comma-separated-string-to-array';

export class ContentLabelsRequestDto {
	@IsString()
	@ApiPropertyOptional({
		type: String,
		description: `Get labels for this content page type. Options are: [${Object.values(
			ContentPageTypeValues
		).join(', ')}]`,
		default: ContentPageTypeValues.Pagina,
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
