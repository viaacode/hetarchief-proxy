import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { isArray } from 'lodash';

import { Operator, SearchFilterField } from '../types';

import { SortDirection } from '~shared/types';

export class SearchFilter {
	@IsString()
	@IsEnum(SearchFilterField)
	@ApiProperty({
		type: String,
		description: `The field to filter on. Options are: ${Object.values(SearchFilterField).join(
			', '
		)}`,
	})
	field: SearchFilterField;

	@IsArray()
	@IsOptional()
	@Transform((input) => {
		if (!isArray(input.value)) {
			return [input.value.trim()];
		}
		return input.value.map((kw) => kw.trim());
	})
	@ApiPropertyOptional({
		type: String,
		description: `The array of values for the filter. Uses the OR operator. If both multiValue and value are set, value is ignored.`,
	})
	multiValue?: Array<string>;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: `The single value for the filter. If both multiValue and value are set, value is ignored.`,
	})
	value?: string;

	@IsString()
	@IsEnum(Operator)
	@ApiProperty({
		type: String,
		description: `The query operator. Options are: ${Object.values(Operator).join(', ')}`,
	})
	operator: Operator;
}

export class MediaQueryDto {
	@Type(() => SearchFilter)
	@IsArray()
	@ValidateNested()
	@ApiPropertyOptional({
		type: SearchFilter,
		description: 'Filter to query the media items',
	})
	filters?: SearchFilter[];

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
	@IsEnum(SearchFilterField, { each: true })
	@ApiPropertyOptional({
		type: Array,
		description: 'The aggregates to include in the result',
		default: [],
	})
	requestedAggs?: SearchFilterField[];

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
