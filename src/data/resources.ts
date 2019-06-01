import fetch, { Response } from 'node-fetch';
import { Track } from './models/Track';
import * as YouTube from "simple-youtube-api";
const youtube = new YouTube('AIzaSyC3URt50QfVuOAxJvls1CcqXs-rGLbHf88');

export async function searchTracks(provider: string, name: string): Promise<Track[]> {
    let res = new Response();
    let tracks: Array<any> = [];
    switch (provider) {
        case "Deezer":
            res = await fetch("https://deezerdevs-deezer.p.rapidapi.com/search?q=" + encodeURIComponent(name), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': "e04b319b2emsh34ce0fea1c09f20p10ce86jsn9658c95fd1b1",
                    'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
                }
            });
            let tracksJson = await res.json();
            tracks = tracksJson["data"].map((data: any) => {
                return {
                    title: data.title,
                    icon: data.album["cover_small"],
                    url: data.preview
                };

            });
            break;
        case "YouTube":
            tracks = await youtube.searchVideos(name, 20);
            tracks = tracks.map((data: any) => {
                return {
                    title: data.title,
                    icon: data.raw.snippet.thumbnails.default.url,
                    url: `https://www.youtube.com/watch?v=${data.id}`
                };
            });
            break;
    }
    return tracks;
}
