import { Body, Controller, Get, Headers, Logger, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IeObjectMeemooIdentifiersQueryDto, IeObjectsQueryDto } from '../dto/ie-objects.dto';
import { checkAndFixFormatFilter } from '../helpers/check-and-fix-format-filter';
import { getVisitorSpaceAccessInfo } from '../helpers/get-visitor-space-access-info';
import { limitAccessToObjectDetails } from '../helpers/limit-access-to-object-details';
import { IeObjectsWithAggregations } from '../ie-objects.types';
import { IeObjectsService } from '../services/ie-objects.service';

import { Lookup_Maintainer_Visitor_Space_Status_Enum as VisitorSpaceStatus } from '~generated/graphql-db-types-hetarchief';
import { Organisation } from '~modules/organisations/organisations.types';
import { OrganisationsService } from '~modules/organisations/services/organisations.service';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { Group } from '~modules/users/types';
import { VisitsService } from '~modules/visits/services/visits.service';
import { VisitStatus, VisitTimeframe } from '~modules/visits/types';
import { SessionUser } from '~shared/decorators/user.decorator';

@ApiTags('Ie Objects')
@Controller('ie-objects')
export class IeObjectsController {
	private logger: Logger = new Logger(IeObjectsController.name, { timestamp: true });

	constructor(
		private ieObjectsService: IeObjectsService,
		private visitsService: VisitsService,
		private organisationService: OrganisationsService
	) {}

	@Get('related/count')
	public async countRelated(
		@Query() countRelatedQuery: IeObjectMeemooIdentifiersQueryDto
	): Promise<Record<string, number>> {
		return this.ieObjectsService.countRelated(countRelatedQuery.meemooIdentifiers);
	}

	@Post()
	public async getIeObjects(
		@Headers('referer') referer: string,
		@Body() queryDto: IeObjectsQueryDto,
		@SessionUser() user: SessionUserEntity
	): Promise<IeObjectsWithAggregations> {
		// Filter on format video should also include film format
		checkAndFixFormatFilter(queryDto);

		// Get sector from Organisation when user is part of CP_ADMIN Group
		// TODO: It might be useful to also select sector when the user is first logged in,
		//		so the sector is always available on the session user object.
		//		/src/modules/auth/controllers/het-archief.controller.ts#L128-L130
		let organisation: Organisation = null;
		if (user.getGroupId() === Group.CP_ADMIN) {
			organisation = await this.organisationService.findOrganisationBySchemaIdentifier(
				user.getMaintainerId()
			);
		}

		// Get active visits for the current user
		// Need this to retrieve visitorSpaceAccessInfo
		const activeVisits = await this.visitsService.findAll(
			{
				page: 1,
				size: 100,
				timeframe: VisitTimeframe.ACTIVE,
				status: VisitStatus.APPROVED,
			},
			{
				userProfileId: user.getId(),
				visitorSpaceStatus: VisitorSpaceStatus.Active,
			}
		);
		const visitorSpaceAccessInfo = getVisitorSpaceAccessInfo(activeVisits.items);

		// Get elastic search result based on given parameters
		const searchResult = await this.ieObjectsService.findAll(
			queryDto,
			'_all',
			referer,
			user,
			visitorSpaceAccessInfo,
			organisation?.sector || null
		);

		// Limit the amount of props returned for an ie object based on licenses and sector
		const licensedSearchResult = {
			...searchResult,
			items: searchResult.items.map((item) =>
				limitAccessToObjectDetails(item, {
					userId: user.getId() || null,
					isKeyUser: user.getIsKeyUser() || false,
					sector: organisation?.sector || null,
					groupId: user.getGroupId() || null,
					maintainerId: user.getMaintainerId() || null,
					accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
					accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
				})
			),
		};

		return licensedSearchResult;
	}
}
