export const FIND_NOTIFICATIONS_BY_USER = `
	query getNotificationsForUser($userProfileId: uuid, $moreRecentThan: timestamp, $offset: Int, $limit: Int) {
		app_notification(where: {_or: [{recipient: {_eq: $userProfileId}, show_at: {_gt: $moreRecentThan}, status: {_eq: "READ"}}, {recipient: {_eq: $userProfileId}, status: {_eq: "UNREAD"}}]}, order_by: {show_at: desc, status: desc, title: asc}, limit: $limit, offset: $offset) {
			id
			description
			title
			status
			type
			recipient
			visit_id
			show_at
			created_at
			updated_at
			visit {
				cp_space_id
			}
		}
		app_notification_aggregate(where: {_or: [{recipient: {_eq: $userProfileId}, show_at: {_gt: $moreRecentThan}, status: {_eq: "READ"}}, {recipient: {_eq: $userProfileId}, status: {_eq: "UNREAD"}}]}) {
			aggregate {
				count
			}
		}
	}
`;

export const INSERT_NOTIFICATION = `
	mutation insertNotification($object: app_notification_insert_input!) {
		insert_app_notification(objects: [$object]) {
			returning {
				id
				description
				title
				status
				type
				recipient
				visit_id
				show_at
				created_at
				updated_at
				visit {
					cp_space_id
				}
			}
		}
	}
`;

export const UPDATE_NOTIFICATION = `
	mutation updateNotification($notificationId: uuid, $userProfileId: uuid, $notification: app_notification_set_input) {
		update_app_notification(where: {id: {_eq: $notificationId}, recipient: {_eq: $userProfileId}}, _set: $notification) {
			returning {
				id
				description
				title
				status
				type
				recipient
				visit_id
				show_at
				created_at
				updated_at
				visit {
					cp_space_id
				}
			}
		}
	}
`;

export const UPDATE_ALL_NOTIFICATION_FOR_USER = `
	mutation updateNotification($userProfileId: uuid, $notification: app_notification_set_input) {
		update_app_notification(where: {recipient: {_eq: $userProfileId}}, _set: $notification) {
			affected_rows
		}
	}
`;
