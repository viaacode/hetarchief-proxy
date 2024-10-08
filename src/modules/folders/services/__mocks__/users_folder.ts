import { type GqlFolderWithIeObjects } from '~modules/folders/types';

export const mockGqlFolder: GqlFolderWithIeObjects = {
	id: '0018c1b6-97ae-435f-abef-31a2cde011fd',
	name: 'Favorieten',
	description: 'Mijn favoriete items',
	user_profile_id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	is_default: true,
	created_at: '2022-02-18T09:19:09.487977',
	updated_at: '2022-02-18T09:19:09.487977',
	intellectualEntities: [
		{
			created_at: '2022-02-19T09:19:09.487977',
			intellectualEntity: {
				schema_identifier:
					'5dc89b7e75e649e191cd86196c255147cd1a0796146d4255acfde239296fa534236bf4ccd04741f1a35b5240a69f758b',
				schema_name: 'CGSO. De mannenbeweging - mannenemancipatie - 1982',
			},
		},
	],
};
