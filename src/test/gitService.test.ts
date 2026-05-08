import { strict as assert } from 'assert';
import { describe, it } from 'mocha';

import { parseBlameOutput } from '../services/gitService';

describe('gitService', () => {
	it('parses blame porcelain output fields', () => {
		const output = [
			'35e194b111111111111111111111111111111111 42 42 1',
			'author Ron Nabuurs',
			'author-time 1599485880',
			'author-tz +0200',
			'summary Initial commit',
			'filename .gitattributes'
		].join('\n');

		const parsed = parseBlameOutput(output);

		assert.equal(parsed.author, 'Ron Nabuurs');
		assert.equal(parsed.message, 'Initial commit');
		assert.equal(parsed.sha, '35e194b111111111111111111111111111111111');
		assert.equal(parsed.authorTime, 1599485880);
		assert.equal(parsed.authorTimezone, '+0200');
	});

	it('provides fallback values when fields are missing', () => {
		const parsed = parseBlameOutput('');

		assert.equal(parsed.author, 'Unknown');
		assert.equal(parsed.message, 'No commit message');
		assert.equal(parsed.sha, '');
		assert.equal(parsed.authorTime, null);
		assert.equal(parsed.authorTimezone, '+0000');
	});
});
