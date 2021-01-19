import * as vscode from 'vscode';
import * as path from 'path';
import * as resources from "../data/resources";
import * as fileHandler from "../data/fileHandler";
import { Track } from '../data/models/Track';
import * as config from "../data/config";
import { Commands } from '../data/constants';

export class SearchList implements vscode.TreeDataProvider<TrackItem | ChannelItem> {

	constructor(private provider: string, private keyword: string) { }

	getTreeItem(element: TrackItem | ChannelItem): vscode.TreeItem {
		return element;
	}

	async getChildren(element: any): Promise<TrackItem[] | ChannelItem[]> {
		if (element && element.channel) {
			const items = new ChannelItem(element.channel, this.provider)
			return Promise.resolve([items]);
		}

		const mediaList = await resources.searchTracks(this.provider, this.keyword);
		if (!mediaList || mediaList.length === 0) {
			vscode.window.showInformationMessage(`No results matched "${this.keyword}"`);
			return Promise.resolve([]);
		}
		// Populate the search file, will be used the playlist for search
		const tracks = mediaList.map((track: Track) => track.url);
		fileHandler.writeFile(config.searchFile, tracks);
		const TrackItems = mediaList.map(track => {
			return new TrackItem(track.title, track.channel, {
				command: Commands.play,
				title: 'play',
				arguments: [
					track.url
				]
			}, track.icon || undefined)
		});

		return TrackItems;
	}
}

export class TrackItem extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly channel: string,
		public readonly command: vscode.Command,
		public readonly thumbnail?: string,
	) {
		super(label, vscode.TreeItemCollapsibleState.Collapsed);

		this.tooltip = this.label;
		this.description = this.label;
	}

	iconPath = this.thumbnail ? vscode.Uri.parse(this.thumbnail) : '';

	contextValue = 'track';
}

export class ChannelItem extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly provider: string,
		public readonly thumbnail?: string,
		public readonly command?: vscode.Command,
	) {
		super(label, vscode.TreeItemCollapsibleState.None);

		this.tooltip = this.label;
		this.description = this.provider;
	}

	// iconPath = path.join(__filename, '..', '..', '..', 'assets', `${this.provider.toLowerCase()}.png`);

	contextValue = 'channel';
}
