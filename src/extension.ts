import * as vscode from 'vscode';
import * as ressources from "./data/ressources";
import { Track } from './data/models/Track';
import * as mpvAPI from "node-mpv";
const mpv = new mpvAPI({
	"audio_only": true,
});

export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('vsmp.searchMedia', async () => {
		vscode.window.showQuickPick(["Deezer", "YouTube"]).then((provider: any) => {
			vscode.window.showInputBox().then((keyword: any) => {
				if (keyword === "") {
					vscode.window.showInformationMessage("Please enter keyword");
					return;
				}
				vscode.window.registerTreeDataProvider("vsmp.mediaList", {
					async getChildren() {
						const mediaList = await ressources.searchTracks(provider, keyword);
						if (!mediaList || !mediaList.length) {
							vscode.window.showInformationMessage(`No results matched "${keyword}"`);
						}
						// try {
						// 	await mpv.start();
						// 	await mpv.loadPlaylist("src/ply.txt");
						// }
						// catch (error) {
						// 	console.log("err ", error);
						// }
						return mediaList;
					},
					getTreeItem(track: Track) {
						return {
							label: track.title,
							iconPath: track.icon ? vscode.Uri.parse(track.icon) : '',
							command: {
								command: "vsmp.play",
								title: 'play',
								arguments: [
									track.url
								]
							}
						};
					}
				});
			})
		});
	});
	vscode.commands.registerCommand('vsmp.play', async (url: string) => {
		try {
			await mpv.start();
			await mpv.load(url);
		}
		catch (error) {
			// Maybe the mpv player could not be started
			// Maybe the video file does not exist or couldn't be loaded
			// Maybe someProperty is not a valid property
			console.log("err ", error);
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
