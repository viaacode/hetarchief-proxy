import { TranslationsService } from '@meemoo/admin-core-api';

import { MaterialRequestReuseFormKey } from '~modules/material-requests/material-requests.types';
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
	translationsService: TranslationsService
): Partial<Record<MaterialRequestReuseFormKey, Record<string, string>>> {
	return {
		[MaterialRequestReuseFormKey.downloadQuality]: {
			[MaterialRequestDownloadQuality.NORMAL]: translationsService.tText(
				'modules/material-requests/const/index___download-quality-normal'
			),
			[MaterialRequestDownloadQuality.HIGH]: translationsService.tText(
				'modules/material-requests/const/index___download-quality-high'
			),
		},
		[MaterialRequestReuseFormKey.intendedUsage]: {
			[MaterialRequestIntendedUsage.INTERN]: translationsService.tText(
				'modules/material-requests/const/index___intended-usage-intern'
			),
			[MaterialRequestIntendedUsage.NON_COMMERCIAL]: translationsService.tText(
				'modules/material-requests/const/index___intended-usage-non-commercial'
			),
			[MaterialRequestIntendedUsage.COMMERCIAL]: translationsService.tText(
				'modules/material-requests/const/index___intended-usage-commercial'
			),
		},
		[MaterialRequestReuseFormKey.distributionAccess]: {
			[MaterialRequestDistributionAccess.INTERN]: translationsService.tText(
				'modules/material-requests/const/index___distribution-access-intern'
			),
			[MaterialRequestDistributionAccess.INTERN_EXTERN]: translationsService.tText(
				'modules/material-requests/const/index___distribution-access-intern-extern'
			),
		},
		[MaterialRequestReuseFormKey.distributionType]: {
			[MaterialRequestDistributionType.DIGITAL_OFFLINE]: translationsService.tText(
				'modules/material-requests/const/index___distribution-type-digital-offline'
			),
			[MaterialRequestDistributionType.DIGITAL_ONLINE]: translationsService.tText(
				'modules/material-requests/const/index___distribution-type-digital-online'
			),
			[MaterialRequestDistributionType.OTHER]: translationsService.tText(
				'modules/material-requests/const/index___distribution-type-other'
			),
		},
		[MaterialRequestReuseFormKey.distributionTypeDigitalOnline]: {
			[MaterialRequestDistributionDigitalOnline.INTERNAL]: translationsService.tText(
				'modules/material-requests/const/index___distribution-digital-online-internal'
			),
			[MaterialRequestDistributionDigitalOnline.NO_AUTH]: translationsService.tText(
				'modules/material-requests/const/index___distribution-digital-online-no-auth'
			),
			[MaterialRequestDistributionDigitalOnline.WITH_AUTH]: translationsService.tText(
				'modules/material-requests/const/index___distribution-digital-online-with-auth'
			),
		},
		[MaterialRequestReuseFormKey.materialEditing]: {
			[MaterialRequestEditing.NONE]: translationsService.tText(
				'modules/material-requests/const/index___material-request-editing-none'
			),
			[MaterialRequestEditing.WITH_CHANGES]: translationsService.tText(
				'modules/material-requests/const/index___material-request-editing-with-changes'
			),
		},
		[MaterialRequestReuseFormKey.geographicalUsage]: {
			[MaterialRequestGeographicalUsage.COMPLETELY_LOCAL]: translationsService.tText(
				'modules/material-requests/const/index___geographical-usage-completely-local'
			),
			[MaterialRequestGeographicalUsage.NOT_COMPLETELY_LOCAL]: translationsService.tText(
				'modules/material-requests/const/index___geographical-usage-not-completely-local'
			),
		},
		[MaterialRequestReuseFormKey.timeUsageType]: {
			[MaterialRequestTimeUsage.UNLIMITED]: translationsService.tText(
				'modules/material-requests/const/index___time-usage-unlimited'
			),
			[MaterialRequestTimeUsage.IN_TIME]: translationsService.tText(
				'modules/material-requests/const/index___time-usage-in-time'
			),
		},
		[MaterialRequestReuseFormKey.copyrightDisplay]: {
			[MaterialRequestCopyrightDisplay.SAME_TIME_WITH_OBJECT]: translationsService.tText(
				'modules/material-requests/const/index___copyright-display-same-time-with-object'
			),
			[MaterialRequestCopyrightDisplay.AROUND_OBJECT]: translationsService.tText(
				'modules/material-requests/const/index___copyright-display-around-object'
			),
			[MaterialRequestCopyrightDisplay.NONE]: translationsService.tText(
				'modules/material-requests/const/index___copyright-display-none'
			),
		},
	};
}
