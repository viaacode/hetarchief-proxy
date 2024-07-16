import { type GqlCollectionWithObjects } from '~modules/collections/types';

export const mockGqlCollection: GqlCollectionWithObjects = {
	id: '0018c1b6-97ae-435f-abef-31a2cde011fd',
	name: 'Favorieten',
	description: 'Mijn favoriete items',
	user_profile_id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	is_default: true,
	created_at: '2022-02-18T09:19:09.487977',
	updated_at: '2022-02-18T09:19:09.487977',
	ies: [
		{
			created_at: '2022-02-19T09:19:09.487977',
			ie: {
				schema_identifier:
					'5dc89b7e75e649e191cd86196c255147cd1a0796146d4255acfde239296fa534236bf4ccd04741f1a35b5240a69f758b',
				meemoo_identifier: '8s4jm2514q',
				schema_name: 'CGSO. De mannenbeweging - mannenemancipatie - 1982',
			},
		},
	],
};
