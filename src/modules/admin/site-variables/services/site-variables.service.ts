import { Injectable, Logger } from '@nestjs/common';

import {
	GetSiteVariableByNameDocument,
	GetSiteVariableByNameQuery,
	UpdateSiteVariableByNameDocument,
	UpdateSiteVariableByNameMutation,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';
import { UpdateResponse } from '~shared/types/types';

@Injectable()
export class SiteVariablesService {
	private logger: Logger = new Logger(SiteVariablesService.name, { timestamp: true });

	constructor(private dataService: DataService) {}

	public async getSiteVariable<T>(variable: string): Promise<T> {
		const response = await this.dataService.execute<GetSiteVariableByNameQuery>(
			GetSiteVariableByNameDocument,
			{ name: variable }
		);

		/* istanbul ignore next */
		return response?.data?.app_config_by_pk?.value;
	}

	public async updateSiteVariable(variable: string, value: any): Promise<UpdateResponse> {
		const response = await this.dataService.execute<UpdateSiteVariableByNameMutation>(
			UpdateSiteVariableByNameDocument,
			{
				name: variable,
				data: { value },
			}
		);

		/* istanbul ignore next */
		return {
			affectedRows: response?.data?.update_app_config?.affected_rows,
		};
	}
}
