const moduleInfo = {
    name: "8ball",
    truename: "8ball",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "8ball",
    cmdName: "8ball",
    aliases: ["8ball", "eightball"],
    args: {min: 0, max: 50},
    description: "Answers any yes/no question that you give it",
    exampleUsage: "8ball Will Plexus be popular",
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

getAnswer = () => {
    let predict = require("eightball");
    return predict();
}

eightcmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let embed = new Discord.MessageEmbed();
        embed.setColor(0x2885bd);
        embed.setThumbnail("https://lh3.googleusercontent.com/OuxBrfRiW3RGlmNUmFlphX-hIx2wyiaGPQ9LS-pDdDmaBpUZLKLRS29nGuT6zX081Ow=w300");
        embed.addField("Question", args.join(" "));
        embed.addField("Answer", getAnswer());
        return resolve({response: "", embed: embed, silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: eightcmd}
];
