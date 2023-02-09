import { AudienceType, VisitorSpaceStatus } from '~generated/database-aliases';
import { GqlVisit, GqlVisitWithNotes, VisitAccessType } from '~modules/visits/types';

export const mockCpVisit: GqlVisit = {
	id: '9471f49f-5ac0-43f5-a74a-09c4c56463a4',
	cp_space_id: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
	user_profile_id: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
	requested_by: {
		id: 'e1d792cc-4624-48cb-aab3-80ef90521b54',
		full_name: 'Ineke van Dams',
		first_name: 'Ineke',
		last_name: 'van Dams',
		mail: 'ineke.vandam@meemoo.be',
		collections: [
			{
				ies: [
					{
						ie_schema_identifier: '',
					},
				],
			},
		],
	},
	user_reason: 'voor mijn onderzoek en studie',
	user_timeframe: 'meteen',
	status: 'PENDING',
	access_type: VisitAccessType.Full,
	start_date: null,
	end_date: null,
	visitor_space_request_notes: [] as GqlVisitWithNotes['visitor_space_request_notes'],
	created_at: '2022-03-18T08:32:57.256264',
	updated_at: '2022-03-18T08:32:57.256264',
	visitor_space: {
		id: 'c3857d2a-a818-4bec-b420-2fe0275604ff',
		slug: 'bruzz',
		schema_maintainer_id: 'OR-d79593p',
		schema_image: null,
		schema_color: null,
		schema_audience_type: AudienceType.Private,
		schema_description: null,
		schema_public_access: false,
		schema_service_description: null,
		status: VisitorSpaceStatus.Requested,
		published_at: null,
		created_at: '2022-01-19T10:25:51.320763',
		updated_at: '2022-01-19T10:25:51.320763',
		content_partner: {
			schema_name: 'BRUZZ',
			schema_identifier: 'OR-d79593p',
			information: {
				contact_point: [
					{
						contact_type: 'ontsluiting',
						email: null,
					},
				],
				description:
					'BRUZZ is het mediamerk van de vzw Vlaams-Brusselse Media. BRUZZ manifesteert zich online, op radio en tv en in print als de referentie voor Brussel.',
				logo: {
					iri: 'https://assets.viaa.be/images/OR-d79593p',
				},
				primary_site: {
					address: {
						locality: 'Elsene',
						postal_code: '1050',
						street: 'Eugène Flageyplein 18',
					},
				},
			},
		},
	},
	last_updated_by: null,
};
