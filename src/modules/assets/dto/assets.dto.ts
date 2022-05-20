import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { string } from 'joi';

export class DeleteAssetDto {
	@IsString()
	@ApiProperty({
		type: string,
		description: 'The url of the asset that should be deleted',
		example:
			'https://assets-int.hetarchief.be/hetarchief/CONTENT_PAGE_IMAGE/braden-jarvis-pr-sog-oo-fmkw-unsplash-071e4faa-f545-499b-8041-0d04ad516503.jpg',
	})
	url: string;
}
