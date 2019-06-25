import * as mpvAPI from "node-mpv";
import * as config from "./data/config";
const Mpv = new mpvAPI({ "audio_only": true, "auto_restart": true });

export async function play(url: String) {
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

export async function resume() {
	try {
		await mpv.resume();
	}
	catch (error) {
		console.log("resume ", error);
	}
}

export async function loadPlaylist(filePath: String = config.localFile) {
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

