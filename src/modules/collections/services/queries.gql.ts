export const FIND_COLLECTIONS_BY_USER = `
	query getCollectionsForUser($userProfileId: uuid, $offset: Int, $limit: Int) {
		users_collection(where: {user_profile_id: {_eq: $userProfileId}}, order_by: {created_at: asc}, offset: $offset, limit: $limit) {
			id
			name
			user_profile_id
			is_default
			created_at
			updated_at
			ies {
				ie {
					schema_identifier
				}
			}
		}
		users_collection_aggregate(where: {user_profile_id: {_eq: $userProfileId}}) {
			aggregate {
				count
			}
		}
	}
`;

export const FIND_COLLECTION_BY_ID = `
	query getCollectionById($collectionId: uuid) {
		users_collection(where: {id: {_eq: $collectionId}}) {
			created_at
			id
			is_default
			name
			updated_at
			user_profile_id
		}
	}
`;

export const FIND_COLLECTION_OBJECTS_BY_COLLECTION_ID = `
	query getCollectionObjectsByCollectionId($collectionId: uuid, $userProfileId: uuid, $where: users_collection_ie_bool_exp!, $offset: Int, $limit: Int) {
		users_collection_ie(where: {_and: [{user_collection_id: {_eq: $collectionId}}, $where], collection: {user_profile_id: {_eq: $userProfileId}}}, offset: $offset, limit: $limit) {
			created_at
			ie {
				schema_name
				schema_creator
				schema_description
				dcterms_available
				schema_thumbnail_url
				dcterms_format
				schema_number_of_pages
				schema_identifier
			}
		}
		users_collection_ie_aggregate(where: {_and: [{user_collection_id: {_eq: $collectionId}}, $where]}) {
			aggregate {
				count
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

export const FIND_OBJECT_IN_COLLECTION = `
	query findObjectInCollection($collectionId: uuid, $objectSchemaIdentifier: String) {
		users_collection_ie(where: {user_collection_id: {_eq: $collectionId}, object_ie_schema_identifier: {_eq: $objectSchemaIdentifier}}) {
			ie {
				schema_name
				schema_creator
				dcterms_available
				schema_thumbnail_url
				dcterms_format
				schema_number_of_pages
				schema_identifier
				meemoo_fragment_id
			}
			created_at
		}
	}
`;

export const FIND_OBJECT_BY_FRAGMENT_IDENTIFIER = `
	query getObjectBySchemaIdentifier($objectSchemaIdentifier: String) {
		object_ie(where: {schema_identifier: {_eq: $objectSchemaIdentifier}}, limit: 1) {
			schema_name
			schema_creator
			dcterms_available
			schema_thumbnail_url
			dcterms_format
			schema_number_of_pages
			schema_identifier
			meemoo_fragment_id
		}
	}
`;

export const INSERT_OBJECT_INTO_COLLECTION = `
	mutation insertObjectIntoCollection($collectionId: uuid, $objectSchemaIdentifier: String, $objectMeemooFragmentId: String) {
		insert_users_collection_ie(objects: {user_collection_id: $collectionId, object_ie_schema_identifier: $objectSchemaIdentifier, object_ie_meemoo_fragment_id: $objectMeemooFragmentId}) {
			returning {
				created_at
				ie {
					dcterms_format
					dcterms_available
					schema_creator
					schema_description
					schema_name
					schema_maintainer_id
					schema_number_of_pages
					schema_identifier
				}
			}
		}
	}
`;

export const REMOVE_OBJECT_FROM_COLLECTION = `
	mutation removeObjectFromCollection($objectSchemaIdentifier: String, $collectionId: uuid, $userProfileId: uuid) {
		delete_users_collection_ie(where: {object_ie_schema_identifier: {_eq: $objectSchemaIdentifier}, user_collection_id: {_eq: $collectionId}, collection: {user_profile_id: {_eq: $userProfileId}}}) {
			affected_rows
		}
	}
`;
