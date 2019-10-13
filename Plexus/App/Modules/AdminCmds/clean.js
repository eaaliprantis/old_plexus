const moduleInfo = {
    name: "clean",
    truename: "clean",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "clean",
    cmdName: "clean",
    aliases: ["clean", "purge"],
    args: {min: 1, max: 2},
    description: "Remove either the bot's messages or the user's messages",
    exampleUsage: "clean 5 @eaaliprantis#2160\nclean 5 all",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Admin",
    permlvl: 5,
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

cleanText = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let taggableMember = "";
        let newArgs = [];
        let purgeNum = 0;
        if(args.length === 1 && BotSettings.resolve.Number(args[0]) && BotSettings.validate.Range(args[0], 1, 100)) {
            //valid entry
            newArgs.push(parseInt(args[0]));
            args.shift();
        } else {
            console.log("Mentions size: " + message.mentions.users.size);
            if(message.mentions.users.size === 2) {
                message.mentions.users.forEach(member => {
                    if(member.id !== bot.user.id) {
                        taggableMember = member;
                    }
                });
            } else if(message.mentions.users.size === 1 && message.mentions.users.first().id !== bot.user.id) {
                taggableMember = message.mentions.users.first();
                message.mentions.users.forEach(member => {
                    if(member.id !== bot.user.id) {
                        taggableMember = member;
                    } else {
                        taggableMember = bot.user;
                    }
                });
            } else {
                taggableMember = bot.user;
                newArgs = args;
            }
            if(taggableMember === bot) {
                console.log(taggableMember.user.id);
                taggableMember = taggableMember.user;
            } else {
                console.log(taggableMember.id);
            }
            console.log(args.length);
            console.log(newArgs);
            if(newArgs.length < 1) {
                args.forEach((arg) => {
                    console.log(taggableMember.id + " - " + arg);
                    console.log(("<@!" + taggableMember.id + ">" !== arg) === true);
                    console.log((taggableMember.id !== bot.user.id) === false);
                    if(("<@!" + taggableMember.id + ">" !== arg) === true || (taggableMember.id !== bot.user.id) === false) {
                        newArgs.push(arg);
                    }
                });
            }
        }
        console.log(newArgs.join(""));
        console.log(BotSettings.validate.Range(newArgs.join(""), 2, 100, true));
        if(BotSettings.validate.Range(newArgs.join(""), 2, 100, true) === true) {
            let amount = (newArgs.join(""));
            console.log("Purge amount: " + amount);
            message.channel.messages.fetch({
                limit: parseInt(amount)
            }).then(messages => {
                let moment = require("moment");
                let currentDate = moment();
                let cloneDate = currentDate.clone().subtract(14, "days");
                let messageList = messages.filter(m => {return moment(m.createdAt).isAfter(cloneDate)});
                console.log(messageList.size);
                message.channel.bulkDelete(messageList).then(finalMsg => {
                    return resolve({response: `Deleted ${amount} messages in ${message.channel.name}`, silent: false});
                }).catch(err => {
                    console.log(err.message);
                    console.log(err.stack);
                    return resolve({response: "Error in the logs.  Was unable to delete your request.", silent: false});
                });
            }).catch(errMess => {
                console.log(errMess);
                Logger.sendLog("-> Error when trying to fetch messages.  " + errMess.message, "CRITICAL", __filename);
                BotSettings.assist.error("There was an error when trying to fetch the messages.  " + errMess.message, message.channel);
                return resolve({response: "", silent: true});
            });
        } else {
            return resolve({response: "You must enter a number between 2 and 100, inclusive", silet: false});
        }
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: cleanText}
];
