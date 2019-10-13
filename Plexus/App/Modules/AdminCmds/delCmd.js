const moduleInfo = {
    name: "delCmd",
    truename: "delCmd",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "delCmd",
    cmdName: "delCmd",
    aliases: ["delcmd", "delcom", "delcommand"],
    args: {min: 1, max: 1},
    description: "Remove a custom command",
    exampleUsage: "delcmd hello",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Admin",
    permlvl: 6,
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

removeCommand = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let sPath = "./App/Storage/commands.json";
        let path = "./../Storage/commands.json";

        let argName = args.shift();
        let validCommand = BotSettings.assist.checkCmd(argName);
        if(validCommand[0] === true) {
            return resolve({response: "Cannot remove command since command name and/or aliases already exist and is not a custom command", silent: false});
        }

        let content = args.join(" ");
        let commands = require(path);

        let fs = require("fs");
        if(!commands[message.guild.id]) {
            commands[message.guild.id] = {};
        }
        if(!commands[message.guild.id]['cmds']) {
            commands[message.guild.id]['cmds'] = {};
        }
        if(commands[message.guild.id]['cmds'][argName]) {
            delete commands[message.guild.id]['cmds'][argName];
        } else {
            delete require.cache[commands];
            return resolve({response: "Custom Command does not exists for this server.  Therefore, cannot delete!", silent:false});
        }

        fs.writeFile(sPath, JSON.stringify(commands), err => {
           if(err) {
               console.log(err.message);
               return resolve({response: "Error: " + err.message, silent: false});
           }
        });
        delete require.cache[commands];
        return resolve({response: "Command " + argName + " was deleted successfully.", silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: removeCommand}
];
