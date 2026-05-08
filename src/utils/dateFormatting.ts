function getOrdinalSuffix(day: number): string {
	if (day >= 11 && day <= 13) {
		return 'th';
	}

	switch (day % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
}

function formatRelativeTime(timestampMs: number): string {
	const divisions: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
		{ amount: 60, unit: 'second' },
		{ amount: 60, unit: 'minute' },
		{ amount: 24, unit: 'hour' },
		{ amount: 7, unit: 'day' },
		{ amount: 4.34524, unit: 'week' },
		{ amount: 12, unit: 'month' },
		{ amount: Number.POSITIVE_INFINITY, unit: 'year' }
	];
	const formatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'always' });
	let value = (timestampMs - Date.now()) / 1000;

	for (const division of divisions) {
		if (Math.abs(value) < division.amount) {
			return formatter.format(Math.round(value), division.unit);
		}

		value /= division.amount;
	}

	return formatter.format(Math.round(value), 'year');
}

function formatAbsoluteCommitDate(authorTime: number, authorTimezone: string): string {
	const timezoneSign = authorTimezone.startsWith('-') ? -1 : 1;
	const timezoneHours = Number(authorTimezone.slice(1, 3));
	const timezoneMinutes = Number(authorTimezone.slice(3, 5));
	const offsetMinutes = timezoneSign * ((timezoneHours * 60) + timezoneMinutes);
	const adjustedDate = new Date((authorTime * 1000) + (offsetMinutes * 60 * 1000));

	const month = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(adjustedDate);
	const day = Number(new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: 'UTC' }).format(adjustedDate));
	const year = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: 'UTC' }).format(adjustedDate);
	const time = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
		timeZone: 'UTC'
	}).format(adjustedDate);

	return `${month} ${day}${getOrdinalSuffix(day)}, ${year} ${time}`;
}

export function formatCommitDate(authorTime: number, authorTimezone: string): string {
	const timestampMs = authorTime * 1000;
	const relativeTime = formatRelativeTime(timestampMs);
	const absoluteTime = formatAbsoluteCommitDate(authorTime, authorTimezone);
	return `${relativeTime} (${absoluteTime})`;
}
