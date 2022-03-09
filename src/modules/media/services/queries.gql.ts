export const GET_FILE_BY_REPRESENTATION_ID = `
	query getFileByRepresentationId($id: String) {
		object_file(where: {representation_id: {_eq: $id } }) {
			id
			schema_name
			schema_alternate_name
			schema_description
			representation_id
			ebucore_media_type
			ebucore_is_media_fragment_of
			schema_embed_url
		}
	}
`;

export const GET_OBJECT_IE_BY_ID = `
	query objectDetail($id: String!) {
		object_ie(where: { schema_identifier: { _eq: $id } }) {
			meemoo_fragment_id
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
			dcterms_format
			schema_in_language
			schema_thumbnail_url
			schema_embed_url
			schema_alternate_name
			schema_duration
			schema_license
			meemoo_media_object_id
			schema_date_created
			schema_date_created_lower_bound
			ebucore_object_type
			schema_genre
			premis_is_represented_by {
				schema_name
				schema_alternate_name
				schema_description
				ie_meemoo_fragment_id
				dcterms_format
				schema_transcript
				schema_date_created
				id
				premis_includes {
					id
					schema_name
					schema_alternate_name
					schema_description
					representation_id
					ebucore_media_type
					ebucore_is_media_fragment_of
					schema_embed_url
				}
			}
		}
  	}
`;
