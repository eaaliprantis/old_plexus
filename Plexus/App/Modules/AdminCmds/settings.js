const moduleInfo = {
    name: "settings",
    truename: "settings",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usageConfig = {
    name: "config",
    cmdName: "config",
    aliases: ["config", "myconfig"],
    args: {min: 0, max: 0},
    description: "Displaying what you have set up for your guild",
    exampleUsage: "config",
    usage: "[command]",
    runIn: ["text"],
    categories: "Admin",
    permlvl: 5,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usage = {
    name: "settings",
    cmdName: "settings",
    aliases: ["settings", "set", "setting", "permission"],
    args: {min: 0, max: 50},
    description: "Configure the bot for your guild",
    exampleUsage: "settings channel support #channelnamehere\nsettings callcenter enable",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Admin",
    permlvl: 5,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

this.setupCommands = function(file) {
    this.file = file;
    return new Promise((resolve, reject) => {
        return resolve({file: this.file, moduleInfo: moduleInfo, commands: this.commands});
    });
}

let lstOpts = ["roles", "channel", "callcenter",
    "leavechannel", "joinchannel", "leavemessage", "joinmessage",
    "weblogging", "logs", "linklogs", "streamlogs", "ignore", "loglevel",
    "enable", "disable",
    "prefix", "nsfw", "language",
    "autorole", "description", "protection", "matcherino", 'challonge'
];

configCmd = (bot, message, arg, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let embed = new Discord.MessageEmbed();
        Database.callStatement("SELECT * FROM settings WHERE platform='discord' AND server='" + message.guild.id + "'").then((rows) => {
            if(rows.length === 1) {
                //found content
                let rData = rows[0];
                let content = "Configuration for **" + message.guild.name + "**\n";
                let validTxt = ":white_check_mark:", invalidTxt = ":negative_squared_cross_mark:";
                let sortArr = [];
                let respArr = [];
                let errorTxt = "", errorTitle = ":no_entry: **Error**";
                let exclusion = ["id", "platform", "server", "premium"];
                Object.keys(rData).forEach((data, index) => {
                    if(!exclusion.includes(data.toLowerCase())) {
                        let tmpFinalStr = "";

                        let isNull = (rData[data] === null) ? 1 : 0;

                        let dType = "";
                        if(data.endsWith("Rank") || data.endsWith("manager")) {
                            dType = "roles";
                        } else if(data.endsWith("Channel") || data.endsWith("logs")) {
                            dType = "channels";
                        } else {
                            dType = "text";
                        }
                        let isNullRsp = (isNull === 1) ? invalidTxt : validTxt;
                        tmpFinalStr += isNullRsp + " " + data.replaceAll("_", " ").replaceAll("Rank", "").replaceAll("Channel", "").replaceAll("logs", "");
                        if(dType === "roles" || dType === "channels") {

                            let tmpContent = "";
                            if(rData[data] !== null) {
                                tmpFinalStr += " - ";
                                if(rData[data].includes(",")) {
                                    //array
                                } else {
                                    tmpContent = message.guild[dType].find(val => {
                                        if(val.id === rData[data]) {
                                            return true;
                                        }
                                        return false;
                                    });
                                    if(tmpContent === undefined || tmpContent === null) {
                                        errorTxt += "\nUnable to find **__" + dType.replaceAll("s", "") + "__** for some reason.  Please set up **" + data + "** correctly.";
                                    } else {
                                        tmpFinalStr += tmpContent.toString();
                                    }
                                }
                            }
                        }
                        respArr.push(tmpFinalStr);
                        sortArr.push(isNull);
                    }
                });
                if(errorTxt.length >= 1) {
                    embed.addField(errorTitle, errorTxt, true);
                }
                let goodArr = [], badArr = [];
                respArr.forEach((stuff, index) => {
                    (sortArr[index] === 1) ? badArr.push(stuff) : goodArr.push(stuff);
                })
                embed.setDescription(content + badArr.join("\n") + "\n" + goodArr.join("\n"));
                embed.setColor("RANDOM");
                embed.setTitle("Configuration for this server.");
                return resolve({response: message.author, embed: embed, silent: false});
            } else {
                BotSettings.assist.error("There were no settings for this guild.", message.channel, message.author);
                return resolve({response: "", silent: true});
            }
        }).catch(err => {
            Logger.sendLog("Error when retrieving the settings for some reason.  " + err, "CRITICAL", __filename);
            BotSettings.assist.error("Unable to retrieve the settings for some reason.", message.channel, message.author);
            return resolve({response: "", silent: true});
        })
    })
}

settingsCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        if(args.length === 0) {
            let embed = new Discord.MessageEmbed();
            embed.setTitle("List of Available Options to set");
            let finalSortLst = lstOpts.sort((a, b) => {
                if(a > b) return 1;
                if(a < b) return -1;
                return 0;
            })
            embed.setDescription("**__Here are a list of settings that you can change.__**\n" + finalSortLst.join("\n"));
            return resolve({response: message.author, embed: embed, silent: false});
        }
        let S = require("string");
        Database.callStatement("SELECT * FROM settings WHERE platform='discord' AND server='" + message.guild.id + "'").then((rows) => {
            if(rows.length === 1) {
                let settingArg = args.shift();
                switch(settingArg) {
                    case "roles":
                        if(args.length == 2) {
                            let typeRole = args.shift();
                            if(BotSettings.assist.validateRoles(typeRole)) {
                                //valid
                                //grab id
                                let roleId = "";
                                if(message.mentions.roles.size === 1) {
                                    roleId = message.mentions.roles.first().id;
                                } else {
                                    if(args.length >= 1) {
                                        roleId = BotSettings.assist.extractInfo(args.join(" ").replaceAll("_", " "), "roles", "discord");
                                        if(roleId === null) {
                                            BotSettings.assist.error("Unable to extract role properly.  Please either tag the role that you would like to use OR grab the role id.", message.channel);
                                            return resolve({response: "", silent: true});
                                        }
                                    } else {
                                        BotSettings.assist.error("Unable to extract role properly.  Please either tag the role that you would like to use OR grab the role id.", message.channel);
                                        return resolve({response: "", silent: true});
                                    }
                                }
                                let checkValidRole = message.guild.roles.find(role => role.id === roleId || role.name === roleId);
                                let oldVars = rows[0];
                                if(checkValidRole !== null) {
                                    //found the role, grab the id
                                    let getId = checkValidRole.id;
                                    let oldRole = (message.guild.roles.find(role => role.id === oldVars[typeRole.toLowerCase() + "Rank"]) !== undefined) ? message.guild.roles.find(role => role.id === oldVars[typeRole.toLowerCase() + "Rank"]) : "N/A";
                                    if((oldRole !== undefined || oldRole !== "N/A" || oldRole !== null) && oldRole !== null && oldRole.hasOwnProperty("id") === true && oldRole.id === checkValidRole.id) {
                                        BotSettings.assist.error("The role that you are setting to " + S(typeRole.toLowerCase()).capitalize().s + " is the same as the set role.  Please try a different role.", message.channel);
                                        return resolve({response: "", silent: true});
                                    } else {
                                        Database.callStatement("UPDATE settings SET " + typeRole.toLowerCase() + "Rank='" + getId + "' WHERE platform='discord' AND server='" + message.guild.id + "'").then((rowsUpdated) => {
                                            let oldRoleType = (oldRole !== null && oldRole.hasOwnProperty("name") === true) ? oldRole.name : "N/A";
                                            let finalResp = "Your " + S(typeRole.toLowerCase()).capitalize().s + " channel value was updated from " + oldRoleType + " to " + checkValidRole.name;
                                            let embed = new Discord.MessageEmbed();
                                            embed.setColor('RANDOM');
                                            embed.setDescription(finalResp);
                                            message.channel.send("", {embed: embed});
                                            return resolve({response: "", silent: true});
                                        }).catch(rowError => {
                                            console.log(rowError);
                                            return resolve({response: "", silent: true});
                                        });
                                        return resolve({response: "", silent: true});
                                    }
                                } else {
                                    BotSettings.assist.error("Unable to extract role properly.  Please either tag the role that you would like to use OR grab the role id.", message.channel);
                                    return resolve({response: "", silent: true});
                                }
                            } else {
                                BotSettings.assist.error("Please enter a valid role: " + BotSettings.assist.getAvailRoles(), message.channel);
                                return resolve({response: "", silent: true});
                            }
                        } else {
                            BotSettings.assist.error("Please enter a valid role: " + BotSettings.assist.getAvailRoles().join(", "), message.channel);
                            return resolve({response: "", silent: true});
                        }
                        break;
                    case "channel":
                        if(args.length == 2) {
                            let typeRole = args.shift();
                            let channelId = "";
                            if(BotSettings.assist.validSupportRole(typeRole)) {
                                //valid id
                                //grab id
                                if(message.mentions.channels.size === 1){
                                    channelId = message.mentions.channels.first().id;
                                } else {
                                    if(args.length >= 1) {
                                        channelId = BotSettings.assist.extractInfo(args.join(" ").replaceAll("_", " "), "channel", "discord");
                                        if(channelId === null) {
                                            BotSettings.assist.error("Unable to extract role properly.  Please either tag the role that you would like to use OR grab the role id.", message.channel);
                                            return resolve({response: "", silent: true});
                                        }
                                    } else {
                                        BotSettings.assist.error("Unable to extract role properly.  Please either tag the role that you would like to use OR grab the role id.", message.channel);
                                        return resolve({response: "", silent: true});
                                    }
                                }
                                let checkValidChannel = message.guild.channels.find(channel => channel.id === channelId || channel.name === channelId);
                                let oldVars = rows[0];
                                if(checkValidChannel !== null) {
                                    //found the channel
                                    let getId = checkValidChannel.id;
                                    let oldRole = (message.guild.channels.find(role => role.id === oldVars[typeRole.toLowerCase() + "Channel"]) !== undefined) ? message.guild.channels.find(role => role.id === oldVars[typeRole.toLowerCase() + "Channel"]) : "N/A";
                                    if((oldRole !== undefined || oldRole !== "N/A" || oldRole !== null) && oldRole !== null && oldRole.hasOwnProperty("id") === true && oldRole.id === checkValidChannel.id) {
                                        BotSettings.assist.error("The support channel that you are setting to " + S(typeRole.toLowerCase()).capitalize().s + " is the same as the support channel that is set.  Please try a different support channel.", message.channel);
                                        return resolve({response: "", silent: true});
                                    } else {
                                        Database.callStatement("UPDATE settings SET " + typeRole.toLowerCase() + "Channel='" + getId + "' WHERE platform='discord' AND server='" + message.guild.id + "'").then((rowsUpdated) => {
                                            let oldRoleType = (oldRole !== null && oldRole.hasOwnProperty("name") === true) ? oldRole.name : "N/A";
                                            let finalResp = "Your " + S(typeRole.toLowerCase()).capitalize().s + " channel value was updated from " + oldRoleType + " to " + checkValidChannel.name;
                                            let embed = new Discord.MessageEmbed();
                                            embed.setColor('RANDOM');
                                            embed.setDescription(finalResp);
                                            message.channel.send("", {embed: embed});
                                            return resolve({response: "", silent: true});
                                        }).catch(rowError => {
                                            console.log(rowError);
                                            return resolve({response: "", silent: true});
                                        });
                                        return resolve({response: "", silent: true});
                                    }
                                    return resolve({response: "", silent: true});
                                } else {
                                    BotSettings.assist.error("Unable to extract channel properly.  Please either tag the channel that you would like to use OR grab the channel id.", message.channel);
                                    return resolve({response: "", silent: true});
                                }
                            } else {
                                BotSettings.assist.error("Please enter a valid channel name: support", message.channel);
                                return resolve({response: "", silent: true});
                            }
                        } else {
                            BotSettings.assist.error("Please enter a valid channel name: support", message.channel);
                            return resolve({response: "", silent: true});
                        }
                        break;
                    case "callcenter":
                        if(args.length === 1) {
                            let callcenterResp = args.shift();
                            let oldResp = rows[0].nsfw;
                            if(callcenterResp.toLowerCase() === "allow" || BotSettings.resolve.Bool(callcenterResp.toLowerCase())) {
                                if(oldResp === "1") {
                                    BotSettings.assist.error("The supportActive setting is already enabled for this server.", message.channel);
                                    return resolve({response: "", silent: true});
                                } else {
                                    Database.callStatement("UPDATE settings SET supportActive='1' WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowData => {
                                        let oldRespVal = (oldResp === "1") ? "enabled" : "disabled";
                                        let newRespVal = (oldResp !== "1") ? "enabled" : "disabled";
                                        let finalResp = "Your supportActive setting value was updated from " + oldRespVal + " to " + newRespVal;
                                        let embed = new Discord.MessageEmbed();
                                        embed.setColor('RANDOM');
                                        embed.setDescription(finalResp);
                                        message.channel.send("", {embed: embed});
                                        return resolve({response: "", silent: true});
                                    }).catch(errData => {
                                        console.log(errData);
                                        BotSettings.assist.error("Trying to update the database failed for some reason.", message.channel);
                                        return resolve({response: "", silent: true});
                                    })
                                }
                            } else {
                                if(oldResp === "0") {
                                    BotSettings.assist.error("The supportActive setting is already disabled for this server.", message.channel);
                                    return resolve({response: "", silent: true});
                                } else {
                                    Database.callStatement("UPDATE settings SET supportActive='0' WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowData => {
                                        let oldRespVal = (oldResp === "1") ? "enabled" : "disabled";
                                        let newRespVal = (oldResp !== "1") ? "enabled" : "disabled";
                                        let finalResp = "Your supportActive setting value was updated from " + newRespVal + " to " + oldRespVal;
                                        let embed = new Discord.MessageEmbed();
                                        embed.setColor('RANDOM');
                                        embed.setDescription(finalResp);
                                        message.channel.send("", {embed: embed});
                                        return resolve({response: "", silent: true});
                                    }).catch(errData => {
                                        console.log(errData);
                                        BotSettings.assist.error("Trying to update the database failed for some reason.", message.channel);
                                        return resolve({response: "", silent: true});
                                    });
                                }
                            }
                        } else {
                            BotSettings.assist.error("Usage: " + rows[0].prefix + "settings callcenter allow|deny", message.channel);
                            return resolve({response: "", silent: true});
                        }
                        break;
                    case "challonge":
                        message.delete().then((m) => {
                            Database.callStatement("SHOW COLUMNS FROM settings LIKE '%challonge_%'").then(data => {
                                let columnLst = [];
                                data.forEach((info) => {
                                    columnLst.push(info.Field.split("_")[1].toLowerCase());
                                });
                                let numArgs = 2;
                                if(args.length === numArgs) {
                                    let catChoice = args.shift();
                                    catChoice = catChoice.toLowerCase();
                                    if(columnLst.includes(catChoice)) {
                                        Database.callStatement("SELECT challonge_" + catChoice + " FROM settings WHERE platform='discord' AND server='" + m.guild.id + "' LIMIT 1").then((challongeData) => {
                                            if(challongeData.length !== 1) {
                                                BotSettings.assist.error("We do not have any data on this for some reason.  Please try again shortly.  ", m.channel);
                                                return resolve({response: "", silent: true});
                                            } else {
                                                let challonge = {}
                                                challonge[catChoice] = challongeData[0]['challonge_' + catChoice];
                                                let challongeContent = args.shift();
                                                if(catChoice === "manager") {
                                                    let challongeRoleId = BotSettings.assist.extractInfo(challongeContent, "roles", "discord");
                                                    let challongeRole = BotSettings.resolve.Role(challongeRoleId, message.guild);
                                                    if(challongeRole === false) {
                                                        BotSettings.assist.error("We were unable to find the correct role that you were assigning.  Please try again.");
                                                        return resolve({response: "", silent: true});
                                                    }
                                                    challongeContent = challongeRole.id;
                                                }
                                                if(challongeContent === challonge[catChoice]) {
                                                    //match - - same
                                                    BotSettings.assist.error("The data that you have entered was the same as before.", m.channel);
                                                    return resolve({response: "", silent: true});
                                                } else {
                                                    Database.callStatement("UPDATE settings SET challonge_" + catChoice + "='" + challongeContent + "' WHERE platform='discord' AND server='" + m.guild.id + "'").then((dataEntered) => {
                                                        let restartRequired = false;
                                                        if(BotSettings.hasOwnProperty("challonge") && BotSettings.challonge.hasOwnProperty(m.guild.id)) {
                                                            delete BotSettings.challonge[message.guild.id];
                                                            restartRequired = true;
                                                        }
                                                        message.channel.send(message.author + ", updated finished for challonge " + catChoice + ".  Please run the `" + prefixUsed + "challonge` command in order to re-instance challonge.").then(() => {
                                                            return resolve({response: "", silent: true});
                                                        }).catch(errMsg => {
                                                            Logger.sendLog("Error when sending message because.... " + errMsg, "CRITICAL", __filename);
                                                            return resolve({response: "", silent: true});
                                                        })
                                                    }).catch(challongeErr => {
                                                        Logger.sendLog("There was an error thrown when updating for some reason.  " + challongeErr, "CRITICAL", __filename);
                                                        BotSettings.assist.error("An error was thrown when updating the table.  Please try again.", message.channel, message.author);
                                                        return resolve({response: "", silent: true});
                                                    })
                                                }
                                            }
                                        }).catch(challongeErr => {
                                            Logger.sendLog("There was an error thrown when selecting for some reason.  " + challongeErr, "CRITICAL", __filename);
                                            BotSettings.assist.error("An error was thrown when selecting the table.  Please try again.", message.channel, message.author);
                                            return resolve({response: "", silent: true});
                                        });
                                    } else {
                                        BotSettings.assist.error("We were unable to determine which category you were looking for.  Available options: " + columnLst.join(", "), message.channel, message.author);
                                        return resolve({response: "", silent: true});
                                    }
                                } else {
                                    BotSettings.assist.error("We were unable to determine which category you were looking for.  You must have at least " + numArgs + " args.  Available options: \n" + columnLst.join(", "), message.channel, message.author);
                                    return resolve({response: "", silent: true});
                                }
                            }).catch(errData => {
                                Logger.sendLog("Unable to get columns for settings with challonge_ because.... " + errData);
                                BotSettings.assist.error("There was an error with getting the column titles.  We apologize.", message.channel);
                                return resolve({response: "", silent: true});
                            })
                        }).catch(errM => {
                            Logger.sendLog("Unable to delete message because.... " + errM, "CRITICAL", __filename);
                            message.channel.send("Unable to delete the message because " + errM, message.channel, message.author).then((m2) => {
                                return resolve({response: "", silent: true});
                            }).catch(errM2 => {
                                Logger.sendLog("Unable to delete message because.... " + errM2, "CRITICAL", __filename);
                                return resolve({response: "", silent: true});
                            });
                        })
                        break;
                    case "matcherino":
                        message.delete().then((m) => {
                            Database.callStatement("SHOW COLUMNS FROM settings LIKE '%matcherino_%'").then(data => {
                                let columnLst = [];
                                data.forEach((info) => {
                                    columnLst.push(info.Field.split("_")[1].toLowerCase())
                                });
                                if(args.length >= 2) {
                                    let catChoice = args.shift();
                                    catChoice = catChoice.toLowerCase();
                                    if(columnLst.includes(catChoice)) {
                                        console.log(message.guild.id + " | " + message.channel.id);
                                        Database.callStatement("SELECT matcherino_" + catChoice + " FROM settings WHERE platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(matchData => {
                                            if(matchData.length !== 1) {
                                                BotSettings.assist.error("We do not have any data on this for some reason.  Please try again shortly.  ", message.channel);
                                                return resolve({response: "", silent: true});
                                            }
                                            let matcherino = {}
                                            matcherino[catChoice] = matchData[0]["matcherino_" + catChoice];
                                            let matchContent = args.shift();
                                            if(matchContent === matcherino[catChoice]) {
                                                //match - - same
                                                BotSettings.assist.error("The data that you have entered was the same as before.", message.channel);
                                                return resolve({response: "", silent: true});
                                            } else {
                                                console.log(message.guild.id + " | " + message.channel.id);
                                                Database.callStatement("UPDATE settings SET matcherino_" + catChoice + "='" + matchContent + "' WHERE platform='discord' AND server='" + message.guild.id + "'").then(dataEntered => {
                                                    Logger.sendLog("Updated occurred....", "INFO", __filename);
                                                    message.channel.send(message.author + ", updated finished.  ").then(m2 => {
                                                        return resolve({response: "", silent: true});
                                                    }).catch(err2 => {
                                                        Logger.sendLog("Error when sending message for some reason.... " + err2, "CRITICAL", __filename);
                                                        return resolve({response: "", silent: true});
                                                    })
                                                }).catch(errU => {
                                                    Logger.sendLog("Error when updating data.... " + errU, "CRITICAL", __filename);
                                                    BotSettings.assist.error("There was an error when updating the database " + errU, message.channel);
                                                    return resolve({response: "", silent: true});
                                                })
                                            }
                                        }).catch(errMatch => {
                                            Logger.sendLog("There was an error for some reason retrieving the matcherino_" + catChoice + " because.... " + errMatch, "CRITICAL", __filename);
                                            BotSettings.assist.error("There was a MySQL error for some reason.... " + errMatch, message.channel);
                                            return resolve({response: "", silent: true});
                                        })
                                    } else {
                                        BotSettings.assist.error("You did not provide a valid sub category.\nAvailable options: " + columnLst.join(", "), message.channel);
                                        return resolve({response: "", silent: true});
                                    }
                                } else {
                                    if(args.length === 1) {
                                        BotSettings.assist.error("You have provided a category but did not provide another argument.", message.channel);
                                        return resolve({response: "", silent: true});
                                    }
                                    BotSettings.assist.error("You must provide a category that you would like to set.\nAvailable options: " + columnLst.join(", "), m.channel);
                                    return resolve({response: "", silent: true});
                                }
                            }).catch(errData => {
                                Logger.sendLog("There was an error getting this log.... " + errData, "CRITICAL", __filename);
                                BotSettings.assist.error("Error when retrieving the data for columns.... " + errData, message.channel);
                                return resolve({response: "", silent: true});
                            });
                        }).catch(errM => {
                            Logger.sendLog("Unable to delete message for some reason.  Error: " + errM, "CRITICAL", __filename);
                            BotSettings.assist.error("We were unable to delete the message.  Missing perms: " + errM, message.channel);
                            return resolve({response: "", silent: true});
                        })
                        break;
                    case "leavechannel":
                    case "leave channel":
                    case "leave_channel":
                        return resolve({response: "Getting this to work soon.", silent: false});
                    case "joinchannel":
                    case "join channel":
                    case "join_channel":
                        return resolve({response: "Getting this to work soon.", silent: false});
                    case "leavemessage":
                    case "leave message":
                    case "leave_message":
                    case "leave":
                        return resolve({response: "Getting this to work soon.", silent: false});
                    case "joinmessage":
                    case "join message":
                    case "join_message":
                    case "join":
                        return resolve({response: "Getting this to work soon.", silent: false});
                    case "weblogging":
                        return resolve({response: "Getting this to work soon.", silent: false});
                    case "logs":
                        let channelId = "";
                        if(args.length === 1) {
                            if(message.mentions.channels.size === 1){
                                channelId = message.mentions.channels.first();
                            } else {
                                if(args.length >= 1) {
                                    channelId = BotSettings.assist.extractInfo(args.join(" ").replaceAll("_", " "), "channel", "discord");
                                    channelId = BotSettings.resolve.Channel(channelId);
                                    if(channelId === null || channelId === false) {
                                        BotSettings.assist.error("Unable to extract role properly.  Please either tag the role that you would like to use OR grab the role id.", message.channel);
                                        return resolve({response: "", silent: true});
                                    }
                                } else {
                                    BotSettings.assist.error("Unable to extract role properly.  Please either tag the role that you would like to use OR grab the role id.", message.channel);
                                    return resolve({response: "", silent: true});
                                }
                            }
                            Database.callStatement("SELECT * FROM settings WHERE platform='discord' AND server='" + message.guild.id +"' LIMIT 1").then(rows => {
                                if(rows.length === 1) {
                                    let dataRow = rows[0];
                                    if(dataRow.modlogs === channelId.id) {
                                        BotSettings.assist.error("The channel that you are setting is the same as the set channel.  Please try a different channel.", message.channel);
                                        return resolve({response: "", silent: true});
                                    } else {
                                        Database.callStatement("UPDATE settings SET modlogs='" + channelId.id + "' WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowLog => {
                                            let finalResp = "Your modlogs have been updated from `" + dataRow.modlogs + "` to `" + channelId.id + "`";
                                            let embed = new Discord.MessageEmbed();
                                            embed.setColor('RANDOM');
                                            embed.setDescription(finalResp);
                                            message.channel.send("", {embed: embed}).then(() => {
                                                return resolve({response: "", silent: true});
                                            }).catch(e => {
                                                Logger.sendLog("-> Unable to send a message from because... " + e, "CRITICAL", __filename);
                                                return resolve({response: "", silent: true});
                                            });
                                        }).catch(errorRowLog => {
                                            Logger.sendLog("-> Unable to select from the database because... " + errorRowLog, "CRITICAL", __filename);
                                            BotSettings.assist.error("There was a problem updating your data.  Please try again shortly.", message.channel);
                                            return resolve({response: "", silent: true});
                                        });
                                    }
                                } else {

                                }
                            }).catch(errRows => {
                                Logger.sendLog("-> Unable to select from the database because... " + errRows, "CRITICAL", __filename);
                                BotSettings.assist.error("There was a problem retrieving your data.  Please try again shortly.", message.channel);
                                return resolve({response: "", silent: true});
                            });
                        } else {
                            BotSettings.assist.error("You need to have 1 argument which would be a channel.", message.channel);
                            return resolve({response: "", silent: true});
                        }
                        break;
                    case "linklogs":
                        let validResp2 = ["yes", "no", "1", "0"];
                        if(args.length === 1) {
                            let optResp = args.shift();
                            if(optResp.toLowerCase() === "allow" || BotSettings.resolve.Bool(optResp.toLowerCase())) {
                                //turning on
                            } else {
                                //turning off
                            }
                        } else {
                            BotSettings.assist.error("Usage: " + rows[0].prefix + "settings linklogs " + validResp2.join("|"), message.channel);
                            return resolve({response: "", silent: true});
                        }
                        break;
                    case "streamlogs":
                        if(args.length === 1) {
                            let name = args.shift();
                            let channel = "";
                            if(message.mentions.channels && message.mentions.channels.size === 1) {
                                channel = message.mentions.channels.first();
                            } else {
                                channel = message.guild.channels.find((val) => {
                                    if(val.name === name && val.type === "text") {
                                        return true;
                                    }
                                    return false;
                                });
                            }
                            if(channel === undefined) {
                                BotSettings.assist.error("We were unable to find the text channel for some reason.", message.channel, message.author);
                                return resolve({response: "", silent: true});
                            } else {
                                let channelId = channel.id;
                                Database.callStatement("SELECT streamlogs FROM settings where platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(rows => {
                                    if(rows.length === 1) {
                                        let data = rows[0];
                                        if(data.streamlogs === channelId) {
                                            BotSettings.assist.error("Duplicate data entry.  Not going to change the data.", message.channel, message.author);
                                            return resolve({response: "", silent: true});
                                        } else {
                                            Database.callStatement("UPDATE settings SET streamlogs='" + channelId + "' WHERE platform='discord' AND server='" + message.guild.id + "'").then(() => {
                                                message.channel.send(":white_check_mark: Update complete!").catch(errMsg => {
                                                    Logger.sendLog("Unable to send message because..... " + errMsg, "CRITICAL", __filename);
                                                    BotSettings.assist.error("While we have updated your command correctly, we were unable to send the message in the channel.", message.author, message.author);
                                                    return resolve({response: "", silent: true});
                                                })
                                            }).catch(errUpdate => {
                                                Logger.sendLog("Unable to update because.... " + errUpdate, "CRITICAL", __filename);
                                                BotSettings.assist.error("We were unable to update the streamlogs for some reason.  Please try again shortly.", message.channel, message.author);
                                                return resolve({response: "", silent: true});
                                            })
                                        }
                                    } else {
                                        BotSettings.assist.error("We were unable to find your settings for streamlogs.  Please try again.", message.channel, message.author);
                                        return resolve({response: "", silent: true});
                                    }
                                }).catch(errRow => {
                                    Logger.sendLog("Error when retrieving data... " + errRow, "CRITICAL", __filename);
                                    BotSettings.assist.error("There was an error when trying to connect to the DB for some reason.  We apologize.", message.channel, message.author);
                                    return resolve({response: "", silent: true});
                                })
                            }
                        } else {
                            BotSettings.assist.error("You need 1 argument which must be a channel.", message.channel, message.author);
                            return resolve({response: "", silent: true});
                        }
                        break;
                    case "ignore":
                        return resolve({response: "Getting this to work soon.", silent: false});
                    case "loglevel":
                        return resolve({response: "Getting this to work soon.", silent: false});
                    case "enable":
                        return resolve({response: "Getting this to work soon.", silent: false});
                    case "disable":
                        return resolve({response: "Getting this to work soon.", silent: false});
                    case "prefix":
                        let validResp = ["main", "game"];
                        if(args.length >= 1 && args.length < 3) {
                            if(!args[0] || !args[1]) {
                                BotSettings.assist.error("Usage: " + rows[0].prefix + "settings prefix " + validResp.join("|") + " newprefix", message.channel);
                                return resolve({response: "", silent: true});
                            } else if(args[0].toLowerCase() === "reset") {
                                let prefixSet = {prefix: BotSettings.config.prefix, game: BotSettings.config.prefixGame};
                                Database.callStatement("UPDATE settings SET prefix='" + prefixSet.prefix + "', prefixgame='" + prefixSet.game + "' WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowData => {
                                    let embed = new Discord.MessageEmbed();
                                    embed.setColor('RANDOM');
                                    embed.setDescription("Both of your prefixes have been set to the default values for your server.");
                                    message.channel.send("", {embed: embed}).then(() => {
                                        return resolve({response: "", silent: true});
                                    }).catch(e => {
                                        BotSettings.assist.error("Trying to send a message failed for some reason.  " + e.message, "CRITICAL", __filename);
                                        return resolve({response: "", silent: true});
                                    });
                                }).catch(errData => {
                                    console.log(errData);
                                    BotSettings.assist.error("Trying to update the database failed for some reason.", message.channel);
                                    return resolve({response: "", silent: true});
                                });
                            }
                            if(args.length === 2) {
                                let argType = args.shift();
                                argType = argType.toLowerCase();
                                if(validResp.includes(argType) === false) {
                                    BotSettings.assist.error("Prefix not changed since it is not a valid arg.  Usage: " + rows[0].prefix + "settings prefix " + validResp.join("|") + " newprefix", message.channel);
                                    return resolve({response: "", silent: true});
                                }
                                let newPrefix = args.shift();
                                if(newPrefix.length > 32 || newPrefix.length < 0) {
                                    BotSettings.assist.error("Prefix not changed since prefix length must be in between 1 and 32 characters, inclusively.  Usage: " + rows[0].prefix + "settings prefix " + validResp.join("|") + " newprefix", message.channel);
                                    return resolve({response: "", silent: true});
                                }
                                BotSettings.assist.setGuildPrefix(message, newPrefix.split(" "), argType).then((response) => {
                                    if(response.valid === true) {
                                        return resolve({response: response.response, silent: false});
                                    } else {
                                        return resolve({response: "Something went wrong.  Default prefix is: " + BotSettings.config.prefix, silent: false});
                                    }
                                }).catch(err => {
                                    console.log(err.message);
                                    return resolve({response: "Something went wrong.  Default prefix is: " + BotSettings.config.prefix, silent: false});
                                });

                            } else {
                                BotSettings.assist.error("Prefix not changed since it is not a valid arg.  Usage: " + rows[0].prefix + "settings prefix " + validResp.join("|") + " newprefix", message.channel);
                                return resolve({response: "", silent: true});
                            }

                        } else {
                            BotSettings.assist.error("Trying to update the database failed for some reason.  Available options: " + validResp.join("\n"), message.channel);
                            return resolve({response: "", silent: true});
                        }
                        break;
                    case "nsfw":
                        if(args.length === 1) {
                            let nsfwResp = args.shift();
                            let oldResp = rows[0].nsfw;
                            if(nsfwResp.toLowerCase() === "allow" || BotSettings.resolve.Bool(nsfwResp.toLowerCase())) {
                                if(oldResp === "1") {
                                    BotSettings.assist.error("The nsfw setting is already enabled for this server.", message.channel);
                                    return resolve({response: "", silent: true});
                                } else {
                                    Database.callStatement("UPDATE settings SET nsfw='1' WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowData => {
                                        let oldRespVal = (oldResp === "1") ? "enabled" : "disabled";
                                        let newRespVal = (oldResp !== "1") ? "enabled" : "disabled";
                                        let finalResp = "Your nsfw setting value was updated from " + oldRespVal + " to " + newRespVal;
                                        let embed = new Discord.MessageEmbed();
                                        embed.setColor('RANDOM');
                                        embed.setDescription(finalResp);
                                        message.channel.send("", {embed: embed});
                                        return resolve({response: "", silent: true});
                                    }).catch(errData => {
                                        console.log(errData);
                                        BotSettings.assist.error("Trying to update the database failed for some reason.", message.channel);
                                        return resolve({response: "", silent: true});
                                    })
                                }
                            } else {
                                if(oldResp === "0") {
                                    BotSettings.assist.error("The nsfw setting is already disabled for this server.", message.channel);
                                    return resolve({response: "", silent: true});
                                } else {
                                    Database.callStatement("UPDATE settings SET nsfw='0' WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowData => {
                                        let oldRespVal = (oldResp === "1") ? "enabled" : "disabled";
                                        let newRespVal = (oldResp !== "1") ? "enabled" : "disabled";
                                        let finalResp = "Your nsfw setting value was updated from " + newRespVal + " to " + oldRespVal;
                                        let embed = new Discord.MessageEmbed();
                                        embed.setColor('RANDOM');
                                        embed.setDescription(finalResp);
                                        message.channel.send("", {embed: embed});
                                        return resolve({response: "", silent: true});
                                    }).catch(errData => {
                                        console.log(errData);
                                        BotSettings.assist.error("Trying to update the database failed for some reason.", message.channel);
                                        return resolve({response: "", silent: true});
                                    });
                                }
                            }
                        } else {
                            BotSettings.assist.error("Usage: " + rows[0].prefix + "settings nsfw allow|deny", message.channel);
                            return resolve({response: "", silent: true});
                        }
                        break;
                    case "language":
                        if(args.length === 1) {
                            let langChoice = args.shift();
                            Database.callStatement("SELECT * FROM languages WHERE abbr='" + langChoice + "' OR name='" + langChoice + "'").then(rowData => {
                                if(rowData.length > 1) {
                                    let responseInfo = [];
                                    rowData.forEach(row => {
                                        let isSupported = (parseInt(row.supported) === 1) ? "Supported." : "Not supported.";
                                        responseInfo.push(row.name + " - " + row.abbr + " - " + isSupported);
                                    });
                                    let embed = new Discord.MessageEmbed();
                                    embed.setColor("RANDOM");
                                    embed.setDescription("There are currently " + rowData.length + " languages that you have chosen.  Please choose the language by name.\n" + responseInfo.join("\n"));
                                    message.channel.send("", {embed: embed});
                                    return resolve({response: "", silent: true});
                                } else if(rowData.length === 1) {
                                    let responseData = rowData[0];
                                    let isSupported = (parseInt(responseData.supported) === 1) ? "Supported." : "Not supported.";
                                    if(parseInt(responseData.supported) === 1) {
                                        Database.callStatement("UPDATE settings SET language='" + responseData.id + "' WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowData2 => {
                                            let embed = new Discord.MessageEmbed();
                                            embed.setColor("RANDOM");
                                            embed.setDescription("Successfully updated your language");
                                            message.channel.send("", {embed: embed});
                                            return resolve({response: "", silent: true});
                                        }).catch(errData2 => {
                                            console.log(errData2);
                                            BotSettings.assist.error("Trying to get information from the database failed for some reason.", message.channel);
                                            return resolve({response: "", silent: true});
                                        });
                                    } else {
                                        let embed = new Discord.MessageEmbed();
                                        embed.setColor("RANDOM");
                                        embed.setDescription("We currently do not support that requested language.  If you would like to help translate, please message one of the staff members found in the info command");
                                        message.channel.send("", {embed: embed});
                                        return resolve({response: "", silent: true});
                                    }
                                } else {
                                    BotSettings.assist.error("Was unable to find the information that you were looking for.", message.channel);
                                    return resolve({response: "", silent: true});
                                }
                            }).catch(errData => {
                                console.log(errData);
                                BotSettings.assist.error("Trying to get information from the database failed for some reason.", message.channel);
                                return resolve({response: "", silent: true});
                            });
                        }
                        break;
                    case "autorole":
                        let roleResp = args[0];
                        if(roleResp === "reset") {
                            Database.callStatement("UPDATE settings SET autoroleRank='', autoroleEnable='0' WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowData => {
                                let embed = new Discord.MessageEmbed();
                                embed.setColor("RANDOM");
                                embed.setDescription(":ballot_box_with_check: Success!\n\nSuccessfully removed your auto assigning role(s)");
                                message.channel.send("", {embed: embed});
                                return resolve({response: "", silent: true});
                            }).catch(errData => {
                                console.log(errData);
                                BotSettings.assist.error("Trying to update the database failed for some reason.", message.channel);
                                return resolve({response: "", silent: true});
                            });
                        }
                        else if(roleResp === "false" || roleResp === "off") {
                            Database.callStatement("UPDATE settings SET autoroleEnable='0' WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowData => {
                                let embed = new Discord.MessageEmbed();
                                embed.setColor("RANDOM");
                                embed.setDescription(":ballot_box_with_check: Success!\n\nSuccessfully removed your auto assigning role(s)");
                                message.channel.send("", {embed: embed});
                                return resolve({response: "", silent: true});
                            }).catch(errData => {
                                console.log(errData);
                                BotSettings.assist.error("Trying to update the database failed for some reason.", message.channel);
                                return resolve({response: "", silent: true});
                            });
                        } else {
                            var roleIds = [];
                            var failed = [];
                            var roleNames = [];
                            for(let i in args) {
                                let role = BotSettings.resolve.Role(args[i], message.guild);
                                if(!role) {
                                    failed.push(args[i]);
                                } else {
                                    roleIds.push(role.id);
                                    roleNames.push(role.name);
                                }
                            }
                            if(roleIds.length === 0) {
                                BotSettings.assist.error("No roles were found", message.channel);
                                return resolve({response: "", silent: true});
                            }
                            Database.callStatement("UPDATE settings SET autoroleRank='" + roleIds.join(",") +"', autoroleEnable='1' WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowData => {
                                let embed = new Discord.MessageEmbed();
                                embed.setColor("RANDOM");
                                embed.setDescription(":ballot_box_with_check: Success!\n\nSuccessfully set your automatic role(s) to " + roleNames.join(", "));
                                message.channel.send("", {embed: embed});
                                return resolve({response: "", silent: true});
                            }).catch(errData => {
                                console.log(errData);
                                BotSettings.assist.error("Trying to update the database failed for some reason.", message.channel);
                                return resolve({response: "", silent: true});
                            });
                        }
                        break;
                    case "description":
                        Database.callStatement("UPDATE settings SET description='" + args.join(" ").split( "\"" ).join( "\\\"" ).split( "'" ).join( "\\'" ) + "' WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowData => {
                            let embed = new Discord.MessageEmbed();
                            embed.setColor("RANDOM");
                            embed.setDescription("Your description for your guild has been updated.");
                            message.channel.send("", {embed: embed});
                            return resolve({response: "", silent: true});
                        }).catch(errData => {
                            console.log(errData);
                            BotSettings.assist.error("Trying to update the database failed for some reason.", message.channel);
                            return resolve({response: "", silent: true});
                        });
                        break;
                    case "protection":
                        if(args.length === 1) {
                            let boolResp = args.shift();
                            if(BotSettings.resolve.Bool(boolResp)) {
                                if(rows[0].protection === "1") {
                                    BotSettings.assist.error("Will not be updating variable since Higher role protection is turned on.", message.channel);
                                    return resolve({response: "", silent: true});
                                }
                                Database.callStatement("UPDATE settings SET protection='1' WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowData => {
                                    let embed = new Discord.MessageEmbed();
                                    embed.setColor("RANDOM");
                                    embed.setDescription("Successfully enabled Higher role protection");
                                    message.channel.send("", {embed: embed});
                                    return resolve({response: "", silent: true});
                                }).catch(errData => {
                                    console.log(errData);
                                    BotSettings.assist.error("Trying to update the database failed for some reason.", message.channel);
                                    return resolve({response: "", silent: true});
                                });
                            } else {
                                if(rows[0].protection !== "1") {
                                    BotSettings.assist.error("Will not be updating variable since Higher role protection is disabled.", message.channel);
                                    return resolve({response: "", silent: true});
                                }
                                Database.callStatement("UPDATE settings SET protection='0' WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowData => {
                                    let embed = new Discord.MessageEmbed();
                                    embed.setColor("RANDOM");
                                    embed.setDescription("Successfully disabled Higher role protection");
                                    message.channel.send("", {embed: embed});
                                    return resolve({response: "", silent: true});
                                }).catch(errData => {
                                    console.log(errData);
                                    BotSettings.assist.error("Trying to update the database failed for some reason.", message.channel);
                                    return resolve({response: "", silent: true});
                                });
                            }
                        } else {
                            BotSettings.assist.error("Incorrect amount of args.  Usage: " + rows[0].prefix + "settings protection true/false/yes/no \n\nThis setting will prevent users with higher roles than who is moderating from getting moderated.", message.channel);
                            return resolve({response: "", silent: true});
                        }
                        break;
                    default:
                        BotSettings.assist.error("Unable to find any of the settings that you are looking for.", message.channel);
                        return resolve({response: "", silent: true});
                }
            } else {
                return resolve({response: "Unable to find server settings for you....", silent: false});
            }
        }).catch(err => {
            console.log(err);
            return resolve({response: "Error was thrown", silent: false});

        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: settingsCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageConfig.aliases, args: usageConfig.args, usage: usageConfig, run: configCmd}
];
