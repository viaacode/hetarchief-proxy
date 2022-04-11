import { Injectable, Logger } from '@nestjs/common';

import {
	GetSiteVariableByNameDocument,
	GetSiteVariableByNameQuery,
	UpdateSiteVariableByNameDocument,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';
import { UpdateResponse } from '~shared/types/types';

@Injectable()
export class SiteVariablesService {
	private logger: Logger = new Logger(SiteVariablesService.name, { timestamp: true });

	constructor(private dataService: DataService) {}

	public async getSiteVariable<T>(variable: string): Promise<T> {
		const {
			data: {
				app_config_by_pk: { value },
			},
		} = await this.dataService.execute<GetSiteVariableByNameQuery>(
			GetSiteVariableByNameDocument,
			{ name: variable }
		);

		return value;
	}

	public async updateSiteVariable(variable: string, value: any): Promise<UpdateResponse> {
		const {
			data: { update_cms_site_variables: response },
		} = await this.dataService.execute(UpdateSiteVariableByNameDocument, {
			name: variable,
			data: { value },
		});

		return response;
	}
}
