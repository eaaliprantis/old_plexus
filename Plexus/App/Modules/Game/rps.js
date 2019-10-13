const moduleInfo = {
    name: "rpsMod",
    truename: "rpsMod",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "rps",
    cmdName: "rps",
    aliases: ["rps"],
    args: {min: 1, max: 1},
    description: "Rock Paper Scissors.  Play against the bot",
    usage: "[command:str]",
    exampleUsage: "rps rock",
    runIn: ["dm", "text"],
    categories: "Games",
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

rpsCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let choices = ["rock", "paper", "scissor"];
        if(choices.includes(args[0].toLowerCase())) {
            //valid choice
            let pChoice = args[0].toLowerCase();
            function rngGen(arr=[]) {
                if(arr.length === 0) {
                    return null;
                } else {
                    return Math.floor(Math.random() * arr.length);
                }
            }

            function capLetters(word) {
                let S = require("string");
                return S(word).capitalize().s;
            }

            let botChoice = choices[rngGen(choices)].toLowerCase();

            let finalResp = "You chose **" + capLetters(pChoice) + ".** I choose **" + capLetters(botChoice) + "**";
            if(botChoice === pChoice) {
                //draw
                finalResp += "\nIt's a tie!  Please choose another";
            } else {
                //Paper beats Rock
                //Rock beats Scissor
                //Scissor beats Paper
                if(pChoice === "rock") {
                    if(botChoice === "scissor") {
                        //win
                        finalResp += "\n" + capLetters(pChoice) + " wins!";
                    } else {
                        finalResp += "\n" + capLetters(botChoice) + " wins!";
                    }
                }
                if(pChoice === "paper") {
                    if(botChoice === "rock") {
                        //wins
                        finalResp += "\n" + capLetters(pChoice) + " wins!";
                    } else {
                        finalResp += "\n" + capLetters(botChoice) + " wins!";
                    }
                }
                if(pChoice === "scissor") {
                    if(botChoice === "rock") {
                        //lose
                        finalResp += "\n" + capLetters(pChoice) + " wins!";
                    } else {
                        finalResp += "\n" + capLetters(botChoice) + " wins!";
                    }
                }
            }
            return resolve({response: finalResp, silent: false});

        } else {
            return resolve({response: "**Not in the correct choices.** Available choices: " + choices.toString(), silent: false});
        }
        return resolve({response: "", silent: true});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: rpsCmd}
];
