import convert from 'xml-js';

import {
	IE_OBJECT_PROPERTY_TO_DUBLIN_CORE,
	IE_OBJECT_PROPS_METADATA_EXPORT,
	type XmlNode,
} from '../ie-objects.conts';
import { type IeObject, IeObjectLicense } from '../ie-objects.types';

export const convertObjectToXml = (object: Partial<IeObject>, clientHost: string): string => {
	const dcElements: XmlNode[] = [];

	for (const key of IE_OBJECT_PROPS_METADATA_EXPORT) {
		const value = object[key as keyof IeObject];
		if (value) {
			const dcField = IE_OBJECT_PROPERTY_TO_DUBLIN_CORE[key](value);

			if (dcField) {
				dcElements.push(...dcField);
			}
		}
	}

	// Permalink
	dcElements.push(
		...IE_OBJECT_PROPERTY_TO_DUBLIN_CORE.permalink(
			`${clientHost}/pid/${object.schemaIdentifier}`
		)
	);

	// Rights
	let rights: string | null;
	if (object.licenses?.includes(IeObjectLicense.PUBLIC_DOMAIN)) {
		rights = 'public domain';
	} else if (object.licenses?.includes(IeObjectLicense.COPYRIGHT_UNDETERMINED)) {
		rights = 'copyright undetermined';
	} else {
		rights = null;
	}
	if (rights) {
		dcElements.push(...IE_OBJECT_PROPERTY_TO_DUBLIN_CORE.rightsStatus(rights));
	}

	const xmlObj = {
		declaration: {
			attributes: {
				version: '1.0',
				encoding: 'UTF-8',
			},
		},
		elements: [
			{
				type: 'element',
				name: 'oai_dc:dc',
				attributes: {
					'xmlns:oai_dc': 'http://www.openarchives.org/OAI/2.0/oai_dc/',
					'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
					'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
					'xsi:schemaLocation':
						'http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd',
				},
				elements: dcElements,
			},
		],
	};

	return convert.js2xml(xmlObj, { compact: false, spaces: 2 });
};
