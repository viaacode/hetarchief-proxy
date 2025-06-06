import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { isArray } from 'lodash';

import {
	IeObjectsSearchFilterField,
	Operator,
	OrderProperty,
} from '../elasticsearch/elasticsearch.consts';

import { AutocompleteField } from '~modules/ie-objects/ie-objects.types';
import { commaSeparatedStringToArray } from '~shared/helpers/comma-separated-string-to-array';
import { SortDirection } from '~shared/types';

export class SearchFilter {
	@IsString()
	@IsEnum(IeObjectsSearchFilterField)
	@ApiProperty({
		type: String,
		description: `The field to filter on. Options are: ${Object.values(
			IeObjectsSearchFilterField
		).join(', ')}`,
	})
	field: IeObjectsSearchFilterField;

	@IsArray()
	@IsOptional()
	@Transform((input) => {
		if (!isArray(input.value)) {
			return [input.value.trim()];
		}
		return input.value.map((kw) => kw.trim());
	})
	@ApiPropertyOptional({
		type: [String],
		description:
			'The array of values for the filter. Uses the OR operator. If both multiValue and value are set, value is ignored.',
	})
	multiValue?: Array<string>;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'The single value for the filter. If both multiValue and value are set, value is ignored.',
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

export class IeObjectsAutocompleteQueryDto {
	@Type(() => SearchFilter)
	@IsArray()
	@ValidateNested()
	@ApiPropertyOptional({
		type: () => [SearchFilter],
		description: 'Filter to query the media items',
	})
	filters?: SearchFilter[];

	@IsString()
	@Type(() => String)
	@ApiProperty({
		type: String,
		description: 'The field to find autocomplete values for',
		enum: AutocompleteField,
	})
	field: AutocompleteField;

	@IsString()
	@Type(() => String)
	@ApiProperty({
		type: String,
		description: 'The text the user already typed in the autocomplete input field',
	})
	query: string;
}

export class IeObjectsQueryDto {
	@Type(() => SearchFilter)
	@IsArray()
	@ValidateNested()
	@ApiPropertyOptional({
		type: () => [SearchFilter],
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
	@IsEnum(IeObjectsSearchFilterField, { each: true })
	@ApiPropertyOptional({
		type: Array,
		description: 'The aggregates to include in the result',
		default: [],
	})
	requestedAggs?: IeObjectsSearchFilterField[];

	@IsString()
	@IsEnum(OrderProperty)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'property to sort the results by',
		default: 'relevance',
		enum: OrderProperty,
	})
	orderProp? = OrderProperty.RELEVANCE;

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
		description: 'Get the playable url for the file with this browsePath',
		example:
			'https://media-qas.viaa.be/play/v2/VLAAMSPARLEMENT/d7d7841f8ad946f8bfa5116b30b9041ccec8fc5521d2404cab08b86c2d41466e/browse.mp4',
		required: true,
	})
	browsePath: string;
}

export class ThumbnailQueryDto {
	@IsString()
	@ApiProperty({
		type: String,
		description: 'Get the playable url for the object with this id',
	})
	id: string;
}

export class IeObjectsMeemooIdentifiersQueryDto {
	@IsArray()
	@IsOptional()
	@Transform(commaSeparatedStringToArray)
	@ApiPropertyOptional({
		type: Array,
		description: 'The identifiers to fetch corresponding schema_identifiers for',
		default: [],
	})
	meemooIdentifiers: string[];
}

export class IeObjectsSimilarQueryDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Fetch similar object with the same maintainerId',
	})
	maintainerId?: string;
}
