import { Injectable, Logger } from '@nestjs/common';
import { IPagination, Pagination } from '@studiohyperdrive/pagination';

import { ContentPartnersQueryDto } from '../dto/content-partners.dto';
import { ContentPartner } from '../types';

import {
	FindContentPartnersDocument,
	FindContentPartnersQuery,
} from '~generated/graphql-db-types-hetarchief';
import { DataService } from '~modules/data/services/data.service';

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
		let where = {};
		if (inputQuery.hasSpace === true) {
			where = { visitor_space: {} };
		} else if (inputQuery.hasSpace === false) {
			where = { _not: { visitor_space: {} } };
		}

		const contentPartners = await this.dataService.execute<FindContentPartnersQuery>(
			FindContentPartnersDocument,
			{
				where,
			}
		);

		return Pagination<ContentPartner>({
			items: contentPartners.data.maintainer_content_partner.map((cp) => this.adapt(cp)),
			page: 1,
			size: contentPartners.data.maintainer_content_partner_aggregate.aggregate.count,
			total: contentPartners.data.maintainer_content_partner_aggregate.aggregate.count,
		});
	}
}
