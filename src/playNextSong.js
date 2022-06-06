const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const playNextSong = async function (event, context) {
    const body = JSON.parse(event.body);
    const { guildId } = body;

    const params = {
        ExpressionAttributeValues: {
            ":v1": {
                S: guildId,
            },
        },
        KeyConditionExpression: "guildId = :v1",
        ProjectionExpression: "queue, duration, numberOfSongs",
        TableName: process.env.QUEUE_TABLE_NAME,
    };
    let queue;
    await dynamodb
        .query(params, function (err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data.Items);
                queue = [...data.Items];
                queue.shift()
                if (!items.length) {
                    console.log("doing nothing");
                } else {
                    await dynamodb
                    .putItem({
                        TableName: process.env.QUEUE_TABLE_NAME,
                        Item: {
                            guildId: { S: guildId },
                            queue: { S: queue },
                            duration: { S: requestedSong },
                            numberOfSongs: { N: `${queue.length}` },
                            updatedAt: { N: `${new Date().getTime()}` },
                        }
                    })
                    .promise();
                }
            }
        })
        .promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                content: `Now playing ${queue[0]} in guild ${guildId}`,
                embeds: [],
                allowed_mentions: { parse: [] },
            },
        }),
    };
    console.log(response);
    return response;
};

module.exports.handler = playNextSong;
