'use strict';
module.exports = {
    get_invite: function (msg, bot, cmdexec) {
        bot.createMessage(msg.channel.id, "You can add the bot to your server by going to https:/\/discordapp.com/oauth2/authorize?&client_id=293509902771552257&scope=bot&permissions=2146958463");
    }
};
