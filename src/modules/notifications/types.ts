export enum NotificationStatus {
	UNREAD = 'UNREAD',
	READ = 'READ',
}

export enum NotificationType {
	VISIT_REQUEST_APPROVED = 'VISIT_REQUEST_APPROVED',
	VISIT_REQUEST_DENIED = 'VISIT_REQUEST_DENIED',
	NEW_VISIT_REQUEST = 'NEW_VISIT_REQUEST',
	VISIT_REQUEST_CANCELLED = 'VISIT_REQUEST_CANCELLED',
	START_ACCESS_PERIOD_READING_ROOM = 'START_ACCESS_PERIOD_READING_ROOM',
}

export interface Notification {
	description: string;
	title: string;
	id: string;
	status: NotificationStatus;
	visitId: string;
	createdAt: string;
	updatedAt: string;
	type: NotificationType;
	readingRoomId: string;
}

export interface GqlNotification {
	description: string;
	title: string;
	id: string;
	status: NotificationStatus;
	recipient?: string;
	visit_id: string;
	created_at: string;
	updated_at: string;
	type: NotificationType;
	show_at: string;
	visit?: {
		cp_visit_id?: string;
	};
}

export interface GqlCreateOrUpdateNotification {
	description: string;
	title: string;
	status: NotificationStatus;
	recipient?: string;
	visit_id: string;
	created_at: string;
	updated_at: string;
	type: NotificationType;
	show_at: string;
}

export interface GqlCreateNotificationsForReadingRoom {
	description: string;
	title: string;
	status: NotificationStatus;
	visit_id: string;
	created_at: string;
	updated_at: string;
	type: NotificationType;
	show_at: string;
}
