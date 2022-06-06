const yts = require("yt-search");
const AWS = require("aws-sdk");
const validateRequest = require("./helper/validateRequest");
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const play = async function (event, context) {
    const body = JSON.parse(event.body);
    const { requestedSong } = body;

    const results = await yts(requestedSong);
    console.log(results);
    const {
        title,
        url,
        videoId: id,
        seconds,
        timestamp,
        image,
        thumbnail,
        ...rest
    } = results.all[0];
    const put = await dynamodb
        .putItem({
            TableName: process.env.TABLE_NAME,
            Item: {
                id: { S: id },
                requestUrl: { S: url },
                requestedSong: { S: requestedSong },
                title: { S: title },
                seconds: { N: `${seconds}` },
                timestamp: { S: timestamp },
                image: { S: image },
                thumbnail: { S: thumbnail },
                createdAt: { N: `${new Date().getTime()}` },
            },
        })
        .promise();
    console.log(put);
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                content: `Added ${title} to the queue table`,
                embeds: [],
                allowed_mentions: { parse: [] },
            },
        }),
    };
    console.log(response);
    return response;
};

module.exports.handler = async (event, context) => {
    await console.log(validateRequest);

    return validateRequest(event, context, play);
};
