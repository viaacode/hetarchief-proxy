import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';
import _ from 'lodash';

import { CreateNavigationDto, NavigationsQueryDto } from '../dto/navigations.dto';
import { Navigation } from '../types';

import {
	DeleteNavigationDocument,
	DeleteNavigationMutation,
	FindAllNavigationItemsDocument,
	FindAllNavigationItemsQuery,
	FindNavigationByIdDocument,
	FindNavigationByIdQuery,
	FindNavigationByPlacementDocument,
	InsertNavigationDocument,
	InsertNavigationMutation,
	UpdateNavigationByIdDocument,
	UpdateNavigationByIdMutation,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';
import { GraphQlResponse } from '~modules/data/types';
import { User } from '~modules/users/types';
import { DeleteResponse, SpecialPermissionGroups } from '~shared/types/types';

@Injectable()
export class NavigationsService {
	private logger: Logger = new Logger(NavigationsService.name, { timestamp: true });

	constructor(private dataService: DataService) {}

	public async createElement(navigationItem: CreateNavigationDto): Promise<Navigation> {
		const {
			data: { insert_cms_navigation_element_one: createdNavigation },
		} = await this.dataService.execute<InsertNavigationMutation>(InsertNavigationDocument, {
			navigationItem,
		});
		this.logger.debug(`Navigation ${createdNavigation.id} created`);

		return createdNavigation;
	}

	public async updateElement(
		id: string,
		navigationItem: CreateNavigationDto
	): Promise<Navigation> {
		const {
			data: { update_cms_navigation_element_by_pk: updatedNavigation },
		} = await this.dataService.execute<UpdateNavigationByIdMutation>(
			UpdateNavigationByIdDocument,
			{
				id,
				navigationItem,
			}
		);
		this.logger.debug(`Navigation ${updatedNavigation.id} updated`);

		return updatedNavigation;
	}

	public async deleteElement(id: string): Promise<DeleteResponse> {
		const {
			data: {
				delete_cms_navigation_element: { affected_rows: affectedRows },
			},
		} = await this.dataService.execute<DeleteNavigationMutation>(DeleteNavigationDocument, {
			id,
		});

		return {
			affectedRows,
		};
	}

	public async findAllNavigationBars(
		navigationsQueryDto: NavigationsQueryDto
	): Promise<IPagination<Navigation>> {
		const { placement } = navigationsQueryDto;
		let navigationsResponse: GraphQlResponse;
		if (placement) {
			navigationsResponse = await this.dataService.execute(
				FindNavigationByPlacementDocument,
				{
					placement,
				}
			);
		} else {
			navigationsResponse = await this.dataService.execute<FindAllNavigationItemsQuery>(
				FindAllNavigationItemsDocument
			);
		}

		return Pagination<Navigation>({
			items: navigationsResponse.data.cms_navigation_element,
			page: 1,
			size: navigationsResponse.data.cms_navigation_element_aggregate.aggregate.count,
			total: navigationsResponse.data.cms_navigation_element_aggregate.aggregate.count,
		});
	}

	public async findElementById(id: string): Promise<Navigation> {
		const navigationResponse = await this.dataService.execute<FindNavigationByIdQuery>(
			FindNavigationByIdDocument,
			{ id }
		);
		if (!navigationResponse.data.cms_navigation_element[0]) {
			throw new NotFoundException();
		}
		return navigationResponse.data.cms_navigation_element[0];
	}

	public async getNavigationElementsForUser(user: User): Promise<Record<string, Navigation[]>> {
		const {
			data: { cms_navigation_element: navigations },
		} = await this.dataService.execute<FindAllNavigationItemsQuery>(
			FindAllNavigationItemsDocument
		);

		// filter based on logged in / logged out
		const allowedUserGroups = user
			? [SpecialPermissionGroups.loggedInUsers]
			: [SpecialPermissionGroups.loggedOutUsers];

		const visibleItems = [];
		navigations.forEach((navigation: Navigation) => {
			if (navigation.user_group_ids && navigation.user_group_ids.length) {
				// If the page doesn't have any groups specified, it isn't visible for anyone
				if (_.intersection(allowedUserGroups, navigation.user_group_ids).length) {
					// The logged in user has at least one user group that is required to view the nav item
					visibleItems.push(navigation);
				}
			}
		});

		return _.groupBy(visibleItems, 'placement');
	}
}
