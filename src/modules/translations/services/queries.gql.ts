export const GET_SITE_VARIABLES_BY_NAME = `
	query getSiteVariableByName($name: String!) {
		cms_site_variables(where: {name: {_eq: $name}}) {
			value
		}
	}
`;
