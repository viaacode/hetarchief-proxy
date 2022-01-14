import i18n from 'i18next';

import { DEFAULT_NS_KEY } from './i18n.const';
import nlJson from './locales/nl.json';

// initialize translation module
i18n.init({
	debug: process.env.NODE_ENV === 'local',
	resources: {
		nl: {
			[DEFAULT_NS_KEY]: nlJson,
		},
	},
	keySeparator: '^',
	nsSeparator: '^',
	lng: 'nl',
	fallbackLng: 'nl',
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
