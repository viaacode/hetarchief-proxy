import { ALL_INDEXES } from '~modules/ie-objects/elasticsearch/elasticsearch.consts';

export const getSearchEndpoint = (esIndex: string | null): string => {
	if (!esIndex) {
		return `${ALL_INDEXES}/_search`;
	}
	return `${esIndex}/_search`;
};
