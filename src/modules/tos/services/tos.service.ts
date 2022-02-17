import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { gqlTos, Tos } from '../types';

import mockData from './__mocks__/tos';

import { DataService } from '~modules/data/services/data.service';

@Injectable()
export class TosService {
	private logger: Logger = new Logger(TosService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	/**
	 * Adapt a tos as returned by a typical graphQl response to our internal tos data model
	 */
	public adapt(gql: gqlTos): Tos {
		return {
			updatedAt: gql.updated_at,
		};
	}

	public async findFirst(): Promise<Tos> {
		const tosResponse = await Promise.resolve({
			data: { tos: [mockData] },
		});

		if (!tosResponse.data.tos[0]) {
			throw new NotFoundException();
		}

		return this.adapt(tosResponse.data.tos[0]);
	}
}
