/**
 * This is not very good practice to convert from schemaIdentifier (086348mc8s) to ie object id (https://data.hetarchief.be/id/entity/086348mc8s)
 * Since this might not always be true in the future
 * But doe now it is a correct assumption
 *
 * If we do not want to use this function in the future, we would need to fetch objects from the database using the schemaIdentifier
 * Which is a lot less efficient since the index for schemaIdentifier is not present in the database
 * @param schemaIdentifier eg: 086348mc8s
 * @return ieObjectId eg: https://data.hetarchief.be/id/entity/086348mc8s
 */
export function convertSchemaIdentifierToId(schemaIdentifier: string): string {
	return `${process.env.IE_OBJECT_ID_PREFIX}/${schemaIdentifier}`;
}
