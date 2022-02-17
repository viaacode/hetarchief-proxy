import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';

import { CreateNavigationDto, NavigationsQueryDto } from '../dto/navigations.dto';
import { Navigation } from '../types';

import {
	DELETE_NAVIGATION,
	FIND_NAVIGATION_BY_ID,
	FIND_NAVIGATION_BY_PLACEMENT,
	FIND_NAVIGATIONS,
	INSERT_NAVIGATION,
	UPDATE_NAVIGATION_BY_ID,
} from './queries.gql';

import { DataService } from '~modules/data/services/data.service';
import { GraphQlResponse } from '~modules/data/types';
import { DeleteResponse } from '~shared/types/types';

@Injectable()
export class NavigationsService {
	private logger: Logger = new Logger(NavigationsService.name, { timestamp: true });

	constructor(private dataService: DataService) {}

	public async create(navigationItem: CreateNavigationDto): Promise<Navigation> {
		const {
			data: { insert_cms_navigation_element_one: createdNavigation },
		} = await this.dataService.execute(INSERT_NAVIGATION, { navigationItem });
		this.logger.debug(`Navigation ${createdNavigation.id} created`);

		return createdNavigation;
	}

	public async update(id: string, navigationItem: CreateNavigationDto): Promise<Navigation> {
		const {
			data: { update_cms_navigation_element_by_pk: updatedNavigation },
		} = await this.dataService.execute(UPDATE_NAVIGATION_BY_ID, { id, navigationItem });
		this.logger.debug(`Navigation ${updatedNavigation.id} updated`);

		return updatedNavigation;
	}

	public async delete(id: string): Promise<DeleteResponse> {
		const {
			data: {
				delete_cms_navigation_element: { affected_rows: affectedRows },
			},
		} = await this.dataService.execute(DELETE_NAVIGATION, { id });

		return {
			affectedRows,
		};
	}

	public async findAll(
		navigationsQueryDto: NavigationsQueryDto
	): Promise<IPagination<Navigation>> {
		const { placement } = navigationsQueryDto;
		let navigationsResponse: GraphQlResponse;
		if (placement) {
			navigationsResponse = await this.dataService.execute(FIND_NAVIGATION_BY_PLACEMENT, {
				placement,
			});
		} else {
			navigationsResponse = await this.dataService.execute(FIND_NAVIGATIONS);
		}

		return Pagination<Navigation>({
			items: navigationsResponse.data.cms_navigation_element,
			page: 1,
			size: navigationsResponse.data.cms_navigation_element_aggregate.aggregate.count,
			total: navigationsResponse.data.cms_navigation_element_aggregate.aggregate.count,
		});
	}

	public async findById(id: string): Promise<Navigation> {
		const navigationResponse = await this.dataService.execute(FIND_NAVIGATION_BY_ID, { id });
		if (!navigationResponse.data.cms_navigation_element[0]) {
			throw new NotFoundException();
		}
		return navigationResponse.data.cms_navigation_element[0];
	}
}
