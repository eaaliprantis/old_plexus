'use strict';
let fs = require('fs');
var jsonFile = require('jsonfile')
var data = 'gamedata.json'


module.exports = {
    get_bal: function (msg, bot, cmdexec) {
        let args = msg.content.split(" ").slice(1);
        if(args.length == 0) {
            let path = "../logchannels/gamedata.json";
            let sPath = "./logchannels/gamedata.json";
            let commands = require(path);
            let user = msg.author.id;
            let user2 = user.replace("<@", "");
            let user3 = user.replace(">", "");

            if(!commands[user3]) {
                bot.createMessage(msg.channel.id, "User does not exist in database!");
                return
            } else {
                bot.createMessage(msg.channel.id, "You currently have `" + commands[user3]['stats']["gold"] + "` gold!")
            }
            delete require.cache[commands];

        } else {
            bot.createMessage(msg.channel.id, "Usage: " + cmdexec + "bal");
        }
    }
};
