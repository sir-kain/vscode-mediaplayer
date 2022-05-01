import { ExtensionContext, commands, window, StatusBarAlignment, workspace, ViewColumn, Uri } from "vscode";
import { playHandler, jumpToPrevHandler, jumpToNextHandler, pauseHandler, nextHandler, prevHandler, resumeHandler, loadPlaylistHandler, getTimePositionFormatted, quitMpv } from "./commands";
import { Commands } from "./data/constants";
import * as fileHandler from "./data/fileHandler";
import { Track } from './data/models/Track';
import * as config from "./data/config";
import { watchFile } from "fs";
import { mpv } from "./mpvHandler";
import { SearchList, TrackItem } from "./views/searchList";
import { LocalList, UrlItem } from "./views/localList";

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
				window.registerTreeDataProvider("vsmp.mediaList", new SearchList(provider, keyword));
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

	const favTrack = commands.registerCommand(Commands.favTrack, async (track: UrlItem | TrackItem) => {
		const fileContent = await fileHandler.getContentFileAsAnArray(config.favFile);
		if (!fileContent.includes(track.url)) {
			const tracks = fileContent.concat(track.url);
			fileHandler.writeFile(config.favFile, tracks);
		} else {
			window.showInformationMessage("Track already added to fav list");
		}
	});

	const unFavTrack = commands.registerCommand(Commands.unFavTrack, async (track: UrlItem | TrackItem) => {
		const fileContent = await fileHandler.getContentFileAsAnArray(config.favFile);
		const tracks = fileContent.filter(content => content !== track.url);
		fileHandler.writeFile(config.favFile, tracks);
	});

	const viewTrackDetail = commands.registerCommand(Commands.viewTrackDetail, (trackItem: TrackItem) => {
		const track = trackItem.track;
		commands.executeCommand('markdown.api.render', track.description).then(result => {
			const panel = window.createWebviewPanel(
				'vscmp',
				track.title,
				ViewColumn.One,
				{}
			);

			// And set its HTML content
			const video = Uri.file('/home/waly/Downloads/4uwsQSMnXvxKUGLq.mp4')
			panel.webview.html = getWebviewContent(track, result, video);
		});
	});

	const stopMediaPlayer = commands.registerCommand(Commands.stop, async () => {
		await quitMpv();
		stoppedState();
	});

	context.subscriptions.push(searchMedia, playMedia, pauseMedia, prevtoMedia, nexttoMedia, favTrack, unFavTrack, viewTrackDetail, deleteTrack, openFolder, loadLocalPlaylist, loadFavPlaylist, loadSearchPlaylist, prevMedia, nextMedia, resumeMedia, stopMediaPlayer);
}

async function initializer() {
	const localTracks = await fileHandler.getContentFileAsAnArray(config.localFile);
	window.registerTreeDataProvider(Commands.openFolder, new LocalList(localTracks));

	const favTracks = await fileHandler.getContentFileAsAnArray(config.favFile);
	window.registerTreeDataProvider("vsmp.fav", new LocalList(favTracks));
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

async function runningState(timePos: string) {
	const currentTitle = await mpv.getTitle()
	buttons.prevJumpTo.text = `$(chevron-left)`;
	buttons.prevJumpTo.tooltip = "-20s";
	buttons.prevJumpTo.command = "vsmp.prevTo";
	buttons.prevJumpTo.show();

	buttons.prev.text = `$(triangle-left)`;
	buttons.prev.tooltip = "Prev";
	buttons.prev.command = "vsmp.prev";
	buttons.prev.show();

	buttons.togglePlay.text = `$(dash) ${timePos}`;
	buttons.togglePlay.tooltip = currentTitle || "Pause";
	buttons.togglePlay.command = "vsmp.pause";
	buttons.togglePlay.show();

	buttons.next.text = `$(triangle-right)`;
	buttons.next.tooltip = "Next";
	buttons.next.command = "vsmp.next";
	buttons.next.show();

	buttons.nextJumpTo.text = `$(chevron-right)`;
	buttons.nextJumpTo.tooltip = "+20s";
	buttons.nextJumpTo.command = "vsmp.nextTo";
	buttons.nextJumpTo.show();
}

function loadingState() {
	buttons.prevJumpTo.text = `$(chevron-left)`;
	buttons.prevJumpTo.tooltip = "-20s";
	buttons.prevJumpTo.command = undefined;
	buttons.prevJumpTo.show();

	buttons.prev.text = `$(triangle-left)`;
	buttons.prev.tooltip = "Prev";
	buttons.prev.command = undefined;
	buttons.prev.show();

	buttons.togglePlay.text = `$(sync~spin)Loading $(ellipsis)`;
	buttons.togglePlay.tooltip = "Loading";
	buttons.togglePlay.command = undefined;
	buttons.togglePlay.show();

	buttons.next.text = `$(triangle-right)`;
	buttons.next.tooltip = "Next";
	buttons.next.command = undefined;
	buttons.next.show();

	buttons.nextJumpTo.text = `$(chevron-right)`;
	buttons.nextJumpTo.tooltip = "+20s";
	buttons.nextJumpTo.command = undefined;
	buttons.nextJumpTo.show();
}

function pausedState(timePos: string) {
	buttons.prev.text = `$(triangle-left)`;
	buttons.prev.tooltip = "Prev";
	buttons.prev.command = undefined;
	buttons.prev.show();

	buttons.prevJumpTo.text = `$(chevron-left)`;
	buttons.prevJumpTo.tooltip = "-20s";
	buttons.prevJumpTo.command = undefined;
	buttons.prevJumpTo.show();

	buttons.togglePlay.text = `$(play) ${timePos}`;
	buttons.togglePlay.tooltip = "Resume";
	buttons.togglePlay.command = "vsmp.resume";
	buttons.togglePlay.show();

	buttons.nextJumpTo.text = `$(chevron-right)`;
	buttons.nextJumpTo.tooltip = "+20s";
	buttons.nextJumpTo.command = undefined;
	buttons.nextJumpTo.show();

	buttons.next.text = `$(triangle-right)`;
	buttons.next.tooltip = "Next";
	buttons.next.command = undefined;
	buttons.next.show();
}

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

mpv.on('started', async () => {
	console.log('await getPlaylistPosition() ==>', await mpv.getPlaylistPosition());
	let timePos = await getTimePositionFormatted();
	await runningState(timePos);
});

mpv.on('stopped', () => {
	console.log("stopped");
	stoppedState();
});

mpv.on('paused', async () => {
	const timePos = await getTimePositionFormatted();
	pausedState(timePos);
});

mpv.on('resumed', async () => {
	const timePos = await getTimePositionFormatted();
	await runningState(timePos);
});

mpv.on('timeposition', async (timePosInSecond: number) => {
	let timePos = new Date(timePosInSecond * 1000).toISOString().substr(11, 8);
	await runningState(timePos);
	// do we need 'resumed' event ?
});

mpv.on('crashed', () => {
	console.log("crached");
});

watchFile(config.localFile, async (curr, prev) => {
	const tracks = await fileHandler.getContentFileAsAnArray(config.localFile);
	window.registerTreeDataProvider(Commands.openFolder, new LocalList(tracks));
});

watchFile(config.favFile, async (curr, prev) => {
	const tracks = await fileHandler.getContentFileAsAnArray(config.favFile);
	window.registerTreeDataProvider("vsmp.fav", new LocalList(tracks));
});
