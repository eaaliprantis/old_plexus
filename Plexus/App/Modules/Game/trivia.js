const moduleInfo = {
    name: "trivia",
    truename: "trivia",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "trivia",
    cmdName: "trivia",
    aliases: ["trivia", "randomtrivia"],
    args: {min: 1, max: 2},
    description: "I'll ask a trivia question.",
    exampleUsage: "trivia random",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    options: ["random", "custom", "categories"],
    categories: "Games",
    permlvl: 0,
    premiumLvl: 0,
    enabled: false,
    contributors: [""]
}

let cur = {};
let sim = require("string-similarity");

this.setupCommands = function(file) {
    this.file = file;
    return new Promise((resolve, reject) => {
        return resolve({file: this.file, moduleInfo: moduleInfo, commands: this.commands});
    });
}

triviaCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let S = require("string");
        if(cur[message.channel.id]) return resolve({response: "**Waiting for the current trivia game to complete**", silent: false});
        cur[message.channel.id] = true;
        if(usage.hasOwnProperty("options")) {
            if(usage.options.includes(args[0].toLowerCase())) {
                let choiceObj = args.shift();
                if(choiceObj.toLowerCase() === usage.options[0]) {
                    //random
                    getRandom(bot, message, args, time).then(resp => {
                        return resolve(resp);
                    }).catch(err => {
                        return reject(err);
                    });
                } else if(choiceObj.toLowerCase() === usage.options[1]) {
                    //custom
                    getCategories(bot, message, args, time).then(resp => {
                        let categoryLst = resp;
                        getCustom(bot, message, args, time).then(resp2 => {
                            return resolve(resp2);
                        }).catch(err2 => {
                            return reject(err2);
                        });
                    }).catch(err => {
                        return reject(err);
                    });
                } else if(choiceObj.toLowerCase() === usage.options[2]) {
                    //categories
                    getCategories(bot, message, args, time).then(resp => {
                        return resolve(resp);
                    }).catch(err => {
                        return reject(err);
                    });
                } else {
                    getRandom(bot, message, args, time).then(resp => {
                        return resolve(resp);
                    }).catch(err => {
                        return reject(err);
                    });
                }
            }
        } else {
            //Choose random
            getRandom(bot, message, args, time).then(resp => {
                return resolve(resp);
            }).catch(err => {
                return reject(err);
            });
        }
    });
}

getCategories = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let S = require("string");
        Database.callStatement("SELECT DISTINCT category, createdBy, platform, userid FROM trivia").then(categories => {
            if(categories.length === 0) {
                BotSettings.assist.error("There were no categories that were added to the DB", message.channel);
                return resolve({response: "", silent: true});
            } else {
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Trivia Categories");
                let listCategories = categories.map(z => {
                    let y = "**" + z.category + "**";
                    if(z.createdBy !== "None") {
                        y += " created by **" + z.createdBy + "**";
                    }
                    if(z.createdBy !== "None" && z.platform !== "None") {
                        y += " on " + S(z.platform).capitalize().s + " platform";
                    }
                    if(z.createdBy !== "None" && z.userid !== "None") {
                        if(z.platform.toLowerCase() === "discord") {
                            let userCreated = BotSettings.resolve.User(z.userid);
                            if(userCreated !== false) {
                                y += "(" + userCreated + ")";
                            }
                        }
                    }
                });
                embed.setDescription("**__Here is a list of categories that are available.__**\n" + listCategories.join("\n"));
            }
        }).catch(errCat => {
            Logger.sendLog("-> There was an error retrieving the categories for some reason.  Error: " + errCat.message, "CRITICAL", __filename);
            return resolve({response: "There was an error for some reason.  Please try again in a bit.", silent: false});
        });
    });
}

getRandom = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let request = require("request");
        request("http://jservice.io/api/random", (err, res, body) => {
            if(err) {
                BotSettings.assist.error("Service offline for some reason.  Please try again.", message.channel);
                delete cur[message.channel.id];
                return resolve({response: "", silent: true});
            } else {
                let quiz = JSON.parse(body);
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Random Trivia");
                embed.setColor(0x50FF38);
                embed.setDescription("You have 30 seconds to answer the question.");
                embed.setAuthor(message.guild.name, message.guild.iconURL);
                embed.addField("Category", S(quiz[0].category.title).capitalize().s);
                embed.addField("Question", quiz[0].question ? quiz[0].question : "Api Error");
                message.channel.send("", {embed: embed}).then((m) => {
                    let collector = m.channel.createCollector(mess => mess.author.bot === false, {
                        time: 30000
                    });
                    collector.on('collect', (m) => {
                        let same = sim.compareTwoStrings(quiz[0].answer.toLowerCase(), m.content.toLowerCase());
                        if(same > .65) {
                            collector.stop([m.author.username, m.author.id]);
                        }
                    });
                    collector.on("end", (collected, reason) => {
                        delete cur[message.channel.id];
                        if(reason === "time") {
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("Correct Answer");
                            embed.setDescription("The 30 seconds timer are up.  The correct answer was: " + quiz[0].answer);
                            embed.setColor("RANDOM");
                            return resolve({response: "", embed: embed, silent: false});
                        } else {
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("Winner!");
                            embed.setDescription("**Correct!** " + reason[0] + " has answered the question.");
                            embed.setColor("RANDOM");
                            return resolve({response: "", embed: embed, silent: false});
                        }
                    })
                }).catch(err => {
                    Logger.sendLog("-> Unable to send message for some reason.  " + err.message, "CRITICAL", __filename);
                    return resolve({response: "", silent: true});
                });
            }
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: triviaCmd}
];
