const moduleInfo = {
    name: "serverinfo",
    truename: "serverinfo",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "serverinfo",
    cmdName: "serverinfo",
    aliases: ["serverinfo", "serverspecs", "guildspecs", "guild"],
    args: {min: 0, max: 0},
    description: "Displays information about the discord server",
    exampleUsage: "serverinfo",
    usage: "[command]",
    runIn: ["text"],
    categories: "General",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageEmotes = {
    name: "emotes",
    cmdName: "emotes",
    aliases: ["serveremotes", "emotes", "guildemotes"],
    args: {min: 0, max: 0},
    description: "Displays information about the emotes for this discord server",
    exampleUsage: "serveremotes",
    usage: "[command]",
    runIn: ["text"],
    categories: "General",
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

getTimezone = (user) => {
    return new Promise((resolve, reject) => {
        Database.callStatement("SELECT * FROM TimezoneT WHERE platform='discord' AND userid='" + user + "'").then((rows) => {
            if(rows.length === 1) {
                let rowData = rows[0];
                return resolve({response: {vaild: true, data: rowData}, error: false, valid: true});
            } else {
                return resolve({response: "User not set", error: false, valid: false});
            }
        }).catch(err => {
            return resolve({response: err.message, error: true, valid: false});
        });
    });
}

server = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        if(message.guild.available) {
            let moment = require("moment");
            let embed = new Discord.MessageEmbed();
            getTimezone(message.author.id).then(response => {
                BotSettings.assist.isGuildPremium(message).then(premLevel => {
                    console.log("premLevel\n");
                    console.log(premLevel.premium);
                    let stats = BotSettings.assist.serverSpecs(message.guild);
                    let mytimezone = "";
                    let createdTZ = "";
                    if(response.valid === true) {
                        console.log("Response Data: \n");
                        console.log(response.response.data);
                        let timeResp = response.response.data.orgTime;
                        let timeOffset = BotSettings.assist.convertTimeZone(timeResp);
                        let currentTime = BotSettings.assist.getRegion(message.guild.region, "format");
                        mytimezone = moment.utc(currentTime).add(timeOffset, "minutes").format("MMMM Do YYYY, h:mm:ss a");
                        createdTZ = BotSettings.assist.getTime(parseFloat(moment.utc(message.guild.createdAt).add(timeOffset, "minutes").format("x")), true);
                    } else {
                        mytimezone = "**User timezone not set**";
                        createdTZ = BotSettings.assist.getTime(parseFloat(moment.utc(message.guild.createdAt).format("x")), true);
                    }

                    embed.setColor(0x2885bd);
                    embed.setTitle(message.guild.name + " - " + message.guild.id);
                    console.log(message.guild.iconURL())
                    embed.setImage(message.guild.iconURL);
                    if(message.guild.emojis.size >= 1) {
                        embed.setDescription("**Emojis**\n" + message.guild.emojis.map(emoji => {return `<:${emoji.name}:${emoji.id}>`}).join(""));
                    }
                    embed.addField("Members", `• ${stats.member.memberCount} users\n• ${stats.member.botCount} bots\n• ${stats.member.total} total members\n• Owner: ${message.guild.owner.nickname || message.guild.owner.user.username + "#" + message.guild.owner.user.discriminator}`, true);
                    embed.addField('Channels', `• ${stats.channels.text} text channels\n• ${stats.channels.voice} voice channels\n• ${stats.channels.total} total channels`, true)
                    embed.addField("Roles", `${message.guild.roles.array().sort((a, b) => {
                        if(a.position > b.position) return -1;
                        if(a.position < b.position) return 1;
                        return 0;
                    }).slice(0, 5).join("\n•")}`, true);
                    embed.addField("Created", createdTZ, true);
                    if(parseInt(premLevel.premium) === BotSettings.premium.max) {
                        embed.addField("Premium Level", "Max Tier - - " + premLevel.premium, true)
                    } else {
                        embed.addField("Premium Level", "Tier " + premLevel.premium, true);
                    }
                    embed.addField('Miscellaneous', `\nExplicit Content Filter: ${message.guild.explicitContentFilter}\n• Verification Level: ${message.guild.verificationLevel}\n• Roles: ${message.guild.roles.size}\n• Custom Emoji: ${message.guild.emojis.size}\n• Region: ${message.guild.region}\n• Region Timezone: ${BotSettings.assist.getRegion(message.guild.region, "default")}\n• Your timezone: ${mytimezone}\n\u200b`);
                    return resolve({response: "", embed: embed, silent: false});
                }).catch(errLvl => {
                    Logger.sendLog("-> Error when retrieving premium level.... " + errLvl, "CRITICAL", __filename);
                    BotSettings.assist.error("There was an error when retrieving the permission level of the server....", message.channel);
                    return resolve({response: "", silent: true});
                });
            }).catch(err => {
                Logger.sendLog("-> Error.... " + err.message, "CRITICAL", __filename);
                BotSettings.assist.error("There was an error when retrieving the timezone for some reason..... " + err.message, message.channel);
                return resolve({response: "", silent: true});
            });
        } else {
            return resolve({response: "Possible server outage", silent: false});
        }
    });
}

emoteCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        console.log(message.guild.emojis);
        if(message.guild.emojis.size > 0) {
            let embed = new Discord.MessageEmbed();
            embed.setTitle(message.guild.emojis.size + " custom emote" + (message.guild.emojis.size === 1 ? "" : "s"));
            embed.setColor("RANDOM");
            embed.setAuthor(bot.user.username, bot.user.avatarURL);
            embed.setDescription(message.guild.emojis.map(emoji => {
                console.log(emoji);
                return `<:${emoji.name}:${emoji.id}>: ${emoji.name}`;
            }).join("\n"));
            return resolve({response: "", embed: embed, silent: false});
        } else {
            return resolve({response: "There are no custom emotes on this server.", silent: false});
        }
    })
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: server},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageEmotes.aliases, args: usageEmotes.args, usage: usageEmotes, run: emoteCmd}
];
