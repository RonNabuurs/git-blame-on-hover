import * as vscode from 'vscode';

export async function openCommitChanges(commitHash: string) {
	const gitExt = vscode.extensions.getExtension('vscode.git');
	if (!gitExt) {
		vscode.window.showErrorMessage('Git extension is required.');
		return;
	}

	const gitApi = gitExt.isActive
		? gitExt.exports.getAPI(1)
		: await gitExt.activate().then((e: { getAPI: (version: number) => any }) => e.getAPI(1));

	if (gitApi.repositories.length === 0) {
		vscode.window.showErrorMessage('No active Git repositories found.');
		return;
	}

	const repository = gitApi.repositories[0];

	try {
		const changes = await repository.diffBetween(`${commitHash}^`, commitHash);

		if (changes.length === 0) {
			vscode.window.showInformationMessage('No files changed in this commit.');
			return;
		}

		const resourceList: [vscode.Uri, vscode.Uri, vscode.Uri][] = [];

		for (const change of changes) {
			const fileUri = change.uri;
			const leftUri = gitApi.toGitUri(fileUri, `${commitHash}^`);
			const rightUri = gitApi.toGitUri(fileUri, commitHash);
			resourceList.push([fileUri, leftUri, rightUri]);
		}

		const editorTitle = `Changes in Commit: ${commitHash}`;
		await vscode.commands.executeCommand('vscode.changes', editorTitle, resourceList);
	} catch (error) {
		console.error(error);
		vscode.window.showErrorMessage(`Failed to load changes for commit ${commitHash}.`);
	}
}
