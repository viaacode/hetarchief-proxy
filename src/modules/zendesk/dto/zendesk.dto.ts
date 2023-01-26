import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

import { TicketPriority, TicketType, ZendeskID } from '../zendesk.types';

export class Comment {
	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
	})
	url?: string | undefined;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
	})
	request_id?: number | undefined;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
	})
	body?: string | undefined;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
	})
	html_body?: string | undefined;

	@IsBoolean()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
	})
	public?: boolean | undefined;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
	})
	author_id?: ZendeskID | undefined;

	@IsArray()
	@IsString({ each: true })
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
	})
	uploads?: ReadonlyArray<string> | undefined;
}

export class TicketField {
	@IsNumber()
	@ApiProperty({
		type: Number,
	})
	id: number;

	@ApiProperty()
	value: any;
}

export class RequesterAnonymous {
	@IsString()
	@Type(() => String)
	@ApiProperty({
		type: String,
	})
	name: string;

	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
	})
	email?: string | undefined;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
	})
	locale_id?: ZendeskID | undefined;
}

export class Collaborator {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
	})
	name?: string | undefined;

	@IsString()
	@ApiProperty({
		type: String,
	})
	email: string;
}

export class CreateTicketRequestDto {
	@IsString()
	@Type(() => String)
	@ApiProperty({
		type: String,
		description: 'Subject for the ticket that will be created',
	})
	subject: string;

	@IsObject()
	@ValidateNested()
	@Type(() => Comment)
	@ApiProperty({
		type: Comment,
		description: 'Comment for the ticket that will be created',
	})
	comment: Comment;

	@IsObject()
	@ValidateNested()
	@Type(() => RequesterAnonymous)
	@ApiPropertyOptional({
		type: RequesterAnonymous,
	})
	requester?: RequesterAnonymous | undefined; // Required for anonymous requests

	@ApiPropertyOptional()
	priority?: TicketPriority | null | undefined; // Anonymous requests can set priority, Authenticated requests cannot

	@ApiPropertyOptional()
	type?: TicketType | null | undefined; // Anonymous requests can set type, Authenticated requests cannot

	@IsObject()
	@ValidateNested()
	@Type(() => TicketField)
	@ApiPropertyOptional({
		type: TicketField,
	})
	custom_fields?: TicketField[] | null | undefined;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TicketField)
	@ApiPropertyOptional({
		type: TicketField,
	})
	fields?: TicketField[] | null | undefined;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Due date of the created ticket',
	})
	due_at?: string | null | undefined; // Anonymous requests can set due date as long as type == task. Authenticated requests cannot

	@IsNumber()
	@IsOptional()
	@ApiPropertyOptional({
		type: Number,
		description: 'Ticket form id for the ticket that will be created',
	})
	ticket_form_id?: number | null | undefined;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'The recipient for the ticket that will be created',
	})
	recipient?: string | null | undefined;

	@IsArray()
	@ValidateNested({
		each: true,
	})
	@Type(() => Number || String || Collaborator)
	collaborators?: ZendeskID[] | string[] | Collaborator[] | undefined;
}
