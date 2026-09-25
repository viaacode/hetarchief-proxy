import { HetArchiefIeObjectLicense, HetArchiefIeObjectSector } from '@viaa/avo2-types';
import { describe, expect, it } from 'vitest';

import { IeObjectMetadataSet } from '../ie-objects.types';
import { mockIeObject1, mockUserInfo } from '../mocks/ie-objects.mock';

import {
	IeObjectAccessGrantedThrough,
	IeObjectNotVisibleReason,
	buildIeObjectAccessReport,
} from './build-ie-object-access-report';
import { limitAccessToObjectDetails } from './limit-access-to-object-details';
import type { LimitAccessTrace } from './limit-access-to-object-details.types';

import { GroupId } from '~modules/users/types';

const anonymousUserInfo = {
	...mockUserInfo,
	userId: null,
	groupId: undefined,
	accessibleObjectIdsThroughFolders: [],
	accessibleVisitorSpaceIds: [],
};

const buildReport = (licenses: HetArchiefIeObjectLicense[], userInfo = anonymousUserInfo) => {
	const ieObject = { ...mockIeObject1, licenses, sector: HetArchiefIeObjectSector.CULTURE };
	const trace: LimitAccessTrace = {};
	const limitedIeObject = limitAccessToObjectDetails(ieObject, userInfo, trace);
	return buildIeObjectAccessReport(ieObject as any, limitedIeObject, trace, false);
};

describe('buildIeObjectAccessReport', () => {
	it('explains a publicly visible object', () => {
		const report = buildReport([HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL]);

		expect(report.isVisible).toEqual(true);
		expect(report.highestMetadataSet).toEqual(IeObjectMetadataSet.METADATA_ALL);
		expect(report.notVisibleReasons).toEqual([]);
		expect(report.licenses).toEqual([
			{
				license: HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL,
				isImplied: false,
				metadataSet: IeObjectMetadataSet.METADATA_ALL,
				grantedThrough: [IeObjectAccessGrantedThrough.PUBLIC],
				counts: true,
			},
			{
				license: HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD,
				isImplied: true,
				metadataSet: IeObjectMetadataSet.METADATA_LTD,
				grantedThrough: [IeObjectAccessGrantedThrough.PUBLIC],
				counts: true,
			},
		]);

		const nameField = report.fields.find((field) => field.field === 'name');
		const thumbnailField = report.fields.find((field) => field.field === 'thumbnailUrl');
		expect(nameField).toEqual({
			field: 'name',
			requiredMetadataSet: IeObjectMetadataSet.METADATA_LTD,
			visible: true,
			hasValue: true,
		});
		expect(thumbnailField?.visible).toEqual(false);
		expect(thumbnailField?.requiredMetadataSet).toEqual(
			IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE
		);
		// Visible fields with a value are listed first
		expect(report.fields[0].visible && report.fields[0].hasValue).toEqual(true);
	});

	it('lists the reasons why an object is not visible', () => {
		const report = buildReport([
			HetArchiefIeObjectLicense.BEZOEKERTOOL_CONTENT,
			HetArchiefIeObjectLicense.INTRA_CP_METADATA_ALL,
		]);

		expect(report.isVisible).toEqual(false);
		expect(report.limitedIeObject).toBeNull();
		expect(report.highestMetadataSet).toEqual(IeObjectMetadataSet.EMPTY);
		expect(report.notVisibleReasons).toEqual([
			IeObjectNotVisibleReason.NO_PUBLIC_LICENSE,
			IeObjectNotVisibleReason.SECTOR_CONDITIONS_NOT_MET,
			IeObjectNotVisibleReason.NO_VISITOR_SPACE_ACCESS,
		]);
	});

	it('marks licenses granted through the sector', () => {
		const report = buildReport([HetArchiefIeObjectLicense.INTRA_CP_CONTENT], {
			...anonymousUserInfo,
			userId: 'user-id',
			groupId: GroupId.VISITOR,
			isKeyUser: true,
			sector: HetArchiefIeObjectSector.CULTURE,
			maintainerId: 'OR-other',
		});

		expect(report.isVisible).toEqual(true);
		expect(report.highestMetadataSet).toEqual(IeObjectMetadataSet.METADATA_ALL_WITH_ESSENCE);
		expect(report.trace.sectorCheck?.applies).toEqual(true);
		expect(
			report.licenses.every((license) =>
				license.grantedThrough.includes(IeObjectAccessGrantedThrough.SECTOR)
			)
		).toEqual(true);
	});
});
