import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsOptional } from 'class-validator';

import { MaterialRequestType } from '~modules/material-requests/material-requests.types';
import { commaSeparatedStringToArray } from '~shared/helpers/comma-separated-string-to-array';

export class ContentPartnersQueryDto {
	@IsBoolean()
	@Transform((input) => {
		if (input.value === undefined) {
			return undefined;
		}
		return input.value === 'false' ? false : true;
	})
	@IsOptional()
	@ApiPropertyOptional({
		type: Boolean,
		description: 'Filter on content partners with/without a space',
		default: undefined,
	})
	hasSpace?: boolean = undefined;

	@IsArray()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		isArray: true,
		description: 'OR-ids for which you want to receive information',
		default: [],
	})
	@Transform(commaSeparatedStringToArray)
	orIds?: string[] = [];
}
