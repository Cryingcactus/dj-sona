const queryQueue = require("./queryQueue");
const updateQueue = require("./updateQueue");

const removeSongFromQueue = async function (
    guildId,
    indexToRemove = 0,
    songsToRemove = 1,
) {
    try {
        const queue = await queryQueue(guildId);
        queue.slice(indexToRemove, songsToRemove);
        updateQueue(guildId, queue);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = removeSongFromQueue;
