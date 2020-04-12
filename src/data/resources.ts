import fetch, { Response } from 'node-fetch';
import * as ENV from "dotenv";
ENV.config();
import { Track } from './models/Track';
import * as YouTube from "simple-youtube-api";
const youtube = new YouTube('AIzaSyAJ_tLRbLFzmH4sChaPRBCiH3c5a3AEZdE');

export async function searchTracks(provider: string, name: string): Promise<Track[]> {
    let res = new Response();
    let tracks: Array<any> = [];
    switch (provider) {
        case "YouTube":
            tracks = await youtube.searchVideos(name, 20).catch((err: any )=> console.log('err ==>', err));
            console.log(tracks);
            tracks = tracks.map((data: any) => {
                return {
                    title: data.title,
                    icon: data.raw.snippet.thumbnails.default.url,
                    url: `https://www.youtube.com/watch?v=${data.id}`,
                    description: data.description
                };
            });

            console.log('tracks ==>', tracks);
            break;
        case "Podcast":            
            res = await fetch("https://listen-api.listennotes.com/api/v2/search?type=episode&q=" + encodeURIComponent(name), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-ListenAPI-Key': "dca4aaf4712e4faa81315fbd3aa18bd2"
                }
            });
            let resJson = await res.json();
            tracks = resJson["results"].map((data: any) => {
                return {
                    title: data.title_original,
                    icon: data.thumbnail,
                    url: data.audio,
                    description: data.description_original
                };
            });
            break;
    }
    return tracks;
}
