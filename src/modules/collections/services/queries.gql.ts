export const FIND_COLLECTIONS_BY_USER = `
	query getCollectionsForUser($userProfileId: uuid, $offset: Int, $limit: Int) {
		users_collection(where: {user_profile_id: {_eq: $userProfileId}}, order_by: {created_at: asc}, offset: $offset, limit: $limit) {
			id
			name
			user_profile_id
			is_default
			created_at
			updated_at
		}
		users_collection_aggregate(where: {user_profile_id: {_eq: $userProfileId}}) {
			aggregate {
				count
			}
		}
	}
`;

export const FIND_COLLECTION_BY_ID = `
	query getCollectionsById($collectionId: uuid) {
		users_collection(where: {id: {_eq: $collectionId}}) {
			id
			name
			user_profile_id
			is_default
			created_at
			updated_at
			ies {
				created_at
				intellectual_entity {
					schema_name
					schema_creator
					dcterms_available
					schema_thumbnail_url
					dcterms_format
					schema_number_of_pages
					schema_maintainer {
						label
					}
				}
			}
		}
	}
`;

export const INSERT_COLLECTION = `
	mutation insertCollection($object: users_collection_insert_input!) {
		insert_users_collection(objects: [$object]) {
			returning {
				id
				name
				user_profile_id
				is_default
				created_at
				updated_at
			}
		}
	}
`;

export const UPDATE_COLLECTION = `
	mutation updateCollection($collectionId: uuid, $userProfileId: uuid, $collection: users_collection_set_input) {
		update_users_collection(where: {id: {_eq: $collectionId}, user_profile_id: {_eq: $userProfileId}}, _set: $collection) {
			returning {
				id
				name
				user_profile_id
				is_default
				created_at
				updated_at
			}
		}
	}
`;

export const DELETE_COLLECTION = `
	mutation insertCollection($collectionId: uuid, $userProfileId: uuid) {
		delete_users_collection(where: {id: {_eq: $collectionId}, user_profile_id: {_eq: $userProfileId}}) {
			affected_rows
		}
	}
`;
