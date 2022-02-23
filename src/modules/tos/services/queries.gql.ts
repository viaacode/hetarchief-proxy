export const GET_TOS_LAST_UPDATED_AT = `
	query getTosLastUpdatedAt {
		cms_site_variables(where: {name: {_eq: "TOS_LAST_UPDATED_AT"}}) {
			value
		}
	}
`;
