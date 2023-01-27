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
