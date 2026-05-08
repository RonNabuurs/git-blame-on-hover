export interface BlameInfo {
	author: string;
	message: string;
	sha: string;
	authorTime: number | null;
	authorTimezone: string;
}
