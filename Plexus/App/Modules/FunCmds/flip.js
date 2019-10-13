const moduleInfo = {
    name: "Flip",
    truename: "flip",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "flip",
    cmdName: "flip",
    aliases: ["flip", "coin", "coinflip"],
    args: {min: 0, max: 0},
    description: "Flip a coin",
    exampleUsage: "flip",
    usage: "[command]",
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

flipCoin = () => {
    var Random = require("random-js");
    var random = new Random(Random.engines.mt19937().autoSeed());
    return (parseInt(random.integer(1,2)) % 2 === 0 ? 'Heads!' : 'Tails');
}

flip = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let answer = flipCoin();
        let colorChoice = "";
        if(answer.toLowerCase() === "heads!") {
            colorChoice = "RED";
        } else {
            colorChoice = "BLUE";
        }
        let embed = new Discord.MessageEmbed();
        embed.setColor(colorChoice);
        embed.setThumbnail("https://img.clipartfest.com/b4a7c56663f7778b2ec8e8b21dae6fcd_9bda0a2f896ebee89989d1925a202f-flip-a-coin-clip-art_308-480.png");
        embed.setDescription(`${message.author.username} flipped a coin.`);
        embed.addField(`**It landed on**`, answer);
        return resolve({response: "", embed: embed, silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: flip}
];
