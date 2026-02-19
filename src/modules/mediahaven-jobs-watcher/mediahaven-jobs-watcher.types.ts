export enum MamJobStatus {
	Waiting = 'Waiting',
	InProgress = 'InProgress',
	Completed = 'Completed',
	Failed = 'Failed',
	Cancelled = 'Cancelled',
	AlreadyExists = 'AlreadyExists',
}

export interface MediahavenJobInfo {
	ExportJobId: string;
	Name: string;
	RecordId: string;
	Status: MamJobStatus;
	Progress: number;
	DownloadUrl: string;
	RemoteUrl: string;
	CreationDate: string;
	StartDate: string;
	FinishDate: string;
	ExpiryDate: string;
	Tag: string;
}

/**
 * Margin (in seconds) to consider a Mediahaven access token as expired before its actual expiry time.
 * This helps to avoid using an expired token due to network delays or processing time.
 */
export const MEDIAHAVEN_TOKEN_EXPIRE_MARGIN = 5 * 60;

export interface MamAccessToken {
	token: {
		token_type: 'bearer';
		refresh_token: string;
		expires_in: number;
		access_token: string;
	};
	createdAt: Date;
}

export interface GetMamExportsResponse {
	NrOfResults: number;
	StartIndex: number;
	TotalNrOfResults: number;
	Results: MediahavenJobInfo[];
}

export enum MamExportQuality {
	// Shown in the UI as "High quality"
	// Original refers to the original file as uploaded to Mediahaven
	ORIGINAL = 'Original',
	// Shown in the UI as "Normal quality"
	// Access refers to the accessible copy for showing on the website
	ACCESS = 'Access',
}

export interface CreateMamJob {
	Records: {
		RecordId: string;
		Partial?: {
			Type: string;
			Start: string;
			End: string;
		};
	}[];
	ExportLocationId: string;
	DestinationPath?: string;
	ExportSource: MamExportQuality;
	Reason: string;
	Tag: string;
}

export interface S3ExportLocationToken {
	token: string;
	owner: string;
	scope: string;
	expiration: string;
	creation: string;
	secret: string;
}

export type MediaHavenRecord = {
	Context: {
		IsDeletable: boolean;
		IsEditable: boolean;
		IsEmbeddable: boolean;
		IsExportable: boolean;
		IsPublic: boolean;
		IsPublishable: boolean;
		Profiles: string[];
		Reasons: {
			IsPublishable: Array<{
				Code: string;
				Value: string;
			}>;
		};
	};
	Descriptive: {
		CreationDate: string;
		Description: string;
		OriginalFilename: string;
		RightsOwner: string;
		UploadedBy: string;
		KeyframeStart: number;
		Title: string;
		CreationDateLegacy: any;
		Rights: any;
		Keywords: {
			Keyword: any[];
		};
		Categories: {
			Category: any[];
		};
		LimitedCategories: any;
		Publisher: any;
		Authors: any;
		Location: any;
		Address: any;
		NonPreferredTerm: any;
		Publications: {
			Comment: any[];
		};
		OriginalPath: any;
		Position: any;
	};
	Internal: {
		IndexName: string;
		PathToVideo: string;
		PathToKeyframe: string;
		Profiles: {
			Record: string[];
			Mh2Collection: string[];
			Newspaper: string[];
			NewspaperPage: string[];
			Media: string[];
			Representation: string[];
			Bibliographic: string[];
			BibliographicPage: string[];
			Basic: string[];
			MaterialArtwork: string[];
		};
		PathToPreview: string;
		Browses: {
			Browse: Array<{
				BaseUrl: string;
				PathToKeyframe?: string;
				PathToKeyframeThumb?: string;
				PathToVideo: string;
				HasKeyframes: boolean;
				Container: string;
				Label: string;
				FileSize: number;
				AudioTracks?: {
					Track: Array<{
						Channels: number;
					}>;
				};
				Height?: number;
				VideoCodec?: string;
				Width?: number;
				AudioChannels?: number;
				AudioCodec: string;
				BitRate: number;
				AudioSampleRate: number;
				VideoBitRate?: number;
				AudioBitRate?: number;
				VideoFps?: string;
			}>;
		};
		BrowseStatus: string;
		RecordId: string;
		IsInIngestSpace: boolean;
		OrganisationId: string;
		ContainsGeoData: boolean;
		OriginalStatus: string;
		IsFragment: boolean;
		UploadedById: string;
		HasKeyframes: boolean;
		MediaObjectId: string;
		ArchiveStatus: string;
		FragmentId: string;
		OffsetInDatabase: number;
		PathToKeyframeThumb: string;
		DepartmentId: string;
		ExternalSourceUrl: any;
		IngestSpaceId: any;
		PathToOriginal: any;
		Distributions: {
			Distribution: any[];
		};
	};
	Administrative: {
		LastModifiedDate: string;
		IsSynchronized: boolean;
		OrganisationName: string;
		Workflow: string;
		HasFailedJobs: boolean;
		ArchiveDate: string;
		IngestFlow: string;
		RecordStatus: string;
		IsAccess: boolean;
		Type: string;
		IsOriginal: boolean;
		IsPreservation: boolean;
		DepartmentName: string;
		UserLastModifiedDate: string;
		OrganisationLongName: string;
		RecordType: string;
		PublicationDate: string;
		ExternalId: string;
		DeleteStatus: string;
		MainRecordType: string;
		OrganisationExternalId: string;
		ExternalUrl: any;
		IngestTape: any;
		LogicalDeletionDate: any;
		ChildOrderFields: any;
		RejectionDate: any;
		ExternalUse: any;
		RecordRejections: any;
	};
	Technical: {
		ImageQuality: string;
		AudioTechnical: string;
		PronomId: string;
		OriginalExtension: string;
		DurationFrames: number;
		EndFrames: number;
		MimeType: string;
		StartFrames: number;
		Width: number;
		Md5: string;
		VideoBitRate: number;
		AudioChannels: number;
		BitRate: number;
		VideoTechnical: string;
		AudioTracks: {
			Track: {
				Channels: number;
				Language: string;
			}[];
		};
		AudioCodec: string;
		AudioSampleRate: number;
		VideoCodec: string;
		FileSize: number;
		ImageSize: string;
		DurationTimeCode: string;
		Height: number;
		EndTimeCode: string;
		AudioBitRate: number;
		StartTimeCode: string;
		ImageOrientation: string;
		VideoFps: string;
		VideoFormat: any;
		Exif: any;
		Sha256: any;
		Camera: any;
		Origin: any;
		EssenceOffset: any;
		EditUnitByteSize: any;
		RunIn: any;
		FramesPerEditUnit: any;
		EditRate: any;
		IndexEditRate: any;
	};
	RightsManagement: {
		Permissions: {
			Write: string[];
			Export: string[];
			Read: string[];
		};
		RecordPhase: string;
		ExpiryDate: any;
		ExpiryStatus: any;
		Zone: any;
	};
	Structural: {
		ChildOrder: number;
		RecordStructure: string;
		ParentRecordId: string;
		HasChildren: boolean;
		FragmentStartFrames: number;
		HasNonRepresentationChildren: boolean;
		FragmentStartTimeCode: string;
		FragmentEndTimeCode: string;
		InformationPackage: string;
		ReferenceTitles: {
			Classification: string[];
		};
		ReferenceCodes: {
			Classification: string[];
		};
		FragmentDurationFrames: number;
		FragmentDurationTimeCode: string;
		FragmentEndFrames: number;
		Versioning: {
			Status: string;
			Version: number;
		};
		Collections: {
			Collection: any[];
		};
		Sets: {
			Set: any[];
		};
		Newspapers: {
			Newspaper: any[];
		};
		Relations: any;
		Fragments: {
			Fragment: any[];
		};
		MainFragment: any;
		FieldDefinition: any;
		PreviewRecordId: any;
		OriginalRecordId: any;
		DataRecordId: any;
	};
	Dynamic: {
		dc_creators: {
			Maker: string[];
			Archiefvormer: string[];
		};
		dc_description_lang: string;
		dc_rights_rightsHolders: {
			Licentiehouder: string[];
		};
		dc_subjects: {
			Trefwoord: string[];
		};
		dc_description: string;
		dcterms_issued: string;
		dc_identifier_localid: string;
		PID: string;
		CP: string;
		dc_rights_licenses: {
			multiselect: string[];
		};
		md5_viaa: string;
		dc_description_transcriptie: string;
		dc_identifier_localids: {
			Pdf: string[];
			Api: string[];
			Bestandsnaam: string[];
		};
		dc_contributors: {
			Voorzitter: string[];
			Aanwezig: string[];
			Afwezig: string[];
			Verontschuldigd: string[];
		};
		ingest_workflow: string;
		dcterms_created: string;
		dc_rights_rightsOwners: {
			Auteursrechthouder: string[];
		};
		sp_name: string;
		dc_titles: {
			reeks: string[];
		};
		CP_id: string;
	};
};
