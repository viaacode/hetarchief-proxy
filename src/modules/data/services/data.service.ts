import * as fs from 'fs';

import {
	ForbiddenException,
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got, { Got } from 'got';
import { DocumentNode } from 'graphql';
import { print } from 'graphql/language/printer';

import { getConfig } from '~config';

import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { GraphQlResponse, QueryOrigin } from '../types';

import { DataPermissionsService } from './data-permissions.service';

import { User } from '~modules/users/types';

@Injectable()
export class DataService {
	private logger: Logger = new Logger(DataService.name, { timestamp: true });
	private gotInstance: Got;

	private whitelistEnabled: boolean;
	private whitelist: Partial<Record<QueryOrigin, Record<string, string>>> = {};

	constructor(
		private configService: ConfigService,
		@Inject(forwardRef(() => DataPermissionsService))
		private dataPermissionsService: DataPermissionsService
	) {
		if (configService.get('environment') !== 'production') {
			this.logger.log('GraphQl config: ', {
				url: getConfig(this.configService, 'graphQlUrl'),
				secret: getConfig(this.configService, 'graphQlSecret'),
				whitelistEnabled: getConfig(this.configService, 'graphQlEnableWhitelist'),
			});
		}
		this.gotInstance = got.extend({
			prefixUrl: getConfig(this.configService, 'graphQlUrl'),
			headers: {
				'x-hasura-admin-secret': getConfig(this.configService, 'graphQlSecret'),
			},
			resolveBodyOnly: true,
			responseType: 'json',
		});

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
				const whitelistFileContent = fs.existsSync(whitelistPath)
					? fs.readFileSync(whitelistPath, { encoding: 'utf-8' }).toString()
					: '{}';
				this.whitelist[whitelistKey] = {
					...(this.whitelist[whitelistKey] || {}),
					...JSON.parse(whitelistFileContent),
				};
			});
		});
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
		return this.dataPermissionsService.verify(
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

	/**
	 * Execute an incoming query from the client
	 * @param user
	 * @param queryDto the query to be executed
	 * @returns the query result
	 */
	public async executeClientQuery(
		user: User,
		queryDto: GraphQlQueryDto
	): Promise<GraphQlResponse> {
		// check if query can be executed
		if (!(await this.isAllowedToExecuteQuery(user, queryDto, QueryOrigin.ADMIN_CORE))) {
			const queryName = this.getQueryName(queryDto.query);
			throw new ForbiddenException(
				'You are not authorized to execute this query: ' + queryName
			);
		}
		return this.execute(
			this.getWhitelistedQuery(queryDto.query, QueryOrigin.ADMIN_CORE),
			queryDto.variables
		);
	}

	/**
	 * execute a (GraphQl) query
	 */
	public async execute<T>(
		query: string | DocumentNode,
		variables: { [varName: string]: any } = {}
	): Promise<GraphQlResponse<T>> {
		try {
			const queryData = {
				query: typeof query === 'string' ? query : print(query),
				variables,
			};
			const data = await this.gotInstance.post<GraphQlResponse>({
				json: queryData,
				resolveBodyOnly: true, // this is duplicate but fixes a typing error
			});
			if (data.errors) {
				this.logger.error(`GraphQl query failed: ${JSON.stringify(data.errors)}`);
				throw new InternalServerErrorException(data);
			}
			return data;
		} catch (err) {
			this.logger.error('Failed to get data from database', err.stack);
			throw new InternalServerErrorException();
		}
	}
}
