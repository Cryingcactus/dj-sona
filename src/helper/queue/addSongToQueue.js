const queryQueue = require("./queryQueue");
const updateQueue = require("./updateQueue");

const addSongToQueue = async function (guildId, song) {
    try {
        const queue = await queryQueue(guildId);
        queue.L.push({ M: song });
        updateQueue(guildId, queue);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = addSongToQueue;
