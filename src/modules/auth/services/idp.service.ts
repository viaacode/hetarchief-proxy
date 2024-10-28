import { type Locale, TranslationsService } from '@meemoo/admin-core-api';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Idp } from '@viaa/avo2-types';
import { get, intersection } from 'lodash';
import queryString from 'query-string';

import { type Configuration } from '~config';

import { NO_ORG_LINKED } from '../constants';

import { type Organisation } from '~modules/organisations/organisations.types';
import { SpacesService } from '~modules/spaces/services/spaces.service';
import { GroupId } from '~modules/users/types';
import { LdapApp, type LdapUser } from '~shared/auth/auth.types';

@Injectable()
export class IdpService {
	private idpsWithSpecificLogoutPage = [Idp.HETARCHIEF];

	protected meemooAdminOrganizationIds: string[];

	constructor(
		protected configService: ConfigService<Configuration>,
		protected spacesService: SpacesService,
		private readonly translationsService: TranslationsService
	) {
		this.meemooAdminOrganizationIds = configService
			.get('MEEMOO_ADMIN_ORGANIZATION_IDS')
			.split(',');
	}

	public hasSpecificLogoutPage(idp: Idp): boolean {
		return this.idpsWithSpecificLogoutPage.includes(idp);
	}

	public getSpecificLogoutUrl(idp: Idp, queryParams: Record<string, string>): string {
		const host = this.configService.get('HOST');

		const url = queryString.stringifyUrl({
			url: `${host}/auth/${idp.toLowerCase()}/logout`,
			query: queryParams,
		});
		return url;
	}

	public userGroupRequiresMaintainerLink(userGroup: GroupId): boolean {
		return [GroupId.KIOSK_VISITOR, GroupId.CP_ADMIN].includes(userGroup);
	}

	/**
	 * Flowchart: see https://meemoo.atlassian.net/wiki/spaces/HA2/pages/2978447456/Gebruikersgroepen+en+permissies+BZT+versie+1#Functionele-samenvatting
	 * Overview test users: https://meemoo.atlassian.net/wiki/spaces/HA2/pages/3458269217/Overzicht+testusers
	 *
	 * Flowchart v2: see https://meemoo.atlassian.net/wiki/spaces/HA2/pages/3293741091/FA+permissies+licenties+en+gebruikersgroepen+V2#1.-Gebruikersgroepen
	 */
	public async determineUserGroup(
		ldapUser: LdapUser,
		organisation: Organisation | undefined | null,
		locale: Locale
	): Promise<GroupId> {
		const organizationalStatus = get(ldapUser, 'attributes.organizationalStatus', []);
		// permissions check
		const apps = get(ldapUser, 'attributes.apps', []);

		// 1. organizationalStatus = kiosk + apps = hetarchief-beheer → error (account misconfiguration)
		// 2. organizationalStatus = kiosk + apps = cataloguspro → error (account misconfiguration)
		if (
			organizationalStatus.includes('kiosk') &&
			(apps.includes(LdapApp.HETARCHIEF_BEHEER) || apps.includes(LdapApp.CATALOGUS_PRO))
		) {
			throw new Error(
				`${NO_ORG_LINKED}${this.translationsService.tText(
					'modules/auth/services/idp___account-configuratie',
					null,
					locale
				)}`
			);
		}

		if (apps.includes(LdapApp.HETARCHIEF_BEHEER)) {
			// bottom section of the flowchart
			const maintainerId = get(ldapUser, 'attributes.o[0]');
			if (!maintainerId) {
				throw new Error(
					this.translationsService.tText(
						'modules/auth/services/idp___de-account-is-een-beheerder-maar-heeft-geen-organisatie-in-de-acm-voeg-een-organisatie-toe-in-de-acm-no-org-linked',
						null,
						locale
					)
				);
			}

			// our (test) accounts have multiple organizations
			if (intersection(this.meemooAdminOrganizationIds, ldapUser.attributes.o).length > 0) {
				return GroupId.MEEMOO_ADMIN;
			}

			if (organisation) {
				return GroupId.CP_ADMIN;
			}

			return GroupId.VISITOR;
		}

		// no member of hetarchief-beheer
		// TOP-section of the flowchart
		// check for kiosk permissions -- otherwise it's a regular user
		if (organizationalStatus.includes('kiosk')) {
			// organization needs to have a space to be a kiosk user
			const maintainerId = get(ldapUser, 'attributes.o[0]');
			// 3. organizationalStatus = kiosk + cp has no visitor space → error (account misconfiguration)
			if (!maintainerId) {
				throw new Error(
					`${NO_ORG_LINKED}${this.translationsService.tText(
						'modules/auth/services/idp___de-account-is-een-kiosk-gebruiker-maar-heeft-geen-organisatie-in-de-acm-voeg-een-organisatie-toe-in-de-acm-no-org-linked',
						null,
						locale
					)}`
				);
			}
			if (await this.spacesService.findByMaintainerId(maintainerId)) {
				return GroupId.KIOSK_VISITOR;
			}
		}

		return GroupId.VISITOR;
	}
}
