const moduleInfo = {
    name: "osu",
    truename: "osu",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "osu",
    cmdName: "osu",
    aliases: ["osu"],
    args: {min: 1, max: 1},
    description: "OSU lookup",
    usage: "[command]",
    exampleUsage: "osu",
    runIn: ["dm", "text"],
    categories: "Game Lookup",
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

blockText = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        return resolve({response: "WIP", silent: true});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: blockText}
];
