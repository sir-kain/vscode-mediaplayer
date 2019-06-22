var utils = require("util");
var fs = require("fs");
const homedir = require("os").homedir(),
  path = require("path"),
  searchFilePath = path.join(homedir, "vscmp.search"),
  localFilePath = path.join(homedir, "playlist.vscmp");

// Create the file if it not exist
// Write only the array provided
function writeSearchFile(file, trackUrls) {
  fs.writeFileSync(file, '');
  trackUrls.forEach(v => fs.appendFileSync(file, v + "\r\n"));
}

const arr = ["Fhttp://ir/e", "Ai@/r", "éééé", "o?ok=kk?o"];
writeSearchFile(searchFilePath, arr);

// Check file exist
// Read the file 
// And return content as an array
function getContentFileAsAnArray(file) {
  let arr = [];
  arr = fs
    .readFileSync(file)
    .toString()
    .split("\r\n");
  arr = arr.filter(ar => ar != "");
  console.log("arr ==>", arr);
}

getContentFileAsAnArray(searchFilePath);


function name(params) {
  
}