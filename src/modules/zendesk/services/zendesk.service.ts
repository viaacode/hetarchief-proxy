import { InternalServerErrorException, Logger } from '@nestjs/common';
import { addSeconds } from 'date-fns';
import zendesk from 'node-zendesk';

import { CreateTicketRequestDto } from '../dto/zendesk.dto';
import type {
	CreateTicketResponse,
	ZendeskAccessToken,
	ZendeskOauthTokenResponse,
} from '../zendesk.types';

import { checkRequiredEnvs } from '~shared/helpers/env-check';

/**
 * Zendesk is retiring api tokens (email + token over http basic auth) as an authentication method.
 * All remaining api tokens stop working on 2027-04-30, so we authenticate with a short lived oauth
 * access token obtained through the client credentials grant instead.
 * @see https://developer.zendesk.com/documentation/authentication/oauth-migration/
 */

// Refetch the access token this many seconds before it actually expires
const TOKEN_EXPIRE_MARGIN_SECONDS = 60;

// Fallback lifetime for oauth clients that were created before 2026-04-30 and have no expires_in
const TOKEN_DEFAULT_EXPIRES_IN_SECONDS = 1800;

// Covers both POST /requests.json and POST /uploads.json
const TOKEN_SCOPE = 'tickets:write';

export class ZendeskService {
	private static logger: Logger = new Logger(ZendeskService.name, { timestamp: true });
	private static accessToken: ZendeskAccessToken | null = null;

	public static initialize() {
		checkRequiredEnvs([
			'ZENDESK_ENDPOINT',
			'ZENDESK_TOKEN_ENDPOINT',
			'ZENDESK_CLIENT_ID',
			'ZENDESK_CLIENT_SECRET',
		]);
	}

	/**
	 * Get an oauth access token for the zendesk api, reusing the cached one while it is still valid
	 * @param forceRefresh ignore the cached token, eg: after the zendesk api rejected it with a 401
	 */
	private static async getAccessToken(forceRefresh = false): Promise<string> {
		const existingToken = ZendeskService.accessToken;
		const isTokenStillValid =
			!forceRefresh &&
			existingToken &&
			addSeconds(existingToken.createdAt, existingToken.expiresIn - TOKEN_EXPIRE_MARGIN_SECONDS) >
				new Date();
		if (isTokenStillValid) {
			return existingToken.accessToken;
		}

		const response = await fetch(process.env.ZENDESK_TOKEN_ENDPOINT as string, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				grant_type: 'client_credentials',
				client_id: process.env.ZENDESK_CLIENT_ID as string,
				client_secret: process.env.ZENDESK_CLIENT_SECRET as string,
				scope: TOKEN_SCOPE,
			}),
		});
		if (response.status < 200 || response.status >= 400) {
			const error = new InternalServerErrorException({
				message: 'Failed to get an access token for the zendesk api',
				additionalInfo: {
					status: response.status,
					statusText: response.statusText,
					responseBody: await response.text().catch(() => null),
				},
			});
			ZendeskService.logger.error(error);
			throw error;
		}

		// The client credentials grant does not return a refresh token, we simply request a new one
		const token = (await response.json()) as ZendeskOauthTokenResponse;
		ZendeskService.accessToken = {
			accessToken: token.access_token,
			expiresIn: token.expires_in || TOKEN_DEFAULT_EXPIRES_IN_SECONDS,
			createdAt: new Date(),
		};
		return token.access_token;
	}

	/**
	 * The access token expires, so the client has to be built per request instead of once at startup
	 */
	private static async getClient(forceRefreshToken = false) {
		return zendesk.createClient({
			oauth: true,
			token: await ZendeskService.getAccessToken(forceRefreshToken),
			remoteUri: process.env.ZENDESK_ENDPOINT as string,
			// Only used for basic auth, but required by the node-zendesk typings
			username: '',
		});
	}

	/**
	 * Create a new ticket in zendesk
	 * @param request
	 */
	public static async createTicket(request: CreateTicketRequestDto): Promise<CreateTicketResponse> {
		try {
			return await ZendeskService.createTicketWithToken(request);
		} catch (err) {
			// The token can be revoked before it expires, in that case retry once with a fresh token
			if ((err as { statusCode?: number })?.statusCode === 401) {
				ZendeskService.logger.warn(
					'The zendesk api rejected our access token, retrying with a new one'
				);
				return await ZendeskService.createTicketWithToken(request, true);
			}
			throw err;
		}
	}

	private static async createTicketWithToken(
		request: CreateTicketRequestDto,
		forceRefreshToken = false
	): Promise<CreateTicketResponse> {
		const client = await ZendeskService.getClient(forceRefreshToken);
		return new Promise<CreateTicketResponse>((resolve, reject) => {
			try {
				client.requests.create(
					{ request },
					(error: Error | undefined, response: any, result: any) => {
						error ? reject(error) : resolve(result);
					}
				);
			} catch (err) {
				const error = new InternalServerErrorException({
					message: 'Failed to create ticket through the zendesk api',
					innerException: err,
					additionalInfo: { request },
				});
				ZendeskService.logger.error(error);
				reject(error);
			}
		});
	}
}
