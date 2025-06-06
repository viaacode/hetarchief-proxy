import { randomUUID } from 'node:crypto';

import { addYears } from 'date-fns';

import { Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum } from '~generated/graphql-db-types-hetarchief';
import type { VisitorSpace } from '~modules/spaces/spaces.types';
import { SessionUserEntity } from '~modules/users/classes/session-user';
import { type VisitRequest, VisitStatus } from '~modules/visits/types';

export function getFakeVisitorRequest(user: SessionUserEntity, space: VisitorSpace): VisitRequest {
	return {
		id: `permanent-id--${randomUUID()}`,
		status: VisitStatus.APPROVED,
		endAt: addYears(new Date(), 100).toISOString(),
		startAt: new Date(2000, 1, 1).toISOString(),
		visitorFirstName: user.getFirstName(),
		visitorLastName: user.getLastName(),
		visitorName: user.getFullName(),
		visitorLanguage: user.getLanguage(),
		updatedByName: null,
		createdAt: new Date().toISOString(),
		spaceName: space.name,
		spaceMail: space.contactInfo.email,
		spaceId: space.id,
		spaceTelephone: space.contactInfo.telephone,
		spaceLogo: space.logo,
		spaceColor: space.color,
		spaceImage: space.image,
		reason: null,
		spaceMaintainerId: space.maintainerId,
		spaceSlug: space.slug,
		accessType: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum.Full,
		updatedById: null,
		timeframe: null,
		userProfileId: user.getId(),
		visitorId: user.getId(),
		updatedAt: new Date().toISOString(),
		visitorMail: user.getMail(),
	};
}
