import { OrganisationContactPointType } from '~modules/organisations/organisations.types';
import type { GqlSpace } from '~modules/spaces/spaces.types';
import { AudienceType, VisitorSpaceStatus } from '~shared/types/types';

export const mockGqlSpace: GqlSpace = {
	id: '65790f8f-6365-4891-8ce2-4563f360db89',
	schema_image: null,
	schema_color: null,
	schema_audience_type: AudienceType.Private,
	schema_public_access: false,
	schema_description_nl: 'mijn-bezoekersruimte',
	schema_service_description_nl: 'service beschrijving',
	schema_description_en: 'my-space',
	schema_service_description_en: 'service description',
	status: VisitorSpaceStatus.Active,
	published_at: null,
	created_at: '2022-01-19T10:25:51.320763',
	updated_at: '2022-01-19T10:25:51.320763',
	organisation: {
		id: 'https://data-int.hetarchief.be/id/organization/OR-rf5kf25',
		skos_pref_label: 'VRT',
		org_identifier: 'OR-rf5kf25',
		schemaContactPoint: [
			{
				schema_contact_type: OrganisationContactPointType.ontsluiting,
				schema_email: 'test@email.be',
			},
		],
		dcterms_description:
			'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
		ha_org_has_logo: 'https://assets.viaa.be/images/OR-rf5kf25',
	},
};
