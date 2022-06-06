const AWS = require("aws-sdk");
const yts = require("yt-search");
const updateQueue = require("./helper/queue/addSongToQueue");
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const appValidation = async function (event, context) {
    const headers = event.headers;
    const { guildId } = headers;

    const body = JSON.parse(event.body);
    const { requestedSong } = body;

    const params = {
        ExpressionAttributeValues: {
            ":v1": {
                S: requestedSong,
            },
        },
        KeyConditionExpression: "requestedSong = :v1",
        ProjectionExpression:
            "id, songDuration, image, seconds, thumbnail, title, requestUrl",
        TableName: process.env.HISTORY_TABLE_NAME,
    };
    let ytResult;
    await dynamodb
        .query(params, async function (err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data.Items);
                ytResult = { ...data.Items[0] };
                console.log(ytResult);
                if (!Object.keys(ytResult).length) {
                    console.log(
                        "request info on song and add it to this table",
                    );
                    ytResult = await yts(requestedSong);
                    ytResult = ytResult.all[0];
                    ytResult.songDuration = ytResult.timestamp;
                    ytResult.requestUrl = ytResult.url;
                } else {
                    ytResult.videoId = ytResult.id.S;
                    ytResult.requestUrl = ytResult.requestUrl.S;
                    ytResult.title = ytResult.title.S;
                    ytResult.seconds = ytResult.seconds.N;
                    ytResult.songDuration = ytResult.songDuration.S;
                    ytResult.image = ytResult.image.S;
                    ytResult.thumbnail = ytResult.thumbnail.S;
                }
                console.log("add item to queue");
                const Item = {
                    id: { S: ytResult.videoId },
                    requestUrl: { S: ytResult.requestUrl },
                    requestedSong: { S: requestedSong },
                    title: { S: ytResult.title },
                    seconds: { N: `${ytResult.seconds}` },
                    songDuration: { S: ytResult.songDuration },
                    image: { S: ytResult.image },
                    thumbnail: { S: ytResult.thumbnail },
                    createdAt: { N: `${new Date().getTime()}` },
                };

                await dynamodb
                    .putItem({
                        TableName: process.env.HISTORY_TABLE_NAME,
                        Item,
                    })
                    .promise();
                await updateQueue(guildId, Item);
            }
        })
        .promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                content: `Added ${ytResult} to the queue table`,
                embeds: [],
                allowed_mentions: { parse: [] },
            },
        }),
    };
    console.log(response);
    return response;
};

module.exports.handler = appValidation;
