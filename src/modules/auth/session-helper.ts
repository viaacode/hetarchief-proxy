import { InternalServerErrorException, Logger } from '@nestjs/common';
import {
	addDays,
	formatISO,
	getHours,
	setHours,
	setMilliseconds,
	setMinutes,
	setSeconds,
} from 'date-fns/fp';
import { get } from 'lodash';
import flow from 'lodash/fp/flow';

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

	public static getArchiefUserInfo(session: Record<string, any>): User | null {
		if (!session) {
			return null;
		}
		return session[ARCHIEF_USER_INFO_PATH];
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
}
