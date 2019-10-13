const moduleInfo = {
    name: "roll",
    truename: "roll",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usageRoll = {
    name: "roll",
    cmdName: "roll",
    aliases: ["roll", "roll"],
    args: {min: 1, max: 25},
    description: "Roll a dice",
    exampleUsage: "roll 15\nroll 5d6\nroll d6",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Fun",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageDate = {
    name: "randomdate",
    cmdName: "randomdate",
    aliases: ["randomdate", "rdate", "random"],
    args: {min: 2, max: 2},
    description: "Roll a random date between <date1> and <date2>",
    exampleUsage: "randomdate 06/18/2017 09/18/2017",
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

rollCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let Roll = require("roll");
        let roll = new Roll();
        let dice = args.join(" ");
        dice = dice.replaceAll(/ /g, '');

        let valid = roll.validate(dice);
        if(!valid) {
            BotSettings.assist.error("We tried to roll " + dice + " but it is not in the correct format.", message.channel, message.author);
            return resolve({response: "", silent: true});
        }
        let rolledDice = roll.roll(dice);

        let diceResult = "";
        let individualResult = rolledDice.rolled;
        let sumOfRolls = rolledDice.result;

        let embed = new Discord.MessageEmbed();
        embed.setColor("RANDOM");
        embed.setTitle("Roll");
        embed.setDescription("**:game_die: Dice Roll**: " + message.author + " rolled a " + sumOfRolls + " on " + dice + "\n**Individual Results**: " + individualResult.join(", "));
        return resolve({response: message.author, embed: embed, silent: false});
    })
}

oldRollCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        var Random = require("random-js");
        var random = new Random(Random.engines.mt19937().autoSeed());
        let min = 0, max = 0;
        if(args.length === 2) {
            if(BotSettings.validate.FloatUnrestrict(args[0]) === true && BotSettings.validate.FloatUnrestrict(args[1])) {
                let minMaxArg = BotSettings.resolve.MinMax(args[0], args[1]);
                if(minMaxArg === null) {
                    BotSettings.assist.error("Your responses must be a number (float).", message.channel);
                    return resolve({response: "", silent: true});
                }
                min = parseFloat(minMaxArg.min);
                max = parseFloat(minMaxArg.max);
                let embed = new Discord.MessageEmbed();
                embed.setColor("RANDOM");
                embed.setTitle("Roll");
                embed.setDescription("you rolled: " + parseFloat(random.real(min, max, true).toFixed(2)));
                return resolve({response: message.author, embed: embed, silent: false});
            } else {
                BotSettings.assist.error("Your responses must be a number (float).", message.channel);
                return resolve({response: "", silent: true});
            }
        } else {
            if(BotSettings.validate.FloatUnrestrict(args[0]) === true) {
                max = parseFloat(args[0]);
                let embed = new Discord.MessageEmbed();
                embed.setColor("RANDOM");
                embed.setTitle("Roll");
                embed.setDescription("you rolled: " + parseFloat(random.real(min, max, true).toFixed(2)));
                return resolve({response: message.author, embed: embed, silent: false});
            } else {
                BotSettings.assist.error("Your responses must be a number (float).", message.channel);
                return resolve({response: "", silent: true});
            }
        }
    });
}

diceRoll = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        var Random = require("random-js");
        var random = new Random(Random.engines.mt19937().autoSeed());
        let sideCount = 0, dieCount = 0;
        if(args.length === 2) {
            if(BotSettings.validate.Integer(args[0]) === true && BotSettings.validate.Integer(args[1])) {
                sideCount = parseInt(args[0]);
                dieCount = parseInt(args[1]);
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Rolling a dice");
                let groupObj = BotSettings.assist.GroupArray(random.dice(sideCount, dieCount, true));
                let arrContent = "";
                Object.keys(groupObj).forEach(val => { arrContent += "\n**" + val + "**  | " + groupObj[val]})
                embed.setDescription("The number of rolls (" + dieCount + ") with sides (" + sideCount + ") is: \n" + arrContent);
                //message.reply("The number of rolls (" + dieCount + ") with sides (" + sideCount + ") is: " + (random.dice(sideCount, dieCount, true)));
                return resolve({response: "", embed: embed, silent: false});
            } else {
                BotSettings.assist.error("Your responses must be a number (integer).", message.channel);
                return resolve({response: "", silent: true});
            }
        } else {
            if(BotSettings.validate.Integer(args[0]) === true) {
                sideCount = parseInt(args[0]);
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Dice");
                embed.setDescription("you rolled: " + random.die(sideCount));
                embed.setColor("RANDOM");
                return resolve({response: message.author, embed: embed, silent: false});
            } else {
                BotSettings.assist.error("Your responses must be a number (integer).", message.channel);
                return resolve({response: "", silent: true});
            }
        }
    });
}

dateRandomCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        var Random = require("random-js");
        let moment = require("moment");
        var random = new Random(Random.engines.mt19937().autoSeed());
        let date1 = "", date2 = "";
        console.log(BotSettings.validate.Date(args[0])[0]);
        console.log(BotSettings.validate.Date(args[1])[0]);
        if(BotSettings.validate.Date(args[0])[0] === true && BotSettings.validate.Date(args[1])[0] && args[0].includes("/") && args[1].includes("/") === true) {
            date1 = moment(new Date(args[0]), "MM/DD/YYYY");
            date2 = moment(new Date(args[1]), "MM/DD/YYYY");
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Random Date");
            let randomDate = random.date(new Date(date1), new Date(date2));
            console.log(randomDate);
            embed.setDescription("Random date chosen: " + moment(new Date(randomDate)).format("LLLL"));
            embed.setColor("RANDOM");
            return resolve({response: "", embed: embed, silent: false});
        } else {
            BotSettings.assist.error("Your responses must be a date (date). Invalid date format.  Format should be 06/18/2017 or 6/18/2017", message.channel);
            return resolve({response: "", silent: true});
        }
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageRoll.aliases, args: usageRoll.args, usage: usageRoll, run: rollCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageDate.aliases, args: usageDate.args, usage: usageDate, run: dateRandomCmd}
];
