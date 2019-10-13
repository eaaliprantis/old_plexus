const moduleInfo = {
    name: "fmylife",
    truename: "fmylife",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "fmylife",
    cmdName: "fmylife",
    aliases: ["fmylife", "fml"],
    args: {min: 0, max: 5},
    description: "Looks up some statements from FML",
    exampleUsage: "fml\nfml search pickles\nfml top day",
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

FMLCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let request = require("snekfetch").get;
        let load = require("cheerio").load;
        let S = require("string");

        if(args.length === 0) {
            //random
            request("http://www.fmylife.com/random").then(res => {
                let $ = load(res.body);
                let statementText = $("p.block").text().split("\n\n")[1].trim();
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Random FML");
                embed.setDescription(statementText);
                embed.setColor("RANDOM");
                return resolve({response: "", embed: embed, silent: false});
            }).catch(err => {
                Logger.sendLog("-> Unable to pull from random fmylife ... " + err, "CRITICAL", __filename);
                let embed = new Discord.MessageEmbed();
                embed.setTitle("ERROR");
                embed.setDescription("There was an error retrieving the random FML for some reason.  We apologize");
                embed.setColor("RANDOM");
                return resolve({response: "", embed: embed, silent: false});
            });
        } else {
            let opt = ["search", "top"];
            if(args.length >= 1) {
                let optChoice = args.shift();
                if(opt.includes(optChoice.toLowerCase()) === true) {
                    if(optChoice.toLowerCase() === "search") {
                        if(args.length <= 0) {
                            BotSettings.assist.error("Unable to " + S(optChoice).capitalize().s + " because you need at least one more argument", message.channel);
                            return resolve({response: "", silent: true});
                        } else {
                            let term = args.join(" ");
                            request(`http://www.fmylife.com/search/${encodeURIComponent(term)}`).then(res => {
                                let $ = load(res.body);
                                let statementText = $("p.block").text().split("\n\n").filter(x => x.length && x.length !== 0);
                                if(statementText.length === 0) {
                                    BotSettings.assist.error("We were unable to find what you were looking for.  Please try again later.", message.channel);
                                    return resolve({response: "", silent: true});
                                } else {
                                    let embed = new Discord.MessageEmbed();
                                    let randomNum = BotSettings.assist.RandomNumArr(statementText);
                                    if(randomNum === false) {
                                        randomNum = statementText;
                                    }
                                    embed.setTitle("Searched FML");
                                    embed.setDescription(randomNum);
                                    embed.setColor("RANDOM");
                                    return resolve({response: "", embed: embed, silent: false});
                                }
                            }).catch(err => {
                                Logger.sendLog("-> Unable to pull from searched fmylife ... " + err, "CRITICAL", __filename);
                                let embed = new Discord.MessageEmbed();
                                embed.setTitle("ERROR");
                                embed.setDescription("There was an error retrieving the searched FML for some reason.  We apologize");
                                embed.setColor("RANDOM");
                                return resolve({response: "", embed: embed, silent: false});
                            });
                        }
                    } else if(optChoice.toLowerCase() === "top") {
                        let filterOpts = {
                            day: "top_day",
                            week: "top_week",
                            month: "top_month",
                            year: "top_year",
                            alltime: "top"
                        };
                        if(args.length <= 0 || args.length >= 2) {
                            BotSettings.assist.error("Unable to " + S(optChoice).capitalize().s + " because you need at least one more argument", message.channel);
                            return resolve({response: "", silent: true});
                        } else {
                            let filterChoice = args.shift();
                            if(!filterOpts[filterChoice.toLowerCase()]) {
                                BotSettings.assist.error("We were unable to find your filter selection.  Here are the available filter selections.  " + Object.keys(filterOpts).join(", "), message.channel);
                                return resolve({response: "", silent: true});
                            } else {
                                request(`http://www.fmylife.com/tops/top/${filterOpts[filterChoice.toLowerCase()]}`).then(res => {
                                    let $ = load(res.body);
                                    let statementText = $("p.block").text().split("\n\n").filter(x => x.length && x.length !== 0);
                                    let randomNum = BotSettings.assist.RandomNumArr(statementText);
                                    if(randomNum === false) {
                                        randomNum = statementText;
                                    }
                                    let embed = new Discord.MessageEmbed();
                                    embed.setTitle("FML filtered by: " + S(filterChoice).capitalize().s);
                                    embed.setDescription(randomNum);
                                    embed.setColor("RANDOM");
                                    return resolve({response: "", embed: embed, silent: false});
                                }).catch(err => {
                                    Logger.sendLog("-> Unable to pull from filter fmylife ... " + err, "CRITICAL", __filename);
                                    let embed = new Discord.MessageEmbed();
                                    embed.setTitle("ERROR");
                                    embed.setDescription("There was an error retrieving the filter FML for some reason.  We apologize");
                                    embed.setColor("RANDOM");
                                    return resolve({response: "", embed: embed, silent: false});
                                });
                            }
                        }
                    } else {
                        //random
                        request("http://www.fmylife.com/random").then(res => {
                            let $ = load(res.body);
                            let statementText = $("p.block").text().split("\n\n")[1].trim();
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("Random FML");
                            embed.setDescription(statementText);
                            embed.setColor("RANDOM");
                            return resolve({response: "", embed: embed, silent: false});
                        }).catch(err => {
                            Logger.sendLog("-> Unable to pull from random fmylife ... " + err, "CRITICAL", __filename);
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("ERROR");
                            embed.setDescription("There was an error retrieving the random FML for some reason.  We apologize");
                            embed.setColor("RANDOM");
                            return resolve({response: "", embed: embed, silent: false});
                        });
                    }
                }
            }
        }
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: FMLCmd}
];
