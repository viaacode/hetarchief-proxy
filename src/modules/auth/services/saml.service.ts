import type { Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import got from 'got';
import { get } from 'lodash';
import saml2, { type IdentityProvider, type ServiceProvider } from 'saml2-js';
import convert from 'xml-js';

import type { Configuration } from '~config';

import type { DecodedSamlResponse, IdpMetaData, SamlCallbackBody, SamlConfig } from '../types';

import type { LdapUser } from '~shared/auth/auth.types';
import type { Locale } from '~shared/types/types';

export abstract class SamlService {
	protected logger: Logger;

	private samlConfig: SamlConfig | undefined;
	private serviceProvider: ServiceProvider | undefined;
	private identityProvider: IdentityProvider | undefined;
	private ssoLoginUrl: string | undefined;
	private ssoLogoutUrl: string | undefined;

	constructor(protected configService: ConfigService<Configuration>) {}

	/**
	 * Fetches the idp metadata and sets up the saml service and identity provider
	 * Does not throw, so the proxy still starts when the idp is unavailable. getProviders retries on the next login
	 * @param samlConfig
	 */
	public async init(samlConfig: SamlConfig) {
		this.samlConfig = samlConfig;
		const { url, entityId, privateKey, certificate, assertEndpoint } = samlConfig;
		if (this.configService.get('LOG_SAML_CONFIGURATION') === 'true') {
			this.logger.log('SAML config ', {
				url,
				entityId,
				privateKey,
				certificate,
				assertEndpoint,
			});
		}
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
				force_authn: process.env.SAML_FORCE_AUTHN === 'true', // this is required when a certificate is set (not for local development)
				auth_context: {
					comparison: 'exact',
					class_refs: ['urn:oasis:names:tc:SAML:1.0:am:password'],
				},
				nameid_format: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
				sign_get_request: process.env.SAML_SIGN_GET_REQUESTS === 'true', // this is required when a certificate is set (not for local development)
				allow_unencrypted_assertion: process.env.SAML_ALLOW_UNENCRYPTED_ASSERTIONS === 'true',
			});
			this.identityProvider = new saml2.IdentityProvider({
				sso_login_url: this.ssoLoginUrl,
				sso_logout_url: this.ssoLogoutUrl,
				certificates: signingIdpCertificates,
				force_authn: process.env.SAML_FORCE_AUTHN === 'true', // this is required when a certificate is set (not for local development)
				sign_get_request: process.env.SAML_SIGN_GET_REQUESTS === 'true', // this is required when a certificate is set (not for local development)
				allow_unencrypted_assertion: process.env.SAML_ALLOW_UNENCRYPTED_ASSERTIONS === 'true',
			});
		} catch (err) {
			this.logger.error(
				`Failed to get meta data from idp server: ${url}, error: ${(err as Error)?.message}`,
				(err as Error)?.stack
			);
		}
	}

	/**
	 * Returns the saml service and identity provider
	 * If loading the idp metadata failed on startup, eg: because the idp was unreachable, it is retried here
	 */
	private async getProviders(): Promise<{
		serviceProvider: ServiceProvider;
		identityProvider: IdentityProvider;
	}> {
		if ((!this.serviceProvider || !this.identityProvider) && this.samlConfig) {
			await this.init(this.samlConfig);
		}
		if (!this.serviceProvider || !this.identityProvider) {
			throw new Error(
				`SAML is not initialized, failed to load the idp metadata from ${this.samlConfig?.url}`
			);
		}
		return {
			serviceProvider: this.serviceProvider,
			identityProvider: this.identityProvider,
		};
	}

	/**
	 * login url
	 */
	public async createLoginRequestUrl(returnToUrl: string, language: Locale): Promise<string> {
		const { serviceProvider, identityProvider } = await this.getProviders();
		return new Promise<string>((resolve, reject) => {
			serviceProvider.create_login_request_url(
				identityProvider,
				{
					relay_state: JSON.stringify({ returnToUrl, language }),
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

	public async createLogoutRequestUrl(nameId: string, returnToUrl: string): Promise<string> {
		const { serviceProvider, identityProvider } = await this.getProviders();
		return new Promise<string>((resolve, reject) => {
			serviceProvider.create_logout_request_url(
				identityProvider,
				{
					relay_state: JSON.stringify({ returnToUrl }),
					name_id: nameId,
				},
				(error: any, logoutUrl: string) => {
					if (error) {
						reject(error);
					} else {
						resolve(logoutUrl);
					}
				}
			);
		});
	}

	public async createLogoutResponseUrl(relayState: any): Promise<string> {
		const { serviceProvider, identityProvider } = await this.getProviders();
		return new Promise<string>((resolve, reject) => {
			serviceProvider.create_logout_response_url(
				identityProvider,
				{ relay_state: relayState },
				(error: any, responseUrl: string) => {
					if (error) {
						reject(error);
					} else {
						resolve(responseUrl);
					}
				}
			);
		});
	}

	public async assertSamlResponse(requestBody: SamlCallbackBody): Promise<LdapUser> {
		const { serviceProvider, identityProvider } = await this.getProviders();
		return new Promise((resolve, reject) => {
			serviceProvider.post_assert(
				identityProvider,
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
