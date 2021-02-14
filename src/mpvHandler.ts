import * as mpvAPI from "node-mpv";
import * as config from "./data/config";
const Mpv = new mpvAPI({ "audio_only": true, "auto_restart": true });
const TIMETOJUMP: number = 20;

export async function play(url: string) {
	try {
		await quitMpvNeeded();
		await mpv.start();
		await mpv.load(url);
	}
	catch (error) {
		console.error("play ", error);
	}
}

export async function next() {
	try {
		await mpv.next();
	}
	catch (error) {
		console.error("next ", error);
	}
}

export async function prev() {
	try {
		await mpv.prev();
	}
	catch (error) {
		console.error("prev ", error);
	}
}

export async function pause() {
	try {
		await mpv.pause();
	}
	catch (error) {
		console.error("pause ", error);
	}
}

export async function jumpToPrev() {
	try {
		const currentPosition = parseInt(await mpv.getTimePosition());
		if (currentPosition > TIMETOJUMP) {
			await mpv.goToPosition(currentPosition - TIMETOJUMP);
		} else {
			await mpv.goToPosition(0);
		}
	}
	catch (error) {
		console.error("jumpToPrev ", error);
	}
}

export async function jumpToNext() {
	try {
		const currentPosition = parseInt(await mpv.getTimePosition());
		await mpv.goToPosition(currentPosition + TIMETOJUMP);
	}
	catch (error) {
		console.error("jumpToNext ", error);
	}
}

export async function resume() {
	try {
		await mpv.resume();
	}
	catch (error) {
		console.error("resume ", error);
	}
}

export async function getTimePosition(): Promise<string> {
	let timePos: string = '';
	try {
		let timePosInSecond = await mpv.getTimePosition();
		timePos = new Date(parseInt(timePosInSecond) * 1000).toISOString().substr(11, 8);
	}
	catch (error) {
		console.error("getTimePosition ", error);
	}
	return timePos;
}

export async function loadPlaylist(filePath: string) {
	try {
		if (!filePath) { return; }
		await quitMpvNeeded();
		await mpv.start();
		await mpv.loadPlaylist(filePath);
	}
	catch (error) {
		console.error("err loadPlaylist ==>", error);
	}
}

export async function loopPlaylist(times: any) {
	try {
		await mpv.loopPlaylist(times);
	}
	catch (error) {
		console.error("err loopPlaylist ==>", error);
	}
}

export async function getPlaylistPosition() {
	try {
		await mpv.getPlaylistPosition();
	}
	catch (error) {
		console.error("err getPlaylistPosition ==>", error);
	}
}

export async function getTitle() {
	try {
		await mpv.getTitle();
	}
	catch (error) {
		console.error("err getTitle ==>", error);
	}
}

export async function observeProperty(property: String) {
	try {
		await mpv.observeProperty(property);
	}
	catch (error) {
		console.error("err observeProperty property==>", error);
	}
}


export async function quitMpvNeeded(): Promise<void> {
	try {
		const mpvIsRunning = await mpv.isRunning();
		if (mpvIsRunning) {
			await mpv.quit();
		}
	} catch (error) {
		console.error('error quitMpvNeeded ==>', error);
	}
}

export const mpv = Mpv;

