const moduleInfo = {
    name: "addCmd",
    truename: "addCmd",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "addCmd",
    cmdName: "addCmd",
    aliases: ["addcmd", "addcom", "addcommand"],
    args: {min: 2, max: 100},
    description: "Add a custom command",
    usage: "[command:str]",
    exampleUsage: "addcmd hello Hello",
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

addCommand = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let sPath = "./App/Storage/commands.json";
        let path = "./../Storage/commands.json";

        let argName = args.shift();
        let validCommand = BotSettings.assist.checkCmd(argName);
        if(validCommand[0] === true) {
            return resolve({response: "Cannot create command since command name and/or aliases already exist", silent: false});
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
        if(!commands[message.guild.id]['cmds'][argName]) {
            commands[message.guild.id]['cmds'][argName] = content;
        } else {
            delete require.cache[commands];
            return resolve({response: "Custom Command already exists.  Cannot create!", silent:false});
        }

        fs.writeFile(sPath, JSON.stringify(commands), err => {
           if(err) {
               console.log(err.message);
               return resolve({response: "Error: " + err.message, silent: false});
           }
        });
        delete require.cache[commands];
        return resolve({response: "Command " + argName + " was added successfully.", silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: addCommand}
];
