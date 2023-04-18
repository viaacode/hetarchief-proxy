import { DataService } from '@meemoo/admin-core-api';
import { Injectable, Logger } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';

import { ContentPartnersQueryDto } from '../dto/content-partners.dto';
import { ContentPartner } from '../types';

import {
	FindContentPartnersDocument,
	FindContentPartnersQuery,
	FindContentPartnersQueryVariables,
} from '~generated/graphql-db-types-hetarchief';

@Injectable()
export class ContentPartnersService {
	private logger: Logger = new Logger(ContentPartnersService.name, { timestamp: true });

	constructor(protected dataService: DataService) {}

	/**
	 * Adapt a content partner as returned by a graphQl response to our internal model
	 */
	public adapt(
		graphQlCp: FindContentPartnersQuery['maintainer_content_partner'][0]
	): ContentPartner {
		return {
			id: graphQlCp.schema_identifier,
			name: graphQlCp.schema_name,
		};
	}

	public async getContentPartners(
		inputQuery: ContentPartnersQueryDto
	): Promise<IPagination<ContentPartner>> {
		const andFilter = [];
		if (inputQuery.hasSpace === true) {
			andFilter.push({ visitor_space: {} });
		} else if (inputQuery.hasSpace === false) {
			andFilter.push({ _not: { visitor_space: {} } });
		}

		if (inputQuery.orIds?.length > 0) {
			andFilter.push({ schema_identifier: { _in: inputQuery.orIds } });
		}

		const contentPartners = await this.dataService.execute<
			FindContentPartnersQuery,
			FindContentPartnersQueryVariables
		>(FindContentPartnersDocument, {
			where: { _and: andFilter },
		});

		return Pagination<ContentPartner>({
			items: contentPartners.maintainer_content_partner.map((cp) => this.adapt(cp)),
			page: 1,
			size: contentPartners.maintainer_content_partner_aggregate.aggregate.count,
			total: contentPartners.maintainer_content_partner_aggregate.aggregate.count,
		});
	}
}
