const moduleInfo = {
    name: "scrabble",
    truename: "scrabble",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "scrabble",
    cmdName: "scrabble",
    aliases: ["scrabble", "scrabblegame"],
    args: {min: 1, max: 100},
    description: "Scrabble Game",
    exampleUsage: "scrabble help",
    usage: "[command:str]",
    runIn: ["text"],
    categories: "Games",
    permlvl: 7,
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

scrabbleAllLetters = () => {
    return {
        'a': {value: 1, count: 3},
        'b': {value: 3, count: 1},
        'c': {value: 3, count: 2},
        'd': {value: 2, count: 3},
        'e': {value: 1, count: 3},
        'f': {value: 4, count: 2},
        'g': {value: 2, count: 3},
        'h': {value: 4, count: 2},
        'i': {value: 1, count: 3},
        'j': {value: 8, count: 1},
        'k': {value: 5, count: 1},
        'l': {value: 1, count: 3},
        'm': {value: 3, count: 2},
        'n': {value: 1, count: 3},
        'o': {value: 1, count: 3},
        'p': {value: 3, count: 2},
        'q': {value: 10, count: 1},
        'r': {value: 1, count: 3},
        's': {value: 1, count: 3},
        't': {value: 1, count: 3},
        'u': {value: 1, count: 3},
        'v': {value: 4, count: 2},
        'w': {value: 4, count: 2},
        'x': {value: 8, count: 1},
        'y': {value: 4, count: 2},
        'z': {value: 10, count: 1},
        '_': {value: 0, count: 2},
    };
}

scrabbleBlankBoard = () => {
    let board = [
    [ //row a
     { LS:1, WS:3, data: ""},
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:3, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:3, data: "" }
    ],
    [ //row b
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:3, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:3, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" }
    ],
     [ //row c
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" }
    ],
    [ //row d
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" }
    ],
    [ //row e
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" }
    ],
    [ //row f
     { LS:1, WS:1, data: "" },
     { LS:3, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:3, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:3, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:3, WS:1, data: "" },
     { LS:1, WS:1, data: "" }
    ],
    [ //row g
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" }
    ],
    [ //row h
     { LS:1, WS:3, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:3, data: "" }
    ],
    [ //row i
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" }
    ],
    [ //row j
     { LS:1, WS:1, data: "" },
     { LS:3, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:3, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:3, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:3, WS:1, data: "" },
     { LS:1, WS:1, data: "" }
    ],
    [ //row k
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" }
    ],
    [ //row l
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" }
    ],
    [ //row m
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" }
    ],
    [ //row n
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:3, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:3, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:2, data: "" },
     { LS:1, WS:1, data: "" }
    ],
    [ //row o
     { LS:1, WS:3, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:3, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:2, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:1, data: "" },
     { LS:1, WS:3, data: "" }
    ]
    ];
    return board;
}

scrabbleBlankCanvas = () => {
    return new Promise((resolve, reject) => {
        try {
            let fs = require("fs");
            let path = require("path");

            let dirName = __dirname;
            let fileName = path.join(__dirname, "..", "..", "Storage", "BlankScrabbleBoard.png");

            let Canvas = require("canvas");
            let Image = Canvas.Image;
            let img = new Image();
            img.src = fileName;
            console.log("image: " + img.src);
            console.log(img.width + " | " + img.height);
            let canvas = new Canvas(img.width, img.height);
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            return resolve({error: false, response: canvas.toBuffer()});
        } catch(e) {
            return reject({error: true, response: e});
        }
    });
}

scrabbleCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let optChoice = args.shift();
        optChoice = optChoice.toLowerCase();
        if(optChoice === "bboard") {
            scrabbleBlankCanvas().then((canvasImg) => {
                if(canvasImg.error === false) {
                    message.channel.send(message.author + ", this is the blank board that you requested.", {files: [{attachment: canvasImg.response}]}).then(() => {
                        return resolve({response: "", silent: true});
                    }).catch(errMsg => {
                        Logger.sendLog("-> Error when sending message .... " + errMsg, "CRITICAL", __filename);
                        return resolve({response: "", embed: embed, silent: false});
                    });
                } else {
                    BotSettings.assist.error("There was an error with the image.", message.channel);
                    return resolve({response: "", silent: true});
                }
            }).catch(errImg => {
                Logger.sendLog("-> Error with image: " + errImg, "CRITICAL", __filename);
                BotSettings.assist.error("There was an error..... " + errImg, message.channel);
                return resolve({response: "", silent: true});
            });
        } else {
            return resolve({response: "Command coming soon", silent: false});
        }
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: scrabbleCmd}
];
