export const INSERT_VISIT = `
	mutation insertVisit($newVisit: cp_visit_insert_input!) {
		insert_cp_visit_one(object: $newVisit) {
			id
			cp_space_id
			user_profile_id
			user_reason
			user_timeframe
			status
			start_date
			end_date
			notes(order_by: { created_at: desc }, limit: 1) {
				id
				note
				profile {
					full_name
				}
				created_at
			}
			created_at
			updated_at
			user_profile {
				full_name
				mail
				id
			}
			updater {
				id
				full_name
			}
			space {
				schema_maintainer {
					schema_name
					information {
					  primary_site {
						address {
						  locality
						  postal_code
						  street
						}
					  }
					}
				}
			}
		}
	}
`;

export const UPDATE_VISIT = `
	mutation updateVisit($id: uuid!, $updateVisit: cp_visit_set_input!) {
		update_cp_visit_by_pk(pk_columns: { id: $id}, _set: $updateVisit) {
			id
			cp_space_id
			user_profile_id
			user_reason
			user_timeframe
			status
			start_date
			end_date
			notes(order_by: { created_at: desc }, limit: 1) {
				id
				note
				profile {
					full_name
				}
				created_at
			}
			created_at
			updated_at
			user_profile {
				full_name
				mail
				id
			}
			updater {
				id
				full_name
			}
			space {
				schema_maintainer {
					schema_name
					information {
					  primary_site {
						address {
						  locality
						  postal_code
						  street
						}
					  }
					}
				}
			}
		}
	}
`;

export const FIND_VISITS = `
	query visit($where: cp_visit_bool_exp, $offset: Int!, $limit: Int!, $orderBy: cp_visit_order_by! = {}) {
		cp_visit(where: $where, offset: $offset, limit: $limit, order_by: [$orderBy]) {
			id
			cp_space_id
			user_profile_id
			user_reason
			user_timeframe
			status
			start_date
			end_date
			notes(order_by: {created_at: desc}, limit: 1) {
				id
				note
				profile {
					full_name
				}
				created_at
			}
			created_at
			updated_at
			user_profile {
				full_name
				mail
				id
			}
			space {
				schema_maintainer {
					schema_name
					information {
					  primary_site {
						address {
						  locality
						  postal_code
						  street
						}
					  }
					}
				}
			}
			updater {
				id
				full_name
			}
		}
		cp_visit_aggregate(where: $where) {
			aggregate {
				count
			}
		}
	}
`;

export const FIND_VISIT_BY_ID = `
	query visit($id: uuid!) {
		cp_visit(where: { id:{ _eq: $id } }) {
			id
			cp_space_id
			user_profile_id
			user_reason
			user_timeframe
			status
			start_date
			end_date
			notes(order_by: { created_at: desc }, limit: 1) {
				id
				note
				profile {
					full_name
				}
				created_at
			}
			created_at
			updated_at
			user_profile {
				full_name
				mail
				id
			}
			updater {
				id
				full_name
			}
			space {
				schema_maintainer {
					schema_name
					information {
					  primary_site {
						address {
						  locality
						  postal_code
						  street
						}
					  }
					}
				}
			}
		}
	}
`;

export const INSERT_NOTE = `
	mutation insertNote($visitId: uuid!, $note: String, $userProfileId: uuid) {
		insert_cp_visit_note_one(object: { visit_id: $visitId, note: $note, profile_id: $userProfileId }) {
			id
		}
	}
`;

export const FIND_APPROVED_STARTED_VISITS_WITHOUT_NOTIFICATION = `
	query getApprovedAndStartedVisitsWithoutNotification($now: timestamp) {
		cp_visit(where: {status: {_eq: "APPROVED"}, start_date: {_lt: $now}, end_date: {_gt: $now}, _not: {notifications: {type: {_eq: "ACCESS_PERIOD_READING_ROOM_STARTED"}}}}) {
			id
			cp_space_id
			user_profile_id
			user_reason
			user_timeframe
			status
			start_date
			end_date
			created_at
			updated_at
			updater {
				id
				full_name
			}
			space {
				schema_maintainer {
					schema_name
					information {
					  primary_site {
						address {
						  locality
						  postal_code
						  street
						}
					  }
					}
				}
			}
		}
	}
`;

export const FIND_APPROVED_ALMOST_ENDED_VISITS_WITHOUT_NOTIFICATION = `
	query getApprovedAndEndedVisitsWithoutNotification($warningDate: timestamp, $now: timestamp) {
		cp_visit(where: {status: {_eq: "APPROVED"}, end_date: {_lt: $warningDate, _gt: $now}, _not: {notifications: {type: {_eq: "ACCESS_PERIOD_READING_ROOM_END_WARNING"}}}}) {
			id
			cp_space_id
			user_profile_id
			user_reason
			user_timeframe
			status
			start_date
			end_date
			created_at
			updated_at
			updater {
				id
				full_name
			}
			space {
				schema_maintainer {
					schema_name
					information {
					  primary_site {
						address {
						  locality
						  postal_code
						  street
						}
					  }
					}
				}
			}
		}
	}
`;

export const FIND_APPROVED_ENDED_VISITS_WITHOUT_NOTIFICATION = `
	query getApprovedAndEndedVisitsWithoutNotification($now: timestamp) {
		cp_visit(where: {status: {_eq: "APPROVED"}, end_date: {_lt: $now}, _not: {notifications: {type: {_eq: "ACCESS_PERIOD_READING_ROOM_ENDED"}}}}) {
			id
			cp_space_id
			user_profile_id
			user_reason
			user_timeframe
			status
			start_date
			end_date
			created_at
			updated_at
			updater {
				id
				full_name
			}
			space {
				schema_maintainer {
					schema_name
					information {
					  primary_site {
						address {
						  locality
						  postal_code
						  street
						}
					  }
					}
				}
			}
		}
	}
`;
