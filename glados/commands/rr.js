'use strict';
module.exports = {
    get_rr: function (msg, bot, cmdexec) {
        let args = msg.content.split(" ").slice(1);
        var dead = args[Math.floor(Math.random()*args.length)];
        bot.createMessage(msg.channel.id, dead + " was shot.");
    }
};
