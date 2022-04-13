export enum LogEventType {
	USER_AUTHENTICATE = 'be.hetarchief.bezoek.user.authenticate',
	ITEM_VIEW = 'be.hetarchief.bezoek.item.view',
	ITEM_PLAY = 'be.hetarchief.bezoek.item.play',
	ITEM_BOOKMARK = 'be.hetarchief.bezoek.item.bookmark',
	METADATA_EXPORT = 'be.hetarchief.bezoek.metadata.export',
	VISIT_REQUEST = 'be.hetarchief.bezoek.visit.request',
	VISIT_REQUEST_APPROVED = 'be.hetarchief.bezoek.visit.approve',
	VISIT_REQUEST_DENIED = 'be.hetarchief.bezoek.visit.disapprove',
	VISIT_REQUEST_USE = 'be.hetarchief.bezoek.visit.use', // TODO
	VISIT_REQUEST_CANCELLED_BY_VISITOR = 'be.hetarchief.bezoek.visit.cancel',
	VISIT_REQUEST_REVOKED = 'be.hetarchief.bezoek.visit.revoke', // TODO
	SEARCH = 'be.hetarchief.bezoek.search',
}

export interface LogEvent {
	id: string;
	type: LogEventType;
	source: string;
	subject: string;
	time: string; // timestamp
	data?: any;
}
