import { HetArchiefIeObjectType } from '@viaa/avo2-types';
import { IeObjectsSearchFilterField, Operator } from '../elasticsearch/elasticsearch.consts';

import { describe, expect, it } from 'vitest';
import { checkAndFixFormatFilter } from './check-and-fix-format-filter';

describe('checkAndFixFormatFilter', () => {
	it('should add film to a video format query', () => {
		const fixedQuery = checkAndFixFormatFilter({
			filters: [
				{
					field: IeObjectsSearchFilterField.FORMAT,
					value: HetArchiefIeObjectType.VIDEO,
					operator: Operator.IS,
				},
			],
		});
		expect(fixedQuery.filters[0].multiValue).toEqual([
			HetArchiefIeObjectType.VIDEO,
			HetArchiefIeObjectType.FILM,
			HetArchiefIeObjectType.VIDEO_FRAGMENT,
		]);
	});

	it('should add film to a query on video in a multivalue', () => {
		const fixedQuery = checkAndFixFormatFilter({
			filters: [
				{
					field: IeObjectsSearchFilterField.FORMAT,
					multiValue: [HetArchiefIeObjectType.VIDEO],
					operator: Operator.IS,
				},
			],
		});
		expect(fixedQuery.filters[0].multiValue).toEqual([
			HetArchiefIeObjectType.VIDEO,
			HetArchiefIeObjectType.FILM,
			HetArchiefIeObjectType.VIDEO_FRAGMENT,
		]);
	});
});
