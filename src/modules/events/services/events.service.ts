import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';

import { getConfig } from '~config';

import { INSERT_EVENTS } from '../queries/queries.gql';
import { LogEvent } from '../types';

@Injectable()
export class EventsService {
	private logger: Logger = new Logger(EventsService.name, { timestamp: true });
	private eventsGotInstance: Got;

	constructor(protected configService: ConfigService) {
		this.eventsGotInstance = got.extend({
			prefixUrl: getConfig(this.configService, 'graphQlUrlLogging'),
			resolveBodyOnly: true,
			responseType: 'json',
			headers: {
				'x-hasura-admin-secret': getConfig(this.configService, 'graphQlSecretLogging'),
			},
		});
	}

	public async insertEvents(logEvents: LogEvent[]): Promise<any> {
		try {
			await this.eventsGotInstance.post({
				json: {
					query: INSERT_EVENTS,
					variables: {
						eventLogEntries: logEvents,
					},
				},
			});
		} catch (err) {
			this.logger.error(
				JSON.stringify({
					message: 'Failed to insert events into the database',
					innerException: err,
					additionalInfo: { logEvents },
				})
			);
		}
		return logEvents;
	}
}
