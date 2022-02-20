import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
	@IsString()
	firstName: string;

	@IsString()
	lastName: string;

	@IsString()
	@IsNotEmpty()
	email: string;
}

export class UpdateUserDto {
	@IsString()
	firstName: string;

	@IsString()
	lastName: string;

	@IsString()
	@IsNotEmpty()
	email: string;
}

export class UpdateAcceptedTosDto {
	@IsString()
	@Type(() => String)
	@ApiProperty({
		type: String,
		description: 'When the user accepted the Terms of Service',
	})
	acceptedTosAt: string;
}
