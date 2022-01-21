import { User } from '~modules/users/types';

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

interface LdapAttributes {
	mail: string[];
	displayName?: string[]; // username or nickname
	givenName: string[]; // firstname
	sn: string[]; // lastname
	cn: string[]; // fullname
	o: string[]; // organization id
	entryUUID: string[];
	entryDN?: string[]; // eg: mail=bert.verhelst@studiohyperdrive.be,ou=people,dc=hetarchief,dc=be
	apps: string[]; // avo
	oNickname: string[]; // name organization
	employeeNumber?: string[]; // stamboek number
	'x-be-viaa-eduTypeName'?: string[];
	'x-be-viaa-eduLevelName'?: string[];
	organizationalStatus?: string[]; // usergroup
	'x-be-viaa-eduExceptionAccount'?: string[]; // is_exception account
	role?: string[];
	sector?: string[];
}

export interface LdapUser {
	name_id: string; // email address user
	session_index: string;
	session_not_on_or_after: string; // date string eg: "2019-07-18T12:08:20Z"
	attributes: LdapAttributes;
}

export interface RelayState {
	returnToUrl: string;
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

export enum Idp {
	HETARCHIEF = 'HETARCHIEF',
	MEEMOO = 'MEEMOO',
}

export type LoginResponse =
	| {
			message: 'LOGGED_IN';
			userInfo: User;
			acceptedConditions: boolean;
			sessionExpiresAt: string;
	  }
	| {
			message: 'LOGGED_OUT';
	  };
