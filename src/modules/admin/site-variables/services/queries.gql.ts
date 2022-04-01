export const GET_SITE_VARIABLES_BY_NAME = `
	query getSiteVariableByName($name: String!) {
		cms_site_variables_by_pk(name: $name) {
			name
			value
		}
	}
`;

export const UPDATE_SITE_VARIABLE_BY_NAME = `
	mutation updateSiteVariableByName($name: String!, $data: cms_site_variables_set_input!) {
		update_cms_site_variables(where: {name: {_eq: $name}}, _set: $data) {
			affected_rows
		}
	}
`;
