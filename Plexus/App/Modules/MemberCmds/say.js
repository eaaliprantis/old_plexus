const moduleInfo = {
    name: "say",
    truename: "say",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "say",
    cmdName: "say",
    aliases: ["say", "guildsay", "ownersay"],
    args: {min: 1, max: 1500},
    description: "Allows an admin to say something through the bot.",
    exampleUsage: "say Hello Manny",
    usage: "[command]",
    runIn: ["dm", "text"],
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

sayCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let channel = message.mentions.channels.first();
        if(message.mentions.channels.size >= 2) {
            BotSettings.assist.error("You can only tag 1 channel for you to make an announcement in....", message.channel);
            return resolve({response: "", embed: "", silent: true});
        }
        let customChannel = false;
        if(!channel) {
            channel = message.channel;
        } else {
            customChannel = true;
            if(args.includes("<#" + channel.id + ">")) {
                console.log("Channel inside args....");
                for(let i = 0; i < args.length; i++) {
                    if(args[i] === "<#" + channel.id + ">") {
                        delete args.splice(i, 1);
                        break;
                    }
                }
            } else {
                console.log("Channel not in args.....");
            }
        }
        if(customChannel === true) {
            channel.send(args.join(" "));
            message.delete();
            return resolve({response: "", silent: true});
        }
        message.delete();
        return resolve({response: args.join(" "), silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: sayCmd}
];
