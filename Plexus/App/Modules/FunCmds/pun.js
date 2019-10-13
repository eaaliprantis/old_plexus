const moduleInfo = {
    name: "pun",
    truename: "pun",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "pun",
    cmdName: "pun",
    aliases: ["pun", "potd"],
    args: {min: 0, max: 0},
    description: "Get a pun of the day quote",
    exampleUsage: "pun",
    usage: "[command]",
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

punCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let Entities = require("html-entities").AllHtmlEntities;
        let entities = new Entities();
        let request = require("request");
        request("http://www.punoftheday.com/cgi-bin/arandompun.pl", (err, res, body) => {
            if(err) {
                BotSettings.assist.error("Service is possibly Offline.  Please try again.", message.channel);
                return resolve({response: "", silent: true});
            }
            body = entities.decode(body);
            body = body.slice(16);
            body = body.slice(0, body.indexOf("'"));
            body = body.slice(0, body.length - 6);
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Pun");
            embed.setDescription(body);
            embed.setColor("RANDOM");
            return resolve({response: "", embed: embed, silent: false});
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: punCmd}
];
