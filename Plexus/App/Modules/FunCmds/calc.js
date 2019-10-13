const moduleInfo = {
    name: "math",
    truename: "math",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "math",
    cmdName: "math",
    aliases: ["calc", "math"],
    args: {min: 1, max: 50},
    description: "Math calculations",
    exampleUsage: "math 2+4",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Resources",
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

getMathAnswer = (args) => {
    let mathjs = require("mathjs");
    if(args.length >= 1) {
        try {
            return [true, mathjs.eval(args.join(" "))];
        } catch(err) {
            return [false, "Something went wrong with the calculation.  Error: \`\`\`" + err + "\`\`\`"];
        }
    } else {
        return [false, "I need something to calculate."];
    }
}

mathCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let embed = new Discord.MessageEmbed();
        let mathAnswer = getMathAnswer(args);
        embed.setColor((mathAnswer[0] === true) ? 0x00FF00 : 0xFF0000);
        embed.addField("Question", args.join(" "));
        embed.addField("Result", mathAnswer[1]);
        return resolve({response: "", embed: embed, silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: mathCmd}
];
