import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  _text: any;
  date: any;
  daterange: any;
  json: any;
  jsonb: any;
  time: any;
  timestamp: any;
  timestamptz: any;
  uuid: any;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']>;
  _gt?: InputMaybe<Scalars['Boolean']>;
  _gte?: InputMaybe<Scalars['Boolean']>;
  _in?: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Boolean']>;
  _lte?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type Concept = {
  __typename?: 'Concept';
  alt_label?: Maybe<Scalars['String']>;
  iri: Scalars['ID'];
  label?: Maybe<Scalars['String']>;
};

export type ContactPoint = IContactPoint & {
  __typename?: 'ContactPoint';
  contact_type?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  iri: Scalars['ID'];
  telephone?: Maybe<Scalars['String']>;
};

export type ContentPartner = IOrganization & {
  __typename?: 'ContentPartner';
  account_manager?: Maybe<Person>;
  alt_label?: Maybe<Scalars['String']>;
  bzt?: Maybe<Scalars['Boolean']>;
  classification?: Maybe<Concept>;
  contact_point?: Maybe<Array<Maybe<ContactPoint>>>;
  description?: Maybe<Scalars['String']>;
  homepage?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  iri: Scalars['ID'];
  label?: Maybe<Scalars['String']>;
  logo?: Maybe<Logo>;
  mam_label?: Maybe<Scalars['String']>;
  overlay?: Maybe<Scalars['Boolean']>;
  posts?: Maybe<Array<Maybe<Post>>>;
  primary_site?: Maybe<Site>;
  sites?: Maybe<Array<Maybe<Site>>>;
  units?: Maybe<Array<Maybe<OrganizationalUnit>>>;
};


export type ContentPartnerClassificationArgs = {
  label?: InputMaybe<Scalars['String']>;
};

export type IContactPoint = {
  contact_type?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  iri: Scalars['ID'];
  telephone?: Maybe<Scalars['String']>;
};

export type IOrganization = {
  account_manager?: Maybe<Person>;
  alt_label?: Maybe<Scalars['String']>;
  bzt?: Maybe<Scalars['Boolean']>;
  classification?: Maybe<Concept>;
  contact_point?: Maybe<Array<Maybe<ContactPoint>>>;
  description?: Maybe<Scalars['String']>;
  homepage?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  iri: Scalars['ID'];
  label?: Maybe<Scalars['String']>;
  logo?: Maybe<Logo>;
  mam_label?: Maybe<Scalars['String']>;
  overlay?: Maybe<Scalars['Boolean']>;
  posts?: Maybe<Array<Maybe<Post>>>;
  primary_site?: Maybe<Site>;
  sites?: Maybe<Array<Maybe<Site>>>;
  units?: Maybe<Array<Maybe<OrganizationalUnit>>>;
};


export type IOrganizationClassificationArgs = {
  label?: InputMaybe<Scalars['String']>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

export type Logo = {
  __typename?: 'Logo';
  iri: Scalars['ID'];
  type?: Maybe<Concept>;
};

export type Organization = IOrganization & {
  __typename?: 'Organization';
  account_manager?: Maybe<Person>;
  alt_label?: Maybe<Scalars['String']>;
  bzt?: Maybe<Scalars['Boolean']>;
  classification?: Maybe<Concept>;
  contact_point?: Maybe<Array<Maybe<ContactPoint>>>;
  description?: Maybe<Scalars['String']>;
  homepage?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  iri: Scalars['ID'];
  label?: Maybe<Scalars['String']>;
  logo?: Maybe<Logo>;
  mam_label?: Maybe<Scalars['String']>;
  overlay?: Maybe<Scalars['Boolean']>;
  posts?: Maybe<Array<Maybe<Post>>>;
  primary_site?: Maybe<Site>;
  sites?: Maybe<Array<Maybe<Site>>>;
  units?: Maybe<Array<Maybe<OrganizationalUnit>>>;
};


export type OrganizationClassificationArgs = {
  label?: InputMaybe<Scalars['String']>;
};

export type OrganizationalUnit = IOrganization & {
  __typename?: 'OrganizationalUnit';
  account_manager?: Maybe<Person>;
  alt_label?: Maybe<Scalars['String']>;
  bzt?: Maybe<Scalars['Boolean']>;
  classification?: Maybe<Concept>;
  contact_point?: Maybe<Array<Maybe<ContactPoint>>>;
  description?: Maybe<Scalars['String']>;
  homepage?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  iri: Scalars['ID'];
  label?: Maybe<Scalars['String']>;
  logo?: Maybe<Logo>;
  mam_label?: Maybe<Scalars['String']>;
  overlay?: Maybe<Scalars['Boolean']>;
  posts?: Maybe<Array<Maybe<Post>>>;
  primary_site?: Maybe<Site>;
  sites?: Maybe<Array<Maybe<Site>>>;
  unit_of: Organization;
  units?: Maybe<Array<Maybe<OrganizationalUnit>>>;
};


export type OrganizationalUnitClassificationArgs = {
  label?: InputMaybe<Scalars['String']>;
};

export type Person = {
  __typename?: 'Person';
  account_manager_of?: Maybe<Array<Maybe<Organization>>>;
  email?: Maybe<Scalars['String']>;
  family_name?: Maybe<Scalars['String']>;
  given_name?: Maybe<Scalars['String']>;
  holds?: Maybe<Array<Maybe<Post>>>;
  iri: Scalars['ID'];
  telephone?: Maybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  iri: Scalars['ID'];
  post_in: Array<Maybe<Organization>>;
  role?: Maybe<Concept>;
};

export type PostalAddress = IContactPoint & {
  __typename?: 'PostalAddress';
  contact_type?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  iri: Scalars['ID'];
  locality?: Maybe<Scalars['String']>;
  post_office_box_number?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['String']>;
};

export type School = IOrganization & {
  __typename?: 'School';
  account_manager?: Maybe<Person>;
  alt_label?: Maybe<Scalars['String']>;
  bzt?: Maybe<Scalars['Boolean']>;
  classification?: Maybe<Concept>;
  contact_point?: Maybe<Array<Maybe<ContactPoint>>>;
  description?: Maybe<Scalars['String']>;
  homepage?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  iri: Scalars['ID'];
  label?: Maybe<Scalars['String']>;
  logo?: Maybe<Logo>;
  mam_label?: Maybe<Scalars['String']>;
  overlay?: Maybe<Scalars['Boolean']>;
  posts?: Maybe<Array<Maybe<Post>>>;
  primary_site?: Maybe<Site>;
  sites?: Maybe<Array<Maybe<Site>>>;
  units?: Maybe<Array<Maybe<OrganizationalUnit>>>;
};


export type SchoolClassificationArgs = {
  label?: InputMaybe<Scalars['String']>;
};

export type Site = {
  __typename?: 'Site';
  address?: Maybe<PostalAddress>;
  iri: Scalars['ID'];
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/** Boolean expression to compare columns of type "_text". All fields are combined with logical 'AND'. */
export type _Text_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['_text']>;
  _gt?: InputMaybe<Scalars['_text']>;
  _gte?: InputMaybe<Scalars['_text']>;
  _in?: InputMaybe<Array<Scalars['_text']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['_text']>;
  _lte?: InputMaybe<Scalars['_text']>;
  _neq?: InputMaybe<Scalars['_text']>;
  _nin?: InputMaybe<Array<Scalars['_text']>>;
};

/**
 * Meldingen voor eindgebruikers over bepaalde activiteit
 *
 *
 * columns and relationships of "app.notification"
 *
 */
export type App_Notification = {
  __typename?: 'app_notification';
  created_at: Scalars['timestamptz'];
  description: Scalars['String'];
  id: Scalars['uuid'];
  /** An object relationship */
  profile: Users_Profile;
  /** Profile id van de bedoelde ontvanger */
  recipient: Scalars['uuid'];
  status: Scalars['String'];
  title: Scalars['String'];
  type: Scalars['String'];
  updated_at: Scalars['timestamp'];
  /** An object relationship */
  visit?: Maybe<Cp_Visit>;
  /** Indien de melding een bezoek(aanvraag) betreft */
  visit_id?: Maybe<Scalars['uuid']>;
};

/** aggregated selection of "app.notification" */
export type App_Notification_Aggregate = {
  __typename?: 'app_notification_aggregate';
  aggregate?: Maybe<App_Notification_Aggregate_Fields>;
  nodes: Array<App_Notification>;
};

/** aggregate fields of "app.notification" */
export type App_Notification_Aggregate_Fields = {
  __typename?: 'app_notification_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<App_Notification_Max_Fields>;
  min?: Maybe<App_Notification_Min_Fields>;
};


/** aggregate fields of "app.notification" */
export type App_Notification_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<App_Notification_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "app.notification" */
export type App_Notification_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<App_Notification_Max_Order_By>;
  min?: InputMaybe<App_Notification_Min_Order_By>;
};

/** input type for inserting array relation for remote table "app.notification" */
export type App_Notification_Arr_Rel_Insert_Input = {
  data: Array<App_Notification_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<App_Notification_On_Conflict>;
};

/** Boolean expression to filter rows from the table "app.notification". All fields are combined with a logical 'AND'. */
export type App_Notification_Bool_Exp = {
  _and?: InputMaybe<Array<App_Notification_Bool_Exp>>;
  _not?: InputMaybe<App_Notification_Bool_Exp>;
  _or?: InputMaybe<Array<App_Notification_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  profile?: InputMaybe<Users_Profile_Bool_Exp>;
  recipient?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  type?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  visit?: InputMaybe<Cp_Visit_Bool_Exp>;
  visit_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "app.notification" */
export enum App_Notification_Constraint {
  /** unique or primary key constraint */
  NotificationPkey = 'notification_pkey'
}

/** input type for inserting data into table "app.notification" */
export type App_Notification_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  /** Profile id van de bedoelde ontvanger */
  recipient?: InputMaybe<Scalars['uuid']>;
  status?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  visit?: InputMaybe<Cp_Visit_Obj_Rel_Insert_Input>;
  /** Indien de melding een bezoek(aanvraag) betreft */
  visit_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type App_Notification_Max_Fields = {
  __typename?: 'app_notification_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  /** Profile id van de bedoelde ontvanger */
  recipient?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  /** Indien de melding een bezoek(aanvraag) betreft */
  visit_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "app.notification" */
export type App_Notification_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Profile id van de bedoelde ontvanger */
  recipient?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Indien de melding een bezoek(aanvraag) betreft */
  visit_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type App_Notification_Min_Fields = {
  __typename?: 'app_notification_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  /** Profile id van de bedoelde ontvanger */
  recipient?: Maybe<Scalars['uuid']>;
  status?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  /** Indien de melding een bezoek(aanvraag) betreft */
  visit_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "app.notification" */
export type App_Notification_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  /** Profile id van de bedoelde ontvanger */
  recipient?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  /** Indien de melding een bezoek(aanvraag) betreft */
  visit_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "app.notification" */
export type App_Notification_Mutation_Response = {
  __typename?: 'app_notification_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<App_Notification>;
};

/** on_conflict condition type for table "app.notification" */
export type App_Notification_On_Conflict = {
  constraint: App_Notification_Constraint;
  update_columns?: Array<App_Notification_Update_Column>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};

/** Ordering options when selecting data from "app.notification". */
export type App_Notification_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  profile?: InputMaybe<Users_Profile_Order_By>;
  recipient?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  type?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  visit?: InputMaybe<Cp_Visit_Order_By>;
  visit_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: app_notification */
export type App_Notification_Pk_Columns_Input = {
  id: Scalars['uuid'];
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
  Recipient = 'recipient',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  VisitId = 'visit_id'
}

/** input type for updating data in table "app.notification" */
export type App_Notification_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  /** Profile id van de bedoelde ontvanger */
  recipient?: InputMaybe<Scalars['uuid']>;
  status?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  /** Indien de melding een bezoek(aanvraag) betreft */
  visit_id?: InputMaybe<Scalars['uuid']>;
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
  Recipient = 'recipient',
  /** column name */
  Status = 'status',
  /** column name */
  Title = 'title',
  /** column name */
  Type = 'type',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  VisitId = 'visit_id'
}

/** columns and relationships of "cms.content" */
export type Cms_Content = {
  __typename?: 'cms_content';
  /** An array relationship */
  content_blocks: Array<Cms_Content_Blocks>;
  /** An aggregate relationship */
  content_blocks_aggregate: Cms_Content_Blocks_Aggregate;
  /** An array relationship */
  content_content_labels: Array<Cms_Content_Content_Labels>;
  /** An aggregate relationship */
  content_content_labels_aggregate: Cms_Content_Content_Labels_Aggregate;
  content_type: Scalars['String'];
  content_width: Scalars['String'];
  created_at: Scalars['timestamp'];
  depublish_at?: Maybe<Scalars['timestamp']>;
  description?: Maybe<Scalars['String']>;
  header_path?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  is_deleted: Scalars['Boolean'];
  is_protected: Scalars['Boolean'];
  is_public?: Maybe<Scalars['Boolean']>;
  meta_description?: Maybe<Scalars['String']>;
  /** An object relationship */
  owner_profile?: Maybe<Users_Profile>;
  /** slug van de pagina */
  path?: Maybe<Scalars['String']>;
  publish_at?: Maybe<Scalars['timestamp']>;
  published_at?: Maybe<Scalars['timestamp']>;
  seo_description?: Maybe<Scalars['String']>;
  seo_image_path?: Maybe<Scalars['String']>;
  seo_keywords?: Maybe<Scalars['String']>;
  seo_title?: Maybe<Scalars['String']>;
  thumbnail_path?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  updated_at?: Maybe<Scalars['timestamp']>;
  updated_by_profile_id?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  updater_profile?: Maybe<Users_Profile>;
  user_group_ids?: Maybe<Scalars['jsonb']>;
  user_profile_id?: Maybe<Scalars['uuid']>;
};


/** columns and relationships of "cms.content" */
export type Cms_ContentContent_BlocksArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Blocks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Blocks_Order_By>>;
  where?: InputMaybe<Cms_Content_Blocks_Bool_Exp>;
};


/** columns and relationships of "cms.content" */
export type Cms_ContentContent_Blocks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Blocks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Blocks_Order_By>>;
  where?: InputMaybe<Cms_Content_Blocks_Bool_Exp>;
};


/** columns and relationships of "cms.content" */
export type Cms_ContentContent_Content_LabelsArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Content_Labels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Content_Labels_Order_By>>;
  where?: InputMaybe<Cms_Content_Content_Labels_Bool_Exp>;
};


/** columns and relationships of "cms.content" */
export type Cms_ContentContent_Content_Labels_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Content_Labels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Content_Labels_Order_By>>;
  where?: InputMaybe<Cms_Content_Content_Labels_Bool_Exp>;
};


/** columns and relationships of "cms.content" */
export type Cms_ContentUser_Group_IdsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "cms.content" */
export type Cms_Content_Aggregate = {
  __typename?: 'cms_content_aggregate';
  aggregate?: Maybe<Cms_Content_Aggregate_Fields>;
  nodes: Array<Cms_Content>;
};

/** aggregate fields of "cms.content" */
export type Cms_Content_Aggregate_Fields = {
  __typename?: 'cms_content_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Cms_Content_Max_Fields>;
  min?: Maybe<Cms_Content_Min_Fields>;
};


/** aggregate fields of "cms.content" */
export type Cms_Content_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cms_Content_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Cms_Content_Append_Input = {
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
};

/**
 * information for the blocks out of which the content pages are build
 *
 *
 * columns and relationships of "cms.content_blocks"
 *
 */
export type Cms_Content_Blocks = {
  __typename?: 'cms_content_blocks';
  /** An object relationship */
  cms_content_block_type: Lookup_Cms_Content_Block_Type;
  /** An object relationship */
  content: Cms_Content;
  content_block_type: Lookup_Cms_Content_Block_Type_Enum;
  content_id: Scalars['uuid'];
  created_at: Scalars['timestamp'];
  id: Scalars['uuid'];
  position: Scalars['Int'];
  updated_at: Scalars['timestamp'];
  variables?: Maybe<Scalars['jsonb']>;
};


/**
 * information for the blocks out of which the content pages are build
 *
 *
 * columns and relationships of "cms.content_blocks"
 *
 */
export type Cms_Content_BlocksVariablesArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "cms.content_blocks" */
export type Cms_Content_Blocks_Aggregate = {
  __typename?: 'cms_content_blocks_aggregate';
  aggregate?: Maybe<Cms_Content_Blocks_Aggregate_Fields>;
  nodes: Array<Cms_Content_Blocks>;
};

/** aggregate fields of "cms.content_blocks" */
export type Cms_Content_Blocks_Aggregate_Fields = {
  __typename?: 'cms_content_blocks_aggregate_fields';
  avg?: Maybe<Cms_Content_Blocks_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Cms_Content_Blocks_Max_Fields>;
  min?: Maybe<Cms_Content_Blocks_Min_Fields>;
  stddev?: Maybe<Cms_Content_Blocks_Stddev_Fields>;
  stddev_pop?: Maybe<Cms_Content_Blocks_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cms_Content_Blocks_Stddev_Samp_Fields>;
  sum?: Maybe<Cms_Content_Blocks_Sum_Fields>;
  var_pop?: Maybe<Cms_Content_Blocks_Var_Pop_Fields>;
  var_samp?: Maybe<Cms_Content_Blocks_Var_Samp_Fields>;
  variance?: Maybe<Cms_Content_Blocks_Variance_Fields>;
};


/** aggregate fields of "cms.content_blocks" */
export type Cms_Content_Blocks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cms_Content_Blocks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "cms.content_blocks" */
export type Cms_Content_Blocks_Aggregate_Order_By = {
  avg?: InputMaybe<Cms_Content_Blocks_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Cms_Content_Blocks_Max_Order_By>;
  min?: InputMaybe<Cms_Content_Blocks_Min_Order_By>;
  stddev?: InputMaybe<Cms_Content_Blocks_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Cms_Content_Blocks_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Cms_Content_Blocks_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Cms_Content_Blocks_Sum_Order_By>;
  var_pop?: InputMaybe<Cms_Content_Blocks_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Cms_Content_Blocks_Var_Samp_Order_By>;
  variance?: InputMaybe<Cms_Content_Blocks_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Cms_Content_Blocks_Append_Input = {
  variables?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "cms.content_blocks" */
export type Cms_Content_Blocks_Arr_Rel_Insert_Input = {
  data: Array<Cms_Content_Blocks_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Cms_Content_Blocks_On_Conflict>;
};

/** aggregate avg on columns */
export type Cms_Content_Blocks_Avg_Fields = {
  __typename?: 'cms_content_blocks_avg_fields';
  position?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "cms.content_blocks" */
export type Cms_Content_Blocks_Avg_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "cms.content_blocks". All fields are combined with a logical 'AND'. */
export type Cms_Content_Blocks_Bool_Exp = {
  _and?: InputMaybe<Array<Cms_Content_Blocks_Bool_Exp>>;
  _not?: InputMaybe<Cms_Content_Blocks_Bool_Exp>;
  _or?: InputMaybe<Array<Cms_Content_Blocks_Bool_Exp>>;
  cms_content_block_type?: InputMaybe<Lookup_Cms_Content_Block_Type_Bool_Exp>;
  content?: InputMaybe<Cms_Content_Bool_Exp>;
  content_block_type?: InputMaybe<Lookup_Cms_Content_Block_Type_Enum_Comparison_Exp>;
  content_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  position?: InputMaybe<Int_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  variables?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "cms.content_blocks" */
export enum Cms_Content_Blocks_Constraint {
  /** unique or primary key constraint */
  ContentBlocksPkey = 'content_blocks_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Cms_Content_Blocks_Delete_At_Path_Input = {
  variables?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Cms_Content_Blocks_Delete_Elem_Input = {
  variables?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Cms_Content_Blocks_Delete_Key_Input = {
  variables?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "cms.content_blocks" */
export type Cms_Content_Blocks_Inc_Input = {
  position?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "cms.content_blocks" */
export type Cms_Content_Blocks_Insert_Input = {
  cms_content_block_type?: InputMaybe<Lookup_Cms_Content_Block_Type_Obj_Rel_Insert_Input>;
  content?: InputMaybe<Cms_Content_Obj_Rel_Insert_Input>;
  content_block_type?: InputMaybe<Lookup_Cms_Content_Block_Type_Enum>;
  content_id?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  position?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  variables?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate max on columns */
export type Cms_Content_Blocks_Max_Fields = {
  __typename?: 'cms_content_blocks_max_fields';
  content_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  position?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** order by max() on columns of table "cms.content_blocks" */
export type Cms_Content_Blocks_Max_Order_By = {
  content_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  position?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Cms_Content_Blocks_Min_Fields = {
  __typename?: 'cms_content_blocks_min_fields';
  content_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  position?: Maybe<Scalars['Int']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** order by min() on columns of table "cms.content_blocks" */
export type Cms_Content_Blocks_Min_Order_By = {
  content_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  position?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "cms.content_blocks" */
export type Cms_Content_Blocks_Mutation_Response = {
  __typename?: 'cms_content_blocks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Cms_Content_Blocks>;
};

/** on_conflict condition type for table "cms.content_blocks" */
export type Cms_Content_Blocks_On_Conflict = {
  constraint: Cms_Content_Blocks_Constraint;
  update_columns?: Array<Cms_Content_Blocks_Update_Column>;
  where?: InputMaybe<Cms_Content_Blocks_Bool_Exp>;
};

/** Ordering options when selecting data from "cms.content_blocks". */
export type Cms_Content_Blocks_Order_By = {
  cms_content_block_type?: InputMaybe<Lookup_Cms_Content_Block_Type_Order_By>;
  content?: InputMaybe<Cms_Content_Order_By>;
  content_block_type?: InputMaybe<Order_By>;
  content_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  position?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  variables?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cms_content_blocks */
export type Cms_Content_Blocks_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Cms_Content_Blocks_Prepend_Input = {
  variables?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "cms.content_blocks" */
export enum Cms_Content_Blocks_Select_Column {
  /** column name */
  ContentBlockType = 'content_block_type',
  /** column name */
  ContentId = 'content_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Position = 'position',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Variables = 'variables'
}

/** input type for updating data in table "cms.content_blocks" */
export type Cms_Content_Blocks_Set_Input = {
  content_block_type?: InputMaybe<Lookup_Cms_Content_Block_Type_Enum>;
  content_id?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  position?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  variables?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate stddev on columns */
export type Cms_Content_Blocks_Stddev_Fields = {
  __typename?: 'cms_content_blocks_stddev_fields';
  position?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "cms.content_blocks" */
export type Cms_Content_Blocks_Stddev_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Cms_Content_Blocks_Stddev_Pop_Fields = {
  __typename?: 'cms_content_blocks_stddev_pop_fields';
  position?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "cms.content_blocks" */
export type Cms_Content_Blocks_Stddev_Pop_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Cms_Content_Blocks_Stddev_Samp_Fields = {
  __typename?: 'cms_content_blocks_stddev_samp_fields';
  position?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "cms.content_blocks" */
export type Cms_Content_Blocks_Stddev_Samp_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** aggregate sum on columns */
export type Cms_Content_Blocks_Sum_Fields = {
  __typename?: 'cms_content_blocks_sum_fields';
  position?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "cms.content_blocks" */
export type Cms_Content_Blocks_Sum_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** update columns of table "cms.content_blocks" */
export enum Cms_Content_Blocks_Update_Column {
  /** column name */
  ContentBlockType = 'content_block_type',
  /** column name */
  ContentId = 'content_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Position = 'position',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Variables = 'variables'
}

/** aggregate var_pop on columns */
export type Cms_Content_Blocks_Var_Pop_Fields = {
  __typename?: 'cms_content_blocks_var_pop_fields';
  position?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "cms.content_blocks" */
export type Cms_Content_Blocks_Var_Pop_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Cms_Content_Blocks_Var_Samp_Fields = {
  __typename?: 'cms_content_blocks_var_samp_fields';
  position?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "cms.content_blocks" */
export type Cms_Content_Blocks_Var_Samp_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Cms_Content_Blocks_Variance_Fields = {
  __typename?: 'cms_content_blocks_variance_fields';
  position?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "cms.content_blocks" */
export type Cms_Content_Blocks_Variance_Order_By = {
  position?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "cms.content". All fields are combined with a logical 'AND'. */
export type Cms_Content_Bool_Exp = {
  _and?: InputMaybe<Array<Cms_Content_Bool_Exp>>;
  _not?: InputMaybe<Cms_Content_Bool_Exp>;
  _or?: InputMaybe<Array<Cms_Content_Bool_Exp>>;
  content_blocks?: InputMaybe<Cms_Content_Blocks_Bool_Exp>;
  content_content_labels?: InputMaybe<Cms_Content_Content_Labels_Bool_Exp>;
  content_type?: InputMaybe<String_Comparison_Exp>;
  content_width?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  depublish_at?: InputMaybe<Timestamp_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  header_path?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_deleted?: InputMaybe<Boolean_Comparison_Exp>;
  is_protected?: InputMaybe<Boolean_Comparison_Exp>;
  is_public?: InputMaybe<Boolean_Comparison_Exp>;
  meta_description?: InputMaybe<String_Comparison_Exp>;
  owner_profile?: InputMaybe<Users_Profile_Bool_Exp>;
  path?: InputMaybe<String_Comparison_Exp>;
  publish_at?: InputMaybe<Timestamp_Comparison_Exp>;
  published_at?: InputMaybe<Timestamp_Comparison_Exp>;
  seo_description?: InputMaybe<String_Comparison_Exp>;
  seo_image_path?: InputMaybe<String_Comparison_Exp>;
  seo_keywords?: InputMaybe<String_Comparison_Exp>;
  seo_title?: InputMaybe<String_Comparison_Exp>;
  thumbnail_path?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  updated_by_profile_id?: InputMaybe<Uuid_Comparison_Exp>;
  updater_profile?: InputMaybe<Users_Profile_Bool_Exp>;
  user_group_ids?: InputMaybe<Jsonb_Comparison_Exp>;
  user_profile_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "cms.content" */
export enum Cms_Content_Constraint {
  /** unique or primary key constraint */
  ContentIdKey = 'content_id_key',
  /** unique or primary key constraint */
  ContentPathKey = 'content_path_key',
  /** unique or primary key constraint */
  ContentPkey = 'content_pkey'
}

/**
 * linking table between content pages and the content_labels
 *
 *
 * columns and relationships of "cms.content_content_labels"
 *
 */
export type Cms_Content_Content_Labels = {
  __typename?: 'cms_content_content_labels';
  /** An object relationship */
  content: Cms_Content;
  content_id: Scalars['uuid'];
  /** An object relationship */
  content_label: Cms_Content_Labels;
  created_at: Scalars['timestamp'];
  id: Scalars['uuid'];
  label_id: Scalars['uuid'];
  updated_at: Scalars['timestamp'];
};

/** aggregated selection of "cms.content_content_labels" */
export type Cms_Content_Content_Labels_Aggregate = {
  __typename?: 'cms_content_content_labels_aggregate';
  aggregate?: Maybe<Cms_Content_Content_Labels_Aggregate_Fields>;
  nodes: Array<Cms_Content_Content_Labels>;
};

/** aggregate fields of "cms.content_content_labels" */
export type Cms_Content_Content_Labels_Aggregate_Fields = {
  __typename?: 'cms_content_content_labels_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Cms_Content_Content_Labels_Max_Fields>;
  min?: Maybe<Cms_Content_Content_Labels_Min_Fields>;
};


/** aggregate fields of "cms.content_content_labels" */
export type Cms_Content_Content_Labels_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cms_Content_Content_Labels_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "cms.content_content_labels" */
export type Cms_Content_Content_Labels_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Cms_Content_Content_Labels_Max_Order_By>;
  min?: InputMaybe<Cms_Content_Content_Labels_Min_Order_By>;
};

/** input type for inserting array relation for remote table "cms.content_content_labels" */
export type Cms_Content_Content_Labels_Arr_Rel_Insert_Input = {
  data: Array<Cms_Content_Content_Labels_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Cms_Content_Content_Labels_On_Conflict>;
};

/** Boolean expression to filter rows from the table "cms.content_content_labels". All fields are combined with a logical 'AND'. */
export type Cms_Content_Content_Labels_Bool_Exp = {
  _and?: InputMaybe<Array<Cms_Content_Content_Labels_Bool_Exp>>;
  _not?: InputMaybe<Cms_Content_Content_Labels_Bool_Exp>;
  _or?: InputMaybe<Array<Cms_Content_Content_Labels_Bool_Exp>>;
  content?: InputMaybe<Cms_Content_Bool_Exp>;
  content_id?: InputMaybe<Uuid_Comparison_Exp>;
  content_label?: InputMaybe<Cms_Content_Labels_Bool_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  label_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "cms.content_content_labels" */
export enum Cms_Content_Content_Labels_Constraint {
  /** unique or primary key constraint */
  ContentContentLabelsPkey = 'content_content_labels_pkey'
}

/** input type for inserting data into table "cms.content_content_labels" */
export type Cms_Content_Content_Labels_Insert_Input = {
  content?: InputMaybe<Cms_Content_Obj_Rel_Insert_Input>;
  content_id?: InputMaybe<Scalars['uuid']>;
  content_label?: InputMaybe<Cms_Content_Labels_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  label_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type Cms_Content_Content_Labels_Max_Fields = {
  __typename?: 'cms_content_content_labels_max_fields';
  content_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  label_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** order by max() on columns of table "cms.content_content_labels" */
export type Cms_Content_Content_Labels_Max_Order_By = {
  content_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  label_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Cms_Content_Content_Labels_Min_Fields = {
  __typename?: 'cms_content_content_labels_min_fields';
  content_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  label_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** order by min() on columns of table "cms.content_content_labels" */
export type Cms_Content_Content_Labels_Min_Order_By = {
  content_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  label_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "cms.content_content_labels" */
export type Cms_Content_Content_Labels_Mutation_Response = {
  __typename?: 'cms_content_content_labels_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Cms_Content_Content_Labels>;
};

/** on_conflict condition type for table "cms.content_content_labels" */
export type Cms_Content_Content_Labels_On_Conflict = {
  constraint: Cms_Content_Content_Labels_Constraint;
  update_columns?: Array<Cms_Content_Content_Labels_Update_Column>;
  where?: InputMaybe<Cms_Content_Content_Labels_Bool_Exp>;
};

/** Ordering options when selecting data from "cms.content_content_labels". */
export type Cms_Content_Content_Labels_Order_By = {
  content?: InputMaybe<Cms_Content_Order_By>;
  content_id?: InputMaybe<Order_By>;
  content_label?: InputMaybe<Cms_Content_Labels_Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  label_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cms_content_content_labels */
export type Cms_Content_Content_Labels_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "cms.content_content_labels" */
export enum Cms_Content_Content_Labels_Select_Column {
  /** column name */
  ContentId = 'content_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  LabelId = 'label_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "cms.content_content_labels" */
export type Cms_Content_Content_Labels_Set_Input = {
  content_id?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  label_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "cms.content_content_labels" */
export enum Cms_Content_Content_Labels_Update_Column {
  /** column name */
  ContentId = 'content_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  LabelId = 'label_id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Cms_Content_Delete_At_Path_Input = {
  user_group_ids?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Cms_Content_Delete_Elem_Input = {
  user_group_ids?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Cms_Content_Delete_Key_Input = {
  user_group_ids?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "cms.content" */
export type Cms_Content_Insert_Input = {
  content_blocks?: InputMaybe<Cms_Content_Blocks_Arr_Rel_Insert_Input>;
  content_content_labels?: InputMaybe<Cms_Content_Content_Labels_Arr_Rel_Insert_Input>;
  content_type?: InputMaybe<Scalars['String']>;
  content_width?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  depublish_at?: InputMaybe<Scalars['timestamp']>;
  description?: InputMaybe<Scalars['String']>;
  header_path?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  is_deleted?: InputMaybe<Scalars['Boolean']>;
  is_protected?: InputMaybe<Scalars['Boolean']>;
  is_public?: InputMaybe<Scalars['Boolean']>;
  meta_description?: InputMaybe<Scalars['String']>;
  owner_profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  /** slug van de pagina */
  path?: InputMaybe<Scalars['String']>;
  publish_at?: InputMaybe<Scalars['timestamp']>;
  published_at?: InputMaybe<Scalars['timestamp']>;
  seo_description?: InputMaybe<Scalars['String']>;
  seo_image_path?: InputMaybe<Scalars['String']>;
  seo_keywords?: InputMaybe<Scalars['String']>;
  seo_title?: InputMaybe<Scalars['String']>;
  thumbnail_path?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  updated_by_profile_id?: InputMaybe<Scalars['uuid']>;
  updater_profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
  user_profile_id?: InputMaybe<Scalars['uuid']>;
};

/**
 * labels to marks certain content pages and group them together
 *
 *
 * columns and relationships of "cms.content_labels"
 *
 */
export type Cms_Content_Labels = {
  __typename?: 'cms_content_labels';
  /** An object relationship */
  cms_content_type: Lookup_Cms_Content_Type;
  /** An array relationship */
  content_content_labels: Array<Cms_Content_Content_Labels>;
  /** An aggregate relationship */
  content_content_labels_aggregate: Cms_Content_Content_Labels_Aggregate;
  content_type: Lookup_Cms_Content_Type_Enum;
  created_at: Scalars['timestamp'];
  id: Scalars['uuid'];
  label: Scalars['String'];
  link_to?: Maybe<Scalars['jsonb']>;
  updated_at: Scalars['timestamp'];
};


/**
 * labels to marks certain content pages and group them together
 *
 *
 * columns and relationships of "cms.content_labels"
 *
 */
export type Cms_Content_LabelsContent_Content_LabelsArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Content_Labels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Content_Labels_Order_By>>;
  where?: InputMaybe<Cms_Content_Content_Labels_Bool_Exp>;
};


/**
 * labels to marks certain content pages and group them together
 *
 *
 * columns and relationships of "cms.content_labels"
 *
 */
export type Cms_Content_LabelsContent_Content_Labels_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Content_Labels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Content_Labels_Order_By>>;
  where?: InputMaybe<Cms_Content_Content_Labels_Bool_Exp>;
};


/**
 * labels to marks certain content pages and group them together
 *
 *
 * columns and relationships of "cms.content_labels"
 *
 */
export type Cms_Content_LabelsLink_ToArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "cms.content_labels" */
export type Cms_Content_Labels_Aggregate = {
  __typename?: 'cms_content_labels_aggregate';
  aggregate?: Maybe<Cms_Content_Labels_Aggregate_Fields>;
  nodes: Array<Cms_Content_Labels>;
};

/** aggregate fields of "cms.content_labels" */
export type Cms_Content_Labels_Aggregate_Fields = {
  __typename?: 'cms_content_labels_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Cms_Content_Labels_Max_Fields>;
  min?: Maybe<Cms_Content_Labels_Min_Fields>;
};


/** aggregate fields of "cms.content_labels" */
export type Cms_Content_Labels_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cms_Content_Labels_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Cms_Content_Labels_Append_Input = {
  link_to?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "cms.content_labels". All fields are combined with a logical 'AND'. */
export type Cms_Content_Labels_Bool_Exp = {
  _and?: InputMaybe<Array<Cms_Content_Labels_Bool_Exp>>;
  _not?: InputMaybe<Cms_Content_Labels_Bool_Exp>;
  _or?: InputMaybe<Array<Cms_Content_Labels_Bool_Exp>>;
  cms_content_type?: InputMaybe<Lookup_Cms_Content_Type_Bool_Exp>;
  content_content_labels?: InputMaybe<Cms_Content_Content_Labels_Bool_Exp>;
  content_type?: InputMaybe<Lookup_Cms_Content_Type_Enum_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  label?: InputMaybe<String_Comparison_Exp>;
  link_to?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "cms.content_labels" */
export enum Cms_Content_Labels_Constraint {
  /** unique or primary key constraint */
  ContentLabelsLabelContentTypeKey = 'content_labels_label_content_type_key',
  /** unique or primary key constraint */
  ContentLabelsPkey = 'content_labels_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Cms_Content_Labels_Delete_At_Path_Input = {
  link_to?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Cms_Content_Labels_Delete_Elem_Input = {
  link_to?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Cms_Content_Labels_Delete_Key_Input = {
  link_to?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "cms.content_labels" */
export type Cms_Content_Labels_Insert_Input = {
  cms_content_type?: InputMaybe<Lookup_Cms_Content_Type_Obj_Rel_Insert_Input>;
  content_content_labels?: InputMaybe<Cms_Content_Content_Labels_Arr_Rel_Insert_Input>;
  content_type?: InputMaybe<Lookup_Cms_Content_Type_Enum>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  link_to?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type Cms_Content_Labels_Max_Fields = {
  __typename?: 'cms_content_labels_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Cms_Content_Labels_Min_Fields = {
  __typename?: 'cms_content_labels_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "cms.content_labels" */
export type Cms_Content_Labels_Mutation_Response = {
  __typename?: 'cms_content_labels_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Cms_Content_Labels>;
};

/** input type for inserting object relation for remote table "cms.content_labels" */
export type Cms_Content_Labels_Obj_Rel_Insert_Input = {
  data: Cms_Content_Labels_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Cms_Content_Labels_On_Conflict>;
};

/** on_conflict condition type for table "cms.content_labels" */
export type Cms_Content_Labels_On_Conflict = {
  constraint: Cms_Content_Labels_Constraint;
  update_columns?: Array<Cms_Content_Labels_Update_Column>;
  where?: InputMaybe<Cms_Content_Labels_Bool_Exp>;
};

/** Ordering options when selecting data from "cms.content_labels". */
export type Cms_Content_Labels_Order_By = {
  cms_content_type?: InputMaybe<Lookup_Cms_Content_Type_Order_By>;
  content_content_labels_aggregate?: InputMaybe<Cms_Content_Content_Labels_Aggregate_Order_By>;
  content_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  link_to?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cms_content_labels */
export type Cms_Content_Labels_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Cms_Content_Labels_Prepend_Input = {
  link_to?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "cms.content_labels" */
export enum Cms_Content_Labels_Select_Column {
  /** column name */
  ContentType = 'content_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  LinkTo = 'link_to',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "cms.content_labels" */
export type Cms_Content_Labels_Set_Input = {
  content_type?: InputMaybe<Lookup_Cms_Content_Type_Enum>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  link_to?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "cms.content_labels" */
export enum Cms_Content_Labels_Update_Column {
  /** column name */
  ContentType = 'content_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  LinkTo = 'link_to',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate max on columns */
export type Cms_Content_Max_Fields = {
  __typename?: 'cms_content_max_fields';
  content_type?: Maybe<Scalars['String']>;
  content_width?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamp']>;
  depublish_at?: Maybe<Scalars['timestamp']>;
  description?: Maybe<Scalars['String']>;
  header_path?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  meta_description?: Maybe<Scalars['String']>;
  /** slug van de pagina */
  path?: Maybe<Scalars['String']>;
  publish_at?: Maybe<Scalars['timestamp']>;
  published_at?: Maybe<Scalars['timestamp']>;
  seo_description?: Maybe<Scalars['String']>;
  seo_image_path?: Maybe<Scalars['String']>;
  seo_keywords?: Maybe<Scalars['String']>;
  seo_title?: Maybe<Scalars['String']>;
  thumbnail_path?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  updated_by_profile_id?: Maybe<Scalars['uuid']>;
  user_profile_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type Cms_Content_Min_Fields = {
  __typename?: 'cms_content_min_fields';
  content_type?: Maybe<Scalars['String']>;
  content_width?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamp']>;
  depublish_at?: Maybe<Scalars['timestamp']>;
  description?: Maybe<Scalars['String']>;
  header_path?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  meta_description?: Maybe<Scalars['String']>;
  /** slug van de pagina */
  path?: Maybe<Scalars['String']>;
  publish_at?: Maybe<Scalars['timestamp']>;
  published_at?: Maybe<Scalars['timestamp']>;
  seo_description?: Maybe<Scalars['String']>;
  seo_image_path?: Maybe<Scalars['String']>;
  seo_keywords?: Maybe<Scalars['String']>;
  seo_title?: Maybe<Scalars['String']>;
  thumbnail_path?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  updated_by_profile_id?: Maybe<Scalars['uuid']>;
  user_profile_id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "cms.content" */
export type Cms_Content_Mutation_Response = {
  __typename?: 'cms_content_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Cms_Content>;
};

/** input type for inserting object relation for remote table "cms.content" */
export type Cms_Content_Obj_Rel_Insert_Input = {
  data: Cms_Content_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Cms_Content_On_Conflict>;
};

/** on_conflict condition type for table "cms.content" */
export type Cms_Content_On_Conflict = {
  constraint: Cms_Content_Constraint;
  update_columns?: Array<Cms_Content_Update_Column>;
  where?: InputMaybe<Cms_Content_Bool_Exp>;
};

/** Ordering options when selecting data from "cms.content". */
export type Cms_Content_Order_By = {
  content_blocks_aggregate?: InputMaybe<Cms_Content_Blocks_Aggregate_Order_By>;
  content_content_labels_aggregate?: InputMaybe<Cms_Content_Content_Labels_Aggregate_Order_By>;
  content_type?: InputMaybe<Order_By>;
  content_width?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  depublish_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  header_path?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_deleted?: InputMaybe<Order_By>;
  is_protected?: InputMaybe<Order_By>;
  is_public?: InputMaybe<Order_By>;
  meta_description?: InputMaybe<Order_By>;
  owner_profile?: InputMaybe<Users_Profile_Order_By>;
  path?: InputMaybe<Order_By>;
  publish_at?: InputMaybe<Order_By>;
  published_at?: InputMaybe<Order_By>;
  seo_description?: InputMaybe<Order_By>;
  seo_image_path?: InputMaybe<Order_By>;
  seo_keywords?: InputMaybe<Order_By>;
  seo_title?: InputMaybe<Order_By>;
  thumbnail_path?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by_profile_id?: InputMaybe<Order_By>;
  updater_profile?: InputMaybe<Users_Profile_Order_By>;
  user_group_ids?: InputMaybe<Order_By>;
  user_profile_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cms_content */
export type Cms_Content_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Cms_Content_Prepend_Input = {
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "cms.content" */
export enum Cms_Content_Select_Column {
  /** column name */
  ContentType = 'content_type',
  /** column name */
  ContentWidth = 'content_width',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DepublishAt = 'depublish_at',
  /** column name */
  Description = 'description',
  /** column name */
  HeaderPath = 'header_path',
  /** column name */
  Id = 'id',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  IsProtected = 'is_protected',
  /** column name */
  IsPublic = 'is_public',
  /** column name */
  MetaDescription = 'meta_description',
  /** column name */
  Path = 'path',
  /** column name */
  PublishAt = 'publish_at',
  /** column name */
  PublishedAt = 'published_at',
  /** column name */
  SeoDescription = 'seo_description',
  /** column name */
  SeoImagePath = 'seo_image_path',
  /** column name */
  SeoKeywords = 'seo_keywords',
  /** column name */
  SeoTitle = 'seo_title',
  /** column name */
  ThumbnailPath = 'thumbnail_path',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UpdatedByProfileId = 'updated_by_profile_id',
  /** column name */
  UserGroupIds = 'user_group_ids',
  /** column name */
  UserProfileId = 'user_profile_id'
}

/** input type for updating data in table "cms.content" */
export type Cms_Content_Set_Input = {
  content_type?: InputMaybe<Scalars['String']>;
  content_width?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  depublish_at?: InputMaybe<Scalars['timestamp']>;
  description?: InputMaybe<Scalars['String']>;
  header_path?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  is_deleted?: InputMaybe<Scalars['Boolean']>;
  is_protected?: InputMaybe<Scalars['Boolean']>;
  is_public?: InputMaybe<Scalars['Boolean']>;
  meta_description?: InputMaybe<Scalars['String']>;
  /** slug van de pagina */
  path?: InputMaybe<Scalars['String']>;
  publish_at?: InputMaybe<Scalars['timestamp']>;
  published_at?: InputMaybe<Scalars['timestamp']>;
  seo_description?: InputMaybe<Scalars['String']>;
  seo_image_path?: InputMaybe<Scalars['String']>;
  seo_keywords?: InputMaybe<Scalars['String']>;
  seo_title?: InputMaybe<Scalars['String']>;
  thumbnail_path?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  updated_by_profile_id?: InputMaybe<Scalars['uuid']>;
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
  user_profile_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "cms.content" */
export enum Cms_Content_Update_Column {
  /** column name */
  ContentType = 'content_type',
  /** column name */
  ContentWidth = 'content_width',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DepublishAt = 'depublish_at',
  /** column name */
  Description = 'description',
  /** column name */
  HeaderPath = 'header_path',
  /** column name */
  Id = 'id',
  /** column name */
  IsDeleted = 'is_deleted',
  /** column name */
  IsProtected = 'is_protected',
  /** column name */
  IsPublic = 'is_public',
  /** column name */
  MetaDescription = 'meta_description',
  /** column name */
  Path = 'path',
  /** column name */
  PublishAt = 'publish_at',
  /** column name */
  PublishedAt = 'published_at',
  /** column name */
  SeoDescription = 'seo_description',
  /** column name */
  SeoImagePath = 'seo_image_path',
  /** column name */
  SeoKeywords = 'seo_keywords',
  /** column name */
  SeoTitle = 'seo_title',
  /** column name */
  ThumbnailPath = 'thumbnail_path',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UpdatedByProfileId = 'updated_by_profile_id',
  /** column name */
  UserGroupIds = 'user_group_ids',
  /** column name */
  UserProfileId = 'user_profile_id'
}

/** columns and relationships of "cms.navigation_element" */
export type Cms_Navigation_Element = {
  __typename?: 'cms_navigation_element';
  /** id van de gelinkte content block pagina */
  content_id?: Maybe<Scalars['uuid']>;
  content_path: Scalars['String'];
  content_type: Scalars['String'];
  created_at: Scalars['timestamptz'];
  /** beschrijving van het navigatie item. enkel zichtbaar voor beheerders */
  description?: Maybe<Scalars['String']>;
  icon_name: Scalars['String'];
  id: Scalars['uuid'];
  label: Scalars['String'];
  /** open in new tab of in zelfde tab */
  link_target?: Maybe<Scalars['String']>;
  /** In welk navigatiemenu verschijnt dit, vb. navigatiemenu linksboven, of footermenu. */
  placement: Scalars['String'];
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position: Scalars['Int'];
  tooltip?: Maybe<Scalars['String']>;
  updated_at: Scalars['timestamptz'];
  user_group_ids?: Maybe<Scalars['jsonb']>;
};


/** columns and relationships of "cms.navigation_element" */
export type Cms_Navigation_ElementUser_Group_IdsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "cms.navigation_element" */
export type Cms_Navigation_Element_Aggregate = {
  __typename?: 'cms_navigation_element_aggregate';
  aggregate?: Maybe<Cms_Navigation_Element_Aggregate_Fields>;
  nodes: Array<Cms_Navigation_Element>;
};

/** aggregate fields of "cms.navigation_element" */
export type Cms_Navigation_Element_Aggregate_Fields = {
  __typename?: 'cms_navigation_element_aggregate_fields';
  avg?: Maybe<Cms_Navigation_Element_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Cms_Navigation_Element_Max_Fields>;
  min?: Maybe<Cms_Navigation_Element_Min_Fields>;
  stddev?: Maybe<Cms_Navigation_Element_Stddev_Fields>;
  stddev_pop?: Maybe<Cms_Navigation_Element_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Cms_Navigation_Element_Stddev_Samp_Fields>;
  sum?: Maybe<Cms_Navigation_Element_Sum_Fields>;
  var_pop?: Maybe<Cms_Navigation_Element_Var_Pop_Fields>;
  var_samp?: Maybe<Cms_Navigation_Element_Var_Samp_Fields>;
  variance?: Maybe<Cms_Navigation_Element_Variance_Fields>;
};


/** aggregate fields of "cms.navigation_element" */
export type Cms_Navigation_Element_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cms_Navigation_Element_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Cms_Navigation_Element_Append_Input = {
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate avg on columns */
export type Cms_Navigation_Element_Avg_Fields = {
  __typename?: 'cms_navigation_element_avg_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "cms.navigation_element". All fields are combined with a logical 'AND'. */
export type Cms_Navigation_Element_Bool_Exp = {
  _and?: InputMaybe<Array<Cms_Navigation_Element_Bool_Exp>>;
  _not?: InputMaybe<Cms_Navigation_Element_Bool_Exp>;
  _or?: InputMaybe<Array<Cms_Navigation_Element_Bool_Exp>>;
  content_id?: InputMaybe<Uuid_Comparison_Exp>;
  content_path?: InputMaybe<String_Comparison_Exp>;
  content_type?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  icon_name?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  label?: InputMaybe<String_Comparison_Exp>;
  link_target?: InputMaybe<String_Comparison_Exp>;
  placement?: InputMaybe<String_Comparison_Exp>;
  position?: InputMaybe<Int_Comparison_Exp>;
  tooltip?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_group_ids?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "cms.navigation_element" */
export enum Cms_Navigation_Element_Constraint {
  /** unique or primary key constraint */
  NavigationElementPkey = 'navigation_element_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Cms_Navigation_Element_Delete_At_Path_Input = {
  user_group_ids?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Cms_Navigation_Element_Delete_Elem_Input = {
  user_group_ids?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Cms_Navigation_Element_Delete_Key_Input = {
  user_group_ids?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "cms.navigation_element" */
export type Cms_Navigation_Element_Inc_Input = {
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "cms.navigation_element" */
export type Cms_Navigation_Element_Insert_Input = {
  /** id van de gelinkte content block pagina */
  content_id?: InputMaybe<Scalars['uuid']>;
  content_path?: InputMaybe<Scalars['String']>;
  content_type?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** beschrijving van het navigatie item. enkel zichtbaar voor beheerders */
  description?: InputMaybe<Scalars['String']>;
  icon_name?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  /** open in new tab of in zelfde tab */
  link_target?: InputMaybe<Scalars['String']>;
  /** In welk navigatiemenu verschijnt dit, vb. navigatiemenu linksboven, of footermenu. */
  placement?: InputMaybe<Scalars['String']>;
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: InputMaybe<Scalars['Int']>;
  tooltip?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate max on columns */
export type Cms_Navigation_Element_Max_Fields = {
  __typename?: 'cms_navigation_element_max_fields';
  /** id van de gelinkte content block pagina */
  content_id?: Maybe<Scalars['uuid']>;
  content_path?: Maybe<Scalars['String']>;
  content_type?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  /** beschrijving van het navigatie item. enkel zichtbaar voor beheerders */
  description?: Maybe<Scalars['String']>;
  icon_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  /** open in new tab of in zelfde tab */
  link_target?: Maybe<Scalars['String']>;
  /** In welk navigatiemenu verschijnt dit, vb. navigatiemenu linksboven, of footermenu. */
  placement?: Maybe<Scalars['String']>;
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Int']>;
  tooltip?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Cms_Navigation_Element_Min_Fields = {
  __typename?: 'cms_navigation_element_min_fields';
  /** id van de gelinkte content block pagina */
  content_id?: Maybe<Scalars['uuid']>;
  content_path?: Maybe<Scalars['String']>;
  content_type?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  /** beschrijving van het navigatie item. enkel zichtbaar voor beheerders */
  description?: Maybe<Scalars['String']>;
  icon_name?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  /** open in new tab of in zelfde tab */
  link_target?: Maybe<Scalars['String']>;
  /** In welk navigatiemenu verschijnt dit, vb. navigatiemenu linksboven, of footermenu. */
  placement?: Maybe<Scalars['String']>;
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Int']>;
  tooltip?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "cms.navigation_element" */
export type Cms_Navigation_Element_Mutation_Response = {
  __typename?: 'cms_navigation_element_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Cms_Navigation_Element>;
};

/** on_conflict condition type for table "cms.navigation_element" */
export type Cms_Navigation_Element_On_Conflict = {
  constraint: Cms_Navigation_Element_Constraint;
  update_columns?: Array<Cms_Navigation_Element_Update_Column>;
  where?: InputMaybe<Cms_Navigation_Element_Bool_Exp>;
};

/** Ordering options when selecting data from "cms.navigation_element". */
export type Cms_Navigation_Element_Order_By = {
  content_id?: InputMaybe<Order_By>;
  content_path?: InputMaybe<Order_By>;
  content_type?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  icon_name?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  link_target?: InputMaybe<Order_By>;
  placement?: InputMaybe<Order_By>;
  position?: InputMaybe<Order_By>;
  tooltip?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_group_ids?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cms_navigation_element */
export type Cms_Navigation_Element_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Cms_Navigation_Element_Prepend_Input = {
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "cms.navigation_element" */
export enum Cms_Navigation_Element_Select_Column {
  /** column name */
  ContentId = 'content_id',
  /** column name */
  ContentPath = 'content_path',
  /** column name */
  ContentType = 'content_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  IconName = 'icon_name',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  LinkTarget = 'link_target',
  /** column name */
  Placement = 'placement',
  /** column name */
  Position = 'position',
  /** column name */
  Tooltip = 'tooltip',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserGroupIds = 'user_group_ids'
}

/** input type for updating data in table "cms.navigation_element" */
export type Cms_Navigation_Element_Set_Input = {
  /** id van de gelinkte content block pagina */
  content_id?: InputMaybe<Scalars['uuid']>;
  content_path?: InputMaybe<Scalars['String']>;
  content_type?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** beschrijving van het navigatie item. enkel zichtbaar voor beheerders */
  description?: InputMaybe<Scalars['String']>;
  icon_name?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  /** open in new tab of in zelfde tab */
  link_target?: InputMaybe<Scalars['String']>;
  /** In welk navigatiemenu verschijnt dit, vb. navigatiemenu linksboven, of footermenu. */
  placement?: InputMaybe<Scalars['String']>;
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: InputMaybe<Scalars['Int']>;
  tooltip?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_group_ids?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate stddev on columns */
export type Cms_Navigation_Element_Stddev_Fields = {
  __typename?: 'cms_navigation_element_stddev_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Cms_Navigation_Element_Stddev_Pop_Fields = {
  __typename?: 'cms_navigation_element_stddev_pop_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Cms_Navigation_Element_Stddev_Samp_Fields = {
  __typename?: 'cms_navigation_element_stddev_samp_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Cms_Navigation_Element_Sum_Fields = {
  __typename?: 'cms_navigation_element_sum_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Int']>;
};

/** update columns of table "cms.navigation_element" */
export enum Cms_Navigation_Element_Update_Column {
  /** column name */
  ContentId = 'content_id',
  /** column name */
  ContentPath = 'content_path',
  /** column name */
  ContentType = 'content_type',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Description = 'description',
  /** column name */
  IconName = 'icon_name',
  /** column name */
  Id = 'id',
  /** column name */
  Label = 'label',
  /** column name */
  LinkTarget = 'link_target',
  /** column name */
  Placement = 'placement',
  /** column name */
  Position = 'position',
  /** column name */
  Tooltip = 'tooltip',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserGroupIds = 'user_group_ids'
}

/** aggregate var_pop on columns */
export type Cms_Navigation_Element_Var_Pop_Fields = {
  __typename?: 'cms_navigation_element_var_pop_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Cms_Navigation_Element_Var_Samp_Fields = {
  __typename?: 'cms_navigation_element_var_samp_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Cms_Navigation_Element_Variance_Fields = {
  __typename?: 'cms_navigation_element_variance_fields';
  /** volgorde van de links in de navigatie balk 0, 1, 2, 3 */
  position?: Maybe<Scalars['Float']>;
};

/**
 * Sitebrede variabelen zoals vertalingen
 *
 *
 * columns and relationships of "cms.site_variables"
 *
 */
export type Cms_Site_Variables = {
  __typename?: 'cms_site_variables';
  created_at: Scalars['timestamp'];
  name: Scalars['String'];
  updated_at: Scalars['timestamp'];
  value: Scalars['jsonb'];
};


/**
 * Sitebrede variabelen zoals vertalingen
 *
 *
 * columns and relationships of "cms.site_variables"
 *
 */
export type Cms_Site_VariablesValueArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "cms.site_variables" */
export type Cms_Site_Variables_Aggregate = {
  __typename?: 'cms_site_variables_aggregate';
  aggregate?: Maybe<Cms_Site_Variables_Aggregate_Fields>;
  nodes: Array<Cms_Site_Variables>;
};

/** aggregate fields of "cms.site_variables" */
export type Cms_Site_Variables_Aggregate_Fields = {
  __typename?: 'cms_site_variables_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Cms_Site_Variables_Max_Fields>;
  min?: Maybe<Cms_Site_Variables_Min_Fields>;
};


/** aggregate fields of "cms.site_variables" */
export type Cms_Site_Variables_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cms_Site_Variables_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Cms_Site_Variables_Append_Input = {
  value?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "cms.site_variables". All fields are combined with a logical 'AND'. */
export type Cms_Site_Variables_Bool_Exp = {
  _and?: InputMaybe<Array<Cms_Site_Variables_Bool_Exp>>;
  _not?: InputMaybe<Cms_Site_Variables_Bool_Exp>;
  _or?: InputMaybe<Array<Cms_Site_Variables_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  value?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "cms.site_variables" */
export enum Cms_Site_Variables_Constraint {
  /** unique or primary key constraint */
  SiteVariablesPkey = 'site_variables_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Cms_Site_Variables_Delete_At_Path_Input = {
  value?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Cms_Site_Variables_Delete_Elem_Input = {
  value?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Cms_Site_Variables_Delete_Key_Input = {
  value?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "cms.site_variables" */
export type Cms_Site_Variables_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  value?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate max on columns */
export type Cms_Site_Variables_Max_Fields = {
  __typename?: 'cms_site_variables_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Cms_Site_Variables_Min_Fields = {
  __typename?: 'cms_site_variables_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "cms.site_variables" */
export type Cms_Site_Variables_Mutation_Response = {
  __typename?: 'cms_site_variables_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Cms_Site_Variables>;
};

/** on_conflict condition type for table "cms.site_variables" */
export type Cms_Site_Variables_On_Conflict = {
  constraint: Cms_Site_Variables_Constraint;
  update_columns?: Array<Cms_Site_Variables_Update_Column>;
  where?: InputMaybe<Cms_Site_Variables_Bool_Exp>;
};

/** Ordering options when selecting data from "cms.site_variables". */
export type Cms_Site_Variables_Order_By = {
  created_at?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cms_site_variables */
export type Cms_Site_Variables_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Cms_Site_Variables_Prepend_Input = {
  value?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "cms.site_variables" */
export enum Cms_Site_Variables_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "cms.site_variables" */
export type Cms_Site_Variables_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  value?: InputMaybe<Scalars['jsonb']>;
};

/** update columns of table "cms.site_variables" */
export enum Cms_Site_Variables_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Value = 'value'
}

/**
 * Informatie over de zoekindex per CP
 *
 *
 * columns and relationships of "cp.index"
 *
 */
export type Cp_Index = {
  __typename?: 'cp_index';
  created_at: Scalars['timestamp'];
  /** An object relationship */
  schema_maintainer: Cp_Maintainer;
  schema_maintainer_id: Scalars['String'];
  schema_name?: Maybe<Scalars['String']>;
  updated_at: Scalars['timestamp'];
};

/** aggregated selection of "cp.index" */
export type Cp_Index_Aggregate = {
  __typename?: 'cp_index_aggregate';
  aggregate?: Maybe<Cp_Index_Aggregate_Fields>;
  nodes: Array<Cp_Index>;
};

/** aggregate fields of "cp.index" */
export type Cp_Index_Aggregate_Fields = {
  __typename?: 'cp_index_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Cp_Index_Max_Fields>;
  min?: Maybe<Cp_Index_Min_Fields>;
};


/** aggregate fields of "cp.index" */
export type Cp_Index_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cp_Index_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "cp.index". All fields are combined with a logical 'AND'. */
export type Cp_Index_Bool_Exp = {
  _and?: InputMaybe<Array<Cp_Index_Bool_Exp>>;
  _not?: InputMaybe<Cp_Index_Bool_Exp>;
  _or?: InputMaybe<Array<Cp_Index_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  schema_maintainer?: InputMaybe<Cp_Maintainer_Bool_Exp>;
  schema_maintainer_id?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "cp.index" */
export enum Cp_Index_Constraint {
  /** unique or primary key constraint */
  IndexPkey = 'index_pkey'
}

/** input type for inserting data into table "cp.index" */
export type Cp_Index_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  schema_maintainer?: InputMaybe<Cp_Maintainer_Obj_Rel_Insert_Input>;
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  schema_name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type Cp_Index_Max_Fields = {
  __typename?: 'cp_index_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  schema_maintainer_id?: Maybe<Scalars['String']>;
  schema_name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Cp_Index_Min_Fields = {
  __typename?: 'cp_index_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  schema_maintainer_id?: Maybe<Scalars['String']>;
  schema_name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "cp.index" */
export type Cp_Index_Mutation_Response = {
  __typename?: 'cp_index_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Cp_Index>;
};

/** input type for inserting object relation for remote table "cp.index" */
export type Cp_Index_Obj_Rel_Insert_Input = {
  data: Cp_Index_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Cp_Index_On_Conflict>;
};

/** on_conflict condition type for table "cp.index" */
export type Cp_Index_On_Conflict = {
  constraint: Cp_Index_Constraint;
  update_columns?: Array<Cp_Index_Update_Column>;
  where?: InputMaybe<Cp_Index_Bool_Exp>;
};

/** Ordering options when selecting data from "cp.index". */
export type Cp_Index_Order_By = {
  created_at?: InputMaybe<Order_By>;
  schema_maintainer?: InputMaybe<Cp_Maintainer_Order_By>;
  schema_maintainer_id?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cp_index */
export type Cp_Index_Pk_Columns_Input = {
  schema_maintainer_id: Scalars['String'];
};

/** select columns of table "cp.index" */
export enum Cp_Index_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "cp.index" */
export type Cp_Index_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  schema_name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "cp.index" */
export enum Cp_Index_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/**
 * Informatie over de organisatie die content beheert en aanbiedt, aka CP
 *
 *
 * columns and relationships of "cp.maintainer"
 *
 */
export type Cp_Maintainer = {
  __typename?: 'cp_maintainer';
  created_at: Scalars['timestamp'];
  has_index: Scalars['Boolean'];
  has_space: Scalars['Boolean'];
  /** An object relationship */
  index?: Maybe<Cp_Index>;
  information?: Maybe<Array<Maybe<ContentPartner>>>;
  /** An array relationship */
  maintainer_users_profiles: Array<Cp_Maintainer_Users_Profile>;
  /** An aggregate relationship */
  maintainer_users_profiles_aggregate: Cp_Maintainer_Users_Profile_Aggregate;
  schema_identifier: Scalars['String'];
  schema_name?: Maybe<Scalars['String']>;
  /** An object relationship */
  space?: Maybe<Cp_Space>;
  updated_at: Scalars['timestamp'];
};


/**
 * Informatie over de organisatie die content beheert en aanbiedt, aka CP
 *
 *
 * columns and relationships of "cp.maintainer"
 *
 */
export type Cp_MaintainerInformationArgs = {
  iri?: InputMaybe<Scalars['String']>;
};


/**
 * Informatie over de organisatie die content beheert en aanbiedt, aka CP
 *
 *
 * columns and relationships of "cp.maintainer"
 *
 */
export type Cp_MaintainerMaintainer_Users_ProfilesArgs = {
  distinct_on?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Cp_Maintainer_Users_Profile_Bool_Exp>;
};


/**
 * Informatie over de organisatie die content beheert en aanbiedt, aka CP
 *
 *
 * columns and relationships of "cp.maintainer"
 *
 */
export type Cp_MaintainerMaintainer_Users_Profiles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Cp_Maintainer_Users_Profile_Bool_Exp>;
};

/** aggregated selection of "cp.maintainer" */
export type Cp_Maintainer_Aggregate = {
  __typename?: 'cp_maintainer_aggregate';
  aggregate?: Maybe<Cp_Maintainer_Aggregate_Fields>;
  nodes: Array<Cp_Maintainer>;
};

/** aggregate fields of "cp.maintainer" */
export type Cp_Maintainer_Aggregate_Fields = {
  __typename?: 'cp_maintainer_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Cp_Maintainer_Max_Fields>;
  min?: Maybe<Cp_Maintainer_Min_Fields>;
};


/** aggregate fields of "cp.maintainer" */
export type Cp_Maintainer_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cp_Maintainer_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "cp.maintainer". All fields are combined with a logical 'AND'. */
export type Cp_Maintainer_Bool_Exp = {
  _and?: InputMaybe<Array<Cp_Maintainer_Bool_Exp>>;
  _not?: InputMaybe<Cp_Maintainer_Bool_Exp>;
  _or?: InputMaybe<Array<Cp_Maintainer_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  has_index?: InputMaybe<Boolean_Comparison_Exp>;
  has_space?: InputMaybe<Boolean_Comparison_Exp>;
  index?: InputMaybe<Cp_Index_Bool_Exp>;
  maintainer_users_profiles?: InputMaybe<Cp_Maintainer_Users_Profile_Bool_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  space?: InputMaybe<Cp_Space_Bool_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "cp.maintainer" */
export enum Cp_Maintainer_Constraint {
  /** unique or primary key constraint */
  MaintainerPkey = 'maintainer_pkey'
}

/** input type for inserting data into table "cp.maintainer" */
export type Cp_Maintainer_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  has_index?: InputMaybe<Scalars['Boolean']>;
  has_space?: InputMaybe<Scalars['Boolean']>;
  index?: InputMaybe<Cp_Index_Obj_Rel_Insert_Input>;
  maintainer_users_profiles?: InputMaybe<Cp_Maintainer_Users_Profile_Arr_Rel_Insert_Input>;
  schema_identifier?: InputMaybe<Scalars['String']>;
  schema_name?: InputMaybe<Scalars['String']>;
  space?: InputMaybe<Cp_Space_Obj_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type Cp_Maintainer_Max_Fields = {
  __typename?: 'cp_maintainer_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  schema_identifier?: Maybe<Scalars['String']>;
  schema_name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Cp_Maintainer_Min_Fields = {
  __typename?: 'cp_maintainer_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  schema_identifier?: Maybe<Scalars['String']>;
  schema_name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "cp.maintainer" */
export type Cp_Maintainer_Mutation_Response = {
  __typename?: 'cp_maintainer_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Cp_Maintainer>;
};

/** input type for inserting object relation for remote table "cp.maintainer" */
export type Cp_Maintainer_Obj_Rel_Insert_Input = {
  data: Cp_Maintainer_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Cp_Maintainer_On_Conflict>;
};

/** on_conflict condition type for table "cp.maintainer" */
export type Cp_Maintainer_On_Conflict = {
  constraint: Cp_Maintainer_Constraint;
  update_columns?: Array<Cp_Maintainer_Update_Column>;
  where?: InputMaybe<Cp_Maintainer_Bool_Exp>;
};

/** Ordering options when selecting data from "cp.maintainer". */
export type Cp_Maintainer_Order_By = {
  created_at?: InputMaybe<Order_By>;
  has_index?: InputMaybe<Order_By>;
  has_space?: InputMaybe<Order_By>;
  index?: InputMaybe<Cp_Index_Order_By>;
  maintainer_users_profiles_aggregate?: InputMaybe<Cp_Maintainer_Users_Profile_Aggregate_Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  space?: InputMaybe<Cp_Space_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cp_maintainer */
export type Cp_Maintainer_Pk_Columns_Input = {
  schema_identifier: Scalars['String'];
};

/** select columns of table "cp.maintainer" */
export enum Cp_Maintainer_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HasIndex = 'has_index',
  /** column name */
  HasSpace = 'has_space',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "cp.maintainer" */
export type Cp_Maintainer_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  has_index?: InputMaybe<Scalars['Boolean']>;
  has_space?: InputMaybe<Scalars['Boolean']>;
  schema_identifier?: InputMaybe<Scalars['String']>;
  schema_name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "cp.maintainer" */
export enum Cp_Maintainer_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  HasIndex = 'has_index',
  /** column name */
  HasSpace = 'has_space',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  UpdatedAt = 'updated_at'
}

/**
 * The user profiles that will manage this reading room
 *
 *
 * columns and relationships of "cp.maintainer_users_profile"
 *
 */
export type Cp_Maintainer_Users_Profile = {
  __typename?: 'cp_maintainer_users_profile';
  id: Scalars['uuid'];
  /** An object relationship */
  maintainer: Cp_Maintainer;
  maintainer_identifier: Scalars['String'];
  /** An object relationship */
  profile: Users_Profile;
  users_profile_id: Scalars['uuid'];
};

/** aggregated selection of "cp.maintainer_users_profile" */
export type Cp_Maintainer_Users_Profile_Aggregate = {
  __typename?: 'cp_maintainer_users_profile_aggregate';
  aggregate?: Maybe<Cp_Maintainer_Users_Profile_Aggregate_Fields>;
  nodes: Array<Cp_Maintainer_Users_Profile>;
};

/** aggregate fields of "cp.maintainer_users_profile" */
export type Cp_Maintainer_Users_Profile_Aggregate_Fields = {
  __typename?: 'cp_maintainer_users_profile_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Cp_Maintainer_Users_Profile_Max_Fields>;
  min?: Maybe<Cp_Maintainer_Users_Profile_Min_Fields>;
};


/** aggregate fields of "cp.maintainer_users_profile" */
export type Cp_Maintainer_Users_Profile_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "cp.maintainer_users_profile" */
export type Cp_Maintainer_Users_Profile_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Cp_Maintainer_Users_Profile_Max_Order_By>;
  min?: InputMaybe<Cp_Maintainer_Users_Profile_Min_Order_By>;
};

/** input type for inserting array relation for remote table "cp.maintainer_users_profile" */
export type Cp_Maintainer_Users_Profile_Arr_Rel_Insert_Input = {
  data: Array<Cp_Maintainer_Users_Profile_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Cp_Maintainer_Users_Profile_On_Conflict>;
};

/** Boolean expression to filter rows from the table "cp.maintainer_users_profile". All fields are combined with a logical 'AND'. */
export type Cp_Maintainer_Users_Profile_Bool_Exp = {
  _and?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Bool_Exp>>;
  _not?: InputMaybe<Cp_Maintainer_Users_Profile_Bool_Exp>;
  _or?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  maintainer?: InputMaybe<Cp_Maintainer_Bool_Exp>;
  maintainer_identifier?: InputMaybe<String_Comparison_Exp>;
  profile?: InputMaybe<Users_Profile_Bool_Exp>;
  users_profile_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "cp.maintainer_users_profile" */
export enum Cp_Maintainer_Users_Profile_Constraint {
  /** unique or primary key constraint */
  MaintainerUsersProfileMaintainerIdentifierUsersProfilKey = 'maintainer_users_profile_maintainer_identifier_users_profil_key',
  /** unique or primary key constraint */
  MaintainerUsersProfilePkey = 'maintainer_users_profile_pkey'
}

/** input type for inserting data into table "cp.maintainer_users_profile" */
export type Cp_Maintainer_Users_Profile_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  maintainer?: InputMaybe<Cp_Maintainer_Obj_Rel_Insert_Input>;
  maintainer_identifier?: InputMaybe<Scalars['String']>;
  profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  users_profile_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Cp_Maintainer_Users_Profile_Max_Fields = {
  __typename?: 'cp_maintainer_users_profile_max_fields';
  id?: Maybe<Scalars['uuid']>;
  maintainer_identifier?: Maybe<Scalars['String']>;
  users_profile_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "cp.maintainer_users_profile" */
export type Cp_Maintainer_Users_Profile_Max_Order_By = {
  id?: InputMaybe<Order_By>;
  maintainer_identifier?: InputMaybe<Order_By>;
  users_profile_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Cp_Maintainer_Users_Profile_Min_Fields = {
  __typename?: 'cp_maintainer_users_profile_min_fields';
  id?: Maybe<Scalars['uuid']>;
  maintainer_identifier?: Maybe<Scalars['String']>;
  users_profile_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "cp.maintainer_users_profile" */
export type Cp_Maintainer_Users_Profile_Min_Order_By = {
  id?: InputMaybe<Order_By>;
  maintainer_identifier?: InputMaybe<Order_By>;
  users_profile_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "cp.maintainer_users_profile" */
export type Cp_Maintainer_Users_Profile_Mutation_Response = {
  __typename?: 'cp_maintainer_users_profile_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Cp_Maintainer_Users_Profile>;
};

/** on_conflict condition type for table "cp.maintainer_users_profile" */
export type Cp_Maintainer_Users_Profile_On_Conflict = {
  constraint: Cp_Maintainer_Users_Profile_Constraint;
  update_columns?: Array<Cp_Maintainer_Users_Profile_Update_Column>;
  where?: InputMaybe<Cp_Maintainer_Users_Profile_Bool_Exp>;
};

/** Ordering options when selecting data from "cp.maintainer_users_profile". */
export type Cp_Maintainer_Users_Profile_Order_By = {
  id?: InputMaybe<Order_By>;
  maintainer?: InputMaybe<Cp_Maintainer_Order_By>;
  maintainer_identifier?: InputMaybe<Order_By>;
  profile?: InputMaybe<Users_Profile_Order_By>;
  users_profile_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cp_maintainer_users_profile */
export type Cp_Maintainer_Users_Profile_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "cp.maintainer_users_profile" */
export enum Cp_Maintainer_Users_Profile_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  MaintainerIdentifier = 'maintainer_identifier',
  /** column name */
  UsersProfileId = 'users_profile_id'
}

/** input type for updating data in table "cp.maintainer_users_profile" */
export type Cp_Maintainer_Users_Profile_Set_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  maintainer_identifier?: InputMaybe<Scalars['String']>;
  users_profile_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "cp.maintainer_users_profile" */
export enum Cp_Maintainer_Users_Profile_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  MaintainerIdentifier = 'maintainer_identifier',
  /** column name */
  UsersProfileId = 'users_profile_id'
}

/**
 * Bezoekersruimte aka leeszaal van een CP
 *
 *
 * columns and relationships of "cp.space"
 *
 */
export type Cp_Space = {
  __typename?: 'cp_space';
  created_at?: Maybe<Scalars['timestamp']>;
  id: Scalars['uuid'];
  is_published?: Maybe<Scalars['Boolean']>;
  published_at?: Maybe<Scalars['timestamp']>;
  schema_audience_type: Lookup_Schema_Audience_Type_Enum;
  schema_color?: Maybe<Scalars['String']>;
  schema_description?: Maybe<Scalars['String']>;
  schema_image?: Maybe<Scalars['String']>;
  /** An object relationship */
  schema_maintainer: Cp_Maintainer;
  schema_maintainer_id: Scalars['String'];
  schema_public_access?: Maybe<Scalars['Boolean']>;
  schema_service_description?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  /** An array relationship */
  visits: Array<Cp_Visit>;
  /** An aggregate relationship */
  visits_aggregate: Cp_Visit_Aggregate;
};


/**
 * Bezoekersruimte aka leeszaal van een CP
 *
 *
 * columns and relationships of "cp.space"
 *
 */
export type Cp_SpaceVisitsArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Order_By>>;
  where?: InputMaybe<Cp_Visit_Bool_Exp>;
};


/**
 * Bezoekersruimte aka leeszaal van een CP
 *
 *
 * columns and relationships of "cp.space"
 *
 */
export type Cp_SpaceVisits_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Order_By>>;
  where?: InputMaybe<Cp_Visit_Bool_Exp>;
};

/** aggregated selection of "cp.space" */
export type Cp_Space_Aggregate = {
  __typename?: 'cp_space_aggregate';
  aggregate?: Maybe<Cp_Space_Aggregate_Fields>;
  nodes: Array<Cp_Space>;
};

/** aggregate fields of "cp.space" */
export type Cp_Space_Aggregate_Fields = {
  __typename?: 'cp_space_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Cp_Space_Max_Fields>;
  min?: Maybe<Cp_Space_Min_Fields>;
};


/** aggregate fields of "cp.space" */
export type Cp_Space_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cp_Space_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "cp.space". All fields are combined with a logical 'AND'. */
export type Cp_Space_Bool_Exp = {
  _and?: InputMaybe<Array<Cp_Space_Bool_Exp>>;
  _not?: InputMaybe<Cp_Space_Bool_Exp>;
  _or?: InputMaybe<Array<Cp_Space_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_published?: InputMaybe<Boolean_Comparison_Exp>;
  published_at?: InputMaybe<Timestamp_Comparison_Exp>;
  schema_audience_type?: InputMaybe<Lookup_Schema_Audience_Type_Enum_Comparison_Exp>;
  schema_color?: InputMaybe<String_Comparison_Exp>;
  schema_description?: InputMaybe<String_Comparison_Exp>;
  schema_image?: InputMaybe<String_Comparison_Exp>;
  schema_maintainer?: InputMaybe<Cp_Maintainer_Bool_Exp>;
  schema_maintainer_id?: InputMaybe<String_Comparison_Exp>;
  schema_public_access?: InputMaybe<Boolean_Comparison_Exp>;
  schema_service_description?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  visits?: InputMaybe<Cp_Visit_Bool_Exp>;
};

/** unique or primary key constraints on table "cp.space" */
export enum Cp_Space_Constraint {
  /** unique or primary key constraint */
  SpacePkey = 'space_pkey',
  /** unique or primary key constraint */
  SpaceSchemaMaintainerIdKey = 'space_schema_maintainer_id_key'
}

/** input type for inserting data into table "cp.space" */
export type Cp_Space_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  is_published?: InputMaybe<Scalars['Boolean']>;
  published_at?: InputMaybe<Scalars['timestamp']>;
  schema_audience_type?: InputMaybe<Lookup_Schema_Audience_Type_Enum>;
  schema_color?: InputMaybe<Scalars['String']>;
  schema_description?: InputMaybe<Scalars['String']>;
  schema_image?: InputMaybe<Scalars['String']>;
  schema_maintainer?: InputMaybe<Cp_Maintainer_Obj_Rel_Insert_Input>;
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  schema_public_access?: InputMaybe<Scalars['Boolean']>;
  schema_service_description?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  visits?: InputMaybe<Cp_Visit_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Cp_Space_Max_Fields = {
  __typename?: 'cp_space_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  published_at?: Maybe<Scalars['timestamp']>;
  schema_color?: Maybe<Scalars['String']>;
  schema_description?: Maybe<Scalars['String']>;
  schema_image?: Maybe<Scalars['String']>;
  schema_maintainer_id?: Maybe<Scalars['String']>;
  schema_service_description?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Cp_Space_Min_Fields = {
  __typename?: 'cp_space_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  published_at?: Maybe<Scalars['timestamp']>;
  schema_color?: Maybe<Scalars['String']>;
  schema_description?: Maybe<Scalars['String']>;
  schema_image?: Maybe<Scalars['String']>;
  schema_maintainer_id?: Maybe<Scalars['String']>;
  schema_service_description?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "cp.space" */
export type Cp_Space_Mutation_Response = {
  __typename?: 'cp_space_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Cp_Space>;
};

/** input type for inserting object relation for remote table "cp.space" */
export type Cp_Space_Obj_Rel_Insert_Input = {
  data: Cp_Space_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Cp_Space_On_Conflict>;
};

/** on_conflict condition type for table "cp.space" */
export type Cp_Space_On_Conflict = {
  constraint: Cp_Space_Constraint;
  update_columns?: Array<Cp_Space_Update_Column>;
  where?: InputMaybe<Cp_Space_Bool_Exp>;
};

/** Ordering options when selecting data from "cp.space". */
export type Cp_Space_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_published?: InputMaybe<Order_By>;
  published_at?: InputMaybe<Order_By>;
  schema_audience_type?: InputMaybe<Order_By>;
  schema_color?: InputMaybe<Order_By>;
  schema_description?: InputMaybe<Order_By>;
  schema_image?: InputMaybe<Order_By>;
  schema_maintainer?: InputMaybe<Cp_Maintainer_Order_By>;
  schema_maintainer_id?: InputMaybe<Order_By>;
  schema_public_access?: InputMaybe<Order_By>;
  schema_service_description?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  visits_aggregate?: InputMaybe<Cp_Visit_Aggregate_Order_By>;
};

/** primary key columns input for table: cp_space */
export type Cp_Space_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "cp.space" */
export enum Cp_Space_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsPublished = 'is_published',
  /** column name */
  PublishedAt = 'published_at',
  /** column name */
  SchemaAudienceType = 'schema_audience_type',
  /** column name */
  SchemaColor = 'schema_color',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaImage = 'schema_image',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaPublicAccess = 'schema_public_access',
  /** column name */
  SchemaServiceDescription = 'schema_service_description',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "cp.space" */
export type Cp_Space_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  is_published?: InputMaybe<Scalars['Boolean']>;
  published_at?: InputMaybe<Scalars['timestamp']>;
  schema_audience_type?: InputMaybe<Lookup_Schema_Audience_Type_Enum>;
  schema_color?: InputMaybe<Scalars['String']>;
  schema_description?: InputMaybe<Scalars['String']>;
  schema_image?: InputMaybe<Scalars['String']>;
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  schema_public_access?: InputMaybe<Scalars['Boolean']>;
  schema_service_description?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** update columns of table "cp.space" */
export enum Cp_Space_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsPublished = 'is_published',
  /** column name */
  PublishedAt = 'published_at',
  /** column name */
  SchemaAudienceType = 'schema_audience_type',
  /** column name */
  SchemaColor = 'schema_color',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaImage = 'schema_image',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaPublicAccess = 'schema_public_access',
  /** column name */
  SchemaServiceDescription = 'schema_service_description',
  /** column name */
  UpdatedAt = 'updated_at'
}

/**
 * Bezoekaanvragen van gebruikers
 *
 *
 * columns and relationships of "cp.visit"
 *
 */
export type Cp_Visit = {
  __typename?: 'cp_visit';
  cp_space_id: Scalars['uuid'];
  created_at: Scalars['timestamp'];
  end_date?: Maybe<Scalars['timestamp']>;
  id: Scalars['uuid'];
  /** An array relationship */
  notes: Array<Cp_Visit_Note>;
  /** An aggregate relationship */
  notes_aggregate: Cp_Visit_Note_Aggregate;
  /** An array relationship */
  notifications: Array<App_Notification>;
  /** An aggregate relationship */
  notifications_aggregate: App_Notification_Aggregate;
  /** An object relationship */
  space: Cp_Space;
  start_date?: Maybe<Scalars['timestamp']>;
  status: Scalars['String'];
  updated_at: Scalars['timestamp'];
  updated_by?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  updater?: Maybe<Users_Profile>;
  user_accepted_tos?: Maybe<Scalars['Boolean']>;
  /** An object relationship */
  user_profile: Users_Profile;
  user_profile_id: Scalars['uuid'];
  user_reason?: Maybe<Scalars['String']>;
  user_timeframe?: Maybe<Scalars['String']>;
};


/**
 * Bezoekaanvragen van gebruikers
 *
 *
 * columns and relationships of "cp.visit"
 *
 */
export type Cp_VisitNotesArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Note_Order_By>>;
  where?: InputMaybe<Cp_Visit_Note_Bool_Exp>;
};


/**
 * Bezoekaanvragen van gebruikers
 *
 *
 * columns and relationships of "cp.visit"
 *
 */
export type Cp_VisitNotes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Note_Order_By>>;
  where?: InputMaybe<Cp_Visit_Note_Bool_Exp>;
};


/**
 * Bezoekaanvragen van gebruikers
 *
 *
 * columns and relationships of "cp.visit"
 *
 */
export type Cp_VisitNotificationsArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


/**
 * Bezoekaanvragen van gebruikers
 *
 *
 * columns and relationships of "cp.visit"
 *
 */
export type Cp_VisitNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};

/** aggregated selection of "cp.visit" */
export type Cp_Visit_Aggregate = {
  __typename?: 'cp_visit_aggregate';
  aggregate?: Maybe<Cp_Visit_Aggregate_Fields>;
  nodes: Array<Cp_Visit>;
};

/** aggregate fields of "cp.visit" */
export type Cp_Visit_Aggregate_Fields = {
  __typename?: 'cp_visit_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Cp_Visit_Max_Fields>;
  min?: Maybe<Cp_Visit_Min_Fields>;
};


/** aggregate fields of "cp.visit" */
export type Cp_Visit_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cp_Visit_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "cp.visit" */
export type Cp_Visit_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Cp_Visit_Max_Order_By>;
  min?: InputMaybe<Cp_Visit_Min_Order_By>;
};

/** input type for inserting array relation for remote table "cp.visit" */
export type Cp_Visit_Arr_Rel_Insert_Input = {
  data: Array<Cp_Visit_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Cp_Visit_On_Conflict>;
};

/** Boolean expression to filter rows from the table "cp.visit". All fields are combined with a logical 'AND'. */
export type Cp_Visit_Bool_Exp = {
  _and?: InputMaybe<Array<Cp_Visit_Bool_Exp>>;
  _not?: InputMaybe<Cp_Visit_Bool_Exp>;
  _or?: InputMaybe<Array<Cp_Visit_Bool_Exp>>;
  cp_space_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  end_date?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  notes?: InputMaybe<Cp_Visit_Note_Bool_Exp>;
  notifications?: InputMaybe<App_Notification_Bool_Exp>;
  space?: InputMaybe<Cp_Space_Bool_Exp>;
  start_date?: InputMaybe<Timestamp_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  updated_by?: InputMaybe<Uuid_Comparison_Exp>;
  updater?: InputMaybe<Users_Profile_Bool_Exp>;
  user_accepted_tos?: InputMaybe<Boolean_Comparison_Exp>;
  user_profile?: InputMaybe<Users_Profile_Bool_Exp>;
  user_profile_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_reason?: InputMaybe<String_Comparison_Exp>;
  user_timeframe?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "cp.visit" */
export enum Cp_Visit_Constraint {
  /** unique or primary key constraint */
  VisitPkey = 'visit_pkey'
}

/** input type for inserting data into table "cp.visit" */
export type Cp_Visit_Insert_Input = {
  cp_space_id?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  end_date?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  notes?: InputMaybe<Cp_Visit_Note_Arr_Rel_Insert_Input>;
  notifications?: InputMaybe<App_Notification_Arr_Rel_Insert_Input>;
  space?: InputMaybe<Cp_Space_Obj_Rel_Insert_Input>;
  start_date?: InputMaybe<Scalars['timestamp']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  updated_by?: InputMaybe<Scalars['uuid']>;
  updater?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  user_accepted_tos?: InputMaybe<Scalars['Boolean']>;
  user_profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  user_profile_id?: InputMaybe<Scalars['uuid']>;
  user_reason?: InputMaybe<Scalars['String']>;
  user_timeframe?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Cp_Visit_Max_Fields = {
  __typename?: 'cp_visit_max_fields';
  cp_space_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamp']>;
  end_date?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  start_date?: Maybe<Scalars['timestamp']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  updated_by?: Maybe<Scalars['uuid']>;
  user_profile_id?: Maybe<Scalars['uuid']>;
  user_reason?: Maybe<Scalars['String']>;
  user_timeframe?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "cp.visit" */
export type Cp_Visit_Max_Order_By = {
  cp_space_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  end_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  start_date?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
  user_profile_id?: InputMaybe<Order_By>;
  user_reason?: InputMaybe<Order_By>;
  user_timeframe?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Cp_Visit_Min_Fields = {
  __typename?: 'cp_visit_min_fields';
  cp_space_id?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamp']>;
  end_date?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  start_date?: Maybe<Scalars['timestamp']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  updated_by?: Maybe<Scalars['uuid']>;
  user_profile_id?: Maybe<Scalars['uuid']>;
  user_reason?: Maybe<Scalars['String']>;
  user_timeframe?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "cp.visit" */
export type Cp_Visit_Min_Order_By = {
  cp_space_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  end_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  start_date?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
  user_profile_id?: InputMaybe<Order_By>;
  user_reason?: InputMaybe<Order_By>;
  user_timeframe?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "cp.visit" */
export type Cp_Visit_Mutation_Response = {
  __typename?: 'cp_visit_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Cp_Visit>;
};

/**
 * Notities en bemerkingen van een beheerder tijdens de levensduur van een bezoek, van aanvraag tot afronding
 *
 *
 * columns and relationships of "cp.visit_note"
 *
 */
export type Cp_Visit_Note = {
  __typename?: 'cp_visit_note';
  created_at: Scalars['timestamp'];
  id: Scalars['uuid'];
  note: Scalars['String'];
  /** An object relationship */
  profile?: Maybe<Users_Profile>;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: Maybe<Scalars['uuid']>;
  updated_at: Scalars['timestamp'];
  /** An object relationship */
  visit: Cp_Visit;
  visit_id: Scalars['uuid'];
};

/** aggregated selection of "cp.visit_note" */
export type Cp_Visit_Note_Aggregate = {
  __typename?: 'cp_visit_note_aggregate';
  aggregate?: Maybe<Cp_Visit_Note_Aggregate_Fields>;
  nodes: Array<Cp_Visit_Note>;
};

/** aggregate fields of "cp.visit_note" */
export type Cp_Visit_Note_Aggregate_Fields = {
  __typename?: 'cp_visit_note_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Cp_Visit_Note_Max_Fields>;
  min?: Maybe<Cp_Visit_Note_Min_Fields>;
};


/** aggregate fields of "cp.visit_note" */
export type Cp_Visit_Note_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cp_Visit_Note_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "cp.visit_note" */
export type Cp_Visit_Note_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Cp_Visit_Note_Max_Order_By>;
  min?: InputMaybe<Cp_Visit_Note_Min_Order_By>;
};

/** input type for inserting array relation for remote table "cp.visit_note" */
export type Cp_Visit_Note_Arr_Rel_Insert_Input = {
  data: Array<Cp_Visit_Note_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Cp_Visit_Note_On_Conflict>;
};

/** Boolean expression to filter rows from the table "cp.visit_note". All fields are combined with a logical 'AND'. */
export type Cp_Visit_Note_Bool_Exp = {
  _and?: InputMaybe<Array<Cp_Visit_Note_Bool_Exp>>;
  _not?: InputMaybe<Cp_Visit_Note_Bool_Exp>;
  _or?: InputMaybe<Array<Cp_Visit_Note_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  note?: InputMaybe<String_Comparison_Exp>;
  profile?: InputMaybe<Users_Profile_Bool_Exp>;
  profile_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  visit?: InputMaybe<Cp_Visit_Bool_Exp>;
  visit_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "cp.visit_note" */
export enum Cp_Visit_Note_Constraint {
  /** unique or primary key constraint */
  VisitNotePkey = 'visit_note_pkey'
}

/** input type for inserting data into table "cp.visit_note" */
export type Cp_Visit_Note_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  note?: InputMaybe<Scalars['String']>;
  profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  visit?: InputMaybe<Cp_Visit_Obj_Rel_Insert_Input>;
  visit_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Cp_Visit_Note_Max_Fields = {
  __typename?: 'cp_visit_note_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  note?: Maybe<Scalars['String']>;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  visit_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "cp.visit_note" */
export type Cp_Visit_Note_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  note?: InputMaybe<Order_By>;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  visit_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Cp_Visit_Note_Min_Fields = {
  __typename?: 'cp_visit_note_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  note?: Maybe<Scalars['String']>;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  visit_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "cp.visit_note" */
export type Cp_Visit_Note_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  note?: InputMaybe<Order_By>;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  visit_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "cp.visit_note" */
export type Cp_Visit_Note_Mutation_Response = {
  __typename?: 'cp_visit_note_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Cp_Visit_Note>;
};

/** on_conflict condition type for table "cp.visit_note" */
export type Cp_Visit_Note_On_Conflict = {
  constraint: Cp_Visit_Note_Constraint;
  update_columns?: Array<Cp_Visit_Note_Update_Column>;
  where?: InputMaybe<Cp_Visit_Note_Bool_Exp>;
};

/** Ordering options when selecting data from "cp.visit_note". */
export type Cp_Visit_Note_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  note?: InputMaybe<Order_By>;
  profile?: InputMaybe<Users_Profile_Order_By>;
  profile_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  visit?: InputMaybe<Cp_Visit_Order_By>;
  visit_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cp_visit_note */
export type Cp_Visit_Note_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "cp.visit_note" */
export enum Cp_Visit_Note_Select_Column {
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

/** input type for updating data in table "cp.visit_note" */
export type Cp_Visit_Note_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  note?: InputMaybe<Scalars['String']>;
  /** Degene die de notitie heeft gemaakt */
  profile_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  visit_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "cp.visit_note" */
export enum Cp_Visit_Note_Update_Column {
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

/** input type for inserting object relation for remote table "cp.visit" */
export type Cp_Visit_Obj_Rel_Insert_Input = {
  data: Cp_Visit_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Cp_Visit_On_Conflict>;
};

/** on_conflict condition type for table "cp.visit" */
export type Cp_Visit_On_Conflict = {
  constraint: Cp_Visit_Constraint;
  update_columns?: Array<Cp_Visit_Update_Column>;
  where?: InputMaybe<Cp_Visit_Bool_Exp>;
};

/** Ordering options when selecting data from "cp.visit". */
export type Cp_Visit_Order_By = {
  cp_space_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  end_date?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  notes_aggregate?: InputMaybe<Cp_Visit_Note_Aggregate_Order_By>;
  notifications_aggregate?: InputMaybe<App_Notification_Aggregate_Order_By>;
  space?: InputMaybe<Cp_Space_Order_By>;
  start_date?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  updated_by?: InputMaybe<Order_By>;
  updater?: InputMaybe<Users_Profile_Order_By>;
  user_accepted_tos?: InputMaybe<Order_By>;
  user_profile?: InputMaybe<Users_Profile_Order_By>;
  user_profile_id?: InputMaybe<Order_By>;
  user_reason?: InputMaybe<Order_By>;
  user_timeframe?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cp_visit */
export type Cp_Visit_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "cp.visit" */
export enum Cp_Visit_Select_Column {
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

/** input type for updating data in table "cp.visit" */
export type Cp_Visit_Set_Input = {
  cp_space_id?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  end_date?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  start_date?: InputMaybe<Scalars['timestamp']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  updated_by?: InputMaybe<Scalars['uuid']>;
  user_accepted_tos?: InputMaybe<Scalars['Boolean']>;
  user_profile_id?: InputMaybe<Scalars['uuid']>;
  user_reason?: InputMaybe<Scalars['String']>;
  user_timeframe?: InputMaybe<Scalars['String']>;
};

/** update columns of table "cp.visit" */
export enum Cp_Visit_Update_Column {
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

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['date']>;
  _gt?: InputMaybe<Scalars['date']>;
  _gte?: InputMaybe<Scalars['date']>;
  _in?: InputMaybe<Array<Scalars['date']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['date']>;
  _lte?: InputMaybe<Scalars['date']>;
  _neq?: InputMaybe<Scalars['date']>;
  _nin?: InputMaybe<Array<Scalars['date']>>;
};

/** Boolean expression to compare columns of type "daterange". All fields are combined with logical 'AND'. */
export type Daterange_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['daterange']>;
  _gt?: InputMaybe<Scalars['daterange']>;
  _gte?: InputMaybe<Scalars['daterange']>;
  _in?: InputMaybe<Array<Scalars['daterange']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['daterange']>;
  _lte?: InputMaybe<Scalars['daterange']>;
  _neq?: InputMaybe<Scalars['daterange']>;
  _nin?: InputMaybe<Array<Scalars['daterange']>>;
};

/** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['json']>;
  _gt?: InputMaybe<Scalars['json']>;
  _gte?: InputMaybe<Scalars['json']>;
  _in?: InputMaybe<Array<Scalars['json']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['json']>;
  _lte?: InputMaybe<Scalars['json']>;
  _neq?: InputMaybe<Scalars['json']>;
  _nin?: InputMaybe<Array<Scalars['json']>>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/**
 * Types van notificaties aan eindgebruikers
 *
 *
 * columns and relationships of "lookup.app_notification_type"
 *
 */
export type Lookup_App_Notification_Type = {
  __typename?: 'lookup_app_notification_type';
  comment?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

/** aggregated selection of "lookup.app_notification_type" */
export type Lookup_App_Notification_Type_Aggregate = {
  __typename?: 'lookup_app_notification_type_aggregate';
  aggregate?: Maybe<Lookup_App_Notification_Type_Aggregate_Fields>;
  nodes: Array<Lookup_App_Notification_Type>;
};

/** aggregate fields of "lookup.app_notification_type" */
export type Lookup_App_Notification_Type_Aggregate_Fields = {
  __typename?: 'lookup_app_notification_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Lookup_App_Notification_Type_Max_Fields>;
  min?: Maybe<Lookup_App_Notification_Type_Min_Fields>;
};


/** aggregate fields of "lookup.app_notification_type" */
export type Lookup_App_Notification_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Lookup_App_Notification_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "lookup.app_notification_type". All fields are combined with a logical 'AND'. */
export type Lookup_App_Notification_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Lookup_App_Notification_Type_Bool_Exp>>;
  _not?: InputMaybe<Lookup_App_Notification_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Lookup_App_Notification_Type_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "lookup.app_notification_type" */
export enum Lookup_App_Notification_Type_Constraint {
  /** unique or primary key constraint */
  AppNotificationTypePkey = 'app_notification_type_pkey'
}

/** input type for inserting data into table "lookup.app_notification_type" */
export type Lookup_App_Notification_Type_Insert_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Lookup_App_Notification_Type_Max_Fields = {
  __typename?: 'lookup_app_notification_type_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Lookup_App_Notification_Type_Min_Fields = {
  __typename?: 'lookup_app_notification_type_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "lookup.app_notification_type" */
export type Lookup_App_Notification_Type_Mutation_Response = {
  __typename?: 'lookup_app_notification_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Lookup_App_Notification_Type>;
};

/** on_conflict condition type for table "lookup.app_notification_type" */
export type Lookup_App_Notification_Type_On_Conflict = {
  constraint: Lookup_App_Notification_Type_Constraint;
  update_columns?: Array<Lookup_App_Notification_Type_Update_Column>;
  where?: InputMaybe<Lookup_App_Notification_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "lookup.app_notification_type". */
export type Lookup_App_Notification_Type_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: lookup_app_notification_type */
export type Lookup_App_Notification_Type_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "lookup.app_notification_type" */
export enum Lookup_App_Notification_Type_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "lookup.app_notification_type" */
export type Lookup_App_Notification_Type_Set_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "lookup.app_notification_type" */
export enum Lookup_App_Notification_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/**
 * Graphql enum types for content blocks
 *
 *
 * columns and relationships of "lookup.cms_content_block_type"
 *
 */
export type Lookup_Cms_Content_Block_Type = {
  __typename?: 'lookup_cms_content_block_type';
  comment?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

/** aggregated selection of "lookup.cms_content_block_type" */
export type Lookup_Cms_Content_Block_Type_Aggregate = {
  __typename?: 'lookup_cms_content_block_type_aggregate';
  aggregate?: Maybe<Lookup_Cms_Content_Block_Type_Aggregate_Fields>;
  nodes: Array<Lookup_Cms_Content_Block_Type>;
};

/** aggregate fields of "lookup.cms_content_block_type" */
export type Lookup_Cms_Content_Block_Type_Aggregate_Fields = {
  __typename?: 'lookup_cms_content_block_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Lookup_Cms_Content_Block_Type_Max_Fields>;
  min?: Maybe<Lookup_Cms_Content_Block_Type_Min_Fields>;
};


/** aggregate fields of "lookup.cms_content_block_type" */
export type Lookup_Cms_Content_Block_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Lookup_Cms_Content_Block_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "lookup.cms_content_block_type". All fields are combined with a logical 'AND'. */
export type Lookup_Cms_Content_Block_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Lookup_Cms_Content_Block_Type_Bool_Exp>>;
  _not?: InputMaybe<Lookup_Cms_Content_Block_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Lookup_Cms_Content_Block_Type_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "lookup.cms_content_block_type" */
export enum Lookup_Cms_Content_Block_Type_Constraint {
  /** unique or primary key constraint */
  CmsContentBlockTypePkey = 'cms_content_block_type_pkey'
}

export enum Lookup_Cms_Content_Block_Type_Enum {
  Accordions = 'ACCORDIONS',
  AnchorLinks = 'ANCHOR_LINKS',
  Buttons = 'BUTTONS',
  ContentPageMeta = 'CONTENT_PAGE_META',
  Ctas = 'CTAS',
  Eventbrite = 'EVENTBRITE',
  Heading = 'HEADING',
  Hero = 'HERO',
  Iframe = 'IFRAME',
  Image = 'IMAGE',
  ImageGrid = 'IMAGE_GRID',
  Intro = 'INTRO',
  Klaar = 'KLAAR',
  Links = 'LINKS',
  LogoGrid = 'LOGO_GRID',
  MediaGrid = 'MEDIA_GRID',
  MediaPlayer = 'MEDIA_PLAYER',
  MediaPlayerTitleTextButton = 'MEDIA_PLAYER_TITLE_TEXT_BUTTON',
  PageOverview = 'PAGE_OVERVIEW',
  ProjectsSpotlight = 'PROJECTS_SPOTLIGHT',
  Quote = 'QUOTE',
  RichText = 'RICH_TEXT',
  RichTextTwoColumns = 'RICH_TEXT_TWO_COLUMNS',
  Search = 'SEARCH',
  Spotlight = 'SPOTLIGHT',
  Subtitle = 'SUBTITLE',
  Title = 'TITLE',
  TitleImageText = 'TITLE_IMAGE_TEXT',
  TitleImageTextButton = 'TITLE_IMAGE_TEXT_BUTTON',
  UspGrid = 'USP_GRID',
  Video = 'VIDEO',
  VideoTitleTextButton = 'VIDEO_TITLE_TEXT_BUTTON'
}

/** Boolean expression to compare columns of type "lookup_cms_content_block_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_Cms_Content_Block_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Lookup_Cms_Content_Block_Type_Enum>;
  _in?: InputMaybe<Array<Lookup_Cms_Content_Block_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Lookup_Cms_Content_Block_Type_Enum>;
  _nin?: InputMaybe<Array<Lookup_Cms_Content_Block_Type_Enum>>;
};

/** input type for inserting data into table "lookup.cms_content_block_type" */
export type Lookup_Cms_Content_Block_Type_Insert_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Lookup_Cms_Content_Block_Type_Max_Fields = {
  __typename?: 'lookup_cms_content_block_type_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Lookup_Cms_Content_Block_Type_Min_Fields = {
  __typename?: 'lookup_cms_content_block_type_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "lookup.cms_content_block_type" */
export type Lookup_Cms_Content_Block_Type_Mutation_Response = {
  __typename?: 'lookup_cms_content_block_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Lookup_Cms_Content_Block_Type>;
};

/** input type for inserting object relation for remote table "lookup.cms_content_block_type" */
export type Lookup_Cms_Content_Block_Type_Obj_Rel_Insert_Input = {
  data: Lookup_Cms_Content_Block_Type_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Lookup_Cms_Content_Block_Type_On_Conflict>;
};

/** on_conflict condition type for table "lookup.cms_content_block_type" */
export type Lookup_Cms_Content_Block_Type_On_Conflict = {
  constraint: Lookup_Cms_Content_Block_Type_Constraint;
  update_columns?: Array<Lookup_Cms_Content_Block_Type_Update_Column>;
  where?: InputMaybe<Lookup_Cms_Content_Block_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "lookup.cms_content_block_type". */
export type Lookup_Cms_Content_Block_Type_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: lookup_cms_content_block_type */
export type Lookup_Cms_Content_Block_Type_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "lookup.cms_content_block_type" */
export enum Lookup_Cms_Content_Block_Type_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "lookup.cms_content_block_type" */
export type Lookup_Cms_Content_Block_Type_Set_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "lookup.cms_content_block_type" */
export enum Lookup_Cms_Content_Block_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/**
 * GraphQL enum type for content types, e.g. pages, news, projects.
 *
 *
 * columns and relationships of "lookup.cms_content_type"
 *
 */
export type Lookup_Cms_Content_Type = {
  __typename?: 'lookup_cms_content_type';
  comment?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

/** aggregated selection of "lookup.cms_content_type" */
export type Lookup_Cms_Content_Type_Aggregate = {
  __typename?: 'lookup_cms_content_type_aggregate';
  aggregate?: Maybe<Lookup_Cms_Content_Type_Aggregate_Fields>;
  nodes: Array<Lookup_Cms_Content_Type>;
};

/** aggregate fields of "lookup.cms_content_type" */
export type Lookup_Cms_Content_Type_Aggregate_Fields = {
  __typename?: 'lookup_cms_content_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Lookup_Cms_Content_Type_Max_Fields>;
  min?: Maybe<Lookup_Cms_Content_Type_Min_Fields>;
};


/** aggregate fields of "lookup.cms_content_type" */
export type Lookup_Cms_Content_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Lookup_Cms_Content_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "lookup.cms_content_type". All fields are combined with a logical 'AND'. */
export type Lookup_Cms_Content_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Lookup_Cms_Content_Type_Bool_Exp>>;
  _not?: InputMaybe<Lookup_Cms_Content_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Lookup_Cms_Content_Type_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "lookup.cms_content_type" */
export enum Lookup_Cms_Content_Type_Constraint {
  /** unique or primary key constraint */
  CmsContentTypePkey = 'cms_content_type_pkey'
}

export enum Lookup_Cms_Content_Type_Enum {
  /** Pagina */
  Pagina = 'PAGINA'
}

/** Boolean expression to compare columns of type "lookup_cms_content_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_Cms_Content_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Lookup_Cms_Content_Type_Enum>;
  _in?: InputMaybe<Array<Lookup_Cms_Content_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Lookup_Cms_Content_Type_Enum>;
  _nin?: InputMaybe<Array<Lookup_Cms_Content_Type_Enum>>;
};

/** input type for inserting data into table "lookup.cms_content_type" */
export type Lookup_Cms_Content_Type_Insert_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Lookup_Cms_Content_Type_Max_Fields = {
  __typename?: 'lookup_cms_content_type_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Lookup_Cms_Content_Type_Min_Fields = {
  __typename?: 'lookup_cms_content_type_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "lookup.cms_content_type" */
export type Lookup_Cms_Content_Type_Mutation_Response = {
  __typename?: 'lookup_cms_content_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Lookup_Cms_Content_Type>;
};

/** input type for inserting object relation for remote table "lookup.cms_content_type" */
export type Lookup_Cms_Content_Type_Obj_Rel_Insert_Input = {
  data: Lookup_Cms_Content_Type_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Lookup_Cms_Content_Type_On_Conflict>;
};

/** on_conflict condition type for table "lookup.cms_content_type" */
export type Lookup_Cms_Content_Type_On_Conflict = {
  constraint: Lookup_Cms_Content_Type_Constraint;
  update_columns?: Array<Lookup_Cms_Content_Type_Update_Column>;
  where?: InputMaybe<Lookup_Cms_Content_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "lookup.cms_content_type". */
export type Lookup_Cms_Content_Type_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: lookup_cms_content_type */
export type Lookup_Cms_Content_Type_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "lookup.cms_content_type" */
export enum Lookup_Cms_Content_Type_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "lookup.cms_content_type" */
export type Lookup_Cms_Content_Type_Set_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "lookup.cms_content_type" */
export enum Lookup_Cms_Content_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/**
 * de circle of life van een bezoek
 *
 *
 * columns and relationships of "lookup.cp_visit_status"
 *
 */
export type Lookup_Cp_Visit_Status = {
  __typename?: 'lookup_cp_visit_status';
  comment: Scalars['String'];
  value: Scalars['String'];
};

/** aggregated selection of "lookup.cp_visit_status" */
export type Lookup_Cp_Visit_Status_Aggregate = {
  __typename?: 'lookup_cp_visit_status_aggregate';
  aggregate?: Maybe<Lookup_Cp_Visit_Status_Aggregate_Fields>;
  nodes: Array<Lookup_Cp_Visit_Status>;
};

/** aggregate fields of "lookup.cp_visit_status" */
export type Lookup_Cp_Visit_Status_Aggregate_Fields = {
  __typename?: 'lookup_cp_visit_status_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Lookup_Cp_Visit_Status_Max_Fields>;
  min?: Maybe<Lookup_Cp_Visit_Status_Min_Fields>;
};


/** aggregate fields of "lookup.cp_visit_status" */
export type Lookup_Cp_Visit_Status_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Lookup_Cp_Visit_Status_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "lookup.cp_visit_status". All fields are combined with a logical 'AND'. */
export type Lookup_Cp_Visit_Status_Bool_Exp = {
  _and?: InputMaybe<Array<Lookup_Cp_Visit_Status_Bool_Exp>>;
  _not?: InputMaybe<Lookup_Cp_Visit_Status_Bool_Exp>;
  _or?: InputMaybe<Array<Lookup_Cp_Visit_Status_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "lookup.cp_visit_status" */
export enum Lookup_Cp_Visit_Status_Constraint {
  /** unique or primary key constraint */
  CpVisitStatusPkey = 'cp_visit_status_pkey'
}

/** input type for inserting data into table "lookup.cp_visit_status" */
export type Lookup_Cp_Visit_Status_Insert_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Lookup_Cp_Visit_Status_Max_Fields = {
  __typename?: 'lookup_cp_visit_status_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Lookup_Cp_Visit_Status_Min_Fields = {
  __typename?: 'lookup_cp_visit_status_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "lookup.cp_visit_status" */
export type Lookup_Cp_Visit_Status_Mutation_Response = {
  __typename?: 'lookup_cp_visit_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Lookup_Cp_Visit_Status>;
};

/** on_conflict condition type for table "lookup.cp_visit_status" */
export type Lookup_Cp_Visit_Status_On_Conflict = {
  constraint: Lookup_Cp_Visit_Status_Constraint;
  update_columns?: Array<Lookup_Cp_Visit_Status_Update_Column>;
  where?: InputMaybe<Lookup_Cp_Visit_Status_Bool_Exp>;
};

/** Ordering options when selecting data from "lookup.cp_visit_status". */
export type Lookup_Cp_Visit_Status_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: lookup_cp_visit_status */
export type Lookup_Cp_Visit_Status_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "lookup.cp_visit_status" */
export enum Lookup_Cp_Visit_Status_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "lookup.cp_visit_status" */
export type Lookup_Cp_Visit_Status_Set_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "lookup.cp_visit_status" */
export enum Lookup_Cp_Visit_Status_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/**
 * The target group associated with a given audience..
 *
 *
 * columns and relationships of "lookup.schema_audience_type"
 *
 */
export type Lookup_Schema_Audience_Type = {
  __typename?: 'lookup_schema_audience_type';
  comment?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

/** aggregated selection of "lookup.schema_audience_type" */
export type Lookup_Schema_Audience_Type_Aggregate = {
  __typename?: 'lookup_schema_audience_type_aggregate';
  aggregate?: Maybe<Lookup_Schema_Audience_Type_Aggregate_Fields>;
  nodes: Array<Lookup_Schema_Audience_Type>;
};

/** aggregate fields of "lookup.schema_audience_type" */
export type Lookup_Schema_Audience_Type_Aggregate_Fields = {
  __typename?: 'lookup_schema_audience_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Lookup_Schema_Audience_Type_Max_Fields>;
  min?: Maybe<Lookup_Schema_Audience_Type_Min_Fields>;
};


/** aggregate fields of "lookup.schema_audience_type" */
export type Lookup_Schema_Audience_Type_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Lookup_Schema_Audience_Type_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "lookup.schema_audience_type". All fields are combined with a logical 'AND'. */
export type Lookup_Schema_Audience_Type_Bool_Exp = {
  _and?: InputMaybe<Array<Lookup_Schema_Audience_Type_Bool_Exp>>;
  _not?: InputMaybe<Lookup_Schema_Audience_Type_Bool_Exp>;
  _or?: InputMaybe<Array<Lookup_Schema_Audience_Type_Bool_Exp>>;
  comment?: InputMaybe<String_Comparison_Exp>;
  value?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "lookup.schema_audience_type" */
export enum Lookup_Schema_Audience_Type_Constraint {
  /** unique or primary key constraint */
  SchemaAudienceTypePkey = 'schema_audience_type_pkey'
}

export enum Lookup_Schema_Audience_Type_Enum {
  /** The resource is restricted to private access or use. */
  Private = 'PRIVATE',
  /** The resource is intended for public access or use. */
  Public = 'PUBLIC'
}

/** Boolean expression to compare columns of type "lookup_schema_audience_type_enum". All fields are combined with logical 'AND'. */
export type Lookup_Schema_Audience_Type_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Lookup_Schema_Audience_Type_Enum>;
  _in?: InputMaybe<Array<Lookup_Schema_Audience_Type_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Lookup_Schema_Audience_Type_Enum>;
  _nin?: InputMaybe<Array<Lookup_Schema_Audience_Type_Enum>>;
};

/** input type for inserting data into table "lookup.schema_audience_type" */
export type Lookup_Schema_Audience_Type_Insert_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Lookup_Schema_Audience_Type_Max_Fields = {
  __typename?: 'lookup_schema_audience_type_max_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Lookup_Schema_Audience_Type_Min_Fields = {
  __typename?: 'lookup_schema_audience_type_min_fields';
  comment?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "lookup.schema_audience_type" */
export type Lookup_Schema_Audience_Type_Mutation_Response = {
  __typename?: 'lookup_schema_audience_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Lookup_Schema_Audience_Type>;
};

/** on_conflict condition type for table "lookup.schema_audience_type" */
export type Lookup_Schema_Audience_Type_On_Conflict = {
  constraint: Lookup_Schema_Audience_Type_Constraint;
  update_columns?: Array<Lookup_Schema_Audience_Type_Update_Column>;
  where?: InputMaybe<Lookup_Schema_Audience_Type_Bool_Exp>;
};

/** Ordering options when selecting data from "lookup.schema_audience_type". */
export type Lookup_Schema_Audience_Type_Order_By = {
  comment?: InputMaybe<Order_By>;
  value?: InputMaybe<Order_By>;
};

/** primary key columns input for table: lookup_schema_audience_type */
export type Lookup_Schema_Audience_Type_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "lookup.schema_audience_type" */
export enum Lookup_Schema_Audience_Type_Select_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "lookup.schema_audience_type" */
export type Lookup_Schema_Audience_Type_Set_Input = {
  comment?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "lookup.schema_audience_type" */
export enum Lookup_Schema_Audience_Type_Update_Column {
  /** column name */
  Comment = 'comment',
  /** column name */
  Value = 'value'
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "app.notification" */
  delete_app_notification?: Maybe<App_Notification_Mutation_Response>;
  /** delete single row from the table: "app.notification" */
  delete_app_notification_by_pk?: Maybe<App_Notification>;
  /** delete data from the table: "cms.content" */
  delete_cms_content?: Maybe<Cms_Content_Mutation_Response>;
  /** delete data from the table: "cms.content_blocks" */
  delete_cms_content_blocks?: Maybe<Cms_Content_Blocks_Mutation_Response>;
  /** delete single row from the table: "cms.content_blocks" */
  delete_cms_content_blocks_by_pk?: Maybe<Cms_Content_Blocks>;
  /** delete single row from the table: "cms.content" */
  delete_cms_content_by_pk?: Maybe<Cms_Content>;
  /** delete data from the table: "cms.content_content_labels" */
  delete_cms_content_content_labels?: Maybe<Cms_Content_Content_Labels_Mutation_Response>;
  /** delete single row from the table: "cms.content_content_labels" */
  delete_cms_content_content_labels_by_pk?: Maybe<Cms_Content_Content_Labels>;
  /** delete data from the table: "cms.content_labels" */
  delete_cms_content_labels?: Maybe<Cms_Content_Labels_Mutation_Response>;
  /** delete single row from the table: "cms.content_labels" */
  delete_cms_content_labels_by_pk?: Maybe<Cms_Content_Labels>;
  /** delete data from the table: "cms.navigation_element" */
  delete_cms_navigation_element?: Maybe<Cms_Navigation_Element_Mutation_Response>;
  /** delete single row from the table: "cms.navigation_element" */
  delete_cms_navigation_element_by_pk?: Maybe<Cms_Navigation_Element>;
  /** delete data from the table: "cms.site_variables" */
  delete_cms_site_variables?: Maybe<Cms_Site_Variables_Mutation_Response>;
  /** delete single row from the table: "cms.site_variables" */
  delete_cms_site_variables_by_pk?: Maybe<Cms_Site_Variables>;
  /** delete data from the table: "cp.index" */
  delete_cp_index?: Maybe<Cp_Index_Mutation_Response>;
  /** delete single row from the table: "cp.index" */
  delete_cp_index_by_pk?: Maybe<Cp_Index>;
  /** delete data from the table: "cp.maintainer" */
  delete_cp_maintainer?: Maybe<Cp_Maintainer_Mutation_Response>;
  /** delete single row from the table: "cp.maintainer" */
  delete_cp_maintainer_by_pk?: Maybe<Cp_Maintainer>;
  /** delete data from the table: "cp.maintainer_users_profile" */
  delete_cp_maintainer_users_profile?: Maybe<Cp_Maintainer_Users_Profile_Mutation_Response>;
  /** delete single row from the table: "cp.maintainer_users_profile" */
  delete_cp_maintainer_users_profile_by_pk?: Maybe<Cp_Maintainer_Users_Profile>;
  /** delete data from the table: "cp.space" */
  delete_cp_space?: Maybe<Cp_Space_Mutation_Response>;
  /** delete single row from the table: "cp.space" */
  delete_cp_space_by_pk?: Maybe<Cp_Space>;
  /** delete data from the table: "cp.visit" */
  delete_cp_visit?: Maybe<Cp_Visit_Mutation_Response>;
  /** delete single row from the table: "cp.visit" */
  delete_cp_visit_by_pk?: Maybe<Cp_Visit>;
  /** delete data from the table: "cp.visit_note" */
  delete_cp_visit_note?: Maybe<Cp_Visit_Note_Mutation_Response>;
  /** delete single row from the table: "cp.visit_note" */
  delete_cp_visit_note_by_pk?: Maybe<Cp_Visit_Note>;
  /** delete data from the table: "lookup.app_notification_type" */
  delete_lookup_app_notification_type?: Maybe<Lookup_App_Notification_Type_Mutation_Response>;
  /** delete single row from the table: "lookup.app_notification_type" */
  delete_lookup_app_notification_type_by_pk?: Maybe<Lookup_App_Notification_Type>;
  /** delete data from the table: "lookup.cms_content_block_type" */
  delete_lookup_cms_content_block_type?: Maybe<Lookup_Cms_Content_Block_Type_Mutation_Response>;
  /** delete single row from the table: "lookup.cms_content_block_type" */
  delete_lookup_cms_content_block_type_by_pk?: Maybe<Lookup_Cms_Content_Block_Type>;
  /** delete data from the table: "lookup.cms_content_type" */
  delete_lookup_cms_content_type?: Maybe<Lookup_Cms_Content_Type_Mutation_Response>;
  /** delete single row from the table: "lookup.cms_content_type" */
  delete_lookup_cms_content_type_by_pk?: Maybe<Lookup_Cms_Content_Type>;
  /** delete data from the table: "lookup.cp_visit_status" */
  delete_lookup_cp_visit_status?: Maybe<Lookup_Cp_Visit_Status_Mutation_Response>;
  /** delete single row from the table: "lookup.cp_visit_status" */
  delete_lookup_cp_visit_status_by_pk?: Maybe<Lookup_Cp_Visit_Status>;
  /** delete data from the table: "lookup.schema_audience_type" */
  delete_lookup_schema_audience_type?: Maybe<Lookup_Schema_Audience_Type_Mutation_Response>;
  /** delete single row from the table: "lookup.schema_audience_type" */
  delete_lookup_schema_audience_type_by_pk?: Maybe<Lookup_Schema_Audience_Type>;
  /** delete data from the table: "object.file" */
  delete_object_file?: Maybe<Object_File_Mutation_Response>;
  /** delete single row from the table: "object.file" */
  delete_object_file_by_pk?: Maybe<Object_File>;
  /** delete data from the table: "object.ie" */
  delete_object_ie?: Maybe<Object_Ie_Mutation_Response>;
  /** delete single row from the table: "object.ie" */
  delete_object_ie_by_pk?: Maybe<Object_Ie>;
  /** delete data from the table: "object.representation" */
  delete_object_representation?: Maybe<Object_Representation_Mutation_Response>;
  /** delete single row from the table: "object.representation" */
  delete_object_representation_by_pk?: Maybe<Object_Representation>;
  /** delete data from the table: "sync.audio" */
  delete_sync_audio?: Maybe<Sync_Audio_Mutation_Response>;
  /** delete single row from the table: "sync.audio" */
  delete_sync_audio_by_pk?: Maybe<Sync_Audio>;
  /** delete data from the table: "sync.film" */
  delete_sync_film?: Maybe<Sync_Film_Mutation_Response>;
  /** delete single row from the table: "sync.film" */
  delete_sync_film_by_pk?: Maybe<Sync_Film>;
  /** delete data from the table: "sync.video" */
  delete_sync_video?: Maybe<Sync_Video_Mutation_Response>;
  /** delete single row from the table: "sync.video" */
  delete_sync_video_by_pk?: Maybe<Sync_Video>;
  /** delete data from the table: "users.collection" */
  delete_users_collection?: Maybe<Users_Collection_Mutation_Response>;
  /** delete single row from the table: "users.collection" */
  delete_users_collection_by_pk?: Maybe<Users_Collection>;
  /** delete data from the table: "users.collection_ie" */
  delete_users_collection_ie?: Maybe<Users_Collection_Ie_Mutation_Response>;
  /** delete single row from the table: "users.collection_ie" */
  delete_users_collection_ie_by_pk?: Maybe<Users_Collection_Ie>;
  /** delete data from the table: "users.group" */
  delete_users_group?: Maybe<Users_Group_Mutation_Response>;
  /** delete single row from the table: "users.group" */
  delete_users_group_by_pk?: Maybe<Users_Group>;
  /** delete data from the table: "users.group_permission" */
  delete_users_group_permission?: Maybe<Users_Group_Permission_Mutation_Response>;
  /** delete single row from the table: "users.group_permission" */
  delete_users_group_permission_by_pk?: Maybe<Users_Group_Permission>;
  /** delete data from the table: "users.identity" */
  delete_users_identity?: Maybe<Users_Identity_Mutation_Response>;
  /** delete single row from the table: "users.identity" */
  delete_users_identity_by_pk?: Maybe<Users_Identity>;
  /** delete data from the table: "users.identity_provider" */
  delete_users_identity_provider?: Maybe<Users_Identity_Provider_Mutation_Response>;
  /** delete single row from the table: "users.identity_provider" */
  delete_users_identity_provider_by_pk?: Maybe<Users_Identity_Provider>;
  /** delete data from the table: "users.permission" */
  delete_users_permission?: Maybe<Users_Permission_Mutation_Response>;
  /** delete single row from the table: "users.permission" */
  delete_users_permission_by_pk?: Maybe<Users_Permission>;
  /** delete data from the table: "users.profile" */
  delete_users_profile?: Maybe<Users_Profile_Mutation_Response>;
  /** delete single row from the table: "users.profile" */
  delete_users_profile_by_pk?: Maybe<Users_Profile>;
  /** insert data into the table: "app.notification" */
  insert_app_notification?: Maybe<App_Notification_Mutation_Response>;
  /** insert a single row into the table: "app.notification" */
  insert_app_notification_one?: Maybe<App_Notification>;
  /** insert data into the table: "cms.content" */
  insert_cms_content?: Maybe<Cms_Content_Mutation_Response>;
  /** insert data into the table: "cms.content_blocks" */
  insert_cms_content_blocks?: Maybe<Cms_Content_Blocks_Mutation_Response>;
  /** insert a single row into the table: "cms.content_blocks" */
  insert_cms_content_blocks_one?: Maybe<Cms_Content_Blocks>;
  /** insert data into the table: "cms.content_content_labels" */
  insert_cms_content_content_labels?: Maybe<Cms_Content_Content_Labels_Mutation_Response>;
  /** insert a single row into the table: "cms.content_content_labels" */
  insert_cms_content_content_labels_one?: Maybe<Cms_Content_Content_Labels>;
  /** insert data into the table: "cms.content_labels" */
  insert_cms_content_labels?: Maybe<Cms_Content_Labels_Mutation_Response>;
  /** insert a single row into the table: "cms.content_labels" */
  insert_cms_content_labels_one?: Maybe<Cms_Content_Labels>;
  /** insert a single row into the table: "cms.content" */
  insert_cms_content_one?: Maybe<Cms_Content>;
  /** insert data into the table: "cms.navigation_element" */
  insert_cms_navigation_element?: Maybe<Cms_Navigation_Element_Mutation_Response>;
  /** insert a single row into the table: "cms.navigation_element" */
  insert_cms_navigation_element_one?: Maybe<Cms_Navigation_Element>;
  /** insert data into the table: "cms.site_variables" */
  insert_cms_site_variables?: Maybe<Cms_Site_Variables_Mutation_Response>;
  /** insert a single row into the table: "cms.site_variables" */
  insert_cms_site_variables_one?: Maybe<Cms_Site_Variables>;
  /** insert data into the table: "cp.index" */
  insert_cp_index?: Maybe<Cp_Index_Mutation_Response>;
  /** insert a single row into the table: "cp.index" */
  insert_cp_index_one?: Maybe<Cp_Index>;
  /** insert data into the table: "cp.maintainer" */
  insert_cp_maintainer?: Maybe<Cp_Maintainer_Mutation_Response>;
  /** insert a single row into the table: "cp.maintainer" */
  insert_cp_maintainer_one?: Maybe<Cp_Maintainer>;
  /** insert data into the table: "cp.maintainer_users_profile" */
  insert_cp_maintainer_users_profile?: Maybe<Cp_Maintainer_Users_Profile_Mutation_Response>;
  /** insert a single row into the table: "cp.maintainer_users_profile" */
  insert_cp_maintainer_users_profile_one?: Maybe<Cp_Maintainer_Users_Profile>;
  /** insert data into the table: "cp.space" */
  insert_cp_space?: Maybe<Cp_Space_Mutation_Response>;
  /** insert a single row into the table: "cp.space" */
  insert_cp_space_one?: Maybe<Cp_Space>;
  /** insert data into the table: "cp.visit" */
  insert_cp_visit?: Maybe<Cp_Visit_Mutation_Response>;
  /** insert data into the table: "cp.visit_note" */
  insert_cp_visit_note?: Maybe<Cp_Visit_Note_Mutation_Response>;
  /** insert a single row into the table: "cp.visit_note" */
  insert_cp_visit_note_one?: Maybe<Cp_Visit_Note>;
  /** insert a single row into the table: "cp.visit" */
  insert_cp_visit_one?: Maybe<Cp_Visit>;
  /** insert data into the table: "lookup.app_notification_type" */
  insert_lookup_app_notification_type?: Maybe<Lookup_App_Notification_Type_Mutation_Response>;
  /** insert a single row into the table: "lookup.app_notification_type" */
  insert_lookup_app_notification_type_one?: Maybe<Lookup_App_Notification_Type>;
  /** insert data into the table: "lookup.cms_content_block_type" */
  insert_lookup_cms_content_block_type?: Maybe<Lookup_Cms_Content_Block_Type_Mutation_Response>;
  /** insert a single row into the table: "lookup.cms_content_block_type" */
  insert_lookup_cms_content_block_type_one?: Maybe<Lookup_Cms_Content_Block_Type>;
  /** insert data into the table: "lookup.cms_content_type" */
  insert_lookup_cms_content_type?: Maybe<Lookup_Cms_Content_Type_Mutation_Response>;
  /** insert a single row into the table: "lookup.cms_content_type" */
  insert_lookup_cms_content_type_one?: Maybe<Lookup_Cms_Content_Type>;
  /** insert data into the table: "lookup.cp_visit_status" */
  insert_lookup_cp_visit_status?: Maybe<Lookup_Cp_Visit_Status_Mutation_Response>;
  /** insert a single row into the table: "lookup.cp_visit_status" */
  insert_lookup_cp_visit_status_one?: Maybe<Lookup_Cp_Visit_Status>;
  /** insert data into the table: "lookup.schema_audience_type" */
  insert_lookup_schema_audience_type?: Maybe<Lookup_Schema_Audience_Type_Mutation_Response>;
  /** insert a single row into the table: "lookup.schema_audience_type" */
  insert_lookup_schema_audience_type_one?: Maybe<Lookup_Schema_Audience_Type>;
  /** insert data into the table: "object.file" */
  insert_object_file?: Maybe<Object_File_Mutation_Response>;
  /** insert a single row into the table: "object.file" */
  insert_object_file_one?: Maybe<Object_File>;
  /** insert data into the table: "object.ie" */
  insert_object_ie?: Maybe<Object_Ie_Mutation_Response>;
  /** insert a single row into the table: "object.ie" */
  insert_object_ie_one?: Maybe<Object_Ie>;
  /** insert data into the table: "object.representation" */
  insert_object_representation?: Maybe<Object_Representation_Mutation_Response>;
  /** insert a single row into the table: "object.representation" */
  insert_object_representation_one?: Maybe<Object_Representation>;
  /** insert data into the table: "sync.audio" */
  insert_sync_audio?: Maybe<Sync_Audio_Mutation_Response>;
  /** insert a single row into the table: "sync.audio" */
  insert_sync_audio_one?: Maybe<Sync_Audio>;
  /** insert data into the table: "sync.film" */
  insert_sync_film?: Maybe<Sync_Film_Mutation_Response>;
  /** insert a single row into the table: "sync.film" */
  insert_sync_film_one?: Maybe<Sync_Film>;
  /** insert data into the table: "sync.video" */
  insert_sync_video?: Maybe<Sync_Video_Mutation_Response>;
  /** insert a single row into the table: "sync.video" */
  insert_sync_video_one?: Maybe<Sync_Video>;
  /** insert data into the table: "users.collection" */
  insert_users_collection?: Maybe<Users_Collection_Mutation_Response>;
  /** insert data into the table: "users.collection_ie" */
  insert_users_collection_ie?: Maybe<Users_Collection_Ie_Mutation_Response>;
  /** insert a single row into the table: "users.collection_ie" */
  insert_users_collection_ie_one?: Maybe<Users_Collection_Ie>;
  /** insert a single row into the table: "users.collection" */
  insert_users_collection_one?: Maybe<Users_Collection>;
  /** insert data into the table: "users.group" */
  insert_users_group?: Maybe<Users_Group_Mutation_Response>;
  /** insert a single row into the table: "users.group" */
  insert_users_group_one?: Maybe<Users_Group>;
  /** insert data into the table: "users.group_permission" */
  insert_users_group_permission?: Maybe<Users_Group_Permission_Mutation_Response>;
  /** insert a single row into the table: "users.group_permission" */
  insert_users_group_permission_one?: Maybe<Users_Group_Permission>;
  /** insert data into the table: "users.identity" */
  insert_users_identity?: Maybe<Users_Identity_Mutation_Response>;
  /** insert a single row into the table: "users.identity" */
  insert_users_identity_one?: Maybe<Users_Identity>;
  /** insert data into the table: "users.identity_provider" */
  insert_users_identity_provider?: Maybe<Users_Identity_Provider_Mutation_Response>;
  /** insert a single row into the table: "users.identity_provider" */
  insert_users_identity_provider_one?: Maybe<Users_Identity_Provider>;
  /** insert data into the table: "users.permission" */
  insert_users_permission?: Maybe<Users_Permission_Mutation_Response>;
  /** insert a single row into the table: "users.permission" */
  insert_users_permission_one?: Maybe<Users_Permission>;
  /** insert data into the table: "users.profile" */
  insert_users_profile?: Maybe<Users_Profile_Mutation_Response>;
  /** insert a single row into the table: "users.profile" */
  insert_users_profile_one?: Maybe<Users_Profile>;
  /** update data of the table: "app.notification" */
  update_app_notification?: Maybe<App_Notification_Mutation_Response>;
  /** update single row of the table: "app.notification" */
  update_app_notification_by_pk?: Maybe<App_Notification>;
  /** update data of the table: "cms.content" */
  update_cms_content?: Maybe<Cms_Content_Mutation_Response>;
  /** update data of the table: "cms.content_blocks" */
  update_cms_content_blocks?: Maybe<Cms_Content_Blocks_Mutation_Response>;
  /** update single row of the table: "cms.content_blocks" */
  update_cms_content_blocks_by_pk?: Maybe<Cms_Content_Blocks>;
  /** update single row of the table: "cms.content" */
  update_cms_content_by_pk?: Maybe<Cms_Content>;
  /** update data of the table: "cms.content_content_labels" */
  update_cms_content_content_labels?: Maybe<Cms_Content_Content_Labels_Mutation_Response>;
  /** update single row of the table: "cms.content_content_labels" */
  update_cms_content_content_labels_by_pk?: Maybe<Cms_Content_Content_Labels>;
  /** update data of the table: "cms.content_labels" */
  update_cms_content_labels?: Maybe<Cms_Content_Labels_Mutation_Response>;
  /** update single row of the table: "cms.content_labels" */
  update_cms_content_labels_by_pk?: Maybe<Cms_Content_Labels>;
  /** update data of the table: "cms.navigation_element" */
  update_cms_navigation_element?: Maybe<Cms_Navigation_Element_Mutation_Response>;
  /** update single row of the table: "cms.navigation_element" */
  update_cms_navigation_element_by_pk?: Maybe<Cms_Navigation_Element>;
  /** update data of the table: "cms.site_variables" */
  update_cms_site_variables?: Maybe<Cms_Site_Variables_Mutation_Response>;
  /** update single row of the table: "cms.site_variables" */
  update_cms_site_variables_by_pk?: Maybe<Cms_Site_Variables>;
  /** update data of the table: "cp.index" */
  update_cp_index?: Maybe<Cp_Index_Mutation_Response>;
  /** update single row of the table: "cp.index" */
  update_cp_index_by_pk?: Maybe<Cp_Index>;
  /** update data of the table: "cp.maintainer" */
  update_cp_maintainer?: Maybe<Cp_Maintainer_Mutation_Response>;
  /** update single row of the table: "cp.maintainer" */
  update_cp_maintainer_by_pk?: Maybe<Cp_Maintainer>;
  /** update data of the table: "cp.maintainer_users_profile" */
  update_cp_maintainer_users_profile?: Maybe<Cp_Maintainer_Users_Profile_Mutation_Response>;
  /** update single row of the table: "cp.maintainer_users_profile" */
  update_cp_maintainer_users_profile_by_pk?: Maybe<Cp_Maintainer_Users_Profile>;
  /** update data of the table: "cp.space" */
  update_cp_space?: Maybe<Cp_Space_Mutation_Response>;
  /** update single row of the table: "cp.space" */
  update_cp_space_by_pk?: Maybe<Cp_Space>;
  /** update data of the table: "cp.visit" */
  update_cp_visit?: Maybe<Cp_Visit_Mutation_Response>;
  /** update single row of the table: "cp.visit" */
  update_cp_visit_by_pk?: Maybe<Cp_Visit>;
  /** update data of the table: "cp.visit_note" */
  update_cp_visit_note?: Maybe<Cp_Visit_Note_Mutation_Response>;
  /** update single row of the table: "cp.visit_note" */
  update_cp_visit_note_by_pk?: Maybe<Cp_Visit_Note>;
  /** update data of the table: "lookup.app_notification_type" */
  update_lookup_app_notification_type?: Maybe<Lookup_App_Notification_Type_Mutation_Response>;
  /** update single row of the table: "lookup.app_notification_type" */
  update_lookup_app_notification_type_by_pk?: Maybe<Lookup_App_Notification_Type>;
  /** update data of the table: "lookup.cms_content_block_type" */
  update_lookup_cms_content_block_type?: Maybe<Lookup_Cms_Content_Block_Type_Mutation_Response>;
  /** update single row of the table: "lookup.cms_content_block_type" */
  update_lookup_cms_content_block_type_by_pk?: Maybe<Lookup_Cms_Content_Block_Type>;
  /** update data of the table: "lookup.cms_content_type" */
  update_lookup_cms_content_type?: Maybe<Lookup_Cms_Content_Type_Mutation_Response>;
  /** update single row of the table: "lookup.cms_content_type" */
  update_lookup_cms_content_type_by_pk?: Maybe<Lookup_Cms_Content_Type>;
  /** update data of the table: "lookup.cp_visit_status" */
  update_lookup_cp_visit_status?: Maybe<Lookup_Cp_Visit_Status_Mutation_Response>;
  /** update single row of the table: "lookup.cp_visit_status" */
  update_lookup_cp_visit_status_by_pk?: Maybe<Lookup_Cp_Visit_Status>;
  /** update data of the table: "lookup.schema_audience_type" */
  update_lookup_schema_audience_type?: Maybe<Lookup_Schema_Audience_Type_Mutation_Response>;
  /** update single row of the table: "lookup.schema_audience_type" */
  update_lookup_schema_audience_type_by_pk?: Maybe<Lookup_Schema_Audience_Type>;
  /** update data of the table: "object.file" */
  update_object_file?: Maybe<Object_File_Mutation_Response>;
  /** update single row of the table: "object.file" */
  update_object_file_by_pk?: Maybe<Object_File>;
  /** update data of the table: "object.ie" */
  update_object_ie?: Maybe<Object_Ie_Mutation_Response>;
  /** update single row of the table: "object.ie" */
  update_object_ie_by_pk?: Maybe<Object_Ie>;
  /** update data of the table: "object.representation" */
  update_object_representation?: Maybe<Object_Representation_Mutation_Response>;
  /** update single row of the table: "object.representation" */
  update_object_representation_by_pk?: Maybe<Object_Representation>;
  /** update data of the table: "sync.audio" */
  update_sync_audio?: Maybe<Sync_Audio_Mutation_Response>;
  /** update single row of the table: "sync.audio" */
  update_sync_audio_by_pk?: Maybe<Sync_Audio>;
  /** update data of the table: "sync.film" */
  update_sync_film?: Maybe<Sync_Film_Mutation_Response>;
  /** update single row of the table: "sync.film" */
  update_sync_film_by_pk?: Maybe<Sync_Film>;
  /** update data of the table: "sync.video" */
  update_sync_video?: Maybe<Sync_Video_Mutation_Response>;
  /** update single row of the table: "sync.video" */
  update_sync_video_by_pk?: Maybe<Sync_Video>;
  /** update data of the table: "users.collection" */
  update_users_collection?: Maybe<Users_Collection_Mutation_Response>;
  /** update single row of the table: "users.collection" */
  update_users_collection_by_pk?: Maybe<Users_Collection>;
  /** update data of the table: "users.collection_ie" */
  update_users_collection_ie?: Maybe<Users_Collection_Ie_Mutation_Response>;
  /** update single row of the table: "users.collection_ie" */
  update_users_collection_ie_by_pk?: Maybe<Users_Collection_Ie>;
  /** update data of the table: "users.group" */
  update_users_group?: Maybe<Users_Group_Mutation_Response>;
  /** update single row of the table: "users.group" */
  update_users_group_by_pk?: Maybe<Users_Group>;
  /** update data of the table: "users.group_permission" */
  update_users_group_permission?: Maybe<Users_Group_Permission_Mutation_Response>;
  /** update single row of the table: "users.group_permission" */
  update_users_group_permission_by_pk?: Maybe<Users_Group_Permission>;
  /** update data of the table: "users.identity" */
  update_users_identity?: Maybe<Users_Identity_Mutation_Response>;
  /** update single row of the table: "users.identity" */
  update_users_identity_by_pk?: Maybe<Users_Identity>;
  /** update data of the table: "users.identity_provider" */
  update_users_identity_provider?: Maybe<Users_Identity_Provider_Mutation_Response>;
  /** update single row of the table: "users.identity_provider" */
  update_users_identity_provider_by_pk?: Maybe<Users_Identity_Provider>;
  /** update data of the table: "users.permission" */
  update_users_permission?: Maybe<Users_Permission_Mutation_Response>;
  /** update single row of the table: "users.permission" */
  update_users_permission_by_pk?: Maybe<Users_Permission>;
  /** update data of the table: "users.profile" */
  update_users_profile?: Maybe<Users_Profile_Mutation_Response>;
  /** update single row of the table: "users.profile" */
  update_users_profile_by_pk?: Maybe<Users_Profile>;
};


/** mutation root */
export type Mutation_RootDelete_App_NotificationArgs = {
  where: App_Notification_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_App_Notification_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Cms_ContentArgs = {
  where: Cms_Content_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cms_Content_BlocksArgs = {
  where: Cms_Content_Blocks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cms_Content_Blocks_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Cms_Content_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Cms_Content_Content_LabelsArgs = {
  where: Cms_Content_Content_Labels_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cms_Content_Content_Labels_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Cms_Content_LabelsArgs = {
  where: Cms_Content_Labels_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cms_Content_Labels_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Cms_Navigation_ElementArgs = {
  where: Cms_Navigation_Element_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cms_Navigation_Element_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Cms_Site_VariablesArgs = {
  where: Cms_Site_Variables_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cms_Site_Variables_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Cp_IndexArgs = {
  where: Cp_Index_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cp_Index_By_PkArgs = {
  schema_maintainer_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Cp_MaintainerArgs = {
  where: Cp_Maintainer_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cp_Maintainer_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Cp_Maintainer_Users_ProfileArgs = {
  where: Cp_Maintainer_Users_Profile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cp_Maintainer_Users_Profile_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Cp_SpaceArgs = {
  where: Cp_Space_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cp_Space_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Cp_VisitArgs = {
  where: Cp_Visit_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cp_Visit_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Cp_Visit_NoteArgs = {
  where: Cp_Visit_Note_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cp_Visit_Note_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Lookup_App_Notification_TypeArgs = {
  where: Lookup_App_Notification_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Lookup_App_Notification_Type_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Lookup_Cms_Content_Block_TypeArgs = {
  where: Lookup_Cms_Content_Block_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Lookup_Cms_Content_Block_Type_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Lookup_Cms_Content_TypeArgs = {
  where: Lookup_Cms_Content_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Lookup_Cms_Content_Type_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Lookup_Cp_Visit_StatusArgs = {
  where: Lookup_Cp_Visit_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Lookup_Cp_Visit_Status_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Lookup_Schema_Audience_TypeArgs = {
  where: Lookup_Schema_Audience_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Lookup_Schema_Audience_Type_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Object_FileArgs = {
  where: Object_File_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Object_File_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Object_IeArgs = {
  where: Object_Ie_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Object_Ie_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Object_RepresentationArgs = {
  where: Object_Representation_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Object_Representation_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Sync_AudioArgs = {
  where: Sync_Audio_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Sync_Audio_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Sync_FilmArgs = {
  where: Sync_Film_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Sync_Film_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Sync_VideoArgs = {
  where: Sync_Video_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Sync_Video_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Users_CollectionArgs = {
  where: Users_Collection_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Collection_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Users_Collection_IeArgs = {
  where: Users_Collection_Ie_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Collection_Ie_By_PkArgs = {
  ie_schema_identifier: Scalars['String'];
  user_collection_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Users_GroupArgs = {
  where: Users_Group_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Group_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Users_Group_PermissionArgs = {
  where: Users_Group_Permission_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Group_Permission_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Users_IdentityArgs = {
  where: Users_Identity_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Identity_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Users_Identity_ProviderArgs = {
  where: Users_Identity_Provider_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Identity_Provider_By_PkArgs = {
  name: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Users_PermissionArgs = {
  where: Users_Permission_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Permission_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Users_ProfileArgs = {
  where: Users_Profile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_Profile_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_App_NotificationArgs = {
  objects: Array<App_Notification_Insert_Input>;
  on_conflict?: InputMaybe<App_Notification_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_App_Notification_OneArgs = {
  object: App_Notification_Insert_Input;
  on_conflict?: InputMaybe<App_Notification_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cms_ContentArgs = {
  objects: Array<Cms_Content_Insert_Input>;
  on_conflict?: InputMaybe<Cms_Content_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cms_Content_BlocksArgs = {
  objects: Array<Cms_Content_Blocks_Insert_Input>;
  on_conflict?: InputMaybe<Cms_Content_Blocks_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cms_Content_Blocks_OneArgs = {
  object: Cms_Content_Blocks_Insert_Input;
  on_conflict?: InputMaybe<Cms_Content_Blocks_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cms_Content_Content_LabelsArgs = {
  objects: Array<Cms_Content_Content_Labels_Insert_Input>;
  on_conflict?: InputMaybe<Cms_Content_Content_Labels_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cms_Content_Content_Labels_OneArgs = {
  object: Cms_Content_Content_Labels_Insert_Input;
  on_conflict?: InputMaybe<Cms_Content_Content_Labels_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cms_Content_LabelsArgs = {
  objects: Array<Cms_Content_Labels_Insert_Input>;
  on_conflict?: InputMaybe<Cms_Content_Labels_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cms_Content_Labels_OneArgs = {
  object: Cms_Content_Labels_Insert_Input;
  on_conflict?: InputMaybe<Cms_Content_Labels_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cms_Content_OneArgs = {
  object: Cms_Content_Insert_Input;
  on_conflict?: InputMaybe<Cms_Content_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cms_Navigation_ElementArgs = {
  objects: Array<Cms_Navigation_Element_Insert_Input>;
  on_conflict?: InputMaybe<Cms_Navigation_Element_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cms_Navigation_Element_OneArgs = {
  object: Cms_Navigation_Element_Insert_Input;
  on_conflict?: InputMaybe<Cms_Navigation_Element_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cms_Site_VariablesArgs = {
  objects: Array<Cms_Site_Variables_Insert_Input>;
  on_conflict?: InputMaybe<Cms_Site_Variables_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cms_Site_Variables_OneArgs = {
  object: Cms_Site_Variables_Insert_Input;
  on_conflict?: InputMaybe<Cms_Site_Variables_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cp_IndexArgs = {
  objects: Array<Cp_Index_Insert_Input>;
  on_conflict?: InputMaybe<Cp_Index_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cp_Index_OneArgs = {
  object: Cp_Index_Insert_Input;
  on_conflict?: InputMaybe<Cp_Index_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cp_MaintainerArgs = {
  objects: Array<Cp_Maintainer_Insert_Input>;
  on_conflict?: InputMaybe<Cp_Maintainer_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cp_Maintainer_OneArgs = {
  object: Cp_Maintainer_Insert_Input;
  on_conflict?: InputMaybe<Cp_Maintainer_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cp_Maintainer_Users_ProfileArgs = {
  objects: Array<Cp_Maintainer_Users_Profile_Insert_Input>;
  on_conflict?: InputMaybe<Cp_Maintainer_Users_Profile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cp_Maintainer_Users_Profile_OneArgs = {
  object: Cp_Maintainer_Users_Profile_Insert_Input;
  on_conflict?: InputMaybe<Cp_Maintainer_Users_Profile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cp_SpaceArgs = {
  objects: Array<Cp_Space_Insert_Input>;
  on_conflict?: InputMaybe<Cp_Space_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cp_Space_OneArgs = {
  object: Cp_Space_Insert_Input;
  on_conflict?: InputMaybe<Cp_Space_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cp_VisitArgs = {
  objects: Array<Cp_Visit_Insert_Input>;
  on_conflict?: InputMaybe<Cp_Visit_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cp_Visit_NoteArgs = {
  objects: Array<Cp_Visit_Note_Insert_Input>;
  on_conflict?: InputMaybe<Cp_Visit_Note_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cp_Visit_Note_OneArgs = {
  object: Cp_Visit_Note_Insert_Input;
  on_conflict?: InputMaybe<Cp_Visit_Note_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cp_Visit_OneArgs = {
  object: Cp_Visit_Insert_Input;
  on_conflict?: InputMaybe<Cp_Visit_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_App_Notification_TypeArgs = {
  objects: Array<Lookup_App_Notification_Type_Insert_Input>;
  on_conflict?: InputMaybe<Lookup_App_Notification_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_App_Notification_Type_OneArgs = {
  object: Lookup_App_Notification_Type_Insert_Input;
  on_conflict?: InputMaybe<Lookup_App_Notification_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_Cms_Content_Block_TypeArgs = {
  objects: Array<Lookup_Cms_Content_Block_Type_Insert_Input>;
  on_conflict?: InputMaybe<Lookup_Cms_Content_Block_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_Cms_Content_Block_Type_OneArgs = {
  object: Lookup_Cms_Content_Block_Type_Insert_Input;
  on_conflict?: InputMaybe<Lookup_Cms_Content_Block_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_Cms_Content_TypeArgs = {
  objects: Array<Lookup_Cms_Content_Type_Insert_Input>;
  on_conflict?: InputMaybe<Lookup_Cms_Content_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_Cms_Content_Type_OneArgs = {
  object: Lookup_Cms_Content_Type_Insert_Input;
  on_conflict?: InputMaybe<Lookup_Cms_Content_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_Cp_Visit_StatusArgs = {
  objects: Array<Lookup_Cp_Visit_Status_Insert_Input>;
  on_conflict?: InputMaybe<Lookup_Cp_Visit_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_Cp_Visit_Status_OneArgs = {
  object: Lookup_Cp_Visit_Status_Insert_Input;
  on_conflict?: InputMaybe<Lookup_Cp_Visit_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_Schema_Audience_TypeArgs = {
  objects: Array<Lookup_Schema_Audience_Type_Insert_Input>;
  on_conflict?: InputMaybe<Lookup_Schema_Audience_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Lookup_Schema_Audience_Type_OneArgs = {
  object: Lookup_Schema_Audience_Type_Insert_Input;
  on_conflict?: InputMaybe<Lookup_Schema_Audience_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Object_FileArgs = {
  objects: Array<Object_File_Insert_Input>;
  on_conflict?: InputMaybe<Object_File_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Object_File_OneArgs = {
  object: Object_File_Insert_Input;
  on_conflict?: InputMaybe<Object_File_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Object_IeArgs = {
  objects: Array<Object_Ie_Insert_Input>;
  on_conflict?: InputMaybe<Object_Ie_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Object_Ie_OneArgs = {
  object: Object_Ie_Insert_Input;
  on_conflict?: InputMaybe<Object_Ie_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Object_RepresentationArgs = {
  objects: Array<Object_Representation_Insert_Input>;
  on_conflict?: InputMaybe<Object_Representation_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Object_Representation_OneArgs = {
  object: Object_Representation_Insert_Input;
  on_conflict?: InputMaybe<Object_Representation_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sync_AudioArgs = {
  objects: Array<Sync_Audio_Insert_Input>;
  on_conflict?: InputMaybe<Sync_Audio_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sync_Audio_OneArgs = {
  object: Sync_Audio_Insert_Input;
  on_conflict?: InputMaybe<Sync_Audio_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sync_FilmArgs = {
  objects: Array<Sync_Film_Insert_Input>;
  on_conflict?: InputMaybe<Sync_Film_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sync_Film_OneArgs = {
  object: Sync_Film_Insert_Input;
  on_conflict?: InputMaybe<Sync_Film_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sync_VideoArgs = {
  objects: Array<Sync_Video_Insert_Input>;
  on_conflict?: InputMaybe<Sync_Video_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sync_Video_OneArgs = {
  object: Sync_Video_Insert_Input;
  on_conflict?: InputMaybe<Sync_Video_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_CollectionArgs = {
  objects: Array<Users_Collection_Insert_Input>;
  on_conflict?: InputMaybe<Users_Collection_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Collection_IeArgs = {
  objects: Array<Users_Collection_Ie_Insert_Input>;
  on_conflict?: InputMaybe<Users_Collection_Ie_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Collection_Ie_OneArgs = {
  object: Users_Collection_Ie_Insert_Input;
  on_conflict?: InputMaybe<Users_Collection_Ie_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Collection_OneArgs = {
  object: Users_Collection_Insert_Input;
  on_conflict?: InputMaybe<Users_Collection_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_GroupArgs = {
  objects: Array<Users_Group_Insert_Input>;
  on_conflict?: InputMaybe<Users_Group_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Group_OneArgs = {
  object: Users_Group_Insert_Input;
  on_conflict?: InputMaybe<Users_Group_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Group_PermissionArgs = {
  objects: Array<Users_Group_Permission_Insert_Input>;
  on_conflict?: InputMaybe<Users_Group_Permission_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Group_Permission_OneArgs = {
  object: Users_Group_Permission_Insert_Input;
  on_conflict?: InputMaybe<Users_Group_Permission_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_IdentityArgs = {
  objects: Array<Users_Identity_Insert_Input>;
  on_conflict?: InputMaybe<Users_Identity_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Identity_OneArgs = {
  object: Users_Identity_Insert_Input;
  on_conflict?: InputMaybe<Users_Identity_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Identity_ProviderArgs = {
  objects: Array<Users_Identity_Provider_Insert_Input>;
  on_conflict?: InputMaybe<Users_Identity_Provider_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Identity_Provider_OneArgs = {
  object: Users_Identity_Provider_Insert_Input;
  on_conflict?: InputMaybe<Users_Identity_Provider_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_PermissionArgs = {
  objects: Array<Users_Permission_Insert_Input>;
  on_conflict?: InputMaybe<Users_Permission_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Permission_OneArgs = {
  object: Users_Permission_Insert_Input;
  on_conflict?: InputMaybe<Users_Permission_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_ProfileArgs = {
  objects: Array<Users_Profile_Insert_Input>;
  on_conflict?: InputMaybe<Users_Profile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Users_Profile_OneArgs = {
  object: Users_Profile_Insert_Input;
  on_conflict?: InputMaybe<Users_Profile_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_App_NotificationArgs = {
  _set?: InputMaybe<App_Notification_Set_Input>;
  where: App_Notification_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_App_Notification_By_PkArgs = {
  _set?: InputMaybe<App_Notification_Set_Input>;
  pk_columns: App_Notification_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cms_ContentArgs = {
  _append?: InputMaybe<Cms_Content_Append_Input>;
  _delete_at_path?: InputMaybe<Cms_Content_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cms_Content_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cms_Content_Delete_Key_Input>;
  _prepend?: InputMaybe<Cms_Content_Prepend_Input>;
  _set?: InputMaybe<Cms_Content_Set_Input>;
  where: Cms_Content_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cms_Content_BlocksArgs = {
  _append?: InputMaybe<Cms_Content_Blocks_Append_Input>;
  _delete_at_path?: InputMaybe<Cms_Content_Blocks_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cms_Content_Blocks_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cms_Content_Blocks_Delete_Key_Input>;
  _inc?: InputMaybe<Cms_Content_Blocks_Inc_Input>;
  _prepend?: InputMaybe<Cms_Content_Blocks_Prepend_Input>;
  _set?: InputMaybe<Cms_Content_Blocks_Set_Input>;
  where: Cms_Content_Blocks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cms_Content_Blocks_By_PkArgs = {
  _append?: InputMaybe<Cms_Content_Blocks_Append_Input>;
  _delete_at_path?: InputMaybe<Cms_Content_Blocks_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cms_Content_Blocks_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cms_Content_Blocks_Delete_Key_Input>;
  _inc?: InputMaybe<Cms_Content_Blocks_Inc_Input>;
  _prepend?: InputMaybe<Cms_Content_Blocks_Prepend_Input>;
  _set?: InputMaybe<Cms_Content_Blocks_Set_Input>;
  pk_columns: Cms_Content_Blocks_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cms_Content_By_PkArgs = {
  _append?: InputMaybe<Cms_Content_Append_Input>;
  _delete_at_path?: InputMaybe<Cms_Content_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cms_Content_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cms_Content_Delete_Key_Input>;
  _prepend?: InputMaybe<Cms_Content_Prepend_Input>;
  _set?: InputMaybe<Cms_Content_Set_Input>;
  pk_columns: Cms_Content_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cms_Content_Content_LabelsArgs = {
  _set?: InputMaybe<Cms_Content_Content_Labels_Set_Input>;
  where: Cms_Content_Content_Labels_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cms_Content_Content_Labels_By_PkArgs = {
  _set?: InputMaybe<Cms_Content_Content_Labels_Set_Input>;
  pk_columns: Cms_Content_Content_Labels_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cms_Content_LabelsArgs = {
  _append?: InputMaybe<Cms_Content_Labels_Append_Input>;
  _delete_at_path?: InputMaybe<Cms_Content_Labels_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cms_Content_Labels_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cms_Content_Labels_Delete_Key_Input>;
  _prepend?: InputMaybe<Cms_Content_Labels_Prepend_Input>;
  _set?: InputMaybe<Cms_Content_Labels_Set_Input>;
  where: Cms_Content_Labels_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cms_Content_Labels_By_PkArgs = {
  _append?: InputMaybe<Cms_Content_Labels_Append_Input>;
  _delete_at_path?: InputMaybe<Cms_Content_Labels_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cms_Content_Labels_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cms_Content_Labels_Delete_Key_Input>;
  _prepend?: InputMaybe<Cms_Content_Labels_Prepend_Input>;
  _set?: InputMaybe<Cms_Content_Labels_Set_Input>;
  pk_columns: Cms_Content_Labels_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cms_Navigation_ElementArgs = {
  _append?: InputMaybe<Cms_Navigation_Element_Append_Input>;
  _delete_at_path?: InputMaybe<Cms_Navigation_Element_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cms_Navigation_Element_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cms_Navigation_Element_Delete_Key_Input>;
  _inc?: InputMaybe<Cms_Navigation_Element_Inc_Input>;
  _prepend?: InputMaybe<Cms_Navigation_Element_Prepend_Input>;
  _set?: InputMaybe<Cms_Navigation_Element_Set_Input>;
  where: Cms_Navigation_Element_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cms_Navigation_Element_By_PkArgs = {
  _append?: InputMaybe<Cms_Navigation_Element_Append_Input>;
  _delete_at_path?: InputMaybe<Cms_Navigation_Element_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cms_Navigation_Element_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cms_Navigation_Element_Delete_Key_Input>;
  _inc?: InputMaybe<Cms_Navigation_Element_Inc_Input>;
  _prepend?: InputMaybe<Cms_Navigation_Element_Prepend_Input>;
  _set?: InputMaybe<Cms_Navigation_Element_Set_Input>;
  pk_columns: Cms_Navigation_Element_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cms_Site_VariablesArgs = {
  _append?: InputMaybe<Cms_Site_Variables_Append_Input>;
  _delete_at_path?: InputMaybe<Cms_Site_Variables_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cms_Site_Variables_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cms_Site_Variables_Delete_Key_Input>;
  _prepend?: InputMaybe<Cms_Site_Variables_Prepend_Input>;
  _set?: InputMaybe<Cms_Site_Variables_Set_Input>;
  where: Cms_Site_Variables_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cms_Site_Variables_By_PkArgs = {
  _append?: InputMaybe<Cms_Site_Variables_Append_Input>;
  _delete_at_path?: InputMaybe<Cms_Site_Variables_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Cms_Site_Variables_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Cms_Site_Variables_Delete_Key_Input>;
  _prepend?: InputMaybe<Cms_Site_Variables_Prepend_Input>;
  _set?: InputMaybe<Cms_Site_Variables_Set_Input>;
  pk_columns: Cms_Site_Variables_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cp_IndexArgs = {
  _set?: InputMaybe<Cp_Index_Set_Input>;
  where: Cp_Index_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cp_Index_By_PkArgs = {
  _set?: InputMaybe<Cp_Index_Set_Input>;
  pk_columns: Cp_Index_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cp_MaintainerArgs = {
  _set?: InputMaybe<Cp_Maintainer_Set_Input>;
  where: Cp_Maintainer_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cp_Maintainer_By_PkArgs = {
  _set?: InputMaybe<Cp_Maintainer_Set_Input>;
  pk_columns: Cp_Maintainer_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cp_Maintainer_Users_ProfileArgs = {
  _set?: InputMaybe<Cp_Maintainer_Users_Profile_Set_Input>;
  where: Cp_Maintainer_Users_Profile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cp_Maintainer_Users_Profile_By_PkArgs = {
  _set?: InputMaybe<Cp_Maintainer_Users_Profile_Set_Input>;
  pk_columns: Cp_Maintainer_Users_Profile_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cp_SpaceArgs = {
  _set?: InputMaybe<Cp_Space_Set_Input>;
  where: Cp_Space_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cp_Space_By_PkArgs = {
  _set?: InputMaybe<Cp_Space_Set_Input>;
  pk_columns: Cp_Space_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cp_VisitArgs = {
  _set?: InputMaybe<Cp_Visit_Set_Input>;
  where: Cp_Visit_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cp_Visit_By_PkArgs = {
  _set?: InputMaybe<Cp_Visit_Set_Input>;
  pk_columns: Cp_Visit_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cp_Visit_NoteArgs = {
  _set?: InputMaybe<Cp_Visit_Note_Set_Input>;
  where: Cp_Visit_Note_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cp_Visit_Note_By_PkArgs = {
  _set?: InputMaybe<Cp_Visit_Note_Set_Input>;
  pk_columns: Cp_Visit_Note_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_App_Notification_TypeArgs = {
  _set?: InputMaybe<Lookup_App_Notification_Type_Set_Input>;
  where: Lookup_App_Notification_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_App_Notification_Type_By_PkArgs = {
  _set?: InputMaybe<Lookup_App_Notification_Type_Set_Input>;
  pk_columns: Lookup_App_Notification_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_Cms_Content_Block_TypeArgs = {
  _set?: InputMaybe<Lookup_Cms_Content_Block_Type_Set_Input>;
  where: Lookup_Cms_Content_Block_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_Cms_Content_Block_Type_By_PkArgs = {
  _set?: InputMaybe<Lookup_Cms_Content_Block_Type_Set_Input>;
  pk_columns: Lookup_Cms_Content_Block_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_Cms_Content_TypeArgs = {
  _set?: InputMaybe<Lookup_Cms_Content_Type_Set_Input>;
  where: Lookup_Cms_Content_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_Cms_Content_Type_By_PkArgs = {
  _set?: InputMaybe<Lookup_Cms_Content_Type_Set_Input>;
  pk_columns: Lookup_Cms_Content_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_Cp_Visit_StatusArgs = {
  _set?: InputMaybe<Lookup_Cp_Visit_Status_Set_Input>;
  where: Lookup_Cp_Visit_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_Cp_Visit_Status_By_PkArgs = {
  _set?: InputMaybe<Lookup_Cp_Visit_Status_Set_Input>;
  pk_columns: Lookup_Cp_Visit_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_Schema_Audience_TypeArgs = {
  _set?: InputMaybe<Lookup_Schema_Audience_Type_Set_Input>;
  where: Lookup_Schema_Audience_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Lookup_Schema_Audience_Type_By_PkArgs = {
  _set?: InputMaybe<Lookup_Schema_Audience_Type_Set_Input>;
  pk_columns: Lookup_Schema_Audience_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Object_FileArgs = {
  _set?: InputMaybe<Object_File_Set_Input>;
  where: Object_File_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Object_File_By_PkArgs = {
  _set?: InputMaybe<Object_File_Set_Input>;
  pk_columns: Object_File_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Object_IeArgs = {
  _append?: InputMaybe<Object_Ie_Append_Input>;
  _delete_at_path?: InputMaybe<Object_Ie_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Object_Ie_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Object_Ie_Delete_Key_Input>;
  _inc?: InputMaybe<Object_Ie_Inc_Input>;
  _prepend?: InputMaybe<Object_Ie_Prepend_Input>;
  _set?: InputMaybe<Object_Ie_Set_Input>;
  where: Object_Ie_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Object_Ie_By_PkArgs = {
  _append?: InputMaybe<Object_Ie_Append_Input>;
  _delete_at_path?: InputMaybe<Object_Ie_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Object_Ie_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Object_Ie_Delete_Key_Input>;
  _inc?: InputMaybe<Object_Ie_Inc_Input>;
  _prepend?: InputMaybe<Object_Ie_Prepend_Input>;
  _set?: InputMaybe<Object_Ie_Set_Input>;
  pk_columns: Object_Ie_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Object_RepresentationArgs = {
  _set?: InputMaybe<Object_Representation_Set_Input>;
  where: Object_Representation_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Object_Representation_By_PkArgs = {
  _set?: InputMaybe<Object_Representation_Set_Input>;
  pk_columns: Object_Representation_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_AudioArgs = {
  _append?: InputMaybe<Sync_Audio_Append_Input>;
  _delete_at_path?: InputMaybe<Sync_Audio_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Sync_Audio_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Sync_Audio_Delete_Key_Input>;
  _prepend?: InputMaybe<Sync_Audio_Prepend_Input>;
  _set?: InputMaybe<Sync_Audio_Set_Input>;
  where: Sync_Audio_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_Audio_By_PkArgs = {
  _append?: InputMaybe<Sync_Audio_Append_Input>;
  _delete_at_path?: InputMaybe<Sync_Audio_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Sync_Audio_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Sync_Audio_Delete_Key_Input>;
  _prepend?: InputMaybe<Sync_Audio_Prepend_Input>;
  _set?: InputMaybe<Sync_Audio_Set_Input>;
  pk_columns: Sync_Audio_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_FilmArgs = {
  _append?: InputMaybe<Sync_Film_Append_Input>;
  _delete_at_path?: InputMaybe<Sync_Film_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Sync_Film_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Sync_Film_Delete_Key_Input>;
  _prepend?: InputMaybe<Sync_Film_Prepend_Input>;
  _set?: InputMaybe<Sync_Film_Set_Input>;
  where: Sync_Film_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_Film_By_PkArgs = {
  _append?: InputMaybe<Sync_Film_Append_Input>;
  _delete_at_path?: InputMaybe<Sync_Film_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Sync_Film_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Sync_Film_Delete_Key_Input>;
  _prepend?: InputMaybe<Sync_Film_Prepend_Input>;
  _set?: InputMaybe<Sync_Film_Set_Input>;
  pk_columns: Sync_Film_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_VideoArgs = {
  _append?: InputMaybe<Sync_Video_Append_Input>;
  _delete_at_path?: InputMaybe<Sync_Video_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Sync_Video_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Sync_Video_Delete_Key_Input>;
  _prepend?: InputMaybe<Sync_Video_Prepend_Input>;
  _set?: InputMaybe<Sync_Video_Set_Input>;
  where: Sync_Video_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_Video_By_PkArgs = {
  _append?: InputMaybe<Sync_Video_Append_Input>;
  _delete_at_path?: InputMaybe<Sync_Video_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Sync_Video_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Sync_Video_Delete_Key_Input>;
  _prepend?: InputMaybe<Sync_Video_Prepend_Input>;
  _set?: InputMaybe<Sync_Video_Set_Input>;
  pk_columns: Sync_Video_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_CollectionArgs = {
  _set?: InputMaybe<Users_Collection_Set_Input>;
  where: Users_Collection_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Collection_By_PkArgs = {
  _set?: InputMaybe<Users_Collection_Set_Input>;
  pk_columns: Users_Collection_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Collection_IeArgs = {
  _set?: InputMaybe<Users_Collection_Ie_Set_Input>;
  where: Users_Collection_Ie_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Collection_Ie_By_PkArgs = {
  _set?: InputMaybe<Users_Collection_Ie_Set_Input>;
  pk_columns: Users_Collection_Ie_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_GroupArgs = {
  _set?: InputMaybe<Users_Group_Set_Input>;
  where: Users_Group_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Group_By_PkArgs = {
  _set?: InputMaybe<Users_Group_Set_Input>;
  pk_columns: Users_Group_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Group_PermissionArgs = {
  _set?: InputMaybe<Users_Group_Permission_Set_Input>;
  where: Users_Group_Permission_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Group_Permission_By_PkArgs = {
  _set?: InputMaybe<Users_Group_Permission_Set_Input>;
  pk_columns: Users_Group_Permission_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_IdentityArgs = {
  _set?: InputMaybe<Users_Identity_Set_Input>;
  where: Users_Identity_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Identity_By_PkArgs = {
  _set?: InputMaybe<Users_Identity_Set_Input>;
  pk_columns: Users_Identity_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Identity_ProviderArgs = {
  _set?: InputMaybe<Users_Identity_Provider_Set_Input>;
  where: Users_Identity_Provider_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Identity_Provider_By_PkArgs = {
  _set?: InputMaybe<Users_Identity_Provider_Set_Input>;
  pk_columns: Users_Identity_Provider_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_PermissionArgs = {
  _set?: InputMaybe<Users_Permission_Set_Input>;
  where: Users_Permission_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Permission_By_PkArgs = {
  _set?: InputMaybe<Users_Permission_Set_Input>;
  pk_columns: Users_Permission_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_ProfileArgs = {
  _set?: InputMaybe<Users_Profile_Set_Input>;
  where: Users_Profile_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_Profile_By_PkArgs = {
  _set?: InputMaybe<Users_Profile_Set_Input>;
  pk_columns: Users_Profile_Pk_Columns_Input;
};

/**
 * Bestanden die deel uitmaken van de representaties van ie's.
 *
 *
 * columns and relationships of "object.file"
 *
 */
export type Object_File = {
  __typename?: 'object_file';
  ebucore_is_media_fragment_of?: Maybe<Scalars['String']>;
  ebucore_media_type: Scalars['String'];
  /** An object relationship */
  premis_is_included_in: Object_Representation;
  /** de unieke identifier van de representation waartoe deze file behoort */
  representation_schema_identifier: Scalars['String'];
  schema_alternate_name?: Maybe<Scalars['String']>;
  schema_description?: Maybe<Scalars['String']>;
  schema_embed_url?: Maybe<Scalars['String']>;
  /** de unieke identifier van de file */
  schema_identifier: Scalars['String'];
  schema_name?: Maybe<Scalars['String']>;
};

/** aggregated selection of "object.file" */
export type Object_File_Aggregate = {
  __typename?: 'object_file_aggregate';
  aggregate?: Maybe<Object_File_Aggregate_Fields>;
  nodes: Array<Object_File>;
};

/** aggregate fields of "object.file" */
export type Object_File_Aggregate_Fields = {
  __typename?: 'object_file_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Object_File_Max_Fields>;
  min?: Maybe<Object_File_Min_Fields>;
};


/** aggregate fields of "object.file" */
export type Object_File_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Object_File_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "object.file" */
export type Object_File_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Object_File_Max_Order_By>;
  min?: InputMaybe<Object_File_Min_Order_By>;
};

/** input type for inserting array relation for remote table "object.file" */
export type Object_File_Arr_Rel_Insert_Input = {
  data: Array<Object_File_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Object_File_On_Conflict>;
};

/** Boolean expression to filter rows from the table "object.file". All fields are combined with a logical 'AND'. */
export type Object_File_Bool_Exp = {
  _and?: InputMaybe<Array<Object_File_Bool_Exp>>;
  _not?: InputMaybe<Object_File_Bool_Exp>;
  _or?: InputMaybe<Array<Object_File_Bool_Exp>>;
  ebucore_is_media_fragment_of?: InputMaybe<String_Comparison_Exp>;
  ebucore_media_type?: InputMaybe<String_Comparison_Exp>;
  premis_is_included_in?: InputMaybe<Object_Representation_Bool_Exp>;
  representation_schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_alternate_name?: InputMaybe<String_Comparison_Exp>;
  schema_description?: InputMaybe<String_Comparison_Exp>;
  schema_embed_url?: InputMaybe<String_Comparison_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "object.file" */
export enum Object_File_Constraint {
  /** unique or primary key constraint */
  FilePkey = 'file_pkey'
}

/** input type for inserting data into table "object.file" */
export type Object_File_Insert_Input = {
  ebucore_is_media_fragment_of?: InputMaybe<Scalars['String']>;
  ebucore_media_type?: InputMaybe<Scalars['String']>;
  premis_is_included_in?: InputMaybe<Object_Representation_Obj_Rel_Insert_Input>;
  /** de unieke identifier van de representation waartoe deze file behoort */
  representation_schema_identifier?: InputMaybe<Scalars['String']>;
  schema_alternate_name?: InputMaybe<Scalars['String']>;
  schema_description?: InputMaybe<Scalars['String']>;
  schema_embed_url?: InputMaybe<Scalars['String']>;
  /** de unieke identifier van de file */
  schema_identifier?: InputMaybe<Scalars['String']>;
  schema_name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Object_File_Max_Fields = {
  __typename?: 'object_file_max_fields';
  ebucore_is_media_fragment_of?: Maybe<Scalars['String']>;
  ebucore_media_type?: Maybe<Scalars['String']>;
  /** de unieke identifier van de representation waartoe deze file behoort */
  representation_schema_identifier?: Maybe<Scalars['String']>;
  schema_alternate_name?: Maybe<Scalars['String']>;
  schema_description?: Maybe<Scalars['String']>;
  schema_embed_url?: Maybe<Scalars['String']>;
  /** de unieke identifier van de file */
  schema_identifier?: Maybe<Scalars['String']>;
  schema_name?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "object.file" */
export type Object_File_Max_Order_By = {
  ebucore_is_media_fragment_of?: InputMaybe<Order_By>;
  ebucore_media_type?: InputMaybe<Order_By>;
  /** de unieke identifier van de representation waartoe deze file behoort */
  representation_schema_identifier?: InputMaybe<Order_By>;
  schema_alternate_name?: InputMaybe<Order_By>;
  schema_description?: InputMaybe<Order_By>;
  schema_embed_url?: InputMaybe<Order_By>;
  /** de unieke identifier van de file */
  schema_identifier?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Object_File_Min_Fields = {
  __typename?: 'object_file_min_fields';
  ebucore_is_media_fragment_of?: Maybe<Scalars['String']>;
  ebucore_media_type?: Maybe<Scalars['String']>;
  /** de unieke identifier van de representation waartoe deze file behoort */
  representation_schema_identifier?: Maybe<Scalars['String']>;
  schema_alternate_name?: Maybe<Scalars['String']>;
  schema_description?: Maybe<Scalars['String']>;
  schema_embed_url?: Maybe<Scalars['String']>;
  /** de unieke identifier van de file */
  schema_identifier?: Maybe<Scalars['String']>;
  schema_name?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "object.file" */
export type Object_File_Min_Order_By = {
  ebucore_is_media_fragment_of?: InputMaybe<Order_By>;
  ebucore_media_type?: InputMaybe<Order_By>;
  /** de unieke identifier van de representation waartoe deze file behoort */
  representation_schema_identifier?: InputMaybe<Order_By>;
  schema_alternate_name?: InputMaybe<Order_By>;
  schema_description?: InputMaybe<Order_By>;
  schema_embed_url?: InputMaybe<Order_By>;
  /** de unieke identifier van de file */
  schema_identifier?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "object.file" */
export type Object_File_Mutation_Response = {
  __typename?: 'object_file_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Object_File>;
};

/** on_conflict condition type for table "object.file" */
export type Object_File_On_Conflict = {
  constraint: Object_File_Constraint;
  update_columns?: Array<Object_File_Update_Column>;
  where?: InputMaybe<Object_File_Bool_Exp>;
};

/** Ordering options when selecting data from "object.file". */
export type Object_File_Order_By = {
  ebucore_is_media_fragment_of?: InputMaybe<Order_By>;
  ebucore_media_type?: InputMaybe<Order_By>;
  premis_is_included_in?: InputMaybe<Object_Representation_Order_By>;
  representation_schema_identifier?: InputMaybe<Order_By>;
  schema_alternate_name?: InputMaybe<Order_By>;
  schema_description?: InputMaybe<Order_By>;
  schema_embed_url?: InputMaybe<Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: object_file */
export type Object_File_Pk_Columns_Input = {
  /** de unieke identifier van de file */
  schema_identifier: Scalars['String'];
};

/** select columns of table "object.file" */
export enum Object_File_Select_Column {
  /** column name */
  EbucoreIsMediaFragmentOf = 'ebucore_is_media_fragment_of',
  /** column name */
  EbucoreMediaType = 'ebucore_media_type',
  /** column name */
  RepresentationSchemaIdentifier = 'representation_schema_identifier',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaEmbedUrl = 'schema_embed_url',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaName = 'schema_name'
}

/** input type for updating data in table "object.file" */
export type Object_File_Set_Input = {
  ebucore_is_media_fragment_of?: InputMaybe<Scalars['String']>;
  ebucore_media_type?: InputMaybe<Scalars['String']>;
  /** de unieke identifier van de representation waartoe deze file behoort */
  representation_schema_identifier?: InputMaybe<Scalars['String']>;
  schema_alternate_name?: InputMaybe<Scalars['String']>;
  schema_description?: InputMaybe<Scalars['String']>;
  schema_embed_url?: InputMaybe<Scalars['String']>;
  /** de unieke identifier van de file */
  schema_identifier?: InputMaybe<Scalars['String']>;
  schema_name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "object.file" */
export enum Object_File_Update_Column {
  /** column name */
  EbucoreIsMediaFragmentOf = 'ebucore_is_media_fragment_of',
  /** column name */
  EbucoreMediaType = 'ebucore_media_type',
  /** column name */
  RepresentationSchemaIdentifier = 'representation_schema_identifier',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaEmbedUrl = 'schema_embed_url',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaName = 'schema_name'
}

/** columns and relationships of "object.ie" */
export type Object_Ie = {
  __typename?: 'object_ie';
  /** Datum waarop de IE beschikbaar is gemaakt */
  dcterms_available?: Maybe<Scalars['timestamp']>;
  /** De datum waarop de IE werd gemaakt in edtf */
  dcterms_created?: Maybe<Scalars['String']>;
  /** Het mediatype: video, audio, beeld, document, ... */
  dcterms_format: Scalars['String'];
  /** De datum waarop de IE werd uitgebracht in edtf */
  dcterms_issued?: Maybe<Scalars['String']>;
  dcterms_medium?: Maybe<Scalars['String']>;
  ebucore_object_type?: Maybe<Scalars['String']>;
  /** An object relationship */
  maintainer?: Maybe<Cp_Maintainer>;
  /** De meemoo PID (external_id) voor een IE */
  meemoo_identifier: Scalars['String'];
  meemoo_media_object_id?: Maybe<Scalars['String']>;
  meemoofilm_base?: Maybe<Scalars['String']>;
  meemoofilm_color?: Maybe<Scalars['Boolean']>;
  meemoofilm_contains_embedded_caption?: Maybe<Scalars['Boolean']>;
  meemoofilm_embeddedCaptionLanguage?: Maybe<Scalars['String']>;
  meemoofilm_image_or_sound?: Maybe<Scalars['String']>;
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: Maybe<Scalars['jsonb']>;
  /** Maakt deel uit van een andere IE */
  premis_is_part_of?: Maybe<Scalars['String']>;
  /** An array relationship */
  premis_is_represented_by: Array<Object_Representation>;
  /** An aggregate relationship */
  premis_is_represented_by_aggregate: Object_Representation_Aggregate;
  /** Is verwant aan een andere IE */
  premis_relationship?: Maybe<Scalars['String']>;
  /** De inhoudelijke samenvatting van de IE */
  schema_abstract?: Maybe<Scalars['String']>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: Maybe<Scalars['jsonb']>;
  /** Een alternatieve titel of naam van de IE */
  schema_alternate_name?: Maybe<Scalars['String']>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: Maybe<Scalars['jsonb']>;
  /** De naam of ID van de rechtenhoudende persoon of organisatie */
  schema_copyright_holder?: Maybe<Scalars['String']>;
  /** Opmerkingen bij rechten en hergebruik */
  schema_copyright_notice?: Maybe<Scalars['String']>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: Maybe<Scalars['jsonb']>;
  /** Datum waarop de IE werd aangemaakt */
  schema_date_created?: Maybe<Scalars['daterange']>;
  schema_date_created_lower_bound?: Maybe<Scalars['date']>;
  /** Datum waarop de IE voor het eerst werd uitgegeven, uitgezonden of vertoond */
  schema_date_published?: Maybe<Scalars['date']>;
  /** Een korte omschrijving van de IE */
  schema_description?: Maybe<Scalars['String']>;
  schema_duration?: Maybe<Scalars['time']>;
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Int']>;
  schema_genre?: Maybe<Scalars['_text']>;
  /** de unieke fragmentid in mediahaven */
  schema_identifier: Scalars['String'];
  /** De taal of talen die in de IE gebruikt worden */
  schema_in_language?: Maybe<Scalars['_text']>;
  schema_is_part_of?: Maybe<Scalars['jsonb']>;
  /** Tags of sleutelwoorden die de IE omschrijven */
  schema_keywords?: Maybe<Scalars['_text']>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: Maybe<Scalars['jsonb']>;
  schema_maintainer?: Maybe<Array<Maybe<ContentPartner>>>;
  /** De ID van de beherende instelling of aanbieder van de IE, aka de CP (tbv relatie met org API v2) */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  schema_maintainer_id_lower?: Maybe<Scalars['String']>;
  /** De primaire titel van de IE */
  schema_name: Scalars['String'];
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Int']>;
  schema_part_of_archive?: Maybe<Scalars['_text']>;
  /** Aflevering */
  schema_part_of_episode?: Maybe<Scalars['_text']>;
  /** Seizoen */
  schema_part_of_season?: Maybe<Scalars['_text']>;
  /** Serie */
  schema_part_of_series?: Maybe<Scalars['_text']>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: Maybe<Scalars['jsonb']>;
  /** Plaatsen of locaties waarover de IE handelt of betrekking op heeft */
  schema_spatial_coverage?: Maybe<Scalars['_text']>;
  /** Datums, tijdstippen of periodes waarover de IE handelt of betrekking op heeft */
  schema_temporal_coverage?: Maybe<Scalars['_text']>;
  /** Een URL naar een thumbnail of placeholder voor de IE */
  schema_thumbnail_url?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};


/** columns and relationships of "object.ie" */
export type Object_IePremis_IdentifierArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "object.ie" */
export type Object_IePremis_Is_Represented_ByArgs = {
  distinct_on?: InputMaybe<Array<Object_Representation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Representation_Order_By>>;
  where?: InputMaybe<Object_Representation_Bool_Exp>;
};


/** columns and relationships of "object.ie" */
export type Object_IePremis_Is_Represented_By_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Representation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Representation_Order_By>>;
  where?: InputMaybe<Object_Representation_Bool_Exp>;
};


/** columns and relationships of "object.ie" */
export type Object_IeSchema_ActorArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "object.ie" */
export type Object_IeSchema_ContributorArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "object.ie" */
export type Object_IeSchema_CreatorArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "object.ie" */
export type Object_IeSchema_Is_Part_OfArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "object.ie" */
export type Object_IeSchema_LicenseArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "object.ie" */
export type Object_IeSchema_MaintainerArgs = {
  iri?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "object.ie" */
export type Object_IeSchema_PublisherArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "object.ie" */
export type Object_Ie_Aggregate = {
  __typename?: 'object_ie_aggregate';
  aggregate?: Maybe<Object_Ie_Aggregate_Fields>;
  nodes: Array<Object_Ie>;
};

/** aggregate fields of "object.ie" */
export type Object_Ie_Aggregate_Fields = {
  __typename?: 'object_ie_aggregate_fields';
  avg?: Maybe<Object_Ie_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Object_Ie_Max_Fields>;
  min?: Maybe<Object_Ie_Min_Fields>;
  stddev?: Maybe<Object_Ie_Stddev_Fields>;
  stddev_pop?: Maybe<Object_Ie_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Object_Ie_Stddev_Samp_Fields>;
  sum?: Maybe<Object_Ie_Sum_Fields>;
  var_pop?: Maybe<Object_Ie_Var_Pop_Fields>;
  var_samp?: Maybe<Object_Ie_Var_Samp_Fields>;
  variance?: Maybe<Object_Ie_Variance_Fields>;
};


/** aggregate fields of "object.ie" */
export type Object_Ie_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Object_Ie_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Object_Ie_Append_Input = {
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: InputMaybe<Scalars['jsonb']>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: InputMaybe<Scalars['jsonb']>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: InputMaybe<Scalars['jsonb']>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: InputMaybe<Scalars['jsonb']>;
  schema_is_part_of?: InputMaybe<Scalars['jsonb']>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: InputMaybe<Scalars['jsonb']>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate avg on columns */
export type Object_Ie_Avg_Fields = {
  __typename?: 'object_ie_avg_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Float']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "object.ie". All fields are combined with a logical 'AND'. */
export type Object_Ie_Bool_Exp = {
  _and?: InputMaybe<Array<Object_Ie_Bool_Exp>>;
  _not?: InputMaybe<Object_Ie_Bool_Exp>;
  _or?: InputMaybe<Array<Object_Ie_Bool_Exp>>;
  dcterms_available?: InputMaybe<Timestamp_Comparison_Exp>;
  dcterms_created?: InputMaybe<String_Comparison_Exp>;
  dcterms_format?: InputMaybe<String_Comparison_Exp>;
  dcterms_issued?: InputMaybe<String_Comparison_Exp>;
  dcterms_medium?: InputMaybe<String_Comparison_Exp>;
  ebucore_object_type?: InputMaybe<String_Comparison_Exp>;
  maintainer?: InputMaybe<Cp_Maintainer_Bool_Exp>;
  meemoo_identifier?: InputMaybe<String_Comparison_Exp>;
  meemoo_media_object_id?: InputMaybe<String_Comparison_Exp>;
  meemoofilm_base?: InputMaybe<String_Comparison_Exp>;
  meemoofilm_color?: InputMaybe<Boolean_Comparison_Exp>;
  meemoofilm_contains_embedded_caption?: InputMaybe<Boolean_Comparison_Exp>;
  meemoofilm_embeddedCaptionLanguage?: InputMaybe<String_Comparison_Exp>;
  meemoofilm_image_or_sound?: InputMaybe<String_Comparison_Exp>;
  premis_identifier?: InputMaybe<Jsonb_Comparison_Exp>;
  premis_is_part_of?: InputMaybe<String_Comparison_Exp>;
  premis_is_represented_by?: InputMaybe<Object_Representation_Bool_Exp>;
  premis_relationship?: InputMaybe<String_Comparison_Exp>;
  schema_abstract?: InputMaybe<String_Comparison_Exp>;
  schema_actor?: InputMaybe<Jsonb_Comparison_Exp>;
  schema_alternate_name?: InputMaybe<String_Comparison_Exp>;
  schema_contributor?: InputMaybe<Jsonb_Comparison_Exp>;
  schema_copyright_holder?: InputMaybe<String_Comparison_Exp>;
  schema_copyright_notice?: InputMaybe<String_Comparison_Exp>;
  schema_creator?: InputMaybe<Jsonb_Comparison_Exp>;
  schema_date_created?: InputMaybe<Daterange_Comparison_Exp>;
  schema_date_created_lower_bound?: InputMaybe<Date_Comparison_Exp>;
  schema_date_published?: InputMaybe<Date_Comparison_Exp>;
  schema_description?: InputMaybe<String_Comparison_Exp>;
  schema_duration?: InputMaybe<Time_Comparison_Exp>;
  schema_duration_in_seconds?: InputMaybe<Int_Comparison_Exp>;
  schema_genre?: InputMaybe<_Text_Comparison_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_in_language?: InputMaybe<_Text_Comparison_Exp>;
  schema_is_part_of?: InputMaybe<Jsonb_Comparison_Exp>;
  schema_keywords?: InputMaybe<_Text_Comparison_Exp>;
  schema_license?: InputMaybe<Jsonb_Comparison_Exp>;
  schema_maintainer_id?: InputMaybe<String_Comparison_Exp>;
  schema_maintainer_id_lower?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  schema_number_of_pages?: InputMaybe<Int_Comparison_Exp>;
  schema_part_of_archive?: InputMaybe<_Text_Comparison_Exp>;
  schema_part_of_episode?: InputMaybe<_Text_Comparison_Exp>;
  schema_part_of_season?: InputMaybe<_Text_Comparison_Exp>;
  schema_part_of_series?: InputMaybe<_Text_Comparison_Exp>;
  schema_publisher?: InputMaybe<Jsonb_Comparison_Exp>;
  schema_spatial_coverage?: InputMaybe<_Text_Comparison_Exp>;
  schema_temporal_coverage?: InputMaybe<_Text_Comparison_Exp>;
  schema_thumbnail_url?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "object.ie" */
export enum Object_Ie_Constraint {
  /** unique or primary key constraint */
  IeMeemooFragmentIdKey = 'ie_meemoo_fragment_id_key',
  /** unique or primary key constraint */
  IntellectualEntityPkey = 'intellectual_entity_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Object_Ie_Delete_At_Path_Input = {
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: InputMaybe<Array<Scalars['String']>>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: InputMaybe<Array<Scalars['String']>>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: InputMaybe<Array<Scalars['String']>>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: InputMaybe<Array<Scalars['String']>>;
  schema_is_part_of?: InputMaybe<Array<Scalars['String']>>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: InputMaybe<Array<Scalars['String']>>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Object_Ie_Delete_Elem_Input = {
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: InputMaybe<Scalars['Int']>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: InputMaybe<Scalars['Int']>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: InputMaybe<Scalars['Int']>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: InputMaybe<Scalars['Int']>;
  schema_is_part_of?: InputMaybe<Scalars['Int']>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: InputMaybe<Scalars['Int']>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Object_Ie_Delete_Key_Input = {
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: InputMaybe<Scalars['String']>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: InputMaybe<Scalars['String']>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: InputMaybe<Scalars['String']>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: InputMaybe<Scalars['String']>;
  schema_is_part_of?: InputMaybe<Scalars['String']>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: InputMaybe<Scalars['String']>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "object.ie" */
export type Object_Ie_Inc_Input = {
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: InputMaybe<Scalars['Int']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: InputMaybe<Scalars['Int']>;
};

/** columns and relationships of "object.ie_index" */
export type Object_Ie_Index = {
  __typename?: 'object_ie_index';
  document?: Maybe<Scalars['json']>;
  document_id?: Maybe<Scalars['String']>;
  index_id?: Maybe<Scalars['String']>;
};


/** columns and relationships of "object.ie_index" */
export type Object_Ie_IndexDocumentArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "object.ie_index" */
export type Object_Ie_Index_Aggregate = {
  __typename?: 'object_ie_index_aggregate';
  aggregate?: Maybe<Object_Ie_Index_Aggregate_Fields>;
  nodes: Array<Object_Ie_Index>;
};

/** aggregate fields of "object.ie_index" */
export type Object_Ie_Index_Aggregate_Fields = {
  __typename?: 'object_ie_index_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Object_Ie_Index_Max_Fields>;
  min?: Maybe<Object_Ie_Index_Min_Fields>;
};


/** aggregate fields of "object.ie_index" */
export type Object_Ie_Index_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Object_Ie_Index_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "object.ie_index". All fields are combined with a logical 'AND'. */
export type Object_Ie_Index_Bool_Exp = {
  _and?: InputMaybe<Array<Object_Ie_Index_Bool_Exp>>;
  _not?: InputMaybe<Object_Ie_Index_Bool_Exp>;
  _or?: InputMaybe<Array<Object_Ie_Index_Bool_Exp>>;
  document?: InputMaybe<Json_Comparison_Exp>;
  document_id?: InputMaybe<String_Comparison_Exp>;
  index_id?: InputMaybe<String_Comparison_Exp>;
};

/** aggregate max on columns */
export type Object_Ie_Index_Max_Fields = {
  __typename?: 'object_ie_index_max_fields';
  document_id?: Maybe<Scalars['String']>;
  index_id?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Object_Ie_Index_Min_Fields = {
  __typename?: 'object_ie_index_min_fields';
  document_id?: Maybe<Scalars['String']>;
  index_id?: Maybe<Scalars['String']>;
};

/** Ordering options when selecting data from "object.ie_index". */
export type Object_Ie_Index_Order_By = {
  document?: InputMaybe<Order_By>;
  document_id?: InputMaybe<Order_By>;
  index_id?: InputMaybe<Order_By>;
};

/** select columns of table "object.ie_index" */
export enum Object_Ie_Index_Select_Column {
  /** column name */
  Document = 'document',
  /** column name */
  DocumentId = 'document_id',
  /** column name */
  IndexId = 'index_id'
}

/** input type for inserting data into table "object.ie" */
export type Object_Ie_Insert_Input = {
  /** Datum waarop de IE beschikbaar is gemaakt */
  dcterms_available?: InputMaybe<Scalars['timestamp']>;
  /** De datum waarop de IE werd gemaakt in edtf */
  dcterms_created?: InputMaybe<Scalars['String']>;
  /** Het mediatype: video, audio, beeld, document, ... */
  dcterms_format?: InputMaybe<Scalars['String']>;
  /** De datum waarop de IE werd uitgebracht in edtf */
  dcterms_issued?: InputMaybe<Scalars['String']>;
  dcterms_medium?: InputMaybe<Scalars['String']>;
  ebucore_object_type?: InputMaybe<Scalars['String']>;
  maintainer?: InputMaybe<Cp_Maintainer_Obj_Rel_Insert_Input>;
  /** De meemoo PID (external_id) voor een IE */
  meemoo_identifier?: InputMaybe<Scalars['String']>;
  meemoo_media_object_id?: InputMaybe<Scalars['String']>;
  meemoofilm_base?: InputMaybe<Scalars['String']>;
  meemoofilm_color?: InputMaybe<Scalars['Boolean']>;
  meemoofilm_contains_embedded_caption?: InputMaybe<Scalars['Boolean']>;
  meemoofilm_embeddedCaptionLanguage?: InputMaybe<Scalars['String']>;
  meemoofilm_image_or_sound?: InputMaybe<Scalars['String']>;
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: InputMaybe<Scalars['jsonb']>;
  /** Maakt deel uit van een andere IE */
  premis_is_part_of?: InputMaybe<Scalars['String']>;
  premis_is_represented_by?: InputMaybe<Object_Representation_Arr_Rel_Insert_Input>;
  /** Is verwant aan een andere IE */
  premis_relationship?: InputMaybe<Scalars['String']>;
  /** De inhoudelijke samenvatting van de IE */
  schema_abstract?: InputMaybe<Scalars['String']>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: InputMaybe<Scalars['jsonb']>;
  /** Een alternatieve titel of naam van de IE */
  schema_alternate_name?: InputMaybe<Scalars['String']>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: InputMaybe<Scalars['jsonb']>;
  /** De naam of ID van de rechtenhoudende persoon of organisatie */
  schema_copyright_holder?: InputMaybe<Scalars['String']>;
  /** Opmerkingen bij rechten en hergebruik */
  schema_copyright_notice?: InputMaybe<Scalars['String']>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: InputMaybe<Scalars['jsonb']>;
  /** Datum waarop de IE werd aangemaakt */
  schema_date_created?: InputMaybe<Scalars['daterange']>;
  schema_date_created_lower_bound?: InputMaybe<Scalars['date']>;
  /** Datum waarop de IE voor het eerst werd uitgegeven, uitgezonden of vertoond */
  schema_date_published?: InputMaybe<Scalars['date']>;
  /** Een korte omschrijving van de IE */
  schema_description?: InputMaybe<Scalars['String']>;
  schema_duration?: InputMaybe<Scalars['time']>;
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: InputMaybe<Scalars['Int']>;
  schema_genre?: InputMaybe<Scalars['_text']>;
  /** de unieke fragmentid in mediahaven */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De taal of talen die in de IE gebruikt worden */
  schema_in_language?: InputMaybe<Scalars['_text']>;
  schema_is_part_of?: InputMaybe<Scalars['jsonb']>;
  /** Tags of sleutelwoorden die de IE omschrijven */
  schema_keywords?: InputMaybe<Scalars['_text']>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: InputMaybe<Scalars['jsonb']>;
  /** De ID van de beherende instelling of aanbieder van de IE, aka de CP (tbv relatie met org API v2) */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  schema_maintainer_id_lower?: InputMaybe<Scalars['String']>;
  /** De primaire titel van de IE */
  schema_name?: InputMaybe<Scalars['String']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: InputMaybe<Scalars['Int']>;
  schema_part_of_archive?: InputMaybe<Scalars['_text']>;
  /** Aflevering */
  schema_part_of_episode?: InputMaybe<Scalars['_text']>;
  /** Seizoen */
  schema_part_of_season?: InputMaybe<Scalars['_text']>;
  /** Serie */
  schema_part_of_series?: InputMaybe<Scalars['_text']>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: InputMaybe<Scalars['jsonb']>;
  /** Plaatsen of locaties waarover de IE handelt of betrekking op heeft */
  schema_spatial_coverage?: InputMaybe<Scalars['_text']>;
  /** Datums, tijdstippen of periodes waarover de IE handelt of betrekking op heeft */
  schema_temporal_coverage?: InputMaybe<Scalars['_text']>;
  /** Een URL naar een thumbnail of placeholder voor de IE */
  schema_thumbnail_url?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Object_Ie_Max_Fields = {
  __typename?: 'object_ie_max_fields';
  /** Datum waarop de IE beschikbaar is gemaakt */
  dcterms_available?: Maybe<Scalars['timestamp']>;
  /** De datum waarop de IE werd gemaakt in edtf */
  dcterms_created?: Maybe<Scalars['String']>;
  /** Het mediatype: video, audio, beeld, document, ... */
  dcterms_format?: Maybe<Scalars['String']>;
  /** De datum waarop de IE werd uitgebracht in edtf */
  dcterms_issued?: Maybe<Scalars['String']>;
  dcterms_medium?: Maybe<Scalars['String']>;
  ebucore_object_type?: Maybe<Scalars['String']>;
  /** De meemoo PID (external_id) voor een IE */
  meemoo_identifier?: Maybe<Scalars['String']>;
  meemoo_media_object_id?: Maybe<Scalars['String']>;
  meemoofilm_base?: Maybe<Scalars['String']>;
  meemoofilm_embeddedCaptionLanguage?: Maybe<Scalars['String']>;
  meemoofilm_image_or_sound?: Maybe<Scalars['String']>;
  /** Maakt deel uit van een andere IE */
  premis_is_part_of?: Maybe<Scalars['String']>;
  /** Is verwant aan een andere IE */
  premis_relationship?: Maybe<Scalars['String']>;
  /** De inhoudelijke samenvatting van de IE */
  schema_abstract?: Maybe<Scalars['String']>;
  /** Een alternatieve titel of naam van de IE */
  schema_alternate_name?: Maybe<Scalars['String']>;
  /** De naam of ID van de rechtenhoudende persoon of organisatie */
  schema_copyright_holder?: Maybe<Scalars['String']>;
  /** Opmerkingen bij rechten en hergebruik */
  schema_copyright_notice?: Maybe<Scalars['String']>;
  schema_date_created_lower_bound?: Maybe<Scalars['date']>;
  /** Datum waarop de IE voor het eerst werd uitgegeven, uitgezonden of vertoond */
  schema_date_published?: Maybe<Scalars['date']>;
  /** Een korte omschrijving van de IE */
  schema_description?: Maybe<Scalars['String']>;
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Int']>;
  /** de unieke fragmentid in mediahaven */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De ID van de beherende instelling of aanbieder van de IE, aka de CP (tbv relatie met org API v2) */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  schema_maintainer_id_lower?: Maybe<Scalars['String']>;
  /** De primaire titel van de IE */
  schema_name?: Maybe<Scalars['String']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Int']>;
  /** Een URL naar een thumbnail of placeholder voor de IE */
  schema_thumbnail_url?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Object_Ie_Min_Fields = {
  __typename?: 'object_ie_min_fields';
  /** Datum waarop de IE beschikbaar is gemaakt */
  dcterms_available?: Maybe<Scalars['timestamp']>;
  /** De datum waarop de IE werd gemaakt in edtf */
  dcterms_created?: Maybe<Scalars['String']>;
  /** Het mediatype: video, audio, beeld, document, ... */
  dcterms_format?: Maybe<Scalars['String']>;
  /** De datum waarop de IE werd uitgebracht in edtf */
  dcterms_issued?: Maybe<Scalars['String']>;
  dcterms_medium?: Maybe<Scalars['String']>;
  ebucore_object_type?: Maybe<Scalars['String']>;
  /** De meemoo PID (external_id) voor een IE */
  meemoo_identifier?: Maybe<Scalars['String']>;
  meemoo_media_object_id?: Maybe<Scalars['String']>;
  meemoofilm_base?: Maybe<Scalars['String']>;
  meemoofilm_embeddedCaptionLanguage?: Maybe<Scalars['String']>;
  meemoofilm_image_or_sound?: Maybe<Scalars['String']>;
  /** Maakt deel uit van een andere IE */
  premis_is_part_of?: Maybe<Scalars['String']>;
  /** Is verwant aan een andere IE */
  premis_relationship?: Maybe<Scalars['String']>;
  /** De inhoudelijke samenvatting van de IE */
  schema_abstract?: Maybe<Scalars['String']>;
  /** Een alternatieve titel of naam van de IE */
  schema_alternate_name?: Maybe<Scalars['String']>;
  /** De naam of ID van de rechtenhoudende persoon of organisatie */
  schema_copyright_holder?: Maybe<Scalars['String']>;
  /** Opmerkingen bij rechten en hergebruik */
  schema_copyright_notice?: Maybe<Scalars['String']>;
  schema_date_created_lower_bound?: Maybe<Scalars['date']>;
  /** Datum waarop de IE voor het eerst werd uitgegeven, uitgezonden of vertoond */
  schema_date_published?: Maybe<Scalars['date']>;
  /** Een korte omschrijving van de IE */
  schema_description?: Maybe<Scalars['String']>;
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Int']>;
  /** de unieke fragmentid in mediahaven */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De ID van de beherende instelling of aanbieder van de IE, aka de CP (tbv relatie met org API v2) */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  schema_maintainer_id_lower?: Maybe<Scalars['String']>;
  /** De primaire titel van de IE */
  schema_name?: Maybe<Scalars['String']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Int']>;
  /** Een URL naar een thumbnail of placeholder voor de IE */
  schema_thumbnail_url?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "object.ie" */
export type Object_Ie_Mutation_Response = {
  __typename?: 'object_ie_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Object_Ie>;
};

/** input type for inserting object relation for remote table "object.ie" */
export type Object_Ie_Obj_Rel_Insert_Input = {
  data: Object_Ie_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Object_Ie_On_Conflict>;
};

/** on_conflict condition type for table "object.ie" */
export type Object_Ie_On_Conflict = {
  constraint: Object_Ie_Constraint;
  update_columns?: Array<Object_Ie_Update_Column>;
  where?: InputMaybe<Object_Ie_Bool_Exp>;
};

/** Ordering options when selecting data from "object.ie". */
export type Object_Ie_Order_By = {
  dcterms_available?: InputMaybe<Order_By>;
  dcterms_created?: InputMaybe<Order_By>;
  dcterms_format?: InputMaybe<Order_By>;
  dcterms_issued?: InputMaybe<Order_By>;
  dcterms_medium?: InputMaybe<Order_By>;
  ebucore_object_type?: InputMaybe<Order_By>;
  maintainer?: InputMaybe<Cp_Maintainer_Order_By>;
  meemoo_identifier?: InputMaybe<Order_By>;
  meemoo_media_object_id?: InputMaybe<Order_By>;
  meemoofilm_base?: InputMaybe<Order_By>;
  meemoofilm_color?: InputMaybe<Order_By>;
  meemoofilm_contains_embedded_caption?: InputMaybe<Order_By>;
  meemoofilm_embeddedCaptionLanguage?: InputMaybe<Order_By>;
  meemoofilm_image_or_sound?: InputMaybe<Order_By>;
  premis_identifier?: InputMaybe<Order_By>;
  premis_is_part_of?: InputMaybe<Order_By>;
  premis_is_represented_by_aggregate?: InputMaybe<Object_Representation_Aggregate_Order_By>;
  premis_relationship?: InputMaybe<Order_By>;
  schema_abstract?: InputMaybe<Order_By>;
  schema_actor?: InputMaybe<Order_By>;
  schema_alternate_name?: InputMaybe<Order_By>;
  schema_contributor?: InputMaybe<Order_By>;
  schema_copyright_holder?: InputMaybe<Order_By>;
  schema_copyright_notice?: InputMaybe<Order_By>;
  schema_creator?: InputMaybe<Order_By>;
  schema_date_created?: InputMaybe<Order_By>;
  schema_date_created_lower_bound?: InputMaybe<Order_By>;
  schema_date_published?: InputMaybe<Order_By>;
  schema_description?: InputMaybe<Order_By>;
  schema_duration?: InputMaybe<Order_By>;
  schema_duration_in_seconds?: InputMaybe<Order_By>;
  schema_genre?: InputMaybe<Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_in_language?: InputMaybe<Order_By>;
  schema_is_part_of?: InputMaybe<Order_By>;
  schema_keywords?: InputMaybe<Order_By>;
  schema_license?: InputMaybe<Order_By>;
  schema_maintainer_id?: InputMaybe<Order_By>;
  schema_maintainer_id_lower?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  schema_number_of_pages?: InputMaybe<Order_By>;
  schema_part_of_archive?: InputMaybe<Order_By>;
  schema_part_of_episode?: InputMaybe<Order_By>;
  schema_part_of_season?: InputMaybe<Order_By>;
  schema_part_of_series?: InputMaybe<Order_By>;
  schema_publisher?: InputMaybe<Order_By>;
  schema_spatial_coverage?: InputMaybe<Order_By>;
  schema_temporal_coverage?: InputMaybe<Order_By>;
  schema_thumbnail_url?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: object_ie */
export type Object_Ie_Pk_Columns_Input = {
  /** de unieke fragmentid in mediahaven */
  schema_identifier: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Object_Ie_Prepend_Input = {
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: InputMaybe<Scalars['jsonb']>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: InputMaybe<Scalars['jsonb']>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: InputMaybe<Scalars['jsonb']>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: InputMaybe<Scalars['jsonb']>;
  schema_is_part_of?: InputMaybe<Scalars['jsonb']>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: InputMaybe<Scalars['jsonb']>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "object.ie" */
export enum Object_Ie_Select_Column {
  /** column name */
  DctermsAvailable = 'dcterms_available',
  /** column name */
  DctermsCreated = 'dcterms_created',
  /** column name */
  DctermsFormat = 'dcterms_format',
  /** column name */
  DctermsIssued = 'dcterms_issued',
  /** column name */
  DctermsMedium = 'dcterms_medium',
  /** column name */
  EbucoreObjectType = 'ebucore_object_type',
  /** column name */
  MeemooIdentifier = 'meemoo_identifier',
  /** column name */
  MeemooMediaObjectId = 'meemoo_media_object_id',
  /** column name */
  MeemoofilmBase = 'meemoofilm_base',
  /** column name */
  MeemoofilmColor = 'meemoofilm_color',
  /** column name */
  MeemoofilmContainsEmbeddedCaption = 'meemoofilm_contains_embedded_caption',
  /** column name */
  MeemoofilmEmbeddedCaptionLanguage = 'meemoofilm_embeddedCaptionLanguage',
  /** column name */
  MeemoofilmImageOrSound = 'meemoofilm_image_or_sound',
  /** column name */
  PremisIdentifier = 'premis_identifier',
  /** column name */
  PremisIsPartOf = 'premis_is_part_of',
  /** column name */
  PremisRelationship = 'premis_relationship',
  /** column name */
  SchemaAbstract = 'schema_abstract',
  /** column name */
  SchemaActor = 'schema_actor',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  SchemaContributor = 'schema_contributor',
  /** column name */
  SchemaCopyrightHolder = 'schema_copyright_holder',
  /** column name */
  SchemaCopyrightNotice = 'schema_copyright_notice',
  /** column name */
  SchemaCreator = 'schema_creator',
  /** column name */
  SchemaDateCreated = 'schema_date_created',
  /** column name */
  SchemaDateCreatedLowerBound = 'schema_date_created_lower_bound',
  /** column name */
  SchemaDatePublished = 'schema_date_published',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaDuration = 'schema_duration',
  /** column name */
  SchemaDurationInSeconds = 'schema_duration_in_seconds',
  /** column name */
  SchemaGenre = 'schema_genre',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  SchemaIsPartOf = 'schema_is_part_of',
  /** column name */
  SchemaKeywords = 'schema_keywords',
  /** column name */
  SchemaLicense = 'schema_license',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaMaintainerIdLower = 'schema_maintainer_id_lower',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaNumberOfPages = 'schema_number_of_pages',
  /** column name */
  SchemaPartOfArchive = 'schema_part_of_archive',
  /** column name */
  SchemaPartOfEpisode = 'schema_part_of_episode',
  /** column name */
  SchemaPartOfSeason = 'schema_part_of_season',
  /** column name */
  SchemaPartOfSeries = 'schema_part_of_series',
  /** column name */
  SchemaPublisher = 'schema_publisher',
  /** column name */
  SchemaSpatialCoverage = 'schema_spatial_coverage',
  /** column name */
  SchemaTemporalCoverage = 'schema_temporal_coverage',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "object.ie" */
export type Object_Ie_Set_Input = {
  /** Datum waarop de IE beschikbaar is gemaakt */
  dcterms_available?: InputMaybe<Scalars['timestamp']>;
  /** De datum waarop de IE werd gemaakt in edtf */
  dcterms_created?: InputMaybe<Scalars['String']>;
  /** Het mediatype: video, audio, beeld, document, ... */
  dcterms_format?: InputMaybe<Scalars['String']>;
  /** De datum waarop de IE werd uitgebracht in edtf */
  dcterms_issued?: InputMaybe<Scalars['String']>;
  dcterms_medium?: InputMaybe<Scalars['String']>;
  ebucore_object_type?: InputMaybe<Scalars['String']>;
  /** De meemoo PID (external_id) voor een IE */
  meemoo_identifier?: InputMaybe<Scalars['String']>;
  meemoo_media_object_id?: InputMaybe<Scalars['String']>;
  meemoofilm_base?: InputMaybe<Scalars['String']>;
  meemoofilm_color?: InputMaybe<Scalars['Boolean']>;
  meemoofilm_contains_embedded_caption?: InputMaybe<Scalars['Boolean']>;
  meemoofilm_embeddedCaptionLanguage?: InputMaybe<Scalars['String']>;
  meemoofilm_image_or_sound?: InputMaybe<Scalars['String']>;
  /** Overige lokale identifiers van de Content Partner (json) */
  premis_identifier?: InputMaybe<Scalars['jsonb']>;
  /** Maakt deel uit van een andere IE */
  premis_is_part_of?: InputMaybe<Scalars['String']>;
  /** Is verwant aan een andere IE */
  premis_relationship?: InputMaybe<Scalars['String']>;
  /** De inhoudelijke samenvatting van de IE */
  schema_abstract?: InputMaybe<Scalars['String']>;
  /** Personen die geacteerd of anderzijds deelgenomen hebben in de IE */
  schema_actor?: InputMaybe<Scalars['jsonb']>;
  /** Een alternatieve titel of naam van de IE */
  schema_alternate_name?: InputMaybe<Scalars['String']>;
  /** Personen die op een andere wijze hebben bijgedragen aan de IE */
  schema_contributor?: InputMaybe<Scalars['jsonb']>;
  /** De naam of ID van de rechtenhoudende persoon of organisatie */
  schema_copyright_holder?: InputMaybe<Scalars['String']>;
  /** Opmerkingen bij rechten en hergebruik */
  schema_copyright_notice?: InputMaybe<Scalars['String']>;
  /** Personen die hebben bijgedragen aan de creatie van de IE, aka author */
  schema_creator?: InputMaybe<Scalars['jsonb']>;
  /** Datum waarop de IE werd aangemaakt */
  schema_date_created?: InputMaybe<Scalars['daterange']>;
  schema_date_created_lower_bound?: InputMaybe<Scalars['date']>;
  /** Datum waarop de IE voor het eerst werd uitgegeven, uitgezonden of vertoond */
  schema_date_published?: InputMaybe<Scalars['date']>;
  /** Een korte omschrijving van de IE */
  schema_description?: InputMaybe<Scalars['String']>;
  schema_duration?: InputMaybe<Scalars['time']>;
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: InputMaybe<Scalars['Int']>;
  schema_genre?: InputMaybe<Scalars['_text']>;
  /** de unieke fragmentid in mediahaven */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De taal of talen die in de IE gebruikt worden */
  schema_in_language?: InputMaybe<Scalars['_text']>;
  schema_is_part_of?: InputMaybe<Scalars['jsonb']>;
  /** Tags of sleutelwoorden die de IE omschrijven */
  schema_keywords?: InputMaybe<Scalars['_text']>;
  /** De meemoolicenties op de betreffende IE */
  schema_license?: InputMaybe<Scalars['jsonb']>;
  /** De ID van de beherende instelling of aanbieder van de IE, aka de CP (tbv relatie met org API v2) */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  schema_maintainer_id_lower?: InputMaybe<Scalars['String']>;
  /** De primaire titel van de IE */
  schema_name?: InputMaybe<Scalars['String']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: InputMaybe<Scalars['Int']>;
  schema_part_of_archive?: InputMaybe<Scalars['_text']>;
  /** Aflevering */
  schema_part_of_episode?: InputMaybe<Scalars['_text']>;
  /** Seizoen */
  schema_part_of_season?: InputMaybe<Scalars['_text']>;
  /** Serie */
  schema_part_of_series?: InputMaybe<Scalars['_text']>;
  /** Persoon of organisatie die verantwoordelijk was voor de publicatie van de IE */
  schema_publisher?: InputMaybe<Scalars['jsonb']>;
  /** Plaatsen of locaties waarover de IE handelt of betrekking op heeft */
  schema_spatial_coverage?: InputMaybe<Scalars['_text']>;
  /** Datums, tijdstippen of periodes waarover de IE handelt of betrekking op heeft */
  schema_temporal_coverage?: InputMaybe<Scalars['_text']>;
  /** Een URL naar een thumbnail of placeholder voor de IE */
  schema_thumbnail_url?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Object_Ie_Stddev_Fields = {
  __typename?: 'object_ie_stddev_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Float']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Object_Ie_Stddev_Pop_Fields = {
  __typename?: 'object_ie_stddev_pop_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Float']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Object_Ie_Stddev_Samp_Fields = {
  __typename?: 'object_ie_stddev_samp_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Float']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Object_Ie_Sum_Fields = {
  __typename?: 'object_ie_sum_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Int']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Int']>;
};

/** update columns of table "object.ie" */
export enum Object_Ie_Update_Column {
  /** column name */
  DctermsAvailable = 'dcterms_available',
  /** column name */
  DctermsCreated = 'dcterms_created',
  /** column name */
  DctermsFormat = 'dcterms_format',
  /** column name */
  DctermsIssued = 'dcterms_issued',
  /** column name */
  DctermsMedium = 'dcterms_medium',
  /** column name */
  EbucoreObjectType = 'ebucore_object_type',
  /** column name */
  MeemooIdentifier = 'meemoo_identifier',
  /** column name */
  MeemooMediaObjectId = 'meemoo_media_object_id',
  /** column name */
  MeemoofilmBase = 'meemoofilm_base',
  /** column name */
  MeemoofilmColor = 'meemoofilm_color',
  /** column name */
  MeemoofilmContainsEmbeddedCaption = 'meemoofilm_contains_embedded_caption',
  /** column name */
  MeemoofilmEmbeddedCaptionLanguage = 'meemoofilm_embeddedCaptionLanguage',
  /** column name */
  MeemoofilmImageOrSound = 'meemoofilm_image_or_sound',
  /** column name */
  PremisIdentifier = 'premis_identifier',
  /** column name */
  PremisIsPartOf = 'premis_is_part_of',
  /** column name */
  PremisRelationship = 'premis_relationship',
  /** column name */
  SchemaAbstract = 'schema_abstract',
  /** column name */
  SchemaActor = 'schema_actor',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  SchemaContributor = 'schema_contributor',
  /** column name */
  SchemaCopyrightHolder = 'schema_copyright_holder',
  /** column name */
  SchemaCopyrightNotice = 'schema_copyright_notice',
  /** column name */
  SchemaCreator = 'schema_creator',
  /** column name */
  SchemaDateCreated = 'schema_date_created',
  /** column name */
  SchemaDateCreatedLowerBound = 'schema_date_created_lower_bound',
  /** column name */
  SchemaDatePublished = 'schema_date_published',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaDuration = 'schema_duration',
  /** column name */
  SchemaDurationInSeconds = 'schema_duration_in_seconds',
  /** column name */
  SchemaGenre = 'schema_genre',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaInLanguage = 'schema_in_language',
  /** column name */
  SchemaIsPartOf = 'schema_is_part_of',
  /** column name */
  SchemaKeywords = 'schema_keywords',
  /** column name */
  SchemaLicense = 'schema_license',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaMaintainerIdLower = 'schema_maintainer_id_lower',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaNumberOfPages = 'schema_number_of_pages',
  /** column name */
  SchemaPartOfArchive = 'schema_part_of_archive',
  /** column name */
  SchemaPartOfEpisode = 'schema_part_of_episode',
  /** column name */
  SchemaPartOfSeason = 'schema_part_of_season',
  /** column name */
  SchemaPartOfSeries = 'schema_part_of_series',
  /** column name */
  SchemaPublisher = 'schema_publisher',
  /** column name */
  SchemaSpatialCoverage = 'schema_spatial_coverage',
  /** column name */
  SchemaTemporalCoverage = 'schema_temporal_coverage',
  /** column name */
  SchemaThumbnailUrl = 'schema_thumbnail_url',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Object_Ie_Var_Pop_Fields = {
  __typename?: 'object_ie_var_pop_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Float']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Object_Ie_Var_Samp_Fields = {
  __typename?: 'object_ie_var_samp_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Float']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Object_Ie_Variance_Fields = {
  __typename?: 'object_ie_variance_fields';
  /** Tijd in seconden van tijdsgebaseerde media. */
  schema_duration_in_seconds?: Maybe<Scalars['Float']>;
  /** Aantal paginas van geschreven media */
  schema_number_of_pages?: Maybe<Scalars['Float']>;
};

/**
 * de digitalRepresentation van de IE inclusief mediaResource
 *
 *
 * columns and relationships of "object.representation"
 *
 */
export type Object_Representation = {
  __typename?: 'object_representation';
  /** het bestandstype van de represenatatie, container */
  dcterms_format: Scalars['String'];
  /** de unieke identifier van de IE waarvan dit de representation is */
  ie_schema_identifier: Scalars['String'];
  /** An array relationship */
  premis_includes: Array<Object_File>;
  /** An aggregate relationship */
  premis_includes_aggregate: Object_File_Aggregate;
  /** An object relationship */
  premis_represents: Object_Ie;
  /** label */
  schema_alternate_name?: Maybe<Scalars['String']>;
  /** datum waarop de resource van de representation werd aangemaakt */
  schema_date_created?: Maybe<Scalars['timestamp']>;
  /** de optionele beschrijving van de representatie zelf */
  schema_description?: Maybe<Scalars['String']>;
  /** de unieke identifier van de representatie */
  schema_identifier: Scalars['String'];
  /** filename aka PathToVideo */
  schema_name: Scalars['String'];
  /** de geschreven neerslag van een IE zijn audio */
  schema_transcript?: Maybe<Scalars['String']>;
};


/**
 * de digitalRepresentation van de IE inclusief mediaResource
 *
 *
 * columns and relationships of "object.representation"
 *
 */
export type Object_RepresentationPremis_IncludesArgs = {
  distinct_on?: InputMaybe<Array<Object_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_File_Order_By>>;
  where?: InputMaybe<Object_File_Bool_Exp>;
};


/**
 * de digitalRepresentation van de IE inclusief mediaResource
 *
 *
 * columns and relationships of "object.representation"
 *
 */
export type Object_RepresentationPremis_Includes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_File_Order_By>>;
  where?: InputMaybe<Object_File_Bool_Exp>;
};

/** aggregated selection of "object.representation" */
export type Object_Representation_Aggregate = {
  __typename?: 'object_representation_aggregate';
  aggregate?: Maybe<Object_Representation_Aggregate_Fields>;
  nodes: Array<Object_Representation>;
};

/** aggregate fields of "object.representation" */
export type Object_Representation_Aggregate_Fields = {
  __typename?: 'object_representation_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Object_Representation_Max_Fields>;
  min?: Maybe<Object_Representation_Min_Fields>;
};


/** aggregate fields of "object.representation" */
export type Object_Representation_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Object_Representation_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "object.representation" */
export type Object_Representation_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Object_Representation_Max_Order_By>;
  min?: InputMaybe<Object_Representation_Min_Order_By>;
};

/** input type for inserting array relation for remote table "object.representation" */
export type Object_Representation_Arr_Rel_Insert_Input = {
  data: Array<Object_Representation_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Object_Representation_On_Conflict>;
};

/** Boolean expression to filter rows from the table "object.representation". All fields are combined with a logical 'AND'. */
export type Object_Representation_Bool_Exp = {
  _and?: InputMaybe<Array<Object_Representation_Bool_Exp>>;
  _not?: InputMaybe<Object_Representation_Bool_Exp>;
  _or?: InputMaybe<Array<Object_Representation_Bool_Exp>>;
  dcterms_format?: InputMaybe<String_Comparison_Exp>;
  ie_schema_identifier?: InputMaybe<String_Comparison_Exp>;
  premis_includes?: InputMaybe<Object_File_Bool_Exp>;
  premis_represents?: InputMaybe<Object_Ie_Bool_Exp>;
  schema_alternate_name?: InputMaybe<String_Comparison_Exp>;
  schema_date_created?: InputMaybe<Timestamp_Comparison_Exp>;
  schema_description?: InputMaybe<String_Comparison_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  schema_transcript?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "object.representation" */
export enum Object_Representation_Constraint {
  /** unique or primary key constraint */
  RepresentationIdKey = 'representation_id_key',
  /** unique or primary key constraint */
  RepresentationPkey = 'representation_pkey'
}

/** input type for inserting data into table "object.representation" */
export type Object_Representation_Insert_Input = {
  /** het bestandstype van de represenatatie, container */
  dcterms_format?: InputMaybe<Scalars['String']>;
  /** de unieke identifier van de IE waarvan dit de representation is */
  ie_schema_identifier?: InputMaybe<Scalars['String']>;
  premis_includes?: InputMaybe<Object_File_Arr_Rel_Insert_Input>;
  premis_represents?: InputMaybe<Object_Ie_Obj_Rel_Insert_Input>;
  /** label */
  schema_alternate_name?: InputMaybe<Scalars['String']>;
  /** datum waarop de resource van de representation werd aangemaakt */
  schema_date_created?: InputMaybe<Scalars['timestamp']>;
  /** de optionele beschrijving van de representatie zelf */
  schema_description?: InputMaybe<Scalars['String']>;
  /** de unieke identifier van de representatie */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** filename aka PathToVideo */
  schema_name?: InputMaybe<Scalars['String']>;
  /** de geschreven neerslag van een IE zijn audio */
  schema_transcript?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Object_Representation_Max_Fields = {
  __typename?: 'object_representation_max_fields';
  /** het bestandstype van de represenatatie, container */
  dcterms_format?: Maybe<Scalars['String']>;
  /** de unieke identifier van de IE waarvan dit de representation is */
  ie_schema_identifier?: Maybe<Scalars['String']>;
  /** label */
  schema_alternate_name?: Maybe<Scalars['String']>;
  /** datum waarop de resource van de representation werd aangemaakt */
  schema_date_created?: Maybe<Scalars['timestamp']>;
  /** de optionele beschrijving van de representatie zelf */
  schema_description?: Maybe<Scalars['String']>;
  /** de unieke identifier van de representatie */
  schema_identifier?: Maybe<Scalars['String']>;
  /** filename aka PathToVideo */
  schema_name?: Maybe<Scalars['String']>;
  /** de geschreven neerslag van een IE zijn audio */
  schema_transcript?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "object.representation" */
export type Object_Representation_Max_Order_By = {
  /** het bestandstype van de represenatatie, container */
  dcterms_format?: InputMaybe<Order_By>;
  /** de unieke identifier van de IE waarvan dit de representation is */
  ie_schema_identifier?: InputMaybe<Order_By>;
  /** label */
  schema_alternate_name?: InputMaybe<Order_By>;
  /** datum waarop de resource van de representation werd aangemaakt */
  schema_date_created?: InputMaybe<Order_By>;
  /** de optionele beschrijving van de representatie zelf */
  schema_description?: InputMaybe<Order_By>;
  /** de unieke identifier van de representatie */
  schema_identifier?: InputMaybe<Order_By>;
  /** filename aka PathToVideo */
  schema_name?: InputMaybe<Order_By>;
  /** de geschreven neerslag van een IE zijn audio */
  schema_transcript?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Object_Representation_Min_Fields = {
  __typename?: 'object_representation_min_fields';
  /** het bestandstype van de represenatatie, container */
  dcterms_format?: Maybe<Scalars['String']>;
  /** de unieke identifier van de IE waarvan dit de representation is */
  ie_schema_identifier?: Maybe<Scalars['String']>;
  /** label */
  schema_alternate_name?: Maybe<Scalars['String']>;
  /** datum waarop de resource van de representation werd aangemaakt */
  schema_date_created?: Maybe<Scalars['timestamp']>;
  /** de optionele beschrijving van de representatie zelf */
  schema_description?: Maybe<Scalars['String']>;
  /** de unieke identifier van de representatie */
  schema_identifier?: Maybe<Scalars['String']>;
  /** filename aka PathToVideo */
  schema_name?: Maybe<Scalars['String']>;
  /** de geschreven neerslag van een IE zijn audio */
  schema_transcript?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "object.representation" */
export type Object_Representation_Min_Order_By = {
  /** het bestandstype van de represenatatie, container */
  dcterms_format?: InputMaybe<Order_By>;
  /** de unieke identifier van de IE waarvan dit de representation is */
  ie_schema_identifier?: InputMaybe<Order_By>;
  /** label */
  schema_alternate_name?: InputMaybe<Order_By>;
  /** datum waarop de resource van de representation werd aangemaakt */
  schema_date_created?: InputMaybe<Order_By>;
  /** de optionele beschrijving van de representatie zelf */
  schema_description?: InputMaybe<Order_By>;
  /** de unieke identifier van de representatie */
  schema_identifier?: InputMaybe<Order_By>;
  /** filename aka PathToVideo */
  schema_name?: InputMaybe<Order_By>;
  /** de geschreven neerslag van een IE zijn audio */
  schema_transcript?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "object.representation" */
export type Object_Representation_Mutation_Response = {
  __typename?: 'object_representation_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Object_Representation>;
};

/** input type for inserting object relation for remote table "object.representation" */
export type Object_Representation_Obj_Rel_Insert_Input = {
  data: Object_Representation_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Object_Representation_On_Conflict>;
};

/** on_conflict condition type for table "object.representation" */
export type Object_Representation_On_Conflict = {
  constraint: Object_Representation_Constraint;
  update_columns?: Array<Object_Representation_Update_Column>;
  where?: InputMaybe<Object_Representation_Bool_Exp>;
};

/** Ordering options when selecting data from "object.representation". */
export type Object_Representation_Order_By = {
  dcterms_format?: InputMaybe<Order_By>;
  ie_schema_identifier?: InputMaybe<Order_By>;
  premis_includes_aggregate?: InputMaybe<Object_File_Aggregate_Order_By>;
  premis_represents?: InputMaybe<Object_Ie_Order_By>;
  schema_alternate_name?: InputMaybe<Order_By>;
  schema_date_created?: InputMaybe<Order_By>;
  schema_description?: InputMaybe<Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  schema_transcript?: InputMaybe<Order_By>;
};

/** primary key columns input for table: object_representation */
export type Object_Representation_Pk_Columns_Input = {
  /** de unieke identifier van de representatie */
  schema_identifier: Scalars['String'];
};

/** select columns of table "object.representation" */
export enum Object_Representation_Select_Column {
  /** column name */
  DctermsFormat = 'dcterms_format',
  /** column name */
  IeSchemaIdentifier = 'ie_schema_identifier',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  SchemaDateCreated = 'schema_date_created',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaTranscript = 'schema_transcript'
}

/** input type for updating data in table "object.representation" */
export type Object_Representation_Set_Input = {
  /** het bestandstype van de represenatatie, container */
  dcterms_format?: InputMaybe<Scalars['String']>;
  /** de unieke identifier van de IE waarvan dit de representation is */
  ie_schema_identifier?: InputMaybe<Scalars['String']>;
  /** label */
  schema_alternate_name?: InputMaybe<Scalars['String']>;
  /** datum waarop de resource van de representation werd aangemaakt */
  schema_date_created?: InputMaybe<Scalars['timestamp']>;
  /** de optionele beschrijving van de representatie zelf */
  schema_description?: InputMaybe<Scalars['String']>;
  /** de unieke identifier van de representatie */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** filename aka PathToVideo */
  schema_name?: InputMaybe<Scalars['String']>;
  /** de geschreven neerslag van een IE zijn audio */
  schema_transcript?: InputMaybe<Scalars['String']>;
};

/** update columns of table "object.representation" */
export enum Object_Representation_Update_Column {
  /** column name */
  DctermsFormat = 'dcterms_format',
  /** column name */
  IeSchemaIdentifier = 'ie_schema_identifier',
  /** column name */
  SchemaAlternateName = 'schema_alternate_name',
  /** column name */
  SchemaDateCreated = 'schema_date_created',
  /** column name */
  SchemaDescription = 'schema_description',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  SchemaTranscript = 'schema_transcript'
}

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

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "app.notification" */
  app_notification: Array<App_Notification>;
  /** fetch aggregated fields from the table: "app.notification" */
  app_notification_aggregate: App_Notification_Aggregate;
  /** fetch data from the table: "app.notification" using primary key columns */
  app_notification_by_pk?: Maybe<App_Notification>;
  /** fetch data from the table: "cms.content" */
  cms_content: Array<Cms_Content>;
  /** fetch aggregated fields from the table: "cms.content" */
  cms_content_aggregate: Cms_Content_Aggregate;
  /** fetch data from the table: "cms.content_blocks" */
  cms_content_blocks: Array<Cms_Content_Blocks>;
  /** fetch aggregated fields from the table: "cms.content_blocks" */
  cms_content_blocks_aggregate: Cms_Content_Blocks_Aggregate;
  /** fetch data from the table: "cms.content_blocks" using primary key columns */
  cms_content_blocks_by_pk?: Maybe<Cms_Content_Blocks>;
  /** fetch data from the table: "cms.content" using primary key columns */
  cms_content_by_pk?: Maybe<Cms_Content>;
  /** fetch data from the table: "cms.content_content_labels" */
  cms_content_content_labels: Array<Cms_Content_Content_Labels>;
  /** fetch aggregated fields from the table: "cms.content_content_labels" */
  cms_content_content_labels_aggregate: Cms_Content_Content_Labels_Aggregate;
  /** fetch data from the table: "cms.content_content_labels" using primary key columns */
  cms_content_content_labels_by_pk?: Maybe<Cms_Content_Content_Labels>;
  /** fetch data from the table: "cms.content_labels" */
  cms_content_labels: Array<Cms_Content_Labels>;
  /** fetch aggregated fields from the table: "cms.content_labels" */
  cms_content_labels_aggregate: Cms_Content_Labels_Aggregate;
  /** fetch data from the table: "cms.content_labels" using primary key columns */
  cms_content_labels_by_pk?: Maybe<Cms_Content_Labels>;
  /** fetch data from the table: "cms.navigation_element" */
  cms_navigation_element: Array<Cms_Navigation_Element>;
  /** fetch aggregated fields from the table: "cms.navigation_element" */
  cms_navigation_element_aggregate: Cms_Navigation_Element_Aggregate;
  /** fetch data from the table: "cms.navigation_element" using primary key columns */
  cms_navigation_element_by_pk?: Maybe<Cms_Navigation_Element>;
  /** fetch data from the table: "cms.site_variables" */
  cms_site_variables: Array<Cms_Site_Variables>;
  /** fetch aggregated fields from the table: "cms.site_variables" */
  cms_site_variables_aggregate: Cms_Site_Variables_Aggregate;
  /** fetch data from the table: "cms.site_variables" using primary key columns */
  cms_site_variables_by_pk?: Maybe<Cms_Site_Variables>;
  contentpartners?: Maybe<Array<Maybe<ContentPartner>>>;
  /** fetch data from the table: "cp.index" */
  cp_index: Array<Cp_Index>;
  /** fetch aggregated fields from the table: "cp.index" */
  cp_index_aggregate: Cp_Index_Aggregate;
  /** fetch data from the table: "cp.index" using primary key columns */
  cp_index_by_pk?: Maybe<Cp_Index>;
  /** fetch data from the table: "cp.maintainer" */
  cp_maintainer: Array<Cp_Maintainer>;
  /** fetch aggregated fields from the table: "cp.maintainer" */
  cp_maintainer_aggregate: Cp_Maintainer_Aggregate;
  /** fetch data from the table: "cp.maintainer" using primary key columns */
  cp_maintainer_by_pk?: Maybe<Cp_Maintainer>;
  /** fetch data from the table: "cp.maintainer_users_profile" */
  cp_maintainer_users_profile: Array<Cp_Maintainer_Users_Profile>;
  /** fetch aggregated fields from the table: "cp.maintainer_users_profile" */
  cp_maintainer_users_profile_aggregate: Cp_Maintainer_Users_Profile_Aggregate;
  /** fetch data from the table: "cp.maintainer_users_profile" using primary key columns */
  cp_maintainer_users_profile_by_pk?: Maybe<Cp_Maintainer_Users_Profile>;
  /** fetch data from the table: "cp.space" */
  cp_space: Array<Cp_Space>;
  /** fetch aggregated fields from the table: "cp.space" */
  cp_space_aggregate: Cp_Space_Aggregate;
  /** fetch data from the table: "cp.space" using primary key columns */
  cp_space_by_pk?: Maybe<Cp_Space>;
  /** fetch data from the table: "cp.visit" */
  cp_visit: Array<Cp_Visit>;
  /** fetch aggregated fields from the table: "cp.visit" */
  cp_visit_aggregate: Cp_Visit_Aggregate;
  /** fetch data from the table: "cp.visit" using primary key columns */
  cp_visit_by_pk?: Maybe<Cp_Visit>;
  /** fetch data from the table: "cp.visit_note" */
  cp_visit_note: Array<Cp_Visit_Note>;
  /** fetch aggregated fields from the table: "cp.visit_note" */
  cp_visit_note_aggregate: Cp_Visit_Note_Aggregate;
  /** fetch data from the table: "cp.visit_note" using primary key columns */
  cp_visit_note_by_pk?: Maybe<Cp_Visit_Note>;
  /** fetch data from the table: "lookup.app_notification_type" */
  lookup_app_notification_type: Array<Lookup_App_Notification_Type>;
  /** fetch aggregated fields from the table: "lookup.app_notification_type" */
  lookup_app_notification_type_aggregate: Lookup_App_Notification_Type_Aggregate;
  /** fetch data from the table: "lookup.app_notification_type" using primary key columns */
  lookup_app_notification_type_by_pk?: Maybe<Lookup_App_Notification_Type>;
  /** fetch data from the table: "lookup.cms_content_block_type" */
  lookup_cms_content_block_type: Array<Lookup_Cms_Content_Block_Type>;
  /** fetch aggregated fields from the table: "lookup.cms_content_block_type" */
  lookup_cms_content_block_type_aggregate: Lookup_Cms_Content_Block_Type_Aggregate;
  /** fetch data from the table: "lookup.cms_content_block_type" using primary key columns */
  lookup_cms_content_block_type_by_pk?: Maybe<Lookup_Cms_Content_Block_Type>;
  /** fetch data from the table: "lookup.cms_content_type" */
  lookup_cms_content_type: Array<Lookup_Cms_Content_Type>;
  /** fetch aggregated fields from the table: "lookup.cms_content_type" */
  lookup_cms_content_type_aggregate: Lookup_Cms_Content_Type_Aggregate;
  /** fetch data from the table: "lookup.cms_content_type" using primary key columns */
  lookup_cms_content_type_by_pk?: Maybe<Lookup_Cms_Content_Type>;
  /** fetch data from the table: "lookup.cp_visit_status" */
  lookup_cp_visit_status: Array<Lookup_Cp_Visit_Status>;
  /** fetch aggregated fields from the table: "lookup.cp_visit_status" */
  lookup_cp_visit_status_aggregate: Lookup_Cp_Visit_Status_Aggregate;
  /** fetch data from the table: "lookup.cp_visit_status" using primary key columns */
  lookup_cp_visit_status_by_pk?: Maybe<Lookup_Cp_Visit_Status>;
  /** fetch data from the table: "lookup.schema_audience_type" */
  lookup_schema_audience_type: Array<Lookup_Schema_Audience_Type>;
  /** fetch aggregated fields from the table: "lookup.schema_audience_type" */
  lookup_schema_audience_type_aggregate: Lookup_Schema_Audience_Type_Aggregate;
  /** fetch data from the table: "lookup.schema_audience_type" using primary key columns */
  lookup_schema_audience_type_by_pk?: Maybe<Lookup_Schema_Audience_Type>;
  /** fetch data from the table: "object.file" */
  object_file: Array<Object_File>;
  /** fetch aggregated fields from the table: "object.file" */
  object_file_aggregate: Object_File_Aggregate;
  /** fetch data from the table: "object.file" using primary key columns */
  object_file_by_pk?: Maybe<Object_File>;
  /** fetch data from the table: "object.ie" */
  object_ie: Array<Object_Ie>;
  /** fetch aggregated fields from the table: "object.ie" */
  object_ie_aggregate: Object_Ie_Aggregate;
  /** fetch data from the table: "object.ie" using primary key columns */
  object_ie_by_pk?: Maybe<Object_Ie>;
  /** fetch data from the table: "object.ie_index" */
  object_ie_index: Array<Object_Ie_Index>;
  /** fetch aggregated fields from the table: "object.ie_index" */
  object_ie_index_aggregate: Object_Ie_Index_Aggregate;
  /** fetch data from the table: "object.representation" */
  object_representation: Array<Object_Representation>;
  /** fetch aggregated fields from the table: "object.representation" */
  object_representation_aggregate: Object_Representation_Aggregate;
  /** fetch data from the table: "object.representation" using primary key columns */
  object_representation_by_pk?: Maybe<Object_Representation>;
  organizations?: Maybe<Array<Maybe<Organization>>>;
  persons?: Maybe<Array<Maybe<Person>>>;
  schools?: Maybe<Array<Maybe<School>>>;
  /** fetch data from the table: "sync.audio" */
  sync_audio: Array<Sync_Audio>;
  /** fetch aggregated fields from the table: "sync.audio" */
  sync_audio_aggregate: Sync_Audio_Aggregate;
  /** fetch data from the table: "sync.audio" using primary key columns */
  sync_audio_by_pk?: Maybe<Sync_Audio>;
  /** fetch data from the table: "sync.film" */
  sync_film: Array<Sync_Film>;
  /** fetch aggregated fields from the table: "sync.film" */
  sync_film_aggregate: Sync_Film_Aggregate;
  /** fetch data from the table: "sync.film" using primary key columns */
  sync_film_by_pk?: Maybe<Sync_Film>;
  /** fetch data from the table: "sync.video" */
  sync_video: Array<Sync_Video>;
  /** fetch aggregated fields from the table: "sync.video" */
  sync_video_aggregate: Sync_Video_Aggregate;
  /** fetch data from the table: "sync.video" using primary key columns */
  sync_video_by_pk?: Maybe<Sync_Video>;
  /** fetch data from the table: "users.collection" */
  users_collection: Array<Users_Collection>;
  /** fetch aggregated fields from the table: "users.collection" */
  users_collection_aggregate: Users_Collection_Aggregate;
  /** fetch data from the table: "users.collection" using primary key columns */
  users_collection_by_pk?: Maybe<Users_Collection>;
  /** fetch data from the table: "users.collection_ie" */
  users_collection_ie: Array<Users_Collection_Ie>;
  /** fetch aggregated fields from the table: "users.collection_ie" */
  users_collection_ie_aggregate: Users_Collection_Ie_Aggregate;
  /** fetch data from the table: "users.collection_ie" using primary key columns */
  users_collection_ie_by_pk?: Maybe<Users_Collection_Ie>;
  /** fetch data from the table: "users.group" */
  users_group: Array<Users_Group>;
  /** fetch aggregated fields from the table: "users.group" */
  users_group_aggregate: Users_Group_Aggregate;
  /** fetch data from the table: "users.group" using primary key columns */
  users_group_by_pk?: Maybe<Users_Group>;
  /** fetch data from the table: "users.group_permission" */
  users_group_permission: Array<Users_Group_Permission>;
  /** fetch aggregated fields from the table: "users.group_permission" */
  users_group_permission_aggregate: Users_Group_Permission_Aggregate;
  /** fetch data from the table: "users.group_permission" using primary key columns */
  users_group_permission_by_pk?: Maybe<Users_Group_Permission>;
  /** fetch data from the table: "users.identity" */
  users_identity: Array<Users_Identity>;
  /** fetch aggregated fields from the table: "users.identity" */
  users_identity_aggregate: Users_Identity_Aggregate;
  /** fetch data from the table: "users.identity" using primary key columns */
  users_identity_by_pk?: Maybe<Users_Identity>;
  /** fetch data from the table: "users.identity_provider" */
  users_identity_provider: Array<Users_Identity_Provider>;
  /** fetch aggregated fields from the table: "users.identity_provider" */
  users_identity_provider_aggregate: Users_Identity_Provider_Aggregate;
  /** fetch data from the table: "users.identity_provider" using primary key columns */
  users_identity_provider_by_pk?: Maybe<Users_Identity_Provider>;
  /** fetch data from the table: "users.permission" */
  users_permission: Array<Users_Permission>;
  /** fetch aggregated fields from the table: "users.permission" */
  users_permission_aggregate: Users_Permission_Aggregate;
  /** fetch data from the table: "users.permission" using primary key columns */
  users_permission_by_pk?: Maybe<Users_Permission>;
  /** fetch data from the table: "users.profile" */
  users_profile: Array<Users_Profile>;
  /** fetch aggregated fields from the table: "users.profile" */
  users_profile_aggregate: Users_Profile_Aggregate;
  /** fetch data from the table: "users.profile" using primary key columns */
  users_profile_by_pk?: Maybe<Users_Profile>;
};


export type Query_RootApp_NotificationArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


export type Query_RootApp_Notification_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


export type Query_RootApp_Notification_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCms_ContentArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Order_By>>;
  where?: InputMaybe<Cms_Content_Bool_Exp>;
};


export type Query_RootCms_Content_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Order_By>>;
  where?: InputMaybe<Cms_Content_Bool_Exp>;
};


export type Query_RootCms_Content_BlocksArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Blocks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Blocks_Order_By>>;
  where?: InputMaybe<Cms_Content_Blocks_Bool_Exp>;
};


export type Query_RootCms_Content_Blocks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Blocks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Blocks_Order_By>>;
  where?: InputMaybe<Cms_Content_Blocks_Bool_Exp>;
};


export type Query_RootCms_Content_Blocks_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCms_Content_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCms_Content_Content_LabelsArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Content_Labels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Content_Labels_Order_By>>;
  where?: InputMaybe<Cms_Content_Content_Labels_Bool_Exp>;
};


export type Query_RootCms_Content_Content_Labels_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Content_Labels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Content_Labels_Order_By>>;
  where?: InputMaybe<Cms_Content_Content_Labels_Bool_Exp>;
};


export type Query_RootCms_Content_Content_Labels_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCms_Content_LabelsArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Labels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Labels_Order_By>>;
  where?: InputMaybe<Cms_Content_Labels_Bool_Exp>;
};


export type Query_RootCms_Content_Labels_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Labels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Labels_Order_By>>;
  where?: InputMaybe<Cms_Content_Labels_Bool_Exp>;
};


export type Query_RootCms_Content_Labels_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCms_Navigation_ElementArgs = {
  distinct_on?: InputMaybe<Array<Cms_Navigation_Element_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Navigation_Element_Order_By>>;
  where?: InputMaybe<Cms_Navigation_Element_Bool_Exp>;
};


export type Query_RootCms_Navigation_Element_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Navigation_Element_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Navigation_Element_Order_By>>;
  where?: InputMaybe<Cms_Navigation_Element_Bool_Exp>;
};


export type Query_RootCms_Navigation_Element_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCms_Site_VariablesArgs = {
  distinct_on?: InputMaybe<Array<Cms_Site_Variables_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Site_Variables_Order_By>>;
  where?: InputMaybe<Cms_Site_Variables_Bool_Exp>;
};


export type Query_RootCms_Site_Variables_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Site_Variables_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Site_Variables_Order_By>>;
  where?: InputMaybe<Cms_Site_Variables_Bool_Exp>;
};


export type Query_RootCms_Site_Variables_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootContentpartnersArgs = {
  id?: InputMaybe<Scalars['String']>;
  iri?: InputMaybe<Scalars['String']>;
};


export type Query_RootCp_IndexArgs = {
  distinct_on?: InputMaybe<Array<Cp_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Index_Order_By>>;
  where?: InputMaybe<Cp_Index_Bool_Exp>;
};


export type Query_RootCp_Index_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Index_Order_By>>;
  where?: InputMaybe<Cp_Index_Bool_Exp>;
};


export type Query_RootCp_Index_By_PkArgs = {
  schema_maintainer_id: Scalars['String'];
};


export type Query_RootCp_MaintainerArgs = {
  distinct_on?: InputMaybe<Array<Cp_Maintainer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Maintainer_Order_By>>;
  where?: InputMaybe<Cp_Maintainer_Bool_Exp>;
};


export type Query_RootCp_Maintainer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Maintainer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Maintainer_Order_By>>;
  where?: InputMaybe<Cp_Maintainer_Bool_Exp>;
};


export type Query_RootCp_Maintainer_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Query_RootCp_Maintainer_Users_ProfileArgs = {
  distinct_on?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Cp_Maintainer_Users_Profile_Bool_Exp>;
};


export type Query_RootCp_Maintainer_Users_Profile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Cp_Maintainer_Users_Profile_Bool_Exp>;
};


export type Query_RootCp_Maintainer_Users_Profile_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCp_SpaceArgs = {
  distinct_on?: InputMaybe<Array<Cp_Space_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Space_Order_By>>;
  where?: InputMaybe<Cp_Space_Bool_Exp>;
};


export type Query_RootCp_Space_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Space_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Space_Order_By>>;
  where?: InputMaybe<Cp_Space_Bool_Exp>;
};


export type Query_RootCp_Space_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCp_VisitArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Order_By>>;
  where?: InputMaybe<Cp_Visit_Bool_Exp>;
};


export type Query_RootCp_Visit_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Order_By>>;
  where?: InputMaybe<Cp_Visit_Bool_Exp>;
};


export type Query_RootCp_Visit_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootCp_Visit_NoteArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Note_Order_By>>;
  where?: InputMaybe<Cp_Visit_Note_Bool_Exp>;
};


export type Query_RootCp_Visit_Note_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Note_Order_By>>;
  where?: InputMaybe<Cp_Visit_Note_Bool_Exp>;
};


export type Query_RootCp_Visit_Note_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootLookup_App_Notification_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Notification_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Notification_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Notification_Type_Bool_Exp>;
};


export type Query_RootLookup_App_Notification_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Notification_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Notification_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Notification_Type_Bool_Exp>;
};


export type Query_RootLookup_App_Notification_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootLookup_Cms_Content_Block_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Cms_Content_Block_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Cms_Content_Block_Type_Order_By>>;
  where?: InputMaybe<Lookup_Cms_Content_Block_Type_Bool_Exp>;
};


export type Query_RootLookup_Cms_Content_Block_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Cms_Content_Block_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Cms_Content_Block_Type_Order_By>>;
  where?: InputMaybe<Lookup_Cms_Content_Block_Type_Bool_Exp>;
};


export type Query_RootLookup_Cms_Content_Block_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootLookup_Cms_Content_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Cms_Content_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Cms_Content_Type_Order_By>>;
  where?: InputMaybe<Lookup_Cms_Content_Type_Bool_Exp>;
};


export type Query_RootLookup_Cms_Content_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Cms_Content_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Cms_Content_Type_Order_By>>;
  where?: InputMaybe<Lookup_Cms_Content_Type_Bool_Exp>;
};


export type Query_RootLookup_Cms_Content_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootLookup_Cp_Visit_StatusArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Cp_Visit_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Cp_Visit_Status_Order_By>>;
  where?: InputMaybe<Lookup_Cp_Visit_Status_Bool_Exp>;
};


export type Query_RootLookup_Cp_Visit_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Cp_Visit_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Cp_Visit_Status_Order_By>>;
  where?: InputMaybe<Lookup_Cp_Visit_Status_Bool_Exp>;
};


export type Query_RootLookup_Cp_Visit_Status_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootLookup_Schema_Audience_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Schema_Audience_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Schema_Audience_Type_Order_By>>;
  where?: InputMaybe<Lookup_Schema_Audience_Type_Bool_Exp>;
};


export type Query_RootLookup_Schema_Audience_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Schema_Audience_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Schema_Audience_Type_Order_By>>;
  where?: InputMaybe<Lookup_Schema_Audience_Type_Bool_Exp>;
};


export type Query_RootLookup_Schema_Audience_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootObject_FileArgs = {
  distinct_on?: InputMaybe<Array<Object_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_File_Order_By>>;
  where?: InputMaybe<Object_File_Bool_Exp>;
};


export type Query_RootObject_File_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_File_Order_By>>;
  where?: InputMaybe<Object_File_Bool_Exp>;
};


export type Query_RootObject_File_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Query_RootObject_IeArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Order_By>>;
  where?: InputMaybe<Object_Ie_Bool_Exp>;
};


export type Query_RootObject_Ie_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Order_By>>;
  where?: InputMaybe<Object_Ie_Bool_Exp>;
};


export type Query_RootObject_Ie_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Query_RootObject_Ie_IndexArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Index_Order_By>>;
  where?: InputMaybe<Object_Ie_Index_Bool_Exp>;
};


export type Query_RootObject_Ie_Index_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Index_Order_By>>;
  where?: InputMaybe<Object_Ie_Index_Bool_Exp>;
};


export type Query_RootObject_RepresentationArgs = {
  distinct_on?: InputMaybe<Array<Object_Representation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Representation_Order_By>>;
  where?: InputMaybe<Object_Representation_Bool_Exp>;
};


export type Query_RootObject_Representation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Representation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Representation_Order_By>>;
  where?: InputMaybe<Object_Representation_Bool_Exp>;
};


export type Query_RootObject_Representation_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Query_RootOrganizationsArgs = {
  id?: InputMaybe<Scalars['String']>;
  iri?: InputMaybe<Scalars['String']>;
};


export type Query_RootPersonsArgs = {
  family_name?: InputMaybe<Scalars['String']>;
  given_name?: InputMaybe<Scalars['String']>;
  iri?: InputMaybe<Scalars['String']>;
};


export type Query_RootSchoolsArgs = {
  id?: InputMaybe<Scalars['String']>;
  iri?: InputMaybe<Scalars['String']>;
};


export type Query_RootSync_AudioArgs = {
  distinct_on?: InputMaybe<Array<Sync_Audio_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Audio_Order_By>>;
  where?: InputMaybe<Sync_Audio_Bool_Exp>;
};


export type Query_RootSync_Audio_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sync_Audio_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Audio_Order_By>>;
  where?: InputMaybe<Sync_Audio_Bool_Exp>;
};


export type Query_RootSync_Audio_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


export type Query_RootSync_FilmArgs = {
  distinct_on?: InputMaybe<Array<Sync_Film_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Film_Order_By>>;
  where?: InputMaybe<Sync_Film_Bool_Exp>;
};


export type Query_RootSync_Film_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sync_Film_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Film_Order_By>>;
  where?: InputMaybe<Sync_Film_Bool_Exp>;
};


export type Query_RootSync_Film_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


export type Query_RootSync_VideoArgs = {
  distinct_on?: InputMaybe<Array<Sync_Video_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Video_Order_By>>;
  where?: InputMaybe<Sync_Video_Bool_Exp>;
};


export type Query_RootSync_Video_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sync_Video_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Video_Order_By>>;
  where?: InputMaybe<Sync_Video_Bool_Exp>;
};


export type Query_RootSync_Video_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


export type Query_RootUsers_CollectionArgs = {
  distinct_on?: InputMaybe<Array<Users_Collection_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Collection_Order_By>>;
  where?: InputMaybe<Users_Collection_Bool_Exp>;
};


export type Query_RootUsers_Collection_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Collection_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Collection_Order_By>>;
  where?: InputMaybe<Users_Collection_Bool_Exp>;
};


export type Query_RootUsers_Collection_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsers_Collection_IeArgs = {
  distinct_on?: InputMaybe<Array<Users_Collection_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Collection_Ie_Order_By>>;
  where?: InputMaybe<Users_Collection_Ie_Bool_Exp>;
};


export type Query_RootUsers_Collection_Ie_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Collection_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Collection_Ie_Order_By>>;
  where?: InputMaybe<Users_Collection_Ie_Bool_Exp>;
};


export type Query_RootUsers_Collection_Ie_By_PkArgs = {
  ie_schema_identifier: Scalars['String'];
  user_collection_id: Scalars['uuid'];
};


export type Query_RootUsers_GroupArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Order_By>>;
  where?: InputMaybe<Users_Group_Bool_Exp>;
};


export type Query_RootUsers_Group_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Order_By>>;
  where?: InputMaybe<Users_Group_Bool_Exp>;
};


export type Query_RootUsers_Group_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsers_Group_PermissionArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};


export type Query_RootUsers_Group_Permission_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};


export type Query_RootUsers_Group_Permission_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsers_IdentityArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Order_By>>;
  where?: InputMaybe<Users_Identity_Bool_Exp>;
};


export type Query_RootUsers_Identity_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Order_By>>;
  where?: InputMaybe<Users_Identity_Bool_Exp>;
};


export type Query_RootUsers_Identity_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsers_Identity_ProviderArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Provider_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Provider_Order_By>>;
  where?: InputMaybe<Users_Identity_Provider_Bool_Exp>;
};


export type Query_RootUsers_Identity_Provider_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Provider_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Provider_Order_By>>;
  where?: InputMaybe<Users_Identity_Provider_Bool_Exp>;
};


export type Query_RootUsers_Identity_Provider_By_PkArgs = {
  name: Scalars['String'];
};


export type Query_RootUsers_PermissionArgs = {
  distinct_on?: InputMaybe<Array<Users_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Permission_Order_By>>;
  where?: InputMaybe<Users_Permission_Bool_Exp>;
};


export type Query_RootUsers_Permission_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Permission_Order_By>>;
  where?: InputMaybe<Users_Permission_Bool_Exp>;
};


export type Query_RootUsers_Permission_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUsers_ProfileArgs = {
  distinct_on?: InputMaybe<Array<Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Profile_Order_By>>;
  where?: InputMaybe<Users_Profile_Bool_Exp>;
};


export type Query_RootUsers_Profile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Profile_Order_By>>;
  where?: InputMaybe<Users_Profile_Bool_Exp>;
};


export type Query_RootUsers_Profile_By_PkArgs = {
  id: Scalars['uuid'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "app.notification" */
  app_notification: Array<App_Notification>;
  /** fetch aggregated fields from the table: "app.notification" */
  app_notification_aggregate: App_Notification_Aggregate;
  /** fetch data from the table: "app.notification" using primary key columns */
  app_notification_by_pk?: Maybe<App_Notification>;
  /** fetch data from the table: "cms.content" */
  cms_content: Array<Cms_Content>;
  /** fetch aggregated fields from the table: "cms.content" */
  cms_content_aggregate: Cms_Content_Aggregate;
  /** fetch data from the table: "cms.content_blocks" */
  cms_content_blocks: Array<Cms_Content_Blocks>;
  /** fetch aggregated fields from the table: "cms.content_blocks" */
  cms_content_blocks_aggregate: Cms_Content_Blocks_Aggregate;
  /** fetch data from the table: "cms.content_blocks" using primary key columns */
  cms_content_blocks_by_pk?: Maybe<Cms_Content_Blocks>;
  /** fetch data from the table: "cms.content" using primary key columns */
  cms_content_by_pk?: Maybe<Cms_Content>;
  /** fetch data from the table: "cms.content_content_labels" */
  cms_content_content_labels: Array<Cms_Content_Content_Labels>;
  /** fetch aggregated fields from the table: "cms.content_content_labels" */
  cms_content_content_labels_aggregate: Cms_Content_Content_Labels_Aggregate;
  /** fetch data from the table: "cms.content_content_labels" using primary key columns */
  cms_content_content_labels_by_pk?: Maybe<Cms_Content_Content_Labels>;
  /** fetch data from the table: "cms.content_labels" */
  cms_content_labels: Array<Cms_Content_Labels>;
  /** fetch aggregated fields from the table: "cms.content_labels" */
  cms_content_labels_aggregate: Cms_Content_Labels_Aggregate;
  /** fetch data from the table: "cms.content_labels" using primary key columns */
  cms_content_labels_by_pk?: Maybe<Cms_Content_Labels>;
  /** fetch data from the table: "cms.navigation_element" */
  cms_navigation_element: Array<Cms_Navigation_Element>;
  /** fetch aggregated fields from the table: "cms.navigation_element" */
  cms_navigation_element_aggregate: Cms_Navigation_Element_Aggregate;
  /** fetch data from the table: "cms.navigation_element" using primary key columns */
  cms_navigation_element_by_pk?: Maybe<Cms_Navigation_Element>;
  /** fetch data from the table: "cms.site_variables" */
  cms_site_variables: Array<Cms_Site_Variables>;
  /** fetch aggregated fields from the table: "cms.site_variables" */
  cms_site_variables_aggregate: Cms_Site_Variables_Aggregate;
  /** fetch data from the table: "cms.site_variables" using primary key columns */
  cms_site_variables_by_pk?: Maybe<Cms_Site_Variables>;
  /** fetch data from the table: "cp.index" */
  cp_index: Array<Cp_Index>;
  /** fetch aggregated fields from the table: "cp.index" */
  cp_index_aggregate: Cp_Index_Aggregate;
  /** fetch data from the table: "cp.index" using primary key columns */
  cp_index_by_pk?: Maybe<Cp_Index>;
  /** fetch data from the table: "cp.maintainer" */
  cp_maintainer: Array<Cp_Maintainer>;
  /** fetch aggregated fields from the table: "cp.maintainer" */
  cp_maintainer_aggregate: Cp_Maintainer_Aggregate;
  /** fetch data from the table: "cp.maintainer" using primary key columns */
  cp_maintainer_by_pk?: Maybe<Cp_Maintainer>;
  /** fetch data from the table: "cp.maintainer_users_profile" */
  cp_maintainer_users_profile: Array<Cp_Maintainer_Users_Profile>;
  /** fetch aggregated fields from the table: "cp.maintainer_users_profile" */
  cp_maintainer_users_profile_aggregate: Cp_Maintainer_Users_Profile_Aggregate;
  /** fetch data from the table: "cp.maintainer_users_profile" using primary key columns */
  cp_maintainer_users_profile_by_pk?: Maybe<Cp_Maintainer_Users_Profile>;
  /** fetch data from the table: "cp.space" */
  cp_space: Array<Cp_Space>;
  /** fetch aggregated fields from the table: "cp.space" */
  cp_space_aggregate: Cp_Space_Aggregate;
  /** fetch data from the table: "cp.space" using primary key columns */
  cp_space_by_pk?: Maybe<Cp_Space>;
  /** fetch data from the table: "cp.visit" */
  cp_visit: Array<Cp_Visit>;
  /** fetch aggregated fields from the table: "cp.visit" */
  cp_visit_aggregate: Cp_Visit_Aggregate;
  /** fetch data from the table: "cp.visit" using primary key columns */
  cp_visit_by_pk?: Maybe<Cp_Visit>;
  /** fetch data from the table: "cp.visit_note" */
  cp_visit_note: Array<Cp_Visit_Note>;
  /** fetch aggregated fields from the table: "cp.visit_note" */
  cp_visit_note_aggregate: Cp_Visit_Note_Aggregate;
  /** fetch data from the table: "cp.visit_note" using primary key columns */
  cp_visit_note_by_pk?: Maybe<Cp_Visit_Note>;
  /** fetch data from the table: "lookup.app_notification_type" */
  lookup_app_notification_type: Array<Lookup_App_Notification_Type>;
  /** fetch aggregated fields from the table: "lookup.app_notification_type" */
  lookup_app_notification_type_aggregate: Lookup_App_Notification_Type_Aggregate;
  /** fetch data from the table: "lookup.app_notification_type" using primary key columns */
  lookup_app_notification_type_by_pk?: Maybe<Lookup_App_Notification_Type>;
  /** fetch data from the table: "lookup.cms_content_block_type" */
  lookup_cms_content_block_type: Array<Lookup_Cms_Content_Block_Type>;
  /** fetch aggregated fields from the table: "lookup.cms_content_block_type" */
  lookup_cms_content_block_type_aggregate: Lookup_Cms_Content_Block_Type_Aggregate;
  /** fetch data from the table: "lookup.cms_content_block_type" using primary key columns */
  lookup_cms_content_block_type_by_pk?: Maybe<Lookup_Cms_Content_Block_Type>;
  /** fetch data from the table: "lookup.cms_content_type" */
  lookup_cms_content_type: Array<Lookup_Cms_Content_Type>;
  /** fetch aggregated fields from the table: "lookup.cms_content_type" */
  lookup_cms_content_type_aggregate: Lookup_Cms_Content_Type_Aggregate;
  /** fetch data from the table: "lookup.cms_content_type" using primary key columns */
  lookup_cms_content_type_by_pk?: Maybe<Lookup_Cms_Content_Type>;
  /** fetch data from the table: "lookup.cp_visit_status" */
  lookup_cp_visit_status: Array<Lookup_Cp_Visit_Status>;
  /** fetch aggregated fields from the table: "lookup.cp_visit_status" */
  lookup_cp_visit_status_aggregate: Lookup_Cp_Visit_Status_Aggregate;
  /** fetch data from the table: "lookup.cp_visit_status" using primary key columns */
  lookup_cp_visit_status_by_pk?: Maybe<Lookup_Cp_Visit_Status>;
  /** fetch data from the table: "lookup.schema_audience_type" */
  lookup_schema_audience_type: Array<Lookup_Schema_Audience_Type>;
  /** fetch aggregated fields from the table: "lookup.schema_audience_type" */
  lookup_schema_audience_type_aggregate: Lookup_Schema_Audience_Type_Aggregate;
  /** fetch data from the table: "lookup.schema_audience_type" using primary key columns */
  lookup_schema_audience_type_by_pk?: Maybe<Lookup_Schema_Audience_Type>;
  /** fetch data from the table: "object.file" */
  object_file: Array<Object_File>;
  /** fetch aggregated fields from the table: "object.file" */
  object_file_aggregate: Object_File_Aggregate;
  /** fetch data from the table: "object.file" using primary key columns */
  object_file_by_pk?: Maybe<Object_File>;
  /** fetch data from the table: "object.ie" */
  object_ie: Array<Object_Ie>;
  /** fetch aggregated fields from the table: "object.ie" */
  object_ie_aggregate: Object_Ie_Aggregate;
  /** fetch data from the table: "object.ie" using primary key columns */
  object_ie_by_pk?: Maybe<Object_Ie>;
  /** fetch data from the table: "object.ie_index" */
  object_ie_index: Array<Object_Ie_Index>;
  /** fetch aggregated fields from the table: "object.ie_index" */
  object_ie_index_aggregate: Object_Ie_Index_Aggregate;
  /** fetch data from the table: "object.representation" */
  object_representation: Array<Object_Representation>;
  /** fetch aggregated fields from the table: "object.representation" */
  object_representation_aggregate: Object_Representation_Aggregate;
  /** fetch data from the table: "object.representation" using primary key columns */
  object_representation_by_pk?: Maybe<Object_Representation>;
  /** fetch data from the table: "sync.audio" */
  sync_audio: Array<Sync_Audio>;
  /** fetch aggregated fields from the table: "sync.audio" */
  sync_audio_aggregate: Sync_Audio_Aggregate;
  /** fetch data from the table: "sync.audio" using primary key columns */
  sync_audio_by_pk?: Maybe<Sync_Audio>;
  /** fetch data from the table: "sync.film" */
  sync_film: Array<Sync_Film>;
  /** fetch aggregated fields from the table: "sync.film" */
  sync_film_aggregate: Sync_Film_Aggregate;
  /** fetch data from the table: "sync.film" using primary key columns */
  sync_film_by_pk?: Maybe<Sync_Film>;
  /** fetch data from the table: "sync.video" */
  sync_video: Array<Sync_Video>;
  /** fetch aggregated fields from the table: "sync.video" */
  sync_video_aggregate: Sync_Video_Aggregate;
  /** fetch data from the table: "sync.video" using primary key columns */
  sync_video_by_pk?: Maybe<Sync_Video>;
  /** fetch data from the table: "users.collection" */
  users_collection: Array<Users_Collection>;
  /** fetch aggregated fields from the table: "users.collection" */
  users_collection_aggregate: Users_Collection_Aggregate;
  /** fetch data from the table: "users.collection" using primary key columns */
  users_collection_by_pk?: Maybe<Users_Collection>;
  /** fetch data from the table: "users.collection_ie" */
  users_collection_ie: Array<Users_Collection_Ie>;
  /** fetch aggregated fields from the table: "users.collection_ie" */
  users_collection_ie_aggregate: Users_Collection_Ie_Aggregate;
  /** fetch data from the table: "users.collection_ie" using primary key columns */
  users_collection_ie_by_pk?: Maybe<Users_Collection_Ie>;
  /** fetch data from the table: "users.group" */
  users_group: Array<Users_Group>;
  /** fetch aggregated fields from the table: "users.group" */
  users_group_aggregate: Users_Group_Aggregate;
  /** fetch data from the table: "users.group" using primary key columns */
  users_group_by_pk?: Maybe<Users_Group>;
  /** fetch data from the table: "users.group_permission" */
  users_group_permission: Array<Users_Group_Permission>;
  /** fetch aggregated fields from the table: "users.group_permission" */
  users_group_permission_aggregate: Users_Group_Permission_Aggregate;
  /** fetch data from the table: "users.group_permission" using primary key columns */
  users_group_permission_by_pk?: Maybe<Users_Group_Permission>;
  /** fetch data from the table: "users.identity" */
  users_identity: Array<Users_Identity>;
  /** fetch aggregated fields from the table: "users.identity" */
  users_identity_aggregate: Users_Identity_Aggregate;
  /** fetch data from the table: "users.identity" using primary key columns */
  users_identity_by_pk?: Maybe<Users_Identity>;
  /** fetch data from the table: "users.identity_provider" */
  users_identity_provider: Array<Users_Identity_Provider>;
  /** fetch aggregated fields from the table: "users.identity_provider" */
  users_identity_provider_aggregate: Users_Identity_Provider_Aggregate;
  /** fetch data from the table: "users.identity_provider" using primary key columns */
  users_identity_provider_by_pk?: Maybe<Users_Identity_Provider>;
  /** fetch data from the table: "users.permission" */
  users_permission: Array<Users_Permission>;
  /** fetch aggregated fields from the table: "users.permission" */
  users_permission_aggregate: Users_Permission_Aggregate;
  /** fetch data from the table: "users.permission" using primary key columns */
  users_permission_by_pk?: Maybe<Users_Permission>;
  /** fetch data from the table: "users.profile" */
  users_profile: Array<Users_Profile>;
  /** fetch aggregated fields from the table: "users.profile" */
  users_profile_aggregate: Users_Profile_Aggregate;
  /** fetch data from the table: "users.profile" using primary key columns */
  users_profile_by_pk?: Maybe<Users_Profile>;
};


export type Subscription_RootApp_NotificationArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


export type Subscription_RootApp_Notification_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


export type Subscription_RootApp_Notification_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCms_ContentArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Order_By>>;
  where?: InputMaybe<Cms_Content_Bool_Exp>;
};


export type Subscription_RootCms_Content_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Order_By>>;
  where?: InputMaybe<Cms_Content_Bool_Exp>;
};


export type Subscription_RootCms_Content_BlocksArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Blocks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Blocks_Order_By>>;
  where?: InputMaybe<Cms_Content_Blocks_Bool_Exp>;
};


export type Subscription_RootCms_Content_Blocks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Blocks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Blocks_Order_By>>;
  where?: InputMaybe<Cms_Content_Blocks_Bool_Exp>;
};


export type Subscription_RootCms_Content_Blocks_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCms_Content_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCms_Content_Content_LabelsArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Content_Labels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Content_Labels_Order_By>>;
  where?: InputMaybe<Cms_Content_Content_Labels_Bool_Exp>;
};


export type Subscription_RootCms_Content_Content_Labels_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Content_Labels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Content_Labels_Order_By>>;
  where?: InputMaybe<Cms_Content_Content_Labels_Bool_Exp>;
};


export type Subscription_RootCms_Content_Content_Labels_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCms_Content_LabelsArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Labels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Labels_Order_By>>;
  where?: InputMaybe<Cms_Content_Labels_Bool_Exp>;
};


export type Subscription_RootCms_Content_Labels_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Content_Labels_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Content_Labels_Order_By>>;
  where?: InputMaybe<Cms_Content_Labels_Bool_Exp>;
};


export type Subscription_RootCms_Content_Labels_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCms_Navigation_ElementArgs = {
  distinct_on?: InputMaybe<Array<Cms_Navigation_Element_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Navigation_Element_Order_By>>;
  where?: InputMaybe<Cms_Navigation_Element_Bool_Exp>;
};


export type Subscription_RootCms_Navigation_Element_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Navigation_Element_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Navigation_Element_Order_By>>;
  where?: InputMaybe<Cms_Navigation_Element_Bool_Exp>;
};


export type Subscription_RootCms_Navigation_Element_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCms_Site_VariablesArgs = {
  distinct_on?: InputMaybe<Array<Cms_Site_Variables_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Site_Variables_Order_By>>;
  where?: InputMaybe<Cms_Site_Variables_Bool_Exp>;
};


export type Subscription_RootCms_Site_Variables_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cms_Site_Variables_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cms_Site_Variables_Order_By>>;
  where?: InputMaybe<Cms_Site_Variables_Bool_Exp>;
};


export type Subscription_RootCms_Site_Variables_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootCp_IndexArgs = {
  distinct_on?: InputMaybe<Array<Cp_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Index_Order_By>>;
  where?: InputMaybe<Cp_Index_Bool_Exp>;
};


export type Subscription_RootCp_Index_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Index_Order_By>>;
  where?: InputMaybe<Cp_Index_Bool_Exp>;
};


export type Subscription_RootCp_Index_By_PkArgs = {
  schema_maintainer_id: Scalars['String'];
};


export type Subscription_RootCp_MaintainerArgs = {
  distinct_on?: InputMaybe<Array<Cp_Maintainer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Maintainer_Order_By>>;
  where?: InputMaybe<Cp_Maintainer_Bool_Exp>;
};


export type Subscription_RootCp_Maintainer_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Maintainer_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Maintainer_Order_By>>;
  where?: InputMaybe<Cp_Maintainer_Bool_Exp>;
};


export type Subscription_RootCp_Maintainer_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Subscription_RootCp_Maintainer_Users_ProfileArgs = {
  distinct_on?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Cp_Maintainer_Users_Profile_Bool_Exp>;
};


export type Subscription_RootCp_Maintainer_Users_Profile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Cp_Maintainer_Users_Profile_Bool_Exp>;
};


export type Subscription_RootCp_Maintainer_Users_Profile_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCp_SpaceArgs = {
  distinct_on?: InputMaybe<Array<Cp_Space_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Space_Order_By>>;
  where?: InputMaybe<Cp_Space_Bool_Exp>;
};


export type Subscription_RootCp_Space_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Space_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Space_Order_By>>;
  where?: InputMaybe<Cp_Space_Bool_Exp>;
};


export type Subscription_RootCp_Space_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCp_VisitArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Order_By>>;
  where?: InputMaybe<Cp_Visit_Bool_Exp>;
};


export type Subscription_RootCp_Visit_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Order_By>>;
  where?: InputMaybe<Cp_Visit_Bool_Exp>;
};


export type Subscription_RootCp_Visit_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCp_Visit_NoteArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Note_Order_By>>;
  where?: InputMaybe<Cp_Visit_Note_Bool_Exp>;
};


export type Subscription_RootCp_Visit_Note_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Note_Order_By>>;
  where?: InputMaybe<Cp_Visit_Note_Bool_Exp>;
};


export type Subscription_RootCp_Visit_Note_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootLookup_App_Notification_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Notification_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Notification_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Notification_Type_Bool_Exp>;
};


export type Subscription_RootLookup_App_Notification_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_App_Notification_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_App_Notification_Type_Order_By>>;
  where?: InputMaybe<Lookup_App_Notification_Type_Bool_Exp>;
};


export type Subscription_RootLookup_App_Notification_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootLookup_Cms_Content_Block_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Cms_Content_Block_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Cms_Content_Block_Type_Order_By>>;
  where?: InputMaybe<Lookup_Cms_Content_Block_Type_Bool_Exp>;
};


export type Subscription_RootLookup_Cms_Content_Block_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Cms_Content_Block_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Cms_Content_Block_Type_Order_By>>;
  where?: InputMaybe<Lookup_Cms_Content_Block_Type_Bool_Exp>;
};


export type Subscription_RootLookup_Cms_Content_Block_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootLookup_Cms_Content_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Cms_Content_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Cms_Content_Type_Order_By>>;
  where?: InputMaybe<Lookup_Cms_Content_Type_Bool_Exp>;
};


export type Subscription_RootLookup_Cms_Content_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Cms_Content_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Cms_Content_Type_Order_By>>;
  where?: InputMaybe<Lookup_Cms_Content_Type_Bool_Exp>;
};


export type Subscription_RootLookup_Cms_Content_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootLookup_Cp_Visit_StatusArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Cp_Visit_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Cp_Visit_Status_Order_By>>;
  where?: InputMaybe<Lookup_Cp_Visit_Status_Bool_Exp>;
};


export type Subscription_RootLookup_Cp_Visit_Status_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Cp_Visit_Status_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Cp_Visit_Status_Order_By>>;
  where?: InputMaybe<Lookup_Cp_Visit_Status_Bool_Exp>;
};


export type Subscription_RootLookup_Cp_Visit_Status_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootLookup_Schema_Audience_TypeArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Schema_Audience_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Schema_Audience_Type_Order_By>>;
  where?: InputMaybe<Lookup_Schema_Audience_Type_Bool_Exp>;
};


export type Subscription_RootLookup_Schema_Audience_Type_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Lookup_Schema_Audience_Type_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Lookup_Schema_Audience_Type_Order_By>>;
  where?: InputMaybe<Lookup_Schema_Audience_Type_Bool_Exp>;
};


export type Subscription_RootLookup_Schema_Audience_Type_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootObject_FileArgs = {
  distinct_on?: InputMaybe<Array<Object_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_File_Order_By>>;
  where?: InputMaybe<Object_File_Bool_Exp>;
};


export type Subscription_RootObject_File_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_File_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_File_Order_By>>;
  where?: InputMaybe<Object_File_Bool_Exp>;
};


export type Subscription_RootObject_File_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Subscription_RootObject_IeArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Order_By>>;
  where?: InputMaybe<Object_Ie_Bool_Exp>;
};


export type Subscription_RootObject_Ie_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Order_By>>;
  where?: InputMaybe<Object_Ie_Bool_Exp>;
};


export type Subscription_RootObject_Ie_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Subscription_RootObject_Ie_IndexArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Index_Order_By>>;
  where?: InputMaybe<Object_Ie_Index_Bool_Exp>;
};


export type Subscription_RootObject_Ie_Index_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Ie_Index_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Ie_Index_Order_By>>;
  where?: InputMaybe<Object_Ie_Index_Bool_Exp>;
};


export type Subscription_RootObject_RepresentationArgs = {
  distinct_on?: InputMaybe<Array<Object_Representation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Representation_Order_By>>;
  where?: InputMaybe<Object_Representation_Bool_Exp>;
};


export type Subscription_RootObject_Representation_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Object_Representation_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Object_Representation_Order_By>>;
  where?: InputMaybe<Object_Representation_Bool_Exp>;
};


export type Subscription_RootObject_Representation_By_PkArgs = {
  schema_identifier: Scalars['String'];
};


export type Subscription_RootSync_AudioArgs = {
  distinct_on?: InputMaybe<Array<Sync_Audio_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Audio_Order_By>>;
  where?: InputMaybe<Sync_Audio_Bool_Exp>;
};


export type Subscription_RootSync_Audio_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sync_Audio_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Audio_Order_By>>;
  where?: InputMaybe<Sync_Audio_Bool_Exp>;
};


export type Subscription_RootSync_Audio_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


export type Subscription_RootSync_FilmArgs = {
  distinct_on?: InputMaybe<Array<Sync_Film_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Film_Order_By>>;
  where?: InputMaybe<Sync_Film_Bool_Exp>;
};


export type Subscription_RootSync_Film_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sync_Film_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Film_Order_By>>;
  where?: InputMaybe<Sync_Film_Bool_Exp>;
};


export type Subscription_RootSync_Film_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


export type Subscription_RootSync_VideoArgs = {
  distinct_on?: InputMaybe<Array<Sync_Video_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Video_Order_By>>;
  where?: InputMaybe<Sync_Video_Bool_Exp>;
};


export type Subscription_RootSync_Video_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sync_Video_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Video_Order_By>>;
  where?: InputMaybe<Sync_Video_Bool_Exp>;
};


export type Subscription_RootSync_Video_By_PkArgs = {
  meemoo_fragment_id: Scalars['String'];
};


export type Subscription_RootUsers_CollectionArgs = {
  distinct_on?: InputMaybe<Array<Users_Collection_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Collection_Order_By>>;
  where?: InputMaybe<Users_Collection_Bool_Exp>;
};


export type Subscription_RootUsers_Collection_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Collection_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Collection_Order_By>>;
  where?: InputMaybe<Users_Collection_Bool_Exp>;
};


export type Subscription_RootUsers_Collection_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUsers_Collection_IeArgs = {
  distinct_on?: InputMaybe<Array<Users_Collection_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Collection_Ie_Order_By>>;
  where?: InputMaybe<Users_Collection_Ie_Bool_Exp>;
};


export type Subscription_RootUsers_Collection_Ie_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Collection_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Collection_Ie_Order_By>>;
  where?: InputMaybe<Users_Collection_Ie_Bool_Exp>;
};


export type Subscription_RootUsers_Collection_Ie_By_PkArgs = {
  ie_schema_identifier: Scalars['String'];
  user_collection_id: Scalars['uuid'];
};


export type Subscription_RootUsers_GroupArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Order_By>>;
  where?: InputMaybe<Users_Group_Bool_Exp>;
};


export type Subscription_RootUsers_Group_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Order_By>>;
  where?: InputMaybe<Users_Group_Bool_Exp>;
};


export type Subscription_RootUsers_Group_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUsers_Group_PermissionArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};


export type Subscription_RootUsers_Group_Permission_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};


export type Subscription_RootUsers_Group_Permission_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUsers_IdentityArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Order_By>>;
  where?: InputMaybe<Users_Identity_Bool_Exp>;
};


export type Subscription_RootUsers_Identity_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Order_By>>;
  where?: InputMaybe<Users_Identity_Bool_Exp>;
};


export type Subscription_RootUsers_Identity_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUsers_Identity_ProviderArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Provider_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Provider_Order_By>>;
  where?: InputMaybe<Users_Identity_Provider_Bool_Exp>;
};


export type Subscription_RootUsers_Identity_Provider_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Provider_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Provider_Order_By>>;
  where?: InputMaybe<Users_Identity_Provider_Bool_Exp>;
};


export type Subscription_RootUsers_Identity_Provider_By_PkArgs = {
  name: Scalars['String'];
};


export type Subscription_RootUsers_PermissionArgs = {
  distinct_on?: InputMaybe<Array<Users_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Permission_Order_By>>;
  where?: InputMaybe<Users_Permission_Bool_Exp>;
};


export type Subscription_RootUsers_Permission_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Permission_Order_By>>;
  where?: InputMaybe<Users_Permission_Bool_Exp>;
};


export type Subscription_RootUsers_Permission_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUsers_ProfileArgs = {
  distinct_on?: InputMaybe<Array<Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Profile_Order_By>>;
  where?: InputMaybe<Users_Profile_Bool_Exp>;
};


export type Subscription_RootUsers_Profile_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Profile_Order_By>>;
  where?: InputMaybe<Users_Profile_Bool_Exp>;
};


export type Subscription_RootUsers_Profile_By_PkArgs = {
  id: Scalars['uuid'];
};

/** columns and relationships of "sync.audio" */
export type Sync_Audio = {
  __typename?: 'sync_audio';
  created_at: Scalars['timestamptz'];
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data: Scalars['jsonb'];
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id: Scalars['String'];
  /** De meemoo pid of external_id */
  schema_identifier: Scalars['String'];
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id: Scalars['String'];
  /** De human readable titel van het object */
  schema_name: Scalars['String'];
  status: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "sync.audio" */
export type Sync_AudioDataArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "sync.audio" */
export type Sync_Audio_Aggregate = {
  __typename?: 'sync_audio_aggregate';
  aggregate?: Maybe<Sync_Audio_Aggregate_Fields>;
  nodes: Array<Sync_Audio>;
};

/** aggregate fields of "sync.audio" */
export type Sync_Audio_Aggregate_Fields = {
  __typename?: 'sync_audio_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Sync_Audio_Max_Fields>;
  min?: Maybe<Sync_Audio_Min_Fields>;
};


/** aggregate fields of "sync.audio" */
export type Sync_Audio_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sync_Audio_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Sync_Audio_Append_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "sync.audio". All fields are combined with a logical 'AND'. */
export type Sync_Audio_Bool_Exp = {
  _and?: InputMaybe<Array<Sync_Audio_Bool_Exp>>;
  _not?: InputMaybe<Sync_Audio_Bool_Exp>;
  _or?: InputMaybe<Array<Sync_Audio_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  data?: InputMaybe<Jsonb_Comparison_Exp>;
  meemoo_fragment_id?: InputMaybe<String_Comparison_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_maintainer_id?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "sync.audio" */
export enum Sync_Audio_Constraint {
  /** unique or primary key constraint */
  AudioPkey = 'audio_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Sync_Audio_Delete_At_Path_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Sync_Audio_Delete_Elem_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Sync_Audio_Delete_Key_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "sync.audio" */
export type Sync_Audio_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: InputMaybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Sync_Audio_Max_Fields = {
  __typename?: 'sync_audio_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: Maybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Sync_Audio_Min_Fields = {
  __typename?: 'sync_audio_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: Maybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "sync.audio" */
export type Sync_Audio_Mutation_Response = {
  __typename?: 'sync_audio_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Sync_Audio>;
};

/** on_conflict condition type for table "sync.audio" */
export type Sync_Audio_On_Conflict = {
  constraint: Sync_Audio_Constraint;
  update_columns?: Array<Sync_Audio_Update_Column>;
  where?: InputMaybe<Sync_Audio_Bool_Exp>;
};

/** Ordering options when selecting data from "sync.audio". */
export type Sync_Audio_Order_By = {
  created_at?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  meemoo_fragment_id?: InputMaybe<Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_maintainer_id?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: sync_audio */
export type Sync_Audio_Pk_Columns_Input = {
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Sync_Audio_Prepend_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "sync.audio" */
export enum Sync_Audio_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  MeemooFragmentId = 'meemoo_fragment_id',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "sync.audio" */
export type Sync_Audio_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: InputMaybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "sync.audio" */
export enum Sync_Audio_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  MeemooFragmentId = 'meemoo_fragment_id',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** columns and relationships of "sync.film" */
export type Sync_Film = {
  __typename?: 'sync_film';
  created_at: Scalars['timestamptz'];
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data: Scalars['jsonb'];
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id: Scalars['String'];
  /** De meemoo pid of external_id */
  schema_identifier: Scalars['String'];
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id: Scalars['String'];
  /** De human readable titel van het object */
  schema_name: Scalars['String'];
  status: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "sync.film" */
export type Sync_FilmDataArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "sync.film" */
export type Sync_Film_Aggregate = {
  __typename?: 'sync_film_aggregate';
  aggregate?: Maybe<Sync_Film_Aggregate_Fields>;
  nodes: Array<Sync_Film>;
};

/** aggregate fields of "sync.film" */
export type Sync_Film_Aggregate_Fields = {
  __typename?: 'sync_film_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Sync_Film_Max_Fields>;
  min?: Maybe<Sync_Film_Min_Fields>;
};


/** aggregate fields of "sync.film" */
export type Sync_Film_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sync_Film_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Sync_Film_Append_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "sync.film". All fields are combined with a logical 'AND'. */
export type Sync_Film_Bool_Exp = {
  _and?: InputMaybe<Array<Sync_Film_Bool_Exp>>;
  _not?: InputMaybe<Sync_Film_Bool_Exp>;
  _or?: InputMaybe<Array<Sync_Film_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  data?: InputMaybe<Jsonb_Comparison_Exp>;
  meemoo_fragment_id?: InputMaybe<String_Comparison_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_maintainer_id?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "sync.film" */
export enum Sync_Film_Constraint {
  /** unique or primary key constraint */
  FilmComplexPkey = 'film_complex_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Sync_Film_Delete_At_Path_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Sync_Film_Delete_Elem_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Sync_Film_Delete_Key_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "sync.film" */
export type Sync_Film_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: InputMaybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Sync_Film_Max_Fields = {
  __typename?: 'sync_film_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: Maybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Sync_Film_Min_Fields = {
  __typename?: 'sync_film_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: Maybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "sync.film" */
export type Sync_Film_Mutation_Response = {
  __typename?: 'sync_film_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Sync_Film>;
};

/** on_conflict condition type for table "sync.film" */
export type Sync_Film_On_Conflict = {
  constraint: Sync_Film_Constraint;
  update_columns?: Array<Sync_Film_Update_Column>;
  where?: InputMaybe<Sync_Film_Bool_Exp>;
};

/** Ordering options when selecting data from "sync.film". */
export type Sync_Film_Order_By = {
  created_at?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  meemoo_fragment_id?: InputMaybe<Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_maintainer_id?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: sync_film */
export type Sync_Film_Pk_Columns_Input = {
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Sync_Film_Prepend_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "sync.film" */
export enum Sync_Film_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  MeemooFragmentId = 'meemoo_fragment_id',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "sync.film" */
export type Sync_Film_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: InputMaybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "sync.film" */
export enum Sync_Film_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  MeemooFragmentId = 'meemoo_fragment_id',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/**
 * Sync table for video objects
 *
 *
 * columns and relationships of "sync.video"
 *
 */
export type Sync_Video = {
  __typename?: 'sync_video';
  created_at: Scalars['timestamptz'];
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data: Scalars['jsonb'];
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id: Scalars['String'];
  /** De meemoo pid of external_id */
  schema_identifier: Scalars['String'];
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id: Scalars['String'];
  /** De human readable titel van het object */
  schema_name: Scalars['String'];
  status: Scalars['String'];
  updated_at: Scalars['timestamptz'];
};


/**
 * Sync table for video objects
 *
 *
 * columns and relationships of "sync.video"
 *
 */
export type Sync_VideoDataArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "sync.video" */
export type Sync_Video_Aggregate = {
  __typename?: 'sync_video_aggregate';
  aggregate?: Maybe<Sync_Video_Aggregate_Fields>;
  nodes: Array<Sync_Video>;
};

/** aggregate fields of "sync.video" */
export type Sync_Video_Aggregate_Fields = {
  __typename?: 'sync_video_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Sync_Video_Max_Fields>;
  min?: Maybe<Sync_Video_Min_Fields>;
};


/** aggregate fields of "sync.video" */
export type Sync_Video_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sync_Video_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Sync_Video_Append_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "sync.video". All fields are combined with a logical 'AND'. */
export type Sync_Video_Bool_Exp = {
  _and?: InputMaybe<Array<Sync_Video_Bool_Exp>>;
  _not?: InputMaybe<Sync_Video_Bool_Exp>;
  _or?: InputMaybe<Array<Sync_Video_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  data?: InputMaybe<Jsonb_Comparison_Exp>;
  meemoo_fragment_id?: InputMaybe<String_Comparison_Exp>;
  schema_identifier?: InputMaybe<String_Comparison_Exp>;
  schema_maintainer_id?: InputMaybe<String_Comparison_Exp>;
  schema_name?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "sync.video" */
export enum Sync_Video_Constraint {
  /** unique or primary key constraint */
  VideoPkey = 'video_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Sync_Video_Delete_At_Path_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Sync_Video_Delete_Elem_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Sync_Video_Delete_Key_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "sync.video" */
export type Sync_Video_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: InputMaybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Sync_Video_Max_Fields = {
  __typename?: 'sync_video_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: Maybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Sync_Video_Min_Fields = {
  __typename?: 'sync_video_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: Maybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: Maybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: Maybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "sync.video" */
export type Sync_Video_Mutation_Response = {
  __typename?: 'sync_video_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Sync_Video>;
};

/** on_conflict condition type for table "sync.video" */
export type Sync_Video_On_Conflict = {
  constraint: Sync_Video_Constraint;
  update_columns?: Array<Sync_Video_Update_Column>;
  where?: InputMaybe<Sync_Video_Bool_Exp>;
};

/** Ordering options when selecting data from "sync.video". */
export type Sync_Video_Order_By = {
  created_at?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  meemoo_fragment_id?: InputMaybe<Order_By>;
  schema_identifier?: InputMaybe<Order_By>;
  schema_maintainer_id?: InputMaybe<Order_By>;
  schema_name?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: sync_video */
export type Sync_Video_Pk_Columns_Input = {
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Sync_Video_Prepend_Input = {
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "sync.video" */
export enum Sync_Video_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  MeemooFragmentId = 'meemoo_fragment_id',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "sync.video" */
export type Sync_Video_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  /** De ruwe data uit de json v2 response van de Mediahaven REST API */
  data?: InputMaybe<Scalars['jsonb']>;
  /** De meest unieke key: de mediafragment ID uit Mediahaven */
  meemoo_fragment_id?: InputMaybe<Scalars['String']>;
  /** De meemoo pid of external_id */
  schema_identifier?: InputMaybe<Scalars['String']>;
  /** De OR-ID van de aanbiedende CP */
  schema_maintainer_id?: InputMaybe<Scalars['String']>;
  /** De human readable titel van het object */
  schema_name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "sync.video" */
export enum Sync_Video_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Data = 'data',
  /** column name */
  MeemooFragmentId = 'meemoo_fragment_id',
  /** column name */
  SchemaIdentifier = 'schema_identifier',
  /** column name */
  SchemaMaintainerId = 'schema_maintainer_id',
  /** column name */
  SchemaName = 'schema_name',
  /** column name */
  Status = 'status',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to compare columns of type "time". All fields are combined with logical 'AND'. */
export type Time_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['time']>;
  _gt?: InputMaybe<Scalars['time']>;
  _gte?: InputMaybe<Scalars['time']>;
  _in?: InputMaybe<Array<Scalars['time']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['time']>;
  _lte?: InputMaybe<Scalars['time']>;
  _neq?: InputMaybe<Scalars['time']>;
  _nin?: InputMaybe<Array<Scalars['time']>>;
};

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']>;
  _gt?: InputMaybe<Scalars['timestamp']>;
  _gte?: InputMaybe<Scalars['timestamp']>;
  _in?: InputMaybe<Array<Scalars['timestamp']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamp']>;
  _lte?: InputMaybe<Scalars['timestamp']>;
  _neq?: InputMaybe<Scalars['timestamp']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']>>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/**
 * Verzamelingen van items aangemaakt door gebruikers zoals favorieten
 *
 *
 * columns and relationships of "users.collection"
 *
 */
export type Users_Collection = {
  __typename?: 'users_collection';
  created_at: Scalars['timestamp'];
  id: Scalars['uuid'];
  /** An array relationship */
  ies: Array<Users_Collection_Ie>;
  /** An aggregate relationship */
  ies_aggregate: Users_Collection_Ie_Aggregate;
  is_default?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  /** An object relationship */
  user_profile: Users_Profile;
  user_profile_id: Scalars['uuid'];
};


/**
 * Verzamelingen van items aangemaakt door gebruikers zoals favorieten
 *
 *
 * columns and relationships of "users.collection"
 *
 */
export type Users_CollectionIesArgs = {
  distinct_on?: InputMaybe<Array<Users_Collection_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Collection_Ie_Order_By>>;
  where?: InputMaybe<Users_Collection_Ie_Bool_Exp>;
};


/**
 * Verzamelingen van items aangemaakt door gebruikers zoals favorieten
 *
 *
 * columns and relationships of "users.collection"
 *
 */
export type Users_CollectionIes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Collection_Ie_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Collection_Ie_Order_By>>;
  where?: InputMaybe<Users_Collection_Ie_Bool_Exp>;
};

/** aggregated selection of "users.collection" */
export type Users_Collection_Aggregate = {
  __typename?: 'users_collection_aggregate';
  aggregate?: Maybe<Users_Collection_Aggregate_Fields>;
  nodes: Array<Users_Collection>;
};

/** aggregate fields of "users.collection" */
export type Users_Collection_Aggregate_Fields = {
  __typename?: 'users_collection_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Collection_Max_Fields>;
  min?: Maybe<Users_Collection_Min_Fields>;
};


/** aggregate fields of "users.collection" */
export type Users_Collection_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Collection_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "users.collection" */
export type Users_Collection_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Users_Collection_Max_Order_By>;
  min?: InputMaybe<Users_Collection_Min_Order_By>;
};

/** input type for inserting array relation for remote table "users.collection" */
export type Users_Collection_Arr_Rel_Insert_Input = {
  data: Array<Users_Collection_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Collection_On_Conflict>;
};

/** Boolean expression to filter rows from the table "users.collection". All fields are combined with a logical 'AND'. */
export type Users_Collection_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Collection_Bool_Exp>>;
  _not?: InputMaybe<Users_Collection_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Collection_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  ies?: InputMaybe<Users_Collection_Ie_Bool_Exp>;
  is_default?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  user_profile?: InputMaybe<Users_Profile_Bool_Exp>;
  user_profile_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "users.collection" */
export enum Users_Collection_Constraint {
  /** unique or primary key constraint */
  CollectionPkey = 'collection_pkey'
}

/**
 * Koppeltabel tussen user collections en object ie
 *
 *
 * columns and relationships of "users.collection_ie"
 *
 */
export type Users_Collection_Ie = {
  __typename?: 'users_collection_ie';
  /** An object relationship */
  collection: Users_Collection;
  created_at: Scalars['timestamp'];
  /** An object relationship */
  ie: Object_Ie;
  /** de fragment id van de ie */
  ie_schema_identifier: Scalars['String'];
  updated_at: Scalars['timestamp'];
  user_collection_id: Scalars['uuid'];
};

/** aggregated selection of "users.collection_ie" */
export type Users_Collection_Ie_Aggregate = {
  __typename?: 'users_collection_ie_aggregate';
  aggregate?: Maybe<Users_Collection_Ie_Aggregate_Fields>;
  nodes: Array<Users_Collection_Ie>;
};

/** aggregate fields of "users.collection_ie" */
export type Users_Collection_Ie_Aggregate_Fields = {
  __typename?: 'users_collection_ie_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Collection_Ie_Max_Fields>;
  min?: Maybe<Users_Collection_Ie_Min_Fields>;
};


/** aggregate fields of "users.collection_ie" */
export type Users_Collection_Ie_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Collection_Ie_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "users.collection_ie" */
export type Users_Collection_Ie_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Users_Collection_Ie_Max_Order_By>;
  min?: InputMaybe<Users_Collection_Ie_Min_Order_By>;
};

/** input type for inserting array relation for remote table "users.collection_ie" */
export type Users_Collection_Ie_Arr_Rel_Insert_Input = {
  data: Array<Users_Collection_Ie_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Collection_Ie_On_Conflict>;
};

/** Boolean expression to filter rows from the table "users.collection_ie". All fields are combined with a logical 'AND'. */
export type Users_Collection_Ie_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Collection_Ie_Bool_Exp>>;
  _not?: InputMaybe<Users_Collection_Ie_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Collection_Ie_Bool_Exp>>;
  collection?: InputMaybe<Users_Collection_Bool_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  ie?: InputMaybe<Object_Ie_Bool_Exp>;
  ie_schema_identifier?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  user_collection_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "users.collection_ie" */
export enum Users_Collection_Ie_Constraint {
  /** unique or primary key constraint */
  CollectionItemPkey = 'collection_item_pkey'
}

/** input type for inserting data into table "users.collection_ie" */
export type Users_Collection_Ie_Insert_Input = {
  collection?: InputMaybe<Users_Collection_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  ie?: InputMaybe<Object_Ie_Obj_Rel_Insert_Input>;
  /** de fragment id van de ie */
  ie_schema_identifier?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  user_collection_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Users_Collection_Ie_Max_Fields = {
  __typename?: 'users_collection_ie_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  /** de fragment id van de ie */
  ie_schema_identifier?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  user_collection_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "users.collection_ie" */
export type Users_Collection_Ie_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** de fragment id van de ie */
  ie_schema_identifier?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_collection_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Collection_Ie_Min_Fields = {
  __typename?: 'users_collection_ie_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  /** de fragment id van de ie */
  ie_schema_identifier?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  user_collection_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "users.collection_ie" */
export type Users_Collection_Ie_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  /** de fragment id van de ie */
  ie_schema_identifier?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_collection_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "users.collection_ie" */
export type Users_Collection_Ie_Mutation_Response = {
  __typename?: 'users_collection_ie_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Collection_Ie>;
};

/** on_conflict condition type for table "users.collection_ie" */
export type Users_Collection_Ie_On_Conflict = {
  constraint: Users_Collection_Ie_Constraint;
  update_columns?: Array<Users_Collection_Ie_Update_Column>;
  where?: InputMaybe<Users_Collection_Ie_Bool_Exp>;
};

/** Ordering options when selecting data from "users.collection_ie". */
export type Users_Collection_Ie_Order_By = {
  collection?: InputMaybe<Users_Collection_Order_By>;
  created_at?: InputMaybe<Order_By>;
  ie?: InputMaybe<Object_Ie_Order_By>;
  ie_schema_identifier?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_collection_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users_collection_ie */
export type Users_Collection_Ie_Pk_Columns_Input = {
  /** de fragment id van de ie */
  ie_schema_identifier: Scalars['String'];
  user_collection_id: Scalars['uuid'];
};

/** select columns of table "users.collection_ie" */
export enum Users_Collection_Ie_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IeSchemaIdentifier = 'ie_schema_identifier',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserCollectionId = 'user_collection_id'
}

/** input type for updating data in table "users.collection_ie" */
export type Users_Collection_Ie_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  /** de fragment id van de ie */
  ie_schema_identifier?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  user_collection_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "users.collection_ie" */
export enum Users_Collection_Ie_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IeSchemaIdentifier = 'ie_schema_identifier',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserCollectionId = 'user_collection_id'
}

/** input type for inserting data into table "users.collection" */
export type Users_Collection_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  ies?: InputMaybe<Users_Collection_Ie_Arr_Rel_Insert_Input>;
  is_default?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  user_profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  user_profile_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Users_Collection_Max_Fields = {
  __typename?: 'users_collection_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  user_profile_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "users.collection" */
export type Users_Collection_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_profile_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Collection_Min_Fields = {
  __typename?: 'users_collection_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
  user_profile_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "users.collection" */
export type Users_Collection_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_profile_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "users.collection" */
export type Users_Collection_Mutation_Response = {
  __typename?: 'users_collection_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Collection>;
};

/** input type for inserting object relation for remote table "users.collection" */
export type Users_Collection_Obj_Rel_Insert_Input = {
  data: Users_Collection_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Collection_On_Conflict>;
};

/** on_conflict condition type for table "users.collection" */
export type Users_Collection_On_Conflict = {
  constraint: Users_Collection_Constraint;
  update_columns?: Array<Users_Collection_Update_Column>;
  where?: InputMaybe<Users_Collection_Bool_Exp>;
};

/** Ordering options when selecting data from "users.collection". */
export type Users_Collection_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  ies_aggregate?: InputMaybe<Users_Collection_Ie_Aggregate_Order_By>;
  is_default?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_profile?: InputMaybe<Users_Profile_Order_By>;
  user_profile_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users_collection */
export type Users_Collection_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "users.collection" */
export enum Users_Collection_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsDefault = 'is_default',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserProfileId = 'user_profile_id'
}

/** input type for updating data in table "users.collection" */
export type Users_Collection_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['uuid']>;
  is_default?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  user_profile_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "users.collection" */
export enum Users_Collection_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsDefault = 'is_default',
  /** column name */
  Name = 'name',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserProfileId = 'user_profile_id'
}

/**
 * Gebruikersgroepen
 *
 *
 * columns and relationships of "users.group"
 *
 */
export type Users_Group = {
  __typename?: 'users_group';
  created_at: Scalars['timestamp'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  label: Scalars['String'];
  name: Scalars['String'];
  /** An array relationship */
  permissions: Array<Users_Group_Permission>;
  /** An aggregate relationship */
  permissions_aggregate: Users_Group_Permission_Aggregate;
  updated_at: Scalars['timestamp'];
};


/**
 * Gebruikersgroepen
 *
 *
 * columns and relationships of "users.group"
 *
 */
export type Users_GroupPermissionsArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};


/**
 * Gebruikersgroepen
 *
 *
 * columns and relationships of "users.group"
 *
 */
export type Users_GroupPermissions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};

/** aggregated selection of "users.group" */
export type Users_Group_Aggregate = {
  __typename?: 'users_group_aggregate';
  aggregate?: Maybe<Users_Group_Aggregate_Fields>;
  nodes: Array<Users_Group>;
};

/** aggregate fields of "users.group" */
export type Users_Group_Aggregate_Fields = {
  __typename?: 'users_group_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Group_Max_Fields>;
  min?: Maybe<Users_Group_Min_Fields>;
};


/** aggregate fields of "users.group" */
export type Users_Group_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Group_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "users.group". All fields are combined with a logical 'AND'. */
export type Users_Group_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Group_Bool_Exp>>;
  _not?: InputMaybe<Users_Group_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Group_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  label?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  permissions?: InputMaybe<Users_Group_Permission_Bool_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "users.group" */
export enum Users_Group_Constraint {
  /** unique or primary key constraint */
  GroupPkey = 'group_pkey'
}

/** input type for inserting data into table "users.group" */
export type Users_Group_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  permissions?: InputMaybe<Users_Group_Permission_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type Users_Group_Max_Fields = {
  __typename?: 'users_group_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Users_Group_Min_Fields = {
  __typename?: 'users_group_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "users.group" */
export type Users_Group_Mutation_Response = {
  __typename?: 'users_group_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Group>;
};

/** input type for inserting object relation for remote table "users.group" */
export type Users_Group_Obj_Rel_Insert_Input = {
  data: Users_Group_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Group_On_Conflict>;
};

/** on_conflict condition type for table "users.group" */
export type Users_Group_On_Conflict = {
  constraint: Users_Group_Constraint;
  update_columns?: Array<Users_Group_Update_Column>;
  where?: InputMaybe<Users_Group_Bool_Exp>;
};

/** Ordering options when selecting data from "users.group". */
export type Users_Group_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  permissions_aggregate?: InputMaybe<Users_Group_Permission_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/**
 * Koppeltabel voor het koppelen van permissies aan gebruikersgroepen
 *
 *
 * columns and relationships of "users.group_permission"
 *
 */
export type Users_Group_Permission = {
  __typename?: 'users_group_permission';
  /** An object relationship */
  group: Users_Group;
  group_id: Scalars['uuid'];
  id: Scalars['uuid'];
  /** An object relationship */
  permission: Users_Permission;
  permission_id: Scalars['uuid'];
};

/** aggregated selection of "users.group_permission" */
export type Users_Group_Permission_Aggregate = {
  __typename?: 'users_group_permission_aggregate';
  aggregate?: Maybe<Users_Group_Permission_Aggregate_Fields>;
  nodes: Array<Users_Group_Permission>;
};

/** aggregate fields of "users.group_permission" */
export type Users_Group_Permission_Aggregate_Fields = {
  __typename?: 'users_group_permission_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Group_Permission_Max_Fields>;
  min?: Maybe<Users_Group_Permission_Min_Fields>;
};


/** aggregate fields of "users.group_permission" */
export type Users_Group_Permission_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "users.group_permission" */
export type Users_Group_Permission_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Users_Group_Permission_Max_Order_By>;
  min?: InputMaybe<Users_Group_Permission_Min_Order_By>;
};

/** input type for inserting array relation for remote table "users.group_permission" */
export type Users_Group_Permission_Arr_Rel_Insert_Input = {
  data: Array<Users_Group_Permission_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Group_Permission_On_Conflict>;
};

/** Boolean expression to filter rows from the table "users.group_permission". All fields are combined with a logical 'AND'. */
export type Users_Group_Permission_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Group_Permission_Bool_Exp>>;
  _not?: InputMaybe<Users_Group_Permission_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Group_Permission_Bool_Exp>>;
  group?: InputMaybe<Users_Group_Bool_Exp>;
  group_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  permission?: InputMaybe<Users_Permission_Bool_Exp>;
  permission_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "users.group_permission" */
export enum Users_Group_Permission_Constraint {
  /** unique or primary key constraint */
  GroupPermissionGroupIdPermissionIdKey = 'group_permission_group_id_permission_id_key',
  /** unique or primary key constraint */
  GroupPermissionPkey = 'group_permission_pkey'
}

/** input type for inserting data into table "users.group_permission" */
export type Users_Group_Permission_Insert_Input = {
  group?: InputMaybe<Users_Group_Obj_Rel_Insert_Input>;
  group_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  permission?: InputMaybe<Users_Permission_Obj_Rel_Insert_Input>;
  permission_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Users_Group_Permission_Max_Fields = {
  __typename?: 'users_group_permission_max_fields';
  group_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  permission_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "users.group_permission" */
export type Users_Group_Permission_Max_Order_By = {
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  permission_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Group_Permission_Min_Fields = {
  __typename?: 'users_group_permission_min_fields';
  group_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  permission_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "users.group_permission" */
export type Users_Group_Permission_Min_Order_By = {
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  permission_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "users.group_permission" */
export type Users_Group_Permission_Mutation_Response = {
  __typename?: 'users_group_permission_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Group_Permission>;
};

/** on_conflict condition type for table "users.group_permission" */
export type Users_Group_Permission_On_Conflict = {
  constraint: Users_Group_Permission_Constraint;
  update_columns?: Array<Users_Group_Permission_Update_Column>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};

/** Ordering options when selecting data from "users.group_permission". */
export type Users_Group_Permission_Order_By = {
  group?: InputMaybe<Users_Group_Order_By>;
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  permission?: InputMaybe<Users_Permission_Order_By>;
  permission_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users_group_permission */
export type Users_Group_Permission_Pk_Columns_Input = {
  id: Scalars['uuid'];
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

/** input type for updating data in table "users.group_permission" */
export type Users_Group_Permission_Set_Input = {
  group_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  permission_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "users.group_permission" */
export enum Users_Group_Permission_Update_Column {
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  PermissionId = 'permission_id'
}

/** primary key columns input for table: users_group */
export type Users_Group_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "users.group" */
export enum Users_Group_Select_Column {
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

/** input type for updating data in table "users.group" */
export type Users_Group_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

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

/**
 * List of user idps and id
 *
 *
 * columns and relationships of "users.identity"
 *
 */
export type Users_Identity = {
  __typename?: 'users_identity';
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  identity_id: Scalars['String'];
  identity_provider_name: Scalars['String'];
  /** An object relationship */
  profile: Users_Profile;
  profile_id: Scalars['uuid'];
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "users.identity" */
export type Users_Identity_Aggregate = {
  __typename?: 'users_identity_aggregate';
  aggregate?: Maybe<Users_Identity_Aggregate_Fields>;
  nodes: Array<Users_Identity>;
};

/** aggregate fields of "users.identity" */
export type Users_Identity_Aggregate_Fields = {
  __typename?: 'users_identity_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Identity_Max_Fields>;
  min?: Maybe<Users_Identity_Min_Fields>;
};


/** aggregate fields of "users.identity" */
export type Users_Identity_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Identity_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "users.identity" */
export type Users_Identity_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Users_Identity_Max_Order_By>;
  min?: InputMaybe<Users_Identity_Min_Order_By>;
};

/** input type for inserting array relation for remote table "users.identity" */
export type Users_Identity_Arr_Rel_Insert_Input = {
  data: Array<Users_Identity_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Identity_On_Conflict>;
};

/** Boolean expression to filter rows from the table "users.identity". All fields are combined with a logical 'AND'. */
export type Users_Identity_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Identity_Bool_Exp>>;
  _not?: InputMaybe<Users_Identity_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Identity_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  identity_id?: InputMaybe<String_Comparison_Exp>;
  identity_provider_name?: InputMaybe<String_Comparison_Exp>;
  profile?: InputMaybe<Users_Profile_Bool_Exp>;
  profile_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "users.identity" */
export enum Users_Identity_Constraint {
  /** unique or primary key constraint */
  IdentitiesPkey = 'identities_pkey',
  /** unique or primary key constraint */
  IdentitiesProfileIdIdentityProviderIdKey = 'identities_profile_id_identity_provider_id_key'
}

/** input type for inserting data into table "users.identity" */
export type Users_Identity_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  identity_id?: InputMaybe<Scalars['String']>;
  identity_provider_name?: InputMaybe<Scalars['String']>;
  profile?: InputMaybe<Users_Profile_Obj_Rel_Insert_Input>;
  profile_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Users_Identity_Max_Fields = {
  __typename?: 'users_identity_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  identity_id?: Maybe<Scalars['String']>;
  identity_provider_name?: Maybe<Scalars['String']>;
  profile_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "users.identity" */
export type Users_Identity_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  identity_id?: InputMaybe<Order_By>;
  identity_provider_name?: InputMaybe<Order_By>;
  profile_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Identity_Min_Fields = {
  __typename?: 'users_identity_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  identity_id?: Maybe<Scalars['String']>;
  identity_provider_name?: Maybe<Scalars['String']>;
  profile_id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "users.identity" */
export type Users_Identity_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  identity_id?: InputMaybe<Order_By>;
  identity_provider_name?: InputMaybe<Order_By>;
  profile_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "users.identity" */
export type Users_Identity_Mutation_Response = {
  __typename?: 'users_identity_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Identity>;
};

/** on_conflict condition type for table "users.identity" */
export type Users_Identity_On_Conflict = {
  constraint: Users_Identity_Constraint;
  update_columns?: Array<Users_Identity_Update_Column>;
  where?: InputMaybe<Users_Identity_Bool_Exp>;
};

/** Ordering options when selecting data from "users.identity". */
export type Users_Identity_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  identity_id?: InputMaybe<Order_By>;
  identity_provider_name?: InputMaybe<Order_By>;
  profile?: InputMaybe<Users_Profile_Order_By>;
  profile_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users_identity */
export type Users_Identity_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** columns and relationships of "users.identity_provider" */
export type Users_Identity_Provider = {
  __typename?: 'users_identity_provider';
  description?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

/** aggregated selection of "users.identity_provider" */
export type Users_Identity_Provider_Aggregate = {
  __typename?: 'users_identity_provider_aggregate';
  aggregate?: Maybe<Users_Identity_Provider_Aggregate_Fields>;
  nodes: Array<Users_Identity_Provider>;
};

/** aggregate fields of "users.identity_provider" */
export type Users_Identity_Provider_Aggregate_Fields = {
  __typename?: 'users_identity_provider_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Identity_Provider_Max_Fields>;
  min?: Maybe<Users_Identity_Provider_Min_Fields>;
};


/** aggregate fields of "users.identity_provider" */
export type Users_Identity_Provider_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Identity_Provider_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "users.identity_provider". All fields are combined with a logical 'AND'. */
export type Users_Identity_Provider_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Identity_Provider_Bool_Exp>>;
  _not?: InputMaybe<Users_Identity_Provider_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Identity_Provider_Bool_Exp>>;
  description?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "users.identity_provider" */
export enum Users_Identity_Provider_Constraint {
  /** unique or primary key constraint */
  IdentityProvidersNameKey = 'identity_providers_name_key',
  /** unique or primary key constraint */
  IdentityProvidersPkey = 'identity_providers_pkey'
}

/** input type for inserting data into table "users.identity_provider" */
export type Users_Identity_Provider_Insert_Input = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Users_Identity_Provider_Max_Fields = {
  __typename?: 'users_identity_provider_max_fields';
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Users_Identity_Provider_Min_Fields = {
  __typename?: 'users_identity_provider_min_fields';
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "users.identity_provider" */
export type Users_Identity_Provider_Mutation_Response = {
  __typename?: 'users_identity_provider_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Identity_Provider>;
};

/** on_conflict condition type for table "users.identity_provider" */
export type Users_Identity_Provider_On_Conflict = {
  constraint: Users_Identity_Provider_Constraint;
  update_columns?: Array<Users_Identity_Provider_Update_Column>;
  where?: InputMaybe<Users_Identity_Provider_Bool_Exp>;
};

/** Ordering options when selecting data from "users.identity_provider". */
export type Users_Identity_Provider_Order_By = {
  description?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users_identity_provider */
export type Users_Identity_Provider_Pk_Columns_Input = {
  name: Scalars['String'];
};

/** select columns of table "users.identity_provider" */
export enum Users_Identity_Provider_Select_Column {
  /** column name */
  Description = 'description',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "users.identity_provider" */
export type Users_Identity_Provider_Set_Input = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "users.identity_provider" */
export enum Users_Identity_Provider_Update_Column {
  /** column name */
  Description = 'description',
  /** column name */
  Name = 'name'
}

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

/** input type for updating data in table "users.identity" */
export type Users_Identity_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  identity_id?: InputMaybe<Scalars['String']>;
  identity_provider_name?: InputMaybe<Scalars['String']>;
  profile_id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

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

/**
 * Wat een gebruiker mag doen
 *
 *
 * columns and relationships of "users.permission"
 *
 */
export type Users_Permission = {
  __typename?: 'users_permission';
  created_at: Scalars['timestamp'];
  description?: Maybe<Scalars['String']>;
  /** An array relationship */
  groups: Array<Users_Group_Permission>;
  /** An aggregate relationship */
  groups_aggregate: Users_Group_Permission_Aggregate;
  id: Scalars['uuid'];
  label: Scalars['String'];
  name: Scalars['String'];
  updated_at: Scalars['timestamp'];
};


/**
 * Wat een gebruiker mag doen
 *
 *
 * columns and relationships of "users.permission"
 *
 */
export type Users_PermissionGroupsArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};


/**
 * Wat een gebruiker mag doen
 *
 *
 * columns and relationships of "users.permission"
 *
 */
export type Users_PermissionGroups_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Group_Permission_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Group_Permission_Order_By>>;
  where?: InputMaybe<Users_Group_Permission_Bool_Exp>;
};

/** aggregated selection of "users.permission" */
export type Users_Permission_Aggregate = {
  __typename?: 'users_permission_aggregate';
  aggregate?: Maybe<Users_Permission_Aggregate_Fields>;
  nodes: Array<Users_Permission>;
};

/** aggregate fields of "users.permission" */
export type Users_Permission_Aggregate_Fields = {
  __typename?: 'users_permission_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Permission_Max_Fields>;
  min?: Maybe<Users_Permission_Min_Fields>;
};


/** aggregate fields of "users.permission" */
export type Users_Permission_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Permission_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "users.permission". All fields are combined with a logical 'AND'. */
export type Users_Permission_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Permission_Bool_Exp>>;
  _not?: InputMaybe<Users_Permission_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Permission_Bool_Exp>>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  groups?: InputMaybe<Users_Group_Permission_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  label?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
};

/** unique or primary key constraints on table "users.permission" */
export enum Users_Permission_Constraint {
  /** unique or primary key constraint */
  PermissionPkey = 'permission_pkey'
}

/** input type for inserting data into table "users.permission" */
export type Users_Permission_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  description?: InputMaybe<Scalars['String']>;
  groups?: InputMaybe<Users_Group_Permission_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
};

/** aggregate max on columns */
export type Users_Permission_Max_Fields = {
  __typename?: 'users_permission_max_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Users_Permission_Min_Fields = {
  __typename?: 'users_permission_min_fields';
  created_at?: Maybe<Scalars['timestamp']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  label?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "users.permission" */
export type Users_Permission_Mutation_Response = {
  __typename?: 'users_permission_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Permission>;
};

/** input type for inserting object relation for remote table "users.permission" */
export type Users_Permission_Obj_Rel_Insert_Input = {
  data: Users_Permission_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Permission_On_Conflict>;
};

/** on_conflict condition type for table "users.permission" */
export type Users_Permission_On_Conflict = {
  constraint: Users_Permission_Constraint;
  update_columns?: Array<Users_Permission_Update_Column>;
  where?: InputMaybe<Users_Permission_Bool_Exp>;
};

/** Ordering options when selecting data from "users.permission". */
export type Users_Permission_Order_By = {
  created_at?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  groups_aggregate?: InputMaybe<Users_Group_Permission_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  label?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users_permission */
export type Users_Permission_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "users.permission" */
export enum Users_Permission_Select_Column {
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

/** input type for updating data in table "users.permission" */
export type Users_Permission_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamp']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  label?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
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

/**
 * A user his identifying attributes aka profile information
 *
 *
 * columns and relationships of "users.profile"
 *
 */
export type Users_Profile = {
  __typename?: 'users_profile';
  accepted_tos_at?: Maybe<Scalars['timestamptz']>;
  /** An array relationship */
  collections: Array<Users_Collection>;
  /** An aggregate relationship */
  collections_aggregate: Users_Collection_Aggregate;
  created_at?: Maybe<Scalars['timestamp']>;
  first_name?: Maybe<Scalars['String']>;
  /** A computed field, executes function "users.user_profile_full_name" */
  full_name?: Maybe<Scalars['String']>;
  /** An object relationship */
  group?: Maybe<Users_Group>;
  group_id?: Maybe<Scalars['uuid']>;
  id: Scalars['uuid'];
  /** An array relationship */
  identities: Array<Users_Identity>;
  /** An aggregate relationship */
  identities_aggregate: Users_Identity_Aggregate;
  last_name?: Maybe<Scalars['String']>;
  mail?: Maybe<Scalars['String']>;
  /** An array relationship */
  maintainer_users_profiles: Array<Cp_Maintainer_Users_Profile>;
  /** An aggregate relationship */
  maintainer_users_profiles_aggregate: Cp_Maintainer_Users_Profile_Aggregate;
  /** An array relationship */
  notes: Array<Cp_Visit_Note>;
  /** An aggregate relationship */
  notes_aggregate: Cp_Visit_Note_Aggregate;
  /** An array relationship */
  notifications: Array<App_Notification>;
  /** An aggregate relationship */
  notifications_aggregate: App_Notification_Aggregate;
  updated_at?: Maybe<Scalars['timestamp']>;
  /** An array relationship */
  visits: Array<Cp_Visit>;
  /** An aggregate relationship */
  visits_aggregate: Cp_Visit_Aggregate;
};


/**
 * A user his identifying attributes aka profile information
 *
 *
 * columns and relationships of "users.profile"
 *
 */
export type Users_ProfileCollectionsArgs = {
  distinct_on?: InputMaybe<Array<Users_Collection_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Collection_Order_By>>;
  where?: InputMaybe<Users_Collection_Bool_Exp>;
};


/**
 * A user his identifying attributes aka profile information
 *
 *
 * columns and relationships of "users.profile"
 *
 */
export type Users_ProfileCollections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Collection_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Collection_Order_By>>;
  where?: InputMaybe<Users_Collection_Bool_Exp>;
};


/**
 * A user his identifying attributes aka profile information
 *
 *
 * columns and relationships of "users.profile"
 *
 */
export type Users_ProfileIdentitiesArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Order_By>>;
  where?: InputMaybe<Users_Identity_Bool_Exp>;
};


/**
 * A user his identifying attributes aka profile information
 *
 *
 * columns and relationships of "users.profile"
 *
 */
export type Users_ProfileIdentities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Identity_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Identity_Order_By>>;
  where?: InputMaybe<Users_Identity_Bool_Exp>;
};


/**
 * A user his identifying attributes aka profile information
 *
 *
 * columns and relationships of "users.profile"
 *
 */
export type Users_ProfileMaintainer_Users_ProfilesArgs = {
  distinct_on?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Cp_Maintainer_Users_Profile_Bool_Exp>;
};


/**
 * A user his identifying attributes aka profile information
 *
 *
 * columns and relationships of "users.profile"
 *
 */
export type Users_ProfileMaintainer_Users_Profiles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Maintainer_Users_Profile_Order_By>>;
  where?: InputMaybe<Cp_Maintainer_Users_Profile_Bool_Exp>;
};


/**
 * A user his identifying attributes aka profile information
 *
 *
 * columns and relationships of "users.profile"
 *
 */
export type Users_ProfileNotesArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Note_Order_By>>;
  where?: InputMaybe<Cp_Visit_Note_Bool_Exp>;
};


/**
 * A user his identifying attributes aka profile information
 *
 *
 * columns and relationships of "users.profile"
 *
 */
export type Users_ProfileNotes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Note_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Note_Order_By>>;
  where?: InputMaybe<Cp_Visit_Note_Bool_Exp>;
};


/**
 * A user his identifying attributes aka profile information
 *
 *
 * columns and relationships of "users.profile"
 *
 */
export type Users_ProfileNotificationsArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


/**
 * A user his identifying attributes aka profile information
 *
 *
 * columns and relationships of "users.profile"
 *
 */
export type Users_ProfileNotifications_AggregateArgs = {
  distinct_on?: InputMaybe<Array<App_Notification_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<App_Notification_Order_By>>;
  where?: InputMaybe<App_Notification_Bool_Exp>;
};


/**
 * A user his identifying attributes aka profile information
 *
 *
 * columns and relationships of "users.profile"
 *
 */
export type Users_ProfileVisitsArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Order_By>>;
  where?: InputMaybe<Cp_Visit_Bool_Exp>;
};


/**
 * A user his identifying attributes aka profile information
 *
 *
 * columns and relationships of "users.profile"
 *
 */
export type Users_ProfileVisits_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cp_Visit_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Cp_Visit_Order_By>>;
  where?: InputMaybe<Cp_Visit_Bool_Exp>;
};

/** aggregated selection of "users.profile" */
export type Users_Profile_Aggregate = {
  __typename?: 'users_profile_aggregate';
  aggregate?: Maybe<Users_Profile_Aggregate_Fields>;
  nodes: Array<Users_Profile>;
};

/** aggregate fields of "users.profile" */
export type Users_Profile_Aggregate_Fields = {
  __typename?: 'users_profile_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Profile_Max_Fields>;
  min?: Maybe<Users_Profile_Min_Fields>;
};


/** aggregate fields of "users.profile" */
export type Users_Profile_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Profile_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "users.profile". All fields are combined with a logical 'AND'. */
export type Users_Profile_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Profile_Bool_Exp>>;
  _not?: InputMaybe<Users_Profile_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Profile_Bool_Exp>>;
  accepted_tos_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  collections?: InputMaybe<Users_Collection_Bool_Exp>;
  created_at?: InputMaybe<Timestamp_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  full_name?: InputMaybe<String_Comparison_Exp>;
  group?: InputMaybe<Users_Group_Bool_Exp>;
  group_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  identities?: InputMaybe<Users_Identity_Bool_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  mail?: InputMaybe<String_Comparison_Exp>;
  maintainer_users_profiles?: InputMaybe<Cp_Maintainer_Users_Profile_Bool_Exp>;
  notes?: InputMaybe<Cp_Visit_Note_Bool_Exp>;
  notifications?: InputMaybe<App_Notification_Bool_Exp>;
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>;
  visits?: InputMaybe<Cp_Visit_Bool_Exp>;
};

/** unique or primary key constraints on table "users.profile" */
export enum Users_Profile_Constraint {
  /** unique or primary key constraint */
  ProfilesPkey = 'profiles_pkey'
}

/** input type for inserting data into table "users.profile" */
export type Users_Profile_Insert_Input = {
  accepted_tos_at?: InputMaybe<Scalars['timestamptz']>;
  collections?: InputMaybe<Users_Collection_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  first_name?: InputMaybe<Scalars['String']>;
  group?: InputMaybe<Users_Group_Obj_Rel_Insert_Input>;
  group_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  identities?: InputMaybe<Users_Identity_Arr_Rel_Insert_Input>;
  last_name?: InputMaybe<Scalars['String']>;
  mail?: InputMaybe<Scalars['String']>;
  maintainer_users_profiles?: InputMaybe<Cp_Maintainer_Users_Profile_Arr_Rel_Insert_Input>;
  notes?: InputMaybe<Cp_Visit_Note_Arr_Rel_Insert_Input>;
  notifications?: InputMaybe<App_Notification_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  visits?: InputMaybe<Cp_Visit_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Users_Profile_Max_Fields = {
  __typename?: 'users_profile_max_fields';
  accepted_tos_at?: Maybe<Scalars['timestamptz']>;
  created_at?: Maybe<Scalars['timestamp']>;
  first_name?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  last_name?: Maybe<Scalars['String']>;
  mail?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** aggregate min on columns */
export type Users_Profile_Min_Fields = {
  __typename?: 'users_profile_min_fields';
  accepted_tos_at?: Maybe<Scalars['timestamptz']>;
  created_at?: Maybe<Scalars['timestamp']>;
  first_name?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  last_name?: Maybe<Scalars['String']>;
  mail?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamp']>;
};

/** response of any mutation on the table "users.profile" */
export type Users_Profile_Mutation_Response = {
  __typename?: 'users_profile_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users_Profile>;
};

/** input type for inserting object relation for remote table "users.profile" */
export type Users_Profile_Obj_Rel_Insert_Input = {
  data: Users_Profile_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_Profile_On_Conflict>;
};

/** on_conflict condition type for table "users.profile" */
export type Users_Profile_On_Conflict = {
  constraint: Users_Profile_Constraint;
  update_columns?: Array<Users_Profile_Update_Column>;
  where?: InputMaybe<Users_Profile_Bool_Exp>;
};

/** Ordering options when selecting data from "users.profile". */
export type Users_Profile_Order_By = {
  accepted_tos_at?: InputMaybe<Order_By>;
  collections_aggregate?: InputMaybe<Users_Collection_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  full_name?: InputMaybe<Order_By>;
  group?: InputMaybe<Users_Group_Order_By>;
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  identities_aggregate?: InputMaybe<Users_Identity_Aggregate_Order_By>;
  last_name?: InputMaybe<Order_By>;
  mail?: InputMaybe<Order_By>;
  maintainer_users_profiles_aggregate?: InputMaybe<Cp_Maintainer_Users_Profile_Aggregate_Order_By>;
  notes_aggregate?: InputMaybe<Cp_Visit_Note_Aggregate_Order_By>;
  notifications_aggregate?: InputMaybe<App_Notification_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  visits_aggregate?: InputMaybe<Cp_Visit_Aggregate_Order_By>;
};

/** primary key columns input for table: users_profile */
export type Users_Profile_Pk_Columns_Input = {
  id: Scalars['uuid'];
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
  LastName = 'last_name',
  /** column name */
  Mail = 'mail',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "users.profile" */
export type Users_Profile_Set_Input = {
  accepted_tos_at?: InputMaybe<Scalars['timestamptz']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  first_name?: InputMaybe<Scalars['String']>;
  group_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  last_name?: InputMaybe<Scalars['String']>;
  mail?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
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
  LastName = 'last_name',
  /** column name */
  Mail = 'mail',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

export type GetContentByIdQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetContentByIdQuery = { __typename?: 'query_root', cms_content: Array<{ __typename?: 'cms_content', content_type: string, content_width: string, created_at: any, depublish_at?: any | null, description?: string | null, seo_description?: string | null, meta_description?: string | null, id: any, thumbnail_path?: string | null, is_protected: boolean, is_public?: boolean | null, path?: string | null, user_profile_id?: any | null, publish_at?: any | null, published_at?: any | null, title: string, updated_at?: any | null, user_group_ids?: any | null, owner_profile?: { __typename?: 'users_profile', id: any, full_name?: string | null, mail?: string | null, maintainer_users_profiles: Array<{ __typename?: 'cp_maintainer_users_profile', maintainer: { __typename?: 'cp_maintainer', schema_identifier: string, schema_name?: string | null, information?: Array<{ __typename?: 'ContentPartner', logo?: { __typename?: 'Logo', iri: string } | null } | null> | null } }>, group?: { __typename?: 'users_group', label: string, id: any } | null } | null, content_content_labels: Array<{ __typename?: 'cms_content_content_labels', content_label: { __typename?: 'cms_content_labels', label: string, id: any, link_to?: any | null } }>, content_blocks: Array<{ __typename?: 'cms_content_blocks', content_block_type: Lookup_Cms_Content_Block_Type_Enum, content_id: any, created_at: any, id: any, position: number, updated_at: any, variables?: any | null }> }> };

export type GetContentPageByPathQueryVariables = Exact<{
  path: Scalars['String'];
}>;


export type GetContentPageByPathQuery = { __typename?: 'query_root', cms_content: Array<{ __typename?: 'cms_content', content_type: string, content_width: string, created_at: any, depublish_at?: any | null, description?: string | null, seo_description?: string | null, meta_description?: string | null, id: any, thumbnail_path?: string | null, is_protected: boolean, is_public?: boolean | null, path?: string | null, publish_at?: any | null, published_at?: any | null, title: string, updated_at?: any | null, user_group_ids?: any | null, owner_profile?: { __typename?: 'users_profile', id: any, first_name?: string | null, last_name?: string | null, group?: { __typename?: 'users_group', id: any, label: string } | null } | null, content_content_labels: Array<{ __typename?: 'cms_content_content_labels', content_label: { __typename?: 'cms_content_labels', id: any, label: string, link_to?: any | null } }>, content_blocks: Array<{ __typename?: 'cms_content_blocks', content_block_type: Lookup_Cms_Content_Block_Type_Enum, content_id: any, created_at: any, id: any, position: number, updated_at: any, variables?: any | null }> }> };

export type GetContentPageLabelsByTypeAndIdsQueryVariables = Exact<{
  contentType: Lookup_Cms_Content_Type_Enum;
  labelIds: Array<Scalars['uuid']> | Scalars['uuid'];
}>;


export type GetContentPageLabelsByTypeAndIdsQuery = { __typename?: 'query_root', cms_content_labels: Array<{ __typename?: 'cms_content_labels', label: string, id: any }> };

export type GetContentPageLabelsByTypeAndLabelsQueryVariables = Exact<{
  contentType: Lookup_Cms_Content_Type_Enum;
  labels: Array<Scalars['String']> | Scalars['String'];
}>;


export type GetContentPageLabelsByTypeAndLabelsQuery = { __typename?: 'query_root', cms_content_labels: Array<{ __typename?: 'cms_content_labels', label: string, id: any }> };

export type GetContentPagesWithBlocksQueryVariables = Exact<{
  where?: InputMaybe<Cms_Content_Bool_Exp>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Cms_Content_Order_By> | Cms_Content_Order_By>;
  labelIds?: InputMaybe<Array<Scalars['uuid']> | Scalars['uuid']>;
  orUserGroupIds?: InputMaybe<Array<Cms_Content_Content_Labels_Bool_Exp> | Cms_Content_Content_Labels_Bool_Exp>;
}>;


export type GetContentPagesWithBlocksQuery = { __typename?: 'query_root', cms_content: Array<{ __typename?: 'cms_content', content_type: string, created_at: any, depublish_at?: any | null, description?: string | null, seo_description?: string | null, meta_description?: string | null, id: any, thumbnail_path?: string | null, is_protected: boolean, is_public?: boolean | null, path?: string | null, publish_at?: any | null, published_at?: any | null, title: string, updated_at?: any | null, owner_profile?: { __typename?: 'users_profile', first_name?: string | null, last_name?: string | null, group?: { __typename?: 'users_group', id: any, label: string } | null } | null, content_content_labels: Array<{ __typename?: 'cms_content_content_labels', content_label: { __typename?: 'cms_content_labels', id: any, label: string, link_to?: any | null } }>, content_blocks: Array<{ __typename?: 'cms_content_blocks', content_block_type: Lookup_Cms_Content_Block_Type_Enum, content_id: any, created_at: any, id: any, position: number, updated_at: any, variables?: any | null }> }>, cms_content_aggregate: { __typename?: 'cms_content_aggregate', aggregate?: { __typename?: 'cms_content_aggregate_fields', count: number } | null }, cms_content_labels: Array<{ __typename?: 'cms_content_labels', id: any, content_content_labels_aggregate: { __typename?: 'cms_content_content_labels_aggregate', aggregate?: { __typename?: 'cms_content_content_labels_aggregate_fields', count: number } | null } }> };

export type GetContentPagesQueryVariables = Exact<{
  where?: InputMaybe<Cms_Content_Bool_Exp>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Cms_Content_Order_By> | Cms_Content_Order_By>;
  labelIds?: InputMaybe<Array<Scalars['uuid']> | Scalars['uuid']>;
  orUserGroupIds?: InputMaybe<Array<Cms_Content_Content_Labels_Bool_Exp> | Cms_Content_Content_Labels_Bool_Exp>;
}>;


export type GetContentPagesQuery = { __typename?: 'query_root', cms_content: Array<{ __typename?: 'cms_content', id: any, content_type: string, created_at: any, depublish_at?: any | null, description?: string | null, seo_description?: string | null, meta_description?: string | null, thumbnail_path?: string | null, is_protected: boolean, is_public?: boolean | null, path?: string | null, publish_at?: any | null, published_at?: any | null, title: string, updated_at?: any | null, user_group_ids?: any | null, user_profile_id?: any | null, owner_profile?: { __typename?: 'users_profile', first_name?: string | null, last_name?: string | null, group?: { __typename?: 'users_group', id: any, label: string } | null } | null, content_content_labels: Array<{ __typename?: 'cms_content_content_labels', content_label: { __typename?: 'cms_content_labels', id: any, label: string, link_to?: any | null } }> }>, cms_content_aggregate: { __typename?: 'cms_content_aggregate', aggregate?: { __typename?: 'cms_content_aggregate_fields', count: number } | null }, cms_content_labels: Array<{ __typename?: 'cms_content_labels', id: any, content_content_labels_aggregate: { __typename?: 'cms_content_content_labels_aggregate', aggregate?: { __typename?: 'cms_content_content_labels_aggregate_fields', count: number } | null } }> };

export type GetPublicContentPagesQueryVariables = Exact<{
  where?: InputMaybe<Cms_Content_Bool_Exp>;
}>;


export type GetPublicContentPagesQuery = { __typename?: 'query_root', cms_content: Array<{ __typename?: 'cms_content', path?: string | null, updated_at?: any | null }> };

export type UpdateContentPagePublishDatesMutationVariables = Exact<{
  now?: InputMaybe<Scalars['timestamp']>;
  publishedAt?: InputMaybe<Scalars['timestamp']>;
}>;


export type UpdateContentPagePublishDatesMutation = { __typename?: 'mutation_root', publish_content_pages?: { __typename?: 'cms_content_mutation_response', affected_rows: number } | null, unpublish_content_pages?: { __typename?: 'cms_content_mutation_response', affected_rows: number } | null };

export type GetOrganisationQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
}>;


export type GetOrganisationQuery = { __typename?: 'query_root', cp_maintainer: Array<{ __typename?: 'cp_maintainer', schema_name?: string | null, schema_identifier: string, information?: Array<{ __typename?: 'ContentPartner', logo?: { __typename?: 'Logo', iri: string } | null } | null> | null }> };

export type GetFileByRepresentationSchemaIdentifierQueryVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
}>;


export type GetFileByRepresentationSchemaIdentifierQuery = { __typename?: 'query_root', object_file: Array<{ __typename?: 'object_file', schema_embed_url?: string | null }> };

export type GetThumbnailUrlByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type GetThumbnailUrlByIdQuery = { __typename?: 'query_root', object_ie: Array<{ __typename?: 'object_ie', schema_identifier: string, schema_thumbnail_url?: string | null }> };

export type DeleteCollectionMutationVariables = Exact<{
  collectionId?: InputMaybe<Scalars['uuid']>;
  userProfileId?: InputMaybe<Scalars['uuid']>;
}>;


export type DeleteCollectionMutation = { __typename?: 'mutation_root', delete_users_collection?: { __typename?: 'users_collection_mutation_response', affected_rows: number } | null };

export type FindCollectionByIdQueryVariables = Exact<{
  collectionId?: InputMaybe<Scalars['uuid']>;
}>;


export type FindCollectionByIdQuery = { __typename?: 'query_root', users_collection: Array<{ __typename?: 'users_collection', created_at: any, id: any, is_default?: boolean | null, name?: string | null, updated_at?: any | null, user_profile_id: any }> };

export type FindCollectionObjectsByCollectionIdQueryVariables = Exact<{
  collectionId?: InputMaybe<Scalars['uuid']>;
  userProfileId?: InputMaybe<Scalars['uuid']>;
  where: Users_Collection_Ie_Bool_Exp;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type FindCollectionObjectsByCollectionIdQuery = { __typename?: 'query_root', users_collection_ie: Array<{ __typename?: 'users_collection_ie', created_at: any, ie: { __typename?: 'object_ie', schema_identifier: string, meemoo_identifier: string, schema_name: string, schema_creator?: any | null, schema_description?: string | null, dcterms_available?: any | null, schema_thumbnail_url?: string | null, dcterms_format: string, schema_number_of_pages?: number | null, schema_is_part_of?: any | null, schema_date_published?: any | null, schema_date_created_lower_bound?: any | null, maintainer?: { __typename?: 'cp_maintainer', schema_identifier: string, schema_name?: string | null, space?: { __typename?: 'cp_space', id: any } | null } | null } }>, users_collection_ie_aggregate: { __typename?: 'users_collection_ie_aggregate', aggregate?: { __typename?: 'users_collection_ie_aggregate_fields', count: number } | null } };

export type FindCollectionsByUserQueryVariables = Exact<{
  userProfileId?: InputMaybe<Scalars['uuid']>;
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type FindCollectionsByUserQuery = { __typename?: 'query_root', users_collection: Array<{ __typename?: 'users_collection', id: any, name?: string | null, user_profile_id: any, is_default?: boolean | null, created_at: any, updated_at?: any | null, ies: Array<{ __typename?: 'users_collection_ie', ie: { __typename?: 'object_ie', schema_identifier: string } }> }>, users_collection_aggregate: { __typename?: 'users_collection_aggregate', aggregate?: { __typename?: 'users_collection_aggregate_fields', count: number } | null } };

export type GetObjectBySchemaIdentifierQueryVariables = Exact<{
  objectSchemaIdentifier?: InputMaybe<Scalars['String']>;
}>;


export type GetObjectBySchemaIdentifierQuery = { __typename?: 'query_root', object_ie: Array<{ __typename?: 'object_ie', schema_identifier: string, meemoo_identifier: string, schema_name: string, schema_creator?: any | null, schema_description?: string | null, dcterms_available?: any | null, schema_thumbnail_url?: string | null, dcterms_format: string, schema_number_of_pages?: number | null, schema_is_part_of?: any | null, schema_date_published?: any | null, schema_date_created_lower_bound?: any | null, maintainer?: { __typename?: 'cp_maintainer', schema_identifier: string, schema_name?: string | null, space?: { __typename?: 'cp_space', id: any } | null } | null }> };

export type FindObjectBySchemaIdentifierQueryVariables = Exact<{
  objectSchemaIdentifier?: InputMaybe<Scalars['String']>;
}>;


export type FindObjectBySchemaIdentifierQuery = { __typename?: 'query_root', object_ie: Array<{ __typename?: 'object_ie', schema_identifier: string, meemoo_identifier: string, schema_name: string, schema_creator?: any | null, schema_description?: string | null, dcterms_available?: any | null, schema_thumbnail_url?: string | null, dcterms_format: string, schema_number_of_pages?: number | null, schema_is_part_of?: any | null, schema_date_published?: any | null, schema_date_created_lower_bound?: any | null, maintainer?: { __typename?: 'cp_maintainer', schema_identifier: string, schema_name?: string | null, space?: { __typename?: 'cp_space', id: any } | null } | null }> };

export type FindObjectInCollectionQueryVariables = Exact<{
  collectionId?: InputMaybe<Scalars['uuid']>;
  objectSchemaIdentifier?: InputMaybe<Scalars['String']>;
}>;


export type FindObjectInCollectionQuery = { __typename?: 'query_root', users_collection_ie: Array<{ __typename?: 'users_collection_ie', created_at: any, ie: { __typename?: 'object_ie', schema_identifier: string, meemoo_identifier: string, schema_name: string, schema_creator?: any | null, schema_description?: string | null, dcterms_available?: any | null, schema_thumbnail_url?: string | null, dcterms_format: string, schema_number_of_pages?: number | null, schema_is_part_of?: any | null, schema_date_published?: any | null, schema_date_created_lower_bound?: any | null, maintainer?: { __typename?: 'cp_maintainer', schema_identifier: string, schema_name?: string | null, space?: { __typename?: 'cp_space', id: any } | null } | null } }> };

export type InsertCollectionsMutationVariables = Exact<{
  object: Users_Collection_Insert_Input;
}>;


export type InsertCollectionsMutation = { __typename?: 'mutation_root', insert_users_collection?: { __typename?: 'users_collection_mutation_response', returning: Array<{ __typename?: 'users_collection', id: any, name?: string | null, user_profile_id: any, is_default?: boolean | null, created_at: any, updated_at?: any | null }> } | null };

export type InsertObjectIntoCollectionMutationVariables = Exact<{
  collectionId?: InputMaybe<Scalars['uuid']>;
  objectSchemaIdentifier?: InputMaybe<Scalars['String']>;
}>;


export type InsertObjectIntoCollectionMutation = { __typename?: 'mutation_root', insert_users_collection_ie?: { __typename?: 'users_collection_ie_mutation_response', returning: Array<{ __typename?: 'users_collection_ie', created_at: any, ie: { __typename?: 'object_ie', schema_identifier: string, meemoo_identifier: string, dcterms_format: string, dcterms_available?: any | null, schema_creator?: any | null, schema_description?: string | null, schema_name: string, schema_maintainer_id?: string | null, schema_number_of_pages?: number | null } }> } | null };

export type RemoveObjectFromCollectionMutationVariables = Exact<{
  objectSchemaIdentifier?: InputMaybe<Scalars['String']>;
  collectionId?: InputMaybe<Scalars['uuid']>;
  userProfileId?: InputMaybe<Scalars['uuid']>;
}>;


export type RemoveObjectFromCollectionMutation = { __typename?: 'mutation_root', delete_users_collection_ie?: { __typename?: 'users_collection_ie_mutation_response', affected_rows: number } | null };

export type UpdateCollectionMutationVariables = Exact<{
  collectionId?: InputMaybe<Scalars['uuid']>;
  userProfileId?: InputMaybe<Scalars['uuid']>;
  collection?: InputMaybe<Users_Collection_Set_Input>;
}>;


export type UpdateCollectionMutation = { __typename?: 'mutation_root', update_users_collection?: { __typename?: 'users_collection_mutation_response', returning: Array<{ __typename?: 'users_collection', id: any, name?: string | null, user_profile_id: any, is_default?: boolean | null, created_at: any, updated_at?: any | null }> } | null };

export type GetObjectDetailBySchemaIdentifierQueryVariables = Exact<{
  schemaIdentifier: Scalars['String'];
}>;


export type GetObjectDetailBySchemaIdentifierQuery = { __typename?: 'query_root', object_ie: Array<{ __typename?: 'object_ie', schema_identifier: string, meemoo_identifier: string, premis_identifier?: any | null, premis_relationship?: string | null, schema_is_part_of?: any | null, schema_part_of_archive?: any | null, schema_part_of_episode?: any | null, schema_part_of_season?: any | null, schema_part_of_series?: any | null, schema_copyright_holder?: string | null, schema_copyright_notice?: string | null, schema_duration_in_seconds?: number | null, schema_number_of_pages?: number | null, schema_date_published?: any | null, dcterms_available?: any | null, schema_name: string, schema_description?: string | null, schema_abstract?: string | null, schema_creator?: any | null, schema_actor?: any | null, schema_contributor?: any | null, schema_publisher?: any | null, schema_temporal_coverage?: any | null, schema_spatial_coverage?: any | null, schema_keywords?: any | null, dcterms_format: string, schema_in_language?: any | null, schema_thumbnail_url?: string | null, schema_alternate_name?: string | null, schema_duration?: any | null, schema_license?: any | null, meemoo_media_object_id?: string | null, schema_date_created?: any | null, schema_date_created_lower_bound?: any | null, ebucore_object_type?: string | null, schema_genre?: any | null, schema_maintainer?: Array<{ __typename?: 'ContentPartner', id: string, label?: string | null, primary_site?: { __typename?: 'Site', address?: { __typename?: 'PostalAddress', email?: string | null, locality?: string | null, postal_code?: string | null, street?: string | null, telephone?: string | null, post_office_box_number?: string | null } | null } | null } | null> | null, premis_is_represented_by: Array<{ __typename?: 'object_representation', ie_schema_identifier: string, schema_name: string, schema_alternate_name?: string | null, schema_description?: string | null, dcterms_format: string, schema_transcript?: string | null, schema_date_created?: any | null, premis_includes: Array<{ __typename?: 'object_file', schema_name?: string | null, schema_alternate_name?: string | null, schema_description?: string | null, representation_schema_identifier: string, ebucore_media_type: string, ebucore_is_media_fragment_of?: string | null, schema_embed_url?: string | null }> }> }> };

export type GetRelatedObjectsQueryVariables = Exact<{
  schemaIdentifier: Scalars['String'];
  meemooIdentifier: Scalars['String'];
  maintainerId: Scalars['String'];
}>;


export type GetRelatedObjectsQuery = { __typename?: 'query_root', object_ie: Array<{ __typename?: 'object_ie', schema_identifier: string, meemoo_identifier: string, premis_identifier?: any | null, premis_relationship?: string | null, schema_is_part_of?: any | null, schema_part_of_archive?: any | null, schema_part_of_episode?: any | null, schema_part_of_season?: any | null, schema_part_of_series?: any | null, schema_copyright_holder?: string | null, schema_copyright_notice?: string | null, schema_duration_in_seconds?: number | null, schema_number_of_pages?: number | null, schema_date_published?: any | null, dcterms_available?: any | null, schema_name: string, schema_description?: string | null, schema_abstract?: string | null, schema_creator?: any | null, schema_actor?: any | null, schema_contributor?: any | null, schema_publisher?: any | null, schema_temporal_coverage?: any | null, schema_spatial_coverage?: any | null, schema_keywords?: any | null, dcterms_format: string, schema_in_language?: any | null, schema_thumbnail_url?: string | null, schema_alternate_name?: string | null, schema_duration?: any | null, schema_license?: any | null, meemoo_media_object_id?: string | null, schema_date_created?: any | null, schema_date_created_lower_bound?: any | null, ebucore_object_type?: string | null, schema_genre?: any | null, schema_maintainer?: Array<{ __typename?: 'ContentPartner', id: string, label?: string | null, primary_site?: { __typename?: 'Site', address?: { __typename?: 'PostalAddress', email?: string | null, locality?: string | null, postal_code?: string | null, street?: string | null, telephone?: string | null, post_office_box_number?: string | null } | null } | null } | null> | null, premis_is_represented_by: Array<{ __typename?: 'object_representation', ie_schema_identifier: string, schema_name: string, schema_alternate_name?: string | null, schema_description?: string | null, dcterms_format: string, schema_transcript?: string | null, schema_date_created?: any | null, premis_includes: Array<{ __typename?: 'object_file', schema_name?: string | null, schema_alternate_name?: string | null, schema_description?: string | null, representation_schema_identifier: string, ebucore_media_type: string, ebucore_is_media_fragment_of?: string | null, schema_embed_url?: string | null }> }> }> };

export type FindSpaceByCpAdminIdQueryVariables = Exact<{
  cpAdminId: Scalars['uuid'];
}>;


export type FindSpaceByCpAdminIdQuery = { __typename?: 'query_root', cp_space: Array<{ __typename?: 'cp_space', id: any, schema_image?: string | null, schema_color?: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_description?: string | null, schema_public_access?: boolean | null, schema_service_description?: string | null, is_published?: boolean | null, published_at?: any | null, created_at?: any | null, updated_at?: any | null, schema_maintainer: { __typename?: 'cp_maintainer', schema_name?: string | null, schema_identifier: string, information?: Array<{ __typename?: 'ContentPartner', description?: string | null, logo?: { __typename?: 'Logo', iri: string } | null, primary_site?: { __typename?: 'Site', address?: { __typename?: 'PostalAddress', email?: string | null, locality?: string | null, postal_code?: string | null, street?: string | null, telephone?: string | null, post_office_box_number?: string | null } | null } | null } | null> | null } }> };

export type FindSpaceByIdQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type FindSpaceByIdQuery = { __typename?: 'query_root', cp_space: Array<{ __typename?: 'cp_space', id: any, schema_image?: string | null, schema_color?: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_description?: string | null, schema_public_access?: boolean | null, schema_service_description?: string | null, is_published?: boolean | null, published_at?: any | null, created_at?: any | null, updated_at?: any | null, schema_maintainer: { __typename?: 'cp_maintainer', schema_name?: string | null, schema_identifier: string, information?: Array<{ __typename?: 'ContentPartner', description?: string | null, logo?: { __typename?: 'Logo', iri: string } | null, primary_site?: { __typename?: 'Site', address?: { __typename?: 'PostalAddress', email?: string | null, locality?: string | null, postal_code?: string | null, street?: string | null, telephone?: string | null, post_office_box_number?: string | null } | null } | null } | null> | null } }> };

export type FindSpaceByMaintainerIdentifierQueryVariables = Exact<{
  maintainerId: Scalars['String'];
}>;


export type FindSpaceByMaintainerIdentifierQuery = { __typename?: 'query_root', cp_space: Array<{ __typename?: 'cp_space', id: any, schema_image?: string | null, schema_color?: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_description?: string | null, schema_public_access?: boolean | null, schema_service_description?: string | null, is_published?: boolean | null, published_at?: any | null, created_at?: any | null, updated_at?: any | null, schema_maintainer: { __typename?: 'cp_maintainer', schema_name?: string | null, schema_identifier: string, information?: Array<{ __typename?: 'ContentPartner', description?: string | null, logo?: { __typename?: 'Logo', iri: string } | null, primary_site?: { __typename?: 'Site', address?: { __typename?: 'PostalAddress', email?: string | null, locality?: string | null, postal_code?: string | null, street?: string | null, telephone?: string | null, post_office_box_number?: string | null } | null } | null } | null> | null } }> };

export type FindSpacesQueryVariables = Exact<{
  where: Cp_Space_Bool_Exp;
  offset: Scalars['Int'];
  limit: Scalars['Int'];
  orderBy: Cp_Space_Order_By;
}>;


export type FindSpacesQuery = { __typename?: 'query_root', cp_space: Array<{ __typename?: 'cp_space', id: any, schema_image?: string | null, schema_color?: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_description?: string | null, schema_public_access?: boolean | null, schema_service_description?: string | null, is_published?: boolean | null, published_at?: any | null, created_at?: any | null, updated_at?: any | null, schema_maintainer: { __typename?: 'cp_maintainer', schema_name?: string | null, schema_identifier: string, information?: Array<{ __typename?: 'ContentPartner', description?: string | null, logo?: { __typename?: 'Logo', iri: string } | null, primary_site?: { __typename?: 'Site', address?: { __typename?: 'PostalAddress', email?: string | null, locality?: string | null, postal_code?: string | null, street?: string | null, telephone?: string | null, post_office_box_number?: string | null } | null } | null } | null> | null } }>, cp_space_aggregate: { __typename?: 'cp_space_aggregate', aggregate?: { __typename?: 'cp_space_aggregate_fields', count: number } | null } };

export type GetSpaceMaintainerProfilesQueryVariables = Exact<{
  spaceId?: InputMaybe<Scalars['uuid']>;
}>;


export type GetSpaceMaintainerProfilesQuery = { __typename?: 'query_root', cp_maintainer_users_profile: Array<{ __typename?: 'cp_maintainer_users_profile', users_profile_id: any, profile: { __typename?: 'users_profile', mail?: string | null } }> };

export type UpdateSpaceMutationVariables = Exact<{
  id: Scalars['uuid'];
  updateSpace: Cp_Space_Set_Input;
}>;


export type UpdateSpaceMutation = { __typename?: 'mutation_root', update_cp_space_by_pk?: { __typename?: 'cp_space', id: any, schema_image?: string | null, schema_color?: string | null, schema_audience_type: Lookup_Schema_Audience_Type_Enum, schema_description?: string | null, schema_public_access?: boolean | null, schema_service_description?: string | null, is_published?: boolean | null, published_at?: any | null, created_at?: any | null, updated_at?: any | null, schema_maintainer: { __typename?: 'cp_maintainer', schema_name?: string | null, schema_identifier: string, information?: Array<{ __typename?: 'ContentPartner', description?: string | null, logo?: { __typename?: 'Logo', iri: string } | null, primary_site?: { __typename?: 'Site', address?: { __typename?: 'PostalAddress', email?: string | null, locality?: string | null, postal_code?: string | null, street?: string | null, telephone?: string | null, post_office_box_number?: string | null } | null } | null } | null> | null } } | null };


export const GetContentByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"content_width"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublish_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"seo_description"}},{"kind":"Field","name":{"kind":"Name","value":"meta_description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_path"}},{"kind":"Field","name":{"kind":"Name","value":"is_protected"}},{"kind":"Field","name":{"kind":"Name","value":"is_public"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"owner_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"maintainer_users_profiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"maintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iri"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"content_content_labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_label"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"link_to"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content_blocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"position"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_block_type"}},{"kind":"Field","name":{"kind":"Name","value":"content_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"variables"}},{"kind":"Field","name":{"kind":"Name","value":"content_block_type"}}]}}]}}]}}]} as unknown as DocumentNode<GetContentByIdQuery, GetContentByIdQueryVariables>;
export const GetContentPageByPathDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPageByPath"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"path"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"path"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"path"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"content_width"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublish_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"seo_description"}},{"kind":"Field","name":{"kind":"Name","value":"meta_description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_path"}},{"kind":"Field","name":{"kind":"Name","value":"is_protected"}},{"kind":"Field","name":{"kind":"Name","value":"is_public"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"owner_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}},{"kind":"Field","name":{"kind":"Name","value":"content_content_labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_label"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"link_to"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content_blocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"position"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_block_type"}},{"kind":"Field","name":{"kind":"Name","value":"content_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"variables"}},{"kind":"Field","name":{"kind":"Name","value":"content_block_type"}}]}}]}}]}}]} as unknown as DocumentNode<GetContentPageByPathQuery, GetContentPageByPathQueryVariables>;
export const GetContentPageLabelsByTypeAndIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPageLabelsByTypeAndIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"lookup_cms_content_type_enum"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labelIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_content_labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labelIds"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"content_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetContentPageLabelsByTypeAndIdsQuery, GetContentPageLabelsByTypeAndIdsQueryVariables>;
export const GetContentPageLabelsByTypeAndLabelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPageLabelsByTypeAndLabels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"lookup_cms_content_type_enum"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labels"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_content_labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"label"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labels"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"content_type"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentType"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<GetContentPageLabelsByTypeAndLabelsQuery, GetContentPageLabelsByTypeAndLabelsQueryVariables>;
export const GetContentPagesWithBlocksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPagesWithBlocks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"cms_content_bool_exp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"cms_content_order_by"}}}},"defaultValue":{"kind":"ObjectValue","fields":[]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labelIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},"defaultValue":{"kind":"ListValue","values":[]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orUserGroupIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"cms_content_content_labels_bool_exp"}}}},"defaultValue":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublish_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"seo_description"}},{"kind":"Field","name":{"kind":"Name","value":"meta_description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_path"}},{"kind":"Field","name":{"kind":"Name","value":"is_protected"}},{"kind":"Field","name":{"kind":"Name","value":"is_public"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"owner_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"content_content_labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_label"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"link_to"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"content_blocks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"position"},"value":{"kind":"EnumValue","value":"asc"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_block_type"}},{"kind":"Field","name":{"kind":"Name","value":"content_id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"variables"}},{"kind":"Field","name":{"kind":"Name","value":"content_block_type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cms_content_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cms_content_labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labelIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_content_labels_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orUserGroupIds"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetContentPagesWithBlocksQuery, GetContentPagesWithBlocksQueryVariables>;
export const GetContentPagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getContentPages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"cms_content_bool_exp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"0"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"10"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"cms_content_order_by"}}}},"defaultValue":{"kind":"ObjectValue","fields":[]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"labelIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},"defaultValue":{"kind":"ListValue","values":[]}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orUserGroupIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"cms_content_content_labels_bool_exp"}}}},"defaultValue":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_type"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"depublish_at"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"seo_description"}},{"kind":"Field","name":{"kind":"Name","value":"meta_description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_path"}},{"kind":"Field","name":{"kind":"Name","value":"is_protected"}},{"kind":"Field","name":{"kind":"Name","value":"is_public"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"owner_profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"publish_at"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user_group_ids"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"content_content_labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content_label"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"link_to"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cms_content_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cms_content_labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"labelIds"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content_content_labels_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orUserGroupIds"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetContentPagesQuery, GetContentPagesQueryVariables>;
export const GetPublicContentPagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPublicContentPages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"cms_content_bool_exp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cms_content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<GetPublicContentPagesQuery, GetPublicContentPagesQueryVariables>;
export const UpdateContentPagePublishDatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateContentPagePublishDates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"publishedAt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"timestamp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"publish_content_pages"},"name":{"kind":"Name","value":"update_cms_content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_or"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"publish_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"depublish_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"publish_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"depublish_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"publish_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"published_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_gte"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}}]}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"published_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"published_at"},"value":{"kind":"Variable","name":{"kind":"Name","value":"publishedAt"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_public"},"value":{"kind":"BooleanValue","value":true}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"unpublish_content_pages"},"name":{"kind":"Name","value":"update_cms_content"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"depublish_at"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_lt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"_is_null"},"value":{"kind":"BooleanValue","value":false}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_public"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":true}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"is_deleted"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"BooleanValue","value":false}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"is_public"},"value":{"kind":"BooleanValue","value":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<UpdateContentPagePublishDatesMutation, UpdateContentPagePublishDatesMutationVariables>;
export const GetOrganisationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getOrganisation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cp_maintainer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iri"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}}]}}]}}]} as unknown as DocumentNode<GetOrganisationQuery, GetOrganisationQueryVariables>;
export const GetFileByRepresentationSchemaIdentifierDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getFileByRepresentationSchemaIdentifier"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"object_file"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"representation_schema_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_embed_url"}}]}}]}}]} as unknown as DocumentNode<GetFileByRepresentationSchemaIdentifierQuery, GetFileByRepresentationSchemaIdentifierQueryVariables>;
export const GetThumbnailUrlByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getThumbnailUrlById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"object_ie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}}]}}]}}]} as unknown as DocumentNode<GetThumbnailUrlByIdQuery, GetThumbnailUrlByIdQueryVariables>;
export const DeleteCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_users_collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<DeleteCollectionMutation, DeleteCollectionMutationVariables>;
export const FindCollectionByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findCollectionById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"is_default"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}}]}}]}}]} as unknown as DocumentNode<FindCollectionByIdQuery, FindCollectionByIdQueryVariables>;
export const FindCollectionObjectsByCollectionIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findCollectionObjectsByCollectionId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"users_collection_ie_bool_exp"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_collection_ie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_collection_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}}]}}]},{"kind":"Variable","name":{"kind":"Name","value":"where"}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"collection"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"ie"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"meemoo_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_creator"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}},{"kind":"Field","name":{"kind":"Name","value":"schema_number_of_pages"}},{"kind":"Field","name":{"kind":"Name","value":"schema_is_part_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created_lower_bound"}},{"kind":"Field","name":{"kind":"Name","value":"maintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users_collection_ie_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_and"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_collection_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}}]}}]},{"kind":"Variable","name":{"kind":"Name","value":"where"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<FindCollectionObjectsByCollectionIdQuery, FindCollectionObjectsByCollectionIdQueryVariables>;
export const FindCollectionsByUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findCollectionsByUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"created_at"},"value":{"kind":"EnumValue","value":"asc"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"is_default"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"ies"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ie"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users_collection_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<FindCollectionsByUserQuery, FindCollectionsByUserQueryVariables>;
export const GetObjectBySchemaIdentifierDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getObjectBySchemaIdentifier"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectSchemaIdentifier"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"object_ie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectSchemaIdentifier"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"meemoo_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_creator"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}},{"kind":"Field","name":{"kind":"Name","value":"schema_number_of_pages"}},{"kind":"Field","name":{"kind":"Name","value":"schema_is_part_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created_lower_bound"}},{"kind":"Field","name":{"kind":"Name","value":"maintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetObjectBySchemaIdentifierQuery, GetObjectBySchemaIdentifierQueryVariables>;
export const FindObjectBySchemaIdentifierDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findObjectBySchemaIdentifier"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectSchemaIdentifier"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"object_ie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectSchemaIdentifier"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"meemoo_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_creator"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}},{"kind":"Field","name":{"kind":"Name","value":"schema_number_of_pages"}},{"kind":"Field","name":{"kind":"Name","value":"schema_is_part_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created_lower_bound"}},{"kind":"Field","name":{"kind":"Name","value":"maintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindObjectBySchemaIdentifierQuery, FindObjectBySchemaIdentifierQueryVariables>;
export const FindObjectInCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findObjectInCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectSchemaIdentifier"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_collection_ie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_collection_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"ie_schema_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectSchemaIdentifier"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ie"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"meemoo_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_creator"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}},{"kind":"Field","name":{"kind":"Name","value":"schema_number_of_pages"}},{"kind":"Field","name":{"kind":"Name","value":"schema_is_part_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created_lower_bound"}},{"kind":"Field","name":{"kind":"Name","value":"maintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"space"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<FindObjectInCollectionQuery, FindObjectInCollectionQueryVariables>;
export const InsertCollectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertCollections"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"object"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"users_collection_insert_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_users_collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"object"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"is_default"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]}}]} as unknown as DocumentNode<InsertCollectionsMutation, InsertCollectionsMutationVariables>;
export const InsertObjectIntoCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"insertObjectIntoCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectSchemaIdentifier"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insert_users_collection_ie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"objects"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_collection_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"ie_schema_identifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectSchemaIdentifier"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"ie"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"meemoo_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_creator"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer_id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_number_of_pages"}}]}}]}}]}}]}}]} as unknown as DocumentNode<InsertObjectIntoCollectionMutation, InsertObjectIntoCollectionMutationVariables>;
export const RemoveObjectFromCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeObjectFromCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"objectSchemaIdentifier"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delete_users_collection_ie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"ie_schema_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"objectSchemaIdentifier"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"user_collection_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"collection"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"affected_rows"}}]}}]}}]} as unknown as DocumentNode<RemoveObjectFromCollectionMutation, RemoveObjectFromCollectionMutationVariables>;
export const UpdateCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collection"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"users_collection_set_input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_users_collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collectionId"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"user_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userProfileId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collection"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"returning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"user_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"is_default"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCollectionMutation, UpdateCollectionMutationVariables>;
export const GetObjectDetailBySchemaIdentifierDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getObjectDetailBySchemaIdentifier"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schemaIdentifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"object_ie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schemaIdentifier"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"meemoo_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"premis_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"premis_relationship"}},{"kind":"Field","name":{"kind":"Name","value":"schema_is_part_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_part_of_archive"}},{"kind":"Field","name":{"kind":"Name","value":"schema_part_of_episode"}},{"kind":"Field","name":{"kind":"Name","value":"schema_part_of_season"}},{"kind":"Field","name":{"kind":"Name","value":"schema_part_of_series"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"primary_site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"telephone"}},{"kind":"Field","name":{"kind":"Name","value":"post_office_box_number"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schema_copyright_holder"}},{"kind":"Field","name":{"kind":"Name","value":"schema_copyright_notice"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration_in_seconds"}},{"kind":"Field","name":{"kind":"Name","value":"schema_number_of_pages"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"schema_abstract"}},{"kind":"Field","name":{"kind":"Name","value":"schema_creator"}},{"kind":"Field","name":{"kind":"Name","value":"schema_actor"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contributor"}},{"kind":"Field","name":{"kind":"Name","value":"schema_publisher"}},{"kind":"Field","name":{"kind":"Name","value":"schema_temporal_coverage"}},{"kind":"Field","name":{"kind":"Name","value":"schema_spatial_coverage"}},{"kind":"Field","name":{"kind":"Name","value":"schema_keywords"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}},{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_alternate_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"schema_license"}},{"kind":"Field","name":{"kind":"Name","value":"meemoo_media_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created_lower_bound"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_object_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_genre"}},{"kind":"Field","name":{"kind":"Name","value":"premis_is_represented_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ie_schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_alternate_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created"}},{"kind":"Field","name":{"kind":"Name","value":"premis_includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_alternate_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"representation_schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_media_type"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_embed_url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetObjectDetailBySchemaIdentifierQuery, GetObjectDetailBySchemaIdentifierQueryVariables>;
export const GetRelatedObjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRelatedObjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schemaIdentifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meemooIdentifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maintainerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"object_ie"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_neq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schemaIdentifier"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"meemoo_identifier"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meemooIdentifier"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"schema_maintainer_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maintainerId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"meemoo_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"premis_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"premis_relationship"}},{"kind":"Field","name":{"kind":"Name","value":"schema_is_part_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_part_of_archive"}},{"kind":"Field","name":{"kind":"Name","value":"schema_part_of_episode"}},{"kind":"Field","name":{"kind":"Name","value":"schema_part_of_season"}},{"kind":"Field","name":{"kind":"Name","value":"schema_part_of_series"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"primary_site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"telephone"}},{"kind":"Field","name":{"kind":"Name","value":"post_office_box_number"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schema_copyright_holder"}},{"kind":"Field","name":{"kind":"Name","value":"schema_copyright_notice"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration_in_seconds"}},{"kind":"Field","name":{"kind":"Name","value":"schema_number_of_pages"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_published"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_available"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"schema_abstract"}},{"kind":"Field","name":{"kind":"Name","value":"schema_creator"}},{"kind":"Field","name":{"kind":"Name","value":"schema_actor"}},{"kind":"Field","name":{"kind":"Name","value":"schema_contributor"}},{"kind":"Field","name":{"kind":"Name","value":"schema_publisher"}},{"kind":"Field","name":{"kind":"Name","value":"schema_temporal_coverage"}},{"kind":"Field","name":{"kind":"Name","value":"schema_spatial_coverage"}},{"kind":"Field","name":{"kind":"Name","value":"schema_keywords"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}},{"kind":"Field","name":{"kind":"Name","value":"schema_in_language"}},{"kind":"Field","name":{"kind":"Name","value":"schema_thumbnail_url"}},{"kind":"Field","name":{"kind":"Name","value":"schema_alternate_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_duration"}},{"kind":"Field","name":{"kind":"Name","value":"schema_license"}},{"kind":"Field","name":{"kind":"Name","value":"meemoo_media_object_id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created_lower_bound"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_object_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_genre"}},{"kind":"Field","name":{"kind":"Name","value":"premis_is_represented_by"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ie_schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_alternate_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"dcterms_format"}},{"kind":"Field","name":{"kind":"Name","value":"schema_transcript"}},{"kind":"Field","name":{"kind":"Name","value":"schema_date_created"}},{"kind":"Field","name":{"kind":"Name","value":"premis_includes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_alternate_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"representation_schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_media_type"}},{"kind":"Field","name":{"kind":"Name","value":"ebucore_is_media_fragment_of"}},{"kind":"Field","name":{"kind":"Name","value":"schema_embed_url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetRelatedObjectsQuery, GetRelatedObjectsQueryVariables>;
export const FindSpaceByCpAdminIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findSpaceByCpAdminId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cpAdminId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cp_space"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_maintainer"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"maintainer_users_profiles"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"users_profile_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cpAdminId"}}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iri"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primary_site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"telephone"}},{"kind":"Field","name":{"kind":"Name","value":"post_office_box_number"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindSpaceByCpAdminIdQuery, FindSpaceByCpAdminIdQueryVariables>;
export const FindSpaceByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findSpaceById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cp_space"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iri"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primary_site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"telephone"}},{"kind":"Field","name":{"kind":"Name","value":"post_office_box_number"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindSpaceByIdQuery, FindSpaceByIdQueryVariables>;
export const FindSpaceByMaintainerIdentifierDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findSpaceByMaintainerIdentifier"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maintainerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cp_space"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"schema_maintainer_id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_ilike"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maintainerId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iri"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primary_site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"telephone"}},{"kind":"Field","name":{"kind":"Name","value":"post_office_box_number"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindSpaceByMaintainerIdentifierQuery, FindSpaceByMaintainerIdentifierQueryVariables>;
export const FindSpacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"findSpaces"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"cp_space_bool_exp"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"cp_space_order_by"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cp_space"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"order_by"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iri"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primary_site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"telephone"}},{"kind":"Field","name":{"kind":"Name","value":"post_office_box_number"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cp_space_aggregate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode<FindSpacesQuery, FindSpacesQueryVariables>;
export const GetSpaceMaintainerProfilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSpaceMaintainerProfiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"spaceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cp_maintainer_users_profile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"maintainer"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"space"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"_eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"spaceId"}}}]}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users_profile_id"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mail"}}]}}]}}]}}]} as unknown as DocumentNode<GetSpaceMaintainerProfilesQuery, GetSpaceMaintainerProfilesQueryVariables>;
export const UpdateSpaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateSpace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"uuid"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateSpace"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"cp_space_set_input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"update_cp_space_by_pk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pk_columns"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"_set"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateSpace"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schema_image"}},{"kind":"Field","name":{"kind":"Name","value":"schema_color"}},{"kind":"Field","name":{"kind":"Name","value":"schema_audience_type"}},{"kind":"Field","name":{"kind":"Name","value":"schema_description"}},{"kind":"Field","name":{"kind":"Name","value":"schema_public_access"}},{"kind":"Field","name":{"kind":"Name","value":"schema_service_description"}},{"kind":"Field","name":{"kind":"Name","value":"is_published"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"schema_maintainer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schema_name"}},{"kind":"Field","name":{"kind":"Name","value":"schema_identifier"}},{"kind":"Field","name":{"kind":"Name","value":"information"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iri"}}]}},{"kind":"Field","name":{"kind":"Name","value":"primary_site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"address"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"locality"}},{"kind":"Field","name":{"kind":"Name","value":"postal_code"}},{"kind":"Field","name":{"kind":"Name","value":"street"}},{"kind":"Field","name":{"kind":"Name","value":"telephone"}},{"kind":"Field","name":{"kind":"Name","value":"post_office_box_number"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSpaceMutation, UpdateSpaceMutationVariables>;