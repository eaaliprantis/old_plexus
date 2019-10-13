'use strict';
var predict = require('eightball');

module.exports = {
    get_eightball: function (msg, bot, cmdexec) {
        bot.createMessage(msg.channel.id, predict() + '.');
    }
};
