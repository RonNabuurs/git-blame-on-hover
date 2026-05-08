export function buildCommitUrl(remoteUrl: string, sha: string): string | null {
	let match;

	// SSH: git@host:group/repo.git
	if ((match = remoteUrl.match(/^git@([^:]+):(.+?)\/(.+?)(?:\.git)?$/))) {
		const host = match[1];
		const group = match[2];
		const repo = match[3];
		if (host.includes('github')) {
			return `https://${host}/${group}/${repo}/commit/${sha}`;
		}
		if (host.includes('gitlab')) {
			return `https://${host}/${group}/${repo}/-/commit/${sha}`;
		}
	}

	// HTTPS: https://host/group/repo.git
	if ((match = remoteUrl.match(/^https?:\/\/(.+?)\/(.+?)\/(.+?)(?:\.git)?$/))) {
		const host = match[1];
		const group = match[2];
		const repo = match[3];
		if (host.includes('github')) {
			return `https://${host}/${group}/${repo}/commit/${sha}`;
		}
		if (host.includes('gitlab')) {
			return `https://${host}/${group}/${repo}/-/commit/${sha}`;
		}
	}

	return null;
}
