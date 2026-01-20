import { SortDirection } from '@meemoo/admin-core-api';

import { IeObjectsQueryDto } from '../dto/ie-objects.dto';
import {
	IeObjectsSearchFilterField,
	Operator,
	OrderProperty,
} from '../elasticsearch/elasticsearch.consts';

import { describe, expect, it } from 'vitest';
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
				value: 'The big -)( test',
			},
		],
	};
	it('should add quotes to around the search terms value', () => {
		const result = convertQueryToLiteralString(mockQueryDto);
		expect(result.filters[0].value).toEqual('"The big -)( test"');
	});
});
