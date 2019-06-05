import * as vscode from 'vscode';
import * as ressources from "./data/resources";
import * as fileHandler from "./data/fileHandler";
import { Track } from './data/models/Track';
import * as mpvAPI from "node-mpv";
import * as config from "./data/config";
const mpv = new mpvAPI({ "audio_only": true });

let myStatusBarItemPrev = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
let myStatusBarItemTogglePlay = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
let myStatusBarItemNext = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);

export function activate(context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('vsmp.searchMedia', async () => {
		vscode.window.showQuickPick(["Deezer", "YouTube"], { placeHolder: 'Pick a provider...' }).then((provider: any) => {
			if (!provider) { return vscode.window.showWarningMessage(`A provider is required ...`); }
			vscode.window.showInputBox({ placeHolder: `Searching on ${provider}` }).then((keyword: any) => {
				if (!keyword) { return vscode.window.showInformationMessage("Please enter keyword!"); }
				vscode.window.registerTreeDataProvider("vsmp.mediaList", {
					async getChildren() {
						const mediaList = await ressources.searchTracks(provider, keyword);
						if (!mediaList || !mediaList.length) {
							vscode.window.showInformationMessage(`No results matched "${keyword}"`);
							return;
						}
						// populate the search file, will be used as the playlist for search
						let tracks: Array<any> = [];
						mediaList.map((track: Track) => tracks.push(track.url));
						fileHandler.createPlaylistFile(tracks, "default", await refreshLocalList);
						myStatusBarItemPrev.text = '';
						myStatusBarItemPrev.hide();
						myStatusBarItemNext.text = '';
						myStatusBarItemNext.hide();
						myStatusBarItemTogglePlay.text = '';
						myStatusBarItemTogglePlay.hide();
						try {
							let mpvIsRunning = await mpv.isRunning();
							if (mpvIsRunning) {
								await mpv.quit();
							}
							await mpv.start();
							await mpv.loadPlaylist(config.searchFile);

							myStatusBarItemPrev.text = `$(triangle-left)`;
							myStatusBarItemPrev.tooltip = "Prev";
							myStatusBarItemPrev.command = "vsmp.prev";
							myStatusBarItemPrev.show();

							myStatusBarItemTogglePlay.text = `$(dash) 00:00`;
							myStatusBarItemTogglePlay.tooltip = "Pause";
							myStatusBarItemTogglePlay.command = "vsmp.pause";
							myStatusBarItemTogglePlay.show();

							myStatusBarItemNext.text = `$(triangle-right)`;
							myStatusBarItemNext.tooltip = "Next";
							myStatusBarItemNext.command = "vsmp.next";
							myStatusBarItemNext.show();
						}
						catch (error) {
							console.error("err ", error);
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
		myStatusBarItemTogglePlay.text = `Loading $(sync~spin)`;
		await mpv.resume();
	}
	catch (error) {
		console.log("resume ", error);
	}
});
vscode.commands.registerCommand('vsmp.next', async () => {
	try {
		myStatusBarItemTogglePlay.text = `Loading $(sync~spin)`;
		await mpv.next("weak");
	}
	catch (error) {
		console.log("next ", error);
	}
});
vscode.commands.registerCommand('vsmp.prev', async () => {
	try {
		myStatusBarItemTogglePlay.text = `Loading $(sync~spin)`;
		await mpv.prev("weak");
	}
	catch (error) {
		console.log("prev ", error);
	}
});
vscode.commands.registerCommand('vsmp.loadLocalPlaylist', async () => {
	myStatusBarItemPrev.text = '';
	myStatusBarItemPrev.hide();
	myStatusBarItemNext.text = '';
	myStatusBarItemNext.hide();
	myStatusBarItemTogglePlay.text = '';
	myStatusBarItemTogglePlay.hide();
	try {
		let mpvIsRunning = await mpv.isRunning();
		if (mpvIsRunning) {
			await mpv.quit();
		}
		await mpv.start();
		await mpv.loadPlaylist(config.localFile, "append");

		myStatusBarItemPrev.text = `$(triangle-left)`;
		myStatusBarItemPrev.tooltip = "Prev";
		myStatusBarItemPrev.command = "vsmp.prev";
		myStatusBarItemPrev.show();

		myStatusBarItemTogglePlay.text = `$(dash) 00:00`;
		myStatusBarItemTogglePlay.tooltip = "Pause";
		myStatusBarItemTogglePlay.command = "vsmp.pause";
		myStatusBarItemTogglePlay.show();

		myStatusBarItemNext.text = `$(triangle-right)`;
		myStatusBarItemNext.tooltip = "Next";
		myStatusBarItemNext.command = "vsmp.next";
		myStatusBarItemNext.show();
	}
	catch (error) {
		console.error("err ", error);
	}
});
vscode.commands.registerCommand('vsmp.lp.deteleTrack', async (itemToDelete) => {
	// read file and delete item which match param
	// await fileHandler.deleteFile(config.localFile);
	await fileHandler.deleteTrackFile(itemToDelete, "local", await refreshLocalList);
	await vscode.commands.executeCommand('vsmp.loadLocalPlaylist');
});
vscode.commands.registerCommand('vsmp.refreshLocalList', async () => {
	await refreshLocalList();
});
vscode.commands.registerCommand('vsmp.openFolder', async () => {
	const openDialogOprions = {
		canSelectMany: true,
		openLabel: 'Add to local playlist',
		filters: {
			'Media': ['mp3', 'mp4', 'avi', 'mkv', 'webm']
		}
	};
	vscode.window.showOpenDialog(openDialogOprions).then(async (fileUri) => {
		let tracks: Array<string> = [];
		if (fileUri) {
			fileUri.map(url => {
				tracks = tracks.concat(url.fsPath)
			});
			// populate the local playlist file, will be used as the playlist for local media			
			await fileHandler.createPlaylistFile(tracks, "local", await refreshLocalList);
			// read the file and show it in the tree view		
			await vscode.commands.executeCommand('vsmp.loadLocalPlaylist');	
		}
	});
});


mpv.on('timeposition', async (timePos: any) => {
	myStatusBarItemTogglePlay.text = `$(dash) ${timePos}`;
	myStatusBarItemTogglePlay.tooltip = await mpv.getTitle();
	// do we need 'resumed' event ?
});
mpv.on('paused', async (e: any) => {
	const timePos = await mpv.getTimePosition();
	myStatusBarItemTogglePlay.text = `$(play) ${timePos}`;
	myStatusBarItemTogglePlay.tooltip = "Resume";
	myStatusBarItemTogglePlay.command = "vsmp.resume";
});
mpv.on('resumed', async (e: any) => {
	const timePos = await mpv.getTimePosition();
	myStatusBarItemTogglePlay.text = `$(dash) ${timePos}`;
	myStatusBarItemTogglePlay.tooltip = "Pause";
	myStatusBarItemTogglePlay.command = "vsmp.pause";
});


// check if localplaylist exist
let fileExist = fileHandler.fileExist(config.localFile);
if (fileExist) {
	// read the file and show it in the tree view
	refreshLocalList();
} else {
	// show button "upload local tracks" in tree view

}

async function updateLocalTreeView(localPlaylistTracks: Array<string>) {
	vscode.window.registerTreeDataProvider("vsmp.openFolder", {
		async getChildren() {
			return localPlaylistTracks;
		},
		getTreeItem(url: string) {
			let title = url.split("/").pop();
			return {
				// tooltip: `: ${track.title}`,
				label: title,
				// iconPath: track.icon ? vscode.Uri.parse(track.icon) : '',
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
async function refreshLocalList() {
	await fileHandler.readPlaylistLineByLine(async (localPlaylistTracks: Array<string>) => {
		await updateLocalTreeView(localPlaylistTracks);
		if (localPlaylistTracks.length === 0) {
			vscode.window.showInformationMessage("You have no uploaded tracks");
		}
	});
}
// this method is called when your extension is deactivated
export function deactivate() { }
