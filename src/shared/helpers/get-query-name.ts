/**
 * Get the name of the query from the graphql query document
 * @param document
 */
export function getQueryName(document: any): string | null {
	return (document.definitions?.[0] as any)?.name?.value || null;
}
