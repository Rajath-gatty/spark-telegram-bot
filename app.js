const { Composer } = require("micro-bot");
const axios = require("axios");

const bot = new Composer();

const client_id = "ua-_grrKVr4gdap4VufHeXBlfV4zUud2zWo2Z1M9o0o";

const nameQ = [
    "What's your name",
    "Your name",
    "What is your name",
    "what's your name",
    "Tell me your name",
];
const greeting = ["hello", "hi", "Hello", "Hi"];
const creatorQ = ["Who is your creator"];

bot.start((ctx) => {
    ctx.reply("How can i help you");

    bot.help((ctx) => {
        ctx.reply(
            "This bot Has the Following features \n - /start - To start a bot \n - /help - To see all commands \n - /search - Sends a image for a searched keyword \n"
        );
    });

    bot.hears(greeting, (ctx) => {
        ctx.telegram.sendMessage(ctx.chat.id, "Hello!", {
            reply_to_message_id: ctx.message.message_id,
        });
    });

    bot.hears(nameQ, (ctx) => {
        ctx.telegram.sendMessage(ctx.chat.id, "Spark Bot", {
            reply_to_message_id: ctx.message.message_id,
        });
    });

    bot.hears(creatorQ, (ctx) => {
        ctx.telegram.sendMessage(ctx.chat.id, "Rajath is my creator", {
            reply_to_message_id: ctx.message.message_id,
        });
    });

    bot.command("quit", (ctx) => {
        bot.leaveChat();
    });

    bot.command("search", (ctx) => {
        const text = ctx.message.text.split(" ");
        const query = text.reverse().shift();

        axios
            .get(
                `https://api.unsplash.com/search/photos?client_id=${client_id}&page=1&query=${query}`
            )
            .then((photo) => {
                const photoUrl = photo.data.results[0].urls.small;
                if (photoUrl !== "") {
                    ctx.telegram.sendChatAction(ctx.chat.id, "upload_photo");
                    ctx.telegram.sendPhoto(ctx.chat.id, photoUrl, {
                        reply_to_message_id: ctx.message.message_id,
                    });
                }
            })
            .catch((err) =>
                ctx.telegram.sendMessage(
                    ctx.chat.id,
                    `No photos Found for ${query}`,
                    { reply_to_message_id: ctx.message.message_id }
                )
            );
    });

    bot.command((ctx) => {
        ctx.telegram.sendMessage(ctx.chat.id, "I didn't recognize that!", {
            reply_to_message_id: ctx.message.message_id,
        });
    });
});

module.exports = bot;
