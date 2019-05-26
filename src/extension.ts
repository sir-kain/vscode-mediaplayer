import * as vscode from 'vscode';
import * as ressources from "./data/ressources";
import { Track } from './data/models/Track';
import * as mpvAPI from "node-mpv";
const mpv = new mpvAPI();

export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('vsmp.searchMedia', async () => {
		vscode.window.showQuickPick(["Deezer"]).then((provid: any) => {
			let provider = provid || "";
			vscode.window.showInputBox().then((keyword: any) => {
				if (keyword === "") {
					vscode.window.showInformationMessage("Please enter keyword");
					return;
				}
				vscode.window.registerTreeDataProvider("vsmp.mediaList", {
					async getChildren() {
						const mediaList = await ressources.searchTracks(provider, keyword);
						if(!mediaList || !mediaList.length) {
							vscode.window.showInformationMessage(`No results matched "${keyword}"`);
						}
						return mediaList;
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
		});
	});
	vscode.commands.registerCommand('vsmp.play', async (track: any) => {
		mpv.load('https://cdns-preview-5.dzcdn.net' + track.path);
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
