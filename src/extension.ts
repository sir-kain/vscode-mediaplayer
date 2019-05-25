import * as vscode from 'vscode';
import * as ressources from "./data/ressources";
import { Track } from './data/models/Track';
import * as mpvAPI from "node-mpv";
const mpv = new mpvAPI();

export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('vsmp.list', async () => {
		const mediaList = await ressources.searchTracks("eminem");
		vscode.window.showQuickPick(mediaList.map(media => media.title));
	});
	vscode.window.registerTreeDataProvider("vsmp.listmedia", {
		getChildren(elem) {
			return ressources.searchTracks("eminem");
		},
		getTreeItem(element: Track) {
			return {
				label: element.title,
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
	vscode.commands.registerCommand('vsmp.play', async (track) => {
		return mpv.load('https://cdns-preview-5.dzcdn.net' + track.path);
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
