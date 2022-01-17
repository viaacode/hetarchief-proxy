import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import got from 'got';
import { get } from 'lodash';
import saml2, { IdentityProvider, ServiceProvider } from 'saml2-js';
import convert from 'xml-js';

import { DecodedSamlResponse, IdpMetaData, LdapUser, SamlCallbackBody, SamlConfig } from '../types';

export abstract class SamlService {
	private serviceProvider: ServiceProvider;
	private identityProvider: IdentityProvider;
	private ssoLoginUrl: string | undefined;
	private ssoLogoutUrl: string | undefined;

	constructor(protected configService: ConfigService) {}

	public async init(samlConfig: SamlConfig) {
		const { url, entityId, privateKey, certificate, assertEndpoint } = samlConfig;

		try {
			const response = await got.post(url, {
				resolveBodyOnly: true,
			});
			const metaData: IdpMetaData = convert.xml2js(response, {
				compact: true,
				trim: true,
				ignoreDeclaration: true,
				ignoreInstruction: true,
				ignoreAttributes: false,
				ignoreComment: true,
				ignoreCdata: true,
				ignoreDoctype: true,
			}) as IdpMetaData;
			const idpCertificatePath = 'md:EntityDescriptor.md:IDPSSODescriptor.md:KeyDescriptor';
			const ssoLoginUrlPath =
				'md:EntityDescriptor.md:IDPSSODescriptor.md:SingleSignOnService._attributes.Location';
			const ssoLogoutUrlPath =
				'md:EntityDescriptor.md:IDPSSODescriptor.md:SingleLogoutService._attributes.Location';

			// Get all signing certificates from the idp saml xml metadata
			const rawIdpCertificates = get(metaData, idpCertificatePath);
			const signingIdpCertificates = rawIdpCertificates
				.filter((cert: any) => get(cert, '_attributes.use') === 'signing')
				.map((cert: any) => get(cert, 'ds:KeyInfo.ds:X509Data.ds:X509Certificate._text'));
			this.ssoLoginUrl = get(metaData, ssoLoginUrlPath);
			this.ssoLogoutUrl = get(metaData, ssoLogoutUrlPath);
			if (!signingIdpCertificates.length) {
				throw new Error('Failed to find certificate in idp metadata');
			}
			if (!this.ssoLoginUrl) {
				throw new Error('Failed to find ssoLoginUrl in idp metadata');
			}
			if (!this.ssoLogoutUrl) {
				throw new Error('Failed to find ssoLogoutUrl in idp metadata');
			}
			this.serviceProvider = new saml2.ServiceProvider({
				entity_id: entityId,
				private_key: privateKey,
				certificate,
				assert_endpoint: assertEndpoint,
				// force_authn: true, // TODO enable certificates once the app runs on https on qas/prd
				auth_context: {
					comparison: 'exact',
					class_refs: ['urn:oasis:names:tc:SAML:1.0:am:password'],
				},
				nameid_format: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
				sign_get_request: false,
				allow_unencrypted_assertion: true,
			});
			this.identityProvider = new saml2.IdentityProvider({
				sso_login_url: this.ssoLoginUrl,
				sso_logout_url: this.ssoLogoutUrl,
				certificates: signingIdpCertificates,
				// force_authn: true, // TODO enable certificates once the app runs on https on qas/prd
				sign_get_request: false,
				allow_unencrypted_assertion: true,
			});
		} catch (err) {
			Logger.error('Failed to get meta data from idp server', { err, endpoint: url });
		}
	}

	/**
	 * login url
	 */
	public createLoginRequestUrl(returnToUrl: string) {
		return new Promise<string>((resolve, reject) => {
			this.serviceProvider.create_login_request_url(
				this.identityProvider,
				{
					relay_state: JSON.stringify({ returnToUrl }),
				},
				(error: any, loginUrl: string) => {
					if (error) {
						reject(error);
					} else {
						resolve(loginUrl);
					}
				}
			);
		});
	}

	public assertSamlResponse(requestBody: SamlCallbackBody): Promise<LdapUser> {
		return new Promise((resolve, reject) => {
			this.serviceProvider.post_assert(
				this.identityProvider,
				{
					request_body: requestBody,
					allow_unencrypted_assertion: true,
				} as any,
				(error, samlResponse: DecodedSamlResponse) => {
					if (error) {
						reject(error);
					} else {
						resolve(samlResponse.user);
					}
				}
			);
		});
	}
}
