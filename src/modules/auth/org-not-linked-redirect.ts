import { type Idp } from '@viaa/avo2-types';
import { type Response } from 'express';
import queryString from 'query-string';

/**
 * If a kiosk user or a maintainer admin is not linked to a space in the ACM (Account manager meemoo)
 * Then we should logout that user and redirect them to an error page
 *
 * We logout the user to ensure new info is fetched the next time they login.
 * Since the maintainer will probably contact meemoo about the problem and meemoo will add the organisation to the account
 * So the next time they login, we need to fetch fresh info from the respective IDP (hetarchief | meemoo)
 */
export function orgNotLinkedLogoutAndRedirectToErrorPage(
	res: Response,
	proxyHost: string,
	idp: Idp,
	message: string,
	title: string
): { url: string } {
	return {
		url: queryString.stringifyUrl({
			url: `${proxyHost}/auth/${idp.toLowerCase()}/logout`,
			query: {
				returnToUrl: queryString.stringifyUrl({
					url: `${proxyHost}/not-found`,
					query: { message, title },
				}),
				forceLogout: 'true',
			},
		}),
	};
}
