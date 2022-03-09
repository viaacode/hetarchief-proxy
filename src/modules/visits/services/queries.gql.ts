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
			visit_notes(order_by: { created_at: desc }, limit: 1) {
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
				first_name
				last_name
				mail
				id
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
			visit_notes(order_by: { created_at: desc }, limit: 1) {
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
				first_name
				last_name
				mail
				id
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
			visit_notes(order_by: { created_at: desc }, limit: 1) {
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
				first_name
				last_name
				mail
				id
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
			visit_notes(order_by: { created_at: desc }, limit: 1) {
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
				first_name
				last_name
				mail
				id
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
