'use strict';
let fs = require('fs');
var jsonFile = require('jsonfile')
var data = 'gamedata.json'

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
    get_joingame: function (msg, bot, cmdexec) {
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
                commands[user3] = {};

                if(!commands[user3]['stats']) {
                    commands[user3]['stats'] = {};
                }
                if(!commands[user3]['stats']["provinces"]) {
                    commands[user3]['stats']["provinces"] = {};
                    commands[user3]['stats']['provinces']['size'] = 1;
                    commands[user3]['stats']['provinces']['list'] = {};
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
                    commands[user3]['stats']['provinces']['list'][1] = provinceSpecs;
                }
                if(!commands[user3]['stats']["gold"]) {
                    commands[user3]['stats']["gold"] = 1000;
                }
                if(!commands[user3]['stats']["resources"]) {
                    commands[user3]['stats']["resources"] = 0;
                }
                if(!commands[user3]['stats']["bio"]) {
                    commands[user3]['stats']["bio"] = "N/A";
                }
                if(!commands[user3]['stats']["name"]) {
                    commands[user3]['stats']["name"] = "No Name Set.";
                }
                if(!commands[user3]['stats']["alliance"]) {
                    commands[user3]['stats']['alliance'] = {
                        name: "N/A",
                        owner: false,
                        size: 1,
                        id: []
                    };
                }
                if(!commands[user3]['stats']['xp']) {
                    commands[user3]['stats']['xp'] = 0;
                }
                if(!commands[user3]['stats']['level']) {
                    commands[user3]['stats']['level'] = 1;
                }

                let allianceOwner = (commands[user3]['stats']['alliance']['owner'] === true) ? "Yes" : "No";
                bot.createMessage(msg.channel.id, "User created with following stats. Type `"+cmdexec+"me` for info on user.");
                bot.createMessage(msg.channel.id, {
                    embed: {
                        title: ":crossed_swords: " + commands[user3]['stats']['name'],
                        description: commands[user3]['stats']['bio'],
                        color: 0xFF0000,
                        fields: [
                            {
                                name: "Cities",
                                value: commands[user3]['stats']['provinces']['list'][1].cityCount,
                                inline: true
                            },
                            {
                                name: "Provinces",
                                value: Object.keys(commands[user3]['stats']['provinces']['list']).length,
                                inline: true
                            },
                            {
                                name: "Gold",
                                value: commands[user3]['stats']['gold'],
                                inline: true
                            },
                            {
                                name: "Resources",
                                value: parseInt(commands[user3]['stats']['resources']),
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
                            {
                                name: "Alliance Info",
                                value: "**Name**\t   | " + commands[user3]['stats']['alliance']["name"] + "\n**Size**\t      | " + commands[user3]['stats']['alliance']['size'] + "\n**Owner**\t  | " + allianceOwner,
                                inline: true
                            },
                            {
                                name: "Level",
                                value: parseInt(commands[user3]['stats']['level']),
                                inline: true
                            },
                            {
                                name: "XP (Experience Points)",
                                value: parseInt(commands[user3]['stats']['xp']),
                                inline: true
                            }
                        ],
                        footer: {
                            text: "Need help with the bot? Contact the devs! http://discord.gg/uT3TB72"
                        }
                    }
                });
            } else {
                bot.createMessage(msg.channel.id, "User already exist in database! Type " + cmdexec + "me")
                return
            }
            fs.writeFile(sPath, JSON.stringify(commands), (err) => {
                if (err) {
                    console.log(err.message);
                    return;
                }
            });
            delete require.cache[commands];
        } else {
            bot.createMessage(msg.channel.id, "Usage: " + cmdexec + "startgame");
        }
    }
};
