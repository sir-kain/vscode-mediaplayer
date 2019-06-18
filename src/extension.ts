import { ExtensionContext, commands, window, Uri } from "vscode";
import * as ressources from "./data/resources";
import { playHandler, pauseHandler, nextHandler, prevHandler, resumeHandler, loadPlaylistHandler } from "./commands";
import { Commands } from "./data/constants";
import { Track } from './data/models/Track';
import * as config from "./data/config";

export function activate(context: ExtensionContext) {
	commands.registerCommand('vsmp.searchMedia', async () => {
		window.showQuickPick(["Deezer", "YouTube"], { placeHolder: 'Pick a provider...' }).then((provider: any) => {
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
						// populate the search file, will be used as the playlist for search
						let tracks: Array<any> = [];
						mediaList.map((track: Track) => tracks.push(track.url));
						// fileHandler.createPlaylistFile(tracks, "default", await refreshLocalList);
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
	registerCommands();
}

// this method is called when your extension is deactivated
export function deactivate() { }


function registerCommands() {
	commands.registerCommand(Commands.play, (url: String) => playHandler(url));
	commands.registerCommand(Commands.pause, pauseHandler);
	commands.registerCommand(Commands.next, nextHandler);
	commands.registerCommand(Commands.prev, prevHandler);
	commands.registerCommand(Commands.resume, resumeHandler);
	commands.registerCommand(Commands.loadLocalPlaylist, (filePath: String) => loadPlaylistHandler(filePath));
}
