export const INSERT_VISIT = `
	mutation insertVisit($newVisit: cp_visit_insert_input!) {
		insert_cp_visit_one(object: $newVisit) {
			id
			cp_space_id
			user_profile_id
			user_reason
			user_timeframe
			user_accepted_tos
			status
			start_date
			end_date
			created_at
			updated_at
		}
	}
`;

export const FIND_VISITS = `
	query visit($offset: Int!, $limit: Int!) {
		cp_visit( offset: $offset, limit: $limit) {
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
		}
		cp_visit_aggregate {
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
			created_at
			updated_at
		}
	}
`;
