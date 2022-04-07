import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { get } from 'lodash';
import queryString from 'query-string';

import { getConfig } from '~config';

import { SpacesService } from '~modules/spaces/services/spaces.service';
import { Group } from '~modules/users/types';
import { Idp, LdapUser } from '~shared/auth/auth.types';

@Injectable()
export class IdpService {
	private logger: Logger = new Logger(IdpService.name, { timestamp: true });
	private idpsWithSpecificLogoutPage = [Idp.HETARCHIEF, Idp.MEEMOO];

	protected meemooAdminOrganizationIds: string[];

	constructor(protected configService: ConfigService, protected spacesService: SpacesService) {
		this.meemooAdminOrganizationIds = getConfig(configService, 'meemooAdminOrganizationIds');
	}

	public hasSpecificLogoutPage(idp: Idp): boolean {
		return this.idpsWithSpecificLogoutPage.includes(idp);
	}

	public getSpecificLogoutUrl(idp: Idp, returnToUrl: string): string {
		const host = getConfig(this.configService, 'host');

		const url = `${host}/auth/${idp.toLowerCase()}/logout?${queryString.stringify({
			returnToUrl,
		})}`;
		return url;
	}

	/**
	 * Flowchart: see https://meemoo.atlassian.net/wiki/spaces/HA2/pages/2978447456/Gebruikersgroepen+en+permissies+BZT+versie+1#Functionele-samenvatting
	 */
	public async determineUserGroup(ldapUser: LdapUser): Promise<Group> {
		// permissions check
		const apps = get(ldapUser, 'attributes.apps', []);
		if (
			apps.includes('hetarchief') ||
			apps.includes('admins') // TODO replace by a single value 'hetarchief-beheer' once archief 2.0 is launched
		) {
			// bottom section of the flowchart
			const maintainerId = get(ldapUser, 'attributes.o[0]');
			if (maintainerId && (await this.spacesService.findBySlug(maintainerId))) {
				return Group.CP_ADMIN;
			}

			if (this.meemooAdminOrganizationIds.includes(maintainerId)) {
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
			if (await this.spacesService.findBySlug(maintainerId)) {
				return Group.KIOSK_VISITOR;
			}
		}

		return Group.VISITOR;
	}
}
