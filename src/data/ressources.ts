import fetch from 'node-fetch';
import { Track } from './models/Track';

// export async function fetchCategories(): Promise<Category[]> {
//     const res = await fetch("https://prod.ca-tests.com/category");
//     const json = await res.json();
//     return json;
// }

// export async function fetchCategory(uri: string): Promise<Category> {
//     const res = await fetch(uri);
//     const json = await res.json();
//     return json;
// }

export async function searchTracks(name: string): Promise<Track[]> {
    const res = await fetch("https://deezerdevs-deezer.p.rapidapi.com/search?q=" + encodeURIComponent(name), {
        headers: { 
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': "e04b319b2emsh34ce0fea1c09f20p10ce86jsn9658c95fd1b1",
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        },
    })
    const json = await res.json()    
    return json["data"]
}

// export async function fetchCategoryImageURL(name: string): Promise<string | undefined> {
//     const res = await fetch("https://en.wikipedia.org/w/index.php?action=render&title=" + encodeURIComponent(name))
//     const html = await res.text()
//     const urls = /upload.wikimedia.org[^"]+/.exec(html)
//     const picture = urls && urls.find(url => !url.endsWith(".svg.png"))
//     if (picture)
//         return "https://" + picture
// }