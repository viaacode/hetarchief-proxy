import { Lookup_App_Material_Request_Requester_Capacity_Enum } from '@meemoo/admin-core-api/dist/src/modules/shared/generated/graphql-db-types-hetarchief';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
} from 'class-validator';

import { MaterialRequestOrderProp, MaterialRequestType } from '../material-requests.types';

import { Lookup_App_Material_Request_Status_Enum } from '~generated/graphql-db-types-hetarchief';
import { commaSeparatedStringToArray } from '~shared/helpers/comma-separated-string-to-array';
import { SortDirection } from '~shared/types';

export class MaterialRequestsQueryDto {
	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: "Text to search for in the name or email af the requester. Use '%' for wildcard.",
		default: undefined,
	})
	query?: string;

	@IsArray()
	@IsEnum(MaterialRequestType, { each: true })
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		isArray: true,
		description: 'Which type of material request is requested',
		default: undefined,
		enum: MaterialRequestType,
	})
	@Transform(commaSeparatedStringToArray)
	type? = undefined;

	@IsArray()
	@IsEnum(Lookup_App_Material_Request_Status_Enum, { each: true })
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		isArray: true,
		description: 'Which statuses of material requests are requested',
		default: undefined,
		enum: Lookup_App_Material_Request_Status_Enum,
	})
	@Transform(commaSeparatedStringToArray)
	status? = undefined;

	@IsArray()
	@IsString({ each: true })
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		isArray: true,
		description: 'Does the material requests contain a download URL?',
		default: undefined,
	})
	@Transform(commaSeparatedStringToArray)
	hasDownloadUrl? = undefined;

	@IsArray()
	@IsString({ each: true })
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		isArray: true,
		description: 'List of maintainer ids',
		default: [],
	})
	@Transform(commaSeparatedStringToArray)
	maintainerIds?: string[];

	@IsBoolean()
	@Type(() => Boolean)
	@Transform((input) => {
		return input.obj.isPending === 'true';
	})
	@IsOptional()
	@ApiPropertyOptional({
		type: Boolean,
		description: 'Is the material request pending or already requested',
		default: null,
	})
	isPending?: boolean | null;

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

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'property to sort the results by',
		default: 'createdAt',
		enum: MaterialRequestOrderProp,
	})
	orderProp? = MaterialRequestOrderProp.CREATED_AT;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Direction to sort in. either desc or asc',
		default: SortDirection.desc,
		enum: [SortDirection.asc, SortDirection.desc],
	})
	orderDirection? = SortDirection.desc;
}

export class CreateMaterialRequestDto {
	@IsString()
	@ApiProperty({
		type: String,
		description: 'The object schema identifier',
		example: '0000003g0k',
	})
	objectSchemaIdentifier: string;

	@IsString()
	@IsOptional()
	@ApiProperty({
		type: String,
		description: 'The representation id of the object which the user wants to use',
		example: 'https://data-int.hetarchief.be/id/entity/078a64bd61a8f4edb35c0af1fe062b32',
	})
	objectRepresentationId?: string = '';

	@IsString()
	@IsEnum(MaterialRequestType)
	@ApiProperty({
		type: String,
		description: 'Which type of material request is requested',
		default: undefined,
		enum: MaterialRequestType,
	})
	type = undefined;

	@IsString()
	@IsOptional()
	@ApiProperty({
		type: String,
		description: "The reason for this user's material request",
		example:
			'I would like to do research on evolution of the Dutch language in the vrt news across the decades.',
	})
	reason?: string = '';

	@IsString()
	@IsEnum(Lookup_App_Material_Request_Requester_Capacity_Enum)
	@ApiProperty({
		type: String,
		description: 'Which capacity the requester is part of',
		default: undefined,
		enum: Lookup_App_Material_Request_Requester_Capacity_Enum,
	})
	requesterCapacity = undefined;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'To which organisation the user belongs to',
		default: null,
	})
	organisation?: string | null = null;

	@IsObject()
	@IsOptional()
	@ApiPropertyOptional({
		type: Object,
		description: 'The data object with all key-value pairs of the reuse form',
		default: null,
	})
	reuseForm: Record<string, string>;
}

export class UpdateMaterialRequestDto {
	@IsString()
	@IsEnum(MaterialRequestType)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Which type of material request is requested',
		default: undefined,
		enum: MaterialRequestType,
	})
	type? = undefined;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: "The reason for this user's material request",
		example:
			'I would like to do research on evolution of the Dutch language in the vrt news across the decades.',
	})
	reason?: string;

	@IsString()
	@IsEnum(Lookup_App_Material_Request_Requester_Capacity_Enum)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Which capacity the requester is part of',
		default: undefined,
		enum: Lookup_App_Material_Request_Requester_Capacity_Enum,
	})
	requesterCapacity? = undefined;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'To which organisation the user belongs to',
	})
	organisation?: string | null;

	@IsObject()
	@IsOptional()
	@ApiPropertyOptional({
		type: Object,
		description: 'The data object with all key-value pairs of the reuse form',
		default: null,
	})
	reuseForm: Record<string, string>;
}

export class SendRequestListDto {
	@IsString()
	@IsEnum(Lookup_App_Material_Request_Requester_Capacity_Enum)
	@ApiPropertyOptional({
		type: String,
		enum: Lookup_App_Material_Request_Requester_Capacity_Enum,
	})
	type: Lookup_App_Material_Request_Requester_Capacity_Enum;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The name of the organisation to which the user belongs',
	})
	organisation?: string | null = null;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The name the user gave this list of requests (key users only)',
	})
	requestGroupName?: string | null = null;
}

export class UpdateMaterialRequestStatusDto {
	@IsString()
	@IsEnum(Lookup_App_Material_Request_Status_Enum)
	@ApiPropertyOptional({
		type: String,
		description: 'The new status of the request',
		default: undefined,
		enum: Lookup_App_Material_Request_Status_Enum,
	})
	status: Lookup_App_Material_Request_Status_Enum;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The motivation to approve or deny the request',
	})
	motivation?: string | null = null;
}
