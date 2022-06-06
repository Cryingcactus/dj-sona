const yts = require("yt-search");
const history = require("../tables/history");

async function search(requestedSong) {
    const results = await yts(requestedSong);
    const firstResult = results.all[0];
    return history({
        id: firstResult.videoId,
        requestUrl: firstResult.url,
        requestedSong: requestedSong,
        title: firstResult.title,
        seconds: firstResult.seconds,
        songDuration: firstResult.timestamp,
        image: firstResult.image,
        thumbnail: firstResult.thumbnail,
    });
}

module.exports = search;
