import { promisify } from "util";
import * as config from "../data/config";
import * as fs from "fs";
import * as rl from "readline";
import * as path from "path";
const writeFileAsync = promisify(fs.writeFile),
  appendFileAsync = promisify(fs.appendFile),
  deleteFileAsync = promisify(fs.unlink),
  createWriteStreamAsync = promisify(fs.createWriteStream),
  statAsync = promisify(fs.stat);

export async function createPlaylistFile(newTracks: string[], type: string = "default", callback: () => void) {
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

export async function readPlaylistLineByLine(callback: (localPlaylistTracks: string[]) => void) {
  let localPlaylistTracks: string[] = [];
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

// Create the file if it not exist
// Write only the array provided
export function writeFile(file: string, trackUrls: string[]) {
  fs.writeFileSync(file, '');
  trackUrls.forEach(v => fs.appendFileSync(file, v + "\r\n"));
}


// Check file exist
// Read the file 
// And return content as an array
export async function getContentFileAsAnArray(file: string) {
  let isfileExist = await fileExist(file);
  let content: string[] = [];
  if (!isfileExist) {
    return content;
  }
  content = fs
    .readFileSync(file)
    .toString()
    .split("\r\n");
  content = content.filter(item => item !== "");
  return content;
}
