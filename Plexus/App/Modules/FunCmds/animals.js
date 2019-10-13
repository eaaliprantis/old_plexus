const moduleInfo = {
    name: "animal",
    truename: "animal",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usageCat = {
    name: "cat",
    cmdName: "cat",
    aliases: ["cat", "randomcat", "cats"],
    args: {min: 0, max: 0},
    description: "Generate a random cat",
    exampleUsage: "cat",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Animal",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageDog = {
    name: "dog",
    cmdName: "dog",
    aliases: ["dog", "randomdog", "dogs"],
    args: {min: 0, max: 0},
    description: "Generate a random dog",
    exampleUsage: "dog",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Animal",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageCatFact = {
    name: "catfact",
    cmdName: "catfact",
    aliases: ["catfact", "catfacts", "factsaboutcat"],
    args: {min: 0, max: 1},
    description: "Generate a ranomd cat fact",
    exampleUsage: "catfact 15",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Animal",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageCatGif = {
    name: "catgif",
    cmdName: "catgif",
    aliases: ["catgif", "gifcat", "gcat"],
    args: {min: 0, max: 0},
    description: "Cat gif",
    exampleUsage: "catgif",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Animal",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageDogFact = {
    name: "dogfact",
    cmdName: "dogfact",
    aliases: ["dogfact", "dogfacts", "factsaboutdog", "factsaboutdogs"],
    args: {min: 0, max: 1},
    description: "Generate a random dog fact",
    exampleUsage: "dogfact 15",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Animal",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageNumFact = {
    name: "numfact",
    cmdName: "numfact",
    aliases: ["numfact", "numberfact", "factsaboutnumbers", "numfacts"],
    args: {min: 0, max: 1},
    description: "Generate a random fact about numbers",
    exampleUsage: "numfact 15",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Animal",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageRandomAww = {
    name: "aww",
    cmdName: "aww",
    aliases: ["aww", "randomaww", "randomcuteness", "cuteness"],
    args: {min: 0, max: 0},
    description: "Generates a random cute picture",
    exampleUsage: "aww",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Animal",
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

randomCat = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let randomAnimal = require("random-animal");
        randomAnimal.cat().then(url => {
            let embed = new Discord.MessageEmbed();
            embed.setImage(url);
            embed.setDescription("Here is your random cat image!");
            return resolve({response: "", embed: embed, silent: false});
        }).catch(err => {
            console.log(err.message);
            return resolve({response: err.message, silent: false});
        });
    });
}

randomCatGif = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let request = require("request");
        let r = request.get("http://thecatapi.com/api/images/get.php/gif.php?type=gif", (err, res, body) => {
            if(err) {
                BotSettings.assist.error("Service is possibly offline.  Please try again at a later time.", message.channel);
                return resolve({response: "", silent: true});
            } else {
                message.channel.send({files: [r.uri.href]}).then((res) => {
                    return resolve({response: "", silent: true});
                }).catch(errMsg => {
                    Logger.sendLog("-> An error occurred when trying to send the message.  " + errMsg.message, "CRITICAL", __filename);
                    return resolve({response: "", silent: true});
                });
            }
        });
    });
}

randomCowImg = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let cows = require("cows");
        let rn = require("random-number");
        let opts = {
            min: 0,
            max: cows().length - 1,
            integer: true
        };
        let random = rn(opts);
        message.channel.send("", {code: cows()[random]}).then((res) => {
            return resolve({response: "", silent: true});
        }).catch(err => {
            Logger.sendLog("-> Unable to send message to " + message.channel.id + " in guild " + message.guild.id + " because: " + err.message, "CRITICAL", __filename);
            return resolve({response: "", silent: true});
        });
    });
}

randomDog = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let randomAnimal = require("random-animal");
        randomAnimal.dog().then(url => {
            let embed = new Discord.MessageEmbed();
            embed.setImage(url);
            embed.setDescription("Here is your random dog image!");
            return resolve({response: "", embed: embed, silent: false});
        }).catch(err => {
            console.log(err.message);
            return resolve({response: err.message, silent: false});
        });
    });
}

randomCatFact = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let resp = 0;
        if(args.length === 1) {
            if(BotSettings.assist.validateNumber(args[0])) {
                resp = parseInt(args[0]);
            } else {
                resp = 0;
            }
        }
        let unirest = require("unirest");
        if(BotSettings.assist.validateNumber(resp) === true) {
            let num = resp
            unirest.get(`https://catfact.ninja/facts?number=${num}`)
            .header("Accept", "application/json")
            .end((result) => {
                if(result.status === 200) {
                    let startMsg = result.body.data[0].fact;
                    return resolve({response: startMsg, silent: false});
                } else {
                    BotSettings.assist.error("Failed to fetch cat fact(s)", message.channel);
                    return resolve({response: "", silent: true});
                }
            });
        } else {
            BotSettings.assist.error("It must be a full number.", message.channel);
            return resolve({response: "", silent: true});
        }
    });
}

randomNumFact = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let resp = 0;
        if(args.length === 1) {
            if(BotSettings.assist.validateNumber(args[0])) {
                resp = parseInt(args[0]);
            } else {
                resp = BotSettings.random.Number();
            }
        } else {
            resp = BotSettings.random.Number(100);
        }
        let unirest = require("unirest");
        if(BotSettings.assist.validateNumber(resp) === true) {
            let num = resp
            unirest.get(`http://numbersapi.com/${num}`)
            .header("Accept", "application/json")
            .end((result) => {
                if(result.status === 200) {
                    let startMsg = result.body;
                    return resolve({response: startMsg, silent: false});
                } else {
                    BotSettings.assist.error("Failed to fetch number fact for " + num, message.channel);
                    return resolve({response: "", silent: true});
                }
            });
        } else {
            BotSettings.assist.error("It must be a full number.", message.channel);
            return resolve({response: "", silent: true});
        }
    });
}

randomDogFact = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let resp = 0;
        if(args.length === 1) {
            if(BotSettings.assist.validateNumber(args[0])) {
                resp = parseInt(args[0]);
            } else {
                resp = 0;
            }
        }
        let unirest = require("unirest");
        if(BotSettings.assist.validateNumber(resp) === true) {
            let num = resp
            unirest.get(`https://dog-api.kinduff.com/api/facts?number=${num}`)
            .header("Accept", "application/json")
            .end((result) => {
                if(result.status === 200) {
                    let startMsg = result.body.facts[0];
                    return resolve({response: startMsg, silent: false});
                } else {
                    BotSettings.assist.error("Failed to fetch cat fact(s)", message.channel)
                    return resolve({response: "", silent: true});
                }
            });
        } else {
            BotSettings.assist.error("It must be a full number.", message.channel);
            return resolve({response: "", silent: true});
        }
    });
}

randomAwwCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let randomPuppy = require("random-puppy");
        randomPuppy('aww').then(url => {
            let embed = new Discord.MessageEmbed();
            Logger.sendLog("Random Aww: " + url, "CRITICAL", __filename);
            embed.setImage(url);
            embed.setDescription("Here is your random aww image!");
            return resolve({response: message.author, embed: embed, silent: false});
        }).catch(errUrl => {
            Logger.sendLog("Unable to get an image because.... " + errUrl, "CRITICAL", __filename);
            BotSettings.assist.error("There was an error getting a random cute picture.", message.channel, message.author);
            return resolve({response: "", silent: true});
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageCat.aliases, args: usageCat.args, usage: usageCat, run: randomCat},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageCatFact.aliases, args: usageCatFact.args, usage: usageCatFact, run: randomCatFact},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageDog.aliases, args: usageDog.args, usage: usageDog, run: randomDog},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageDogFact.aliases, args: usageDogFact.args, usage: usageDogFact, run: randomDogFact},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageNumFact.aliases, args: usageNumFact.args, usage: usageNumFact, run: randomNumFact},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageCatGif.aliases, args: usageCatGif.args, usage: usageCatGif, run: randomCatGif},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageRandomAww.aliases, args: usageRandomAww.args, usage: usageRandomAww, run: randomAwwCmd}
];
