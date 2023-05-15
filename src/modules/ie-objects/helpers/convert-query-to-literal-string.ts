import { IeObjectsQueryDto } from '../dto/ie-objects.dto';

export const convertQueryToLiteralString = (query: IeObjectsQueryDto): IeObjectsQueryDto => {
	query.filters = query.filters.map((filter) => {
		return { ...filter, value: `"${filter.value}"` };
	});
	return query;
};
