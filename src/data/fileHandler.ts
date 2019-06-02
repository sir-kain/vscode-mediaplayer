import { Disposable } from "vscode";
import { promisify, callbackify } from "util";
import * as config from "../data/config";
import * as fs from "fs";
import * as rl from "readline";
import * as path from "path";
const writeFileAsync = promisify(fs.writeFile),
  appendFileAsync = promisify(fs.appendFile),
  statAsync = promisify(fs.stat);

export async function createPlaylistFile(content: string, type?: string) {
  try {
    if (type === 'local') {
      await appendFileAsync(config.localFile, content);
    } else {
      await writeFileAsync(config.searchFile, content);
    }
  } catch (error) {
    console.error('error while creating file for search playlist: ', type, error);
  }
}

export async function fileExist(file: string): Promise<Boolean> {
  let exists: Boolean = true;
  try {
    await statAsync(file);
  } catch (error) {
    exists = false;
  }
  return exists;
}

export async function readPlaylistLineByLine(callback: (localPlaylistTracks: Array<string>) => void) {
  let localPlaylistTracks: Array<string> = [];
  let fileExists = await fileExist(config.localFile);
  if (fileExists) {
    let lineReader = rl.createInterface({
      input: fs.createReadStream(config.localFile)
    });

    lineReader.on('line', (line: string) => {
      localPlaylistTracks.push(line);
    });
    lineReader.on('close', () => {
      callback(localPlaylistTracks);
    });
  } else {
    callback(localPlaylistTracks);
  }
}
