import { Operator, SearchFilterField } from '../elasticsearch/elasticsearch.consts';
import { MediaFormat } from '../ie-objects.types';

import { checkAndFixFormatFilter } from './check-and-fix-format-filter';

describe('checkAndFixFormatFilter', () => {
	it('should add film to a video format query', () => {
		const fixedQuery = checkAndFixFormatFilter({
			filters: [
				{
					field: SearchFilterField.FORMAT,
					value: MediaFormat.VIDEO,
					operator: Operator.IS,
				},
			],
		});
		expect(fixedQuery.filters[0].multiValue).toEqual(['video', 'film']);
	});

	it('should add film to a query on video in a multivalue', () => {
		const fixedQuery = checkAndFixFormatFilter({
			filters: [
				{
					field: SearchFilterField.FORMAT,
					multiValue: [MediaFormat.VIDEO],
					operator: Operator.IS,
				},
			],
		});
		expect(fixedQuery.filters[0].multiValue).toEqual(['video', 'film']);
	});
});
