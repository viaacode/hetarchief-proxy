# The AVO and Hetarchief databases are not identical. Some differences include:

* uuid vs int for ids
* hetarchief user vs avo profile + user
* relationship names
	* role vs group
	* owner vs profile
* enums
	* in hetarchief (single value)
	* enums in avo (link to row: value+description)
* schema names differ: cms vs app

To deal with this, we split queries into 2 folders. In the future me might try to change the avo database to be more like the hetarchief database, so we can
remove some of this duplication.
