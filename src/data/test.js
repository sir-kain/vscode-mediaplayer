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
getPodcastById();


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

searchPodcastByName()


[
  {
    rss: "https: //www.listennotes.com/c/r/9226c34d9de84dbc8accd9f61ae1a585",
    description_highlighted:
      '...<span class="ln-search-highlight">Adventures</span> <span class="ln-search-highlight">in</span> <span class="ln-search-highlight">Angular</span> is a weekly podcast about developments <span class="ln-search-highlight">in</span> the <span class="ln-search-highlight">Angular</span> community, tools, techniques, and ecosystem.',
    description_original:
      "\n      Adventures in Angular is a weekly podcast about developments in the Angular community, tools, techniques, and ecosystem.\n    ",
    title_highlighted:
      '<span class="ln-search-highlight">Adventures</span> <span class="ln-search-highlight">in</span> <span class="ln-search-highlight">Angular</span>',
    title_original: "Adventures in Angular",
    publisher_highlighted: "DevChat.tv",
    publisher_original: "DevChat.tv",
    image:
      "https: //cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
    thumbnail:
      "https: //cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
    itunes_id: 1238024888,
    latest_pub_date_ms: 1560852000000,
    earliest_pub_date_ms: 1406811600239,
    id: "9226c34d9de84dbc8accd9f61ae1a585",
    genre_ids: [93, 94, 128, 131, 127],
    listennotes_url:
      "https: //www.listennotes.com/c/9226c34d9de84dbc8accd9f61ae1a585/",
    total_episodes: 245,
    email: "chuck@devchat.tv",
    explicit_content: false
  },
  {
    rss: "https: //www.listennotes.com/c/r/49bb51784f904baf8317cdc25d362b6d",
    description_highlighted:
      '...All <span class="ln-search-highlight">Angular</span> podcasts produced by Devchat.tv:\n - <span class="ln-search-highlight">Adventures</span> <span class="ln-search-highlight">in</span> <span class="ln-search-highlight">Angular</span>\n - My <span class="ln-search-highlight">Angular</span> Story\n - <span class="ln-search-highlight">Angular</span> Rants',
    description_original:
      "\n      All Angular podcasts produced by Devchat.tv:\n - Adventures in Angular\n - My Angular Story\n - Angular Rants\n    ",
    title_highlighted:
      'All <span class="ln-search-highlight">Angular</span> Podcasts by Devchat.tv',
    title_original: "All Angular Podcasts by Devchat.tv",
    publisher_highlighted: "Devchat.tv",
    publisher_original: "Devchat.tv",
    image:
      "https: //cdn-images-1.listennotes.com/podcasts/all-angular-podcasts-by-devchattv-devchattv-HY9pVC1BdAU.300x300.jpg",
    thumbnail:
      "https: //cdn-images-1.listennotes.com/podcasts/all-angular-podcasts-by-devchattv-devchattv-HY9pVC1BdAU.300x300.jpg",
    itunes_id: 907361052,
    latest_pub_date_ms: 1560852000000,
    earliest_pub_date_ms: 1406811600313,
    id: "49bb51784f904baf8317cdc25d362b6d",
    genre_ids: [128, 131, 127],
    listennotes_url:
      "https: //www.listennotes.com/c/49bb51784f904baf8317cdc25d362b6d/",
    total_episodes: 325,
    email: null,
    explicit_content: false
  },
  {
    rss: "https://www.listennotes.com/c/r/27d9e92800a440cab1f9466ec053f970",
    description_highlighted:
      '...Marcel studierte Wirtschaftskommunikation und ist überzeugter Slow-Blogger, Fachautor und schreibt Artikel über SEM, Kommunikation und die <span class="ln-search-highlight">moderne</span> Welt des <span class="ln-search-highlight">Web</span> 2.0.',
    description_original:
      "Marcel Schrepel ist Geschäftsführer der Performance-Marketing-Agentur trust in time in Berlin. Marcel studierte Wirtschaftskommunikation und ist überzeugter Slow-Blogger, Fachautor und schreibt Artikel über SEM, Kommunikation und die moderne Welt des Web 2.0.\n\nIn seinem Podcast spricht er über das Agenturleben und über digitale Themen.",
    title_highlighted: "Agenturensohn",
    title_original: "Agenturensohn",
    publisher_highlighted: "Marcel Schrepel",
    publisher_original: "Marcel Schrepel",
    image:
      "https://cdn-images-1.listennotes.com/podcasts/agenturensohn-marcel-schrepel-IX9NmHVp7iA.300x300.jpg",
    thumbnail:
      "https://cdn-images-1.listennotes.com/podcasts/agenturensohn-marcel-schrepel-IX9NmHVp7iA.300x300.jpg",
    itunes_id: 1442679622,
    latest_pub_date_ms: 1558184759000,
    earliest_pub_date_ms: 1542231825000,
    id: "27d9e92800a440cab1f9466ec053f970",
    genre_ids: [127],
    listennotes_url:
      "https://www.listennotes.com/c/27d9e92800a440cab1f9466ec053f970/",
    total_episodes: 9,
    email: "marcel.schrepel@trust-in-time.com",
    explicit_content: false
  },
  {
    rss: "https://www.listennotes.com/c/r/dbe7531508d5472d84641c3cf79ebe04",
    description_highlighted:
      '...<span class="ln-search-highlight">Modern</span> <span class="ln-search-highlight">Web</span> is a podcast that explores next generation frameworks, standards, and techniques. Visit http://<span class="ln-search-highlight">modern</span>-web.org for more.',
    description_original:
      "Modern Web is a podcast that explores next generation frameworks, standards, and techniques. Visit http://modern-web.org for more.",
    title_highlighted:
      '<span class="ln-search-highlight">Modern</span> <span class="ln-search-highlight">Web</span>',
    title_original: "Modern Web",
    publisher_highlighted: "Tracy Lee",
    publisher_original: "Tracy Lee",
    image:
      "https://cdn-images-1.listennotes.com/podcasts/modern-web-tracy-lee-04ZkHNga9vS.300x300.jpg",
    thumbnail:
      "https://cdn-images-1.listennotes.com/podcasts/modern-web-tracy-lee-04ZkHNga9vS.300x300.jpg",
    itunes_id: 1084236187,
    latest_pub_date_ms: 1557933657000,
    earliest_pub_date_ms: 1455477000000,
    id: "dbe7531508d5472d84641c3cf79ebe04",
    genre_ids: [129, 127],
    listennotes_url:
      "https://www.listennotes.com/c/dbe7531508d5472d84641c3cf79ebe04/",
    total_episodes: 73,
    email: "tracy@modern-web.org",
    explicit_content: false
  }
];






// -----------------------------------------------------

{
  id: "9226c34d9de84dbc8accd9f61ae1a585",
  "title": "Adventures in Angular",
  "publisher": "DevChat.tv",
  "image": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
  "thumbnail": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
  "listennotes_url": "https://www.listennotes.com/c/9226c34d9de84dbc8accd9f61ae1a585/",
  "total_episodes": 245,
  "explicit_content": false,
  "description": "\n      Adventures in Angular is a weekly podcast about developments in the Angular community, tools, techniques, and ecosystem.\n    ",
  "itunes_id": 1238024888,
  "rss": "https://www.listennotes.com/c/r/9226c34d9de84dbc8accd9f61ae1a585",
  "latest_pub_date_ms": 1560852000000,
  "earliest_pub_date_ms": 1406811600239,
  "language": "English",
  "country": "United States",
  "website": "http://www.adventuresinangular.com?utm_source=listennotes.com&utm_campaign=Listen+Notes&utm_medium=website",
  "extra": {
    "twitter_handle": "",
    "facebook_handle": "",
    "instagram_handle": "",
    "wechat_handle": "",
    "patreon_handle": "",
    "youtube_url": "",
    "linkedin_url": "",
    "spotify_url": "",
    "google_url": "",
    "url1": "",
    "url2": "",
    "url3": ""
  },
  "is_claimed": false,
  "email": "chuck@devchat.tv",
  "looking_for": {
    "sponsors": false,
    "guests": false,
    "cohosts": false,
    "cross_promotion": false
  },
  "genre_ids": [
    67,
    93,
    94,
    128,
    131,
    127
  ],
  "episodes": [
    {
      "id": "c02169f2d4124ba9a7831f8d020348ae",
      "title": "AiA 244:  Kubernetes, Docker and Devops with Jessica Deen LIVE from Microsoft BUILD",
      "description": "<h2><strong>Sponsors</strong></h2>\n\n<ul>\n\t<li><a href=\"https://sentry.io/welcome/\">Sentry&nbsp;</a>use the code &ldquo;devchat&rdquo; for 2 months free on Sentry small plan</li>\n\t<li><a href=\"https://angularbootcamp.com/\">Angular Bootcamp</a></li>\n\t<li><a href=\"https://triplebyte.com/angular\">Triplebyte&nbsp;</a>offers a $1000 signing bonus</li>\n\t<li><a href=\"https://www.cachefly.com/\">CacheFly</a></li>\n</ul>\n\n<p><strong>Panel</strong></p>\n\n<ul>\n\t<li>Charles Max Wood</li>\n</ul>\n\n<p><strong>Joined by Special Guest:</strong> Jessica Deen</p>\n\n<h3><strong>Episode Summary</strong></h3>\n\n<p>Coming to you live from the podcast booth at Microsoft BUILD is Charles Max Wood with <a href=\"https://jessicadeen.com/\">The Deen of DevOps</a> aka Jessica Deen. Jessica is a Senior Cloud Advocate at Microsoft. As an advocate she acts a liaison between developer communities and Microsoft to help understand developer pain points and road blocks especially in areas such as Linux, open-source technologies, infrastructure, Kubernetes, containers and DevOps. Jessica explains how to go about setting up a containerized application, Kubernetes and how to use <a href=\"https://docs.microsoft.com/en-us/virtualization/...docker/manage-windows-dockerfile\">Dockerfiles</a>. Charles and Jessica then talk about how to get started with a Kubernetes cluster and the resources available for developers that don&#39;t have any infrastructure. Jessica advises that developers start with <a href=\"https://azure.microsoft.com/en-in/services/devops/\">Azure DevOps Services </a>and then go to <u><a href=\"https://www.microsoft.com/en-us/build\">Microsoft Learn Resource</a>.</u></p>\n\n<p>Charles also encourages listeners to also check out the Views on Vue podcast <a href=\"https://devchat.tv/views-on-vue/vov-053-azure-devops-with-donovan-brown-live-at-microsoft-ignite/\" rel=\"bookmark\" title=\"VoV 053: Azure DevOps with Donovan Brown LIVE at Microsoft Ignite\">Azure DevOps with Donovan Brown</a> for further references. Jessica also recommends following people on Twitter and GitHub to find out about solutions and resources.</p>\n\n<h3><strong>Links</strong></h3>\n\n<ul>\n\t<li><u><a href=\"https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-docker/manage-windows-dockerfile\">Dockerfile and Windows Containers </a></u></li>\n\t<li><u><a href=\"https://kubernetes.io/\">Kubernetes</a></u></li>\n\t<li><u><a href=\"https://github.com/jldeen\">Jessica&rsquo;s GitHub</a></u></li>\n\t<li><u><a href=\"https://twitter.com/jldeen?lang=en\">Jessica&rsquo;s Twitter</a></u></li>\n\t<li><u><a href=\"https://www.linkedin.com/in/jldeen/\">Jessica&rsquo;s LinkedIn</a></u></li>\n\t<li><u><a href=\"https://jessicadeen.com/\">Jessica&rsquo;s Website</a></u></li>\n\t<li><u><a href=\"https://www.microsoft.com/en-us/build\">Microsoft Build 2019 &nbsp;</a></u></li>\n\t<li><u><a href=\"https://www.microsoft.com/en-us/build\">Microsoft Learn Resource</a></u></li>\n\t<li><a href=\"https://docs.microsoft.com/en-us/azure/aks/http-application-routing\">HTTP application routing</a></li>\n\t<li><a href=\"https://www.youtube.com/watch?v=aN9nVa8yeBo&amp;t=16s\">Getting started with Kubernetes Ingress Controllers and TLS certificates</a></li>\n\t<li><a href=\"https://jessicadeen.com/kubernetes-ingress-controllers-and-certificates-the-walkthrough/\">Kubernetes Ingress Controllers and Certificates: The Walkthrough&nbsp;</a></li>\n\t<li><a href=\"https://azure.microsoft.com/en-in/services/devops/\">Azure DevOps Services&nbsp;</a></li>\n\t<li><a href=\"https://devchat.tv/views-on-vue/vov-053-azure-devops-with-donovan-brown-live-at-microsoft-ignite/\" rel=\"bookmark\" title=\"VoV 053: Azure DevOps with Donovan Brown LIVE at Microsoft Ignite\">VoV 053: Azure DevOps with Donovan Brown LIVE at Microsoft Ignite</a></li>\n\t<li><a href=\"https://www.youtube.com/channel/UC-RjyheFSQPAv-MyY0STSIQ\">Jessica Deen Youtube</a></li>\n\t<li>\n\t<p><a href=\"https://www.youtube.com/watch?v=PH-2FfFD2PU\">Kubernetes in 5 mins - YouTube</a><u> </u></p>\n\t</li>\n\t<li>\n\t<p><u><a href=\"https://www.microsoft.com/en-us/build\">Follow Adventures in Angular on&nbsp;</a><a href=\"https://devchat.tv/adv-in-angular/\">tv</a>,&nbsp;<a href=\"https://www.facebook.com/adventuresinangular/\">Facebook&nbsp;</a>and&nbsp;<a href=\"https://twitter.com/angularpodcast\">Twitter</a>.</u></p>\n\t</li>\n</ul>\n\n<h3><strong>Picks</strong></h3>\n\n<p><strong>Jessica Deen:</strong></p>\n\n<ul>\n\t<li><a href=\"https://twitter.com/LachlanEvenson\">Lachlan Evenson</a></li>\n\t<li><a href=\"https://www.cncf.io/\">Cloud Native Computing Foundation</a></li>\n\t<li>Kubernetes Handles on Twitter</li>\n\t<li><a href=\"https://www.amazon.com/Shoe-Dog-Memoir-Creator-Nike-ebook/dp/B0176M1A44\">Shoe Dog Memoir</a></li>\n\t<li><a href=\"https://www.nikesalezone.com/air-jordan-4-fire-red-gum-singles-day-av3914-600-mens-winter-basketball-shoes-p-9506.html\">Air Jordan 4 Fire Red Gum Singles Day</a></li>\n</ul>\n\n<p><strong>Charles Max Wood:</strong></p>\n\n<ul>\n\t<li><a href=\"https://johnpapa.net/tag/real-talk-javascript/\">Real Talk /JavaScript Podcast</a></li>\n\t<li><a href=\"https://www.zelda.com/breath-of-the-wild/\">The Legend of Zelda: Breath of the Wild</a></li>\n</ul>\n\n<p>&nbsp;</p>",
      "pub_date_ms": 1560852000000,
      "audio": "https://www.listennotes.com/e/p/c02169f2d4124ba9a7831f8d020348ae/",
      "audio_length_sec": 2447,
      "listennotes_url": "https://www.listennotes.com/e/c02169f2d4124ba9a7831f8d020348ae/",
      "image": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "thumbnail": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "maybe_audio_invalid": false,
      "listennotes_edit_url": "https://www.listennotes.com/e/c02169f2d4124ba9a7831f8d020348ae/#edit",
      "explicit_content": false
    },
    {
      "id": "09c964643765411ca404cfb943aa2386",
      "title": "AiA 243:  Lazy loading in Angular (with Angular Elements) with Juri Strumpflohner",
      "description": "<h2><strong>Sponsors</strong></h2>\n\n<ul>\n\t<li><a href=\"https://sentry.io/welcome/\">Sentry&nbsp;</a>use the code &ldquo;devchat&rdquo; for 2 months free on Sentry small plan</li>\n\t<li><a href=\"https://angularbootcamp.com/\">Angular Bootcamp</a></li>\n\t<li><a href=\"https://triplebyte.com/angular\">Triplebyte&nbsp;</a>offers a $1000 signing bonus</li>\n\t<li><a href=\"https://www.cachefly.com/\">CacheFly</a></li>\n</ul>\n\n<h3><strong>Panel</strong></h3>\n\n<ul>\n\t<li>Aaron Frost</li>\n\t<li>Joe Eames</li>\n\t<li>Brian Love</li>\n</ul>\n\n<p><strong>Joined by Special Guest:</strong>&nbsp;Juri Strumpflohner</p>\n\n<h3><strong>Episode Summary</strong></h3>\n\n<p>A fun conversation about how to lazy load Angular modules with Juri Strumpflohner, a software developer with more 10 years of experience in technologies like Java, .Net and Node.js. Juri is also a &nbsp;<a href=\"https://developers.google.com/experts/people/juri-strumpflohner\">Google Developer Expert in Web Tech</a>&nbsp;and an&nbsp;<a href=\"https://egghead.io/instructors/juri-strumpflohner\">Egghead.io Instructor</a>.</p>\n\n<h3><strong>Links</strong></h3>\n\n<ul>\n\t<li><u><a href=\"https://devchat.tv/my-angular-story/mas-045-juri-strumpflohner/\">My Angular Story 045: Juri Strumpflohner</a></u></li>\n\t<li><u><a href=\"https://devchat.tv/adv-in-angular/aia-193-angular-libraries-with-juri-strumpflohner/\">Adventures in Angular 193: Angular Libraries with Juri Strumpflohner</a> </u></li>\n\t<li><u><a href=\"https://twitter.com/juristr?lang=en\">Juri&#39;s Twitter</a></u></li>\n\t<li><a href=\"https://juristr.com/\">Juri&#39;s Website</a></li>\n\t<li><a href=\"https://www.google.com/search?q=Juri+Strumpflohner&amp;oq=Juri+Strumpflohner&amp;aqs=chrome..69i57j69i60j69i59l2j69i60j69i61.212j0j4&amp;sourceid=chrome&amp;ie=UTF-8\">Juri&rsquo;s GitHub</a></li>\n\t<li><u><a href=\"https://egghead.io/instructors/juri-strumpflohner\">Juri&rsquo;s Egghead Courses</a></u></li>\n\t<li><u><a href=\"https://www.npmjs.com/package/@herodevs/hero-loader\">&lt;hero-loader&gt; for lazy loading in Angular</a></u></li>\n\t<li><u><a href=\"https://www.npmjs.com/package/@herodevs/lazy-af\">&lt;lazy-af&gt; for lazy loading in Angular</a></u></li>\n\t<li><u><a href=\"https://thinkster.io/\">https://thinkster.io/</a></u></li>\n\t<li>Follow Adventures in Angular on&nbsp;<a href=\"https://devchat.tv/adv-in-angular/\">tv</a>,&nbsp;<a href=\"https://www.facebook.com/adventuresinangular/\">Facebook&nbsp;</a>and&nbsp;<a href=\"https://twitter.com/angularpodcast\">Twitter</a>.</li>\n</ul>\n\n<h3><strong>Picks</strong></h3>\n\n<p><strong>Aaron Frost:</strong></p>\n\n<ul>\n\t<li><u>John Wick: Chapter 3 - Parabellum (2019) &ndash; IMDb</u></li>\n\t<li><u><a href=\"https://www.imdb.com/title/tt2139881/\">Long Shot (2019) - IMDb</a></u></li>\n</ul>\n\n<p><strong>Brian Love:</strong></p>\n\n<ul>\n\t<li><u><a href=\"http://www.segway.com/products/consumer-lifestyle/es1-kickscooter\">Ninebot KickScooter by Segway</a> </u></li>\n\t<li><u><a href=\"http://www.segway.com/products/consumer-lifestyle/es1-kickscooter\">Ninebot KickScooter by Segway ES1</a></u></li>\n\t<li><u>Joe Eames </u></li>\n</ul>\n\n<p><strong>Joe Eames:</strong></p>\n\n<ul>\n\t<li><u>Star Wars: A New Hope Symphony Orchestra </u></li>\n\t<li><u><a href=\"https://anki.com/en-us/vector.html\">Anki Vector | The Home Robot With Interactive AI Technology |&nbsp;</a></u></li>\n</ul>\n\n<p><strong>Juri Strumpflohner:</strong></p>\n\n<ul>\n\t<li><a href=\"https://www.youtube.com/channel/UCm9iiIfgmVODUJxINecHQkA\">ng-conf</a><a href=\"https://www.youtube.com/channel/UCm9iiIfgmVODUJxINecHQkA\"> talks</a></li>\n\t<li><a href=\"https://juristr.com/blog/2019/04/state-lazy-loading-components-angular/\">Lazy load Angular Components</a></li>\n</ul>\n\n<p>&nbsp;</p>",
      "pub_date_ms": 1560247200000,
      "audio": "https://www.listennotes.com/e/p/09c964643765411ca404cfb943aa2386/",
      "audio_length_sec": 3790,
      "listennotes_url": "https://www.listennotes.com/e/09c964643765411ca404cfb943aa2386/",
      "image": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "thumbnail": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "maybe_audio_invalid": false,
      "listennotes_edit_url": "https://www.listennotes.com/e/09c964643765411ca404cfb943aa2386/#edit",
      "explicit_content": false
    },
    {
      "id": "f645477735cc490ea1deeb019b35187b",
      "title": "AiA 242- Azure Functions Part II with Jeff Hollan LIVE at Microsoft BUILD",
      "description": "<h2><strong>Sponsors</strong></h2>\n\n<ul>\n\t<li><a href=\"https://sentry.io/welcome/\">Sentry&nbsp;</a>use the code &ldquo;devchat&rdquo; for 2 months free on Sentry small plan</li>\n\t<li><a href=\"https://angularbootcamp.com/\">Angular Bootcamp</a></li>\n\t<li><a href=\"https://triplebyte.com/angular\">Triplebyte&nbsp;</a>offers a $1000 signing bonus</li>\n\t<li><a href=\"https://www.cachefly.com/\">CacheFly</a></li>\n</ul>\n\n<h3><strong>Panel</strong></h3>\n\n<ul>\n\t<li>Charles Max Wood</li>\n</ul>\n\n<p><strong>Joined by Special Guest:</strong>&nbsp;Jeff Hollan</p>\n\n<h3><strong>Episode Summary</strong></h3>\n\n<p>Coming to you live from the podcast booth at Microsoft BUILD is Charles Max Wood with Jeff Hollan. Jeff is a Sr. Program Manager for the Azure Functions cloud service. Continuing from where Colby Tresness left off in <a href=\"https://devchat.tv/adv-in-angular/aia-241-azure-functions-with-colby-tresness-live-at-microsoft-build/\">Adventures in Angular 241: Azure Functions with Colby Tresness LIVE at Microsoft BUILD</a>, Jeff defines what &quot;serverless&quot; really means in developer world. Jeff also talks about various scenarios where Azure functions are extremely useful and explains what <a href=\"https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview\">Durable Functions</a> are.&nbsp;</p>\n\n<p>Jeff and Charles discuss creating and running an&nbsp;Azure function inside a container and the upcoming capabilities of Azure functions they are currently working on.</p>\n\n<h3><strong>Links</strong></h3>\n\n<ul>\n\t<li><a href=\"https://devchat.tv/adv-in-angular/aia-241-azure-functions-with-colby-tresness-live-at-microsoft-build/\">Adventures in Angular 241: Azure Functions with Colby Tresness LIVE at Microsoft BUILD&nbsp;</a></li>\n\t<li><a href=\"https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview\">Durable Functions</a></li>\n\t<li><u><a href=\"https://github.com/jeffhollan\">Jeff&rsquo;s GitHub</a></u></li>\n\t<li><u><a href=\"https://twitter.com/jeffhollan\">Jeff&rsquo;s Twitter</a></u></li>\n\t<li><u><a href=\"https://www.linkedin.com/in/jeffhollan\">Jeff&rsquo;s LinkedIn</a></u></li>\n\t<li><u><a href=\"https://hollan.io/\">Jeff&rsquo;s Website</a> </u></li>\n\t<li><u><a href=\"https://medium.com/@jeffhollan\">Jeff&rsquo;s Medium</a></u></li>\n\t<li><u>Microsoft Build 2019</u></li>\n\t<li>Follow Adventures in Angular on&nbsp;<a href=\"https://devchat.tv/adv-in-angular/\">tv</a>,&nbsp;<a href=\"https://www.facebook.com/adventuresinangular/\">Facebook&nbsp;</a>and&nbsp;<a href=\"https://twitter.com/angularpodcast\">Twitter</a>.</li>\n</ul>\n\n<h3><strong>Picks</strong></h3>\n\n<p><strong>Jeff Hollan</strong><strong>:</strong></p>\n\n<ul>\n\t<li><a href=\"https://www.calm.com/\">Calm App </a></li>\n\t<li><a href=\"https://www.imdb.com/title/tt0944947/\">Game of Thrones TV Series</a></li>\n</ul>\n\n<p><strong>Charles Max Wood:</strong></p>\n\n<ul>\n\t<li><a href=\"https://itunes.apple.com/us/app/familysearch-tree/id885982973?mt=8\">Family Tree App</a></li>\n</ul>\n\n<p>&nbsp;</p>\n\n<p>&nbsp;</p>",
      "pub_date_ms": 1559642400000,
      "audio": "https://www.listennotes.com/e/p/f645477735cc490ea1deeb019b35187b/",
      "audio_length_sec": 3233,
      "listennotes_url": "https://www.listennotes.com/e/f645477735cc490ea1deeb019b35187b/",
      "image": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "thumbnail": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "maybe_audio_invalid": false,
      "listennotes_edit_url": "https://www.listennotes.com/e/f645477735cc490ea1deeb019b35187b/#edit",
      "explicit_content": false
    },
    {
      "id": "a5b6a027b2674be8a24e5e8e16cdf433",
      "title": "AiA 241:   Azure Functions with Colby Tresness LIVE at Microsoft BUILD",
      "description": "<h2><strong>Sponsors</strong></h2>\n\n<ul>\n\t<li><a href=\"https://sentry.io/welcome/\">Sentry&nbsp;</a>use the code &ldquo;devchat&rdquo; for 2 months free on Sentry small plan</li>\n\t<li><a href=\"https://angularbootcamp.com/\">Angular Bootcamp</a></li>\n\t<li><a href=\"https://triplebyte.com/angular\">Triplebyte&nbsp;</a>offers a $1000 signing bonus</li>\n\t<li><a href=\"https://www.cachefly.com/\">CacheFly</a></li>\n</ul>\n\n<h3><strong>Panel</strong></h3>\n\n<ul>\n\t<li>Charles Max Wood</li>\n</ul>\n\n<p><strong>Joined by Special Guest:</strong>&nbsp;Colby Tresness</p>\n\n<h3><strong>Episode Summary</strong></h3>\n\n<p>Coming to you live from the podcast booth at Microsoft BUILD is Charles Max Wood with Colby Tresness. Colby is a Program Manager on Azure Functions at Microsoft. Azure functions are the serverless functions on Azure. Colby explains what the Azure functions premium plan entails, then talks about <a href=\"https://github.com/kedacore/keda\">KEDA</a> - Kubernetes-based event-driven autoscaling, a Microsoft and <a href=\"https://www.redhat.com/en\">Red Hat</a> partnered open source component to provide event-driven capabilities for any Kubernetes workload. One of the other cool features of serverless functions they talk about is the Azure serverless community <a href=\"https://www.serverlesslibrary.net/\">library</a>.</p>\n\n<p>Colby and Charles discuss the best way to get started with Azure functions, as well as the non-JavaScript languages it supports.</p>\n\n<h3><strong>Links</strong></h3>\n\n<ul>\n\t<li><u><a href=\"https://github.com/ColbyTresness\">Colby&rsquo;s GitHub</a></u></li>\n\t<li><u><a href=\"https://twitter.com/colbytresness?lang=en\">Colby&rsquo;s Twitter</a></u></li>\n\t<li><u><a href=\"https://www.linkedin.com/in/colbytresness/\">Colby&rsquo;s LinkedIn</a></u></li>\n\t<li><a href=\"https://azure.microsoft.com/id-id/blog/author/cotresne/\">Colby&rsquo;s Blog</a></li>\n\t<li><u>Microsoft Build 2019 </u></li>\n\t<li><u><a href=\"https://github.com/kedacore/keda\">KEDA</a> </u></li>\n\t<li><a href=\"https://www.redhat.com/en\">Red Hat</a></li>\n\t<li><u><a href=\"https://www.serverlesslibrary.net/\">Azure Serverless Community Library</a></u></li>\n\t<li>Follow Adventures in Angular on&nbsp;<a href=\"https://devchat.tv/adv-in-angular/\">tv</a>,&nbsp;<a href=\"https://www.facebook.com/adventuresinangular/\">Facebook&nbsp;</a>and&nbsp;<a href=\"https://twitter.com/angularpodcast\">Twitter</a>.</li>\n</ul>\n\n<h3><strong>Picks</strong></h3>\n\n<p><strong>Colby Tresness:</strong></p>\n\n<ul>\n\t<li><a href=\"https://www.imdb.com/title/tt5348176/\">Barry (TV Series 2018&ndash; ) - IMDb&nbsp;</a></li>\n</ul>\n\n<p><strong>Charles Max Wood:</strong></p>\n\n<ul>\n\t<li><a href=\"https://www.zelda.com/breath-of-the-wild/\">The Legend of Zelda: Breath of the Wild</a></li>\n\t<li><a href=\"https://andyfrisella.com/blogs/mfceo-project-podcast\">The MFCEO Project Podcast - Andy Frisella&nbsp;</a></li>\n\t<li>Downtown Seattle</li>\n</ul>",
      "pub_date_ms": 1559037600000,
      "audio": "https://www.listennotes.com/e/p/a5b6a027b2674be8a24e5e8e16cdf433/",
      "audio_length_sec": 2270,
      "listennotes_url": "https://www.listennotes.com/e/a5b6a027b2674be8a24e5e8e16cdf433/",
      "image": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "thumbnail": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "maybe_audio_invalid": false,
      "listennotes_edit_url": "https://www.listennotes.com/e/a5b6a027b2674be8a24e5e8e16cdf433/#edit",
      "explicit_content": false
    },
    {
      "id": "4226d9d495cb415980b6a8cf17ad4bdd",
      "title": "AiA 240: RxJS and Observable Forms in Angular with Sander Elias",
      "description": "<h2><strong>Sponsors</strong></h2>\n\n<ul>\n\t<li><a href=\"https://sentry.io/welcome/\">Sentry </a>use the code &ldquo;devchat&rdquo; for 2 months free on Sentry small plan</li>\n\t<li><a href=\"https://angularbootcamp.com/\">Angular Bootcamp</a></li>\n\t<li><a href=\"https://triplebyte.com/angular\">Triplebyte </a>offers a $1000 signing bonus</li>\n\t<li><a href=\"https://www.cachefly.com/\">CacheFly</a></li>\n</ul>\n\n<h3><strong>Panel</strong></h3>\n\n<ul>\n\t<li>Aaron Frost</li>\n\t<li>Shai Reznik</li>\n\t<li>Brian Love</li>\n</ul>\n\n<p><strong>Joined by Special Guest:</strong> Sander Elias</p>\n\n<h3><strong>Episode Summary</strong></h3>\n\n<p>In this episode of Adventures in Angular, the panel talks to Sander Elias, Senior Principal Engineer at <a href=\"https://herodevs.com/\">HeroDevs</a> from Netherlands. Sander is also an Angular Google GDE.</p>\n\n<p>Sander created <a href=\"https://github.com/SanderElias/ngObservableForm\">Observable forms</a>, an alternative way to do forms in Angular which takes advantage of what the platform has to offer.</p>\n\n<p>Aaron also talks about his speech at ng-conf 2019 and his follow up blog <a href=\"https://medium.com/@frosty/my-most-regrettable-conference-talk-8a8fdbe338d1\">post</a> about the speech and why he felt the need to write it.</p>\n\n<h3><strong>Links</strong></h3>\n\n<ul>\n\t<li><u><a href=\"https://github.com/SanderElias\">Sander&rsquo;s GitHub</a></u></li>\n\t<li><u>Sander&rsquo;s Twitter </u></li>\n\t<li><u>Sander&rsquo;s LinkedIn </u></li>\n\t<li><a href=\"https://medium.com/@esosanderelias\">Sander&rsquo;s Medium</a></li>\n\t<li><a href=\"https://www.youtube.com/watch?v=n-RTxeyLbsk\">ng-conf 2019</a></li>\n\t<li><a href=\"https://www.youtube.com/watch?v=JCjyjdlaoaI&amp;t=5s\">Sander Elias - ng-conf</a></li>\n\t<li><a href=\"https://github.com/SanderElias/ngObservableForm\">ObservableForm GitHub </a></li>\n\t<li><a href=\"https://medium.com/@frosty/my-most-regrettable-conference-talk-8a8fdbe338d1\">Aaron Frost Blog Piece</a></li>\n\t<li>Follow Adventures in Angular on&nbsp;<a href=\"https://devchat.tv/adv-in-angular/\">tv</a>,&nbsp;<a href=\"https://www.facebook.com/adventuresinangular/\">Facebook </a>and&nbsp;<a href=\"https://twitter.com/angularpodcast\">Twitter</a>.</li>\n</ul>\n\n<h3><strong>Picks</strong></h3>\n\n<p><strong>Sander Elias:</strong></p>\n\n<ul>\n\t<li><a href=\"https://www.youtube.com/watch?v=n-RTxeyLbsk\">ng-conf 2019 </a></li>\n\t<li><a href=\"https://github.com/tc39/proposal-decorators\">https://github.com/tc39/proposal-decorators</a></li>\n\t<li><a href=\"https://dev.to/lacolaco/network-aware-preloading-strategy-for-angular-lazy-loading-4hae\">Suguru&#39;s Blog</a></li>\n\t<li><a href=\"https://angular.io/guide/releases\">Angular 8 Release </a></li>\n</ul>\n\n<p><strong>Aaron Frost:</strong></p>\n\n<ul>\n\t<li><a href=\"https://www.youtube.com/watch?v=lgGpU_o8Kqw\">A is for Angular | Jo Hanna Pearce </a></li>\n\t<li><a href=\"https://www.ng-conf.org/2019/speakers/melina-mejia-bedoya/\">Melina Mejia</a></li>\n</ul>\n\n<p><strong>Brian Love:</strong></p>\n\n<ul>\n\t<li><a href=\"https://www.youtube.com/watch?v=n-RTxeyLbsk\">ng-conf 2019</a></li>\n\t<li><a href=\"https://www.ng-conf.org/2019/speakers/reid-villeneuve/\">Reid Villeneuve </a></li>\n\t<li><a href=\"https://www.imdb.com/title/tt4154796/\">Avengers: Endgame (2019)</a></li>\n</ul>\n\n<p><strong>Shai Reznik:</strong></p>\n\n<ul>\n\t<li><a href=\"https://www.youtube.com/watch?v=n-RTxeyLbsk\">ng-conf 2019</a></li>\n\t<li><a href=\"https://www.youtube.com/watch?v=lgGpU_o8Kqw\">A is for Angular | Jo Hanna Pearce &nbsp;</a></li>\n\t<li><a href=\"https://www.youtube.com/channel/UCnUYZLuoy1rq1aVMwx4aTzw\">Chrome Developers Channel</a></li>\n\t<li><a href=\"https://www.youtube.com/watch?v=zsnc0vkwWRk\">Michio Kaku on The Future of Humanity</a></li>\n\t<li><a href=\"https://www.16personalities.com/\">https://www.16personalities.com/</a></li>\n</ul>\n\n<p>&nbsp;</p>\n\n<p>&nbsp;</p>",
      "pub_date_ms": 1558432800000,
      "audio": "https://www.listennotes.com/e/p/4226d9d495cb415980b6a8cf17ad4bdd/",
      "audio_length_sec": 3233,
      "listennotes_url": "https://www.listennotes.com/e/4226d9d495cb415980b6a8cf17ad4bdd/",
      "image": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "thumbnail": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "maybe_audio_invalid": false,
      "listennotes_edit_url": "https://www.listennotes.com/e/4226d9d495cb415980b6a8cf17ad4bdd/#edit",
      "explicit_content": false
    },
    {
      "id": "915d670a95a9435a9b0d0aad6f63ba1e",
      "title": "AiA 239: Live at ng-conf",
      "description": "<h2 dir=\"ltr\"><strong>Sponsors</strong></h2>\n\n<ul>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://sentry.io/welcome/\">Sentry</a> use the code &ldquo;devchat&rdquo; for $100 credit</strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://angularbootcamp.com/\">Angular Bootcamp</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://triplebyte.com/angular\">Triplebyte</a> offers a $1000 signing bonus</strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://www.cachefly.com/\">CacheFly</a></strong></p>\n\t</li>\n</ul>\n\n<h3 dir=\"ltr\"><strong>Panel</strong></h3>\n\n<ul>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong>Aaron Frost</strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong>Charles Max Wood</strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong>Joe Eames</strong></p>\n\t</li>\n</ul>\n\n<p dir=\"ltr\"><strong>Joined by special guests: Bill Odom, Daniel Kilburn, Niall Crosby.</strong></p>\n\n<h3 dir=\"ltr\"><strong>Episode Summary</strong></h3>\n\n<p dir=\"ltr\"><strong>This episode of Adventures in Angular comes to you live from ng-conf 2019. Niall Crosby, CEO at ag-Grid, talks about how he started the company and what they work on. The panel then talks to a number of guests at the conference, including the volunteers, organizers and attendees and have interesting conversations about the work they do, what made them come to the conference and what they like about it. They talk about the workshops being conducted, give listeners tips on learning angular and one of the speakers appeals to listeners for help in mentoring and sponsorship. They wrap up the podcast by each stating their favourite talks and moments at the conference and agree on the fact that the community is one of the best parts of Angular.</strong></p>\n\n<h3 dir=\"ltr\"><strong>Links</strong></h3>\n\n<ul>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://www.linkedin.com/in/niallcrosby/?originalSubdomain=uk\">Niall&rsquo;s Linkedin</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://twitter.com/melinamejia95\">Melina&rsquo;s Twitter</a></strong></p>\n\t</li>\n</ul>\n\n<p dir=\"ltr\"><strong>Follow Adventures in Angular on <a href=\"https://devchat.tv/adv-in-angular/\">Devchat.tv</a>, <a href=\"https://www.facebook.com/adventuresinangular/\">Facebook</a> and <a href=\"https://twitter.com/angularpodcast\">Twitter</a>.</strong></p>\n\n<p>&nbsp;</p>",
      "pub_date_ms": 1557828000000,
      "audio": "https://www.listennotes.com/e/p/915d670a95a9435a9b0d0aad6f63ba1e/",
      "audio_length_sec": 2305,
      "listennotes_url": "https://www.listennotes.com/e/915d670a95a9435a9b0d0aad6f63ba1e/",
      "image": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "thumbnail": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "maybe_audio_invalid": false,
      "listennotes_edit_url": "https://www.listennotes.com/e/915d670a95a9435a9b0d0aad6f63ba1e/#edit",
      "explicit_content": false
    },
    {
      "id": "db6ff096236b46b693ae901fc8337ffd",
      "title": "AiA 238:  Angular State w/ NgRx with Mike Ryan",
      "description": "<h2><strong>Sponsors</strong></h2>\n\n<ul>\n\t<li><a href=\"http://sentry.io/\">Sentry</a> use the code &ldquo;devchat&rdquo; for 2 months free on Sentry small plan</li>\n\t<li><a href=\"https://angularbootcamp.com/\">Angular Bootcamp</a></li>\n\t<li><a href=\"https://triplebyte.com/angular\">TripleByte</a> offers a $1000 signing bonus</li>\n\t<li><a href=\"https://www.cachefly.com/\">Cachefly</a></li>\n</ul>\n\n<h3><strong>Panel</strong></h3>\n\n<ul>\n\t<li>Aaron Frost</li>\n\t<li>Shai Reznik</li>\n</ul>\n\n<p>Joined by Special Guest: Mike Ryan</p>\n\n<h3><strong>Summary</strong></h3>\n\n<p>In this fun episode, Mike Ryan introduces NgRX and gives the backstory of his getting involved with the NgRx Core Team. The panel discusses use cases where using NgRx is the best choice. Shai Reznik wonders where the cult-like loyalty to NgRx comes from. Mike talks about the future of NgRx and the future of state management in general. The panel discusses Ivy and what it means for state management.</p>\n\n<h3><strong>Links</strong></h3>\n\n<ul>\n\t<li><a href=\"https://twitter.com/MikeRyanDev\">https://</a><a href=\"https://github.com/MikeRyanDev\">github</a><a href=\"https://twitter.com/MikeRyanDev\">twitter.com/MikeRyanDev</a></li>\n\t<li><a href=\"https://github.com/MikeRyanDev\">https://.com/MikeRyanDev</a></li>\n\t<li><a href=\"https://medium.com/@MikeRyanDev\">https://medium.com/@MikeRyanDev</a></li>\n\t<li><a href=\"https://www.facebook.com/adventuresinangular/\">https://www.facebook.com/adventuresinangular</a></li>\n\t<li><a href=\"https://twitter.com/angularpodcast\">https://twitter.com/angularpodcast</a></li>\n</ul>\n\n<h3><strong>Picks</strong></h3>\n\n<p><strong>Aaron Frost:</strong></p>\n\n<ul>\n\t<li>Biscoff Cookies</li>\n\t<li><a href=\"https://ngvikings.org/\">https://ngvikings.org/</a></li>\n\t<li><a href=\"https://angular-up.com/\">https://angular-up.com/</a></li>\n\t<li><a href=\"https://ng-bolivia.org/\">https://ng-bolivia.org/</a></li>\n\t<li><a href=\"https://www.rxjs.live/\">https://www.rxjs.live/</a></li>\n\t<li><a href=\"http://angulardenver.com/\">http://angulardenver.com/</a></li>\n\t<li><a href=\"https://www.angularconnect.com/\">https://www.angularconnect.com/</a></li>\n\t<li><a href=\"https://www.ng-conf.org/\">https://www.ng-conf.org/</a></li>\n</ul>\n\n<p><strong>Shai Reznik:</strong></p>\n\n<ul>\n\t<li><a href=\"https://www.youtube.com/watch?v=AdNJ3fydeao\">Rich Harris - Rethinking reactivity</a></li>\n\t<li><a href=\"https://www.youtube.com/watch?v=hHF33WGqQ5U\">Michel Weststrate - Modern React and the case for Reactive State Management</a></li>\n\t<li>Donuts</li>\n</ul>",
      "pub_date_ms": 1557223200001,
      "audio": "https://www.listennotes.com/e/p/db6ff096236b46b693ae901fc8337ffd/",
      "audio_length_sec": 3387,
      "listennotes_url": "https://www.listennotes.com/e/db6ff096236b46b693ae901fc8337ffd/",
      "image": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "thumbnail": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "maybe_audio_invalid": false,
      "listennotes_edit_url": "https://www.listennotes.com/e/db6ff096236b46b693ae901fc8337ffd/#edit",
      "explicit_content": false
    },
    {
      "id": "168807a45f39414581f572b94e8b053d",
      "title": "AiA 237:  More on RxJS with Deborah Kurata",
      "description": "<h2><strong>Sponsors</strong></h2>\n\n<ul>\n\t<li><a href=\"http://sentry.io/\">Sentry</a> use the code &ldquo;devchat&rdquo; for 2 months free on Sentry small plan</li>\n\t<li><a href=\"https://angularbootcamp.com/\">Angular Bootcamp</a></li>\n\t<li><a href=\"https://triplebyte.com/angular\">TripleByte</a> offers a $1000 signing bonus</li>\n\t<li><a href=\"https://www.cachefly.com/\">Cachefly</a></li>\n</ul>\n\n<h3><strong>Panel</strong></h3>\n\n<ul>\n\t<li>Aaron Frost</li>\n\t<li>Shai Reznik</li>\n</ul>\n\n<p>Joined by Special Guest: Deborah Kurata</p>\n\n<h3><strong>Summary</strong></h3>\n\n<p>Deborah Kurata talks about the benefits of using a reactive approach to developing with RxJS. She explains how to use RxJS to program reactively and shares her vision of patterns everywhere to make reactive programming easier. &nbsp;Shai Reznik asks a lot of great questions about switching to this approach and takes the stance of a new or student developer. Deborah and Aaron advocate for RxJS and debate the best ways to learn RxJs and implement reactive development. &nbsp;</p>\n\n<h3><strong>Links</strong></h3>\n\n<ul>\n\t<li><a href=\"https://herodevs.com/\">https://herodevs.com/</a></li>\n\t<li><a href=\"http://textangular.com/\">http://textangular.com/</a></li>\n\t<li><a href=\"https://school.hirez.io/\">https://school.hirez.io/</a></li>\n\t<li><a href=\"https://www.twitch.tv/frostydev\">https://www.twitch.tv/frostydev</a></li>\n\t<li><a href=\"https://github.com/DeborahK\">https://github.com/DeborahK</a></li>\n\t<li><a href=\"https://twitter.com/DeborahKurata\">https://twitter.com/DeborahKurata</a></li>\n\t<li><a href=\"https://www.facebook.com/adventuresinangular/\">https://www.facebook.com/adventuresinangular</a></li>\n\t<li><a href=\"https://twitter.com/angularpodcast\">https://twitter.com/angularpodcast</a></li>\n</ul>\n\n<h3><strong>Picks</strong></h3>\n\n<p><strong>Aaron Frost:</strong></p>\n\n<ul>\n\t<li><a href=\"https://www.rxjs.live/\">https://www.rxjs.live/</a></li>\n</ul>\n\n<p><strong>Shai Reznik:</strong></p>\n\n<ul>\n\t<li><a href=\"https://medium.com/@shairez/a-super-ninja-trick-to-learn-rxjss-switchmap-mergemap-concatmap-and-exhaustmap-forever-88e178a75f1b\">A Super Ninja Trick To Learn RxJS&rsquo;s &ldquo;switchMap&rdquo;, &ldquo;mergeMap&rdquo;, &ldquo;concatMap&rdquo; and &ldquo;exhaustMap&rdquo;, FOREVER!</a></li>\n</ul>\n\n<p><strong>Deborah Kurata:</strong></p>\n\n<ul>\n\t<li><a href=\"https://rxjs.dev/\">https://rxjs.dev/</a></li>\n</ul>",
      "pub_date_ms": 1556618400002,
      "audio": "https://www.listennotes.com/e/p/168807a45f39414581f572b94e8b053d/",
      "audio_length_sec": 3465,
      "listennotes_url": "https://www.listennotes.com/e/168807a45f39414581f572b94e8b053d/",
      "image": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "thumbnail": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "maybe_audio_invalid": false,
      "listennotes_edit_url": "https://www.listennotes.com/e/168807a45f39414581f572b94e8b053d/#edit",
      "explicit_content": false
    },
    {
      "id": "702ad09a6a9e4b7ab487070013f57fc8",
      "title": "AiA 236:  Getting Deeper into then CLI with Dave Müllerchen",
      "description": "<h2 dir=\"ltr\"><strong>Sponsors</strong></h2>\n\n<ul>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"http://sentry.io/\">Sentry</a> use the code &ldquo;devchat&rdquo; for 2 months free on Sentry small plan</strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://angularbootcamp.com/\">Angular Bootcamp</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://triplebyte.com/angular\">TripleByte</a> offers a $1000 signing bonus</strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://www.cachefly.com/\">Cachefly</a></strong></p>\n\t</li>\n</ul>\n\n<h3 dir=\"ltr\"><strong>Panel</strong></h3>\n\n<ul>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong>Aaron Frost</strong></p>\n\t</li>\n</ul>\n\n<p dir=\"ltr\"><strong>Special Guests: Dave M&uuml;llerchen and Mike Brocchi</strong></p>\n\n<h3 dir=\"ltr\"><strong>Episode Summary</strong></h3>\n\n<p dir=\"ltr\"><strong>Dave Mullerchen is a freelancer from Germany and does a lot of Angular workshops. Mike Brocchi&nbsp;works for Ultimate Software and works with Stencil to provide framework agnostic web components as a design language system. Today the panel is discussing the Angular CLI. </strong></p>\n\n<p dir=\"ltr\"><strong>Mike talks about exactly what Stencil.js is, a set of tools to spit out raw web components made by the Ionic folks. They discuss how Angular Elements stacks up to Stencil. Dave talks about the most important things the community needs to know about the Angular CLI, most importantly it can save you a lot of money. They each talk about their history with the CLI, and how they found that it increased speed and decreased bundle size. The panel finds Angular is less teachable than other languages, but the CLI is the key to making Angular teachable</strong></p>\n\n<p dir=\"ltr\"><strong>They go into detail about how the CLI can save money. They talk about some of the schematics available in the CLI and their usefulness, and which are their favorites. They end by mentioning that the schematics work off the file system, so it&rsquo;s not angular specific, and that the CLI makes discoverable schematics and can run analytics.</strong></p>\n\n<p dir=\"ltr\"><strong>Links</strong></p>\n\n<ul>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://github.com/angular/angular.js\">Angular</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://cli.angular.io/\">Angular CLI</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://github.com/ionic-team/stencil\">Stencil.js</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://github.com/ionic-team/ionic\">Ionic</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://github.com/gulpjs/gulp\">Gulp</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://github.com/Wixel/GUMP\">Gump</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://github.com/yeoman/yeoman\">Yeoman</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://github.com/broccolijs/broccoli\">Broccoli</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFBundles/AboutBundles/AboutBundles.html#//apple_ref/doc/uid/10000123i-CH100-SW1\">Bundle</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://github.com/basiljs/basil.js\">Basil</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://jestjs.io/\">Jest</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong>NDM- Network Data Mover</strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://github.com/manfredsteyer/ngx-build-plus\">NGX Build Plus</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://github.com/Zizzamia/perfume.js\">Perfume</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://github.com/280north/narwhal\">Narwhal</a></strong></p>\n\t</li>\n</ul>\n\n<h3 dir=\"ltr\"><strong>Picks</strong></h3>\n\n<p dir=\"ltr\"><strong>Aaron Frost:</strong></p>\n\n<ul>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"http://rxjs.live\">RXJS Live</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://www.youtube.com/watch?v=LV3oX4eroSY\">&ldquo;Like It Ain&rsquo;t Nothin&rdquo;</a> by Fergie</strong></p>\n\t</li>\n</ul>\n\n<p dir=\"ltr\"><strong>Shai Reznik:</strong></p>\n\n<ul>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong>HBO&rsquo;s Crashing </strong></p>\n\t</li>\n</ul>\n\n<p dir=\"ltr\"><strong>Dave M&uuml;llerchen:</strong></p>\n\n<ul>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://ng-de.org/\">NG-DE Conference 2019</a></strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong><a href=\"https://www.youtube.com/playlist?list=PLdLZVBn48n_BvWH-IECv1UZzQ8wk2DChr\">JavaScript fuer Kinder</a> YouTube Channel</strong></p>\n\t</li>\n</ul>\n\n<p dir=\"ltr\"><strong>Mike Brocchi:</strong></p>\n\n<ul>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong>&quot;ng doc ______&quot; to search angular.io docs via the command line</strong></p>\n\t</li>\n\t<li dir=\"ltr\">\n\t<p dir=\"ltr\"><strong>Live Share from the Visual Studio team, now out of preview</strong></p>\n\t</li>\n</ul>",
      "pub_date_ms": 1556013600003,
      "audio": "https://www.listennotes.com/e/p/702ad09a6a9e4b7ab487070013f57fc8/",
      "audio_length_sec": 3322,
      "listennotes_url": "https://www.listennotes.com/e/702ad09a6a9e4b7ab487070013f57fc8/",
      "image": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "thumbnail": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "maybe_audio_invalid": false,
      "listennotes_edit_url": "https://www.listennotes.com/e/702ad09a6a9e4b7ab487070013f57fc8/#edit",
      "explicit_content": false
    },
    {
      "id": "4e6f94665cb849f6b6a192bebdfc1ed6",
      "title": "AiA 235:  Functional Programming with Angular, NgRx with Raul Jimenez",
      "description": "<h2><strong>Sponsors</strong></h2>\n\n<ul>\n\t<li><a href=\"http://sentry.io/\">Sentry</a> use the code &ldquo;devchat&rdquo; for 2 months free on Sentry small plan</li>\n\t<li><a href=\"https://angularbootcamp.com/\">Angular Bootcamp</a></li>\n\t<li><a href=\"https://triplebyte.com/angular\">TripleByte</a> offers a $1000 signing bonus</li>\n\t<li><a href=\"https://www.cachefly.com/\">Cachefly</a></li>\n</ul>\n\n<h3><strong>Panel</strong></h3>\n\n<ul>\n\t<li>Shai Reznik</li>\n\t<li>Aaron Frost</li>\n\t<li>Joe Eames</li>\n</ul>\n\n<p>Joined by Special Guest: Raul Jimenez</p>\n\n<h3><strong>Summary</strong></h3>\n\n<p>Raul Jimenez, the CEO of Byte Default, answers the panels many questions on functional programming with NgRx. In this playful interview, Raul defines functional programming and what it is trying to solve. The panel discusses side effects using a Spiderman analogy. Raul shares the benefits of switching to and when to use NgRx. The importance of knowing RxJS in using NgRx is considered by the panel. The episode ends with an in-depth discussion on some the specifics of using NgRx for functional programming.</p>\n\n<h3><strong>Links</strong></h3>\n\n<ul>\n\t<li><a href=\"https://twitter.com/elecash\">https://twitter.com/elecash</a></li>\n\t<li><a href=\"https://www.facebook.com/adventuresinangular/\">https://www.facebook.com/adventuresinangular</a></li>\n\t<li><a href=\"https://twitter.com/angularpodcast\">https://twitter.com/angularpodcast</a></li>\n</ul>\n\n<h3><strong>Picks</strong></h3>\n\n<p><strong>Shai Reznik</strong></p>\n\n<ul>\n\t<li><a href=\"https://www.youtube.com/watch?v=B48Exq57Zg\">https://www.youtube.com/watch?v=B48Exq57Zg</a></li>\n</ul>\n\n<p><strong>Joe Eames</strong></p>\n\n<ul>\n\t<li><a href=\"https://thinkster.io/tutorials/five-essential-lessons-for-typescript-competence\">https://thinkster.io/tutorials/five-essential-lessons-for-typescript-competence</a></li>\n</ul>\n\n<p><strong>Aaron Frost</strong></p>\n\n<ul>\n\t<li><a href=\"https://www.rxjs.live/\">https://www.rxjs.live/</a></li>\n\t<li><a href=\"https://www.amazon.com/Go-Giver-Expanded-Little-Powerful-Business/dp/1591848288/ref=sr_1_1?ie=UTF8&amp;qid=1548462018&amp;sr=8-1&amp;linkCode=ll1&amp;tag=devchattv-20&amp;linkId=f06bfe7482dca8bb751ed6d7cc86e2ab&amp;language=en_US\">The Go-Giver, Expanded Edition: A Little Story About a Powerful Business Idea by Bob Burg</a></li>\n</ul>\n\n<p><strong>Raul Jimenez</strong></p>\n\n<ul>\n\t<li><a href=\"https://app.quicktype.io/\">https://app.quicktype.io/</a></li>\n\t<li><a href=\"https://www.ag-grid.com/\">https://www.ag-grid.com/</a></li>\n</ul>",
      "pub_date_ms": 1555408800004,
      "audio": "https://www.listennotes.com/e/p/4e6f94665cb849f6b6a192bebdfc1ed6/",
      "audio_length_sec": 3505,
      "listennotes_url": "https://www.listennotes.com/e/4e6f94665cb849f6b6a192bebdfc1ed6/",
      "image": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "thumbnail": "https://cdn-images-1.listennotes.com/podcasts/adventures-in-angular-devchattv-oIz7FxPYTlM.300x300.jpg",
      "maybe_audio_invalid": false,
      "listennotes_edit_url": "https://www.listennotes.com/e/4e6f94665cb849f6b6a192bebdfc1ed6/#edit",
      "explicit_content": false
    }
  ],
  "next_episode_pub_date": 1555408800004
}