export const GET_USER_BY_IDENTITY_ID = `
	query getUserByIdentityId($identityId: uuid!) {
		users_profile(where: { identities: { id: { _eq: $identityId } } }) {
			id
			first_name
			last_name
			mail
			accepted_tos_at
		}
	}
`;

export const INSERT_USER = `
	mutation insertUser($newUser: users_profile_insert_input!) {
		insert_users_profile_one(object: $newUser) {
			id
			first_name
			last_name
			mail
			accepted_tos_at
		}
	}
`;

export const INSERT_USER_IDENTITY = `
	mutation insertUserIdentity($newUserIdentity: users_identity_insert_input!) {
		insert_users_identity_one(object: $newUserIdentity) {
			id
		}
	}
`;

export const UPDATE_USER = `
	mutation updateUserProfile($id: uuid!, $updateUser: users_profile_set_input!) {
		update_users_profile_by_pk(pk_columns: {id: $id}, _set: $updateUser) {
			id
			first_name
			last_name
			mail
			accepted_tos_at
		}
	}
`;

export const UPDATE_USER_TOS = `
	mutation updateUserProfile($id: uuid!, $updateUser: users_profile_set_input!) {
		update_users_profile_by_pk(pk_columns: {id: $id}, _set: $updateUser) {
			id
			accepted_tos_at
		}
	}
`;
