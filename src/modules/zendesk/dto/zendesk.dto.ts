import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

import { Locale } from '~shared/types/types';

import { ReportLegalReason, ReportReason } from '../zendesk.types';

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

export class CreateIeObjectSupportRequestDto {
	@IsEnum(ReportReason)
	@ApiProperty({ type: String, enum: ReportReason })
	reportReason: ReportReason;

	@IsEnum(ReportLegalReason)
	@IsOptional()
	@ApiPropertyOptional({ type: String, enum: ReportLegalReason })
	reportLegalReason?: ReportLegalReason;

	@IsEnum(Locale)
	@ApiProperty({
		type: String,
		enum: Locale,
		description:
			'The language of the user but set explicitly since anonymous users can also report',
	})
	locale: Locale;

	@IsString()
	@ApiProperty({ type: String, description: 'The free-text problem description or legal remark' })
	message: string;

	@IsString()
	@ApiProperty({ type: String, description: 'The page the report was filed from' })
	url: string;

	@IsString()
	@ApiProperty({ type: String, description: 'The email address of the reporter' })
	email: string;

	@IsString()
	@ApiProperty({ type: String, description: 'The name of the reporter' })
	name: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description:
			'The maintainer of the reported object, only needed for reportReason METADATA_ISSUE',
	})
	maintainerId?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	mamUrl?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	aiMeemooUrl?: string;
}
