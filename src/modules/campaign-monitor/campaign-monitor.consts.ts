import { EmailTemplate } from './campaign-monitor.types';

import type { Locale } from '~shared/types/types';

export const getTemplateId = (template: string, language: Locale): string => {
	const templateIds = {
		[EmailTemplate.SHARE_FOLDER]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_SHARE_FOLDER__${language.toUpperCase()}`
		] as string,
		[EmailTemplate.VISIT_REQUEST_CP]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_VISIT_REQUEST_CP__${language.toUpperCase()}`
		] as string,
		[EmailTemplate.VISIT_APPROVED]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_VISIT_APPROVED__${language.toUpperCase()}`
		] as string,
		[EmailTemplate.VISIT_DENIED]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_VISIT_DENIED__${language.toUpperCase()}`
		] as string,
		[EmailTemplate.MATERIAL_REQUEST_REQUESTER]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_REQUESTER__${language.toUpperCase()}`
		] as string,
		[EmailTemplate.MATERIAL_REQUEST_REQUESTER_CANCELLED]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_REQUESTER_CANCELLED__${language.toUpperCase()}`
		] as string,
		[EmailTemplate.MATERIAL_REQUEST_MAINTAINER]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_MAINTAINER__${language.toUpperCase()}`
		] as string,
		[EmailTemplate.MATERIAL_REQUEST_MAINTAINER_APPROVED]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_MAINTAINER_APPROVED__${language.toUpperCase()}`
		] as string,
		[EmailTemplate.MATERIAL_REQUEST_MAINTAINER_DENIED]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_MAINTAINER_DENIED__${language.toUpperCase()}`
		] as string,
		[EmailTemplate.MATERIAL_REQUEST_DOWNLOAD_READY_MAINTAINER]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_DOWNLOAD_READY_MAINTAINER__${language.toUpperCase()}`
		] as string,
		[EmailTemplate.MATERIAL_REQUEST_DOWNLOAD_READY_REQUESTER]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_MATERIAL_REQUEST_DOWNLOAD_READY_REQUESTER__${language.toUpperCase()}`
		] as string,
		[EmailTemplate.NEWSLETTER_CONFIRMATION]: process.env[
			`CAMPAIGN_MONITOR_TEMPLATE_CONFIRMATION_NEWSLETTER_SUBSCRIPTION__${language.toUpperCase()}`
		] as string,
	};
	return templateIds[template];
};
