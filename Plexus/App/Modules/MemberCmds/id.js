const moduleInfo = {
    name: "id",
    truename: "id",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "id",
    cmdName: "id",
    aliases: ["id", "myid"],
    args: {min: 0, max: 1},
    description: "Get the id of myself or another person.",
    exampleUsage: "id @eaaliprantis#2160\nid",
    usage: "[command:str]",
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

idCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let user = message.mentions.members.first();
        let startMsg = "";
        if(!user) {
            user = message.member;
            startMsg = "Your Discord ID is: " + user.user.id;
        } else {
            startMsg = "The user's Discord ID is: " + user.user.id;
        }
        return resolve({response: startMsg, silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: idCmd}
];
