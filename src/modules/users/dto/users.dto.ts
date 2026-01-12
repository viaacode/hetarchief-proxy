import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Locale } from '~shared/types/types';

export class CreateOrUpdateUserDto {
	@IsString()
	firstName: string;

	@IsString()
	lastName: string;

	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	groupId: string;

	@IsBoolean()
	@IsOptional()
	isKeyUser?: boolean;

	@IsBoolean()
	@IsOptional()
	isEvaluator?: boolean;

	@IsString()
	@IsOptional()
	organisationId?: string;

	@IsString()
	@IsOptional()
	language?: string; // nl | en
}

export class UpdateAcceptedTosDto {
	@IsDateString()
	@ApiProperty({
		type: String,
		description: 'The date and time the user accepted the Terms of Service',
	})
	acceptedTosAt: string;
}

export class UpdateUserLangDto {
	@IsString()
	@ApiProperty({
		type: String,
		enum: Locale,
	})
	language: Locale;
}
