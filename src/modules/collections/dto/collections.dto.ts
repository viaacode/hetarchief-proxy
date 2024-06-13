import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { string } from 'joi';

export class CreateOrUpdateCollectionDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: string,
		description: 'The name of the collection',
		example: 'Favorites',
	})
	name: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: string,
		description: 'The description of the collection',
		example: 'My favorite movies',
	})
	description?: string;
}

export class CollectionObjectsQueryDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: "The query to search for. Use '%queryTerm%' for wildcard.",
		default: undefined,
	})
	query? = undefined;

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
		default: 10,
	})
	size? = 10;
}
