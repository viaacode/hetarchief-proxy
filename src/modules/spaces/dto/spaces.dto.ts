import { IsString } from 'class-validator';

export class UpdateSpaceDto {
	@IsString()
	description: string;
}
