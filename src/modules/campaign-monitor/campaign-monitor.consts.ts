import { Template } from './campaign-monitor.types';

export const getTemplateId = (template: string): string => {
	const templateIds = {
		[Template.SHARE_FOLDER]: process.env.CAMPAIGN_MONITOR_EMAIL_TEMPLATE_SHARE_FOLDER as string,
		[Template.VISIT_REQUEST_CP]: process.env
			.CAMPAIGN_MONITOR_TEMPLATE_VISIT_REQUEST_CP as string,
		[Template.VISIT_APPROVED]: process.env.CAMPAIGN_MONITOR_TEMPLATE_VISIT_APPROVED as string,
		[Template.VISIT_DENIED]: process.env.CAMPAIGN_MONITOR_TEMPLATE_VISIT_DENIED as string,
		[Template.MATERIAL_REQUEST_REQUESTER]: process.env
			.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_REQUESTER as string,
		[Template.MATERIAL_REQUEST_MAINTAINER]: process.env
			.CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_MAINTAINER as string,
		[Template.EMAIL_CONFIRMATION]: process.env.CAMPAIGN_MONITOR_TEMPLATE_CONFIRMATION as string,
	};
	return templateIds[template];
};
