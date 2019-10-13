const moduleInfo = {
    name: "embed",
    truename: "embed",
    platformOnly: "discord",
    author: "Manny",
    contributors: ["Zach S."]
}

const usage = {
    name: "embed",
    cmdName: "embed",
    aliases: ["embed", "embedtxt"],
    args: {min: 1, max: 1000},
    description: "Create a discord embed",
    exampleUsage: "embed {\'title\': \'Test\'}",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Embed",
    permlvl: 4,
    premiumLvl: 0,
    enabled: true,
    contributors: ["Zach S."]
}

const usageEmbedSay = {
    name: "embedsay",
    cmdName: "embedsay",
    aliases: ["embedsay", "embedsay"],
    args: {min: 1, max: 1000},
    description: "Say something as the bot in an embed",
    exampleUsage: "embedsay Hello",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Embed",
    permlvl: 4,
    premiumLvl: 0,
    enabled: true,
    contributors: ["Zach S."]
}

const usageEmbedSayTo = {
    name: "embed",
    cmdName: "embedsayto",
    aliases: ["embedsayto"],
    args: {min: 1, max: 1000},
    description: "Say something to someone in an embed",
    exampleUsage: "embedsay @eaaliprantis#2160 Hello",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Embed",
    permlvl: 4,
    premiumLvl: 0,
    enabled: true,
    contributors: ["Zach S."]
}

const usageEmbedSayAdmin = {
    name: "embed",
    cmdName: "embedsayadmin",
    aliases: ["embedsayadmin"],
    args: {min: 1, max: 1000},
    description: "Say something as the bot without detection",
    exampleUsage: "embedsayadmin Hello",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Embed",
    permlvl: 5,
    premiumLvl: 0,
    enabled: true,
    contributors: ["Zach S."]
}

const usageEmbedColorTo = {
    name: "embed",
    cmdName: "embedcolorto",
    aliases: ["embedcolorto"],
    args: {min: 1, max: 1000},
    description: "Say something to someone with an embed",
    exampleUsage: "embedcolorto #ff00cc Hello",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Embed",
    permlvl: 4,
    premiumLvl: 0,
    enabled: true,
    contributors: ["Zach S."]
}

const usageEmbedColor = {
    name: "embed",
    cmdName: "embedcolor",
    aliases: ["embedcolor"],
    args: {min: 1, max: 1000},
    description: "Say something as the bot with color",
    exampleUsage: "embedcolor #ff00cc Hello",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Embed",
    permlvl: 4,
    premiumLvl: 0,
    enabled: true,
    contributors: ["Zach S."]
}

const usageEmbedColorAdmin = {
    name: "embed",
    cmdName: "embedcoloradmin",
    aliases: ["embedcoloradmin"],
    args: {min: 1, max: 1000},
    description: "Say something as the bot with no trace",
    exampleUsage: "embedcoloradmin #ff00cc Hello",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Embed",
    permlvl: 5,
    premiumLvl: 0,
    enabled: true,
    contributors: ["Zach S."]
}

const usageEmbedUrl = {
    name: "embed",
    cmdName: "embedurl",
    aliases: ["embedurl"],
    args: {min: 1, max: 1000},
    description: "Display an url with the bot",
    exampleUsage: "embedurl https://goo.gl/675fbm",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Embed",
    permlvl: 4,
    premiumLvl: 0,
    enabled: true,
    contributors: ["Zach S."]
}

const usageEmbedUrlAdmin = {
    name: "embed",
    cmdName: "embedurladmin",
    aliases: ["embedurladmin"],
    args: {min: 1, max: 1000},
    description: "Display an url by the bot with no trace",
    exampleUsage: "embedurladmin https://goo.gl/675fbm",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Embed",
    permlvl: 5,
    premiumLvl: 0,
    enabled: true,
    contributors: ["Zach S."]
}

const usageEmbedImage = {
    name: "embed",
    cmdName: "embedimage",
    aliases: ["embedimage"],
    args: {min: 1, max: 1000},
    description: "Send something as an image from the bot",
    exampleUsage: "embedimage https://goo.gl/675fbm\nembedimage <attach_image>\n**Note**: attach the image in order for this command to work",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Embed",
    permlvl: 4,
    premiumLvl: 0,
    enabled: true,
    contributors: ["Zach S."]
}

const usageEmbedImageAdmin = {
    name: "embed",
    cmdName: "embedimageadmin",
    aliases: ["embedimageadmin"],
    args: {min: 1, max: 1000},
    description: "Send an image from the bot with no trace",
    exampleUsage: "embedimageadmin https://goo.gl/675fbm\nembedimage <attach_image>\n**Note**: attach the image in order for this command to work",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Embed",
    permlvl: 5,
    premiumLvl: 0,
    enabled: true,
    contributors: ["Zach S."]
}

this.setupCommands = function(file) {
    this.file = file;
    return new Promise((resolve, reject) => {
        return resolve({file: this.file, moduleInfo: moduleInfo, commands: this.commands});
    });
}

embedCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let embed;
        try {
            embed = JSON.parse(args.join(''));
        } catch(e) {
            BotSettings.assist.error("**" + e.message + "**", message.channel);
            return resolve({response: "", silent: true});
        }
        return resolve({response: "", embed: embed, silent: false});
    });
}

embedSay = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let color = BotSettings.assist.RandomHex();
        let embed = new Discord.MessageEmbed();
        if(message.author.displayAvatarURL) {
            embed.setAuthor(message.author.username, message.author.displayAvatarURL, message.author.displayAvatarURL);
        } else {
            embed.setAuthor(message.author.username);
        }
        let channel = "", tagRole = "";
        if(message.mentions.everyone === true) {
            tagRole = message.guild.defaultRole;
        } else {
            if(message.mentions.roles.size === 1 || message.mentions.users.size === 1) {
                if(message.mentions.roles.size === 1) {
                    tagRole = message.mentions.roles.first();
                    if(tagRole.id === message.guild.defaultRole.id) {
                        tagRole = message.guild.defaultRole;
                    }
                } else if(message.mentions.users.size === 1) {
                    tagRole = message.mentions.users.first();
                }
                args.shift();
            }
        }
        if(tagRole === message.guild.defaultRole) {
            args.shift();
        }
        embed.setColor(color);
        embed.setDescription(args.join(" "));
        return resolve({response: tagRole, embed: embed, silent: false});
    });
}

embedSayTo = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let color = BotSettings.assist.RandomHex();
        let embed = new Discord.MessageEmbed();
        if(message.author.displayAvatarURL) {
            embed.setAuthor(message.author.username, message.author.displayAvatarURL, message.author.displayAvatarURL);
        } else {
            embed.setAuthor(message.author.username);
        }
        embed.setDescription(args.join(" "));
        embed.setColor(color);
        let channel = "", tagRole = "";
        if(message.mentions.everyone === true) {
            tagRole = message.guild.defaultRole;
        } else {
            if(message.mentions.roles.size === 1 || message.mentions.users.size === 1) {
                if(message.mentions.roles.size === 1) {
                    tagRole = message.mentions.roles.first();
                    if(tagRole.id === message.guild.defaultRole.id) {
                        tagRole = message.guild.defaultRole;
                    }
                } else if(message.mentions.users.size === 1) {
                    tagRole = message.mentions.users.first();
                }
                args.shift();
            }
        }
        if(message.mentions.channels.size === 1) {
            channel = message.mentions.channels.first();
            args.shift();
        } else {
            channel = message.channel;
        }
        if(tagRole === message.guild.defaultRole) {
            args.shift();
        }
        if(channel.id === message.channel.id) {
            //didn't find a channel mention
            return resolve({response: tagRole, embed: embed, silent: false});
        } else {
            channel.send(tagRole, {embed: embed}).then(() => {
                Logger.sendLog("-> Message was sent from embedSayTo", "INFO", __filename);
                return resolve({response: "", silent: true});
            }).catch(err => {
                BotSettings.assist.error("Unable to send message for some reason: " + err.message, message.channel);
                Logger.sendLog('-> Unable to send message to ' + channel.id + " that the message was send from guild " + message.guild.id + " with error: " + err.message, "CRITICAL", __filename);
                return resolve({response: "", silent: true});
            });
        }
    });
}

embedSayAdmin = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        message.delete().then(() => {
            let color = BotSettings.assist.RandomHex();
            let embed = new Discord.MessageEmbed();
            embed.setDescription(args.join(" "));
            embed.setColor(color);
            let channel = "", tagRole = "";
            if(message.mentions.everyone === true) {
                tagRole = message.guild.defaultRole;
            } else {
                if(message.mentions.roles.size === 1 || message.mentions.users.size === 1) {
                    if(message.mentions.roles.size === 1) {
                        tagRole = message.mentions.roles.first();
                        if(tagRole.id === message.guild.defaultRole.id) {
                            tagRole = message.guild.defaultRole;
                        }
                    } else if(message.mentions.users.size === 1) {
                        tagRole = message.mentions.users.first();
                    }
                    args.shift();
                }
            }
            if(tagRole === message.guild.defaultRole) {
                args.shift();
            }
            message.channel.send(tagRole, {embed: embed}).then((m) => {
                return resolve({response: "", silent: true});
            }).catch(err2 => {
                Logger.sendLog("-> Unable to delete the message for some reason.  " + err2.message, "CRITICAL", __filename);
                return resolve({response: "", silent: true});
            })
        }).catch(err => {
            Logger.sendLog("-> Unable to delete the message for some reason.  " + err.message, "CRITICAL", __filename);
            BotSettings.assist.error("I do not have the 'Manage Messages' permission.  Please set appropriately.  ", message.channel);
            return resolve({response: "", silent: true});
        })
    });
}

embedColorTo = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let colorOpt = args.shift();
        let colorVal = BotSettings.resolve.Color(colorOpt, "hex");
        let color = "";
        if(colorVal !== false) {
            color = colorVal;
        } else {
            color = BotSettings.assist.RandomHex();
        }
        let embed = new Discord.MessageEmbed();
        if(message.author.displayAvatarURL) {
            embed.setAuthor(message.author.username, message.author.displayAvatarURL, message.author.displayAvatarURL);
        } else {
            embed.setAuthor(message.author.username);
        }
        let channel = "", tagRole = "";
        if(message.mentions.everyone === true) {
            tagRole = message.guild.defaultRole;
        } else {
            if(message.mentions.roles.size === 1 || message.mentions.users.size === 1) {
                if(message.mentions.roles.size === 1) {
                    tagRole = message.mentions.roles.first();
                    if(tagRole.id === message.guild.defaultRole.id) {
                        tagRole = message.guild.defaultRole;
                    }
                } else if(message.mentions.users.size === 1) {
                    tagRole = message.mentions.users.first();
                }
                args.shift();
            }
        }
        if(message.mentions.channels.size === 1) {
            channel = message.mentions.channels.first();
            args.shift();
        } else if(message.mentions.users.size === 1) {
            channel = message.mentions.users.first();
            args.shift();
        } else {
            channel = message.channel;
        }
        if(tagRole === message.guild.defaultRole) {
            args.shift();
        }

        embed.setDescription(args.join(" "));
        embed.setColor(color);

        if(channel.id === message.channel.id) {
            //didn't find a channel mention
            return resolve({response: tagRole, embed: embed, silent: false});
        } else {
            channel.send(tagRole, {embed: embed}).then(() => {
                Logger.sendLog("-> Message was sent from embedColorTo", "INFO", __filename);
                return resolve({response: "", silent: true});
            }).catch(err => {
                BotSettings.assist.error("Unable to send message for some reason: " + err.message, message.channel);
                Logger.sendLog('-> Unable to send message to ' + channel.id + " that the message was send from guild " + message.guild.id + " with error: " + err.message, "CRITICAL", __filename);
                return resolve({response: "", silent: true});
            });
        }
    });
}

embedColor = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let colorOpt = args.shift();
        let colorVal = BotSettings.resolve.Color(colorOpt, "hex");
        let color = "";
        if(colorVal !== false) {
            color = colorVal;
        } else {
            color = BotSettings.assist.RandomHex();
        }
        let embed = new Discord.MessageEmbed();
        if(message.author.displayAvatarURL) {
            embed.setAuthor(message.author.username, message.author.displayAvatarURL, message.author.displayAvatarURL);
        } else {
            embed.setAuthor(message.author.username);
        }
        embed.setDescription(args.join(" "));
        embed.setColor(color);
        let channel = "", tagRole = "";
        if(message.mentions.everyone === true) {
            tagRole = message.guild.defaultRole;
        } else {
            if(message.mentions.roles.size === 1 || message.mentions.users.size === 1) {
                if(message.mentions.roles.size === 1) {
                    tagRole = message.mentions.roles.first();
                    if(tagRole.id === message.guild.defaultRole.id) {
                        tagRole = message.guild.defaultRole;
                    }
                } else if(message.mentions.users.size === 1) {
                    tagRole = message.mentions.users.first();
                }
                args.shift();
            }
        }
        if(message.mentions.channels.size === 1) {
            channel = message.mentions.channels.first();
            args.shift();
        } else {
            channel = message.channel;
        }
        if(tagRole === message.guild.defaultRole) {
            args.shift();
        }
        if(channel.id === message.channel.id) {
            //didn't find a channel mention - - embed it to the channel
            return resolve({response: tagRole, embed: embed, silent: false});
        } else {
            channel.send(tagRole, {embed: embed}).then(() => {
                Logger.sendLog("-> Message was sent from embedColor", "INFO", __filename);
                return resolve({response: "", silent: true});
            }).catch(err => {
                BotSettings.assist.error("Unable to send message for some reason: " + err.message, message.channel);
                Logger.sendLog('-> Unable to send message to ' + channel.id + " that the message was send from guild " + message.guild.id + " with error: " + err.message, "CRITICAL", __filename);
                return resolve({response: "", silent: true});
            });
        }
    });
}

embedColorAdmin = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let colorOpt = args.shift();
        let colorVal = BotSettings.resolve.Color(colorOpt, "hex");
        let color = "";
        if(colorVal !== false) {
            color = colorVal;
        } else {
            color = BotSettings.assist.RandomHex();
        }
        message.delete().then((m) => {
            let embed = new Discord.MessageEmbed();
            console.log(args.join(" "));
            let channel = "", tagRole = "";
            if(message.mentions.everyone === true) {
                tagRole = message.guild.defaultRole;
            } else {
                if(message.mentions.roles.size === 1 || message.mentions.users.size === 1) {
                    if(message.mentions.roles.size === 1) {
                        tagRole = message.mentions.roles.first();
                        if(tagRole.id === message.guild.defaultRole.id) {
                            tagRole = message.guild.defaultRole;
                        }
                    } else if(message.mentions.users.size === 1) {
                        tagRole = message.mentions.users.first();
                    }
                    args.shift();
                }
            }
            if(message.mentions.channels.size === 1) {
                channel = message.mentions.channels.first();
                args.shift();
            } else {
                channel = message.channel;
            }
            if(tagRole === message.guild.defaultRole) {
                args.shift();
            }
            embed.setDescription(args.join(" "));
            embed.setColor(color);

            message.channel.send(tagRole, {embed: embed}).then(() => {
                Logger.sendLog("-> Message was sent from embedColorAdmin", "INFO", __filename);
                return resolve({response: "", silent: true});
            }).catch(err => {
                BotSettings.assist.error("Unable to send message for some reason: " + err.message, message.channel);
                Logger.sendLog('-> Unable to send message to ' + channel.id + " that the message was send from guild " + message.guild.id + " with error: " + err.message, "CRITICAL", __filename);
                return resolve({response: "", silent: true});
            });
        }).catch(err => {
            Logger.sendLog("-> Unable to delete the message for some reason.  " + err.message, "CRITICAL", __filename);
            BotSettings.assist.error("I do not have the 'Manage Messages' permission.  Please set appropriately.  ", message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

embedUrl = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let color = BotSettings.assist.RandomHex();
        let url = args.shift();

        let validator = require("validator");
        if(validator.isURL(url)) {
            let embed = new Discord.MessageEmbed();
            embed.setURL(url);
            embed.setDescription(args.join(" "));
            embed.setColor(color);
            if(message.author.displayAvatarURL) {
                embed.setAuthor(message.author.username, message.author.displayAvatarURL, message.author.displayAvatarURL);
            } else {
                embed.setAuthor(message.author.username);
            }
            let channel = "", tagRole = "";
            if(message.mentions.everyone === true) {
                tagRole = message.guild.defaultRole;
            } else {
                if(message.mentions.roles.size === 1 || message.mentions.users.size === 1) {
                    if(message.mentions.roles.size === 1) {
                        tagRole = message.mentions.roles.first();
                        if(tagRole.id === message.guild.defaultRole.id) {
                            tagRole = message.guild.defaultRole;
                        }
                    } else if(message.mentions.users.size === 1) {
                        tagRole = message.mentions.users.first();
                    }
                    args.shift();
                }
            }
            if(tagRole === message.guild.defaultRole) {
                args.shift();
            }
            return resolve({response: tagRole, embed: embed, silent: false});
        } else {
            BotSettings.assist.error("The URL is not a valid url.", message.channel);
            return resolve({response: "", silent: true});
        }
    });
}

embedUrlAdmin = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let color = BotSettings.assist.RandomHex();
        let url = args.shift();

        message.delete(() => {
            let validator = require("validator");
            if(validator.isURL(url)) {
                let embed = new Discord.MessageEmbed();
                embed.setURL(url);
                embed.setDescription(args.join(" "));
                embed.setColor(color);
                let channel = "", tagRole = "";
                if(message.mentions.everyone === true) {
                    tagRole = message.guild.defaultRole;
                } else {
                    if(message.mentions.roles.size === 1 || message.mentions.users.size === 1) {
                        if(message.mentions.roles.size === 1) {
                            tagRole = message.mentions.roles.first();
                            if(tagRole.id === message.guild.defaultRole.id) {
                                tagRole = message.guild.defaultRole;
                            }
                        } else if(message.mentions.users.size === 1) {
                            tagRole = message.mentions.users.first();
                        }
                        args.shift();
                    }
                }
                if(tagRole === message.guild.defaultRole) {
                    args.shift();
                }
                return resolve({response: tagRole, embed: embed, silent: false});
            } else {
                BotSettings.assist.error("The URL is not a valid url.", message.channel);
                return resolve({response: "", silent: true});
            }
        }).catch(err => {
            Logger.sendLog("-> Unable to delete the message for some reason.  " + err.message, "CRITICAL", __filename);
            BotSettings.assist.error("I do not have the 'Manage Messages' permission.  Please set appropriately.  ", message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

embedImage = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let color = BotSettings.assist.RandomHex();
        let image = args.shift();
        let embed = new Discord.MessageEmbed();
        embed.setColor(color);
        if(image.toLowerCase().endsWith(".gifv") || image.toLowerCase().endsWith(".gif") || image.toLowerCase().endsWith(".png") || image.toLowerCase().endsWith(".jpeg") || image.toLowerCase().endsWith(".jpg")) {
            let validator = require("validator");
            if(validator.isURL(image)) {
                embed.setImage(image);
            } else {
                BotSettings.assist.error("The URL is not a valid url.", message.channel);
                return resolve({response: "", silent: true});
            }
        } else {
            BotSettings.assist.error("The URL is not a valid url.", message.channel);
            return resolve({response: "", silent: true});
        }
        if(message.author.displayAvatarURL) {
            embed.setAuthor(message.author.username, message.author.displayAvatarURL, message.author.displayAvatarURL);
        } else {
            embed.setAuthor(message.author.username);
        }
        embed.setColor(color);
        let channel = "", tagRole = "";
        if(message.mentions.everyone === true) {
            tagRole = message.guild.defaultRole;
        } else {
            if(message.mentions.roles.size === 1 || message.mentions.users.size === 1) {
                if(message.mentions.roles.size === 1) {
                    tagRole = message.mentions.roles.first();
                    if(tagRole.id === message.guild.defaultRole.id) {
                        tagRole = message.guild.defaultRole;
                    }
                } else if(message.mentions.users.size === 1) {
                    tagRole = message.mentions.users.first();
                }
                args.shift();
            }
        }
        if(tagRole === message.guild.defaultRole) {
            args.shift();
        }
        return resolve({response: tagRole, embed: embed, silent: false});
    });
}

embedImageAdmin = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        message.delete().then(() => {
            let color = BotSettings.assist.RandomHex();
            let image = args.shift();
            let embed = new Discord.MessageEmbed();
            embed.setColor(color);
            if(image.toLowerCase().endsWith(".gifv") || image.toLowerCase().endsWith(".gif") || image.toLowerCase().endsWith(".png") || image.toLowerCase().endsWith(".jpeg") || image.toLowerCase().endsWith(".jpg")) {
                let validator = require("validator");
                if(validator.isURL(image)) {
                    let http = require("http");
                    let imageType = require("image-type");
                    http.get(image, res => {
                        res.once("data", chunk => {
                            res.destory();
                            let imageData = imageType(chunk);
                            if(imageData.hasOwnProperty("ext") && (
                                imageData.ext.toLowerCase() === "gifv" ||
                                imageData.ext.toLowerCase() === "gif" ||
                                imageData.ext.toLowerCase() === "png" ||
                                imageData.ext.toLowerCase() === "jpeg" ||
                                imageData.ext.toLowerCase() === "png")
                            ) {
                                embed.setImage(image);
                                embed.setColor(color);
                                let channel = "", tagRole = "";
                                if(message.mentions.everyone === true) {
                                    tagRole = message.guild.defaultRole;
                                } else {
                                    if(message.mentions.roles.size === 1 || message.mentions.users.size === 1) {
                                        if(message.mentions.roles.size === 1) {
                                            tagRole = message.mentions.roles.first();
                                            if(tagRole.id === message.guild.defaultRole.id) {
                                                tagRole = message.guild.defaultRole;
                                            }
                                        } else if(message.mentions.users.size === 1) {
                                            tagRole = message.mentions.users.first();
                                        }
                                        args.shift();
                                    }
                                }
                                if(tagRole === message.guild.defaultRole) {
                                    args.shift();
                                }
                                return resolve({response: tagRole, embed: embed, silent: false});
                            } else {
                                BotSettings.assist.error("The URL is not a valid url.", message.channel);
                                return resolve({response: "", silent: true});
                            }
                        });
                    });
                } else {
                    BotSettings.assist.error("The URL is not a valid url.", message.channel);
                    return resolve({response: "", silent: true});
                }
            } else {
                BotSettings.assist.error("The URL is not a valid url.", message.channel);
                return resolve({response: "", silent: true});
            }
        }).catch(err => {
            Logger.sendLog("-> Unable to delete the message for some reason.  " + err.message, "CRITICAL", __filename);
            BotSettings.assist.error("There was an error that returned for some reason.  " + err, message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: embedCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageEmbedSay.aliases, args: usageEmbedSay.args, usage: usageEmbedSay, run: embedSay},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageEmbedSayTo.aliases, args: usageEmbedSayTo.args, usage: usageEmbedSayTo, run: embedSayTo},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageEmbedSayAdmin.aliases, args: usageEmbedSayAdmin.args, usage: usageEmbedSayAdmin, run: embedSayAdmin},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageEmbedColorTo.aliases, args: usageEmbedColorTo.args, usage: usageEmbedColorTo, run: embedColorTo},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageEmbedColor.aliases, args: usageEmbedColor.args, usage: usageEmbedColor, run: embedColor},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageEmbedColorAdmin.aliases, args: usageEmbedColorAdmin.args, usage: usageEmbedColorAdmin, run: embedColorAdmin},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageEmbedUrl.aliases, args: usageEmbedUrl.args, usage: usageEmbedUrl, run: embedUrl},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageEmbedUrlAdmin.aliases, args: usageEmbedUrlAdmin.args, usage: usageEmbedUrlAdmin, run: embedUrlAdmin},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageEmbedImage.aliases, args: usageEmbedImage.args, usage: usageEmbedImage, run: embedImage},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageEmbedImageAdmin.aliases, args: usageEmbedImageAdmin.args, usage: usageEmbedImageAdmin, run: embedImageAdmin}
];
