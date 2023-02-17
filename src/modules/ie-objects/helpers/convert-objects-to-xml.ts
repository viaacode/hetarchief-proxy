import convert from 'xml-js';

import { IeObject } from '../ie-objects.types';

export const convertObjectsToXml = (objects: Partial<IeObject>[]): string => {
	// this structure defines the parent 'objects' tag, which includes
	// all objects wrapped in a separate 'object' tag
	return convert.js2xml({ objects: { object: objects } }, { compact: true, spaces: 2 });
};

export const convertObjectToXml = (object: Partial<IeObject>): string => {
	return convert.js2xml({ object }, { compact: true, spaces: 2 });
};
