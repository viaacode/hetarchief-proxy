import { PostalAddressType } from '~modules/organisations/organisations.types';

interface HasSite {
	postalAddress: Partial<{
		schema_street_address: string;
		schema_address_locality: string;
		schema_postal_code: string;
		schema_contact_type: string;
	}>;
}

export function getOrganisationAddress(hasSites: HasSite[]): HasSite['postalAddress'] | null {
	const invoiceAddress = hasSites.find((hasSite) => {
		return hasSite.postalAddress.schema_contact_type === PostalAddressType.invoicing;
	});
	const primaryAddress = hasSites.find((hasSite) => {
		return hasSite.postalAddress.schema_contact_type === PostalAddressType.primary;
	});
	return invoiceAddress?.postalAddress || primaryAddress?.postalAddress || null;
}
