import path from 'path';

import {
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fse from 'fs-extra';
import got, { Got } from 'got';
import { keys } from 'lodash';

import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { GraphQlResponse, QueryOrigin } from '../types';

import { DataPermissionsService } from './data-permissions.service';

@Injectable()
export class DataService {
	private logger: Logger = new Logger(DataService.name, { timestamp: true });
	private gotInstance: Got;

	private whitelistEnabled: boolean;
	private whitelist: { [key in QueryOrigin]: { [queryName: string]: string } };

	constructor(
		private configService: ConfigService,
		private dataPermissionsService: DataPermissionsService
	) {
		if (process.env.NODE_ENV !== 'production') {
			this.logger.log('GraphQl config: ', {
				url: this.configService.get('graphQlUrl'),
				secret: this.configService.get('graphQlSecret'),
				whitelistEnabled: this.configService.get('graphQlEnableWhitelist'),
			});
		}
		this.gotInstance = got.extend({
			prefixUrl: this.configService.get('graphQlUrl'),
			headers: {
				'x-hasura-admin-secret': this.configService.get('graphQlSecret'),
			},
			resolveBodyOnly: true,
			responseType: 'json',
		});

		this.whitelistEnabled = this.configService.get('graphQlEnableWhitelist');

		const proxyWhitelistPath = path.join(__dirname, '../../../../scripts/proxy-whitelist.json');
		const clientWhitelistPath = path.join(
			__dirname,
			'../../../../scripts/client-whitelist.json'
		);

		this.whitelist = {
			[QueryOrigin.PROXY]: fse.existsSync(proxyWhitelistPath)
				? JSON.parse(fse.readFileSync(proxyWhitelistPath, { encoding: 'utf8' }))
				: {},
			[QueryOrigin.CLIENT]: fse.existsSync(clientWhitelistPath)
				? JSON.parse(fse.readFileSync(clientWhitelistPath, { encoding: 'utf8' }))
				: {},
		};
	}

	/**
	 * @returns if a query is allowed, by checking both whitlisting and query permissions
	 */
	public async isAllowedToExecuteQuery(
		queryDto: GraphQlQueryDto,
		origin: QueryOrigin
	): Promise<boolean> {
		if (this.isWhitelistEnabled() && !this.isQueryWhitelisted(queryDto, origin)) {
			return false;
		}
		return this.dataPermissionsService.verify(
			this.getWhitelistedQueryName(queryDto.query, origin),
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

	public getWhitelistedQueryName(query: string, origin: QueryOrigin): string {
		const queryStart = query.replace(/[\s]+/gm, ' ').split(/[{(]/)[0].trim();
		return keys(this.whitelist[origin]).find(
			(key) => this.whitelist[origin][key].split(/[{(]/)[0].trim() === queryStart
		);
	}

	/**
	 * @returns boolean if the query is whitelisted
	 */
	public isQueryWhitelisted(queryDto: GraphQlQueryDto, origin: QueryOrigin): boolean {
		// Find query in whitelist by looking for the first part. eg: "query getUserGroups"
		const queryName = this.getWhitelistedQueryName(queryDto.query, origin);
		// if we found the name, the query is whitelisted
		return !!queryName;
	}

	/**
	 * @returns the whitelisted query for the given query
	 */
	public getWhitelistedQuery(query: string, origin: QueryOrigin): string {
		if (this.isWhitelistEnabled()) {
			const queryName = this.getWhitelistedQueryName(query, origin);
			return this.whitelist[origin][queryName];
		}
		return query;
	}

	/**
	 * Execute an incoming query from the client
	 * @param queryDto the query to be executed
	 * @returns the query result
	 */
	public async executeClientQuery(queryDto: GraphQlQueryDto): Promise<GraphQlResponse> {
		// check if query can be executed
		if (!(await this.isAllowedToExecuteQuery(queryDto, QueryOrigin.CLIENT))) {
			throw new UnauthorizedException('You are not authorized to execute this query');
		}
		return this.execute(
			this.getWhitelistedQuery(queryDto.query, QueryOrigin.CLIENT),
			queryDto.variables
		);
	}

	/**
	 * execute a (GraphQl) query
	 */
	public async execute(
		query: string,
		variables: { [varName: string]: any } = {}
	): Promise<GraphQlResponse> {
		try {
			const queryData = {
				query,
				variables,
			};
			const data = await this.gotInstance.post<GraphQlResponse>({
				json: queryData,
				resolveBodyOnly: true, // this is duplicate but fixes a typing error
			});
			if (data.errors) {
				this.logger.error(`GraphQl query failed: ${JSON.stringify(data.errors)}`);
				throw new InternalServerErrorException();
			}
			return data;
		} catch (err) {
			this.logger.error('Failed to get data from database', err.stack);
			throw new InternalServerErrorException();
		}
	}
}
