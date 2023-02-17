import { IeObject } from '../ie-objects.types';

export const limitMetadata = (mediaObject: Partial<IeObject>): Partial<IeObject> => {
	const copy: Partial<IeObject> & Record<string, any> = { ...mediaObject };

	// https://meemoo.atlassian.net/browse/ARC-1109
	delete copy.schemaIdentifier;
	delete copy.maintainerId;
	delete copy.contactInfo;
	delete copy.copyrightHolder;
	delete copy.copyrightNotice;
	delete copy.durationInSeconds;
	delete copy.numberOfPages;
	delete copy.dctermsAvailable;
	delete copy.license;
	delete copy.meemooMediaObjectId;
	delete copy.dateCreatedLowerBound;

	// https://meemoo.atlassian.net/browse/ARC-1109?focusedCommentId=34838
	copy.PID = copy.premisIsPartOf;
	delete copy.premisIsPartOf;

	return copy;
};

export const getLimitedMetadata = (ieObject: IeObject): Partial<IeObject> => {
	return {
		schemaIdentifier: ieObject.schemaIdentifier,
		premisIdentifier: ieObject.premisIdentifier,
		maintainerName: ieObject.maintainerName,
		name: ieObject.name,
		dctermsFormat: ieObject.dctermsFormat,
		dateCreatedLowerBound: ieObject.dateCreatedLowerBound,
		datePublished: ieObject.datePublished,
	};
};
