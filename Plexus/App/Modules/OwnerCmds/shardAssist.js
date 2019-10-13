const moduleInfo = {
    name: "shard",
    truename: "shard",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "shard",
    cmdName: "shard",
    aliases: ["shard"],
    args: {min: 2, max: 2},
    description: "Shard management",
    usage: "[command:str]",
    exampleUsage: "shard restart [Discord ID]",
    runIn: ["dm", "text"],
    categories: "Owner",
    permlvl: 7,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageEval = {
    name: "eval",
    cmdName: "eval",
    aliases: ["eval"],
    args: {min: 0, max: 1500},
    description: "Eval command",
    usage: "[command:str]",
    exampleUsage: "",
    runIn: ["dm", "guild"],
    categories: "Owner",
    permlvl: 7,
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

evalCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let comm = args.join(" ");
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Evaluating Input");
        let embedDesc = "Output Unavailable";
        if(comm.includes("pm2")) {
            let exec = require("child_process").exec, child;
            child = exec(comm, (err, stdout, stderr) => {
                let content = null;
                if(err !== null) {
                    embed.setDescription("Error: " + err);
                } else {
                    content = require("util").inspect(stdout, {depth: null});
                    embed.setDescription(content.replaceAll("`", '').replaceAll("'", "```"));
                }
                return resolve({response: message.author.tag, embed: embed, silent: false});
            });
        } else {
            try {
                embedDesc = eval(comm);
            } catch(e) {
                let tmpDesc = "Ouput Unavailable.  Error Message: \n";
                embedDesc = tmpDesc + e;
            }
            embed.setDescription(embedDesc);
            return resolve({response: message.author.tag, embed: embed, silent: false});
        }
    })
}

shardCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let availOpts = ["restart", "check", "status", "ping"];
        let firstOpt = args.shift();
        firstOpt = firstOpt.toLowerCase();
        if(availOpts.includes(firstOpt)) {
            if(firstOpt === "restart") {
                let secondOpt = args.shift();
                let serverData = BotSettings.resolve.Server(secondOpt);
                if(serverData.found === true) {
                    //console.log(BotSettings.discord['client-' + serverData.shard]);
                    //process.exit();
                    BotSettings.discord['client-' + serverData.shard].destroy().then(() => {
                        delete BotSettings.discord['client-' + serverData.shard];
                        BotSettings.assist.shardDirect(serverData.shard).then(() => {
                            return resolve({response: message.author.tag + ", shard restarted....", silent: false});
                        }).catch(errShard => {
                            Logger.sendLog("There was an error with the shard enable program.... " + errShard, "CRITICAL", __filename);
                        });
                    }).catch(err => {
                        Logger.sendLog("There was an error thrown when deleting..... " + err, "CRITICAL", __filename);
                    });
                } else {
                    return resolve({response: message.author.tag + ", unable to restart the server for some reason....", silent: false});
                }
            } else if(firstOpt === "ping") {
                let secondOpt = args.shift();
                let serverData = BotSettings.resolve.Server(secondOpt);
                if(serverData.found === true) {
                    let pingResult = BotSettings.discord['client-' + serverData.shard].ping;
                    return resolve({response: message.author.tag + ", the current ping is " + pingResult.toFixed(2) + "ms", silent: false});
                } else {
                    return resolve({response: message.author.tag + ", unable to check the status of the server for some reason.....", silent: false});
                }
                return resolve({response: message.author.tag + ", command not finished...", silent: false});
            } else if(firstOpt === "check" || firstOpt === "status") {
                return resolve({response: message.author.tag + ", this command will be done soon....", silent: false});
            }
        } else {
            BotSettings.assist.error("Available options: " + availOpts.join("\n") + "\nExample: " + usage.exampleUsage, message.channel);
            return resolve({response: "", silent: true});
        }
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: shardCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageEval.aliases, args: usageEval.args, usage: usageEval, run: evalCmd}
];
