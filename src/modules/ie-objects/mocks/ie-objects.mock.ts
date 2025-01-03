import { Idp } from '@viaa/avo2-types';

import {
	type IeObject,
	IeObjectAccessThrough,
	IeObjectLicense,
	type IeObjectSector,
	type IeObjectsSitemap,
	IeObjectType,
	IsPartOfKey,
} from '../ie-objects.types';

import {
	type FindAllIeObjectsByFolderIdQuery,
	type FindIeObjectsForSitemapQuery,
	type GetChildIeObjectsQuery,
	type GetObjectDetailBySchemaIdentifiersQuery,
	type GetParentIeObjectQuery,
} from '~generated/graphql-db-types-hetarchief';
import { OrganisationPreference } from '~modules/organisations/organisations.types';
import { GroupId, GroupName, Permission } from '~modules/users/types';
import { Locale } from '~shared/types/types';

export const mockIeObject1: Readonly<IeObject> = {
	schemaIdentifier: '8911p09j1g',
	iri: 'https://data-int.hetarchief.be/id/entity/8911p09j1g',
	premisIdentifier: [{ premisid: 'WP00178829' }],
	copyrightHolder: 'vrt',
	copyrightNotice:
		'embargo|Geen hergebruik geïsoleerde quotes zonder toestemming productiehuis Roses Are Blue!',
	maintainerId: 'OR-rf5kf25',
	maintainerName: 'vrt',
	maintainerSlug: 'vrt',
	maintainerOverlay: true,
	maintainerLogo: 'https://assets.viaa.be/images/OR-rf5kf25',
	maintainerDescription:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	durationInSeconds: null,
	numberOfPages: null,
	datePublished: '2020-09-01',
	dctermsAvailable: '2020-08-28T11:48:11',
	name: 'Durf te vragen R002 A0001',
	description:
		"Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.",
	abstract:
		'In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie.\nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: "Kan je genezen?" en "Heb je al aan euthanasie gedacht?".\nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen.\nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60)\nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om."\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64)\nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer.\nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen.\n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.\nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) & Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.',
	creator: { productionCompany: ['Roses Are Blue'] },
	publisher: null,
	spatial: null,
	temporal: null,
	keywords: [
		'INTERVIEW',
		'ZIEKTE',
		'GEZONDHEID',
		'ZIEKTE VAN ALZHEIMER',
		'JONGDEMENTIE',
		'THUISVERPLEGING',
		'FIETS',
		'GEHEUGEN',
		'VERGETEN',
		'AGRESSIE',
		'KARAKTERVORMING',
	],
	genre: ['program'],
	dctermsFormat: IeObjectType.VIDEO,
	dctermsMedium: ['16mm'],
	inLanguage: null,
	thumbnailUrl:
		'/viaa/VRT/49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
	duration: '00:39:52',
	licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD],
	meemooMediaObjectId: '49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c',
	dateCreated: '[2020-09-01]',
	meemooOriginalCp: null,
	meemooLocalId: null,
	ebucoreObjectType: null,
	meemooDescriptionCast: null,
	pageRepresentations: [],
	accessThrough: [IeObjectAccessThrough.PUBLIC_INFO],
	isPartOf: [
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: IsPartOfKey.serie,
			name: 'Serie1',
		},
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: IsPartOfKey.programma,
			name: 'Programma1',
		},
	],
	synopsis: null,
	height: null,
	locationCreated: null,
	width: null,
	abrahamInfo: null,
	alternativeTitle: null,
};

export const mockIeObjectWithMetadataSetLTD: Readonly<Partial<IeObject>> = {
	meemooOriginalCp: null,
	schemaIdentifier: '8911p09j1g',
	iri: 'https://data-int.hetarchief.be/id/entity/8911p09j1g',
	meemooLocalId: null,
	maintainerId: 'OR-rf5kf25',
	maintainerName: 'vrt',
	maintainerSlug: 'vrt',
	maintainerOverlay: true,
	maintainerLogo: 'https://assets.viaa.be/images/OR-rf5kf25',
	maintainerDescription:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	name: 'Durf te vragen R002 A0001',
	dctermsFormat: IeObjectType.VIDEO,
	dctermsMedium: ['16mm'],
	duration: '00:39:52',
	dateCreated: '[2020-09-01]',
	datePublished: '2020-09-01',
	creator: { productionCompany: ['Roses Are Blue'] },
	description:
		"Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.",
	genre: ['program'],
	keywords: [
		'INTERVIEW',
		'ZIEKTE',
		'GEZONDHEID',
		'ZIEKTE VAN ALZHEIMER',
		'JONGDEMENTIE',
		'THUISVERPLEGING',
		'FIETS',
		'GEHEUGEN',
		'VERGETEN',
		'AGRESSIE',
		'KARAKTERVORMING',
	],
	inLanguage: null,
	licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD],
	accessThrough: [IeObjectAccessThrough.VISITOR_SPACE_FOLDERS],
	isPartOf: [
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: IsPartOfKey.serie,
			name: 'Serie1',
		},
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: IsPartOfKey.programma,
			name: 'Programma1',
		},
	],

	abrahamInfo: null,
	copyrightHolder: 'vrt',
	numberOfPages: null,
	spatial: null,
	temporal: null,
};

export const mockIeObjectWithMetadataSetALL: Readonly<Partial<IeObject>> = {
	name: 'Durf te vragen R002 A0001',
	meemooOriginalCp: null,
	schemaIdentifier: '8911p09j1g',
	iri: 'https://data-int.hetarchief.be/id/entity/8911p09j1g',
	meemooLocalId: null,
	maintainerId: 'OR-zp3w03v',
	maintainerName: 'vrt',
	maintainerSlug: 'vrt',
	maintainerLogo: 'https://assets.viaa.be/images/OR-rf5kf25',
	maintainerDescription:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	maintainerOverlay: true,
	isPartOf: [
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: 'serie' as IsPartOfKey,
			name: 'Serie1',
		},
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: 'programma' as IsPartOfKey,
			name: 'Programma1',
		},
	],
	dctermsFormat: IeObjectType.VIDEO,
	dctermsMedium: ['16mm'],
	duration: '00:39:52',
	dateCreated: '[2020-09-01]',
	datePublished: '2020-09-01',
	creator: {
		productionCompany: ['Roses Are Blue'],
	},
	description:
		"Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.",
	genre: ['program'],
	keywords: [
		'INTERVIEW',
		'ZIEKTE',
		'GEZONDHEID',
		'ZIEKTE VAN ALZHEIMER',
		'JONGDEMENTIE',
		'THUISVERPLEGING',
		'FIETS',
		'GEHEUGEN',
		'VERGETEN',
		'AGRESSIE',
		'KARAKTERVORMING',
	],
	inLanguage: null,
	licenses: [
		IeObjectLicense.PUBLIEK_METADATA_ALL,
		IeObjectLicense.INTRA_CP_CONTENT,
		IeObjectLicense.INTRA_CP_METADATA_ALL,
		IeObjectLicense.INTRA_CP_METADATA_LTD,
	],
	accessThrough: [IeObjectAccessThrough.SECTOR, IeObjectAccessThrough.PUBLIC_INFO],
	numberOfPages: null,
	abrahamInfo: null,
	spatial: null,
	temporal: null,
	copyrightHolder: 'vrt',
	premisIdentifier: [
		{
			premisid: 'WP00178829',
		},
	],
	ebucoreObjectType: null,
	abstract:
		'In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie.\nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: "Kan je genezen?" en "Heb je al aan euthanasie gedacht?".\nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen.\nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60)\nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om."\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64)\nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer.\nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen.\n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.\nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) & Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.',
	meemooDescriptionCast: null,
	meemooMediaObjectId: '49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c',
	publisher: null,
	alternativeTitle: null,
	width: null,
	height: null,
	synopsis: null,
};

export const mockIeObjectWithMetadataSetALLWithEssence: Readonly<Partial<IeObject>> = {
	thumbnailUrl:
		'/viaa/VRT/49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
	pageRepresentations: [],
	meemooOriginalCp: null,
	schemaIdentifier: '8911p09j1g',
	iri: 'https://data-int.hetarchief.be/id/entity/8911p09j1g',
	meemooLocalId: null,
	meemooMediaObjectId: '49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c',
	premisIdentifier: [{ premisid: 'WP00178829' }],
	maintainerId: 'OR-rf5kf25',
	maintainerName: 'vrt',
	maintainerSlug: 'vrt',
	maintainerOverlay: true,
	maintainerLogo: 'https://assets.viaa.be/images/OR-rf5kf25',
	maintainerDescription:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	name: 'Durf te vragen R002 A0001',
	dctermsFormat: IeObjectType.VIDEO,
	dctermsMedium: ['16mm'],
	ebucoreObjectType: null,
	duration: '00:39:52',
	dateCreated: '[2020-09-01]',
	datePublished: '2020-09-01',
	creator: { productionCompany: ['Roses Are Blue'] },
	description:
		"Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.",
	abstract:
		'In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie.\nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: "Kan je genezen?" en "Heb je al aan euthanasie gedacht?".\nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen.\nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60)\nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om."\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64)\nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer.\nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen.\n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.\nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) & Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.',
	meemooDescriptionCast: null,
	genre: ['program'],
	spatial: null,
	temporal: null,
	keywords: [
		'INTERVIEW',
		'ZIEKTE',
		'GEZONDHEID',
		'ZIEKTE VAN ALZHEIMER',
		'JONGDEMENTIE',
		'THUISVERPLEGING',
		'FIETS',
		'GEHEUGEN',
		'VERGETEN',
		'AGRESSIE',
		'KARAKTERVORMING',
	],
	inLanguage: null,
	publisher: null,
	licenses: [IeObjectLicense.INTRA_CP_CONTENT],
	accessThrough: [IeObjectAccessThrough.VISITOR_SPACE_FOLDERS],
	isPartOf: [
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: IsPartOfKey.serie,
			name: 'Serie1',
		},
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: IsPartOfKey.programma,
			name: 'Programma1',
		},
	],
	abrahamInfo: null,
	alternativeTitle: null,
	copyrightHolder: 'vrt',
	height: null,
	numberOfPages: null,
	synopsis: null,
	width: null,
};

export const mockIeObjectLimitedInFolder: Readonly<Partial<IeObject>> = {
	accessThrough: [IeObjectAccessThrough.PUBLIC_INFO],
	name: 'Durf te vragen R002 A0001',
	meemooOriginalCp: null,
	schemaIdentifier: '8911p09j1g',
	iri: 'https://data-int.hetarchief.be/id/entity/8911p09j1g',
	meemooLocalId: null,
	maintainerId: 'OR-rf5kf25',
	maintainerName: 'vrt',
	maintainerSlug: 'vrt',
	maintainerLogo: 'https://assets.viaa.be/images/OR-rf5kf25',
	maintainerDescription:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	maintainerOverlay: true,
	isPartOf: [
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: 'serie' as IsPartOfKey,
			name: 'Serie1',
		},
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: 'programma' as IsPartOfKey,
			name: 'Programma1',
		},
	],
	dctermsFormat: IeObjectType.VIDEO,
	dctermsMedium: ['16mm'],
	duration: '00:39:52',
	dateCreated: '[2020-09-01]',
	datePublished: '2020-09-01',
	creator: {
		productionCompany: ['Roses Are Blue'],
	},
	description:
		"Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.",
	genre: ['program'],
	keywords: [
		'INTERVIEW',
		'ZIEKTE',
		'GEZONDHEID',
		'ZIEKTE VAN ALZHEIMER',
		'JONGDEMENTIE',
		'THUISVERPLEGING',
		'FIETS',
		'GEHEUGEN',
		'VERGETEN',
		'AGRESSIE',
		'KARAKTERVORMING',
	],
	inLanguage: null,
	licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD],
	numberOfPages: null,
	abrahamInfo: null,
	spatial: null,
	temporal: null,
	copyrightHolder: 'vrt',
	premisIdentifier: [
		{
			premisid: 'WP00178829',
		},
	],
};

export const mockIeObjectDefaultLimitedMetadata: Readonly<Partial<IeObject>> = {
	name: 'Durf te vragen R002 A0001',
	maintainerName: 'vrt',
	maintainerId: 'OR-rf5kf25',
	maintainerSlug: 'vrt',
	isPartOf: [
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: 'serie' as IsPartOfKey,
			name: 'Serie1',
		},
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: 'programma' as IsPartOfKey,
			name: 'Programma1',
		},
	],
	dctermsFormat: IeObjectType.VIDEO,
	datePublished: '2020-09-01',
	meemooLocalId: null,
	premisIdentifier: [
		{
			premisid: 'WP00178829',
		},
	],
	schemaIdentifier: '8911p09j1g',
	iri: 'https://data-int.hetarchief.be/id/entity/8911p09j1g',
	licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD],
};

export const mockUser = Object.freeze({
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	language: Locale.Nl,
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: GroupId.CP_ADMIN,
	groupName: GroupName.CP_ADMIN,
	permissions: [Permission.EDIT_ANY_CONTENT_PAGES],
	isKeyUser: false,
});

export const mockUserInfo: Readonly<{
	userId: string | null;
	isKeyUser: boolean;
	sector: IeObjectSector | null;
	groupId: string;
	maintainerId: string;
	accessibleObjectIdsThroughFolders: string[];
	accessibleVisitorSpaceIds: string[];
}> = {
	userId: '2ca2fcad-0ef1-4b0c-ad14-ea83984161c9',
	isKeyUser: false,
	sector: null,
	groupId: GroupId.VISITOR,
	maintainerId: 'OR-rf5kf25',
	accessibleObjectIdsThroughFolders: [],
	accessibleVisitorSpaceIds: ['OR-rf5kf25'],
};

export const mockIeObject2: Readonly<GetObjectDetailBySchemaIdentifiersQuery> = {
	graph__intellectual_entity: [
		{
			schema_identifier: '8911p09j1g',
			id: 'https://data-int.hetarchief.be/id/entity/8911p09j1g',
			premis_is_part_of: 'https://data-int.hetarchief.be/id/entity/9999999999',
			schema_is_part_of: {
				newspaper: 'Het annoncenblad van Moll en omliggende dorpen',
			},
			schema_number_of_pages: null,
			schema_date_published: '1911-10-21',
			dcterms_available: '2020-08-28T11:48:11',
			schema_license: [
				'VIAA-PUBLIEK-METADATA-ALL',
				'VIAA-PUBLIEK-CONTENT',
				'VIAA-INTRA_CP-CONTENT',
				'VIAA-INTRA_CP-METADATA-ALL',
			],
			meemoo_local_id: null,
			parentCollection: [
				{
					collection: {
						id: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
						schema_identifier: '4f1mg9x363',
						schema_name: 'Het annoncenblad van Moll en omliggende dorpen',
						isPreceededBy: [],
						isSucceededBy: [],
					},
				},
			],
			schemaCopyrightHolder: [{ schema_copyright_holder: 'vrt' }],
			isPartOf: {
				schema_identifier: '8911p09j1g',
				id: 'https://data-int.hetarchief.be/id/entity/8911p09j1g',
				premis_is_part_of: 'https://data-int.hetarchief.be/id/entity/9999999999',
				schema_is_part_of: {
					newspaper: 'Het annoncenblad van Moll en omliggende dorpen',
				},
				schema_number_of_pages: null,
				schema_date_published: '1911-10-21',
				dcterms_available: '2020-08-28T11:48:11',
				schema_license: [
					'VIAA-PUBLIEK-METADATA-ALL',
					'VIAA-PUBLIEK-CONTENT',
					'VIAA-INTRA_CP-CONTENT',
					'VIAA-INTRA_CP-METADATA-ALL',
				],
				meemoo_local_id: null,
				schemaInLanguage: {
					schema_in_language: ['nl'],
				},
				schemaKeywords: null,
				intellectualEntity: {
					schema_issue_number: null,
					mhFragmentIdentifier: [
						{
							mh_fragment_identifier:
								'f424cc6e69c748ba96e34f2034f6695870032919df9342998a58d7c9ece79a63f8e6e3a24d964ea596b1f0198700ffd7',
						},
					],
					schema_credit_text: null,
					schema_copyright_notice: null,
					hasCarrier: null,
					schema_abstract: null,
					schemaAlternateName: [],
					bibframe_edition: 'test parent property',
				},
				schemaMaintainer: {
					org_identifier: 'OR-rf5kf25',
					skos_pref_label: 'VRT',
					dcterms_description:
						'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
					ha_org_sector: 'Publieke Omroep',
					ha_org_request_form: null,
					foaf_homepage: 'https://www.vrt.be',
					ha_org_has_logo: 'https://assets.viaa.be/images/OR-rf5kf25',
					hasPreference: [
						{
							ha_pref: 'logo-embedding',
						},
					],
				},
				schema_name: 'Durf te vragen R002 A0001',
				schema_description:
					"Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.",
				schema_creator: [
					{
						productionCompany: ['Roses Are Blue'],
					},
				],
				dcterms_format: 'video',
				dcterms_medium: ['16mm'],
				schema_thumbnail_url:
					'/viaa/VRT/49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
				schema_duration: '00:39:52',
				schema_date_created: '[2020-09-01,)',

				schemaCopyrightHolder: [{ schema_copyright_holder: 'vrt' }],
			},
			schemaInLanguage: {
				schema_in_language: ['nl'],
			},
			schemaKeywords: {
				schema_keywords: ['Belgium', 'Silent Movie', 'amateur recording'],
			},
			intellectualEntity: {
				schema_issue_number: null,
				mhFragmentIdentifier: [
					{
						mh_fragment_identifier:
							'f424cc6e69c748ba96e34f2034f6695870032919df9342998a58d7c9ece79a63f8e6e3a24d964ea596b1f0198700ffd7',
					},
				],
				schema_credit_text: null,
				schema_copyright_notice: null,
				hasCarrier: null,
				schema_abstract: null,
				schemaAlternateName: [],
				bibframe_edition: null,
			},
			schemaMaintainer: {
				org_identifier: 'OR-rf5kf25',
				skos_pref_label: 'VRT',
				dcterms_description:
					'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
				ha_org_sector: 'Publieke Omroep',
				ha_org_request_form: null,
				foaf_homepage: 'https://www.vrt.be',
				hasPreference: [
					{
						ha_pref: OrganisationPreference.logoEmbedding,
					},
					{
						ha_pref: OrganisationPreference.iiifDissemination,
					},
				],
				ha_org_has_logo: 'https://assets.viaa.be/images/OR-rf5kf25',
			},
			schema_name: 'Durf te vragen R002 A0001',
			schema_description:
				"Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.",
			schema_creator: [
				{
					productionCompany: ['Roses Are Blue'],
				},
			],
			dcterms_format: 'video',
			dcterms_medium: ['16mm'],
			schema_thumbnail_url:
				'/viaa/VRT/49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
			schema_duration: '00:39:52',
			schema_date_created: '[2020-09-01,)',
			isRepresentedBy: [
				{
					id: '49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
					schema_name: 'Durf te vragen R002 A0001',
					is_media_fragment_of: '',
					schema_in_language: '',
					schema_start_time: '',
					schema_transcript: '',
					schemaTranscriptUrls: [],
					edm_is_next_in_sequence: '',
					updated_at: '',
					includes: [
						{
							file: {
								id: '49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
								schema_name: 'Durf te vragen R002 A0001',
								ebucore_has_mime_type: 'video/mp4',
								premis_stored_at:
									'https://archief-media.viaa.be/viaa/STADSARCHIEFIEPER/fbdfd287f3774f5d86ca075720c9c97392ff861b60bc478e840a85349baf6661/browse.m4a',
								schema_thumbnail_url:
									'https://archief-media.viaa.be/viaa/STADSARCHIEFIEPER/fbdfd287f3774f5d86ca075720c9c97392ff861b60bc478e840a85349baf6661/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
								schema_duration: 3960,
								edm_is_next_in_sequence: null,
							},
						},
					],
				},
			],
			hasPart: [],
		},
	],
};

const mockRelatedIeObject:
	| GetParentIeObjectQuery['graph_intellectual_entity'][0]['isPartOf']
	| GetChildIeObjectsQuery['graph_intellectual_entity'][0]['hasPart'][0] = {
	id: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
	schema_identifier: '4f1mg9x363',
	schema_name: 'Het annoncenblad van Moll en omliggende dorpen',
	dcterms_available: '2020-08-28T11:48:11',
	schema_date_created: '1911-10-21',
	schema_date_published: '1911-10-21',
	schema_description: 'Het annoncenblad van Moll en omliggende dorpen',
	dctermsFormat: [
		{
			dcterms_format: 'krant',
		},
	],
	schemaDuration: {
		schema_duration: '00:00:00',
	},
	schemaLicense: {
		schema_license: [
			'VIAA-PUBLIEK-METADATA-ALL',
			'VIAA-PUBLIEK-CONTENT',
			'VIAA-INTRA_CP-CONTENT',
			'VIAA-INTRA_CP-METADATA-ALL',
		],
	},
	schemaThumbnail: {
		schema_thumbnail_url: 'https://viaa.be/thumbnail.jpg',
	},
	schemaMaintainer: {
		id: 'https://data-int.hetarchief.be/id/entity/OR-rf5kf25',
		org_identifier: 'OR-rf5kf25',
		skos_pref_label: 'VRT',
		ha_org_sector: 'Publieke Omroep',
		skos_alt_label: 'vrt',
	},
};

export const mockParentIeObject: Readonly<GetParentIeObjectQuery> = {
	graph_intellectual_entity: [
		{
			isPartOf: mockRelatedIeObject,
		},
	],
};

export const mockChildrenIeObjects: Readonly<GetChildIeObjectsQuery> = {
	graph_intellectual_entity: [
		{
			hasPart: [
				{
					...mockRelatedIeObject,
					schema_identifier: mockRelatedIeObject.schema_identifier + '__1',
				},
				{
					...mockRelatedIeObject,
					schema_identifier: mockRelatedIeObject.schema_identifier + '__2',
				},
			],
		},
	],
};

export const mockGqlIeObjectFindByFolderId: FindAllIeObjectsByFolderIdQuery['users_folder_ie'][0] =
	Object.freeze({
		intellectualEntity: {
			schema_identifier: '4f1mg9x363',
			premis_identifier: {
				batch: ['PRD-BD-OR-1v5bc86-2020-10-19-16-20-07-874'],
			},
			schemaMaintainer: {
				org_identifier: 'OR-rf5kf25',
				skos_pref_label: 'Huis van Alijn',
			},
			schema_name: 'Op de boerderij',
			dcterms_format: 'video',
			schema_date_created_lower_bound: '2018-01-01',
			schema_date_published: null,
			schema_is_part_of: [
				{
					collectionType: 'reeks',
					name: 'WEB',
				},
				{
					collectionType: 'archief',
					name: 'digitaal archief/videoproducties',
				},
				{
					collectionType: 'alternatief',
					name: 'videoproductie',
				},
			],
			meemoo_local_id: ['VI-0011-0004'],
			schema_license: [
				'CP-WEBSITE',
				'VIAA-INTRA_CP-CONTENT',
				'VIAA-INTRA_CP-METADATA-ALL',
				'VIAA-ONDERWIJS',
				'VIAA-ONDERZOEK',
				'VIAA-PUBLIEK-METADATA-LTD',
				'BEZOEKERTOOL-CONTENT',
				'BEZOEKERTOOL-METADATA-ALL',
			],
		},
	});

export const mockGqlIeObjectFindByFolderIdResult: Readonly<Partial<IeObject>> = {
	dateCreated: null,
	datePublished: null,
	dctermsFormat: IeObjectType.VIDEO,
	isPartOf: [
		{
			collectionType: 'reeks' as IsPartOfKey,
			name: 'WEB',
		},
		{
			collectionType: 'archief' as IsPartOfKey,
			name: 'digitaal archief/videoproducties',
		},
		{
			collectionType: 'alternatief' as IsPartOfKey,
			name: 'videoproductie',
		},
	],
	maintainerName: 'Huis van Alijn',
	meemooLocalId: 'VI-0011-0004',
	name: 'Op de boerderij',
	schemaIdentifier: '4f1mg9x363',
};

export const mockGqlSitemapObject: FindIeObjectsForSitemapQuery['graph__intellectual_entity'][0] =
	Object.freeze({
		schema_identifier: '4f1mg9x363',
		schema_name: 'Durf te vragen R002 A0001',
		updated_at: '2023-04-13',
		schemaMaintainer: {
			org_identifier: 'OR-rf5kf25',
			skos_pref_label: 'VRT',
		},
	});

export const mockSitemapObject: Readonly<IeObjectsSitemap> = {
	schemaIdentifier: '4f1mg9x363',
	name: 'Durf te vragen R002 A0001',
	updatedAt: '2023-04-13',
	maintainerSlug: 'vrt',
};

export const mockIeObjectWithMetadataSetLtdCsv = `schemaIdentifier;meemooOriginalCp;meemooLocalId;maintainerId;maintainerName;name;dctermsFormat;dctermsMedium.0;duration;dateCreated;datePublished;creator.productionCompany.0;description;genre.0;keywords.0;keywords.1;keywords.2;keywords.3;keywords.4;keywords.5;keywords.6;keywords.7;keywords.8;keywords.9;keywords.10;inLanguage;numberOfPages;abrahamInfo;spatial;temporal;copyrightHolder;isPartOf.0.iri;isPartOf.0.schemaIdentifier;isPartOf.0.collectionType;isPartOf.0.name;isPartOf.1.iri;isPartOf.1.schemaIdentifier;isPartOf.1.collectionType;isPartOf.1.name
8911p09j1g;;;OR-rf5kf25;vrt;Durf te vragen R002 A0001;video;16mm;00:39:52;[2020-09-01];2020-09-01;Roses Are Blue;Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.;program;INTERVIEW;ZIEKTE;GEZONDHEID;ZIEKTE VAN ALZHEIMER;JONGDEMENTIE;THUISVERPLEGING;FIETS;GEHEUGEN;VERGETEN;AGRESSIE;KARAKTERVORMING;;;;;;vrt;https://data-int.hetarchief.be/id/entity/4f1mg9x363;4f1mg9x363;serie;Serie1;https://data-int.hetarchief.be/id/entity/4f1mg9x363;4f1mg9x363;programma;Programma1`;
export const mockIeObjectWithMetadataSetAllWithEssenceCsv = `schemaIdentifier;meemooOriginalCp;meemooLocalId;meemooMediaObjectId;premisIdentifier.0.premisid;maintainerId;maintainerName;name;dctermsFormat;dctermsMedium.0;duration;dateCreated;datePublished;creator.productionCompany.0;description;genre.0;keywords.0;keywords.1;keywords.2;keywords.3;keywords.4;keywords.5;keywords.6;keywords.7;keywords.8;keywords.9;keywords.10;inLanguage;numberOfPages;abrahamInfo;spatial;temporal;copyrightHolder;width;height;synopsis;alternativeTitle;publisher;abstract;ebucoreObjectType;meemooDescriptionCast;isPartOf.0.iri;isPartOf.0.schemaIdentifier;isPartOf.0.collectionType;isPartOf.0.name;isPartOf.1.iri;isPartOf.1.schemaIdentifier;isPartOf.1.collectionType;isPartOf.1.name
8911p09j1g;;;49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c;WP00178829;OR-rf5kf25;vrt;Durf te vragen R002 A0001;video;16mm;00:39:52;[2020-09-01];2020-09-01;Roses Are Blue;Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.;program;INTERVIEW;ZIEKTE;GEZONDHEID;ZIEKTE VAN ALZHEIMER;JONGDEMENTIE;THUISVERPLEGING;FIETS;GEHEUGEN;VERGETEN;AGRESSIE;KARAKTERVORMING;;;;;;vrt;;;;;;"In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie.
Dementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: ""Kan je genezen?"" en ""Heb je al aan euthanasie gedacht?"".
Marleen noemt het een 'klotenziekte' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.

Roger Vanparijs  (66) Marleen Snauwaert (65)
Roger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen.
Roger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.

Paul Goossens  (67) en Katelijne Lefevre (60)
Paul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.
Paul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om.""

Marleen Peperstraete (62) en Dirk Cecabooter (64)
Marleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer.
Naast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen.

Christine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)
Christine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.
Alleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.

John  Buck (44) & Cindy De Buck (46)
John heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.
Cindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.";;;https://data-int.hetarchief.be/id/entity/4f1mg9x363;4f1mg9x363;serie;Serie1;https://data-int.hetarchief.be/id/entity/4f1mg9x363;4f1mg9x363;programma;Programma1`;

export const mockIeObjectWithMetadataSetAllCsv = `schemaIdentifier;meemooOriginalCp;meemooLocalId;meemooMediaObjectId;premisIdentifier.0.premisid;maintainerId;maintainerName;name;dctermsFormat;dctermsMedium.0;duration;dateCreated;datePublished;creator.productionCompany.0;description;genre.0;keywords.0;keywords.1;keywords.2;keywords.3;keywords.4;keywords.5;keywords.6;keywords.7;keywords.8;keywords.9;keywords.10;inLanguage;numberOfPages;abrahamInfo;spatial;temporal;copyrightHolder;width;height;synopsis;alternativeTitle;publisher;abstract;ebucoreObjectType;meemooDescriptionCast;isPartOf.0.iri;isPartOf.0.schemaIdentifier;isPartOf.0.collectionType;isPartOf.0.name;isPartOf.1.iri;isPartOf.1.schemaIdentifier;isPartOf.1.collectionType;isPartOf.1.name
8911p09j1g;;;49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c;WP00178829;OR-zp3w03v;vrt;Durf te vragen R002 A0001;video;16mm;00:39:52;[2020-09-01];2020-09-01;Roses Are Blue;Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.;program;INTERVIEW;ZIEKTE;GEZONDHEID;ZIEKTE VAN ALZHEIMER;JONGDEMENTIE;THUISVERPLEGING;FIETS;GEHEUGEN;VERGETEN;AGRESSIE;KARAKTERVORMING;;;;;;vrt;;;;;;"In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie.
Dementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: ""Kan je genezen?"" en ""Heb je al aan euthanasie gedacht?"".
Marleen noemt het een 'klotenziekte' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.

Roger Vanparijs  (66) Marleen Snauwaert (65)
Roger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen.
Roger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.

Paul Goossens  (67) en Katelijne Lefevre (60)
Paul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.
Paul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om.""

Marleen Peperstraete (62) en Dirk Cecabooter (64)
Marleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer.
Naast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen.

Christine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)
Christine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.
Alleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.

John  Buck (44) & Cindy De Buck (46)
John heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.
Cindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.";;;https://data-int.hetarchief.be/id/entity/4f1mg9x363;4f1mg9x363;serie;Serie1;https://data-int.hetarchief.be/id/entity/4f1mg9x363;4f1mg9x363;programma;Programma1`;
export const mockIeObjectWithMetadataSetLtdXml = `<object>
  <schemaIdentifier>8911p09j1g</schemaIdentifier>
  <meemooOriginalCp/>
  <meemooLocalId/>
  <maintainerId>OR-rf5kf25</maintainerId>
  <maintainerName>vrt</maintainerName>
  <name>Durf te vragen R002 A0001</name>
  <isPartOf>
    <iri>https://data-int.hetarchief.be/id/entity/4f1mg9x363</iri>
    <schemaIdentifier>4f1mg9x363</schemaIdentifier>
    <collectionType>serie</collectionType>
    <name>Serie1</name>
  </isPartOf>
  <isPartOf>
    <iri>https://data-int.hetarchief.be/id/entity/4f1mg9x363</iri>
    <schemaIdentifier>4f1mg9x363</schemaIdentifier>
    <collectionType>programma</collectionType>
    <name>Programma1</name>
  </isPartOf>
  <dctermsFormat>video</dctermsFormat>
  <dctermsMedium>16mm</dctermsMedium>
  <duration>00:39:52</duration>
  <dateCreated>[2020-09-01]</dateCreated>
  <datePublished>2020-09-01</datePublished>
  <creator>
    <productionCompany>Roses Are Blue</productionCompany>
  </creator>
  <description>Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.</description>
  <genre>program</genre>
  <keywords>INTERVIEW</keywords>
  <keywords>ZIEKTE</keywords>
  <keywords>GEZONDHEID</keywords>
  <keywords>ZIEKTE VAN ALZHEIMER</keywords>
  <keywords>JONGDEMENTIE</keywords>
  <keywords>THUISVERPLEGING</keywords>
  <keywords>FIETS</keywords>
  <keywords>GEHEUGEN</keywords>
  <keywords>VERGETEN</keywords>
  <keywords>AGRESSIE</keywords>
  <keywords>KARAKTERVORMING</keywords>
  <inLanguage/>
  <numberOfPages/>
  <abrahamInfo/>
  <spatial/>
  <temporal/>
  <copyrightHolder>vrt</copyrightHolder>
</object>`;

export const mockIeObjectWithMetadataSetAllXml = `<object>
  <schemaIdentifier>8911p09j1g</schemaIdentifier>
  <meemooOriginalCp/>
  <meemooLocalId/>
  <meemooMediaObjectId>49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c</meemooMediaObjectId>
  <premisIdentifier>
    <premisid>WP00178829</premisid>
  </premisIdentifier>
  <maintainerId>OR-zp3w03v</maintainerId>
  <maintainerName>vrt</maintainerName>
  <name>Durf te vragen R002 A0001</name>
  <isPartOf>
    <iri>https://data-int.hetarchief.be/id/entity/4f1mg9x363</iri>
    <schemaIdentifier>4f1mg9x363</schemaIdentifier>
    <collectionType>serie</collectionType>
    <name>Serie1</name>
  </isPartOf>
  <isPartOf>
    <iri>https://data-int.hetarchief.be/id/entity/4f1mg9x363</iri>
    <schemaIdentifier>4f1mg9x363</schemaIdentifier>
    <collectionType>programma</collectionType>
    <name>Programma1</name>
  </isPartOf>
  <dctermsFormat>video</dctermsFormat>
  <dctermsMedium>16mm</dctermsMedium>
  <duration>00:39:52</duration>
  <dateCreated>[2020-09-01]</dateCreated>
  <datePublished>2020-09-01</datePublished>
  <creator>
    <productionCompany>Roses Are Blue</productionCompany>
  </creator>
  <description>Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.</description>
  <genre>program</genre>
  <keywords>INTERVIEW</keywords>
  <keywords>ZIEKTE</keywords>
  <keywords>GEZONDHEID</keywords>
  <keywords>ZIEKTE VAN ALZHEIMER</keywords>
  <keywords>JONGDEMENTIE</keywords>
  <keywords>THUISVERPLEGING</keywords>
  <keywords>FIETS</keywords>
  <keywords>GEHEUGEN</keywords>
  <keywords>VERGETEN</keywords>
  <keywords>AGRESSIE</keywords>
  <keywords>KARAKTERVORMING</keywords>
  <inLanguage/>
  <numberOfPages/>
  <abrahamInfo/>
  <spatial/>
  <temporal/>
  <copyrightHolder>vrt</copyrightHolder>
  <width/>
  <height/>
  <synopsis/>
  <alternativeTitle/>
  <publisher/>
  <abstract>In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie.
Dementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: "Kan je genezen?" en "Heb je al aan euthanasie gedacht?".
Marleen noemt het een 'klotenziekte' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.

Roger Vanparijs  (66) Marleen Snauwaert (65)
Roger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen.
Roger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.

Paul Goossens  (67) en Katelijne Lefevre (60)
Paul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.
Paul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om."

Marleen Peperstraete (62) en Dirk Cecabooter (64)
Marleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer.
Naast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen.

Christine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)
Christine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.
Alleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.

John  Buck (44) &amp; Cindy De Buck (46)
John heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.
Cindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.</abstract>
  <ebucoreObjectType/>
  <meemooDescriptionCast/>
</object>`;

export const mockIeObjectWithMetadataSetAllWithEssenceXml = `<object>
  <schemaIdentifier>8911p09j1g</schemaIdentifier>
  <meemooOriginalCp/>
  <meemooLocalId/>
  <meemooMediaObjectId>49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c</meemooMediaObjectId>
  <premisIdentifier>
    <premisid>WP00178829</premisid>
  </premisIdentifier>
  <maintainerId>OR-rf5kf25</maintainerId>
  <maintainerName>vrt</maintainerName>
  <name>Durf te vragen R002 A0001</name>
  <isPartOf>
    <iri>https://data-int.hetarchief.be/id/entity/4f1mg9x363</iri>
    <schemaIdentifier>4f1mg9x363</schemaIdentifier>
    <collectionType>serie</collectionType>
    <name>Serie1</name>
  </isPartOf>
  <isPartOf>
    <iri>https://data-int.hetarchief.be/id/entity/4f1mg9x363</iri>
    <schemaIdentifier>4f1mg9x363</schemaIdentifier>
    <collectionType>programma</collectionType>
    <name>Programma1</name>
  </isPartOf>
  <dctermsFormat>video</dctermsFormat>
  <dctermsMedium>16mm</dctermsMedium>
  <duration>00:39:52</duration>
  <dateCreated>[2020-09-01]</dateCreated>
  <datePublished>2020-09-01</datePublished>
  <creator>
    <productionCompany>Roses Are Blue</productionCompany>
  </creator>
  <description>Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.</description>
  <genre>program</genre>
  <keywords>INTERVIEW</keywords>
  <keywords>ZIEKTE</keywords>
  <keywords>GEZONDHEID</keywords>
  <keywords>ZIEKTE VAN ALZHEIMER</keywords>
  <keywords>JONGDEMENTIE</keywords>
  <keywords>THUISVERPLEGING</keywords>
  <keywords>FIETS</keywords>
  <keywords>GEHEUGEN</keywords>
  <keywords>VERGETEN</keywords>
  <keywords>AGRESSIE</keywords>
  <keywords>KARAKTERVORMING</keywords>
  <inLanguage/>
  <numberOfPages/>
  <abrahamInfo/>
  <spatial/>
  <temporal/>
  <copyrightHolder>vrt</copyrightHolder>
  <width/>
  <height/>
  <synopsis/>
  <alternativeTitle/>
  <publisher/>
  <abstract>In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie.
Dementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: "Kan je genezen?" en "Heb je al aan euthanasie gedacht?".
Marleen noemt het een 'klotenziekte' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.

Roger Vanparijs  (66) Marleen Snauwaert (65)
Roger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen.
Roger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.

Paul Goossens  (67) en Katelijne Lefevre (60)
Paul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.
Paul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om."

Marleen Peperstraete (62) en Dirk Cecabooter (64)
Marleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer.
Naast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen.

Christine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)
Christine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.
Alleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.

John  Buck (44) &amp; Cindy De Buck (46)
John heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.
Cindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.</abstract>
  <ebucoreObjectType/>
  <meemooDescriptionCast/>
</object>`;
