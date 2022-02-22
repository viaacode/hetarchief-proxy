export enum Idp {
	HETARCHIEF = 'HETARCHIEF',
	MEEMOO = 'MEEMOO',
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
