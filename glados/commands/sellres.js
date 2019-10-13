'use strict';
let fs = require('fs');
var jsonFile = require('jsonfile')
var data = 'gamedata.json'

function checkDigit(num) {
    if(num.match(/^\d+$/)) {
        //valid integer
        return true;
    } else if(num.match(/^\d+\.\d+$/)) {
        //valid float
        return true;
    } else {
        //not valid number
        return false;
    }
}

function isNumeric(value) {
    return /^\d+$/.test(value);
}

module.exports = {
    get_sellres: function (msg, bot, cmdexec) {
        let args = msg.content.split(" ").slice(1);
        if(args.length == 1) {
            if(isNumeric(args[0]) === true) {
                let path = "../logchannels/gamedata.json";
                let sPath = "./logchannels/gamedata.json";
                let commands = require(path);
                let user = msg.author.id;
                let user2 = user.replace("<@", "");
                let user3 = user2.replace(">", "");
                user3 = user3.replace("!", "");
                if(!commands[user3]) {
                    bot.createMessage(msg.channel.id, "User does not exist in database!");
                    return
                } else {
                    if(parseInt(commands[user3]['stats']["resources"]) - args[0] < 0) {
                        bot.createMessage(msg.channel.id, "You do not have enough resources.");
                        return
                    } else {
                        let rsold = args[0];
                        let totalprofit = rsold * Math.floor(Math.random() * 10) + 4
                        commands[user3]['stats']["resources"] = parseInt(commands[user3]['stats']["resources"]) - args[0]
                        commands[user3]['stats']["gold"] = parseInt(commands[user3]['stats']["gold"]) + totalprofit
                        bot.createMessage(msg.channel.id, "You sold `"+ rsold + "` and made `"+totalprofit+"` gold!" );
                    }
                }
                fs.writeFile(sPath, JSON.stringify(commands), (err) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                });
                delete require.cache[commands];
            } else {
                bot.createMessage(msg.channel.id, "Your argument must be a number.");
                return;
            }
        } else {
            bot.createMessage(msg.channel.id, "Usage: " + cmdexec + "sellres #");
            return;
        }
    }
};
