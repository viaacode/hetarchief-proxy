import {
	GqlNotification,
	NotificationStatus,
	NotificationType,
} from '~modules/notifications/types';

export const mockGqlNotification: GqlNotification = {
	id: 'b925aca7-2e57-4f8e-a46b-13625c512fc2',
	description:
		'Je bezoek aanvraag aan de leeszaal van Gents museum is goedgekeurd, je hebt toegang van 12:00 to 16:00 op 17 feb 2022',
	title: 'Je bezoek aanvraag is goedgekeurd',
	status: NotificationStatus.UNREAD,
	notification_type: NotificationType.VISIT_REQUEST_APPROVED,
	recipient: 'df8024f9-ebdc-4f45-8390-72980a3f29f6',
	visit_id: '0fb12a25-a882-42f7-9c79-9d77839c7237',
	show_at: '2022-02-28T17:29:53.478639',
	created_at: '2022-02-28T17:21:58.937169+00:00',
	updated_at: '2022-02-28T17:21:58.937169',
};
