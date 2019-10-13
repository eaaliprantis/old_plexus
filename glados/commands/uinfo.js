'use strict';
function totalCities(obj) {
    let number = 0;
    Object.keys(obj["list"]).forEach((key) => {
        number += parseInt(obj["list"][key].cityCount);
    });
    return number;
}

function totalProvinces(obj) {
    return parseInt(obj.size);
}

function totalWorkers(obj) {
    let number = 0;
    Object.keys(obj["list"]).forEach((key) => {
        Object.keys(obj['list'][key]['cities']).forEach((city) => {
            number += parseInt(obj['list'][key]['cities'][city].workers);
        });
    });
    return number;
}

function totalAttack(obj) {
    let number = 0;
    Object.keys(obj["list"]).forEach((key) => {
        Object.keys(obj['list'][key]['cities']).forEach((city) => {
            if(obj['list'][key]['cities'][city].isCap === true) {
                number += parseInt(obj['list'][key]['cities'][city]['capital'].attack);
            }
            number += parseInt(obj['list'][key]['cities'][city].attack);
        });
    });
    return number;
}

function totalDefense(obj) {
    let number = 0;
    Object.keys(obj["list"]).forEach((key) => {
        Object.keys(obj['list'][key]['cities']).forEach((city) => {
            if(obj['list'][key]['cities'][city].isCap === true) {
                number += parseInt(obj['list'][key]['cities'][city]['capital'].defense);
            }
            number += parseInt(obj['list'][key]['cities'][city].defense);
        });
    });
    return number;
}

module.exports = {
    get_uinfo: function (msg, bot, cmdexec) {
        let args = msg.content.split(" ").slice(1);

        if(args.length == 1) {
            if(args[0].includes("<@") == false) {
                bot.createMessage(msg.channel.id, "Must be a valid user.")
                return;
            }
            if(args[0].includes("<@") == true) {
                let path = "../logchannels/gamedata.json";
                let sPath = "./logchannels/gamedata.json";
                let commands = require(path);
                let user = msg.author.id;
                let user2 = user.replace("<@", "");
                let user3 = user2.replace(">", "");
                user3 = user3.replace("!", "");
                let dataInfo = require(path);

                if(!commands[user3]) {
                    bot.createMessage(msg.channel.id, "User does not exist!\nUsage: " + cmdexec + "uinfo @user");
                    return;
                }
                if(!commands[user3]['stats']) {
                    bot.createMessage(msg.channel.id, "User stats does not exist.");
                    return;
                }
                bot.createMessage(msg.channel.id, {
                    embed: {
                        title: ":crossed_swords: " + commands[user3]['stats']['name'],
                        description: commands[user2]['stats']['bio'],
                        color: 0xFF0000,
                        fields: [
                            {
                                name: "Cities",
                                value: totalCities(commands[user3]['stats']['provinces']),
                                inline: true
                            },
                            {
                                name: "Provinces",
                                value: totalProvinces(commands[user3]['stats']['provinces']),
                                inline: true
                            },
                            {
                                name: "Gold",
                                value: parseInt(commands[user3]['stats']['gold']) + "",
                                inline: true
                            },
                            {
                                name: "Resources",
                                value: Math.floor(commands[user3]['stats']['resources']) + "",
                                inline: true
                            },
                            {
                                name: "Total Workers",
                                value: totalWorkers(commands[user3]['stats']['provinces']),
                                inline: true
                            },
                            {
                                name: "Total Military Strength",
                                value: "**Attack\t**    | " + totalAttack(commands[user3]['stats']['provinces']) + "\n**Defense\t** | " + totalDefense(commands[user3]['stats']['provinces']),
                                inline: true
                            },
                        ],
                        footer: {
                            text: "Need help with the bot? Contact the devs! http://discord.gg/uT3TB72"
                        }
                    }
                });
                delete require.cache[commands];
            }
        } else {
            bot.createMessage(msg.channel.id, "Usage: " + cmdexec + "uinfo @user");
        }
    }
};





/*

try {
let path = "./Data/commands.json";
let commands = require(path);
if(commands[message.guild.id]) {
if(commands[message.guild.id]['cmds']) {
if(commands[message.guild.id]['cmds'][command] !== undefined) {
message.channel.sendMessage(commands[message.guild.id]['cmds'][command]);
}
}
}
delete require.cache[commands];
*/
