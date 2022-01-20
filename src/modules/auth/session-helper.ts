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

	public static isIdpUserSessionValid(session: Record<string, any>): boolean {
		const expiresOn = new Date(
			get(session[IDP_USER_INFO_PATH], 'session_not_on_or_after', 0)
		).getTime();
		return Date.now() <= expiresOn;
	}

	/**
	 * @param session
	 * @returns if the user is logged in, regardless of the IDP
	 */
	public static isLoggedIn(session: Record<string, any>): boolean {
		if (!session) {
			return false;
		}
		return (
			Idp[session[IDP]] && // IDP is set and known
			session[IDP_USER_INFO_PATH] && // IDP user is set
			SessionHelper.isIdpUserSessionValid(session) && // IDP session is valid
			session[ARCHIEF_USER_INFO_PATH] // Archief user is set
		);
	}

	/**
	 * @param idp
	 * @param session
	 * @returns if the user is logged in with the given idp
	 */
	public static isLoggedInWithIdp(idp: Idp, session: Record<string, any>) {
		return SessionHelper.isLoggedIn(session) && session[IDP] === idp;
	}

	/**
	 * Set IDP user info on the session
	 * @param session
	 * @param idp
	 * @param user
	 */
	public static setIdpUserInfo(session: Record<string, any>, idp: Idp, user: LdapUser): void {
		SessionHelper.ensureValidSession(session);
		session[IDP] = idp;
		session[IDP_USER_INFO_PATH] = user;
	}

	/**
	 * Set archief user info (our user object) on the session
	 * @param session
	 * @param user
	 */
	public static setArchiefUserInfo(session: Record<string, any>, user: User): void {
		SessionHelper.ensureValidSession(session);
		session[ARCHIEF_USER_INFO_PATH] = user;
	}

	public static getIdpUserInfo(session: Record<string, any>): LdapUser | null {
		if (!session) {
			return null;
		}
		return session[IDP_USER_INFO_PATH];
	}

	/**
	 * Logout by removing all user info from the session
	 * @param session
	 */
	public static logout(session: Record<string, any>) {
		session[IDP] = null;
		session[IDP_USER_INFO_PATH] = null;
		session[ARCHIEF_USER_INFO_PATH] = null;
	}
}
