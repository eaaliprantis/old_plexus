'use strict';
module.exports = {
    get_slap: function (msg, bot, cmdexec) {
        let args = msg.content.split(" ").slice(1);
        var superstring = msg.content.replace(cmdexec + "slap " + args[0], "");
        if(args.length < 2) {
            bot.createMessage(msg.channel.id, "Usage: !slap @user item")
        } else {
            bot.createMessage(msg.channel.id, {
                embed: {
                    title: "Slap O' Matic",
                    description: msg.author.mention + " has slapped " + args[0] + " with **" + superstring + "**",
                    color: 0xFF0000,
                }
            });
        }
    }
};
