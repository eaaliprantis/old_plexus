'use strict';
let fs = require('fs');
var jsonFile = require('jsonfile')
var data = 'gamedata.json'

function getProvinces(obj, lookup, secondLookup) {
    if(lookup === "provinces") {
        let valid = false;
        let storage = "", objKey = "";

        Object.keys(obj["list"]).forEach((key) => {
            if(parseInt(obj["list"][key].cityCount) < parseInt(obj["list"][key].maxCities) && valid === false) {
                valid = true;
                storage = obj["list"][key];
                objKey = key;
            }
        });
        if(valid === true) {
            return [false, storage, objKey];
        }
        return [true, null];
    }
}

function totalCities(obj) {
    let number = 0;
    Object.keys(obj["list"]).forEach((key) => {
        number += parseInt(obj["list"][key].cityCount);
    });
    return number;
}

module.exports = {
    get_buycity: function (msg, bot, cmdexec) {
        let args = msg.content.split(" ").slice(1);
        if(args.length == 0) {
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
                let citySpecs = {
                    health: 250,
                    maxHealth: 250,
                    workers: Math.floor(Math.random() * 200) + 25,
                    attack: 1,
                    defense: 1,
                    isCap: false,
                    capital: {}
                };
                let response = getProvinces(commands[user3]['stats']['provinces'], "provinces");
                if(response[0] === false) {
                    let citycost = totalCities(commands[user3]['stats']['provinces']) * 25000;
                    if(parseInt(commands[user3]['stats']['gold']) >= citycost) {
                        if(parseInt(commands[user3]['stats']['gold']) - parseInt(citycost) < 0) {
                            bot.createMessage(msg.channel.id, "You do not have enough gold. (cost `" + citycost + "` for a new city)");
                            return;
                        } else {
                            commands[user3]['stats']['gold'] = parseInt(commands[user3]['stats']['gold']) - parseInt(citycost);
                            commands[user3]['stats']['provinces']['list'][parseInt(response[2])].cityCount = parseInt(commands[user3]['stats']['provinces']['list'][parseInt(response[2])].cityCount) + 1;
                            commands[user3]['stats']['provinces']['list'][parseInt(response[2])].cities[commands[user3]['stats']['provinces']['list'][parseInt(response[2])].cityCount] = citySpecs;
                            bot.createMessage(msg.channel.id, "You bought `1` city which generated `" + parseInt(citySpecs.workers) + "` workers. Type " + cmdexec + "me for more info.");
                        }
                    } else {
                        bot.createMessage(msg.channel.id, "You do not have enough gold. (cost `" + citycost + "` for a new city)");
                        return;
                    }
                } else {
                    bot.createMessage(msg.channel.id, "You will need to buy a province since you have no more city slots.");
                    return;
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
            bot.createMessage(msg.channel.id, "Usage: " + cmdexec + "buycity");
        }
    }
};
