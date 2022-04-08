import { Lookup_Schema_Audience_Type_Enum } from '~generated/graphql-db-types-hetarchief';
import { GqlVisit } from '~modules/visits/types';

export const mockCpVisit: GqlVisit = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	cp_space_id: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
	user_profile_id: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	user_profile: {
		id: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
		full_name: 'Ineke van Dams',
		first_name: 'Ineke',
		last_name: 'van Dams',
		mail: 'ineke.vandam@meemoo.be',
	},
	user_reason: 'voor mijn onderzoek en studie',
	user_timeframe: 'meteen',
	status: 'PENDING',
	start_date: null,
	end_date: null,
	notes: [],
	created_at: '2022-03-18T08:32:57.256264',
	updated_at: '2022-03-18T08:32:57.256264',
	space: {
		id: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		schema_image: null,
		schema_color: null,
		schema_audience_type: Lookup_Schema_Audience_Type_Enum.Private,
		schema_description: null,
		schema_public_access: false,
		schema_service_description: null,
		is_published: false,
		published_at: null,
		created_at: '2022-01-19T10:25:51.320763',
		updated_at: '2022-01-19T10:25:51.320763',
		schema_maintainer: {
			schema_name: 'BRUZZ',
			schema_identifier: 'OR-d79593p',
			information: [
				{
					description:
						'BRUZZ is het mediamerk van de vzw Vlaams-Brusselse Media. BRUZZ manifesteert zich online, op radio en tv en in print als de referentie voor Brussel.',
					logo: {
						iri: 'https://assets.viaa.be/images/OR-d79593p',
					},
					primary_site: {
						address: {
							email: null,
							locality: 'Elsene',
							postal_code: '1050',
							street: 'Eugène Flageyplein 18',
							telephone: null,
							post_office_box_number: null,
						},
					},
				},
			],
		},
	},
	updater: null,
};
