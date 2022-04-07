import { Injectable, NotFoundException } from '@nestjs/common';

import { Tos } from '../types';

import {
	GetTosLastUpdatedAtDocument,
	GetTosLastUpdatedAtQuery,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class TosService {
	constructor(protected dataService: DataService) {}

	/**
	 * Adapt a tos as returned by a typical graphQl response to our internal tos data model
	 */
	public adapt(gqlTosValue: GetTosLastUpdatedAtQuery['cms_site_variables_by_pk']['value']): Tos {
		return {
			updatedAt: gqlTosValue,
		};
	}

	public async getTosLastUpdatedAt(): Promise<Tos> {
		const {
			data: { cms_site_variables_by_pk: cmsSiteVariable },
		} = await this.dataService.execute<GetTosLastUpdatedAtQuery>(GetTosLastUpdatedAtDocument);

		const gqlTosValue = cmsSiteVariable?.value;
		if (!gqlTosValue) {
			throw new NotFoundException('No TOS date was found in the database');
		}

		return this.adapt(gqlTosValue);
	}
}
