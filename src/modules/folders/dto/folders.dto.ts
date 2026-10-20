import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
} from 'class-validator';
import { string } from 'joi';

export class CreateOrUpdateFolderDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: string,
		description: 'The name of the folder',
		example: 'Favorites',
	})
	name: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: string,
		description: 'The description of the folder',
		example: 'my favorite movies',
	})
	description?: string;
}

export class CreateFolderDto extends CreateOrUpdateFolderDto {
	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional({
		type: Boolean,
		description:
			'Create an organisation folder instead of a personal folder. Requires the MANAGE_ORGANISATION_FOLDERS permission',
		default: false,
	})
	isOrganisation?: boolean;
}

export class AddObjectsToFoldersDto {
	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(50)
	@IsUUID('all', { each: true })
	@ApiProperty({
		type: [String],
		description: 'The ids of the folders to add the objects to',
		example: ['0018c1b6-97ae-435f-abef-31a2cde011fd'],
	})
	folderIds: string[];

	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(100)
	@IsString({ each: true })
	@IsNotEmpty({ each: true })
	@ApiProperty({
		type: [String],
		description: 'The schema identifiers of the objects to add to the folders',
		example: ['8911p09j1g'],
	})
	objectSchemaIdentifiers: string[];
}

export class FolderObjectsQueryDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: "The query to search for. Use '%queryTerm%' for wildcard.",
		default: undefined,
	})
	query? = undefined;

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
}
