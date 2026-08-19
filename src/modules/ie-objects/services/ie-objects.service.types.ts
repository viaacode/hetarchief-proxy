import {
	GetIeObjectDetailQuery,
	GetIeObjectPlayableDisplayDataQuery,
} from '~generated/graphql-db-types-hetarchief';

export type DbIeObjectWithRepresentations =
	| GetIeObjectDetailQuery['getIsRepresentedBy'][0]
	| GetIeObjectDetailQuery['getHasPart'][0];

export type DbIeObjectWithMentions = GetIeObjectDetailQuery['getHasPart'][0];

export type DbRepresentation = DbIeObjectWithRepresentations['isRepresentedBy'][0];

export type DbIncludeFiles = DbRepresentation['includes'];
export type DbIncludeFile = DbRepresentation['includes'][0];
export type DbFile = DbIncludeFile['file'];

export type PlayableDisplayDataPage =
	| GetIeObjectPlayableDisplayDataQuery['getHasPart'][0]
	| GetIeObjectPlayableDisplayDataQuery['getIsRepresentedBy'][0];
export type PlayableDisplayDataRepresentation = PlayableDisplayDataPage['isRepresentedBy'][0];
export type PlayableDisplayDataFile = PlayableDisplayDataRepresentation['includes'][0]['file'];
