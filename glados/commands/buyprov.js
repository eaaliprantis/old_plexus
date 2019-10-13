'use strict';
let fs = require('fs');
var jsonFile = require('jsonfile')
var data = 'gamedata.json'

function getProvinces(obj, lookup, secondLookup) {
    if(lookup === "province") {
        let valid = true;
        let storage = "";
        Object.keys(obj["list"]).forEach((key) => {
            if(parseInt(obj["list"][key].cityCount) < parseInt(obj["list"][key].maxCities) && valid === true) {
                valid = false;
                storage = obj["list"][key];
            }
        });
        //console.log(obj['list'][Object.keys(obj["list"])[Object.keys(obj["list"]).length - 1]]);
        if(valid === false) {
            return [false, storage];
        }
        return [true, null];
    }
}

module.exports = {
    get_buyprov: function (msg, bot, cmdexec) {
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
                return;
            } else {
                let response = getProvinces(commands[user3]['stats']['provinces'], "province");
                if(response[0] === true) {
                    //allow
                    let citycost = parseInt(commands[user3]['stats']['provinces'].size) * 100000;
                    //console.log(parseInt(commands[user3]['stats']['gold']) >= citycost);
                    if(parseInt(commands[user3]['stats']['gold']) >= citycost) {
                        if(parseInt(commands[user3]['stats']['gold']) - parseInt(citycost) < 0) {
                            bot.createMessage(msg.channel.id, "You do not have enough gold. (cost `" + citycost + "` for your next province)");
                            return
                        } else {
                            let capitalSpecs = {
                                health: 1000,
                                maxHealth: 1000,
                                workers: 100,
                                attack: 4,
                                defense: 4
                            };
                            let citySpecs = {
                                health: 250,
                                maxHealth: 250,
                                workers: 25,
                                attack: 1,
                                defense: 1,
                                isCap: true,
                                capital: capitalSpecs
                            };
                            let provinceSpecs = {
                                cities: {},
                                cityCount: 1,
                                minCities: 1,
                                maxCities: 10
                            };
                            provinceSpecs.cities[1] = citySpecs;
                            commands[user3]['stats']['provinces']['list'][(parseInt(commands[user3]['stats']['provinces']['size']) + 1)] = provinceSpecs;
                            commands[user3]['stats']['gold'] = parseInt(commands[user3]['stats']['gold']) - parseInt(citycost);
                            commands[user3]['stats']['provinces']['size'] = parseInt(commands[user3]['stats']['provinces']['size']) + 1;
                            bot.createMessage(msg.channel.id, "You bought `1` province which provided an additional city.  Type " + cmdexec + "me for more info.");
                        }
                    } else {
                        bot.createMessage(msg.channel.id, "You do not have enough gold. (cost `"+citycost+"` for your next province)");
                        return;
                    }
                } else {
                    bot.createMessage(msg.channel.id, "You must buy `" + (parseInt(response[1].maxCities) - response[1].cityCount) + "` cities before buying another province.");
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
            bot.createMessage(msg.channel.id, "Usage: " + cmdexec + "buyprov");
        }
    }
};
