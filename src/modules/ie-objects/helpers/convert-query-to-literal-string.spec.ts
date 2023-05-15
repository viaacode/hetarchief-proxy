import { SortDirection } from '@meemoo/admin-core-api';

import { IeObjectsQueryDto } from '../dto/ie-objects.dto';
import {
	IeObjectsSearchFilterField,
	Operator,
	OrderProperty,
} from '../elasticsearch/elasticsearch.consts';

import { convertQueryToLiteralString } from './convert-query-to-literal-string';

describe('convertQueryToLiteralString', () => {
	const mockQueryDto: IeObjectsQueryDto = {
		page: 1,
		size: 10,
		orderProp: OrderProperty.RELEVANCE,
		orderDirection: SortDirection.asc,
		filters: [
			{
				field: IeObjectsSearchFilterField.QUERY,
				operator: Operator.CONTAINS,
				value: 'De grote -)( test',
			},
		],
	};
	it('should add quotes to around the search terms value', () => {
		const result = convertQueryToLiteralString(mockQueryDto);
		expect(result.filters[0].value).toEqual('"De grote -)( test"');
	});
});
