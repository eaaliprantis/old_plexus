const moduleInfo = {
    name: "robohash",
    truename: "robohash",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "robohash",
    cmdName: "robohash",
    aliases: ["robohash", "roboimg"],
    args: {min: 0, max: 1},
    description: "Gets a robo hash image",
    exampleUsage: "robohash\nrobohash 15",
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

roboCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let suffix = (args.length >= 1) ? args.join("") : message.author.id;
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Robohash");
        embed.setImage(`https://robohash.org/${suffix}.png`);
        embed.setColor("RANDOM");
        return resolve({response: "", embed: embed, silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: roboCmd}
];
