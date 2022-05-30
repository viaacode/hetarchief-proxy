import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

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
	hasSpace? = undefined;
}
