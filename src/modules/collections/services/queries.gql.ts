export const FIND_COLLECTIONS_BY_USER = `
	query getCollectionsForUser($userProfileId: uuid) {
		users_collection(where: {user_profile_id: {_eq: $userProfileId}}, order_by: {created_at: asc}) {
			id
			name
			created_at
			updated_at
			is_default
		}
	}
`;

export const FIND_COLLECTION_BY_ID = `
	query getCollectionsById($collectionId: uuid) {
		users_collection(where: {id: {_eq: $collectionId}}) {
			id
			name
			created_at
			updated_at
			is_default
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
