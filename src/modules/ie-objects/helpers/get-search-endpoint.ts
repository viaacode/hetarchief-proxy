export const getSearchEndpoint = (esIndex: string | null): string => {
	if (!esIndex) {
		return '_all/_search';
	}
	return `${esIndex}/_search`;
};
