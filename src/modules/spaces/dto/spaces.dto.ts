import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSpaceDto {
	@IsString()
	description: string;
}

export class SpacesQueryDto {
	@IsString()
	@IsOptional()
	query = '%%';

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	page = 0;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	size = 10;
}
