import * as vscode from 'vscode';
import { Uri } from 'vscode';

interface ServerResponse {
  message?: string;
  id?: string;
  error?: any;
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('pastevs.upload_paste', async () => {
    const editor = vscode.window.activeTextEditor!;
    const selection = editor.selection;

    if (selection && !selection.isEmpty) {
      const selectionRange = new vscode.Range(
        selection.start.line,
        selection.start.character,
        selection.end.line,
        selection.end.character
      );
      const highlighted = editor.document.getText(selectionRange);

      vscode.window.showInformationMessage('Uploading to Paste...');

      try {
        const response = await fetch('http://localhost:3000/paste', { // Replace with your server address
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: highlighted }),
        });

        if (!response.ok) {
          throw new Error(`Error saving paste: ${response.statusText}`);
        }

        const data: ServerResponse = await response.json();

        if (data.error) {
          throw new Error(`Server error: ${data.error}`);
        }

        const pasteID = data.id;

        if (!pasteID) {
          console.warn('Warning: Missing ID in response');
        } else {
          vscode.env.clipboard.writeText("https://paste.asterix.sh/paste/" + pasteID);
          vscode.window.showInformationMessage('Paste Uploaded and Copied to Clipboard.');
          vscode.env.openExternal(Uri.parse("https://paste.asterix.sh/paste/" + pasteID));
        }
      } catch (error) {
        console.error('Error:', error);
        vscode.window.showErrorMessage('Failed to upload paste');
      }
    } else {
      vscode.window.showErrorMessage('You must have something selected.');
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
