import type { Avo } from '@viaa/avo2-types';

import type { User } from '~modules/users/types';
import type { LdapUser } from '~shared/auth/auth.types';

export interface IdpMetaData {
	'md:EntityDescriptor': {
		_attributes: {
			'xmlns:md': string;
			'xmlns:ds': string;
			entityID: string;
		};
		'md:IDPSSODescriptor': {
			_attributes: {
				protocolSupportEnumeration: string;
				WantAuthnRequestsSigned: string;
			};
			'md:KeyDescriptor': {
				_attributes: {
					use: string;
				};
				'ds:KeyInfo': {
					_attributes: {
						'xmlns:ds': string;
					};
					'ds:X509Data': {
						'ds:X509Certificate': {
							_text: string;
						};
					};
				};
			}[];
			'md:SingleLogoutService': {
				_attributes: {
					Binding: string;
					Location: string;
				};
			};
			'md:NameIDFormat': {
				_text: string;
			};
			'md:SingleSignOnService': {
				_attributes: {
					Binding: string;
					Location: string;
				};
			};
		};
		'md:ContactPerson': {
			_attributes: {
				contactType: string;
			};
			'md:GivenName': {
				_text: string;
			};
			'md:SurName': {
				_text: string;
			};
			'md:EmailAddress': {
				_text: string;
			};
		};
	};
}

export interface SamlCallbackBody {
	SAMLResponse: string;
	RelayState: string; // JSON
}

export interface RelayState {
	returnToUrl: string;
	language: string; // nl | en
}

interface ResponseHeader {
	version: string;
	destination: string;
	in_response_to: string;
	id: string;
}

export interface DecodedSamlResponse {
	response_header: ResponseHeader;
	type: string;
	user: LdapUser;
}

export interface SamlConfig {
	url: string;
	entityId: string;
	privateKey: string;
	certificate: string;
	assertEndpoint: string;
}

export interface ArchiefUser {
	id: string;
	first_name: string;
	last_name: string;
	mail: string;
}

export enum LoginMessage {
	LOGGED_IN = 'LOGGED_IN',
	LOGGED_OUT = 'LOGGED_OUT',
}

export type LoginResponse = {
	message: LoginMessage;
	userInfo?: User;
	commonUserInfo?: Avo.User.CommonUser;
	acceptedConditions?: boolean;
	sessionExpiresAt?: string;
};
