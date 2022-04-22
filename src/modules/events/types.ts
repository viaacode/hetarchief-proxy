export enum LogEventType {
	USER_AUTHENTICATE = 'be.hetarchief.bezoek.user.authenticate',
	ITEM_VIEW = 'be.hetarchief.bezoek.item.view', // Triggered in client
	ITEM_PLAY = 'be.hetarchief.bezoek.item.play', // Triggered in client
	ITEM_BOOKMARK = 'be.hetarchief.bezoek.item.bookmark',
	METADATA_EXPORT = 'be.hetarchief.bezoek.metadata.export',
	VISIT_REQUEST = 'be.hetarchief.bezoek.visit.request',
	VISIT_REQUEST_APPROVED = 'be.hetarchief.bezoek.visit.approve',
	VISIT_REQUEST_DENIED = 'be.hetarchief.bezoek.visit.disapprove',
	VISIT_REQUEST_CANCELLED_BY_VISITOR = 'be.hetarchief.bezoek.visit.cancel',
	VISIT_REQUEST_REVOKED = 'be.hetarchief.bezoek.visit.revoke',
	SEARCH = 'be.hetarchief.bezoek.search', // Triggered in client
}

export interface LogEvent {
	id: string;
	type: LogEventType;
	source: string;
	subject: string;
	time: string; // timestamp
	data?: Record<string, unknown>;
}
