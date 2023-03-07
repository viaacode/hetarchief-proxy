import _ from 'lodash';
import convert from 'xml-js';

import { IE_OBJECT_PROPS_METADATA_EXPORT } from '../ie-objects.conts';
import { IeObject } from '../ie-objects.types';

export const convertObjectsToXml = (objects: Partial<IeObject>[]): string => {
	// this structure defines the parent 'objects' tag, which includes
	// all objects wrapped in a separate 'object' tag
	const xmlData = objects.map((o) => _.pick(o, IE_OBJECT_PROPS_METADATA_EXPORT));
	return convert.js2xml({ objects: { object: xmlData } }, { compact: true, spaces: 2 });
};

export const convertObjectToXml = (object: Partial<IeObject>): string => {
	// const { accessThrough, ...xmlData } = object;
	return convert.js2xml(
		{ object: _.pick(object, IE_OBJECT_PROPS_METADATA_EXPORT) },
		{ compact: true, spaces: 2 }
	);
};
