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
