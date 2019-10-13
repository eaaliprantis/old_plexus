const moduleInfo = {
    name: "prefix",
    truename: "prefix",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const getPrefixUsage = {
    name: "prefix",
    cmdName: "prefix",
    aliases: ["prefix", "myprefix", "serverprefix", "getprefix"],
    args: {min: 0, max: 0},
    description: "Gets the server prefix",
    exampleUsage: "prefix",
    usage: "[command]",
    runIn: ["text"],
    categories: "General",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const setPrefixUsage = {
    name: "prefix",
    cmdName: "prefix",
    aliases: ["setprefix"],
    args: {min: 1, max: 1},
    description: "Set the server prefix",
    exampleUsage: "setprefix !!",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Admin",
    permlvl: 5,
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

getPrefix = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        BotSettings.assist.getGuildPrefix(message).then((response) => {
            if(response.valid === true) {
                return resolve({response: response.response, silent: false});
            } else {
                return resolve({response: "Something went wrong.  Default prefix is: " + BotSettings.config.prefix, silent: false});
            }
        }).catch(err => {
            console.log(err.message);
            return resolve({response: "Something went wrong.", silent: false});
        });
    });
}

setPrefix = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        BotSettings.assist.setGuildPrefix(message, args).then((response) => {
            if(response.valid === true) {
                return resolve({response: response.response, silent: false});
            } else {
                return resolve({response: "Something went wrong.  Default prefix is: " + BotSettings.config.prefix, silent: false});
            }
        }).catch(err => {
            console.log(err.message);
            return resolve({response: "Something went wrong.  Default prefix is: " + BotSettings.config.prefix, silent: false});
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: getPrefixUsage.aliases, args: getPrefixUsage.args, usage: getPrefixUsage, run: getPrefix},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: setPrefixUsage.aliases, args: setPrefixUsage.args, usage: setPrefixUsage, run: setPrefix}
];
