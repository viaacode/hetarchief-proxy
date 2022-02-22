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
	query visit($query: String!, $offset: Int!, $limit: Int!, $statuses: [String!] = [], $orderBy: cp_visit_order_by! = {}) {
		cp_visit(offset: $offset, limit: $limit, where: {_or: [{user_profile: {first_name: {_ilike: $query}}}, {user_profile: {last_name: {_ilike: $query}}}, {user_profile: {mail: {_ilike: $query}}}], status: {_in: $statuses}}, order_by: [$orderBy]) {
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
			user_profile {
				first_name
				last_name
				mail
				id
			}
		}
		cp_visit_aggregate(where: {_or: [{user_profile: {first_name: {_ilike: $query}}}, {user_profile: {last_name: {_ilike: $query}}}, {user_profile: {mail: {_ilike: $query}}}], status: {_in: $statuses}}) {
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
			user_profile {
				first_name
				last_name
				mail
				id
			}
		}
	}
`;

export const UPDATE_VISIT_BY_ID = `
	mutation updateVisit($id: uuid!, $updateVisit: cp_visit_set_input!) {
		update_cp_visit_by_pk(pk_columns: {id: $id}, _set: $updateVisit) {
			cp_space_id
			created_at
			end_date
			id
			start_date
			status
			updated_at
			user_reason
			user_timeframe
		}
	}
`;
