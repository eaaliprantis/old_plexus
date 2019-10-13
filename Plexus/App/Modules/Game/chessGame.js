//http://www.seanyeh.com/subdomains/fenviewer/?fen=

const moduleInfo = {
    name: "chess",
    truename: "chess",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "chess",
    cmdName: "chess",
    aliases: ["chess"],
    args: {min: 1, max: 10},
    description: "Chess Game",
    usage: "[command:str]",
    exampleUsage: "chess challenge [slow] [<@121928183531569153>]",
    runIn: ["text"],
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

chessStart = (fen=null) => {
    let Chess = require("chess.js").Chess;
    let ChessObj = null;
    if(fen === null) {
        //default board
        ChessObj = new Chess();
    } else {
        ChessObj = new Chess(fen);
    }
    return ChessObj;
}

getFenImg = (fenNotation) => {
    if(Math.random() < 0.5) {
        return "http://www.seanyeh.com/subdomains/fenviewer/?fen=" + fenNotation;
    } else {
        return 'http://www.fen-to-image.com/image/20/single/coords/' + fenNotation;
    }
}

getPlatform = () => {
    let os = require("os");
    if(os.platform() === "linux") {
        return true;
    }
    return false;
}

let SIDENAMES = {w: 'Black', b: 'White'};

end_game = (message, opts, resign=false, quiet=false) => {
    return new Promise((resolve, reject) => {
        Database.callStatement("SELECT * FROM chessTbl WHERE platform='" + opts.platform + "' AND user='" + opts.user + "' AND serverId='" + opts.serverId + "' AND gameId='" + opts.gameId + "' LIMIT 1").then(rows => {
            if(rows.length === 0) {
                //unable to find
                return resolve();
            }
            if(!quiet) {
                let winner, winnerColor, winnerObj, winnerId = -1;
                let chessObj = chessStart(opts.fullFen);
                if(resign) {
                    winnerObj = chessObj.turn();
                    winner =  SIDENAMES[winnerObj] + " wins by resignation";
                    winnerColor = (winnerObj === "w") ? "b" : "w";
                    if(winnerObj === "w") {
                        winnerId = 1;
                    } else {
                        winnerId = 0;
                    }
                } else if(chessObj.in_checkmate()) {
                    winnerObj = chessObj.turn();
                    winner = SIDENAMES[winnerObj] + " wins by checkmate.";
                    winnerColor = (winnerObj === "w") ? "b" : "w";
                    if(winnerObj === 'w') {
                        winnerId = 1;
                    } else {
                        winnerId = 0;
                    }
                } else if(chessObj.in_stalemate()) {
                    winnerObj = "Draw";
                    winner = winnerObj + " by stalemate";
                    winnerColor = null;
                    winnerId = 2;
                } else if(chessObj.in_threefold_repetition()) {
                    winnerObj = "Draw";
                    winner = winnerObj + " by threefold repetition!";
                    winnerColor = null;
                    winnerId = 2;
                } else if(chessObj.insufficient_material()) {
                    winnerObj = "Draw";
                    winner = winnerObj + " by insufficient material";
                    winnerColor = null;
                    winnerId = 2;
                } else if(chessObj.in_draw()) {
                    winnerObj = "Draw";
                    winner = winnerObj + "!";
                    winnerColor = null;
                    winnerId = 2;
                }
                opts.winner = winnerId;
                //update database, send message
                chessUpdate(message, opts).then((data) => {
                    let userId = "", loserId = "", ai = false, aiWin = false;
                    if(winnerId === 0) {
                        userId = opt.user;
                        loserId = opt.gameAgainst;
                    } else if(winnerId === 1) {
                        userId = opt.gameAgainst;
                        loserId = opt.user;
                        if(userId === "ai") {
                            ai = true;
                            aiWin = true;
                        }
                    } else {
                        userId = null;
                    }
                    if(winnerId === 1 && opt.gameAgainst === 'ai') {
                        aiWin = true;
                    }
                    if(opt.gameAgainst === "ai") {
                        ai = true;
                    }
                    let winnerContent = {
                        winnerId: winnerId,
                        user: userId,
                        ai: ai,
                        loser: loserId,
                        aiWinner: aiWin,
                        response: winner
                    }
                    return resolve({data: data, info: winnerContent, opts: opts});
                }).catch(errData => {
                    return reject(errData);
                });
            }
        }).catch(errRows => {
            return reject(errRows);
        });
    });
}

getChessEngine = () => {
    let Engine = require("node-uci").Engine;
    if(getPlatform()) {
        if(!BotSettings.hasOwnProperty("chess")) {
            BotSettings.chess = {};
        }
        if(!BotSettings.chess.hasOwnProperty("stockfish")) {
            BotSettings.chess.stockfish = null;
            let stockFish = new Engine(BotSettings.assist.getConstants("stockfish"));
            stockFish.init();
            stockFish.setoption("MultiPV", 3);
            BotSettings.chess.stockfish = stockFish;
        }
        return BotSettings.chess.stockfish;
    } else {
        return null;
    }
}

chessUpdate = (message, opts, adding=false) => {
    return new Promise((resolve, reject) => {
        function generateQuery(query, queryType='insert', opts) {
            let c = ",";
            let q = "'";
            queryType = queryType.toLowerCase();
            if(queryType === 'insert') {
                //init query
                query += "(";

                //middle part
                query += q + opts.discord + q;
                query += c;
                query += q + opts.user + q;
                query += c;
                query += q + opts.serverId + q;
                query += c;
                query += q + opts.gameType + q;
                query += c;
                query += q + opts.gameId + q;
                query += c;
                query += q + opts.gameAgainst + q;
                query += c;
                query += q + opts.gameFinished + q;
                query += c;
                query += q + opts.currentFen + q;
                query += c;
                query += q + opts.fullFen + q;
                query += c;
                query += q + opts.isThinking + q;
                //end query
                query += ")";
            } else if(queryType === 'update') {

                //set what?
                query += "gameType=" + q + opts.gameType + q;
                query += c;
                query += "gameFinished=" + q + opts.gameFinished + q;
                query += c;
                query += "currentFen=" + q + opts.currentFen + q;
                query += c;
                query += "fullFen=" + q + opts.fullFen + q;
                query += c;
                query += "winner=" + q + opts.winner + q;
                query += c;
                query += "isThinking=" + q + opts.isThinking + q;

                //where clause
                query += " WHERE gameId='" + opts.gameId + "' AND platform='" + opts.platform + "' AND user='" + opts.user + "' AND serverId='" + opts.serverId + "'";
            }
            return query;
        }

        if(adding) {
            let tmpQuery = "INSERT INTO chessTbl (platform, user, serverId, gameType, gameId, gameAgainst, gameFinished, currentFen, fullFen, isThinking) VALUES ";
            let query = generateQuery(tmpQuery, 'insert', opts);
            Database.callStatement(query).then((row) => {
                return resolve({data: row, success: true});
            }).catch(errRow => {
                Logger.sendLog("There was an error with inserting the DB..... " + errRow, "CRITICAL", __filename);
                return reject(errRow);
            })
        } else {
            //not adding, updating
            let tmpQuery = "UPDATE chessTbl SET ";
            let query = generateQuery(tmpQuery, 'update', opts);
            Database.callStatement(query).then((row) => {
                return resolve({data: row, success: true});
            }).catch(errRow => {
                Logger.sendLog("There was an error with updating the DB..... " + errRow, "CRITICAL", __filename);
                return reject(errRow);
            })
        }
    });
}

getNextGameId = (message, gameTypeId, guild=false) => {
    return new Promise((resolve, reject) => {
        let gameAgainst = "";
        if(gameTypeId === 0) {
            gameAgainst = "ai";
        }
        let queryStatement = "SELECT gameId FROM chessTbl WHERE platform='discord' AND user='" + message.author.id;
        if(guild) {
            queryStatement += "' AND serverId='" + message.guild.id + "'";
        }
        Database.callStatement(queryStatement).then((rows) => {
            if(rows.length >= 1) {
                let highestId = rows.sort((a, b) => {
                    if(a.gameId > b.gameId) return 1;
                    if(a.gameId < b.gameId) return -1;
                    return 0;
                });
                return resolve({value: parseInt(highestId[0].gameId) + 1, data: highestId, error: false});
            }
            return resolve({value: 1, data: [], error: false});
        }).catch(errRows => {
            Logger.sendLog("There was an error when retrieving the data.... " + errRows, "CRITICAL", __filename);
            return reject(errRows);
        });
    })
}

chessCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let availOpts = ["challenge", "accept", "resign", "status", "games", "move"];
        let defaultTime = 300; //seconds
        let gameOpts = ['ai', 'slow', 'timed'];
        let argOpt = args.shift();
        let finalOpts = {
            platform: 'discord',
            user: message.author.id,
            serverId: message.guild.id,
            gameId: -1,
            gameType: 0,
            gameAgainst: 0,
            gameFinished: 0,
            currentFen: "",
            fullFen: "",
            gameFinished: 0,
            isThinking: 0,
            winner: -1
        }
        argOpt = argOpt.toLowerCase();
        if(availOpts.includes(argOpt)) {
            //valid option
            if(argOpt === "challenge" && args.length >= 1 && args.length <= 2) {
                //valid
                let argOpt2 = args.shift();
                argOpt2 = argOpt2.toLowerCase();
                if(gameOpts.includes(argOpt2)) {
                    //valid again.....
                    if(argOpt2 === "ai" && args.length === 1) {
                        let chessBoard = chessStart();
                        let notation = args.shift();
                        if(chessBoard.move(notation, {sloppy: true}) === null) {
                            BotSettings.assist.error("Invalid move!  Valid moves are: " + chessBoard.moves().join(", "), message.channel, message.author, getFenImg(chessBoard.fen().split(' ')[0]));
                            return resolve({response: "", silent: true});
                        } else {
                            //new FEN needed
                            let newFen = chessBoard.fen();
                            finalOpts.gameType = 0;
                            let chessEngine = getChessEngine();
                            if(chessEngine === null) {
                                BotSettings.assist.error("The StockFish Engine was not installed or initiated for some reason.  Please try again.", message.channel, message.author);
                                return resolve({response: "", silent: true});
                            }
                            getNextGameId(message, finalOpts.gameType, true).then((data) => {
                                finalOpts.gameId = data.value;
                                finalOpts.currentFen = newFen.split(' ')[0];
                                finalOpts.fullFen = newFen;
                                finalOpts.gameType = 0;
                                finalOpts.gameAgainst = 0; //ai = 0
                                finalOpts.gameFinished = 0;
                                finalOpts.isThinking = 1;
                                chessUpdate(message, finalOpts, true).then((dataFin) => {
                                    let chain = BotSettings.chess.stockfish.chain().position(finalOpts.fullFen).go({depth: 5}).then((result) => {
                                        let match = result.bestmove.match(/^([a-h][1-8])([a-h][1-8])([qrbn])?/);
                                        if(match) {
                                            let m = chessBoard.move({from: match[1], to: match[2], promtion: match[3]});
                                            let embed = new Discord.MessageEmbed();
                                            embed.setImage(getFenImg(chessBoard.fen().split(' ')[0]));
                                            embed.setDescription("I have just moved from " + match[1] + " to " + match[2] + " with a promotion of " + match[3]);
                                            embed.setTitle("Your move");
                                            finalOpts.currentFen = chessBoard.fen().split(' ')[0];
                                            finalOpts.fullFen = chessBoard.fen();
                                            finalOpts.isThinking = 0;
                                            if(chessBoard.game_over()) {
                                                finalOpts.isThinking = 0;
                                                finalOpts.gameFinished = 1;
                                                end_game(message, finalOpts, false, false).then((content) => {
                                                    let finalData = content;
                                                    if(finalData.info.ai === true) {
                                                        //against an AI
                                                        if(finalData.info.aiWinner === false) {
                                                            //AI did not win
                                                            let embed = new Discord.MessageEmbed();
                                                            embed.setTitle("Congrats!");
                                                            embed.setColor("RANDOM");
                                                            if(finalData.info.user === null) {
                                                                embed.setTitle("Draw!");
                                                                embed.setDescription("No one won!  The reason no one won is because: \n**" + finalData.info.response + "**");
                                                                return resolve({response: message.author, embed: embed, silent: false});
                                                            } else {
                                                                embed.setDescription("<@" + finalData.info.user + "> won against " + finalData.info.loser.replace("ai", "AI")  + " for the following reason.\n  " + finalData.info.response);
                                                                return resolve({response: message.author, embed: embed, silent: false});
                                                            }
                                                        } else {
                                                            let embed = new Discord.MessageEmbed();
                                                            embed.setTitle("Congrats!");
                                                            embed.setColor("RANDOM");
                                                            if(finalData.info.user === null) {
                                                                embed.setTitle("Draw!");
                                                                embed.setDescription("No one won!  The reason no one won is because: \n**" + finalData.info.response + "**");
                                                                return resolve({response: message.author, embed: embed, silent: false});
                                                            } else {
                                                                embed.setTitle("Lost!");
                                                                embed.setDescription("<@" + finalData.info.loser + "> lost against " + finalData.info.user.replace("ai", "AI") + " for the following reason.\n  " + finalData.info.response);
                                                                return resolve({response: message.author, embed: embed, silent: false});
                                                            }
                                                        }
                                                    } else {
                                                        let embed = new Discord.MessageEmbed();
                                                        embed.setTitle("Congrats!");
                                                        embed.setColor("RANDOM");
                                                        embed.setDescription("<@" + finalData.info.user + "> won against <@" + finalData.info.loser + "> for the following reason.\n " + finalData.info.response);
                                                        return resolve({response: "<@" + finalData.info.user + "> and <@" + finalData.info.loser + ">", embed: embed, silent: false});
                                                    }
                                                }).catch(errData => {
                                                    Logger.sendLog("Error with updating the Game for some reason.  " + errData, "CRITICAL", __filename);
                                                    BotSettings.assist.error("There was an error for some reason in the Update.... " + errData, message.channel, message.author);
                                                    return resolve({response: "", silent: true});
                                                });
                                            } else {
                                                chessUpdate(message, finalOpts).then((dataFin) => {
                                                    embed.setImage(getFenImg(finalOpts.currentFen));
                                                    return resolve({response: message.author, embed: embed, silent: false});
                                                }).catch(errFin => {
                                                    Logger.sendLog("Error with updating the Game for some reason.  " + errFin, "CRITICAL", __filename);
                                                    BotSettings.assist.error("There was an error for some reason in the Update.... " + errFin, message.channel, message.author);
                                                    return resolve({response: "", silent: true});
                                                });
                                            }
                                        }
                                    });
                                }).catch(errFin => {
                                    Logger.sendLog("Error with updating the Game for some reason.  " + errFin, "CRITICAL", __filename);
                                    BotSettings.assist.error("There was an error for some reason in the Update.... " + errFin, message.channel, message.author);
                                    return resolve({response: "", silent: true});
                                });
                            }).catch(errData => {
                                Logger.sendLog("Error when trying to get data.... " + errData, "CRITICAL", __filename);
                                BotSettings.assist.error("There was an error for some reason.  Please try again.... " + errData, message.channel);
                                return resolve({response: "", silent: true});
                            })
                        }
                    } else if(argOpt2 === "ai" && args.length !== 1){
                        BotSettings.assist.error("You are missing an argument which would be a notation to move.  Please try again.", message.channel);
                        return resolve({response: "", silent: true});
                    }
                } else {
                    BotSettings.assist.error("We were unable to figure out what you were looking for.  Available options:\n" + gameOpts.join("\n"), message.channel);
                }
            }
        } else {
            BotSettings.assist.error("Unable to figure out what move you would like to do.  Available options:\n" + availOpts.join("\n"), message.channel);
            return resolve({response: "", silent: true});
        }
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: chessCmd}
];
