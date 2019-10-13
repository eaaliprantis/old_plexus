const moduleInfo = {
    name: "cards",
    truename: "cards",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "cards",
    cmdName: "cards",
    aliases: ["cards", "randomcard"],
    args: {min: 1, max: 1},
    description: "Randomly chooses the number of cards that you want",
    exampleUsage: "cards 15\n**Note**: max number is 52",
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

cardCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let numArg = args.shift();
        let Shuffle = require("shuffle");
        let deck = Shuffle.shuffle();
        let maxDeck = Math.floor(deck.length);
        if(BotSettings.validate.Integer(numArg) === true && BotSettings.validate.Range(parseInt(numArg), 1, maxDeck, true, "integer") === true) {
            numArg = parseInt(numArg);
            let hand = deck.draw(numArg);
            let cardOrg = {
                "H": "hearts",
                "D": "diamonds",
                "S": "spades",
                "C": "clubs"
            }
            let cardOpt = {
                "diamond": "D",
                "heart": "H",
                "spade": "S",
                "club": "C"
            }
            let dEmoji = require("discord-emoji");
            let fullList = [];
            hand.forEach(cardHand => {
                let handShorten = cardHand.toShortDisplayString();
                let cardLetter = cardOpt[cardHand.suit.toLowerCase()];
                let cardSym = dEmoji.symbols[cardOrg[cardLetter]];
                let cardFinal = handShorten.replace(cardLetter, " " + cardSym);
                fullList.push(cardFinal);
            });

            let embed = new Discord.MessageEmbed();
            embed.setThumbnail("http://www.poker-vibe.com/poker/terms/cut/Cut-the-Deck.jpg");
            if(fullList.length >= (Math.floor(deck.length/2))) {
                //greater than or equal to half the deck
                let newArr = BotSettings.resolve.distributeArray(fullList, 4);
                let loopC = 0;
                newArr.forEach(arrEle => {
                    embed.addField("Batch " + (loopC + 1), arrEle.join(", "), true);
                    loopC++;
                });
                return resolve({response: message.author, embed: embed, silent: false});
            } else {
                //less than half the deck
                let newArr = BotSettings.resolve.distributeArray(fullList, 2);
                let loopC = 0;
                newArr.forEach(arrEle => {
                    embed.addField("Batch " + (loopC + 1), arrEle.join(", "), true);
                    loopC++;
                });
                return resolve({response: message.author, embed: embed, silent: false});
            }
        } else {
            BotSettings.assist.error("Invalid entry.  Must be a number between 1 and " + maxDeck, message.channel);
            return resolve({response: "", silent: true});
        }
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: cardCmd}
];
