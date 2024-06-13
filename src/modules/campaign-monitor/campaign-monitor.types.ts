import { CampaignMonitorVisitData } from './dto/campaign-monitor.dto';

import { SendRequestListDto } from '~modules/material-requests/dto/material-requests.dto';
import { MaterialRequest } from '~modules/material-requests/material-requests.types';
import { VisitRequest } from '~modules/visits/types';
import { Locale, Recipient } from '~shared/types/types';

export enum Template {
	VISIT_REQUEST_CP = 'visitRequestCp',
	VISIT_APPROVED = 'visitApproved',
	VISIT_DENIED = 'visitDenied',
	SHARE_FOLDER = 'shareFolder',
	MATERIAL_REQUEST_REQUESTER = 'materialRequestRequester',
	MATERIAL_REQUEST_MAINTAINER = 'materialRequestMaintainer',
	EMAIL_CONFIRMATION = 'emailConfirmation',
}

export interface VisitEmailInfo {
	to: Recipient[];
	template: Template;
	visitRequest: VisitRequest;
}

export interface MaterialRequestEmailInfo {
	to?: string;
	template: Template;
	materialRequests: MaterialRequest[];
	sendRequestListDto: SendRequestListDto;
	firstName: string;
	lastName: string;
	language: Locale;
}

export interface CampaignMonitorEmailInfo {
	template: string;
	to: string | string[];
	data?: CampaignMonitorShareFolderInfo | CampaignMonitorVisitData;
}

export interface CampaignMonitorShareFolderInfo {
	sharer_name: string; // first and lastname of the user sharing the folder
	sharer_email: string; // email of the user that is shareing the folder
	user_hasaccount: boolean; // check to see of the user is known to meemoo
	user_firstname: string; // firstname of that user
	folder_name: string; // folder name
	folder_sharelink: string; // the url for the shared folder
}

export interface CampaignMonitorNewsletterPreferences {
	newsletter: boolean;
}

export interface CampaignMonitorUserInfo {
	firstName: string;
	lastName: string;
	email: string;
	is_key_user?: boolean;
	usergroup?: string; //groupName
	created_date?: string;
	last_access_date?: string;
	organisation?: string; //organisationName
	language?: string;
}

export enum CampaignMonitorCustomFieldName {
	optin_mail_lists = 'optin_mail_lists',
	usergroup = 'usergroup',
	is_key_user = 'is_key_user',
	firstname = 'firstname',
	lastname = 'lastname',
	created_date = 'created_date',
	last_access_date = 'last_access_date',
	organisation = 'organisation',
	language = 'language',
}
