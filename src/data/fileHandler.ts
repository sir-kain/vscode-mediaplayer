import { promisify } from "util";
import { Track } from "./models/Track";
const fs = require("fs"),
  writeFileAsync = promisify(fs.writeFile);

export async function createPlaylistFile(tracks: Array<Track>, filePath: string, type?: string) {
  let contentSearchFile: string = '';
  tracks.map((track: Track) => {
    contentSearchFile = contentSearchFile + track.url + "\r\n";
  });
  try {
    await writeFileAsync(filePath, contentSearchFile);
  } catch (error) {
    console.log('error while creating file for search playlist ', error);
  }
}
