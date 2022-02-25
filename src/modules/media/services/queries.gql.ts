export const GET_OBJECT_IE_PLAY_INFO_BY_ID = `
	query playableUrl($id: String!) {
		object_ie_by_pk(schema_identifier: $id) {
		schema_identifier
		schema_embed_url
		}
	}
`;
