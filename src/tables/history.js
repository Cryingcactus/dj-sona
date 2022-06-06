function history({
    id,
    requestUrl,
    requestedSong,
    title,
    seconds,
    songDuration,
    image,
    thumbnail,
}) {
    return {
        id: { S: id },
        requestUrl: { S: requestUrl },
        requestedSong: { S: requestedSong },
        title: { S: title },
        seconds: { N: `${seconds}` },
        songDuration: { S: songDuration },
        image: { S: image },
        thumbnail: { S: thumbnail },
        createdAt: { N: `${new Date().getTime()}` },
    };
}

module.exports = history;
