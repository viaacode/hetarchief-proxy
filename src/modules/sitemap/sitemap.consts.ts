// amount of objects in 1 xml file, sitemaps can hold 50000 per file
// But we'll pick 5000 because there seem to be some issues with large file uploads to the s3 compatible storage (castor storage) for large files (23MB)
export const SITEMAP_XML_OBJECTS_SIZE = 5000;
