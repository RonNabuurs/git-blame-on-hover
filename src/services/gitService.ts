import * as child_process from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';

import { BlameInfo } from '../types/blame';

function runCommand(command: string, cwd?: string): Promise<string> {
	return new Promise((resolve, reject) => {
		child_process.exec(
			command,
			{ cwd },
			(error: child_process.ExecException | null, stdout: string, stderr: string) => {
				if (error) {
					reject(stderr || error.message);
					return;
				}

				resolve(stdout);
			}
		);
	});
}

export async function getGitBlameOutput(filePath: string, lineNumber: number): Promise<string> {
	const blameCommand = `git blame -L ${lineNumber},${lineNumber} --porcelain -- ${filePath}`;
	return runCommand(blameCommand, vscode.workspace.rootPath || undefined);
}

export async function getGitRepoRoot(filePath: string): Promise<string> {
	const output = await runCommand('git rev-parse --show-toplevel', path.dirname(filePath));
	return output.trim();
}

export async function getGitRemoteUrl(repoPath: string): Promise<string> {
	const output = await runCommand('git remote get-url origin', repoPath);
	return output.trim();
}

export function parseBlameOutput(output: string): BlameInfo {
	const authorMatch = output.match(/^author (.+)$/m);
	const messageMatch = output.match(/^summary (.+)$/m);
	const shaMatch = output.match(/^(\w{40}) /m);
	const authorTimeMatch = output.match(/^author-time (\d+)$/m);
	const authorTimezoneMatch = output.match(/^author-tz ([+-]\d{4})$/m);

	return {
		author: authorMatch ? authorMatch[1] : 'Unknown',
		message: messageMatch ? messageMatch[1] : 'No commit message',
		sha: shaMatch ? shaMatch[1] : '',
		authorTime: authorTimeMatch ? Number(authorTimeMatch[1]) : null,
		authorTimezone: authorTimezoneMatch ? authorTimezoneMatch[1] : '+0000'
	};
}
