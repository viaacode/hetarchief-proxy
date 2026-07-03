import { TranslationsService } from '@meemoo/admin-core-api';
import {
	MaterialRequestRequesterCapacity,
	MaterialRequestType,
} from '~modules/material-requests/material-requests.types';
import type { Locale } from '~shared/types/types';

export function getTemplateEnvVarName(template: string, language: Locale): string {
	return `${template.toUpperCase()}__${language.toUpperCase()}`;
}

export function getTemplateId(template: string, language: Locale): string | undefined {
	const envVarName = getTemplateEnvVarName(template, language);
	return process.env[envVarName];
}

export function MATERIAL_REQUEST_TYPE_TRANSLATIONS(
	locale: Locale,
	translationsService: TranslationsService
): Record<MaterialRequestType, string> {
	return {
		[MaterialRequestType.VIEW]: translationsService.tText(
			'modules/campaign-monitor/services/campaign-monitor___ik-wil-dit-object-bekijken-beluisteren',
			null,
			locale
		),
		[MaterialRequestType.REUSE]: translationsService.tText(
			'modules/campaign-monitor/services/campaign-monitor___ik-wil-dit-object-hergebruiken',
			null,
			locale
		),
		[MaterialRequestType.MORE_INFO]: translationsService.tText(
			'modules/campaign-monitor/services/campaign-monitor___ik-wil-meer-info-over-dit-object',
			null,
			locale
		),
	};
}

export function MATERIAL_REQUEST_REQUESTER_CAPACITY_TRANSLATIONS(
	locale: Locale,
	translationsService: TranslationsService
): Record<MaterialRequestRequesterCapacity, string> {
	return {
		[MaterialRequestRequesterCapacity.OTHER]: translationsService.tText(
			'modules/campaign-monitor/services/campaign-monitor___andere',
			null,
			locale
		),
		[MaterialRequestRequesterCapacity.WORK]: translationsService.tText(
			'modules/campaign-monitor/services/campaign-monitor___ik-vraag-de-fragmenten-op-in-het-kader-van-mijn-beroep-uitgezonderd-onderwijs',
			null,
			locale
		),
		[MaterialRequestRequesterCapacity.PRIVATE_RESEARCH]: translationsService.tText(
			'modules/campaign-monitor/services/campaign-monitor___ik-vraag-de-fragmenten-aan-in-het-kader-van-prive-onderzoek',
			null,
			locale
		),
		[MaterialRequestRequesterCapacity.EDUCATION]: translationsService.tText(
			'modules/campaign-monitor/services/campaign-monitor___ik-ben-verbonden-aan-een-onderwijsinstelling-als-student-onderzoeker-of-lesgever',
			null,
			locale
		),
	};
}
