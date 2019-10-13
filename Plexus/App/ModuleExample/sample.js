const moduleInfo = {
    name: "blockit",
    truename: "blockit",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "test",
    cmdName: "test",
    aliases: ["test"],
    args: {min: 0, max: 0},
    description: "Test",
    usage: "[command]",
    exampleUsage: "test",
    runIn: ["dm", "text"],
    categories: "Test",
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
        return resolve({response: "Testing", silent: true});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: blockText}
];
