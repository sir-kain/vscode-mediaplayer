var utils = require("util");
var fs = require("fs");
var fetch = require("node-fetch");
const homedir = require("os").homedir(),
  path = require("path"),
  searchFilePath = path.join(homedir, "vscmp.search"),
  localFilePath = path.join(homedir, "playlist.vscmp");
  advAngularFilePath = path.join(homedir, "advAngular.js");

// Create the file if it not exist
// Write only the array provided
function writeFile(file, trackUrls) {
  fs.writeFileSync(file, "");
  trackUrls.forEach(v => fs.appendFileSync(file, v + "\r\n"));
}

const arr = ["Fhttp://ir/e", "Ai@/r", "éééé", "o?ok=kk?o"];
// writeFile(searchFilePath, arr);

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

// getContentFileAsAnArray(searchFilePath);

async function getPodcastById() {
  let res = await fetch(
    "https://listen-api.listennotes.com/api/v2/podcasts/9226c34d9de84dbc8accd9f61ae1a585",
    {
      headers: {
        "Content-Type": "application/json",
        "X-ListenAPI-Key": "dca4aaf4712e4faa81315fbd3aa18bd2"
      }
    }
  );
  let resJson = await res.json();
  // console.log("resJson ==>", resJson);
  // tracks = resJson["results"].map(data => {
  //   return {
  //     title: data.title_original,
  //     icon: data.thumbnail,
  //     url: data.audio
  //   };
  // });
  console.log('resJson ==>', resJson);
  fs.appendFileSync(advAngularFilePath, JSON.stringify(resJson))
}
// getPodcastById();


async function searchPodcastByName() {
  let res = await fetch(
    "https://listen-api.listennotes.com/api/v2/search?q=modern%20in%20web&type=podcast",
    {
      headers: {
        "Content-Type": "application/json",
        "X-ListenAPI-Key": "dca4aaf4712e4faa81315fbd3aa18bd2"
      }
    }
  );
  let resJson = await res.json();
  // console.log("resJson ==>", resJson);
  // tracks = resJson["results"].map(data => {
  //   return {
  //     title: data.title_original,
  //     icon: data.thumbnail,
  //     url: data.audio
  //   };
  // });
  resJson.results.forEach(elm => {
    console.log('elm ==>', elm);
  })
}

// searchPodcastByName()

async function getLanguages() {
  let res = await fetch(
    "https://listen-api.listennotes.com/api/v2/languages",
    {
      headers: {
        "Content-Type": "application/json",
        "X-ListenAPI-Key": "dca4aaf4712e4faa81315fbd3aa18bd2"
      }
    }
  );
  let resJson = await res.json();
  console.log('resJson ==>', resJson);
}

// getLanguages()
