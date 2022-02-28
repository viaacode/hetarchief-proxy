import { Injectable, NotFoundException } from '@nestjs/common';

import { Tos } from '../types';

import { DataService } from '~modules/data/services/data.service';
import { GET_TOS_LAST_UPDATED_AT } from '~modules/tos/services/queries.gql';

@Injectable()
export class TosService {
	constructor(protected dataService: DataService) {}

	/**
	 * Adapt a tos as returned by a typical graphQl response to our internal tos data model
	 */
	public adapt(gqlTosValue: string): Tos {
		return {
			updatedAt: gqlTosValue,
		};
	}

	public async getTosLastUpdatedAt(): Promise<Tos> {
		const {
			data: { cms_site_variables_by_pk: cmsSiteVariable },
		} = await this.dataService.execute(GET_TOS_LAST_UPDATED_AT);

		const gqlTosValue = cmsSiteVariable?.value;
		if (!gqlTosValue) {
			throw new NotFoundException('No TOS date was found in the database');
		}

		return this.adapt(gqlTosValue);
	}
}
