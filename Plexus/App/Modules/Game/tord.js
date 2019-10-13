const moduleInfo = {
    name: "truthordare",
    truename: "truthordare",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "truthordare",
    cmdName: "truthordare",
    aliases: ["tord"],
    args: {min: 1, max: 100},
    description: "Truth or Dare",
    exampleUsage: "tord help",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Games",
    options: ["help", "purgequeue", "r", "q", "shufflequeue", "shuffle_queue", "moveuser", "setshuffle", "d", "restore", "n", "next", "s", "skip", "remove_user"],
    optPermLevel: [0, 4, 4, 0, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4],
    optDesc: [
        "Show this help menu", "Purges the queue and stops the game.",
        "Removes yourself or other user.",
        "Places you on the end of the queue.",
        "Places you on the end of the queue.",
        "Move a user in the queue.",
        "Set a new user as shuffle.",
        "Display current queue.",
        "Restores the last turn.",
        "Tags the next user in the queue.",
        "Tags the next user in the queue.",
        "Skips the current users.",
        "Skips the current users.",
        "Removes the user from the queue"
    ],
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

let cur = {};
let curList = {};
let backup = {};

this.setupCommands = function(file) {
    this.file = file;
    return new Promise((resolve, reject) => {
        return resolve({file: this.file, moduleInfo: moduleInfo, commands: this.commands});
    });
}

tordCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let S = require('string');
        BotSettings.assist.permission(message.author).then(permLevel => {
            let choiceArgs = args.shift();
            if(usage.options.includes(choiceArgs.toLowerCase()) && permLevel >= usage.optPermLevel[usage.options.findIndex(choiceArgs.toLowerCase())]) {
                if(
                    usage.optPermLevel[usage.option.findIndex(choiceArgs.toLowerCase())] >= 4 ||
                    (cur.hasOwnProperty(message.channel.id) && cur[message.channel.id]['active'] === true && cur[message.channel.id]['leader'] === message.author.id)
                ) {
                    let restrict1 = usage.optPermLevel[usage.option.findIndex(choiceArgs.toLowerCase())] >= 4;
                    let restrict2 = cur.hasOwnProperty(message.channel.id) && cur[message.channel.id]['active'] === true && cur[message.channel.id]['leader'] === message.author.id;
                    if(choiceArgs.toLowerCase() === "purgequeue" && restrict1 === true) {
                        if(cur.hasOwnProperty(message.channel.id) === true) {
                            delete cur[message.channel.id];
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("Truth or Dare");
                            embed.setDescription("Purge completed.  Removing Truth or Dare from this channel");
                            embed.setThumbnail("https://i.imgur.com/Fr2FEmk.png?width=80&height=80");
                            return resolve({response: message.author, embed: embed, silent: false});
                        } else {
                            BotSettings.assist.error("There is no queue to purge.", message.channel);
                            return resolve({response: "", silent: true});
                        }
                    } else if(choiceArgs.toLowerCase() === "r") {

                    } else if((choiceArgs.toLowerCase() === "shuffle_queue" || choiceArgs.toLowerCase() === "shufflequeue")) {
                        if(cur.hasOwnProperty(message.channel.id) === true) {
                            if(cur[message.channel.id].hasOwnProperty("data") && cur[message.channel.id]['data'].length >= 2) {
                                //shuffle queue
                                var Random = require("random-js");
                                cur[message.channel.id]['data'] = Random.shuffle(Random.engines.mt19937().autoSeed(), cur[message.channel.id]['data']);
                                let embed = new Discord.MessageEmbed();
                                embed.setTitle("Truth or Dare");
                                embed.setDescription("The queue has been shuffled.  Here is the new list.  \n" + cur[message.channel.id]['data'].map((z, i) => {return "#" + (i + 1) + "`" + BotSettings.resolve.User(z).tag + "`"}).join("\n"));
                                return resolve({response: message.author, embed: embed, silent: false});
                            } else {
                                let embed = new Discord.MessageEmbed();
                                embed.setTitle("Truth or Dare");
                                embed.setDescription("The queue cannot be shuffled because the length may be small or there is not a game going on.");
                                embed.setThumbnail("https://i.imgur.com/eOoFlam.png?width=80&height=80");
                                return resolve({response: message.author, embed: embed, silent: false});
                            }
                        } else {
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("Truth or Dare");
                            embed.setDescription("The queue cannot be shuffled because the length may be small or there is not a game going on.");
                            embed.setThumbnail("https://i.imgur.com/eOoFlam.png?width=80&height=80");
                            return resolve({response: message.author, embed: embed, silent: false});
                        }
                    } else if(choiceArgs.toLowerCase() === "moveuser" && restrict1 === true) {
                        //!moveuser @BillyBob#1234 2
                        if(cur.hasOwnProperty(message.channel.id)) {
                            let userMove = "", numMove = cur[message.channel.id]['data'].length, numAssign = false, pIndex = -1;
                            if(args.length === 2) {
                                args.forEach(m => {
                                    let tmpMove = BotSettings.resolve.User(m);
                                    if(tmpMove !== false && userMove === "" && cur[message.channel.id]['data'].includes(tmpMove.id) === true) {
                                        userMove = tmpMove;
                                        pIndex = cur[message.channel.id]['data'].findIndex(tmpMove.id);
                                    } else if(BotSettings.validate.Range(m, 1, cur[message.channel.id]['data'].length - 1, false, "integer") === true) {
                                        numMove = parseInt(m);
                                        numAssign = true;
                                    }
                                });
                                if(userMove === "" || numAssign === false) {
                                    BotSettings.assist.error("You must tag a player in order to move them in the queue and provide a number in the range of the length of the queue.", message.channel);
                                    return resolve({response: "", silent: true});
                                }
                                args = [];
                                if(numAssign === pIndex) {
                                    BotSettings.assist.error("You cannot move that player if they are the same position as you have requested.", message.channel);
                                    return resolve({response: "", silent: false});
                                }
                                let newArr = BotSettings.assist.ArrayMove(cur[message.channel.id]['data'], pIndex, numAssign);
                                cur[message.channel.id]['data'] = newArr;
                                let embed = new Discord.MessageEmbed();
                                embed.setTitle("Truth or Dare");
                                embed.setDescription("The queue has been updated and the player that you have selected to move has been moved to his new position");
                                embed.setThumbnail("https://i.imgur.com/Fr2FEmk.png?width=80&height=80");
                                return resolve({response: message.author, embed: embed, silent: false});
                            } else {
                                BotSettings.assist.error("You must tag a player in order to move them in the queue and provide a number.  Example: \n", message.channel);
                                return resolve({response: "", silent: true});
                            }
                        } else {
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("Truth or Dare");
                            embed.setDescription("The person cannot be moved because the length of the queue is small or there is not a game going on.");
                            embed.setThumbnail("https://i.imgur.com/eOoFlam.png?width=80&height=80");
                            return resolve({response: message.author, embed: embed, silent: false});
                        }
                    } else if(choiceArgs.toLowerCase() === "setshuffle") {
                        if(cur.hasOwnProperty(message.channel.id)) {
                            let userChosen = "";
                            if(args.length === 1) {
                                let argName = args.shift(), extUser = false;
                                userChosen = BotSettings.resolve.User(argName);
                                if(userChosen !== false) {
                                    //valid user
                                    if(cur[message.channel.id]['data'].includes(userChosen.id) === true) {
                                        if(cur[message.channel.id]['leader'] !== "") {
                                            //extract user
                                            extUser = BotSettings.resolve.User(cur[message.channel.id]['leader']);
                                        }
                                        if(extUser !== false) {
                                            if(userChosen.id === extUser.id) {
                                                BotSettings.assist.error("Unable to assign the leader because it is the same person.", message.channel);
                                                return resolve({response: "", silent: true});
                                            } else {
                                                cur[message.channel.id]['leader'] = userChosen.id;
                                                let embed = new Discord.MessageEmbed();
                                                embed.setTitle("Truth or Dare");
                                                embed.setThumbnail("https://i.imgur.com/Fr2FEmk.png?width=80&height=80");
                                                embed.setDescription("The new leader for the queue is now: " + userChosen.tag);
                                                return resolve({response: message.author, embed: embed, silent: false});
                                            }
                                        } else {
                                            cur[message.channel.id]['leader'] = userChosen.id;
                                            let embed = new Discord.MessageEmbed();
                                            embed.setTitle("Truth or Dare");
                                            embed.setThumbnail("https://i.imgur.com/Fr2FEmk.png?width=80&height=80");
                                            embed.setDescription("The new leader for the queue is now: " + userChosen.tag);
                                            return resolve({response: message.author, embed: embed, silent: false});
                                        }
                                    } else {
                                        let embed = new Discord.MessageEmbed();
                                        embed.setTitle("Truth or Dare");
                                        embed.setDescription("The person cannot be found in the queue.");
                                        embed.setThumbnail("https://i.imgur.com/eOoFlam.png?width=80&height=80");
                                        return resolve({response: message.author, embed: embed, silent: false});
                                    }
                                } else {
                                    let embed = new Discord.MessageEmbed();
                                    embed.setTitle("Truth or Dare");
                                    embed.setDescription("The person cannot be found for some reason.");
                                    embed.setThumbnail("https://i.imgur.com/eOoFlam.png?width=80&height=80");
                                    return resolve({response: message.author, embed: embed, silent: false});
                                }
                            } else {
                                //or should it be randomly chosen?
                                BotSettings.assist.error("You must tag a player in order to set them as the shuffle leader and they also must be in the queue.", message.channel);
                                return resolve({response: "", silent: true});
                            }
                        } else {
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("Truth or Dare");
                            embed.setDescription("The person cannot be moved because the length of the queue is small or there is not a game going on.");
                            embed.setThumbnail("https://i.imgur.com/eOoFlam.png?width=80&height=80");
                            return resolve({response: message.author, embed: embed, silent: false});
                        }
                    } else if((choiceArgs.toLowerCase() === "n" || choiceArgs.toLowerCase() === "next") && restrict1 === true) {

                    } else if((choiceArgs.toLowerCase() === "s" || choiceArgs.toLowerCase() === "skip") && restrict1 === true) {

                    } else {
                        BotSettings.assist.error("Unable to find the correct option.  Here is the list of possible options: " + usage.options.filter((y,i) => {
                            if(permLevel >= usage.optPermLevel[i]) { return true;}
                            return false;
                        }).map((z) => { return "`" + z + "`";}).join(","), message.channel);
                        return resolve({response: "", silent: true});
                    }
                } else {
                    //not 4
                    if(choiceArgs.toLowerCase() === "help") {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("Truth or Dare - " + S(choiceArgs).capitalize().s);
                        embed.setDescription("Here is a list of the available commands and their descriptions.\n" + usage.options.map((z, i) => {
                            return "**__" + z + "__** - " + usage.optDesc[i];
                        }));
                        embed.setThumbnail("https://i.imgur.com/Fr2FEmk.png?width=80&height=80");
                        return resolve({response: "", embed: embed, silent: false});
                    } else if(choiceArgs.toLowerCase() === "q") {
                        //join the queue
                        if(cur.hasOwnProperty(message.channel.id) === true) {
                            if(cur[message.channel.id].hasOwnProperty("active") && cur[message.channel.id]['active'] === true) {
                                //insert into data
                                let tmpData = cur[message.channel.id]['data'];
                                if(tmpData.includes(message.author.id) === true) {
                                    BotSettings.assist.error("You are already in the Truth or Dare game that is going on.", message.channel);
                                    return resolve({response: "", silent: true});
                                } else {
                                    cur[message.channel.id]['data'].push(message.author.id);
                                    let getPos = cur[message.channel.id]['data'].length;
                                    let embed = new Discord.MessageEmbed();
                                    embed.setTitle("Truth or Dare");
                                    embed.setDescription("You have been successfully added to the Truth or Dare game.  You are #" + getPos + " out of " + getPos);
                                    embed.setThumbnail("https://i.imgur.com/Qlr5oRK.png?width=80&height=80");
                                    message.channel.send(message.author, {embed: embed}).then((fMes) => {
                                        return resolve({response: "", embed: embed, silent: false});
                                    }).catch(errMsg => {
                                        Logger.sendLog("-> Error when sending a message because...." + errMsg.message, "CRITICAL", __filename);
                                        return resolve({response: "", silent: true});
                                    })
                                }
                            } else {
                                cur[message.channel.id] = {active: true, data: [message.author.id]};
                                let embed = new Discord.MessageEmbed();
                                embed.setTitle("Truth or Dare");
                                embed.setDescription("You have been added successfully to the Truth or Dare game.  Since you are the first one here, tag your friends and bring them along.");
                                embed.setThumbnail("https://i.imgur.com/Qlr5oRK.png?width=80&height=80");
                                message.channel.send(message.author, {embed: embed}).then((fMes) => {
                                    return resolve({response: "", embed: embed, silent: false});
                                }).catch(errMsg => {
                                    Logger.sendLog("-> Error when sending a message because...." + errMsg.message, "CRITICAL", __filename);
                                    return resolve({response: "", silent: true});
                                });
                            }
                        } else {
                            cur[message.channel.id] = {active: true, data: [message.author.id], leader: ""};
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("Truth or Dare");
                            embed.setDescription("You have been added successfully to the Truth or Dare game.  Since you are the first one here, tag your friends and bring them along.");
                            embed.setThumbnail("https://i.imgur.com/Qlr5oRK.png?width=80&height=80");
                            message.channel.send(message.author, {embed: embed}).then((fMes) => {
                                return resolve({response: "", silent: true});
                            }).catch(errMsg => {
                                Logger.sendLog("-> Error when sending a message because...." + errMsg.message, "CRITICAL", __filename);
                                return resolve({response: "", silent: true});
                            });
                        }
                    } else if(choiceArgs.toLowerCase() === "d" || choiceArgs.toLowerCase() === "cq") {
                        //get current queue
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("Truth or Dare - Current Queue");
                        embed.setDescription("The current queue is: " + cur[message.channel.id]['data'].map(z => {return "`" + BotSettings.resolve.User(z).tag + "`"}).join("\n"));
                        message.channel.send(message.author, {embed: embed}).then(resMsg => {
                            return resolve({response: "", silent: true});
                        }).catch(errMsg => {
                            Logger.sendLog("-> Error when sending a message because...." + errMsg.message, "CRITICAL", __filename);
                            return resolve({response: "", silent: true});
                        });
                    } else {
                        BotSettings.assist.error("Unable to find the correct option.  Here is the list of possible options: " + usage.options.filter((y,i) => {
                            if(permLevel >= usage.optPermLevel[i]) { return true;}
                            return false;
                        }).map((z) => { return "`" + z + "`";}).join(","), message.channel);
                    }
                }
            } else {
                Logger.sendLog("-> Invalid permissions when calling " + S(choiceArgs).capitalize().s + " command", "CRITICAL", __filename);
                BotSettings.assist.error("You do not have the correct permissions.", message.channel);
                return resolve({response: "", silent: true});
            }
        }).catch(permErr => {
            Logger.sendLog("-> Error thrown when receiving the data.  " + permErr.message + " | stack: " + permErr.stack, "CRITICAL", __filename);
            BotSettings.assist.error("There was an error that was thrown for some reason.  Please try again in a few seconds.", message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: tordCmd}
];
