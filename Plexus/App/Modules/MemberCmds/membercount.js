const moduleInfo = {
    name: "membercount",
    truename: "membercount",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "membercount",
    cmdName: "membercount",
    aliases: ["membercount", "members", "countmembers"],
    args: {min: 0, max: 0},
    description: "Returns information about how many users are in the guild.",
    exampleUsage: "membercount",
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

memCount = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let stats = BotSettings.assist.serverSpecs(message.guild);
        let embed = new Discord.MessageEmbed();
        let totalMem = (stats.member.total !== undefined) ? stats.member.total : "0";
        if(parseInt(totalMem) <= 9) {
            totalMem = "0" + totalMem;
        }
        let online = (stats.presence.online !== undefined) ? stats.presence.online : "0";
        if(parseInt(online) <= 9) {
            online = "0" + online;
        }
        let offline = (stats.presence.offline !== undefined) ? stats.presence.offline : "0";
        if(parseInt(offline) <= 9) {
            offline = "0" + offline;
        }
        let idle = (stats.presence.idle !== undefined) ? stats.presence.idle :  "0";
        if(parseInt(idle) <= 9) {
            idle = "0" + idle;
        }
        let dnd = (stats.presence.dnd !== undefined) ? stats.presence.dnd : "0";
        if(parseInt(dnd) <= 9) {
            dnd = "0" + dnd;
        }
        let humans = (stats.member.memberCount !== undefined) ? stats.member.memberCount : "0";
        if(parseInt(humans) <= 9) {
            humans = "0" + humans;
        }
        let bots = (stats.member.botCount !== undefined) ? stats.member.botCount : "0";
        if(parseInt(bots) <= 9) {
            bots = "0" + bots;
        }
        embed.setTitle("Member Count");
        let resp = "• **Members:\t**      " + totalMem + "\n";
        resp += "• **Online:\t**            " + online + "\n";
        resp += "• **Offline:\t**           " + offline + "\n";
        resp += "• **Humans:\t**         " + humans + "\n";
        resp += "• **Bots:\t**               " + bots + "\n";
        resp += "• **Idle:\t**                 " + idle + "\n";
        resp += "• **Dnd:\t**                 " + dnd + "\n";

        embed.addField("Members :busts_in_silhouette:", totalMem, true);
        embed.addField("Online :white_check_mark:", online, true);
        embed.addField("Offline :x:", offline, true);
        embed.addField("Humans :bust_in_silhouette: ", humans, true);
        embed.addField("Bots :robot:", bots, true);
        embed.addField("Idle :warning: ", idle, true);
        embed.addField("Dnd :red_circle: ", dnd, true);
        embed.setColor("RANDOM");
        let moment = require("moment");
        embed.setFooter(moment().format("LLLL"));
        return resolve({response: "", embed: embed, silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: memCount}
];
