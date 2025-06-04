// biome-ignore lint/style/useImportType: We need the full class for dependency injection to work with nestJS
import { DataService } from '@meemoo/admin-core-api';
import { Injectable, NotFoundException } from '@nestjs/common';

import type { Tos } from '../types';

import { GetTosLastUpdatedAtDocument, type GetTosLastUpdatedAtQuery } from '~generated/graphql-db-types-hetarchief';

@Injectable()
export class TosService {
	constructor(private dataService: DataService) {}

	/**
	 * Adapt a tos as returned by a typical graphQl response to our internal tos data model
	 */
	public adapt(gqlTosValue: GetTosLastUpdatedAtQuery['app_config_by_pk']['value']): Tos {
		return {
			updatedAt: gqlTosValue,
		};
	}

	public async getTosLastUpdatedAt(): Promise<Tos> {
		const { app_config_by_pk: cmsSiteVariable } =
			await this.dataService.execute<GetTosLastUpdatedAtQuery>(GetTosLastUpdatedAtDocument);

		const gqlTosValue = cmsSiteVariable?.value;
		if (!gqlTosValue) {
			throw new NotFoundException('No TOS date was found in the database');
		}

		return this.adapt(gqlTosValue);
	}
}
