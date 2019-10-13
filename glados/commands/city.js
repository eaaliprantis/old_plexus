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

function totalProvWorkers(obj, key, city) {
    let number = 0;
    let cityObj = obj["list"][key]['cities'][city];
    if(cityObj.isCap === true) {
        number += parseInt(obj['list'][key]['cities'][city]["capital"].workers);
    }
    number += parseInt(obj['list'][key]['cities'][city].workers);
    return number;
}

function totalProvHealth(obj, key, city) {
    let number = 0;
    let cityObj = obj["list"][key]['cities'][city];
    if(cityObj.isCap === true) {
        number += parseInt(obj['list'][key]['cities'][city]["capital"].health);
    }
    number += parseInt(obj['list'][key]['cities'][city].health);
    return number;
}

function maxProvHealth(obj, key, city) {
    let number = 0;
    let cityObj = obj["list"][key]['cities'][city];
    if(cityObj.isCap === true) {
        number += parseInt(obj['list'][key]['cities'][city]["capital"].maxHealth);
    }
    number += parseInt(obj['list'][key]['cities'][city].maxHealth);
    return number;
}

function totalProvAttack(obj, key, city) {
    let number = 0;
    let cityObj = obj["list"][key]['cities'][city];
    if(cityObj.isCap === true) {
        number += parseInt(obj['list'][key]['cities'][city]["capital"].attack);
    }
    number += parseInt(obj['list'][key]['cities'][city].attack);
    return number;
}

function totalProvDefense(obj, key, city) {
    let number = 0;
    let cityObj = obj["list"][key]['cities'][city];
    if(cityObj.isCap === true) {
        number += parseInt(obj['list'][key]['cities'][city]["capital"].defense);
    }
    number += parseInt(obj['list'][key]['cities'][city].defense);
    return number;
}

module.exports = {
    get_city_info: function (msg, bot, cmdexec) {
        let args = msg.content.split(" ").slice(1);
        if(args.length == 2) {
            let path = "../logchannels/gamedata.json";
            let sPath = "./logchannels/gamedata.json";
            let commands = require(path);
            let user = msg.author.id;
            if(!commands[user]) {
                bot.createMessage(msg.channel.id, "User does not exist in database!");
                return
            } else {
                if(args.length === 2) {
                    if(checkDigit(args[0]) === true && checkDigit(args[1]) === true) {
                        let provLookup = parseInt(args[0]);
                        let cityLookup = parseInt(args[1]);
                        bot.createMessage(msg.channel.id, {
                            embed: {
                                title: ":crossed_swords: " + commands[user]['stats']['name'],
                                description: commands[user]['stats']['bio'],
                                color: 0xFF0000,
                                fields: [
                                    {
                                        name: "Total Workers",
                                        value: totalProvWorkers(commands[user]['stats']['provinces'], provLookup, cityLookup),
                                        inline: true
                                    },
                                    {
                                        name: "Health/Max Health",
                                        value: totalProvHealth(commands[user]['stats']['provinces'], provLookup, cityLookup) + "/" + maxProvHealth(commands[user]['stats']['provinces'], provLookup, cityLookup),
                                        inline: true
                                    },
                                    {
                                        name: "Total Military Strength",
                                        value: "**Attack\t**    | " + totalProvAttack(commands[user]['stats']['provinces'], provLookup, cityLookup) + "\n**Defense\t** | " + totalProvDefense(commands[user]['stats']['provinces'], provLookup, cityLookup),
                                        inline: true
                                    },
                                ],
                                footer: {
                                    text: "Need help with the bot? Contact the devs! http://discord.gg/uT3TB72"
                                }
                            }
                        });
                    } else {
                        bot.createMessage(msg.channel.id, "Your argument(s) must be a number.  Usage: " + cmdexec + "city {prov} {city#}");
                    }
                }
            }
            delete require.cache[commands];
        } else {
            bot.createMessage(msg.channel.id, "Usage: " + cmdexec + "city {prov} {city#}");
        }
    }
};
