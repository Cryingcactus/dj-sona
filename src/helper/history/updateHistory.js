const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const updateHistory = async function (record) {
    try {
        await dynamodb
            .putItem({
                TableName: process.env.HISTORY_TABLE_NAME,
                Item: record,
            })
            .promise();
        return true;
    } catch (error) {
        console.error("Error in updateHistory", err);
        return false;
    }
};

module.exports = updateHistory;
