const moduleInfo = {
    name: "Slap",
    truename: "slap",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "slap",
    cmdName: "slap",
    aliases: ["slap"],
    args: {min: 1, max: 1},
    description: "Slap someone.",
    exampleUsage: "slap @eaaliprantis#2160",
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

slap = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let mention = message.mentions.users.first();
        var randomItem = require('random-item');
        let randomSlapString = randomItem(["Sword", "Training Stick", "Beginner's Blade", "Novice's Bow", "Staff", "Dagger", "Club", "Wolf's Fangs", "Vampire Bat's Fangs", "Essence", "Claws", "Hexed Bow", "Fist"]);
        if(mention !== null) {
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Slap O' Matic");
            embed.setDescription("<@" + message.author.id + "> has slapped " + mention + " with a **" + randomSlapString + "**");
            return resolve({response: message.author, embed: embed, silent: false});
        } else {
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Slap O' Matic - Error");
            embed.setDescription("<@" + message.author.id + "> was slapped with a **" + randomSlapString + "**");
            return resolve({response: message.author, embed: embed, silent: false});
        }
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: slap}
];
