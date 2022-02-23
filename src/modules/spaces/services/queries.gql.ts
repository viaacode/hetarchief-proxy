export const FIND_SPACES = `
	query spaces($query: String!, $offset: Int!, $limit: Int!, $orderBy: cp_space_order_by!) {
		cp_space(where: {_or: [{schema_description: {_ilike: $query}}, {schema_maintainer: {schema_name: {_ilike: $query}}}]}, offset: $offset, limit: $limit, order_by: [$orderBy]) {
			id
			schema_image
			schema_color
			schema_audience_type
			schema_description
			schema_public_access
			schema_service_description
			is_published
			published_at
			created_at
			updated_at
			schema_maintainer {
				schema_name
				schema_identifier
				information {
					description
					logo {
						iri
					}
					primary_site {
						address {
							email
							locality
							postal_code
							street
							telephone
							post_office_box_number
						}
					}
				}
			}
		}
		cp_space_aggregate(where: {_or: [{schema_description: {_ilike: $query}}, {schema_maintainer: {schema_name: {_ilike: $query}}}]}) {
			aggregate {
				count
			}
		}
	}
`;

export const FIND_SPACE_BY_ID = `
	query spaces($id: uuid!) {
		cp_space(where: {id: {_eq: $id}}) {
			id
			schema_image
			schema_color
			schema_audience_type
			schema_description
			schema_public_access
			schema_service_description
			is_published
			published_at
			created_at
			updated_at
			schema_maintainer {
				schema_name
				schema_identifier
				information {
					description
					logo {
						iri
					}
					primary_site {
						address {
							email
							locality
							postal_code
							street
							telephone
							post_office_box_number
						}
					}
				}
			}
		}
	}
`;
