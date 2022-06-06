const guildId = "543629423979790346";
const memberId = "128280807843430400";
const token = process.env.token;

const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const client = new Discord.Client();

client.on("ready", () => {
    const guild = client.guilds.cache.get(guildId);
    let channelId = guild.voiceStates.cache.get(memberId).channelID;
    client.channels.cache
        .get(channelId)
        .join()
        .then((connection) => {
            const stream = ytdl("https://www.youtube.com/watch?v=N5wzkQvzp4c", {
                filter: "audioonly",
            });
            const streamOptions = { seek: 0, volume: 1 };
            const dispatcher = connection.play(stream, streamOptions);

            dispatcher.on("finish", () => {
                console.log("song finished.");
            });

            dispatcher.on("start", () => {
                console.log("playing next song.");
            });

            dispatcher.on("error", (error) => {
                console.log("Error in dispatcher: ", error);
            });
        });
});

client.login(token);
