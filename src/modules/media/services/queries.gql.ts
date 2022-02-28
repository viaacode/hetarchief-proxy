export const GET_OBJECT_IE_PLAY_INFO_BY_ID = `
	query playableUrl($id: String!) {
		object_ie_by_pk(schema_identifier: $id) {
		schema_identifier
		schema_embed_url
		}
	}
`;

export const GET_OBJECT_IE_BY_ID = `
	query objectDetail($id: String!) {
		object_ie_by_pk(schema_identifier: $id) {
			schema_identifier
			premis_identifier
			premis_relationship
			schema_is_part_of
			schema_part_of_archive
			schema_part_of_episode
			schema_part_of_season
			schema_part_of_series
			schema_maintainer {
				id
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
			schema_copyright_holder
			schema_copyright_notice
			schema_duration_in_seconds
			schema_number_of_pages
			schema_date_published
			dcterms_available
			schema_name
			schema_description
			schema_abstract
			schema_creator
			schema_actor
			schema_contributor
			schema_publisher
			schema_spatial
			schema_temporal
			schema_keywords
			schema_genre
			dcterms_format
			schema_in_language
			schema_thumbnail_url
			schema_embed_url
			schema_alternate_name
			schema_duration
			schema_license
			meemoo_fragment_id
			meemoo_media_object_id
			schema_date_created
			schema_date_created_lower_bound
		}
  	}
`;
