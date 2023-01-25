import { InternalServerErrorException, Logger } from '@nestjs/common';
import zendesk, { Client, Requests } from 'node-zendesk';

import { checkRequiredEnvs } from '~shared/helpers/env-check';

export class ZendeskService {
	private static logger: Logger = new Logger(ZendeskService.name, { timestamp: true });
	private static client: Client;

	public static initialize() {
		checkRequiredEnvs(['ZENDESK_ENDPOINT', 'ZENDESK_USERNAME', 'ZENDESK_TOKEN']);

		ZendeskService.client = zendesk.createClient({
			username: process.env.ZENDESK_USERNAME as string,
			token: process.env.ZENDESK_TOKEN as string,
			remoteUri: process.env.ZENDESK_ENDPOINT as string,
		});
	}

	/**
	 * Create a new ticket in zendesk
	 * @param request
	 */
	public static async createTicket(
		request: Requests.CreateModel
	): Promise<Requests.ResponseModel> {
		return new Promise<Requests.ResponseModel>((resolve, reject) => {
			try {
				ZendeskService.client.requests.create(
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
