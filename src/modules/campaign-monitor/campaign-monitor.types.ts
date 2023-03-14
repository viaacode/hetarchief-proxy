import { templateIds } from './campaign-monitor.consts';
import { CampaignMonitorVisitData } from './dto/campaign-monitor.dto';

import { Visit } from '~modules/visits/types';
import { Recipient } from '~shared/types/types';

export enum Template {
	VISIT_REQUEST_CP = 'visitRequestCp',
	VISIT_APPROVED = 'visitApproved',
	VISIT_DENIED = 'visitDenied',
	SHARE_FOLDER = 'shareFolder',
}

export interface VisitEmailInfo {
	to: Recipient[];
	template: Template;
	visit: Visit;
}

export interface CampaignMonitorEmailInfo {
	template: keyof typeof templateIds;
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

export interface NewsletterPreferences {
	newsletter: boolean;
}
