'use strict';
const l33t = require('1337')
module.exports = {
    get_leet: function (msg, bot, cmdexec) {
        var superstring = msg.content.replace(cmdexec + "leet", "");
        bot.createMessage(msg.channel.id, l33t(superstring))
    }
};
