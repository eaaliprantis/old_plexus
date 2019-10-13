const moduleInfo = {
    name: "emoji",
    truename: "emoji",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "emoji",
    cmdName: "emoji",
    aliases: ["emoji", "emoj"],
    args: {min: 1, max: 100},
    description: "Turns your text into emoji expression",
    exampleUsage: "emoji I love cake",
    example: "This is awesome",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Fun",
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

emojiCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let emojApp = require("emoj");
        let argJoin = args.join(" ");
        emojApp(argJoin).then(input => {
            let embed = new Discord.MessageEmbed();
            embed.setDescription(input.join(" "));
            embed.setColor("RANDOM");
            embed.addField("Response", input);
            return resolve({response: "", embed: embed, silent: false});
        }).catch(errInput => {
            Logger.sendLog("-> Emoj returned an error for some reason.  " + errInput, "CRITICAL", __filename);
            BotSettings.assist.error("This has returned an error for some reason.  Please try again shortly.", message.channel);
            return resolve({response: "", silent: true});
        })
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: emojiCmd}
];
