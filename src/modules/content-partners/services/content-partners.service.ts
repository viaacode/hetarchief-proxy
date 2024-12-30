import { DataService } from '@meemoo/admin-core-api';
import { Injectable } from '@nestjs/common';
import { type IPagination, Pagination } from '@studiohyperdrive/pagination';

import { type ContentPartnersQueryDto } from '../dto/content-partners.dto';
import { type ContentPartner } from '../types';

import {
	FindContentPartnersDocument,
	type FindContentPartnersQuery,
	type FindContentPartnersQueryVariables,
	type Graph_Organization_Bool_Exp,
} from '~generated/graphql-db-types-hetarchief';

@Injectable()
export class ContentPartnersService {
	constructor(protected dataService: DataService) {}

	/**
	 * Adapt a content partner as returned by a graphQl response to our internal model
	 */
	public adapt(graphQlCp: FindContentPartnersQuery['graph_organization'][0]): ContentPartner {
		return {
			id: graphQlCp.org_identifier,
			name: graphQlCp.skos_pref_label,
		};
	}

	public async getContentPartners(
		inputQuery: ContentPartnersQueryDto
	): Promise<IPagination<ContentPartner>> {
		const andFilter: Graph_Organization_Bool_Exp[] = [];
		if (inputQuery.hasSpace === true) {
			andFilter.push({ visitorSpace: {} });
		} else if (inputQuery.hasSpace === false) {
			andFilter.push({ _not: { visitorSpace: {} } });
		}

		if (inputQuery.orIds?.length > 0) {
			andFilter.push({ org_identifier: { _in: inputQuery.orIds } });
		}

		const contentPartners = await this.dataService.execute<
			FindContentPartnersQuery,
			FindContentPartnersQueryVariables
		>(FindContentPartnersDocument, {
			where: { _and: andFilter },
		});

		return Pagination<ContentPartner>({
			items: contentPartners.graph_organization.map((cp) => this.adapt(cp)),
			page: 1,
			size: contentPartners.graph_organization_aggregate.aggregate.count,
			total: contentPartners.graph_organization_aggregate.aggregate.count,
		});
	}
}
