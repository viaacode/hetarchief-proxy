import { DataService } from '@meemoo/admin-core-api';
import { Injectable, Logger } from '@nestjs/common';

import packageJson from '../../../../package.json';

import {
	GetFirstObjectIdDocument,
	GetFirstObjectIdQuery,
} from '~generated/graphql-db-types-hetarchief';
import { MediaService } from '~modules/media/services/media.service';

@Injectable()
export class StatusService {
	private logger: Logger = new Logger(StatusService.name, { timestamp: true });

	constructor(private dataService: DataService, private mediaService: MediaService) {}

	getStatus(): Record<string, string> {
		return {
			name: 'HetArchief proxy service',
			version: packageJson.version,
		};
	}

	async getStatusFull(): Promise<Record<string, string>> {
		return {
			...this.getStatus(),
			graphql: (await this.getGraphQlStatus()) ? 'reachable' : 'not accessible',
			elasticsearch: (await this.getElasticsearchStatus()) ? 'reachable' : 'not accessible',
			// TODO add redis
		};
	}

	private async getGraphQlStatus(): Promise<boolean> {
		try {
			const response = await this.dataService.execute<GetFirstObjectIdQuery>(
				GetFirstObjectIdDocument
			);

			/* istanbul ignore next */
			return !!response?.object_ie?.[0]?.schema_identifier;
		} catch (err) {
			this.logger.error(err);
			return false;
		}
	}

	private async getElasticsearchStatus(): Promise<boolean> {
		try {
			const response = await this.mediaService.executeQuery('_all', {
				size: 1,
				_source: ['_id'],
				query: {
					match_all: {},
				},
			});

			/* istanbul ignore next */
			return !!response?.hits?.hits?.[0]?._id;
		} catch (err) {
			this.logger.error(err);
			return false;
		}
	}
}
