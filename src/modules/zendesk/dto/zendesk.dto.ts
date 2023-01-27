import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class Comment {
	@IsString()
	@Type(() => String)
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
	})
	url?: string | undefined;

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
	@Type(() => Boolean)
	@IsOptional()
	@ApiPropertyOptional({
		type: Boolean,
	})
	public?: boolean | undefined;
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
}

// Brecht - According to the avo-client these are the only props that are being fed from the FE
// Remark: This is not the complete list of props for the create ticket Zendesk API so be aware for extra props that are
//         being fed from the FE
// -----------------------------------------------------------------------------------------------------------------
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
	requester?: RequesterAnonymous | undefined;
}
