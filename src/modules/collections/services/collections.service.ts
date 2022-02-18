import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';

import { Collection } from '../types';

import { FIND_COLLECTION_BY_ID, FIND_COLLECTIONS_BY_USER } from './queries.gql';

import { DataService } from '~modules/data/services/data.service';
import { PaginationHelper } from '~shared/helpers/pagination';

@Injectable()
export class CollectionsService {
	private logger: Logger = new Logger(CollectionsService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	/**
	 * Adapt a collection as returned by a typical graphQl response to our internal collection data model
	 */
	public adapt(collection: any): Collection {
		return collection;
	}

	public async findByUser(
		userProfileId: string,
		page = 0,
		size = 1000
	): Promise<IPagination<Collection>> {
		const { offset, limit } = PaginationHelper.convertPagination(page, size);
		const collectionsResponse = await this.dataService.execute(FIND_COLLECTIONS_BY_USER, {
			userProfileId,
			offset,
			limit,
		});

		return Pagination<Collection>({
			items: collectionsResponse.data.cp_collection.map((collection: any) =>
				this.adapt(collection)
			),
			page,
			size,
			total: collectionsResponse.data.cp_collection_aggregate.aggregate.count,
		});
	}

	public async findById(collectionId: string): Promise<Collection> {
		const collectionResponse = await this.dataService.execute(FIND_COLLECTION_BY_ID, {
			collectionId,
		});
		if (!collectionResponse.data.cp_collection[0]) {
			throw new NotFoundException();
		}
		return this.adapt(collectionResponse.data.cp_collection[0]);
	}
}
