import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	Header,
	HttpCode,
	Post,
} from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiForbiddenResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';
import { HetArchiefIeObjectAccessThrough, HetArchiefIeObjectLicense } from '@viaa/avo2-types';
import { intersection } from 'lodash';

import { IeObjectAccessDebugDto } from '../dto/ie-objects.dto';
import {
	IeObjectAccessDebugErrorCode,
	type IeObjectAccessDebugResponse,
	type IeObjectAccessDebugViewer,
	buildIeObjectAccessReport,
} from '../helpers/build-ie-object-access-report';
import { limitAccessToObjectDetails } from '../helpers/limit-access-to-object-details';
import type { LimitAccessTrace } from '../helpers/limit-access-to-object-details.types';
import type { IeObject, IeObjectForAccessCheck } from '../ie-objects.types';
import { IeObjectsService } from '../services/ie-objects.service';

import { SessionUserEntity } from '~modules/users/classes/session-user';
import { UsersService } from '~modules/users/services/users.service';
import { GroupName } from '~modules/users/types';
import { Ip } from '~shared/decorators/ip.decorator';
import { Referer } from '~shared/decorators/referer.decorator';
import { SessionUser } from '~shared/decorators/user.decorator';

/**
 * Debug tool for meemoo admins (admin dashboard: /admin/objecten): explains why an ie-object is
 * (not) visible for a user and which fields they get to see, by running the same access check as
 * GET /ie-objects with a trace of each step of limitAccessToObjectDetails.
 */
@ApiTags('Ie Objects')
@Controller('ie-objects/debug')
export class IeObjectsDebugController {
	constructor(
		private ieObjectsService: IeObjectsService,
		private usersService: UsersService
	) {}

	@Post()
	@HttpCode(200)
	@Header('Cache-Control', 'no-store')
	@ApiOperation({
		summary:
			'Explains which licenses an ie-object has, what a user has access to and which fields are shown to that user. Only for meemoo admins.',
	})
	@ApiBody({ type: IeObjectAccessDebugDto })
	@ApiOkResponse({
		description:
			'The access report. errorCode is filled in when the user or the object could not be found',
	})
	@ApiBadRequestResponse({ description: 'schemaIdentifier is not a single PID' })
	@ApiForbiddenResponse({ description: 'The logged in user is not a meemoo admin' })
	public async getAccessDebugReport(
		@Body() body: IeObjectAccessDebugDto,
		@SessionUser() sessionUser: SessionUserEntity,
		@Referer() referer: string | null,
		@Ip() ip: string
	): Promise<IeObjectAccessDebugResponse> {
		if (sessionUser?.getGroupName() !== GroupName.MEEMOO_ADMIN) {
			throw new ForbiddenException('Only meemoo admins can use the ie-object access debugger');
		}

		// Only one object per report, to keep the report readable
		const schemaIdentifier = body.schemaIdentifier?.trim();
		if (!schemaIdentifier || !/^[a-zA-Z0-9]+$/.test(schemaIdentifier)) {
			throw new BadRequestException(
				'schemaIdentifier must be a single PID, containing only letters and numbers'
			);
		}

		// Check the access for the user with the given email, or else for the admin themselves
		let user: SessionUserEntity = sessionUser;
		let source: IeObjectAccessDebugViewer['source'] = 'session';
		const email = body.email?.trim();
		if (email) {
			const userByEmail = await this.usersService.getUserByEmail(email);
			if (!userByEmail) {
				return {
					viewer: null,
					report: null,
					errorCode: IeObjectAccessDebugErrorCode.USER_NOT_FOUND,
				};
			}
			user = new SessionUserEntity(userByEmail);
			source = 'email';
		} else if (body.anonymous) {
			user = new SessionUserEntity(null);
			source = 'anonymous';
		}

		const visitorSpaceAccessInfo =
			await this.ieObjectsService.getVisitorSpaceAccessInfoFromUser(user);
		const viewer: IeObjectAccessDebugViewer = {
			source,
			fullName: user.getId() ? user.getFullName() : null,
			email: user.getMail(),
			groupName: user.getGroupName() || GroupName.ANONYMOUS,
			organisationId: user.getOrganisationId(),
			organisationName: user.getOrganisationName(),
			sector: user.getSector(),
			isKeyUser: user.getIsKeyUser(),
			fullAccessVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
			folderAccessObjectIds: visitorSpaceAccessInfo.objectIds,
		};

		let ieObjectId: string;
		try {
			ieObjectId = await this.ieObjectsService.getIeObjectIdFromObjectSchemaIdentifier(
				schemaIdentifier,
				null
			);
		} catch (_err) {
			return { viewer, report: null, errorCode: IeObjectAccessDebugErrorCode.OBJECT_NOT_FOUND };
		}

		// Same steps as GET /ie-objects (IeObjectsController.getIeObjectsByIds), but keeping the trace
		const ieObject = (await this.ieObjectsService.findByIeObjectId(
			ieObjectId,
			true, // always resolve the thumbnail url, so the report shows the url the user would get
			referer,
			ip
		)) as Partial<IeObject> | null;
		if (!ieObject) {
			return { viewer, report: null, errorCode: IeObjectAccessDebugErrorCode.OBJECT_NOT_FOUND };
		}

		const trace: LimitAccessTrace = {};
		const limitedIeObject = limitAccessToObjectDetails(
			ieObject as IeObjectForAccessCheck,
			{
				userId: user.getId(),
				isKeyUser: user.getIsKeyUser(),
				sector: user.getSector(),
				groupId: user.getGroupId(),
				maintainerId: user.getOrganisationId(),
				accessibleObjectIdsThroughFolders: visitorSpaceAccessInfo.objectIds,
				accessibleVisitorSpaceIds: visitorSpaceAccessInfo.visitorSpaceIds,
			},
			trace
		);

		// Meemoo admin user always has VISITOR_SPACE_FULL in accessThrough when object has BEZOEKERTOOL licences
		let meemooAdminVisitorSpaceFullAdded = false;
		if (
			limitedIeObject &&
			user.getGroupName() === GroupName.MEEMOO_ADMIN &&
			visitorSpaceAccessInfo.visitorSpaceIds.includes(limitedIeObject.maintainerId) &&
			intersection(limitedIeObject.licenses, [
				HetArchiefIeObjectLicense.BEZOEKERTOOL_CONTENT,
				HetArchiefIeObjectLicense.BEZOEKERTOOL_METADATA_ALL,
			]).length > 0
		) {
			limitedIeObject.accessThrough.push(HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FULL);
			meemooAdminVisitorSpaceFullAdded = true;
		}

		return {
			viewer,
			report: buildIeObjectAccessReport(
				ieObject,
				limitedIeObject,
				trace,
				meemooAdminVisitorSpaceFullAdded
			),
			errorCode: null,
		};
	}
}
