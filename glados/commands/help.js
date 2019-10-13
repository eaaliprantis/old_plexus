'use strict';
module.exports = {
    get_help: function (msg, bot, cmdexec) {
        bot.getDMChannel(msg.author.id).then((channel) => {
            bot.createMessage(channel.id, {
                embed: {
                    title: "Big List O' Commands", // Title of the embed
                    description: "Here is the list of commands currently available in Glad0s.",
                    author: { // Author property
                        name: msg.author.username,
                        icon_url: msg.author.avatarURL
                    },
                    color: 0xFF0000, // Color, either in hex (show), or a base-10 integer
                    fields: [ // Array of field objects
                        {
                            name: "General Commands", // Field title
                            value: ""
                            + cmdexec + "help   Recieve help.\n"
                            + cmdexec + "id   Shows the user their discord ID.\n"
                            + cmdexec + "invite   Prints bot invite url.\n"
                            + cmdexec + "info   Shows bot information.\n", // Field
                            inline: false // Whether you want multiple fields in same line
                        },
                        {
                        name: "Fun Commands", // Field title
                        value: ""
                        + cmdexec + "rr @user1 @user2   Play Russian roulette with users.\n"
                        + cmdexec + "coinflip   Simple heads or tials.\n"
                        + cmdexec + "leet text   Turns text to l33t speak.\n"
                        + cmdexec + "8ball   Predict your future.\n"
                        + cmdexec + "love name name2   Calculates your chances for love. (must not be a ping)\n"
                        + cmdexec + "megadab   Dabs in a mega fashion.\n", // Field
                        inline: false // Whether you want multiple fields in same line
                        },
                        {
                        name: "Game Commands", // Field title
                        value: ""
                        + cmdexec + "joingame   Begins the user's game.\n"
                        + cmdexec + "uinfo @user   Gets all stats of a user.\n"
                        + cmdexec + "bal   Just shows current balance in gold.\n"
                        + cmdexec + "me   Shows all stats of user.\n"
                        + cmdexec + "setname name   Give your nation a name.\n"
                        + cmdexec + "setbio bio   Give your nation a bio.\n"
                        + cmdexec + "work   Have your laborers produce resources.\n"
                        + cmdexec + "sellres #   sell your resources for money.\n"
                        + cmdexec + "buycity    Purchases a city for 20,000 gold first time and adds 20k to cost for each new one. Each city produces workers and slightly increases gold per cycle.\n"
                        + cmdexec + "buyprov   Purchases a province for 100,000 gold first time and adds 100k to cost for each new one. Province greatly increases gold per cycle. (Each province requires 10 cities and gives 1 city for free)\n", // Field
                        inline: false // Whether you want multiple fields in same line
                        }
                    ],
                    footer: { // Footer text
                        text: "Need help with the bot? Contact Me!http:/\/steamcommunity.com/id/uberthegod"
                    }
                }
            });
            bot.createMessage(msg.channel.id, "You have been messaged the command list.");
        });
    }
};
