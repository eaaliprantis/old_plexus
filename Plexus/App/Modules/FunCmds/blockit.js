const moduleInfo = {
    name: "blockit",
    truename: "blockit",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "blockit",
    cmdName: "blockit",
    aliases: ["blockit", "blocktext"],
    args: {min: 1, max: 100},
    description: "Makes your text into codeblocks",
    exampleUsage: "blockit js This is javascript",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Fun",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageCode = {
    name: "code",
    cmdName: "code",
    aliases: ["code", "pastecode"],
    args: {min: 2, max: 100},
    description: "Makes your text into codeblocks",
    exampleUsage: "code js This is javascript",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Fun",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageAscii = {
    name: "ascii",
    cmdName: "ascii",
    aliases: ["ascii", "asciicode"],
    args: {min: 1, max: 25},
    description: "Makes your text ascii code",
    exampleUsage: "ascii Hello guys",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Fun",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageAsciiArt = {
    name: "artascii",
    cmdName: "artascii",
    aliases: ["artascii", "asciiart"],
    args: {min: 1, max: 25},
    description: "Makes your text ascii code",
    exampleUsage: "artascii More Ascii",
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

blockText = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let blockIt = args.shift();
        let finalBlock = (`\`\`\`${blockIt + " " + args.join(" ")}`);
        return resolve({response: finalBlock, silent: false});
    });
}

asciiCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let request = require("request");
        request("http://artii.herokuapp.com/make?text=" + args.join(" "), (error, response, body) => {
            if(error) {
                BotSettings.assist.error("There was an error retrieving the ascii characters.  Please try again.", message.channel);
                return resolve({response: "", silent: true});
            } else {
                let embed = new Discord.MessageEmbed();
                embed.setTitle("ASCII");
                embed.setColor("RANDOM");
                if(response.body.length >= BotSettings.discordServers.limits.description) {
                    embed.setDescription("The length of the image was too big for some reason.");
                } else {
                    embed.setDescription(`\`\`\`${response.body}\`\`\``);
                }
                return resolve({response: "", embed: embed, silent: false});
            }
        });
    });
}

asciiArtCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let art = require("ascii-art");
        art.font(args.join(" "), "Doom", (rendered) => {
            if(rendered.length >= BotSettings.discordServers.limits.messages) {
                BotSettings.assist.error("The size of the ascii is too large (" + rendered.length + ").  Please try making a size a little bit smaller.", message.channel);
                return resolve({response: "", silent: true});
            } else {
                let embed = new Discord.MessageEmbed();
                embed.setTitle("ASCII");
                embed.setColor("RANDOM");
                if(rendered.length >= BotSettings.discordServers.limits.description) {
                    embed.setDescription("The length of the image was too big for some reason.");
                } else {
                    embed.setDescription(`\`\`\`${rendered}\`\`\``);
                }
                return resolve({response: "", embed: embed, silent: false});
            }
        });
    });
}

codeCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let lang = args.shift();
        let embed = new Discord.MessageEmbed();
        embed.setTitle("CODE");
        embed.setDescription(`\`\`\`${lang + "\n" + args.join(" ")} \`\`\``);
        embed.setColor("RANDOM");
        return resolve({response: "", embed: embed, silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: blockText},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageCode.aliases, args: usageCode.args, usage: usageCode, run: codeCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageAscii.aliases, args: usageAscii.args, usage: usageAscii, run: asciiCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageAsciiArt.aliases, args: usageAsciiArt.args, usage: usageAsciiArt, run: asciiArtCmd}
];
