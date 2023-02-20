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
	sharer_name: string; // voor- en achternaam van de persoon die een map deelt
	sharer_email: string; // e-mailadres van de persoon die een map deelt
	user_hasaccount: boolean; // of de ontvanger gekend is bij meemoo
	user_firstname: string; // voornaam van de ontvanger, indien gekend
	folder_name: string; // naam van de map
	folder_sharelink: string; // url om de map te accepteren
}
