/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: boolean | null | undefined;
  _gt?: boolean | null | undefined;
  _gte?: boolean | null | undefined;
  _in?: Array<boolean> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: boolean | null | undefined;
  _lte?: boolean | null | undefined;
  _neq?: boolean | null | undefined;
  _nin?: Array<boolean> | null | undefined;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: number | null | undefined;
  _gt?: number | null | undefined;
  _gte?: number | null | undefined;
  _in?: Array<number> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: number | null | undefined;
  _lte?: number | null | undefined;
  _neq?: number | null | undefined;
  _nin?: Array<number> | null | undefined;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Array_Comparison_Exp = {
  /** is the array contained in the given array value */
  _contained_in?: Array<string> | null | undefined;
  /** does the array contain the given value */
  _contains?: Array<string> | null | undefined;
  _eq?: Array<string> | null | undefined;
  _gt?: Array<string> | null | undefined;
  _gte?: Array<string> | null | undefined;
  _in?: Array<Array<string>> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: Array<string> | null | undefined;
  _lte?: Array<string> | null | undefined;
  _neq?: Array<string> | null | undefined;
  _nin?: Array<Array<string>> | null | undefined;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: string | null | undefined;
  _gt?: string | null | undefined;
  _gte?: string | null | undefined;
  /** does the column match the given case-insensitive pattern */
  _ilike?: string | null | undefined;
  _in?: Array<string> | null | undefined;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: string | null | undefined;
  _is_null?: boolean | null | undefined;
  /** does the column match the given pattern */
  _like?: string | null | undefined;
  _lt?: string | null | undefined;
  _lte?: string | null | undefined;
  _neq?: string | null | undefined;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: string | null | undefined;
  _nin?: Array<string> | null | undefined;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: string | null | undefined;
  /** does the column NOT match the given pattern */
  _nlike?: string | null | undefined;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: string | null | undefined;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: string | null | undefined;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: string | null | undefined;
  /** does the column match the given SQL regular expression */
  _similar?: string | null | undefined;
};

export type App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp = {
  bool_and?: App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_And = {
  arguments: App_Material_Request_Message_Unread_Status_Select_Column_App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: App_Material_Request_Message_Unread_Status_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_Or = {
  arguments: App_Material_Request_Message_Unread_Status_Select_Column_App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: App_Material_Request_Message_Unread_Status_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Material_Request_Message_Unread_Status_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Material_Request_Message_Unread_Status_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "app.material_request_message_unread_status" */
export type App_Material_Request_Message_Unread_Status_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: App_Material_Request_Message_Unread_Status_Max_Order_By | null | undefined;
  min?: App_Material_Request_Message_Unread_Status_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "app.material_request_message_unread_status" */
export type App_Material_Request_Message_Unread_Status_Arr_Rel_Insert_Input = {
  data: Array<App_Material_Request_Message_Unread_Status_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Material_Request_Message_Unread_Status_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "app.material_request_message_unread_status". All fields are combined with a logical 'AND'. */
export type App_Material_Request_Message_Unread_Status_Bool_Exp = {
  _and?: Array<App_Material_Request_Message_Unread_Status_Bool_Exp> | null | undefined;
  _not?: App_Material_Request_Message_Unread_Status_Bool_Exp | null | undefined;
  _or?: Array<App_Material_Request_Message_Unread_Status_Bool_Exp> | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  is_unread?: Boolean_Comparison_Exp | null | undefined;
  material_request_id?: Uuid_Comparison_Exp | null | undefined;
  material_request_message_id?: Uuid_Comparison_Exp | null | undefined;
  receiver_profile_id?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.material_request_message_unread_status" */
export enum App_Material_Request_Message_Unread_Status_Constraint {
  /** unique or primary key constraint on columns "material_request_message_id", "receiver_profile_id" */
  MaterialRequestMessageUnreMaterialRequestMessageIdRKey = 'material_request_message_unre_material_request_message_id_r_key',
  /** unique or primary key constraint on columns "id" */
  MaterialRequestMessageUnreadStatusPkey = 'material_request_message_unread_status_pkey'
}

/** input type for inserting data into table "app.material_request_message_unread_status" */
export type App_Material_Request_Message_Unread_Status_Insert_Input = {
  id?: any;
  is_unread?: boolean | null | undefined;
  material_request_id?: any;
  material_request_message_id?: any;
  receiver_profile_id?: any;
};

/** order by max() on columns of table "app.material_request_message_unread_status" */
export type App_Material_Request_Message_Unread_Status_Max_Order_By = {
  id?: Order_By | null | undefined;
  material_request_id?: Order_By | null | undefined;
  material_request_message_id?: Order_By | null | undefined;
  receiver_profile_id?: Order_By | null | undefined;
};

/** order by min() on columns of table "app.material_request_message_unread_status" */
export type App_Material_Request_Message_Unread_Status_Min_Order_By = {
  id?: Order_By | null | undefined;
  material_request_id?: Order_By | null | undefined;
  material_request_message_id?: Order_By | null | undefined;
  receiver_profile_id?: Order_By | null | undefined;
};

/** on_conflict condition type for table "app.material_request_message_unread_status" */
export type App_Material_Request_Message_Unread_Status_On_Conflict = {
  constraint: App_Material_Request_Message_Unread_Status_Constraint;
  update_columns?: Array<App_Material_Request_Message_Unread_Status_Update_Column>;
  where?: App_Material_Request_Message_Unread_Status_Bool_Exp | null | undefined;
};

/** select columns of table "app.material_request_message_unread_status" */
export enum App_Material_Request_Message_Unread_Status_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  IsUnread = 'is_unread',
  /** column name */
  MaterialRequestId = 'material_request_id',
  /** column name */
  MaterialRequestMessageId = 'material_request_message_id',
  /** column name */
  ReceiverProfileId = 'receiver_profile_id'
}

/** select "app_material_request_message_unread_status_aggregate_bool_exp_bool_and_arguments_columns" columns of table "app.material_request_message_unread_status" */
export enum App_Material_Request_Message_Unread_Status_Select_Column_App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsUnread = 'is_unread'
}

/** select "app_material_request_message_unread_status_aggregate_bool_exp_bool_or_arguments_columns" columns of table "app.material_request_message_unread_status" */
export enum App_Material_Request_Message_Unread_Status_Select_Column_App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsUnread = 'is_unread'
}

/** update columns of table "app.material_request_message_unread_status" */
export enum App_Material_Request_Message_Unread_Status_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  IsUnread = 'is_unread',
  /** column name */
  MaterialRequestId = 'material_request_id',
  /** column name */
  MaterialRequestMessageId = 'material_request_message_id',
  /** column name */
  ReceiverProfileId = 'receiver_profile_id'
}

export type App_Material_Request_Messages_And_Events_Aggregate_Bool_Exp = {
  count?: App_Material_Request_Messages_And_Events_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Material_Request_Messages_And_Events_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Material_Request_Messages_And_Events_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Material_Request_Messages_And_Events_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "app.material_request_messages_and_events" */
export type App_Material_Request_Messages_And_Events_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: App_Material_Request_Messages_And_Events_Max_Order_By | null | undefined;
  min?: App_Material_Request_Messages_And_Events_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "app.material_request_messages_and_events" */
export type App_Material_Request_Messages_And_Events_Arr_Rel_Insert_Input = {
  data: Array<App_Material_Request_Messages_And_Events_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Material_Request_Messages_And_Events_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "app.material_request_messages_and_events". All fields are combined with a logical 'AND'. */
export type App_Material_Request_Messages_And_Events_Bool_Exp = {
  _and?: Array<App_Material_Request_Messages_And_Events_Bool_Exp> | null | undefined;
  _not?: App_Material_Request_Messages_And_Events_Bool_Exp | null | undefined;
  _or?: Array<App_Material_Request_Messages_And_Events_Bool_Exp> | null | undefined;
  attachment_filename?: String_Comparison_Exp | null | undefined;
  attachment_url?: String_Comparison_Exp | null | undefined;
  attachments?: App_Material_Request_Messages_Attachments_Bool_Exp | null | undefined;
  attachments_aggregate?: App_Material_Request_Messages_Attachments_Aggregate_Bool_Exp | null | undefined;
  body?: Jsonb_Comparison_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  material_request?: App_Material_Requests_Bool_Exp | null | undefined;
  material_request_id?: Uuid_Comparison_Exp | null | undefined;
  message_type?: Lookup_App_Material_Request_Message_Type_Enum_Comparison_Exp | null | undefined;
  sender?: Users_Profile_Bool_Exp | null | undefined;
  sender_profile_id?: Uuid_Comparison_Exp | null | undefined;
  unread_statuses?: App_Material_Request_Message_Unread_Status_Bool_Exp | null | undefined;
  unread_statuses_aggregate?: App_Material_Request_Message_Unread_Status_Aggregate_Bool_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.material_request_messages_and_events" */
export enum App_Material_Request_Messages_And_Events_Constraint {
  /** unique or primary key constraint on columns "id" */
  MaterialRequestMessagesPkey = 'material_request_messages_pkey'
}

/** input type for inserting data into table "app.material_request_messages_and_events" */
export type App_Material_Request_Messages_And_Events_Insert_Input = {
  attachment_filename?: string | null | undefined;
  attachment_url?: string | null | undefined;
  attachments?: App_Material_Request_Messages_Attachments_Arr_Rel_Insert_Input | null | undefined;
  body?: any;
  created_at?: any;
  id?: any;
  material_request?: App_Material_Requests_Obj_Rel_Insert_Input | null | undefined;
  material_request_id?: any;
  message_type?: Lookup_App_Material_Request_Message_Type_Enum | null | undefined;
  sender?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  sender_profile_id?: any;
  unread_statuses?: App_Material_Request_Message_Unread_Status_Arr_Rel_Insert_Input | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "app.material_request_messages_and_events" */
export type App_Material_Request_Messages_And_Events_Max_Order_By = {
  attachment_filename?: Order_By | null | undefined;
  attachment_url?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  material_request_id?: Order_By | null | undefined;
  sender_profile_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "app.material_request_messages_and_events" */
export type App_Material_Request_Messages_And_Events_Min_Order_By = {
  attachment_filename?: Order_By | null | undefined;
  attachment_url?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  material_request_id?: Order_By | null | undefined;
  sender_profile_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** input type for inserting object relation for remote table "app.material_request_messages_and_events" */
export type App_Material_Request_Messages_And_Events_Obj_Rel_Insert_Input = {
  data: App_Material_Request_Messages_And_Events_Insert_Input;
  /** upsert condition */
  on_conflict?: App_Material_Request_Messages_And_Events_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "app.material_request_messages_and_events" */
export type App_Material_Request_Messages_And_Events_On_Conflict = {
  constraint: App_Material_Request_Messages_And_Events_Constraint;
  update_columns?: Array<App_Material_Request_Messages_And_Events_Update_Column>;
  where?: App_Material_Request_Messages_And_Events_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "app.material_request_messages_and_events". */
export type App_Material_Request_Messages_And_Events_Order_By = {
  attachment_filename?: Order_By | null | undefined;
  attachment_url?: Order_By | null | undefined;
  attachments_aggregate?: App_Material_Request_Messages_Attachments_Aggregate_Order_By | null | undefined;
  body?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  material_request?: App_Material_Requests_Order_By | null | undefined;
  material_request_id?: Order_By | null | undefined;
  message_type?: Order_By | null | undefined;
  sender?: Users_Profile_Order_By | null | undefined;
  sender_profile_id?: Order_By | null | undefined;
  unread_statuses_aggregate?: App_Material_Request_Message_Unread_Status_Aggregate_Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** select columns of table "app.material_request_messages_and_events" */
export enum App_Material_Request_Messages_And_Events_Select_Column {
  /** column name */
  AttachmentFilename = 'attachment_filename',
  /** column name */
  AttachmentUrl = 'attachment_url',
  /** column name */
  Body = 'body',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MaterialRequestId = 'material_request_id',
  /** column name */
  MessageType = 'message_type',
  /** column name */
  SenderProfileId = 'sender_profile_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "app.material_request_messages_and_events" */
export enum App_Material_Request_Messages_And_Events_Update_Column {
  /** column name */
  AttachmentFilename = 'attachment_filename',
  /** column name */
  AttachmentUrl = 'attachment_url',
  /** column name */
  Body = 'body',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MaterialRequestId = 'material_request_id',
  /** column name */
  MessageType = 'message_type',
  /** column name */
  SenderProfileId = 'sender_profile_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type App_Material_Request_Messages_Attachments_Aggregate_Bool_Exp = {
  count?: App_Material_Request_Messages_Attachments_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Material_Request_Messages_Attachments_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Material_Request_Messages_Attachments_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Material_Request_Messages_Attachments_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "app.material_request_messages_attachments" */
export type App_Material_Request_Messages_Attachments_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: App_Material_Request_Messages_Attachments_Max_Order_By | null | undefined;
  min?: App_Material_Request_Messages_Attachments_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "app.material_request_messages_attachments" */
export type App_Material_Request_Messages_Attachments_Arr_Rel_Insert_Input = {
  data: Array<App_Material_Request_Messages_Attachments_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Material_Request_Messages_Attachments_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "app.material_request_messages_attachments". All fields are combined with a logical 'AND'. */
export type App_Material_Request_Messages_Attachments_Bool_Exp = {
  _and?: Array<App_Material_Request_Messages_Attachments_Bool_Exp> | null | undefined;
  _not?: App_Material_Request_Messages_Attachments_Bool_Exp | null | undefined;
  _or?: Array<App_Material_Request_Messages_Attachments_Bool_Exp> | null | undefined;
  attachment_filename?: String_Comparison_Exp | null | undefined;
  attachment_url?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  material_request_message_id?: Uuid_Comparison_Exp | null | undefined;
  messages_and_event?: App_Material_Request_Messages_And_Events_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.material_request_messages_attachments" */
export enum App_Material_Request_Messages_Attachments_Constraint {
  /** unique or primary key constraint on columns "material_request_message_id", "attachment_url" */
  MaterialRequestMessagesAttachmentsMaterialRequestMessage = 'material_request_messages_attachments_material_request_message_',
  /** unique or primary key constraint on columns "id" */
  MaterialRequestMessagesAttachmentsPkey = 'material_request_messages_attachments_pkey'
}

/** input type for inserting data into table "app.material_request_messages_attachments" */
export type App_Material_Request_Messages_Attachments_Insert_Input = {
  attachment_filename?: string | null | undefined;
  attachment_url?: string | null | undefined;
  created_at?: any;
  id?: any;
  material_request_message_id?: any;
  messages_and_event?: App_Material_Request_Messages_And_Events_Obj_Rel_Insert_Input | null | undefined;
};

/** order by max() on columns of table "app.material_request_messages_attachments" */
export type App_Material_Request_Messages_Attachments_Max_Order_By = {
  attachment_filename?: Order_By | null | undefined;
  attachment_url?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  material_request_message_id?: Order_By | null | undefined;
};

/** order by min() on columns of table "app.material_request_messages_attachments" */
export type App_Material_Request_Messages_Attachments_Min_Order_By = {
  attachment_filename?: Order_By | null | undefined;
  attachment_url?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  material_request_message_id?: Order_By | null | undefined;
};

/** on_conflict condition type for table "app.material_request_messages_attachments" */
export type App_Material_Request_Messages_Attachments_On_Conflict = {
  constraint: App_Material_Request_Messages_Attachments_Constraint;
  update_columns?: Array<App_Material_Request_Messages_Attachments_Update_Column>;
  where?: App_Material_Request_Messages_Attachments_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "app.material_request_messages_attachments". */
export type App_Material_Request_Messages_Attachments_Order_By = {
  attachment_filename?: Order_By | null | undefined;
  attachment_url?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  material_request_message_id?: Order_By | null | undefined;
  messages_and_event?: App_Material_Request_Messages_And_Events_Order_By | null | undefined;
};

/** select columns of table "app.material_request_messages_attachments" */
export enum App_Material_Request_Messages_Attachments_Select_Column {
  /** column name */
  AttachmentFilename = 'attachment_filename',
  /** column name */
  AttachmentUrl = 'attachment_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MaterialRequestMessageId = 'material_request_message_id'
}

/** update columns of table "app.material_request_messages_attachments" */
export enum App_Material_Request_Messages_Attachments_Update_Column {
  /** column name */
  AttachmentFilename = 'attachment_filename',
  /** column name */
  AttachmentUrl = 'attachment_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MaterialRequestMessageId = 'material_request_message_id'
}

export type App_Material_Request_Reuse_Form_Values_Aggregate_Bool_Exp = {
  count?: App_Material_Request_Reuse_Form_Values_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Material_Request_Reuse_Form_Values_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Material_Request_Reuse_Form_Values_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Material_Request_Reuse_Form_Values_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "app.material_request_reuse_form_values" */
export type App_Material_Request_Reuse_Form_Values_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: App_Material_Request_Reuse_Form_Values_Max_Order_By | null | undefined;
  min?: App_Material_Request_Reuse_Form_Values_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "app.material_request_reuse_form_values" */
export type App_Material_Request_Reuse_Form_Values_Arr_Rel_Insert_Input = {
  data: Array<App_Material_Request_Reuse_Form_Values_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Material_Request_Reuse_Form_Values_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "app.material_request_reuse_form_values". All fields are combined with a logical 'AND'. */
export type App_Material_Request_Reuse_Form_Values_Bool_Exp = {
  _and?: Array<App_Material_Request_Reuse_Form_Values_Bool_Exp> | null | undefined;
  _not?: App_Material_Request_Reuse_Form_Values_Bool_Exp | null | undefined;
  _or?: Array<App_Material_Request_Reuse_Form_Values_Bool_Exp> | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  key?: String_Comparison_Exp | null | undefined;
  material_request_id?: Uuid_Comparison_Exp | null | undefined;
  value?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.material_request_reuse_form_values" */
export enum App_Material_Request_Reuse_Form_Values_Constraint {
  /** unique or primary key constraint on columns "id" */
  MaterialRequestReuseFormValuesPkey = 'material_request_reuse_form_values_pkey'
}

/** input type for inserting data into table "app.material_request_reuse_form_values" */
export type App_Material_Request_Reuse_Form_Values_Insert_Input = {
  id?: any;
  key?: string | null | undefined;
  material_request_id?: any;
  value?: string | null | undefined;
};

/** order by max() on columns of table "app.material_request_reuse_form_values" */
export type App_Material_Request_Reuse_Form_Values_Max_Order_By = {
  id?: Order_By | null | undefined;
  key?: Order_By | null | undefined;
  material_request_id?: Order_By | null | undefined;
  value?: Order_By | null | undefined;
};

/** order by min() on columns of table "app.material_request_reuse_form_values" */
export type App_Material_Request_Reuse_Form_Values_Min_Order_By = {
  id?: Order_By | null | undefined;
  key?: Order_By | null | undefined;
  material_request_id?: Order_By | null | undefined;
  value?: Order_By | null | undefined;
};

/** on_conflict condition type for table "app.material_request_reuse_form_values" */
export type App_Material_Request_Reuse_Form_Values_On_Conflict = {
  constraint: App_Material_Request_Reuse_Form_Values_Constraint;
  update_columns?: Array<App_Material_Request_Reuse_Form_Values_Update_Column>;
  where?: App_Material_Request_Reuse_Form_Values_Bool_Exp | null | undefined;
};

/** select columns of table "app.material_request_reuse_form_values" */
export enum App_Material_Request_Reuse_Form_Values_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Key = 'key',
  /** column name */
  MaterialRequestId = 'material_request_id',
  /** column name */
  Value = 'value'
}

/** update columns of table "app.material_request_reuse_form_values" */
export enum App_Material_Request_Reuse_Form_Values_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Key = 'key',
  /** column name */
  MaterialRequestId = 'material_request_id',
  /** column name */
  Value = 'value'
}

/** Boolean expression to filter rows from the table "app.material_requests". All fields are combined with a logical 'AND'. */
export type App_Material_Requests_Bool_Exp = {
  _and?: Array<App_Material_Requests_Bool_Exp> | null | undefined;
  _not?: App_Material_Requests_Bool_Exp | null | undefined;
  _or?: Array<App_Material_Requests_Bool_Exp> | null | undefined;
  approved_at?: Timestamp_Comparison_Exp | null | undefined;
  cancelled_at?: Timestamp_Comparison_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  denied_at?: Timestamp_Comparison_Exp | null | undefined;
  download_available_at?: Timestamp_Comparison_Exp | null | undefined;
  download_expiry_warning_email_sent?: Boolean_Comparison_Exp | null | undefined;
  download_job_id?: String_Comparison_Exp | null | undefined;
  download_retries?: Int_Comparison_Exp | null | undefined;
  download_status?: Lookup_App_Material_Request_Download_Status_Enum_Comparison_Exp | null | undefined;
  download_url?: String_Comparison_Exp | null | undefined;
  group_id?: Uuid_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  ie_object_id?: String_Comparison_Exp | null | undefined;
  ie_object_representation_id?: String_Comparison_Exp | null | undefined;
  intellectualEntity?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  is_archived?: Boolean_Comparison_Exp | null | undefined;
  is_pending?: Boolean_Comparison_Exp | null | undefined;
  material_request_reuse_form_values?: App_Material_Request_Reuse_Form_Values_Bool_Exp | null | undefined;
  material_request_reuse_form_values_aggregate?: App_Material_Request_Reuse_Form_Values_Aggregate_Bool_Exp | null | undefined;
  messages_and_events?: App_Material_Request_Messages_And_Events_Bool_Exp | null | undefined;
  messages_and_events_aggregate?: App_Material_Request_Messages_And_Events_Aggregate_Bool_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  objectRepresentation?: Graph_Representation_Bool_Exp | null | undefined;
  organisation?: Graph_Organization_Bool_Exp | null | undefined;
  organisation_id?: String_Comparison_Exp | null | undefined;
  organisation_name?: String_Comparison_Exp | null | undefined;
  profile_id?: Uuid_Comparison_Exp | null | undefined;
  reason?: String_Comparison_Exp | null | undefined;
  requested_at?: Timestamp_Comparison_Exp | null | undefined;
  requested_by?: Users_Profile_Bool_Exp | null | undefined;
  requester_capacity?: Lookup_App_Material_Request_Requester_Capacity_Enum_Comparison_Exp | null | undefined;
  status?: Lookup_App_Material_Request_Status_Enum_Comparison_Exp | null | undefined;
  status_info?: Lookup_App_Material_Request_Status_Sort_Order_Bool_Exp | null | undefined;
  status_motivation?: String_Comparison_Exp | null | undefined;
  type?: Lookup_App_Material_Request_Type_Enum_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.material_requests" */
export enum App_Material_Requests_Constraint {
  /** unique or primary key constraint on columns "id" */
  MaterialRequestsPkey = 'material_requests_pkey'
}

/** input type for inserting data into table "app.material_requests" */
export type App_Material_Requests_Insert_Input = {
  approved_at?: any;
  cancelled_at?: any;
  created_at?: any;
  denied_at?: any;
  download_available_at?: any;
  download_expiry_warning_email_sent?: boolean | null | undefined;
  download_job_id?: string | null | undefined;
  download_retries?: number | null | undefined;
  download_status?: Lookup_App_Material_Request_Download_Status_Enum | null | undefined;
  download_url?: string | null | undefined;
  group_id?: any;
  id?: any;
  ie_object_id?: string | null | undefined;
  ie_object_representation_id?: string | null | undefined;
  intellectualEntity?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  is_archived?: boolean | null | undefined;
  is_pending?: boolean | null | undefined;
  material_request_reuse_form_values?: App_Material_Request_Reuse_Form_Values_Arr_Rel_Insert_Input | null | undefined;
  messages_and_events?: App_Material_Request_Messages_And_Events_Arr_Rel_Insert_Input | null | undefined;
  name?: string | null | undefined;
  objectRepresentation?: Graph_Representation_Obj_Rel_Insert_Input | null | undefined;
  organisation?: Graph_Organization_Obj_Rel_Insert_Input | null | undefined;
  organisation_id?: string | null | undefined;
  organisation_name?: string | null | undefined;
  profile_id?: any;
  reason?: string | null | undefined;
  requested_at?: any;
  requested_by?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  requester_capacity?: Lookup_App_Material_Request_Requester_Capacity_Enum | null | undefined;
  status?: Lookup_App_Material_Request_Status_Enum | null | undefined;
  status_info?: Lookup_App_Material_Request_Status_Sort_Order_Obj_Rel_Insert_Input | null | undefined;
  status_motivation?: string | null | undefined;
  type?: Lookup_App_Material_Request_Type_Enum | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "app.material_requests" */
export type App_Material_Requests_Obj_Rel_Insert_Input = {
  data: App_Material_Requests_Insert_Input;
  /** upsert condition */
  on_conflict?: App_Material_Requests_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "app.material_requests" */
export type App_Material_Requests_On_Conflict = {
  constraint: App_Material_Requests_Constraint;
  update_columns?: Array<App_Material_Requests_Update_Column>;
  where?: App_Material_Requests_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "app.material_requests". */
export type App_Material_Requests_Order_By = {
  approved_at?: Order_By | null | undefined;
  cancelled_at?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  denied_at?: Order_By | null | undefined;
  download_available_at?: Order_By | null | undefined;
  download_expiry_warning_email_sent?: Order_By | null | undefined;
  download_job_id?: Order_By | null | undefined;
  download_retries?: Order_By | null | undefined;
  download_status?: Order_By | null | undefined;
  download_url?: Order_By | null | undefined;
  group_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  ie_object_id?: Order_By | null | undefined;
  ie_object_representation_id?: Order_By | null | undefined;
  intellectualEntity?: Graph_Intellectual_Entity_Order_By | null | undefined;
  is_archived?: Order_By | null | undefined;
  is_pending?: Order_By | null | undefined;
  material_request_reuse_form_values_aggregate?: App_Material_Request_Reuse_Form_Values_Aggregate_Order_By | null | undefined;
  messages_and_events_aggregate?: App_Material_Request_Messages_And_Events_Aggregate_Order_By | null | undefined;
  name?: Order_By | null | undefined;
  objectRepresentation?: Graph_Representation_Order_By | null | undefined;
  organisation?: Graph_Organization_Order_By | null | undefined;
  organisation_id?: Order_By | null | undefined;
  organisation_name?: Order_By | null | undefined;
  profile_id?: Order_By | null | undefined;
  reason?: Order_By | null | undefined;
  requested_at?: Order_By | null | undefined;
  requested_by?: Users_Profile_Order_By | null | undefined;
  requester_capacity?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
  status_info?: Lookup_App_Material_Request_Status_Sort_Order_Order_By | null | undefined;
  status_motivation?: Order_By | null | undefined;
  type?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** input type for updating data in table "app.material_requests" */
export type App_Material_Requests_Set_Input = {
  approved_at?: any;
  cancelled_at?: any;
  created_at?: any;
  denied_at?: any;
  download_available_at?: any;
  download_expiry_warning_email_sent?: boolean | null | undefined;
  download_job_id?: string | null | undefined;
  download_retries?: number | null | undefined;
  download_status?: Lookup_App_Material_Request_Download_Status_Enum | null | undefined;
  download_url?: string | null | undefined;
  group_id?: any;
  id?: any;
  ie_object_id?: string | null | undefined;
  ie_object_representation_id?: string | null | undefined;
  is_archived?: boolean | null | undefined;
  is_pending?: boolean | null | undefined;
  name?: string | null | undefined;
  organisation_id?: string | null | undefined;
  organisation_name?: string | null | undefined;
  profile_id?: any;
  reason?: string | null | undefined;
  requested_at?: any;
  requester_capacity?: Lookup_App_Material_Request_Requester_Capacity_Enum | null | undefined;
  status?: Lookup_App_Material_Request_Status_Enum | null | undefined;
  status_motivation?: string | null | undefined;
  type?: Lookup_App_Material_Request_Type_Enum | null | undefined;
  updated_at?: any;
};

/** update columns of table "app.material_requests" */
export enum App_Material_Requests_Update_Column {
  /** column name */
  ApprovedAt = 'approved_at',
  /** column name */
  CancelledAt = 'cancelled_at',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DeniedAt = 'denied_at',
  /** column name */
  DownloadAvailableAt = 'download_available_at',
  /** column name */
  DownloadExpiryWarningEmailSent = 'download_expiry_warning_email_sent',
  /** column name */
  DownloadJobId = 'download_job_id',
  /** column name */
  DownloadRetries = 'download_retries',
  /** column name */
  DownloadStatus = 'download_status',
  /** column name */
  DownloadUrl = 'download_url',
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  IeObjectId = 'ie_object_id',
  /** column name */
  IeObjectRepresentationId = 'ie_object_representation_id',
  /** column name */
  IsArchived = 'is_archived',
  /** column name */
  IsPending = 'is_pending',
  /** column name */
  Name = 'name',
  /** column name */
  OrganisationId = 'organisation_id',
  /** column name */
  OrganisationName = 'organisation_name',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  Reason = 'reason',
  /** column name */
  RequestedAt = 'requested_at',
  /** column name */
  RequesterCapacity = 'requester_capacity',
  /** column name */
  Status = 'status',
  /** column name */
  StatusMotivation = 'status_motivation',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type App_Notification_Aggregate_Bool_Exp = {
  count?: App_Notification_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Notification_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Notification_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Notification_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "app.notification" */
export type App_Notification_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: App_Notification_Max_Order_By | null | undefined;
  min?: App_Notification_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "app.notification" */
export type App_Notification_Arr_Rel_Insert_Input = {
  data: Array<App_Notification_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Notification_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "app.notification". All fields are combined with a logical 'AND'. */
export type App_Notification_Bool_Exp = {
  _and?: Array<App_Notification_Bool_Exp> | null | undefined;
  _not?: App_Notification_Bool_Exp | null | undefined;
  _or?: Array<App_Notification_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  linked_entity_id?: Uuid_Comparison_Exp | null | undefined;
  material_request?: App_Material_Requests_Bool_Exp | null | undefined;
  recipient?: Uuid_Comparison_Exp | null | undefined;
  recipient_profile?: Users_Profile_Bool_Exp | null | undefined;
  status?: String_Comparison_Exp | null | undefined;
  title?: String_Comparison_Exp | null | undefined;
  type?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  visitor_space_request?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.notification" */
export enum App_Notification_Constraint {
  /** unique or primary key constraint on columns "id" */
  NotificationPkey = 'notification_pkey'
}

/** input type for inserting data into table "app.notification" */
export type App_Notification_Insert_Input = {
  created_at?: any;
  description?: string | null | undefined;
  id?: any;
  /** Indien de melding een entiteit (bezoekersaanvraag, materiaalaanvraag, ...) betreft */
  linked_entity_id?: any;
  material_request?: App_Material_Requests_Obj_Rel_Insert_Input | null | undefined;
  /** Profile id van de bedoelde ontvanger */
  recipient?: any;
  recipient_profile?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  status?: string | null | undefined;
  title?: string | null | undefined;
  type?: string | null | undefined;
  updated_at?: any;
  visitor_space_request?: Maintainer_Visitor_Space_Request_Obj_Rel_Insert_Input | null | undefined;
};

/** order by max() on columns of table "app.notification" */
export type App_Notification_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  description?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  /** Indien de melding een entiteit (bezoekersaanvraag, materiaalaanvraag, ...) betreft */
  linked_entity_id?: Order_By | null | undefined;
  /** Profile id van de bedoelde ontvanger */
  recipient?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
  title?: Order_By | null | undefined;
  type?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "app.notification" */
export type App_Notification_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  description?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  /** Indien de melding een entiteit (bezoekersaanvraag, materiaalaanvraag, ...) betreft */
  linked_entity_id?: Order_By | null | undefined;
  /** Profile id van de bedoelde ontvanger */
  recipient?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
  title?: Order_By | null | undefined;
  type?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "app.notification" */
export type App_Notification_On_Conflict = {
  constraint: App_Notification_Constraint;
  update_columns?: Array<App_Notification_Update_Column>;
  where?: App_Notification_Bool_Exp | null | undefined;
};

/** select columns of table "app.notification" */
export enum App_Notification_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  LinkedEntityId = 'linked_entity_id',
  /** column name */
  Recipient = 'recipient',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "app.notification" */
export type App_Notification_Set_Input = {
  created_at?: any;
  description?: string | null | undefined;
  id?: any;
  /** Indien de melding een entiteit (bezoekersaanvraag, materiaalaanvraag, ...) betreft */
  linked_entity_id?: any;
  /** Profile id van de bedoelde ontvanger */
  recipient?: any;
  status?: string | null | undefined;
  title?: string | null | undefined;
  type?: string | null | undefined;
  updated_at?: any;
};

/** update columns of table "app.notification" */
export enum App_Notification_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  LinkedEntityId = 'linked_entity_id',
  /** column name */
  Recipient = 'recipient',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type App_Theme_Aggregate_Bool_Exp = {
  count?: App_Theme_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Theme_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Theme_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Theme_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "app.theme" */
export type App_Theme_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: App_Theme_Max_Order_By | null | undefined;
  min?: App_Theme_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "app.theme" */
export type App_Theme_Arr_Rel_Insert_Input = {
  data: Array<App_Theme_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Theme_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "app.theme". All fields are combined with a logical 'AND'. */
export type App_Theme_Bool_Exp = {
  _and?: Array<App_Theme_Bool_Exp> | null | undefined;
  _not?: App_Theme_Bool_Exp | null | undefined;
  _or?: Array<App_Theme_Bool_Exp> | null | undefined;
  content_page_path_en?: String_Comparison_Exp | null | undefined;
  content_page_path_nl?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  description_en?: String_Comparison_Exp | null | undefined;
  description_nl?: String_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  ieObjectLinks?: App_Theme_Intellectual_Entity_Bool_Exp | null | undefined;
  ieObjectLinksRandomOrder?: App_Theme_Intellectual_Entity_Random_Order_Bool_Exp | null | undefined;
  ieObjectLinksRandomOrder_aggregate?: App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp | null | undefined;
  ieObjectLinks_aggregate?: App_Theme_Intellectual_Entity_Aggregate_Bool_Exp | null | undefined;
  image_url?: String_Comparison_Exp | null | undefined;
  name_en?: String_Comparison_Exp | null | undefined;
  name_nl?: String_Comparison_Exp | null | undefined;
  slug?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.theme" */
export enum App_Theme_Constraint {
  /** unique or primary key constraint on columns "id" */
  IntellectualEntityThemesPkey = 'intellectual_entity_themes_pkey',
  /** unique or primary key constraint on columns "slug" */
  IntellectualEntityThemesSlugKey = 'intellectual_entity_themes_slug_key'
}

/** input type for inserting data into table "app.theme" */
export type App_Theme_Insert_Input = {
  content_page_path_en?: string | null | undefined;
  content_page_path_nl?: string | null | undefined;
  created_at?: any;
  description_en?: string | null | undefined;
  description_nl?: string | null | undefined;
  id?: any;
  ieObjectLinks?: App_Theme_Intellectual_Entity_Arr_Rel_Insert_Input | null | undefined;
  ieObjectLinksRandomOrder?: App_Theme_Intellectual_Entity_Random_Order_Arr_Rel_Insert_Input | null | undefined;
  image_url?: string | null | undefined;
  name_en?: string | null | undefined;
  name_nl?: string | null | undefined;
  slug?: string | null | undefined;
  updated_at?: any;
};

export type App_Theme_Intellectual_Entity_Aggregate_Bool_Exp = {
  count?: App_Theme_Intellectual_Entity_Aggregate_Bool_Exp_Count | null | undefined;
};

export type App_Theme_Intellectual_Entity_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Theme_Intellectual_Entity_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Theme_Intellectual_Entity_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "app.theme_intellectual_entity" */
export type App_Theme_Intellectual_Entity_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: App_Theme_Intellectual_Entity_Max_Order_By | null | undefined;
  min?: App_Theme_Intellectual_Entity_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "app.theme_intellectual_entity" */
export type App_Theme_Intellectual_Entity_Arr_Rel_Insert_Input = {
  data: Array<App_Theme_Intellectual_Entity_Insert_Input>;
  /** upsert condition */
  on_conflict?: App_Theme_Intellectual_Entity_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "app.theme_intellectual_entity". All fields are combined with a logical 'AND'. */
export type App_Theme_Intellectual_Entity_Bool_Exp = {
  _and?: Array<App_Theme_Intellectual_Entity_Bool_Exp> | null | undefined;
  _not?: App_Theme_Intellectual_Entity_Bool_Exp | null | undefined;
  _or?: Array<App_Theme_Intellectual_Entity_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  ieObject?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  theme_id?: Uuid_Comparison_Exp | null | undefined;
  themes?: App_Theme_Bool_Exp | null | undefined;
  themes_aggregate?: App_Theme_Aggregate_Bool_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "app.theme_intellectual_entity" */
export enum App_Theme_Intellectual_Entity_Constraint {
  /** unique or primary key constraint on columns "id" */
  ThemeIntellectualEntityPkey = 'theme_intellectual_entity_pkey',
  /** unique or primary key constraint on columns "theme_id", "intellectual_entity_id" */
  ThemeIntellectualEntityThemeIdIntellectualEntityIdKey = 'theme_intellectual_entity_theme_id_intellectual_entity_id_key'
}

/** input type for inserting data into table "app.theme_intellectual_entity" */
export type App_Theme_Intellectual_Entity_Insert_Input = {
  created_at?: any;
  id?: any;
  ieObject?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  theme_id?: any;
  themes?: App_Theme_Arr_Rel_Insert_Input | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "app.theme_intellectual_entity" */
export type App_Theme_Intellectual_Entity_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  theme_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "app.theme_intellectual_entity" */
export type App_Theme_Intellectual_Entity_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  theme_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "app.theme_intellectual_entity" */
export type App_Theme_Intellectual_Entity_On_Conflict = {
  constraint: App_Theme_Intellectual_Entity_Constraint;
  update_columns?: Array<App_Theme_Intellectual_Entity_Update_Column>;
  where?: App_Theme_Intellectual_Entity_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "app.theme_intellectual_entity". */
export type App_Theme_Intellectual_Entity_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  ieObject?: Graph_Intellectual_Entity_Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  theme_id?: Order_By | null | undefined;
  themes_aggregate?: App_Theme_Aggregate_Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

export type App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp = {
  avg?: App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Avg | null | undefined;
  corr?: App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Corr | null | undefined;
  count?: App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Count | null | undefined;
  covar_samp?: App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Covar_Samp | null | undefined;
  max?: App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Max | null | undefined;
  min?: App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Min | null | undefined;
  stddev_samp?: App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Stddev_Samp | null | undefined;
  sum?: App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Sum | null | undefined;
  var_samp?: App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Var_Samp | null | undefined;
};

export type App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Avg = {
  arguments: App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Avg_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: App_Theme_Intellectual_Entity_Random_Order_Bool_Exp | null | undefined;
  predicate: Float8_Comparison_Exp;
};

export type App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Corr = {
  arguments: App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Corr_Arguments;
  distinct?: boolean | null | undefined;
  filter?: App_Theme_Intellectual_Entity_Random_Order_Bool_Exp | null | undefined;
  predicate: Float8_Comparison_Exp;
};

export type App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Corr_Arguments = {
  X: App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Corr_Arguments_Columns;
  Y: App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Corr_Arguments_Columns;
};

export type App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Count = {
  arguments?: Array<App_Theme_Intellectual_Entity_Random_Order_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: App_Theme_Intellectual_Entity_Random_Order_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

export type App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Covar_Samp = {
  arguments: App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Covar_Samp_Arguments;
  distinct?: boolean | null | undefined;
  filter?: App_Theme_Intellectual_Entity_Random_Order_Bool_Exp | null | undefined;
  predicate: Float8_Comparison_Exp;
};

export type App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Covar_Samp_Arguments = {
  X: App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
  Y: App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns;
};

export type App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Max = {
  arguments: App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Max_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: App_Theme_Intellectual_Entity_Random_Order_Bool_Exp | null | undefined;
  predicate: Float8_Comparison_Exp;
};

export type App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Min = {
  arguments: App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Min_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: App_Theme_Intellectual_Entity_Random_Order_Bool_Exp | null | undefined;
  predicate: Float8_Comparison_Exp;
};

export type App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Stddev_Samp = {
  arguments: App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: App_Theme_Intellectual_Entity_Random_Order_Bool_Exp | null | undefined;
  predicate: Float8_Comparison_Exp;
};

export type App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Sum = {
  arguments: App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Sum_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: App_Theme_Intellectual_Entity_Random_Order_Bool_Exp | null | undefined;
  predicate: Float8_Comparison_Exp;
};

export type App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Var_Samp = {
  arguments: App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: App_Theme_Intellectual_Entity_Random_Order_Bool_Exp | null | undefined;
  predicate: Float8_Comparison_Exp;
};

/** order by aggregate values of table "app.theme_intellectual_entity_random_order" */
export type App_Theme_Intellectual_Entity_Random_Order_Aggregate_Order_By = {
  avg?: App_Theme_Intellectual_Entity_Random_Order_Avg_Order_By | null | undefined;
  count?: Order_By | null | undefined;
  max?: App_Theme_Intellectual_Entity_Random_Order_Max_Order_By | null | undefined;
  min?: App_Theme_Intellectual_Entity_Random_Order_Min_Order_By | null | undefined;
  stddev?: App_Theme_Intellectual_Entity_Random_Order_Stddev_Order_By | null | undefined;
  stddev_pop?: App_Theme_Intellectual_Entity_Random_Order_Stddev_Pop_Order_By | null | undefined;
  stddev_samp?: App_Theme_Intellectual_Entity_Random_Order_Stddev_Samp_Order_By | null | undefined;
  sum?: App_Theme_Intellectual_Entity_Random_Order_Sum_Order_By | null | undefined;
  var_pop?: App_Theme_Intellectual_Entity_Random_Order_Var_Pop_Order_By | null | undefined;
  var_samp?: App_Theme_Intellectual_Entity_Random_Order_Var_Samp_Order_By | null | undefined;
  variance?: App_Theme_Intellectual_Entity_Random_Order_Variance_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "app.theme_intellectual_entity_random_order" */
export type App_Theme_Intellectual_Entity_Random_Order_Arr_Rel_Insert_Input = {
  data: Array<App_Theme_Intellectual_Entity_Random_Order_Insert_Input>;
};

/** order by avg() on columns of table "app.theme_intellectual_entity_random_order" */
export type App_Theme_Intellectual_Entity_Random_Order_Avg_Order_By = {
  random_sort?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "app.theme_intellectual_entity_random_order". All fields are combined with a logical 'AND'. */
export type App_Theme_Intellectual_Entity_Random_Order_Bool_Exp = {
  _and?: Array<App_Theme_Intellectual_Entity_Random_Order_Bool_Exp> | null | undefined;
  _not?: App_Theme_Intellectual_Entity_Random_Order_Bool_Exp | null | undefined;
  _or?: Array<App_Theme_Intellectual_Entity_Random_Order_Bool_Exp> | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  ieObject?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  random_sort?: Float8_Comparison_Exp | null | undefined;
  theme_id?: Uuid_Comparison_Exp | null | undefined;
  themes?: App_Theme_Bool_Exp | null | undefined;
  themes_aggregate?: App_Theme_Aggregate_Bool_Exp | null | undefined;
};

/** input type for inserting data into table "app.theme_intellectual_entity_random_order" */
export type App_Theme_Intellectual_Entity_Random_Order_Insert_Input = {
  id?: any;
  ieObject?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  random_sort?: any;
  theme_id?: any;
  themes?: App_Theme_Arr_Rel_Insert_Input | null | undefined;
};

/** order by max() on columns of table "app.theme_intellectual_entity_random_order" */
export type App_Theme_Intellectual_Entity_Random_Order_Max_Order_By = {
  id?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  random_sort?: Order_By | null | undefined;
  theme_id?: Order_By | null | undefined;
};

/** order by min() on columns of table "app.theme_intellectual_entity_random_order" */
export type App_Theme_Intellectual_Entity_Random_Order_Min_Order_By = {
  id?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  random_sort?: Order_By | null | undefined;
  theme_id?: Order_By | null | undefined;
};

/** select columns of table "app.theme_intellectual_entity_random_order" */
export enum App_Theme_Intellectual_Entity_Random_Order_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  RandomSort = 'random_sort',
  /** column name */
  ThemeId = 'theme_id'
}

/** select "app_theme_intellectual_entity_random_order_aggregate_bool_exp_avg_arguments_columns" columns of table "app.theme_intellectual_entity_random_order" */
export enum App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Avg_Arguments_Columns {
  /** column name */
  RandomSort = 'random_sort'
}

/** select "app_theme_intellectual_entity_random_order_aggregate_bool_exp_corr_arguments_columns" columns of table "app.theme_intellectual_entity_random_order" */
export enum App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Corr_Arguments_Columns {
  /** column name */
  RandomSort = 'random_sort'
}

/** select "app_theme_intellectual_entity_random_order_aggregate_bool_exp_covar_samp_arguments_columns" columns of table "app.theme_intellectual_entity_random_order" */
export enum App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Covar_Samp_Arguments_Columns {
  /** column name */
  RandomSort = 'random_sort'
}

/** select "app_theme_intellectual_entity_random_order_aggregate_bool_exp_max_arguments_columns" columns of table "app.theme_intellectual_entity_random_order" */
export enum App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Max_Arguments_Columns {
  /** column name */
  RandomSort = 'random_sort'
}

/** select "app_theme_intellectual_entity_random_order_aggregate_bool_exp_min_arguments_columns" columns of table "app.theme_intellectual_entity_random_order" */
export enum App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Min_Arguments_Columns {
  /** column name */
  RandomSort = 'random_sort'
}

/** select "app_theme_intellectual_entity_random_order_aggregate_bool_exp_stddev_samp_arguments_columns" columns of table "app.theme_intellectual_entity_random_order" */
export enum App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Stddev_Samp_Arguments_Columns {
  /** column name */
  RandomSort = 'random_sort'
}

/** select "app_theme_intellectual_entity_random_order_aggregate_bool_exp_sum_arguments_columns" columns of table "app.theme_intellectual_entity_random_order" */
export enum App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Sum_Arguments_Columns {
  /** column name */
  RandomSort = 'random_sort'
}

/** select "app_theme_intellectual_entity_random_order_aggregate_bool_exp_var_samp_arguments_columns" columns of table "app.theme_intellectual_entity_random_order" */
export enum App_Theme_Intellectual_Entity_Random_Order_Select_Column_App_Theme_Intellectual_Entity_Random_Order_Aggregate_Bool_Exp_Var_Samp_Arguments_Columns {
  /** column name */
  RandomSort = 'random_sort'
}

/** order by stddev() on columns of table "app.theme_intellectual_entity_random_order" */
export type App_Theme_Intellectual_Entity_Random_Order_Stddev_Order_By = {
  random_sort?: Order_By | null | undefined;
};

/** order by stddev_pop() on columns of table "app.theme_intellectual_entity_random_order" */
export type App_Theme_Intellectual_Entity_Random_Order_Stddev_Pop_Order_By = {
  random_sort?: Order_By | null | undefined;
};

/** order by stddev_samp() on columns of table "app.theme_intellectual_entity_random_order" */
export type App_Theme_Intellectual_Entity_Random_Order_Stddev_Samp_Order_By = {
  random_sort?: Order_By | null | undefined;
};

/** order by sum() on columns of table "app.theme_intellectual_entity_random_order" */
export type App_Theme_Intellectual_Entity_Random_Order_Sum_Order_By = {
  random_sort?: Order_By | null | undefined;
};

/** order by var_pop() on columns of table "app.theme_intellectual_entity_random_order" */
export type App_Theme_Intellectual_Entity_Random_Order_Var_Pop_Order_By = {
  random_sort?: Order_By | null | undefined;
};

/** order by var_samp() on columns of table "app.theme_intellectual_entity_random_order" */
export type App_Theme_Intellectual_Entity_Random_Order_Var_Samp_Order_By = {
  random_sort?: Order_By | null | undefined;
};

/** order by variance() on columns of table "app.theme_intellectual_entity_random_order" */
export type App_Theme_Intellectual_Entity_Random_Order_Variance_Order_By = {
  random_sort?: Order_By | null | undefined;
};

/** select columns of table "app.theme_intellectual_entity" */
export enum App_Theme_Intellectual_Entity_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  ThemeId = 'theme_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "app.theme_intellectual_entity" */
export enum App_Theme_Intellectual_Entity_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  ThemeId = 'theme_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** order by max() on columns of table "app.theme" */
export type App_Theme_Max_Order_By = {
  content_page_path_en?: Order_By | null | undefined;
  content_page_path_nl?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  description_en?: Order_By | null | undefined;
  description_nl?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  image_url?: Order_By | null | undefined;
  name_en?: Order_By | null | undefined;
  name_nl?: Order_By | null | undefined;
  slug?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "app.theme" */
export type App_Theme_Min_Order_By = {
  content_page_path_en?: Order_By | null | undefined;
  content_page_path_nl?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  description_en?: Order_By | null | undefined;
  description_nl?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  image_url?: Order_By | null | undefined;
  name_en?: Order_By | null | undefined;
  name_nl?: Order_By | null | undefined;
  slug?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "app.theme" */
export type App_Theme_On_Conflict = {
  constraint: App_Theme_Constraint;
  update_columns?: Array<App_Theme_Update_Column>;
  where?: App_Theme_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "app.theme". */
export type App_Theme_Order_By = {
  content_page_path_en?: Order_By | null | undefined;
  content_page_path_nl?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  description_en?: Order_By | null | undefined;
  description_nl?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  ieObjectLinksRandomOrder_aggregate?: App_Theme_Intellectual_Entity_Random_Order_Aggregate_Order_By | null | undefined;
  ieObjectLinks_aggregate?: App_Theme_Intellectual_Entity_Aggregate_Order_By | null | undefined;
  image_url?: Order_By | null | undefined;
  name_en?: Order_By | null | undefined;
  name_nl?: Order_By | null | undefined;
  slug?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** select columns of table "app.theme" */
export enum App_Theme_Select_Column {
  /** column name */
  ContentPagePathEn = 'content_page_path_en',
  /** column name */
  ContentPagePathNl = 'content_page_path_nl',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DescriptionEn = 'description_en',
  /** column name */
  DescriptionNl = 'description_nl',
  /** column name */
  Id = 'id',
  /** column name */
  ImageUrl = 'image_url',
  /** column name */
  NameEn = 'name_en',
  /** column name */
  NameNl = 'name_nl',
  /** column name */
  Slug = 'slug',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "app.theme" */
export type App_Theme_Set_Input = {
  content_page_path_en?: string | null | undefined;
  content_page_path_nl?: string | null | undefined;
  created_at?: any;
  description_en?: string | null | undefined;
  description_nl?: string | null | undefined;
  id?: any;
  image_url?: string | null | undefined;
  name_en?: string | null | undefined;
  name_nl?: string | null | undefined;
  slug?: string | null | undefined;
  updated_at?: any;
};

/** update columns of table "app.theme" */
export enum App_Theme_Update_Column {
  /** column name */
  ContentPagePathEn = 'content_page_path_en',
  /** column name */
  ContentPagePathNl = 'content_page_path_nl',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DescriptionEn = 'description_en',
  /** column name */
  DescriptionNl = 'description_nl',
  /** column name */
  Id = 'id',
  /** column name */
  ImageUrl = 'image_url',
  /** column name */
  NameEn = 'name_en',
  /** column name */
  NameNl = 'name_nl',
  /** column name */
  Slug = 'slug',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

/** Boolean expression to compare columns of type "ebucore_annotation_source". All fields are combined with logical 'AND'. */
export type Ebucore_Annotation_Source_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

/** Boolean expression to filter rows from the table "graph._dcterms_rights_statement". All fields are combined with a logical 'AND'. */
export type Graph__Dcterms_Rights_Statement_Bool_Exp = {
  _and?: Array<Graph__Dcterms_Rights_Statement_Bool_Exp> | null | undefined;
  _not?: Graph__Dcterms_Rights_Statement_Bool_Exp | null | undefined;
  _or?: Array<Graph__Dcterms_Rights_Statement_Bool_Exp> | null | undefined;
  dcterms_rights_statement?: String_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._dcterms_rights_statement" */
export type Graph__Dcterms_Rights_Statement_Insert_Input = {
  dcterms_rights_statement?: string | null | undefined;
  intellectual_entity_id?: string | null | undefined;
};

/** input type for inserting object relation for remote table "graph._dcterms_rights_statement" */
export type Graph__Dcterms_Rights_Statement_Obj_Rel_Insert_Input = {
  data: Graph__Dcterms_Rights_Statement_Insert_Input;
};

export type Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Aggregate_Bool_Exp = {
  count?: Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph._ebucore_annotation_is_annotated_media_resource" */
export type Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Arr_Rel_Insert_Input = {
  data: Array<Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Insert_Input>;
};

/** Boolean expression to filter rows from the table "graph._ebucore_annotation_is_annotated_media_resource". All fields are combined with a logical 'AND'. */
export type Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Bool_Exp = {
  _and?: Array<Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Bool_Exp> | null | undefined;
  _not?: Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Bool_Exp | null | undefined;
  _or?: Array<Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  ebucore_annotation_id?: String_Comparison_Exp | null | undefined;
  end_offset?: Numeric_Comparison_Exp | null | undefined;
  height?: Int_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  start_offset?: Numeric_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  width?: Int_Comparison_Exp | null | undefined;
  x?: Int_Comparison_Exp | null | undefined;
  y?: Int_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._ebucore_annotation_is_annotated_media_resource" */
export type Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Insert_Input = {
  created_at?: any;
  ebucore_annotation_id?: string | null | undefined;
  end_offset?: any;
  height?: number | null | undefined;
  id?: string | null | undefined;
  start_offset?: any;
  updated_at?: any;
  width?: number | null | undefined;
  x?: number | null | undefined;
  y?: number | null | undefined;
};

/** select columns of table "graph._ebucore_annotation_is_annotated_media_resource" */
export enum Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EbucoreAnnotationId = 'ebucore_annotation_id',
  /** column name */
  EndOffset = 'end_offset',
  /** column name */
  Height = 'height',
  /** column name */
  Id = 'id',
  /** column name */
  StartOffset = 'start_offset',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Width = 'width',
  /** column name */
  X = 'x',
  /** column name */
  Y = 'y'
}

export type Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp = {
  bool_and?: Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_And = {
  arguments: Graph__File_Ebucore_Has_Captioning_Select_Column_Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph__File_Ebucore_Has_Captioning_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Graph__File_Ebucore_Has_Captioning_Select_Column_Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph__File_Ebucore_Has_Captioning_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph__File_Ebucore_Has_Captioning_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph__File_Ebucore_Has_Captioning_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Aggregate_Order_By = {
  avg?: Graph__File_Ebucore_Has_Captioning_Avg_Order_By | null | undefined;
  count?: Order_By | null | undefined;
  max?: Graph__File_Ebucore_Has_Captioning_Max_Order_By | null | undefined;
  min?: Graph__File_Ebucore_Has_Captioning_Min_Order_By | null | undefined;
  stddev?: Graph__File_Ebucore_Has_Captioning_Stddev_Order_By | null | undefined;
  stddev_pop?: Graph__File_Ebucore_Has_Captioning_Stddev_Pop_Order_By | null | undefined;
  stddev_samp?: Graph__File_Ebucore_Has_Captioning_Stddev_Samp_Order_By | null | undefined;
  sum?: Graph__File_Ebucore_Has_Captioning_Sum_Order_By | null | undefined;
  var_pop?: Graph__File_Ebucore_Has_Captioning_Var_Pop_Order_By | null | undefined;
  var_samp?: Graph__File_Ebucore_Has_Captioning_Var_Samp_Order_By | null | undefined;
  variance?: Graph__File_Ebucore_Has_Captioning_Variance_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Arr_Rel_Insert_Input = {
  data: Array<Graph__File_Ebucore_Has_Captioning_Insert_Input>;
};

/** order by avg() on columns of table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Avg_Order_By = {
  schema_duration?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "graph._file_ebucore_has_captioning". All fields are combined with a logical 'AND'. */
export type Graph__File_Ebucore_Has_Captioning_Bool_Exp = {
  _and?: Array<Graph__File_Ebucore_Has_Captioning_Bool_Exp> | null | undefined;
  _not?: Graph__File_Ebucore_Has_Captioning_Bool_Exp | null | undefined;
  _or?: Array<Graph__File_Ebucore_Has_Captioning_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  ebucore_has_mime_type?: String_Comparison_Exp | null | undefined;
  edm_is_next_in_sequence?: String_Comparison_Exp | null | undefined;
  file_id?: String_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  is_ai_generated?: Boolean_Comparison_Exp | null | undefined;
  mh_fragment_identifier?: String_Comparison_Exp | null | undefined;
  premis_original_name?: String_Comparison_Exp | null | undefined;
  premis_stored_at?: String_Comparison_Exp | null | undefined;
  schema_duration?: Numeric_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_thumbnail_url?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Insert_Input = {
  created_at?: any;
  ebucore_has_mime_type?: string | null | undefined;
  edm_is_next_in_sequence?: string | null | undefined;
  file_id?: string | null | undefined;
  id?: string | null | undefined;
  is_ai_generated?: boolean | null | undefined;
  mh_fragment_identifier?: string | null | undefined;
  premis_original_name?: string | null | undefined;
  premis_stored_at?: string | null | undefined;
  schema_duration?: any;
  schema_name?: string | null | undefined;
  schema_thumbnail_url?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  ebucore_has_mime_type?: Order_By | null | undefined;
  edm_is_next_in_sequence?: Order_By | null | undefined;
  file_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  mh_fragment_identifier?: Order_By | null | undefined;
  premis_original_name?: Order_By | null | undefined;
  premis_stored_at?: Order_By | null | undefined;
  schema_duration?: Order_By | null | undefined;
  schema_name?: Order_By | null | undefined;
  schema_thumbnail_url?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  ebucore_has_mime_type?: Order_By | null | undefined;
  edm_is_next_in_sequence?: Order_By | null | undefined;
  file_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  mh_fragment_identifier?: Order_By | null | undefined;
  premis_original_name?: Order_By | null | undefined;
  premis_stored_at?: Order_By | null | undefined;
  schema_duration?: Order_By | null | undefined;
  schema_name?: Order_By | null | undefined;
  schema_thumbnail_url?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** select columns of table "graph._file_ebucore_has_captioning" */
export enum Graph__File_Ebucore_Has_Captioning_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EbucoreHasMimeType = 'ebucore_has_mime_type',
  /** column name */
  EdmIsNextInSequence = 'edm_is_next_in_sequence',
  /** column name */
  FileId = 'file_id',
  /** column name */
  Id = 'id',
  /** column name */
  IsAiGenerated = 'is_ai_generated',
  /** column name */
  MhFragmentIdentifier = 'mh_fragment_identifier',
  /** column name */
  PremisOriginalName = 'premis_original_name',
  /** column name */
  PremisStoredAt = 'premis_stored_at',
  /** column name */
  SchemaDuration = 'schema_duration',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "graph__file_ebucore_has_captioning_aggregate_bool_exp_bool_and_arguments_columns" columns of table "graph._file_ebucore_has_captioning" */
export enum Graph__File_Ebucore_Has_Captioning_Select_Column_Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** select "graph__file_ebucore_has_captioning_aggregate_bool_exp_bool_or_arguments_columns" columns of table "graph._file_ebucore_has_captioning" */
export enum Graph__File_Ebucore_Has_Captioning_Select_Column_Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** order by stddev() on columns of table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Stddev_Order_By = {
  schema_duration?: Order_By | null | undefined;
};

/** order by stddev_pop() on columns of table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Stddev_Pop_Order_By = {
  schema_duration?: Order_By | null | undefined;
};

/** order by stddev_samp() on columns of table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Stddev_Samp_Order_By = {
  schema_duration?: Order_By | null | undefined;
};

/** order by sum() on columns of table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Sum_Order_By = {
  schema_duration?: Order_By | null | undefined;
};

/** order by var_pop() on columns of table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Var_Pop_Order_By = {
  schema_duration?: Order_By | null | undefined;
};

/** order by var_samp() on columns of table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Var_Samp_Order_By = {
  schema_duration?: Order_By | null | undefined;
};

/** order by variance() on columns of table "graph._file_ebucore_has_captioning" */
export type Graph__File_Ebucore_Has_Captioning_Variance_Order_By = {
  schema_duration?: Order_By | null | undefined;
};

export type Graph__File_Has_Annotation_Aggregate_Bool_Exp = {
  bool_and?: Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Graph__File_Has_Annotation_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_And = {
  arguments: Graph__File_Has_Annotation_Select_Column_Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph__File_Has_Annotation_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Graph__File_Has_Annotation_Select_Column_Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph__File_Has_Annotation_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph__File_Has_Annotation_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph__File_Has_Annotation_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph__File_Has_Annotation_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Aggregate_Order_By = {
  avg?: Graph__File_Has_Annotation_Avg_Order_By | null | undefined;
  count?: Order_By | null | undefined;
  max?: Graph__File_Has_Annotation_Max_Order_By | null | undefined;
  min?: Graph__File_Has_Annotation_Min_Order_By | null | undefined;
  stddev?: Graph__File_Has_Annotation_Stddev_Order_By | null | undefined;
  stddev_pop?: Graph__File_Has_Annotation_Stddev_Pop_Order_By | null | undefined;
  stddev_samp?: Graph__File_Has_Annotation_Stddev_Samp_Order_By | null | undefined;
  sum?: Graph__File_Has_Annotation_Sum_Order_By | null | undefined;
  var_pop?: Graph__File_Has_Annotation_Var_Pop_Order_By | null | undefined;
  var_samp?: Graph__File_Has_Annotation_Var_Samp_Order_By | null | undefined;
  variance?: Graph__File_Has_Annotation_Variance_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Arr_Rel_Insert_Input = {
  data: Array<Graph__File_Has_Annotation_Insert_Input>;
};

/** order by avg() on columns of table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Avg_Order_By = {
  annotation_confidence?: Order_By | null | undefined;
  character_end_index?: Order_By | null | undefined;
  character_start_index?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "graph._file_has_annotation". All fields are combined with a logical 'AND'. */
export type Graph__File_Has_Annotation_Bool_Exp = {
  _and?: Array<Graph__File_Has_Annotation_Bool_Exp> | null | undefined;
  _not?: Graph__File_Has_Annotation_Bool_Exp | null | undefined;
  _or?: Array<Graph__File_Has_Annotation_Bool_Exp> | null | undefined;
  annotation_confidence?: Numeric_Comparison_Exp | null | undefined;
  annotation_type?: String_Comparison_Exp | null | undefined;
  character_end_index?: Int_Comparison_Exp | null | undefined;
  character_start_index?: Int_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  file_id?: String_Comparison_Exp | null | undefined;
  has_annotation_related_artefact?: String_Comparison_Exp | null | undefined;
  has_annotation_related_artefact_thing?: Graph_Thing_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  is_ai_generated?: Boolean_Comparison_Exp | null | undefined;
  is_annotated_media_resource?: Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Bool_Exp | null | undefined;
  is_annotated_media_resource_aggregate?: Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Aggregate_Bool_Exp | null | undefined;
  source?: Ebucore_Annotation_Source_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Insert_Input = {
  annotation_confidence?: any;
  annotation_type?: string | null | undefined;
  character_end_index?: number | null | undefined;
  character_start_index?: number | null | undefined;
  created_at?: any;
  file_id?: string | null | undefined;
  has_annotation_related_artefact?: string | null | undefined;
  has_annotation_related_artefact_thing?: Graph_Thing_Obj_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  is_ai_generated?: boolean | null | undefined;
  is_annotated_media_resource?: Graph__Ebucore_Annotation_Is_Annotated_Media_Resource_Arr_Rel_Insert_Input | null | undefined;
  source?: any;
  updated_at?: any;
};

/** order by max() on columns of table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Max_Order_By = {
  annotation_confidence?: Order_By | null | undefined;
  annotation_type?: Order_By | null | undefined;
  character_end_index?: Order_By | null | undefined;
  character_start_index?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  file_id?: Order_By | null | undefined;
  has_annotation_related_artefact?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  source?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Min_Order_By = {
  annotation_confidence?: Order_By | null | undefined;
  annotation_type?: Order_By | null | undefined;
  character_end_index?: Order_By | null | undefined;
  character_start_index?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  file_id?: Order_By | null | undefined;
  has_annotation_related_artefact?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  source?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** select columns of table "graph._file_has_annotation" */
export enum Graph__File_Has_Annotation_Select_Column {
  /** column name */
  AnnotationConfidence = 'annotation_confidence',
  /** column name */
  AnnotationType = 'annotation_type',
  /** column name */
  CharacterEndIndex = 'character_end_index',
  /** column name */
  CharacterStartIndex = 'character_start_index',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FileId = 'file_id',
  /** column name */
  HasAnnotationRelatedArtefact = 'has_annotation_related_artefact',
  /** column name */
  Id = 'id',
  /** column name */
  IsAiGenerated = 'is_ai_generated',
  /** column name */
  Source = 'source',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "graph__file_has_annotation_aggregate_bool_exp_bool_and_arguments_columns" columns of table "graph._file_has_annotation" */
export enum Graph__File_Has_Annotation_Select_Column_Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** select "graph__file_has_annotation_aggregate_bool_exp_bool_or_arguments_columns" columns of table "graph._file_has_annotation" */
export enum Graph__File_Has_Annotation_Select_Column_Graph__File_Has_Annotation_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** order by stddev() on columns of table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Stddev_Order_By = {
  annotation_confidence?: Order_By | null | undefined;
  character_end_index?: Order_By | null | undefined;
  character_start_index?: Order_By | null | undefined;
};

/** order by stddev_pop() on columns of table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Stddev_Pop_Order_By = {
  annotation_confidence?: Order_By | null | undefined;
  character_end_index?: Order_By | null | undefined;
  character_start_index?: Order_By | null | undefined;
};

/** order by stddev_samp() on columns of table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Stddev_Samp_Order_By = {
  annotation_confidence?: Order_By | null | undefined;
  character_end_index?: Order_By | null | undefined;
  character_start_index?: Order_By | null | undefined;
};

/** order by sum() on columns of table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Sum_Order_By = {
  annotation_confidence?: Order_By | null | undefined;
  character_end_index?: Order_By | null | undefined;
  character_start_index?: Order_By | null | undefined;
};

/** order by var_pop() on columns of table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Var_Pop_Order_By = {
  annotation_confidence?: Order_By | null | undefined;
  character_end_index?: Order_By | null | undefined;
  character_start_index?: Order_By | null | undefined;
};

/** order by var_samp() on columns of table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Var_Samp_Order_By = {
  annotation_confidence?: Order_By | null | undefined;
  character_end_index?: Order_By | null | undefined;
  character_start_index?: Order_By | null | undefined;
};

/** order by variance() on columns of table "graph._file_has_annotation" */
export type Graph__File_Has_Annotation_Variance_Order_By = {
  annotation_confidence?: Order_By | null | undefined;
  character_end_index?: Order_By | null | undefined;
  character_start_index?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "graph._film_has_audio". All fields are combined with a logical 'AND'. */
export type Graph__Film_Has_Audio_Bool_Exp = {
  _and?: Array<Graph__Film_Has_Audio_Bool_Exp> | null | undefined;
  _not?: Graph__Film_Has_Audio_Bool_Exp | null | undefined;
  _or?: Array<Graph__Film_Has_Audio_Bool_Exp> | null | undefined;
  audio?: Boolean_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._film_has_audio" */
export type Graph__Film_Has_Audio_Insert_Input = {
  audio?: boolean | null | undefined;
  intellectual_entity_id?: string | null | undefined;
};

/** input type for inserting object relation for remote table "graph._film_has_audio" */
export type Graph__Film_Has_Audio_Obj_Rel_Insert_Input = {
  data: Graph__Film_Has_Audio_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._ha_des_coloring_type". All fields are combined with a logical 'AND'. */
export type Graph__Ha_Des_Coloring_Type_Bool_Exp = {
  _and?: Array<Graph__Ha_Des_Coloring_Type_Bool_Exp> | null | undefined;
  _not?: Graph__Ha_Des_Coloring_Type_Bool_Exp | null | undefined;
  _or?: Array<Graph__Ha_Des_Coloring_Type_Bool_Exp> | null | undefined;
  ha_des_coloring_type?: Jsonb_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._ha_des_coloring_type" */
export type Graph__Ha_Des_Coloring_Type_Insert_Input = {
  ha_des_coloring_type?: any;
  intellectual_entity_id?: string | null | undefined;
};

/** input type for inserting object relation for remote table "graph._ha_des_coloring_type" */
export type Graph__Ha_Des_Coloring_Type_Obj_Rel_Insert_Input = {
  data: Graph__Ha_Des_Coloring_Type_Insert_Input;
};

export type Graph__Highlight_Aggregate_Bool_Exp = {
  count?: Graph__Highlight_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph__Highlight_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph__Highlight_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph__Highlight_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph._highlight" */
export type Graph__Highlight_Arr_Rel_Insert_Input = {
  data: Array<Graph__Highlight_Insert_Input>;
};

/** Boolean expression to filter rows from the table "graph._highlight". All fields are combined with a logical 'AND'. */
export type Graph__Highlight_Bool_Exp = {
  _and?: Array<Graph__Highlight_Bool_Exp> | null | undefined;
  _not?: Graph__Highlight_Bool_Exp | null | undefined;
  _or?: Array<Graph__Highlight_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  height?: Int_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  schema_mentions_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  width?: Int_Comparison_Exp | null | undefined;
  x?: Int_Comparison_Exp | null | undefined;
  y?: Int_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._highlight" */
export type Graph__Highlight_Insert_Input = {
  created_at?: any;
  height?: number | null | undefined;
  id?: string | null | undefined;
  schema_mentions_id?: string | null | undefined;
  updated_at?: any;
  width?: number | null | undefined;
  x?: number | null | undefined;
  y?: number | null | undefined;
};

/** select columns of table "graph._highlight" */
export enum Graph__Highlight_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Height = 'height',
  /** column name */
  Id = 'id',
  /** column name */
  SchemaMentionsId = 'schema_mentions_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Width = 'width',
  /** column name */
  X = 'x',
  /** column name */
  Y = 'y'
}

export type Graph__Intellectual_Entity_Aggregate_Bool_Exp = {
  count?: Graph__Intellectual_Entity_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph__Intellectual_Entity_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph__Intellectual_Entity_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph__Intellectual_Entity_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph._intellectual_entity" */
export type Graph__Intellectual_Entity_Arr_Rel_Insert_Input = {
  data: Array<Graph__Intellectual_Entity_Insert_Input>;
};

/** Boolean expression to filter rows from the table "graph._intellectual_entity". All fields are combined with a logical 'AND'. */
export type Graph__Intellectual_Entity_Bool_Exp = {
  _and?: Array<Graph__Intellectual_Entity_Bool_Exp> | null | undefined;
  _not?: Graph__Intellectual_Entity_Bool_Exp | null | undefined;
  _or?: Array<Graph__Intellectual_Entity_Bool_Exp> | null | undefined;
  bibframe_edition?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  dctermsRightsStatement?: Graph__Dcterms_Rights_Statement_Bool_Exp | null | undefined;
  dcterms_available?: String_Comparison_Exp | null | undefined;
  dcterms_format?: String_Comparison_Exp | null | undefined;
  dcterms_medium?: Jsonb_Comparison_Exp | null | undefined;
  dcterms_rights?: String_Comparison_Exp | null | undefined;
  ebucoreSynopses?: Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp | null | undefined;
  ebucoreSynopses_aggregate?: Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp | null | undefined;
  ebucore_has_cast_member?: String_Comparison_Exp | null | undefined;
  ebucore_has_object_type?: String_Comparison_Exp | null | undefined;
  ebucore_synopsis?: String_Comparison_Exp | null | undefined;
  folderIntellectualEntities?: Users_Folder_Ie_Bool_Exp | null | undefined;
  folderIntellectualEntities_aggregate?: Users_Folder_Ie_Aggregate_Bool_Exp | null | undefined;
  haDesColoringType?: Graph__Ha_Des_Coloring_Type_Bool_Exp | null | undefined;
  haDesLicenseDistributors?: Graph_Hades_License_Distributor_Bool_Exp | null | undefined;
  haDesLicenseDistributors_aggregate?: Graph_Hades_License_Distributor_Aggregate_Bool_Exp | null | undefined;
  hasAudio?: Graph__Film_Has_Audio_Bool_Exp | null | undefined;
  hasCarrier?: Graph_Carrier_Bool_Exp | null | undefined;
  hasPart?: Graph__Intellectual_Entity_Bool_Exp | null | undefined;
  hasPart_aggregate?: Graph__Intellectual_Entity_Aggregate_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  intellectualEntity?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  isPartOf?: Graph__Intellectual_Entity_Bool_Exp | null | undefined;
  isRepresentedBy?: Graph__Representation_Bool_Exp | null | undefined;
  isRepresentedBy_aggregate?: Graph__Representation_Aggregate_Bool_Exp | null | undefined;
  meemoo_identifier?: Jsonb_Comparison_Exp | null | undefined;
  meemoo_local_id?: Jsonb_Comparison_Exp | null | undefined;
  premisIdentifier?: Graph__Premis_Identifier_Bool_Exp | null | undefined;
  premis_is_part_of?: String_Comparison_Exp | null | undefined;
  rights?: Graph_Rights_Bool_Exp | null | undefined;
  schemaCopyrightHolder?: Graph_Schema_Copyright_Holder_Bool_Exp | null | undefined;
  schemaCopyrightHolder_aggregate?: Graph_Schema_Copyright_Holder_Aggregate_Bool_Exp | null | undefined;
  schemaGenre?: Graph__Schema_Genre_Bool_Exp | null | undefined;
  schemaInLanguage?: Graph__Schema_In_Language_Bool_Exp | null | undefined;
  schemaIsPartOf?: Graph_Schema_Is_Part_Of_Bool_Exp | null | undefined;
  schemaIsPartOf_aggregate?: Graph_Schema_Is_Part_Of_Aggregate_Bool_Exp | null | undefined;
  schemaKeywords?: Graph__Schema_Keywords_Bool_Exp | null | undefined;
  schemaMaintainer?: Graph_Organization_Bool_Exp | null | undefined;
  schemaMentions?: Graph_Schema_Mentions_Bool_Exp | null | undefined;
  schemaMentions_aggregate?: Graph_Schema_Mentions_Aggregate_Bool_Exp | null | undefined;
  schemaNames?: Graph_Intellectual_Entity_Schema_Name_Bool_Exp | null | undefined;
  schemaNames_aggregate?: Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp | null | undefined;
  schemaPublisher?: Graph__Schema_Publisher_Bool_Exp | null | undefined;
  schemaSpatial?: Graph__Schema_Spatial_Bool_Exp | null | undefined;
  schemaTemporal?: Graph__Schema_Temporal_Bool_Exp | null | undefined;
  schemaTranscript?: Graph__Schema_Transcript_Bool_Exp | null | undefined;
  schema_abstract?: String_Comparison_Exp | null | undefined;
  schema_copyright_notice?: String_Comparison_Exp | null | undefined;
  schema_creator?: Jsonb_Comparison_Exp | null | undefined;
  schema_date_created?: String_Comparison_Exp | null | undefined;
  schema_date_published?: String_Comparison_Exp | null | undefined;
  schema_description?: String_Comparison_Exp | null | undefined;
  schema_duration?: Interval_Comparison_Exp | null | undefined;
  schema_identifier?: String_Comparison_Exp | null | undefined;
  schema_is_part_of?: Jsonb_Comparison_Exp | null | undefined;
  schema_license?: Jsonb_Comparison_Exp | null | undefined;
  schema_maintainer?: String_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_number_of_pages?: Int_Comparison_Exp | null | undefined;
  schema_position?: Int_Comparison_Exp | null | undefined;
  schema_thumbnail_url?: Jsonb_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._intellectual_entity" */
export type Graph__Intellectual_Entity_Insert_Input = {
  bibframe_edition?: string | null | undefined;
  created_at?: any;
  dctermsRightsStatement?: Graph__Dcterms_Rights_Statement_Obj_Rel_Insert_Input | null | undefined;
  dcterms_available?: string | null | undefined;
  dcterms_format?: string | null | undefined;
  dcterms_medium?: any;
  dcterms_rights?: string | null | undefined;
  ebucoreSynopses?: Graph_Intellectual_Entity_Ebucore_Synopsis_Arr_Rel_Insert_Input | null | undefined;
  ebucore_has_cast_member?: string | null | undefined;
  ebucore_has_object_type?: string | null | undefined;
  ebucore_synopsis?: string | null | undefined;
  folderIntellectualEntities?: Users_Folder_Ie_Arr_Rel_Insert_Input | null | undefined;
  haDesColoringType?: Graph__Ha_Des_Coloring_Type_Obj_Rel_Insert_Input | null | undefined;
  haDesLicenseDistributors?: Graph_Hades_License_Distributor_Arr_Rel_Insert_Input | null | undefined;
  hasAudio?: Graph__Film_Has_Audio_Obj_Rel_Insert_Input | null | undefined;
  hasCarrier?: Graph_Carrier_Obj_Rel_Insert_Input | null | undefined;
  hasPart?: Graph__Intellectual_Entity_Arr_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  intellectualEntity?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  isPartOf?: Graph__Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  isRepresentedBy?: Graph__Representation_Arr_Rel_Insert_Input | null | undefined;
  meemoo_identifier?: any;
  meemoo_local_id?: any;
  premisIdentifier?: Graph__Premis_Identifier_Obj_Rel_Insert_Input | null | undefined;
  premis_is_part_of?: string | null | undefined;
  rights?: Graph_Rights_Obj_Rel_Insert_Input | null | undefined;
  schemaCopyrightHolder?: Graph_Schema_Copyright_Holder_Arr_Rel_Insert_Input | null | undefined;
  schemaGenre?: Graph__Schema_Genre_Obj_Rel_Insert_Input | null | undefined;
  schemaInLanguage?: Graph__Schema_In_Language_Obj_Rel_Insert_Input | null | undefined;
  schemaIsPartOf?: Graph_Schema_Is_Part_Of_Arr_Rel_Insert_Input | null | undefined;
  schemaKeywords?: Graph__Schema_Keywords_Obj_Rel_Insert_Input | null | undefined;
  schemaMaintainer?: Graph_Organization_Obj_Rel_Insert_Input | null | undefined;
  schemaMentions?: Graph_Schema_Mentions_Arr_Rel_Insert_Input | null | undefined;
  schemaNames?: Graph_Intellectual_Entity_Schema_Name_Arr_Rel_Insert_Input | null | undefined;
  schemaPublisher?: Graph__Schema_Publisher_Obj_Rel_Insert_Input | null | undefined;
  schemaSpatial?: Graph__Schema_Spatial_Obj_Rel_Insert_Input | null | undefined;
  schemaTemporal?: Graph__Schema_Temporal_Obj_Rel_Insert_Input | null | undefined;
  schemaTranscript?: Graph__Schema_Transcript_Obj_Rel_Insert_Input | null | undefined;
  schema_abstract?: string | null | undefined;
  schema_copyright_notice?: string | null | undefined;
  schema_creator?: any;
  schema_date_created?: string | null | undefined;
  schema_date_published?: string | null | undefined;
  schema_description?: string | null | undefined;
  schema_duration?: any;
  schema_identifier?: string | null | undefined;
  schema_is_part_of?: any;
  schema_license?: any;
  schema_maintainer?: string | null | undefined;
  schema_name?: string | null | undefined;
  schema_number_of_pages?: number | null | undefined;
  schema_position?: number | null | undefined;
  schema_thumbnail_url?: any;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph._intellectual_entity" */
export type Graph__Intellectual_Entity_Obj_Rel_Insert_Input = {
  data: Graph__Intellectual_Entity_Insert_Input;
};

/** select columns of table "graph._intellectual_entity" */
export enum Graph__Intellectual_Entity_Select_Column {
  /** column name */
  BibframeEdition = 'bibframe_edition',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DctermsAvailable = 'dcterms_available',
  /** column name */
  DctermsFormat = 'dcterms_format',
  /** column name */
  DctermsMedium = 'dcterms_medium',
  /** column name */
  DctermsRights = 'dcterms_rights',
  /** column name */
  EbucoreHasCastMember = 'ebucore_has_cast_member',
  /** column name */
  EbucoreHasObjectType = 'ebucore_has_object_type',
  /** column name */
  EbucoreSynopsis = 'ebucore_synopsis',
  /** column name */
  Id = 'id',
  /** column name */
  MeemooIdentifier = 'meemoo_identifier',
  /** column name */
  MeemooLocalId = 'meemoo_local_id',
  /** column name */
  PremisIsPartOf = 'premis_is_part_of',
  /** column name */
  SchemaAbstract = 'schema_abstract',
  /** column name */
  SchemaCopyrightNotice = 'schema_copyright_notice',
  /** column name */
  SchemaCreator = 'schema_creator',
  /** column name */
  SchemaDateCreated = 'schema_date_created',
  /** column name */
  SchemaDatePublished = 'schema_date_published',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaDuration = 'schema_duration',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaIsPartOf = 'schema_is_part_of',
  /** column name */
  SchemaLicense = 'schema_license',
  /** column name */
  SchemaMaintainer = 'schema_maintainer',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaNumberOfPages = 'schema_number_of_pages',
  /** column name */
  SchemaPosition = 'schema_position',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "graph._premis_identifier". All fields are combined with a logical 'AND'. */
export type Graph__Premis_Identifier_Bool_Exp = {
  _and?: Array<Graph__Premis_Identifier_Bool_Exp> | null | undefined;
  _not?: Graph__Premis_Identifier_Bool_Exp | null | undefined;
  _or?: Array<Graph__Premis_Identifier_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  premis_identifier?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._premis_identifier" */
export type Graph__Premis_Identifier_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  premis_identifier?: any;
};

/** input type for inserting object relation for remote table "graph._premis_identifier" */
export type Graph__Premis_Identifier_Obj_Rel_Insert_Input = {
  data: Graph__Premis_Identifier_Insert_Input;
};

export type Graph__Representation_Aggregate_Bool_Exp = {
  count?: Graph__Representation_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph__Representation_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph__Representation_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph__Representation_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph._representation" */
export type Graph__Representation_Arr_Rel_Insert_Input = {
  data: Array<Graph__Representation_Insert_Input>;
};

/** Boolean expression to filter rows from the table "graph._representation". All fields are combined with a logical 'AND'. */
export type Graph__Representation_Bool_Exp = {
  _and?: Array<Graph__Representation_Bool_Exp> | null | undefined;
  _not?: Graph__Representation_Bool_Exp | null | undefined;
  _or?: Array<Graph__Representation_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  edm_is_next_in_sequence?: String_Comparison_Exp | null | undefined;
  hasRoot?: Graph_File_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  includes?: Graph_Includes_Bool_Exp | null | undefined;
  includes_aggregate?: Graph_Includes_Aggregate_Bool_Exp | null | undefined;
  isMediaFragmentOf?: Graph_File_Bool_Exp | null | undefined;
  is_media_fragment_of?: String_Comparison_Exp | null | undefined;
  premis_represents?: String_Comparison_Exp | null | undefined;
  relation_has_root?: String_Comparison_Exp | null | undefined;
  relation_has_source?: String_Comparison_Exp | null | undefined;
  represents?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  schemaTranscriptUrls?: Graph_Schema_Transcript_Url_Bool_Exp | null | undefined;
  schema_caption?: String_Comparison_Exp | null | undefined;
  schema_end_time?: Time_Comparison_Exp | null | undefined;
  schema_in_language?: String_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_start_time?: Time_Comparison_Exp | null | undefined;
  schema_transcript?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._representation" */
export type Graph__Representation_Insert_Input = {
  created_at?: any;
  edm_is_next_in_sequence?: string | null | undefined;
  hasRoot?: Graph_File_Obj_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  includes?: Graph_Includes_Arr_Rel_Insert_Input | null | undefined;
  isMediaFragmentOf?: Graph_File_Obj_Rel_Insert_Input | null | undefined;
  is_media_fragment_of?: string | null | undefined;
  premis_represents?: string | null | undefined;
  relation_has_root?: string | null | undefined;
  relation_has_source?: string | null | undefined;
  represents?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  schemaTranscriptUrls?: Graph_Schema_Transcript_Url_Obj_Rel_Insert_Input | null | undefined;
  schema_caption?: string | null | undefined;
  schema_end_time?: any;
  schema_in_language?: string | null | undefined;
  schema_name?: string | null | undefined;
  schema_start_time?: any;
  schema_transcript?: string | null | undefined;
  updated_at?: any;
};

/** select columns of table "graph._representation" */
export enum Graph__Representation_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EdmIsNextInSequence = 'edm_is_next_in_sequence',
  /** column name */
  Id = 'id',
  /** column name */
  IsMediaFragmentOf = 'is_media_fragment_of',
  /** column name */
  PremisRepresents = 'premis_represents',
  /** column name */
  RelationHasRoot = 'relation_has_root',
  /** column name */
  RelationHasSource = 'relation_has_source',
  /** column name */
  SchemaCaption = 'schema_caption',
  /** column name */
  SchemaEndTime = 'schema_end_time',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaStartTime = 'schema_start_time',
  /** column name */
  SchemaTranscript = 'schema_transcript',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "graph._schema_duration". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Duration_Bool_Exp = {
  _and?: Array<Graph__Schema_Duration_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Duration_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Duration_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_duration?: Interval_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_duration" */
export type Graph__Schema_Duration_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_duration?: any;
};

/** input type for inserting object relation for remote table "graph._schema_duration" */
export type Graph__Schema_Duration_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Duration_Insert_Input;
};

/** Ordering options when selecting data from "graph._schema_duration". */
export type Graph__Schema_Duration_Order_By = {
  intellectual_entity_id?: Order_By | null | undefined;
  schema_duration?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "graph._schema_genre". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Genre_Bool_Exp = {
  _and?: Array<Graph__Schema_Genre_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Genre_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Genre_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_genre?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_genre" */
export type Graph__Schema_Genre_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_genre?: any;
};

/** input type for inserting object relation for remote table "graph._schema_genre" */
export type Graph__Schema_Genre_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Genre_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_in_language". All fields are combined with a logical 'AND'. */
export type Graph__Schema_In_Language_Bool_Exp = {
  _and?: Array<Graph__Schema_In_Language_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_In_Language_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_In_Language_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_in_language?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_in_language" */
export type Graph__Schema_In_Language_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_in_language?: any;
};

/** input type for inserting object relation for remote table "graph._schema_in_language" */
export type Graph__Schema_In_Language_Obj_Rel_Insert_Input = {
  data: Graph__Schema_In_Language_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_keywords". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Keywords_Bool_Exp = {
  _and?: Array<Graph__Schema_Keywords_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Keywords_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Keywords_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_keywords?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_keywords" */
export type Graph__Schema_Keywords_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_keywords?: any;
};

/** input type for inserting object relation for remote table "graph._schema_keywords" */
export type Graph__Schema_Keywords_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Keywords_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_license". All fields are combined with a logical 'AND'. */
export type Graph__Schema_License_Bool_Exp = {
  _and?: Array<Graph__Schema_License_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_License_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_License_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_license?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_license" */
export type Graph__Schema_License_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_license?: any;
};

/** input type for inserting object relation for remote table "graph._schema_license" */
export type Graph__Schema_License_Obj_Rel_Insert_Input = {
  data: Graph__Schema_License_Insert_Input;
};

/** Ordering options when selecting data from "graph._schema_license". */
export type Graph__Schema_License_Order_By = {
  intellectual_entity_id?: Order_By | null | undefined;
  schema_license?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "graph._schema_publisher". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Publisher_Bool_Exp = {
  _and?: Array<Graph__Schema_Publisher_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Publisher_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Publisher_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_publisher_array?: String_Array_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_publisher" */
export type Graph__Schema_Publisher_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_publisher_array?: Array<string> | null | undefined;
};

/** input type for inserting object relation for remote table "graph._schema_publisher" */
export type Graph__Schema_Publisher_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Publisher_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_role". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Role_Bool_Exp = {
  _and?: Array<Graph__Schema_Role_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Role_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Role_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_contributor?: Jsonb_Comparison_Exp | null | undefined;
  schema_creator?: Jsonb_Comparison_Exp | null | undefined;
  schema_publisher?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_role" */
export type Graph__Schema_Role_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_contributor?: any;
  schema_creator?: any;
  schema_publisher?: any;
};

/** input type for inserting object relation for remote table "graph._schema_role" */
export type Graph__Schema_Role_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Role_Insert_Input;
};

/** Ordering options when selecting data from "graph._schema_role". */
export type Graph__Schema_Role_Order_By = {
  intellectual_entity_id?: Order_By | null | undefined;
  schema_contributor?: Order_By | null | undefined;
  schema_creator?: Order_By | null | undefined;
  schema_publisher?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "graph._schema_spatial". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Spatial_Bool_Exp = {
  _and?: Array<Graph__Schema_Spatial_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Spatial_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Spatial_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_spatial?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_spatial" */
export type Graph__Schema_Spatial_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_spatial?: any;
};

/** input type for inserting object relation for remote table "graph._schema_spatial" */
export type Graph__Schema_Spatial_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Spatial_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_temporal". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Temporal_Bool_Exp = {
  _and?: Array<Graph__Schema_Temporal_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Temporal_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Temporal_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_temporal?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_temporal" */
export type Graph__Schema_Temporal_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_temporal?: any;
};

/** input type for inserting object relation for remote table "graph._schema_temporal" */
export type Graph__Schema_Temporal_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Temporal_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph._schema_thumbnail_url". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Thumbnail_Url_Bool_Exp = {
  _and?: Array<Graph__Schema_Thumbnail_Url_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Thumbnail_Url_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Thumbnail_Url_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  object_type?: Jsonb_Comparison_Exp | null | undefined;
  schema_thumbnail_url?: Jsonb_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_thumbnail_url" */
export type Graph__Schema_Thumbnail_Url_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  object_type?: any;
  schema_thumbnail_url?: any;
};

/** input type for inserting object relation for remote table "graph._schema_thumbnail_url" */
export type Graph__Schema_Thumbnail_Url_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Thumbnail_Url_Insert_Input;
};

/** Ordering options when selecting data from "graph._schema_thumbnail_url". */
export type Graph__Schema_Thumbnail_Url_Order_By = {
  intellectual_entity_id?: Order_By | null | undefined;
  object_type?: Order_By | null | undefined;
  schema_thumbnail_url?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "graph._schema_transcript". All fields are combined with a logical 'AND'. */
export type Graph__Schema_Transcript_Bool_Exp = {
  _and?: Array<Graph__Schema_Transcript_Bool_Exp> | null | undefined;
  _not?: Graph__Schema_Transcript_Bool_Exp | null | undefined;
  _or?: Array<Graph__Schema_Transcript_Bool_Exp> | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_transcript?: String_Comparison_Exp | null | undefined;
};

/** input type for inserting data into table "graph._schema_transcript" */
export type Graph__Schema_Transcript_Insert_Input = {
  intellectual_entity_id?: string | null | undefined;
  schema_transcript?: string | null | undefined;
};

/** input type for inserting object relation for remote table "graph._schema_transcript" */
export type Graph__Schema_Transcript_Obj_Rel_Insert_Input = {
  data: Graph__Schema_Transcript_Insert_Input;
};

/** Boolean expression to filter rows from the table "graph.carrier". All fields are combined with a logical 'AND'. */
export type Graph_Carrier_Bool_Exp = {
  _and?: Array<Graph_Carrier_Bool_Exp> | null | undefined;
  _not?: Graph_Carrier_Bool_Exp | null | undefined;
  _or?: Array<Graph_Carrier_Bool_Exp> | null | undefined;
  bibframe_production_method?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  digitization_date?: Date_Comparison_Exp | null | undefined;
  ebucore_has_captioning?: Boolean_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  premis_medium?: String_Comparison_Exp | null | undefined;
  schema_height?: String_Comparison_Exp | null | undefined;
  schema_identifier?: String_Comparison_Exp | null | undefined;
  schema_material?: String_Comparison_Exp | null | undefined;
  schema_material_extent?: String_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_width?: String_Comparison_Exp | null | undefined;
  type?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.carrier" */
export enum Graph_Carrier_Constraint {
  /** unique or primary key constraint on columns "id" */
  CarrierPkey = 'carrier_pkey'
}

/** input type for inserting data into table "graph.carrier" */
export type Graph_Carrier_Insert_Input = {
  bibframe_production_method?: string | null | undefined;
  created_at?: any;
  digitization_date?: any;
  ebucore_has_captioning?: boolean | null | undefined;
  id?: string | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  premis_medium?: string | null | undefined;
  schema_height?: string | null | undefined;
  schema_identifier?: string | null | undefined;
  schema_material?: string | null | undefined;
  schema_material_extent?: string | null | undefined;
  schema_name?: string | null | undefined;
  schema_width?: string | null | undefined;
  type?: string | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.carrier" */
export type Graph_Carrier_Obj_Rel_Insert_Input = {
  data: Graph_Carrier_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Carrier_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.carrier" */
export type Graph_Carrier_On_Conflict = {
  constraint: Graph_Carrier_Constraint;
  update_columns?: Array<Graph_Carrier_Update_Column>;
  where?: Graph_Carrier_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "graph.carrier". */
export type Graph_Carrier_Order_By = {
  bibframe_production_method?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  digitization_date?: Order_By | null | undefined;
  ebucore_has_captioning?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  premis_medium?: Order_By | null | undefined;
  schema_height?: Order_By | null | undefined;
  schema_identifier?: Order_By | null | undefined;
  schema_material?: Order_By | null | undefined;
  schema_material_extent?: Order_By | null | undefined;
  schema_name?: Order_By | null | undefined;
  schema_width?: Order_By | null | undefined;
  type?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** update columns of table "graph.carrier" */
export enum Graph_Carrier_Update_Column {
  /** column name */
  BibframeProductionMethod = 'bibframe_production_method',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DigitizationDate = 'digitization_date',
  /** column name */
  EbucoreHasCaptioning = 'ebucore_has_captioning',
  /** column name */
  Id = 'id',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  PremisMedium = 'premis_medium',
  /** column name */
  SchemaHeight = 'schema_height',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaMaterial = 'schema_material',
  /** column name */
  SchemaMaterialExtent = 'schema_material_extent',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaWidth = 'schema_width',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Collection_Aggregate_Bool_Exp = {
  count?: Graph_Collection_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Collection_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Collection_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Collection_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.collection" */
export type Graph_Collection_Arr_Rel_Insert_Input = {
  data: Array<Graph_Collection_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Collection_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.collection". All fields are combined with a logical 'AND'. */
export type Graph_Collection_Bool_Exp = {
  _and?: Array<Graph_Collection_Bool_Exp> | null | undefined;
  _not?: Graph_Collection_Bool_Exp | null | undefined;
  _or?: Array<Graph_Collection_Bool_Exp> | null | undefined;
  bibframe_preceeded_by?: String_Comparison_Exp | null | undefined;
  bibframe_succeeded_by?: String_Comparison_Exp | null | undefined;
  bibframe_supplement_to?: String_Comparison_Exp | null | undefined;
  collection_type?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  hasPart?: Graph_Schema_Is_Part_Of_Bool_Exp | null | undefined;
  hasPart_aggregate?: Graph_Schema_Is_Part_Of_Aggregate_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  isPartOf?: Graph_Schema_Is_Part_Of_Bool_Exp | null | undefined;
  isPartOf_aggregate?: Graph_Schema_Is_Part_Of_Aggregate_Bool_Exp | null | undefined;
  isPreceededBy?: Graph_Collection_Bool_Exp | null | undefined;
  isPreceededBy_aggregate?: Graph_Collection_Aggregate_Bool_Exp | null | undefined;
  isSucceededBy?: Graph_Collection_Bool_Exp | null | undefined;
  isSucceededBy_aggregate?: Graph_Collection_Aggregate_Bool_Exp | null | undefined;
  schemaAlternateName?: Graph_Newspaper_Schema_Alternate_Name_Bool_Exp | null | undefined;
  schemaAlternateName_aggregate?: Graph_Newspaper_Schema_Alternate_Name_Aggregate_Bool_Exp | null | undefined;
  schemaInLanguage?: Graph_Newspaper_Schema_In_Language_Bool_Exp | null | undefined;
  schemaInLanguage_aggregate?: Graph_Newspaper_Schema_In_Language_Aggregate_Bool_Exp | null | undefined;
  schema_alternate_name?: String_Comparison_Exp | null | undefined;
  schema_end_date?: String_Comparison_Exp | null | undefined;
  schema_identifier?: String_Comparison_Exp | null | undefined;
  schema_is_part_of?: String_Comparison_Exp | null | undefined;
  schema_location_created?: String_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_publisher?: String_Comparison_Exp | null | undefined;
  schema_season_number?: String_Comparison_Exp | null | undefined;
  schema_start_date?: String_Comparison_Exp | null | undefined;
  supplements?: Graph_Collection_Bool_Exp | null | undefined;
  supplements_aggregate?: Graph_Collection_Aggregate_Bool_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.collection" */
export enum Graph_Collection_Constraint {
  /** unique or primary key constraint on columns "id" */
  NewspaperPkey = 'newspaper_pkey',
  /** unique or primary key constraint on columns "schema_identifier" */
  NewspaperSchemaIdentifierKey = 'newspaper_schema_identifier_key'
}

/** input type for inserting data into table "graph.collection" */
export type Graph_Collection_Insert_Input = {
  /** Titel die voorafging aan deze titel (newspaper.id) */
  bibframe_preceeded_by?: string | null | undefined;
  /** Titel die deze titel opvolgde (newspaper.id) */
  bibframe_succeeded_by?: string | null | undefined;
  /** Supplement of bijlage bij andere titel (newspaper.id) */
  bibframe_supplement_to?: string | null | undefined;
  collection_type?: string | null | undefined;
  created_at?: any;
  hasPart?: Graph_Schema_Is_Part_Of_Arr_Rel_Insert_Input | null | undefined;
  /** iri as id */
  id?: string | null | undefined;
  isPartOf?: Graph_Schema_Is_Part_Of_Arr_Rel_Insert_Input | null | undefined;
  isPreceededBy?: Graph_Collection_Arr_Rel_Insert_Input | null | undefined;
  isSucceededBy?: Graph_Collection_Arr_Rel_Insert_Input | null | undefined;
  schemaAlternateName?: Graph_Newspaper_Schema_Alternate_Name_Arr_Rel_Insert_Input | null | undefined;
  schemaInLanguage?: Graph_Newspaper_Schema_In_Language_Arr_Rel_Insert_Input | null | undefined;
  /** Alternatieve titel */
  schema_alternate_name?: string | null | undefined;
  /** Laatste jaar van uitgave in edtf (string) */
  schema_end_date?: string | null | undefined;
  schema_identifier?: string | null | undefined;
  schema_is_part_of?: string | null | undefined;
  /** Plaats van uitgave */
  schema_location_created?: string | null | undefined;
  /** Titel */
  schema_name?: string | null | undefined;
  /** Uitgever als Role */
  schema_publisher?: string | null | undefined;
  schema_season_number?: string | null | undefined;
  /** Eerste jaar van uitgave in edtf (string) */
  schema_start_date?: string | null | undefined;
  supplements?: Graph_Collection_Arr_Rel_Insert_Input | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.collection" */
export type Graph_Collection_Obj_Rel_Insert_Input = {
  data: Graph_Collection_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Collection_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.collection" */
export type Graph_Collection_On_Conflict = {
  constraint: Graph_Collection_Constraint;
  update_columns?: Array<Graph_Collection_Update_Column>;
  where?: Graph_Collection_Bool_Exp | null | undefined;
};

/** select columns of table "graph.collection" */
export enum Graph_Collection_Select_Column {
  /** column name */
  BibframePreceededBy = 'bibframe_preceeded_by',
  /** column name */
  BibframeSucceededBy = 'bibframe_succeeded_by',
  /** column name */
  BibframeSupplementTo = 'bibframe_supplement_to',
  /** column name */
  CollectionType = 'collection_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  SchemaEndDate = 'schema_end_date',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaIsPartOf = 'schema_is_part_of',
  /** column name */
  SchemaLocationCreated = 'schema_location_created',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaPublisher = 'schema_publisher',
  /** column name */
  SchemaSeasonNumber = 'schema_season_number',
  /** column name */
  SchemaStartDate = 'schema_start_date',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.collection" */
export enum Graph_Collection_Update_Column {
  /** column name */
  BibframePreceededBy = 'bibframe_preceeded_by',
  /** column name */
  BibframeSucceededBy = 'bibframe_succeeded_by',
  /** column name */
  BibframeSupplementTo = 'bibframe_supplement_to',
  /** column name */
  CollectionType = 'collection_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  SchemaEndDate = 'schema_end_date',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaIsPartOf = 'schema_is_part_of',
  /** column name */
  SchemaLocationCreated = 'schema_location_created',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaPublisher = 'schema_publisher',
  /** column name */
  SchemaSeasonNumber = 'schema_season_number',
  /** column name */
  SchemaStartDate = 'schema_start_date',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Dcterms_Format_Aggregate_Bool_Exp = {
  count?: Graph_Dcterms_Format_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Dcterms_Format_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Dcterms_Format_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Dcterms_Format_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.dcterms_format" */
export type Graph_Dcterms_Format_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Dcterms_Format_Max_Order_By | null | undefined;
  min?: Graph_Dcterms_Format_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.dcterms_format" */
export type Graph_Dcterms_Format_Arr_Rel_Insert_Input = {
  data: Array<Graph_Dcterms_Format_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Dcterms_Format_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.dcterms_format". All fields are combined with a logical 'AND'. */
export type Graph_Dcterms_Format_Bool_Exp = {
  _and?: Array<Graph_Dcterms_Format_Bool_Exp> | null | undefined;
  _not?: Graph_Dcterms_Format_Bool_Exp | null | undefined;
  _or?: Array<Graph_Dcterms_Format_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  dcterms_format?: String_Comparison_Exp | null | undefined;
  intellectual_entity?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.dcterms_format" */
export enum Graph_Dcterms_Format_Constraint {
  /** unique or primary key constraint on columns "intellectual_entity_id", "dcterms_format" */
  DctFormatPkey = 'dct_format_pkey'
}

/** input type for inserting data into table "graph.dcterms_format" */
export type Graph_Dcterms_Format_Insert_Input = {
  created_at?: any;
  dcterms_format?: string | null | undefined;
  intellectual_entity?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.dcterms_format" */
export type Graph_Dcterms_Format_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  dcterms_format?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.dcterms_format" */
export type Graph_Dcterms_Format_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  dcterms_format?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.dcterms_format" */
export type Graph_Dcterms_Format_On_Conflict = {
  constraint: Graph_Dcterms_Format_Constraint;
  update_columns?: Array<Graph_Dcterms_Format_Update_Column>;
  where?: Graph_Dcterms_Format_Bool_Exp | null | undefined;
};

/** select columns of table "graph.dcterms_format" */
export enum Graph_Dcterms_Format_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DctermsFormat = 'dcterms_format',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.dcterms_format" */
export enum Graph_Dcterms_Format_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DctermsFormat = 'dcterms_format',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "graph.file". All fields are combined with a logical 'AND'. */
export type Graph_File_Bool_Exp = {
  _and?: Array<Graph_File_Bool_Exp> | null | undefined;
  _not?: Graph_File_Bool_Exp | null | undefined;
  _or?: Array<Graph_File_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  ebucore_has_mime_type?: String_Comparison_Exp | null | undefined;
  edm_is_next_in_sequence?: String_Comparison_Exp | null | undefined;
  hasMediaFragment?: Graph_Representation_Bool_Exp | null | undefined;
  hasMediaFragment_aggregate?: Graph_Representation_Aggregate_Bool_Exp | null | undefined;
  has_annotations?: Graph__File_Has_Annotation_Bool_Exp | null | undefined;
  has_annotations_aggregate?: Graph__File_Has_Annotation_Aggregate_Bool_Exp | null | undefined;
  has_captionings?: Graph__File_Ebucore_Has_Captioning_Bool_Exp | null | undefined;
  has_captionings_aggregate?: Graph__File_Ebucore_Has_Captioning_Aggregate_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  isRootOf?: Graph_Representation_Bool_Exp | null | undefined;
  isRootOf_aggregate?: Graph_Representation_Aggregate_Bool_Exp | null | undefined;
  is_ai_generated?: Boolean_Comparison_Exp | null | undefined;
  mh_fragment_identifier?: String_Comparison_Exp | null | undefined;
  premis_original_name?: String_Comparison_Exp | null | undefined;
  premis_stored_at?: String_Comparison_Exp | null | undefined;
  schema_duration?: Numeric_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_thumbnail_url?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.file" */
export enum Graph_File_Constraint {
  /** unique or primary key constraint on columns "id" */
  FilePkey = 'file_pkey'
}

/** input type for inserting data into table "graph.file" */
export type Graph_File_Insert_Input = {
  created_at?: any;
  ebucore_has_mime_type?: string | null | undefined;
  edm_is_next_in_sequence?: string | null | undefined;
  hasMediaFragment?: Graph_Representation_Arr_Rel_Insert_Input | null | undefined;
  has_annotations?: Graph__File_Has_Annotation_Arr_Rel_Insert_Input | null | undefined;
  has_captionings?: Graph__File_Ebucore_Has_Captioning_Arr_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  isRootOf?: Graph_Representation_Arr_Rel_Insert_Input | null | undefined;
  is_ai_generated?: boolean | null | undefined;
  mh_fragment_identifier?: string | null | undefined;
  premis_original_name?: string | null | undefined;
  premis_stored_at?: string | null | undefined;
  schema_duration?: any;
  schema_name?: string | null | undefined;
  schema_thumbnail_url?: string | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.file" */
export type Graph_File_Obj_Rel_Insert_Input = {
  data: Graph_File_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_File_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.file" */
export type Graph_File_On_Conflict = {
  constraint: Graph_File_Constraint;
  update_columns?: Array<Graph_File_Update_Column>;
  where?: Graph_File_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "graph.file". */
export type Graph_File_Order_By = {
  created_at?: Order_By | null | undefined;
  ebucore_has_mime_type?: Order_By | null | undefined;
  edm_is_next_in_sequence?: Order_By | null | undefined;
  hasMediaFragment_aggregate?: Graph_Representation_Aggregate_Order_By | null | undefined;
  has_annotations_aggregate?: Graph__File_Has_Annotation_Aggregate_Order_By | null | undefined;
  has_captionings_aggregate?: Graph__File_Ebucore_Has_Captioning_Aggregate_Order_By | null | undefined;
  id?: Order_By | null | undefined;
  isRootOf_aggregate?: Graph_Representation_Aggregate_Order_By | null | undefined;
  is_ai_generated?: Order_By | null | undefined;
  mh_fragment_identifier?: Order_By | null | undefined;
  premis_original_name?: Order_By | null | undefined;
  premis_stored_at?: Order_By | null | undefined;
  schema_duration?: Order_By | null | undefined;
  schema_name?: Order_By | null | undefined;
  schema_thumbnail_url?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** update columns of table "graph.file" */
export enum Graph_File_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EbucoreHasMimeType = 'ebucore_has_mime_type',
  /** column name */
  EdmIsNextInSequence = 'edm_is_next_in_sequence',
  /** column name */
  Id = 'id',
  /** column name */
  IsAiGenerated = 'is_ai_generated',
  /** column name */
  MhFragmentIdentifier = 'mh_fragment_identifier',
  /** column name */
  PremisOriginalName = 'premis_original_name',
  /** column name */
  PremisStoredAt = 'premis_stored_at',
  /** column name */
  SchemaDuration = 'schema_duration',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Hades_License_Distributor_Aggregate_Bool_Exp = {
  count?: Graph_Hades_License_Distributor_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Hades_License_Distributor_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Hades_License_Distributor_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Hades_License_Distributor_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.hades_license_distributor" */
export type Graph_Hades_License_Distributor_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Hades_License_Distributor_Max_Order_By | null | undefined;
  min?: Graph_Hades_License_Distributor_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.hades_license_distributor" */
export type Graph_Hades_License_Distributor_Arr_Rel_Insert_Input = {
  data: Array<Graph_Hades_License_Distributor_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Hades_License_Distributor_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.hades_license_distributor". All fields are combined with a logical 'AND'. */
export type Graph_Hades_License_Distributor_Bool_Exp = {
  _and?: Array<Graph_Hades_License_Distributor_Bool_Exp> | null | undefined;
  _not?: Graph_Hades_License_Distributor_Bool_Exp | null | undefined;
  _or?: Array<Graph_Hades_License_Distributor_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  hades_license_distributor?: String_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.hades_license_distributor" */
export enum Graph_Hades_License_Distributor_Constraint {
  /** unique or primary key constraint on columns "hades_license_distributor", "intellectual_entity_id" */
  HadesLicenseDistributorPkey = 'hades_license_distributor_pkey'
}

/** input type for inserting data into table "graph.hades_license_distributor" */
export type Graph_Hades_License_Distributor_Insert_Input = {
  created_at?: any;
  hades_license_distributor?: string | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.hades_license_distributor" */
export type Graph_Hades_License_Distributor_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  hades_license_distributor?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.hades_license_distributor" */
export type Graph_Hades_License_Distributor_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  hades_license_distributor?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.hades_license_distributor" */
export type Graph_Hades_License_Distributor_On_Conflict = {
  constraint: Graph_Hades_License_Distributor_Constraint;
  update_columns?: Array<Graph_Hades_License_Distributor_Update_Column>;
  where?: Graph_Hades_License_Distributor_Bool_Exp | null | undefined;
};

/** select columns of table "graph.hades_license_distributor" */
export enum Graph_Hades_License_Distributor_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HadesLicenseDistributor = 'hades_license_distributor',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.hades_license_distributor" */
export enum Graph_Hades_License_Distributor_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HadesLicenseDistributor = 'hades_license_distributor',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Includes_Aggregate_Bool_Exp = {
  count?: Graph_Includes_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Includes_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Includes_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Includes_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.includes" */
export type Graph_Includes_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Includes_Max_Order_By | null | undefined;
  min?: Graph_Includes_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.includes" */
export type Graph_Includes_Arr_Rel_Insert_Input = {
  data: Array<Graph_Includes_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Includes_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.includes". All fields are combined with a logical 'AND'. */
export type Graph_Includes_Bool_Exp = {
  _and?: Array<Graph_Includes_Bool_Exp> | null | undefined;
  _not?: Graph_Includes_Bool_Exp | null | undefined;
  _or?: Array<Graph_Includes_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  file?: Graph_File_Bool_Exp | null | undefined;
  file_id?: String_Comparison_Exp | null | undefined;
  representation?: Graph_Representation_Bool_Exp | null | undefined;
  representation_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.includes" */
export enum Graph_Includes_Constraint {
  /** unique or primary key constraint on columns "file_id", "representation_id" */
  IncludesPkey = 'includes_pkey'
}

/** input type for inserting data into table "graph.includes" */
export type Graph_Includes_Insert_Input = {
  created_at?: any;
  file?: Graph_File_Obj_Rel_Insert_Input | null | undefined;
  file_id?: string | null | undefined;
  representation?: Graph_Representation_Obj_Rel_Insert_Input | null | undefined;
  /** Identifier van de file */
  representation_id?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.includes" */
export type Graph_Includes_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  file_id?: Order_By | null | undefined;
  /** Identifier van de file */
  representation_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.includes" */
export type Graph_Includes_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  file_id?: Order_By | null | undefined;
  /** Identifier van de file */
  representation_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.includes" */
export type Graph_Includes_On_Conflict = {
  constraint: Graph_Includes_Constraint;
  update_columns?: Array<Graph_Includes_Update_Column>;
  where?: Graph_Includes_Bool_Exp | null | undefined;
};

/** select columns of table "graph.includes" */
export enum Graph_Includes_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FileId = 'file_id',
  /** column name */
  RepresentationId = 'representation_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.includes" */
export enum Graph_Includes_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FileId = 'file_id',
  /** column name */
  RepresentationId = 'representation_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Intellectual_Entity_Aggregate_Bool_Exp = {
  count?: Graph_Intellectual_Entity_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Intellectual_Entity_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Intellectual_Entity_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Aggregate_Order_By = {
  avg?: Graph_Intellectual_Entity_Avg_Order_By | null | undefined;
  count?: Order_By | null | undefined;
  max?: Graph_Intellectual_Entity_Max_Order_By | null | undefined;
  min?: Graph_Intellectual_Entity_Min_Order_By | null | undefined;
  stddev?: Graph_Intellectual_Entity_Stddev_Order_By | null | undefined;
  stddev_pop?: Graph_Intellectual_Entity_Stddev_Pop_Order_By | null | undefined;
  stddev_samp?: Graph_Intellectual_Entity_Stddev_Samp_Order_By | null | undefined;
  sum?: Graph_Intellectual_Entity_Sum_Order_By | null | undefined;
  var_pop?: Graph_Intellectual_Entity_Var_Pop_Order_By | null | undefined;
  var_samp?: Graph_Intellectual_Entity_Var_Samp_Order_By | null | undefined;
  variance?: Graph_Intellectual_Entity_Variance_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Arr_Rel_Insert_Input = {
  data: Array<Graph_Intellectual_Entity_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Intellectual_Entity_On_Conflict | null | undefined;
};

/** order by avg() on columns of table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Avg_Order_By = {
  ha_des_number_of_pages?: Order_By | null | undefined;
  schema_position?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.intellectual_entity". All fields are combined with a logical 'AND'. */
export type Graph_Intellectual_Entity_Bool_Exp = {
  _and?: Array<Graph_Intellectual_Entity_Bool_Exp> | null | undefined;
  _not?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  _or?: Array<Graph_Intellectual_Entity_Bool_Exp> | null | undefined;
  bibframe_edition?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  dctermsFormat?: Graph_Dcterms_Format_Bool_Exp | null | undefined;
  dctermsFormat_aggregate?: Graph_Dcterms_Format_Aggregate_Bool_Exp | null | undefined;
  dcterms_available?: String_Comparison_Exp | null | undefined;
  dcterms_rights?: String_Comparison_Exp | null | undefined;
  ebucoreSynopses?: Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp | null | undefined;
  ebucoreSynopses_aggregate?: Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp | null | undefined;
  ebucore_has_cast_member?: String_Comparison_Exp | null | undefined;
  ebucore_has_object_type?: String_Comparison_Exp | null | undefined;
  ebucore_synopsis?: String_Comparison_Exp | null | undefined;
  haDesLicenseDistributors?: Graph_Hades_License_Distributor_Bool_Exp | null | undefined;
  haDesLicenseDistributors_aggregate?: Graph_Hades_License_Distributor_Aggregate_Bool_Exp | null | undefined;
  ha_des_max_date_created?: Date_Comparison_Exp | null | undefined;
  ha_des_max_date_published?: Date_Comparison_Exp | null | undefined;
  ha_des_min_date_created?: Date_Comparison_Exp | null | undefined;
  ha_des_min_date_published?: Date_Comparison_Exp | null | undefined;
  ha_des_number_of_pages?: Int_Comparison_Exp | null | undefined;
  hasCarrier?: Graph_Carrier_Bool_Exp | null | undefined;
  hasPart?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  hasPart_aggregate?: Graph_Intellectual_Entity_Aggregate_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  isPartOf?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  isRepresentedBy?: Graph_Representation_Bool_Exp | null | undefined;
  isRepresentedBy_aggregate?: Graph_Representation_Aggregate_Bool_Exp | null | undefined;
  mhFragmentIdentifier?: Graph_Mh_Fragment_Identifier_Bool_Exp | null | undefined;
  premisIdentifier?: Graph_Premis_Identifier_Bool_Exp | null | undefined;
  premisIdentifier_aggregate?: Graph_Premis_Identifier_Aggregate_Bool_Exp | null | undefined;
  relation_is_part_of?: String_Comparison_Exp | null | undefined;
  rights?: Graph_Rights_Bool_Exp | null | undefined;
  schemaAlternateName?: Graph_Schema_Alternate_Name_Bool_Exp | null | undefined;
  schemaAlternateName_aggregate?: Graph_Schema_Alternate_Name_Aggregate_Bool_Exp | null | undefined;
  schemaCopyrightHolder?: Graph_Schema_Copyright_Holder_Bool_Exp | null | undefined;
  schemaCopyrightHolder_aggregate?: Graph_Schema_Copyright_Holder_Aggregate_Bool_Exp | null | undefined;
  schemaDuration?: Graph__Schema_Duration_Bool_Exp | null | undefined;
  schemaGenre?: Graph_Schema_Genre_Bool_Exp | null | undefined;
  schemaGenre_aggregate?: Graph_Schema_Genre_Aggregate_Bool_Exp | null | undefined;
  schemaInLanguage?: Graph_Schema_In_Language_Bool_Exp | null | undefined;
  schemaInLanguage_aggregate?: Graph_Schema_In_Language_Aggregate_Bool_Exp | null | undefined;
  schemaIsPartOf?: Graph_Schema_Is_Part_Of_Bool_Exp | null | undefined;
  schemaIsPartOf_aggregate?: Graph_Schema_Is_Part_Of_Aggregate_Bool_Exp | null | undefined;
  schemaKeywords?: Graph_Schema_Keywords_Bool_Exp | null | undefined;
  schemaKeywords_aggregate?: Graph_Schema_Keywords_Aggregate_Bool_Exp | null | undefined;
  schemaLicense?: Graph__Schema_License_Bool_Exp | null | undefined;
  schemaLicenses?: Graph_Schema_License_Bool_Exp | null | undefined;
  schemaLicenses_aggregate?: Graph_Schema_License_Aggregate_Bool_Exp | null | undefined;
  schemaMaintainer?: Graph_Organization_Bool_Exp | null | undefined;
  schemaMentions?: Graph_Schema_Mentions_Bool_Exp | null | undefined;
  schemaMentions_aggregate?: Graph_Schema_Mentions_Aggregate_Bool_Exp | null | undefined;
  schemaNames?: Graph_Intellectual_Entity_Schema_Name_Bool_Exp | null | undefined;
  schemaNames_aggregate?: Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp | null | undefined;
  schemaRole?: Graph__Schema_Role_Bool_Exp | null | undefined;
  schemaSpatial?: Graph_Schema_Spatial_Bool_Exp | null | undefined;
  schemaSpatial_aggregate?: Graph_Schema_Spatial_Aggregate_Bool_Exp | null | undefined;
  schemaTemporal?: Graph_Schema_Temporal_Bool_Exp | null | undefined;
  schemaTemporal_aggregate?: Graph_Schema_Temporal_Aggregate_Bool_Exp | null | undefined;
  schemaThumbnail?: Graph__Schema_Thumbnail_Url_Bool_Exp | null | undefined;
  schema_abstract?: String_Comparison_Exp | null | undefined;
  schema_copyright_notice?: String_Comparison_Exp | null | undefined;
  schema_copyright_year?: Date_Comparison_Exp | null | undefined;
  schema_credit_text?: String_Comparison_Exp | null | undefined;
  schema_date_created?: String_Comparison_Exp | null | undefined;
  schema_date_published?: String_Comparison_Exp | null | undefined;
  schema_description?: String_Comparison_Exp | null | undefined;
  schema_identifier?: String_Comparison_Exp | null | undefined;
  schema_issue_number?: String_Comparison_Exp | null | undefined;
  schema_maintainer?: String_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_position?: Int_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.intellectual_entity" */
export enum Graph_Intellectual_Entity_Constraint {
  /** unique or primary key constraint on columns "id" */
  IntellectualEntityPkey = 'intellectual_entity_pkey'
}

export type Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp = {
  bool_and?: Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_And = {
  arguments: Graph_Intellectual_Entity_Ebucore_Synopsis_Select_Column_Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Graph_Intellectual_Entity_Ebucore_Synopsis_Select_Column_Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Intellectual_Entity_Ebucore_Synopsis_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.intellectual_entity_ebucore_synopsis" */
export type Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Intellectual_Entity_Ebucore_Synopsis_Max_Order_By | null | undefined;
  min?: Graph_Intellectual_Entity_Ebucore_Synopsis_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.intellectual_entity_ebucore_synopsis" */
export type Graph_Intellectual_Entity_Ebucore_Synopsis_Arr_Rel_Insert_Input = {
  data: Array<Graph_Intellectual_Entity_Ebucore_Synopsis_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Intellectual_Entity_Ebucore_Synopsis_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.intellectual_entity_ebucore_synopsis". All fields are combined with a logical 'AND'. */
export type Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp = {
  _and?: Array<Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp> | null | undefined;
  _not?: Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp | null | undefined;
  _or?: Array<Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  ebucore_synopsis?: String_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  is_ai_generated?: Boolean_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.intellectual_entity_ebucore_synopsis" */
export enum Graph_Intellectual_Entity_Ebucore_Synopsis_Constraint {
  /** unique or primary key constraint on columns "ebucore_synopsis", "intellectual_entity_id", "is_ai_generated" */
  IntellectualEntityEbucoreSynopsisPkey = 'intellectual_entity_ebucore_synopsis_pkey'
}

/** input type for inserting data into table "graph.intellectual_entity_ebucore_synopsis" */
export type Graph_Intellectual_Entity_Ebucore_Synopsis_Insert_Input = {
  created_at?: any;
  ebucore_synopsis?: string | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  is_ai_generated?: boolean | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.intellectual_entity_ebucore_synopsis" */
export type Graph_Intellectual_Entity_Ebucore_Synopsis_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  ebucore_synopsis?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.intellectual_entity_ebucore_synopsis" */
export type Graph_Intellectual_Entity_Ebucore_Synopsis_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  ebucore_synopsis?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.intellectual_entity_ebucore_synopsis" */
export type Graph_Intellectual_Entity_Ebucore_Synopsis_On_Conflict = {
  constraint: Graph_Intellectual_Entity_Ebucore_Synopsis_Constraint;
  update_columns?: Array<Graph_Intellectual_Entity_Ebucore_Synopsis_Update_Column>;
  where?: Graph_Intellectual_Entity_Ebucore_Synopsis_Bool_Exp | null | undefined;
};

/** select columns of table "graph.intellectual_entity_ebucore_synopsis" */
export enum Graph_Intellectual_Entity_Ebucore_Synopsis_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EbucoreSynopsis = 'ebucore_synopsis',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  IsAiGenerated = 'is_ai_generated',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "graph_intellectual_entity_ebucore_synopsis_aggregate_bool_exp_bool_and_arguments_columns" columns of table "graph.intellectual_entity_ebucore_synopsis" */
export enum Graph_Intellectual_Entity_Ebucore_Synopsis_Select_Column_Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** select "graph_intellectual_entity_ebucore_synopsis_aggregate_bool_exp_bool_or_arguments_columns" columns of table "graph.intellectual_entity_ebucore_synopsis" */
export enum Graph_Intellectual_Entity_Ebucore_Synopsis_Select_Column_Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** update columns of table "graph.intellectual_entity_ebucore_synopsis" */
export enum Graph_Intellectual_Entity_Ebucore_Synopsis_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EbucoreSynopsis = 'ebucore_synopsis',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  IsAiGenerated = 'is_ai_generated',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for inserting data into table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Insert_Input = {
  bibframe_edition?: string | null | undefined;
  created_at?: any;
  dctermsFormat?: Graph_Dcterms_Format_Arr_Rel_Insert_Input | null | undefined;
  dcterms_available?: string | null | undefined;
  dcterms_rights?: string | null | undefined;
  ebucoreSynopses?: Graph_Intellectual_Entity_Ebucore_Synopsis_Arr_Rel_Insert_Input | null | undefined;
  ebucore_has_cast_member?: string | null | undefined;
  ebucore_has_object_type?: string | null | undefined;
  ebucore_synopsis?: string | null | undefined;
  haDesLicenseDistributors?: Graph_Hades_License_Distributor_Arr_Rel_Insert_Input | null | undefined;
  ha_des_max_date_created?: any;
  ha_des_max_date_published?: any;
  ha_des_min_date_created?: any;
  ha_des_min_date_published?: any;
  ha_des_number_of_pages?: number | null | undefined;
  hasCarrier?: Graph_Carrier_Obj_Rel_Insert_Input | null | undefined;
  hasPart?: Graph_Intellectual_Entity_Arr_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  isPartOf?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  isRepresentedBy?: Graph_Representation_Arr_Rel_Insert_Input | null | undefined;
  mhFragmentIdentifier?: Graph_Mh_Fragment_Identifier_Obj_Rel_Insert_Input | null | undefined;
  premisIdentifier?: Graph_Premis_Identifier_Arr_Rel_Insert_Input | null | undefined;
  relation_is_part_of?: string | null | undefined;
  rights?: Graph_Rights_Obj_Rel_Insert_Input | null | undefined;
  schemaAlternateName?: Graph_Schema_Alternate_Name_Arr_Rel_Insert_Input | null | undefined;
  schemaCopyrightHolder?: Graph_Schema_Copyright_Holder_Arr_Rel_Insert_Input | null | undefined;
  schemaDuration?: Graph__Schema_Duration_Obj_Rel_Insert_Input | null | undefined;
  schemaGenre?: Graph_Schema_Genre_Arr_Rel_Insert_Input | null | undefined;
  schemaInLanguage?: Graph_Schema_In_Language_Arr_Rel_Insert_Input | null | undefined;
  schemaIsPartOf?: Graph_Schema_Is_Part_Of_Arr_Rel_Insert_Input | null | undefined;
  schemaKeywords?: Graph_Schema_Keywords_Arr_Rel_Insert_Input | null | undefined;
  schemaLicense?: Graph__Schema_License_Obj_Rel_Insert_Input | null | undefined;
  schemaLicenses?: Graph_Schema_License_Arr_Rel_Insert_Input | null | undefined;
  schemaMaintainer?: Graph_Organization_Obj_Rel_Insert_Input | null | undefined;
  schemaMentions?: Graph_Schema_Mentions_Arr_Rel_Insert_Input | null | undefined;
  schemaNames?: Graph_Intellectual_Entity_Schema_Name_Arr_Rel_Insert_Input | null | undefined;
  schemaRole?: Graph__Schema_Role_Obj_Rel_Insert_Input | null | undefined;
  schemaSpatial?: Graph_Schema_Spatial_Arr_Rel_Insert_Input | null | undefined;
  schemaTemporal?: Graph_Schema_Temporal_Arr_Rel_Insert_Input | null | undefined;
  schemaThumbnail?: Graph__Schema_Thumbnail_Url_Obj_Rel_Insert_Input | null | undefined;
  schema_abstract?: string | null | undefined;
  schema_copyright_notice?: string | null | undefined;
  schema_copyright_year?: any;
  schema_credit_text?: string | null | undefined;
  schema_date_created?: string | null | undefined;
  schema_date_published?: string | null | undefined;
  schema_description?: string | null | undefined;
  schema_identifier?: string | null | undefined;
  schema_issue_number?: string | null | undefined;
  schema_maintainer?: string | null | undefined;
  schema_name?: string | null | undefined;
  schema_position?: number | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Max_Order_By = {
  bibframe_edition?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  dcterms_available?: Order_By | null | undefined;
  dcterms_rights?: Order_By | null | undefined;
  ebucore_has_cast_member?: Order_By | null | undefined;
  ebucore_has_object_type?: Order_By | null | undefined;
  ebucore_synopsis?: Order_By | null | undefined;
  ha_des_max_date_created?: Order_By | null | undefined;
  ha_des_max_date_published?: Order_By | null | undefined;
  ha_des_min_date_created?: Order_By | null | undefined;
  ha_des_min_date_published?: Order_By | null | undefined;
  ha_des_number_of_pages?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  relation_is_part_of?: Order_By | null | undefined;
  schema_abstract?: Order_By | null | undefined;
  schema_copyright_notice?: Order_By | null | undefined;
  schema_copyright_year?: Order_By | null | undefined;
  schema_credit_text?: Order_By | null | undefined;
  schema_date_created?: Order_By | null | undefined;
  schema_date_published?: Order_By | null | undefined;
  schema_description?: Order_By | null | undefined;
  schema_identifier?: Order_By | null | undefined;
  schema_issue_number?: Order_By | null | undefined;
  schema_maintainer?: Order_By | null | undefined;
  schema_name?: Order_By | null | undefined;
  schema_position?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Min_Order_By = {
  bibframe_edition?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  dcterms_available?: Order_By | null | undefined;
  dcterms_rights?: Order_By | null | undefined;
  ebucore_has_cast_member?: Order_By | null | undefined;
  ebucore_has_object_type?: Order_By | null | undefined;
  ebucore_synopsis?: Order_By | null | undefined;
  ha_des_max_date_created?: Order_By | null | undefined;
  ha_des_max_date_published?: Order_By | null | undefined;
  ha_des_min_date_created?: Order_By | null | undefined;
  ha_des_min_date_published?: Order_By | null | undefined;
  ha_des_number_of_pages?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  relation_is_part_of?: Order_By | null | undefined;
  schema_abstract?: Order_By | null | undefined;
  schema_copyright_notice?: Order_By | null | undefined;
  schema_copyright_year?: Order_By | null | undefined;
  schema_credit_text?: Order_By | null | undefined;
  schema_date_created?: Order_By | null | undefined;
  schema_date_published?: Order_By | null | undefined;
  schema_description?: Order_By | null | undefined;
  schema_identifier?: Order_By | null | undefined;
  schema_issue_number?: Order_By | null | undefined;
  schema_maintainer?: Order_By | null | undefined;
  schema_name?: Order_By | null | undefined;
  schema_position?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** input type for inserting object relation for remote table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Obj_Rel_Insert_Input = {
  data: Graph_Intellectual_Entity_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Intellectual_Entity_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_On_Conflict = {
  constraint: Graph_Intellectual_Entity_Constraint;
  update_columns?: Array<Graph_Intellectual_Entity_Update_Column>;
  where?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "graph.intellectual_entity". */
export type Graph_Intellectual_Entity_Order_By = {
  bibframe_edition?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  dctermsFormat_aggregate?: Graph_Dcterms_Format_Aggregate_Order_By | null | undefined;
  dcterms_available?: Order_By | null | undefined;
  dcterms_rights?: Order_By | null | undefined;
  ebucoreSynopses_aggregate?: Graph_Intellectual_Entity_Ebucore_Synopsis_Aggregate_Order_By | null | undefined;
  ebucore_has_cast_member?: Order_By | null | undefined;
  ebucore_has_object_type?: Order_By | null | undefined;
  ebucore_synopsis?: Order_By | null | undefined;
  haDesLicenseDistributors_aggregate?: Graph_Hades_License_Distributor_Aggregate_Order_By | null | undefined;
  ha_des_max_date_created?: Order_By | null | undefined;
  ha_des_max_date_published?: Order_By | null | undefined;
  ha_des_min_date_created?: Order_By | null | undefined;
  ha_des_min_date_published?: Order_By | null | undefined;
  ha_des_number_of_pages?: Order_By | null | undefined;
  hasCarrier?: Graph_Carrier_Order_By | null | undefined;
  hasPart_aggregate?: Graph_Intellectual_Entity_Aggregate_Order_By | null | undefined;
  id?: Order_By | null | undefined;
  isPartOf?: Graph_Intellectual_Entity_Order_By | null | undefined;
  isRepresentedBy_aggregate?: Graph_Representation_Aggregate_Order_By | null | undefined;
  mhFragmentIdentifier?: Graph_Mh_Fragment_Identifier_Order_By | null | undefined;
  premisIdentifier_aggregate?: Graph_Premis_Identifier_Aggregate_Order_By | null | undefined;
  relation_is_part_of?: Order_By | null | undefined;
  rights?: Graph_Rights_Order_By | null | undefined;
  schemaAlternateName_aggregate?: Graph_Schema_Alternate_Name_Aggregate_Order_By | null | undefined;
  schemaCopyrightHolder_aggregate?: Graph_Schema_Copyright_Holder_Aggregate_Order_By | null | undefined;
  schemaDuration?: Graph__Schema_Duration_Order_By | null | undefined;
  schemaGenre_aggregate?: Graph_Schema_Genre_Aggregate_Order_By | null | undefined;
  schemaInLanguage_aggregate?: Graph_Schema_In_Language_Aggregate_Order_By | null | undefined;
  schemaIsPartOf_aggregate?: Graph_Schema_Is_Part_Of_Aggregate_Order_By | null | undefined;
  schemaKeywords_aggregate?: Graph_Schema_Keywords_Aggregate_Order_By | null | undefined;
  schemaLicense?: Graph__Schema_License_Order_By | null | undefined;
  schemaLicenses_aggregate?: Graph_Schema_License_Aggregate_Order_By | null | undefined;
  schemaMaintainer?: Graph_Organization_Order_By | null | undefined;
  schemaMentions_aggregate?: Graph_Schema_Mentions_Aggregate_Order_By | null | undefined;
  schemaNames_aggregate?: Graph_Intellectual_Entity_Schema_Name_Aggregate_Order_By | null | undefined;
  schemaRole?: Graph__Schema_Role_Order_By | null | undefined;
  schemaSpatial_aggregate?: Graph_Schema_Spatial_Aggregate_Order_By | null | undefined;
  schemaTemporal_aggregate?: Graph_Schema_Temporal_Aggregate_Order_By | null | undefined;
  schemaThumbnail?: Graph__Schema_Thumbnail_Url_Order_By | null | undefined;
  schema_abstract?: Order_By | null | undefined;
  schema_copyright_notice?: Order_By | null | undefined;
  schema_copyright_year?: Order_By | null | undefined;
  schema_credit_text?: Order_By | null | undefined;
  schema_date_created?: Order_By | null | undefined;
  schema_date_published?: Order_By | null | undefined;
  schema_description?: Order_By | null | undefined;
  schema_identifier?: Order_By | null | undefined;
  schema_issue_number?: Order_By | null | undefined;
  schema_maintainer?: Order_By | null | undefined;
  schema_name?: Order_By | null | undefined;
  schema_position?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

export type Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp = {
  bool_and?: Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_And = {
  arguments: Graph_Intellectual_Entity_Schema_Name_Select_Column_Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph_Intellectual_Entity_Schema_Name_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Graph_Intellectual_Entity_Schema_Name_Select_Column_Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Graph_Intellectual_Entity_Schema_Name_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Intellectual_Entity_Schema_Name_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Intellectual_Entity_Schema_Name_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.intellectual_entity_schema_name" */
export type Graph_Intellectual_Entity_Schema_Name_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Intellectual_Entity_Schema_Name_Max_Order_By | null | undefined;
  min?: Graph_Intellectual_Entity_Schema_Name_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.intellectual_entity_schema_name" */
export type Graph_Intellectual_Entity_Schema_Name_Arr_Rel_Insert_Input = {
  data: Array<Graph_Intellectual_Entity_Schema_Name_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Intellectual_Entity_Schema_Name_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.intellectual_entity_schema_name". All fields are combined with a logical 'AND'. */
export type Graph_Intellectual_Entity_Schema_Name_Bool_Exp = {
  _and?: Array<Graph_Intellectual_Entity_Schema_Name_Bool_Exp> | null | undefined;
  _not?: Graph_Intellectual_Entity_Schema_Name_Bool_Exp | null | undefined;
  _or?: Array<Graph_Intellectual_Entity_Schema_Name_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  is_ai_generated?: Boolean_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.intellectual_entity_schema_name" */
export enum Graph_Intellectual_Entity_Schema_Name_Constraint {
  /** unique or primary key constraint on columns "intellectual_entity_id", "schema_name", "is_ai_generated" */
  IntellectualEntitySchemaNamePkey = 'intellectual_entity_schema_name_pkey'
}

/** input type for inserting data into table "graph.intellectual_entity_schema_name" */
export type Graph_Intellectual_Entity_Schema_Name_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  is_ai_generated?: boolean | null | undefined;
  schema_name?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.intellectual_entity_schema_name" */
export type Graph_Intellectual_Entity_Schema_Name_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_name?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.intellectual_entity_schema_name" */
export type Graph_Intellectual_Entity_Schema_Name_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_name?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.intellectual_entity_schema_name" */
export type Graph_Intellectual_Entity_Schema_Name_On_Conflict = {
  constraint: Graph_Intellectual_Entity_Schema_Name_Constraint;
  update_columns?: Array<Graph_Intellectual_Entity_Schema_Name_Update_Column>;
  where?: Graph_Intellectual_Entity_Schema_Name_Bool_Exp | null | undefined;
};

/** select columns of table "graph.intellectual_entity_schema_name" */
export enum Graph_Intellectual_Entity_Schema_Name_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  IsAiGenerated = 'is_ai_generated',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "graph_intellectual_entity_schema_name_aggregate_bool_exp_bool_and_arguments_columns" columns of table "graph.intellectual_entity_schema_name" */
export enum Graph_Intellectual_Entity_Schema_Name_Select_Column_Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** select "graph_intellectual_entity_schema_name_aggregate_bool_exp_bool_or_arguments_columns" columns of table "graph.intellectual_entity_schema_name" */
export enum Graph_Intellectual_Entity_Schema_Name_Select_Column_Graph_Intellectual_Entity_Schema_Name_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsAiGenerated = 'is_ai_generated'
}

/** update columns of table "graph.intellectual_entity_schema_name" */
export enum Graph_Intellectual_Entity_Schema_Name_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  IsAiGenerated = 'is_ai_generated',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select columns of table "graph.intellectual_entity" */
export enum Graph_Intellectual_Entity_Select_Column {
  /** column name */
  BibframeEdition = 'bibframe_edition',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DctermsAvailable = 'dcterms_available',
  /** column name */
  DctermsRights = 'dcterms_rights',
  /** column name */
  EbucoreHasCastMember = 'ebucore_has_cast_member',
  /** column name */
  EbucoreHasObjectType = 'ebucore_has_object_type',
  /** column name */
  EbucoreSynopsis = 'ebucore_synopsis',
  /** column name */
  HaDesMaxDateCreated = 'ha_des_max_date_created',
  /** column name */
  HaDesMaxDatePublished = 'ha_des_max_date_published',
  /** column name */
  HaDesMinDateCreated = 'ha_des_min_date_created',
  /** column name */
  HaDesMinDatePublished = 'ha_des_min_date_published',
  /** column name */
  HaDesNumberOfPages = 'ha_des_number_of_pages',
  /** column name */
  Id = 'id',
  /** column name */
  RelationIsPartOf = 'relation_is_part_of',
  /** column name */
  SchemaAbstract = 'schema_abstract',
  /** column name */
  SchemaCopyrightNotice = 'schema_copyright_notice',
  /** column name */
  SchemaCopyrightYear = 'schema_copyright_year',
  /** column name */
  SchemaCreditText = 'schema_credit_text',
  /** column name */
  SchemaDateCreated = 'schema_date_created',
  /** column name */
  SchemaDatePublished = 'schema_date_published',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaIssueNumber = 'schema_issue_number',
  /** column name */
  SchemaMaintainer = 'schema_maintainer',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaPosition = 'schema_position',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** order by stddev() on columns of table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Stddev_Order_By = {
  ha_des_number_of_pages?: Order_By | null | undefined;
  schema_position?: Order_By | null | undefined;
};

/** order by stddev_pop() on columns of table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Stddev_Pop_Order_By = {
  ha_des_number_of_pages?: Order_By | null | undefined;
  schema_position?: Order_By | null | undefined;
};

/** order by stddev_samp() on columns of table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Stddev_Samp_Order_By = {
  ha_des_number_of_pages?: Order_By | null | undefined;
  schema_position?: Order_By | null | undefined;
};

/** order by sum() on columns of table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Sum_Order_By = {
  ha_des_number_of_pages?: Order_By | null | undefined;
  schema_position?: Order_By | null | undefined;
};

/** update columns of table "graph.intellectual_entity" */
export enum Graph_Intellectual_Entity_Update_Column {
  /** column name */
  BibframeEdition = 'bibframe_edition',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DctermsAvailable = 'dcterms_available',
  /** column name */
  DctermsRights = 'dcterms_rights',
  /** column name */
  EbucoreHasCastMember = 'ebucore_has_cast_member',
  /** column name */
  EbucoreHasObjectType = 'ebucore_has_object_type',
  /** column name */
  EbucoreSynopsis = 'ebucore_synopsis',
  /** column name */
  HaDesMaxDateCreated = 'ha_des_max_date_created',
  /** column name */
  HaDesMaxDatePublished = 'ha_des_max_date_published',
  /** column name */
  HaDesMinDateCreated = 'ha_des_min_date_created',
  /** column name */
  HaDesMinDatePublished = 'ha_des_min_date_published',
  /** column name */
  HaDesNumberOfPages = 'ha_des_number_of_pages',
  /** column name */
  Id = 'id',
  /** column name */
  RelationIsPartOf = 'relation_is_part_of',
  /** column name */
  SchemaAbstract = 'schema_abstract',
  /** column name */
  SchemaCopyrightNotice = 'schema_copyright_notice',
  /** column name */
  SchemaCopyrightYear = 'schema_copyright_year',
  /** column name */
  SchemaCreditText = 'schema_credit_text',
  /** column name */
  SchemaDateCreated = 'schema_date_created',
  /** column name */
  SchemaDatePublished = 'schema_date_published',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaIssueNumber = 'schema_issue_number',
  /** column name */
  SchemaMaintainer = 'schema_maintainer',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaPosition = 'schema_position',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** order by var_pop() on columns of table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Var_Pop_Order_By = {
  ha_des_number_of_pages?: Order_By | null | undefined;
  schema_position?: Order_By | null | undefined;
};

/** order by var_samp() on columns of table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Var_Samp_Order_By = {
  ha_des_number_of_pages?: Order_By | null | undefined;
  schema_position?: Order_By | null | undefined;
};

/** order by variance() on columns of table "graph.intellectual_entity" */
export type Graph_Intellectual_Entity_Variance_Order_By = {
  ha_des_number_of_pages?: Order_By | null | undefined;
  schema_position?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.mh_fragment_identifier". All fields are combined with a logical 'AND'. */
export type Graph_Mh_Fragment_Identifier_Bool_Exp = {
  _and?: Array<Graph_Mh_Fragment_Identifier_Bool_Exp> | null | undefined;
  _not?: Graph_Mh_Fragment_Identifier_Bool_Exp | null | undefined;
  _or?: Array<Graph_Mh_Fragment_Identifier_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  mh_fragment_identifier?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.mh_fragment_identifier" */
export enum Graph_Mh_Fragment_Identifier_Constraint {
  /** unique or primary key constraint on columns "intellectual_entity_id", "mh_fragment_identifier" */
  MhFragmentIdentifierPkey = 'mh_fragment_identifier_pkey'
}

/** input type for inserting data into table "graph.mh_fragment_identifier" */
export type Graph_Mh_Fragment_Identifier_Insert_Input = {
  created_at?: any;
  intellectual_entity?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  is_deleted?: boolean | null | undefined;
  mh_fragment_identifier?: string | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.mh_fragment_identifier" */
export type Graph_Mh_Fragment_Identifier_Obj_Rel_Insert_Input = {
  data: Graph_Mh_Fragment_Identifier_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Mh_Fragment_Identifier_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.mh_fragment_identifier" */
export type Graph_Mh_Fragment_Identifier_On_Conflict = {
  constraint: Graph_Mh_Fragment_Identifier_Constraint;
  update_columns?: Array<Graph_Mh_Fragment_Identifier_Update_Column>;
  where?: Graph_Mh_Fragment_Identifier_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "graph.mh_fragment_identifier". */
export type Graph_Mh_Fragment_Identifier_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity?: Graph_Intellectual_Entity_Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  is_deleted?: Order_By | null | undefined;
  mh_fragment_identifier?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** update columns of table "graph.mh_fragment_identifier" */
export enum Graph_Mh_Fragment_Identifier_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  MhFragmentIdentifier = 'mh_fragment_identifier',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Newspaper_Schema_Alternate_Name_Aggregate_Bool_Exp = {
  count?: Graph_Newspaper_Schema_Alternate_Name_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Newspaper_Schema_Alternate_Name_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Newspaper_Schema_Alternate_Name_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Newspaper_Schema_Alternate_Name_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.newspaper_schema_alternate_name" */
export type Graph_Newspaper_Schema_Alternate_Name_Arr_Rel_Insert_Input = {
  data: Array<Graph_Newspaper_Schema_Alternate_Name_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Newspaper_Schema_Alternate_Name_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.newspaper_schema_alternate_name". All fields are combined with a logical 'AND'. */
export type Graph_Newspaper_Schema_Alternate_Name_Bool_Exp = {
  _and?: Array<Graph_Newspaper_Schema_Alternate_Name_Bool_Exp> | null | undefined;
  _not?: Graph_Newspaper_Schema_Alternate_Name_Bool_Exp | null | undefined;
  _or?: Array<Graph_Newspaper_Schema_Alternate_Name_Bool_Exp> | null | undefined;
  collection_id?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  schema_alternate_name?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.newspaper_schema_alternate_name" */
export enum Graph_Newspaper_Schema_Alternate_Name_Constraint {
  /** unique or primary key constraint on columns "schema_alternate_name", "collection_id" */
  NewspaperSchemaAlternateNamePkey = 'newspaper_schema_alternate_name_pkey'
}

/** input type for inserting data into table "graph.newspaper_schema_alternate_name" */
export type Graph_Newspaper_Schema_Alternate_Name_Insert_Input = {
  collection_id?: string | null | undefined;
  created_at?: any;
  schema_alternate_name?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.newspaper_schema_alternate_name" */
export type Graph_Newspaper_Schema_Alternate_Name_On_Conflict = {
  constraint: Graph_Newspaper_Schema_Alternate_Name_Constraint;
  update_columns?: Array<Graph_Newspaper_Schema_Alternate_Name_Update_Column>;
  where?: Graph_Newspaper_Schema_Alternate_Name_Bool_Exp | null | undefined;
};

/** select columns of table "graph.newspaper_schema_alternate_name" */
export enum Graph_Newspaper_Schema_Alternate_Name_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.newspaper_schema_alternate_name" */
export enum Graph_Newspaper_Schema_Alternate_Name_Update_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Newspaper_Schema_In_Language_Aggregate_Bool_Exp = {
  count?: Graph_Newspaper_Schema_In_Language_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Newspaper_Schema_In_Language_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Newspaper_Schema_In_Language_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Newspaper_Schema_In_Language_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "graph.newspaper_schema_in_language" */
export type Graph_Newspaper_Schema_In_Language_Arr_Rel_Insert_Input = {
  data: Array<Graph_Newspaper_Schema_In_Language_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Newspaper_Schema_In_Language_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.newspaper_schema_in_language". All fields are combined with a logical 'AND'. */
export type Graph_Newspaper_Schema_In_Language_Bool_Exp = {
  _and?: Array<Graph_Newspaper_Schema_In_Language_Bool_Exp> | null | undefined;
  _not?: Graph_Newspaper_Schema_In_Language_Bool_Exp | null | undefined;
  _or?: Array<Graph_Newspaper_Schema_In_Language_Bool_Exp> | null | undefined;
  collection_id?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  schema_in_language?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.newspaper_schema_in_language" */
export enum Graph_Newspaper_Schema_In_Language_Constraint {
  /** unique or primary key constraint on columns "schema_in_language", "collection_id" */
  NewspaperSchemaInLanguagePkey = 'newspaper_schema_in_language_pkey'
}

/** input type for inserting data into table "graph.newspaper_schema_in_language" */
export type Graph_Newspaper_Schema_In_Language_Insert_Input = {
  /** Identifier van de krant als collection */
  collection_id?: string | null | undefined;
  created_at?: any;
  /** ISO afkorting voor taal */
  schema_in_language?: string | null | undefined;
  updated_at?: any;
};

/** on_conflict condition type for table "graph.newspaper_schema_in_language" */
export type Graph_Newspaper_Schema_In_Language_On_Conflict = {
  constraint: Graph_Newspaper_Schema_In_Language_Constraint;
  update_columns?: Array<Graph_Newspaper_Schema_In_Language_Update_Column>;
  where?: Graph_Newspaper_Schema_In_Language_Bool_Exp | null | undefined;
};

/** select columns of table "graph.newspaper_schema_in_language" */
export enum Graph_Newspaper_Schema_In_Language_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.newspaper_schema_in_language" */
export enum Graph_Newspaper_Schema_In_Language_Update_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "graph.organisations_with_objects". All fields are combined with a logical 'AND'. */
export type Graph_Organisations_With_Objects_Bool_Exp = {
  _and?: Array<Graph_Organisations_With_Objects_Bool_Exp> | null | undefined;
  _not?: Graph_Organisations_With_Objects_Bool_Exp | null | undefined;
  _or?: Array<Graph_Organisations_With_Objects_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  dcterms_description?: String_Comparison_Exp | null | undefined;
  foaf_homepage?: String_Comparison_Exp | null | undefined;
  ha_org_has_logo?: String_Comparison_Exp | null | undefined;
  ha_org_request_form?: String_Comparison_Exp | null | undefined;
  ha_org_sector?: String_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  org_identifier?: String_Comparison_Exp | null | undefined;
  organization_slug?: String_Comparison_Exp | null | undefined;
  skos_pref_label?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  visitorSpace?: Maintainer_Visitor_Space_Bool_Exp | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.organization". All fields are combined with a logical 'AND'. */
export type Graph_Organization_Bool_Exp = {
  _and?: Array<Graph_Organization_Bool_Exp> | null | undefined;
  _not?: Graph_Organization_Bool_Exp | null | undefined;
  _or?: Array<Graph_Organization_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  dcterms_description?: String_Comparison_Exp | null | undefined;
  foaf_homepage?: String_Comparison_Exp | null | undefined;
  ha_org_has_logo?: String_Comparison_Exp | null | undefined;
  ha_org_request_form?: String_Comparison_Exp | null | undefined;
  ha_org_sector?: String_Comparison_Exp | null | undefined;
  hasPreference?: Graph_Organization_Has_Preference_Bool_Exp | null | undefined;
  hasPreference_aggregate?: Graph_Organization_Has_Preference_Aggregate_Bool_Exp | null | undefined;
  hasSite?: Graph_Organization_Has_Postal_Address_Bool_Exp | null | undefined;
  hasSite_aggregate?: Graph_Organization_Has_Postal_Address_Aggregate_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  org_classification?: String_Comparison_Exp | null | undefined;
  org_identifier?: String_Comparison_Exp | null | undefined;
  organizationSlug?: Maintainer_Organization_Slug_Bool_Exp | null | undefined;
  schemaContactPoint?: Graph_Schema_Contact_Point_Bool_Exp | null | undefined;
  schemaContactPoint_aggregate?: Graph_Schema_Contact_Point_Aggregate_Bool_Exp | null | undefined;
  schema_vat_id?: String_Comparison_Exp | null | undefined;
  skos_pref_label?: String_Comparison_Exp | null | undefined;
  skos_pref_label_lowercase?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  users?: Users_Profile_Bool_Exp | null | undefined;
  visitorSpace?: Maintainer_Visitor_Space_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.organization" */
export enum Graph_Organization_Constraint {
  /** unique or primary key constraint on columns "org_identifier" */
  OrganizationOrgIdentifierKey = 'organization_org_identifier_key',
  /** unique or primary key constraint on columns "id" */
  OrganizationPkey = 'organization_pkey'
}

export type Graph_Organization_Has_Postal_Address_Aggregate_Bool_Exp = {
  count?: Graph_Organization_Has_Postal_Address_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Organization_Has_Postal_Address_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Organization_Has_Postal_Address_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Organization_Has_Postal_Address_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.organization_has_postal_address" */
export type Graph_Organization_Has_Postal_Address_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Organization_Has_Postal_Address_Max_Order_By | null | undefined;
  min?: Graph_Organization_Has_Postal_Address_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.organization_has_postal_address" */
export type Graph_Organization_Has_Postal_Address_Arr_Rel_Insert_Input = {
  data: Array<Graph_Organization_Has_Postal_Address_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Organization_Has_Postal_Address_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.organization_has_postal_address". All fields are combined with a logical 'AND'. */
export type Graph_Organization_Has_Postal_Address_Bool_Exp = {
  _and?: Array<Graph_Organization_Has_Postal_Address_Bool_Exp> | null | undefined;
  _not?: Graph_Organization_Has_Postal_Address_Bool_Exp | null | undefined;
  _or?: Array<Graph_Organization_Has_Postal_Address_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  organization_id?: String_Comparison_Exp | null | undefined;
  postalAddress?: Graph_Schema_Postal_Address_Bool_Exp | null | undefined;
  postal_address_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.organization_has_postal_address" */
export enum Graph_Organization_Has_Postal_Address_Constraint {
  /** unique or primary key constraint on columns "postal_address_id", "organization_id" */
  OrganizationHasPostalAddressPkey = 'organization_has_postal_address_pkey'
}

/** input type for inserting data into table "graph.organization_has_postal_address" */
export type Graph_Organization_Has_Postal_Address_Insert_Input = {
  created_at?: any;
  organization_id?: string | null | undefined;
  postalAddress?: Graph_Schema_Postal_Address_Obj_Rel_Insert_Input | null | undefined;
  postal_address_id?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.organization_has_postal_address" */
export type Graph_Organization_Has_Postal_Address_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  organization_id?: Order_By | null | undefined;
  postal_address_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.organization_has_postal_address" */
export type Graph_Organization_Has_Postal_Address_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  organization_id?: Order_By | null | undefined;
  postal_address_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.organization_has_postal_address" */
export type Graph_Organization_Has_Postal_Address_On_Conflict = {
  constraint: Graph_Organization_Has_Postal_Address_Constraint;
  update_columns?: Array<Graph_Organization_Has_Postal_Address_Update_Column>;
  where?: Graph_Organization_Has_Postal_Address_Bool_Exp | null | undefined;
};

/** select columns of table "graph.organization_has_postal_address" */
export enum Graph_Organization_Has_Postal_Address_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  PostalAddressId = 'postal_address_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.organization_has_postal_address" */
export enum Graph_Organization_Has_Postal_Address_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  PostalAddressId = 'postal_address_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Organization_Has_Preference_Aggregate_Bool_Exp = {
  count?: Graph_Organization_Has_Preference_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Organization_Has_Preference_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Organization_Has_Preference_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Organization_Has_Preference_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.organization_has_preference" */
export type Graph_Organization_Has_Preference_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Organization_Has_Preference_Max_Order_By | null | undefined;
  min?: Graph_Organization_Has_Preference_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.organization_has_preference" */
export type Graph_Organization_Has_Preference_Arr_Rel_Insert_Input = {
  data: Array<Graph_Organization_Has_Preference_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Organization_Has_Preference_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.organization_has_preference". All fields are combined with a logical 'AND'. */
export type Graph_Organization_Has_Preference_Bool_Exp = {
  _and?: Array<Graph_Organization_Has_Preference_Bool_Exp> | null | undefined;
  _not?: Graph_Organization_Has_Preference_Bool_Exp | null | undefined;
  _or?: Array<Graph_Organization_Has_Preference_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  ha_pref?: String_Comparison_Exp | null | undefined;
  organization_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.organization_has_preference" */
export enum Graph_Organization_Has_Preference_Constraint {
  /** unique or primary key constraint on columns "ha_pref", "organization_id" */
  OrganizationHasPreferencePkey = 'organization_has_preference_pkey'
}

/** input type for inserting data into table "graph.organization_has_preference" */
export type Graph_Organization_Has_Preference_Insert_Input = {
  created_at?: any;
  ha_pref?: string | null | undefined;
  organization_id?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.organization_has_preference" */
export type Graph_Organization_Has_Preference_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  ha_pref?: Order_By | null | undefined;
  organization_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.organization_has_preference" */
export type Graph_Organization_Has_Preference_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  ha_pref?: Order_By | null | undefined;
  organization_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.organization_has_preference" */
export type Graph_Organization_Has_Preference_On_Conflict = {
  constraint: Graph_Organization_Has_Preference_Constraint;
  update_columns?: Array<Graph_Organization_Has_Preference_Update_Column>;
  where?: Graph_Organization_Has_Preference_Bool_Exp | null | undefined;
};

/** select columns of table "graph.organization_has_preference" */
export enum Graph_Organization_Has_Preference_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HaPref = 'ha_pref',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.organization_has_preference" */
export enum Graph_Organization_Has_Preference_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HaPref = 'ha_pref',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for inserting data into table "graph.organization" */
export type Graph_Organization_Insert_Input = {
  created_at?: any;
  dcterms_description?: string | null | undefined;
  foaf_homepage?: string | null | undefined;
  ha_org_has_logo?: string | null | undefined;
  ha_org_request_form?: string | null | undefined;
  ha_org_sector?: string | null | undefined;
  hasPreference?: Graph_Organization_Has_Preference_Arr_Rel_Insert_Input | null | undefined;
  hasSite?: Graph_Organization_Has_Postal_Address_Arr_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  org_classification?: string | null | undefined;
  org_identifier?: string | null | undefined;
  organizationSlug?: Maintainer_Organization_Slug_Obj_Rel_Insert_Input | null | undefined;
  schemaContactPoint?: Graph_Schema_Contact_Point_Arr_Rel_Insert_Input | null | undefined;
  schema_vat_id?: string | null | undefined;
  skos_pref_label?: string | null | undefined;
  updated_at?: any;
  users?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  visitorSpace?: Maintainer_Visitor_Space_Obj_Rel_Insert_Input | null | undefined;
};

/** input type for inserting object relation for remote table "graph.organization" */
export type Graph_Organization_Obj_Rel_Insert_Input = {
  data: Graph_Organization_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Organization_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.organization" */
export type Graph_Organization_On_Conflict = {
  constraint: Graph_Organization_Constraint;
  update_columns?: Array<Graph_Organization_Update_Column>;
  where?: Graph_Organization_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "graph.organization". */
export type Graph_Organization_Order_By = {
  created_at?: Order_By | null | undefined;
  dcterms_description?: Order_By | null | undefined;
  foaf_homepage?: Order_By | null | undefined;
  ha_org_has_logo?: Order_By | null | undefined;
  ha_org_request_form?: Order_By | null | undefined;
  ha_org_sector?: Order_By | null | undefined;
  hasPreference_aggregate?: Graph_Organization_Has_Preference_Aggregate_Order_By | null | undefined;
  hasSite_aggregate?: Graph_Organization_Has_Postal_Address_Aggregate_Order_By | null | undefined;
  id?: Order_By | null | undefined;
  org_classification?: Order_By | null | undefined;
  org_identifier?: Order_By | null | undefined;
  organizationSlug?: Maintainer_Organization_Slug_Order_By | null | undefined;
  schemaContactPoint_aggregate?: Graph_Schema_Contact_Point_Aggregate_Order_By | null | undefined;
  schema_vat_id?: Order_By | null | undefined;
  skos_pref_label?: Order_By | null | undefined;
  skos_pref_label_lowercase?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  users?: Users_Profile_Order_By | null | undefined;
  visitorSpace?: Maintainer_Visitor_Space_Order_By | null | undefined;
};

/** update columns of table "graph.organization" */
export enum Graph_Organization_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DctermsDescription = 'dcterms_description',
  /** column name */
  FoafHomepage = 'foaf_homepage',
  /** column name */
  HaOrgHasLogo = 'ha_org_has_logo',
  /** column name */
  HaOrgRequestForm = 'ha_org_request_form',
  /** column name */
  HaOrgSector = 'ha_org_sector',
  /** column name */
  Id = 'id',
  /** column name */
  OrgClassification = 'org_classification',
  /** column name */
  OrgIdentifier = 'org_identifier',
  /** column name */
  SchemaVatId = 'schema_vat_id',
  /** column name */
  SkosPrefLabel = 'skos_pref_label',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Premis_Identifier_Aggregate_Bool_Exp = {
  count?: Graph_Premis_Identifier_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Premis_Identifier_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Premis_Identifier_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Premis_Identifier_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.premis_identifier" */
export type Graph_Premis_Identifier_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Premis_Identifier_Max_Order_By | null | undefined;
  min?: Graph_Premis_Identifier_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.premis_identifier" */
export type Graph_Premis_Identifier_Arr_Rel_Insert_Input = {
  data: Array<Graph_Premis_Identifier_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Premis_Identifier_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.premis_identifier". All fields are combined with a logical 'AND'. */
export type Graph_Premis_Identifier_Bool_Exp = {
  _and?: Array<Graph_Premis_Identifier_Bool_Exp> | null | undefined;
  _not?: Graph_Premis_Identifier_Bool_Exp | null | undefined;
  _or?: Array<Graph_Premis_Identifier_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  type?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  value?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.premis_identifier" */
export enum Graph_Premis_Identifier_Constraint {
  /** unique or primary key constraint on columns "intellectual_entity_id", "type", "value" */
  PremisIdentifierPkey = 'premis_identifier_pkey'
}

/** input type for inserting data into table "graph.premis_identifier" */
export type Graph_Premis_Identifier_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  type?: string | null | undefined;
  updated_at?: any;
  value?: string | null | undefined;
};

/** order by max() on columns of table "graph.premis_identifier" */
export type Graph_Premis_Identifier_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  type?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  value?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.premis_identifier" */
export type Graph_Premis_Identifier_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  type?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  value?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.premis_identifier" */
export type Graph_Premis_Identifier_On_Conflict = {
  constraint: Graph_Premis_Identifier_Constraint;
  update_columns?: Array<Graph_Premis_Identifier_Update_Column>;
  where?: Graph_Premis_Identifier_Bool_Exp | null | undefined;
};

/** select columns of table "graph.premis_identifier" */
export enum Graph_Premis_Identifier_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

/** update columns of table "graph.premis_identifier" */
export enum Graph_Premis_Identifier_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

export type Graph_Representation_Aggregate_Bool_Exp = {
  count?: Graph_Representation_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Representation_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Representation_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Representation_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.representation" */
export type Graph_Representation_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Representation_Max_Order_By | null | undefined;
  min?: Graph_Representation_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.representation" */
export type Graph_Representation_Arr_Rel_Insert_Input = {
  data: Array<Graph_Representation_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Representation_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.representation". All fields are combined with a logical 'AND'. */
export type Graph_Representation_Bool_Exp = {
  _and?: Array<Graph_Representation_Bool_Exp> | null | undefined;
  _not?: Graph_Representation_Bool_Exp | null | undefined;
  _or?: Array<Graph_Representation_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  edm_is_next_in_sequence?: String_Comparison_Exp | null | undefined;
  hasRoot?: Graph_File_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  includes?: Graph_Includes_Bool_Exp | null | undefined;
  includes_aggregate?: Graph_Includes_Aggregate_Bool_Exp | null | undefined;
  isMediaFragmentOf?: Graph_File_Bool_Exp | null | undefined;
  is_media_fragment_of?: String_Comparison_Exp | null | undefined;
  premis_represents?: String_Comparison_Exp | null | undefined;
  relation_has_root?: String_Comparison_Exp | null | undefined;
  relation_has_source?: String_Comparison_Exp | null | undefined;
  represents?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  schemaTranscriptUrls?: Graph_Schema_Transcript_Url_Bool_Exp | null | undefined;
  schemaTranscriptUrls_aggregate?: Graph_Schema_Transcript_Url_Aggregate_Bool_Exp | null | undefined;
  schema_caption?: String_Comparison_Exp | null | undefined;
  schema_end_time?: Time_Comparison_Exp | null | undefined;
  schema_in_language?: String_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_start_time?: Time_Comparison_Exp | null | undefined;
  schema_thumbnail_url?: String_Comparison_Exp | null | undefined;
  schema_transcript?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.representation" */
export enum Graph_Representation_Constraint {
  /** unique or primary key constraint on columns "id" */
  RepresentationPkey = 'representation_pkey'
}

/** input type for inserting data into table "graph.representation" */
export type Graph_Representation_Insert_Input = {
  created_at?: any;
  edm_is_next_in_sequence?: string | null | undefined;
  hasRoot?: Graph_File_Obj_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  includes?: Graph_Includes_Arr_Rel_Insert_Input | null | undefined;
  isMediaFragmentOf?: Graph_File_Obj_Rel_Insert_Input | null | undefined;
  is_media_fragment_of?: string | null | undefined;
  premis_represents?: string | null | undefined;
  relation_has_root?: string | null | undefined;
  relation_has_source?: string | null | undefined;
  represents?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  schemaTranscriptUrls?: Graph_Schema_Transcript_Url_Arr_Rel_Insert_Input | null | undefined;
  schema_caption?: string | null | undefined;
  schema_end_time?: any;
  schema_in_language?: string | null | undefined;
  schema_name?: string | null | undefined;
  schema_start_time?: any;
  schema_thumbnail_url?: string | null | undefined;
  schema_transcript?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.representation" */
export type Graph_Representation_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  edm_is_next_in_sequence?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  is_media_fragment_of?: Order_By | null | undefined;
  premis_represents?: Order_By | null | undefined;
  relation_has_root?: Order_By | null | undefined;
  relation_has_source?: Order_By | null | undefined;
  schema_caption?: Order_By | null | undefined;
  schema_in_language?: Order_By | null | undefined;
  schema_name?: Order_By | null | undefined;
  schema_thumbnail_url?: Order_By | null | undefined;
  schema_transcript?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.representation" */
export type Graph_Representation_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  edm_is_next_in_sequence?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  is_media_fragment_of?: Order_By | null | undefined;
  premis_represents?: Order_By | null | undefined;
  relation_has_root?: Order_By | null | undefined;
  relation_has_source?: Order_By | null | undefined;
  schema_caption?: Order_By | null | undefined;
  schema_in_language?: Order_By | null | undefined;
  schema_name?: Order_By | null | undefined;
  schema_thumbnail_url?: Order_By | null | undefined;
  schema_transcript?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** input type for inserting object relation for remote table "graph.representation" */
export type Graph_Representation_Obj_Rel_Insert_Input = {
  data: Graph_Representation_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Representation_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.representation" */
export type Graph_Representation_On_Conflict = {
  constraint: Graph_Representation_Constraint;
  update_columns?: Array<Graph_Representation_Update_Column>;
  where?: Graph_Representation_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "graph.representation". */
export type Graph_Representation_Order_By = {
  created_at?: Order_By | null | undefined;
  edm_is_next_in_sequence?: Order_By | null | undefined;
  hasRoot?: Graph_File_Order_By | null | undefined;
  id?: Order_By | null | undefined;
  includes_aggregate?: Graph_Includes_Aggregate_Order_By | null | undefined;
  isMediaFragmentOf?: Graph_File_Order_By | null | undefined;
  is_media_fragment_of?: Order_By | null | undefined;
  premis_represents?: Order_By | null | undefined;
  relation_has_root?: Order_By | null | undefined;
  relation_has_source?: Order_By | null | undefined;
  represents?: Graph_Intellectual_Entity_Order_By | null | undefined;
  schemaTranscriptUrls_aggregate?: Graph_Schema_Transcript_Url_Aggregate_Order_By | null | undefined;
  schema_caption?: Order_By | null | undefined;
  schema_end_time?: Order_By | null | undefined;
  schema_in_language?: Order_By | null | undefined;
  schema_name?: Order_By | null | undefined;
  schema_start_time?: Order_By | null | undefined;
  schema_thumbnail_url?: Order_By | null | undefined;
  schema_transcript?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** select columns of table "graph.representation" */
export enum Graph_Representation_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EdmIsNextInSequence = 'edm_is_next_in_sequence',
  /** column name */
  Id = 'id',
  /** column name */
  IsMediaFragmentOf = 'is_media_fragment_of',
  /** column name */
  PremisRepresents = 'premis_represents',
  /** column name */
  RelationHasRoot = 'relation_has_root',
  /** column name */
  RelationHasSource = 'relation_has_source',
  /** column name */
  SchemaCaption = 'schema_caption',
  /** column name */
  SchemaEndTime = 'schema_end_time',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaStartTime = 'schema_start_time',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  SchemaTranscript = 'schema_transcript',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.representation" */
export enum Graph_Representation_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EdmIsNextInSequence = 'edm_is_next_in_sequence',
  /** column name */
  Id = 'id',
  /** column name */
  IsMediaFragmentOf = 'is_media_fragment_of',
  /** column name */
  PremisRepresents = 'premis_represents',
  /** column name */
  RelationHasRoot = 'relation_has_root',
  /** column name */
  RelationHasSource = 'relation_has_source',
  /** column name */
  SchemaCaption = 'schema_caption',
  /** column name */
  SchemaEndTime = 'schema_end_time',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaStartTime = 'schema_start_time',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  SchemaTranscript = 'schema_transcript',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "graph.rights". All fields are combined with a logical 'AND'. */
export type Graph_Rights_Bool_Exp = {
  _and?: Array<Graph_Rights_Bool_Exp> | null | undefined;
  _not?: Graph_Rights_Bool_Exp | null | undefined;
  _or?: Array<Graph_Rights_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  ha_des_license_distributor?: String_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  reuse_category?: Lookup_Reuse_Category_Bool_Exp | null | undefined;
  reuse_category_id?: String_Comparison_Exp | null | undefined;
  reuse_label?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.rights" */
export enum Graph_Rights_Constraint {
  /** unique or primary key constraint on columns "intellectual_entity_id" */
  RightsPkey = 'rights_pkey'
}

/** input type for inserting data into table "graph.rights" */
export type Graph_Rights_Insert_Input = {
  created_at?: any;
  ha_des_license_distributor?: string | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  reuse_category?: Lookup_Reuse_Category_Obj_Rel_Insert_Input | null | undefined;
  reuse_category_id?: string | null | undefined;
  reuse_label?: string | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.rights" */
export type Graph_Rights_Obj_Rel_Insert_Input = {
  data: Graph_Rights_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Rights_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.rights" */
export type Graph_Rights_On_Conflict = {
  constraint: Graph_Rights_Constraint;
  update_columns?: Array<Graph_Rights_Update_Column>;
  where?: Graph_Rights_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "graph.rights". */
export type Graph_Rights_Order_By = {
  created_at?: Order_By | null | undefined;
  ha_des_license_distributor?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  reuse_category?: Lookup_Reuse_Category_Order_By | null | undefined;
  reuse_category_id?: Order_By | null | undefined;
  reuse_label?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** update columns of table "graph.rights" */
export enum Graph_Rights_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HaDesLicenseDistributor = 'ha_des_license_distributor',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  ReuseCategoryId = 'reuse_category_id',
  /** column name */
  ReuseLabel = 'reuse_label',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Alternate_Name_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Alternate_Name_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Alternate_Name_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Alternate_Name_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Alternate_Name_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.schema_alternate_name" */
export type Graph_Schema_Alternate_Name_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Schema_Alternate_Name_Max_Order_By | null | undefined;
  min?: Graph_Schema_Alternate_Name_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.schema_alternate_name" */
export type Graph_Schema_Alternate_Name_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Alternate_Name_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Alternate_Name_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_alternate_name". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Alternate_Name_Bool_Exp = {
  _and?: Array<Graph_Schema_Alternate_Name_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Alternate_Name_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Alternate_Name_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_alternate_name?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_alternate_name" */
export enum Graph_Schema_Alternate_Name_Constraint {
  /** unique or primary key constraint on columns "schema_alternate_name", "intellectual_entity_id" */
  SchemaAlternateNamePkey = 'schema_alternate_name_pkey'
}

/** input type for inserting data into table "graph.schema_alternate_name" */
export type Graph_Schema_Alternate_Name_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_alternate_name?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.schema_alternate_name" */
export type Graph_Schema_Alternate_Name_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_alternate_name?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.schema_alternate_name" */
export type Graph_Schema_Alternate_Name_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_alternate_name?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.schema_alternate_name" */
export type Graph_Schema_Alternate_Name_On_Conflict = {
  constraint: Graph_Schema_Alternate_Name_Constraint;
  update_columns?: Array<Graph_Schema_Alternate_Name_Update_Column>;
  where?: Graph_Schema_Alternate_Name_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_alternate_name" */
export enum Graph_Schema_Alternate_Name_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_alternate_name" */
export enum Graph_Schema_Alternate_Name_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Contact_Point_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Contact_Point_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Contact_Point_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Contact_Point_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Contact_Point_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.schema_contact_point" */
export type Graph_Schema_Contact_Point_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Schema_Contact_Point_Max_Order_By | null | undefined;
  min?: Graph_Schema_Contact_Point_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.schema_contact_point" */
export type Graph_Schema_Contact_Point_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Contact_Point_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Contact_Point_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_contact_point". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Contact_Point_Bool_Exp = {
  _and?: Array<Graph_Schema_Contact_Point_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Contact_Point_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Contact_Point_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  organization?: Graph_Organization_Bool_Exp | null | undefined;
  organization_id?: String_Comparison_Exp | null | undefined;
  schema_contact_type?: String_Comparison_Exp | null | undefined;
  schema_email?: String_Comparison_Exp | null | undefined;
  schema_telephone?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_contact_point" */
export enum Graph_Schema_Contact_Point_Constraint {
  /** unique or primary key constraint on columns "id" */
  SchemaContactPointPkey = 'schema_contact_point_pkey'
}

/** input type for inserting data into table "graph.schema_contact_point" */
export type Graph_Schema_Contact_Point_Insert_Input = {
  created_at?: any;
  id?: string | null | undefined;
  organization?: Graph_Organization_Obj_Rel_Insert_Input | null | undefined;
  organization_id?: string | null | undefined;
  schema_contact_type?: string | null | undefined;
  schema_email?: string | null | undefined;
  schema_telephone?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.schema_contact_point" */
export type Graph_Schema_Contact_Point_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  organization_id?: Order_By | null | undefined;
  schema_contact_type?: Order_By | null | undefined;
  schema_email?: Order_By | null | undefined;
  schema_telephone?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.schema_contact_point" */
export type Graph_Schema_Contact_Point_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  organization_id?: Order_By | null | undefined;
  schema_contact_type?: Order_By | null | undefined;
  schema_email?: Order_By | null | undefined;
  schema_telephone?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.schema_contact_point" */
export type Graph_Schema_Contact_Point_On_Conflict = {
  constraint: Graph_Schema_Contact_Point_Constraint;
  update_columns?: Array<Graph_Schema_Contact_Point_Update_Column>;
  where?: Graph_Schema_Contact_Point_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_contact_point" */
export enum Graph_Schema_Contact_Point_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  SchemaContactType = 'schema_contact_type',
  /** column name */
  SchemaEmail = 'schema_email',
  /** column name */
  SchemaTelephone = 'schema_telephone',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_contact_point" */
export enum Graph_Schema_Contact_Point_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  OrganizationId = 'organization_id',
  /** column name */
  SchemaContactType = 'schema_contact_type',
  /** column name */
  SchemaEmail = 'schema_email',
  /** column name */
  SchemaTelephone = 'schema_telephone',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Copyright_Holder_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Copyright_Holder_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Copyright_Holder_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Copyright_Holder_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Copyright_Holder_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.schema_copyright_holder" */
export type Graph_Schema_Copyright_Holder_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Schema_Copyright_Holder_Max_Order_By | null | undefined;
  min?: Graph_Schema_Copyright_Holder_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.schema_copyright_holder" */
export type Graph_Schema_Copyright_Holder_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Copyright_Holder_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Copyright_Holder_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_copyright_holder". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Copyright_Holder_Bool_Exp = {
  _and?: Array<Graph_Schema_Copyright_Holder_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Copyright_Holder_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Copyright_Holder_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_copyright_holder?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_copyright_holder" */
export enum Graph_Schema_Copyright_Holder_Constraint {
  /** unique or primary key constraint on columns "schema_copyright_holder", "intellectual_entity_id" */
  SchemaCopyrightHolderPkey = 'schema_copyright_holder_pkey'
}

/** input type for inserting data into table "graph.schema_copyright_holder" */
export type Graph_Schema_Copyright_Holder_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_copyright_holder?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.schema_copyright_holder" */
export type Graph_Schema_Copyright_Holder_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_copyright_holder?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.schema_copyright_holder" */
export type Graph_Schema_Copyright_Holder_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_copyright_holder?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.schema_copyright_holder" */
export type Graph_Schema_Copyright_Holder_On_Conflict = {
  constraint: Graph_Schema_Copyright_Holder_Constraint;
  update_columns?: Array<Graph_Schema_Copyright_Holder_Update_Column>;
  where?: Graph_Schema_Copyright_Holder_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_copyright_holder" */
export enum Graph_Schema_Copyright_Holder_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaCopyrightHolder = 'schema_copyright_holder',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_copyright_holder" */
export enum Graph_Schema_Copyright_Holder_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaCopyrightHolder = 'schema_copyright_holder',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Genre_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Genre_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Genre_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Genre_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Genre_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.schema_genre" */
export type Graph_Schema_Genre_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Schema_Genre_Max_Order_By | null | undefined;
  min?: Graph_Schema_Genre_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.schema_genre" */
export type Graph_Schema_Genre_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Genre_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Genre_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_genre". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Genre_Bool_Exp = {
  _and?: Array<Graph_Schema_Genre_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Genre_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Genre_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_genre?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_genre" */
export enum Graph_Schema_Genre_Constraint {
  /** unique or primary key constraint on columns "intellectual_entity_id", "schema_genre" */
  SchemaGenrePkey = 'schema_genre_pkey'
}

/** input type for inserting data into table "graph.schema_genre" */
export type Graph_Schema_Genre_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_genre?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.schema_genre" */
export type Graph_Schema_Genre_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_genre?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.schema_genre" */
export type Graph_Schema_Genre_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_genre?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.schema_genre" */
export type Graph_Schema_Genre_On_Conflict = {
  constraint: Graph_Schema_Genre_Constraint;
  update_columns?: Array<Graph_Schema_Genre_Update_Column>;
  where?: Graph_Schema_Genre_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_genre" */
export enum Graph_Schema_Genre_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaGenre = 'schema_genre',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_genre" */
export enum Graph_Schema_Genre_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaGenre = 'schema_genre',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_In_Language_Aggregate_Bool_Exp = {
  count?: Graph_Schema_In_Language_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_In_Language_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_In_Language_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_In_Language_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.schema_in_language" */
export type Graph_Schema_In_Language_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Schema_In_Language_Max_Order_By | null | undefined;
  min?: Graph_Schema_In_Language_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.schema_in_language" */
export type Graph_Schema_In_Language_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_In_Language_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_In_Language_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_in_language". All fields are combined with a logical 'AND'. */
export type Graph_Schema_In_Language_Bool_Exp = {
  _and?: Array<Graph_Schema_In_Language_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_In_Language_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_In_Language_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_in_language?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_in_language" */
export enum Graph_Schema_In_Language_Constraint {
  /** unique or primary key constraint on columns "schema_in_language", "intellectual_entity_id" */
  SchemaInLanguagePkey = 'schema_in_language_pkey'
}

/** input type for inserting data into table "graph.schema_in_language" */
export type Graph_Schema_In_Language_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_in_language?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.schema_in_language" */
export type Graph_Schema_In_Language_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_in_language?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.schema_in_language" */
export type Graph_Schema_In_Language_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_in_language?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.schema_in_language" */
export type Graph_Schema_In_Language_On_Conflict = {
  constraint: Graph_Schema_In_Language_Constraint;
  update_columns?: Array<Graph_Schema_In_Language_Update_Column>;
  where?: Graph_Schema_In_Language_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_in_language" */
export enum Graph_Schema_In_Language_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_in_language" */
export enum Graph_Schema_In_Language_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Is_Part_Of_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Is_Part_Of_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Is_Part_Of_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Is_Part_Of_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Is_Part_Of_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.schema_is_part_of" */
export type Graph_Schema_Is_Part_Of_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Schema_Is_Part_Of_Max_Order_By | null | undefined;
  min?: Graph_Schema_Is_Part_Of_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.schema_is_part_of" */
export type Graph_Schema_Is_Part_Of_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Is_Part_Of_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Is_Part_Of_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_is_part_of". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Is_Part_Of_Bool_Exp = {
  _and?: Array<Graph_Schema_Is_Part_Of_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Is_Part_Of_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Is_Part_Of_Bool_Exp> | null | undefined;
  collection?: Graph_Collection_Bool_Exp | null | undefined;
  collection_id?: String_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectualEntity?: Graph__Intellectual_Entity_Bool_Exp | null | undefined;
  intellectual_entity?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  type?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_is_part_of" */
export enum Graph_Schema_Is_Part_Of_Constraint {
  /** unique or primary key constraint on columns "intellectual_entity_id", "type", "collection_id" */
  SchemaIsPartOfPkey = 'schema_is_part_of_pkey'
}

/** input type for inserting data into table "graph.schema_is_part_of" */
export type Graph_Schema_Is_Part_Of_Insert_Input = {
  collection?: Graph_Collection_Obj_Rel_Insert_Input | null | undefined;
  /** Identifier van de Collection */
  collection_id?: string | null | undefined;
  created_at?: any;
  intellectualEntity?: Graph__Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  intellectual_entity?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  /** Identifier van de IE */
  intellectual_entity_id?: string | null | undefined;
  /** Type collectie (creativeWorkSeries, newspaper, etc.) */
  type?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.schema_is_part_of" */
export type Graph_Schema_Is_Part_Of_Max_Order_By = {
  /** Identifier van de Collection */
  collection_id?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  /** Identifier van de IE */
  intellectual_entity_id?: Order_By | null | undefined;
  /** Type collectie (creativeWorkSeries, newspaper, etc.) */
  type?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.schema_is_part_of" */
export type Graph_Schema_Is_Part_Of_Min_Order_By = {
  /** Identifier van de Collection */
  collection_id?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  /** Identifier van de IE */
  intellectual_entity_id?: Order_By | null | undefined;
  /** Type collectie (creativeWorkSeries, newspaper, etc.) */
  type?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.schema_is_part_of" */
export type Graph_Schema_Is_Part_Of_On_Conflict = {
  constraint: Graph_Schema_Is_Part_Of_Constraint;
  update_columns?: Array<Graph_Schema_Is_Part_Of_Update_Column>;
  where?: Graph_Schema_Is_Part_Of_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_is_part_of" */
export enum Graph_Schema_Is_Part_Of_Select_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_is_part_of" */
export enum Graph_Schema_Is_Part_Of_Update_Column {
  /** column name */
  CollectionId = 'collection_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Keywords_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Keywords_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Keywords_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Keywords_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Keywords_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.schema_keywords" */
export type Graph_Schema_Keywords_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Schema_Keywords_Max_Order_By | null | undefined;
  min?: Graph_Schema_Keywords_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.schema_keywords" */
export type Graph_Schema_Keywords_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Keywords_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Keywords_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_keywords". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Keywords_Bool_Exp = {
  _and?: Array<Graph_Schema_Keywords_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Keywords_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Keywords_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_keywords?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_keywords" */
export enum Graph_Schema_Keywords_Constraint {
  /** unique or primary key constraint on columns "schema_keywords", "intellectual_entity_id" */
  SchemaKeywordsPkey = 'schema_keywords_pkey'
}

/** input type for inserting data into table "graph.schema_keywords" */
export type Graph_Schema_Keywords_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_keywords?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.schema_keywords" */
export type Graph_Schema_Keywords_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_keywords?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.schema_keywords" */
export type Graph_Schema_Keywords_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_keywords?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.schema_keywords" */
export type Graph_Schema_Keywords_On_Conflict = {
  constraint: Graph_Schema_Keywords_Constraint;
  update_columns?: Array<Graph_Schema_Keywords_Update_Column>;
  where?: Graph_Schema_Keywords_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_keywords" */
export enum Graph_Schema_Keywords_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaKeywords = 'schema_keywords',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_keywords" */
export enum Graph_Schema_Keywords_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaKeywords = 'schema_keywords',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_License_Aggregate_Bool_Exp = {
  count?: Graph_Schema_License_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_License_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_License_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_License_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.schema_license" */
export type Graph_Schema_License_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Schema_License_Max_Order_By | null | undefined;
  min?: Graph_Schema_License_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.schema_license" */
export type Graph_Schema_License_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_License_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_License_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_license". All fields are combined with a logical 'AND'. */
export type Graph_Schema_License_Bool_Exp = {
  _and?: Array<Graph_Schema_License_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_License_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_License_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_license?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_license" */
export enum Graph_Schema_License_Constraint {
  /** unique or primary key constraint on columns "schema_license", "intellectual_entity_id" */
  SchemaLicensePkey = 'schema_license_pkey'
}

/** input type for inserting data into table "graph.schema_license" */
export type Graph_Schema_License_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_license?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.schema_license" */
export type Graph_Schema_License_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_license?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.schema_license" */
export type Graph_Schema_License_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_license?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.schema_license" */
export type Graph_Schema_License_On_Conflict = {
  constraint: Graph_Schema_License_Constraint;
  update_columns?: Array<Graph_Schema_License_Update_Column>;
  where?: Graph_Schema_License_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_license" */
export enum Graph_Schema_License_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaLicense = 'schema_license',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_license" */
export enum Graph_Schema_License_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaLicense = 'schema_license',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Mentions_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Mentions_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Mentions_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Mentions_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Mentions_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Aggregate_Order_By = {
  avg?: Graph_Schema_Mentions_Avg_Order_By | null | undefined;
  count?: Order_By | null | undefined;
  max?: Graph_Schema_Mentions_Max_Order_By | null | undefined;
  min?: Graph_Schema_Mentions_Min_Order_By | null | undefined;
  stddev?: Graph_Schema_Mentions_Stddev_Order_By | null | undefined;
  stddev_pop?: Graph_Schema_Mentions_Stddev_Pop_Order_By | null | undefined;
  stddev_samp?: Graph_Schema_Mentions_Stddev_Samp_Order_By | null | undefined;
  sum?: Graph_Schema_Mentions_Sum_Order_By | null | undefined;
  var_pop?: Graph_Schema_Mentions_Var_Pop_Order_By | null | undefined;
  var_samp?: Graph_Schema_Mentions_Var_Samp_Order_By | null | undefined;
  variance?: Graph_Schema_Mentions_Variance_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Mentions_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Mentions_On_Conflict | null | undefined;
};

/** order by avg() on columns of table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Avg_Order_By = {
  confidence?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_mentions". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Mentions_Bool_Exp = {
  _and?: Array<Graph_Schema_Mentions_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Mentions_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Mentions_Bool_Exp> | null | undefined;
  confidence?: Numeric_Comparison_Exp | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  highlights?: Graph__Highlight_Bool_Exp | null | undefined;
  highlights_aggregate?: Graph__Highlight_Aggregate_Bool_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  thing?: Graph_Thing_Bool_Exp | null | undefined;
  thing_id?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_mentions" */
export enum Graph_Schema_Mentions_Constraint {
  /** unique or primary key constraint on columns "id" */
  SchemaMentionsPkey = 'schema_mentions_pkey'
}

/** input type for inserting data into table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Insert_Input = {
  confidence?: any;
  created_at?: any;
  highlights?: Graph__Highlight_Arr_Rel_Insert_Input | null | undefined;
  id?: string | null | undefined;
  intellectual_entity_id?: string | null | undefined;
  thing?: Graph_Thing_Obj_Rel_Insert_Input | null | undefined;
  thing_id?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Max_Order_By = {
  confidence?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  thing_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Min_Order_By = {
  confidence?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  thing_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.schema_mentions" */
export type Graph_Schema_Mentions_On_Conflict = {
  constraint: Graph_Schema_Mentions_Constraint;
  update_columns?: Array<Graph_Schema_Mentions_Update_Column>;
  where?: Graph_Schema_Mentions_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_mentions" */
export enum Graph_Schema_Mentions_Select_Column {
  /** column name */
  Confidence = 'confidence',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  ThingId = 'thing_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** order by stddev() on columns of table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Stddev_Order_By = {
  confidence?: Order_By | null | undefined;
};

/** order by stddev_pop() on columns of table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Stddev_Pop_Order_By = {
  confidence?: Order_By | null | undefined;
};

/** order by stddev_samp() on columns of table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Stddev_Samp_Order_By = {
  confidence?: Order_By | null | undefined;
};

/** order by sum() on columns of table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Sum_Order_By = {
  confidence?: Order_By | null | undefined;
};

/** update columns of table "graph.schema_mentions" */
export enum Graph_Schema_Mentions_Update_Column {
  /** column name */
  Confidence = 'confidence',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  ThingId = 'thing_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** order by var_pop() on columns of table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Var_Pop_Order_By = {
  confidence?: Order_By | null | undefined;
};

/** order by var_samp() on columns of table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Var_Samp_Order_By = {
  confidence?: Order_By | null | undefined;
};

/** order by variance() on columns of table "graph.schema_mentions" */
export type Graph_Schema_Mentions_Variance_Order_By = {
  confidence?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_postal_address". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Postal_Address_Bool_Exp = {
  _and?: Array<Graph_Schema_Postal_Address_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Postal_Address_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Postal_Address_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  schema_address_country?: String_Comparison_Exp | null | undefined;
  schema_address_locality?: String_Comparison_Exp | null | undefined;
  schema_address_region?: String_Comparison_Exp | null | undefined;
  schema_contact_type?: String_Comparison_Exp | null | undefined;
  schema_postal_code?: String_Comparison_Exp | null | undefined;
  schema_street_address?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_postal_address" */
export enum Graph_Schema_Postal_Address_Constraint {
  /** unique or primary key constraint on columns "id" */
  SchemaPostalAddressPkey = 'schema_postal_address_pkey'
}

/** input type for inserting data into table "graph.schema_postal_address" */
export type Graph_Schema_Postal_Address_Insert_Input = {
  created_at?: any;
  id?: string | null | undefined;
  schema_address_country?: string | null | undefined;
  schema_address_locality?: string | null | undefined;
  schema_address_region?: string | null | undefined;
  schema_contact_type?: string | null | undefined;
  schema_postal_code?: string | null | undefined;
  schema_street_address?: string | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "graph.schema_postal_address" */
export type Graph_Schema_Postal_Address_Obj_Rel_Insert_Input = {
  data: Graph_Schema_Postal_Address_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Schema_Postal_Address_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.schema_postal_address" */
export type Graph_Schema_Postal_Address_On_Conflict = {
  constraint: Graph_Schema_Postal_Address_Constraint;
  update_columns?: Array<Graph_Schema_Postal_Address_Update_Column>;
  where?: Graph_Schema_Postal_Address_Bool_Exp | null | undefined;
};

/** update columns of table "graph.schema_postal_address" */
export enum Graph_Schema_Postal_Address_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  SchemaAddressCountry = 'schema_address_country',
  /** column name */
  SchemaAddressLocality = 'schema_address_locality',
  /** column name */
  SchemaAddressRegion = 'schema_address_region',
  /** column name */
  SchemaContactType = 'schema_contact_type',
  /** column name */
  SchemaPostalCode = 'schema_postal_code',
  /** column name */
  SchemaStreetAddress = 'schema_street_address',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Spatial_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Spatial_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Spatial_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Spatial_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Spatial_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.schema_spatial" */
export type Graph_Schema_Spatial_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Schema_Spatial_Max_Order_By | null | undefined;
  min?: Graph_Schema_Spatial_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.schema_spatial" */
export type Graph_Schema_Spatial_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Spatial_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Spatial_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_spatial". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Spatial_Bool_Exp = {
  _and?: Array<Graph_Schema_Spatial_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Spatial_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Spatial_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_spatial?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_spatial" */
export enum Graph_Schema_Spatial_Constraint {
  /** unique or primary key constraint on columns "schema_spatial", "intellectual_entity_id" */
  SchemaSpatialPkey = 'schema_spatial_pkey'
}

/** input type for inserting data into table "graph.schema_spatial" */
export type Graph_Schema_Spatial_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_spatial?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.schema_spatial" */
export type Graph_Schema_Spatial_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_spatial?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.schema_spatial" */
export type Graph_Schema_Spatial_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_spatial?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.schema_spatial" */
export type Graph_Schema_Spatial_On_Conflict = {
  constraint: Graph_Schema_Spatial_Constraint;
  update_columns?: Array<Graph_Schema_Spatial_Update_Column>;
  where?: Graph_Schema_Spatial_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_spatial" */
export enum Graph_Schema_Spatial_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaSpatial = 'schema_spatial',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_spatial" */
export enum Graph_Schema_Spatial_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaSpatial = 'schema_spatial',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Temporal_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Temporal_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Temporal_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Temporal_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Temporal_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.schema_temporal" */
export type Graph_Schema_Temporal_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Schema_Temporal_Max_Order_By | null | undefined;
  min?: Graph_Schema_Temporal_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.schema_temporal" */
export type Graph_Schema_Temporal_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Temporal_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Temporal_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_temporal". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Temporal_Bool_Exp = {
  _and?: Array<Graph_Schema_Temporal_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Temporal_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Temporal_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  intellectual_entity_id?: String_Comparison_Exp | null | undefined;
  schema_temporal?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_temporal" */
export enum Graph_Schema_Temporal_Constraint {
  /** unique or primary key constraint on columns "schema_temporal", "intellectual_entity_id" */
  SchemaTemporalPkey = 'schema_temporal_pkey'
}

/** input type for inserting data into table "graph.schema_temporal" */
export type Graph_Schema_Temporal_Insert_Input = {
  created_at?: any;
  intellectual_entity_id?: string | null | undefined;
  schema_temporal?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.schema_temporal" */
export type Graph_Schema_Temporal_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_temporal?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.schema_temporal" */
export type Graph_Schema_Temporal_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  intellectual_entity_id?: Order_By | null | undefined;
  schema_temporal?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "graph.schema_temporal" */
export type Graph_Schema_Temporal_On_Conflict = {
  constraint: Graph_Schema_Temporal_Constraint;
  update_columns?: Array<Graph_Schema_Temporal_Update_Column>;
  where?: Graph_Schema_Temporal_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_temporal" */
export enum Graph_Schema_Temporal_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaTemporal = 'schema_temporal',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_temporal" */
export enum Graph_Schema_Temporal_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IntellectualEntityId = 'intellectual_entity_id',
  /** column name */
  SchemaTemporal = 'schema_temporal',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Graph_Schema_Transcript_Url_Aggregate_Bool_Exp = {
  count?: Graph_Schema_Transcript_Url_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Graph_Schema_Transcript_Url_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Graph_Schema_Transcript_Url_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Graph_Schema_Transcript_Url_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "graph.schema_transcript_url" */
export type Graph_Schema_Transcript_Url_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Graph_Schema_Transcript_Url_Max_Order_By | null | undefined;
  min?: Graph_Schema_Transcript_Url_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "graph.schema_transcript_url" */
export type Graph_Schema_Transcript_Url_Arr_Rel_Insert_Input = {
  data: Array<Graph_Schema_Transcript_Url_Insert_Input>;
  /** upsert condition */
  on_conflict?: Graph_Schema_Transcript_Url_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "graph.schema_transcript_url". All fields are combined with a logical 'AND'. */
export type Graph_Schema_Transcript_Url_Bool_Exp = {
  _and?: Array<Graph_Schema_Transcript_Url_Bool_Exp> | null | undefined;
  _not?: Graph_Schema_Transcript_Url_Bool_Exp | null | undefined;
  _or?: Array<Graph_Schema_Transcript_Url_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  representation_id?: String_Comparison_Exp | null | undefined;
  schema_transcript?: String_Comparison_Exp | null | undefined;
  schema_transcript_url?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.schema_transcript_url" */
export enum Graph_Schema_Transcript_Url_Constraint {
  /** unique or primary key constraint on columns "representation_id" */
  SchemaTranscriptUrlPkey = 'schema_transcript_url_pkey',
  /** unique or primary key constraint on columns "schema_transcript_url" */
  SchemaTranscriptUrlSchemaTranscriptUrlKey = 'schema_transcript_url_schema_transcript_url_key'
}

/** input type for inserting data into table "graph.schema_transcript_url" */
export type Graph_Schema_Transcript_Url_Insert_Input = {
  created_at?: any;
  representation_id?: string | null | undefined;
  schema_transcript?: string | null | undefined;
  schema_transcript_url?: string | null | undefined;
  updated_at?: any;
};

/** order by max() on columns of table "graph.schema_transcript_url" */
export type Graph_Schema_Transcript_Url_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  representation_id?: Order_By | null | undefined;
  schema_transcript?: Order_By | null | undefined;
  schema_transcript_url?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "graph.schema_transcript_url" */
export type Graph_Schema_Transcript_Url_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  representation_id?: Order_By | null | undefined;
  schema_transcript?: Order_By | null | undefined;
  schema_transcript_url?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** input type for inserting object relation for remote table "graph.schema_transcript_url" */
export type Graph_Schema_Transcript_Url_Obj_Rel_Insert_Input = {
  data: Graph_Schema_Transcript_Url_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Schema_Transcript_Url_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.schema_transcript_url" */
export type Graph_Schema_Transcript_Url_On_Conflict = {
  constraint: Graph_Schema_Transcript_Url_Constraint;
  update_columns?: Array<Graph_Schema_Transcript_Url_Update_Column>;
  where?: Graph_Schema_Transcript_Url_Bool_Exp | null | undefined;
};

/** select columns of table "graph.schema_transcript_url" */
export enum Graph_Schema_Transcript_Url_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  RepresentationId = 'representation_id',
  /** column name */
  SchemaTranscript = 'schema_transcript',
  /** column name */
  SchemaTranscriptUrl = 'schema_transcript_url',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "graph.schema_transcript_url" */
export enum Graph_Schema_Transcript_Url_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  RepresentationId = 'representation_id',
  /** column name */
  SchemaTranscript = 'schema_transcript',
  /** column name */
  SchemaTranscriptUrl = 'schema_transcript_url',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "graph.thing". All fields are combined with a logical 'AND'. */
export type Graph_Thing_Bool_Exp = {
  _and?: Array<Graph_Thing_Bool_Exp> | null | undefined;
  _not?: Graph_Thing_Bool_Exp | null | undefined;
  _or?: Array<Graph_Thing_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  schema_birth_date?: Smallint_Comparison_Exp | null | undefined;
  schema_birth_place?: String_Comparison_Exp | null | undefined;
  schema_death_date?: Smallint_Comparison_Exp | null | undefined;
  schema_death_place?: String_Comparison_Exp | null | undefined;
  schema_name?: String_Comparison_Exp | null | undefined;
  schema_thumbnail_url?: String_Comparison_Exp | null | undefined;
  type?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
  wiki_id?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "graph.thing" */
export enum Graph_Thing_Constraint {
  /** unique or primary key constraint on columns "id" */
  ThingPkey = 'thing_pkey'
}

/** input type for inserting data into table "graph.thing" */
export type Graph_Thing_Insert_Input = {
  created_at?: any;
  id?: string | null | undefined;
  schema_birth_date?: any;
  schema_birth_place?: string | null | undefined;
  schema_death_date?: any;
  schema_death_place?: string | null | undefined;
  schema_name?: string | null | undefined;
  schema_thumbnail_url?: string | null | undefined;
  type?: string | null | undefined;
  updated_at?: any;
  wiki_id?: string | null | undefined;
};

/** input type for inserting object relation for remote table "graph.thing" */
export type Graph_Thing_Obj_Rel_Insert_Input = {
  data: Graph_Thing_Insert_Input;
  /** upsert condition */
  on_conflict?: Graph_Thing_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "graph.thing" */
export type Graph_Thing_On_Conflict = {
  constraint: Graph_Thing_Constraint;
  update_columns?: Array<Graph_Thing_Update_Column>;
  where?: Graph_Thing_Bool_Exp | null | undefined;
};

/** update columns of table "graph.thing" */
export enum Graph_Thing_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  SchemaBirthDate = 'schema_birth_date',
  /** column name */
  SchemaBirthPlace = 'schema_birth_place',
  /** column name */
  SchemaDeathDate = 'schema_death_date',
  /** column name */
  SchemaDeathPlace = 'schema_death_place',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  WikiId = 'wiki_id'
}

/** Boolean expression to compare columns of type "interval". All fields are combined with logical 'AND'. */
export type Interval_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

export type Jsonb_Cast_Exp = {
  String?: String_Comparison_Exp | null | undefined;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: Jsonb_Cast_Exp | null | undefined;
  /** is the column contained in the given json value */
  _contained_in?: any;
  /** does the column contain the given json value at the top level */
  _contains?: any;
  _eq?: any;
  _gt?: any;
  _gte?: any;
  /** does the string exist as a top-level key in the column */
  _has_key?: string | null | undefined;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: Array<string> | null | undefined;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: Array<string> | null | undefined;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

export enum Lookup_App_Material_Request_Download_Status_Enum {
  /** download has expired */
  Expired = 'EXPIRED',
  /** download job failed */
  Failed = 'FAILED',
  /** download was triggered, but job has not been fetched yet */
  New = 'NEW',
  /** download was triggered, and mam export job is in progress */
  Pending = 'PENDING',
  /** download job succeeded, download_url filled in */
  Succeeded = 'SUCCEEDED'
}

/** Boolean expression to compare columns of type "lookup_app_material_request_download_status_enum". All fields are combined with logical 'AND'. */
export type Lookup_App_Material_Request_Download_Status_Enum_Comparison_Exp = {
  _eq?: Lookup_App_Material_Request_Download_Status_Enum | null | undefined;
  _in?: Array<Lookup_App_Material_Request_Download_Status_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_App_Material_Request_Download_Status_Enum | null | undefined;
  _nin?: Array<Lookup_App_Material_Request_Download_Status_Enum> | null | undefined;
};

export enum Lookup_App_Material_Request_Message_Type_Enum {
  /** additional conditions */
  AdditionalConditions = 'ADDITIONAL_CONDITIONS',
  /** requester accepted the additional conditions */
  AdditionalConditionsAccepted = 'ADDITIONAL_CONDITIONS_ACCEPTED',
  /** requester denied the additional conditions */
  AdditionalConditionsDenied = 'ADDITIONAL_CONDITIONS_DENIED',
  /** a reminder was sent to the requester to accept or deny the additional requirements after 30 days of no response */
  AdditionalConditionsReminder = 'ADDITIONAL_CONDITIONS_REMINDER',
  /** when a material request is approved by an evaluator at the cp */
  Approved = 'APPROVED',
  /** when a material request is cancelled by the requester */
  Cancelled = 'CANCELLED',
  /** when a material request is denied by an evaluator at the cp */
  Denied = 'DENIED',
  /** When a download is made available */
  DownloadAvailable = 'DOWNLOAD_AVAILABLE',
  /** When a download has expired */
  DownloadExpired = 'DOWNLOAD_EXPIRED',
  /** When a download job has started */
  DownloadRequested = 'DOWNLOAD_REQUESTED',
  /** pdf generated when the material request gets a final status. eg: APPROVED or DENIED or CANCELLED */
  FinalSummary = 'FINAL_SUMMARY',
  /** a regular message */
  Message = 'MESSAGE',
  /** pdf file generated when the requester sends the material request with reuse form to the evaluator */
  ReuseSummary = 'REUSE_SUMMARY'
}

/** Boolean expression to compare columns of type "lookup_app_material_request_message_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_App_Material_Request_Message_Type_Enum_Comparison_Exp = {
  _eq?: Lookup_App_Material_Request_Message_Type_Enum | null | undefined;
  _in?: Array<Lookup_App_Material_Request_Message_Type_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_App_Material_Request_Message_Type_Enum | null | undefined;
  _nin?: Array<Lookup_App_Material_Request_Message_Type_Enum> | null | undefined;
};

export enum Lookup_App_Material_Request_Requester_Capacity_Enum {
  Education = 'EDUCATION',
  Other = 'OTHER',
  PrivateResearch = 'PRIVATE_RESEARCH',
  Work = 'WORK'
}

/** Boolean expression to compare columns of type "lookup_app_material_request_requester_capacity_enum". All fields are combined with logical 'AND'. */
export type Lookup_App_Material_Request_Requester_Capacity_Enum_Comparison_Exp = {
  _eq?: Lookup_App_Material_Request_Requester_Capacity_Enum | null | undefined;
  _in?: Array<Lookup_App_Material_Request_Requester_Capacity_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_App_Material_Request_Requester_Capacity_Enum | null | undefined;
  _nin?: Array<Lookup_App_Material_Request_Requester_Capacity_Enum> | null | undefined;
};

export enum Lookup_App_Material_Request_Status_Enum {
  /** De materiaalaanvraag is goedgekeurd door de aanbieder. */
  Approved = 'APPROVED',
  /** De materiaalaanvraag was ingediend, maar door de aanvrager zelf geannuleerd. */
  Cancelled = 'CANCELLED',
  /** De materiaalaanvraag is afgekeurd door de aanbieder. */
  Denied = 'DENIED',
  /** De materiaalaanvraag is ingediend, maar nog niet bekeken door de aanbieder. */
  New = 'NEW',
  /** De materiaalaanvraag heeft geen status */
  None = 'NONE',
  /** De materiaalaanvraag is ingediend en bekeken door de aabieder, maar de aanbieder heeft nog geen beslissing genomen. */
  Pending = 'PENDING'
}

/** Boolean expression to compare columns of type "lookup_app_material_request_status_enum". All fields are combined with logical 'AND'. */
export type Lookup_App_Material_Request_Status_Enum_Comparison_Exp = {
  _eq?: Lookup_App_Material_Request_Status_Enum | null | undefined;
  _in?: Array<Lookup_App_Material_Request_Status_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_App_Material_Request_Status_Enum | null | undefined;
  _nin?: Array<Lookup_App_Material_Request_Status_Enum> | null | undefined;
};

/** Boolean expression to filter rows from the table "lookup.app_material_request_status_sort_order". All fields are combined with a logical 'AND'. */
export type Lookup_App_Material_Request_Status_Sort_Order_Bool_Exp = {
  _and?: Array<Lookup_App_Material_Request_Status_Sort_Order_Bool_Exp> | null | undefined;
  _not?: Lookup_App_Material_Request_Status_Sort_Order_Bool_Exp | null | undefined;
  _or?: Array<Lookup_App_Material_Request_Status_Sort_Order_Bool_Exp> | null | undefined;
  sort_order?: Int_Comparison_Exp | null | undefined;
  status?: Lookup_App_Material_Request_Status_Enum_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "lookup.app_material_request_status_sort_order" */
export enum Lookup_App_Material_Request_Status_Sort_Order_Constraint {
  /** unique or primary key constraint on columns "status" */
  AppMaterialRequestStatusSortOrderPkey = 'app_material_request_status_sort_order_pkey',
  /** unique or primary key constraint on columns "sort_order" */
  AppMaterialRequestStatusSortOrderSortOrderKey = 'app_material_request_status_sort_order_sort_order_key'
}

/** input type for inserting data into table "lookup.app_material_request_status_sort_order" */
export type Lookup_App_Material_Request_Status_Sort_Order_Insert_Input = {
  sort_order?: number | null | undefined;
  status?: Lookup_App_Material_Request_Status_Enum | null | undefined;
};

/** input type for inserting object relation for remote table "lookup.app_material_request_status_sort_order" */
export type Lookup_App_Material_Request_Status_Sort_Order_Obj_Rel_Insert_Input = {
  data: Lookup_App_Material_Request_Status_Sort_Order_Insert_Input;
  /** upsert condition */
  on_conflict?: Lookup_App_Material_Request_Status_Sort_Order_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "lookup.app_material_request_status_sort_order" */
export type Lookup_App_Material_Request_Status_Sort_Order_On_Conflict = {
  constraint: Lookup_App_Material_Request_Status_Sort_Order_Constraint;
  update_columns?: Array<Lookup_App_Material_Request_Status_Sort_Order_Update_Column>;
  where?: Lookup_App_Material_Request_Status_Sort_Order_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "lookup.app_material_request_status_sort_order". */
export type Lookup_App_Material_Request_Status_Sort_Order_Order_By = {
  sort_order?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
};

/** update columns of table "lookup.app_material_request_status_sort_order" */
export enum Lookup_App_Material_Request_Status_Sort_Order_Update_Column {
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Status = 'status'
}

export enum Lookup_App_Material_Request_Type_Enum {
  /** Meer info van het materiaal */
  MoreInfo = 'MORE_INFO',
  /** Hergebruik van materiaal */
  Reuse = 'REUSE',
  /** Bekijken van het materiaal */
  View = 'VIEW'
}

/** Boolean expression to compare columns of type "lookup_app_material_request_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_App_Material_Request_Type_Enum_Comparison_Exp = {
  _eq?: Lookup_App_Material_Request_Type_Enum | null | undefined;
  _in?: Array<Lookup_App_Material_Request_Type_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_App_Material_Request_Type_Enum | null | undefined;
  _nin?: Array<Lookup_App_Material_Request_Type_Enum> | null | undefined;
};

export enum Lookup_Languages_Enum {
  /** English */
  En = 'en',
  /** Nederlands */
  Nl = 'nl'
}

/** Boolean expression to compare columns of type "lookup_languages_enum". All fields are combined with logical 'AND'. */
export type Lookup_Languages_Enum_Comparison_Exp = {
  _eq?: Lookup_Languages_Enum | null | undefined;
  _in?: Array<Lookup_Languages_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_Languages_Enum | null | undefined;
  _nin?: Array<Lookup_Languages_Enum> | null | undefined;
};

export enum Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum {
  /** Toegang tot specifieke folders van de bezoekersruimte */
  Folders = 'FOLDERS',
  /** Volledige toegang tot de bezoekersruimte */
  Full = 'FULL'
}

/** Boolean expression to compare columns of type "lookup_maintainer_visitor_space_request_access_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum_Comparison_Exp = {
  _eq?: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum | null | undefined;
  _in?: Array<Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum | null | undefined;
  _nin?: Array<Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum> | null | undefined;
};

/** Boolean expression to filter rows from the table "lookup.maintainer_visitor_space_request_status". All fields are combined with a logical 'AND'. */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp = {
  _and?: Array<Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp> | null | undefined;
  _not?: Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp | null | undefined;
  _or?: Array<Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp> | null | undefined;
  comment?: String_Comparison_Exp | null | undefined;
  sort_order?: Int_Comparison_Exp | null | undefined;
  value?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "lookup.maintainer_visitor_space_request_status" */
export enum Lookup_Maintainer_Visitor_Space_Request_Status_Constraint {
  /** unique or primary key constraint on columns "value" */
  CpVisitStatusPkey = 'cp_visit_status_pkey',
  /** unique or primary key constraint on columns "sort_order" */
  MaintainerVisitorSpaceRequestStatusSortOrderKey = 'maintainer_visitor_space_request_status_sort_order_key'
}

/** input type for inserting data into table "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Insert_Input = {
  comment?: string | null | undefined;
  sort_order?: number | null | undefined;
  value?: string | null | undefined;
};

/** input type for inserting object relation for remote table "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Obj_Rel_Insert_Input = {
  data: Lookup_Maintainer_Visitor_Space_Request_Status_Insert_Input;
  /** upsert condition */
  on_conflict?: Lookup_Maintainer_Visitor_Space_Request_Status_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "lookup.maintainer_visitor_space_request_status" */
export type Lookup_Maintainer_Visitor_Space_Request_Status_On_Conflict = {
  constraint: Lookup_Maintainer_Visitor_Space_Request_Status_Constraint;
  update_columns?: Array<Lookup_Maintainer_Visitor_Space_Request_Status_Update_Column>;
  where?: Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "lookup.maintainer_visitor_space_request_status". */
export type Lookup_Maintainer_Visitor_Space_Request_Status_Order_By = {
  comment?: Order_By | null | undefined;
  sort_order?: Order_By | null | undefined;
  value?: Order_By | null | undefined;
};

/** update columns of table "lookup.maintainer_visitor_space_request_status" */
export enum Lookup_Maintainer_Visitor_Space_Request_Status_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Value = 'value'
}

/** Boolean expression to filter rows from the table "lookup.maintainer_visitor_space_status". All fields are combined with a logical 'AND'. */
export type Lookup_Maintainer_Visitor_Space_Status_Bool_Exp = {
  _and?: Array<Lookup_Maintainer_Visitor_Space_Status_Bool_Exp> | null | undefined;
  _not?: Lookup_Maintainer_Visitor_Space_Status_Bool_Exp | null | undefined;
  _or?: Array<Lookup_Maintainer_Visitor_Space_Status_Bool_Exp> | null | undefined;
  comment?: String_Comparison_Exp | null | undefined;
  sort_order?: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Bool_Exp | null | undefined;
  value?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "lookup.maintainer_visitor_space_status" */
export enum Lookup_Maintainer_Visitor_Space_Status_Constraint {
  /** unique or primary key constraint on columns "value" */
  MaintainerVisitorSpaceStatusPkey = 'maintainer_visitor_space_status_pkey'
}

export enum Lookup_Maintainer_Visitor_Space_Status_Enum {
  /** De bezoekersruimte is gepubliceerd en zichtbaar voor bezoekers */
  Active = 'ACTIVE',
  /** De bezoekersruimte is niet gepubliceerd en niet zichtbaar voor bezoekers */
  Inactive = 'INACTIVE',
  /** De bezoekersruimte is opgestart en vindbaar met rechtstreekse link, maar niet vindbaar zoekresultaten of de homepage */
  Requested = 'REQUESTED'
}

/** Boolean expression to compare columns of type "lookup_maintainer_visitor_space_status_enum". All fields are combined with logical 'AND'. */
export type Lookup_Maintainer_Visitor_Space_Status_Enum_Comparison_Exp = {
  _eq?: Lookup_Maintainer_Visitor_Space_Status_Enum | null | undefined;
  _in?: Array<Lookup_Maintainer_Visitor_Space_Status_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_Maintainer_Visitor_Space_Status_Enum | null | undefined;
  _nin?: Array<Lookup_Maintainer_Visitor_Space_Status_Enum> | null | undefined;
};

/** input type for inserting data into table "lookup.maintainer_visitor_space_status" */
export type Lookup_Maintainer_Visitor_Space_Status_Insert_Input = {
  comment?: string | null | undefined;
  sort_order?: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Obj_Rel_Insert_Input | null | undefined;
  value?: string | null | undefined;
};

/** input type for inserting object relation for remote table "lookup.maintainer_visitor_space_status" */
export type Lookup_Maintainer_Visitor_Space_Status_Obj_Rel_Insert_Input = {
  data: Lookup_Maintainer_Visitor_Space_Status_Insert_Input;
  /** upsert condition */
  on_conflict?: Lookup_Maintainer_Visitor_Space_Status_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "lookup.maintainer_visitor_space_status" */
export type Lookup_Maintainer_Visitor_Space_Status_On_Conflict = {
  constraint: Lookup_Maintainer_Visitor_Space_Status_Constraint;
  update_columns?: Array<Lookup_Maintainer_Visitor_Space_Status_Update_Column>;
  where?: Lookup_Maintainer_Visitor_Space_Status_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "lookup.maintainer_visitor_space_status". */
export type Lookup_Maintainer_Visitor_Space_Status_Order_By = {
  comment?: Order_By | null | undefined;
  sort_order?: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Order_By | null | undefined;
  value?: Order_By | null | undefined;
};

/** Boolean expression to filter rows from the table "lookup.maintainer_visitor_space_status_sort_order". All fields are combined with a logical 'AND'. */
export type Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Bool_Exp = {
  _and?: Array<Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Bool_Exp> | null | undefined;
  _not?: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Bool_Exp | null | undefined;
  _or?: Array<Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Bool_Exp> | null | undefined;
  sort_order?: Int_Comparison_Exp | null | undefined;
  status?: Lookup_Maintainer_Visitor_Space_Status_Enum_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "lookup.maintainer_visitor_space_status_sort_order" */
export enum Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Constraint {
  /** unique or primary key constraint on columns "status" */
  MaintainerVisitorSpaceStatusSortOrderPkey = 'maintainer_visitor_space_status_sort_order_pkey',
  /** unique or primary key constraint on columns "sort_order" */
  MaintainerVisitorSpaceStatusSortOrderSortOrderKey = 'maintainer_visitor_space_status_sort_order_sort_order_key'
}

/** input type for inserting data into table "lookup.maintainer_visitor_space_status_sort_order" */
export type Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Insert_Input = {
  sort_order?: number | null | undefined;
  status?: Lookup_Maintainer_Visitor_Space_Status_Enum | null | undefined;
};

/** input type for inserting object relation for remote table "lookup.maintainer_visitor_space_status_sort_order" */
export type Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Obj_Rel_Insert_Input = {
  data: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Insert_Input;
  /** upsert condition */
  on_conflict?: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "lookup.maintainer_visitor_space_status_sort_order" */
export type Lookup_Maintainer_Visitor_Space_Status_Sort_Order_On_Conflict = {
  constraint: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Constraint;
  update_columns?: Array<Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Update_Column>;
  where?: Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "lookup.maintainer_visitor_space_status_sort_order". */
export type Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Order_By = {
  sort_order?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
};

/** update columns of table "lookup.maintainer_visitor_space_status_sort_order" */
export enum Lookup_Maintainer_Visitor_Space_Status_Sort_Order_Update_Column {
  /** column name */
  SortOrder = 'sort_order',
  /** column name */
  Status = 'status'
}

/** update columns of table "lookup.maintainer_visitor_space_status" */
export enum Lookup_Maintainer_Visitor_Space_Status_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** Boolean expression to filter rows from the table "lookup.reuse_category". All fields are combined with a logical 'AND'. */
export type Lookup_Reuse_Category_Bool_Exp = {
  _and?: Array<Lookup_Reuse_Category_Bool_Exp> | null | undefined;
  _not?: Lookup_Reuse_Category_Bool_Exp | null | undefined;
  _or?: Array<Lookup_Reuse_Category_Bool_Exp> | null | undefined;
  group?: String_Comparison_Exp | null | undefined;
  id?: String_Comparison_Exp | null | undefined;
  label?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "lookup.reuse_category" */
export enum Lookup_Reuse_Category_Constraint {
  /** unique or primary key constraint on columns "id" */
  ReuseCategoryPkey = 'reuse_category_pkey'
}

/** input type for inserting data into table "lookup.reuse_category" */
export type Lookup_Reuse_Category_Insert_Input = {
  group?: string | null | undefined;
  id?: string | null | undefined;
  label?: string | null | undefined;
};

/** input type for inserting object relation for remote table "lookup.reuse_category" */
export type Lookup_Reuse_Category_Obj_Rel_Insert_Input = {
  data: Lookup_Reuse_Category_Insert_Input;
  /** upsert condition */
  on_conflict?: Lookup_Reuse_Category_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "lookup.reuse_category" */
export type Lookup_Reuse_Category_On_Conflict = {
  constraint: Lookup_Reuse_Category_Constraint;
  update_columns?: Array<Lookup_Reuse_Category_Update_Column>;
  where?: Lookup_Reuse_Category_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "lookup.reuse_category". */
export type Lookup_Reuse_Category_Order_By = {
  group?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  label?: Order_By | null | undefined;
};

/** update columns of table "lookup.reuse_category" */
export enum Lookup_Reuse_Category_Update_Column {
  /** column name */
  Group = 'group',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label'
}

export enum Lookup_Schema_Audience_Type_Enum {
  /** The resource is restricted to private access or use. */
  Private = 'PRIVATE',
  /** The resource is intended for public access or use. */
  Public = 'PUBLIC'
}

/** Boolean expression to compare columns of type "lookup_schema_audience_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_Schema_Audience_Type_Enum_Comparison_Exp = {
  _eq?: Lookup_Schema_Audience_Type_Enum | null | undefined;
  _in?: Array<Lookup_Schema_Audience_Type_Enum> | null | undefined;
  _is_null?: boolean | null | undefined;
  _neq?: Lookup_Schema_Audience_Type_Enum | null | undefined;
  _nin?: Array<Lookup_Schema_Audience_Type_Enum> | null | undefined;
};

/** Boolean expression to filter rows from the table "maintainer.organization_slug". All fields are combined with a logical 'AND'. */
export type Maintainer_Organization_Slug_Bool_Exp = {
  _and?: Array<Maintainer_Organization_Slug_Bool_Exp> | null | undefined;
  _not?: Maintainer_Organization_Slug_Bool_Exp | null | undefined;
  _or?: Array<Maintainer_Organization_Slug_Bool_Exp> | null | undefined;
  org_identifier?: String_Comparison_Exp | null | undefined;
  organisation?: Graph_Organization_Bool_Exp | null | undefined;
  slug?: String_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "maintainer.organization_slug" */
export enum Maintainer_Organization_Slug_Constraint {
  /** unique or primary key constraint on columns "org_identifier" */
  OrganizationSlugPkey = 'organization_slug_pkey',
  /** unique or primary key constraint on columns "slug" */
  OrganizationSlugSlugKey = 'organization_slug_slug_key'
}

/** input type for inserting data into table "maintainer.organization_slug" */
export type Maintainer_Organization_Slug_Insert_Input = {
  org_identifier?: string | null | undefined;
  organisation?: Graph_Organization_Obj_Rel_Insert_Input | null | undefined;
  slug?: string | null | undefined;
};

/** input type for inserting object relation for remote table "maintainer.organization_slug" */
export type Maintainer_Organization_Slug_Obj_Rel_Insert_Input = {
  data: Maintainer_Organization_Slug_Insert_Input;
  /** upsert condition */
  on_conflict?: Maintainer_Organization_Slug_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "maintainer.organization_slug" */
export type Maintainer_Organization_Slug_On_Conflict = {
  constraint: Maintainer_Organization_Slug_Constraint;
  update_columns?: Array<Maintainer_Organization_Slug_Update_Column>;
  where?: Maintainer_Organization_Slug_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "maintainer.organization_slug". */
export type Maintainer_Organization_Slug_Order_By = {
  org_identifier?: Order_By | null | undefined;
  organisation?: Graph_Organization_Order_By | null | undefined;
  slug?: Order_By | null | undefined;
};

/** update columns of table "maintainer.organization_slug" */
export enum Maintainer_Organization_Slug_Update_Column {
  /** column name */
  OrgIdentifier = 'org_identifier',
  /** column name */
  Slug = 'slug'
}

/** Boolean expression to filter rows from the table "maintainer.visitor_space". All fields are combined with a logical 'AND'. */
export type Maintainer_Visitor_Space_Bool_Exp = {
  _and?: Array<Maintainer_Visitor_Space_Bool_Exp> | null | undefined;
  _not?: Maintainer_Visitor_Space_Bool_Exp | null | undefined;
  _or?: Array<Maintainer_Visitor_Space_Bool_Exp> | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  organisation?: Graph_Organization_Bool_Exp | null | undefined;
  profiles?: Users_Profile_Bool_Exp | null | undefined;
  profiles_aggregate?: Users_Profile_Aggregate_Bool_Exp | null | undefined;
  published_at?: Timestamp_Comparison_Exp | null | undefined;
  schema_audience_type?: Lookup_Schema_Audience_Type_Enum_Comparison_Exp | null | undefined;
  schema_color?: String_Comparison_Exp | null | undefined;
  schema_description_en?: String_Comparison_Exp | null | undefined;
  schema_description_nl?: String_Comparison_Exp | null | undefined;
  schema_image?: String_Comparison_Exp | null | undefined;
  schema_maintainer_id?: String_Comparison_Exp | null | undefined;
  schema_public_access?: Boolean_Comparison_Exp | null | undefined;
  schema_service_description_en?: String_Comparison_Exp | null | undefined;
  schema_service_description_nl?: String_Comparison_Exp | null | undefined;
  status?: Lookup_Maintainer_Visitor_Space_Status_Enum_Comparison_Exp | null | undefined;
  statusInfo?: Lookup_Maintainer_Visitor_Space_Status_Bool_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  visitor_space_requests?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  visitor_space_requests_aggregate?: Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "maintainer.visitor_space" */
export enum Maintainer_Visitor_Space_Constraint {
  /** unique or primary key constraint on columns "id" */
  SpacePkey = 'space_pkey',
  /** unique or primary key constraint on columns "schema_maintainer_id" */
  SpaceSchemaMaintainerIdKey = 'space_schema_maintainer_id_key'
}

/** input type for inserting data into table "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_Insert_Input = {
  created_at?: any;
  id?: any;
  organisation?: Graph_Organization_Obj_Rel_Insert_Input | null | undefined;
  profiles?: Users_Profile_Arr_Rel_Insert_Input | null | undefined;
  published_at?: any;
  schema_audience_type?: Lookup_Schema_Audience_Type_Enum | null | undefined;
  schema_color?: string | null | undefined;
  schema_description_en?: string | null | undefined;
  schema_description_nl?: string | null | undefined;
  schema_image?: string | null | undefined;
  schema_maintainer_id?: string | null | undefined;
  schema_public_access?: boolean | null | undefined;
  schema_service_description_en?: string | null | undefined;
  schema_service_description_nl?: string | null | undefined;
  status?: Lookup_Maintainer_Visitor_Space_Status_Enum | null | undefined;
  statusInfo?: Lookup_Maintainer_Visitor_Space_Status_Obj_Rel_Insert_Input | null | undefined;
  updated_at?: any;
  visitor_space_requests?: Maintainer_Visitor_Space_Request_Arr_Rel_Insert_Input | null | undefined;
};

/** input type for inserting object relation for remote table "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_Obj_Rel_Insert_Input = {
  data: Maintainer_Visitor_Space_Insert_Input;
  /** upsert condition */
  on_conflict?: Maintainer_Visitor_Space_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_On_Conflict = {
  constraint: Maintainer_Visitor_Space_Constraint;
  update_columns?: Array<Maintainer_Visitor_Space_Update_Column>;
  where?: Maintainer_Visitor_Space_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "maintainer.visitor_space". */
export type Maintainer_Visitor_Space_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  organisation?: Graph_Organization_Order_By | null | undefined;
  profiles_aggregate?: Users_Profile_Aggregate_Order_By | null | undefined;
  published_at?: Order_By | null | undefined;
  schema_audience_type?: Order_By | null | undefined;
  schema_color?: Order_By | null | undefined;
  schema_description_en?: Order_By | null | undefined;
  schema_description_nl?: Order_By | null | undefined;
  schema_image?: Order_By | null | undefined;
  schema_maintainer_id?: Order_By | null | undefined;
  schema_public_access?: Order_By | null | undefined;
  schema_service_description_en?: Order_By | null | undefined;
  schema_service_description_nl?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
  statusInfo?: Lookup_Maintainer_Visitor_Space_Status_Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  visitor_space_requests_aggregate?: Maintainer_Visitor_Space_Request_Aggregate_Order_By | null | undefined;
};

export type Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp = {
  bool_and?: Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_And = {
  arguments: Maintainer_Visitor_Space_Request_Select_Column_Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Maintainer_Visitor_Space_Request_Select_Column_Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Maintainer_Visitor_Space_Request_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Maintainer_Visitor_Space_Request_Max_Order_By | null | undefined;
  min?: Maintainer_Visitor_Space_Request_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Arr_Rel_Insert_Input = {
  data: Array<Maintainer_Visitor_Space_Request_Insert_Input>;
  /** upsert condition */
  on_conflict?: Maintainer_Visitor_Space_Request_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "maintainer.visitor_space_request". All fields are combined with a logical 'AND'. */
export type Maintainer_Visitor_Space_Request_Bool_Exp = {
  _and?: Array<Maintainer_Visitor_Space_Request_Bool_Exp> | null | undefined;
  _not?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  _or?: Array<Maintainer_Visitor_Space_Request_Bool_Exp> | null | undefined;
  access_type?: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum_Comparison_Exp | null | undefined;
  accessible_folders?: Maintainer_Visitor_Space_Request_Folder_Access_Bool_Exp | null | undefined;
  accessible_folders_aggregate?: Maintainer_Visitor_Space_Request_Folder_Access_Aggregate_Bool_Exp | null | undefined;
  cp_space_id?: Uuid_Comparison_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  end_date?: Timestamp_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  last_updated_by?: Users_Profile_Bool_Exp | null | undefined;
  notifications?: App_Notification_Bool_Exp | null | undefined;
  notifications_aggregate?: App_Notification_Aggregate_Bool_Exp | null | undefined;
  requested_by?: Users_Profile_Bool_Exp | null | undefined;
  start_date?: Timestamp_Comparison_Exp | null | undefined;
  status?: String_Comparison_Exp | null | undefined;
  status_info?: Lookup_Maintainer_Visitor_Space_Request_Status_Bool_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  updated_by?: Uuid_Comparison_Exp | null | undefined;
  user_accepted_tos?: Boolean_Comparison_Exp | null | undefined;
  user_profile_id?: Uuid_Comparison_Exp | null | undefined;
  user_reason?: String_Comparison_Exp | null | undefined;
  user_timeframe?: String_Comparison_Exp | null | undefined;
  visitor_space?: Maintainer_Visitor_Space_Bool_Exp | null | undefined;
  visitor_space_request_notes?: Maintainer_Visitor_Space_Request_Note_Bool_Exp | null | undefined;
  visitor_space_request_notes_aggregate?: Maintainer_Visitor_Space_Request_Note_Aggregate_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "maintainer.visitor_space_request" */
export enum Maintainer_Visitor_Space_Request_Constraint {
  /** unique or primary key constraint on columns "id" */
  VisitPkey = 'visit_pkey'
}

export type Maintainer_Visitor_Space_Request_Folder_Access_Aggregate_Bool_Exp = {
  count?: Maintainer_Visitor_Space_Request_Folder_Access_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Maintainer_Visitor_Space_Request_Folder_Access_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Maintainer_Visitor_Space_Request_Folder_Access_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Maintainer_Visitor_Space_Request_Folder_Access_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "maintainer.visitor_space_request_folder_access" */
export type Maintainer_Visitor_Space_Request_Folder_Access_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Maintainer_Visitor_Space_Request_Folder_Access_Max_Order_By | null | undefined;
  min?: Maintainer_Visitor_Space_Request_Folder_Access_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "maintainer.visitor_space_request_folder_access" */
export type Maintainer_Visitor_Space_Request_Folder_Access_Arr_Rel_Insert_Input = {
  data: Array<Maintainer_Visitor_Space_Request_Folder_Access_Insert_Input>;
  /** upsert condition */
  on_conflict?: Maintainer_Visitor_Space_Request_Folder_Access_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "maintainer.visitor_space_request_folder_access". All fields are combined with a logical 'AND'. */
export type Maintainer_Visitor_Space_Request_Folder_Access_Bool_Exp = {
  _and?: Array<Maintainer_Visitor_Space_Request_Folder_Access_Bool_Exp> | null | undefined;
  _not?: Maintainer_Visitor_Space_Request_Folder_Access_Bool_Exp | null | undefined;
  _or?: Array<Maintainer_Visitor_Space_Request_Folder_Access_Bool_Exp> | null | undefined;
  folder?: Users_Folder_Bool_Exp | null | undefined;
  folder_id?: Uuid_Comparison_Exp | null | undefined;
  folder_space_visitor_requests?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  folder_space_visitor_requests_aggregate?: Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  visit_request_id?: Uuid_Comparison_Exp | null | undefined;
  visitor_space_request?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  visitor_space_request_folders?: Users_Folder_Bool_Exp | null | undefined;
  visitor_space_request_folders_aggregate?: Users_Folder_Aggregate_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "maintainer.visitor_space_request_folder_access" */
export enum Maintainer_Visitor_Space_Request_Folder_Access_Constraint {
  /** unique or primary key constraint on columns "id" */
  VisitorSpaceRequestFolderAccessPkey = 'visitor_space_request_folder_access_pkey'
}

/** input type for inserting data into table "maintainer.visitor_space_request_folder_access" */
export type Maintainer_Visitor_Space_Request_Folder_Access_Insert_Input = {
  folder?: Users_Folder_Obj_Rel_Insert_Input | null | undefined;
  folder_id?: any;
  folder_space_visitor_requests?: Maintainer_Visitor_Space_Request_Arr_Rel_Insert_Input | null | undefined;
  id?: any;
  visit_request_id?: any;
  visitor_space_request?: Maintainer_Visitor_Space_Request_Obj_Rel_Insert_Input | null | undefined;
  visitor_space_request_folders?: Users_Folder_Arr_Rel_Insert_Input | null | undefined;
};

/** order by max() on columns of table "maintainer.visitor_space_request_folder_access" */
export type Maintainer_Visitor_Space_Request_Folder_Access_Max_Order_By = {
  folder_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  visit_request_id?: Order_By | null | undefined;
};

/** order by min() on columns of table "maintainer.visitor_space_request_folder_access" */
export type Maintainer_Visitor_Space_Request_Folder_Access_Min_Order_By = {
  folder_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  visit_request_id?: Order_By | null | undefined;
};

/** on_conflict condition type for table "maintainer.visitor_space_request_folder_access" */
export type Maintainer_Visitor_Space_Request_Folder_Access_On_Conflict = {
  constraint: Maintainer_Visitor_Space_Request_Folder_Access_Constraint;
  update_columns?: Array<Maintainer_Visitor_Space_Request_Folder_Access_Update_Column>;
  where?: Maintainer_Visitor_Space_Request_Folder_Access_Bool_Exp | null | undefined;
};

/** select columns of table "maintainer.visitor_space_request_folder_access" */
export enum Maintainer_Visitor_Space_Request_Folder_Access_Select_Column {
  /** column name */
  FolderId = 'folder_id',
  /** column name */
  Id = 'id',
  /** column name */
  VisitRequestId = 'visit_request_id'
}

/** update columns of table "maintainer.visitor_space_request_folder_access" */
export enum Maintainer_Visitor_Space_Request_Folder_Access_Update_Column {
  /** column name */
  FolderId = 'folder_id',
  /** column name */
  Id = 'id',
  /** column name */
  VisitRequestId = 'visit_request_id'
}

/** input type for inserting data into table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Insert_Input = {
  access_type?: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum | null | undefined;
  accessible_folders?: Maintainer_Visitor_Space_Request_Folder_Access_Arr_Rel_Insert_Input | null | undefined;
  cp_space_id?: any;
  created_at?: any;
  end_date?: any;
  id?: any;
  last_updated_by?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  notifications?: App_Notification_Arr_Rel_Insert_Input | null | undefined;
  requested_by?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  start_date?: any;
  status?: string | null | undefined;
  status_info?: Lookup_Maintainer_Visitor_Space_Request_Status_Obj_Rel_Insert_Input | null | undefined;
  updated_at?: any;
  updated_by?: any;
  user_accepted_tos?: boolean | null | undefined;
  user_profile_id?: any;
  user_reason?: string | null | undefined;
  user_timeframe?: string | null | undefined;
  visitor_space?: Maintainer_Visitor_Space_Obj_Rel_Insert_Input | null | undefined;
  visitor_space_request_notes?: Maintainer_Visitor_Space_Request_Note_Arr_Rel_Insert_Input | null | undefined;
};

/** order by max() on columns of table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Max_Order_By = {
  cp_space_id?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  end_date?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  start_date?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  updated_by?: Order_By | null | undefined;
  user_profile_id?: Order_By | null | undefined;
  user_reason?: Order_By | null | undefined;
  user_timeframe?: Order_By | null | undefined;
};

/** order by min() on columns of table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Min_Order_By = {
  cp_space_id?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  end_date?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  start_date?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  updated_by?: Order_By | null | undefined;
  user_profile_id?: Order_By | null | undefined;
  user_reason?: Order_By | null | undefined;
  user_timeframe?: Order_By | null | undefined;
};

export type Maintainer_Visitor_Space_Request_Note_Aggregate_Bool_Exp = {
  count?: Maintainer_Visitor_Space_Request_Note_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Maintainer_Visitor_Space_Request_Note_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Maintainer_Visitor_Space_Request_Note_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Maintainer_Visitor_Space_Request_Note_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Maintainer_Visitor_Space_Request_Note_Max_Order_By | null | undefined;
  min?: Maintainer_Visitor_Space_Request_Note_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Arr_Rel_Insert_Input = {
  data: Array<Maintainer_Visitor_Space_Request_Note_Insert_Input>;
  /** upsert condition */
  on_conflict?: Maintainer_Visitor_Space_Request_Note_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "maintainer.visitor_space_request_note". All fields are combined with a logical 'AND'. */
export type Maintainer_Visitor_Space_Request_Note_Bool_Exp = {
  _and?: Array<Maintainer_Visitor_Space_Request_Note_Bool_Exp> | null | undefined;
  _not?: Maintainer_Visitor_Space_Request_Note_Bool_Exp | null | undefined;
  _or?: Array<Maintainer_Visitor_Space_Request_Note_Bool_Exp> | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  note?: String_Comparison_Exp | null | undefined;
  profile?: Users_Profile_Bool_Exp | null | undefined;
  profile_id?: Uuid_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  visit?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  visit_id?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "maintainer.visitor_space_request_note" */
export enum Maintainer_Visitor_Space_Request_Note_Constraint {
  /** unique or primary key constraint on columns "id" */
  VisitNotePkey = 'visit_note_pkey'
}

/** input type for inserting data into table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Insert_Input = {
  created_at?: any;
  id?: any;
  note?: string | null | undefined;
  profile?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: any;
  updated_at?: any;
  visit?: Maintainer_Visitor_Space_Request_Obj_Rel_Insert_Input | null | undefined;
  visit_id?: any;
};

/** order by max() on columns of table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  note?: Order_By | null | undefined;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  visit_id?: Order_By | null | undefined;
};

/** order by min() on columns of table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  note?: Order_By | null | undefined;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  visit_id?: Order_By | null | undefined;
};

/** on_conflict condition type for table "maintainer.visitor_space_request_note" */
export type Maintainer_Visitor_Space_Request_Note_On_Conflict = {
  constraint: Maintainer_Visitor_Space_Request_Note_Constraint;
  update_columns?: Array<Maintainer_Visitor_Space_Request_Note_Update_Column>;
  where?: Maintainer_Visitor_Space_Request_Note_Bool_Exp | null | undefined;
};

/** select columns of table "maintainer.visitor_space_request_note" */
export enum Maintainer_Visitor_Space_Request_Note_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Note = 'note',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  VisitId = 'visit_id'
}

/** update columns of table "maintainer.visitor_space_request_note" */
export enum Maintainer_Visitor_Space_Request_Note_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Note = 'note',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  VisitId = 'visit_id'
}

/** input type for inserting object relation for remote table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Obj_Rel_Insert_Input = {
  data: Maintainer_Visitor_Space_Request_Insert_Input;
  /** upsert condition */
  on_conflict?: Maintainer_Visitor_Space_Request_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_On_Conflict = {
  constraint: Maintainer_Visitor_Space_Request_Constraint;
  update_columns?: Array<Maintainer_Visitor_Space_Request_Update_Column>;
  where?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "maintainer.visitor_space_request". */
export type Maintainer_Visitor_Space_Request_Order_By = {
  access_type?: Order_By | null | undefined;
  accessible_folders_aggregate?: Maintainer_Visitor_Space_Request_Folder_Access_Aggregate_Order_By | null | undefined;
  cp_space_id?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  end_date?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  last_updated_by?: Users_Profile_Order_By | null | undefined;
  notifications_aggregate?: App_Notification_Aggregate_Order_By | null | undefined;
  requested_by?: Users_Profile_Order_By | null | undefined;
  start_date?: Order_By | null | undefined;
  status?: Order_By | null | undefined;
  status_info?: Lookup_Maintainer_Visitor_Space_Request_Status_Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  updated_by?: Order_By | null | undefined;
  user_accepted_tos?: Order_By | null | undefined;
  user_profile_id?: Order_By | null | undefined;
  user_reason?: Order_By | null | undefined;
  user_timeframe?: Order_By | null | undefined;
  visitor_space?: Maintainer_Visitor_Space_Order_By | null | undefined;
  visitor_space_request_notes_aggregate?: Maintainer_Visitor_Space_Request_Note_Aggregate_Order_By | null | undefined;
};

/** select columns of table "maintainer.visitor_space_request" */
export enum Maintainer_Visitor_Space_Request_Select_Column {
  /** column name */
  AccessType = 'access_type',
  /** column name */
  CpSpaceId = 'cp_space_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EndDate = 'end_date',
  /** column name */
  Id = 'id',
  /** column name */
  StartDate = 'start_date',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UpdatedBy = 'updated_by',
  /** column name */
  UserAcceptedTos = 'user_accepted_tos',
  /** column name */
  UserProfileId = 'user_profile_id',
  /** column name */
  UserReason = 'user_reason',
  /** column name */
  UserTimeframe = 'user_timeframe'
}

/** select "maintainer_visitor_space_request_aggregate_bool_exp_bool_and_arguments_columns" columns of table "maintainer.visitor_space_request" */
export enum Maintainer_Visitor_Space_Request_Select_Column_Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  UserAcceptedTos = 'user_accepted_tos'
}

/** select "maintainer_visitor_space_request_aggregate_bool_exp_bool_or_arguments_columns" columns of table "maintainer.visitor_space_request" */
export enum Maintainer_Visitor_Space_Request_Select_Column_Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  UserAcceptedTos = 'user_accepted_tos'
}

/** input type for updating data in table "maintainer.visitor_space_request" */
export type Maintainer_Visitor_Space_Request_Set_Input = {
  access_type?: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum | null | undefined;
  cp_space_id?: any;
  created_at?: any;
  end_date?: any;
  id?: any;
  start_date?: any;
  status?: string | null | undefined;
  updated_at?: any;
  updated_by?: any;
  user_accepted_tos?: boolean | null | undefined;
  user_profile_id?: any;
  user_reason?: string | null | undefined;
  user_timeframe?: string | null | undefined;
};

/** update columns of table "maintainer.visitor_space_request" */
export enum Maintainer_Visitor_Space_Request_Update_Column {
  /** column name */
  AccessType = 'access_type',
  /** column name */
  CpSpaceId = 'cp_space_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EndDate = 'end_date',
  /** column name */
  Id = 'id',
  /** column name */
  StartDate = 'start_date',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UpdatedBy = 'updated_by',
  /** column name */
  UserAcceptedTos = 'user_accepted_tos',
  /** column name */
  UserProfileId = 'user_profile_id',
  /** column name */
  UserReason = 'user_reason',
  /** column name */
  UserTimeframe = 'user_timeframe'
}

/** input type for updating data in table "maintainer.visitor_space" */
export type Maintainer_Visitor_Space_Set_Input = {
  created_at?: any;
  id?: any;
  published_at?: any;
  schema_audience_type?: Lookup_Schema_Audience_Type_Enum | null | undefined;
  schema_color?: string | null | undefined;
  schema_description_en?: string | null | undefined;
  schema_description_nl?: string | null | undefined;
  schema_image?: string | null | undefined;
  schema_maintainer_id?: string | null | undefined;
  schema_public_access?: boolean | null | undefined;
  schema_service_description_en?: string | null | undefined;
  schema_service_description_nl?: string | null | undefined;
  status?: Lookup_Maintainer_Visitor_Space_Status_Enum | null | undefined;
  updated_at?: any;
};

/** update columns of table "maintainer.visitor_space" */
export enum Maintainer_Visitor_Space_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  PublishedAt = 'published_at',
  /** column name */
  SchemaAudienceType = 'schema_audience_type',
  /** column name */
  SchemaColor = 'schema_color',
  /** column name */
  SchemaDescriptionEn = 'schema_description_en',
  /** column name */
  SchemaDescriptionNl = 'schema_description_nl',
  /** column name */
  SchemaImage = 'schema_image',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaPublicAccess = 'schema_public_access',
  /** column name */
  SchemaServiceDescriptionEn = 'schema_service_description_en',
  /** column name */
  SchemaServiceDescriptionNl = 'schema_service_description_nl',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
export type Smallint_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

/** Boolean expression to compare columns of type "time". All fields are combined with logical 'AND'. */
export type Time_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

export type Users_Folder_Aggregate_Bool_Exp = {
  bool_and?: Users_Folder_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Users_Folder_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Users_Folder_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Users_Folder_Aggregate_Bool_Exp_Bool_And = {
  arguments: Users_Folder_Select_Column_Users_Folder_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Users_Folder_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Folder_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Users_Folder_Select_Column_Users_Folder_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Users_Folder_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Folder_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Users_Folder_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Users_Folder_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "users.folder" */
export type Users_Folder_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Users_Folder_Max_Order_By | null | undefined;
  min?: Users_Folder_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "users.folder" */
export type Users_Folder_Arr_Rel_Insert_Input = {
  data: Array<Users_Folder_Insert_Input>;
  /** upsert condition */
  on_conflict?: Users_Folder_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "users.folder". All fields are combined with a logical 'AND'. */
export type Users_Folder_Bool_Exp = {
  _and?: Array<Users_Folder_Bool_Exp> | null | undefined;
  _not?: Users_Folder_Bool_Exp | null | undefined;
  _or?: Array<Users_Folder_Bool_Exp> | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  intellectualEntities?: Users_Folder_Ie_Bool_Exp | null | undefined;
  intellectualEntities_aggregate?: Users_Folder_Ie_Aggregate_Bool_Exp | null | undefined;
  is_default?: Boolean_Comparison_Exp | null | undefined;
  is_deleted?: Boolean_Comparison_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  user_profile?: Users_Profile_Bool_Exp | null | undefined;
  user_profile_id?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "users.folder" */
export enum Users_Folder_Constraint {
  /** unique or primary key constraint on columns "id" */
  CollectionPkey = 'collection_pkey'
}

export type Users_Folder_Ie_Aggregate_Bool_Exp = {
  count?: Users_Folder_Ie_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Users_Folder_Ie_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Users_Folder_Ie_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Users_Folder_Ie_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** input type for inserting array relation for remote table "users.folder_ie" */
export type Users_Folder_Ie_Arr_Rel_Insert_Input = {
  data: Array<Users_Folder_Ie_Insert_Input>;
  /** upsert condition */
  on_conflict?: Users_Folder_Ie_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "users.folder_ie". All fields are combined with a logical 'AND'. */
export type Users_Folder_Ie_Bool_Exp = {
  _and?: Array<Users_Folder_Ie_Bool_Exp> | null | undefined;
  _not?: Users_Folder_Ie_Bool_Exp | null | undefined;
  _or?: Array<Users_Folder_Ie_Bool_Exp> | null | undefined;
  collection?: Users_Folder_Bool_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  ie_object_id?: String_Comparison_Exp | null | undefined;
  intellectualEntity?: Graph_Intellectual_Entity_Bool_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  user_collection_id?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "users.folder_ie" */
export enum Users_Folder_Ie_Constraint {
  /** unique or primary key constraint on columns "ie_object_id", "user_collection_id" */
  CollectionItemPkey = 'collection_item_pkey'
}

/** input type for inserting data into table "users.folder_ie" */
export type Users_Folder_Ie_Insert_Input = {
  collection?: Users_Folder_Obj_Rel_Insert_Input | null | undefined;
  created_at?: any;
  /** de url id van de intellectual entity */
  ie_object_id?: string | null | undefined;
  intellectualEntity?: Graph_Intellectual_Entity_Obj_Rel_Insert_Input | null | undefined;
  updated_at?: any;
  user_collection_id?: any;
};

/** on_conflict condition type for table "users.folder_ie" */
export type Users_Folder_Ie_On_Conflict = {
  constraint: Users_Folder_Ie_Constraint;
  update_columns?: Array<Users_Folder_Ie_Update_Column>;
  where?: Users_Folder_Ie_Bool_Exp | null | undefined;
};

/** select columns of table "users.folder_ie" */
export enum Users_Folder_Ie_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IeObjectId = 'ie_object_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserCollectionId = 'user_collection_id'
}

/** update columns of table "users.folder_ie" */
export enum Users_Folder_Ie_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IeObjectId = 'ie_object_id',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserCollectionId = 'user_collection_id'
}

/** input type for inserting data into table "users.folder" */
export type Users_Folder_Insert_Input = {
  created_at?: any;
  description?: string | null | undefined;
  id?: any;
  intellectualEntities?: Users_Folder_Ie_Arr_Rel_Insert_Input | null | undefined;
  is_default?: boolean | null | undefined;
  is_deleted?: boolean | null | undefined;
  name?: string | null | undefined;
  updated_at?: any;
  user_profile?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  user_profile_id?: any;
};

/** order by max() on columns of table "users.folder" */
export type Users_Folder_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  description?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  name?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  user_profile_id?: Order_By | null | undefined;
};

/** order by min() on columns of table "users.folder" */
export type Users_Folder_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  description?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  name?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  user_profile_id?: Order_By | null | undefined;
};

/** input type for inserting object relation for remote table "users.folder" */
export type Users_Folder_Obj_Rel_Insert_Input = {
  data: Users_Folder_Insert_Input;
  /** upsert condition */
  on_conflict?: Users_Folder_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "users.folder" */
export type Users_Folder_On_Conflict = {
  constraint: Users_Folder_Constraint;
  update_columns?: Array<Users_Folder_Update_Column>;
  where?: Users_Folder_Bool_Exp | null | undefined;
};

/** select columns of table "users.folder" */
export enum Users_Folder_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  IsDefault = 'is_default',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserProfileId = 'user_profile_id'
}

/** select "users_folder_aggregate_bool_exp_bool_and_arguments_columns" columns of table "users.folder" */
export enum Users_Folder_Select_Column_Users_Folder_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsDefault = 'is_default',
  /** column name */
  IsDeleted = 'is_deleted'
}

/** select "users_folder_aggregate_bool_exp_bool_or_arguments_columns" columns of table "users.folder" */
export enum Users_Folder_Select_Column_Users_Folder_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsDefault = 'is_default',
  /** column name */
  IsDeleted = 'is_deleted'
}

/** input type for updating data in table "users.folder" */
export type Users_Folder_Set_Input = {
  created_at?: any;
  description?: string | null | undefined;
  id?: any;
  is_default?: boolean | null | undefined;
  is_deleted?: boolean | null | undefined;
  name?: string | null | undefined;
  updated_at?: any;
  user_profile_id?: any;
};

/** update columns of table "users.folder" */
export enum Users_Folder_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  IsDefault = 'is_default',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserProfileId = 'user_profile_id'
}

/** Boolean expression to filter rows from the table "users.group". All fields are combined with a logical 'AND'. */
export type Users_Group_Bool_Exp = {
  _and?: Array<Users_Group_Bool_Exp> | null | undefined;
  _not?: Users_Group_Bool_Exp | null | undefined;
  _or?: Array<Users_Group_Bool_Exp> | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  label?: String_Comparison_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  permissions?: Users_Group_Permission_Bool_Exp | null | undefined;
  permissions_aggregate?: Users_Group_Permission_Aggregate_Bool_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "users.group" */
export enum Users_Group_Constraint {
  /** unique or primary key constraint on columns "id" */
  GroupPkey = 'group_pkey'
}

/** input type for inserting data into table "users.group" */
export type Users_Group_Insert_Input = {
  created_at?: any;
  description?: string | null | undefined;
  id?: any;
  label?: string | null | undefined;
  name?: string | null | undefined;
  permissions?: Users_Group_Permission_Arr_Rel_Insert_Input | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "users.group" */
export type Users_Group_Obj_Rel_Insert_Input = {
  data: Users_Group_Insert_Input;
  /** upsert condition */
  on_conflict?: Users_Group_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "users.group" */
export type Users_Group_On_Conflict = {
  constraint: Users_Group_Constraint;
  update_columns?: Array<Users_Group_Update_Column>;
  where?: Users_Group_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "users.group". */
export type Users_Group_Order_By = {
  created_at?: Order_By | null | undefined;
  description?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  label?: Order_By | null | undefined;
  name?: Order_By | null | undefined;
  permissions_aggregate?: Users_Group_Permission_Aggregate_Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

export type Users_Group_Permission_Aggregate_Bool_Exp = {
  count?: Users_Group_Permission_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Users_Group_Permission_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Users_Group_Permission_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Users_Group_Permission_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "users.group_permission" */
export type Users_Group_Permission_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Users_Group_Permission_Max_Order_By | null | undefined;
  min?: Users_Group_Permission_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "users.group_permission" */
export type Users_Group_Permission_Arr_Rel_Insert_Input = {
  data: Array<Users_Group_Permission_Insert_Input>;
  /** upsert condition */
  on_conflict?: Users_Group_Permission_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "users.group_permission". All fields are combined with a logical 'AND'. */
export type Users_Group_Permission_Bool_Exp = {
  _and?: Array<Users_Group_Permission_Bool_Exp> | null | undefined;
  _not?: Users_Group_Permission_Bool_Exp | null | undefined;
  _or?: Array<Users_Group_Permission_Bool_Exp> | null | undefined;
  group?: Users_Group_Bool_Exp | null | undefined;
  group_id?: Uuid_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  permission?: Users_Permission_Bool_Exp | null | undefined;
  permission_id?: Uuid_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "users.group_permission" */
export enum Users_Group_Permission_Constraint {
  /** unique or primary key constraint on columns "permission_id", "group_id" */
  GroupPermissionGroupIdPermissionIdKey = 'group_permission_group_id_permission_id_key',
  /** unique or primary key constraint on columns "id" */
  GroupPermissionPkey = 'group_permission_pkey'
}

/** input type for inserting data into table "users.group_permission" */
export type Users_Group_Permission_Insert_Input = {
  group?: Users_Group_Obj_Rel_Insert_Input | null | undefined;
  group_id?: any;
  id?: any;
  permission?: Users_Permission_Obj_Rel_Insert_Input | null | undefined;
  permission_id?: any;
};

/** order by max() on columns of table "users.group_permission" */
export type Users_Group_Permission_Max_Order_By = {
  group_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  permission_id?: Order_By | null | undefined;
};

/** order by min() on columns of table "users.group_permission" */
export type Users_Group_Permission_Min_Order_By = {
  group_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  permission_id?: Order_By | null | undefined;
};

/** on_conflict condition type for table "users.group_permission" */
export type Users_Group_Permission_On_Conflict = {
  constraint: Users_Group_Permission_Constraint;
  update_columns?: Array<Users_Group_Permission_Update_Column>;
  where?: Users_Group_Permission_Bool_Exp | null | undefined;
};

/** select columns of table "users.group_permission" */
export enum Users_Group_Permission_Select_Column {
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  PermissionId = 'permission_id'
}

/** update columns of table "users.group_permission" */
export enum Users_Group_Permission_Update_Column {
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  PermissionId = 'permission_id'
}

/** update columns of table "users.group" */
export enum Users_Group_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Users_Identity_Aggregate_Bool_Exp = {
  count?: Users_Identity_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Users_Identity_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Users_Identity_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Users_Identity_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "users.identity" */
export type Users_Identity_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Users_Identity_Max_Order_By | null | undefined;
  min?: Users_Identity_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "users.identity" */
export type Users_Identity_Arr_Rel_Insert_Input = {
  data: Array<Users_Identity_Insert_Input>;
  /** upsert condition */
  on_conflict?: Users_Identity_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "users.identity". All fields are combined with a logical 'AND'. */
export type Users_Identity_Bool_Exp = {
  _and?: Array<Users_Identity_Bool_Exp> | null | undefined;
  _not?: Users_Identity_Bool_Exp | null | undefined;
  _or?: Array<Users_Identity_Bool_Exp> | null | undefined;
  created_at?: Timestamptz_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  identity_id?: String_Comparison_Exp | null | undefined;
  identity_provider_name?: String_Comparison_Exp | null | undefined;
  profile?: Users_Profile_Bool_Exp | null | undefined;
  profile_id?: Uuid_Comparison_Exp | null | undefined;
  updated_at?: Timestamptz_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "users.identity" */
export enum Users_Identity_Constraint {
  /** unique or primary key constraint on columns "id" */
  IdentitiesPkey = 'identities_pkey',
  /** unique or primary key constraint on columns "profile_id", "identity_provider_name" */
  IdentitiesProfileIdIdentityProviderIdKey = 'identities_profile_id_identity_provider_id_key'
}

/** input type for inserting data into table "users.identity" */
export type Users_Identity_Insert_Input = {
  created_at?: any;
  id?: any;
  identity_id?: string | null | undefined;
  identity_provider_name?: string | null | undefined;
  profile?: Users_Profile_Obj_Rel_Insert_Input | null | undefined;
  profile_id?: any;
  updated_at?: any;
};

/** order by max() on columns of table "users.identity" */
export type Users_Identity_Max_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  identity_id?: Order_By | null | undefined;
  identity_provider_name?: Order_By | null | undefined;
  profile_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "users.identity" */
export type Users_Identity_Min_Order_By = {
  created_at?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  identity_id?: Order_By | null | undefined;
  identity_provider_name?: Order_By | null | undefined;
  profile_id?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** on_conflict condition type for table "users.identity" */
export type Users_Identity_On_Conflict = {
  constraint: Users_Identity_Constraint;
  update_columns?: Array<Users_Identity_Update_Column>;
  where?: Users_Identity_Bool_Exp | null | undefined;
};

/** select columns of table "users.identity" */
export enum Users_Identity_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IdentityId = 'identity_id',
  /** column name */
  IdentityProviderName = 'identity_provider_name',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** update columns of table "users.identity" */
export enum Users_Identity_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IdentityId = 'identity_id',
  /** column name */
  IdentityProviderName = 'identity_provider_name',
  /** column name */
  ProfileId = 'profile_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to filter rows from the table "users.permission". All fields are combined with a logical 'AND'. */
export type Users_Permission_Bool_Exp = {
  _and?: Array<Users_Permission_Bool_Exp> | null | undefined;
  _not?: Users_Permission_Bool_Exp | null | undefined;
  _or?: Array<Users_Permission_Bool_Exp> | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  description?: String_Comparison_Exp | null | undefined;
  groups?: Users_Group_Permission_Bool_Exp | null | undefined;
  groups_aggregate?: Users_Group_Permission_Aggregate_Bool_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  label?: String_Comparison_Exp | null | undefined;
  name?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
};

/** unique or primary key constraints on table "users.permission" */
export enum Users_Permission_Constraint {
  /** unique or primary key constraint on columns "name" */
  PermissionNameKey = 'permission_name_key',
  /** unique or primary key constraint on columns "id" */
  PermissionPkey = 'permission_pkey'
}

/** input type for inserting data into table "users.permission" */
export type Users_Permission_Insert_Input = {
  created_at?: any;
  description?: string | null | undefined;
  groups?: Users_Group_Permission_Arr_Rel_Insert_Input | null | undefined;
  id?: any;
  label?: string | null | undefined;
  name?: string | null | undefined;
  updated_at?: any;
};

/** input type for inserting object relation for remote table "users.permission" */
export type Users_Permission_Obj_Rel_Insert_Input = {
  data: Users_Permission_Insert_Input;
  /** upsert condition */
  on_conflict?: Users_Permission_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "users.permission" */
export type Users_Permission_On_Conflict = {
  constraint: Users_Permission_Constraint;
  update_columns?: Array<Users_Permission_Update_Column>;
  where?: Users_Permission_Bool_Exp | null | undefined;
};

/** update columns of table "users.permission" */
export enum Users_Permission_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Users_Profile_Aggregate_Bool_Exp = {
  bool_and?: Users_Profile_Aggregate_Bool_Exp_Bool_And | null | undefined;
  bool_or?: Users_Profile_Aggregate_Bool_Exp_Bool_Or | null | undefined;
  count?: Users_Profile_Aggregate_Bool_Exp_Count | null | undefined;
};

export type Users_Profile_Aggregate_Bool_Exp_Bool_And = {
  arguments: Users_Profile_Select_Column_Users_Profile_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Users_Profile_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Profile_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Users_Profile_Select_Column_Users_Profile_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: boolean | null | undefined;
  filter?: Users_Profile_Bool_Exp | null | undefined;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Profile_Aggregate_Bool_Exp_Count = {
  arguments?: Array<Users_Profile_Select_Column> | null | undefined;
  distinct?: boolean | null | undefined;
  filter?: Users_Profile_Bool_Exp | null | undefined;
  predicate: Int_Comparison_Exp;
};

/** order by aggregate values of table "users.profile" */
export type Users_Profile_Aggregate_Order_By = {
  count?: Order_By | null | undefined;
  max?: Users_Profile_Max_Order_By | null | undefined;
  min?: Users_Profile_Min_Order_By | null | undefined;
};

/** input type for inserting array relation for remote table "users.profile" */
export type Users_Profile_Arr_Rel_Insert_Input = {
  data: Array<Users_Profile_Insert_Input>;
  /** upsert condition */
  on_conflict?: Users_Profile_On_Conflict | null | undefined;
};

/** Boolean expression to filter rows from the table "users.profile". All fields are combined with a logical 'AND'. */
export type Users_Profile_Bool_Exp = {
  _and?: Array<Users_Profile_Bool_Exp> | null | undefined;
  _not?: Users_Profile_Bool_Exp | null | undefined;
  _or?: Array<Users_Profile_Bool_Exp> | null | undefined;
  accepted_tos_at?: Timestamptz_Comparison_Exp | null | undefined;
  created_at?: Timestamp_Comparison_Exp | null | undefined;
  first_name?: String_Comparison_Exp | null | undefined;
  folders?: Users_Folder_Bool_Exp | null | undefined;
  folders_aggregate?: Users_Folder_Aggregate_Bool_Exp | null | undefined;
  full_name?: String_Comparison_Exp | null | undefined;
  full_name_reversed?: String_Comparison_Exp | null | undefined;
  group?: Users_Group_Bool_Exp | null | undefined;
  group_id?: Uuid_Comparison_Exp | null | undefined;
  id?: Uuid_Comparison_Exp | null | undefined;
  identities?: Users_Identity_Bool_Exp | null | undefined;
  identities_aggregate?: Users_Identity_Aggregate_Bool_Exp | null | undefined;
  is_evaluator?: Boolean_Comparison_Exp | null | undefined;
  is_key_user?: Boolean_Comparison_Exp | null | undefined;
  language?: Lookup_Languages_Enum_Comparison_Exp | null | undefined;
  last_access_at?: Timestamptz_Comparison_Exp | null | undefined;
  last_name?: String_Comparison_Exp | null | undefined;
  mail?: String_Comparison_Exp | null | undefined;
  notes?: Maintainer_Visitor_Space_Request_Note_Bool_Exp | null | undefined;
  notes_aggregate?: Maintainer_Visitor_Space_Request_Note_Aggregate_Bool_Exp | null | undefined;
  notifications?: App_Notification_Bool_Exp | null | undefined;
  notifications_aggregate?: App_Notification_Aggregate_Bool_Exp | null | undefined;
  organisation?: Graph_Organization_Bool_Exp | null | undefined;
  organisation_schema_identifier?: String_Comparison_Exp | null | undefined;
  updated_at?: Timestamp_Comparison_Exp | null | undefined;
  visitor_space?: Maintainer_Visitor_Space_Bool_Exp | null | undefined;
  visitor_space_requests?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  visitor_space_requests_aggregate?: Maintainer_Visitor_Space_Request_Aggregate_Bool_Exp | null | undefined;
};

/** unique or primary key constraints on table "users.profile" */
export enum Users_Profile_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProfilesPkey = 'profiles_pkey'
}

/** input type for inserting data into table "users.profile" */
export type Users_Profile_Insert_Input = {
  accepted_tos_at?: any;
  created_at?: any;
  first_name?: string | null | undefined;
  folders?: Users_Folder_Arr_Rel_Insert_Input | null | undefined;
  group?: Users_Group_Obj_Rel_Insert_Input | null | undefined;
  group_id?: any;
  id?: any;
  identities?: Users_Identity_Arr_Rel_Insert_Input | null | undefined;
  is_evaluator?: boolean | null | undefined;
  is_key_user?: boolean | null | undefined;
  language?: Lookup_Languages_Enum | null | undefined;
  last_access_at?: any;
  last_name?: string | null | undefined;
  mail?: string | null | undefined;
  notes?: Maintainer_Visitor_Space_Request_Note_Arr_Rel_Insert_Input | null | undefined;
  notifications?: App_Notification_Arr_Rel_Insert_Input | null | undefined;
  organisation?: Graph_Organization_Obj_Rel_Insert_Input | null | undefined;
  organisation_schema_identifier?: string | null | undefined;
  updated_at?: any;
  visitor_space?: Maintainer_Visitor_Space_Obj_Rel_Insert_Input | null | undefined;
  visitor_space_requests?: Maintainer_Visitor_Space_Request_Arr_Rel_Insert_Input | null | undefined;
};

/** order by max() on columns of table "users.profile" */
export type Users_Profile_Max_Order_By = {
  accepted_tos_at?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  first_name?: Order_By | null | undefined;
  group_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  last_access_at?: Order_By | null | undefined;
  last_name?: Order_By | null | undefined;
  mail?: Order_By | null | undefined;
  organisation_schema_identifier?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** order by min() on columns of table "users.profile" */
export type Users_Profile_Min_Order_By = {
  accepted_tos_at?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  first_name?: Order_By | null | undefined;
  group_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  last_access_at?: Order_By | null | undefined;
  last_name?: Order_By | null | undefined;
  mail?: Order_By | null | undefined;
  organisation_schema_identifier?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
};

/** input type for inserting object relation for remote table "users.profile" */
export type Users_Profile_Obj_Rel_Insert_Input = {
  data: Users_Profile_Insert_Input;
  /** upsert condition */
  on_conflict?: Users_Profile_On_Conflict | null | undefined;
};

/** on_conflict condition type for table "users.profile" */
export type Users_Profile_On_Conflict = {
  constraint: Users_Profile_Constraint;
  update_columns?: Array<Users_Profile_Update_Column>;
  where?: Users_Profile_Bool_Exp | null | undefined;
};

/** Ordering options when selecting data from "users.profile". */
export type Users_Profile_Order_By = {
  accepted_tos_at?: Order_By | null | undefined;
  created_at?: Order_By | null | undefined;
  first_name?: Order_By | null | undefined;
  folders_aggregate?: Users_Folder_Aggregate_Order_By | null | undefined;
  full_name?: Order_By | null | undefined;
  full_name_reversed?: Order_By | null | undefined;
  group?: Users_Group_Order_By | null | undefined;
  group_id?: Order_By | null | undefined;
  id?: Order_By | null | undefined;
  identities_aggregate?: Users_Identity_Aggregate_Order_By | null | undefined;
  is_evaluator?: Order_By | null | undefined;
  is_key_user?: Order_By | null | undefined;
  language?: Order_By | null | undefined;
  last_access_at?: Order_By | null | undefined;
  last_name?: Order_By | null | undefined;
  mail?: Order_By | null | undefined;
  notes_aggregate?: Maintainer_Visitor_Space_Request_Note_Aggregate_Order_By | null | undefined;
  notifications_aggregate?: App_Notification_Aggregate_Order_By | null | undefined;
  organisation?: Graph_Organization_Order_By | null | undefined;
  organisation_schema_identifier?: Order_By | null | undefined;
  updated_at?: Order_By | null | undefined;
  visitor_space?: Maintainer_Visitor_Space_Order_By | null | undefined;
  visitor_space_requests_aggregate?: Maintainer_Visitor_Space_Request_Aggregate_Order_By | null | undefined;
};

/** select columns of table "users.profile" */
export enum Users_Profile_Select_Column {
  /** column name */
  AcceptedTosAt = 'accepted_tos_at',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  IsEvaluator = 'is_evaluator',
  /** column name */
  IsKeyUser = 'is_key_user',
  /** column name */
  Language = 'language',
  /** column name */
  LastAccessAt = 'last_access_at',
  /** column name */
  LastName = 'last_name',
  /** column name */
  Mail = 'mail',
  /** column name */
  OrganisationSchemaIdentifier = 'organisation_schema_identifier',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** select "users_profile_aggregate_bool_exp_bool_and_arguments_columns" columns of table "users.profile" */
export enum Users_Profile_Select_Column_Users_Profile_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsEvaluator = 'is_evaluator',
  /** column name */
  IsKeyUser = 'is_key_user'
}

/** select "users_profile_aggregate_bool_exp_bool_or_arguments_columns" columns of table "users.profile" */
export enum Users_Profile_Select_Column_Users_Profile_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsEvaluator = 'is_evaluator',
  /** column name */
  IsKeyUser = 'is_key_user'
}

/** input type for updating data in table "users.profile" */
export type Users_Profile_Set_Input = {
  accepted_tos_at?: any;
  created_at?: any;
  first_name?: string | null | undefined;
  group_id?: any;
  id?: any;
  is_evaluator?: boolean | null | undefined;
  is_key_user?: boolean | null | undefined;
  language?: Lookup_Languages_Enum | null | undefined;
  last_access_at?: any;
  last_name?: string | null | undefined;
  mail?: string | null | undefined;
  organisation_schema_identifier?: string | null | undefined;
  updated_at?: any;
};

/** update columns of table "users.profile" */
export enum Users_Profile_Update_Column {
  /** column name */
  AcceptedTosAt = 'accepted_tos_at',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  IsEvaluator = 'is_evaluator',
  /** column name */
  IsKeyUser = 'is_key_user',
  /** column name */
  Language = 'language',
  /** column name */
  LastAccessAt = 'last_access_at',
  /** column name */
  LastName = 'last_name',
  /** column name */
  Mail = 'mail',
  /** column name */
  OrganisationSchemaIdentifier = 'organisation_schema_identifier',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: any;
  _gt?: any;
  _gte?: any;
  _in?: Array<any> | null | undefined;
  _is_null?: boolean | null | undefined;
  _lt?: any;
  _lte?: any;
  _neq?: any;
  _nin?: Array<any> | null | undefined;
};

export type FindContentPartnersQueryVariables = Exact<{
  where: Graph_Organisations_With_Objects_Bool_Exp;
}>;


export type FindContentPartnersQuery = { graph_organisations_with_objects: Array<{ id: string | null, org_identifier: string | null, skos_pref_label: string | null, organization_slug: string | null }>, graph_organisations_with_objects_aggregate: { aggregate: { count: number } | null } };

export type FindFolderByIdQueryVariables = Exact<{
  folderId?: any;
}>;


export type FindFolderByIdQuery = { users_folder: Array<{ created_at: any, id: any, is_default: boolean | null, name: string | null, description: string | null, updated_at: any, user_profile_id: any }> };

export type FindFolderIeObjectsByFolderIdQueryVariables = Exact<{
  folderId?: any;
  userProfileId?: any;
  where: Users_Folder_Ie_Bool_Exp;
  offset?: number | null | undefined;
  limit?: number | null | undefined;
}>;


export type FindFolderIeObjectsByFolderIdQuery = { users_folder_ie: Array<{ created_at: any, ie_object_id: string, intellectualEntity: { id: string, schema_identifier: string | null, schema_description: string | null, dcterms_available: string | null, schema_date_published: string | null, schema_date_created: string | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, schemaThumbnail: { schema_thumbnail_url: any } | null, dctermsFormat: Array<{ dcterms_format: string }>, schemaDuration: { schema_duration: any } | null, schemaLicense: { schema_license: any } | null, premisIdentifier: Array<{ meemoo_local_id: string }>, schemaIsPartOf: Array<{ type: string, collection: { schema_name: string } }>, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, organizationSlug: { slug: string } | null } | null } | null }>, users_folder_ie_aggregate: { aggregate: { count: number } | null } };

export type FindFoldersByUserQueryVariables = Exact<{
  userProfileId?: any;
  offset?: number | null | undefined;
  limit?: number | null | undefined;
}>;


export type FindFoldersByUserQuery = { users_folder: Array<{ id: any, name: string | null, description: string | null, user_profile_id: any, is_default: boolean | null, created_at: any, updated_at: any, intellectualEntities: Array<{ created_at: any, intellectualEntity: { id: string, schema_identifier: string | null, dcterms_available: string | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }> } | null }> }>, users_folder_aggregate: { aggregate: { count: number } | null } };

export type FindIeObjectByIeObjectIdQueryVariables = Exact<{
  ieObjectId: string;
}>;


export type FindIeObjectByIeObjectIdQuery = { graph_intellectual_entity: Array<{ id: string, schema_identifier: string | null, schema_description: string | null, dcterms_available: string | null, schema_date_published: string | null, schema_date_created: string | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, schemaThumbnail: { schema_thumbnail_url: any } | null, dctermsFormat: Array<{ dcterms_format: string }>, schemaDuration: { schema_duration: any } | null, schemaLicense: { schema_license: any } | null, premisIdentifier: Array<{ meemoo_local_id: string }>, schemaIsPartOf: Array<{ type: string, collection: { schema_name: string } }>, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, organizationSlug: { slug: string } | null } | null }> };

export type FindIeObjectBySchemaIdentifierQueryVariables = Exact<{
  schemaIdentifier: string;
}>;


export type FindIeObjectBySchemaIdentifierQuery = { graph_intellectual_entity: Array<{ id: string, schema_identifier: string | null, schema_description: string | null, dcterms_available: string | null, schema_date_published: string | null, schema_date_created: string | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, schemaThumbnail: { schema_thumbnail_url: any } | null, dctermsFormat: Array<{ dcterms_format: string }>, schemaDuration: { schema_duration: any } | null, schemaLicense: { schema_license: any } | null, premisIdentifier: Array<{ meemoo_local_id: string }>, schemaIsPartOf: Array<{ type: string, collection: { schema_name: string } }>, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, organizationSlug: { slug: string } | null } | null }> };

export type FindIeObjectInFolderQueryVariables = Exact<{
  folderId?: any;
  ieObjectId?: string | null | undefined;
}>;


export type FindIeObjectInFolderQuery = { users_folder_ie: Array<{ created_at: any, intellectualEntity: { id: string, schema_identifier: string | null, schema_description: string | null, dcterms_available: string | null, schema_date_published: string | null, schema_date_created: string | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, schemaThumbnail: { schema_thumbnail_url: any } | null, dctermsFormat: Array<{ dcterms_format: string }>, schemaDuration: { schema_duration: any } | null, schemaLicense: { schema_license: any } | null, premisIdentifier: Array<{ meemoo_local_id: string }>, schemaIsPartOf: Array<{ type: string, collection: { schema_name: string } }>, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, organizationSlug: { slug: string } | null } | null } | null }> };

export type GetSchemaIdentifierV3BySchemaIdentifierV2QueryVariables = Exact<{
  schemaIdentifierV2: string;
}>;


export type GetSchemaIdentifierV3BySchemaIdentifierV2Query = { graph_mh_fragment_identifier: Array<{ mh_fragment_identifier: string, intellectual_entity_id: string }> };

export type InsertFolderMutationVariables = Exact<{
  object: Users_Folder_Insert_Input;
}>;


export type InsertFolderMutation = { insert_users_folder: { returning: Array<{ id: any, name: string | null, description: string | null, user_profile_id: any, is_default: boolean | null, created_at: any, updated_at: any }> } | null };

export type InsertIeObjectIntoFolderMutationVariables = Exact<{
  folderId?: any;
  ieObjectId?: string | null | undefined;
}>;


export type InsertIeObjectIntoFolderMutation = { insert_users_folder_ie: { returning: Array<{ created_at: any }> } | null };

export type RemoveObjectFromFolderMutationVariables = Exact<{
  ieObjectId?: string | null | undefined;
  folderId?: any;
  userProfileId?: any;
}>;


export type RemoveObjectFromFolderMutation = { delete_users_folder_ie: { affected_rows: number } | null };

export type SoftDeleteFolderMutationVariables = Exact<{
  folderId?: any;
  userProfileId?: any;
}>;


export type SoftDeleteFolderMutation = { update_users_folder: { affected_rows: number } | null };

export type UpdateFolderMutationVariables = Exact<{
  folderId?: any;
  userProfileId?: any;
  folder?: Users_Folder_Set_Input | null | undefined;
}>;


export type UpdateFolderMutation = { update_users_folder: { returning: Array<{ id: any, name: string | null, description: string | null, user_profile_id: any, is_default: boolean | null, created_at: any, updated_at: any }> } | null };

export type FindAllIeObjectsByFolderIdQueryVariables = Exact<{
  folderId?: any;
  userProfileId?: any;
}>;


export type FindAllIeObjectsByFolderIdQuery = { users_folder_ie: Array<{ intellectualEntity: { schema_identifier: string | null, schema_description: string | null, dcterms_available: string | null, schema_date_published: string | null, schema_date_created: string | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, schemaThumbnail: { schema_thumbnail_url: any } | null, dctermsFormat: Array<{ dcterms_format: string }>, schemaDuration: { schema_duration: any } | null, schemaLicense: { schema_license: any } | null, premisIdentifier: Array<{ meemoo_local_id: string }>, schemaIsPartOf: Array<{ type: string, collection: { schema_name: string } }>, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, organizationSlug: { slug: string } | null } | null } | null }> };

export type FindIeObjectsForSitemapQueryVariables = Exact<{
  licenses: Array<string> | string;
  afterId: string;
  limit?: number | null | undefined;
}>;


export type FindIeObjectsForSitemapQuery = { graph_intellectual_entity: Array<{ id: string, schema_identifier: string | null, updated_at: any, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null } | null }> };

export type GetAllReusabilityRightsIrisQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllReusabilityRightsIrisQuery = { graph_rights: Array<{ intellectual_entity_id: string, reuse_category_id: string }> };

export type GetChildIeObjectsQueryVariables = Exact<{
  currentObjectIri: string;
}>;


export type GetChildIeObjectsQuery = { graph_intellectual_entity: Array<{ hasPart: Array<{ id: string, schema_identifier: string | null, dcterms_available: string | null, schema_date_created: string | null, schema_date_published: string | null, schema_description: string | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaDuration: { schema_duration: any } | null, schemaLicense: { schema_license: any } | null, schemaThumbnail: { schema_thumbnail_url: any } | null, schemaMaintainer: { id: string, org_identifier: string, ha_org_sector: string | null, skos_pref_label: string | null, organizationSlug: { slug: string } | null } | null }> }> };

export type GetIeObjectChildrenIrisQueryVariables = Exact<{
  ieObjectIri: string;
}>;


export type GetIeObjectChildrenIrisQuery = { graph_intellectual_entity: Array<{ id: string, schema_identifier: string | null }> };

export type GetIeObjectDetailQueryVariables = Exact<{
  ieObjectId: string;
}>;


export type GetIeObjectDetailQuery = { getIeObject: Array<{ schema_identifier: string | null, id: string, schema_position: number | null, schema_date_published: string | null, dcterms_available: string | null, schema_description: string | null, schema_date_created: string | null, ebucore_has_cast_member: string | null, schema_issue_number: string | null, schema_credit_text: string | null, schema_copyright_notice: string | null, schema_abstract: string | null, bibframe_edition: string | null, schema_number_of_pages: number | null, premis_is_part_of: string | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, ebucoreSynopses: Array<{ ebucore_synopsis: string, is_ai_generated: boolean }>, rights: { reuse_label: string, reuse_category_id: string, ha_des_license_distributor: string | null, reuse_category: { id: string, label: string, group: string } } | null, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null, ha_org_request_form: string | null, dcterms_description: string | null, ha_org_sector: string | null, foaf_homepage: string | null, organizationSlug: { slug: string } | null, hasPreference: Array<{ ha_pref: string }> } | null }>, getDctermsFormat: Array<{ dcterms_format: string | null }>, getHasCarrier: Array<{ premis_medium: string | null, schema_width: string | null, schema_height: string | null, bibframe_production_method: string | null, created_at: any, digitization_date: any }>, getHasPart: Array<{ schema_position: number | null, schemaMentions: Array<{ confidence: any, highlights: Array<{ x: number | null, y: number | null, width: number | null, height: number | null }>, thing: { id: string, schema_name: string | null, schema_birth_date: any, schema_birth_place: string | null, schema_death_date: any, schema_death_place: string | null } }>, isRepresentedBy: Array<{ id: string, schema_name: string | null, is_media_fragment_of: string | null, schema_in_language: string | null, schema_start_time: any, schema_end_time: any, edm_is_next_in_sequence: string | null, updated_at: any, schema_thumbnail_url: string | null, schemaTranscriptUrls: Array<{ schema_transcript: string, schema_transcript_url: string }>, includes: Array<{ file: { id: string, schema_name: string | null, ebucore_has_mime_type: string | null, premis_stored_at: string | null, schema_thumbnail_url: string | null, schema_duration: any, edm_is_next_in_sequence: string | null, created_at: any, hasMediaFragment: Array<{ id: string, schema_start_time: any, schema_end_time: any, schema_name: string | null }>, has_captionings: Array<{ id: string | null, schema_name: string | null, ebucore_has_mime_type: string | null, premis_stored_at: string | null, premis_original_name: string | null, schema_duration: any, edm_is_next_in_sequence: string | null, created_at: any }> } }> }> }>, getIsPartOf: Array<{ isPartOf: { schema_identifier: string | null, id: string | null, schema_is_part_of: any, schema_duration: any, schema_number_of_pages: number | null, schema_position: number | null, schema_date_published: string | null, dcterms_available: string | null, schema_description: string | null, schema_creator: any, dcterms_format: string | null, dcterms_medium: any, schema_thumbnail_url: any, schema_license: any, schema_date_created: string | null, meemoo_local_id: any, premis_is_part_of: string | null, bibframe_edition: string | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null, ha_org_request_form: string | null, dcterms_description: string | null, ha_org_sector: string | null, foaf_homepage: string | null, organizationSlug: { slug: string } | null, hasPreference: Array<{ ha_pref: string }> } | null, schemaInLanguage: { schema_in_language: any } | null, schemaKeywords: { schema_keywords: any } | null, premisIdentifier: { premis_identifier: any } | null, schemaGenre: { schema_genre: any } | null, schemaSpatial: { schema_spatial: any } | null, schemaPublisher: { schema_publisher_array: Array<string> | null } | null, schemaTemporal: { schema_temporal: any } | null, schemaCopyrightHolder: Array<{ schema_copyright_holder: string }>, intellectualEntity: { schema_issue_number: string | null, schema_credit_text: string | null, schema_copyright_notice: string | null, schema_abstract: string | null, bibframe_edition: string | null, mhFragmentIdentifier: { mh_fragment_identifier: string } | null, hasCarrier: { premis_medium: string | null, schema_width: string | null, schema_height: string | null, bibframe_production_method: string | null, created_at: any, digitization_date: any } | null, schemaAlternateName: Array<{ schema_alternate_name: string }>, ebucoreSynopses: Array<{ ebucore_synopsis: string }> } | null } | null }>, getIsRepresentedBy: Array<{ schema_position: number | null, isRepresentedBy: Array<{ id: string, schema_name: string | null, is_media_fragment_of: string | null, schema_in_language: string | null, schema_start_time: any, schema_end_time: any, edm_is_next_in_sequence: string | null, updated_at: any, schema_thumbnail_url: string | null, schemaTranscriptUrls: Array<{ schema_transcript: string, schema_transcript_url: string }>, includes: Array<{ file: { id: string, schema_name: string | null, ebucore_has_mime_type: string | null, premis_stored_at: string | null, schema_thumbnail_url: string | null, schema_duration: any, edm_is_next_in_sequence: string | null, created_at: any, hasMediaFragment: Array<{ id: string, schema_start_time: any, schema_end_time: any, schema_name: string | null }>, has_captionings: Array<{ id: string | null, schema_name: string | null, ebucore_has_mime_type: string | null, premis_stored_at: string | null, premis_original_name: string | null, schema_duration: any, edm_is_next_in_sequence: string | null, created_at: any }> } }> }> }>, getMeemooLocalId: Array<{ meemoo_local_id: string }>, getMhFragmentIdentifier: Array<{ mh_fragment_identifier: string }>, getParentCollection: Array<{ collection: { id: string, schema_identifier: string | null, schema_name: string, collection_type: string | null, schema_location_created: string | null, schema_start_date: string | null, schema_end_date: string | null, schema_publisher: string | null, schema_season_number: string | null, isPreceededBy: Array<{ schema_name: string }>, isSucceededBy: Array<{ schema_name: string }> } }>, getSchemaAlternateName: Array<{ schema_alternate_name: string }>, getSchemaCopyrightHolder: Array<{ schema_copyright_holder: string }>, getSchemaCreator: Array<{ schema_creator_array: Array<string> | null }>, getSchemaDuration: Array<{ schema_duration: any }>, getSchemaGenre: Array<{ schema_genre: string }>, getSchemaInLanguage: Array<{ schema_in_language: string }>, getSchemaKeywords: Array<{ schema_keywords: string }>, getSchemaLicense: Array<{ schema_license: string }>, getSchemaMedium: Array<{ premis_medium: any }>, getSchemaPublisher: Array<{ schema_publisher_array: Array<string> | null }>, getSchemaSpatial: Array<{ schema_spatial: string }>, getSchemaTemporal: Array<{ schema_temporal: string }>, getSchemaThumbnailUrl: Array<{ schema_thumbnail_url: any }>, getThemes: Array<{ id: any, slug: string, name_nl: string, name_en: string, content_page_path_nl: string | null, content_page_path_en: string | null, ieObjectLinks_aggregate: { aggregate: { count: number } | null } }> };

export type GetIeObjectForThumbnailUrlOnlyQueryVariables = Exact<{
  ieObjectId: string;
}>;


export type GetIeObjectForThumbnailUrlOnlyQuery = { schemaThumbnailUrl: Array<{ schema_thumbnail_url: any }>, schemaLicense: Array<{ schema_license: string }>, ieObject: Array<{ dctermsFormat: Array<{ dcterms_format: string }>, schemaMaintainer: { org_identifier: string, ha_org_sector: string | null } | null }> };

export type GetIeObjectIdBySchemaIdentifierQueryVariables = Exact<{
  schemaIdentifier: string;
}>;


export type GetIeObjectIdBySchemaIdentifierQuery = { graph_intellectual_entity: Array<{ id: string, schema_identifier: string | null }> };

export type GetIeObjectPlayableDisplayDataQueryVariables = Exact<{
  ieObjectId: string;
}>;


export type GetIeObjectPlayableDisplayDataQuery = { ieObject: Array<{ schema_identifier: string | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null, ha_org_sector: string | null, hasPreference: Array<{ ha_pref: string }>, organizationSlug: { slug: string } | null } | null }>, schemaThumbnailUrl: Array<{ schema_thumbnail_url: any }>, schemaLicense: Array<{ schema_license: string }>, getHasPart: Array<{ isRepresentedBy: Array<{ id: string, is_media_fragment_of: string | null, includes: Array<{ file: { id: string, ebucore_has_mime_type: string | null, premis_stored_at: string | null, hasMediaFragment: Array<{ id: string, schema_start_time: any, schema_end_time: any }> } }> }> }>, getIsRepresentedBy: Array<{ isRepresentedBy: Array<{ id: string | null, is_media_fragment_of: string | null, includes: Array<{ file: { id: string, ebucore_has_mime_type: string | null, premis_stored_at: string | null, hasMediaFragment: Array<{ id: string, schema_start_time: any, schema_end_time: any }> } }> }> }> };

export type GetIeObjectV3InfoFromMediaMosaIdQueryVariables = Exact<{
  mediaMosaId?: string | null | undefined;
}>;


export type GetIeObjectV3InfoFromMediaMosaIdQuery = { nvdgo_mediamosa_assets: Array<{ ieObject: { schema_identifier: string | null, schemaMaintainer: { organizationSlug: { slug: string } | null } | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }> } | null }> };

export type GetMentionsByFileIdQueryVariables = Exact<{
  fileId: string;
}>;


export type GetMentionsByFileIdQuery = { graph_file: Array<{ id: string, schema_duration: any, has_annotations: Array<{ id: string | null, annotation_type: string | null, annotation_confidence: any, is_ai_generated: boolean | null, has_annotation_related_artefact_thing: { id: string, type: string | null, wiki_id: string | null, schema_name: string | null, schema_thumbnail_url: string | null } | null, is_annotated_media_resource: Array<{ start_offset: any, end_offset: any }> }> }> };

export type GetParentIeObjectQueryVariables = Exact<{
  currentObjectIri: string;
}>;


export type GetParentIeObjectQuery = { graph_intellectual_entity: Array<{ isPartOf: { id: string, schema_identifier: string | null, dcterms_available: string | null, schema_date_created: string | null, schema_date_published: string | null, schema_description: string | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaDuration: { schema_duration: any } | null, schemaLicense: { schema_license: any } | null, schemaThumbnail: { schema_thumbnail_url: any } | null, schemaMaintainer: { id: string, org_identifier: string, ha_org_sector: string | null, skos_pref_label: string | null, organizationSlug: { slug: string } | null } | null } | null }> };

export type GetPreviousNextIeObjectIdsQueryVariables = Exact<{
  collectionId: string;
  ieObjectIri: string;
}>;


export type GetPreviousNextIeObjectIdsQuery = { graph__intellectual_entity_prev_and_next: Array<{ previousIeObject: { schema_identifier: string | null } | null, nextIeObject: { schema_identifier: string | null } | null }> };

export type GetReusabilityRightsIrisQueryVariables = Exact<{
  categoryIds: Array<string> | string;
}>;


export type GetReusabilityRightsIrisQuery = { graph_rights: Array<{ intellectual_entity_id: string }> };

export type GetVideoFileByRepresentationIdQueryVariables = Exact<{
  representationId?: string | null | undefined;
}>;


export type GetVideoFileByRepresentationIdQuery = { graph_includes: Array<{ file: { id: string, premis_stored_at: string | null } }> };

export type GetVisitRequestForAccessQueryVariables = Exact<{
  userProfileId: any;
  maintainerOrId: string;
  now: any;
}>;


export type GetVisitRequestForAccessQuery = { maintainer_visitor_space_request: Array<{ id: any }> };

export type CountUnreadMaterialRequestMessagesQueryVariables = Exact<{
  materialRequestId: any;
  profileId: any;
}>;


export type CountUnreadMaterialRequestMessagesQuery = { app_material_request_message_unread_status_aggregate: { aggregate: { count: number } | null } };

export type DeleteMessageUnreadEntriesMutationVariables = Exact<{
  materialRequestId: any;
  profileId: any;
}>;


export type DeleteMessageUnreadEntriesMutation = { delete_app_material_request_message_unread_status: { affected_rows: number } | null };

export type GetEvaluatorsForOrganisationQueryVariables = Exact<{
  organisationId: string;
}>;


export type GetEvaluatorsForOrganisationQuery = { users_profile: Array<{ is_evaluator: boolean, is_key_user: boolean, first_name: string | null, language: Lookup_Languages_Enum, last_name: string | null, mail: string | null, organisation_schema_identifier: string | null, accepted_tos_at: any, last_access_at: any, created_at: any, updated_at: any, group_id: any, id: any }> };

export type GetMaterialRequestAttachmentByIdQueryVariables = Exact<{
  materialRequestId: any;
  attachmentId: any;
}>;


export type GetMaterialRequestAttachmentByIdQuery = { app_material_request_messages_attachments: Array<{ id: any, attachment_url: string, attachment_filename: string, created_at: any }> };

export type GetMaterialRequestAttachmentsQueryVariables = Exact<{
  materialRequestId: any;
  offset: number;
  limit: number;
  orderBy?: Array<App_Material_Request_Messages_Attachments_Order_By> | App_Material_Request_Messages_Attachments_Order_By | null | undefined;
}>;


export type GetMaterialRequestAttachmentsQuery = { app_material_request_messages_attachments: Array<{ id: any, attachment_url: string, attachment_filename: string, created_at: any }>, app_material_request_messages_attachments_aggregate: { aggregate: { count: number } | null } };

export type GetMaterialRequestMessagesQueryVariables = Exact<{
  materialRequestId: any;
  offset: number;
  limit: number;
}>;


export type GetMaterialRequestMessagesQuery = { app_material_request_messages_and_events: Array<{ id: any, message_type: Lookup_App_Material_Request_Message_Type_Enum, body: any, sender_profile_id: any, created_at: any, material_request_id: any, sender: { first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, organisation: { org_identifier: string, skos_pref_label: string | null, schema_vat_id: string | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null } | null, attachments: Array<{ id: any, attachment_url: string, attachment_filename: string, created_at: any }> }>, app_material_request_messages_and_events_aggregate: { aggregate: { count: number } | null } };

export type GetUnreadMessageCountsPerUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUnreadMessageCountsPerUserQuery = { app_material_request_message_unread_counts_per_user: Array<{ receiver_profile_id: any, outgoing_count: any, incoming_count: any }> };

export type GetUnreadMessageOverviewForProfileQueryVariables = Exact<{
  profileId: any;
}>;


export type GetUnreadMessageOverviewForProfileQuery = { app_material_request_message_unread_overview: Array<{ material_request_id: any, is_outgoing: boolean | null }> };

export type InsertMaterialRequestMessageMutationVariables = Exact<{
  materialRequestId: any;
  senderProfileId?: any;
  messageType: Lookup_App_Material_Request_Message_Type_Enum;
  body?: any;
  attachments: Array<App_Material_Request_Messages_Attachments_Insert_Input> | App_Material_Request_Messages_Attachments_Insert_Input;
  createdAt: any;
}>;


export type InsertMaterialRequestMessageMutation = { insert_app_material_request_messages_and_events_one: { id: any, message_type: Lookup_App_Material_Request_Message_Type_Enum, sender_profile_id: any, body: any, material_request_id: any, created_at: any, sender: { full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, organisation: { org_identifier: string, skos_pref_label: string | null, schema_vat_id: string | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null } | null, attachments: Array<{ id: any, attachment_url: string, attachment_filename: string, created_at: any }> } | null };

export type InsertMaterialRequestMessageUnreadStatusMutationVariables = Exact<{
  material_request_message_id: any;
  receiver_profile_id: any;
  material_request_id: any;
}>;


export type InsertMaterialRequestMessageUnreadStatusMutation = { insert_app_material_request_message_unread_status: { affected_rows: number, returning: Array<{ id: any, material_request_message_id: any, receiver_profile_id: any, is_unread: boolean, material_request_id: any }> } | null };

export type DeleteMaterialRequestMutationVariables = Exact<{
  materialRequestId?: any;
  userProfileId?: any;
}>;


export type DeleteMaterialRequestMutation = { delete_app_material_requests: { affected_rows: number } | null };

export type FindMaintainersWithMaterialRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type FindMaintainersWithMaterialRequestsQuery = { graph_organisations_with_material_requests: Array<{ id: string | null, org_identifier: string | null, skos_pref_label: string | null, organization_slug: string | null }> };

export type FindMaterialRequestsQueryVariables = Exact<{
  where?: App_Material_Requests_Bool_Exp | null | undefined;
  offset: number;
  limit: number;
  orderBy?: Array<App_Material_Requests_Order_By> | App_Material_Requests_Order_By | null | undefined;
}>;


export type FindMaterialRequestsQuery = { app_material_requests: Array<{ id: any, ie_object_id: string, profile_id: any, reason: string, type: Lookup_App_Material_Request_Type_Enum, created_at: any, updated_at: any, requested_at: any, is_pending: boolean, is_archived: boolean, status: Lookup_App_Material_Request_Status_Enum, group_id: any, name: string | null, download_status: Lookup_App_Material_Request_Download_Status_Enum | null, download_available_at: any, requester_capacity: Lookup_App_Material_Request_Requester_Capacity_Enum, organisation_name: string | null, ie_object_representation_id: string | null, organisation: { org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, schema_vat_id: string | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, group: { name: string, label: string, description: string | null, id: any } | null }, intellectualEntity: { schema_identifier: string | null, id: string, schema_date_published: string | null, created_at: any, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, premisIdentifier: Array<{ value: string }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaThumbnail: { schema_thumbnail_url: any } | null, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null, ha_org_sector: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null, schemaLicenses: Array<{ schema_license: string }> } | null, objectRepresentation: { id: string, schema_thumbnail_url: string | null, schema_name: string | null, is_media_fragment_of: string | null, schema_in_language: string | null, schema_start_time: any, schema_end_time: any, schema_transcript: string | null, edm_is_next_in_sequence: string | null, updated_at: any, schemaTranscriptUrls: Array<{ schema_transcript: string, schema_transcript_url: string }>, includes: Array<{ file: { id: string, schema_name: string | null, ebucore_has_mime_type: string | null, premis_stored_at: string | null, schema_thumbnail_url: string | null, schema_duration: any, edm_is_next_in_sequence: string | null, created_at: any, hasMediaFragment: Array<{ id: string, schema_start_time: any, schema_end_time: any, schema_name: string | null }> } }> } | null, material_request_reuse_form_values: Array<{ key: string, value: string | null }> }>, app_material_requests_aggregate: { aggregate: { count: number } | null } };

export type FindMaterialRequestsByIdQueryVariables = Exact<{
  id: any;
}>;


export type FindMaterialRequestsByIdQuery = { app_material_requests: Array<{ id: any, ie_object_id: string, profile_id: any, reason: string, type: Lookup_App_Material_Request_Type_Enum, created_at: any, updated_at: any, requested_at: any, is_pending: boolean, is_archived: boolean, status: Lookup_App_Material_Request_Status_Enum, group_id: any, name: string | null, download_status: Lookup_App_Material_Request_Download_Status_Enum | null, download_available_at: any, requester_capacity: Lookup_App_Material_Request_Requester_Capacity_Enum, organisation_name: string | null, ie_object_representation_id: string | null, messages_and_events: Array<{ id: any, message_type: Lookup_App_Material_Request_Message_Type_Enum, created_at: any, body: any, sender_profile_id: any, sender: { first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, organisation: { org_identifier: string, skos_pref_label: string | null } | null } | null }>, organisation: { org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, schema_vat_id: string | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, group: { name: string, label: string, description: string | null, id: any } | null }, intellectualEntity: { schema_identifier: string | null, id: string, schema_date_published: string | null, created_at: any, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, premisIdentifier: Array<{ value: string }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaThumbnail: { schema_thumbnail_url: any } | null, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null, ha_org_sector: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null, schemaLicenses: Array<{ schema_license: string }> } | null, objectRepresentation: { id: string, schema_thumbnail_url: string | null, schema_name: string | null, is_media_fragment_of: string | null, schema_in_language: string | null, schema_start_time: any, schema_end_time: any, schema_transcript: string | null, edm_is_next_in_sequence: string | null, updated_at: any, schemaTranscriptUrls: Array<{ schema_transcript: string, schema_transcript_url: string }>, includes: Array<{ file: { id: string, schema_name: string | null, ebucore_has_mime_type: string | null, premis_stored_at: string | null, schema_thumbnail_url: string | null, schema_duration: any, edm_is_next_in_sequence: string | null, created_at: any, hasMediaFragment: Array<{ id: string, schema_start_time: any, schema_end_time: any, schema_name: string | null }> } }> } | null, material_request_reuse_form_values: Array<{ key: string, value: string | null }> }> };

export type FindMaterialRequestsReadyToArchiveQueryVariables = Exact<{
  expirationDate: any;
}>;


export type FindMaterialRequestsReadyToArchiveQuery = { app_material_requests: Array<{ id: any, ie_object_id: string, profile_id: any, reason: string, created_at: any, updated_at: any, requested_at: any, type: Lookup_App_Material_Request_Type_Enum, is_archived: boolean, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, group: { name: string, label: string, description: string | null, id: any } | null }, messages_and_events: Array<{ message_type: Lookup_App_Material_Request_Message_Type_Enum, created_at: any, attachments: Array<{ id: any, attachment_url: string, attachment_filename: string, created_at: any }> }> }> };

export type FindMaterialRequestsStatusByIdQueryVariables = Exact<{
  id: any;
}>;


export type FindMaterialRequestsStatusByIdQuery = { app_material_requests: Array<{ id: any, updated_at: any, status: Lookup_App_Material_Request_Status_Enum, download_status: Lookup_App_Material_Request_Download_Status_Enum | null, messages_and_events: Array<{ id: any, created_at: any, message_type: Lookup_App_Material_Request_Message_Type_Enum, body: any }> }> };

export type FindMaterialRequestsWithAlmostExpiredDownloadQueryVariables = Exact<{
  warningDate: any;
}>;


export type FindMaterialRequestsWithAlmostExpiredDownloadQuery = { app_material_requests: Array<{ id: any, ie_object_id: string, profile_id: any, reason: string, type: Lookup_App_Material_Request_Type_Enum, created_at: any, updated_at: any, requested_at: any, is_pending: boolean, is_archived: boolean, status: Lookup_App_Material_Request_Status_Enum, group_id: any, name: string | null, download_status: Lookup_App_Material_Request_Download_Status_Enum | null, download_available_at: any, requester_capacity: Lookup_App_Material_Request_Requester_Capacity_Enum, organisation_name: string | null, ie_object_representation_id: string | null, organisation: { org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, schema_vat_id: string | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, group: { name: string, label: string, description: string | null, id: any } | null }, intellectualEntity: { schema_identifier: string | null, id: string, schema_date_published: string | null, created_at: any, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, premisIdentifier: Array<{ value: string }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaThumbnail: { schema_thumbnail_url: any } | null, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null, ha_org_sector: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null, schemaLicenses: Array<{ schema_license: string }> } | null, objectRepresentation: { id: string, schema_thumbnail_url: string | null, schema_name: string | null, is_media_fragment_of: string | null, schema_in_language: string | null, schema_start_time: any, schema_end_time: any, schema_transcript: string | null, edm_is_next_in_sequence: string | null, updated_at: any, schemaTranscriptUrls: Array<{ schema_transcript: string, schema_transcript_url: string }>, includes: Array<{ file: { id: string, schema_name: string | null, ebucore_has_mime_type: string | null, premis_stored_at: string | null, schema_thumbnail_url: string | null, schema_duration: any, edm_is_next_in_sequence: string | null, created_at: any, hasMediaFragment: Array<{ id: string, schema_start_time: any, schema_end_time: any, schema_name: string | null }> } }> } | null, material_request_reuse_form_values: Array<{ key: string, value: string | null }> }> };

export type FindMaterialRequestsWithExpiredDownloadQueryVariables = Exact<{
  expirationDate: any;
}>;


export type FindMaterialRequestsWithExpiredDownloadQuery = { app_material_requests: Array<{ id: any, ie_object_id: string, profile_id: any, reason: string, created_at: any, updated_at: any, requested_at: any, type: Lookup_App_Material_Request_Type_Enum, is_pending: boolean, is_archived: boolean, status: Lookup_App_Material_Request_Status_Enum, group_id: any, name: string | null, download_status: Lookup_App_Material_Request_Download_Status_Enum | null, download_available_at: any, requester_capacity: Lookup_App_Material_Request_Requester_Capacity_Enum, organisation_name: string | null, ie_object_representation_id: string | null, organisation: { org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, schema_vat_id: string | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, group: { name: string, label: string, description: string | null, id: any } | null }, intellectualEntity: { schema_identifier: string | null, id: string, schema_date_published: string | null, created_at: any, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, premisIdentifier: Array<{ value: string }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaThumbnail: { schema_thumbnail_url: any } | null, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null } | null, objectRepresentation: { id: string, schema_thumbnail_url: string | null, schema_name: string | null, is_media_fragment_of: string | null, schema_in_language: string | null, schema_start_time: any, schema_end_time: any, schema_transcript: string | null, edm_is_next_in_sequence: string | null, updated_at: any, schemaTranscriptUrls: Array<{ schema_transcript: string, schema_transcript_url: string }>, includes: Array<{ file: { id: string, schema_name: string | null, ebucore_has_mime_type: string | null, premis_stored_at: string | null, schema_thumbnail_url: string | null, schema_duration: any, edm_is_next_in_sequence: string | null, created_at: any, hasMediaFragment: Array<{ id: string, schema_start_time: any, schema_end_time: any, schema_name: string | null }> } }> } | null, material_request_reuse_form_values: Array<{ key: string, value: string | null }> }> };

export type FindMaterialRequestsWithUnresolvedAdditionalConditionsQueryVariables = Exact<{
  reminderDate: any;
}>;


export type FindMaterialRequestsWithUnresolvedAdditionalConditionsQuery = { app_material_requests_with_pending_additional_conditions: Array<{ id: any, ie_object_id: string | null, profile_id: any, reason: string | null, type: string | null, created_at: any, updated_at: any, requested_at: any, is_pending: boolean | null, is_archived: boolean | null, status: string | null, group_id: any, name: string | null, download_status: string | null, download_available_at: any, requester_capacity: string | null, organisation_name: string | null, ie_object_representation_id: string | null, organisation: { org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, schema_vat_id: string | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, group: { name: string, label: string, description: string | null, id: any } | null } | null, intellectualEntity: { schema_identifier: string | null, id: string, schema_date_published: string | null, created_at: any, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, premisIdentifier: Array<{ value: string }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaThumbnail: { schema_thumbnail_url: any } | null, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null, ha_org_sector: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null, schemaLicenses: Array<{ schema_license: string }> } | null, objectRepresentation: { id: string, schema_thumbnail_url: string | null, schema_name: string | null, is_media_fragment_of: string | null, schema_in_language: string | null, schema_start_time: any, schema_end_time: any, schema_transcript: string | null, edm_is_next_in_sequence: string | null, updated_at: any, schemaTranscriptUrls: Array<{ schema_transcript: string, schema_transcript_url: string }>, includes: Array<{ file: { id: string, schema_name: string | null, ebucore_has_mime_type: string | null, premis_stored_at: string | null, schema_thumbnail_url: string | null, schema_duration: any, edm_is_next_in_sequence: string | null, created_at: any, hasMediaFragment: Array<{ id: string, schema_start_time: any, schema_end_time: any, schema_name: string | null }> } }> } | null, material_request_reuse_form_values: Array<{ key: string, value: string | null }> }> };

export type FindMaterialRequestsWithUnresolvedDownloadStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type FindMaterialRequestsWithUnresolvedDownloadStatusQuery = { app_material_requests: Array<{ id: any, status: Lookup_App_Material_Request_Status_Enum, download_url: string | null, download_job_id: string | null, download_retries: number, download_status: Lookup_App_Material_Request_Download_Status_Enum | null, download_expiry_warning_email_sent: boolean, ie_object_id: string, ie_object_representation_id: string | null, profile_id: any, type: Lookup_App_Material_Request_Type_Enum, updated_at: any, intellectualEntity: { schemaMaintainer: { org_identifier: string } | null } | null, material_request_reuse_form_values: Array<{ key: string, value: string | null }> }> };

export type GetMaterialRequestByJobIdForDownloadJobQueryVariables = Exact<{
  jobIds: Array<string> | string;
}>;


export type GetMaterialRequestByJobIdForDownloadJobQuery = { app_material_requests: Array<{ id: any, status: Lookup_App_Material_Request_Status_Enum, download_job_id: string | null, download_retries: number, download_status: Lookup_App_Material_Request_Download_Status_Enum | null, download_url: string | null, download_expiry_warning_email_sent: boolean, ie_object_id: string, ie_object_representation_id: string | null, profile_id: any, type: Lookup_App_Material_Request_Type_Enum, updated_at: any, intellectualEntity: { schemaMaintainer: { org_identifier: string } | null } | null, material_request_reuse_form_values: Array<{ key: string, value: string | null }> }> };

export type GetMaterialRequestForDownloadJobQueryVariables = Exact<{
  materialRequestId: any;
}>;


export type GetMaterialRequestForDownloadJobQuery = { app_material_requests: Array<{ id: any, status: Lookup_App_Material_Request_Status_Enum, download_job_id: string | null, download_retries: number, download_status: Lookup_App_Material_Request_Download_Status_Enum | null, download_url: string | null, download_expiry_warning_email_sent: boolean, ie_object_id: string, ie_object_representation_id: string | null, profile_id: any, type: Lookup_App_Material_Request_Type_Enum, updated_at: any, intellectualEntity: { schemaMaintainer: { org_identifier: string } | null } | null, material_request_reuse_form_values: Array<{ key: string, value: string | null }> }> };

export type InsertMaterialRequestMutationVariables = Exact<{
  newMaterialRequest: App_Material_Requests_Insert_Input;
}>;


export type InsertMaterialRequestMutation = { insert_app_material_requests_one: { id: any, ie_object_id: string, profile_id: any, reason: string, type: Lookup_App_Material_Request_Type_Enum, created_at: any, updated_at: any, requested_at: any, is_pending: boolean, is_archived: boolean, status: Lookup_App_Material_Request_Status_Enum, group_id: any, name: string | null, requester_capacity: Lookup_App_Material_Request_Requester_Capacity_Enum, organisation_name: string | null, download_status: Lookup_App_Material_Request_Download_Status_Enum | null, download_available_at: any, ie_object_representation_id: string | null, messages_and_events: Array<{ message_type: Lookup_App_Material_Request_Message_Type_Enum, created_at: any, body: any, sender_profile_id: any, sender: { first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, organisation: { org_identifier: string, skos_pref_label: string | null } | null } | null }>, organisation: { org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, schema_vat_id: string | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, group: { name: string, label: string, description: string | null, id: any } | null }, intellectualEntity: { schema_identifier: string | null, id: string, schema_date_published: string | null, created_at: any, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, premisIdentifier: Array<{ value: string }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaThumbnail: { schema_thumbnail_url: any } | null, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null, ha_org_sector: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null, schemaLicenses: Array<{ schema_license: string }> } | null, objectRepresentation: { id: string, schema_thumbnail_url: string | null, schema_name: string | null, is_media_fragment_of: string | null, schema_in_language: string | null, schema_start_time: any, schema_end_time: any, schema_transcript: string | null, edm_is_next_in_sequence: string | null, updated_at: any, schemaTranscriptUrls: Array<{ schema_transcript: string, schema_transcript_url: string }>, includes: Array<{ file: { id: string, schema_name: string | null, ebucore_has_mime_type: string | null, premis_stored_at: string | null, schema_thumbnail_url: string | null, schema_duration: any, edm_is_next_in_sequence: string | null, created_at: any, hasMediaFragment: Array<{ id: string, schema_start_time: any, schema_end_time: any, schema_name: string | null }> } }> } | null, material_request_reuse_form_values: Array<{ key: string, value: string | null }> } | null };

export type InsertMaterialRequestReuseFormMutationVariables = Exact<{
  keyValues: Array<App_Material_Request_Reuse_Form_Values_Insert_Input> | App_Material_Request_Reuse_Form_Values_Insert_Input;
}>;


export type InsertMaterialRequestReuseFormMutation = { insert_app_material_request_reuse_form_values: { returning: Array<{ key: string, value: string | null, id: any, material_request_id: any }> } | null };

export type UpdateMaterialRequestMutationVariables = Exact<{
  materialRequestId?: any;
  materialRequestFields?: App_Material_Requests_Set_Input | null | undefined;
}>;


export type UpdateMaterialRequestMutation = { update_app_material_requests: { returning: Array<{ id: any, ie_object_id: string, profile_id: any, reason: string, type: Lookup_App_Material_Request_Type_Enum, created_at: any, updated_at: any, requested_at: any, is_pending: boolean, is_archived: boolean, status: Lookup_App_Material_Request_Status_Enum, group_id: any, name: string | null, requester_capacity: Lookup_App_Material_Request_Requester_Capacity_Enum, organisation_name: string | null, download_status: Lookup_App_Material_Request_Download_Status_Enum | null, download_retries: number, download_available_at: any, download_job_id: string | null, download_expiry_warning_email_sent: boolean, ie_object_representation_id: string | null, messages_and_events: Array<{ message_type: Lookup_App_Material_Request_Message_Type_Enum, created_at: any, body: any, sender_profile_id: any, sender: { first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, organisation: { org_identifier: string, skos_pref_label: string | null } | null } | null }>, organisation: { org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, schema_vat_id: string | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, group: { name: string, label: string, description: string | null, id: any } | null }, intellectualEntity: { schema_identifier: string | null, id: string, schema_date_published: string | null, created_at: any, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, premisIdentifier: Array<{ value: string }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaThumbnail: { schema_thumbnail_url: any } | null, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null, ha_org_sector: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null, schemaLicenses: Array<{ schema_license: string }> } | null, objectRepresentation: { id: string, schema_thumbnail_url: string | null, schema_name: string | null, is_media_fragment_of: string | null, schema_in_language: string | null, schema_start_time: any, schema_end_time: any, schema_transcript: string | null, edm_is_next_in_sequence: string | null, updated_at: any, schemaTranscriptUrls: Array<{ schema_transcript: string, schema_transcript_url: string }>, includes: Array<{ file: { id: string, schema_name: string | null, ebucore_has_mime_type: string | null, premis_stored_at: string | null, schema_thumbnail_url: string | null, schema_duration: any, edm_is_next_in_sequence: string | null, created_at: any, hasMediaFragment: Array<{ id: string, schema_start_time: any, schema_end_time: any, schema_name: string | null }> } }> } | null, material_request_reuse_form_values: Array<{ key: string, value: string | null }> }> } | null };

export type UpdateMaterialRequestForUserMutationVariables = Exact<{
  materialRequestId?: any;
  userProfileId?: any;
  updateMaterialRequest?: App_Material_Requests_Set_Input | null | undefined;
}>;


export type UpdateMaterialRequestForUserMutation = { delete_app_material_request_reuse_form_values: { affected_rows: number } | null, update_app_material_requests: { returning: Array<{ id: any, ie_object_id: string, profile_id: any, reason: string, type: Lookup_App_Material_Request_Type_Enum, created_at: any, updated_at: any, requested_at: any, is_pending: boolean, is_archived: boolean, status: Lookup_App_Material_Request_Status_Enum, group_id: any, name: string | null, download_status: Lookup_App_Material_Request_Download_Status_Enum | null, download_available_at: any, requester_capacity: Lookup_App_Material_Request_Requester_Capacity_Enum, organisation_name: string | null, ie_object_representation_id: string | null, messages_and_events: Array<{ message_type: Lookup_App_Material_Request_Message_Type_Enum, created_at: any, body: any, sender_profile_id: any, sender: { first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, organisation: { org_identifier: string, skos_pref_label: string | null } | null } | null }>, organisation: { org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, schema_vat_id: string | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, group: { name: string, label: string, description: string | null, id: any } | null }, intellectualEntity: { schema_identifier: string | null, id: string, schema_date_published: string | null, created_at: any, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, premisIdentifier: Array<{ value: string }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaThumbnail: { schema_thumbnail_url: any } | null, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null, ha_org_sector: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null, schemaLicenses: Array<{ schema_license: string }> } | null, objectRepresentation: { id: string, schema_thumbnail_url: string | null, schema_name: string | null, is_media_fragment_of: string | null, schema_in_language: string | null, schema_start_time: any, schema_end_time: any, schema_transcript: string | null, edm_is_next_in_sequence: string | null, updated_at: any, schemaTranscriptUrls: Array<{ schema_transcript: string, schema_transcript_url: string }>, includes: Array<{ file: { id: string, schema_name: string | null, ebucore_has_mime_type: string | null, premis_stored_at: string | null, schema_thumbnail_url: string | null, schema_duration: any, edm_is_next_in_sequence: string | null, created_at: any, hasMediaFragment: Array<{ id: string, schema_start_time: any, schema_end_time: any, schema_name: string | null }> } }> } | null, material_request_reuse_form_values: Array<{ key: string, value: string | null }> }> } | null };

export type UpdateMaterialRequestStatusMutationVariables = Exact<{
  materialRequestId: any;
  updateMaterialRequest?: App_Material_Requests_Set_Input | null | undefined;
}>;


export type UpdateMaterialRequestStatusMutation = { update_app_material_requests_by_pk: { id: any, ie_object_id: string, profile_id: any, reason: string, type: Lookup_App_Material_Request_Type_Enum, created_at: any, updated_at: any, requested_at: any, is_pending: boolean, is_archived: boolean, status: Lookup_App_Material_Request_Status_Enum, group_id: any, name: string | null, download_status: Lookup_App_Material_Request_Download_Status_Enum | null, download_available_at: any, requester_capacity: Lookup_App_Material_Request_Requester_Capacity_Enum, organisation_name: string | null, ie_object_representation_id: string | null, messages_and_events: Array<{ message_type: Lookup_App_Material_Request_Message_Type_Enum, created_at: any, body: any, sender_profile_id: any, sender: { first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, organisation: { org_identifier: string, skos_pref_label: string | null } | null } | null }>, organisation: { org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, schema_vat_id: string | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, group: { name: string, label: string, description: string | null, id: any } | null }, intellectualEntity: { schema_identifier: string | null, id: string, schema_date_published: string | null, created_at: any, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, premisIdentifier: Array<{ value: string }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaThumbnail: { schema_thumbnail_url: any } | null, schemaMaintainer: { org_identifier: string, skos_pref_label: string | null, ha_org_has_logo: string | null, ha_org_sector: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null, schemaLicenses: Array<{ schema_license: string }> } | null, objectRepresentation: { id: string, schema_thumbnail_url: string | null, schema_name: string | null, is_media_fragment_of: string | null, schema_in_language: string | null, schema_start_time: any, schema_end_time: any, schema_transcript: string | null, edm_is_next_in_sequence: string | null, updated_at: any, schemaTranscriptUrls: Array<{ schema_transcript: string, schema_transcript_url: string }>, includes: Array<{ file: { id: string, schema_name: string | null, ebucore_has_mime_type: string | null, premis_stored_at: string | null, schema_thumbnail_url: string | null, schema_duration: any, edm_is_next_in_sequence: string | null, created_at: any, hasMediaFragment: Array<{ id: string, schema_start_time: any, schema_end_time: any, schema_name: string | null }> } }> } | null, material_request_reuse_form_values: Array<{ key: string, value: string | null }> } | null };

export type GetFileStoredAtByIeObjectIdQueryVariables = Exact<{
  ieObjectId?: string | null | undefined;
}>;


export type GetFileStoredAtByIeObjectIdQuery = { graph_representation: Array<{ includes: Array<{ file: { premis_stored_at: string | null } }> }> };

export type GetFileStoredAtByRepresentationIdQueryVariables = Exact<{
  representationId?: string | null | undefined;
}>;


export type GetFileStoredAtByRepresentationIdQuery = { graph_includes: Array<{ file: { premis_stored_at: string | null } }> };

export type GetMhIdentifiersFromPartialMhIdentifierQueryVariables = Exact<{
  partialMhIdentifierStartsWith: string;
}>;


export type GetMhIdentifiersFromPartialMhIdentifierQuery = { graph_mh_fragment_identifier: Array<{ mh_fragment_identifier: string }> };

export type GetNewspaperTitlesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNewspaperTitlesQuery = { graph__newspaper_public_content: Array<{ schema_name: string | null }> };

export type DeleteNotificationsMutationVariables = Exact<{
  where: App_Notification_Bool_Exp;
}>;


export type DeleteNotificationsMutation = { delete_app_notification: { affected_rows: number } | null };

export type FindNotificationsByUserQueryVariables = Exact<{
  userProfileId?: any;
  moreRecentThan?: any;
  offset?: number | null | undefined;
  limit?: number | null | undefined;
}>;


export type FindNotificationsByUserQuery = { app_notification: Array<{ id: any, description: string | null, title: string | null, status: string, type: string, recipient: any, linked_entity_id: any, created_at: any, updated_at: any, visitor_space_request: { id: any, visitor_space: { id: any, schema_maintainer_id: string, organisation: { organizationSlug: { slug: string } | null } | null } } | null, material_request: { requested_by: { first_name: string | null, last_name: string | null }, intellectualEntity: { schemaMaintainer: { skos_pref_label: string | null } | null } | null } | null }>, app_notification_aggregate: { aggregate: { count: number } | null } };

export type InsertNotificationsMutationVariables = Exact<{
  objects: Array<App_Notification_Insert_Input> | App_Notification_Insert_Input;
}>;


export type InsertNotificationsMutation = { insert_app_notification: { returning: Array<{ id: any, description: string | null, title: string | null, status: string, type: string, recipient: any, linked_entity_id: any, created_at: any, updated_at: any, visitor_space_request: { cp_space_id: any, visitor_space: { id: any, schema_maintainer_id: string, organisation: { organizationSlug: { slug: string } | null } | null } } | null, material_request: { requested_by: { first_name: string | null, last_name: string | null }, intellectualEntity: { schemaMaintainer: { skos_pref_label: string | null } | null } | null } | null }> } | null };

export type UpdateAllNotificationsForUserMutationVariables = Exact<{
  userProfileId?: any;
  notification?: App_Notification_Set_Input | null | undefined;
}>;


export type UpdateAllNotificationsForUserMutation = { update_app_notification: { affected_rows: number } | null };

export type UpdateNotificationMutationVariables = Exact<{
  notificationId?: any;
  userProfileId?: any;
  notification?: App_Notification_Set_Input | null | undefined;
}>;


export type UpdateNotificationMutation = { update_app_notification: { returning: Array<{ id: any, description: string | null, title: string | null, status: string, type: string, recipient: any, linked_entity_id: any, created_at: any, updated_at: any, visitor_space_request: { cp_space_id: any, visitor_space: { id: any, schema_maintainer_id: string, organisation: { organizationSlug: { slug: string } | null } | null } } | null, material_request: { requested_by: { first_name: string | null, last_name: string | null }, intellectualEntity: { schemaMaintainer: { skos_pref_label: string | null } | null } | null } | null }> } | null };

export type FindOrganisationSlugsQueryVariables = Exact<{
  where?: Maintainer_Organization_Slug_Bool_Exp | null | undefined;
  offset: number;
  limit: number;
  orderBy?: Array<Maintainer_Organization_Slug_Order_By> | Maintainer_Organization_Slug_Order_By | null | undefined;
}>;


export type FindOrganisationSlugsQuery = { maintainer_organization_slug: Array<{ org_identifier: string, slug: string, organisation: { skos_pref_label: string | null } | null }>, maintainer_organization_slug_aggregate: { aggregate: { count: number } | null } };

export type FindOrganisationsBySchemaIdsQueryVariables = Exact<{
  schemaIdentifiers: Array<string> | string;
}>;


export type FindOrganisationsBySchemaIdsQuery = { graph_organization: Array<{ id: string, org_identifier: string, skos_pref_label: string | null, dcterms_description: string | null, foaf_homepage: string | null, ha_org_has_logo: string | null, ha_org_request_form: string | null, ha_org_sector: string | null, updated_at: any, created_at: any, schema_vat_id: string | null, organizationSlug: { slug: string } | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }>, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> }> };

export type GetOrganisationBySlugQueryVariables = Exact<{
  slug: string;
}>;


export type GetOrganisationBySlugQuery = { graph_organization: Array<{ id: string, org_identifier: string, skos_pref_label: string | null, dcterms_description: string | null, foaf_homepage: string | null, ha_org_has_logo: string | null, ha_org_request_form: string | null, ha_org_sector: string | null, updated_at: any, created_at: any, schema_vat_id: string | null, organizationSlug: { slug: string } | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }>, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> }> };

export type GetOrganisationsThatHaveObjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrganisationsThatHaveObjectsQuery = { graph_organisations_with_objects: Array<{ id: string | null, ha_org_has_logo: string | null, skos_pref_label: string | null, org_identifier: string | null, foaf_homepage: string | null, organization_slug: string | null }> };

export type UpdateOrganisationSlugMutationVariables = Exact<{
  org_identifier: string;
  slug: string;
}>;


export type UpdateOrganisationSlugMutation = { update_maintainer_organization_slug: { returning: Array<{ org_identifier: string, slug: string, organisation: { skos_pref_label: string | null } | null }> } | null };

export type GetSitemapConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSitemapConfigQuery = { app_config: Array<{ value: any, updated_at: any, name: string, created_at: any }> };

export type CreateSpaceMutationVariables = Exact<{
  createSpace: Maintainer_Visitor_Space_Insert_Input;
}>;


export type CreateSpaceMutation = { insert_maintainer_visitor_space_one: { id: any, schema_image: string | null, schema_color: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_public_access: boolean | null, schema_description_nl: string | null, schema_service_description_nl: string | null, schema_description_en: string | null, schema_service_description_en: string | null, status: Lookup_Maintainer_Visitor_Space_Status_Enum, published_at: any, created_at: any, updated_at: any, organisation: { id: string, skos_pref_label: string | null, org_identifier: string, foaf_homepage: string | null, ha_org_has_logo: string | null, dcterms_description: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null } | null };

export type FindSpaceByIdQueryVariables = Exact<{
  id: any;
}>;


export type FindSpaceByIdQuery = { maintainer_visitor_space: Array<{ id: any, schema_image: string | null, schema_color: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_public_access: boolean | null, schema_description_nl: string | null, schema_service_description_nl: string | null, schema_description_en: string | null, schema_service_description_en: string | null, status: Lookup_Maintainer_Visitor_Space_Status_Enum, published_at: any, created_at: any, updated_at: any, organisation: { id: string, skos_pref_label: string | null, org_identifier: string, foaf_homepage: string | null, ha_org_has_logo: string | null, dcterms_description: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null }> };

export type FindSpaceByOrganisationIdQueryVariables = Exact<{
  organisationId: string;
}>;


export type FindSpaceByOrganisationIdQuery = { maintainer_visitor_space: Array<{ id: any, schema_image: string | null, schema_color: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_public_access: boolean | null, schema_description_nl: string | null, schema_service_description_nl: string | null, schema_description_en: string | null, schema_service_description_en: string | null, status: Lookup_Maintainer_Visitor_Space_Status_Enum, published_at: any, created_at: any, updated_at: any, organisation: { id: string, skos_pref_label: string | null, org_identifier: string, foaf_homepage: string | null, ha_org_has_logo: string | null, dcterms_description: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null }> };

export type FindSpaceBySlugQueryVariables = Exact<{
  slug: string;
}>;


export type FindSpaceBySlugQuery = { maintainer_visitor_space: Array<{ id: any, schema_image: string | null, schema_color: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_public_access: boolean | null, schema_description_nl: string | null, schema_service_description_nl: string | null, schema_description_en: string | null, schema_service_description_en: string | null, status: Lookup_Maintainer_Visitor_Space_Status_Enum, published_at: any, created_at: any, updated_at: any, organisation: { id: string, skos_pref_label: string | null, org_identifier: string, foaf_homepage: string | null, ha_org_has_logo: string | null, dcterms_description: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null }> };

export type FindSpacesQueryVariables = Exact<{
  where: Maintainer_Visitor_Space_Bool_Exp;
  offset: number;
  limit: number;
  orderBy: Maintainer_Visitor_Space_Order_By;
}>;


export type FindSpacesQuery = { maintainer_visitor_space: Array<{ id: any, schema_image: string | null, schema_color: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_public_access: boolean | null, schema_description_nl: string | null, schema_service_description_nl: string | null, schema_description_en: string | null, schema_service_description_en: string | null, status: Lookup_Maintainer_Visitor_Space_Status_Enum, published_at: any, created_at: any, updated_at: any, organisation: { id: string, skos_pref_label: string | null, org_identifier: string, foaf_homepage: string | null, ha_org_has_logo: string | null, dcterms_description: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null }>, maintainer_visitor_space_aggregate: { aggregate: { count: number } | null } };

export type GetVisitorSpaceCpAdminProfilesQueryVariables = Exact<{
  spaceId?: any;
}>;


export type GetVisitorSpaceCpAdminProfilesQuery = { maintainer_visitor_space: Array<{ profiles: Array<{ id: any, mail: string | null, language: Lookup_Languages_Enum }> }> };

export type UpdateSpaceMutationVariables = Exact<{
  id: any;
  updateSpace: Maintainer_Visitor_Space_Set_Input;
}>;


export type UpdateSpaceMutation = { update_maintainer_visitor_space_by_pk: { id: any, schema_image: string | null, schema_color: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_public_access: boolean | null, schema_description_nl: string | null, schema_service_description_nl: string | null, schema_description_en: string | null, schema_service_description_en: string | null, status: Lookup_Maintainer_Visitor_Space_Status_Enum, published_at: any, created_at: any, updated_at: any, organisation: { id: string, skos_pref_label: string | null, org_identifier: string, foaf_homepage: string | null, ha_org_has_logo: string | null, dcterms_description: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null } | null };

export type GetFirstObjectIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFirstObjectIdQuery = { graph_intellectual_entity: Array<{ schema_identifier: string | null }> };

export type DeleteIeObjectFromThemeMutationVariables = Exact<{
  themeId: any;
  ieObjectId: string;
}>;


export type DeleteIeObjectFromThemeMutation = { delete_app_theme_intellectual_entity: { affected_rows: number } | null };

export type DeleteThemeMutationVariables = Exact<{
  themeId: any;
}>;


export type DeleteThemeMutation = { delete_app_theme_by_pk: { id: any } | null };

export type GetIeObjectsInThemeQueryVariables = Exact<{
  slug: string;
  objectsLimit: number;
}>;


export type GetIeObjectsInThemeQuery = { app_theme: Array<{ id: any, slug: string, name_nl: string, name_en: string, image_url: string | null, ieObjectLinksRandomOrder: Array<{ ieObject: { id: string, schema_identifier: string | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaThumbnail: { schema_thumbnail_url: any } | null, schemaMaintainer: { id: string, skos_pref_label: string | null, ha_org_sector: string | null, org_identifier: string } | null, schemaLicense: { schema_license: any } | null } | null }> }> };

export type GetThemeWithObjectsQueryVariables = Exact<{
  themeId: any;
  offset?: number | null | undefined;
  limit?: number | null | undefined;
  orderBy?: Array<App_Theme_Intellectual_Entity_Order_By> | App_Theme_Intellectual_Entity_Order_By | null | undefined;
}>;


export type GetThemeWithObjectsQuery = { app_theme_by_pk: { id: any, slug: string, name_nl: string, name_en: string, description_nl: string | null, description_en: string | null, image_url: string | null, content_page_path_nl: string | null, content_page_path_en: string | null, updated_at: any, ieObjectLinks: Array<{ ieObject: { id: string, schema_identifier: string | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaThumbnail: { schema_thumbnail_url: any } | null, schemaMaintainer: { id: string, skos_pref_label: string | null, ha_org_sector: string | null, org_identifier: string, organizationSlug: { slug: string } | null } | null, schemaLicense: { schema_license: any } | null } | null }>, ieObjectLinks_aggregate: { aggregate: { count: number } | null } } | null };

export type GetThemeWithObjectsInRandomOrderQueryVariables = Exact<{
  themeId: any;
  objectsLimit: number;
}>;


export type GetThemeWithObjectsInRandomOrderQuery = { app_theme_by_pk: { id: any, slug: string, name_nl: string, name_en: string, description_nl: string | null, description_en: string | null, image_url: string | null, content_page_path_nl: string | null, content_page_path_en: string | null, updated_at: any, ieObjectLinksRandomOrder: Array<{ ieObject: { id: string, schema_identifier: string | null, schemaNames: Array<{ schema_name: string, is_ai_generated: boolean }>, dctermsFormat: Array<{ dcterms_format: string }>, schemaThumbnail: { schema_thumbnail_url: any } | null, schemaMaintainer: { id: string, skos_pref_label: string | null, ha_org_sector: string | null, org_identifier: string, organizationSlug: { slug: string } | null } | null, schemaLicense: { schema_license: any } | null } | null }>, ieObjectLinks_aggregate: { aggregate: { count: number } | null } } | null };

export type GetThemesQueryVariables = Exact<{
  offset?: number | null | undefined;
  limit?: number | null | undefined;
  orderBy?: Array<App_Theme_Order_By> | App_Theme_Order_By | null | undefined;
}>;


export type GetThemesQuery = { app_theme: Array<{ id: any, slug: string, name_nl: string, name_en: string, description_nl: string | null, description_en: string | null, image_url: string | null, content_page_path_nl: string | null, content_page_path_en: string | null, updated_at: any }>, app_theme_aggregate: { aggregate: { count: number } | null } };

export type GetThemesByIdsQueryVariables = Exact<{
  ids: Array<any> | any;
}>;


export type GetThemesByIdsQuery = { app_theme: Array<{ id: any, slug: string, name_nl: string, name_en: string, description_nl: string | null, description_en: string | null, image_url: string | null, content_page_path_nl: string | null, content_page_path_en: string | null, updated_at: any }> };

export type GetThemesInRandomOrderQueryVariables = Exact<{
  limit?: number | null | undefined;
}>;


export type GetThemesInRandomOrderQuery = { app_theme_random_order: Array<{ id: any, slug: string | null, name_nl: string | null, name_en: string | null, image_url: string | null }> };

export type GetThemesSearchQueryVariables = Exact<{
  offset?: number | null | undefined;
  limit?: number | null | undefined;
  orderBy?: Array<App_Theme_Order_By> | App_Theme_Order_By | null | undefined;
  searchTerm?: string | null | undefined;
}>;


export type GetThemesSearchQuery = { app_theme: Array<{ id: any, slug: string, name_nl: string, name_en: string, description_nl: string | null, description_en: string | null, image_url: string | null, content_page_path_nl: string | null, content_page_path_en: string | null, updated_at: any }>, app_theme_aggregate: { aggregate: { count: number } | null } };

export type InsertIeObjectsIntoThemeMutationVariables = Exact<{
  objects: Array<App_Theme_Intellectual_Entity_Insert_Input> | App_Theme_Intellectual_Entity_Insert_Input;
}>;


export type InsertIeObjectsIntoThemeMutation = { insert_app_theme_intellectual_entity: { returning: Array<{ id: any, theme_id: any, intellectual_entity_id: string }> } | null };

export type InsertThemeMutationVariables = Exact<{
  object: App_Theme_Insert_Input;
}>;


export type InsertThemeMutation = { insert_app_theme_one: { id: any, slug: string, name_nl: string, name_en: string, description_nl: string | null, description_en: string | null, image_url: string | null, content_page_path_nl: string | null, content_page_path_en: string | null } | null };

export type UpdateThemeMutationVariables = Exact<{
  themeId: any;
  theme: App_Theme_Set_Input;
}>;


export type UpdateThemeMutation = { update_app_theme_by_pk: { id: any, slug: string, name_nl: string, name_en: string, description_nl: string | null, description_en: string | null, image_url: string | null, content_page_path_nl: string | null, content_page_path_en: string | null } | null };

export type GetTosLastUpdatedAtQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTosLastUpdatedAtQuery = { app_config_by_pk: { value: any } | null };

export type FindProfileLanguagesByIdsQueryVariables = Exact<{
  ids: Array<any> | any;
}>;


export type FindProfileLanguagesByIdsQuery = { users_profile: Array<{ id: any, language: Lookup_Languages_Enum }> };

export type GetUserByEmailQueryVariables = Exact<{
  email: string;
}>;


export type GetUserByEmailQuery = { users_profile: Array<{ id: any, first_name: string | null, last_name: string | null, full_name: string | null, mail: string | null, is_key_user: boolean, is_evaluator: boolean, accepted_tos_at: any, last_access_at: any, language: Lookup_Languages_Enum, created_at: any, updated_at: any, group_id: any, group: { permissions: Array<{ permission: { name: string } }> } | null, identities: Array<{ identity_provider_name: string }>, organisation: { id: string, org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, schema_vat_id: string | null, organizationSlug: { slug: string } | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null }> };

export type GetUserByIdQueryVariables = Exact<{
  id: any;
}>;


export type GetUserByIdQuery = { users_profile: Array<{ id: any, first_name: string | null, last_name: string | null, full_name: string | null, mail: string | null, is_key_user: boolean, is_evaluator: boolean, accepted_tos_at: any, last_access_at: any, language: Lookup_Languages_Enum, created_at: any, updated_at: any, group_id: any, group: { permissions: Array<{ permission: { name: string } }> } | null, identities: Array<{ identity_provider_name: string }>, organisation: { id: string, org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, schema_vat_id: string | null, organizationSlug: { slug: string } | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null }> };

export type GetUserByIdentityIdQueryVariables = Exact<{
  identityId: string;
}>;


export type GetUserByIdentityIdQuery = { users_profile: Array<{ id: any, first_name: string | null, last_name: string | null, full_name: string | null, mail: string | null, is_key_user: boolean, is_evaluator: boolean, accepted_tos_at: any, last_access_at: any, language: Lookup_Languages_Enum, created_at: any, updated_at: any, group_id: any, group: { permissions: Array<{ permission: { name: string } }> } | null, identities: Array<{ identity_provider_name: string }>, organisation: { id: string, org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, schema_vat_id: string | null, organizationSlug: { slug: string } | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null }> };

export type InsertUserMutationVariables = Exact<{
  newUser: Users_Profile_Insert_Input;
}>;


export type InsertUserMutation = { insert_users_profile_one: { id: any, first_name: string | null, last_name: string | null, full_name: string | null, mail: string | null, is_key_user: boolean, is_evaluator: boolean, accepted_tos_at: any, last_access_at: any, language: Lookup_Languages_Enum, created_at: any, updated_at: any, group_id: any, group: { permissions: Array<{ permission: { name: string } }> } | null, identities: Array<{ identity_provider_name: string }>, organisation: { id: string, org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, schema_vat_id: string | null, organizationSlug: { slug: string } | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null } | null };

export type InsertUserIdentityMutationVariables = Exact<{
  newUserIdentity: Users_Identity_Insert_Input;
}>;


export type InsertUserIdentityMutation = { insert_users_identity_one: { id: any } | null };

export type UpdateUserLanguageMutationVariables = Exact<{
  id: any;
  lang: Lookup_Languages_Enum;
}>;


export type UpdateUserLanguageMutation = { update_users_profile: { affected_rows: number } | null };

export type UpdateUserLastAccessDateMutationVariables = Exact<{
  userProfileId: any;
  date?: any;
}>;


export type UpdateUserLastAccessDateMutation = { update_users_profile: { affected_rows: number } | null };

export type UpdateUserProfileMutationVariables = Exact<{
  id: any;
  updateUser: Users_Profile_Set_Input;
}>;


export type UpdateUserProfileMutation = { update_users_profile: { returning: Array<{ id: any, first_name: string | null, last_name: string | null, full_name: string | null, mail: string | null, is_key_user: boolean, is_evaluator: boolean, accepted_tos_at: any, last_access_at: any, language: Lookup_Languages_Enum, created_at: any, updated_at: any, group_id: any, group: { permissions: Array<{ permission: { name: string } }> } | null, identities: Array<{ identity_provider_name: string }>, organisation: { id: string, org_identifier: string, skos_pref_label: string | null, ha_org_sector: string | null, schema_vat_id: string | null, organizationSlug: { slug: string } | null, hasSite: Array<{ postalAddress: { schema_street_address: string | null, schema_address_locality: string | null, schema_postal_code: string | null, schema_contact_type: string | null } }> } | null }> } | null };

export type DeleteVisitFolderAccessMutationVariables = Exact<{
  visitRequestId: any;
}>;


export type DeleteVisitFolderAccessMutation = { delete_maintainer_visitor_space_request_folder_access: { affected_rows: number } | null };

export type FindActiveVisitByUserAndSpaceQueryVariables = Exact<{
  userProfileId: any;
  visitorSpaceSlug: string;
  now: any;
}>;


export type FindActiveVisitByUserAndSpaceQuery = { maintainer_visitor_space_request: Array<{ id: any, cp_space_id: any, user_profile_id: any, user_reason: string | null, user_timeframe: string | null, status: string, access_type: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum, start_date: any, end_date: any, created_at: any, updated_at: any, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, folders: Array<{ intellectualEntities: Array<{ ie_object_id: string }> }> }, visitor_space_request_notes: Array<{ id: any, note: string, created_at: any, profile: { full_name: string | null } | null }>, last_updated_by: { id: any, full_name: string | null } | null, visitor_space: { id: any, schema_maintainer_id: string, schema_image: string | null, schema_color: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_public_access: boolean | null, schema_description_nl: string | null, schema_service_description_nl: string | null, schema_description_en: string | null, schema_service_description_en: string | null, status: Lookup_Maintainer_Visitor_Space_Status_Enum, published_at: any, created_at: any, updated_at: any, organisation: { id: string, skos_pref_label: string | null, org_identifier: string, foaf_homepage: string | null, ha_org_has_logo: string | null, dcterms_description: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null }, accessible_folders: Array<{ folder: { id: any, intellectualEntities: Array<{ intellectualEntity: { schema_identifier: string | null, schemaMaintainer: { org_identifier: string } | null } | null }> } }> }> };

export type FindApprovedAlmostEndedVisitsWithoutNotificationQueryVariables = Exact<{
  warningDate?: any;
  now?: any;
}>;


export type FindApprovedAlmostEndedVisitsWithoutNotificationQuery = { maintainer_visitor_space_request: Array<{ id: any, cp_space_id: any, user_profile_id: any, user_reason: string | null, user_timeframe: string | null, status: string, access_type: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum, start_date: any, end_date: any, created_at: any, updated_at: any, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, folders: Array<{ intellectualEntities: Array<{ ie_object_id: string }> }> }, last_updated_by: { id: any, full_name: string | null } | null, visitor_space: { id: any, schema_maintainer_id: string, schema_image: string | null, schema_color: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_public_access: boolean | null, schema_description_nl: string | null, schema_service_description_nl: string | null, schema_description_en: string | null, schema_service_description_en: string | null, status: Lookup_Maintainer_Visitor_Space_Status_Enum, published_at: any, created_at: any, updated_at: any, organisation: { id: string, skos_pref_label: string | null, org_identifier: string, foaf_homepage: string | null, ha_org_has_logo: string | null, dcterms_description: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null }, accessible_folders: Array<{ folder: { id: any, intellectualEntities: Array<{ intellectualEntity: { schema_identifier: string | null, schemaMaintainer: { org_identifier: string } | null } | null }> } }> }> };

export type FindApprovedEndedVisitsWithoutNotificationQueryVariables = Exact<{
  now?: any;
}>;


export type FindApprovedEndedVisitsWithoutNotificationQuery = { maintainer_visitor_space_request: Array<{ id: any, cp_space_id: any, user_profile_id: any, user_reason: string | null, user_timeframe: string | null, status: string, access_type: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum, start_date: any, end_date: any, created_at: any, updated_at: any, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, folders: Array<{ intellectualEntities: Array<{ ie_object_id: string }> }> }, last_updated_by: { id: any, full_name: string | null } | null, visitor_space: { id: any, schema_maintainer_id: string, schema_image: string | null, schema_color: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_public_access: boolean | null, schema_description_nl: string | null, schema_service_description_nl: string | null, schema_description_en: string | null, schema_service_description_en: string | null, status: Lookup_Maintainer_Visitor_Space_Status_Enum, published_at: any, created_at: any, updated_at: any, organisation: { id: string, skos_pref_label: string | null, org_identifier: string, foaf_homepage: string | null, ha_org_has_logo: string | null, dcterms_description: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null }, accessible_folders: Array<{ folder: { id: any, intellectualEntities: Array<{ intellectualEntity: { schema_identifier: string | null, schemaMaintainer: { org_identifier: string } | null } | null }> } }> }> };

export type FindApprovedStartedVisitsWithoutNotificationQueryVariables = Exact<{
  now?: any;
}>;


export type FindApprovedStartedVisitsWithoutNotificationQuery = { maintainer_visitor_space_request: Array<{ id: any, cp_space_id: any, user_profile_id: any, user_reason: string | null, user_timeframe: string | null, status: string, access_type: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum, start_date: any, end_date: any, created_at: any, updated_at: any, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, folders: Array<{ intellectualEntities: Array<{ ie_object_id: string }> }> }, last_updated_by: { id: any, full_name: string | null } | null, visitor_space: { id: any, schema_maintainer_id: string, schema_image: string | null, schema_color: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_public_access: boolean | null, schema_description_nl: string | null, schema_service_description_nl: string | null, schema_description_en: string | null, schema_service_description_en: string | null, status: Lookup_Maintainer_Visitor_Space_Status_Enum, published_at: any, created_at: any, updated_at: any, organisation: { id: string, skos_pref_label: string | null, org_identifier: string, foaf_homepage: string | null, ha_org_has_logo: string | null, dcterms_description: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null }, accessible_folders: Array<{ folder: { id: any, intellectualEntities: Array<{ intellectualEntity: { schema_identifier: string | null, schemaMaintainer: { org_identifier: string } | null } | null }> } }> }> };

export type FindPendingOrApprovedVisitRequestsForUserQueryVariables = Exact<{
  userProfileId: any;
  spaceSlug: string;
  now: any;
}>;


export type FindPendingOrApprovedVisitRequestsForUserQuery = { maintainer_visitor_space_request: Array<{ id: any, cp_space_id: any, user_profile_id: any, status: string, access_type: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum, start_date: any, end_date: any }> };

export type FindVisitByIdQueryVariables = Exact<{
  id: any;
}>;


export type FindVisitByIdQuery = { maintainer_visitor_space_request: Array<{ id: any, cp_space_id: any, user_profile_id: any, user_reason: string | null, user_timeframe: string | null, status: string, access_type: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum, start_date: any, end_date: any, created_at: any, updated_at: any, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, folders: Array<{ intellectualEntities: Array<{ ie_object_id: string }> }> }, visitor_space_request_notes: Array<{ id: any, note: string, created_at: any, profile: { full_name: string | null } | null }>, last_updated_by: { id: any, full_name: string | null } | null, visitor_space: { id: any, schema_maintainer_id: string, schema_image: string | null, schema_color: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_public_access: boolean | null, schema_description_nl: string | null, schema_service_description_nl: string | null, schema_description_en: string | null, schema_service_description_en: string | null, status: Lookup_Maintainer_Visitor_Space_Status_Enum, published_at: any, created_at: any, updated_at: any, organisation: { id: string, skos_pref_label: string | null, org_identifier: string, foaf_homepage: string | null, ha_org_has_logo: string | null, dcterms_description: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null }, accessible_folders: Array<{ folder: { id: any, intellectualEntities: Array<{ intellectualEntity: { schema_identifier: string | null, schemaMaintainer: { org_identifier: string } | null } | null }> } }> }> };

export type FindVisitEndDatesByFolderIdQueryVariables = Exact<{
  folderId: any;
  now: any;
}>;


export type FindVisitEndDatesByFolderIdQuery = { maintainer_visitor_space_request_folder_access: Array<{ visitor_space_request: { end_date: any } }> };

export type FindVisitsQueryVariables = Exact<{
  where?: Maintainer_Visitor_Space_Request_Bool_Exp | null | undefined;
  offset: number;
  limit: number;
  orderBy?: Maintainer_Visitor_Space_Request_Order_By;
}>;


export type FindVisitsQuery = { maintainer_visitor_space_request: Array<{ id: any, cp_space_id: any, user_profile_id: any, user_reason: string | null, user_timeframe: string | null, status: string, access_type: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum, start_date: any, end_date: any, created_at: any, updated_at: any, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, folders: Array<{ intellectualEntities: Array<{ ie_object_id: string }> }> }, visitor_space_request_notes: Array<{ id: any, note: string, created_at: any, profile: { full_name: string | null } | null }>, visitor_space: { id: any, schema_maintainer_id: string, schema_image: string | null, schema_color: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_public_access: boolean | null, schema_description_nl: string | null, schema_service_description_nl: string | null, schema_description_en: string | null, schema_service_description_en: string | null, status: Lookup_Maintainer_Visitor_Space_Status_Enum, published_at: any, created_at: any, updated_at: any, organisation: { id: string, skos_pref_label: string | null, org_identifier: string, foaf_homepage: string | null, ha_org_has_logo: string | null, dcterms_description: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null }, last_updated_by: { id: any, full_name: string | null } | null, accessible_folders: Array<{ folder: { id: any, intellectualEntities: Array<{ intellectualEntity: { schema_identifier: string | null, schemaMaintainer: { org_identifier: string } | null } | null }> } }> }>, maintainer_visitor_space_request_aggregate: { aggregate: { count: number } | null } };

export type InsertNoteMutationVariables = Exact<{
  visitId: any;
  note?: string | null | undefined;
  userProfileId?: any;
}>;


export type InsertNoteMutation = { insert_maintainer_visitor_space_request_note_one: { id: any } | null };

export type InsertVisitMutationVariables = Exact<{
  newVisit: Maintainer_Visitor_Space_Request_Insert_Input;
}>;


export type InsertVisitMutation = { insert_maintainer_visitor_space_request_one: { id: any, cp_space_id: any, user_profile_id: any, user_reason: string | null, user_timeframe: string | null, status: string, access_type: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum, start_date: any, end_date: any, created_at: any, updated_at: any, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, folders: Array<{ intellectualEntities: Array<{ ie_object_id: string }> }> }, visitor_space_request_notes: Array<{ id: any, note: string, created_at: any, profile: { full_name: string | null } | null }>, last_updated_by: { id: any, full_name: string | null } | null, visitor_space: { id: any, schema_maintainer_id: string, schema_image: string | null, schema_color: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_public_access: boolean | null, schema_description_nl: string | null, schema_service_description_nl: string | null, schema_description_en: string | null, schema_service_description_en: string | null, status: Lookup_Maintainer_Visitor_Space_Status_Enum, published_at: any, created_at: any, updated_at: any, organisation: { id: string, skos_pref_label: string | null, org_identifier: string, foaf_homepage: string | null, ha_org_has_logo: string | null, dcterms_description: string | null, organizationSlug: { slug: string } | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null }, accessible_folders: Array<{ folder: { id: any, intellectualEntities: Array<{ intellectualEntity: { schema_identifier: string | null, schemaMaintainer: { org_identifier: string } | null } | null }> } }> } | null };

export type InsertVisitFolderAccessMutationVariables = Exact<{
  objects?: Array<Maintainer_Visitor_Space_Request_Folder_Access_Insert_Input> | Maintainer_Visitor_Space_Request_Folder_Access_Insert_Input | null | undefined;
}>;


export type InsertVisitFolderAccessMutation = { insert_maintainer_visitor_space_request_folder_access: { returning: Array<{ id: any }> } | null };

export type PendingVisitCountForUserBySlugQueryVariables = Exact<{
  user?: any;
  slug?: string | null | undefined;
}>;


export type PendingVisitCountForUserBySlugQuery = { maintainer_visitor_space_request_aggregate: { aggregate: { count: number } | null, nodes: Array<{ cp_space_id: any }> } };

export type UpdateVisitMutationVariables = Exact<{
  id: any;
  updateVisit: Maintainer_Visitor_Space_Request_Set_Input;
}>;


export type UpdateVisitMutation = { update_maintainer_visitor_space_request: { returning: Array<{ id: any, cp_space_id: any, user_profile_id: any, user_reason: string | null, user_timeframe: string | null, status: string, access_type: Lookup_Maintainer_Visitor_Space_Request_Access_Type_Enum, start_date: any, end_date: any, created_at: any, updated_at: any, requested_by: { id: any, full_name: string | null, first_name: string | null, last_name: string | null, mail: string | null, language: Lookup_Languages_Enum, folders: Array<{ intellectualEntities: Array<{ ie_object_id: string }> }> }, visitor_space_request_notes: Array<{ id: any, note: string, created_at: any, profile: { full_name: string | null } | null }>, last_updated_by: { id: any, full_name: string | null } | null, visitor_space: { id: any, schema_maintainer_id: string, schema_image: string | null, schema_color: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_public_access: boolean | null, schema_description_nl: string | null, schema_service_description_nl: string | null, schema_description_en: string | null, schema_service_description_en: string | null, status: Lookup_Maintainer_Visitor_Space_Status_Enum, published_at: any, created_at: any, updated_at: any, organisation: { id: string, skos_pref_label: string | null, org_identifier: string, foaf_homepage: string | null, ha_org_has_logo: string | null, dcterms_description: string | null, schemaContactPoint: Array<{ schema_contact_type: string | null, schema_email: string | null, schema_telephone: string | null }> } | null }, accessible_folders: Array<{ folder: { intellectualEntities: Array<{ intellectualEntity: { schema_identifier: string | null, schemaMaintainer: { org_identifier: string } | null } | null }> } }> }> } | null };


export const FindContentPartnersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findContentPartners"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"graph_organisations_with_objects_bool_exp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_organisations_with_objects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"organization_slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"graph_organisations_with_objects_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<FindContentPartnersQuery, FindContentPartnersQueryVariables>;
export const FindFolderByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findFolderById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_folder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"is_default"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}}]}}]}}]} as unknown as DocumentNode<FindFolderByIdQuery, FindFolderByIdQueryVariables>;
export const FindFolderIeObjectsByFolderIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findFolderIeObjectsByFolderId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"users_folder_ie_bool_exp"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_folder_ie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_collection_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}}]}}]},{"kind":"Variable","name":{"kind":"Name","value":"where"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"collection"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created"}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaDuration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"primary","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"meemoo_local_id"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaIsPartOf"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users_folder_ie_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_collection_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}}]}}]},{"kind":"Variable","name":{"kind":"Name","value":"where"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"collection"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<FindFolderIeObjectsByFolderIdQuery, FindFolderIeObjectsByFolderIdQueryVariables>;
export const FindFoldersByUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findFoldersByUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_folder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"is_default"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users_folder_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<FindFoldersByUserQuery, FindFoldersByUserQueryVariables>;
export const FindIeObjectByIeObjectIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findIeObjectByIeObjectId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaDuration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"primary","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"meemoo_local_id"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaIsPartOf"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindIeObjectByIeObjectIdQuery, FindIeObjectByIeObjectIdQueryVariables>;
export const FindIeObjectBySchemaIdentifierDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findIeObjectBySchemaIdentifier"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schemaIdentifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schemaIdentifier"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaDuration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"primary","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"meemoo_local_id"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaIsPartOf"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindIeObjectBySchemaIdentifierQuery, FindIeObjectBySchemaIdentifierQueryVariables>;
export const FindIeObjectInFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findIeObjectInFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_folder_ie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_collection_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"ie_object_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"collection"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaDuration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"primary","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"meemoo_local_id"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaIsPartOf"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<FindIeObjectInFolderQuery, FindIeObjectInFolderQueryVariables>;
export const GetSchemaIdentifierV3BySchemaIdentifierV2Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSchemaIdentifierV3BySchemaIdentifierV2"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schemaIdentifierV2"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_mh_fragment_identifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"mh_fragment_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schemaIdentifierV2"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mh_fragment_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"intellectual_entity_id"}}]}}]}}]} as unknown as DocumentNode<GetSchemaIdentifierV3BySchemaIdentifierV2Query, GetSchemaIdentifierV3BySchemaIdentifierV2QueryVariables>;
export const InsertFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"users_folder_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_users_folder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"object"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"is_default"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]}}]} as unknown as DocumentNode<InsertFolderMutation, InsertFolderMutationVariables>;
export const InsertIeObjectIntoFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertIeObjectIntoFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_users_folder_ie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_collection_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"ie_object_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]}}]} as unknown as DocumentNode<InsertIeObjectIntoFolderMutation, InsertIeObjectIntoFolderMutationVariables>;
export const RemoveObjectFromFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeObjectFromFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_users_folder_ie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"ie_object_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"user_collection_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"collection"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<RemoveObjectFromFolderMutation, RemoveObjectFromFolderMutationVariables>;
export const SoftDeleteFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"softDeleteFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_users_folder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"BooleanValue","value":true}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<SoftDeleteFolderMutation, SoftDeleteFolderMutationVariables>;
export const UpdateFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folder"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"users_folder_set_input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_users_folder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folder"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"is_default"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateFolderMutation, UpdateFolderMutationVariables>;
export const FindAllIeObjectsByFolderIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findAllIeObjectsByFolderId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_folder_ie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_collection_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"collection"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaDuration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"primary","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"meemoo_local_id"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaIsPartOf"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindAllIeObjectsByFolderIdQuery, FindAllIeObjectsByFolderIdQueryVariables>;
export const FindIeObjectsForSitemapDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findIeObjectsForSitemap"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"licenses"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"afterId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"afterId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"schemaLicenses"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_license"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"licenses"}}}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"dctermsFormat"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dcterms_format"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_neq"},"value":{"kind":"StringValue","value":"newspaperpage","block":false}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"EnumValue","value":"asc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}}]}}]}}]}}]} as unknown as DocumentNode<FindIeObjectsForSitemapQuery, FindIeObjectsForSitemapQueryVariables>;
export const GetAllReusabilityRightsIrisDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllReusabilityRightsIris"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_rights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectual_entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"reuse_category_id"}}]}}]}}]} as unknown as DocumentNode<GetAllReusabilityRightsIrisQuery, GetAllReusabilityRightsIrisQueryVariables>;
export const GetChildIeObjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getChildIeObjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentObjectIri"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentObjectIri"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"hasPart"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dctermsFormat"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dcterms_format"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"videofragment","block":false},{"kind":"StringValue","value":"audiofragment","block":false}]}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasPart"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaDuration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetChildIeObjectsQuery, GetChildIeObjectsQueryVariables>;
export const GetIeObjectChildrenIrisDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getIeObjectChildrenIris"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectIri"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"relation_is_part_of"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectIri"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}}]}}]}}]} as unknown as DocumentNode<GetIeObjectChildrenIrisQuery, GetIeObjectChildrenIrisQueryVariables>;
export const GetIeObjectDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getIeObjectDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"getIeObject"},"name":{"kind":"Name","value":"graph_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_position"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_cast_member"}},{"kind":"Field","name":{"kind":"Name","value":"schema_issue_number"}},{"kind":"Field","name":{"kind":"Name","value":"schema_credit_text"}},{"kind":"Field","name":{"kind":"Name","value":"schema_copyright_notice"}},{"kind":"Field","name":{"kind":"Name","value":"schema_abstract"}},{"kind":"Field","name":{"kind":"Name","value":"bibframe_edition"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ebucoreSynopses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ebucore_synopsis"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"schema_number_of_pages"},"name":{"kind":"Name","value":"ha_des_number_of_pages"}},{"kind":"Field","alias":{"kind":"Name","value":"premis_is_part_of"},"name":{"kind":"Name","value":"relation_is_part_of"}},{"kind":"Field","name":{"kind":"Name","value":"rights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reuse_label"}},{"kind":"Field","name":{"kind":"Name","value":"reuse_category_id"}},{"kind":"Field","name":{"kind":"Name","value":"ha_des_license_distributor"}},{"kind":"Field","name":{"kind":"Name","value":"reuse_category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"group"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_request_form"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasPreference"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ha_pref"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getDctermsFormat"},"name":{"kind":"Name","value":"graph__dcterms_format"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getHasCarrier"},"name":{"kind":"Name","value":"graph_carrier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"premis_medium"}},{"kind":"Field","name":{"kind":"Name","value":"schema_width"}},{"kind":"Field","name":{"kind":"Name","value":"schema_height"}},{"kind":"Field","name":{"kind":"Name","value":"bibframe_production_method"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"digitization_date"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getHasPart"},"name":{"kind":"Name","value":"graph_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"relation_is_part_of"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_position"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_position"}},{"kind":"Field","name":{"kind":"Name","value":"schemaMentions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"highlights"},"value":{"kind":"ObjectValue","fields":[]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"highlights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_birth_date"}},{"kind":"Field","name":{"kind":"Name","value":"schema_birth_place"}},{"kind":"Field","name":{"kind":"Name","value":"schema_death_date"}},{"kind":"Field","name":{"kind":"Name","value":"schema_death_place"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"isRepresentedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schemaTranscriptUrls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"hasMediaFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"has_captionings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"premis_original_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getIsPartOf"},"name":{"kind":"Name","value":"graph__intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isPartOf"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_is_part_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"schema_number_of_pages"}},{"kind":"Field","name":{"kind":"Name","value":"schema_position"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"schema_creator"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_medium"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"schema_license"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created"}},{"kind":"Field","name":{"kind":"Name","value":"meemoo_local_id"}},{"kind":"Field","name":{"kind":"Name","value":"premis_is_part_of"}},{"kind":"Field","name":{"kind":"Name","value":"bibframe_edition"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_request_form"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasPreference"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ha_pref"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaInLanguage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaKeywords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_keywords"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"premis_identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaGenre"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_genre"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaSpatial"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_spatial"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaPublisher"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_publisher_array"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaTemporal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_temporal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaCopyrightHolder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_copyright_holder"}}]}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_issue_number"}},{"kind":"Field","name":{"kind":"Name","value":"mhFragmentIdentifier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mh_fragment_identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schema_credit_text"}},{"kind":"Field","name":{"kind":"Name","value":"schema_copyright_notice"}},{"kind":"Field","name":{"kind":"Name","value":"hasCarrier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"premis_medium"}},{"kind":"Field","name":{"kind":"Name","value":"schema_width"}},{"kind":"Field","name":{"kind":"Name","value":"schema_height"}},{"kind":"Field","name":{"kind":"Name","value":"bibframe_production_method"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"digitization_date"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schema_abstract"}},{"kind":"Field","name":{"kind":"Name","value":"schemaAlternateName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_alternate_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"bibframe_edition"}},{"kind":"Field","name":{"kind":"Name","value":"ebucoreSynopses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ebucore_synopsis"}}]}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getIsRepresentedBy"},"name":{"kind":"Name","value":"graph_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_position"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_position"}},{"kind":"Field","name":{"kind":"Name","value":"isRepresentedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schemaTranscriptUrls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"hasMediaFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"has_captionings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"premis_original_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getMeemooLocalId"},"name":{"kind":"Name","value":"graph_premis_identifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"primary","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"meemoo_local_id"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getMhFragmentIdentifier"},"name":{"kind":"Name","value":"graph_mh_fragment_identifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mh_fragment_identifier"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getParentCollection"},"name":{"kind":"Name","value":"graph_schema_is_part_of"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"collection_type"}},{"kind":"Field","name":{"kind":"Name","value":"isPreceededBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isSucceededBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schema_location_created"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_date"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_date"}},{"kind":"Field","name":{"kind":"Name","value":"schema_publisher"}},{"kind":"Field","name":{"kind":"Name","value":"schema_season_number"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getSchemaAlternateName"},"name":{"kind":"Name","value":"graph_schema_alternate_name"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_alternate_name"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getSchemaCopyrightHolder"},"name":{"kind":"Name","value":"graph_schema_copyright_holder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_copyright_holder"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getSchemaCreator"},"name":{"kind":"Name","value":"graph__schema_creator"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_creator_array"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getSchemaDuration"},"name":{"kind":"Name","value":"graph__schema_duration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getSchemaGenre"},"name":{"kind":"Name","value":"graph_schema_genre"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_genre"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getSchemaInLanguage"},"name":{"kind":"Name","value":"graph_schema_in_language"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getSchemaKeywords"},"name":{"kind":"Name","value":"graph_schema_keywords"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_keywords"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getSchemaLicense"},"name":{"kind":"Name","value":"graph_schema_license"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getSchemaMedium"},"name":{"kind":"Name","value":"graph__premis_medium"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"premis_medium"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getSchemaPublisher"},"name":{"kind":"Name","value":"graph__schema_publisher"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_publisher_array"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getSchemaSpatial"},"name":{"kind":"Name","value":"graph_schema_spatial"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_spatial"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getSchemaTemporal"},"name":{"kind":"Name","value":"graph_schema_temporal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_temporal"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getSchemaThumbnailUrl"},"name":{"kind":"Name","value":"graph__schema_thumbnail_url"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getThemes"},"name":{"kind":"Name","value":"app_theme"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"ieObjectLinks"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"ieObjectLinks_aggregate"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"count"},"value":{"kind":"EnumValue","value":"desc"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name_nl"}},{"kind":"Field","name":{"kind":"Name","value":"name_en"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_nl"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_en"}},{"kind":"Field","name":{"kind":"Name","value":"ieObjectLinks_aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetIeObjectDetailQuery, GetIeObjectDetailQueryVariables>;
export const GetIeObjectForThumbnailUrlOnlyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getIeObjectForThumbnailUrlOnly"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"schemaThumbnailUrl"},"name":{"kind":"Name","value":"graph__schema_thumbnail_url"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"schemaLicense"},"name":{"kind":"Name","value":"graph_schema_license"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"ieObject"},"name":{"kind":"Name","value":"graph_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}}]}}]}}]}}]} as unknown as DocumentNode<GetIeObjectForThumbnailUrlOnlyQuery, GetIeObjectForThumbnailUrlOnlyQueryVariables>;
export const GetIeObjectIdBySchemaIdentifierDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getIeObjectIdBySchemaIdentifier"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schemaIdentifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schemaIdentifier"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}}]}}]}}]} as unknown as DocumentNode<GetIeObjectIdBySchemaIdentifierQuery, GetIeObjectIdBySchemaIdentifierQueryVariables>;
export const GetIeObjectPlayableDisplayDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getIeObjectPlayableDisplayData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"ieObject"},"name":{"kind":"Name","value":"graph_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreference"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ha_pref"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"schemaThumbnailUrl"},"name":{"kind":"Name","value":"graph__schema_thumbnail_url"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"schemaLicense"},"name":{"kind":"Name","value":"graph_schema_license"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getHasPart"},"name":{"kind":"Name","value":"graph_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"relation_is_part_of"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_position"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isRepresentedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"hasMediaFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}}]}}]}}]}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"getIsRepresentedBy"},"name":{"kind":"Name","value":"graph__intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isRepresentedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"hasMediaFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetIeObjectPlayableDisplayDataQuery, GetIeObjectPlayableDisplayDataQueryVariables>;
export const GetIeObjectV3InfoFromMediaMosaIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getIeObjectV3InfoFromMediaMosaId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mediaMosaId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nvdgo_mediamosa_assets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"asset_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mediaMosaId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ieObject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}}]}}]}}]}}]} as unknown as DocumentNode<GetIeObjectV3InfoFromMediaMosaIdQuery, GetIeObjectV3InfoFromMediaMosaIdQueryVariables>;
export const GetMentionsByFileIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMentionsByFileId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_file"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"has_annotations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"annotation_type"}},{"kind":"Field","name":{"kind":"Name","value":"annotation_confidence"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}},{"kind":"Field","name":{"kind":"Name","value":"has_annotation_related_artefact_thing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"wiki_id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"is_annotated_media_resource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start_offset"}},{"kind":"Field","name":{"kind":"Name","value":"end_offset"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMentionsByFileIdQuery, GetMentionsByFileIdQueryVariables>;
export const GetParentIeObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getParentIeObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currentObjectIri"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currentObjectIri"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"dctermsFormat"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"dcterms_format"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"videofragment","block":false},{"kind":"StringValue","value":"audiofragment","block":false}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isPartOf"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaDuration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetParentIeObjectQuery, GetParentIeObjectQueryVariables>;
export const GetPreviousNextIeObjectIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPreviousNextIeObjectIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectIri"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph__intellectual_entity_prev_and_next"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"collection_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectIri"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"previousIeObject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextIeObject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}}]}}]}}]}}]} as unknown as DocumentNode<GetPreviousNextIeObjectIdsQuery, GetPreviousNextIeObjectIdsQueryVariables>;
export const GetReusabilityRightsIrisDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getReusabilityRightsIris"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_rights"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"reuse_category_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectual_entity_id"}}]}}]}}]} as unknown as DocumentNode<GetReusabilityRightsIrisQuery, GetReusabilityRightsIrisQueryVariables>;
export const GetVideoFileByRepresentationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getVideoFileByRepresentationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"representationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_includes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"representation_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"representationId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"file"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"ebucore_has_mime_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"video/mp4","block":false},{"kind":"StringValue","value":"application/mp4","block":false},{"kind":"StringValue","value":"video/ogv","block":false},{"kind":"StringValue","value":"video/webm","block":false},{"kind":"StringValue","value":"video/m3u8","block":false},{"kind":"StringValue","value":"application/vnd.apple.mpegurl","block":false}]}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}}]}}]}}]}}]} as unknown as DocumentNode<GetVideoFileByRepresentationIdQuery, GetVideoFileByRepresentationIdQueryVariables>;
export const GetVisitRequestForAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getVisitRequestForAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maintainerOrId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space_request"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"visitor_space"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_maintainer_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maintainerOrId"}}}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"start_date"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"end_date"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"APPROVED","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetVisitRequestForAccessQuery, GetVisitRequestForAccessQueryVariables>;
export const CountUnreadMaterialRequestMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"countUnreadMaterialRequestMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_request_message_unread_status_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"receiver_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profileId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"material_request_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<CountUnreadMaterialRequestMessagesQuery, CountUnreadMaterialRequestMessagesQueryVariables>;
export const DeleteMessageUnreadEntriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteMessageUnreadEntries"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_app_material_request_message_unread_status"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"material_request_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"receiver_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profileId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<DeleteMessageUnreadEntriesMutation, DeleteMessageUnreadEntriesMutationVariables>;
export const GetEvaluatorsForOrganisationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getEvaluatorsForOrganisation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organisationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_profile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_evaluator"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"organisation"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"org_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organisationId"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"is_evaluator"}},{"kind":"Field","name":{"kind":"Name","value":"is_key_user"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"organisation_schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_tos_at"}},{"kind":"Field","name":{"kind":"Name","value":"last_access_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetEvaluatorsForOrganisationQuery, GetEvaluatorsForOrganisationQueryVariables>;
export const GetMaterialRequestAttachmentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMaterialRequestAttachmentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"attachmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_request_messages_attachments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"attachmentId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"messages_and_event"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"material_request_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attachment_url"}},{"kind":"Field","name":{"kind":"Name","value":"attachment_filename"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<GetMaterialRequestAttachmentByIdQuery, GetMaterialRequestAttachmentByIdQueryVariables>;
export const GetMaterialRequestAttachmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMaterialRequestAttachments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_material_request_messages_attachments_order_by"}}}},"defaultValue":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_request_messages_attachments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"messages_and_event"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"material_request_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attachment_url"}},{"kind":"Field","name":{"kind":"Name","value":"attachment_filename"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"app_material_request_messages_attachments_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"messages_and_event"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"material_request_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetMaterialRequestAttachmentsQuery, GetMaterialRequestAttachmentsQueryVariables>;
export const GetMaterialRequestMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMaterialRequestMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_request_messages_and_events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"material_request_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"desc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"message_type"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"sender_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attachment_url"}},{"kind":"Field","name":{"kind":"Name","value":"attachment_filename"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"material_request_id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"app_material_request_messages_and_events_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"material_request_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetMaterialRequestMessagesQuery, GetMaterialRequestMessagesQueryVariables>;
export const GetUnreadMessageCountsPerUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUnreadMessageCountsPerUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_request_message_unread_counts_per_user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"receiver_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"outgoing_count"}},{"kind":"Field","name":{"kind":"Name","value":"incoming_count"}}]}}]}}]} as unknown as DocumentNode<GetUnreadMessageCountsPerUserQuery, GetUnreadMessageCountsPerUserQueryVariables>;
export const GetUnreadMessageOverviewForProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUnreadMessageOverviewForProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"profileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_request_message_unread_overview"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"receiver_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"profileId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"material_request_id"}},{"kind":"Field","name":{"kind":"Name","value":"is_outgoing"}}]}}]}}]} as unknown as DocumentNode<GetUnreadMessageOverviewForProfileQuery, GetUnreadMessageOverviewForProfileQueryVariables>;
export const InsertMaterialRequestMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertMaterialRequestMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"senderProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"lookup_app_material_request_message_type_enum"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"jsonb"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"attachments"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_material_request_messages_attachments_insert_input"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_material_request_messages_and_events_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"material_request_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"sender_profile_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"senderProfileId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"message_type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"attachments"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"attachments"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdAt"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"message_type"}},{"kind":"Field","name":{"kind":"Name","value":"sender_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attachment_url"}},{"kind":"Field","name":{"kind":"Name","value":"attachment_filename"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<InsertMaterialRequestMessageMutation, InsertMaterialRequestMessageMutationVariables>;
export const InsertMaterialRequestMessageUnreadStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InsertMaterialRequestMessageUnreadStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"material_request_message_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"receiver_profile_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"material_request_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_material_request_message_unread_status"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"material_request_message_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"material_request_message_id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"receiver_profile_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"receiver_profile_id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"material_request_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"material_request_id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}},{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"material_request_message_id"}},{"kind":"Field","name":{"kind":"Name","value":"receiver_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"is_unread"}},{"kind":"Field","name":{"kind":"Name","value":"material_request_id"}}]}}]}}]}}]} as unknown as DocumentNode<InsertMaterialRequestMessageUnreadStatusMutation, InsertMaterialRequestMessageUnreadStatusMutationVariables>;
export const DeleteMaterialRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteMaterialRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_app_material_requests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_pending"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<DeleteMaterialRequestMutation, DeleteMaterialRequestMutationVariables>;
export const FindMaintainersWithMaterialRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findMaintainersWithMaterialRequests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_organisations_with_material_requests"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"organization_slug"}}]}}]}}]} as unknown as DocumentNode<FindMaintainersWithMaterialRequestsQuery, FindMaintainersWithMaterialRequestsQueryVariables>;
export const FindMaterialRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findMaterialRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"app_material_requests_bool_exp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_material_requests_order_by"}}}},"defaultValue":{"kind":"ListValue","values":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_requests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"requested_at"}},{"kind":"Field","name":{"kind":"Name","value":"is_pending"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"download_status"}},{"kind":"Field","name":{"kind":"Name","value":"download_available_at"}},{"kind":"Field","name":{"kind":"Name","value":"requester_capacity"}},{"kind":"Field","name":{"kind":"Name","value":"organisation_name"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_representation_id"}},{"kind":"Field","name":{"kind":"Name","value":"objectRepresentation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schemaTranscriptUrls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"hasMediaFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request_reuse_form_values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"app_material_requests_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<FindMaterialRequestsQuery, FindMaterialRequestsQueryVariables>;
export const FindMaterialRequestsByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findMaterialRequestsById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_requests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"requested_at"}},{"kind":"Field","name":{"kind":"Name","value":"messages_and_events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"message_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"MESSAGE"}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"message_type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"sender_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"is_pending"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"download_status"}},{"kind":"Field","name":{"kind":"Name","value":"download_available_at"}},{"kind":"Field","name":{"kind":"Name","value":"requester_capacity"}},{"kind":"Field","name":{"kind":"Name","value":"organisation_name"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_representation_id"}},{"kind":"Field","name":{"kind":"Name","value":"objectRepresentation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schemaTranscriptUrls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"hasMediaFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request_reuse_form_values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<FindMaterialRequestsByIdQuery, FindMaterialRequestsByIdQueryVariables>;
export const FindMaterialRequestsReadyToArchiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findMaterialRequestsReadyToArchive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expirationDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_requests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_archived"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"messages_and_events"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"message_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"FINAL_SUMMARY"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expirationDate"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"requested_at"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages_and_events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message_type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"attachments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attachment_url"}},{"kind":"Field","name":{"kind":"Name","value":"attachment_filename"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindMaterialRequestsReadyToArchiveQuery, FindMaterialRequestsReadyToArchiveQueryVariables>;
export const FindMaterialRequestsStatusByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findMaterialRequestsStatusById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_requests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"messages_and_events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"message_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"MESSAGE"}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"message_type"}},{"kind":"Field","name":{"kind":"Name","value":"body"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"download_status"}}]}}]}}]} as unknown as DocumentNode<FindMaterialRequestsStatusByIdQuery, FindMaterialRequestsStatusByIdQueryVariables>;
export const FindMaterialRequestsWithAlmostExpiredDownloadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findMaterialRequestsWithAlmostExpiredDownload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"warningDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_requests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"APPROVED"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"download_status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"SUCCEEDED"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"download_available_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"warningDate"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"download_expiry_warning_email_sent"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"requested_at"}},{"kind":"Field","name":{"kind":"Name","value":"is_pending"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"download_status"}},{"kind":"Field","name":{"kind":"Name","value":"download_available_at"}},{"kind":"Field","name":{"kind":"Name","value":"requester_capacity"}},{"kind":"Field","name":{"kind":"Name","value":"organisation_name"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_representation_id"}},{"kind":"Field","name":{"kind":"Name","value":"objectRepresentation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schemaTranscriptUrls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"hasMediaFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request_reuse_form_values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<FindMaterialRequestsWithAlmostExpiredDownloadQuery, FindMaterialRequestsWithAlmostExpiredDownloadQueryVariables>;
export const FindMaterialRequestsWithExpiredDownloadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findMaterialRequestsWithExpiredDownload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expirationDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_requests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"APPROVED"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"download_status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"SUCCEEDED"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"download_available_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expirationDate"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"requested_at"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"is_pending"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"download_status"}},{"kind":"Field","name":{"kind":"Name","value":"download_available_at"}},{"kind":"Field","name":{"kind":"Name","value":"requester_capacity"}},{"kind":"Field","name":{"kind":"Name","value":"organisation_name"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_representation_id"}},{"kind":"Field","name":{"kind":"Name","value":"objectRepresentation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schemaTranscriptUrls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"hasMediaFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request_reuse_form_values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<FindMaterialRequestsWithExpiredDownloadQuery, FindMaterialRequestsWithExpiredDownloadQueryVariables>;
export const FindMaterialRequestsWithUnresolvedAdditionalConditionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findMaterialRequestsWithUnresolvedAdditionalConditions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reminderDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_requests_with_pending_additional_conditions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"messages_and_events"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"message_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"ADDITIONAL_CONDITIONS"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reminderDate"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"requested_at"}},{"kind":"Field","name":{"kind":"Name","value":"is_pending"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"download_status"}},{"kind":"Field","name":{"kind":"Name","value":"download_available_at"}},{"kind":"Field","name":{"kind":"Name","value":"requester_capacity"}},{"kind":"Field","name":{"kind":"Name","value":"organisation_name"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_representation_id"}},{"kind":"Field","name":{"kind":"Name","value":"objectRepresentation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schemaTranscriptUrls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"hasMediaFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request_reuse_form_values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<FindMaterialRequestsWithUnresolvedAdditionalConditionsQuery, FindMaterialRequestsWithUnresolvedAdditionalConditionsQueryVariables>;
export const FindMaterialRequestsWithUnresolvedDownloadStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findMaterialRequestsWithUnresolvedDownloadStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_requests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"EnumValue","value":"APPROVED"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"download_status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"NEW"},{"kind":"EnumValue","value":"PENDING"}]}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"download_status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"download_url"}},{"kind":"Field","name":{"kind":"Name","value":"download_job_id"}},{"kind":"Field","name":{"kind":"Name","value":"download_retries"}},{"kind":"Field","name":{"kind":"Name","value":"download_status"}},{"kind":"Field","name":{"kind":"Name","value":"download_expiry_warning_email_sent"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_representation_id"}},{"kind":"Field","name":{"kind":"Name","value":"profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request_reuse_form_values"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"key"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"downloadQuality","block":false},{"kind":"StringValue","value":"startTime","block":false},{"kind":"StringValue","value":"endTime","block":false},{"kind":"StringValue","value":"durationType","block":false}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<FindMaterialRequestsWithUnresolvedDownloadStatusQuery, FindMaterialRequestsWithUnresolvedDownloadStatusQueryVariables>;
export const GetMaterialRequestByJobIdForDownloadJobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMaterialRequestByJobIdForDownloadJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"jobIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_requests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"download_job_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"jobIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"download_job_id"}},{"kind":"Field","name":{"kind":"Name","value":"download_retries"}},{"kind":"Field","name":{"kind":"Name","value":"download_status"}},{"kind":"Field","name":{"kind":"Name","value":"download_url"}},{"kind":"Field","name":{"kind":"Name","value":"download_expiry_warning_email_sent"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_representation_id"}},{"kind":"Field","name":{"kind":"Name","value":"profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request_reuse_form_values"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"key"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"downloadQuality","block":false},{"kind":"StringValue","value":"startTime","block":false},{"kind":"StringValue","value":"endTime","block":false},{"kind":"StringValue","value":"durationType","block":false}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<GetMaterialRequestByJobIdForDownloadJobQuery, GetMaterialRequestByJobIdForDownloadJobQueryVariables>;
export const GetMaterialRequestForDownloadJobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMaterialRequestForDownloadJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_material_requests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"download_job_id"}},{"kind":"Field","name":{"kind":"Name","value":"download_retries"}},{"kind":"Field","name":{"kind":"Name","value":"download_status"}},{"kind":"Field","name":{"kind":"Name","value":"download_url"}},{"kind":"Field","name":{"kind":"Name","value":"download_expiry_warning_email_sent"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_representation_id"}},{"kind":"Field","name":{"kind":"Name","value":"profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request_reuse_form_values"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"key"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"downloadQuality","block":false},{"kind":"StringValue","value":"startTime","block":false},{"kind":"StringValue","value":"endTime","block":false},{"kind":"StringValue","value":"durationType","block":false}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<GetMaterialRequestForDownloadJobQuery, GetMaterialRequestForDownloadJobQueryVariables>;
export const InsertMaterialRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertMaterialRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newMaterialRequest"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_material_requests_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_material_requests_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newMaterialRequest"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"requested_at"}},{"kind":"Field","name":{"kind":"Name","value":"messages_and_events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"message_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"MESSAGE"}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message_type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"sender_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"is_pending"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"requester_capacity"}},{"kind":"Field","name":{"kind":"Name","value":"organisation_name"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"download_status"}},{"kind":"Field","name":{"kind":"Name","value":"download_available_at"}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_representation_id"}},{"kind":"Field","name":{"kind":"Name","value":"objectRepresentation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schemaTranscriptUrls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"hasMediaFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request_reuse_form_values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<InsertMaterialRequestMutation, InsertMaterialRequestMutationVariables>;
export const InsertMaterialRequestReuseFormDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertMaterialRequestReuseForm"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keyValues"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_material_request_reuse_form_values_insert_input"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_material_request_reuse_form_values"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keyValues"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"material_request_id"}}]}}]}}]}}]} as unknown as DocumentNode<InsertMaterialRequestReuseFormMutation, InsertMaterialRequestReuseFormMutationVariables>;
export const UpdateMaterialRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMaterialRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestFields"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"app_material_requests_set_input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_material_requests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestFields"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"requested_at"}},{"kind":"Field","name":{"kind":"Name","value":"messages_and_events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"message_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"MESSAGE"}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message_type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"sender_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"is_pending"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"requester_capacity"}},{"kind":"Field","name":{"kind":"Name","value":"organisation_name"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"download_status"}},{"kind":"Field","name":{"kind":"Name","value":"download_retries"}},{"kind":"Field","name":{"kind":"Name","value":"download_available_at"}},{"kind":"Field","name":{"kind":"Name","value":"download_job_id"}},{"kind":"Field","name":{"kind":"Name","value":"download_expiry_warning_email_sent"}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_representation_id"}},{"kind":"Field","name":{"kind":"Name","value":"objectRepresentation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schemaTranscriptUrls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"hasMediaFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request_reuse_form_values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateMaterialRequestMutation, UpdateMaterialRequestMutationVariables>;
export const UpdateMaterialRequestForUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMaterialRequestForUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateMaterialRequest"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"app_material_requests_set_input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_app_material_request_reuse_form_values"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"material_request_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","name":{"kind":"Name","value":"update_app_material_requests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateMaterialRequest"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"requested_at"}},{"kind":"Field","name":{"kind":"Name","value":"messages_and_events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"message_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"MESSAGE"}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message_type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"sender_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"is_pending"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"download_status"}},{"kind":"Field","name":{"kind":"Name","value":"download_available_at"}},{"kind":"Field","name":{"kind":"Name","value":"requester_capacity"}},{"kind":"Field","name":{"kind":"Name","value":"organisation_name"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_representation_id"}},{"kind":"Field","name":{"kind":"Name","value":"objectRepresentation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schemaTranscriptUrls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"hasMediaFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request_reuse_form_values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateMaterialRequestForUserMutation, UpdateMaterialRequestForUserMutationVariables>;
export const UpdateMaterialRequestStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMaterialRequestStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateMaterialRequest"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"app_material_requests_set_input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_material_requests_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"materialRequestId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateMaterialRequest"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"requested_at"}},{"kind":"Field","name":{"kind":"Name","value":"messages_and_events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"message_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_nin"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"MESSAGE"}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message_type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"sender_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"is_pending"}},{"kind":"Field","name":{"kind":"Name","value":"is_archived"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"download_status"}},{"kind":"Field","name":{"kind":"Name","value":"download_available_at"}},{"kind":"Field","name":{"kind":"Name","value":"requester_capacity"}},{"kind":"Field","name":{"kind":"Name","value":"organisation_name"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"premisIdentifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ie_object_representation_id"}},{"kind":"Field","name":{"kind":"Name","value":"objectRepresentation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schemaTranscriptUrls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_has_mime_type"}},{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"edm_is_next_in_sequence"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"hasMediaFragment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_start_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_end_time"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request_reuse_form_values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateMaterialRequestStatusMutation, UpdateMaterialRequestStatusMutationVariables>;
export const GetFileStoredAtByIeObjectIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getFileStoredAtByIeObjectId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_representation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"premis_represents"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"includes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"file"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"ebucore_has_mime_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"video/mp4","block":false},{"kind":"StringValue","value":"application/mp4","block":false},{"kind":"StringValue","value":"video/ogv","block":false},{"kind":"StringValue","value":"video/webm","block":false},{"kind":"StringValue","value":"video/m3u8","block":false},{"kind":"StringValue","value":"application/vnd.apple.mpegurl","block":false}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetFileStoredAtByIeObjectIdQuery, GetFileStoredAtByIeObjectIdQueryVariables>;
export const GetFileStoredAtByRepresentationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getFileStoredAtByRepresentationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"representationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_includes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"representation_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"representationId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"file"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"ebucore_has_mime_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"video/mp4","block":false},{"kind":"StringValue","value":"application/mp4","block":false},{"kind":"StringValue","value":"video/ogv","block":false},{"kind":"StringValue","value":"video/webm","block":false},{"kind":"StringValue","value":"video/m3u8","block":false},{"kind":"StringValue","value":"application/vnd.apple.mpegurl","block":false},{"kind":"StringValue","value":"audio/mp4","block":false},{"kind":"StringValue","value":"audio/m4a","block":false},{"kind":"StringValue","value":"audio/mpeg","block":false}]}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"premis_stored_at"}}]}}]}}]}}]} as unknown as DocumentNode<GetFileStoredAtByRepresentationIdQuery, GetFileStoredAtByRepresentationIdQueryVariables>;
export const GetMhIdentifiersFromPartialMhIdentifierDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMhIdentifiersFromPartialMhIdentifier"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"partialMhIdentifierStartsWith"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_mh_fragment_identifier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"mh_fragment_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"partialMhIdentifierStartsWith"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mh_fragment_identifier"}}]}}]}}]} as unknown as DocumentNode<GetMhIdentifiersFromPartialMhIdentifierQuery, GetMhIdentifiersFromPartialMhIdentifierQueryVariables>;
export const GetNewspaperTitlesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNewspaperTitles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph__newspaper_public_content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"distinct_on"},"value":{"kind":"EnumValue","value":"schema_name"}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_name"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}}]}}]}}]} as unknown as DocumentNode<GetNewspaperTitlesQuery, GetNewspaperTitlesQueryVariables>;
export const DeleteNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_notification_bool_exp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_app_notification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<DeleteNotificationsMutation, DeleteNotificationsMutationVariables>;
export const FindNotificationsByUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findNotificationsByUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"moreRecentThan"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_notification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"recipient"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moreRecentThan"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"READ","block":false}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"recipient"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"UNREAD","block":false}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"desc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}},{"kind":"Field","name":{"kind":"Name","value":"linked_entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space_request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer_id"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"app_notification_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"recipient"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"moreRecentThan"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"READ","block":false}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"recipient"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"UNREAD","block":false}}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<FindNotificationsByUserQuery, FindNotificationsByUserQueryVariables>;
export const InsertNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objects"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_notification_insert_input"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_notification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objects"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}},{"kind":"Field","name":{"kind":"Name","value":"linked_entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space_request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cp_space_id"}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer_id"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<InsertNotificationsMutation, InsertNotificationsMutationVariables>;
export const UpdateAllNotificationsForUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateAllNotificationsForUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notification"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"app_notification_set_input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_notification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"recipient"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notification"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<UpdateAllNotificationsForUserMutation, UpdateAllNotificationsForUserMutationVariables>;
export const UpdateNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notificationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notification"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"app_notification_set_input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_notification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notificationId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"recipient"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notification"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"}},{"kind":"Field","name":{"kind":"Name","value":"linked_entity_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space_request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cp_space_id"}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer_id"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"material_request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateNotificationMutation, UpdateNotificationMutationVariables>;
export const FindOrganisationSlugsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findOrganisationSlugs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"maintainer_organization_slug_bool_exp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"maintainer_organization_slug_order_by"}}}},"defaultValue":{"kind":"ListValue","values":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_organization_slug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"maintainer_organization_slug_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<FindOrganisationSlugsQuery, FindOrganisationSlugsQueryVariables>;
export const FindOrganisationsBySchemaIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findOrganisationsBySchemaIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schemaIdentifiers"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"org_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schemaIdentifiers"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_request_form"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}}]} as unknown as DocumentNode<FindOrganisationsBySchemaIdsQuery, FindOrganisationsBySchemaIdsQueryVariables>;
export const GetOrganisationBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrganisationBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"organizationSlug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_request_form"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrganisationBySlugQuery, GetOrganisationBySlugQueryVariables>;
export const GetOrganisationsThatHaveObjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrganisationsThatHaveObjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_organisations_with_objects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"organization_slug"}}]}}]}}]} as unknown as DocumentNode<GetOrganisationsThatHaveObjectsQuery, GetOrganisationsThatHaveObjectsQueryVariables>;
export const UpdateOrganisationSlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateOrganisationSlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"org_identifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_maintainer_organization_slug"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"org_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"org_identifier"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateOrganisationSlugMutation, UpdateOrganisationSlugMutationVariables>;
export const GetSitemapConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSitemapConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_config"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"SITEMAP_CONFIG","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<GetSitemapConfigQuery, GetSitemapConfigQueryVariables>;
export const CreateSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createSpace"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"maintainer_visitor_space_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_maintainer_visitor_space_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createSpace"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateSpaceMutation, CreateSpaceMutationVariables>;
export const FindSpaceByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findSpaceById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindSpaceByIdQuery, FindSpaceByIdQueryVariables>;
export const FindSpaceByOrganisationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findSpaceByOrganisationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organisationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_maintainer_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organisationId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindSpaceByOrganisationIdQuery, FindSpaceByOrganisationIdQueryVariables>;
export const FindSpaceBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findSpaceBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"organisation"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"organizationSlug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindSpaceBySlugQuery, FindSpaceBySlugQueryVariables>;
export const FindSpacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findSpaces"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"maintainer_visitor_space_bool_exp"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"maintainer_visitor_space_order_by"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<FindSpacesQuery, FindSpacesQueryVariables>;
export const GetVisitorSpaceCpAdminProfilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getVisitorSpaceCpAdminProfiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"spaceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"spaceId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profiles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"group"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"CP_ADMIN","block":false}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]}}]} as unknown as DocumentNode<GetVisitorSpaceCpAdminProfilesQuery, GetVisitorSpaceCpAdminProfilesQueryVariables>;
export const UpdateSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateSpace"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"maintainer_visitor_space_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_maintainer_visitor_space_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateSpace"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSpaceMutation, UpdateSpaceMutationVariables>;
export const GetFirstObjectIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getFirstObjectId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"graph_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}}]}}]}}]} as unknown as DocumentNode<GetFirstObjectIdQuery, GetFirstObjectIdQueryVariables>;
export const DeleteIeObjectFromThemeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteIeObjectFromTheme"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"themeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_app_theme_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"theme_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"themeId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"intellectual_entity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ieObjectId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<DeleteIeObjectFromThemeMutation, DeleteIeObjectFromThemeMutationVariables>;
export const DeleteThemeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteTheme"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"themeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_app_theme_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"themeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteThemeMutation, DeleteThemeMutationVariables>;
export const GetIeObjectsInThemeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getIeObjectsInTheme"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectsLimit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_theme"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name_nl"}},{"kind":"Field","name":{"kind":"Name","value":"name_en"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"ieObjectLinksRandomOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectsLimit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ieObject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetIeObjectsInThemeQuery, GetIeObjectsInThemeQueryVariables>;
export const GetThemeWithObjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getThemeWithObjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"themeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_theme_intellectual_entity_order_by"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_theme_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"themeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name_nl"}},{"kind":"Field","name":{"kind":"Name","value":"name_en"}},{"kind":"Field","name":{"kind":"Name","value":"description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"description_en"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_nl"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_en"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"ieObjectLinks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ieObject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ieObjectLinks_aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetThemeWithObjectsQuery, GetThemeWithObjectsQueryVariables>;
export const GetThemeWithObjectsInRandomOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getThemeWithObjectsInRandomOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"themeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectsLimit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_theme_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"themeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name_nl"}},{"kind":"Field","name":{"kind":"Name","value":"name_en"}},{"kind":"Field","name":{"kind":"Name","value":"description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"description_en"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_nl"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_en"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"ieObjectLinksRandomOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectsLimit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"random_sort"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ieObject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schemaNames"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_ai_generated"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"is_ai_generated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dctermsFormat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaThumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaLicense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_license"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"ieObjectLinks_aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetThemeWithObjectsInRandomOrderQuery, GetThemeWithObjectsInRandomOrderQueryVariables>;
export const GetThemesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getThemes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_theme_order_by"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_theme"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name_nl"}},{"kind":"Field","name":{"kind":"Name","value":"name_en"}},{"kind":"Field","name":{"kind":"Name","value":"description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"description_en"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_nl"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_en"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"app_theme_aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetThemesQuery, GetThemesQueryVariables>;
export const GetThemesByIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getThemesByIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_theme"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name_nl"}},{"kind":"Field","name":{"kind":"Name","value":"name_en"}},{"kind":"Field","name":{"kind":"Name","value":"description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"description_en"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_nl"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_en"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<GetThemesByIdsQuery, GetThemesByIdsQueryVariables>;
export const GetThemesInRandomOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getThemesInRandomOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_theme_random_order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"random_sort"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name_nl"}},{"kind":"Field","name":{"kind":"Name","value":"name_en"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}}]}}]}}]} as unknown as DocumentNode<GetThemesInRandomOrderQuery, GetThemesInRandomOrderQueryVariables>;
export const GetThemesSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getThemesSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_theme_order_by"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_theme"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name_nl"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name_en"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name_nl"}},{"kind":"Field","name":{"kind":"Name","value":"name_en"}},{"kind":"Field","name":{"kind":"Name","value":"description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"description_en"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_nl"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_en"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"app_theme_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name_nl"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name_en"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"searchTerm"}}}]}}]}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<GetThemesSearchQuery, GetThemesSearchQueryVariables>;
export const InsertIeObjectsIntoThemeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertIeObjectsIntoTheme"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objects"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_theme_intellectual_entity_insert_input"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_theme_intellectual_entity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objects"}}},{"kind":"Argument","name":{"kind":"Name","value":"on_conflict"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"constraint"},"value":{"kind":"EnumValue","value":"theme_intellectual_entity_theme_id_intellectual_entity_id_key"}},{"kind":"ObjectField","name":{"kind":"Name","value":"update_columns"},"value":{"kind":"ListValue","values":[]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"theme_id"}},{"kind":"Field","name":{"kind":"Name","value":"intellectual_entity_id"}}]}}]}}]}}]} as unknown as DocumentNode<InsertIeObjectsIntoThemeMutation, InsertIeObjectsIntoThemeMutationVariables>;
export const InsertThemeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertTheme"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_theme_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_app_theme_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"object"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name_nl"}},{"kind":"Field","name":{"kind":"Name","value":"name_en"}},{"kind":"Field","name":{"kind":"Name","value":"description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"description_en"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_nl"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_en"}}]}}]}}]} as unknown as DocumentNode<InsertThemeMutation, InsertThemeMutationVariables>;
export const UpdateThemeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateTheme"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"themeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"theme"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"app_theme_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_app_theme_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"themeId"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"theme"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name_nl"}},{"kind":"Field","name":{"kind":"Name","value":"name_en"}},{"kind":"Field","name":{"kind":"Name","value":"description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"description_en"}},{"kind":"Field","name":{"kind":"Name","value":"image_url"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_nl"}},{"kind":"Field","name":{"kind":"Name","value":"content_page_path_en"}}]}}]}}]} as unknown as DocumentNode<UpdateThemeMutation, UpdateThemeMutationVariables>;
export const GetTosLastUpdatedAtDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getTosLastUpdatedAt"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"app_config_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"TOS_LAST_UPDATED_AT","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetTosLastUpdatedAtQuery, GetTosLastUpdatedAtQueryVariables>;
export const FindProfileLanguagesByIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findProfileLanguagesByIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_profile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}}]}}]}}]} as unknown as DocumentNode<FindProfileLanguagesByIdsQuery, FindProfileLanguagesByIdsQueryVariables>;
export const GetUserByEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserByEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_profile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"mail"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"is_key_user"}},{"kind":"Field","name":{"kind":"Name","value":"is_evaluator"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_tos_at"}},{"kind":"Field","name":{"kind":"Name","value":"last_access_at"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"permission"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"asc"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"identities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identity_provider_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetUserByEmailQuery, GetUserByEmailQueryVariables>;
export const GetUserByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_profile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"is_key_user"}},{"kind":"Field","name":{"kind":"Name","value":"is_evaluator"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_tos_at"}},{"kind":"Field","name":{"kind":"Name","value":"last_access_at"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"permission"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"asc"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"identities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identity_provider_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const GetUserByIdentityIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserByIdentityId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"identityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_profile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"identities"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"identity_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"identityId"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"is_key_user"}},{"kind":"Field","name":{"kind":"Name","value":"is_evaluator"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_tos_at"}},{"kind":"Field","name":{"kind":"Name","value":"last_access_at"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"permission"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"asc"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"identities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identity_provider_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetUserByIdentityIdQuery, GetUserByIdentityIdQueryVariables>;
export const InsertUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newUser"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"users_profile_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_users_profile_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newUser"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"is_key_user"}},{"kind":"Field","name":{"kind":"Name","value":"is_evaluator"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_tos_at"}},{"kind":"Field","name":{"kind":"Name","value":"last_access_at"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"permission"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"asc"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"identities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identity_provider_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<InsertUserMutation, InsertUserMutationVariables>;
export const InsertUserIdentityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertUserIdentity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newUserIdentity"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"users_identity_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_users_identity_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newUserIdentity"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<InsertUserIdentityMutation, InsertUserIdentityMutationVariables>;
export const UpdateUserLanguageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserLanguage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lang"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"lookup_languages_enum"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_users_profile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lang"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<UpdateUserLanguageMutation, UpdateUserLanguageMutationVariables>;
export const UpdateUserLastAccessDateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserLastAccessDate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamptz"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_users_profile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"last_access_at"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<UpdateUserLastAccessDateMutation, UpdateUserLastAccessDateMutationVariables>;
export const UpdateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateUser"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"users_profile_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_users_profile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateUser"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"is_key_user"}},{"kind":"Field","name":{"kind":"Name","value":"is_evaluator"}},{"kind":"Field","name":{"kind":"Name","value":"accepted_tos_at"}},{"kind":"Field","name":{"kind":"Name","value":"last_access_at"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"group_id"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"permission"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"asc"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permission"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"identities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identity_provider_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_sector"}},{"kind":"Field","name":{"kind":"Name","value":"schema_vat_id"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hasSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_street_address"}},{"kind":"Field","name":{"kind":"Name","value":"schema_address_locality"}},{"kind":"Field","name":{"kind":"Name","value":"schema_postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const DeleteVisitFolderAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteVisitFolderAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitRequestId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_maintainer_visitor_space_request_folder_access"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"visit_request_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitRequestId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<DeleteVisitFolderAccessMutation, DeleteVisitFolderAccessMutationVariables>;
export const FindActiveVisitByUserAndSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findActiveVisitByUserAndSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitorSpaceSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space_request"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"APPROVED","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"start_date"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"end_date"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"visitor_space"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"organisation"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"organizationSlug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitorSpaceSlug"}}}]}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cp_space_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_reason"}},{"kind":"Field","name":{"kind":"Name","value":"user_timeframe"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"access_type"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space_request_notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"desc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"last_updated_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer_id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessible_folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindActiveVisitByUserAndSpaceQuery, FindActiveVisitByUserAndSpaceQueryVariables>;
export const FindApprovedAlmostEndedVisitsWithoutNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findApprovedAlmostEndedVisitsWithoutNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"warningDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space_request"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"APPROVED","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"end_date"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"warningDate"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_not"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"notifications"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"ACCESS_PERIOD_VISITOR_SPACE_END_WARNING","block":false}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cp_space_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_reason"}},{"kind":"Field","name":{"kind":"Name","value":"user_timeframe"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"access_type"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"last_updated_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer_id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessible_folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindApprovedAlmostEndedVisitsWithoutNotificationQuery, FindApprovedAlmostEndedVisitsWithoutNotificationQueryVariables>;
export const FindApprovedEndedVisitsWithoutNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findApprovedEndedVisitsWithoutNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space_request"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"APPROVED","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"end_date"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_not"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"notifications"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"ACCESS_PERIOD_VISITOR_SPACE_ENDED","block":false}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cp_space_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_reason"}},{"kind":"Field","name":{"kind":"Name","value":"user_timeframe"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"access_type"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"last_updated_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer_id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessible_folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindApprovedEndedVisitsWithoutNotificationQuery, FindApprovedEndedVisitsWithoutNotificationQueryVariables>;
export const FindApprovedStartedVisitsWithoutNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findApprovedStartedVisitsWithoutNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space_request"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"APPROVED","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"start_date"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"end_date"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_not"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"notifications"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"ACCESS_PERIOD_VISITOR_SPACE_STARTED","block":false}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cp_space_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_reason"}},{"kind":"Field","name":{"kind":"Name","value":"user_timeframe"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"access_type"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"last_updated_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer_id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessible_folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindApprovedStartedVisitsWithoutNotificationQuery, FindApprovedStartedVisitsWithoutNotificationQueryVariables>;
export const FindPendingOrApprovedVisitRequestsForUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findPendingOrApprovedVisitRequestsForUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"spaceSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space_request"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"visitor_space"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"organisation"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"organizationSlug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"spaceSlug"}}}]}}]}}]}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"end_date"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"APPROVED","block":false}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"PENDING","block":false}}]}}]}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"status_info"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"sort_order"},"value":{"kind":"EnumValue","value":"asc"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cp_space_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"access_type"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}}]}}]}}]} as unknown as DocumentNode<FindPendingOrApprovedVisitRequestsForUserQuery, FindPendingOrApprovedVisitRequestsForUserQueryVariables>;
export const FindVisitByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findVisitById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space_request"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cp_space_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_reason"}},{"kind":"Field","name":{"kind":"Name","value":"user_timeframe"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"access_type"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space_request_notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"desc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"last_updated_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer_id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessible_folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindVisitByIdQuery, FindVisitByIdQueryVariables>;
export const FindVisitEndDatesByFolderIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findVisitEndDatesByFolderId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space_request_folder_access"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"folder_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"folderId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"visitor_space_request"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"end_date"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"visitor_space_request"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"end_date"}}]}}]}}]}}]} as unknown as DocumentNode<FindVisitEndDatesByFolderIdQuery, FindVisitEndDatesByFolderIdQueryVariables>;
export const FindVisitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findVisits"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"maintainer_visitor_space_request_bool_exp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"maintainer_visitor_space_request_order_by"}}},"defaultValue":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space_request"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cp_space_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_reason"}},{"kind":"Field","name":{"kind":"Name","value":"user_timeframe"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"access_type"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space_request_notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"desc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer_id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"last_updated_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessible_folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space_request_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<FindVisitsQuery, FindVisitsQueryVariables>;
export const InsertNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"note"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_maintainer_visitor_space_request_note_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"visit_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visitId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"note"},"value":{"kind":"Variable","name":{"kind":"Name","value":"note"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"profile_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<InsertNoteMutation, InsertNoteMutationVariables>;
export const InsertVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newVisit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"maintainer_visitor_space_request_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_maintainer_visitor_space_request_one"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"object"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newVisit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cp_space_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_reason"}},{"kind":"Field","name":{"kind":"Name","value":"user_timeframe"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"access_type"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space_request_notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"desc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"last_updated_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer_id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"organizationSlug"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessible_folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<InsertVisitMutation, InsertVisitMutationVariables>;
export const InsertVisitFolderAccessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertVisitFolderAccess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objects"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"maintainer_visitor_space_request_folder_access_insert_input"}}}},"defaultValue":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_maintainer_visitor_space_request_folder_access"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objects"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<InsertVisitFolderAccessMutation, InsertVisitFolderAccessMutationVariables>;
export const PendingVisitCountForUserBySlugDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"pendingVisitCountForUserBySlug"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}},"defaultValue":{"kind":"StringValue","value":"","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer_visitor_space_request_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"status"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"StringValue","value":"PENDING","block":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"visitor_space"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"organisation"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"organizationSlug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cp_space_id"}}]}}]}}]}}]} as unknown as DocumentNode<PendingVisitCountForUserBySlugQuery, PendingVisitCountForUserBySlugQueryVariables>;
export const UpdateVisitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateVisit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateVisit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"maintainer_visitor_space_request_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_maintainer_visitor_space_request"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateVisit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cp_space_id"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"requested_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ie_object_id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user_reason"}},{"kind":"Field","name":{"kind":"Name","value":"user_timeframe"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"access_type"}},{"kind":"Field","name":{"kind":"Name","value":"start_date"}},{"kind":"Field","name":{"kind":"Name","value":"end_date"}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space_request_notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"desc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"last_updated_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"visitor_space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer_id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_nl"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description_en"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"organisation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"skos_pref_label"}},{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"foaf_homepage"}},{"kind":"Field","name":{"kind":"Name","value":"ha_org_has_logo"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_description"}},{"kind":"Field","name":{"kind":"Name","value":"schemaContactPoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_contact_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_email"}},{"kind":"Field","name":{"kind":"Name","value":"schema_telephone"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessible_folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"intellectualEntity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schemaMaintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"org_identifier"}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateVisitMutation, UpdateVisitMutationVariables>;