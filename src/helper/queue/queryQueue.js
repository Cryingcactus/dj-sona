const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const queryQueue = async function (guildId) {
    const params = {
        ExpressionAttributeValues: {
            ":v1": {
                S: guildId,
            },
        },
        KeyConditionExpression: "guildId = :v1",
        ProjectionExpression: "queue",
        TableName: process.env.QUEUE_TABLE_NAME,
    };
    let queue = { L: [] };
    await dynamodb
        .query(params, function (err, data) {
            if (err) {
                console.error("Error in queryQueue", err);
            } else {
                console.log("queryQueue: ", data.Items);
                if (data.Items[0]) {
                    queue = data.Items[0].queue;
                }
            }
        })
        .promise();
    return queue;
};

module.exports = queryQueue;
