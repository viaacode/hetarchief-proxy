import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
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

	@IsString()
	@IsOptional()
	organisationId?: string;
}

export class UpdateUserDto {
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

	@IsString()
	@IsOptional()
	organisationId?: string;
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
	@IsIn(['nl', 'en'])
	language: string;
}
