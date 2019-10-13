const moduleInfo = {
    name: "Ping",
    truename: "ping",
    platformOnly: "discord",
    author: "Manny",
    contributors: ["Tyler R."]
}

const usage = {
    name: "ping",
    cmdName: "ping",
    aliases: ["ping", "poke", "pong"],
    args: {min: 0, max: 0},
    description: "Ping Bot and Server.",
    exampleUsage: "ping",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "General",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageDPing = {
    name: "dping",
    cmdName: "dping",
    aliases: ["dping", 'ding'],
    args: {min: 0, max: 0},
    description: "Discord Ping",
    exampleUsage: "dping",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "General",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageWPing = {
    name: "wping",
    cmdName: "wping",
    aliases: ["wping"],
    args: {min: 0, max: 0},
    description: "Web Ping Bot and Server.",
    exampleUsage: "wping",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "General",
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

ping = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let pingEmbed = new Discord.MessageEmbed();
        let randomQuoteArr = ["starwars", "startrek", "movie-quotes"];
        let Random = require("random-js");
        let random = new Random(Random.engines.mt19937().autoSeed());
        let value = random.integer(0, randomQuoteArr.length - 1);
        let quoteVal = "", movie = "";
        if(value === 0) {
            let starwars = require("starwars");
            quoteVal = starwars();
            movie = "Star Wars";
        } else if(value === 1) {
            let startrek = require("startrek");
            quoteVal = startrek();
            movie = "Star Trek";
        } else if(value === 2) {
            let movieQuote = require("movie-quotes");
            let choice = random.integer(0, 1);
            if(choice === 0) {
                quoteVal = movieQuote[random.integer(0, movieQuote.all.length - 1)];
                if(quoteVal === undefined) {
                    quoteVal = movieQuote.random();
                    let tmpQuote = quoteVal.split("\"");
                    movie = tmpQuote.pop();
                    quoteVal = tmpQuote.join(" ");
                } else {
                    let tmpQuote = quoteVal.split("\"");
                    movie = tmpQuote.pop();
                    quoteVal = tmpQuote.join(" ");
                }
            } else if(choice === 1) {
                quoteVal = movieQuote.random();
                if(quoteVal === undefined) {
                    quoteVal = movieQuote.random();
                    let tmpQuote = quoteVal.split("\"");
                    movie = tmpQuote.pop();
                    quoteVal = tmpQuote.join(" ");
                } else {
                    let tmpQuote = quoteVal.split("\"");
                    movie = tmpQuote.pop();
                    quoteVal = tmpQuote.join(" ");
                }
            }
        }
        pingEmbed.setTitle("Ping Response....");
        pingEmbed.setDescription(quoteVal + "\n-" + movie);
        message.channel.send({embed: pingEmbed}).then(m => {
            setTimeout(() => {
                let mTime = m.createdTimestamp;
                let date = Math.abs(mTime - time);
                pingEmbed.setDescription("```js\nMessage Delay: " + Math.floor(date) + "ms```");
                m.edit({embed: pingEmbed}).then(() => {
                    return resolve({response: "", silent: true});
                }).catch((err) => {
                    Logger.sendLog("-> Another error occurred. " + err.message, "CRITICAL", __filename);
                    BotSettings.assist.error("Error occurred: " + err.message, message.channel);
                    return resolve({response: "", silent: true});
                });
            }, 4000);
        }).catch(err => {
            Logger.sendLog("-> " + err.message, "CRITICAL", __filename);
            BotSettings.assist.error("There was an error. " + err.message, message.channel);
            return resolve({response: "", silent: true});
        })
    });
}

wping = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let pingEmbed = new Discord.MessageEmbed();
        pingEmbed.setTitle("Websocket Ping");
        pingEmbed.setDescription(Math.floor(message.client.ping) + "ms.");
        return resolve({response: "", embed: pingEmbed, silent: false});
    });
}

dpingCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let pingEmbed = new Discord.MessageEmbed();
        pingEmbed.setTitle("Discord Ping");
        pingEmbed.setDescription("Shard: " + shardId);
        return resolve({response: message.author, embed: pingEmbed, silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: ping},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageWPing.aliases, args: usageWPing.args, usage: usageWPing, run: wping},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageDPing.aliases, args: usageDPing.args, usage: usageDPing, run: dpingCmd}
];
