export function getSchemaName(ieObject: {
	schemaNames: { schema_name: string; is_ai_generated?: boolean | null }[];
}): string | null {
	return ieObject?.schemaNames?.find((name) => !name?.is_ai_generated)?.schema_name ?? null;
}
