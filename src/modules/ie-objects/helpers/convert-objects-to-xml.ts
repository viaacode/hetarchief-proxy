import convert from 'xml-js';

import { IeObject } from '../ie-objects.types';

export const convertObjectsToXml = (objects: Partial<IeObject>[]): string => {
	// this structure defines the parent 'objects' tag, which includes
	// all objects wrapped in a separate 'object' tag
	const xmlData = objects.map(({ accessThrough, ...xmlData }) => xmlData);
	return convert.js2xml({ objects: { object: xmlData } }, { compact: true, spaces: 2 });
};

export const convertObjectToXml = (object: Partial<IeObject>): string => {
	const { accessThrough, ...xmlData } = object;
	return convert.js2xml({ object: xmlData }, { compact: true, spaces: 2 });
};
