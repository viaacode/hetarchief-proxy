import * as fs from 'fs';
import * as path from 'path';

import {
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Avo } from '@viaa/avo2-types';
import { every, get, some, without } from 'lodash';

import { getConfig } from '~config';

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

	private whitelistEnabled: boolean;
	private whitelist: Partial<Record<QueryOrigin, Record<string, string>>> = {};

	private QUERY_PERMISSIONS: {
		ADMIN_CORE: { [queryName: string]: IsAllowed };
		PROXY: { [queryName: string]: IsAllowed };
	};

	constructor(
		private configService: ConfigService,
		@Inject(forwardRef(() => ContentPagesService))
		private contentPagesService: ContentPagesService
	) {
		if (configService.get('environment') !== 'production') {
			this.logger.log('GraphQl config: ', {
				url: getConfig(this.configService, 'graphQlUrl'),
				secret: getConfig(this.configService, 'graphQlSecret'),
				whitelistEnabled: getConfig(this.configService, 'graphQlEnableWhitelist'),
			});
		}
		this.initWhitelist();
	}

	public async initWhitelist(): Promise<void> {
		this.whitelistEnabled = getConfig(this.configService, 'graphQlEnableWhitelist');

		const whitelistFiles: Record<QueryOrigin, string[]> = {
			PROXY: ['scripts/proxy-whitelist.json', 'scripts/proxy-whitelist-hetarchief.json'],
			ADMIN_CORE: ['scripts/admin-core-whitelist-hetarchief.json'],
		};

		Object.keys(whitelistFiles).forEach((whitelistKey) => {
			const whitelistPaths = whitelistFiles[whitelistKey];
			whitelistPaths.forEach((whitelistPath) => {
				const absoluteWhitelistPath = path.resolve(
					__dirname,
					'../../../../..',
					whitelistPath
				);
				const whitelistFileContent = fs.existsSync(absoluteWhitelistPath)
					? fs.readFileSync(absoluteWhitelistPath, { encoding: 'utf-8' }).toString()
					: '{}';
				this.whitelist[whitelistKey] = {
					...(this.whitelist[whitelistKey] || {}),
					...JSON.parse(whitelistFileContent),
				};
			});
		});

		this.QUERY_PERMISSIONS = {
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
					Permission.VIEW_USERS,
					Permission.EDIT_ANY_USER,
					Permission.EDIT_ANY_COLLECTIONS,
					Permission.VIEW_USERS_IN_SAME_COMPANY
				),
				getOrganizationsWithUsers: or(Permission.VIEW_USERS),
				getTranslations: or(Permission.EDIT_TRANSLATIONS),
				updateTranslations: or(Permission.EDIT_TRANSLATIONS),
				deleteNavigationItem: or(Permission.EDIT_NAVIGATION_BARS),
				getNavigationElements: or(Permission.EDIT_NAVIGATION_BARS),
				getNavigationItemById: or(Permission.EDIT_NAVIGATION_BARS),
				getNavigationItemsByPlacement: or(Permission.EDIT_NAVIGATION_BARS),
				insertNavigationItem: or(Permission.EDIT_NAVIGATION_BARS),
				updateNavigationItemById: or(Permission.EDIT_NAVIGATION_BARS),
			},
			PROXY: {},
		};

		const whitelistKeys = Object.keys(this.whitelist.ADMIN_CORE);
		const queryPermissionKeys = Object.keys(this.QUERY_PERMISSIONS.ADMIN_CORE);
		const missingPermissionChecks = without(whitelistKeys, ...queryPermissionKeys);
		if (missingPermissionChecks.length) {
			throw new InternalServerErrorException(
				'Some ADMIN_CORE query permission checks are missing: ' +
					missingPermissionChecks.join(', ') +
					'. Add them to the data-permissions service QUERY_PERMISSIONS list'
			);
		}
	}

	/**
	 * @returns if a query is allowed, by checking both whitelisting and query permissions
	 */
	public async isAllowedToExecuteQuery(
		user: User,
		queryDto: GraphQlQueryDto,
		origin: QueryOrigin
	): Promise<boolean> {
		if (this.isWhitelistEnabled() && !this.isQueryWhitelisted(queryDto)) {
			return false;
		}
		return this.verify(
			user,
			this.getWhitelistedQueryName(queryDto.query, QueryOrigin.ADMIN_CORE),
			origin,
			queryDto
		);
	}

	public isWhitelistEnabled(): boolean {
		return this.whitelistEnabled;
	}

	public setWhitelistEnabled(enabled: boolean): void {
		this.whitelistEnabled = enabled;
	}

	public getQueryName(query: string): string {
		return query?.trim()?.split(' ')?.[1]?.split('(')?.[0];
	}

	public getWhitelistedQueryName(query: string, origin: QueryOrigin): string {
		const queryName = this.getQueryName(query);
		if (!queryName) {
			return null;
		}
		const whitelistedQuery = this.whitelist[origin][queryName];
		if (whitelistedQuery) {
			return queryName;
		}
		return null;
	}

	/**
	 * @returns boolean if the query is whitelisted
	 */
	public isQueryWhitelisted(queryDto: GraphQlQueryDto): boolean {
		// Find query in whitelist by looking for the first part. eg: "query getUserGroups"
		const queryName = this.getWhitelistedQueryName(queryDto.query, QueryOrigin.ADMIN_CORE);
		// if we found the name, the query is whitelisted
		return !!queryName;
	}

	/**
	 * @returns the whitelisted query for the given query
	 */
	public getWhitelistedQuery(query: string, origin: QueryOrigin): string {
		if (this.isWhitelistEnabled()) {
			const queryName = this.getWhitelistedQueryName(query, QueryOrigin.ADMIN_CORE);
			return this.whitelist[origin][queryName];
		}
		return query;
	}

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
