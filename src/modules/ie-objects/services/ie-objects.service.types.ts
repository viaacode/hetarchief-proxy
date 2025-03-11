import {
	type GetDctermsFormatQuery,
	type GetHasCarrierQuery,
	type GetHasPartQuery,
	type GetIeObjectQuery,
	type GetIsPartOfQuery,
	type GetIsRepresentedByQuery,
	type GetMeemooLocalIdQuery,
	type GetMhFragmentIdentifierQuery,
	type GetParentCollectionQuery,
	type GetPremisIdentifierQuery,
	type GetSchemaAlternateNameQuery,
	type GetSchemaCopyrightHolderQuery,
	type GetSchemaCreatorQuery,
	type GetSchemaDurationQuery,
	type GetSchemaGenreQuery,
	type GetSchemaInLanguageQuery,
	type GetSchemaIsPartOfQuery,
	type GetSchemaKeywordsQuery,
	type GetSchemaLicenseQuery,
	type GetSchemaMediumQuery,
	type GetSchemaPublisherQuery,
	type GetSchemaSpatialQuery,
	type GetSchemaTemporalQuery,
	type GetSchemaThumbnailUrlQuery,
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

export type DbIeObjectWithRepresentations =
	| GetIsRepresentedByQuery['graph__intellectual_entity'][0]
	| GetHasPartQuery['graph__intellectual_entity'][0]['hasPart'][0];

export type DbIeObjectWithMentions = GetHasPartQuery['graph__intellectual_entity'][0]['hasPart'][0];

export type DbRepresentation = DbIeObjectWithRepresentations['isRepresentedBy'][0];

export type DbFile = DbRepresentation['includes'];
