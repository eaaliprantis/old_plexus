/*
//TODO: Adding a couple of new features
Normal level (level 0):
    End: End the current call - - COMPLETE
    Cancel: Cancel the current request/ticket - - COMPLETE
    Dial: Will create a support request/ticket - - COMPLETE
Supper level (level ???):
    Pickup <ID>: Will answer a phone call (this creates a private room) - - COMPLETE
    DECLINE <ID>: Will decline a phone call (this just declines it outright) - - COMPLETE
    Cancel: Will cancel a current call and allow the user to run the command again with no timeout - - COMPLETE
    Blacklist <User>: will blacklist a user from using support commands - - OPTIONAL
    Unblacklist <User>: will unblacklist a user from using the support commands - - OPTIONAL
*/

const moduleInfo = {
    name: "callcenter",
    truename: "callcenter",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usageCall = {
    name: "call",
    cmdName: "call",
    aliases: ["call", "dial"],
    args: {min: 0, max: 50},
    description: "Will call the Customer Support Center for the guild",
    exampleUsage: "call I have a question to ask.",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Support",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usagePickup = {
    name: "pickup",
    cmdName: "pickup",
    aliases: ["pickup", "answer"],
    args: {min: 1, max: 1},
    description: "Will answer a current call with ID and allow the user to run the command again with no timeout",
    exampleUsage: "pickup <ID>\n\nNote: do not use the carrots (< or >)",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Support",
    permlvl: 2,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageDecline = {
    name: "decline",
    cmdName: "decline",
    aliases: ["decline", "deny"],
    args: {min: 1, max: 25},
    description: "Will deny a call coming in with ID and allow the user to run the command again with no timeout.  [Optional answer allowed]",
    exampleUsage: "decline <ID> (reason)\nNote: do not use the carrots (< or >); Reason is optional",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Support",
    permlvl: 2,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageCancel = {
    name: "cancel",
    cmdName: "cancel",
    aliases: ["cancel"],
    args: {min: 0, max: 0},
    description: "Will cancel the current call that a user has requested",
    exampleUsage: "cancel",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Support",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageEnd = {
    name: "end",
    cmdName: "end",
    aliases: ['end', 'endcall'],
    args: {min: 0, max: 0},
    description: "Will end the current ongoing call with the support representative",
    exampleUsage: "endcall",
    usage: "[command]",
    runIn: ["text"],
    categories: 'Support',
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageSupportCancel = {
    name: "cancel",
    cmdName: "supportcancel",
    aliases: ['supportcancel', 'scancel'],
    args: {min: 0, max: 0},
    description: "Will cancel the request made by the user via the customer representative",
    exampleUsage: 'scancel',
    usage: "[command]",
    runIn: ["text"],
    categories: 'Support',
    permlvl: 2,
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

callCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        if(args.length < 5) {
            BotSettings.assist.error(":telephone_receiver: Please include a description (at least 5 characters) of your issue that you are having in the " + message.guild.name + " server so we can provide you the fastest support.", message.channel);
            return resolve({response: "", silent: true});
        } else {
            Database.callStatement("SELECT supportActive FROM settings WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowActive => {
                if(rowActive.length === 1) {
                    if(rowActive[0].supportActive === 1) {
                        Database.callStatement("SELECT * FROM callcenter WHERE platform='discord' AND server='" + message.guild.id + "' ORDER BY caseId DESC LIMIT 1").then(supportOrder => {
                            let supportId = 1;
                            if(supportOrder.length === 1) {
                                supportId = parseInt(supportOrder[0].caseId) + 1;
                            }
                            if(supportOrder.length >= 1) {
                                //checking if they already have an active call
                                let supportCheck = supportOrder.filter(x => {
                                    if(x.platform.toLowerCase() === 'discord' && x.user === message.author.id && parseInt(x.active) === 1 || parseInt(x.active) === 2) {
                                        return true;
                                    }
                                    return false;
                                });
                                if(supportCheck.length >= 1) {
                                    let embed = new Discord.MessageEmbed();
                                    embed.setTitle(":telephone_receiver: We are unable to start another call for you.");
                                    embed.setDescription("Your current Ticket ID for this guild is: " + supportCheck[0].caseId);
                                    embed.setColor("RED");
                                    return resolve({response: message.author, embed: embed, silent: false});
                                }
                            }
                            Database.callStatement("INSERT INTO callcenter (caseId, platform, server, user, description, active) VALUES ('" + supportId + "', 'discord', '" + message.guild.id + "', '" + message.author.id + "', '" + args.join(" ").split( "\"" ).join( "\\\"" ).split( "'" ).join( "\\'" ) + "', '1')").then((row) => {
                                message.channel.send(":telephone_receiver: Alright, a customer support representative for " + message.guild.name + " will pick up your call as soon as possible. Your ID is `" + supportId + "`").then(m => {
                                    Database.callStatement("SELECT supportChannel FROM settings WHERE platform='discord' AND server='" + message.guild.id + "'").then(rows => {
                                        if(rows.length === 1) {
                                            let supportChannel = rows[0].supportChannel; //the channel id;
                                            let getChannelObj = message.guild.channels.find(channel => channel.id === supportChannel);
                                            let messageEmbed = new Discord.MessageEmbed();
                                            messageEmbed.setTitle(":telephone_receiver: Incoming call with ID " + supportId)
                                            messageEmbed.setDescription("From: " + message.author.username + "(" + message.author.id + ")" + "\nReason: " + args.join(" "));
                                            getChannelObj.send("", {embed: messageEmbed}).catch(msgErr => {
                                                Logger.sendLog("-> Unable to send the message for some reason.  " + msgErr.message);
                                                return resolve({response: "", silent: true});
                                            }).then(msgUpdate => {
                                                Logger.sendLog("-> Message was sent to the supper channel", "INFO", __filename);
                                                return resolve({response: "", silent: true});
                                            });
                                        } else {
                                            Logger.sendLog("-> Unable to find the supportChannel object.", "CRITICAL", __filename);
                                            BotSettings.assist.error("We were unable to find the supportChannel for this guild", message.channel);
                                            return resolve({response: "", silent: true});
                                        }
                                    }).catch(errRow => {
                                        Logger.sendLog("-> An error occurred when retrieving the supportChannel.  " + errRow.message, "CRITICAL", __filename);
                                        BotSettings.assist.error("An error occurred when retrieving the supportChannel.  " + errRow.message, message.channel);
                                        return resolve({response: "", silent: true});
                                    });
                                }).catch(errM => {
                                    Logger.sendLog("-> An error occurred.  " + errM.message, "CRITICAL", __filename);
                                    BotSettings.assist.error("An error message has occurred when calling the database.... " + errM.message, message.channel);
                                    return resolve({response: "", silent: true});
                                })
                            }).catch(err => {
                                console.log(err.message);
                                Logger.sendLog("-> An error message has occurred when calling the database.... " + err.message, "CRITICAL", __filename);
                                BotSettings.assist.error("An error message has occurred when calling the database.... " + err.message, message.channel);
                                return resolve({response: "", silent: true});
                            });
                        }).catch(supportErr => {
                            console.log(supportErr.message);
                            Logger.sendLog("-> An error message has occurred when calling the database.... " + supportErr.message, "CRITICAL", __filename);
                            BotSettings.assist.error("An error message has occurred when calling the database.... " + supportErr.message, message.channel);
                            return resolve({response: "", silent: true});
                        });
                    } else {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle(":telephone_receiver: Support feature not enabled...");
                        embed.setDescription("In this guild (" + message.guild.name + "), the calling center feature has not been enabled.");
                        message.channel.send("", {embed: embed}).catch(errMsg => {
                            Logger.sendLog("-> An error occurred when sending a message.  " + errMsg.message, "CRITICAL", __filename);
                            return resolve({response: "", silent: true});
                        });
                        return resolve({response: "", silent: true});
                    }
                } else {
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle("No settings found....");
                    embed.setDescription("We have not found any settings for " + message.guild.name + " with ID **" + message.guild.id + "**.  Please contact one of the developers of the bot.");
                    message.channel.send("", {embed: embed}).catch(errMsg => {
                        Logger.sendLog("-> An error occurred when sending a message.  " + errMsg.message, "CRITICAL", __filename);
                        return resolve({response: "", silent: true});
                    });
                    return resolve({response: "", silent: true});
                }
            }).catch(errActive => {
                Logger.sendLog("-> An error has occurred when retrieving the supportActive DB.  " + errActive.message, "CRITICAL", __filename);
                return resolve({response: "", silent: true});
            });
        }
        return resolve({response: "", silent: true});
    });
}

pickupCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let pickupId = args.shift();
        let supportChannel = "";
        Database.callStatement("SELECT supportActive, supportChannel FROM settings WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowActive => {
            if(rowActive.length === 1 && rowActive[0].supportActive === 1) {
                supportChannel = rowActive[0].supportChannel;
                let getMsgObj = message.guild.channels.find(channel => channel.id === supportChannel);
                if(getMsgObj !== null) {
                    Database.callStatement("SELECT * FROM callcenter WHERE platform='discord' AND server='" + message.guild.id + "' AND active='1' AND userAns='" + message.author.id +"'").then(numChoices => {
                        if(numChoices.length !== 0) {
                            BotSettings.assist.error("You cannot take another support ticket until you finish your current one", message.channel);
                            return resolve({response: "", silent: true});
                        }
                        Database.callStatement("SELECT * FROM callcenter WHERE platform='discord' AND server='" + message.guild.id + "' AND active='1' AND caseId='" + pickupId + "'").then((row) => {
                            if(row.length === 1) {
                                if(row[0].userAns.toLowerCase() === "none" && row[0].user !== message.author.id) {
                                    //allowed to answer the call
                                    Database.callStatement("UPDATE callcenter SET active='2', userAns='" + message.author.id + "', endtime='" + message.createdTimestamp + "' WHERE caseId='" + pickupId + "' AND server='" + message.guild.id + "'").then((rowContent) => {
                                        message.guild.createChannel("support-" + pickupId + "-s", "text").then((channel) => {
                                            let defaultPerms = {"READ_MESSAGES": false, "SEND_MESSAGES": false, "READ_MESSAGE_HISTORY": false};
                                            let guildDefaultRole = message.guild.defaultRole;
                                            channel.overwritePermissions(guildDefaultRole, defaultPerms);
                                            let supportPerms = {"READ_MESSAGES": true, "SEND_MESSAGES": true, "READ_MESSAGE_HISTORY": true, "MANAGE_MESSAGES": true};
                                            channel.overwritePermissions(message.author.id, supportPerms);
                                            let userPerms = supportPerms;
                                            userPerms["MANAGE_MESSAGES"] = false;
                                            channel.overwritePermissions(row[0].user, userPerms);
                                            channel.send(":telephone_receiver: Your request for support has been answered by **" + message.author.username + "** and will be happy to assist you.").then((channelResp) => {
                                                Database.callStatement("UPDATE callcenter SET channel='" + channel.id + "', starttime='" + channel.createdTimestamp + "' WHERE caseId='" + pickupId + "' AND server='" + message.guild.id + "'").then((rowUpdate) => {
                                                    Logger.sendLog('-> Update callcenter with start time and the channel that was created.', "INFO", __filename);
                                                    return resolve({response: "", silent: true});
                                                }).catch(errUpdate => {
                                                    Logger.sendLog('-> An error has occurred when trying to update the database about the channel id and the created timestamp in guild (' + message.guild.id + ') with Error: ' + errUpdate.message, "CRITICAL", __filename);
                                                    BotSettings.assist.error("There was an error trying to update the database about the channel and created timestamp in guild (" + message.guild.id + ").  " + errUpdate.message, message.channel);
                                                    return resolve({response: "", silent: true});
                                                })
                                            }).catch(errSendMsg => {
                                                Logger.sendLog('-> An error has occurred when trying to send a message in a channel (' + channel.id + ') in Guild ' + message.guild.id + " with Error: " + errSendMsg.message, "CRITICAL", __filename);
                                                BotSettings.assist.error("There was an error trying to send a message in the channel (" + channel.id + ").  " + errSendMsg.message, message.channel);
                                                return resolve({response: "", silent: true});
                                            });
                                        }).catch(channelErr => {
                                            Logger.sendLog('-> An error has occurred when trying to create a channel in Guild ' + message.guild.id + " with Error: " + channelErr.message, "CRITICAL", __filename);
                                            BotSettings.assist.error("There was an error trying to create the channel.  " + channelErr.message, message.channel);
                                            return resolve({response: "", silent: true});
                                        });
                                    }).catch(errContent => {
                                        Logger.sendLog('-> An error has occurred when trying to retrieve the support role id from the DB.  ' + errContent.message, "CRITICAL", __filename);
                                        BotSettings.assist.error("There was an error retrieving the data.  " + errContent.message, message.channel);
                                        return resolve({response: "", silent: true});
                                    });
                                } else if(row[0].user === message.author.id) {
                                    BotSettings.assist.error("Sorry, you are unable to choose yourself.  Please have someone else take this call.", getMsgObj);
                                    return resolve({response: "", silent: true});
                                } else {
                                    BotSettings.assist.error(message.guild.members.find(member => member.id === row[0].userAns).name + " has claimed ID `" + pickupId + "`", message.channel);
                                    return resolve({response: "", silent: true});
                                }
                            } else {
                                let embed = new Discord.MessageEmbed();
                                embed.setTitle("No calls available....");
                                embed.setDescription("We have not found any calls that are needing for assistance.");
                                message.channel.send("", {embed: embed}).catch(errMsg => {
                                    Logger.sendLog("-> An error occurred when sending a message.  " + errMsg.message, "CRITICAL", __filename);
                                    return resolve({response: "", silent: true});
                                });
                                return resolve({response: "", silent: true});
                            }
                        }).catch(errRow => {
                            Logger.sendLog('-> An error has occurred when trying to retrieve the support role id from the DB.  ' + errRow.message, "CRITICAL", __filename);
                            BotSettings.assist.error("There was an error retrieving the data.  " + errRow.message, message.channel);
                            return resolve({response: "", silent: true});
                        });
                    }).catch(errChoice => {
                        Logger.sendLog('-> An error has occurred when trying to retrieve the support role id from the DB.  ' + errChoice.message, "CRITICAL", __filename);
                        BotSettings.assist.error("There was an error retrieving the data.  " + errChoice.message, message.channel);
                        return resolve({response: "", silent: true});
                    });

                } else {
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle("No settings found....");
                    embed.setDescription("We have not found any settings for " + message.guild.name + " with ID **" + message.guild.id + "**.  The channel on file might be an older version.  Please update using the settings command.");
                    message.channel.send("", {embed: embed}).catch(errMsg => {
                        Logger.sendLog("-> An error occurred when sending a message.  " + errMsg.message, "CRITICAL", __filename);
                        return resolve({response: "", silent: true});
                    });
                    return resolve({response: "", silent: true});
                }
            } else {
                let embed = new Discord.MessageEmbed();
                embed.setTitle("No settings found....");
                embed.setDescription("We have not found any settings for " + message.guild.name + " with ID **" + message.guild.id + "**.  Please use the settings command.");
                message.channel.send("", {embed: embed}).catch(errMsg => {
                    Logger.sendLog("-> An error occurred when sending a message.  " + errMsg.message, "CRITICAL", __filename);
                    return resolve({response: "", silent: true});
                });
                return resolve({response: "", silent: true});
            }
        }).catch(supportError => {
            Logger.sendLog('-> An error has occurred when trying to retrieve the support channel id from the DB.  ' + supportError.message, "CRITICAL", __filename);
            BotSettings.assist.error("There was an error retrieving the data.  " + supportError.message, message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

declineCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let pickupId = args.shift();
        let supportChannel = "";
        Database.callStatement("SELECT supportActive, supportChannel FROM settings WHERE platform='discord' AND server='" + message.guild.id + "'").then(rowActive => {
            if(rowActive.length === 1 && rowActive[0].supportActive === 1) {
                supportChannel = rowActive[0].supportChannel;
                let getMsgObj = message.guild.channels.find(channel => channel.id === supportChannel);
                if(getMsgObj !== null) {
                    Database.callStatement("SELECT * FROM callcenter WHERE platform='discord' AND server='" + message.guild.id + "' AND active='1' AND caseId='" + pickupId + "'").then((row) => {
                        if(row.length === 1) {
                            if(row[0].userAns.toLowerCase() === "none" && row[0].user !== message.author.id) {
                                //allowed to answer the call
                                let reasonDeny = "";
                                if(args.length === 0) {
                                    //default reason
                                    reasonDeny = "Unable to understand your request.  Please try again.";
                                } else {
                                    reasonDeny = args.join(" ").split( "\"" ).join( "\\\"" ).split( "'" ).join( "\\'" );
                                }
                                Database.callStatement("UPDATE callcenter SET reasonDeny='" + reasonDeny + "', active='-1', userAns='" + message.author.id + "', endtime='" + message.createdTimestamp + "' WHERE caseId='" + pickupId + "' AND server='" + message.guild.id + "'").then((rowContent) => {
                                    let userRequest = BotSettings.resolve.User(row[0].user);
                                    let embed = new Discord.MessageEmbed();
                                    embed.setTitle("Request Denied");
                                    embed.setDescription("**__The request was Denied because of__**: \n" + reasonDeny)
                                    embed.setThumbnail("https://i.imgur.com/eOoFlam.png?width=80&height=80");
                                    //
                                    if(userRequest === false) {
                                        Logger.sendLog("-> Unable to send request because it is unable to find the user.", 'CRITCAL', __filename);
                                        return resolve({response: message.author, embed: embed, silent: false});
                                    } else {
                                        userRequest.send("", {embed: embed}).then(mes => {
                                            return resolve({response: message.author, embed: embed, silent: false});
                                        }).catch(err => {
                                            Logger.sendLog("-> Unable to send message to author because ... " + err.message, "CRITICAL", __filename);
                                            return resolve({response: "", silent: true});
                                        });
                                    }
                                }).catch(errContent => {
                                    Logger.sendLog('-> An error has occurred when trying to retrieve the support role id from the DB.  ' + errContent.message, "CRITICAL", __filename);
                                    BotSettings.assist.error("There was an error retrieving the data.  " + errContent.message, message.channel);
                                    return resolve({response: "", silent: true});
                                });
                            } else if(row[0].user === message.author.id) {
                                BotSettings.assist.error("Sorry, you are unable to choose yourself.  Please have someone else take this call.", getMsgObj);
                                return resolve({response: "", silent: true});
                            } else {
                                BotSettings.assist.error(message.guild.members.find(member => member.id === row[0].userAns).name + " has claimed ID `" + pickupId + "`", message.channel);
                                return resolve({response: "", silent: true});
                            }
                        } else {
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("No calls available....");
                            embed.setDescription("We have not found any calls that are needing for assistance.");
                            message.channel.send("", {embed: embed}).catch(errMsg => {
                                Logger.sendLog("-> An error occurred when sending a message.  " + errMsg.message, "CRITICAL", __filename);
                                return resolve({response: "", silent: true});
                            });
                            return resolve({response: "", silent: true});
                        }
                    }).catch(errRow => {
                        Logger.sendLog('-> An error has occurred when trying to retrieve the support role id from the DB.  ' + errRow.message, "CRITICAL", __filename);
                        BotSettings.assist.error("There was an error retrieving the data.  " + errRow.message, message.channel);
                        return resolve({response: "", silent: true});
                    });
                } else {
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle("No settings found....");
                    embed.setDescription("We have not found any settings for " + message.guild.name + " with ID **" + message.guild.id + "**.  The channel on file might be an older version.  Please update using the settings command.");
                    message.channel.send("", {embed: embed}).catch(errMsg => {
                        Logger.sendLog("-> An error occurred when sending a message.  " + errMsg.message, "CRITICAL", __filename);
                        return resolve({response: "", silent: true});
                    });
                    return resolve({response: "", silent: true});
                }
            } else {
                let embed = new Discord.MessageEmbed();
                embed.setTitle("No settings found....");
                embed.setDescription("We have not found any settings for " + message.guild.name + " with ID **" + message.guild.id + "**.  Please use the settings command.");
                message.channel.send("", {embed: embed}).catch(errMsg => {
                    Logger.sendLog("-> An error occurred when sending a message.  " + errMsg.message, "CRITICAL", __filename);
                    return resolve({response: "", silent: true});
                });
                return resolve({response: "", silent: true});
            }
        }).catch(supportError => {
            Logger.sendLog('-> An error has occurred when trying to retrieve the support channel id from the DB.  ' + supportError.message, "CRITICAL", __filename);
            BotSettings.assist.error("There was an error retrieving the data.  " + supportError.message, message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

cancelCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        Database.callStatement("SELECT supportActive, supportChannel FROM settings WHERE server='" + message.guild.id + "' AND platform='discord'").then((rowActive) => {
            if(rowActive.length === 1 && rowActive[0].supportActive === 1) {
                Database.callStatement("SELECT * FROM callcenter WHERE user='" + message.author.id + "' AND active='1' AND server='" + message.guild.id + "' AND userAns='None' AND channel='None'").then((rowContent) => {
                    if(rowContent.length === 1) {
                        //found it, now cancel it
                        Database.callStatement("UPDATE callcenter SET active='-1' WHERE user='" + message.author.id + "' AND server='" + message.guild.id + "' AND caseId='" + rowContent[0].caseId + "'").then((rowData) => {
                            Logger.sendLog('-> Request for support cancelled by user.', "INFO", __filename);
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("Removed request...");
                            embed.setDescription("Your Request (ID `" + rowContent[0].caseId + "`) has been cancelled.");
                            message.channel.send("", {embed: embed}).then(m => {
                                return resolve({response: "", silent: true});
                            }).catch(err => {
                                Logger.sendLog("-> An error occurred when sending a message.  " + err.message, "CRITICAL", __filename);
                                return resolve({response: "", silent: true});
                            });
                        }).catch(errData => {
                            Logger.sendLog('-> An error has occurred when trying to retrieve the support ticket ID from the DB.  ' + errData.message, "CRITICAL", __filename);
                            BotSettings.assist.error("There was an error retrieving the data.  " + errData.message, message.channel);
                            return resolve({response: "", silent: true});
                        });
                    } else {
                        BotSettings.assist.error("We were unable to find your request that you made.  If you do not have a current request/support ticket going (in progress), please request one using the `call` command.", message.channel);
                        return resolve({response: "", silent: true});
                    }
                }).catch(errContent => {
                    Logger.sendLog('-> An error has occurred when trying to retrieve the support ticket ID from the DB.  ' + errContent.message, "CRITICAL", __filename);
                    BotSettings.assist.error("There was an error retrieving the data.  " + errContent.message, message.channel);
                    return resolve({response: "", silent: true});
                })
            } else {
                let embed = new Discord.MessageEmbed();
                embed.setTitle("No settings found....");
                embed.setDescription("We have not found any settings for " + message.guild.name + " with ID **" + message.guild.id + "**.  Please use the settings command.");
                message.channel.send("", {embed: embed}).catch(errMsg => {
                    Logger.sendLog("-> An error occurred when sending a message.  " + errMsg.message, "CRITICAL", __filename);
                    return resolve({response: "", silent: true});
                });
                return resolve({response: "", silent: true});
            }
        }).catch(rowError => {
            Logger.sendLog('-> An error has occurred when trying to retrieve the settings from the server (' + message.guild.id + ') from the DB.  ' + rowError.message, "CRITICAL", __filename);
            BotSettings.assist.error("There was an error retrieving the data.  " + rowError.message, message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

supportCancelCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        Database.callStatement("SELECT supportChannel, supportActive FROM settings WHERE server='" + message.guild.id + "' AND platform='discord'").then((rowActive) => {
            if(rowActive.length === 1 && rowActive[0].supportActive === 1) {
                Database.callStatement("SELECT * FROM callcenter WHERE active='2' AND server='" + message.guild.id + "' AND userAns='" + message.author.id + "'").then((rowContent) => {
                    if(rowContent.length === 1) {
                        //cancel the current call
                        Database.callStatement("UPDATE callcenter SET active='-1', endtime='" + message.createdTimestamp + "' WHERE server='" + message.guild.id + "' AND userAns='" + message.author.id + "' AND caseId='" + rowContent[0].caseId + "'").then(rowConfirm => {
                            Logger.sendLog('-> Request for support cancelled by support representative.', "INFO", __filename);
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("Removed request...");
                            embed.setDescription("The Request (ID `" + rowContent[0].caseId + "`) has been cancelled by the support representative.");
                            message.channel.send("", {embed: embed}).then(m => {
                                return resolve({response: "", silent: true});
                            }).catch(err => {
                                Logger.sendLog("-> An error occurred when sending a message.  " + err.message, "CRITICAL", __filename);
                                return resolve({response: "", silent: true});
                            });
                            if(rowContent[0].channel !== "None") {
                                //delete the channel
                                let channelObj = message.guild.channels.find(channel => channel.id === rowContent[0].channel);
                                channelObj.delete().catch(errDelete => {
                                    Logger.sendLog('-> An error has occurred when trying to delete the channel that was received from the DB.  ' + errDelete.message, "CRITICAL", __filename);
                                    BotSettings.assist.error("There was an error retrieving the data.  " + errDelete.message, message.channel);
                                    return resolve({response: "", silent: true});
                                });
                            } else {
                                Logger.sendLog("-> Channel could not be found in the database.", "INFO", __filename);
                                BotSettings.assist.error("We were unable to find the channel that was created for the ticket.", message.channel);
                                return resolve({response: "", silent: true});
                            }
                        }).catch(errConfirm => {
                            Logger.sendLog('-> An error has occurred when trying to cancel the support ticket from the DB.  ' + errConfirm.message, "CRITICAL", __filename);
                            BotSettings.assist.error("There was an error retrieving the data.  " + errConfirm.message, message.channel);
                            return resolve({response: "", silent: true});
                        });
                    } else {
                        //Unable to find active call
                    }
                }).catch(errContent => {
                    Logger.sendLog('-> An error has occurred when trying to retrieve the support ticket ID from the DB.  ' + errContent.message, "CRITICAL", __filename);
                    BotSettings.assist.error("There was an error retrieving the data.  " + errContent.message, message.channel);
                    return resolve({response: "", silent: true});
                });
            } else {
                let embed = new Discord.MessageEmbed();
                embed.setTitle("No settings found....");
                embed.setDescription("We have not found any settings for " + message.guild.name + " with ID **" + message.guild.id + "**.  Please use the settings command.");
                message.channel.send("", {embed: embed}).catch(errMsg => {
                    Logger.sendLog("-> An error occurred when sending a message.  " + errMsg.message, "CRITICAL", __filename);
                    return resolve({response: "", silent: true});
                });
                return resolve({response: "", silent: true});
            }
        }).catch(errActive => {
            Logger.sendLog('-> An error has occurred when trying to retrieve the settings from the server (' + message.guild.id + ') from the DB.  ' + errActive.message, "CRITICAL", __filename);
            BotSettings.assist.error("There was an error retrieving the data.  " + errActive.message, message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

endCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        Database.callStatement("SELECT supportChannel, supportActive FROM settings WHERE server='" + message.guild.id + "' AND platform='discord'").then((rowActive) => {
            if(rowActive.length === 1 && rowActive[0].supportActive === 1) {
                Database.callStatement("SELECT * FROM callcenter WHERE user='" + message.author.id + "' AND active='2' AND server='" + message.guild.id + "' ORDER BY caseId DESC").then((rowContent) => {
                    console.log(rowContent);
                    if(rowContent.length === 1) {
                        //found it, now end it
                        Database.callStatement("UPDATE callcenter SET active='3',endtime='" + message.createdTimestamp + "' WHERE user='" + message.author.id + "' AND server='" + message.guild.id + "'").then((rowData) => {
                            Logger.sendLog('-> Request for support ended by the user.', "INFO", __filename);
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("Support ticket ended");
                            embed.setDescription(":telephone_receiver: Thank you for contacting " + message.guild.name + " support! If you feel as though your service was unsatisfactory or you were disappointed in the quality of the service, feel free to contact us again.  The call has been ended.");
                            message.author.send("", {embed: embed}).then(m => {
                                //TODO: Delete the channel created
                                let channelReq = message.guild.channels.find(channel => channel.id === rowContent[0].channel);
                                if(channelReq !== null) {
                                    channelReq.delete().then(mm => {
                                        let totalDuration = Math.abs(message.createdTimestamp - rowContent[0].starttime);
                                        let prettyMs = require("pretty-ms");
                                        let prettyDuration = prettyMs(totalDuration, {verbose: true});
                                        embed.setTitle("Support Ticket complete.");
                                        embed.setDescription("The support ticket has completed and the call request has taken approximiately " + prettyDuration);
                                        embed.setColor("https://i.imgur.com/Qlr5oRK.png?width=80&height=80");
                                        let supportTicket = message.guild.channels.find(channel => channel.id === rowActive[0].supportChannel);
                                        if(supportTicket !== null) {
                                            supportTicket.send("", {embed: embed}).catch(mSendErr => {
                                                Logger.sendLog('-> An error has occurred when trying to send a message to the support channel.\n' + mSendErr.message, "CRITICAL", __filename);
                                                BotSettings.assist.error("An error has occurred when trying to send a message to the support channel.  " + mSendErr.message, message.guild.defaultChannel);
                                                return resolve({response: "", silent: true});
                                            });
                                        } else {
                                            Logger.sendLog('-> An error has occurred when trying to find the support channel.', "CRITICAL", __filename);
                                            BotSettings.assist.error("We were unable to find the support channel that you have set; please use the settings command.", message.guild.defaultChannel);
                                            return resolve({response: "", silent: true});
                                        }
                                    }).catch(mErr => {
                                        Logger.sendLog('-> An error has occurred when trying to delete the channel ID.  ' + mErr.message, "CRITICAL", __filename);
                                        BotSettings.assist.error("There was an error retrieving the data.  " + mErr.message, message.channel);
                                        return resolve({response: "", silent: true});
                                    });
                                } else {
                                    Logger.sendLog('-> Unable to find the channel to delete.', "INFO", __filename);
                                    return resolve({response: "", silent: true});
                                }
                                return resolve({response: "", silent: true});
                            }).catch(err => {
                                Logger.sendLog("-> An error occurred when sending a message.  " + errMsg.message, "CRITICAL", __filename);
                                return resolve({response: "", silent: true});
                            });
                        }).catch(errData => {
                            Logger.sendLog('-> An error has occurred when trying to retrieve the support ticket ID from the DB.  ' + errData.message, "CRITICAL", __filename);
                            BotSettings.assist.error("There was an error retrieving the data.  " + errData.message, message.channel);
                            return resolve({response: "", silent: true});
                        });
                    } else {
                        BotSettings.assist.error("We were unable to find your request that you made.  If you do not have a current request/support ticket going (in progress), please request one using the `call` command.", message.channel);
                        return resolve({response: "", silent: true});
                    }
                }).catch(errContent => {
                    Logger.sendLog('-> An error has occurred when trying to retrieve the support ticket ID from the DB.  ' + errContent.message, "CRITICAL", __filename);
                    BotSettings.assist.error("There was an error retrieving the data.  " + errContent.message, message.channel);
                    return resolve({response: "", silent: true});
                })
            } else {
                let embed = new Discord.MessageEmbed();
                embed.setTitle("No settings found....");
                embed.setDescription("We have not found any settings for " + message.guild.name + " with ID **" + message.guild.id + "**.  Please use the settings command.");
                message.channel.send("", {embed: embed}).catch(errMsg => {
                    Logger.sendLog("-> An error occurred when sending a message.  " + errMsg.message, "CRITICAL", __filename);
                    return resolve({response: "", silent: true});
                });
                return resolve({response: "", silent: true});
            }
        }).catch(errActive => {
            Logger.sendLog('-> An error has occurred when trying to retrieve the settings from the server (' + message.guild.id + ') from the DB.  ' + errActive.message, "CRITICAL", __filename);
            BotSettings.assist.error("There was an error retrieving the data.  " + errActive.message, message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageCall.aliases, args: usageCall.args, usage: usageCall, run: callCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usagePickup.aliases, args: usagePickup.args, usage: usagePickup, run: pickupCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageDecline.aliases, args: usageDecline.args, usage: usageDecline, run: declineCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageCancel.aliases, args: usageCancel.args, usage: usageCancel, run: cancelCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageEnd.aliases, args: usageEnd.args, usage: usageEnd, run: endCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageSupportCancel.aliases, args: usageSupportCancel.args, usage: usageSupportCancel, run: supportCancelCmd}
];
