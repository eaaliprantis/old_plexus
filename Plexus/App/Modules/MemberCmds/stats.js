const moduleInfo = {
    name: "Stats",
    truename: "stats",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "stats",
    cmdName: "stats",
    aliases: ["stats", "stat"],
    args: {min: 0, max: 0},
    description: "Get stats on the bot.",
    exampleUsage: "stats",
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

stats = function(bot, message, args, time, prefixUsed, shardId) {
    let moment = require('moment');
    require('moment-duration-format');
    let os = require("os");
    let pretty = require("prettysize");

    return new Promise((resolve, reject) => {
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Plexus Info");
        embed.setDescription("This bot was created using the D.js library. To see all available commands type \`" + prefixUsed + "help\`")
        embed.setColor(0xFF0000);
        let x = BotSettings.assist.getConstants("discord_owners").split(",");
        let y = "";
        x.forEach(x1 => {
            let resolveUser = BotSettings.resolve.User(x1, message, "user", shardId);
            if(resolveUser !== false) {
                y += resolveUser.tag + "\n";
            }
        })
        embed.addField(":spy:**Developers**", y, true);
        embed.addField(":blue_book:**Language**", (process.release.name === "node") ? "NodeJS" : "Legacy-Node", true);
        embed.addField(":clock12:**Uptime**", moment.duration(bot.uptime).format('d[ days], h[ hours], m[ minutes, and ]s[ seconds]'), true);
        embed.addField(":bell:**Memory Usage**", pretty(process.memoryUsage().heapUsed) + "\/" + pretty(process.memoryUsage().heapTotal), true);
        embed.addField(":white_circle:**Ping**", Math.round(bot.ping) + "ms", true);
        embed.addField(":crossed_swords:**Guilds**", bot.guilds.size, true);
        embed.addField(":bust_in_silhouette:**Users (total)**", bot.guilds.reduce((p, c) => p + c.memberCount, 0), true);
        embed.addField("__**Server Stats**__",
        "**Operating System**: " + os.platform() +
        "\n**Total CPUs**: " + os.cpus().length +
        "\n**CPUs**: " + os.cpus()[0].model +
        "\n**OS Uptime**: " + moment.duration(os.uptime()).format('d[ days], h[ hours], m[ minutes, and ]s[ seconds]') +
        "\n**Server Memory Usage**: " + pretty(os.freemem()) + "\/" + pretty(os.totalmem()));
        embed.addField(":e_mail:__**Invite**__", "[Click Here](https:/\/discordapp.com/oauth2/authorize?&client_id=" + bot.user.id + "&scope=bot&permissions=2146958463)", true);
        embed.addField(":question:Questions?  Contact the devs!", "[Click Here](http://discord.gg/XyTNwVz)", true);
        embed.setFooter("Any questions?  Contact the devs at http://discord.gg/XyTNwVz");
        embed.setURL("https:/\/discordapp.com/oauth2/authorize?&client_id=" + bot.user.id + "&scope=bot&permissions=2146958463");
        return resolve({response: "", embed: embed, silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: stats}
];
