import queryString from 'query-string';

/**
 * Url of the proxy error page, which shows the given title and message in the hetarchief layout with links back to the client
 * @param proxyHost
 * @param title
 * @param message
 */
export function getErrorPageUrl(proxyHost: string, title: string, message: string): string {
	return queryString.stringifyUrl({
		url: `${proxyHost}/not-found`,
		query: { title, message },
	});
}
