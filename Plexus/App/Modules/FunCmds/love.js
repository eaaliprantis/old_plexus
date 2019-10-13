const moduleInfo = {
    name: "love",
    truename: "love",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "love",
    cmdName: "love",
    aliases: ["love", "chemistry"],
    args: {min: 2, max: 2},
    description: "See how much chemistry that you have with someone else",
    example: "love name1 name2",
    exampleUsage: "love name1 name2",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Fun",
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

loveMe = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let request = require("request");
        let unirest = require("unirest");

        let name1 = args[0];
        let name2 = args[1];
        unirest.get("https://love-calculator.p.mashape.com/getPercentage?fname="+name1+"&sname="+name2)
        .header("X-Mashape-Key", BotSettings.assist.getConstants("mashape"))
        .header("Accept", "application/json")
        .end(function (result) {
            let startMsg = "The chemistry between these two love birds are: " + result.body.percentage + "%";
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Love Calculator - " + result.body.percentage);
            embed.setDescription(startMsg);
            embed.setColor("RED");
            embed.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/1200px-Heart_coraz%C3%B3n.svg.png");
            return resolve({response: "", embed: embed, silent: false});
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: loveMe}
];
