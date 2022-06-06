const queryHistory = require("./helper/history/queryHistory");
const search = require("./helper/search");
const updateHistory = require("./helper/history/updateHistory");
const addSongToQueue = require("./helper/queue/addSongToQueue");

const requestSong = async function (event, context) {
    console.log("API endpoint: requestSong");
    const headers = event.headers;
    const { guildId } = headers;
    const body = JSON.parse(event.body);
    const { requestedSong } = body;

    let songInfo = await queryHistory(requestedSong);
    if (!songInfo) {
        songInfo = await search(requestedSong);
        await updateHistory(songInfo);
    }

    await addSongToQueue(guildId, songInfo);

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                content: `Added ${songInfo.title.S} to the queue table`,
                embeds: [],
                allowed_mentions: { parse: [] },
            },
        }),
    };
    console.log("Sending response from requestSong: ", response);
    return response;
};

module.exports.handler = requestSong;
