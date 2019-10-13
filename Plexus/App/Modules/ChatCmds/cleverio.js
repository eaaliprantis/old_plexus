const moduleInfo = {
    name: "cleverbot",
    truename: "cleverbot",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "cleverbot",
    cmdName: "cleverbot",
    aliases: ["cleverbot", "chat", "cleverbotio", "cbot"],
    args: {min: 1, max: 100},
    description: "Chat with CleverBot IO",
    usage: "[command:str]",
    exampleUsage: "cleverbot Hello",
    runIn: ["text"],
    categories: "Fun",
    permlvl: 0,
    premiumLvl: 0,
    enabled: false,
    contributors: [""]
}

this.setupCommands = function(file) {
    this.file = file;
    return new Promise((resolve, reject) => {
        return resolve({file: this.file, moduleInfo: moduleInfo, commands: this.commands});
    });
}

chatBotCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        Database.callStatement("SELECT clever_session FROM cleverio WHERE platform='discord' AND userid='" + message.author.id + "' LIMIT 1").then(rows => {
            let userSess = "";
            let cleverbot = require("cleverbot.io");
            let cBot = "";
            if(rows.length === 1) {
                userSess = rows[0].clever_session;
            }
            if(userSess.length === 0) {
                cBot = new cleverbot(BotSettings.assist.getConstants("cleverbot_user"), BotSettings.assist.getConstants("cleverbot_key"));
            } else {
                cBot = new cleverbot(BotSettings.assist.getConstants("cleverbot_user"), BotSettings.assist.getConstants("cleverbot_key"), userSess);
            }
            if(rows.length === 0) {
                cBot.create((err, session) => {
                    if(err) {
                        Logger.sendLog("-> Error when starting a session.  " + err, "CRITICAL", __filename);
                        BotSettings.assist.error("There was an error with cleverbot for some reason.  Please try again soon.", message.channel);
                        return resolve({response: "", silent: true});
                    } else {
                        console.log("session: " + session);
                        if(rows.length === 0) {
                            Database.callStatement("INSERT INTO cleverio (platform, userid, clever_session) VALUES ('discord', '" + message.author.id + "', '" + session + "')").then(rowData => {
                                cBot.ask(args.join(" "), (error, resp) => {
                                    if(error) {
                                        Logger.sendLog("-> Error when asking a question.  " + response, "CRITICAL", __filename);
                                        BotSettings.assist.error("There was an error with cleverbot for some reason.  Please try again soon.", message.channel);
                                        return resolve({response: "", silent: true});
                                    } else {
                                        let embed = new Discord.MessageEmbed();
                                        embed.setDescription(resp);
                                        embed.setColor("RANDOM");
                                        return resolve({response: message.author, embed: embed, silent: false});
                                    }
                                });
                            }).catch(errData => {
                                Logger.sendLog("There was an error loading the data.... " + errData, "CRITICAL", __filename);
                                BotSettings.assist.error("There was an error adding the data.... " + errData, message.channel);
                                return resolve({response: "", silent: true});
                            });
                        } else {
                            return resolve({response: message.author + ", something went wrong!", silent: false});
                        }
                    }
                });
            } else {
                console.log("Asking question......");
                cBot.create((err, response) => {
                    if(err) {
                        Logger.sendLog("-> Error when asking a question.  " + response, "CRITICAL", __filename);
                        BotSettings.assist.error("There was an error with cleverbot for some reason.  Please try again soon.", message.channel);
                        return resolve({response: "", silent: true});
                    } else {
                        console.log(args.join(" "));
                        cBot.ask(args.join(" "), (error, resp) => {
                            console.log(resp);
                            if(error) {
                                Logger.sendLog("-> Error when asking a question.  " + response, "CRITICAL", __filename);
                                BotSettings.assist.error("There was an error with cleverbot for some reason.  Please try again soon.", message.channel);
                                return resolve({response: "", silent: true});
                            } else {
                                let embed = new Discord.MessageEmbed();
                                embed.setDescription(resp);
                                embed.setColor("RANDOM");
                                return resolve({response: message.author, embed: embed, silent: false});
                            }
                        });
                    }
                });
            }
        }).catch(errD => {
            Logger.sendLog("There was an error for some reason.... " + errD, "CRITICAL", __filename);
            BotSettings.assist.error("An error occurred for some reason.... " + errD, message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: chatBotCmd}
];
