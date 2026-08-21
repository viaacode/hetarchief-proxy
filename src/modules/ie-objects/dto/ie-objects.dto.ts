import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	ArrayMaxSize,
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	ValidateNested,
} from 'class-validator';
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
		default: 20,
	})
	size? = 20;

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
		description: 'The schema identifier of the ie-object that contains the requested file',
		example: '086348mc8s',
		required: true,
	})
	schemaIdentifier: string;

	@IsString()
	@ApiProperty({
		type: String,
		description: 'Get the playable url for the file with this id',
		example: 'https://data-qas.hetarchief.be/id/entity/5f77e0bd9220b2ff22202701157ebd2e\n',
		required: true,
	})
	fileId: string;

	/**
	 * Start and end time of the snippet that should be played, in whole seconds.
	 * Used by the "Videoblok" content block to play an editorial snippet of an AV object,
	 * without that snippet existing as a separate object in the MAM.
	 * https://meemoo.atlassian.net/browse/ARC-3832
	 *
	 * Either both are given or neither is (see assertValidStartAndEndTime in the controller):
	 * the ticket service only cuts when it receives an end time, so a start without an end
	 * would silently return an uncut url.
	 */
	@IsInt()
	@Min(0)
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'Start time of the snippet to play, in seconds. Requires endTime.',
		example: 10,
	})
	startTime?: number;

	@IsInt()
	@Min(0)
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'End time of the snippet to play, in seconds. Requires startTime.',
		example: 25,
	})
	endTime?: number;
}

export class ThumbnailQueryDto {
	@IsString()
	@ApiProperty({
		type: String,
		description: 'Get the playable url for the object with this id',
	})
	id: string;
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

export class IeObjectPlayableDisplayDataItemDto {
	@IsString()
	@ApiProperty({
		type: String,
		description:
			'Schema identifier (PID) of the ie-object. Empty for a block element that has no object ' +
			'selected yet: it resolves to null, but keeps its position in the response',
		example: '086348mc8s',
	})
	schemaIdentifier: string;

	@IsNumber()
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'Snippet start in seconds',
	})
	start?: number;

	@IsNumber()
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'Snippet end in seconds',
	})
	end?: number;
}

export const PLAYABLE_DISPLAY_DATA_MAX_OBJECTS = 100;

export class IeObjectsPlayableDisplayDataQueryDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'Id of the content block whose config lists the ie-objects to fetch playable display data for',
		example: 'c9c9f4b1-1a6f-4f0e-9d2e-9e5f1a2b3c4d',
	})
	blockId?: string;

	@IsArray()
	@ArrayNotEmpty()
	@ArrayMaxSize(PLAYABLE_DISPLAY_DATA_MAX_OBJECTS)
	@ValidateNested({ each: true })
	@Type(() => IeObjectPlayableDisplayDataItemDto)
	@IsOptional()
	@ApiPropertyOptional({
		type: [IeObjectPlayableDisplayDataItemDto],
		description: `Content page editor only: the ie-objects of a content block that has not been saved yet, so it has no blockId to look up. Ignored for users without content page edit permissions. Max ${PLAYABLE_DISPLAY_DATA_MAX_OBJECTS} items.`,
	})
	objects?: IeObjectPlayableDisplayDataItemDto[];
}
