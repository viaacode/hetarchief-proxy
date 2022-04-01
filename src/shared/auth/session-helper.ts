import { InternalServerErrorException, Logger } from '@nestjs/common';
import { addDays, getHours, setHours, setMilliseconds, setMinutes, setSeconds } from 'date-fns/fp';
import { get } from 'lodash';
import flow from 'lodash/fp/flow';

import { Permission, User } from '~modules/users/types';
import { Idp, LdapUser } from '~shared/auth/auth.types';
import { SpecialPermissionGroups } from '~shared/types/types';

const IDP = 'idp';
const IDP_USER_INFO_PATH = 'idpUserInfo';
export const ARCHIEF_USER_INFO_PATH = 'archiefUserInfo';

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

		return !!(
			(
				Idp[session[IDP]] && // IDP is set and known
				session[IDP_USER_INFO_PATH] && // IDP user is set
				SessionHelper.isIdpUserSessionValid(session) && // IDP session is valid
				session[ARCHIEF_USER_INFO_PATH]
			) // Archief user is set
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

		// TODO remove this temp permissions array once we can login wit the correct user group --------------------------
		user.permissions = [
			Permission.CAN_READ_ALL_VISIT_REQUESTS,
			Permission.CAN_READ_CP_VISIT_REQUESTS,
			Permission.CAN_APPROVE_DENY_ALL_VISIT_REQUESTS,
			Permission.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
			Permission.CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS,
		];
		// TODO remove until here ----------------------------------------------------------------------------------------

		session[ARCHIEF_USER_INFO_PATH] = user;
	}

	public static getArchiefUserInfo(session: Record<string, any>): User | null {
		if (!session) {
			return null;
		}
		return session[ARCHIEF_USER_INFO_PATH];
	}

	public static getUserGroupIds(user: User | null | undefined): number[] {
		return [
			...get(user, 'userGroupIds', []),
			user ? SpecialPermissionGroups.loggedInUsers : SpecialPermissionGroups.loggedOutUsers,
		];
	}

	/**
	 * Returns when the session expires based on the input date (usually 'now')
	 */
	public static getExpiresAt(now: Date): string {
		const expiresAt = flow(
			getHours(now) > 5 ? addDays(1) : addDays(0), // after 5am session expires at 5am the next day
			setHours(5),
			setMinutes(0),
			setSeconds(0),
			setMilliseconds(0)
		)(now);

		return expiresAt.toISOString();
	}

	public static getIdpUserInfo(session: Record<string, any>): LdapUser | null {
		if (!session) {
			return null;
		}
		return session[IDP_USER_INFO_PATH];
	}

	public static getIdp(session: Record<string, any>): Idp | null {
		if (!session) {
			return null;
		}
		return session[IDP];
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
