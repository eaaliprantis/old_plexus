const moduleInfo = {
    name: "discrim",
    truename: "discrim",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "discrim",
    cmdName: "discrim",
    aliases: ["discrim", "discriminator", "finddiscrim"],
    args: {min: 1, max: 1},
    description: "Gathers a list of users with a certain discrim",
    exampleUsage: "discrim 0001",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Util",
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

discrim = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let argSize = args.join("").length;
        let disc = args.join("");
        if(argSize === 4 && BotSettings.assist.validateNumber(disc) === true) {
            let discrimArr = [];
            BotSettings.assist.getDiscrims(disc).then(ret => {
                console.log(ret);

                let counter = 0, textsize = 0;
                let embed = new Discord.MessageEmbed();
                embed.setColor('RANDOM');
                embed.setDescription("Getting users with discrimiators");
                ret.forEach((user) => {
                    if(textsize > BotSettings.discordServers.limits.field.value) {
                        counter++;
                        embed.addField("Discrim List " + counter, discrimArr.join("\n"), true);
                        discrimArr = [];
                    } else {
                        if(textsize + (user.length) > BotSettings.discordServers.limits.field.value) {
                            counter++;
                            embed.addField("Discrim List " + counter, discrimArr.join("\n"), true);
                            discrimArr = [];
                        } else {
                            discrimArr.push(`${user}`);
                            textsize += (user.length);
                        }
                    }
                });
                if(discrimArr.length >= 1) {
                    embed.addField("Discrim List ", discrimArr.join("\n"));
                }
                return resolve({response: "", embed: embed, silent: false});
            }).catch(errJson => {
                Logger.sendLog("There was an error with the broadcast Eval for some reason.... " + errJson, "CRITICAL", __filename);
                BotSettings.assist.error("There was an error retrieving the discrims for some reason.", message.channel, message.author);
            });
        } else {
            return resolve({response: "That discrim is either too long or too short!  Must be 4 numbers long", silent: false});
        }
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: discrim}
];
