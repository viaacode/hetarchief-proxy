import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import got, { type Got } from 'got';

import type { Configuration } from '~config';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { GroupName, type User } from '~modules/users/types';
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

	public mapUserToEventData(user: SessionUserEntity | User | null): {
		user_group_name: string;
		user_group_id: string | null;
		is_key_user: boolean;
		is_evaluator: boolean;
	} {
		return {
			user_group_name:
				(user as SessionUserEntity)?.getGroupName() ||
				(user as User)?.groupName ||
				GroupName.ANONYMOUS,
			user_group_id: ((user as SessionUserEntity)?.getGroupId() || (user as User)?.groupId) ?? null,
			is_key_user:
				((user as SessionUserEntity)?.getIsKeyUser() || (user as User)?.isKeyUser) ?? false,
			is_evaluator:
				((user as SessionUserEntity)?.getIsEvaluator() || (user as User)?.isEvaluator) ?? false,
		};
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
