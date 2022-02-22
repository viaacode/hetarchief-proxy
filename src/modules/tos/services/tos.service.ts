import { Injectable, NotFoundException } from '@nestjs/common';

import { gqlTos, Tos } from '../types';

import { DataService } from '~modules/data/services/data.service';
import { GET_TOS_LAST_UPDATED_AT } from '~modules/tos/services/queries.gql';

@Injectable()
export class TosService {
	constructor(protected dataService: DataService) {}

	/**
	 * Adapt a tos as returned by a typical graphQl response to our internal tos data model
	 */
	public adapt(gql: gqlTos): Tos {
		return {
			updatedAt: gql.updated_at,
		};
	}

	public async getTosLastUpdatedAt(): Promise<Tos> {
		const tosResponse = await this.dataService.execute(GET_TOS_LAST_UPDATED_AT);

		const gqlTosValue: gqlTos = tosResponse?.data?.cms_site_variables?.[0]?.value;
		if (!gqlTosValue?.updated_at) {
			throw new NotFoundException('No tos date was found in the database');
		}

		return this.adapt(gqlTosValue);
	}
}
