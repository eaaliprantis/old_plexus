const moduleInfo = {
    name: "speedtest",
    truename: "speedtest",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "speedtest",
    cmdName: "speedtest",
    aliases: ["speedtest", "testconnection"],
    args: {min: 0, max: 0},
    description: "Tests the bot's connection using speedtest.net",
    usage: "[command]",
    exampleUsage: "speedtest",
    runIn: ["text"],
    categories: "Owner",
    permlvl: 7,
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

speedTestCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let speedTest = require("speedtest-net");
        message.channel.send(message.author + ", please wait while we get your the speed test result....").then((m) => {
            let test = speedTest({maxTime: 5000});
            test.on('data', resultData => {
                let embed = new Discord.MessageEmbed();
                embed.setColor("RANDOM");
                embed.setTitle("**__Speedtest Results__**")
                embed.setDescription("• **Ping**: " + resultData.server.ping + " ms\n• **Download**: " + resultData.speeds.download + " Mb/s\n• **Upload**: " + resultData.speeds.upload + " Mb/s");
                embed.setThumbnail(message.author.avatarURL);
                m.edit(message.author, {embed: embed}).then((m2) => {
                    return resolve({response: "", silent: true});
                }).catch(errM2 => {
                    Logger.sendLog("-> Error when trying to send the message.... " + errM2, message.channel);
                    return resolve({response: "", silent: true});
                });
            });
            test.on('error', err => {
                BotSettings.assist.error("There was an error with the data.... " + err.message, message.channel);
                return resolve({response: "", silent: true});
            });
        }).catch(errM => {
            Logger.sendLog("-> Error when trying to send the message.... " + errM, message.channel);
            return resolve({response: "", silent: true});
        })
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: speedTestCmd}
];
