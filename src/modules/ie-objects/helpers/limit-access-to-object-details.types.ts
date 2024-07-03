import { type IeObjectSector } from '~modules/ie-objects/ie-objects.types';

export interface LimitAccessUserInfo {
	userId: string | null;
	isKeyUser: boolean;
	sector: IeObjectSector | null;
	groupId: string;
	maintainerId: string;
	// folders -> if ie object id is in here then the user has folder access to this visitor space
	accessibleObjectIdsThroughFolders: string[];
	// May only contain FULL ACCESS Visitor space ids
	// full -> if object.maintainerId is in this list than the user has full access to visitor space
	accessibleVisitorSpaceIds: string[];
}
