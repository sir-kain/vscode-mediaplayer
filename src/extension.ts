import * as vscode from 'vscode';
import * as ressources from "./data/ressources";
import { Track } from './data/models/Track';
import * as mpvAPI from "node-mpv";
const mpv = new mpvAPI();

export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('vsmp.searchMedia', async (q) => {
		// const mediaList = await ressources.searchTracks("souleymane faye");
		vscode.window.showInputBox().then((q) => {
			let qsearching = q ? q : '';
			vscode.window.registerTreeDataProvider("vsmp.mediaList", {
				getChildren(elem) {
					return ressources.searchTracks(qsearching);
				},
				getTreeItem(element: Track) {
					return {
						label: element.title,
						iconPath: vscode.Uri.parse(element.album["cover_small"]),
						command: {
							command: "vsmp.play",
							title: 'play',
							arguments: [
								vscode.Uri.parse(element.preview)
							]
						}
					};
				}
			});
		})
		// vscode.window.showQuickPick(mediaList.map(media => media.title));
	});
	vscode.commands.registerCommand('vsmp.play', async (track) => {
		mpv.load('https://cdns-preview-5.dzcdn.net' + track.path);
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
