import { Response } from 'express';
import queryString from 'query-string';

import { Idp } from '~shared/auth/auth.types';

/**
 * If a kiosk user or a maintainer admin is not linked to a space in the ACM (Account manager meemoo)
 * Then we should logout that user and redirect them to an error page
 *
 * We logout the user to ensure new info is fetched the next time they login.
 * Since the maintainer will probably contact meemoo about the problem and meemoo will add the organisation to the account
 * So the next time they login, we need to fetch fresh info from the respective IDP (hetarchief | meemoo)
 *
 * This throws an error:
 * UnhandledPromiseRejectionWarning: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
 * But if we use the normal nestjs way of redirecting: return {url, statusCode} then nestjs tries to redirect to logout as a post method
 * Which throws a 404 not found
 *
 * This way it works, but it also throws the error :s
 * Note: Doesn't seem to work locally
 */
export function orgNotLinkedLogoutAndRedirectToErrorPage(
	res: Response,
	proxyHost: string,
	idp: Idp,
	message: string,
	title: string
) {
	return res.redirect(
		queryString.stringifyUrl({
			url: `${proxyHost}/auth/${idp.toLowerCase()}/logout`,
			query: {
				returnToUrl: queryString.stringifyUrl({
					url: `${proxyHost}/not-found`,
					query: { message, title },
				}),
				forceLogout: 'true',
			},
		})
	);
}
