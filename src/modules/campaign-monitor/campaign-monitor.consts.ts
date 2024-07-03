import { Template } from './campaign-monitor.types';

import { Locale } from '~shared/types/types';

export const getTemplateId = (template: string, language: Locale): string => {
	const templateIds = {
		[Template.SHARE_FOLDER]: process.env[
			`CAMPAIGN_MONITOR_EMAIL_TEMPLATE_SHARE_FOLDER__${language.toUpperCase()}`
		] as string,
		[Template.VISIT_REQUEST_CP]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_VISIT_REQUEST_CP__${language.toUpperCase()}`
		] as string,
		[Template.VISIT_APPROVED]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_VISIT_APPROVED__${language.toUpperCase()}`
		] as string,
		[Template.VISIT_DENIED]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_VISIT_DENIED__${language.toUpperCase()}`
		] as string,
		[Template.MATERIAL_REQUEST_REQUESTER]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_REQUESTER__${language.toUpperCase()}`
		] as string,
		[Template.MATERIAL_REQUEST_MAINTAINER]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_MAINTAINER__${language.toUpperCase()}`
		] as string,
		[Template.EMAIL_CONFIRMATION]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_CONFIRMATION__${language.toUpperCase()}`
		] as string,
		[Template.CREATE_VISIT_REQUEST]:
			process.env[
				`CAMPAIGN_MONITOR_EMAIL_TEMPLATE_CREATE_VISIT_REQUEST_FOR_USER__${language.toUpperCase()}`
			],
	};
	return templateIds[template];
};
