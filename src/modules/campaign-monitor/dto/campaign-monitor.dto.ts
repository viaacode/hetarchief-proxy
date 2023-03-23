import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsEnum,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

import { CampaignMonitorShareFolderInfo } from '../campaign-monitor.types';

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
	@IsNotEmpty()
	@ApiProperty({
		type: String,
		description: 'Consent to track setting for CM. Possible values: yes/no/unchanged',
		default: 'unchanged',
	})
	consentToTrack: string;

	@Type(() => CampaignMonitorVisitData)
	@IsObject()
	@ValidateNested()
	@ApiProperty({
		type: Object,
		description: 'The data object with placeholder values for Campaign Monitor',
	})
	data:
		| CampaignMonitorVisitData
		| CampaignMonitorShareFolderInfo
		| CampaignMonitorMaterialRequestData;
}

export class CampaignMonitorSendMailDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: String,
		description: 'The template enum for the mail OR the templateId',
		example: 'visitRequestCp',
	})
	template: string;

	@Type(() => CampaignMonitorData)
	@IsObject()
	@ValidateNested()
	@ApiProperty({
		type: Object,
		description: 'The data object with placeholder values for Campaign Monitor',
		example: {
			to: 'test.testers@meemoo.be',
			consentToTrack: 'unchanged',
			data: {
				client_firstname: 'Test',
				client_lastname: 'Testers',
				client_email: 'test.testers@meemoo.be',
				contentpartner_name: 'Huis van Alijn',
				contentpartner_email: 'huis.van.alijn@test.com',
				request_reason: 'ik doe onderzoek',
				request_time: 'donderdag namiddag',
				request_url:
					'http://localhost:3200/beheer/aanvragen?visitRequestId=9fb02525-7f04-494b-a908-15b2962adfbc',
				request_remark: '',
				start_date: '18 maart 2022',
				start_time: '14:00',
				end_date: '18 maart 2022',
				end_time: '17:00',
				sharer_name: 'John',
				sharer_email: 'johndoe@gmail.com',
				user_hasaccount: true,
				user_firstname: 'Billy',
				folder_name: 'Favorieten',
				folder_sharelink: '',
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
