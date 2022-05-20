import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Avo } from '@viaa/avo2-types';
import { every, get, some } from 'lodash';

import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { QueryOrigin } from '../types';

import { ContentPagesService } from '~modules/admin/content-pages/services/content-pages.service';
import { Permission, User } from '~modules/users/types';

type IsAllowed = (user: User, query: string, variables: any) => Promise<boolean>;

function hasPermission(user: User, permissionName: Permission): boolean {
	const permissions = get(user, 'profile.permissions') || get(user, 'permissions') || [];
	return permissions.includes(permissionName);
}

function or(...permissionNames: Permission[]): IsAllowed {
	return async (user: User): Promise<boolean> => {
		return some(permissionNames, (permissionName) => hasPermission(user, permissionName));
	};
}

async function canInsertContentBlocks(user: User, query: string, variables: any): Promise<boolean> {
	if (hasPermission(user, Permission.EDIT_ANY_CONTENT_PAGES)) {
		return true;
	}

	const contentPageIds: number[] = variables.content_blocks.map(
		(block: Avo.ContentPage.Block) => block.content_id
	);
	const contentPages: Avo.ContentPage.Page[] =
		await this.contentPagesService.getContentPagesByIds(contentPageIds);

	return !!(
		(hasPermission(user, Permission.CREATE_CONTENT_PAGES) ||
			hasPermission(user, Permission.EDIT_OWN_CONTENT_PAGES)) &&
		every(contentPages, (contentPage) => contentPage.user_profile_id === user.id)
	);
}

async function canUpdateContentBlocks(
	user: User,
	query: string,
	variables: { id: number }
): Promise<boolean> {
	if (hasPermission(user, Permission.EDIT_ANY_CONTENT_PAGES)) {
		return true;
	}

	const contentBlockId: number = variables.id;
	const contentPage: Avo.ContentPage.Page =
		await this.contentPagesService.getContentPageByContentBlockId(contentBlockId);

	return (
		hasPermission(user, Permission.EDIT_OWN_CONTENT_PAGES) &&
		contentPage.user_profile_id === user.id
	);
}

const ALL_LOGGED_IN_USERS = () => Promise.resolve(true);

@Injectable()
export class DataPermissionsService {
	private logger = new Logger(DataPermissionsService.name, { timestamp: true });

	constructor(
		@Inject(forwardRef(() => ContentPagesService))
		private contentPagesService: ContentPagesService
	) {}

	private QUERY_PERMISSIONS: {
		ADMIN_CORE: { [queryName: string]: IsAllowed };
		PROXY: { [queryName: string]: IsAllowed };
	} = {
		ADMIN_CORE: {
			// TODO check actual permissions for each query in the whitelist
			deleteContentPageLabelById: or(Permission.EDIT_CONTENT_PAGE_LABELS),
			getContentPageLabelById: ALL_LOGGED_IN_USERS,
			getContentPageLabels: ALL_LOGGED_IN_USERS,
			insertContentPageLabel: or(Permission.EDIT_CONTENT_PAGE_LABELS),
			updateContentPageLabel: or(Permission.EDIT_CONTENT_PAGE_LABELS),
			deleteContentBlock: or(Permission.DELETE_ANY_CONTENT_PAGES),
			deleteContentLabelLinks: async (user: User, query: string, variables: any) => {
				if (hasPermission(user, Permission.EDIT_ANY_CONTENT_PAGES)) {
					return true;
				}
				if (hasPermission(user, Permission.EDIT_OWN_CONTENT_PAGES)) {
					const contentPage = (
						await this.contentPagesService.getContentPagesByIds([
							variables.contentPageId,
						])
					)[0];
					if (contentPage.user_profile_id === user.id) {
						return true;
					}
				}

				return false;
			},
			getContentById: or(
				Permission.EDIT_ANY_CONTENT_PAGES,
				Permission.EDIT_OWN_CONTENT_PAGES
			),
			getContentLabelsByContentType: or(
				Permission.EDIT_ANY_CONTENT_PAGES,
				Permission.EDIT_OWN_CONTENT_PAGES
			),
			getContentPagesByIds: ALL_LOGGED_IN_USERS,
			getContentPages: ALL_LOGGED_IN_USERS,
			getContentTypes: or(
				Permission.EDIT_ANY_CONTENT_PAGES,
				Permission.EDIT_OWN_CONTENT_PAGES
			),
			GetPermissionsFromContentPageByPath: or(Permission.EDIT_NAVIGATION_BARS),
			getPublicContentPagesByTitle: or(
				Permission.EDIT_CONTENT_PAGE_LABELS,
				Permission.EDIT_ANY_CONTENT_PAGES,
				Permission.EDIT_OWN_CONTENT_PAGES
			),
			getPublicProjectContentPagesByTitle: or(
				Permission.EDIT_CONTENT_PAGE_LABELS,
				Permission.EDIT_OWN_CONTENT_PAGES,
				Permission.EDIT_ANY_CONTENT_PAGES,
				Permission.EDIT_NAVIGATION_BARS
			),
			getPublicProjectContentPages: or(
				Permission.EDIT_CONTENT_PAGE_LABELS,
				Permission.EDIT_OWN_CONTENT_PAGES,
				Permission.EDIT_ANY_CONTENT_PAGES
			),
			insertContentBlocks: canInsertContentBlocks,
			insertContentLabelLinks: async (user: User, query: string, variables: any) => {
				if (hasPermission(user, Permission.EDIT_ANY_CONTENT_PAGES)) {
					return true;
				}
				if (hasPermission(user, Permission.EDIT_OWN_CONTENT_PAGES)) {
					const contentPages = await this.contentPagesService.getContentPagesByIds(
						variables.objects.map((obj: any) => obj.content_id)
					);
					if (
						every(
							contentPages,
							(contentPage) => contentPage.user_profile_id === user.id
						)
					) {
						return true;
					}
				}

				return false;
			},
			insertContent: async (user: User, query: string, variables: any) => {
				if (hasPermission(user, Permission.EDIT_ANY_CONTENT_PAGES)) {
					return true;
				}
				if (
					hasPermission(user, Permission.EDIT_OWN_CONTENT_PAGES) &&
					variables.contentPage.user_profile_id === user.id
				) {
					return true;
				}
				return false;
			},
			softDeleteContent: or(Permission.DELETE_ANY_CONTENT_PAGES),
			updateContentBlock: canUpdateContentBlocks,
			updateContentById: async (user: User, query: string, variables: any) => {
				if (hasPermission(user, Permission.EDIT_ANY_CONTENT_PAGES)) {
					return true;
				}
				if (hasPermission(user, Permission.EDIT_OWN_CONTENT_PAGES)) {
					const contentPage = (
						await this.contentPagesService.getContentPagesByIds([variables.id])
					)[0];
					if (!contentPage) {
						return true;
					}
					if (
						contentPage.user_profile_id === user.id &&
						variables.contentPage.user_profile_id === user.id
					) {
						return true;
					}
				}
				return false;
			},
			deleteUserGroup: or(Permission.EDIT_USER_GROUPS),
			getUserGroupById: or(Permission.EDIT_USER_GROUPS),
			getUserGroupsWithFilters: or(
				Permission.EDIT_USER_GROUPS,
				Permission.EDIT_ANY_CONTENT_PAGES,
				Permission.EDIT_OWN_CONTENT_PAGES,
				Permission.EDIT_NAVIGATION_BARS,
				Permission.EDIT_ANY_USER
			),
			insertUserGroup: or(Permission.EDIT_USER_GROUPS),
			updateUserGroup: or(Permission.EDIT_USER_GROUPS),
			getIdps: or(Permission.VIEW_USERS),
			getProfileIds: or(Permission.EDIT_ANY_USER),
			getProfileNames: or(
				Permission.EDIT_ANY_USER,
				Permission.VIEW_COLLECTIONS_OVERVIEW,
				Permission.VIEW_BUNDLES_OVERVIEW,
				Permission.EDIT_OWN_CONTENT_PAGES,
				Permission.EDIT_ANY_CONTENT_PAGES,
				Permission.VIEW_USERS_IN_SAME_COMPANY
			),
			getUsers: or(
				Permission.EDIT_ANY_USER,
				Permission.EDIT_ANY_COLLECTIONS,
				Permission.VIEW_USERS_IN_SAME_COMPANY
			),
			GET_USERS_IN_COMPANY: or(Permission.VIEW_USERS_IN_SAME_COMPANY),
		},
		PROXY: {},
	};

	public async verify(
		user: User,
		queryName: string,
		origin: QueryOrigin,
		queryDto: GraphQlQueryDto
	): Promise<boolean> {
		this.logger.log(`Verifying... ${queryName}`);
		if (this.QUERY_PERMISSIONS[origin][queryName]) {
			this.logger.log(`Permissions set for query ${queryName}`);
			return this.QUERY_PERMISSIONS[origin][queryName](
				user,
				queryDto.query,
				queryDto.variables
			);
		}

		// no specific permissions specified, allow query
		return true;
	}
}
