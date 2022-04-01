import { Injectable, Logger } from '@nestjs/common';

import { SiteVariable } from '../types';

import { GET_SITE_VARIABLES_BY_NAME, UPDATE_SITE_VARIABLE_BY_NAME } from './queries.gql';

import { DataService } from '~modules/data/services/data.service';
import { UpdateResponse } from '~shared/types/types';

@Injectable()
export class SiteVariablesService {
	private logger: Logger = new Logger(SiteVariablesService.name, { timestamp: true });

	constructor(private dataService: DataService) {}

	public async getSiteVariable(variable: string): Promise<SiteVariable> {
		const {
			data: { cms_site_variables_by_pk: value },
		} = await this.dataService.execute(GET_SITE_VARIABLES_BY_NAME, { name: variable });

		return value;
	}

	public async updateSiteVariable(variable: string, value: any): Promise<UpdateResponse> {
		const {
			data: { update_cms_site_variables: response },
		} = await this.dataService.execute(UPDATE_SITE_VARIABLE_BY_NAME, {
			name: variable,
			data: { value },
		});

		return response;
	}
}
