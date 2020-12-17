import { ExtensionContext, commands, window, Uri, StatusBarAlignment, workspace, ViewColumn } from "vscode";
import * as resources from "./data/resources";
import { playHandler, jumpToPrevHandler, jumpToNextHandler, pauseHandler, nextHandler, prevHandler, resumeHandler, loadPlaylistHandler, getTimePositionFormated, quitMpv } from "./commands";
import { Commands } from "./data/constants";
import * as fileHandler from "./data/fileHandler";
import { Track } from './data/models/Track';
import * as config from "./data/config";
import { watchFile } from "fs";
import { mpv } from "./mpvHandler";

export function activate(context: ExtensionContext) {
	initializer();
	registerCommands(context);
}

// this method is called when your extension is deactivated
export async function deactivate() {
	await quitMpv();
}


function registerCommands(context: ExtensionContext) {
	const searchMedia = commands.registerCommand(Commands.searchMedia, async () => {
		window.showQuickPick(["YouTube", "Podcast"], { placeHolder: 'Pick a provider...' }).then((provider: any) => {
			if (!provider) { return window.showWarningMessage(`A provider is required ...`); }
			window.showInputBox({ placeHolder: `Searching on ${provider}` }).then((keyword: any) => {
				if (!keyword) { return window.showInformationMessage("Please enter keyword!"); }
				updateSearchTreeView("vsmp.mediaList", provider, keyword);
			});
		});
	});
	const playMedia = commands.registerCommand(Commands.play, (url: string) => playHandler(url));
	const pauseMedia = commands.registerCommand(Commands.pause, pauseHandler);
	const prevtoMedia = commands.registerCommand(Commands.prevTo, jumpToPrevHandler);
	const nexttoMedia = commands.registerCommand(Commands.nextTo, jumpToNextHandler);
	const prevMedia = commands.registerCommand(Commands.prev, () => {
		loadingState();
		prevHandler();
	});
	const resumeMedia = commands.registerCommand(Commands.resume, resumeHandler);
	const nextMedia = commands.registerCommand(Commands.next, () => {
		loadingState();
		nextHandler();
	});
	const loadLocalPlaylist = commands.registerCommand(Commands.loadLocalPlaylist, async () => {
		loadingState();
		await loadPlaylistHandler(config.localFile);
	});
	const loadSearchPlaylist = commands.registerCommand(Commands.loadSearchPlaylist, async () => {
		loadingState();
		await loadPlaylistHandler(config.searchFile);
	});
	const loadFavPlaylist = commands.registerCommand(Commands.loadFavPlaylist, async () => {
		loadingState();
		await loadPlaylistHandler(config.favFile);
	});
	const openFolder = commands.registerCommand(Commands.openFolder, async () => {
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
	const deleteTrack = commands.registerCommand(Commands.deteleTrack, async (itemToDelete: string) => {
		const fileContent = await fileHandler.getContentFileAsAnArray(config.localFile);
		const tracks = fileContent.filter(content => content !== itemToDelete);
		fileHandler.writeFile(config.localFile, tracks);
	});

	const favTrack = commands.registerCommand(Commands.favTrack, async (trackFav: string | Track) => {
		const track: string = typeof trackFav === 'string' ? trackFav : trackFav.url;
		const fileContent = await fileHandler.getContentFileAsAnArray(config.favFile);
		if (!fileContent.includes(track)) {
			const tracks = fileContent.concat(track);
			fileHandler.writeFile(config.favFile, tracks);
		} else {
			// already added to fav
		}
	});

	const unFavTrack = commands.registerCommand(Commands.unFavTrack, async (track: string) => {
		const fileContent = await fileHandler.getContentFileAsAnArray(config.favFile);
		const tracks = fileContent.filter(content => content !== track);
		fileHandler.writeFile(config.favFile, tracks);
	});

	const viewTrackDetail = commands.registerCommand(Commands.viewTrackDetail, (track: Track) => {
		console.log('track ==>', track);
		// const uri = Uri.parse("ok:" + track.title);
		// Create and show panel

		commands.executeCommand('markdown.api.render', track.description).then(result => {
			console.log(`rendered markdown: ${result}`);
			const panel = window.createWebviewPanel(
				'vscmp',
				track.title,
				ViewColumn.One,
				{}
			);

			// And set its HTML content
			panel.webview.html = getWebviewContent(track, result);
		});
	});

	context.subscriptions.push(searchMedia, playMedia, pauseMedia, prevtoMedia, nexttoMedia, favTrack, unFavTrack, viewTrackDetail, deleteTrack, openFolder, loadLocalPlaylist, loadFavPlaylist, loadSearchPlaylist, prevMedia, nextMedia, resumeMedia);
}

async function initializer() {
	const localTracks = await fileHandler.getContentFileAsAnArray(config.localFile);
	updateTreeView("vsmp.openFolder", localTracks);
	const favTracks = await fileHandler.getContentFileAsAnArray(config.favFile);
	updateTreeView("vsmp.fav", favTracks);
}

watchFile(config.localFile, async (curr, prev) => {
	const tracks = await fileHandler.getContentFileAsAnArray(config.localFile);
	updateTreeView("vsmp.openFolder", tracks);
});

watchFile(config.favFile, async (curr, prev) => {
	const tracks = await fileHandler.getContentFileAsAnArray(config.favFile);
	updateTreeView("vsmp.fav", tracks);
});

function updateTreeView(view: string, tracks: string[]) {
	window.registerTreeDataProvider(view, {
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

function updateSearchTreeView(view: string, provider: string, keyword: string) {
	window.registerTreeDataProvider(view, {
		async getChildren() {
			const mediaList = await resources.searchTracks(provider, keyword);
			if (!mediaList || !mediaList.length) {
				window.showInformationMessage(`No results matched "${keyword}"`);
				return;
			}
			// Populate the search file, will be used the playlist for search
			let tracks: string[] = [];
			mediaList.map((track: Track) => tracks.push(track.url));
			fileHandler.writeFile(config.searchFile, tracks);
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

const buttons = {
	prevJumpTo: window.createStatusBarItem(StatusBarAlignment.Left, 100),
	prev: window.createStatusBarItem(StatusBarAlignment.Left, 100),
	togglePlay: window.createStatusBarItem(StatusBarAlignment.Left, 100),
	next: window.createStatusBarItem(StatusBarAlignment.Left, 100),
	nextJumpTo: window.createStatusBarItem(StatusBarAlignment.Left, 100)
};

function stoppedState() {
	buttons.prev.text = '';
	buttons.prev.hide();
	buttons.togglePlay.text = '';
	buttons.togglePlay.hide();
	buttons.next.text = '';
	buttons.next.hide();
	buttons.nextJumpTo.text = '';
	buttons.nextJumpTo.hide();
	buttons.prevJumpTo.text = '';
	buttons.prevJumpTo.hide();
}

function runningState(timePos: string) {
	buttons.prevJumpTo.text = `$(chevron-left)`;
	buttons.prevJumpTo.tooltip = "Back to";
	buttons.prevJumpTo.command = "vsmp.prevTo";
	buttons.prevJumpTo.show();

	buttons.prev.text = `$(triangle-left)`;
	buttons.prev.tooltip = "Prev";
	buttons.prev.command = "vsmp.prev";
	buttons.prev.show();

	buttons.togglePlay.text = `$(dash) ${timePos}`;
	buttons.togglePlay.tooltip = "Pause";
	buttons.togglePlay.command = "vsmp.pause";
	buttons.togglePlay.show();

	buttons.next.text = `$(triangle-right)`;
	buttons.next.tooltip = "Next";
	buttons.next.command = "vsmp.next";
	buttons.next.show();

	buttons.nextJumpTo.text = `$(chevron-right)`;
	buttons.nextJumpTo.tooltip = "Move to";
	buttons.nextJumpTo.command = "vsmp.nextTo";
	buttons.nextJumpTo.show();
}

function loadingState() {
	buttons.prevJumpTo.text = `$(chevron-left)`;
	buttons.prevJumpTo.tooltip = "Back to";
	buttons.prevJumpTo.command = "";
	buttons.prevJumpTo.show();

	buttons.prev.text = `$(triangle-left)`;
	buttons.prev.tooltip = "Prev";
	buttons.prev.command = "";
	buttons.prev.show();

	buttons.togglePlay.text = `$(sync~spin)Loading ...`;
	buttons.togglePlay.tooltip = "Loading";
	buttons.togglePlay.command = "";
	buttons.togglePlay.show();

	buttons.next.text = `$(triangle-right)`;
	buttons.next.tooltip = "Next";
	buttons.next.command = "";
	buttons.next.show();

	buttons.nextJumpTo.text = `$(chevron-right)`;
	buttons.nextJumpTo.tooltip = "Move to";
	buttons.nextJumpTo.command = "";
	buttons.nextJumpTo.show();
}

function pausedState(timePos: string) {
	buttons.prev.text = `$(triangle-left)`;
	buttons.prev.tooltip = "Prev";
	buttons.prev.command = "";
	buttons.prev.show();

	buttons.prevJumpTo.text = `$(chevron-left)`;
	buttons.prevJumpTo.tooltip = "Back to";
	buttons.prevJumpTo.command = "";
	buttons.prevJumpTo.show();

	buttons.togglePlay.text = `$(play) ${timePos}`;
	buttons.togglePlay.tooltip = "Resume";
	buttons.togglePlay.command = "vsmp.resume";
	buttons.togglePlay.show();

	buttons.nextJumpTo.text = `$(chevron-right)`;
	buttons.nextJumpTo.tooltip = "Move to";
	buttons.nextJumpTo.command = "";
	buttons.nextJumpTo.show();

	buttons.next.text = `$(triangle-right)`;
	buttons.next.tooltip = "Next";
	buttons.next.command = "";
	buttons.next.show();
}

// mpvHandler.on('statuschange', (status: any) => {
// 	console.log(status);
// });

mpv.on('started', async () => {
	console.log("started");
	let timePos = await getTimePositionFormated();
	runningState(timePos);
});

mpv.on('stopped', () => {
	console.log("stopped");
	stoppedState();
});

mpv.on('paused', async () => {
	console.log('paused ==>');
	const timePos = await getTimePositionFormated();
	pausedState(timePos);
});

mpv.on('resumed', async () => {
	console.log('resumed ==>');
	const timePos = await getTimePositionFormated();
	runningState(timePos);
});

mpv.on('timeposition', async (timePosInSecond: number) => {
	let timePos = new Date(timePosInSecond * 1000).toISOString().substr(11, 8);
	console.log('timePos >', timePos);
	runningState(timePos);
	// do we need 'resumed' event ?
});

mpv.on('crashed', () => {
	console.log("crached");
});

function getWebviewContent(track: Track, result: any) {
	return `<!DOCTYPE html>
	<html lang="en">
	<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>${track.title}</title>
	</head>
	<body>
			<div>
				<h2> ${track.title} </h2>
				<img src="${track.icon}" width="200" stype="margin: 0 auto"/>
				<div>
					${result}
				</div>
			</div>
	</body>
	</html>`;
}
