'use strict';
function flip() {
    return (Math.floor(Math.random() * 2) == 0) ? 'Heads!' : 'Tails!';
}
module.exports = {
    get_coinflip: function (msg, bot, cmdexec) {
        var answer = flip();
        bot.createMessage(msg.channel.id, answer);
    }
};
