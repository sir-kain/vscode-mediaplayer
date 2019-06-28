import { ExtensionContext, commands, window, Uri, StatusBarAlignment } from "vscode";
import * as ressources from "./data/resources";
import { playHandler, pauseHandler, nextHandler, prevHandler, resumeHandler, loadPlaylistHandler } from "./commands";
import { Commands } from "./data/constants";
import * as fileHandler from "./data/fileHandler";
import { Track } from './data/models/Track';
import * as config from "./data/config";
import { watchFile } from "fs";
import { mpv } from "./mpvHandler";

export function activate(context: ExtensionContext) {
	initializer();
	registerCommands();
}

// this method is called when your extension is deactivated
export function deactivate() { }


function registerCommands() {
	commands.registerCommand(Commands.searchMedia, async () => {
		window.showQuickPick(["Deezer", "YouTube", "Podcast"], { placeHolder: 'Pick a provider...' }).then((provider: any) => {
			if (!provider) { return window.showWarningMessage(`A provider is required ...`); }
			window.showInputBox({ placeHolder: `Searching on ${provider}` }).then((keyword: any) => {
				if (!keyword) { return window.showInformationMessage("Please enter keyword!"); }
				window.registerTreeDataProvider("vsmp.mediaList", {
					async getChildren() {
						const mediaList = await ressources.searchTracks(provider, keyword);
						if (!mediaList || !mediaList.length) {
							window.showInformationMessage(`No results matched "${keyword}"`);
							return;
						}
						// Populate the search file, will be used the playlist for search
						let tracks: string[] = [];
						mediaList.map((track: Track) => tracks.push(track.url));
						fileHandler.writeFile(config.searchFile, tracks);
						commands.executeCommand(Commands.loadLocalPlaylist, config.searchFile);
						return mediaList;
					},
					getTreeItem(track: Track) {
						return {
							tooltip: `${provider}: ${track.title}`,
							label: track.title,
							iconPath: track.icon ? Uri.parse(track.icon) : '',
							command: {
								command: Commands.play,
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
	commands.registerCommand(Commands.play, (url: string) => playHandler(url));
	commands.registerCommand(Commands.pause, pauseHandler);
	commands.registerCommand(Commands.next, nextHandler);
	commands.registerCommand(Commands.prev, prevHandler);
	commands.registerCommand(Commands.resume, resumeHandler);
	commands.registerCommand(Commands.loadLocalPlaylist, (filePath: string) => loadPlaylistHandler(filePath));
	commands.registerCommand(Commands.openFolder, async () => {
		const openDialogOptions = {
			canSelectMany: true,
			openLabel: 'Add to local playlist',
			filters: {
				'Media': ['mp3', 'mp4', 'avi', 'mkv', 'webm']
			}
		};
		window.showOpenDialog(openDialogOptions).then(async (fileUri) => {
			let tracks: string[] = [];
			if (fileUri) {
				tracks = fileUri.map(url => url.fsPath);
				const fileContent = await fileHandler.getContentFileAsAnArray(config.localFile);
				const tracksToAdd = arrayUnique(tracks.concat(fileContent));
				fileHandler.writeFile(config.localFile, tracksToAdd);
			}
		});
	});
}

async function initializer() {
	const tracks = await fileHandler.getContentFileAsAnArray(config.localFile);
	updateLocalTreeView(tracks);
}

watchFile(config.localFile, async (curr, prev) => {
	const tracks = await fileHandler.getContentFileAsAnArray(config.localFile);
	updateLocalTreeView(tracks);
	commands.executeCommand(Commands.loadLocalPlaylist, config.localFile);
});

function updateLocalTreeView(tracks: string[]) {
	window.registerTreeDataProvider("vsmp.openFolder", {
		getChildren() {
			return tracks;
		},
		getTreeItem(url: string) {
			let title = url.split("/").pop();
			return {
				// tooltip: `: ${track.title}`,
				label: title,
				// iconPath: track.icon ? Uri.parse(track.icon) : '',
				command: {
					command: "vsmp.play",
					title: 'play',
					arguments: [
						url
					]
				}
			};
		}
	});
}

function arrayUnique(array: string[]) {
	let a = array.concat();
	for (let i = 0; i < a.length; ++i) {
		for (let j = i + 1; j < a.length; ++j) {
			if (a[i] === a[j]) {
				a.splice(j--, 1);
			}
		}
	}
	return a;
}

const button = {
	prev: window.createStatusBarItem(StatusBarAlignment.Left, 100),
	togglePlay: window.createStatusBarItem(StatusBarAlignment.Left, 100),
	next: window.createStatusBarItem(StatusBarAlignment.Left, 100)
};

function stoppedState() {
	button.prev.text = '';
	button.prev.hide();
	button.next.text = '';
	button.next.hide();
	button.togglePlay.text = '';
	button.togglePlay.hide();
}

function runningState() {
	button.prev.text = `$(triangle-left)`;
	button.prev.tooltip = "Prev";
	button.prev.command = "vsmp.prev";
	button.prev.show();

	button.togglePlay.text = `$(dash) 00:00`;
	button.togglePlay.tooltip = "Pause";
	button.togglePlay.command = "vsmp.pause";
	button.togglePlay.show();

	button.next.text = `$(triangle-right)`;
	button.next.tooltip = "Next";
	button.next.command = "vsmp.next";
	button.next.show();
}

// mpvHandler.on('statuschange', (status: any) => {
// 	console.log(status);
// });

mpv.on('started', () => {
	console.log("started");
	runningState();
});

mpv.on('stopped', () => {
	console.log("stopped");
	stoppedState();
});

mpv.on('paused', () => {
	console.log('paused ==>');
	button.togglePlay.text = `$(dash) 00:00`;
	button.togglePlay.tooltip = "Play";
	button.togglePlay.command = "vsmp.play";
	button.togglePlay.show();
});

mpv.on('crashed', () => {
	console.log("crached");
});