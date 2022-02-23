import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { ContentPickerType } from '../types';

export class NavigationsQueryDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Get all navigation items with this placement',
	})
	placement?: string;
}

// Note: also used for updating a navigation item
export class CreateNavigationDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The label for this navigation item',
	})
	label?: string;

	@IsString()
	@ApiProperty({
		type: String,
		description: 'The icon for this navigation item',
	})
	icon_name = '';

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The description for this navigation item',
	})
	description?: string;

	@IsArray()
	@IsOptional()
	@IsNumber({}, { each: true })
	@ApiPropertyOptional({
		type: String,
		description: 'The user group ids allowed to see this navigation item',
	})
	user_group_ids?: Array<number>;

	@ApiProperty({
		required: false,
		enum: ContentPickerType,
		description: `The content_type for this item. Options are: ${Object.values(
			ContentPickerType
		).join(', ')}`,
	})
	@IsOptional()
	@IsEnum(ContentPickerType, {
		message: `content_type must be one of: ${Object.values(ContentPickerType).join(', ')}`,
	})
	content_type?: ContentPickerType;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The content path for this navigation item, e.g. /help',
	})
	content_path?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The link target property for this item, e.g. _blank or _self',
	})
	link_target?: string;

	@IsNumber()
	@Type(() => Number)
	@ApiProperty({
		type: Number,
		description: 'The position of this navigation item. Items are sorted by position.',
	})
	position: number;

	@IsString()
	@ApiProperty({
		type: String,
		description: 'The placement for this menu item: e.g. footer-links',
	})
	placement: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The tooltip shown for this menu item',
	})
	tooltip?: string;
}
