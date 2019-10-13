const moduleInfo = {
    name: "pin",
    truename: "pin",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usagePin = {
    name: "pin",
    cmdName: "pin",
    aliases: ["pin", "pinmsg", "msgpin"],
    args: {min: 1, max: 1},
    description: "Pin a message.",
    exampleUsage: "pin <msgID>\npin 123456",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Util",
    permlvl: 2,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageUnPin = {
    name: "unpin",
    cmdName: "unpin",
    aliases: ["unpin", "unpinmsg", "msgunpin"],
    args: {min: 1, max: 1},
    description: "Unpin a message",
    exampleUsage: "unpin <msgID>\nunpin 123456",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Util",
    permlvl: 2,
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

pinMsg = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        message.channel.fetchMessage(args[0]).then(msg => {
            msg.pin();
            return resolve({response: "Message pinned!", silent: false});
        }).catch(err => {
            return resolve({response: "Not a valid message id to pin.", silent: false});
        })
    });
}

unpinMsg = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        message.channel.fetchMessage(args[0]).then(msg => {
            msg.unpin();
            return resolve({response: "Message was successfully unpinned!", silent: false});
        }).catch(err => {
            return resolve({response: "Not a valid message id to unpin", silent: false});
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usagePin.aliases, args: usagePin.args, usage: usagePin, run: pinMsg},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageUnPin.aliases, args: usageUnPin.args, usage: usageUnPin, run: unpinMsg}
];
