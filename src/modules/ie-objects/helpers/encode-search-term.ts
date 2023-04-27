import { ES_DIGIT_PREFIX } from '../elasticsearch/elasticsearch.consts';

export const encodeSearchterm = (pid: string): string => {
	return pid?.replace(/\d/g, (match) => ES_DIGIT_PREFIX + match + ES_DIGIT_PREFIX);
};

export const decodeSearchterm = (parsed: string): string => {
	const regex = new RegExp(`${ES_DIGIT_PREFIX}(\\d)${ES_DIGIT_PREFIX}`, 'g');
	return parsed?.replace(regex, (_, digit) => digit);
};
