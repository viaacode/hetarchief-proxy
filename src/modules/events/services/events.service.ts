import { Injectable, Logger } from '@nestjs/common';
// biome-ignore lint/style/useImportType: We need the full class for dependency injection to work with nestJS
import { ConfigService } from '@nestjs/config';
import got, { type Got } from 'got';

import type { Configuration } from '~config';

import { INSERT_EVENTS } from '../queries/queries.gql';
import type { LogEvent } from '../types';

@Injectable()
export class EventsService {
	private logger: Logger = new Logger(EventsService.name, { timestamp: true });
	private eventsGotInstance: Got;

	constructor(private configService: ConfigService<Configuration>) {
		this.eventsGotInstance = got.extend({
			prefixUrl: this.configService.get('GRAPHQL_URL_LOGGING'),
			resolveBodyOnly: true,
			responseType: 'json',
			headers: {
				'x-hasura-admin-secret': this.configService.get('GRAPHQL_SECRET_LOGGING'),
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
