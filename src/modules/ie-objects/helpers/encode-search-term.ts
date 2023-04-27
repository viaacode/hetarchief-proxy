import { ES_DIGIT_PREFIX } from '../elasticsearch/elasticsearch.consts';

/*
	This function parses the searchterm before jsep parses it.
	We do this because if the searchterm start with a digit, jsep will throw an error saying a variable cannot start with a digit.
	eg. input: 3r0pr9jj7g
			output: _ç_ç_ç_ç_ç_3_ç_ç_ç_ç_ç_r_ç_ç_ç_ç_ç_0_ç_ç_ç_ç_ç_pr_ç_ç_ç_ç_ç_9_ç_ç_ç_ç_ç_jj_ç_ç_ç_ç_ç_7_ç_ç_ç_ç_ç_g
*/
export const encodeSearchterm = (term: string): string => {
	return term?.replace(/\d/g, (match) => ES_DIGIT_PREFIX + match + ES_DIGIT_PREFIX);
};

/*
	This function parses the parsed searchterm back to the original searchterm.
	It should be used after jsep parsed the parsed searchterm.
	This is so the ES query searches for the original searchterm.
	eg. input: _ç_ç_ç_ç_ç_3_ç_ç_ç_ç_ç_r_ç_ç_ç_ç_ç_0_ç_ç_ç_ç_ç_pr_ç_ç_ç_ç_ç_9_ç_ç_ç_ç_ç_jj_ç_ç_ç_ç_ç_7_ç_ç_ç_ç_ç_g
			output: 3r0pr9jj7g
*/
export const decodeSearchterm = (parsedTerm: string): string => {
	const regex = new RegExp(`${ES_DIGIT_PREFIX}(\\d)${ES_DIGIT_PREFIX}`, 'g');
	return parsedTerm?.replace(regex, (_, digit) => digit);
};
