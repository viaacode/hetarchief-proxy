import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { string } from 'joi';

export class CreateVisitDto {
	@IsUUID()
	@ApiProperty({
		type: string,
		description: "The space's uuid",
	})
	spaceId: string;

	@IsUUID()
	@ApiProperty({
		type: string,
		description: 'The uuid of the user making the request',
	})
	userProfileId: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: string,
		description: 'The requested timeframe by the user',
	})
	timeframe: string;

	@IsString()
	@IsOptional()
	@ApiProperty({
		type: string,
		description: "The reason for this user's visit",
	})
	reason?: string;

	@IsBoolean()
	@ApiProperty({
		type: Boolean,
		description: 'If the user accepted the Terms of Service',
	})
	acceptedTos: boolean;
}

export class VisitsQueryDto {
	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			"Text to search for in the name or email af the requester. Use '%' for wildcard.",
		default: '%',
	})
	query = '%';

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'The paging parameter',
		default: 0,
	})
	page = 0;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'The max. number of results to return',
		default: 10,
	})
	size = 10;
}
