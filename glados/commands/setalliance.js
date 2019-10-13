'use strict';
let fs = require('fs');
var jsonFile = require('jsonfile')

module.exports = {
    set_alliance: function (msg, bot, cmdexec) {
        let args = msg.content.split(" ").slice(1);
        var superstring = msg.content.replace(cmdexec + "setname ", "");
        if(args.length === 2) {
            let path = "../logchannels/gamedata.json";
            let sPath = "./logchannels/gamedata.json";
            let commands = require(path);
            let user = msg.author.id;
            let user2 = user.replace("<@", "");
            let user3 = user2.replace(">", "");
            user3 = user3.replace("!", "");
            if(!commands[user3]) {
                bot.createMessage(msg.channel.id, "User does not exist in database!");
                return;
            } else {
                let pathAlliance = "../logchannels/alliance.json";
                let sPathAlliance = "./logchannels/alliance.json";
                let response = getCurrentAlliance(commands, user3, "namegoeshere");
                //Need to check if they are in an alliance or not from the alliance.json file.
                let allianceJson = require(pathAlliance);
                commands[user3]['stats']["name"] = superstring
                bot.createMessage(msg.channel.id, "Your nations name has been set to `"+superstring+"`")
            }
            fs.writeFile(sPath, JSON.stringify(commands), (err) => {
                if (err) {
                    console.log(err.message);
                    return;
                }
            });
            delete require.cache[commands];
        } else {
            bot.createMessage(msg.channel.id, "Usage: " + cmdexec + "setname NAME");
        }
    }
};

function getCurrentAlliance(data, user, alliance) {

}
