import * as mpv from "./mpvHandler";

export async function playHandler(url: string) {
   await mpv.play(url);
}

export async function jumpToPrevHandler() {
   await mpv.jumpToPrev();
}

export async function jumpToNextHandler() {
   await mpv.jumpToNext();
}

export async function pauseHandler() {
   await mpv.pause();
}

export async function nextHandler() {
   await mpv.next();
}

export async function prevHandler() {
   await mpv.prev();
}

export async function resumeHandler() {
   await mpv.resume();
}

export async function loadPlaylistHandler(filePath: string) {
   await mpv.loadPlaylist(filePath);
}

export async function refreshListHandler() {
}

export async function openFolderHandler() {
}

export async function deteleTrackHandler() {
}

export async function getTimePositionFormated(): Promise<string> {
   const timePos = await mpv.getTimePosition();
   return timePos;
}

