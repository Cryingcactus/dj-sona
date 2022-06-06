const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const queryHistory = async function (requestedSong) {
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
    let historyRecord;
    await dynamodb
        .query(params, async function (err, data) {
            if (err) {
                console.error("Error in queryHistory", err);
            } else {
                console.log("queryHistory: ", data.Items);
                historyRecord = { ...data.Items[0] };
            }
        })
        .promise();
    return historyRecord;
};

module.exports = queryHistory;
