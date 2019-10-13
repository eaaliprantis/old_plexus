const moduleInfo = {
    name: "challonge",
    truename: "challonge",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "challonge",
    cmdName: "challonge",
    aliases: ["challonge"],
    args: {min: 0, max: 0},
    description: "Challonge Info",
    usage: "[command:str]",
    exampleUsage: "challonge",
    runIn: ["text"],
    categories: "Tournament",
    permlvl: 6,
    premiumLvl: 1,
    enabled: true,
    contributors: [""]
}

const usageTournament = {
    name: "challonge",
    cmdName: "challongeT",
    aliases: ["challongeT", "challonge_tournament", "c_tournament"],
    args: {min: 0, max: 0},
    description: "Challonge Tournament Info",
    usage: "[command:str]",
    exampleUsage: "challonge",
    runIn: ["text"],
    categories: "Tournament",
    permlvl: 0,
    premiumLvl: 1,
    enabled: true,
    contributors: [""]
}

this.setupCommands = function(file) {
    this.file = file;
    return new Promise((resolve, reject) => {
        return resolve({file: this.file, moduleInfo: moduleInfo, commands: this.commands});
    });
}

challongeInstance = () => {
    let instance = require("challonge");
    return instance;
}

challongeGetTournaments = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        challongeSetup(bot, message, args, time, prefixUsed, shardId).then((cData) => {
            let content = BotSettings.challonge[message.guild.id];
            content.instance.tournaments.index({callback: (err, data2) => {
                if(err) {
                    Logger.sendLog("There was an error retrieving the tournament index.... " + err, "CRITICAL", __filename);
                    BotSettings.assist.error("There was an error retreiving the tournaments index ..... " + err, message.channel, message.author);
                    return resolve({response: "", silent: true});
                } else {
                    if(Object.keys(data2).length === 0) {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("No Tournaments");
                        embed.setDescription("There are currently no tournaments that are registered to this account.");
                        embed.setColor("RANDOM");
                        return resolve({response: message.author, embed: embed, silent: false});
                    } else {
                        console.log(data2);
                        data2.forEach(tourney => {
                            console.log(tourney.tournament.name);
                            console.log(tourney.tournament);
                        });
                    }
                }
            }});
        }).catch(errD => {
            return reject(errD);
        })
    });
}

checkInstance = (bot, message) => {
    if(BotSettings.hasOwnProperty("challonge") && BotSettings.challonge.hasOwnProperty(message.guild.id)) {
        return true;
    }
    return false;
}

challongeCreateTournament = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let availOpts = [['single elimination', 'single elim', 'se', 'single'], ['double elimination', 'double elim', 'de', 'double'], ['round robin', 'rr'], ['swiss']];
        if(checkInstance(bot, message)) {
            let name = args.shift();
            name = name.replaceAll("_", " ");
            return resolve({response: message.author + ", command not finished....", silent: false});
        } else {
            BotSettings.assist.error("Please run the `" + prefixUsed + "challonge` command to initialize challonge for your guild.", message.channel, message.author);
            return resolve({response: "", silent: true});
        }
    });
}

challongeTest = (bot, message, shardId) => {
    return new Promise((resolve, reject) => {
        BotSettings.challonge[message.guild.id].instance.tournaments.index({
            callback: (err, data) => {
                if(data.hasOwnProperty("statusCode") && data.statusCode !== 200) {
                    let reason = "\n**Status Code**: " + data.statusCode + "\n**Status Msg**: " + data.statusMessage;
                    return resolve({error: true, response: message.author + ", there was an error.  Here is a more in-depth reason: \n" + reason, silent: false});
                } else {
                    return resolve({error: false});
                }
            }
        });
    });
}

challongeSetup = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        Database.callStatement("SHOW COLUMNS FROM settings LIKE '%challonge_%'").then(columnData => {
            let dataArr = [];
            columnData.forEach((content) => {
                dataArr.push(content.Field);
            });
            Database.callStatement("SELECT " + dataArr.join(", ") + " FROM settings WHERE platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(rows => {
                if(rows.length === 1) {
                    let verify = true;
                    let fieldError = []
                    rows.forEach((rowData) => {
                        dataArr.forEach((keyData) => {
                            if(rowData[keyData] === null) {
                                if(keyData.split("_")[1].toLowerCase() !== "subdomain") {
                                    verify = false;
                                    fieldError.push(keyData.split("_")[1].toLowerCase());
                                }
                            }
                        });
                    });
                    if(verify === false) {
                        BotSettings.assist.error("You must have all of your challonge fields (except for subdomain) filled out and not left blank.  What must be filled in are the following: \n" + fieldError.join("\n"), message.channel, message.author);
                        return resolve({response: "", silent: true});
                    }
                    if(!BotSettings.hasOwnProperty("challonge")) {
                        BotSettings.challonge = {};
                    }
                    if(!BotSettings.challonge.hasOwnProperty(message.guild.id)) {
                        BotSettings.challonge[message.guild.id] = {};
                    }
                    let data = rows[0];

                    let diffStorage = {};
                    dataArr.forEach((key) => {
                        let tmpSplit = key.split("_")[1];
                        if(!BotSettings.challonge[message.guild.id].hasOwnProperty(tmpSplit)) {
                            BotSettings.challonge[message.guild.id][tmpSplit] = data[key];
                        } else {
                            if(BotSettings.challonge[message.guild.id][tmpSplit] !== data[key]) {
                                diffStorage[tmpSplit] = {key: key, data: data[key]};
                            }
                        }
                    });
                    let apiKey = BotSettings.challonge[message.guild.id]["apiKey"]
                    let subdomain = BotSettings.challonge[message.guild.id]['subdomain'];
                    let manager = BotSettings.challonge[message.guild.id]['manager'];
                    let urlLink = "";

                    if(subdomain === null) {
                        subdomain = "Not Set";
                        urlLink = "Unable to set";
                    } else {
                        subdomainSet = true;
                        urlLink = "https://" + subdomain + ".challonge.com";
                    }
                    if(!BotSettings.hasOwnProperty("challonge")) {
                        BotSettings.challonge = {};
                    }
                    if(!BotSettings.challonge.hasOwnProperty(message.guild.id)) {
                        BotSettings.challonge[message.guild.id] = {};
                    }
                    if(!BotSettings.challonge[message.guild.id].hasOwnProperty("instance")) {
                        BotSettings.challonge[message.guild.id].apiKey = apiKey;
                        BotSettings.challonge[message.guild.id].manager = manager;
                        let tmpOpts = {};
                        if(subdomainSet) {
                            tmpOpts.subdomain = subdomain;
                            BotSettings.challonge[message.guild.id].subdomain = subdomain;
                            BotSettings.challonge[message.guild.id].urlLink = urlLink;
                        }
                        tmpOpts.apiKey = apiKey;
                        BotSettings.challonge[message.guild.id].instance = challongeInstance().createClient(tmpOpts);
                        challongeTest(bot, message, shardId).then((dataTest) => {
                            if(dataTest.error) {
                                delete dataTest.error;
                                dataTest.setup = false;
                                dataTest.finished = false;
                                delete BotSettings.challonge[message.guild.id];
                                return resolve(dataTest);
                            } else {
                                return resolve({setup: true, finished: true});
                            }
                        }).catch(errData => {
                            Logger.sendLog("Error with challongeTest.  " + errData, "CRITICAL", __filename);
                            BotSettings.assist.error("There was an error with the test for some reason.", message.channel);
                            return resolve({response: "", silent: true, setup: null});
                        })
                    } else {
                        if(apiKey === BotSettings.challonge[message.guild.id]) {
                            //key is the same
                        } else {
                            BotSettings.challonge[message.guild.id].apiKey = apiKey;
                            let tmpOpts = {};
                            if(subdomainSet) {
                                tmpOpts.subdomain = subdomain;
                                BotSettings.challonge[message.guild.id].subdomain = subdomain;
                            }
                            tmpOpts.apiKey = apiKey;
                            BotSettings.challonge[message.guild.id].instance = challongeInstance().createClient(tmpOpts);
                            challongeTest(bot, message, shardId).then((dataTest) => {
                                if(dataTest.error) {
                                    delete dataTest.error;
                                    dataTest.setup = false;
                                    dataTest.finished = false;
                                    delete BotSettings.challonge[message.guild.id];
                                    return resolve(dataTest);
                                } else {
                                    return resolve({setup: true, finished: true});
                                }
                            }).catch(errData => {
                                Logger.sendLog("Error with challongeTest.  " + errData, "CRITICAL", __filename);
                                BotSettings.assist.error("There was an error with the test for some reason.", message.channel);
                                return resolve({setup: true, finished: true});
                            })
                        }
                    }
                } else {
                    BotSettings.assist.error("You did not set your challonge api key.  Please use the settings command to do so.", message.channel);
                    return reject({response: "", silent: true, setup: null});
                }
            }).catch(errD => {
                Logger.sendLog("Error when retrieving Challonge API Key.  " + errD, "CRITICAL", __filename);
                BotSettings.assist.error("There was an error when retrieving the api key for challonge... " + errD, message.channel);
                return reject({response: "", silent: true, setup: null});
            });
        }).catch(errData => {
            Logger.sendLog("Unable to get the column table names for some reason.... " + errData, "CRITICAL", __filename);
            BotSettings.assist.error("There was an error for some reason.  Please try again.... ", message.channel);
            return reject({response: "", silent: true, setup: null});
        })
    });
}

challongeCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        challongeSetup(bot, message, args, time, prefixUsed, shardId).then(content => {
            if(content.setup === false) {
                message.channel.send(content.response).then(dataMsg => {
                    return resolve({response: "", silent: true});
                }).catch(errMsg => {
                    Logger.sendLog("Error when sending message because.... " + errMsg, "CRITICAL", __filename);
                    return resolve({response: "", silent: true});
                })
            } else if(content.setup === null) {
                return resolve({response: "", silent: true});
            }
            let apiKey = BotSettings.challonge[message.guild.id].apiKey;
            let subdomain = (BotSettings.challonge[message.guild.id].hasOwnProperty("subdomain")) ? BotSettings.challonge[message.guild.id].subdomain : "Not Set";
            let urlLink = (BotSettings.challonge[message.guild.id].hasOwnProperty("urlLink")) ? BotSettings.challonge[message.guild.id].urlLink : "Not Set";
            message.author.send("Hello, \nAPI key is: **" + apiKey + "**\n\nYour subdomain is: ** " + subdomain + "**\n\nLink: " + urlLink).then(() => {
                message.reply("check DMs").then((m2) => {
                    return resolve({response: "", silent: true});
                }).catch(err2 => {
                    Logger.sendLog("Unable to send a DM to " + message.author + " for some reason..... " + err2, "CRITICAL", __filename);
                    BotSettings.assist.error("We were unable to send you your challonge api key....", message.channel);
                    return resolve({response: "", silent: true});
                });
            }).catch(err => {
                Logger.sendLog("Unable to send a DM to " + message.author + " for some reason..... " + err, "CRITICAL", __filename);
                BotSettings.assist.error("We were unable to send you your challonge api key....", message.channel);
                return resolve({response: "", silent: true});
            })
        }).catch(errD => {
            return resolve(errD);
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: challongeCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageTournament.aliases, args: usageTournament.args, usage: usageTournament, run: challongeGetTournaments}
];
