const moduleInfo = {
    name: "roles",
    truename: "roles",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usageRole = {
    name: "role",
    cmdName: "role",
    aliases: ["role", "roles"],
    args: {min: 1, max: 5},
    description: "Get, set, edit a role",
    exampleUsage: "role get Staff\nrole set Staff color #ff00cc",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "General",
    options: ["get", "set", "edit", "inspect", "list"],
    permlvl: 0,
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

getRole = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        BotSettings.assist.permission(message.author).then((userPerms) => {
            let detailInfo = false;
            if(args.length >= 2) {
                if(args[0].toLowerCase() === "details") {
                    detailInfo = true;
                    args.shift();
                }
            }
            roleArg = args.join(" ");
            let roleReq = BotSettings.resolve.Role(roleArg, message.guild);
            if(roleReq === false) {
                BotSettings.assist.error("Unable to find the role that you are requesting.", message.channel);
                return resolve({response: "", silent: true});
            }
            let roleColor = roleReq.hexColor;
            let roleColorRgb = BotSettings.resolve.Color(roleColor, "hex");

            let moment = require("moment");
            let embed = new Discord.MessageEmbed();
            embed.setColor(roleColor);
            embed.addField("Name", roleReq.name, true);
            embed.addField("ID", roleReq.id, true);
            embed.addField("Created On", moment(roleReq.createdTimestamp).format("LLLL"));
            embed.addField("Members", roleReq.members.size + " (" + roleReq.members.map(mem => mem.user.presence.status.toLowerCase() !== "online").filter((boolVal) => boolVal).length + " online)", true);
            embed.addField("Position", roleReq.position + " (Out of " + roleReq.guild.roles.size + ")", true);
            if(roleColorRgb === false) {
                embed.addField("Color", roleReq.hexColor, true);
            } else {
                embed.addField("Color", "**Hex**: " + roleReq.hexColor + "\n**RGB**: (" + roleColorRgb.join(", ") + ")", true);
            }
            embed.addField("Hoisted", (roleReq.hoist === true) ? "True" : "False", true);
            embed.addField("Managed", (roleReq.managed === true) ? "True" : "False", true);
            embed.addField("Mentionable", (roleReq.mentionable === true) ? "True" : "False", true);
            let rolesSerialized = roleReq.serialize();
            let S = require('string');
            let categories = {};
            for(let key in rolesSerialized) {
                if(rolesSerialized.hasOwnProperty(key)) {
                    if(rolesSerialized[key] === true) {
                        let roleCategory = BotSettings.discordRoles[key];
                        if(!categories.hasOwnProperty(roleCategory)) {
                            categories[roleCategory] = [];
                        }
                        categories[roleCategory].push(S(key.replaceAll("_", " ")).capitalize().s);
                    }
                }
            }
            //
            //parseInt(userPerms) >= BotSettings.assist.permRange("mod")
            if(categories.admin !== undefined && detailInfo === true && parseInt(userPerms) >= BotSettings.assist.permRange("admin")) {
                embed.addField("**Admin Permissions**", categories.admin.join("\n"), true);
            }
            if(categories.mod !== undefined && detailInfo === true && parseInt(userPerms) >= BotSettings.assist.permRange("mod")) {
                embed.addField("**Mod Permissions**", categories.mod.join("\n"), true);
            }
            if(categories.general !== undefined && detailInfo === true && parseInt(userPerms) >= BotSettings.assist.permRange("general")) {
                embed.addField("**General Permissions**", categories.general.join("\n"), true);
            }
            if(categories.misc !== undefined && detailInfo === true && parseInt(userPerms) >= BotSettings.assist.permRange("general")) {
                embed.addField("**Misc Permissions**", categories.misc.join("\n"), true);
            }
            message.channel.send("", {embed: embed});
            return resolve({response: "", silent: true});
        }).catch(userPermErr => {
            console.log(prefixErr);
            BotSettings.assist.error("An error occurred for some reason when trying to get the user's permission level.", message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

roleCmd = (bot, message, args, time) => {
    return new Promise((resolve, reject) => {
        let argChoice = args.shift().toLowerCase();
        if(usageRole.options.includes(argChoice) === true) {
            if(argChoice === "get") {
                getRole(bot, message, args, time).then(response => {
                    return resolve(response);
                }).catch(err => {
                    BotSettings.assist.error(err, message.channel);
                    return resolve({response: "", silent: true});
                });
            } else if(argChoice === "set" || argChoice === "edit") {
                editRole(bot, message, args, time).then(response => {
                    return resolve(response);
                }).catch(err => {
                    BotSettings.assist.error(err, message.channel);
                    return resolve({response: "", silent: true});
                });
            } else if(argChoice === "inspect") {
                inspectRole(bot, message, args, time).then(response => {
                    return resolve(response);
                }).catch(err => {
                    BotSettings.assist.error(err, message.channel);
                    return resolve({response: "", silent: true});
                });
            } else if(argChoice === "list") {
                listRoles(bot, message, args, time).then(response => {
                    return resolve(response);
                }).catch(err => {
                    BotSettings.assist.error(err, message.channel);
                    return resolve({response: "", silent: true});
                });
            }
        } else {
            BotSettings.assist.getGuildPrefix(message).then(prefixResp => {
                let mainPrefix =  (prefixResp.valid === true) ? prefixResp.prefix : BotSettings.config.prefix;
                let responseMsg = "**" + message.author.username + "**, the correct usage is: `" + mainPrefix + usageRole.aliases[0] + " role`";
                responseMsg += "\n:white_small_square: | `" + mainPrefix + usageRole.aliases[0] + " get admins`\n:white_small_square: | Get more help using `" + mainPrefix + "help role`";
                return resolve({response: responseMsg, silent: false});
            }).catch(prefixErr => {
                console.log(prefixErr);
                BotSettings.assist.error("An error occurred for some reason when trying to get the prefix.", message.channel);
                return resolve({response: "", silent: true});
            });
        }
    });
}

editRole = (bot, message, args, time) => {
    return new Promise((resolve, reject) => {
        return resolve({response: "Currently in progress.", silent: false});
    });
}

inspectRole = (bot, message, args, time) => {
    return new Promise((resolve, reject) => {
        let momentTz = require("moment-timezone");

        let moment = require("moment");
        if(message.mentions.roles.length === 1) {
            let role = message.mentions.roles.first();
            let roleInfoEmbed = new Discord.MessageEmbed();
            roleInfoEmbed.setTitle("Role Info for " + role.name + " | " + role.id);
            let timezoneAbbr = BotSettings.assist.tzAbbr[momentTz.tz(role.createdTimestamp, momentTz.tz.guess()).format("zz")] || momentTz.tz(role.createdTimestamp, momentTz.tz.guess()).format("zz");
            roleInfoEmbed.addField('Created On', moment(momentTz.tz(role.createdTimestamp, momentTz.tz.guess()).format()).format("LLLL") + " (" + timezoneAbbr + ")");
            roleInfoEmbed.addField("Members", role.members.filter(member => {return !member.user.bot}).size, true);
            roleInfoEmbed.addField("Bots", role.members.filter(member => {return member.user.bot}).size, true);
            roleInfoEmbed.addField("Separated", (role.hoist) ? "Yes" : "No", true);
            roleInfoEmbed.addField("Managed", (role.managed) ? "Yes" : "No", true);
            roleInfoEmbed.addField("Mentionable", (role.mentionable) ? "Yes" : "No", true);
            roleInfoEmbed.addField("Position", role.position, true);
            return resolve({response: roleInfoEmbed, embed: roleInfoEmbed, silent: false});
        } else {
            if(!message.guild.roles.exists("name", args.join(" "))) {
                return resolve({response: "This role does not exist!", silent: false});
            }
            let role = message.guild.roles.find("name", args.join(" "));
            let roleInfoEmbed = new Discord.MessageEmbed();
            roleInfoEmbed.setTitle("Role Info for " + role.name + " | " + role.id);
            let timezoneAbbr = BotSettings.assist.tzAbbr[momentTz.tz(role.createdTimestamp, momentTz.tz.guess()).format("zz")] || momentTz.tz(role.createdTimestamp, momentTz.tz.guess()).format("zz");
            roleInfoEmbed.addField('Created On', moment(momentTz.tz(role.createdTimestamp, momentTz.tz.guess()).format()).format("LLLL") + " (" + timezoneAbbr + ")");
            roleInfoEmbed.addField("Members", role.members.filter(member => {return !member.user.bot}).size, true);
            roleInfoEmbed.addField("Bots", role.members.filter(member => {return member.user.bot}).size, true);
            roleInfoEmbed.addField("Separated", (role.hoist) ? "Yes" : "No", true);
            roleInfoEmbed.addField("Managed", (role.managed) ? "Yes" : "No", true);
            roleInfoEmbed.addField("Mentionable", (role.mentionable) ? "Yes" : "No", true);
            roleInfoEmbed.addField("Position", role.position, true);
            return resolve({response: roleInfoEmbed, embed: roleInfoEmbed, silent: false});
        }
    });
}

listRoles = (bot, message, args, time) => {
    return new Promise((resolve, reject) => {
        let roleChoice = "";
        let roleList = message.guild.roles;
        let finalResponse = [];
        let subRole = "";
        let boolChoice = true;
        if(args.length >= 1) {
            roleChoice = args.shift();
            roleChoice = roleChoice.toLowerCase();
            if(roleChoice === "hoist") {
                if(args.length === 1) {
                    let boolVar = args.shift();
                    if(BotSettings.resolve.BoolAct(boolVar) !== null) {
                        boolChoice = BotSettings.resolve.BoolAct(boolVar);
                    }
                }
                let hoistedRoles = roleList.filter(role => {
                    return role.hoist === boolChoice;
                });
                finalResponse.push(hoistedRoles.map(role => {return role.name + " | " + role.id;}));
            } else if(roleChoice === "managed") {
                if(args.length === 1) {
                    let boolVar = args.shift();
                    if(BotSettings.resolve.BoolAct(boolVar) !== null) {
                        boolChoice = BotSettings.resolve.BoolAct(boolVar);
                    }
                }
                let managedRoles = roleList.filter(role => {
                    return role.managed === boolChoice;
                });
                finalResponse.push(managedRoles.map(role => { return role.name + " | " + role.id;}));
            } else if(roleChoice === "highest") {
                if(args.length >= 1) {
                    subRole = args.shift();
                    if(subRole.toLowerCase() === "members") {
                        finalResponse.push(roleList.sort((roleA, roleB) => {
                            if(roleA.members.size < roleB.members.size) return 1;
                            if(roleA.members.size > roleB.members.size) return -1;
                            return 0;
                        }).map(role => { return role.name + " | " + role.id + " | size: " + role.members.size;}));
                    } else if(subRole.toLowerCase() === "position") {
                        finalResponse.push(roleList.sort((roleA, roleB) => {
                            if(roleA.position < roleB.position) return 1;
                            if(roleA.position > roleB.position) return -1;
                            return 0;
                        }).map(role => { return role.name + " | " + role.id + " | pos: " + role.position;}));
                    } else if(subRole.toLowerCase() === "hoist") {
                        if(args.length === 1) {
                            let boolVar = args.shift();
                            if(BotSettings.resolve.BoolAct(boolVar) !== null) {
                                boolChoice = BotSettings.resolve.BoolAct(boolVar);
                            }
                        }
                        let hoistFilter = roleList.filter(role => {
                            return role.hoist === boolChoice;
                        });
                        finalResponse.push(hoistFilter.sort((roleA, roleB) => {
                            if(roleA.position < roleB.position) return 1;
                            if(roleA.position > roleB.position) return -1;
                            return 0;
                        }).map(role => { return role.name + " | " + role.id;}));
                    } else if(subRole.toLowerCase() === "managed") {
                        if(args.length === 1) {
                            let boolVar = args.shift();
                            if(BotSettings.resolve.BoolAct(boolVar) !== null) {
                                boolChoice = BotSettings.resolve.BoolAct(boolVar);
                            }
                        }
                        let managedRoles = roleList.filter(role => {
                            return role.managed === boolChoice;
                        });
                        finalResponse.push(managedRoles.sort((roleA, roleB) => {
                            if(roleA.position < roleB.position) return 1;
                            if(roleA.position > roleB.position) return -1;
                            return 0;
                        }).map(role => { return role.name + " | " + role.id;}));
                    } else if(subRole.toLowerCase() === "mentionable") {
                        if(args.length === 1) {
                            let boolVar = args.shift();
                            if(BotSettings.resolve.BoolAct(boolVar) !== null) {
                                boolChoice = BotSettings.resolve.BoolAct(boolVar);
                            }
                        }
                        let mentionableRoles = roleList.filter(role => {
                            return role.mentionable === boolChoice;
                        });
                        finalResponse.push(mentionableRoles.sort((roleA, roleB) => {
                            if(roleA.position < roleB.position) return 1;
                            if(roleA.position > roleB.position) return -1;
                            return 0;
                        }).map(role => { return role.name + " | " + role.id;}));
                    } else {
                        finalResponse.push(roleList.sort((roleA, roleB) => {
                            if(roleA.members.size < roleB.members.size) return 1;
                            if(roleA.members.size > roleB.members.size) return -1;
                            return 0;
                        }).map(role => { return role.name + " | " + role.id + " | size: " + role.memebers.size;}));
                    }
                } else {
                    subRole = "members";
                    finalResponse.push(roleList.sort((roleA, roleB) => {
                        if(roleA.members.size < roleB.members.size) return 1;
                        if(roleA.members.size > roleB.members.size) return -1;
                        return 0;
                    }).map(role => { return role.name + " | " + role.id + " | size: " + role.members.size;}));
                }
            } else if(roleChoice === "lowest") {
                if(args.length >= 1) {
                    subRole = args.shift();
                    subRole = subRole.toLowerCase();
                    if(subRole === "members") {
                        finalResponse.push(roleList.sort((roleA, roleB) => {
                            if(roleA.members.size < roleB.members.size) return -1;
                            if(roleA.members.size > roleB.members.size) return 1;
                            return 0;
                        }).map(role => { return role.name + " | " + role.id + " | size: " + role.members.size;}));
                    } else if(subRole === "position") {
                        finalResponse.push(roleList.sort((roleA, roleB) => {
                            if(roleA.position < roleB.position) return -1;
                            if(roleA.position > roleB.position) return 1;
                            return 0;
                        }).map(role => { return role.name + " | " + role.id + " | pos: " + role.position;}));
                    } else if(subRole === "hoist") {
                        if(args.length === 1) {
                            let boolVar = args.shift();
                            if(BotSettings.resolve.BoolAct(boolVar) !== null) {
                                boolChoice = BotSettings.resolve.BoolAct(boolVar);
                            }
                        }
                        let hoistFilter = roleList.filter(role => {
                            return role.hoist === boolChoice;
                        });
                        finalResponse.push(hoistFilter.sort((roleA, roleB) => {
                            if(roleA.position < roleB.position) return -1;
                            if(roleA.position > roleB.position) return 1;
                            return 0;
                        }).map(role => { return role.name + " | " + role.id;}));
                    } else if(subRole === "managed") {
                        if(args.length === 1) {
                            let boolVar = args.shift();
                            if(BotSettings.resolve.BoolAct(boolVar) !== null) {
                                boolChoice = BotSettings.resolve.BoolAct(boolVar);
                            }
                        }
                        let managedRoles = roleList.filter(role => {
                            return role.managed === boolChoice;
                        });
                        finalResponse.push(managedRoles.sort((roleA, roleB) => {
                            if(roleA.position < roleB.position) return -1;
                            if(roleA.position > roleB.position) return 1;
                            return 0;
                        }).map(role => { return role.name + " | " + role.id;}));
                    } else if(subRole === "mentionable") {
                        if(args.length === 1) {
                            let boolVar = args.shift();
                            if(BotSettings.resolve.BoolAct(boolVar) !== null) {
                                boolChoice = BotSettings.resolve.BoolAct(boolVar);
                            }
                        }
                        let mentionableRoles = roleList.filter(role => {
                            return role.mentionable === boolChoice;
                        });
                        finalResponse.push(mentionableRoles.sort((roleA, roleB) => {
                            if(roleA.position < roleB.position) return -1;
                            if(roleA.position > roleB.position) return 1;
                            return 0;
                        }).map(role => { return role.name + " | " + role.id;}));
                    } else {
                        finalResponse.push(roleList.sort((roleA, roleB) => {
                            if(roleA.members.size < roleB.members.size) return -1;
                            if(roleA.members.size > roleB.members.size) return 1;
                            return 0;
                        }).map(role => { return role.name + " | " + role.id + " | size: " + role.members.size;}));
                    }
                } else {
                    subRole = "members";
                    finalResponse.push(roleList.sort((roleA, roleB) => {
                        if(roleA.members.size < roleB.members.size) return -1;
                        if(roleA.members.size > roleB.members.size) return 1;
                        return 0;
                    }).map(role => { return role.name + " | " + role.id + " | size: " + role.members.size;}));
                }
            } else if(roleChoice === "mentionable") {
                if(args.length === 1) {
                    let boolVar = args.shift();
                    if(BotSettings.resolve.BoolAct(boolVar) !== null) {
                        boolChoice = BotSettings.resolve.BoolAct(boolVar);
                    }
                }
                let mentionableRoles = roleList.filter(role => {
                    return role.mentionable === boolChoice;
                });
                finalResponse.push(mentionableRoles.map(role => { return role.name + " | " + role.id;}));
            } else if(roleChoice === "members") {
                finalResponse.push(roleList.sort((roleA, roleB) => {
                    if(roleA.members.size < roleB.members.size) return 1;
                    if(roleA.members.size > roleB.members.size) return -1;
                    return 0;
                }).map(role => { return role.name + " | " + role.id + " | size: " + role.members.size;}));
            } else if(roleChoice === "position") {
                let positionRoles = roleList.sort( (roleA, roleB) => {
                    if(roleA.position < roleB.position) return 1;
                    if(roleA.position > roleB.position) return -1;
                    return 0;
                });
                finalResponse.push(positionRoles.map(role => { return role.name + " | " + role.id + " | pos: " + role.position;}));
            } else {
                finalResponse.push(roleList.sort((roleA, roleB) => {
                    if(roleA.name < roleB.name) return 1;
                    if(roleA.name > roleB.name) return -1;
                    return 0;
                }).map(role => { return role.name + " | " + role.id;}));
            }
        } else {
            roleChoice = "Roles";
            finalResponse.push(roleList.sort((roleA, roleB) => {
                if(roleA.name < roleB.name) return 1;
                if(roleA.name > roleB.name) return -1;
                return 0;
            }).map(role => { return role.name + " | " + role.id;}));
        }
        let embed = new Discord.MessageEmbed();
        embed.setColor("RANDOM");
        embed.setDescription("**Role List for " + message.guild.name + " | " + message.guild.id + "**");

        if(finalResponse.length === 1) {
            let numMaxField = BotSettings.assist.findgcf(finalResponse[0].length, 25);
            let embedList = "";
            let embedCompare = "";
            if(numMaxField === 1) {
                embedList = BotSettings.resolve.characterLimitHandler(finalResponse[0], BotSettings.discordServers.limits.field.value, 25);
            } else {
                embedList = BotSettings.resolve.distributeArray(finalResponse[0], numMaxField);
                embedCompare = BotSettings.resolve.characterLimitHandler(finalResponse[0], BotSettings.discordServers.limits.field.value, 25);
            }
            if(embedCompare !== "" && embedList.length >= embedCompare.length && embedList.length !== 0 && embedCompare.length !== 0) {
                Logger.sendLog("Embed Compare < embedList", "INFO", __filename);
                embedList = embedCompare;
            }
            if(embedList.length === 0) {
                BotSettings.assist.error("There was an error splitting the array correctly.", message.channel);
                return resolve({response: "", silent: true});
            }
            let dataCounter = 0;
            embedList.forEach((embedVal) => {
                let addNum = (embedList.length > 1) ? "#" + (dataCounter + 1) + " **": "**"
                if(subRole !== "") {
                    embed.addField(addNum + roleChoice + " " + subRole + "**", embedVal);
                } else {
                    embed.addField(addNum + roleChoice + "**", embedVal);
                }
                dataCounter++;
            });
        } else {
            for(let i = 0; i < finalResponse.length; i++) {
                let numMaxField = BotSettings.assist.findgcf(finalResponse[i].length, 25);
                let embedList = "";
                let embedCompare = "";
                if(numMaxField === 1) {
                    embedList = BotSettings.resolve.characterLimitHandler(finalResponse[0], BotSettings.discordServers.limits.field.value, 25);
                } else {
                    embedList = BotSettings.resolve.distributeArray(finalResponse[0], numMaxField);
                    embedCompare = BotSettings.resolve.characterLimitHandler(finalResponse[0], BotSettings.discordServers.limits.field.value, 25);
                }
                if(embedCompare !== "" && embedList.length >= embedCompare.length && embedList.length !== 0 && embedCompare.length !== 0) {
                    Logger.sendLog("Embed Compare < embedList", "INFO", __filename);
                    embedList = embedCompare;
                }
                if(embedList.length === 0) {
                    BotSettings.assist.error("There was an error splitting the array correctly.", message.channel);
                    return resolve({response: "", silent: true});
                }

                let dataCounter = 0;
                embedList.forEach((embedVal) => {
                    let addNum = (embedList.length > 1) ? "#" + (dataCounter + 1) + " **": "**"
                    if(subRole !== "") {
                        embed.addField(addNum + roleChoice + " " + subRole + "**", embedVal);
                    } else {
                        embed.addField(addNum + roleChoice + "**", embedVal);
                    }
                    dataCounter++;
                });
            }
        }
        return resolve({response: "", embed: embed, silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageRole.aliases, args: usageRole.args, usage: usageRole, run: roleCmd}
];
