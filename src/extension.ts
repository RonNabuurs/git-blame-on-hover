import * as vscode from 'vscode';
import { openCommitChanges } from './commands/openCommitChanges';
import { OPEN_COMMIT_CHANGES_COMMAND } from './constants';
import { buildHover } from './hover/hoverText';
import { getGitBlameOutput, getGitRemoteUrl, getGitRepoRoot, parseBlameOutput } from './services/gitService';
import { formatCommitDate } from './utils/dateFormatting';
import { buildCommitUrl } from './utils/remoteUrl';


export function activate(context: vscode.ExtensionContext) {

	console.log('Extension "git-blame-on-hover" is now active!');

	const openCommitChangesCommand = vscode.commands.registerCommand(
		OPEN_COMMIT_CHANGES_COMMAND,
		(commitHash: string) => openCommitChanges(commitHash)
	);

	const hoverProvider = vscode.languages.registerHoverProvider('*', {
		async provideHover(document, position) {
			const filePath = document.fileName;
			const lineNumber = position.line + 1;

			try {
				const blameOutput = await getGitBlameOutput(filePath, lineNumber);
				const blameInfo = parseBlameOutput(blameOutput);
				const formattedDate = blameInfo.authorTime === null
					? 'unknown date'
					: formatCommitDate(blameInfo.authorTime, blameInfo.authorTimezone);

				const repoRoot = await getGitRepoRoot(filePath);
				const remoteUrl = await getGitRemoteUrl(repoRoot);
				const commitUrl = buildCommitUrl(remoteUrl, blameInfo.sha);
				return buildHover(blameInfo, formattedDate, commitUrl);
			} catch (error) {
				console.error('Error fetching Git blame info:', error);
				return new vscode.Hover('Unable to fetch Git blame info.');
			}
		}
	});

	context.subscriptions.push(openCommitChangesCommand, hoverProvider);
}

export function deactivate() {
	console.log('Extension "git-blame-on-hover" has been deactivated.');
}
