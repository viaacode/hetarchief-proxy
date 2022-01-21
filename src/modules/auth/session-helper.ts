import { InternalServerErrorException, Logger } from '@nestjs/common';
import { get } from 'lodash';

import { Idp, LdapUser } from './types';

import { User } from '~modules/users/types';

const IDP = 'idp';
const IDP_USER_INFO_PATH = 'idpUserInfo';
const ARCHIEF_USER_INFO_PATH = 'archiefUserInfo';

export class SessionHelper {
	public static ensureValidSession(session: Record<string, any>) {
		if (!session) {
			Logger.error('Failed to set Idp user info, no session was found');
			throw new InternalServerErrorException();
		}
	}

	public static idpUserSessionValid(session: Record<string, any>): boolean {
		const expiresOn = new Date(
			get(session[IDP_USER_INFO_PATH], 'session_not_on_or_after', 0)
		).getTime();
		return Date.now() <= expiresOn;
	}

	public static isLoggedIn(session: Record<string, any>): boolean {
		if (!session) {
			return false;
		}
		return (
			Idp[session[IDP]] && // IDP is set and known
			session[IDP_USER_INFO_PATH] && // IDP user is set
			SessionHelper.idpUserSessionValid(session) && // IDP session is valid
			session[ARCHIEF_USER_INFO_PATH] // Archief user is set
		);
	}

	public static setIdpUserInfo(session: Record<string, any>, idp: Idp, user: LdapUser): void {
		SessionHelper.ensureValidSession(session);
		session[IDP] = idp;
		session[IDP_USER_INFO_PATH] = user;
	}

	public static setArchiefUserInfo(session: Record<string, any>, user: User): void {
		SessionHelper.ensureValidSession(session);
		session[ARCHIEF_USER_INFO_PATH] = user;
	}
}
