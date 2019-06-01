import { promisify } from "util";
import * as config from "../data/config";
const fs = require("fs"),
  rl = require("readline"),
  writeFileAsync = promisify(fs.writeFile),
  appendFileAsync = promisify(fs.appendFile);

export async function createPlaylistFile(content: string, type?: string) {
  try {
    if (type === 'local') {
      await appendFileAsync(config.localFile, content);
    } else {
      await writeFileAsync(config.searchFile, content);
    }
  } catch (error) {
    console.log('error while creating file for search playlist ', type, error);
  }
}
