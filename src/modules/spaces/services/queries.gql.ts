export const GET_USER_BY_IDENTITY_ID = `
	query getUserByIdentityId($identityId: uuid!) {
		users_profile(where: { identities: { id: { _eq: $identityId } } }) {
			id
			firstName: first_name
			lastName: last_name
			email: mail
		}
	}
`;
