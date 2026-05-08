import * as vscode from 'vscode';

import { OPEN_COMMIT_CHANGES_COMMAND } from '../constants';
import { BlameInfo } from '../types/blame';

function buildOpenCommitChangesCommandUri(sha: string): vscode.Uri {
	const args = encodeURIComponent(JSON.stringify([sha]));
	return vscode.Uri.parse(`command:${OPEN_COMMIT_CHANGES_COMMAND}?${args}`);
}

export function buildHover(blameInfo: BlameInfo, formattedDate: string, commitUrl: string | null): vscode.Hover {
	const openCommitChangesUri = buildOpenCommitChangesCommandUri(blameInfo.sha);
	let hoverText = `**${blameInfo.author}** _${formattedDate}_\n\n${blameInfo.message}\n\n`;

	if (commitUrl) {
		hoverText += `[$(git-commit) ${blameInfo.sha.substring(0, 8)}](${openCommitChangesUri.toString()}) | [$(globe)](${commitUrl})`;
	}

	const hoverMessage = new vscode.MarkdownString(hoverText);
	hoverMessage.supportThemeIcons = true;
	hoverMessage.isTrusted = { enabledCommands: [OPEN_COMMIT_CHANGES_COMMAND] };
    return new vscode.Hover(hoverMessage);
}
