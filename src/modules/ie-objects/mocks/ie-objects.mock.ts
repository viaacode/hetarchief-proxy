import { AvoAuthIdpType, PermissionName } from '@viaa/avo2-types';

import {
	type IeObject,
	IeObjectAccessThrough,
	IeObjectLicense,
	type IeObjectSector,
	IeObjectType,
	type IeObjectsSitemap,
	IsPartOfKey,
} from '../ie-objects.types';

import type {
	FindAllIeObjectsByFolderIdQuery,
	FindIeObjectsForSitemapQuery,
	GetChildIeObjectsQuery,
	GetParentIeObjectQuery,
} from '~generated/graphql-db-types-hetarchief';
import type { IeObjectDetailResponseTypes } from '~modules/ie-objects/services/ie-objects.service.types';
import { GroupId, GroupName } from '~modules/users/types';
import { mockConfigService } from '~shared/test/mock-config-service';
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
		'https://media.viaa.be/play/v2/VLAAMSPARLEMENT/49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
	duration: '00:39:52',
	licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD],
	meemooMediaObjectId: '49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c',
	dateCreated: '[2020-09-01]',
	meemooOriginalCp: null,
	meemooLocalId: null,
	ebucoreObjectType: null,
	meemooDescriptionCast: null,
	pages: [],
	accessThrough: [IeObjectAccessThrough.PUBLIC_INFO],
	isPartOf: [
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: IsPartOfKey.series,
			name: 'Serie1',
		},
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: IsPartOfKey.program,
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
			collectionType: IsPartOfKey.series,
			name: 'Serie1',
		},
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: IsPartOfKey.program,
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
			collectionType: IsPartOfKey.series,
			name: 'Serie1',
		},
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: IsPartOfKey.program,
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
		'https://media.viaa.be/play/v2/VLAAMSPARLEMENT/49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
	pages: [],
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
			collectionType: IsPartOfKey.series,
			name: 'Serie1',
		},
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: IsPartOfKey.program,
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
			collectionType: IsPartOfKey.series,
			name: 'Serie1',
		},
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: IsPartOfKey.program,
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
			collectionType: IsPartOfKey.series,
			name: 'Serie1',
		},
		{
			iri: 'https://data-int.hetarchief.be/id/entity/4f1mg9x363',
			schemaIdentifier: '4f1mg9x363',
			collectionType: IsPartOfKey.program,
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
	idp: AvoAuthIdpType.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: GroupId.CP_ADMIN,
	groupName: GroupName.CP_ADMIN,
	permissions: [PermissionName.EDIT_ANY_CONTENT_PAGES],
	isKeyUser: false,
	isEvaluator: false,
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

export const mockIeObject2: IeObjectDetailResponseTypes = [
	{
		graph_intellectual_entity: [
			{
				schema_identifier: '086350m40w',
				id: 'https://data-int.hetarchief.be/id/entity/086350m40w',
				schema_position: null,
				schema_date_published: null,
				dcterms_available: null,
				schema_name: 'In Dienende liefde (prosessie zuster Agnes Boudry)',
				schema_description: null,
				schema_date_created: 'XXXX-XX-XX',
				ebucore_has_cast_member: null,
				schema_issue_number: null,
				schema_credit_text: null,
				schema_copyright_notice: '© stadsarchiefieper',
				schema_abstract: null,
				bibframe_edition: null,
				ebucore_synopsis: null,
				schema_number_of_pages: null,
				premis_is_part_of: null,
				schemaMaintainer: {
					org_identifier: 'OR-x05xc02',
					skos_pref_label: 'Stadsarchief Ieper',
					ha_org_has_logo: 'https://assets-int.viaa.be/images/OR-x05xc02',
					ha_org_request_form: null,
					dcterms_description:
						'Het stadsarchief Ieper is een regionaal archief dat de documenten van de stad bewaart en ontsluit.',
					ha_org_sector: 'Cultuur',
					foaf_homepage: 'https://archief.ieper.be/',
					skos_alt_label: 'stadsarchief-ieper',
					hasPreference: [],
				},
			},
		],
	},
	{
		dctermsFormat: [
			{
				dcterms_format: 'video',
			},
		],
	},
	{
		isPartOf: [
			{
				isPartOf: {
					schema_identifier: '0000097w0q',
					id: 'https://data-qas.hetarchief.be/id/entity/0000097w0q',
					schema_is_part_of: null,
					schema_duration: null,
					schema_number_of_pages: 4,
					schema_position: null,
					schema_date_published: '1892-09-09',
					dcterms_available: null,
					schema_name: 'Gazet van Antwerpen - 1892-09-09',
					schema_description: null,
					schema_creator: null,
					dcterms_format: 'newspaper',
					dcterms_medium: null,
					schema_thumbnail_url: null,
					schema_license: [
						'BEZOEKERTOOL-CONTENT',
						'BEZOEKERTOOL-METADATA-ALL',
						'VIAA-INTRA_CP-CONTENT',
						'VIAA-PUBLIEK-METADATA-LTD',
						'VIAA-INTRA_CP-METADATA-ALL',
					],
					schema_date_created: '1892-09-09',
					meemoo_local_id: ['gva_18920909'],
					premis_is_part_of: null,
					bibframe_edition: 'test-parent-bibframe_edition',
					schemaMaintainer: {
						org_identifier: 'OR-v97zq9j',
						skos_pref_label: 'Erfgoedbibliotheek Hendrik Conscience',
						skos_alt_label: 'erfgoedbibliotheek-hendrik-conscience',
						ha_org_has_logo: 'https://assets-qas.viaa.be/images/OR-v97zq9j',
						ha_org_request_form: null,
						dcterms_description:
							'Erfgoedbibliotheek Hendrik Conscience is de bibliotheek voor Nederlandse taal, cultuur en geschiedenis van Vlaanderen.',
						ha_org_sector: 'Cultuur',
						foaf_homepage: 'http://www.consciencebibliotheek.be',
						hasPreference: [
							{
								ha_pref: 'visitor-space-publication',
							},
							{
								ha_pref: 'logo-embedding',
							},
						],
					},
					schemaInLanguage: null,
					schemaKeywords: null,
					premisIdentifier: {
						premis_identifier: [
							{
								'MEEMOO-PID': '0000097w0q',
							},
							{
								primary: 'gva_18920909',
							},
						],
					},
					schemaGenre: {
						schema_genre: ['serieel'],
					},
					schemaSpatial: null,
					schemaPublisher: null,
					schemaTemporal: null,
					schemaCopyrightHolder: [],
					intellectualEntity: {
						schema_issue_number: null,
						mhFragmentIdentifier: {
							mh_fragment_identifier:
								'71196954be3341e485bc37d5e56470871d138c7ff08d488cb9b55547ca21689203186ba7317b49bd97b6be0fda420f8a',
						},
						schema_credit_text: null,
						schema_copyright_notice: null,
						hasCarrier: null,
						schema_abstract: null,
						schemaAlternateName: [],
						bibframe_edition: null,
						ebucore_synopsis: null,
					},
				},
			},
		],
	},
	{
		graph_carrier: [],
	},
	{
		meemooLocalId: [
			{
				meemoo_local_id: 'In Dienende liefde (prosessie zuster Agnes Boudry)',
			},
		],
	},
	{
		graph__premis_identifier: [
			{
				premis_identifier: [
					{
						primary: 'In Dienende liefde (prosessie zuster Agnes Boudry)',
					},
				],
			},
		],
	},
	{
		graph_mh_fragment_identifier: [
			{
				mh_fragment_identifier:
					'bcc55c97de9549edaee13c91dd85d18bf71433880466446fbb282d33d9fd8908f25b48f8f9dd434b83805e71e9f97f34',
			},
			{
				mh_fragment_identifier:
					'4d36eff2e9a048eaa34c2fd0b521314aaf5dc6ec0a0c4bf8aaa4922ace27699ee93970627b4a417087518d901e4f5fe7',
			},
			{
				mh_fragment_identifier:
					'e519816f6a454cabb929b74449a6e2203b46e11a872747dfb1b6c87f34dfa8a40696a10062d34207ac4509ddc463e87f',
			},
			{
				mh_fragment_identifier:
					'd9c8e0f36a4c4622b0c6c2aae7b8e3b6acf8ddb2fcd041bd8097488bf507225f6706f2b0507c461bb167ef3f73391ec1',
			},
		],
	},
	{
		parentCollection: [
			{
				collection: {
					id: 'https://data-int.hetarchief.be/id/entity/5bcddeb07498bd246539e22b3fad5e63',
					schema_identifier: null,
					schema_name: 'De Socialistische Gedachte en Aktie',
					collection_type: 'serie',
					isPreceededBy: [],
					isSucceededBy: [],
					schema_location_created: null,
					schema_start_date: null,
					schema_end_date: null,
					schema_publisher: null,
					schema_season_number: null,
				},
			},
		],
	},
	{
		ieObject_schemaAlternateName: [
			{
				schema_alternate_name:
					'Socialistische Gedachte en Aktie50ste verjaring NVSM Uitzending: 7 mei 1963',
			},
		],
	},
	{
		schemaCopyrightHolder: [],
	},
	{
		graph__schema_creator: [],
	},
	{
		graph__schema_duration: [
			{
				schema_duration: '00:26:52.32',
			},
		],
	},
	{
		schemaGenre: [],
	},
	{
		schemaInLanguage: [
			{
				schema_in_language: 'nl',
			},
		],
	},
	{
		graph_schema_is_part_of: [
			{
				type: 'serie',
				collection: {
					schema_name: 'De Socialistische Gedachte en Aktie',
				},
			},
		],
	},
	{
		schemaKeywords: [
			{
				schema_keywords: 'television program',
			},
			{
				schema_keywords: 'reportage',
			},
			{
				schema_keywords: 'Belgium',
			},
			{
				schema_keywords: 'NE',
			},
		],
	},
	{
		schemaLicense: [
			{
				schema_license: 'BEZOEKERTOOL-CONTENT',
			},
			{
				schema_license: 'BEZOEKERTOOL-METADATA-ALL',
			},
			{
				schema_license: 'VIAA-INTRA_CP-CONTENT',
			},
			{
				schema_license: 'VIAA-PUBLIEK-METADATA-LTD',
			},
			{
				schema_license: 'VIAA-INTRA_CP-METADATA-ALL',
			},
		],
	},
	{
		schemaMedium: [],
	},
	{
		schemaPublisher: [],
	},
	{
		schemaSpatial: [],
	},
	{
		schemaTemporal: [],
	},
	{
		schemaThumbnailUrl: [
			{
				schema_thumbnail_url: [
					'https://archief-media.viaa.be/viaa/AMSAB/6218b54a8a85408fa4362b1901c27e0f5c2f51ba5ea247bab7b344dcf4137f04/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
					'https://archief-media.viaa.be/viaa/AMSAB/6218b54a8a85408fa4362b1901c27e0f5c2f51ba5ea247bab7b344dcf4137f04/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
					'https://archief-media.viaa.be/viaa/AMSAB/e9d024007f4b45d09b24be87a1363122a6b600f90ddf4465bb824f7e37fc549f/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
				],
			},
		],
	},
	{
		graph_intellectual_entity: [
			{
				schemaMentions: [],
				isRepresentedBy: [
					{
						id: 'https://data-int.hetarchief.be/id/entity/e453ce2e9f8f7f92c4c2d6c6b62f49a0',
						schema_name:
							"Lageresolutiekopie (mp4): 'In Dienende liefde (prosessie zuster Agnes Boudry)' (043c23ce2f6419dabad1071911e4cc5a)",
						is_media_fragment_of: null,
						schema_in_language: null,
						schema_start_time: null,
						schema_end_time: null,
						schemaTranscriptUrls: null,
						edm_is_next_in_sequence: null,
						updated_at: '2025-03-10T15:24:56.587054+01:00',
						includes: [
							{
								file: {
									id: 'https://data-int.hetarchief.be/id/entity/2f9ec894c0297421552dc247b92d9e6f',
									schema_name: 'browse.mp4',
									ebucore_has_mime_type: 'video/mp4',
									premis_stored_at:
										'https://archief-media.viaa.be/viaa/STADSARCHIEFIEPER/931f2d199c464f5baeedc81b2447c60281a8e3df56654760aeec70b889bd4d76/browse.mp4',
									schema_thumbnail_url:
										'https://archief-media.viaa.be/viaa/STADSARCHIEFIEPER/931f2d199c464f5baeedc81b2447c60281a8e3df56654760aeec70b889bd4d76/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
									schema_duration: 1058.44,
									edm_is_next_in_sequence: null,
									created_at: '2025-03-10T15:24:56.403442+01:00',
								},
							},
							{
								file: {
									id: 'https://data-int.hetarchief.be/id/entity/3e5ba72ad36093682031204902677b40',
									schema_name: 'peak-0.json',
									ebucore_has_mime_type: 'application/json',
									premis_stored_at:
										'https://archief-media.viaa.be/viaa/STADSARCHIEFIEPER/931f2d199c464f5baeedc81b2447c60281a8e3df56654760aeec70b889bd4d76/peak-0.json',
									schema_thumbnail_url: null,
									schema_duration: null,
									edm_is_next_in_sequence: null,
									created_at: '2025-03-10T15:24:56.403442+01:00',
								},
							},
						],
					},
				],
			},
		],
	},
	{
		graph__intellectual_entity: [
			{
				isRepresentedBy: [],
			},
		],
	},
];

export const mockIeObjectEmpty: Readonly<IeObjectDetailResponseTypes> = [
	{
		graph_intellectual_entity: [],
	},
	{
		dctermsFormat: [],
	},
	{
		isPartOf: [],
	},
	{
		graph_carrier: [],
	},
	{
		meemooLocalId: [],
	},
	{
		graph__premis_identifier: [],
	},
	{
		graph_mh_fragment_identifier: [],
	},
	{
		parentCollection: [],
	},
	{
		ieObject_schemaAlternateName: [],
	},
	{
		schemaCopyrightHolder: [],
	},
	{
		graph__schema_creator: [],
	},
	{
		graph__schema_duration: [],
	},
	{
		schemaGenre: [],
	},
	{
		schemaInLanguage: [],
	},
	{
		graph_schema_is_part_of: [],
	},
	{
		schemaKeywords: [],
	},
	{
		schemaLicense: [],
	},
	{
		schemaMedium: [],
	},
	{
		schemaPublisher: [],
	},
	{
		schemaSpatial: [],
	},
	{
		schemaTemporal: [],
	},
	{
		schemaThumbnailUrl: [],
	},
	{
		graph_intellectual_entity: [],
	},
	{
		graph__intellectual_entity: [],
	},
];

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
					schema_identifier: `${mockRelatedIeObject.schema_identifier}__1`,
				},
				{
					...mockRelatedIeObject,
					schema_identifier: `${mockRelatedIeObject.schema_identifier}__2`,
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
			dctermsFormat: [
				{
					dcterms_format: 'video',
				},
			],
			schemaIsPartOf: [
				{
					type: IsPartOfKey.series,
					collection: {
						schema_name: 'WEB',
					},
				},
				{
					type: IsPartOfKey.archive,
					collection: {
						schema_name: 'digitaal archief/videoproducties',
					},
				},
			],
			premisIdentifier: [
				{
					meemoo_local_id: 'VI-0011-0004',
				},
			],
			schemaLicense: {
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
		},
	});

export const mockGqlIeObjectFindByFolderIdResult: Readonly<Partial<IeObject>> = {
	dateCreated: null,
	datePublished: null,
	dctermsFormat: IeObjectType.VIDEO,
	isPartOf: [
		{
			collectionType: IsPartOfKey.series,
			name: 'WEB',
		},
		{
			collectionType: IsPartOfKey.archive,
			name: 'digitaal archief/videoproducties',
		},
	],
	maintainerName: 'Huis van Alijn',
	meemooLocalId: 'VI-0011-0004',
	name: 'Op de boerderij',
	schemaIdentifier: '4f1mg9x363',
};

export const mockGqlSitemapObject: FindIeObjectsForSitemapQuery['graph_intellectual_entity'][0] =
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

export const mockIeObjectWithMetadataSetLtdCsv = `schemaIdentifier;meemooOriginalCp;meemooLocalId;maintainerId;maintainerName;name;dctermsFormat;dctermsMedium.0;duration;dateCreated;datePublished;creator.productionCompany.0;description;keywords.0;keywords.1;keywords.2;keywords.3;keywords.4;keywords.5;keywords.6;keywords.7;keywords.8;keywords.9;keywords.10;inLanguage;numberOfPages;abrahamInfo;spatial;temporal;copyrightHolder;isPartOf.0.iri;isPartOf.0.schemaIdentifier;isPartOf.0.collectionType;isPartOf.0.name;isPartOf.1.iri;isPartOf.1.schemaIdentifier;isPartOf.1.collectionType;isPartOf.1.name
8911p09j1g;;;OR-rf5kf25;vrt;Durf te vragen R002 A0001;video;16mm;00:39:52;[2020-09-01];2020-09-01;Roses Are Blue;Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.;INTERVIEW;ZIEKTE;GEZONDHEID;ZIEKTE VAN ALZHEIMER;JONGDEMENTIE;THUISVERPLEGING;FIETS;GEHEUGEN;VERGETEN;AGRESSIE;KARAKTERVORMING;;;;;;vrt;https://data-int.hetarchief.be/id/entity/4f1mg9x363;4f1mg9x363;series;Serie1;https://data-int.hetarchief.be/id/entity/4f1mg9x363;4f1mg9x363;program;Programma1`;

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
Cindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.";;;https://data-int.hetarchief.be/id/entity/4f1mg9x363;4f1mg9x363;series;Serie1;https://data-int.hetarchief.be/id/entity/4f1mg9x363;4f1mg9x363;program;Programma1`;

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
Cindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.";;;https://data-int.hetarchief.be/id/entity/4f1mg9x363;4f1mg9x363;series;Serie1;https://data-int.hetarchief.be/id/entity/4f1mg9x363;4f1mg9x363;program;Programma1`;

export const mockIeObjectWithMetadataSetLtdXml = `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/">
  <rdf:Description rdf:about="http://dublincore.org/">
    <dc:identifier note="PID">8911p09j1g</dc:identifier>
    <dc:contributor note="Maintainer ID">OR-rf5kf25</dc:contributor>
    <dc:contributor>vrt</dc:contributor>
    <dc:title>Durf te vragen R002 A0001</dc:title>
    <dcterms:isPartOf note="Collection id">https://data-int.hetarchief.be/id/entity/4f1mg9x363</dcterms:isPartOf>
    <dc:format>video</dc:format>
    <dc:format note="Medium">["16mm"]</dc:format>
    <dcterms:extent note="Duration">00:39:52</dcterms:extent>
    <dcterms:created>[2020-09-01]</dcterms:created>
    <dcterms:issued>2020-09-01</dcterms:issued>
    <dc:creator>{"productionCompany":["Roses Are Blue"]}</dc:creator>
    <dc:description>Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.</dc:description>
    <dc:subject>INTERVIEW</dc:subject>
    <dc:subject>ZIEKTE</dc:subject>
    <dc:subject>GEZONDHEID</dc:subject>
    <dc:subject>ZIEKTE VAN ALZHEIMER</dc:subject>
    <dc:subject>JONGDEMENTIE</dc:subject>
    <dc:subject>THUISVERPLEGING</dc:subject>
    <dc:subject>FIETS</dc:subject>
    <dc:subject>GEHEUGEN</dc:subject>
    <dc:subject>VERGETEN</dc:subject>
    <dc:subject>AGRESSIE</dc:subject>
    <dc:subject>KARAKTERVORMING</dc:subject>
    <dc:rights>vrt</dc:rights>
    <dc:identifier note="Permalink">${mockConfigService.get(
			'CLIENT_HOST'
		)}/pid/8911p09j1g</dc:identifier>
  </rdf:Description>
</rdf:RDF>`;

export const mockIeObjectWithMetadataSetAllXml = `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/">
  <rdf:Description rdf:about="http://dublincore.org/">
    <dc:identifier note="PID">8911p09j1g</dc:identifier>
    <dc:identifier note="meemoo media object id">49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c</dc:identifier>
    <dc:identifier note="premis identifier">[{"premisid":"WP00178829"}]</dc:identifier>
    <dc:contributor note="Maintainer ID">OR-zp3w03v</dc:contributor>
    <dc:contributor>vrt</dc:contributor>
    <dc:title>Durf te vragen R002 A0001</dc:title>
    <dcterms:isPartOf note="Collection id">https://data-int.hetarchief.be/id/entity/4f1mg9x363</dcterms:isPartOf>
    <dc:format>video</dc:format>
    <dc:format note="Medium">["16mm"]</dc:format>
    <dcterms:extent note="Duration">00:39:52</dcterms:extent>
    <dcterms:created>[2020-09-01]</dcterms:created>
    <dcterms:issued>2020-09-01</dcterms:issued>
    <dc:creator>{"productionCompany":["Roses Are Blue"]}</dc:creator>
    <dc:description>Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.</dc:description>
    <dc:type>program</dc:type>
    <dc:subject>INTERVIEW</dc:subject>
    <dc:subject>ZIEKTE</dc:subject>
    <dc:subject>GEZONDHEID</dc:subject>
    <dc:subject>ZIEKTE VAN ALZHEIMER</dc:subject>
    <dc:subject>JONGDEMENTIE</dc:subject>
    <dc:subject>THUISVERPLEGING</dc:subject>
    <dc:subject>FIETS</dc:subject>
    <dc:subject>GEHEUGEN</dc:subject>
    <dc:subject>VERGETEN</dc:subject>
    <dc:subject>AGRESSIE</dc:subject>
    <dc:subject>KARAKTERVORMING</dc:subject>
    <dc:rights>vrt</dc:rights>
    <dcterms:abstract>In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie.
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
Cindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.</dcterms:abstract>
    <dc:identifier note="Permalink">${mockConfigService.get(
			'CLIENT_HOST'
		)}/pid/8911p09j1g</dc:identifier>
  </rdf:Description>
</rdf:RDF>`;

export const mockIeObjectWithMetadataSetAllWithEssenceXml = `<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/">
  <rdf:Description rdf:about="http://dublincore.org/">
    <dc:identifier note="PID">8911p09j1g</dc:identifier>
    <dc:identifier note="meemoo media object id">49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c</dc:identifier>
    <dc:identifier note="premis identifier">[{"premisid":"WP00178829"}]</dc:identifier>
    <dc:contributor note="Maintainer ID">OR-rf5kf25</dc:contributor>
    <dc:contributor>vrt</dc:contributor>
    <dc:title>Durf te vragen R002 A0001</dc:title>
    <dcterms:isPartOf note="Collection id">https://data-int.hetarchief.be/id/entity/4f1mg9x363</dcterms:isPartOf>
    <dc:format>video</dc:format>
    <dc:format note="Medium">["16mm"]</dc:format>
    <dcterms:extent note="Duration">00:39:52</dcterms:extent>
    <dcterms:created>[2020-09-01]</dcterms:created>
    <dcterms:issued>2020-09-01</dcterms:issued>
    <dc:creator>{"productionCompany":["Roses Are Blue"]}</dc:creator>
    <dc:description>Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.</dc:description>
    <dc:type>program</dc:type>
    <dc:subject>INTERVIEW</dc:subject>
    <dc:subject>ZIEKTE</dc:subject>
    <dc:subject>GEZONDHEID</dc:subject>
    <dc:subject>ZIEKTE VAN ALZHEIMER</dc:subject>
    <dc:subject>JONGDEMENTIE</dc:subject>
    <dc:subject>THUISVERPLEGING</dc:subject>
    <dc:subject>FIETS</dc:subject>
    <dc:subject>GEHEUGEN</dc:subject>
    <dc:subject>VERGETEN</dc:subject>
    <dc:subject>AGRESSIE</dc:subject>
    <dc:subject>KARAKTERVORMING</dc:subject>
    <dc:rights>vrt</dc:rights>
    <dcterms:abstract>In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie.
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
Cindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.</dcterms:abstract>
    <dc:identifier note="Permalink">${mockConfigService.get(
			'CLIENT_HOST'
		)}/pid/8911p09j1g</dc:identifier>
  </rdf:Description>
</rdf:RDF>`;
