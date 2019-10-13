const moduleInfo = {
    name: "modlog",
    truename: "modlog",
    platformOnly: "discord",
    author: "Manny",
    contributors: ["Villa"]
}

const usageKick = {
    name: "kick",
    cmdName: "kick",
    aliases: ["kick", "userkick"],
    args: {min: 1, max: 50},
    description: "Kicks a person [reason is optional]",
    exampleUsage: "kick @eaaliprantis#2160",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Admin",
    permlvl: 4,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageWarn = {
    name: "warn",
    cmdName: "warn",
    aliases: ["warn", "userwarn"],
    args: {min: 1, max: 50},
    description: "Warns a person [reason is optional]",
    exampleUsage: "warn @eaaliprantis#2160 For being annoying",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Mod",
    permlvl: 3,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageMute = {
    name: "mute",
    cmdName: "mute",
    aliases: ["mute", "usermute"],
    args: {min: 1, max: 50},
    description: "Mutes a person [reason is optional]",
    exampleUsage: "mute @eaaliprantis#2160 Because he keeps going on and on",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Mod",
    permlvl: 3,
    premiumLvl: 0,
    enabled: false,
    contributors: [""]
}

const usageUnMute = {
    name: "unmute",
    cmdName: "unmute",
    aliases: ["unmute", "usermute"],
    args: {min: 1, max: 1},
    description: "Unmutes a person",
    exampleUsage: "unmute @eaaliprantis#2160",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Mod",
    permlvl: 3,
    premiumLvl: 0,
    enabled: false,
    contributors: [""]
}

const usageBan = {
    name: "ban",
    cmdName: "ban",
    aliases: ["ban", "userban"],
    args: {min: 1, max: 255},
    description: "Bans a person [reason is optional]",
    exampleUsage: "ban @eaaliprantis#2160 spamming his invite link\nban @eaaliprantis#2160",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Admin",
    permlvl: 4,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageUnBan = {
    name: "unban",
    cmdName: "unban",
    aliases: ["unban", "userunban"],
    args: {min: 1, max: 50},
    description: "Unbans a person either by ID or by tag [reason is optional]",
    exampleUsage: "unban @eaaliprantis#2160 for understanding why he was banned\nunban @eaaliprantis#2160",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Admin",
    permlvl: 4,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageSoftBan = {
    name: "softban",
    cmdName: "softban",
    aliases: ["softban", "usersoftban"],
    args: {min: 1, max: 50},
    description: "Softbans a user [reason is optional]",
    exampleUsage: "softban @eaaliprantis#2160 because he was cursing",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Admin",
    permlvl: 4,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageTempBan = {
    name: "tempban",
    cmdName: "tempban",
    aliases: ["tempban", "usertempban"],
    args: {min: 1, max: 50},
    description: "Tempban a user [reason is optional]",
    exampleUsage: "tempban @eaaliprantis#2160 temp banned for 24 hours",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Admin",
    permlvl: 4,
    premiumLvl: 0,
    enabled: false,
    contributors: [""]
}

this.setupCommands = function(file) {
    this.file = file;
    return new Promise((resolve, reject) => {
        return resolve({file: this.file, moduleInfo: moduleInfo, commands: this.commands});
    });
}

muteCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let moment = require("moment");
        let userWarned = args.shift();
        let guildUser = BotSettings.resolve.User(userWarned, message, "guild");
        if(guildUser === "" || guildUser === false) {
            BotSettings.assist.error("Unable to find user that you have requested.  Please try again.", message.channel);
            return resolve({response: "", silent: true});
        }
        let reason = "";
        if(args.length >= 1) {reason = args.join(" ")};
        if(reason.length <= parseInt(BotSettings.discordServers.ban.maxsize)) {
            reason = args.join(" ").substring(0, 400) + " ...";
        }
        Database.callStatement("SELECT * FROM modlogs WHERE platform='discord' AND server='" + message.guild.id + "' AND userid='" + guildUser.id + "' AND typeOpt='mute' ORDER BY case_id DESC LIMIT 1").then(rows => {
            let text = "";
            if(args.length >= 1) {
                text = args.join(" ");
            } else {
                text = "Muted for unknown reason";
            }
            let num = 1;
            if(rows.length === 0) {
                num = 1;
            } else {
                let z = rows[0];
                num = z.case_id;
                num = parseInt(num) + 1;
            }
            let numStr = num;
            Logger.sendLog("-> " + numStr + " | " + num, "INFO", __filename);
            Database.callStatement("INSERT INTO modlogs (platform, server, userid, typeOpt, case_id, reason, byWho, searchedAt) VALUES ('discord', '" + message.guild.id + "', '" + guildUser.id + "', 'mute', '" + numStr + "', '" + text +"', '" + message.author.id + "', '" + moment().format("YYYY-MM-DD hh:mm:ss") + "')").then(rowConfirm => {
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Muted");
                embed.setDescription("**CASE**: #" + num + "\n**User**: " + guildUser.user.tag  + "\n**User ID**: " + guildUser.id + "\n**Description**: " + text);
                embed.setAuthor(guildUser.user.tag, guildUser.user.avatarURL);
                embed.setFooter(message.author.tag + " | " + moment().format("llll"), message.author.avatarURL);
                Database.callStatement("SELECT modlogs, muteRank FROM settings WHERE platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(rows2 => {
                    if(rows.length === 1) {
                        let rowData = rows2[0];
                        let channel = BotSettings.resolve.Channel(rowData.modlogs);
                        if(channel === false) {
                            return resolve({response: "", embed: embed, silent: false});
                        }
                        let muteRole = rowData.muteRank;
                        //muting
                        if(muteRole === null || muteRole === undefined || muteRole === "") {
                            //undefined, cannot mute
                            return resolve({response: "**" + guildUser.user.tag + "** was unable to be muted because no role was found or assigned", embed: embed});
                        }
                        //muting
                        Logger.sendLog("-> Role found....." + muteRole, "INFO", __filename);
                        guildUser.addRole(muteRole).then(() => {
                            //user unmuted
                            channel.send("", {embed: embed}).then(() => {
                                embed.setDescription("**CASE**: #" + num + "\n**User**: " + guildUser.user.tag  + "\n**User ID**: " + guildUser.id + "\n**Description**: " + text + "\n**Server**: " + message.guild.name);
                                guildUser.user.send("", {embed: embed}).then(() => {
                                    return resolve({response: `**${guildUser.user.tag} was recently muted**`, silent: false});
                                }).catch(() => {
                                    return resolve({response: `**${guildUser.user.tag} was recently muted**`, silent: false});
                                })
                            }).catch(e => {
                                Logger.sendLog("-> Unable to send the message to the channel because.... " + e, "CRITICAL", __filename);
                                return resolve({response: "", silent: true});
                            });
                        }).catch(errMute => {
                            Logger.sendLog("-> Unable to mute user because..." + errMute, "CRITICAL", __filename);
                            embed.addField("Not Executable", errMute, true);
                            channel.send("", {embed: embed}).then(() => {
                                return resolve({response: "**Unable to mute " + guildUser.user.tag + " because " + errMute + "**", silent: false});
                            }).catch(e => {
                                Logger.sendLog("-> Unable to send the message to the channel because.... " + e, "CRITICAL", __filename);
                                return resolve({response: "", silent: true});
                            });
                        })
                    }
                }).catch(errRow => {
                    Logger.sendLog("-> Unable to select the modlogs from the settings DB because.... " + errRow, "CRITICAL", __filename);
                    return resolve({response: "", silent: true});
                });
            }).catch(errConfirm => {
                Logger.sendLog("-> Unable to update the modlogs in the DB because.... " + errConfirm, "CRITICAL", __filename);
                return resolve({response: "There was an error that came when adding it to the DB.  We apologize for the error", silent: false});
            });
        });
    })
}

unmuteCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let moment = require("moment");
        let userWarned = args.shift();
        let guildUser = BotSettings.resolve.User(userWarned, message, "guild");
        if(guildUser === "" || guildUser === false) {
            BotSettings.assist.error("Unable to find user that you have requested.  Please try again.", message.channel);
            return resolve({response: "", silent: true});
        }
        let reason = "";
        if(args.length >= 1) {reason = args.join(" ")};
        if(reason.length <= parseInt(BotSettings.discordServers.ban.maxsize)) {
            reason = args.join(" ").substring(0, 400) + " ...";
        }

        Database.callStatement("SELECT * FROM modlogs WHERE platform='discord' AND server='" + message.guild.id + "' AND userid='" + guildUser.id + "' AND typeOpt='mute' ORDER BY case_id DESC LIMIT 1").then(rows => {
            let text = "";
            if(args.length >= 1) {
                text = args.join(" ");
            } else {
                text = "Unmuted for unknown reason";
            }
            let num = 1
            if(rows.length === 0) {
                num = 1;
            } else {
                let z = rows[0];
                num = z.case_id;
                num = parseInt(num) + 1;
            }
            let numStr = num;
            Database.callStatement("INSERT INTO modlogs (platform, server, userid, typeOpt, case_id, reason, byWho, searchedAt) VALUES ('discord', '" + message.guild.id + "', '" + guildUser.id + "', 'unmute', '" + numStr + "', '" + text +"', '" + message.author.id + "', '" + moment().format("YYYY-MM-DD hh:mm:ss") + "')").then(rowConfirm => {
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Unmuted");
                embed.setDescription("**CASE**: #" + num + "\n**User**: " + guildUser.user.tag  + "\n**User ID**: " + guildUser.id + "\n**Description**: " + text);
                embed.setAuthor(guildUser.user.tag, guildUser.user.avatarURL);
                embed.setFooter(message.author.tag + " | " + moment().format("llll"), message.author.avatarURL);
                Database.callStatement("SELECT modlogs, muteRank FROM settings WHERE platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(rows2 => {
                    if(rows.length === 1) {
                        let rowData = rows2[0];
                        let channel = BotSettings.resolve.Channel(rowData.modlogs);
                        if(channel === false) {
                            return resolve({response: "", embed: embed, silent: false});
                        }
                        let muteRole = rowData.muteRank;
                        if(muteRole === null || muteRole === undefined || muteRole === "") {
                            //undefined, cannot mute
                            return resolve({response: "**" + guildUser.user.tag + "** was unable to be muted because no role was found", embed: embed});
                        }
                        //unmuting
                        guildUser.removeRole(muteRole).then(() => {
                            //user unmuted
                            channel.send("", {embed: embed}).then(() => {
                                embed.setDescription("**CASE**: #" + num + "\n**User**: " + guildUser.user.tag  + "\n**User ID**: " + guildUser.id + "\n**Description**: " + text + "\n**Server**: " + message.guild.name);
                                guildUser.user.send("", {embed: embed}).then(() => {
                                    return resolve({response: `**${guildUser.user.tag} was recently unmuted**`, silent: false});
                                }).catch(() => {
                                    return resolve({response: `**${guildUser.user.tag} was recently unmuted**`, silent: false});
                                })
                            }).catch(e => {
                                Logger.sendLog("-> Unable to send the message to the channel because.... " + e, "CRITICAL", __filename);
                                return resolve({response: "", silent: true});
                            });
                        }).catch(errMute => {
                            Logger.sendLog("-> Unable to unmute user because..." + errMute, "CRITICAL", __filename);
                            embed.addField("Not Executable", errMute, true);
                            channel.send("", {embed: embed}).then(() => {
                                return resolve({response: "**Unable to unmute " + guildUser.user.tag + " because " + errMute + "**", silent: false});
                            }).catch(e => {
                                Logger.sendLog("-> Unable to send the message to the channel because.... " + e, "CRITICAL", __filename);
                                return resolve({response: "", silent: true});
                            });
                        })
                    }
                }).catch(errRow => {
                    Logger.sendLog("-> Unable to select the modlogs from the settings DB because.... " + errRow, "CRITICAL", __filename);
                    return resolve({response: "", silent: true});
                });
            }).catch(errConfirm => {
                Logger.sendLog("-> Unable to update the modlogs in the DB because.... " + errConfirm, "CRITICAL", __filename);
                return resolve({response: "There was an error that came when adding it to the DB.  We apologize for the error", silent: false});
            });
        });
    })
}

warnCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let moment = require("moment");
        let userWarned = args.shift();
        let guildUser = BotSettings.resolve.User(userWarned, message, "guild");
        if(guildUser === "" || guildUser === false) {
            BotSettings.assist.error("Unable to find user that you have requested.  Please try again.", message.channel);
            return resolve({response: "", silent: true});
        }
        let reason = "";
        if(args.length >= 1) {reason = args.join(" ")};
        if(reason.length <= parseInt(BotSettings.discordServers.ban.maxsize)) {
            reason = args.join(" ").substring(0, 400) + " ...";
        }
        Database.callStatement("SELECT * FROM modlogs WHERE platform='discord' AND server='" + message.guild.id + "' AND userid='" + guildUser.id + "' AND typeOpt='warn' ORDER BY case_id DESC LIMIT 1").then(rows => {
            let text = "";
            if(args.length >= 1) {
                text = args.join(" ");
            } else {
                text = "Warned for unknown reason";
            }
            let num = 1;
            if(rows.length === 0) {
                //new entry, add
                Database.callStatement("INSERT INTO modlogs (platform, server, userid, typeOpt, case_id, reason, byWho, searchedAt) VALUES ('discord', '" + message.guild.id + "', '" + guildUser.id + "', 'warn', '1', '" + text +"', '" + message.author.id + "', '" + moment().format("YYYY-MM-DD hh:mm:ss") + "')").then(rowConfirm => {
                    let embed = new Discord.RichEmbed();
                    embed.setTitle("Warned");
                    embed.setDescription("**CASE**: #" + num + "\n**User**: " + guildUser.user.tag  + "\n**User ID**: " + guildUser.id + "\n**Description**: " + text);
                    embed.setAuthor(guildUser.user.tag, guildUser.user.avatarURL);
                    embed.setFooter(message.author.tag + " | " + moment().format("llll"), message.author.avatarURL);
                    Database.callStatement("SELECT modlogs FROM settings WHERE platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(rows => {
                        if(rows.length === 1) {
                            let rowData = rows[0];
                            let channel = BotSettings.resolve.Channel(rowData.modlogs);
                            if(channel === false) {
                                return resolve({response: "", embed: embed, silent: false});
                            } else {
                                channel.send("", {embed: embed}).then(() => {
                                    embed.setDescription("**CASE**: #" + num + "\n**User**: " + guildUser.user.tag  + "\n**User ID**: " + guildUser.id + "\n**Description**: " + text + "\n**Server**: " + message.guild.name);
                                    guildUser.user.send("", {embed: embed}).then(() => {
                                        return resolve({response: `**${guildUser.user.tag} was recently warned**`, silent: false});
                                    }).catch(() => {
                                        return resolve({response: `**${guildUser.user.tag} was recently warned**`, silent: false});
                                    })
                                }).catch(e => {
                                    Logger.sendLog("-> Unable to send the message to the channel because.... " + e, "CRITICAL", __filename);
                                    return resolve({response: "", silent: true});
                                });
                            }
                        }
                    }).catch(errRow => {
                        Logger.sendLog("-> Unable to select the modlogs from the settings DB because.... " + errRow, "CRITICAL", __filename);
                        return resolve({response: "", silent: true});
                    });
                }).catch(errConfirm => {
                    Logger.sendLog("-> Unable to update the modlogs in the DB because.... " + errConfirm, "CRITICAL", __filename);
                    return resolve({response: "There was an error that came when adding it to the DB.  We apologize for the error", silent: false});
                });
            } else {
                let z = rows[0];
                num = z.case_id;
                num = parseInt(num) + 1;
                Database.callStatement("INSERT INTO modlogs (platform, server, userid, typeOpt, case_id, reason, byWho, searchedAt) VALUES ('discord', '" + message.guild.id + "', '" + guildUser.id + "', 'warn', '" + num + "', '" + text +"', '" + message.author.id + "', '" + moment().format("YYYY-MM-DD hh:mm:ss") + "')").then(rowConfirm => {
                    let embed = new Discord.RichEmbed();
                    embed.setTitle("Warned");
                    embed.setDescription("**CASE**: #" + num + "\n**User**: " + guildUser.user.tag  + "\n**User ID**: " + guildUser.id + "\n**Description**: " + text);
                    embed.setAuthor(guildUser.user.tag, guildUser.user.avatarURL);
                    embed.setFooter(message.author.tag + " | " + moment().format("llll"), message.author.avatarURL);
                    Database.callStatement("SELECT modlogs FROM settings WHERE platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(rows => {
                        if(rows.length === 1) {
                            let rowData = rows[0];
                            let channel = BotSettings.resolve.Channel(rowData.modlogs);
                            if(channel === false) {
                                return resolve({response: "", embed: embed, silent: false});
                            } else {
                                channel.send("", {embed: embed}).then(() => {
                                    embed.setDescription("**CASE**: #" + num + "\n**User**: " + guildUser.user.tag  + "\n**User ID**: " + guildUser.id + "\n**Description**: " + text + "\n**Server**: " + message.guild.name);
                                    guildUser.user.send("", {embed: embed}).then(() => {
                                        return resolve({response: `**${guildUser.user.tag} was recently warned**`, silent: false});
                                    }).catch(() => {
                                        return resolve({response: `**${guildUser.user.tag} was recently warned**`, silent: false});
                                    })
                                }).catch(e => {
                                    Logger.sendLog("-> Unable to send the message to the channel because.... " + e, "CRITICAL", __filename);
                                    return resolve({response: "", silent: true});
                                });
                            }
                        }
                    }).catch(errRow => {
                        Logger.sendLog("-> Unable to select the modlogs from the settings DB because.... " + errRow, "CRITICAL", __filename);
                        return resolve({response: "", silent: true});
                    });
                }).catch(errConfirm => {
                    Logger.sendLog("-> Unable to update the modlogs in the DB because.... " + errConfirm, "CRITICAL", __filename);
                    return resolve({response: "There was an error that came when adding it to the DB.  We apologize for the error", silent: false});
                });
            }
        }).catch(errConfirm => {
            Logger.sendLog("-> Unable to select the modlogs in the DB because.... " + errConfirm, "CRITICAL", __filename);
            return resolve({response: "There was an error that came when searching it in the DB.  We apologize for the error", silent: false});
        });
    });
}

kickCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let moment = require("moment");
        let userBanned = args.shift();
        let guildUser = BotSettings.resolve.User(userBanned, message, "guild");
        if(guildUser === "" || guildUser === false) {
            BotSettings.assist.error("Unable to find the user that you have requested.  Please try again.", message.channel);
            return resolve({response: "", silent: true});
        }
        let reason = "";
        if(args.length >= 1) {reason = args.join(" ")};
        if(reason.length <= parseInt(BotSettings.discordServers.ban.maxsize)) {
            reason = args.join(" ").substring(0, 400) + " ...";
        };
        guildUser.kick(reason).then((m) => {
            Database.callStatement("SELECT * FROM modlogs WHERE platform='discord' AND server='" + message.guild.id + "' AND userid='" + guildUser.id + "' AND typeOpt='kick' ORDER BY case_id DESC LIMIT 1").then(rows => {
                let text = "";
                if(args.length >= 1) {
                    text = args.join(" ");
                } else {
                    text = "Banned for unknown reason.";
                }
                let num = 1;
                if(rows.length === 0) {
                    //new entry, number 1
                    Database.callStatement("INSERT INTO modlogs (platform, server, userid, typeOpt, case_id, reason, byWho, searchedAt) VALUES ('discord', '" + message.guild.id + "', '" + guildUser.id + "', 'kick', '1', '" + text +"', '" + message.author.id + "', '" + moment().format("YYYY-MM-DD hh:mm:ss") + "')").then(rowConfirm => {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("KICKED");
                        embed.setDescription("**CASE**: #" + num + "\n**User**: " + guildUser.user.tag  + "\n**User ID**: " + guildUser.id + "\n**Description**: " + text);
                        embed.setAuthor(guildUser.user.tag, guildUser.user.avatarURL);
                        embed.setFooter(message.author.tag + " | " + moment().format("llll"), message.author.avatarURL);
                        Database.callStatement("SELECT modlogs FROM settings WHERE platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(rows => {
                            if(rows.length === 1) {
                                let rowData = rows[0];
                                let channel = BotSettings.resolve.Channel(rowData.modlogs);
                                if(channel === false) {
                                    return resolve({response: "", embed: embed, silent: false});
                                } else {
                                    channel.send("", {embed: embed}).then(() => {
                                        return resolve({response: "", silent: true});
                                    }).catch(e => {
                                        Logger.sendLog("-> Unable to send the message to the channel because.... " + e, "CRITICAL", __filename);
                                        return resolve({response: "", silent: true});
                                    });
                                }
                            }
                        }).catch(errRow => {
                            Logger.sendLog("-> Unable to select the modlogs from the settings DB because.... " + errRow, "CRITICAL", __filename);
                            return resolve({response: "", silent: true});
                        });
                    }).catch(errConfirm => {
                        Logger.sendLog("-> Unable to update the modlogs in the DB because.... " + errConfirm, "CRITICAL", __filename);
                        return resolve({response: "There was an error that came when adding it to the DB.  We apologize for the error", silent: false});
                    });
                } else {
                    let z = rows[0];
                    let num = z.case_id;
                    num = parseInt(num) + 1;
                    Database.callStatement("INSERT INTO modlogs (platform, server, userid, typeOpt, case_id, reason, byWho, searchedAt) VALUES ('discord', '" + message.guild.id + "', '" + guildUser.id + "', 'kick', '" + num + "', '" + text +"', '" + message.author.id + "', '" + moment().format("YYYY-MM-DD hh:mm:ss") + "')").then(rowConfirm => {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("KICKED");
                        embed.setDescription("**CASE**: #" + num + "\n**User**: " + guildUser.user.tag  + "\n**User ID**: " + guildUser.id + "\n**Description**: " + text);
                        embed.setAuthor(guildUser.user.tag, guildUser.user.avatarURL);
                        embed.setFooter(message.author.tag + " | " + moment().format("llll"), message.author.avatarURL);
                        Database.callStatement("SELECT modlogs FROM settings WHERE platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(rows => {
                            if(rows.length === 1) {
                                let rowData = rows[0];
                                let channel = BotSettings.resolve.Channel(rowData.modlogs);
                                if(channel === false) {
                                    return resolve({response: "", embed: embed, silent: false});
                                } else {
                                    channel.send("", {embed: embed}).then(() => {
                                        return resolve({response: "", silent: true});
                                    }).catch(e => {
                                        Logger.sendLog("-> Unable to send the message to the channel because.... " + e, "CRITICAL", __filename);
                                        return resolve({response: "", silent: true});
                                    });
                                }
                            }
                        }).catch(errRow => {
                            Logger.sendLog("-> Unable to select the modlogs from the settings DB because.... " + errRow, "CRITICAL", __filename);
                            return resolve({response: "", silent: true});
                        });
                    }).catch(errConfirm => {
                        Logger.sendLog("-> Unable to update the modlogs in the DB because.... " + errConfirm, "CRITICAL", __filename);
                        return resolve({response: "There was an error that came when adding it to the DB.  We apologize for the error", silent: false});
                    });
                }
            }).catch(errRow => {
                Logger.sendLog("-> Error when looking at modlogs for some reason.  " + errRow, "CRITICAL", __filename);
                return resolve({response: "Ban was successfully made but not logged properly.", silent: false});
            });
        }).catch(err => {
            Logger.sendLog("-> Unable to ban the member because " + err.message, "CRITICAL", __filename);
            BotSettings.assist.error("The ID `" + tmpUser + "` is not a valid user.  We were unable to ban because " + err.message, message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

softbanCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let moment = require("moment");
        let userUnBanned = args.shift();
        let tmpUser = BotSettings.resolve.User(userUnBanned);
        let duration = 0, reason = "SOFTBANNED for Unknown reason";
        if(args.length >= 2) {
            let tmpArg = args[0];
            if(BotSettings.resolve.NumberArr(tmpArg, BotSettings.discordServers.ban.duration, "integer") === true) {
                duration = parseInt(tmpArg);
                args.shift();
            } else {
                //invalid, default
                duration = parseInt(BotSettings.discordServers.ban.default);
            }
            reason = args.join(" ");
            if(reason.length <= parseInt(BotSettings.discordServers.ban.maxsize)) {
                reason = args.join(" ").substring(0, 400) + "...";
            }
        }
        if(tmpUser === false) {
            BotSettings.assist.error("Unable to find the user that you have requested.  Please try again.", message.channel);
            return resolve({response: "", silent: true});
        } else {
            message.guild.ban(tmpUser.id, {days: duration, reason: reason}).then((m) => {
                Database.callStatement("SELECT * FROM modlogs WHERE platform='discord' AND server='" + message.guild.id + "' AND typeOpt='ban' AND userid='" + tmpUser.id + "' ORDER BY case_id DESC LIMIT 1").then(rows => {
                    let text = "";
                    if(args.length >= 1) {
                        text = args.join(" ");
                    } else {
                        text = "SOFTBANNED for unknown reason";
                    }
                    let z = "", num = 1;
                    console.log(rows);
                    if(rows.length === 1) {
                        z = rows[0];
                        num = z.case_id;
                    }
                    num = parseInt(num) + 1;
                    Database.callStatement("INSERT INTO modlogs (platform, server, userid, typeOpt, case_id, reason, byWho, searchedAt) VALUES ('discord', '" + message.guild.id + "', '" + tmpUser.id + "', 'ban', '" + num + "', '" + text +"', '" + message.author.id + "', '" + moment().format("YYYY-MM-DD hh:mm:ss") + "')").then(rowConfirm => {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("SOFTBANNED");
                        embed.setDescription("**CASE**: #" + num + "\n**User**: " + tmpUser.tag  + "\n**User ID**: " + tmpUser.id + "\n**Description**: " + text);
                        embed.setAuthor(tmpUser.tag, tmpUser.avatarURL);
                        embed.setFooter(message.author.tag + " | " + moment().format("llll"), message.author.avatarURL);
                        Database.callStatement("SELECT modlogs FROM settings WHERE platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(rows => {
                            if(rows.length === 1) {
                                let rowData = rows[0];
                                let channel = BotSettings.resolve.Channel(rowData.modlogs);
                                if(channel === false) {
                                    message.channel.send("", {embed: embed}).then((m2 => {
                                        let tmpArg = [tmpUser.id, "Auto Removing"];
                                        unbanCmd(bot, message, tmpArg, time).then(unbanRes => {
                                            return resolve(unbanRes);
                                        }).catch(unbanErr => {
                                            return resolve(unbanErr);
                                        });
                                    })).catch(e3 => {
                                        let tmpArg = [tmpUser.id, "Auto Removing"];
                                        unbanCmd(bot, message, tmpArg, time).then(unbanRes => {
                                            return resolve(unbanRes);
                                        }).catch(unbanErr => {
                                            return resolve(unbanErr);
                                        });
                                    });
                                } else {
                                    channel.send("", {embed: embed}).then(() => {
                                        let tmpArg = [tmpUser.id, "Auto Removing"];
                                        unbanCmd(bot, message, tmpArg, time).then(unbanRes => {
                                            return resolve(unbanRes);
                                        }).catch(unbanErr => {
                                            return resolve(unbanErr);
                                        });
                                    }).catch(e3 => {
                                        let tmpArg = [tmpUser.id, "Auto Removing"];
                                        unbanCmd(bot, message, tmpArg, time).then(unbanRes => {
                                            return resolve(unbanRes);
                                        }).catch(unbanErr => {
                                            return resolve(unbanErr);
                                        });
                                    });
                                }
                            }
                        }).catch(errRow => {
                            Logger.sendLog("-> Unable to select the modlogs from the settings DB because.... " + errRow, "CRITICAL", __filename);
                            return resolve({response: "", silent: true});
                        });
                    }).catch(errConfirm => {
                        Logger.sendLog("-> Unable to update the modlogs in the DB because.... " + errConfirm, "CRITICAL", __filename);
                        return resolve({response: "There was an error that came when adding it to the DB.  We apologize for the error", silent: false});
                    });
                }).catch(errRow => {
                    Logger.sendLog("-> Error when looking at modlogs for some reason.  " + errRow, "CRITICAL", __filename);
                    return resolve({response: "Ban was successfully made but not logged properly.", silent: false});
                });
            }).catch(errBan => {
                Logger.sendLog("-> Error when trying to ban someone for some reason.  " + errBan, "CRITICAL", __filename);
                return resolve({response: "Ban was not able to be done because " + errBan.message, silent: false});
            });
        }
    });
}

unbanCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let moment = require("moment");
        let userUnBanned = args.shift();
        let tmpUser = BotSettings.resolve.User(userUnBanned);
        if(tmpUser === false) {
            BotSettings.assist.error("Unable to find the user that you have requested.  Please try again.", message.channel);
            return resolve({response: "", silent: true});
        } else {
            message.guild.unban(tmpUser.id).then((m) => {
                Database.callStatement("SELECT * FROM modlogs WHERE platform='discord' AND server='" + message.guild.id + "' AND typeOpt='ban' AND userid='" + tmpUser.id + "' ORDER BY case_id DESC LIMIT 1").then(rows => {
                    let text = "";
                    if(args.length >= 1) {
                        text = args.join(" ");
                    } else {
                        text = "UNBANNED for unknown reason";
                    }
                    let z = "", num = 1;
                    console.log(rows);
                    if(rows.length === 1) {
                        z = rows[0];
                        num = z.case_id;
                    }
                    num = parseInt(num);
                    Database.callStatement("INSERT INTO modlogs (platform, server, userid, typeOpt, case_id, reason, byWho, searchedAt) VALUES ('discord', '" + message.guild.id + "', '" + tmpUser.id + "', 'unban', '" + num + "', '" + text +"', '" + message.author.id + "', '" + moment().format("YYYY-MM-DD hh:mm:ss") + "')").then(rowConfirm => {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("UNBANNED");
                        embed.setDescription("**CASE**: #" + num + "\n**User**: " + tmpUser.tag  + "\n**User ID**: " + tmpUser.id + "\n**Description**: " + text);
                        embed.setAuthor(tmpUser.tag, tmpUser.avatarURL);
                        embed.setFooter(message.author.tag + " | " + moment().format("llll"), message.author.avatarURL);
                        Database.callStatement("SELECT modlogs FROM settings WHERE platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(rows => {
                            if(rows.length === 1) {
                                let rowData = rows[0];
                                let channel = BotSettings.resolve.Channel(rowData.modlogs);
                                if(channel === false) {
                                    return resolve({response: "", embed: embed, silent: false});
                                } else {
                                    channel.send("", {embed: embed}).then(() => {
                                        return resolve({response: "", silent: true});
                                    }).catch(e => {
                                        Logger.sendLog("-> Unable to send the message to the channel because.... " + e, "CRITICAL", __filename);
                                        return resolve({response: "", silent: true});
                                    });
                                }
                            }
                        }).catch(errRow => {
                            Logger.sendLog("-> Unable to select the modlogs from the settings DB because.... " + errRow, "CRITICAL", __filename);
                            return resolve({response: "", silent: true});
                        });
                    }).catch(errConfirm => {
                        Logger.sendLog("-> Unable to update the modlogs in the DB because.... " + errConfirm, "CRITICAL", __filename);
                        return resolve({response: "There was an error that came when adding it to the DB.  We apologize for the error", silent: false});
                    });
                }).catch(errRow => {
                    Logger.sendLog("-> Error when looking at modlogs for some reason.  " + errRow, "CRITICAL", __filename);
                    return resolve({response: "Ban was successfully made but not logged properly.", silent: false});
                });
            }).catch(errBan => {
                Logger.sendLog("-> Error when trying to ban someone for some reason.  " + errBan, "CRITICAL", __filename);
                return resolve({response: "Unban was not able to be done because " + errBan.message, silent: false});
            });
        }
    });
}

banCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let moment = require("moment");
        let userBanned = args.shift();
        let tmpUser = BotSettings.resolve.User(userBanned);

        if(tmpUser === "" || tmpUser === false) {
            BotSettings.assist.error("Unable to find the user that you have requested.  Please try again.", message.channel);
            return resolve({response: "", silent: true});
        }
        message.guild.ban(tmpUser.id, {days: 7}).then((m) => {
            Database.callStatement("SELECT * FROM modlogs WHERE platform='discord' AND server='" + message.guild.id + "' AND userid='" + tmpUser.id + "' AND typeOpt='ban' ORDER BY case_id DESC LIMIT 1").then(rows => {
                let text = "";
                if(args.length >= 1) {
                    text = args.join(" ");
                } else {
                    text = "Banned for unknown reason.";
                }
                let num = 1;
                if(rows.length === 0) {
                    //new entry, number 1
                    Database.callStatement("INSERT INTO modlogs (platform, server, userid, typeOpt, case_id, reason, byWho, searchedAt) VALUES ('discord', '" + message.guild.id + "', '" + tmpUser.id + "', 'ban', '1', '" + text +"', '" + message.author.id + "', '" + moment().format("YYYY-MM-DD hh:mm:ss") + "')").then(rowConfirm => {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("BANNED");
                        embed.setDescription("**CASE**: #" + num + "\n**User**: " + tmpUser.tag  + "\n**User ID**: " + tmpUser.id + "\n**Description**: " + text);
                        embed.setAuthor(tmpUser.tag, tmpUser.avatarURL);
                        embed.setFooter(message.author.tag + " | " + moment().format("llll"), message.author.avatarURL);
                        Database.callStatement("SELECT modlogs FROM settings WHERE platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(rows => {
                            if(rows.length === 1) {
                                let rowData = rows[0];
                                let channel = BotSettings.resolve.Channel(rowData.modlogs);
                                if(channel === false) {
                                    return resolve({response: "", embed: embed, silent: false});
                                } else {
                                    channel.send("", {embed: embed}).then(() => {
                                        return resolve({response: "", silent: true});
                                    }).catch(e => {
                                        Logger.sendLog("-> Unable to send the message to the channel because.... " + e, "CRITICAL", __filename);
                                        return resolve({response: "", silent: true});
                                    });
                                }
                            }
                        }).catch(errRow => {
                            Logger.sendLog("-> Unable to select the modlogs from the settings DB because.... " + errRow, "CRITICAL", __filename);
                            return resolve({response: "", silent: true});
                        });
                    }).catch(errConfirm => {
                        Logger.sendLog("-> Unable to update the modlogs in the DB because.... " + errConfirm, "CRITICAL", __filename);
                        return resolve({response: "There was an error that came when adding it to the DB.  We apologize for the error", silent: false});
                    });
                } else {
                    let z = rows[0];
                    let num = z.case_id;
                    num = parseInt(num) + 1;
                    Database.callStatement("INSERT INTO modlogs (platform, server, userid, typeOpt, case_id, reason, byWho, searchedAt) VALUES ('discord', '" + message.guild.id + "', '" + tmpUser.id + "', 'ban', '" + num + "', '" + text +"', '" + message.author.id + "', '" + moment().format("YYYY-MM-DD hh:mm:ss") + "')").then(rowConfirm => {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("BANNED");
                        embed.setDescription("**CASE**: #" + num + "\n**User**: " + tmpUser.tag  + "\n**User ID**: " + tmpUser.id + "\n**Description**: " + text);
                        embed.setAuthor(tmpUser.tag, tmpUser.avatarURL);
                        embed.setFooter(message.author.tag + " | " + moment().format("llll"), message.author.avatarURL);
                        Database.callStatement("SELECT modlogs FROM settings WHERE platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(rows => {
                            if(rows.length === 1) {
                                let rowData = rows[0];
                                let channel = BotSettings.resolve.Channel(rowData.modlogs);
                                if(channel === false) {
                                    return resolve({response: "", embed: embed, silent: false});
                                } else {
                                    channel.send("", {embed: embed}).then(() => {
                                        return resolve({response: "", silent: true});
                                    }).catch(e => {
                                        Logger.sendLog("-> Unable to send the message to the channel because.... " + e, "CRITICAL", __filename);
                                        return resolve({response: "", silent: true});
                                    });
                                }
                            }
                        }).catch(errRow => {
                            Logger.sendLog("-> Unable to select the modlogs from the settings DB because.... " + errRow, "CRITICAL", __filename);
                            return resolve({response: "", silent: true});
                        });
                    }).catch(errConfirm => {
                        Logger.sendLog("-> Unable to update the modlogs in the DB because.... " + errConfirm, "CRITICAL", __filename);
                        return resolve({response: "There was an error that came when adding it to the DB.  We apologize for the error", silent: false});
                    });
                }
            }).catch(errRow => {
                Logger.sendLog("-> Error when looking at modlogs for some reason.  " + errRow, "CRITICAL", __filename);
                return resolve({response: "Ban was successfully made but not logged properly.", silent: false});
            });
        }).catch(err => {
            Logger.sendLog("-> Unable to ban the member because " + err.message, "CRITICAL", __filename);
            BotSettings.assist.error("The ID `" + tmpUser + "` is not a valid user.  We were unable to ban because " + err.message, message.channel);
            return resolve({response: "", silent: true});
        });
    });
}


this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageKick.aliases, args: usageKick.args, usage: usageKick, run: kickCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageBan.aliases, args: usageBan.args, usage: usageBan, run: banCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageSoftBan.aliases, args: usageSoftBan.args, usage: usageSoftBan, run: softbanCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageUnBan.aliases, args: usageUnBan.args, usage: usageUnBan, run: unbanCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageWarn.aliases, args: usageWarn.args, usage: usageWarn, run: warnCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageMute.aliases, args: usageMute.args, usage: usageMute, run: muteCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageUnMute.aliases, args: usageUnMute.args, usage: usageUnMute, run: unmuteCmd}
];
