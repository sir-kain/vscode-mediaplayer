const homedir = require("os").homedir(),
	path = require("path"),
	searchFilePath = path.join(homedir, "vscmp.search"),
	localFilePath = path.join(homedir, "vscmp.local");

export const searchFile = searchFilePath;
export const localFile = localFilePath;