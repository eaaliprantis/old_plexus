'use strict';
module.exports = {
    get_id: function (msg, bot, cmdexec) {
        bot.createMessage(msg.channel.id, "Your Discord ID: " + msg.author.id);
    }
};
