import { strict as assert } from 'assert';
import { describe, it } from 'mocha';

import { buildCommitUrl } from '../utils/remoteUrl';

describe('remoteUrl', () => {
	it('builds GitHub commit URL from SSH remote', () => {
		const url = buildCommitUrl('git@github.com:owner/repo.git', 'abc123');
		assert.equal(url, 'https://github.com/owner/repo/commit/abc123');
	});

	it('builds GitLab commit URL from self-hosted HTTPS remote', () => {
		const url = buildCommitUrl('https://gitlab.selfhosted.com/group/subgroup/repo.git', 'def456');
		assert.equal(url, 'https://gitlab.selfhosted.com/group/subgroup/repo/-/commit/def456');
	});

	it('returns null for unsupported hosts', () => {
		const url = buildCommitUrl('https://bitbucket.org/workspace/repo.git', '123456');
		assert.equal(url, null);
	});
});
