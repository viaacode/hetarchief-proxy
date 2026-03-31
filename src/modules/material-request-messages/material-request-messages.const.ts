import { TranslationsService } from '@meemoo/admin-core-api';

import { MaterialRequestReuseFormKey } from '~modules/material-requests/material-requests.types';
import { Locale } from '~shared/types/types';
import {
	MaterialRequestCopyrightDisplay,
	MaterialRequestDistributionAccess,
	MaterialRequestDistributionDigitalOnline,
	MaterialRequestDistributionType,
	MaterialRequestDownloadQuality,
	MaterialRequestEditing,
	MaterialRequestGeographicalUsage,
	MaterialRequestIntendedUsage,
	MaterialRequestTimeUsage,
} from './material-request-messages.types';

export function GET_REUSE_LABELS(
	translationsService: TranslationsService,
	locale: Locale
): Partial<Record<MaterialRequestReuseFormKey, Record<string, string>>> {
	return {
		[MaterialRequestReuseFormKey.downloadQuality]: {
			[MaterialRequestDownloadQuality.NORMAL]: translationsService.tText(
				'modules/material-requests/const/index___download-quality-normal',
				{},
				locale
			),
			[MaterialRequestDownloadQuality.HIGH]: translationsService.tText(
				'modules/material-requests/const/index___download-quality-high',
				{},
				locale
			),
		},
		[MaterialRequestReuseFormKey.intendedUsage]: {
			[MaterialRequestIntendedUsage.INTERN]: translationsService.tText(
				'modules/material-requests/const/index___intended-usage-intern',
				{},
				locale
			),
			[MaterialRequestIntendedUsage.NON_COMMERCIAL]: translationsService.tText(
				'modules/material-requests/const/index___intended-usage-non-commercial',
				{},
				locale
			),
			[MaterialRequestIntendedUsage.COMMERCIAL]: translationsService.tText(
				'modules/material-requests/const/index___intended-usage-commercial',
				{},
				locale
			),
		},
		[MaterialRequestReuseFormKey.distributionAccess]: {
			[MaterialRequestDistributionAccess.INTERN]: translationsService.tText(
				'modules/material-requests/const/index___distribution-access-intern',
				{},
				locale
			),
			[MaterialRequestDistributionAccess.INTERN_EXTERN]: translationsService.tText(
				'modules/material-requests/const/index___distribution-access-intern-extern',
				{},
				locale
			),
		},
		[MaterialRequestReuseFormKey.distributionType]: {
			[MaterialRequestDistributionType.DIGITAL_OFFLINE]: translationsService.tText(
				'modules/material-requests/const/index___distribution-type-digital-offline',
				{},
				locale
			),
			[MaterialRequestDistributionType.DIGITAL_ONLINE]: translationsService.tText(
				'modules/material-requests/const/index___distribution-type-digital-online',
				{},
				locale
			),
			[MaterialRequestDistributionType.OTHER]: translationsService.tText(
				'modules/material-requests/const/index___distribution-type-other',
				{},
				locale
			),
		},
		[MaterialRequestReuseFormKey.distributionTypeDigitalOnline]: {
			[MaterialRequestDistributionDigitalOnline.INTERNAL]: translationsService.tText(
				'modules/material-requests/const/index___distribution-digital-online-internal',
				{},
				locale
			),
			[MaterialRequestDistributionDigitalOnline.NO_AUTH]: translationsService.tText(
				'modules/material-requests/const/index___distribution-digital-online-no-auth',
				{},
				locale
			),
			[MaterialRequestDistributionDigitalOnline.WITH_AUTH]: translationsService.tText(
				'modules/material-requests/const/index___distribution-digital-online-with-auth',
				{},
				locale
			),
		},
		[MaterialRequestReuseFormKey.materialEditing]: {
			[MaterialRequestEditing.NONE]: translationsService.tText(
				'modules/material-requests/const/index___material-request-editing-none',
				{},
				locale
			),
			[MaterialRequestEditing.WITH_CHANGES]: translationsService.tText(
				'modules/material-requests/const/index___material-request-editing-with-changes',
				{},
				locale
			),
		},
		[MaterialRequestReuseFormKey.geographicalUsage]: {
			[MaterialRequestGeographicalUsage.COMPLETELY_LOCAL]: translationsService.tText(
				'modules/material-requests/const/index___geographical-usage-completely-local',
				{},
				locale
			),
			[MaterialRequestGeographicalUsage.NOT_COMPLETELY_LOCAL]: translationsService.tText(
				'modules/material-requests/const/index___geographical-usage-not-completely-local',
				{},
				locale
			),
		},
		[MaterialRequestReuseFormKey.timeUsageType]: {
			[MaterialRequestTimeUsage.UNLIMITED]: translationsService.tText(
				'modules/material-requests/const/index___time-usage-unlimited',
				{},
				locale
			),
			[MaterialRequestTimeUsage.IN_TIME]: translationsService.tText(
				'modules/material-requests/const/index___time-usage-in-time',
				{},
				locale
			),
		},
		[MaterialRequestReuseFormKey.copyrightDisplay]: {
			[MaterialRequestCopyrightDisplay.SAME_TIME_WITH_OBJECT]: translationsService.tText(
				'modules/material-requests/const/index___copyright-display-same-time-with-object',
				{},
				locale
			),
			[MaterialRequestCopyrightDisplay.AROUND_OBJECT]: translationsService.tText(
				'modules/material-requests/const/index___copyright-display-around-object',
				{},
				locale
			),
			[MaterialRequestCopyrightDisplay.NONE]: translationsService.tText(
				'modules/material-requests/const/index___copyright-display-none',
				{},
				locale
			),
		},
	};
}
