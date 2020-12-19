import fetch, { Response } from 'node-fetch';
import { google } from "googleapis";
import * as ENV from "dotenv";
ENV.config();
import { Track } from './models/Track';

export async function searchTracks(provider: string, name: string): Promise<Track[]> {
    let res = new Response();
    let tracks: Array<any> = [];
    switch (provider) {
        case "YouTube":
            try {
                const youtube = google.youtube({
                    version: 'v3',
                    auth: process.env.YOUTUBE_API_KEY
                });
                const response = await youtube.search.list({
                    part: ['id', 'snippet'],
                    type: ['video'],
                    q: name,
                    maxResults: 20
                });
                if (response.status !== 200) throw response;


                tracks = normalizeYoutubeResponse(response.data.items);
            } catch (error) {
                console.error('error youtube ==>', error);
            }
            break;
        case "Podcast":
            res = await fetch("https://listen-api.listennotes.com/api/v2/search?type=episode&q=" + encodeURIComponent(name), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-ListenAPI-Key': process.env.LISTENNOTE_KEY || ''
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

function normalizeYoutubeResponse(data: any): Array<Track> {
    return data.map((data: any) => {
        return {
            title: data.snippet.title,
            icon: data.snippet.thumbnails.medium.url,
            url: `https://www.youtube.com/watch?v=${data.id.videoId}`,
            description: data.snippet.description
        };
    });
}