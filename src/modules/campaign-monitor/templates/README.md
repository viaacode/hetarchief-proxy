# Campaign monitor email templates

This folder contains email templates used in campaign monitor directly. We also store them here to track changes and make sure everyone can find them.

When uploading the templates in campaign monitor, choose "import HTML" and make sure the option "Move my CSS inline (for best results in Gmail and Outlook)" is disabled (default on).

## ID's & variables

### arc_request item enduser

#### QAS NL

b573a74d-45cf-432a-bd0b-eb74a4cdec1e (https://meemoo.createsend.com/triggered/workflow/b573a74d-45cf-432a-bd0b-eb74a4cdec1e)

#### QAS EN

2cfc4bf4-49c5-48ba-8f77-d03607cdabf4 (https://meemoo.createsend.com/triggered/workflow/2cfc4bf4-49c5-48ba-8f77-d03607cdabf4)

#### PRD NL

e3bb38f4-afe2-4d89-ac9b-c3c32caef083 (https://meemoo.createsend.com/triggered/workflow/e3bb38f4-afe2-4d89-ac9b-c3c32caef083)

#### PRD EN

fe933d54-23ec-43bc-93f6-a1a3f4a68617 (https://meemoo.createsend.com/triggered/workflow/fe933d54-23ec-43bc-93f6-a1a3f4a68617)

```json
{
	"user_firstname": "Maaike",
	"user_lastname": "Ongena",
	"request_list": [
		{
			"title": "titel van het object",
			"cp_name": "naam organisatie",
			"local_cp_id": "local cp id van het item",
			"pid": "meemoo id",
			"page_url": "https://qas.hetarchief.be/item-url",
			"request_type": "bekijken/herbruiken/meer info",
			"request_description": "input invulveld gebruiker"
		}
	],
	"user_request_context": "beroepsdoeleinden/onderzoek/...",
	"user_organisation": "organisatie van de gebruiker",
	"user_email": "mailadres van de eindgebruiker"
}

```

### arc_request item cp

#### QAS NL

d2691b7b-5119-42cc-9db8-08a94df37f4c (https://meemoo.createsend.com/triggered/workflow/d2691b7b-5119-42cc-9db8-08a94df37f4c)

#### QAS EN

2cfc4bf4-49c5-48ba-8f77-d03607cdabf4 (https://meemoo.createsend.com/triggered/workflow/2cfc4bf4-49c5-48ba-8f77-d03607cdabf4)

#### PRD NL

0694e647-6fbc-474d-b8c8-4db735fb630a (https://meemoo.createsend.com/triggered/workflow/0694e647-6fbc-474d-b8c8-4db735fb630a)

#### PRD EN

f93e7d47-5974-4965-a327-72471f5a0d4d (https://meemoo.createsend.com/triggered/workflow/f93e7d47-5974-4965-a327-72471f5a0d4d)


```json
{
	"user_firstname": "Maaike",
	"user_lastname": "Ongena",
	"cp_name": "naam organisatie",
	"request_list": [
		{
			"title": "titel van het object",
			"local_cp_id": "local cp id van het item",
			"pid": "meemoo id",
			"page_url": "https://qas.hetarchief.be/item-url",
			"request_type": "bekijken/herbruiken/meer info",
			"request_description": "input invulveld gebruiker"
		}
	],
	"user_request_context": "beroepsdoeleinden/onderzoek/...",
	"user_organisation": "organisatie van de gebruiker",
	"user_email": "mailadres van de eindgebruiker"
}
```
