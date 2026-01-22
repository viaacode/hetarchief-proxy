import { IeObjectsSearchFilterField, Operator } from '../elasticsearch/elasticsearch.consts';
import { IeObjectType } from '../ie-objects.types';

import { describe, expect, it } from 'vitest';
import { checkAndFixFormatFilter } from './check-and-fix-format-filter';

describe('checkAndFixFormatFilter', () => {
	it('should add film to a video format query', () => {
		const fixedQuery = checkAndFixFormatFilter({
			filters: [
				{
					field: IeObjectsSearchFilterField.FORMAT,
					value: IeObjectType.VIDEO,
					operator: Operator.IS,
				},
			],
		});
		expect(fixedQuery.filters[0].multiValue).toEqual([
			IeObjectType.VIDEO,
			IeObjectType.FILM,
			IeObjectType.VIDEO_FRAGMENT,
		]);
	});

	it('should add film to a query on video in a multivalue', () => {
		const fixedQuery = checkAndFixFormatFilter({
			filters: [
				{
					field: IeObjectsSearchFilterField.FORMAT,
					multiValue: [IeObjectType.VIDEO],
					operator: Operator.IS,
				},
			],
		});
		expect(fixedQuery.filters[0].multiValue).toEqual([
			IeObjectType.VIDEO,
			IeObjectType.FILM,
			IeObjectType.VIDEO_FRAGMENT,
		]);
	});
});
