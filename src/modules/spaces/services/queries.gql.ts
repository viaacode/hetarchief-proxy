export const GET_SPACES = `
	query spaces($query: String!, $offset: Int!, $limit: Int!) {
		cp_space(where: {_or: [{schema_description: {_ilike: $query}}, {schema_maintainer: {schema_name: {_ilike: $query}}}]}, offset: $offset, limit: $limit) {
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
					homepage
					label
					description
					logo {
						iri
					}
					primary_site {
						address {
							contact_type
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
