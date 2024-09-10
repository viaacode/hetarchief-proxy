import {
	type GqlOrganisation,
	type Organisation,
	OrganisationContactPointType,
	type OrganisationInfoV2,
	type OrganisationResponse,
} from '../organisations.types';

import { IeObjectSector } from '~modules/ie-objects/ie-objects.types';

export const mockGqlOrganisation: GqlOrganisation = {
	id: 'https://data-int.hetarchief.be/id/organization/OR-rf5kf25',
	org_identifier: 'OR-rf5kf25',
	schemaContactPoint: [
		{
			schema_contact_type: OrganisationContactPointType.ontsluiting,
			schema_email: 'vrtarchief@vrt.be',
		},
	],
	ha_org_has_logo: 'https://assets.viaa.be/images/OR-rf5kf25',
	skos_alt_label: 'vrt',
	created_at: '2023-04-03T13:28:01.434203+02:00',
	updated_at: '2023-04-03T13:28:01.434203+02:00',
	skos_pref_label: 'VRT',
	dcterms_description:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	// Remark here organization is with Z
	ha_org_sector: IeObjectSector.PUBLIC,
	ha_org_request_form:
		'https://www.vrt.be/heb-je-een-vraag/s/contactsupport-vrtarchief?name_user={first_name}&mail_user={email}&local_id={local_cp_id}&viaa_id={pid}&surname_user={last_name}&title={title}&serie={title_serie}',
};

export const mockOrganisation1: Organisation = {
	schemaIdentifier: 'OR-rf5kf25',
	contactPoint: [
		{
			contactType: OrganisationContactPointType.ontsluiting,
			email: 'vrtarchief@vrt.be',
		},
	],
	description:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	logo: 'https://assets.viaa.be/images/OR-rf5kf25',
	slug: 'vrt',
	schemaName: 'VRT',
	createdAt: '2023-04-03T13:28:01.434203+02:00',
	updatedAt: '2023-04-03T13:28:01.434203+02:00',
	sector: IeObjectSector.PUBLIC,
	formUrl:
		'https://www.vrt.be/heb-je-een-vraag/s/contactsupport-vrtarchief?name_user={first_name}&mail_user={email}&local_id={local_cp_id}&viaa_id={pid}&surname_user={last_name}&title={title}&serie={title_serie}',
};

export const mockOrganisation2: Organisation = {
	schemaIdentifier: 'OR-w66976m',
	contactPoint: [
		{
			contactType: OrganisationContactPointType.ontsluiting,
			email: 'info@meemoo.be',
		},
	],
	description: 'Vlaams archief voor audio visuele archivering',
	logo: 'https://assets.viaa.be/images/OR-w66976m',
	slug: 'meemoo',
	schemaName: 'meemoo',
	createdAt: '2023-04-03T13:28:01.434203+02:00',
	updatedAt: '2023-04-03T13:28:01.434203+02:00',
	sector: IeObjectSector.CULTURE,
	formUrl: null,
};

export const mockOrganisationInfoV2: OrganisationInfoV2 = {
	id: 'OR-rf5kf25',
	label: 'VRT',
	description:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	sector: IeObjectSector.PUBLIC,
	form_url:
		'https://www.vrt.be/heb-je-een-vraag/s/contactsupport-vrtarchief?name_user={first_name}&mail_user={email}&local_id={local_cp_id}&viaa_id={pid}&surname_user={last_name}&title={title}&serie={title_serie}',
	homepage: 'https://www.vrt.be',
	logo: {
		iri: 'https://assets.viaa.be/images/OR-rf5kf25',
	},
	slug: 'vrt',
	overlay: true,
	contact_point: [
		{
			contact_type: OrganisationContactPointType.ontsluiting,
			telephone: '+32 2 741 37 20',
			email: 'vrtarchief@vrt.be',
		},
		{
			contact_type: OrganisationContactPointType.facturatie,
			telephone: null,
			email: null,
		},
	],
	primary_site: {
		address: null,
	},
};

export const getMockOrganisationResponse = (amount: number): OrganisationResponse => {
	const mockData = {
		data: {
			meemoo: [],
			contentPartners: [],
			educationalPartner: [],
			serviceProviders: [],
		},
	};
	for (let i = 0; i < amount; i++) {
		mockData.data.contentPartners.push(mockOrganisationInfoV2);
	}
	return mockData;
};

export const mockOrganisations: Organisation[] = [mockOrganisation1, mockOrganisation2];
