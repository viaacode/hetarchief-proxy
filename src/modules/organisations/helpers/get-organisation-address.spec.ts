import { describe, expect, it } from 'vitest';
import { PostalAddressType } from '~modules/organisations/organisations.types';
import { getOrganisationAddress } from './get-organisation-address';

const invoiceAddress = {
	schema_street_address: 'Invoice Street 1',
	schema_address_locality: 'Invoice City',
	schema_postal_code: '1000',
	schema_contact_type: PostalAddressType.invoicing,
};

const primaryAddress = {
	schema_street_address: 'Primary Street 1',
	schema_address_locality: 'Primary City',
	schema_postal_code: '2000',
	schema_contact_type: PostalAddressType.primary,
};

const deliveryAddress = {
	schema_street_address: 'Delivery Street 1',
	schema_address_locality: 'Delivery City',
	schema_postal_code: '3000',
	schema_contact_type: PostalAddressType.delivery,
};

describe('getOrganisationAddress', () => {
	it('returns the invoice address when present', () => {
		const result = getOrganisationAddress([
			{ postalAddress: primaryAddress },
			{ postalAddress: invoiceAddress },
		]);
		expect(result).toEqual(invoiceAddress);
	});

	it('returns the invoice address over the primary address', () => {
		const result = getOrganisationAddress([
			{ postalAddress: invoiceAddress },
			{ postalAddress: primaryAddress },
		]);
		expect(result).toEqual(invoiceAddress);
	});

	it('returns the primary address when no invoice address is present', () => {
		const result = getOrganisationAddress([
			{ postalAddress: deliveryAddress },
			{ postalAddress: primaryAddress },
		]);
		expect(result).toEqual(primaryAddress);
	});

	it('returns null when neither invoice nor primary address is present', () => {
		const result = getOrganisationAddress([{ postalAddress: deliveryAddress }]);
		expect(result).toBeNull();
	});

	it('returns null for an empty array', () => {
		const result = getOrganisationAddress([]);
		expect(result).toBeNull();
	});

	it('ignores delivery addresses', () => {
		const result = getOrganisationAddress([
			{ postalAddress: deliveryAddress },
			{ postalAddress: deliveryAddress },
		]);
		expect(result).toBeNull();
	});
});
