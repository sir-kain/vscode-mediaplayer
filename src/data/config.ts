const homedir = require("os").homedir(),
	path = require("path"),
	searchFilePath = path.join(homedir, "search.vscmp"),
    localFilePath = path.join(homedir, "playlist.vscmp");

export const searchFile = searchFilePath;
export const localFile = localFilePath;