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
		console.log("err ", error);
	}
}

export async function next() {
	try {
		await mpv.next("weak");
	}
	catch (error) {
		console.log("next ", error);
	}
}

export async function prev() {
	try {
		await mpv.prev("weak");
	}
	catch (error) {
		console.log("prev ", error);
	}
}

export async function pause() {
	try {
		await mpv.pause();
	}
	catch (error) {
		console.log("pause ", error);
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
		console.log("jumpToPrev ", error);
	}
}

export async function jumpToNext() {
	try {
		const currentPosition = parseInt(await mpv.getTimePosition());
		await mpv.goToPosition(currentPosition + TIMETOJUMP);
	}
	catch (error) {
		console.log("jumpToNext ", error);
	}
}

export async function resume() {
	try {
		await mpv.resume();
	}
	catch (error) {
		console.log("resume ", error);
	}
}

export async function getTimePosition(): Promise<string> {
	let timePos: string = '';
	try {
		let timePosInSecond = await mpv.getTimePosition();
		timePos = new Date(parseInt(timePosInSecond) * 1000).toISOString().substr(11, 8);
	}
	catch (error) {
		console.log("getTimePosition ", error);
	}
	return timePos;
}

export async function loadPlaylist(filePath: string = config.localFile) {
	try {
		await quitMpvNeeded();
		await mpv.start();
		await mpv.loadPlaylist(filePath, "append");
	}
	catch (error) {
		console.error("err ", error);
	}
}

async function quitMpvNeeded() {
	try {
		const mpvIsRunning = await mpv.isRunning();
		if (mpvIsRunning) {
			await mpv.quit();
		}
	} catch (error) {
		console.log('error ==>', error);
	}
}

export const mpv = Mpv;

