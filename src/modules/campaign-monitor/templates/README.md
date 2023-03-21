# Campaign monitor email templates

This folder contains email templates used in campaign monitor directly. We also store them here to track changes and make sure everyone can find them.

When uploading the templates in campaign monitor, choose "import HTML" and make sure the option "Move my CSS inline (for best results in Gmail and Outlook)" is disabled (default on).

## ID's & variables

### qas_arc_request item enduser

b573a74d-45cf-432a-bd0b-eb74a4cdec1e (https://meemoo.createsend.com/triggered/workflow/b573a74d-45cf-432a-bd0b-eb74a4cdec1e)

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

### qas_arc_request item cp

d2691b7b-5119-42cc-9db8-08a94df37f4c (https://meemoo.createsend.com/triggered/workflow/d2691b7b-5119-42cc-9db8-08a94df37f4c)

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

