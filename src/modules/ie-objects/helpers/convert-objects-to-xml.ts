import convert from 'xml-js';

import { IeObject } from '../ie-objects.types';

export const convertObjectsToXml = (objects: Partial<IeObject>[]): string => {
	// this structure defines the parent 'objects' tag, which includes
	// all objects wrapped in a separate 'object' tag
	const csvData = objects.map(({ accessThrough, ...csvData }) => csvData);
	return convert.js2xml({ objects: { object: csvData } }, { compact: true, spaces: 2 });
};

export const convertObjectToXml = (object: Partial<IeObject>): string => {
	const { accessThrough, ...csvData } = object;
	return convert.js2xml({ csvData }, { compact: true, spaces: 2 });
};
