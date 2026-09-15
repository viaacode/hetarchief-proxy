import type { TranslationsService } from '@meemoo/admin-core-api';

import type { Locale } from '~shared/types/types';

export type ZendeskID = number;

export type ViaChannel = 'api' | 'web' | 'mobile' | 'rule' | 'system';

export type TicketStatus = 'new' | 'open' | 'pending' | 'hold' | 'solved' | 'closed';

export type TicketPriority = 'urgent' | 'high' | 'normal' | 'low';

export type TicketType = 'problem' | 'incident' | 'question' | 'task';

export interface RequesterAnonymous {
	name: string;
	email?: string | undefined;
	locale_id?: ZendeskID | undefined;
}

export interface CommentsCreateModel {
	url?: string | undefined;
	request_id?: number | undefined;
	body?: string | undefined;
	html_body?: string | undefined;
	public?: boolean | undefined;
	author_id?: ZendeskID | undefined;
	uploads?: ReadonlyArray<string> | undefined;
}

export interface Collaborator {
	name?: string | undefined;
	email: string;
}

export interface TicketField {
	id: number;
	value: any;
}

export interface ViaSource {
	to: object;
	from: object;
	rel: string | null;
}

export interface TicketVia {
	channel: ViaChannel;
	source: ViaSource;
}

export interface PersistableModel {
	readonly id: ZendeskID;
}

export interface TemporalModel extends PersistableModel {
	readonly created_at: string;
}

export interface AuditableModel extends TemporalModel {
	readonly updated_at: string | null;
}

/**
 * @see {@link https://developer.zendesk.com/rest_api/docs/support/requests#json-format|Zendesk Requests JSON Format}
 */
export interface CreateTicketResponse extends AuditableModel {
	readonly url: string;
	readonly subject: string;
	readonly description: string;
	readonly status: TicketStatus;
	readonly priority: TicketPriority | null;
	readonly type: TicketType | null;
	readonly custom_fields: TicketField[] | null;
	readonly fields: TicketField[] | null;
	readonly organization_id: ZendeskID | null;
	readonly requester_id: ZendeskID;
	readonly assignee_id: ZendeskID | null;
	readonly group_id?: ZendeskID | null | undefined;
	readonly collaborator_ids: ZendeskID[];
	readonly email_cc_ids: ZendeskID[];
	readonly via: TicketVia;
	readonly is_public: boolean;
	readonly due_at: string | null;
	readonly can_be_solved_by_me?: boolean | undefined;
	readonly solved?: boolean | undefined;
	readonly ticket_form_id?: number | null | undefined;
	readonly recipient: string | null;
	readonly followup_source_id: string | null;
}

/**
 * Response of POST {ZENDESK_TOKEN_ENDPOINT} with the client credentials grant
 * @see https://developer.zendesk.com/api-reference/ticketing/oauth/grant_type_tokens/
 */
export interface ZendeskOauthTokenResponse {
	access_token: string;
	// Only set for oauth clients created on or after 2026-04-30
	expires_in?: number | undefined;
	scope: string;
	token_type: string;
}

export interface ZendeskAccessToken {
	accessToken: string;
	expiresIn: number;
	createdAt: Date;
}

/**
 * Kept in sync by hand with `ReportReason` in
 * hetarchief-client/src/modules/shared/services/zendesk-service/zendesk.types.ts
 */
export enum ReportReason {
	METADATA_ISSUE = 'METADATA_ISSUE',
	GENERAL_QUESTION = 'GENERAL_QUESTION',
	LEGAL_REMARK = 'LEGAL_REMARK',
}

/**
 * Kept in sync by hand with `ReportLegalReason` in
 * hetarchief-client/src/modules/shared/services/zendesk-service/zendesk.types.ts
 */
export enum ReportLegalReason {
	OPT_OUT_OR_REMOVAL = 'OPT_OUT_OR_REMOVAL',
	IP_COMPLAINT = 'IP_COMPLAINT',
	GDPR_PRIVACY = 'GDPR_PRIVACY',
}

// Human-readable labels per reportReason/reportLegalReason, in the reporter's own language, used
// to build the Zendesk ticket subject/body. Resolved through the same admin-managed translations
// module as the client, using the exact same keys as the matching radio option in
// hetarchief-client's ReportBlade.const.ts, so the two stay in sync automatically.
export function getReportReasonLabels(
	translationsService: TranslationsService,
	locale: Locale
): Record<ReportReason, string> {
	return {
		// Own-org METADATA_ISSUE is informational-only and never calls this endpoint, so this key
		// always matches the other-org "Ik heb een probleem met de metadata van dit object" option.
		[ReportReason.METADATA_ISSUE]: translationsService.tText(
			'modules/visitor-space/components/report-blade/report-blade___ik-heb-een-probleem-met-de-metadata-van-dit-object',
			{},
			locale
		),
		[ReportReason.GENERAL_QUESTION]: translationsService.tText(
			'modules/visitor-space/components/report-blade/report-blade___ik-heb-een-ander-probleem-met-dit-object',
			{},
			locale
		),
		[ReportReason.LEGAL_REMARK]: translationsService.tText(
			'modules/visitor-space/components/report-blade/report-blade___ik-wil-een-juridische-opmerking-geven-ivm-auteursrecht-of-gdpr-privacy',
			{},
			locale
		),
	};
}

export function getReportLegalReasonLabels(
	translationsService: TranslationsService,
	locale: Locale
): Record<ReportLegalReason, string> {
	return {
		[ReportLegalReason.OPT_OUT_OR_REMOVAL]: translationsService.tText(
			'modules/visitor-space/components/report-blade/report-blade___ik-ben-rechthebbende-en-wil-een-opt-out-op-de-out-of-commerce-regeling-aanvragen-voor-dit-materiaal-of-een-verwijdering',
			{},
			locale
		),
		[ReportLegalReason.IP_COMPLAINT]: translationsService.tText(
			'modules/visitor-space/components/report-blade/report-blade___ik-ben-rechthebbende-en-wil-een-klacht-indienen-wegens-mogelijke-inbreuk-op-intellectuele-rechten',
			{},
			locale
		),
		[ReportLegalReason.GDPR_PRIVACY]: translationsService.tText(
			'modules/visitor-space/components/report-blade/report-blade___ik-wil-mijn-rechten-uitoefenen-volgens-de-gdpr-of-privacy-wetgeving-met-betrekking-tot-dit-materiaal-vb-portretrecht',
			{},
			locale
		),
	};
}
