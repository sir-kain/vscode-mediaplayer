import { promisify } from "util";
import * as config from "../data/config";
import * as fs from "fs";
import * as rl from "readline";
import * as path from "path";
const writeFileAsync = promisify(fs.writeFile),
  appendFileAsync = promisify(fs.appendFile),
  deleteFileAsync = promisify(fs.unlink),
  statAsync = promisify(fs.stat);

export async function createPlaylistFile(newTracks: Array<string>, type: string = "default", callback: () => void) {
  if (type === 'local') {
    await readPlaylistLineByLine(async localTracks => {
      try {
        await deleteFile(config.localFile);
        let tracks = [...new Set(localTracks.concat(newTracks))];
        tracks.map(async track => {
          await appendFileAsync(config.localFile, track + '\r\n');
        });
        callback();
      } catch (error) {
        console.error('error while creating file for playlist: ', type, error);
      }
    });
  } else {
    // await writeFileAsync(config.searchFile, content);
    newTracks.map(track => fs.writeFileSync(config.searchFile, track + `\r\n`));
  }
}

export async function deleteTrackFile(trackToDelete: string, type: string = "default", callback: () => void) {
  await readPlaylistLineByLine(async localTracks => {
    try {
      if (type === 'local') {
        await deleteFile(config.localFile);
        let tracks = localTracks.filter(track => track !== trackToDelete);
        tracks.map(async track => {
          await appendFileAsync(config.localFile, track + '\r\n');
        });
        callback();
      }
    } catch (error) {
      console.error('error while creating file for playlist: ', type, error);
    }
  });
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
      // remove duplicate tracks from the array
      localPlaylistTracks = [...new Set(localPlaylistTracks)];
      callback(localPlaylistTracks);
    });
  } else {
    callback(localPlaylistTracks);
  }
}

export async function deleteFile(file: string) {
  try {
    let fileExists = await fileExist(config.localFile);
    if (fileExists) {
      await deleteFileAsync(file);
    }
  } catch (error) {
    console.error("error deleting file ", error);
  }
}
