import * as vscode from 'vscode';
import * as ressources from "./data/ressources";
import * as fileHandler from "./data/fileHandler";
import { Track } from './data/models/Track';
import * as mpvAPI from "node-mpv";
const homedir = require("os").homedir(),
	path = require("path"),
	searchFile = path.join(homedir, "search.vscmp"),
	playlistFile = path.join(homedir, "playlist.vscmp"),
	mpv = new mpvAPI({
		"audio_only": true,
	});



let myStatusBarItemPrev: vscode.StatusBarItem;
let myStatusBarItemTogglePlay: vscode.StatusBarItem;
let myStatusBarItemNext: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('vsmp.searchMedia', async () => {
		vscode.window.showQuickPick(["Deezer", "YouTube"]).then((provider: any) => {
			vscode.window.showInputBox().then((keyword: any) => {
				if (!keyword) {
					vscode.window.showInformationMessage("Please enter keyword!");
					return;
				}
				vscode.window.registerTreeDataProvider("vsmp.mediaList", {
					async getChildren() {
						const mediaList = await ressources.searchTracks(provider, keyword);
						if (!mediaList || !mediaList.length) {
							vscode.window.showInformationMessage(`No results matched "${keyword}"`);
							return;
						}
						// populate the search file, will be used as the playlist for search
						fileHandler.createPlaylistFile(mediaList, searchFile);
						try {
							let mpvIsRunning = await mpv.isRunning();
							if (mpvIsRunning) {
								await mpv.quit();
							}
							await mpv.start();
							await mpv.loadPlaylist(searchFile);
							myStatusBarItemPrev = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
							myStatusBarItemPrev.text = `$(chevron-left)`;
							myStatusBarItemPrev.tooltip = "Prev";
							myStatusBarItemPrev.show();
							myStatusBarItemTogglePlay = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
							myStatusBarItemTogglePlay.text = `$(dash) 00:00`;
							myStatusBarItemTogglePlay.tooltip = "Play";
							myStatusBarItemTogglePlay.command = "vsmp.pause";
							myStatusBarItemTogglePlay.show();
							myStatusBarItemNext = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
							myStatusBarItemNext.text = `$(chevron-right)`;
							myStatusBarItemNext.tooltip = "Next";
							myStatusBarItemNext.show();
						}
						catch (error) {
							console.log("err ", error);
						}
						return mediaList;
					},
					getTreeItem(track: Track) {
						return {
							tooltip: `${provider}: ${track.title}`,
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
			});
		});
	});
}
vscode.commands.registerCommand('vsmp.play', async (url: string) => {
	try {
		let mpvIsRunning = await mpv.isRunning();
		if (mpvIsRunning) {
			await mpv.quit();
		}
		await mpv.start();
		await mpv.load(url);
		// await mpv.playlistMove(await mpv.getPlaylistPosition(), 2);
		// console.log('playlist size ', await mpv.getPlaylistSize());
		// console.log('playlist pos ', await mpv.getPlaylistPosition());
	}
	catch (error) {
		console.log("err ", error);
	}
});
vscode.commands.registerCommand('vsmp.pause', async () => {
	try {
		await mpv.pause();
	}
	catch (error) {
		console.log("pause ", error);
	}
});
vscode.commands.registerCommand('vsmp.resume', async () => {
	try {
		await mpv.resume();
	}
	catch (error) {
		console.log("resume ", error);
	}
});
vscode.commands.registerCommand('vsmp.next', async () => {
	try {
		await mpv.next("force");
	}
	catch (error) {
		console.log("next ", error);
	}
});
vscode.commands.registerCommand('vsmp.prev', async () => {
	try {
		await mpv.prev("force");
	}
	catch (error) {
		console.log("prev ", error);
	}
});

mpv.on('timeposition', function (time: any) {
	myStatusBarItemTogglePlay.text = `$(dash) ${time}`;
	console.log('time ! ', time);
});
mpv.on('paused', function (e: any) {
	myStatusBarItemTogglePlay.text = "$(play) 00:00";
	myStatusBarItemTogglePlay.tooltip = "Pause";
	myStatusBarItemTogglePlay.command = "vsmp.resume";
	console.log('time ! ', e);
});

// this method is called when your extension is deactivated
export function deactivate() { }
