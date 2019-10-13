'use strict';
var fs = require('fs');
module.exports = {
    get_stats: function (msg, bot, cmdexec) {
        bot.createMessage(msg.channel.id, {
            embed: {
                title: "Glad0s Info", // Title of the embed
                description: "This bot was created using the eris library. To see all available commands type \`" + cmdexec + "help\`",
                color: 0xFF0000, // Color, either in hex (show), or a base-10 integer
                fields: [ // Array of field objects
                    {
                        name: ":spy:Developers", // Field title
                        value: "Uber#8099 \nEaaliprantis#2160", // Field
                        inline: true// Whether you want multiple fields in same line
                    },
                    {
                        name: ":blue_book: Language", // Field title
                        value: "NodeJS-Legacy", // Field
                        inline: true// Whether you want multiple fields in same line
                    },
                    {
                        name: ":crossed_swords:Guilds", // Field title
                        value: bot.guilds.size, // Field
                        inline: true // Whether you want multiple fields in same line
                    },
                    {
                        name: ":bust_in_silhouette:Users (In total)", // Field title
                        value: bot.users.size, // Field
                        inline: true // Whether you want multiple fields in same line
                    },
                    {
                        name: ":e_mail:Invite", // Field title
                        value: "[Click Here](https:/\/discordapp.com/oauth2/authorize?&client_id=293509902771552257&scope=bot&permissions=2146958463)", // Field
                        inline: true // Whether you want multiple fields in same line
                    },
                    {
                        name: ":exclamation:Contact the devs!", // Field title
                        value: "[Click Here](http:\/\/discord.gg/uT3TB72)", // Field
                        inline: true // Whether you want multiple fields in same line
                    }
                ]
            }
        });
    }
};
