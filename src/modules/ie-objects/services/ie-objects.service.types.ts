import type {
	GetDctermsFormatQuery,
	GetHasCarrierQuery,
	GetHasPartQuery,
	GetIeObjectQuery,
	GetIsPartOfQuery,
	GetIsRepresentedByQuery,
	GetMeemooLocalIdQuery,
	GetMhFragmentIdentifierQuery,
	GetParentCollectionQuery,
	GetPremisIdentifierQuery,
	GetSchemaAlternateNameQuery,
	GetSchemaCopyrightHolderQuery,
	GetSchemaCreatorQuery,
	GetSchemaDurationQuery,
	GetSchemaGenreQuery,
	GetSchemaInLanguageQuery,
	GetSchemaIsPartOfQuery,
	GetSchemaKeywordsQuery,
	GetSchemaLicenseQuery,
	GetSchemaMediumQuery,
	GetSchemaPublisherQuery,
	GetSchemaSpatialQuery,
	GetSchemaTemporalQuery,
	GetSchemaThumbnailUrlQuery,
} from '~generated/graphql-db-types-hetarchief';

export type IeObjectDetailResponseTypes = [
	GetIeObjectQuery,
	GetDctermsFormatQuery,
	GetIsPartOfQuery,
	GetHasCarrierQuery,
	GetMeemooLocalIdQuery,
	GetPremisIdentifierQuery,
	GetMhFragmentIdentifierQuery,
	GetParentCollectionQuery,
	GetSchemaAlternateNameQuery,
	GetSchemaCopyrightHolderQuery,
	GetSchemaCreatorQuery,
	GetSchemaDurationQuery,
	GetSchemaGenreQuery,
	GetSchemaInLanguageQuery,
	GetSchemaIsPartOfQuery,
	GetSchemaKeywordsQuery,
	GetSchemaLicenseQuery,
	GetSchemaMediumQuery,
	GetSchemaPublisherQuery,
	GetSchemaSpatialQuery,
	GetSchemaTemporalQuery,
	GetSchemaThumbnailUrlQuery,
	GetHasPartQuery,
	GetIsRepresentedByQuery,
];

export enum IeObjectDetailResponseIndex {
	IeObject = 0,
	DctermsFormat = 1,
	IsPartOf = 2,
	HasCarrier = 3,
	MeemooLocalId = 4,
	PremisIdentifier = 5,
	MhFragmentIdentifier = 6,
	ParentCollection = 7,
	SchemaAlternateName = 8,
	SchemaCopyrightHolder = 9,
	SchemaCreator = 10,
	SchemaDuration = 11,
	SchemaGenre = 12,
	SchemaInLanguage = 13,
	SchemaIsPartOf = 14,
	SchemaKeywords = 15,
	SchemaLicense = 16,
	SchemaMedium = 17,
	SchemaPublisher = 18,
	SchemaSpatial = 19,
	SchemaTemporal = 20,
	SchemaThumbnailUrl = 21,
	HasPart = 22,
	IsRepresentedBy = 23,
}

export type DbIeObjectWithRepresentations =
	| GetIsRepresentedByQuery['graph__intellectual_entity'][0]
	| GetHasPartQuery['graph_intellectual_entity'][0];

export type DbIeObjectWithMentions = GetHasPartQuery['graph_intellectual_entity'][0];

export type DbRepresentation = DbIeObjectWithRepresentations['isRepresentedBy'][0];

export type DbFile = DbRepresentation['includes'];
