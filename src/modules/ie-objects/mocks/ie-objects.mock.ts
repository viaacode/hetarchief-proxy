import {
	ElasticsearchHit,
	IeObject,
	IeObjectAccessThrough,
	IeObjectLicense,
	IeObjectSector,
} from '../ie-objects.types';

import { GetObjectDetailBySchemaIdentifierQuery } from '~generated/graphql-db-types-hetarchief';
import { GroupId, GroupName, Permission } from '~modules/users/types';
import { Idp } from '~shared/auth/auth.types';

export const mockIeObject: IeObject = {
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
	maintainerLogo: 'https://assets.viaa.be/images/OR-rf5kf25',
	durationInSeconds: null,
	numberOfPages: null,
	datePublished: '2020-09-01',
	dctermsAvailable: '2020-08-28T11:48:11',
	name: 'Durf te vragen R002 A0001',
	description:
		"Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.",
	abstract:
		'In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie. \nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: "Kan je genezen?" en "Heb je al aan euthanasie gedacht?". \nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen. \nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60) \nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om."\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64) \nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer. \nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen. \n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.  \nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) & Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.',
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
	series: null,
	programs: null,
	alternativeName: null,
	meemoofilmBase: null,
	meemoofilmColor: null,
	ebucoreIsMediaFragmentOf: null,
	ebucoreObjectType: null,
	meemoofilmImageOrSound: null,
	meemooDescriptionProgramme: null,
	meemooDescriptionCast: null,
	representations: [],
	accessThrough: [IeObjectAccessThrough.PUBLIC_INFO],
};

export const mockIeObjectWithMetadataSetLTD: Partial<IeObject> = {
	meemooOriginalCp: null,
	premisIsPartOf: null,
	meemooIdentifier: '8911p09j1g',
	schemaIdentifier:
		'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
	meemooLocalId: null,
	maintainerId: 'OR-rf5kf25',
	maintainerName: 'vrt',
	maintainerSlug: 'vrt',
	maintainerLogo: 'https://assets.viaa.be/images/OR-rf5kf25',
	name: 'Durf te vragen R002 A0001',
	series: null,
	programs: null,
	alternativeName: null,
	dctermsFormat: 'video',
	dctermsMedium: '16mm',
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
	meemoofilmBase: null,
	meemoofilmColor: null,
	meemoofilmImageOrSound: null,
	ebucoreIsMediaFragmentOf: null,
	licenses: [IeObjectLicense.PUBLIEK_METADATA_LTD],
	accessThrough: [IeObjectAccessThrough.VISITOR_SPACE_FOLDERS],
};

export const mockIeObjectWithMetadataSetALL: Partial<IeObject> = {
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
	maintainerLogo: 'https://assets.viaa.be/images/OR-rf5kf25',
	name: 'Durf te vragen R002 A0001',
	series: null,
	programs: null,
	alternativeName: null,
	dctermsFormat: 'video',
	dctermsMedium: '16mm',
	ebucoreObjectType: null,
	duration: '00:39:52',
	dateCreated: '[2020-09-01]',
	datePublished: '2020-09-01',
	creator: { productionCompany: ['Roses Are Blue'] },
	description:
		"Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.",
	abstract:
		'In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie. \nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: "Kan je genezen?" en "Heb je al aan euthanasie gedacht?". \nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen. \nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60) \nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om."\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64) \nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer. \nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen. \n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.  \nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) & Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.',
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
};

export const mockIeObjectWithMetadataSetALLWithEssence: Partial<IeObject> = {
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
	maintainerLogo: 'https://assets.viaa.be/images/OR-rf5kf25',
	name: 'Durf te vragen R002 A0001',
	series: null,
	programs: null,
	alternativeName: null,
	dctermsFormat: 'video',
	dctermsMedium: '16mm',
	ebucoreObjectType: null,
	duration: '00:39:52',
	dateCreated: '[2020-09-01]',
	datePublished: '2020-09-01',
	creator: { productionCompany: ['Roses Are Blue'] },
	description:
		"Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.",
	abstract:
		'In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie. \nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: "Kan je genezen?" en "Heb je al aan euthanasie gedacht?". \nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen. \nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60) \nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om."\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64) \nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer. \nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen. \n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.  \nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) & Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.',
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
};

export const mockIeObjectLimitedInFolder: Partial<IeObject> = {
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
	maintainerLogo: 'https://assets.viaa.be/images/OR-rf5kf25',
	name: 'Durf te vragen R002 A0001',
	series: [],
	programs: [],
	alternativeName: null,
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
};

export const mockIeObjectDefaultLimitedMetadata: Partial<IeObject> = {
	name: 'Durf te vragen R002 A0001',
	maintainerName: 'vrt',
	maintainerId: 'OR-rf5kf25',
	series: [],
	dctermsFormat: 'video',
	dateCreatedLowerBound: '2020-09-01',
	datePublished: '2020-09-01',
	meemooIdentifier: '8911p09j1g',
	meemooLocalId: null,
	premisIdentifier: null,
	schemaIdentifier:
		'49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793',
	programs: [],
};

export const mockUser = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: GroupId.CP_ADMIN,
	groupName: GroupName.CP_ADMIN,
	permissions: [Permission.EDIT_ANY_CONTENT_PAGES],
	isKeyUser: false,
};

export const mockUserInfo: {
	userId: string | null;
	isKeyUser: boolean;
	sector: IeObjectSector | null;
	groupId: string;
	maintainerId: string;
	accessibleObjectIdsThroughFolders: string[];
	accessibleVisitorSpaceIds: string[];
} = {
	userId: '2ca2fcad-0ef1-4b0c-ad14-ea83984161c9',
	isKeyUser: false,
	sector: null,
	groupId: GroupId.VISITOR,
	maintainerId: 'OR-rf5kf25',
	accessibleObjectIdsThroughFolders: [],
	accessibleVisitorSpaceIds: ['OR-rf5kf25'],
};

export const mockElasticObject1: ElasticsearchHit = {
	_index: 'or-rf5kf25-2022-05-10t10.01.40.838',
	_type: '_doc',
	_id: '0284a378c235465b8b547622ecbffe8c76a2519241404cefb7a32339c84287b1f43c5688027647db866ff210addf29e9',
	_score: 0,
	_source: {
		ebucore_object_type: 'footage',
		schema_in_language: [],
		dcterms_available: '2020-06-19T16:35:51',
		meemoo_identifier: 'qsd50fvh8k',
		schema_creator: null,
		schema_identifier:
			'0284a378c235465b8b547622ecbffe8c76a2519241404cefb7a32339c84287b1f43c5688027647db866ff210addf29e9',
		schema_description:
			"Une centaine de policiers poussent \"un cri contre la stigmatisation\" à Charleroi\n\nCHARLEROI 19/06 (BELGA)\nUne centaine de policiers se sont réunis vendredi sur le coup de 12H00 devant la tour de police de Charleroi pour pousser \"un cri contre la stigmatisation.\" Les policiers ont jeté leurs menottes au sol en signe de protestation contre le bashing médiatique et les réponses politiques lors des violences policières.\nLes policiers de la zone de police de Charleroi ont protesté vendredi à 12H00 sur l'esplanade de la tour de police à Charleroi. Ces derniers protestent contre le bashing médiatique et les réponses politiques qui font des violences policières non pas des comportements déviants isolés mais la règle, ce qui jette le discrédit et l'opprobre sur l'ensemble de la profession. Sur le coup de 12H00, la centaine de policiers réunis ont jeté leurs menottes au sol, en signe de protestation.\nSi la mort de George Floyd aux États-Unis a soulevé une vague de protestation populaire contre les violences policières alimentées par le racisme, les policiers belges veulent faire valoir que les abus de pouvoir ne sont pas légion et que beaucoup ont fait ce métier pour protéger la population et non pour jouir d'un rôle d'autorité. \"Il faut savoir que la politique policière est totalement différente aux États-Unis qu'en Belgique. Il faut que les gens comprennent également que le sentiment d'impunité n'est pas présent au sein de la police\", a confié un policier.\nLes médias ont également un important rôle à jouer. \"Ils se doivent de diffuser une information objective et replacer celle-ci dans les bonnes proportions. C'est le cas, par exemple, lorsqu'on diffuse des vidéos. Il faut montrer toute la scène et non pas une partie des faits, ce qui fausse la réalité des faits.\"\nDes actions similaires ont lieu un peu partout dans le pays, notamment à Bruxelles et Liège.\nBelga context\nRelated picture(s)\nView full context on BelgaBox (link: http://m.belga.be?m=algapgom)\nCOR 656/GFR\n191434 Jun 20\nBRIEF/DIVERS/HAINAUT/POLICE/SOCIETE",
		schema_publisher: {
			Distributeur: ['belga'],
		},
		schema_duration: '00:00:22',
		dcterms_medium: null,
		premis_is_part_of: null,
		schema_abstract: null,
		premis_identifier: {
			MEDIA_ID: ['AIM10053310'],
		},
		schema_keywords: [],
		schema_is_part_of: {
			serie: ['Belga'],
		},
		schema_genre: [],
		schema_date_published: '2020-06-19',
		schema_license: ['BEZOEKERTOOL-CONTENT', 'BEZOEKERTOOL-METADATA-ALL'],
		schema_date_created: '2020-06-19',
		schema_maintainer: {
			schema_identifier: 'OR-rf5kf25',
			schema_name: 'VRT',
			alt_label: 'vrt',
			organization_type: IeObjectSector.CULTURE,
		},
		schema_thumbnail_url:
			'https://media-qas.viaa.be/play/v2/VRT/0284a378c235465b8b547622ecbffe8c76a2519241404cefb7a32339c84287b1/keyframes/keyframes_1_1/keyframe1.jpg?token=eyJraWQiOiIwMDAyIiwiYWxnIjoiSFMyNTYifQ.eyJhdWQiOiJPUi0qIiwiZXhwIjoxNjUyNzA1MjA3LCJzdWIiOiJURVNUQkVFTEQva2V5ZnJhbWVzX2FsbCIsImlwIjoiIiwicmVmZXJlciI6Imh0dHBzOi8vYmV6b2VrLXFhcy5oZXRhcmNoaWVmLmJlLyIsImZyYWdtZW50IjpbXX0.6ywQhi3Tjss0Up_JJo0auZ359VlsAZftwLsrd1YFjU0',
		dcterms_format: 'video',
		schema_name:
			'Une centaine de policiers poussent "un cri contre la stigmatisation" à Charleroi',
		meemoo_description_cast: '',
		meemoo_description_programme: '',
		schema_spatial_coverage: '',
		schema_temporal_coverage: '',
		schema_copyrightholder: '',
		duration_seconds: 3,
		schema_number_of_pages: 3,
		meemoofilm_color: true,
		meemoofilm_base: '',
		meemoofilm_image_or_sound: '',
		meemoofilm_contains_embedded_caption: false,
		meemoo_local_id: '',
		meemoo_original_cp: '',
		schema_alternate_name: '',
		schema_contributor: {},
	},
};

export const mockElasticObject2: ElasticsearchHit = {
	_index: 'or-rf5kf25-2022-05-10t10.01.40.838',
	_type: '_doc',
	_id: '030460fb53684214a972e1b8ae35736d535c2b2f9c424b5693450ad0db5728e245c5cb0fe7e148128288006474a1a6a4',
	_score: 0,
	_source: {
		ebucore_object_type: 'footage',
		schema_in_language: [],
		dcterms_available: '2021-02-11T11:29:02',
		meemoo_identifier: 'qs4746qt93',
		schema_creator: null,
		schema_identifier:
			'030460fb53684214a972e1b8ae35736d535c2b2f9c424b5693450ad0db5728e245c5cb0fe7e148128288006474a1a6a4',
		schema_description:
			"STVV: Daniel Schmidt, Jonathan Buatu, Maximiliano Caufriez, Pol García, Ibrahima Sankhon, Samuel Asamoah, Duckens Nazon (63' Facundo Colidio), Steve de Ridder, Liberato Cacace, Olexander Filippov (85' Lee Seung-Woo), Yuma Suzuki (70' Tatsuya Ito).\nTrainer: Kevin Muscat\n\nStandard: Arnaud Bodart, Laurent Jans, Merveille Bokadi, Zinho Vanheusden, Nicolas Gavory, Eddy Sylvestre (54' Aleksandar Boljevic), Gojko Cimirot, Selim Amallah, Samuel Bastien, Duje Cop (68' Obbi Oulare), Jackson Muleka (71' Mehdi Carcela-González).\nTrainer: Philippe Montanier\n\nScheidsrechter: Kevin Van Damme\n\n1-0 Duckens Nazon (37')\n2-0 Steve de Ridder (73')",
		schema_publisher: {
			Distributeur: ['Depot'],
		},
		schema_duration: '00:02:52',
		dcterms_medium: null,
		premis_is_part_of: null,
		schema_abstract: null,
		premis_identifier: {
			MEDIA_ID: ['AIM10072170'],
		},
		schema_keywords: [],
		schema_is_part_of: {
			serie: ['Alleen Elvis'],
		},
		schema_genre: [],
		schema_date_published: '2020-02-10',
		schema_license: ['BEZOEKERTOOL-CONTENT', 'BEZOEKERTOOL-METADATA-ALL'],
		schema_date_created: '2020-02-10',
		schema_maintainer: {
			schema_identifier: 'OR-rf5kf25',
			schema_name: 'VRT',
			alt_label: 'vrt',
			organization_type: IeObjectSector.CULTURE,
		},
		schema_thumbnail_url:
			'https://media-qas.viaa.be/play/v2/VRT/030460fb53684214a972e1b8ae35736d535c2b2f9c424b5693450ad0db5728e2/keyframes/keyframes_1_1/keyframe1.jpg?token=eyJraWQiOiIwMDAyIiwiYWxnIjoiSFMyNTYifQ.eyJhdWQiOiJPUi0qIiwiZXhwIjoxNjUyNzA1MjA3LCJzdWIiOiJURVNUQkVFTEQva2V5ZnJhbWVzX2FsbCIsImlwIjoiIiwicmVmZXJlciI6Imh0dHBzOi8vYmV6b2VrLXFhcy5oZXRhcmNoaWVmLmJlLyIsImZyYWdtZW50IjpbXX0.6ywQhi3Tjss0Up_JJo0auZ359VlsAZftwLsrd1YFjU0',
		dcterms_format: 'video',
		schema_name: 'E2E VideoDelivery from Arvato',
		meemoo_description_cast: '',
		meemoo_description_programme: '',
		schema_spatial_coverage: '',
		schema_temporal_coverage: '',
		schema_copyrightholder: '',
		duration_seconds: 3,
		schema_number_of_pages: 3,
		meemoofilm_color: true,
		meemoofilm_base: '',
		meemoofilm_image_or_sound: '',
		meemoofilm_contains_embedded_caption: false,
		meemoo_local_id: '',
		meemoo_original_cp: '',
		schema_alternate_name: '',
		schema_contributor: {},
	},
};

export const mockObjectIe: GetObjectDetailBySchemaIdentifierQuery = {
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
			maintainer: {
				schema_identifier: 'OR-rf5kf25',
				information: {
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
			},
			schema_duration_in_seconds: null,
			schema_number_of_pages: null,
			schema_date_published: '2020-09-01',
			dcterms_available: '2020-08-28T11:48:11',
			schema_name: 'Durf te vragen R002 A0001',
			schema_description:
				"Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.",
			schema_abstract:
				'In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie. \nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: "Kan je genezen?" en "Heb je al aan euthanasie gedacht?". \nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen. \nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60) \nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om."\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64) \nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer. \nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen. \n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.  \nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) & Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.',
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
						},
					],
				},
			],
		},
	],
};

export const mockIeObjectWithMetadataSetLtdCsv =
	"meemooOriginalCp;premisIsPartOf;schemaIdentifier;meemooIdentifier;meemooLocalId;maintainerId;maintainerName;name;series;programs;alternativeName;duration;dateCreated;datePublished;creator.productionCompany.0;description;genre.0;keywords.0;keywords.1;keywords.2;keywords.3;keywords.4;keywords.5;keywords.6;keywords.7;keywords.8;keywords.9;keywords.10;inLanguage;dctermsMedium;dctermsFormat;meemoofilmColor;meemoofilmBase;meemoofilmImageOrSound;ebucoreIsMediaFragmentOf\r\n;;49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793;8911p09j1g;;OR-rf5kf25;vrt;Durf te vragen R002 A0001;;;;00:39:52;[2020-09-01];2020-09-01;Roses Are Blue;Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.;program;INTERVIEW;ZIEKTE;GEZONDHEID;ZIEKTE VAN ALZHEIMER;JONGDEMENTIE;THUISVERPLEGING;FIETS;GEHEUGEN;VERGETEN;AGRESSIE;KARAKTERVORMING;;16mm;video;;;;";

export const mockIeObjectWithMetadataSetAllCsv =
	'meemooOriginalCp;premisIsPartOf;schemaIdentifier;meemooIdentifier;meemooLocalId;meemooMediaObjectId;maintainerId;maintainerName;name;series;programs;alternativeName;ebucoreObjectType;duration;dateCreated;datePublished;creator.productionCompany.0;publisher;description;abstract;meemooDescriptionProgramme;meemooDescriptionCast;genre.0;spatial;temporal;keywords.0;keywords.1;keywords.2;keywords.3;keywords.4;keywords.5;keywords.6;keywords.7;keywords.8;keywords.9;keywords.10;inLanguage;dctermsMedium;dctermsFormat;meemoofilmColor;meemoofilmBase;meemoofilmImageOrSound;ebucoreIsMediaFragmentOf\r\n;;49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793;8911p09j1g;;49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c;OR-rf5kf25;vrt;Durf te vragen R002 A0001;;;;;00:39:52;[2020-09-01];2020-09-01;Roses Are Blue;;Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema\'s bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.;"In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie. \nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: ""Kan je genezen?"" en ""Heb je al aan euthanasie gedacht?"". \nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen. \nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60) \nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om.""\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64) \nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer. \nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen. \n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.  \nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) & Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.";;;program;;;INTERVIEW;ZIEKTE;GEZONDHEID;ZIEKTE VAN ALZHEIMER;JONGDEMENTIE;THUISVERPLEGING;FIETS;GEHEUGEN;VERGETEN;AGRESSIE;KARAKTERVORMING;;16mm;video;;;;';

export const mockIeObjectWithMetadataSetAllWithEssenceCsv =
	'meemooOriginalCp;premisIsPartOf;schemaIdentifier;meemooIdentifier;meemooLocalId;meemooMediaObjectId;maintainerId;maintainerName;name;series;programs;alternativeName;ebucoreObjectType;duration;dateCreated;datePublished;creator.productionCompany.0;publisher;description;abstract;meemooDescriptionProgramme;meemooDescriptionCast;genre.0;spatial;temporal;keywords.0;keywords.1;keywords.2;keywords.3;keywords.4;keywords.5;keywords.6;keywords.7;keywords.8;keywords.9;keywords.10;inLanguage;dctermsMedium;dctermsFormat;meemoofilmColor;meemoofilmBase;meemoofilmImageOrSound;ebucoreIsMediaFragmentOf\r\n;;49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793;8911p09j1g;;49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c;OR-rf5kf25;vrt;Durf te vragen R002 A0001;;;;;00:39:52;[2020-09-01];2020-09-01;Roses Are Blue;;Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema\'s bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.;"In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie. \nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: ""Kan je genezen?"" en ""Heb je al aan euthanasie gedacht?"". \nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen. \nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60) \nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om.""\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64) \nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer. \nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen. \n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.  \nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) & Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.";;;program;;;INTERVIEW;ZIEKTE;GEZONDHEID;ZIEKTE VAN ALZHEIMER;JONGDEMENTIE;THUISVERPLEGING;FIETS;GEHEUGEN;VERGETEN;AGRESSIE;KARAKTERVORMING;;16mm;video;;;;';

export const mockIeObjectWithMetadataSetLtdXml =
	"<object>\n  <meemooOriginalCp/>\n  <premisIsPartOf/>\n  <schemaIdentifier>49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793</schemaIdentifier>\n  <meemooIdentifier>8911p09j1g</meemooIdentifier>\n  <meemooLocalId/>\n  <maintainerId>OR-rf5kf25</maintainerId>\n  <maintainerName>vrt</maintainerName>\n  <name>Durf te vragen R002 A0001</name>\n  <series/>\n  <programs/>\n  <alternativeName/>\n  <duration>00:39:52</duration>\n  <dateCreated>[2020-09-01]</dateCreated>\n  <datePublished>2020-09-01</datePublished>\n  <creator>\n    <productionCompany>Roses Are Blue</productionCompany>\n  </creator>\n  <description>Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema's bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.</description>\n  <genre>program</genre>\n  <keywords>INTERVIEW</keywords>\n  <keywords>ZIEKTE</keywords>\n  <keywords>GEZONDHEID</keywords>\n  <keywords>ZIEKTE VAN ALZHEIMER</keywords>\n  <keywords>JONGDEMENTIE</keywords>\n  <keywords>THUISVERPLEGING</keywords>\n  <keywords>FIETS</keywords>\n  <keywords>GEHEUGEN</keywords>\n  <keywords>VERGETEN</keywords>\n  <keywords>AGRESSIE</keywords>\n  <keywords>KARAKTERVORMING</keywords>\n  <inLanguage/>\n  <dctermsMedium>16mm</dctermsMedium>\n  <dctermsFormat>video</dctermsFormat>\n  <meemoofilmColor/>\n  <meemoofilmBase/>\n  <meemoofilmImageOrSound/>\n  <ebucoreIsMediaFragmentOf/>\n</object>";

export const mockIeObjectWithMetadataSetAllXml =
	'<object>\n  <meemooOriginalCp/>\n  <premisIsPartOf/>\n  <schemaIdentifier>49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793</schemaIdentifier>\n  <meemooIdentifier>8911p09j1g</meemooIdentifier>\n  <meemooLocalId/>\n  <meemooMediaObjectId>49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c</meemooMediaObjectId>\n  <maintainerId>OR-rf5kf25</maintainerId>\n  <maintainerName>vrt</maintainerName>\n  <name>Durf te vragen R002 A0001</name>\n  <series/>\n  <programs/>\n  <alternativeName/>\n  <ebucoreObjectType/>\n  <duration>00:39:52</duration>\n  <dateCreated>[2020-09-01]</dateCreated>\n  <datePublished>2020-09-01</datePublished>\n  <creator>\n    <productionCompany>Roses Are Blue</productionCompany>\n  </creator>\n  <publisher/>\n  <description>Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema\'s bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.</description>\n  <abstract>In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie. \nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: "Kan je genezen?" en "Heb je al aan euthanasie gedacht?". \nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen. \nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60) \nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om."\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64) \nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer. \nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen. \n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.  \nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) &amp; Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.</abstract>\n  <meemooDescriptionProgramme/>\n  <meemooDescriptionCast/>\n  <genre>program</genre>\n  <spatial/>\n  <temporal/>\n  <keywords>INTERVIEW</keywords>\n  <keywords>ZIEKTE</keywords>\n  <keywords>GEZONDHEID</keywords>\n  <keywords>ZIEKTE VAN ALZHEIMER</keywords>\n  <keywords>JONGDEMENTIE</keywords>\n  <keywords>THUISVERPLEGING</keywords>\n  <keywords>FIETS</keywords>\n  <keywords>GEHEUGEN</keywords>\n  <keywords>VERGETEN</keywords>\n  <keywords>AGRESSIE</keywords>\n  <keywords>KARAKTERVORMING</keywords>\n  <inLanguage/>\n  <dctermsMedium>16mm</dctermsMedium>\n  <dctermsFormat>video</dctermsFormat>\n  <meemoofilmColor/>\n  <meemoofilmBase/>\n  <meemoofilmImageOrSound/>\n  <ebucoreIsMediaFragmentOf/>\n</object>';

export const mockIeObjectWithMetadataSetAllWithEssenceXml =
	'<object>\n  <meemooOriginalCp/>\n  <premisIsPartOf/>\n  <schemaIdentifier>49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c7bee152896204294938534fc7f3c6793</schemaIdentifier>\n  <meemooIdentifier>8911p09j1g</meemooIdentifier>\n  <meemooLocalId/>\n  <meemooMediaObjectId>49b1bf8894004fd49aeaba36cfc5a958d5c32a4566244999a862e80b498a2c7c</meemooMediaObjectId>\n  <maintainerId>OR-rf5kf25</maintainerId>\n  <maintainerName>vrt</maintainerName>\n  <name>Durf te vragen R002 A0001</name>\n  <series/>\n  <programs/>\n  <alternativeName/>\n  <ebucoreObjectType/>\n  <duration>00:39:52</duration>\n  <dateCreated>[2020-09-01]</dateCreated>\n  <datePublished>2020-09-01</datePublished>\n  <creator>\n    <productionCompany>Roses Are Blue</productionCompany>\n  </creator>\n  <publisher/>\n  <description>Humaninterestprogramma waarin Siska Schoeters op een openhartige manier gevoelige thema\'s bespreekbaar maakt. Elke aflevering nodigt zij een groep mensen uit waar we stiekem heel veel vragen over hebben, maar die we niet zelf in hun gezicht durven stellen.</description>\n  <abstract>In Vlaanderen leven ongeveer 1800 mensen met de diagnose van jongdementie. \nDementie is meer dan vergeten alleen. Dat zeggen Christine, Roger, Marleen, John en Paul. Samen met hun mantelzorger antwoorden ze op vragen als: "Kan je genezen?" en "Heb je al aan euthanasie gedacht?". \nMarleen noemt het een \'klotenziekte\' maar toch blijft ze positief en wil ze nog zoveel mogelijk van het leven genieten. Dat ondervindt Siska in een fietstocht die het Ventiel, een vrijwilligersorganisatie voor mensen met jongdementie, organiseert.\n\nRoger Vanparijs  (66) Marleen Snauwaert (65)\nRoger kreeg in 2007 de diagnose van frontotemporale jongdementie. Op de hersenscan zagen de artsen dat het rechterdeel vooraan in de hersenen helemaal zwart geworden was en eigenlijk afgestorven was. Volgens zijn vrouw, Marleen is zijn karakter ook heel erg veranderd. Ook dat is een typisch verschijnsel van frontotemporale jongdementie. Roger is verbaal ook heel agressief en kan snel uitvliegen. \nRoger was werfleider bij ruwbouwprojecten. Maar op een bepaald moment begon hij fouten te maken in de job. Ook leren werken met Excel lukte niet. Omdat hij niet begreep wat er aan de hand was, zakte hij weg in een depressie. Na vijf lange jaren zoeken wat er aan de hand was, ontdekte een neuroloog dat het een vorm van jongdementie was.\n\nPaul Goossens  (67) en Katelijne Lefevre (60) \nPaul kreeg vier jaar geleden een diagnose van parkinson. Niet veel later zei de neuroloog dat hij ook alzheimer had. Paul vindt het heel belangrijk om te praten over alzheimer. Volgens hem denken de meeste mensen dat je, eens je de diagnose gekregen hebt, niks meer kan en je een oud persoon bent die gewoon in een zetel zit en een plantje is. Het is voor Paul heel belangrijk om te ontkrachten.\nPaul moest kiezen tussen medicatie voor parkinson of voor alzheimer, omdat die elkaar kunnen beïnvloeden. Hij heeft gekozen voor de remmers voor alzheimer. “Ik wil liever mijn hersenen langer houden. Met fysische beperkingen kan ik beter om."\n\nMarleen Peperstraete (62) en Dirk Cecabooter (64) \nMarleen heeft de diagnose van alzheimer gekregen toen ze 57 jaar was. Eerst dachten de artsen dat ze een depressie had. Ze maakte fouten op haar werk, en niet veel later is ze volledig gestopt met werken. Na vele onderzoeken kreeg ze de diagnose Alzheimer. \nNaast het feit dat Marleen veel zaken vergeet, is het meest uitgesproken symptoom van de ziekte bij haar dat ze geen dieptezicht meer heeft. Ze kan dus maar heel moeilijk schrijven, haar schoenen aandoen, wandelen... Het is heel duidelijk dat Marleen en Dirk elkaar graag zien. Dirk is gestopt met werken om zijn vrouw te kunnen verzorgen. Marleen vergeet heel veel, maar het gsm-nummer van Dirk kan ze nog zo uit het hoofd opzeggen. \n\nChristine Pluymers  (70) en Jean-Pierre Vanden Waeyenberg (65)\nChristine kreeg 3 jaar geleden de diagnose van alzheimer. Maar de ziekte sluimerde al langer, daarom kreeg ze nog de diagnose van jongdementie. Voor Christine is het moeilijk om te weten welke dag het is. Ook het uur lezen is heel moeilijk geworden. Het moeilijkste voor Christine is ontdekken dat ze niet meer kan schrijven omdat ze haar hele leven leerkracht Nederlands (en dodsdienst) is geweest. Haar spelling ging al een tijdje achteruit, maar om nu echt niet meer de coördinatie te hebben om te kunnen schrijven, dat was een zware klap.  \nAlleen blijven zonder haar man Jean-Pierre begint moeilijk te worden. Hij schrijft wel altijd op een briefje waar hij naartoe gaat, maar soms vergeet ze dat te lezen of leest ze het en vergeet ze het snel weer. Hierdoor raakt ze in paniek als hij er niet is.\n\nJohn  Buck (44) &amp; Cindy De Buck (46)\nJohn heeft de diagnose van frontotemporale jongdementie gekregen. Hij is niet getrouwd, dus zijn zus Cindy zorgt voor hem. John woont begeleid in een studio omdat alleen wonen geen optie meer is. De begeleiders daar zorgen er ook voor dat hij zijn medicatie neemt. Overdag gaat John naar Ter Motte, een zorginstelling aangepast voor mensen met jongdementie. Ze organiseren er verschillende activiteiten want hoe actiever de mensen zijn, hoe minder snel ze achteruit gaan.\nCindy gaat John elke vrijdag halen in Ter Motte. Ze doet hard haar best om voor hem te zorgen. Zijn kortetermijngeheugen is al aangetast, maar van zijn jeugd weet hij nog veel. Bij John is vooral zijn karakter veranderd door de ziekte. Hij was agressief en durfde ook seksueel getinte opmerkingen te maken naar vrouwen toe. Zijn remmingen vallen weg door de ziekte. Door de medicatie is dit intussen verbeterd.</abstract>\n  <meemooDescriptionProgramme/>\n  <meemooDescriptionCast/>\n  <genre>program</genre>\n  <spatial/>\n  <temporal/>\n  <keywords>INTERVIEW</keywords>\n  <keywords>ZIEKTE</keywords>\n  <keywords>GEZONDHEID</keywords>\n  <keywords>ZIEKTE VAN ALZHEIMER</keywords>\n  <keywords>JONGDEMENTIE</keywords>\n  <keywords>THUISVERPLEGING</keywords>\n  <keywords>FIETS</keywords>\n  <keywords>GEHEUGEN</keywords>\n  <keywords>VERGETEN</keywords>\n  <keywords>AGRESSIE</keywords>\n  <keywords>KARAKTERVORMING</keywords>\n  <inLanguage/>\n  <dctermsMedium>16mm</dctermsMedium>\n  <dctermsFormat>video</dctermsFormat>\n  <meemoofilmColor/>\n  <meemoofilmBase/>\n  <meemoofilmImageOrSound/>\n  <ebucoreIsMediaFragmentOf/>\n</object>';
