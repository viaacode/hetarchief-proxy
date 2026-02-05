import { CampaignMonitorConfirmationData, CampaignMonitorMaterialRequestData, CampaignMonitorVisitData } from './dto/campaign-monitor.dto';

import { SendRequestListDto } from '~modules/material-requests/dto/material-requests.dto';
import type { MaterialRequest } from '~modules/material-requests/material-requests.types';
import type { VisitRequest } from '~modules/visits/types';
import type { Locale, Recipient } from '~shared/types/types';

export enum EmailTemplate {
	VISIT_REQUEST_CP = 'visitRequestCp',
	VISIT_APPROVED = 'visitApproved',
	VISIT_DENIED = 'visitDenied',
	SHARE_FOLDER = 'shareFolder',
	MATERIAL_REQUEST_REQUESTER = 'materialRequestRequester',
	MATERIAL_REQUEST_MAINTAINER = 'materialRequestMaintainer',
	MATERIAL_REQUEST_REQUESTER_CANCELLED = 'materialRequestRequesterCancelled',
	MATERIAL_REQUEST_MAINTAINER_APPROVED = 'materialRequestMaintainerApproved',
	MATERIAL_REQUEST_MAINTAINER_DENIED = 'materialRequestMaintainerDenied',
	MATERIAL_REQUEST_DOWNLOAD_READY_MAINTAINER = 'materialRequestDownloadReadyMaintainer',
	MATERIAL_REQUEST_DOWNLOAD_READY_REQUESTER = 'materialRequestDownloadReadyRequester',
	NEWSLETTER_CONFIRMATION = 'newsletterConfirmation',
}

export interface VisitEmailInfo {
	to: Recipient[];
	replyTo: string;
	template: EmailTemplate;
	visitRequest: VisitRequest;
}

export interface MaterialRequestEmailInfo {
	to?: string;
	replyTo: string;
	template: EmailTemplate;
	language: Locale; // Language that the email should be displayed in, to the receiver of the email
	materialRequests: MaterialRequest[];
	sendRequestListDto: SendRequestListDto;
	requesterFirstName: string;
	requesterLastName: string;
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
	usergroup = 'usergroup',
	is_key_user = 'is_key_user',
	firstname = 'firstname',
	lastname = 'lastname',
	created_date = 'created_date',
	last_access_date = 'last_access_date',
	organisation = 'organisation',
	language = 'language',
}

export interface CmSubscriberResponse {
	EmailAddress: string;
	Name: string;
	Date: string;
	ListJoinedDate: string;
	State: string;
	CustomFields: {
		Key: string;
		Value: string;
	}[];
	ReadsEmailWith: string;
}

export enum ConsentToTrackOption {
	YES = 'Yes',
	NO = 'No',
	UNCHANGED = 'Unchanged',
}

export interface CmSendEmailInfo {
	To: string[];
	CC?: string[];
	BCC?: string[];
	Attachments?: {
		Content: string;
		Name: string;
		Type: string;
	}[];
	Data?: (
		| CampaignMonitorVisitData
		| CampaignMonitorShareFolderInfo
		| CampaignMonitorMaterialRequestData
		| CampaignMonitorConfirmationData
	) & { reply_to_email?: string };
	AddRecipientsToList?: boolean;
	ConsentToTrack?: ConsentToTrackOption;
}
