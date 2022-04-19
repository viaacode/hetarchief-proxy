import { Injectable, Logger } from '@nestjs/common';
import _ from 'lodash';

import { GqlNavigation, NavigationItem } from '../navigations.types';

import {
	FindAllNavigationItemsDocument,
	FindAllNavigationItemsQuery,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';
import { User } from '~modules/users/types';
import { SpecialPermissionGroups } from '~shared/types/types';

@Injectable()
export class NavigationsService {
	private logger: Logger = new Logger(NavigationsService.name, { timestamp: true });

	constructor(private dataService: DataService) {}

	public adapt(navigationItem: GqlNavigation): NavigationItem {
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

	public async getNavigationElementsForUser(
		user: User
	): Promise<Record<string, NavigationItem[]>> {
		const {
			data: { app_navigation: navigations },
		} = await this.dataService.execute<FindAllNavigationItemsQuery>(
			FindAllNavigationItemsDocument
		);

		// filter based on logged in / logged out
		const allowedUserGroups = user
			? [SpecialPermissionGroups.loggedInUsers]
			: [SpecialPermissionGroups.loggedOutUsers];

		const visibleItems = [];
		navigations.forEach((navigation: GqlNavigation) => {
			if (navigation.user_group_ids && navigation.user_group_ids.length) {
				// If the page doesn't have any groups specified, it isn't visible for anyone
				if (_.intersection(allowedUserGroups, navigation.user_group_ids).length) {
					// The logged in user has at least one user group that is required to view the nav item
					visibleItems.push(navigation);
				}
			}
		});

		return _.groupBy(visibleItems.map(this.adapt), 'placement');
	}
}
