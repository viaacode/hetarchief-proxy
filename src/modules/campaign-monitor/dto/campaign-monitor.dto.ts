import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

import { LogEventType } from '~modules/events/types';
import { Locale } from '~shared/types/types';
import {
	type CampaignMonitorShareFolderInfo,
	ConsentToTrackOption,
	EmailTemplate,
} from '../campaign-monitor.types';

export class CampaignMonitorVisitData {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	client_firstname?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	client_lastname?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	client_email?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	contentpartner_name?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	contentpartner_email?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	request_reason?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	request_time?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	request_url?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	request_remark?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	start_date?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	start_time?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	end_date?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ type: String })
	end_time?: string;
}

export class CampaignMonitorMaterialRequestData {
	@IsString()
	@IsOptional()
	user_firstname?: string;

	@IsString()
	@IsOptional()
	user_lastname?: string;

	@IsString()
	@IsOptional()
	request_list?: RequestListItem[];

	@IsString()
	@IsOptional()
	user_request_context?: string;

	@IsString()
	@IsOptional()
	user_organisation?: string;

	@IsString()
	@IsOptional()
	user_email?: string;

	@IsString()
	@IsOptional()
	cp_name?: string;

	@IsString()
	@IsOptional()
	cp_email?: string;
}

export class CampaignMonitorConfirmationData {
	@IsString()
	firstname: string;

	@IsString()
	activation_url: string;
}

export class CampaignMonitorUpdatePreferencesData {
	@IsString()
	@IsOptional()
	EmailAddress: string;

	@IsString()
	@IsOptional()
	Name: string;

	@IsString()
	@IsOptional()
	Resubscribe: boolean;

	@IsString()
	@IsOptional()
	ConsentToTrack: string;

	@IsString()
	@IsOptional()
	CustomFields: { Key: string; Value: any }[];
}

export class RequestListItem {
	@IsString()
	@IsOptional()
	title?: string;

	@IsString()
	@IsOptional()
	cp_name?: string;

	@IsString()
	@IsOptional()
	local_cp_id?: string;

	@IsString()
	@IsOptional()
	pid?: string;

	@IsString()
	@IsOptional()
	page_url?: string;

	@IsString()
	@IsOptional()
	request_type?: string;

	@IsString()
	@IsOptional()
	request_description?: string;
}

export class CampaignMonitorData {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: String,
		description: 'The recipient of the email',
	})
	to: string | Array<string>;

	@IsString()
	// @IsOptional()
	@ApiProperty({
		type: String,
		// required: false,
		description: 'The email address that is used when the recipient replies to the email',
	})
	replyTo: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: String,
		description: 'Consent to track setting for CM. Possible values: yes/no/unchanged',
		default: ConsentToTrackOption.UNCHANGED,
		enum: ConsentToTrackOption,
	})
	consentToTrack: ConsentToTrackOption;

	@IsObject()
	@ApiProperty({
		type: Object,
		description: 'The data object with placeholder values for Campaign Monitor',
	})
	data:
		| CampaignMonitorVisitData
		| CampaignMonitorShareFolderInfo
		| CampaignMonitorMaterialRequestData
		| CampaignMonitorConfirmationData;
}

export class CampaignMonitorSendMailDto {
	@IsString()
	@IsEnum(EmailTemplate)
	@IsNotEmpty()
	@ApiProperty({
		type: String,
		description: 'The template enum for the mail OR the templateId',
		example: 'visitRequestCp',
		enum: EmailTemplate,
	})
	template: EmailTemplate;

	@Type(() => CampaignMonitorData)
	@IsObject()
	@ValidateNested()
	@ApiProperty({
		type: Object,
		description: 'The data object with placeholder values for Campaign Monitor',
		example: {
			to: 'test.testers@meemoo.be',
			replyTo: 'cp@maintainer.be',
			consentToTrack: ConsentToTrackOption.UNCHANGED,
			data: {
				custom_field_key_a: 'custom_field_value_a',
			},
		},
	})
	data: CampaignMonitorData;
}

export class CampaignMonitorNewsletterPreferencesQueryDto {
	@IsString()
	@IsNotEmpty()
	@ApiPropertyOptional({
		type: String,
		description: 'Email to fetch preferences from',
	})
	email?: string;
}

export class CampaignMonitorNewsletterPreferencesDto {
	@IsBoolean()
	@IsNotEmpty()
	@ApiPropertyOptional({
		type: String,
		description: 'Boolean to tell whether or not newsletter is active or not',
		example: true,
	})
	newsletter: boolean;
}

export class CampaignMonitorNewsletterUpdatePreferencesQueryDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'First name of user',
	})
	firstName?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Last name of user',
	})
	lastName?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({
		type: String,
		description: 'Mail to sign up for newsletter',
	})
	mail?: string;

	@IsObject()
	@IsNotEmpty()
	@ApiProperty({
		type: Object,
		example: {
			newsletter: true,
		},
	})
	preferences: CampaignMonitorNewsletterPreferencesDto;

	@IsString()
	@IsEnum(Locale, {
		message: `Event type must be one of: ${Object.values(LogEventType).join(', ')}`,
	})
	@ApiProperty({
		type: String,
		description: `Log an event with this type. Possible types: ${Object.values(LogEventType).join(
			', '
		)}`,
		example: Locale.En,
		enum: Locale,
	})
	language?: Locale;
}

export class CampaignMonitorConfirmMailQueryDto {
	@IsString()
	@ApiProperty({
		type: String,
	})
	token: string;

	@IsString()
	@ApiProperty({
		type: String,
	})
	mail: string;

	@IsString()
	@ApiProperty({
		type: String,
	})
	firstName: string;

	@IsString()
	@ApiProperty({
		type: String,
	})
	lastName: string;
}
