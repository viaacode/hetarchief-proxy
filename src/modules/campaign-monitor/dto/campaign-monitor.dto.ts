import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

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

export class CampaignMonitorData {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: String,
		description: 'The recipient of the email',
	})
	To: string | Array<string>;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: String,
		description: 'Consent to track setting for CM. Possible values: yes/no/unchanged',
		default: 'unchanged',
	})
	ConsentToTrack: string;

	@Type(() => CampaignMonitorVisitData)
	@IsObject()
	@ValidateNested()
	@ApiProperty({
		type: Object,
		description: 'The data object with placeholder values for Campaign Monitor',
	})
	Data: CampaignMonitorVisitData;
}

export class SendMailDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		type: String,
		description: 'The template ID for the email',
	})
	templateId: string;

	@Type(() => CampaignMonitorData)
	@IsObject()
	@ValidateNested()
	@ApiProperty({
		type: Object,
		description: 'The data object with placeholder values for Campaign Monitor',
	})
	data: CampaignMonitorData;
}
