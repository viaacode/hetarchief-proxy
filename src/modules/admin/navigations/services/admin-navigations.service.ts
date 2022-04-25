import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';

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
	FindNavigationByPlacementQuery,
	InsertNavigationDocument,
	InsertNavigationMutation,
	UpdateNavigationByIdDocument,
	UpdateNavigationByIdMutation,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';
import { GraphQlResponse } from '~modules/data/types';
import { NavigationItem } from '~modules/navigations/navigations.types';
import { DeleteResponse } from '~shared/types/types';

@Injectable()
export class AdminNavigationsService {
	private logger: Logger = new Logger(AdminNavigationsService.name, { timestamp: true });

	constructor(private dataService: DataService) {}

	public adapt(navigationItem: Navigation): NavigationItem {
		/* istanbul ignore next */
		return {
			id: navigationItem?.id,
			label: navigationItem?.label,
			placement: navigationItem?.placement,
			description: navigationItem?.description,
			linkTarget: navigationItem?.link_target,
			iconName: navigationItem?.icon_name,
			position: navigationItem?.position,
			contentType: navigationItem?.content_type,
			contentPath: navigationItem?.content_path,
			tooltip: navigationItem?.tooltip,
			updatedAt: navigationItem?.updated_at,
			createdAt: navigationItem?.created_at,
		};
	}

	public async createElement(navigationItem: CreateNavigationDto): Promise<Navigation> {
		const {
			data: { insert_app_navigation_one: createdNavigation },
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
			data: { update_app_navigation_by_pk: updatedNavigation },
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
				delete_app_navigation: { affected_rows: affectedRows },
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
		let navigationsResponse: GraphQlResponse<
			FindNavigationByPlacementQuery | FindAllNavigationItemsQuery
		>;
		if (placement) {
			navigationsResponse = await this.dataService.execute<FindNavigationByPlacementQuery>(
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
			items: navigationsResponse.data.app_navigation,
			page: 1,
			size: navigationsResponse.data.app_navigation.length,
			total: navigationsResponse.data.app_navigation.length,
		});
	}

	public async findElementById(id: string): Promise<Navigation> {
		const navigationResponse = await this.dataService.execute<FindNavigationByIdQuery>(
			FindNavigationByIdDocument,
			{ id }
		);
		if (!navigationResponse.data.app_navigation[0]) {
			throw new NotFoundException();
		}
		return navigationResponse.data.app_navigation[0];
	}
}
