import * as vscode from 'vscode';
import { Commands } from '../data/constants';

export class LocalList implements vscode.TreeDataProvider<UrlItem> {

  constructor(private urls: string[]) { }

  getTreeItem(element: UrlItem): vscode.TreeItem {
    return element
  }

  getChildren(): UrlItem[] {
    return this.urls.map((url) => {
      return new UrlItem(url)
    });
  }
}

export class UrlItem extends vscode.TreeItem {

  constructor(
    public readonly url: string,
  ) {
    super(url.split("/").pop() || url, vscode.TreeItemCollapsibleState.None);
    this.tooltip = this.label;
  }

  command = {
    command: Commands.play,
    title: 'Play',
    arguments: [
      this.url
    ]
  };
  contextValue = 'url';
}
