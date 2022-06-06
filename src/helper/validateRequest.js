const { verifyKey } = require("discord-interactions");

async function validateRequest(event, context, callback) {
    try {
        const signature = event.headers["x-signature-ed25519"];
        const timestamp = event.headers["x-signature-timestamp"];
        const isDev = process.env.MODE === "dev";
        const isValidRequest =
            isDev ||
            verifyKey(
                event.body,
                signature,
                timestamp,
                "ba3f682b962f0c0045b2457a8f96cf944ebd7b1004286040c5505238bc32c76a",
            );
        if (!isValidRequest) {
            throw new Error("Bad request signature");
        }
        const body = JSON.parse(event.body);
        const { type } = body;
        if (type === 1) {
            return {
                statusCode: 200,
                headers: {},
                body: JSON.stringify({ type: 1 }),
            };
        } else if (type === 2) {
            return callback(event, context);
        }
    } catch (error) {
        const body = error.stack || JSON.stringify(error, null, 2);
        console.error(error);
        return {
            statusCode: 500,
            headers: {},
            body: JSON.stringify(body),
        };
    }
}

module.exports = validateRequest;
