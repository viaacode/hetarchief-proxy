import {
	GqlOrganisation,
	Organisation,
	OrganisationInfoV2,
	OrganisationResponse,
} from '../organisations.types';

import { IeSector } from '~modules/ie-objects/ie-objects.types';

export const mockGqlOrganisation: GqlOrganisation = {
	schema_identifier: 'OR-rf5kf25',
	contact_point: [
		{
			contact_type: 'ontsluiting',
			email: 'vrtarchief@vrt.be',
		},
	],
	logo: {
		iri: 'https://assets.viaa.be/images/OR-rf5kf25',
	},
	primary_site: {
		address: {
			locality: 'Brussel',
			postal_code: '1043',
			street: 'Auguste Reyerslaan 52 B,',
			telephone: '+32 2 741 37 20',
			post_office_box_number: '2',
		},
	},
	created_at: '2023-04-03T13:28:01.434203+02:00',
	updated_at: '2023-04-03T13:28:01.434203+02:00',
	schema_name: 'VRT',
	description:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	// Remark here organization is with Z
	haorg_organization_type: IeSector.PUBLIC,
	form_url:
		'https://www.vrt.be/heb-je-een-vraag/s/contactsupport-vrtarchief?name_user={first_name}&mail_user={email}&local_id={local_cp_id}&viaa_id={pid}&surname_user={last_name}&title={title}&serie={title_serie}',
};

export const mockOrganisation1: Organisation = {
	schemaIdentifier: 'OR-rf5kf25',
	contactPoint: [
		{
			contactType: 'ontsluiting',
			email: 'vrtarchief@vrt.be',
		},
	],
	description:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	logo: {
		iri: 'https://assets.viaa.be/images/OR-rf5kf25',
	},
	primarySite: {
		address: {
			locality: 'Brussel',
			postal_code: '1043',
			street: 'Auguste Reyerslaan 52 B,',
			telephone: '+32 2 741 37 20',
			post_office_box_number: '2',
		},
	},
	schemaName: 'VRT',
	createdAt: '2023-04-03T13:28:01.434203+02:00',
	updatedAt: '2023-04-03T13:28:01.434203+02:00',
	sector: IeSector.PUBLIC,
	formUrl:
		'https://www.vrt.be/heb-je-een-vraag/s/contactsupport-vrtarchief?name_user={first_name}&mail_user={email}&local_id={local_cp_id}&viaa_id={pid}&surname_user={last_name}&title={title}&serie={title_serie}',
};

export const mockOrganisation2: Organisation = {
	schemaIdentifier: 'OR-w66976m',
	contactPoint: [
		{
			contactType: 'ontsluiting',
			email: 'info@meemoo.be',
		},
	],
	description: 'Vlaams archief voor audio visuele archivering',
	logo: {
		iri: 'https://assets.viaa.be/images/OR-w66976m',
	},
	primarySite: {
		address: {
			locality: 'Gent',
			postal_code: '9000',
			street: 'Ham 1',
			telephone: '+32 2 741 37 23',
			post_office_box_number: '5',
		},
	},
	schemaName: 'meemoo',
	createdAt: '2023-04-03T13:28:01.434203+02:00',
	updatedAt: '2023-04-03T13:28:01.434203+02:00',
	sector: IeSector.CULTURE,
	formUrl: null,
};

export const mockOrganisationInfoV2: OrganisationInfoV2 = {
	id: 'OR-rf5kf25',
	label: 'VRT',
	description:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	sector: IeSector.PUBLIC,
	form_url:
		'https://www.vrt.be/heb-je-een-vraag/s/contactsupport-vrtarchief?name_user={first_name}&mail_user={email}&local_id={local_cp_id}&viaa_id={pid}&surname_user={last_name}&title={title}&serie={title_serie}',
	homepage: 'https://www.vrt.be',
	logo: {
		iri: 'https://assets.viaa.be/images/OR-rf5kf25',
	},
	contact_point: [
		{
			contact_type: 'ontsluiting',
			telephone: '+32 2 741 37 20',
			email: 'vrtarchief@vrt.be',
		},
		{
			contact_type: 'facturatie',
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
			organizations: [],
		},
	};
	for (let i = 0; i < amount; i++) {
		mockData.data.organizations.push(mockOrganisationInfoV2);
	}
	return mockData;
};

export const mockOrganisations: Organisation[] = [mockOrganisation1, mockOrganisation2];
