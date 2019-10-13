const moduleInfo = {
    name: "leet",
    truename: "leet",
    platformOnly: "discord",
    author: "Manny",
    contributors: ["Tyler R."]
}

const usage = {
    name: "leet",
    cmdName: "leet",
    aliases: ["leet", "1337"],
    args: {min: 1, max: 25},
    description: "The leet command",
    exampleUsage: "leet This is the leet command",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Fun",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageGif = {
    name: "giphy",
    cmdName: "giphy",
    aliases: ["giphy", "gif", "getgif"],
    args: {min: 1, max: 25},
    description: "Search Giphy for a gif matching your tags",
    exampleUsage: "giphy Pikachu",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Fun",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageAdvice = {
    name: "advice",
    cmdName: "advice",
    aliases: ["advice", "askadvice", "getadvice"],
    args: {min: 1, max: 25},
    description: "Get advice about life",
    exampleUsage: "advice What should I do tomorrow?",
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

leetMe = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let l33t = require("1337");
        let startMsg = l33t(args.join(' '));
        let embed = new Discord.MessageEmbed();
        embed.setTitle("LEET");
        embed.setDescription(startMsg);
        embed.setColor("RANDOM");
        return resolve({response: "", embed: embed, silent: false});
    });
}

getGiphy = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let qs = require("querystring");

        let params = {
            'api_key': 'dc6zaTOxFJmzC', // This is Giphy's public API key, so no, I haven't leaked my keys
            'rating': 'r',
            'format': 'json',
            'limit': 1
        }

        var query = qs.stringify(params);
        if(args.length >= 1) {
            query += "&tag=" + args.join("+");
        }

        let request = require("request");

        request('http://api.giphy.com/v1/gifs/random' + '?' + query, (error, response, body) => {
            if(error || response.statusCode !== 200) {
                console.log(error);
                return resolve({response: "Some error occurred", silent: false});
            } else {
                let responseObj = JSON.parse(body);
                if(responseObj.data) {
                    //responseObj.data.id
                    let embed = new Discord.MessageEmbed();
                    embed.setDescription(`Tags: ${args.join(' ')}`);
                    embed.setImage('http://media.giphy.com/media/' + responseObj.data.id + '/giphy.gif');
                    return resolve({response: "", embed: embed, silent: false});
                } else {
                    //undefined
                    return resolve({response: "Sorry!  Invalid tags.  Try something else."})
                }
            }
        });
    });
}

getAdvice = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let request = require("request");
        request("http://api.adviceslip.com/advice", (error, response, body) => {
            if(!error && response.statusCode === 200) {
                let resp;
                try {
                    resp = JSON.parse(body);
                } catch(e) {
                    BotSettings.assist.error("The API has returned an unconventional response.", message.channel);
                    return resolve({response: "", silent: true});
                }
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Advice #: " + resp.slip.slip_id + "");
                embed.setDescription(resp.slip.advice);
                return resolve({response: "", embed: embed, silent: false});
            }
        });
    });
}



this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: leetMe},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageGif.aliases, args: usageGif.args, usage: usageGif, run: getGiphy},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageAdvice.aliases, args: usageAdvice.args, usage: usageAdvice, run: getAdvice}
];
