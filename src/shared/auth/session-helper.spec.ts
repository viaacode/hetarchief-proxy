import { addDays, setHours, setMilliseconds, setMinutes, setSeconds } from 'date-fns/fp';
import flow from 'lodash/fp/flow';

import { Group, GroupIdToName, Permission, User } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { SessionHelper } from '~shared/auth/session-helper';
import { TestingLogger } from '~shared/logging/test-logger';

const mockLdapUser = {
	name_id: 'test-name-id',
	session_index: 'session-index',
	session_not_on_or_after: new Date(new Date().getTime() + 3600 * 1000).toISOString(), // one hour from now
	attributes: {
		mail: ['test@studiohyperdrive.be'],
		entryUUID: ['ec9dab01-6b43-4657-95e5-9808061904fc'],
		organizationalStatus: ['admin'],
		o: ['OR-h41jm1d', '24877'],
		ou: ['24877-1-211'],
		cn: ['Tom Testerom'],
		sn: ['Testerom'],
		givenName: ['Test'],
		externalid: ['36630857-416d-4de0-8e61-1cc99cde8830'],
		'x-be-viaa-eduLevelName': ['Secundair onderwijs'],
		apps: ['admins', 'avo', 'hetarchief', 'account-manager'],
		oNickname: ['Testbeeld'],
	},
};

const mockArchiefUser: User = {
	id: 'c59492f7-a317-4dd6-b1ff-5cd2a3ea042d',
	firstName: 'Tom',
	lastName: 'Testerom',
	fullName: 'Test Testers',
	email: 'test@studiohyperdrive.be',
	acceptedTosAt: '2022-02-21T14:00:00',
	groupId: Group.CP_ADMIN,
	groupName: GroupIdToName[Group.CP_ADMIN],
	permissions: [Permission.CAN_READ_ALL_VISIT_REQUESTS],
	idp: Idp.HETARCHIEF,
};

describe('SessionHelper', () => {
	beforeAll(() => {
		SessionHelper.setLogger(new TestingLogger());
	});

	describe('ensureValidSession', () => {
		it('should throw an exception if an invalid session is passed', () => {
			let exception;
			try {
				SessionHelper.ensureValidSession(undefined);
			} catch (e) {
				exception = e.response;
			}
			expect(exception).toEqual({
				message: 'Internal Server Error',
				statusCode: 500,
			});
		});
	});

	describe('isIdpUserSessionValid', () => {
		it('should return valid when the expire date is in the future', () => {
			const valid = SessionHelper.isIdpUserSessionValid({
				idpUserInfo: {
					session_not_on_or_after: new Date(
						new Date().getTime() + 3600 * 1000
					).toISOString(), // one hour from now
				},
			});
			expect(valid).toEqual(true);
		});

		it('should return invalid when the expire date is in the past', () => {
			const valid = SessionHelper.isIdpUserSessionValid({
				idpUserInfo: {
					session_not_on_or_after: new Date(new Date().getTime() - 1000).toISOString(), // one second ago
				},
			});
			expect(valid).toEqual(false);
		});
	});

	describe('isLoggedIn', () => {
		it('should return false when no valid session is given', () => {
			const valid = SessionHelper.isLoggedIn(undefined);
			expect(valid).toEqual(false);
		});

		it('should return true when the session is valid', () => {
			const valid = SessionHelper.isLoggedIn({
				idp: Idp.HETARCHIEF,
				idpUserInfo: {
					session_not_on_or_after: new Date(new Date().getTime() + 60000).toISOString(), // one minute from now
				},
				archiefUserInfo: {},
			});
			expect(valid).toEqual(true);
		});

		it('should return false when there is an unknown IDP', () => {
			const valid = SessionHelper.isLoggedIn({
				idp: 'unknown',
				idpUserInfo: {
					session_not_on_or_after: new Date(new Date().getTime() + 60000).toISOString(), // one minute from now
				},
				archiefUserInfo: {},
			});
			expect(valid).toEqual(false);
		});

		it('should return false when there is no IDP user set', () => {
			const valid = SessionHelper.isLoggedIn({
				idp: Idp.HETARCHIEF,
				idpUserInfo: null,
				archiefUserInfo: {},
			});
			expect(valid).toEqual(false);
		});

		it('should return false when the IDP session is no longer valid', () => {
			const valid = SessionHelper.isLoggedIn({
				idp: Idp.HETARCHIEF,
				idpUserInfo: {
					session_not_on_or_after: new Date(new Date().getTime() - 1000).toISOString(), // one second ago
				},
				archiefUserInfo: {},
			});
			expect(valid).toEqual(false);
		});

		it('should return false when the Archief user is not set', () => {
			const valid = SessionHelper.isLoggedIn({
				idp: Idp.HETARCHIEF,
				idpUserInfo: {
					session_not_on_or_after: new Date(new Date().getTime() + 60000).toISOString(), // one minute from now
				},
				archiefUserInfo: null,
			});
			expect(valid).toEqual(false);
		});
	});

	describe('isLoggedInWithIdp', () => {
		it('should return true when the correct IDP is given', () => {
			const valid = SessionHelper.isLoggedInWithIdp(Idp.HETARCHIEF, {
				idp: Idp.HETARCHIEF,
				idpUserInfo: {
					session_not_on_or_after: new Date(new Date().getTime() + 60000).toISOString(), // one minute from now
				},
				archiefUserInfo: {},
			});
			expect(valid).toEqual(true);
		});

		it('should return false when the wrong IDP is given', () => {
			const valid = SessionHelper.isLoggedInWithIdp(Idp.MEEMOO, {
				idp: Idp.HETARCHIEF,
				idpUserInfo: {
					session_not_on_or_after: new Date(new Date().getTime() + 60000).toISOString(), // one minute from now
				},
				archiefUserInfo: {},
			});
			expect(valid).toEqual(false);
		});
	});

	describe('setIdpUserInfo', () => {
		it('should set the IDP user on the session', () => {
			const session: Record<string, any> = {};
			SessionHelper.setIdpUserInfo(session, Idp.MEEMOO, mockLdapUser);
			expect(session.idpUserInfo).toBeDefined();
			expect(session.idp).toBeDefined();
		});

		it('should throw an exception when an invalid session was passed', () => {
			let exception;
			try {
				SessionHelper.setIdpUserInfo(null, Idp.MEEMOO, mockLdapUser);
			} catch (e) {
				exception = e.response;
			}
			expect(exception).toEqual({
				message: 'Internal Server Error',
				statusCode: 500,
			});
		});
	});

	describe('setArchiefUserInfo', () => {
		it('should set the Archief user on the session', () => {
			const session: Record<string, any> = {};
			SessionHelper.setArchiefUserInfo(session, mockArchiefUser);
			expect(session.archiefUserInfo).toBeDefined();
		});

		it('should throw an exception when an invalid session was passed', () => {
			let exception;
			try {
				SessionHelper.setArchiefUserInfo(null, mockArchiefUser);
			} catch (e) {
				exception = e.response;
			}
			expect(exception).toEqual({
				message: 'Internal Server Error',
				statusCode: 500,
			});
		});
	});

	describe('getArchiefUserInfo', () => {
		it('should return null if no valid session was given', () => {
			const result = SessionHelper.getArchiefUserInfo(null);
			expect(result).toBeNull();
		});

		it('should return the archief user info', () => {
			const result = SessionHelper.getArchiefUserInfo({
				archiefUserInfo: { email: 'test@studiohyperdrive.be' },
			});
			expect(result).toEqual({ email: 'test@studiohyperdrive.be' });
		});
	});

	describe('getExpiresAt', () => {
		it('should return tomorrow at 5am when now is already passed 5am', () => {
			const inputDate = setHours(11)(new Date());
			const expectedDate = flow(
				addDays(1),
				setHours(5),
				setMinutes(0),
				setSeconds(0),
				setMilliseconds(0)
			)(new Date());
			const result = SessionHelper.getExpiresAt(inputDate);
			expect(result).toEqual(expectedDate.toISOString());
		});

		it('should return 5am if its passed midnight but still before 5am', () => {
			const inputDate = setHours(4)(new Date());
			const expectedDate = flow(
				setHours(5),
				setMinutes(0),
				setSeconds(0),
				setMilliseconds(0)
			)(new Date());
			const result = SessionHelper.getExpiresAt(inputDate);
			expect(result).toEqual(expectedDate.toISOString());
		});
	});

	describe('getIdpUserInfo', () => {
		it('should return null if no valid session was given', () => {
			const result = SessionHelper.getIdpUserInfo(null);
			expect(result).toBeNull();
		});

		it('should return the Idp user info', () => {
			const result = SessionHelper.getIdpUserInfo({
				idpUserInfo: { email: 'test@studiohyperdrive.be' },
			});
			expect(result).toEqual({ email: 'test@studiohyperdrive.be' });
		});
	});

	describe('getIdp', () => {
		it('should return null if no valid session was given', () => {
			const result = SessionHelper.getIdp(null);
			expect(result).toBeNull();
		});

		it('should return the Idp user info', () => {
			const result = SessionHelper.getIdp({
				idp: Idp.MEEMOO,
			});
			expect(result).toEqual(Idp.MEEMOO);
		});
	});

	describe('logout', () => {
		it('should clear a valid session', () => {
			const session: Record<string, any> = {
				idp: Idp.HETARCHIEF,
				idpUserInfo: {
					session_not_on_or_after: new Date(new Date().getTime() + 60000).toISOString(), // one minute from now
				},
				archiefUserInfo: {},
			};
			SessionHelper.logout(session);
			expect(session.idp).toBeNull();
			expect(session.idpUserInfo).toBeNull();
			expect(session.archiefUserInfo).toBeNull();
		});

		it('should not fail if an empty session was given', () => {
			const session: Record<string, any> = {};
			let error;
			try {
				SessionHelper.logout(session);
			} catch (e) {
				error = e;
			}
			expect(error).toBeUndefined();
		});
	});
});
