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

function totalProvCities(obj, key) {
    return obj['list'][key].cityCount;
}

function maxProvCities(obj, key) {
    return obj['list'][key].maxCities;
}

function totalProvWorkers(obj, key) {
    let number = 0;
    Object.keys(obj["list"][key]['cities']).forEach((city) => {
        number += parseInt(obj['list'][key]['cities'][city].workers);
    });
    return number;
}

function totalProvHealth(obj, key) {
    let number = 0;
    Object.keys(obj['list'][key]['cities']).forEach((city) => {
        if(obj['list'][key]['cities'][city].isCap === true) {
            number += parseInt(obj['list'][key]['cities'][city]['capital'].health);
        }
        number += parseInt(obj['list'][key]['cities'][city].health);
    });
    return number;
}

function maxProvHealth(obj, key) {
    let number = 0;
    Object.keys(obj['list'][key]['cities']).forEach((city) => {
        if(obj['list'][key]['cities'][city].isCap === true) {
            number += parseInt(obj['list'][key]['cities'][city]['capital'].maxHealth);
        }
        number += parseInt(obj['list'][key]['cities'][city].maxHealth);
    });
    return number;
}

function totalProvAttack(obj, key) {
    let number = 0;
    Object.keys(obj['list'][key]['cities']).forEach((city) => {
        if(obj['list'][key]['cities'][city].isCap === true) {
            number += parseInt(obj['list'][key]['cities'][city]['capital'].attack);
        }
        number += parseInt(obj['list'][key]['cities'][city].attack);
    });
    return number;
}

function totalProvDefense(obj, key) {
    let number = 0;
    Object.keys(obj['list'][key]['cities']).forEach((city) => {
        if(obj['list'][key]['cities'][city].isCap === true) {
            number += parseInt(obj['list'][key]['cities'][city]['capital'].defense);
        }
        number += parseInt(obj['list'][key]['cities'][city].defense);
    });
    return number;
}

module.exports = {
    get_prov_info: function (msg, bot, cmdexec) {
        let args = msg.content.split(" ").slice(1);
        if(args.length == 1 || args.length == 2) {
            let path = "../logchannels/gamedata.json";
            let sPath = "./logchannels/gamedata.json";
            let commands = require(path);
            let user = msg.author.id;
            if(!commands[user]) {
                bot.createMessage(msg.channel.id, "User does not exist in database!");
                return
            } else {
                let provId = null;
                if(args.length === 1) {
                    if(checkDigit(args[0]) === true) {
                        let provLookup = parseInt(args[0]);
                        bot.createMessage(msg.channel.id, {
                            embed: {
                                title: ":crossed_swords: " + commands[user]['stats']['name'],
                                description: commands[user]['stats']['bio'],
                                color: 0xFF0000,
                                fields: [
                                    {
                                        name: "Cities",
                                        value: totalProvCities(commands[user]['stats']['provinces'], provLookup),
                                        inline: true
                                    },
                                    {
                                        name: "Total Workers",
                                        value: totalProvWorkers(commands[user]['stats']['provinces'], provLookup),
                                        inline: true
                                    },
                                    {
                                        name: "Health/Max Health",
                                        value: totalProvHealth(commands[user]['stats']['provinces'], provLookup) + "/" + maxProvHealth(commands[user]['stats']['provinces'], provLookup),
                                        inline: true
                                    },
                                    {
                                        name: "Total Military Strength",
                                        value: "**Attack\t**    | " + totalProvAttack(commands[user]['stats']['provinces'], provLookup) + "\n**Defense\t** | " + totalProvDefense(commands[user]['stats']['provinces'], provLookup),
                                        inline: true
                                    },
                                ],
                                footer: {
                                    text: "Need help with the bot? Contact the devs! http://discord.gg/uT3TB72"
                                }
                            }
                        });
                    } else {
                        bot.createMessage(msg.channel.id, "Your argument(s) must be a number.  Usage: " + cmdexec + "prov {prov} [page]");
                    }
                } else if(args.length === 2) {
                    if(checkDigit(args[0]) === true && checkDigit(args[1]) === true) {

                    } else {
                        bot.createMessage(msg.channel.id, "Your argument(s) must be a number.  Usage: " + cmdexec + "prov {prov} [page]");
                    }
                }
            }
            delete require.cache[commands];

        } else {
            bot.createMessage(msg.channel.id, "Usage: " + cmdexec + "prov {prov} [page]");
        }
    }
};
