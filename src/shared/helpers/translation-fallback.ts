import nlJson from '../i18n/locales/nl.json';

export function getTranslationFallback(
	key: string,
	variables: Record<string, string | number> = {}
): string {
	const translation = nlJson[key];
	if (translation) {
		return resolveTranslationVariables(translation, variables);
	}
	if (key.includes('___')) {
		const displayKey = key.split('___')[1].replace('-', ' ');
		return `${displayKey} ***`;
	}
	return `${key} ***`;
}

export function resolveTranslationVariables(
	translation: string,
	variables?: Record<string, string | number>
): string {
	let resolvedTranslation = translation;
	for (const variableName of Object.keys(variables || {})) {
		resolvedTranslation = resolvedTranslation.replace(
			new RegExp(`{{${variableName}}}`, 'g'),
			String(variables[variableName])
		);
	}
	return resolvedTranslation;
}
