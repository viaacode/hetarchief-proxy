import { GetIeObjectDetailQuery } from '~generated/graphql-db-types-hetarchief';

export type DbIeObjectWithRepresentations =
	| GetIeObjectDetailQuery['getIsRepresentedBy'][0]
	| GetIeObjectDetailQuery['getHasPart'][0];

export type DbIeObjectWithMentions = GetIeObjectDetailQuery['getHasPart'][0];

export type DbRepresentation = DbIeObjectWithRepresentations['isRepresentedBy'][0];

export type DbIncludeFiles = DbRepresentation['includes'];
export type DbIncludeFile = DbRepresentation['includes'][0];
export type DbFile = DbIncludeFile['file'];
