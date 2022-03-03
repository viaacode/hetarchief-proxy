import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsArray,
	IsDateString,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

import { MediaFormat } from '../types';

import { SortDirection } from '~shared/types';

export class RangeQueryDuration {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The minimum duration of the media items',
		example: '00:15:00',
	})
	gte?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The maximum duration of the media items',
		example: '00:50:00',
	})
	lte?: string;
}
export class RangeQueryDate {
	@IsDateString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The minimum date',
		example: '2020-09-01',
	})
	gte?: string;

	@IsDateString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The maximum date',
		example: '2020-12-31',
	})
	lte?: string;
}

export class SearchFilters {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'The text to search for in the title, description and abstract of the media items.',
		default: '',
	})
	query?: string;

	@IsString()
	@IsOptional()
	@IsEnum(MediaFormat)
	@ApiPropertyOptional({
		type: String,
		description: 'Filter the results on format: video or audio',
		required: false,
		enum: MediaFormat,
	})
	format?: MediaFormat;

	@Type(() => RangeQueryDuration)
	@IsOptional()
	@ValidateNested()
	@ApiPropertyOptional({
		type: RangeQueryDuration,
		description: 'Specify upper and/or lower bounds for the duration of the media item',
		example: {
			gte: '00:15:00',
			lte: '00:50:00',
		},
	})
	duration?: RangeQueryDuration;

	@Type(() => RangeQueryDate)
	@IsOptional()
	@ValidateNested()
	@ApiPropertyOptional({
		type: RangeQueryDate,
		description: 'Specify upper and/or lower bounds for the creation date of the media item',
		example: {
			gte: '2020-09-01',
			lte: '2020-12-31',
		},
	})
	created?: RangeQueryDate;

	@Type(() => RangeQueryDate)
	@IsOptional()
	@ValidateNested()
	@ApiPropertyOptional({
		type: RangeQueryDate,
		description: 'Specify upper and/or lower bounds for the publish date of the media item',
		example: {
			gte: '2020-09-01',
			lte: '2020-12-31',
		},
	})
	published?: RangeQueryDate;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'Filter the results on the creator of the media item - TODO currently this requires an exact match',
		required: false,
	})
	// TODO update filter for creator? -- currently requires an exact match (incl. case sensitivity)
	creator?: string;

	@IsString()
	@IsOptional()
	@Transform((genre) => genre.value.toLowerCase())
	@ApiPropertyOptional({
		type: String,
		description:
			'Filter the results on the creator of the media item - TODO currently this requires an exact match',
		required: false,
	})
	// TODO update filter for genre? -- currently requires an exact match and input should be lowercased
	genre?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'Filter the results on the creator of the media item - TODO currently this requires an exact match',
		required: false,
	})
	// TODO update filter for keyword: multiple keywords? -- currently requires an exact match and input should be lowercased
	keyword?: string;
}

export class MediaQueryDto {
	@Type(() => SearchFilters)
	@IsOptional()
	@ValidateNested()
	@ApiPropertyOptional({
		type: SearchFilters,
		description: 'Filters to query the media items',
	})
	filters?: SearchFilters;

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

	@IsArray()
	@IsOptional()
	@ApiPropertyOptional({
		type: Array,
		description: 'The aggregates to include in the result',
		default: [],
	})
	requestedAggs?: Array<keyof SearchFilters>;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'property to sort the results by',
		default: 'dcterms_available',
		enum: [
			'schema_in_language',
			'dcterms_available',
			'schema_creator.Archiefvormer?',
			'schema_creator.Maker?',
			'schema_creator.productionCompany?',
			'schema_identifier',
			'schema_description?',
			'schema_publisher.Publisher',
			'schema_duration',
			'schema_abstract?',
			'premis_identifier',
			'schema_genre?',
			'schema_date_published?',
			'schema_license?',
			'schema_date_created?',
			'schema_contributor',
			'schema_maintainer.schema_identifier',
			'dcterms_format',
			'schema_name',
		],
	})
	orderProp? = 'dcterms_available';

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Direction to sort in. either desc or asc',
		default: SortDirection.asc,
		enum: SortDirection,
	})
	orderDirection? = SortDirection.asc;
}

export class PlayerTicketsQueryDto {
	@IsString()
	@ApiProperty({
		type: String,
		description: 'Get the playable url for the object with this id',
	})
	id: string;
}
