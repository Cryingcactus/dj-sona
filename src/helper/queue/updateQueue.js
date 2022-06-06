const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const updateQueue = async function (guildId, queue) {
    try {
        await dynamodb
            .putItem({
                TableName: process.env.QUEUE_TABLE_NAME,
                Item: {
                    guildId: { S: guildId },
                    queue: queue,
                    // duration: { S: requestedSong },
                    numberOfSongs: { N: `${queue.L.length}` },
                    updatedAt: { N: `${new Date().getTime()}` },
                },
            })
            .promise();
        return true;
    } catch (error) {
        console.error("Error in updateQueue", err);
        return false;
    }
};

module.exports = updateQueue;
