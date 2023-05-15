import { IeObjectsQueryDto } from '../dto/ie-objects.dto';

// This function adds quotes around the searchterms values of the IeObjectsQueryDto object
export const convertQueryToLiteralString = (query: IeObjectsQueryDto): IeObjectsQueryDto => {
	query.filters = query.filters.map((filter) => {
		return { ...filter, value: `"${filter.value}"` };
	});
	return query;
};
