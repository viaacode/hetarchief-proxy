import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { get, intersection } from 'lodash';
import queryString from 'query-string';

import { getConfig } from '~config';

import { NO_ORG_LINKED } from '../constants';

import { SpacesService } from '~modules/spaces/services/spaces.service';
import { TranslationsService } from '~modules/translations/services/translations.service';
import { Group } from '~modules/users/types';
import { Idp, LdapUser } from '~shared/auth/auth.types';

@Injectable()
export class IdpService {
	private logger: Logger = new Logger(IdpService.name, { timestamp: true });
	private idpsWithSpecificLogoutPage = [Idp.HETARCHIEF, Idp.MEEMOO];

	protected meemooAdminOrganizationIds: string[];

	constructor(
		protected configService: ConfigService,
		protected spacesService: SpacesService,
		private readonly translationsService: TranslationsService
	) {
		this.meemooAdminOrganizationIds = getConfig(configService, 'meemooAdminOrganizationIds');
	}

	public hasSpecificLogoutPage(idp: Idp): boolean {
		return this.idpsWithSpecificLogoutPage.includes(idp);
	}

	public getSpecificLogoutUrl(idp: Idp, queryParams: Record<string, string>): string {
		const host = getConfig(this.configService, 'host');

		const url = queryString.stringifyUrl({
			url: `${host}/auth/${idp.toLowerCase()}/logout`,
			query: queryParams,
		});
		return url;
	}

	public userGroupRequiresMaintainerLink(userGroup: Group): boolean {
		return [Group.KIOSK_VISITOR, Group.CP_ADMIN].includes(userGroup);
	}

	/**
	 * Flowchart: see https://meemoo.atlassian.net/wiki/spaces/HA2/pages/2978447456/Gebruikersgroepen+en+permissies+BZT+versie+1#Functionele-samenvatting
	 * Overview test users: https://meemoo.atlassian.net/wiki/spaces/HA2/pages/3458269217/Overzicht+testusers
	 */
	public async determineUserGroup(ldapUser: LdapUser): Promise<Group> {
		// permissions check
		const apps = get(ldapUser, 'attributes.apps', []);
		if (apps.includes('hetarchief-beheer')) {
			// bottom section of the flowchart
			const maintainerId = get(ldapUser, 'attributes.o[0]');
			if (!maintainerId) {
				throw new Error(
					this.translationsService.t(
						'modules/auth/services/idp___de-account-is-een-beheerder-maar-heeft-geen-organisatie-in-de-acm-voeg-een-organisatie-toe-in-de-acm-no-org-linked'
					)
				);
			}
			if (maintainerId && (await this.spacesService.findByMaintainerId(maintainerId))) {
				return Group.CP_ADMIN;
			}

			// our (test) accounts have multiple organizations
			if (intersection(this.meemooAdminOrganizationIds, ldapUser.attributes.o).length > 0) {
				return Group.MEEMOO_ADMIN;
			}

			return Group.VISITOR;
		}

		// no member of hetarchief-beheer
		// TOP-section of the flowchart
		// check for kiosk permissions -- otherwise it's a regular user
		if (get(ldapUser, 'attributes.organizationalStatus', []).includes('kiosk')) {
			// organization needs to have a space to be a kiosk user
			const maintainerId = get(ldapUser, 'attributes.o[0]');
			if (!maintainerId) {
				throw new Error(
					`${NO_ORG_LINKED}${this.translationsService.t(
						'modules/auth/services/idp___de-account-is-een-kiosk-gebruiker-maar-heeft-geen-organisatie-in-de-acm-voeg-een-organisatie-toe-in-de-acm-no-org-linked'
					)}`
				);
			}
			if (await this.spacesService.findByMaintainerId(maintainerId)) {
				return Group.KIOSK_VISITOR;
			}
		}

		return Group.VISITOR;
	}
}
