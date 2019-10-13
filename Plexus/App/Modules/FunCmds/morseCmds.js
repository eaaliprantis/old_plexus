const moduleInfo = {
    name: "morse",
    truename: "morse",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usageMorseEncode = {
    name: "morse",
    cmdName: "morse",
    aliases: ["morse"],
    args: {min: 1, max: 50},
    description: "Translate a message in Morse Code",
    usage: "[command]",
    exampleUsage: "morse my morse message",
    runIn: ["dm", "text"],
    categories: "Fun",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageMorseDecode = {
    name: "unmorse",
    cmdName: "unmorse",
    aliases: ["unmorse"],
    args: {min: 1, max: 50},
    description: "Decode a Morse Code message",
    usage: "[command]",
    exampleUsage: "unmorse .... .. ....",
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

let morse = require("morse");

morseEncodeCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        return resolve({response: morse.encode(args), silent: false});
    });
}

morseDecodeCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        return resolve({response: morse.decode(args), silent: false});
    })
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageMorseEncode.aliases, args: usageMorseEncode.args, usage: usageMorseEncode, run: morseEncodeCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageMorseDecode.aliases, args: usageMorseDecode.args, usage: usageMorseDecode, run: morseDecodeCmd}
];
