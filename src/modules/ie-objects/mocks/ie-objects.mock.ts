import {
	type GqlIeObject,
	type IeObject,
	IeObjectAccessThrough,
	IeObjectLicense,
	type IeObjectSector,
	type IeObjectsSitemap,
} from '../ie-objects.types';

import { type GetObjectDetailBySchemaIdentifiersQuery } from '~generated/graphql-db-types-hetarchief';
import { GroupId, GroupName, Permission } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';
import { Locale } from '~shared/types/types';

export const mockIeObject: Readonly<IeObject> = {
	schemaIdentifier:
		'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
	meemooIdentifier: '8911p09j1g',
	premisIdentifier: 'WP00178829',
	premisIsPartOf: null,
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
	actor: null,
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
	dctermsFormat: 'video',
	dctermsMedium: '16mm',
	inLanguage: null,
	thumbnailUrl:
		'/viaa/VRT/49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
	duration: '00:39:52',
	licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD],
	meemooMediaObjectId: '49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c',
	dateCreated: '[2020-09-01]',
	dateCreatedLowerBound: '2020-09-01',
	meemooOriginalCp: null,
	meemooLocalId: null,
	meemoofilmBase: null,
	meemoofilmColor: null,
	ebucoreIsMediaFragmentOf: null,
	ebucoreObjectType: null,
	meemoofilmImageOrSound: null,
	meemooDescriptionProgramme: null,
	meemooDescriptionCast: null,
	representations: [],
	accessThrough: [IeObjectAccessThrough.PUBLIC_INFO],
	isPartOf: {},
};

export const mockIeObjectWithMetadataSetLTD: Readonly<Partial<IeObject>> = {
	meemooOriginalCp: null,
	premisIsPartOf: null,
	meemooIdentifier: '8911p09j1g',
	schemaIdentifier:
		'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
	meemooLocalId: null,
	maintainerId: 'OR-rf5kf25',
	maintainerName: 'vrt',
	maintainerSlug: 'vrt',
	maintainerOverlay: true,
	maintainerLogo: 'https://assets.viaa.be/images/OR-rf5kf25',
	maintainerDescription:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	name: 'Durf te vragen R002 A0001',
	dctermsFormat: 'video',
	dctermsMedium: '16mm',
	duration: '00:39:52',
	dateCreated: '[2020-09-01]',
	datePublished: '2020-09-01',
	dateCreatedLowerBound: '2020-09-01',
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
	meemoofilmBase: null,
	meemoofilmColor: null,
	meemoofilmImageOrSound: null,
	ebucoreIsMediaFragmentOf: null,
	licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD],
	accessThrough: [IeObjectAccessThrough.VISITOR_SPACE_FOLDERS],
	isPartOf: {},
};

export const mockIeObjectWithMetadataSetALL: Readonly<Partial<IeObject>> = {
	meemooOriginalCp: null,
	premisIsPartOf: null,
	meemooIdentifier: '8911p09j1g',
	schemaIdentifier:
		'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
	meemooLocalId: null,
	meemooMediaObjectId: '49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c',
	premisIdentifier: 'WP00178829',
	maintainerId: 'OR-rf5kf25',
	maintainerName: 'vrt',
	maintainerSlug: 'vrt',
	maintainerOverlay: true,
	maintainerLogo: 'https://assets.viaa.be/images/OR-rf5kf25',
	maintainerDescription:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	name: 'Durf te vragen R002 A0001',
	dctermsFormat: 'video',
	dctermsMedium: '16mm',
	ebucoreObjectType: null,
	duration: '00:39:52',
	dateCreated: '[2020-09-01]',
	datePublished: '2020-09-01',
	dateCreatedLowerBound: '2020-09-01',
	creator: { productionCompany: ['Roses Are Blue'] },
	description:
		"Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.",
	abstract:
		'In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie.\nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: "Kan je genezen?" en "Heb je al aan euthanasie gedacht?".\nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen.\nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60)\nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om."\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64)\nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer.\nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen.\n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.\nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) & Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.',
	meemooDescriptionProgramme: null,
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
	meemoofilmBase: null,
	meemoofilmColor: null,
	meemoofilmImageOrSound: null,
	ebucoreIsMediaFragmentOf: null,
	publisher: null,
	licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD, IeObjectLicense.BEZOEKERTOOL_METADATA_ALL],
	accessThrough: [IeObjectAccessThrough.VISITOR_SPACE_FOLDERS],
	isPartOf: {},
};

export const mockIeObjectWithMetadataSetALLWithEssence: Readonly<Partial<IeObject>> = {
	thumbnailUrl:
		'/viaa/VRT/49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
	representations: [],
	meemooOriginalCp: null,
	premisIsPartOf: null,
	meemooIdentifier: '8911p09j1g',
	schemaIdentifier:
		'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
	meemooLocalId: null,
	meemooMediaObjectId: '49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c',
	premisIdentifier: 'WP00178829',
	maintainerId: 'OR-rf5kf25',
	maintainerName: 'vrt',
	maintainerSlug: 'vrt',
	maintainerOverlay: true,
	maintainerLogo: 'https://assets.viaa.be/images/OR-rf5kf25',
	maintainerDescription:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	name: 'Durf te vragen R002 A0001',
	dctermsFormat: 'video',
	dctermsMedium: '16mm',
	ebucoreObjectType: null,
	duration: '00:39:52',
	dateCreated: '[2020-09-01]',
	datePublished: '2020-09-01',
	dateCreatedLowerBound: '2020-09-01',
	creator: { productionCompany: ['Roses Are Blue'] },
	description:
		"Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.",
	abstract:
		'In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie.\nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: "Kan je genezen?" en "Heb je al aan euthanasie gedacht?".\nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen.\nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60)\nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om."\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64)\nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer.\nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen.\n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.\nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) & Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.',
	meemooDescriptionProgramme: null,
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
	meemoofilmBase: null,
	meemoofilmColor: null,
	meemoofilmImageOrSound: null,
	ebucoreIsMediaFragmentOf: null,
	publisher: null,
	licenses: [IeObjectLicense.INTRA_CP_CONTENT],
	accessThrough: [IeObjectAccessThrough.VISITOR_SPACE_FOLDERS],
	isPartOf: {},
};

export const mockIeObjectLimitedInFolder: Readonly<Partial<IeObject>> = {
	accessThrough: [IeObjectAccessThrough.PUBLIC_INFO],
	meemooOriginalCp: null,
	premisIsPartOf: null,
	meemooIdentifier: '8911p09j1g',
	schemaIdentifier:
		'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
	meemooLocalId: null,
	maintainerId: 'OR-rf5kf25',
	maintainerName: 'vrt',
	maintainerSlug: 'vrt',
	maintainerOverlay: true,
	maintainerLogo: 'https://assets.viaa.be/images/OR-rf5kf25',
	maintainerDescription:
		'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
	name: 'Durf te vragen R002 A0001',
	dctermsFormat: 'video',
	dctermsMedium: '16mm',
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
	meemoofilmBase: null,
	meemoofilmColor: null,
	ebucoreIsMediaFragmentOf: null,
	licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD],
	meemoofilmImageOrSound: null,
	dateCreatedLowerBound: '2020-09-01',
	premisIdentifier: null,
	isPartOf: {},
};

export const mockIeObjectDefaultLimitedMetadata: Readonly<Partial<IeObject>> = {
	name: 'Durf te vragen R002 A0001',
	maintainerName: 'vrt',
	maintainerSlug: 'vrt',
	maintainerId: 'OR-rf5kf25',
	dctermsFormat: 'video',
	dateCreatedLowerBound: '2020-09-01',
	datePublished: '2020-09-01',
	meemooIdentifier: '8911p09j1g',
	meemooLocalId: null,
	premisIdentifier: null,
	schemaIdentifier:
		'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
	isPartOf: {},
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

export const mockObjectIe: Readonly<GetObjectDetailBySchemaIdentifiersQuery> = {
	object_ie: [
		{
			schema_identifier:
				'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
			meemoo_identifier: '8911p09j1g',
			premis_identifier: 'WP00178829',
			schema_is_part_of: null,
			schema_copyright_holder: 'vrt',
			schema_copyright_notice:
				'embargo|Geen hergebruik geïsoleerde quotes zonder toestemming productiehuis Roses Are Blue!',
			organisation: {
				schema_identifier: 'OR-rf5kf25',
				schema_name: 'VRT',
				description:
					'De Vlaamse Radio- en Televisieomroeporganisatie, afgekort VRT, is de Nederlandstalige openbare omroep voor radio en televisie in België.',
				haorg_organization_type: 'Publieke Omroep',
				form_url: null,
				homepage_url: 'https://www.vrt.be',
				overlay: true,
				primary_site: {
					address: {
						email: null,
						locality: 'Brussel',
						postal_code: '1043',
						street: 'Auguste Reyerslaan 52',
						telephone: null,
						post_office_box_number: null,
					},
				},
				logo: {
					iri: 'https://assets.viaa.be/images/OR-rf5kf25',
				},
			},
			schema_duration_in_seconds: null,
			schema_number_of_pages: null,
			schema_date_published: '2020-09-01',
			dcterms_available: '2020-08-28T11:48:11',
			schema_name: 'Durf te vragen R002 A0001',
			schema_description:
				"Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.",
			schema_abstract:
				'In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie.\nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: "Kan je genezen?" en "Heb je al aan euthanasie gedacht?".\nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen.\nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60)\nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om."\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64)\nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer.\nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen.\n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.\nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) & Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.',
			schema_creator: {
				productionCompany: ['Roses Are Blue'],
			},
			schema_actor: null,
			schema_publisher: null,
			schema_spatial_coverage: null,
			schema_temporal_coverage: null,
			schema_keywords: [
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
			schema_genre: 'program',
			dcterms_format: 'video',
			dcterms_medium: '16mm',
			schema_in_language: null,
			schema_thumbnail_url:
				'/viaa/VRT/49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c/keyframes-thumb/keyframes_1_1/keyframe1.jpg',
			schema_duration: '00:39:52',
			schema_license: null,
			meemoo_media_object_id:
				'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c',
			schema_date_created: '[2020-09-01,)',
			schema_date_created_lower_bound: '2020-09-01',
			premis_is_represented_by: [
				{
					ie_schema_identifier:
						'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
					schema_name: 'Durf te vragen R002 A0001',
					schema_alternate_name: 'Durf te vragen R002 A0001',
					schema_description: null,
					dcterms_format: 'mp4',
					schema_transcript: null,
					schema_date_created: null,
					premis_includes: [
						{
							schema_name: 'browse.mp4',
							schema_alternate_name: '8911p09j1g.MXF',
							schema_description: null,
							representation_schema_identifier:
								'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793/mp4_vrt',
							ebucore_media_type: 'mp4',
							ebucore_is_media_fragment_of: null,
							schema_embed_url:
								'VRT/49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c/browse.mp4',
							schema_identifier:
								'https://archief-media.viaa.be/viaa/ATV/49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c/browse.mp4',
						},
					],
				},
			],
		},
	],
};

export const mockGqlIeObjectTuples: Readonly<Partial<GqlIeObject>[]> = [
	{
		schema_identifier:
			'73d46f15abae4947912429864ef40472617630b7e5914d82809576457883dbb35d4b0399743941d082aa489c08e2d990',
		meemoo_identifier: 's46h14z19k',
	},
	{
		schema_identifier:
			'be81ec4b7a1f4fa69d8f7e123f9c89bebca89947ed454d5dbf1d919a9b50aef04a8efdbcb4d84807acd99e3003a88cad',
		meemoo_identifier: 'w37kp8850k_001_wav',
	},
	{
		schema_identifier:
			'd1288c82c96747d7bb6bd6260c4e2db14bcad026f9cf4add9376c22a5c06db421985e236d7fb4b839ffcf2fbe88606cf',
		meemoo_identifier: 'x921c4s60t',
	},
	{
		schema_identifier:
			'd1288c82c96747d7bb6bd6260c4e2db14bcad026f9cf4add9376c22a5c06db421985e236d7fb4b839ffc111111111111',
		meemoo_identifier: 'x921c4s60t',
	},
];

export const mockGqlIeObjectFindByCollectionId = Object.freeze({
	ie: {
		schema_identifier:
			'b746a7ef705a4f9c84669d4b29e3452635039793b1614c39b7971ac33cd537136c1a6802bf3d44d3afa24d8aded90107',
		premis_identifier: {
			batch: ['PRD-BD-OR-1v5bc86-2020-10-19-16-20-07-874'],
		},
		maintainer: {
			schema_name: 'Huis van Alijn',
		},
		schema_name: 'Op de boerderij',
		dcterms_format: 'video',
		schema_date_created_lower_bound: '2018-01-01',
		schema_date_published: null,
		schema_is_part_of: {
			reeks: ['WEB'],
			archief: ['digitaal archief/videoproducties'],
			alternatief: ['videoproductie'],
		},
		meemoo_identifier: '4f1mg9x363',
		meemoo_local_id: 'VI-0011-0004',
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

export const mockGqlIeObjectFindByCollectionIdResult: Readonly<Partial<IeObject>> = {
	schemaIdentifier:
		'b746a7ef705a4f9c84669d4b29e3452635039793b1614c39b7971ac33cd537136c1a6802bf3d44d3afa24d8aded90107',
	premisIdentifier: {
		batch: ['PRD-BD-OR-1v5bc86-2020-10-19-16-20-07-874'],
	},
	maintainerName: 'Huis van Alijn',
	name: 'Op de boerderij',
	dctermsFormat: 'video',
	dateCreatedLowerBound: '2018-01-01',
	datePublished: null,
	meemooIdentifier: '4f1mg9x363',
	meemooLocalId: 'VI-0011-0004',
	isPartOf: {
		alternatief: ['videoproductie'],
		archief: ['digitaal archief/videoproducties'],
		reeks: ['WEB'],
	},
};

export const mockGqlSitemapObject = Object.freeze({
	schema_identifier:
		'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
	maintainer: {
		schema_name: 'VRT',
	},
	haorg_alt_label: 'vrt',
	schema_name: 'Durf te vragen R002 A0001',
	updated_at: '2023-04-13',
});

export const mockSitemapObject: Readonly<IeObjectsSitemap> = {
	schemaIdentifier:
		'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
	maintainerSlug: 'vrt',
	name: 'Durf te vragen R002 A0001',
	updatedAt: '2023-04-13',
};

export const mockIeObjectWithMetadataSetLtdCsv =
	"meemooOriginalCp;premisIsPartOf;schemaIdentifier;meemooIdentifier;meemooLocalId;maintainerId;maintainerName;name;duration;dateCreated;datePublished;creator.productionCompany.0;description;genre.0;keywords.0;keywords.1;keywords.2;keywords.3;keywords.4;keywords.5;keywords.6;keywords.7;keywords.8;keywords.9;keywords.10;inLanguage;dctermsMedium;dctermsFormat;meemoofilmColor;meemoofilmBase;meemoofilmImageOrSound;ebucoreIsMediaFragmentOf\n;;49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793;8911p09j1g;;OR-rf5kf25;vrt;Durf te vragen R002 A0001;00:39:52;[2020-09-01];2020-09-01;Roses Are Blue;Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.;program;INTERVIEW;ZIEKTE;GEZONDHEID;ZIEKTE VAN ALZHEIMER;JONGDEMENTIE;THUISVERPLEGING;FIETS;GEHEUGEN;VERGETEN;AGRESSIE;KARAKTERVORMING;;16mm;video;;;;";

export const mockIeObjectWithMetadataSetAllWithEssenceCsv =
	'meemooOriginalCp;premisIsPartOf;schemaIdentifier;meemooIdentifier;meemooLocalId;meemooMediaObjectId;maintainerId;maintainerName;name;ebucoreObjectType;duration;dateCreated;datePublished;creator.productionCompany.0;publisher;description;abstract;meemooDescriptionProgramme;meemooDescriptionCast;genre.0;spatial;temporal;keywords.0;keywords.1;keywords.2;keywords.3;keywords.4;keywords.5;keywords.6;keywords.7;keywords.8;keywords.9;keywords.10;inLanguage;dctermsMedium;dctermsFormat;meemoofilmColor;meemoofilmBase;meemoofilmImageOrSound;ebucoreIsMediaFragmentOf\n;;49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793;8911p09j1g;;49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c;OR-rf5kf25;vrt;Durf te vragen R002 A0001;;00:39:52;[2020-09-01];2020-09-01;Roses Are Blue;;Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema\'s bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.;"In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie.\nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: ""Kan je genezen?"" en ""Heb je al aan euthanasie gedacht?"".\nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen.\nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60)\nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om.""\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64)\nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer.\nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen.\n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.\nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) & Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.";;;program;;;INTERVIEW;ZIEKTE;GEZONDHEID;ZIEKTE VAN ALZHEIMER;JONGDEMENTIE;THUISVERPLEGING;FIETS;GEHEUGEN;VERGETEN;AGRESSIE;KARAKTERVORMING;;16mm;video;;;;';

export const mockIeObjectWithMetadataSetAllCsv =
	'meemooOriginalCp;premisIsPartOf;schemaIdentifier;meemooIdentifier;meemooLocalId;meemooMediaObjectId;maintainerId;maintainerName;name;ebucoreObjectType;duration;dateCreated;datePublished;creator.productionCompany.0;publisher;description;abstract;meemooDescriptionProgramme;meemooDescriptionCast;genre.0;spatial;temporal;keywords.0;keywords.1;keywords.2;keywords.3;keywords.4;keywords.5;keywords.6;keywords.7;keywords.8;keywords.9;keywords.10;inLanguage;dctermsMedium;dctermsFormat;meemoofilmColor;meemoofilmBase;meemoofilmImageOrSound;ebucoreIsMediaFragmentOf\n;;49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793;8911p09j1g;;49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c;OR-rf5kf25;vrt;Durf te vragen R002 A0001;;00:39:52;[2020-09-01];2020-09-01;Roses Are Blue;;Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema\'s bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.;"In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie.\nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: ""Kan je genezen?"" en ""Heb je al aan euthanasie gedacht?"".\nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen.\nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60)\nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om.""\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64)\nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer.\nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen.\n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.\nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) & Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.";;;program;;;INTERVIEW;ZIEKTE;GEZONDHEID;ZIEKTE VAN ALZHEIMER;JONGDEMENTIE;THUISVERPLEGING;FIETS;GEHEUGEN;VERGETEN;AGRESSIE;KARAKTERVORMING;;16mm;video;;;;';

export const mockIeObjectWithMetadataSetLtdXml = `<object>
  <meemooOriginalCp/>
  <premisIsPartOf/>
  <schemaIdentifier>49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793</schemaIdentifier>
  <meemooIdentifier>8911p09j1g</meemooIdentifier>
  <meemooLocalId/>
  <maintainerId>OR-rf5kf25</maintainerId>
  <maintainerName>vrt</maintainerName>
  <name>Durf te vragen R002 A0001</name>
  <isPartOf/>
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
  <dctermsMedium>16mm</dctermsMedium>
  <dctermsFormat>video</dctermsFormat>
  <meemoofilmColor/>
  <meemoofilmBase/>
  <meemoofilmImageOrSound/>
  <ebucoreIsMediaFragmentOf/>
</object>`;

export const mockIeObjectWithMetadataSetAllXml = `<object>
  <meemooOriginalCp/>
  <premisIsPartOf/>
  <schemaIdentifier>49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793</schemaIdentifier>
  <meemooIdentifier>8911p09j1g</meemooIdentifier>
  <meemooLocalId/>
  <meemooMediaObjectId>49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c</meemooMediaObjectId>
  <maintainerId>OR-rf5kf25</maintainerId>
  <maintainerName>vrt</maintainerName>
  <name>Durf te vragen R002 A0001</name>
  <isPartOf/>
  <ebucoreObjectType/>
  <duration>00:39:52</duration>
  <dateCreated>[2020-09-01]</dateCreated>
  <datePublished>2020-09-01</datePublished>
  <creator>
    <productionCompany>Roses Are Blue</productionCompany>
  </creator>
  <publisher/>
  <description>Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.</description>
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
  <meemooDescriptionProgramme/>
  <meemooDescriptionCast/>
  <genre>program</genre>
  <spatial/>
  <temporal/>
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
  <dctermsMedium>16mm</dctermsMedium>
  <dctermsFormat>video</dctermsFormat>
  <meemoofilmColor/>
  <meemoofilmBase/>
  <meemoofilmImageOrSound/>
  <ebucoreIsMediaFragmentOf/>
</object>`;

export const mockIeObjectWithMetadataSetAllWithEssenceXml = `<object>
  <meemooOriginalCp/>
  <premisIsPartOf/>
  <schemaIdentifier>49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793</schemaIdentifier>
  <meemooIdentifier>8911p09j1g</meemooIdentifier>
  <meemooLocalId/>
  <meemooMediaObjectId>49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c</meemooMediaObjectId>
  <maintainerId>OR-rf5kf25</maintainerId>
  <maintainerName>vrt</maintainerName>
  <name>Durf te vragen R002 A0001</name>
  <isPartOf/>
  <ebucoreObjectType/>
  <duration>00:39:52</duration>
  <dateCreated>[2020-09-01]</dateCreated>
  <datePublished>2020-09-01</datePublished>
  <creator>
    <productionCompany>Roses Are Blue</productionCompany>
  </creator>
  <publisher/>
  <description>Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.</description>
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
  <meemooDescriptionProgramme/>
  <meemooDescriptionCast/>
  <genre>program</genre>
  <spatial/>
  <temporal/>
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
  <dctermsMedium>16mm</dctermsMedium>
  <dctermsFormat>video</dctermsFormat>
  <meemoofilmColor/>
  <meemoofilmBase/>
  <meemoofilmImageOrSound/>
  <ebucoreIsMediaFragmentOf/>
</object>`;
