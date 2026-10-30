import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ImageQueryDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: String,
		description: 'Url of the original image on one of the asset servers',
		example:
			'https://assets-qas.hetarchief.be/hetarchiefv3/CONTENT_BLOCK_IMAGE/4-dbbfc1641-7ac4-4d6f-b80b-d92342dc3800.webp',
	})
	url: string;
}
