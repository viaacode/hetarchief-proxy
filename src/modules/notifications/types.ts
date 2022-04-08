import {
	InsertNotificationsMutation,
	UpdateNotificationMutation,
} from '~generated/graphql-db-types-hetarchief';

export enum NotificationStatus {
	UNREAD = 'UNREAD',
	READ = 'READ',
}

export enum NotificationType {
	VISIT_REQUEST_APPROVED = 'VISIT_REQUEST_APPROVED',
	VISIT_REQUEST_DENIED = 'VISIT_REQUEST_DENIED',
	NEW_VISIT_REQUEST = 'NEW_VISIT_REQUEST',
	VISIT_REQUEST_CANCELLED = 'VISIT_REQUEST_CANCELLED',
	ACCESS_PERIOD_READING_ROOM_STARTED = 'ACCESS_PERIOD_READING_ROOM_STARTED',
	ACCESS_PERIOD_READING_ROOM_END_WARNING = 'ACCESS_PERIOD_READING_ROOM_END_WARNING',
	ACCESS_PERIOD_READING_ROOM_ENDED = 'ACCESS_PERIOD_READING_ROOM_ENDED',
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

export type GqlNotification =
	| UpdateNotificationMutation['update_app_notification']['returning'][0]
	| InsertNotificationsMutation['insert_app_notification']['returning'][0];
// {
// 	description: string;
// 	title: string;
// 	id: string;
// 	status: NotificationStatus;
// 	recipient?: string;
// 	visit_id: string;
// 	created_at: string;
// 	updated_at: string;
// 	type: NotificationType;
// 	visit?: {
// 		cp_visit_id?: string;
// 	};
// }

export interface GqlCreateOrUpdateNotification {
	description: string;
	title: string;
	status: NotificationStatus;
	recipient?: string;
	visit_id: string;
	created_at?: string;
	updated_at?: string;
	type: NotificationType;
}

export interface GqlCreateNotificationsForReadingRoom {
	description: string;
	title: string;
	status: NotificationStatus;
	visit_id: string;
	created_at?: string;
	updated_at?: string;
	type: NotificationType;
}
