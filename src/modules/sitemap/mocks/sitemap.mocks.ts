import { DbContentPage, Locale } from '@meemoo/admin-core-api';

import { SitemapConfig } from '../sitemap.types';

export const mockSitemapConfig: SitemapConfig = {
	value: [
		{
			path: '/',
			priority: 1,
		},
		{
			path: '/bezoek',
			priority: 1,
		},
		{
			path: '/vragen',
			priority: 0.7,
		},
		{
			path: '/geheime-content-pagina',
			blacklisted: true,
		},
	],
	name: 'SITEMAP_CONFIG',
};

export const mockContentPage: DbContentPage = {
	id: '3be90381-2a80-4c0e-8f30-d618ab6e2d77',
	thumbnailPath: null,
	title: 'mock content page',
	description: '<p></p>',
	seoDescription: null,
	metaDescription: null,
	path: '/mock-content-page-url',
	isPublic: false,
	publishedAt: null,
	publishAt: null,
	depublishAt: null,
	createdAt: '2023-04-18T09:51:27.509',
	updatedAt: '2023-04-18T09:54:16.675',
	isProtected: false,
	contentType: 'PAGINA',
	contentWidth: 'MEDIUM',
	owner: {
		id: undefined,
		fullName: 'meemoo Admin',
		firstName: 'meemoo',
		lastName: 'Admin',
		groupId: '0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
		groupName: 'Sitebeheerder',
	},
	userProfileId: 'c4dead9b-32c3-4459-a66b-23f73afba3ea',
	userGroupIds: [],
	content_blocks: [],
	labels: [],
	language: Locale.Nl,
	nlParentPageId: '3be90381-2a80-4c0e-8f30-d618ab6e2d77',
	translatedPages: [
		{
			id: '3be90381-2a80-4c0e-8f30-d618ab6e2d77',
			title: 'mock content page en',
			path: '/mock-content-page-url-en',
			language: Locale.En,
			isPublic: true,
		},
		{
			id: '3be90381-2a80-4c0e-8f30-d618ab6e2d77',
			title: 'mock content page fr',
			path: '/mock-content-page-url-fr',
			language: 'fr' as any,
			isPublic: false,
		},
	],
};

export const mockSitemapSpaces = {
	items: [
		{
			id: '1',
			name: 'Space Mountain',
			image: 'http://assets-int.hetarchief.be/hetarchief/SPACE_IMAGE/image.jpg',
			maintainerId: 'OR-rf5kf25',
		},
		{
			id: '2',
			name: 'Space X',
			maintainerId: 'OR-spacex',
		},
	],
};

export const mockGeneralXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    <url>
        <loc>
            http://hetarchief.be/
        </loc>
        <xhtml:link rel="alternate" hreflang="en" href="http://hetarchief.be/en/"/>
        <xhtml:link rel="alternate" hreflang="nl" href="http://hetarchief.be/"/>
        <changefreq>
            monthly
        </changefreq>
        <priority>
            1
        </priority>
    </url>
    <url>
        <loc>
            http://hetarchief.be/bezoek
        </loc>
        <xhtml:link rel="alternate" hreflang="en" href="http://hetarchief.be/en/visit"/>
        <xhtml:link rel="alternate" hreflang="nl" href="http://hetarchief.be/bezoek"/>
        <changefreq>
            monthly
        </changefreq>
        <priority>
            1
        </priority>
    </url>
    <url>
        <loc>
            http://hetarchief.be/zoeken
        </loc>
        <xhtml:link rel="alternate" hreflang="en" href="http://hetarchief.be/en/search"/>
        <xhtml:link rel="alternate" hreflang="nl" href="http://hetarchief.be/zoeken"/>
        <changefreq>
            monthly
        </changefreq>
    </url>
    <url>
        <loc>
            http://hetarchief.be/gebruiksvoorwaarden
        </loc>
        <xhtml:link rel="alternate" hreflang="en" href="http://hetarchief.be/en/user-conditions"/>
        <xhtml:link rel="alternate" hreflang="nl" href="http://hetarchief.be/gebruiksvoorwaarden"/>
        <changefreq>
            monthly
        </changefreq>
    </url>
    <url>
        <loc>
            http://hetarchief.be/cookiebeleid
        </loc>
        <xhtml:link rel="alternate" hreflang="en" href="http://hetarchief.be/en/cookie-policy"/>
        <xhtml:link rel="alternate" hreflang="nl" href="http://hetarchief.be/cookiebeleid"/>
        <changefreq>
            monthly
        </changefreq>
    </url>
    <url>
        <loc>
            http://hetarchief.be/nieuwsbrief
        </loc>
        <xhtml:link rel="alternate" hreflang="en" href="http://hetarchief.be/en/newsletter"/>
        <xhtml:link rel="alternate" hreflang="nl" href="http://hetarchief.be/nieuwsbrief"/>
        <changefreq>
            monthly
        </changefreq>
    </url>
    <url>
        <loc>
            http://hetarchief.be/mock-content-page-url
        </loc>
        <xhtml:link rel="alternate" hreflang="en" href="http://hetarchief.be/en/mock-content-page-url-en"/>
        <xhtml:link rel="alternate" hreflang="nl" href="http://hetarchief.be/mock-content-page-url"/>
        <lastmod>
            2023-04-18
        </lastmod>
        <changefreq>
            monthly
        </changefreq>
    </url>
    <url>
        <loc>
            http://hetarchief.be/zoeken/?aanbieders=OR-rf5kf25
        </loc>
        <xhtml:link rel="alternate" hreflang="nl" href="http://hetarchief.be/zoeken/?aanbieders=OR-rf5kf25"/>
        <xhtml:link rel="alternate" hreflang="en" href="http://hetarchief.be/en/search/?aanbieders=OR-rf5kf25"/>
        <changefreq>
            weekly
        </changefreq>
    </url>
    <url>
        <loc>
            http://hetarchief.be/zoeken/?aanbieders=OR-spacex
        </loc>
        <xhtml:link rel="alternate" hreflang="nl" href="http://hetarchief.be/zoeken/?aanbieders=OR-spacex"/>
        <xhtml:link rel="alternate" hreflang="en" href="http://hetarchief.be/en/search/?aanbieders=OR-spacex"/>
        <changefreq>
            weekly
        </changefreq>
    </url>
</urlset>`;
