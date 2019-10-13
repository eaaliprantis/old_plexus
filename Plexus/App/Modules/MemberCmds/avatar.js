const moduleInfo = {
    name: "avatar",
    truename: "avatar",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "avatar",
    cmdName: "avatar",
    aliases: ["avatar"],
    args: {min: 0, max: 1},
    description: "Display the avatar of you or a user",
    exampleUsage: "avatar @eaaliprantis#2160\navatar",
    usage: "[command]",
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

avatar = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        if(message.mentions.members.size === 2) {
            //itself and another tag.....
            let enteredLoop = false;
            message.mentions.members.forEach((member) => {
                if(BotSettings.assist.isSelfBot(member) === false && enteredLoop === false) {
                    user = member;
                    enteredLoop = true;
                }
            });
        } else {
            if(message.mentions.members.size === 1) {
                user = message.mentions.members.first();
                if(BotSettings.assist.isSelfBot(user) === true) {
                    user = message.member;
                }
            }
        }
        if(!user || user === "") {
            user = message.member;
        }
        if(user === null) {
            BotSettings.assist.error("Please input a valid user", message.channel);
            return resolve({response: "", embed: "", silent: true});
        } else {
            let embed = new Discord.MessageEmbed();
            embed.setColor(0x2885bd);
            if(args.length === 0) {
                embed.setImage(message.author.avatarURL);
            } else {
                embed.setImage(user.avatarURL);
            }
            return resolve({response: "", embed: embed, silent: false});
        }
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: avatar}
];
