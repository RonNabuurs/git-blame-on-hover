import { strict as assert } from 'assert';
import { describe, it } from 'mocha';

import { formatCommitDate } from '../utils/dateFormatting';

describe('dateFormatting', () => {
	it('formats relative and absolute commit date text', () => {
		const originalNow = Date.now;
		Date.now = () => Date.UTC(2026, 0, 1, 12, 0, 0);

		try {
			const authorTime = Math.floor(Date.UTC(2020, 8, 7, 13, 38, 0) / 1000);
			const formatted = formatCommitDate(authorTime, '+0200');

			assert.match(formatted, /^\d+ years ago \(/);
			assert.ok(
				formatted.includes('(September 7th, 2020 3:38 PM)'),
				`Unexpected absolute date output: ${formatted}`
			);
		} finally {
			Date.now = originalNow;
		}
	});
});
