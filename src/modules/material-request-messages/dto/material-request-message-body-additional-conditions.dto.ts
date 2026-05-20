import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import {
	MaterialRequestAdditionalConditionsType,
	MaterialRequestMessageBodyAdditionalCondition,
	MaterialRequestMessageBodyAdditionalConditions,
} from '../material-request-messages.types';

import { Lookup_App_Material_Request_Status_Enum } from '~generated/graphql-db-types-hetarchief';

export class MaterialRequestMessageBodyAdditionalConditionDto
	implements MaterialRequestMessageBodyAdditionalCondition
{
	@IsEnum(Lookup_App_Material_Request_Status_Enum)
	@ApiPropertyOptional({
		type: String,
		description: `Type of additional condition to the reuse request. Can be one of: ${Object.values(MaterialRequestAdditionalConditionsType).join(', ')}`,
		enum: MaterialRequestAdditionalConditionsType,
		required: true,
	})
	type: MaterialRequestAdditionalConditionsType;

	@IsString()
	@ApiProperty({
		type: String,
		description: 'Text describing the additional condition',
		required: true,
	})
	text: string;
}

export class MaterialRequestMessageBodyAdditionalConditionsDto
	implements MaterialRequestMessageBodyAdditionalConditions
{
	@IsArray()
	@ApiProperty({
		type: MaterialRequestMessageBodyAdditionalConditionDto,
		description:
			'The conditions that the maintainer wants the requester to accept before they will allow reuse of the material',
		required: true,
		isArray: true,
	})
	conditions: MaterialRequestMessageBodyAdditionalConditionDto[];

	@IsBoolean()
	@Type(() => Boolean)
	@ApiProperty({
		type: Boolean,
		description:
			'Should the material request be approved immediately after the requester accepts the additional conditions?',
		required: true,
	})
	autoApproveAfterAcceptAdditionalConditions: boolean;
}

export class AddExtraConditionsBodyDto {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => MaterialRequestMessageBodyAdditionalConditionsDto)
	@ApiProperty({
		type: MaterialRequestMessageBodyAdditionalConditionsDto,
		description: 'The extra conditions to add to the material request',
		required: true,
	})
	extraConditions: MaterialRequestMessageBodyAdditionalConditionsDto;
}
