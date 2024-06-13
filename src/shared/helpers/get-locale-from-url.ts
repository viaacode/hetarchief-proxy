import { parseUrl } from 'query-string';

import { Locale } from '~shared/types/types';

/**
 * Normally we want to get the locale from the logged in user on the session
 * But if the user is not logged in yet, we can also deduce it from the return url that is passed for redirecting after successful login
 * @param url
 */
export function getLocaleFromUrl(url: string): Locale {
	const urlWithoutQueryParams = parseUrl(url).url;
	return (
		Object.values(Locale).find((languageCode) => {
			return (
				urlWithoutQueryParams.includes(process.env.CLIENT_URL + '/' + languageCode + '/') ||
				urlWithoutQueryParams === process.env.CLIENT_URL + '/' + languageCode
			);
		}) || Locale.Nl
	);
}
