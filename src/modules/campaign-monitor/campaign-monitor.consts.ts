import { Template } from './campaign-monitor.types';

export const templateIds = {
	[Template.SHARE_FOLDER]: process.env.CAMPAIGN_MONITOR_EMAIL_TEMPLATE_SHARE_FOLDER as string,
	[Template.VISIT_REQUEST_CP]: process.env.CAMPAIGN_MONITOR_TEMPLATE_VISIT_REQUEST_CP as string,
	[Template.VISIT_APPROVED]: process.env.CAMPAIGN_MONITOR_TEMPLATE_VISIT_APPROVED as string,
	[Template.VISIT_DENIED]: process.env.CAMPAIGN_MONITOR_TEMPLATE_VISIT_DENIED as string,
};