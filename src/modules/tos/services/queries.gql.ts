export const GET_TOS_LAST_UPDATED_AT = `
	query getTosLastUpdatedAt {
		cms_site_variables_by_pk(name: "TOS_LAST_UPDATED_AT") {
			value
		}
	}
`;
