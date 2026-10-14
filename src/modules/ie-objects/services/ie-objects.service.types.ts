import {
	GetIeObjectDetailQuery,
	GetIeObjectPlayableDisplayDataQuery,
} from '~generated/graphql-db-types-hetarchief';

export type DbIeObjectWithRepresentations =
	| GetIeObjectDetailQuery['getIsRepresentedBy'][0]
	| GetIeObjectDetailQuery['getHasPart'][0];

export type DbIeObjectWithMentions = GetIeObjectDetailQuery['getHasPart'][0];

type DbRepresentationFromDetailQuery = DbIeObjectWithRepresentations['isRepresentedBy'][0];
type DbFileFromDetailQuery = DbRepresentationFromDetailQuery['includes'][0]['file'];

// has_captionings is only selected by the ie-object detail query: other callers (eg: material requests)
// pass representations without it
export type DbFile = Omit<DbFileFromDetailQuery, 'has_captionings'> &
	Partial<Pick<DbFileFromDetailQuery, 'has_captionings'>>;
export type DbIncludeFile = { __typename?: 'graph_includes'; file: DbFile };
export type DbIncludeFiles = DbIncludeFile[];
export type DbRepresentation = Omit<DbRepresentationFromDetailQuery, 'includes'> & {
	includes: DbIncludeFiles;
};

export type PlayableDisplayDataPage =
	| GetIeObjectPlayableDisplayDataQuery['getHasPart'][0]
	| GetIeObjectPlayableDisplayDataQuery['getIsRepresentedBy'][0];
export type PlayableDisplayDataRepresentation = PlayableDisplayDataPage['isRepresentedBy'][0];
export type PlayableDisplayDataFile = PlayableDisplayDataRepresentation['includes'][0]['file'];
