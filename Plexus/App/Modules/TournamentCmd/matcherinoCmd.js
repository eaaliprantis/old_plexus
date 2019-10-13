const moduleInfo = {
    name: "matcherino",
    truename: "matcherino",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usageMatcherino = {
    name: "matcherino",
    cmdName: "matcherino",
    aliases: ["matcherino", "matcherino"],
    args: {min: 0, max: 10},
    description: "Get Matcherino code",
    usage: "[command:str]",
    exampleUsage: "matcherino",
    runIn: ["text"],
    categories: "Matcherino",
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
/*
var request = require('request');

request.post(
   'https://matcherino.com/__api/bounties/findById',
   { json: { 8146: true } },
   function (error, response, body) {
       if (!error && response.statusCode == 200) {
           console.log(body)
       }
   }
);
*/
getContent = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        Database.callStatement("SELECT matcherino_auth, matcherino_link, matcherino_desc FROM settings WHERE platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(rows => {
            if(rows.length === 1) {
                let matcherino = {};
                matcherino.auth = rows[0].matcherino_auth;
                matcherino.link = rows[0].matcherino_link; //https://matcherino.com/tournaments/7601
                matcherino.desc = rows[0].matcherino_desc;
                if(matcherino.auth === null || matcherino.link === null) {
                    BotSettings.assist.error("You must set your matcherino authentication token.  Please use the settings command.", message.channel);
                    return resolve({response: "", silent: true});
                } else {
                    return resolve({response: matcherino.link.split("/")[matcherino.link.split("/").length - 1], error: false});
                }
            } else {
                return resolve({response: null, error: true})
            }
        });
    })
}

getCodes = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        Database.callStatement("SELECT matcherino_auth, matcherino_link, matcherino_desc FROM settings WHERE platform='discord' AND server='" + message.guild.id + "' LIMIT 1").then(rows => {
            if(rows.length === 1) {
                let matcherino = {};
                matcherino.auth = rows[0].matcherino_auth;
                matcherino.link = rows[0].matcherino_link; //https://matcherino.com/tournaments/7601
                matcherino.desc = rows[0].matcherino_desc;
                if(matcherino.auth === null || matcherino.link === null) {
                    BotSettings.assist.error("You must set your matcherino authentication token.  Please use the settings command.", message.channel);
                    return resolve({response: "", silent: true});
                }
                //https://matcherino.com/__api/bounties/getDynamicCode?bountyId=7601&auth=7pbcPUfTDUTEsCPXpkbAqTultfA0Hs8pdwr4EO1zquqGTXiQ0uc6GuQRhFwNS17R
                //https://matcherino.com/__api/coupons/findByCode?code=tkyn //somehow doesn't work (to the left, but top does)
                function formatMatcherino(_auth, _tournamentId) {
                    return new Promise((resolve, reject) => {
                        let request = require("request");
                        request.get("https://matcherino.com/__api/bounties/getDynamicCode?bountyId=" + _tournamentId + "&auth=" + _auth, (err, response, body) => {
                            if(!err || response.statusCode === 200) {
                                //no error
                                return resolve({status: response.statusCode, response: response, body: body, error: false});
                            } else {
                                return resolve({status: response.statusCode, response: response, body: body, error: true});
                            }
                        });
                    })
                }
                let tournamentId = matcherino.link.split("/")[matcherino.link.split("/").length - 1];
                if(BotSettings.assist.validateNumber(tournamentId) === true) {
                    formatMatcherino(matcherino.auth, tournamentId).then(data => {
                        let jsonBody;
                        try {
                            jsonBody = JSON.parse(data.body);
                        } catch(e) {
                            Logger.sendLog("There was an error parsing.... " + e, "CRITICAL", __filename);
                            BotSettings.assist.error("There was an error parsing the Matcherino code.... " + e, message.channel);
                            return resolve({response: "", silent: true});
                        }
                        let formatMsg = "";
                        if(matcherino.desc !== null) {
                            formatMsg = matcherino.desc;
                        } else {
                            formatMsg = "Contribute to our matcherino!";
                        }
                        let msgBody = "", codeContent = "", statCode = jsonBody.status;
                        let foundErr = false;
                        if(jsonBody.status === 500 || jsonBody.body === null) {
                            msgBody = jsonBody.error.message.replace("bounty", "tournament");
                            codeContent = "Error Message";
                            foundErr = true;
                        } else {
                            msgBody = jsonBody.body;
                            codeContent = "Code";
                        }
                        formatMsg += "\n\n**Link**: " + matcherino.link;
                        formatMsg += "\n\n**" + codeContent + "**: " + msgBody;
                        if(foundErr === true) {
                            formatMsg += "\n**Status Code**: " + statCode;
                        }
                        let updateLink = "";
                        if(!foundErr) {
                            updateLink = "https://matcherino.com/__api/coupons/findByCode?code=" + jsonBody.body + "&bountyId=" + tournamentId;
                            requestData(updateLink, tournamentId).then(findCodeData => {
                                let findCode = "";
                                try {
                                    findCode = JSON.parse(findCodeData.body);
                                } catch(e2) {
                                    Logger.sendLog("There was an error parsing.... " + e, "CRITICAL", __filename);
                                    BotSettings.assist.error("There was an error parsing the Matcherino code.... " + e, message.channel);
                                    return resolve({response: "", silent: true});
                                }
                                if(findCode !== null) {
                                    let tmpMsg = "", tmpValid = false;
                                    if(findCode.status === 200 || findCode.status === "200") {
                                        if(findCode.body.hasOwnProperty("pendingCount")) {
                                            tmpValid = true;
                                            tmpMsg += "\n\n**__Code Information__**\n";
                                            tmpMsg += "\n**Codes Used**: " + findCode.body.pendingCount;
                                            tmpMsg += "\n**Max Codes**: " + findCode.body.maxPerBounty;
                                            tmpMsg += "\n**Codes Left**: " + (parseInt(findCode.body.maxPerBounty) - parseInt(findCode.body.pendingCount));
                                        }
                                    }
                                    if(tmpValid) {
                                        formatMsg += tmpMsg;
                                    }
                                }
                                return resolve({response: message.author + ", " + formatMsg, silent: false});
                            }).catch(errCodeData => {
                                Logger.sendLog("There was an error when retrieving the data.... " + errCodeData, "CRITICAL", __filename);
                                BotSettings.assist.error("We were unable to retrieve the latest code.  We apologize.", message.channel);
                                return resolve({response: "", silent: true});
                            });
                        } else {
                            return resolve({response: message.author + ", " + formatMsg, silent: false});
                        }
                    }).catch(errData => {
                        Logger.sendLog("There was an error when retrieving the data.... " + errData, "CRITICAL", __filename);
                        BotSettings.assist.error("We were unable to retrieve the latest code.  We apologize.", message.channel);
                        return resolve({response: "", silent: true});
                    });
                } else {
                    Logger.sendLog(tournamentId + " | " + matcherino.link, "INFO", __filename);
                    BotSettings.assist.error("There was an error retrieving your next match code....", message.channel);
                    return resolve({response: "", silent: true});
                }

            } else {
                Logger.sendLog("No data found...", "INFO", __filename);
                BotSettings.assist.error("We could not find your settings for your matcherino content.  Please use the settings command....", message.channel);
                return resolve({response: "", silent: true});
            }
        }).catch(errRows => {
            Logger.sendLog("There was an error.... " + errRows, "CRITICAL", __filename);
            BotSettings.assist.error("There was an error with getting the data.... " + errRows, message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

matcherinoCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let availOpts = [["codes", "code"], ["games", "game"], ["events", "event"], ["rewards", "reward"], ["marketplace", "market"]];
        //https://matcherino.com/__api/rewards/list?foreignId=7604&foreignType=bounty - - rewards
        let displayOpts = [];
        availOpts.forEach(x => {
            displayOpts.push(x[0]);
        });
        let subOpts = [[""], ["avail", "list"], ["list"], ["avail"], ["avail", "list"]];
        let marketplaceOpts = [["sponsored", "sponsor"], ['global'], ['stretch', 'reach']];
        let marketDisplayOpts = ["sponsored", "global", "stretch"];
        if(args.length === 0 || (args.length >= 1 && (args[0].toLowerCase() === "code" || args[0].toLowerCase() === "codes"))) {
            if(args.length === 0) {
                let contentEmbed = new Discord.MessageEmbed();
                contentEmbed.setTitle("Matcherino Options");

                let contentStuff = "Here are additional options to use.  \n-" + displayOpts.join('\n-');

                contentEmbed.setDescription(contentStuff);
                contentEmbed.setColor("RANDOM");
                message.channel.send(message.author, {embed: contentEmbed}).then(() => {
                    getCodes(bot, message, args, time, prefixUsed, shardId).then((rows) => {
                        return resolve(rows);
                    }).catch(errRow => {
                        return resolve(errRow);
                    });
                }).catch(errPost => {
                    Logger.sendLog("Error when trying to post the information.... " + errPost, "CRITICAL", __filename);
                    BotSettings.assist.error("There was an error when trying to post the message.  Please try again....", message.channel, message.author);
                    return resolve({response: "", silent: true});
                })
            } else {
                getCodes(bot, message, args, time, prefixUsed, shardId).then((rows) => {
                    return resolve(rows);
                }).catch(errRow => {
                    return resolve(errRow);
                });
            }
        } else {
            let argChoice = args.shift();
            argChoice = argChoice.toLowerCase();
            let optFound = false, id = -1;
            let counter = 0;
            availOpts.forEach(x => {
                if(x.includes(argChoice)) {
                    optFound = true;
                    id = counter;
                }
                counter++;
            });
            if(optFound) {
                //valid
                if(id >= 0) {
                    let matcherinoLink = "";
                    if(id === 0) {
                        getCodes(bot, message, args, time, prefixUsed, shardId).then((rows) => {
                            return resolve(rows);
                        }).catch(errRow => {
                            return resolve(errRow);
                        });
                    } else if(id === 1 || id === 2) {
                        matcherinoLink = "https://matcherino.com/__api/games/events";
                    } else if(id === 4) {
                        let marketFound = false, marketId = -1;
                        let marketCounter = 0;
                        if(args.length >= 1) {
                            let marketArg = args.shift();
                            marketArg = marketArg.toLowerCase();
                            marketplaceOpts.forEach(y => {
                                if(y.includes(marketArg)) {
                                    marketFound = true;
                                    marketId = marketCounter;
                                }
                            });
                        }
                        if(marketFound) {
                            let offset = 0;
                            if(args.length === 1) {
                                let offsetArg = args.shift();
                                if(BotSettings.assist.validateNumber(offsetArg)) {
                                    offset = offsetArg;
                                } else {
                                    offset = 0;
                                }
                            }
                            let marketLink = "https://matcherino.com/__api/rewards/browse?";
                            if(marketId === 0) {
                                marketLink += "offset=" + offset + "&featured=true";
                            } else if(marketId === 1) {
                                marketLink += "offset=" + offset + "&featured=false";
                            } else if(marketId === 2) {
                                marketLink += "category=stretch";
                            } else {
                                BotSettings.assist.error("We were unable to figure out what option you were wanting to choose.  Here are your options: " + marketDisplayOpts.join("\n"), message.channel, message.author);
                                return resolve({response: "", silent: true});
                            }
                            requestData(marketLink, null).then((marketContent) => {
                                let marketData = "", marketDataFound = null;
                                if(marketContent.errorThrown === false) {
                                    try {
                                        marketData = JSON.parse(marketContent.body);
                                        marketDataFound = true;
                                    } catch(marketErr) {
                                        Logger.sendLog("There was an error with parsing the data... " + marketErr, "CRITICAL", __filename);
                                    }
                                    if(marketDataFound) {
                                        let embed = new Discord.MessageEmbed();
                                        let embedStuff = [];
                                        if(Array.isArray(marketData.body) && marketData.body.length >= 1) {
                                            marketData.body.forEach((marketStuff, index) => {
                                                let dot = "• ";
                                                let marketCreator = marketStuff.creator.displayName;
                                                let marketUserName = marketStuff.creator.userName
                                                let marketPlatform = marketStuff.creator.authProvider;
                                                let marketUrlLink = "https://matcherino.com/marketplace/reward/overview/" + marketStuff.id;
                                                let marketTitle = marketStuff.title;
                                                let marketReward = marketStuff.rewardType;
                                                let marketPrice = parseFloat(parseInt(marketStuff.usdPrice)  / 100).toFixed(2);
                                                let marketImage = "<" + "https://" + marketStuff.imageURL + ">";
                                                let tmpShipInfo = [];
                                                if(marketStuff.meta.shipType.toLowerCase() === "onlyship") {
                                                    marketStuff.meta.shipping.forEach((marketShip, indexS) => {
                                                        let tmpCost = (marketShip.cost.length === 0 || marketShip.cost === "") ? "N/A" : parseFloat(parseInt(marketShip.cost)/100).toFixed(2);
                                                        let tmpLine = marketShip.location + " - - " + tmpCost;
                                                        tmpShipInfo.push(tmpLine);
                                                    })
                                                }
                                                let marketQtyLeft = marketStuff.qtyLeft;
                                                let marketMaxQty = marketStuff.maxQty;

                                                let beautify = "";
                                                beautify += dot + "Creator: " + marketCreator + '\n';
                                                if(marketPlatform.toLowerCase() === "twitch") {
                                                    beautify += dot + "Profile: <http://twitch.tv/" + marketUserName + ">";
                                                    beautify += "\n";
                                                }
                                                beautify += dot + "Title: " + marketTitle + "\n";
                                                beautify += dot + "Link: <" + marketUrlLink + ">" + "\n";
                                                beautify += dot + "Reward: " + marketReward + "\n";
                                                beautify += dot + "Image: " + marketImage + "\n";
                                                beautify += "\n**__More Information__**\n";
                                                beautify += dot + "Price: $" + marketPrice + "\n";
                                                beautify += dot + "Max Quantity: " + marketQtyLeft + '\n';
                                                beautify += dot + "Quantity Left: " + marketQtyLeft + '\n';

                                                embedStuff.push(beautify);
                                            });
                                            let embedFinalLst = BotSettings.resolve.distributeArray(embedStuff, embedStuff.length);
                                            embedFinalLst.forEach((embedContent, embedC) => {
                                                embed.addField("Marketplace Item " + (embedC + 1) + " on Page " + offset, embedContent.join("\n"), true);
                                            });
                                            embed.setDescription("Here is the Matcherino Marketplace result on page " + offset);
                                            embed.setColor("RANDOM");
                                            return resolve({response: message.author, embed: embed, silent: false});
                                        } else {
                                            embed.setTitle("No results found");
                                            embed.setDescription("We were unable to find any more results for some reason.  We apologize.");
                                            embed.setColor("RED");
                                            return resolve({response: message.author, embed: embed, silent: false});
                                        }
                                    } else {
                                        BotSettings.assist.error("We were unable to parse the data correctly.  We apologize.", message.channel, message.author);
                                        return resolve({response: "", silent: true});
                                    }
                                } else {
                                    Logger.sendLog("There was an error thrown for some reason.....", "CRITICAL", __filename);
                                    BotSettings.assist.error("There was an error thrown for some reason.  Please try again.", message.channel, message.author);
                                    return resolve({response: "", silent: true});
                                }
                            }).catch(marketErr => {
                                Logger.sendLog("There was an error trying to retrieve the data for some reason.... " + marketErr, "CRITICAL", __filename);
                                BotSettings.assist.error("There was an error when we were trying to retrieve for some reason..... ", message.channel, message.author);
                                return resolve({response: "", silent: true});
                            })
                        } else {
                            BotSettings.assist.error("We were unable to figure out what option you were wanting to choose.  Here are your options: \n-" + marketDisplayOpts.join("\n-"), message.channel, message.author);
                            return resolve({response: "", silent: true});
                        }
                    } else if(id === 3) {
                        getContent(bot, message, args, time, prefixUsed, shardId).then((rewardData) => {
                            if(rewardData.error === false) {
                                let rewardResp = rewardData.response;
                                let rewardLink = "https://matcherino.com/__api/rewards/list?foreignId=" + rewardResp + "&foreignType=bounty";
                                requestData(rewardLink, rewardResp).then((dataReward) => {
                                    if(dataReward.errorThrown === false) {
                                        let rewardContent = "";
                                        try {
                                            rewardContent = JSON.parse(dataReward.body);
                                        } catch(e3) {
                                            Logger.sendLog("Error when parsing the JSON data.... " + e, "CRITICAL", __filename);
                                            rewardContent = null;
                                        }
                                        if(rewardContent !== null) {
                                            if(rewardContent.status === 200 || rewardContent.status === "200") {
                                                let embed = new Discord.MessageEmbed();
                                                embed.setTitle("Tournament Rewards");
                                                embed.setURL("http://matcherino.com/tournaments/" + rewardResp + "/description");
                                                embed.setDescription("Here are the rewards that are around.");
                                                let embedList = [];
                                                rewardContent.body.forEach((text, index) => {
                                                    let contentCreator = text.creator.displayName;
                                                    let contentKind = text.kind;
                                                    let contentId = text.id;
                                                    let contentUrl = "https://matcherino.com/marketplace/reward/" + contentId + "?sourceId=" + rewardResp + "&sourceType=bounty";
                                                    let maxQuantity = text.maxQty;
                                                    let quantityLeft = text.qtyLeft;
                                                    let price = text.usdPrice;
                                                    let contentTitle = text.title;
                                                    let contentDesc = text.meta.description;
                                                    let contentDelivery = (text.meta.hasOwnProperty("estimatedHandling")) ? text.meta.estimatedHandling : "None";
                                                    let contentShipType = (text.meta.hasOwnProperty("shipType")) ? text.meta.shipType : "None";
                                                    let contentShipping = "";
                                                    let shippingContent = false;
                                                    if(contentShipType !== "None" && contentShipType.toLowerCase() === "onlyship") {
                                                        if(text.meta.hasOwnProperty("shipping")) {
                                                            let tmpShip = [];
                                                            shippingContent = true;
                                                            text.meta.shipping.forEach((shipData, indexD) => {
                                                                let shipPrice = shipData.cost;
                                                                if((shipPrice + "").length === 0) {
                                                                    shipPrice = "N/A";
                                                                } else {
                                                                    shipPrice = "$" + (shipData.cost / 100).toFixed(2);
                                                                }
                                                                tmpShip.push(shipData.location + " - " + shipPrice);
                                                            });
                                                            if(tmpShip.length !== 0) {
                                                                contentShipping = "  -" + tmpShip.join("\n  -");
                                                            } else {
                                                                contentShipping = "  -Unavailable";
                                                            }
                                                        }
                                                        contentShipType = "only shipping";
                                                    }
                                                    let contentRevShare = "";
                                                    text.revShare.forEach((revC, indexC) => {
                                                        if(revC.shareType.toLowerCase() === "host") {
                                                            contentRevShare = parseFloat(parseInt(revC.amount)/100).toFixed(2);
                                                        }
                                                    });
                                                    let beautifyCode = "";
                                                    beautifyCode += "- Creator: " + contentCreator;
                                                    beautifyCode += "\n-Title: " + contentTitle;
                                                    beautifyCode += "\n-Price: " + parseFloat(parseInt(price) / 100).toFixed(2);
                                                    beautifyCode += "\n-Description: <" + contentUrl + ">";
                                                    beautifyCode += "\n-Type: " + contentKind;
                                                    beautifyCode += "\n-Quantity Left: " + quantityLeft;
                                                    beautifyCode += "\n-Max Quantity:  " + maxQuantity;
                                                    beautifyCode += "\n-Host **revenue**: " + contentRevShare;
                                                    if(shippingContent) {
                                                        beautifyCode += "\n\n**__Shipping Information__**";
                                                        beautifyCode += "\n-Shipping: " + contentShipType;
                                                        beautifyCode += "\n-Estimated Shipping: " + contentDelivery;
                                                        beautifyCode += "\n**Price List**: \n" + contentShipping;
                                                    }
                                                    embedList.push(beautifyCode);
                                                });
                                                let distributeArr = BotSettings.resolve.distributeArray(embedList, 10);
                                                distributeArr.forEach((tmpEmbed, indexLst) => {
                                                    embed.addField("Reward List " + (indexLst + 1), distributeArr[indexLst].join("\n"), true);
                                                });
                                                return resolve({response: message.author, embed: embed, silent: false});
                                            } else {
                                                BotSettings.assist.error("We were unable to parse the requested data.  Please try again.", message.channel, message.author);
                                                return resolve({response: "", silent: true});
                                            }
                                        } else {
                                            BotSettings.assist.error("We were unable to parse the requested data.  Please try again.", message.channel, message.author);
                                            return resolve({response: "", silent: true});
                                        }
                                    } else {
                                        BotSettings.assist.error("There was an error that was thrown for some reason.  We apologize.", message.channel, message.author);
                                        return resolve({response: "", silent: true});
                                    }
                                }).catch(errRewardData => {
                                    return resolve(errRewardData);
                                })
                            }
                        }).catch(rewardErr => {
                            return resolve(rewardErr);
                        });
                    } else {
                        BotSettings.assist.error("We were unable to figure out your options for some reason.  Available options are: \n" + displayOpts.join("\n"), message.channel, message.author);
                        return resolve({response: "", silent: true});
                    }
                    if(id !== 3 && id !== 4) {
                        requestData(matcherinoLink, id).then((data) => {
                            let contentData = "";
                            if(data.errorThrown === false) {
                                try {
                                    contentData = JSON.parse(data.body);
                                } catch(e) {
                                    Logger.sendLog("Error when parsing the JSON data.... " + e, "CRITICAL", __filename);
                                    contentData = null;
                                }
                            }
                            if(contentData === null) {
                                BotSettings.assist.error("We were unable to parse the requested data.  Please try again.", message.channel, message.author);
                                return resolve({response: "", silent: true});
                            }
                            if(!BotSettings.hasOwnProperty("matcherino")) {
                                BotSettings.matcherino = {};
                            }
                            if(!BotSettings.matcherino.hasOwnProperty("games")) {
                                BotSettings.matcherino.games = {}
                            }
                            function formatGames(_list) {
                                _list.forEach((y) => {
                                    let eventY = (y.hasOwnProperty("totalBounties") ? y.totalBounties : 0);
                                    function shortHandLetters(content) {
                                        let upper1 = content.title;
                                        let lower1 = content.slug;

                                        function getFirstChar(arr) {
                                            let str = "";
                                            arr.forEach(x => {
                                                str += x.charAt(0);
                                            });
                                            return str;
                                        }

                                        if(content.image.includes("pubg")) {
                                            return ["pubg", ""];
                                        } if(upper1.includes("born")) {
                                            return ["battleborn", ""]
                                        } else {
                                            upper1 = upper1.replace(/[^A-Z0-9]/g, '');
                                            lower1 = getFirstChar(lower1.split("-")).toUpperCase();
                                            return [upper1, lower1];
                                        }
                                    }
                                    if(BotSettings.matcherino.games.hasOwnProperty(y.title) && BotSettings.matcherino.games[y.title].hasOwnProperty("events")) {
                                        //it has it, see if the number is different
                                        BotSettings.matcherino.games[y.title].events = parseInt(y.totalBounties);
                                    }
                                    BotSettings.matcherino.games[y.title] = {
                                        id: y.id,
                                        title: y.title,
                                        slug: y.slug,
                                        image: y.image,
                                        isTeam: y.isTeam,
                                        events: eventY,
                                        shorthand: shortHandLetters(y)
                                    }
                                });
                            }
                            formatGames(contentData.body);
                            let embed = new Discord.MessageEmbed();
                            if(data.id === 1) {
                                embed.setTitle("List of Games Supported on Matcherino");
                                embed.setDescription("Here, below, is the games that Matcherino Supports.");
                                embed.setColor("RANDOM");
                                let embedLst = [];
                                let lstSize = Object.keys(BotSettings.matcherino.games).length;
                                let totalEvents = 0;
                                Object.keys(BotSettings.matcherino.games).forEach((stat) => {
                                    let tmpTitle = "", eveBool = false;
                                    if(BotSettings.matcherino.games[stat].events >= 0) {
                                        tmpTitle += "Events: **__" + BotSettings.matcherino.games[stat].events + "__**"
                                        eveBool = true;
                                        totalEvents += parseInt(BotSettings.matcherino.games[stat].events);
                                    }
                                    if(eveBool) {
                                        tmpTitle += " - - "
                                    }
                                    tmpTitle += "**" + BotSettings.matcherino.games[stat].title + "**";
                                    embedLst.push(tmpTitle);
                                });
                                let distributeArr = BotSettings.resolve.distributeArray(embedLst, 6);
                                let lookupArg = "", numArg = 10;
                                if(args.length >= 1) {
                                    lookupArg = args.shift();
                                    if(args.length === 1 && BotSettings.resolve.Number(args[0])) {
                                        numArg = parseInt(args.shift());
                                        if(numArg >= 10) {
                                            numArg = distributeArr[0].length;
                                        }
                                    }
                                }
                                if(lookupArg.trim() === "") {
                                    distributeArr.forEach((distro, index) => {
                                        embed.addField("Game List #" + (index + 1), distro.join("\n"), true);
                                    });
                                } else if(lookupArg.trim() === "top") {
                                    if(numArg >= 10) {
                                        embed.setTitle("Top " + distributeArr[0].length + " List of Games Supported on Matcherino");
                                        embed.setDescription("Here, below, is the top " + distributeArr[0].length + " games that Matcherino supports based on the number of events.  Total Events: **__" + totalEvents + "__**\n" + distributeArr[0].join("\n"));
                                    } else {
                                        embed.setTitle("Top " + numArg + " List of Games Supported on Matcherino");
                                        let tmpDistro = [];
                                        for(let i = 0; i < numArg; i++) {
                                            tmpDistro.push(distributeArr[0][i]);
                                        }
                                        embed.setDescription("Here, below, is the top " + numArg + " games that Matcherino supports based on the number of events.  Total Events: **__" + totalEvents + "__**\n" + tmpDistro.join("\n"))
                                    }
                                } else {
                                    distributeArr.forEach((distro, index) => {
                                        embed.addField("Game List #" + (index + 1), distro.join("\n"), true);
                                    });
                                }
                                return resolve({response: message.author, embed: embed, silent: false});
                            } else if(data.id === 2) {
                                embed.setTitle("List of Events");
                                embed.setColor("RANDOM");
                                embed.setDescription("We are currently testing things.  Stay tuned.");
                                let lookupArg = "", additionalArgs = "", searchContent = null;
                                if(args.length >= 1) {
                                    //TODO: Improve with a loop using matcherinoSearch to add onto the array and try to figure out which is the better result and the leftover = your additionalArgs
                                    let argSlice = 0;
                                    if(args.length >= 2) {
                                        let argCounter = 0;
                                        while(true) {
                                            let tmpArg = args;
                                            let tmpLookup =  tmpArg.slice(0, (argCounter + 1)).join(" ");
                                            let tmpSearch = matcherinoSearch(tmpLookup, BotSettings.matcherino.games);
                                            console.log(tmpLookup + " | " + tmpSearch + " | " + tmpArg);
                                            if(tmpSearch !== null) {
                                                //found
                                                lookupArg = args.slice(0, (argCounter + 1)).join(" ");
                                                for(let i = 0; i < (argCounter + 1); i++) {
                                                    args.shift();
                                                }
                                                if(args.length >= 1) {
                                                    additionalArgs = args.join(" ");
                                                }
                                                searchContent = tmpSearch;
                                                break;
                                            }
                                            argCounter++;
                                        }
                                    }
                                    /*
                                    //Old Way
                                    if(args.length >= 2) {
                                        lookupArg = args.slice(0,2).join(" ");
                                        args.shift();
                                        args.shift();
                                        if(args.length >= 1) {
                                            additionalArgs = args.join(" ");
                                        }
                                    } else {
                                        lookupArg = args.join(" ");
                                    }
                                    */
                                } else {
                                    BotSettings.assist.error("Unable to find the game that you were looking for to find events on Matcherino.  Please try again by including a possible game.", message.channel, message.author);
                                    return resolve({response: "", silent: true});
                                }
                                if(searchContent !== null) {
                                    let tmpLink = "https://matcherino.com/__api/bounties/query?kind=tournament&"; //gameId=8&search=rewind
                                    let gameId = searchContent.id;
                                    tmpLink += "gameId="+gameId;
                                    if(additionalArgs.length !== 0) {
                                        let tmpAddArgs = additionalArgs.split(" ");
                                        additionalArgs = tmpAddArgs.join("%20");
                                        tmpLink += "&search="+additionalArgs;
                                    }
                                    tmpLink = tmpLink.toLowerCase();
                                    requestData(tmpLink, gameId).then(eventData => {
                                        let eventContent = "";
                                        if(eventData.errorThrown === false) {
                                            try {
                                                eventContent = JSON.parse(eventData.body);
                                            } catch(e) {
                                                Logger.sendLog("Error when parsing the JSON data.... " + e, "CRITICAL", __filename);
                                                eventContent = null;
                                            }
                                        }
                                        if(eventContent === null) {
                                            BotSettings.assist.error("We were unable to parse the requested data.  Please try again.", message.channel, message.author);
                                            return resolve({response: "", silent: true});
                                        } else if(eventContent.body === null) {
                                            let embed = new Discord.MessageEmbed();
                                            embed.setColor("RANDOM");
                                            embed.setTitle("No Events Found");
                                            embed.setDescription("There was no events that were found for **" + additionalArgs + "**.");
                                            return resolve({response: message.author, embed: embed, silent: false});
                                        } else {
                                            let displayEvent = [], displayEventLen = [];
                                            let moment = require("moment");
                                            let tmpDate = moment();
                                            let tmpContent = eventContent.body;
                                            tmpContent.forEach((tmpEvent) => {
                                                let eventGoalMet = (tmpEvent.balance >= tmpEvent.meta.goal) ? true : false;
                                                let creator = tmpEvent.creator.displayName;
                                                let game = tmpEvent.game.title;
                                                let bountyLink = "http://matcherino.com/tournaments/" + tmpEvent.id + "/description";
                                                let bountyTitle = tmpEvent.title;
                                                let donationAmount = (tmpEvent.donation.balance === 0) ? "Donate now!" : "$" + parseFloat(parseInt(tmpEvent.donation.balance) / 100);
                                                let donationGoal = (tmpEvent.donation.goal === 0) ? "No goal set" : "$" + parseFloat(parseInt(tmpEvent.donation.balance) / 100);
                                                let donationDiff = "None set";
                                                let metaGoal = (tmpEvent.meta.goal ? ("$" + parseFloat(tmpEvent.meta.goal) / 100) : "No Goal Set");
                                                if(tmpEvent.donation.balance !== 0 && tmpEvent.donation.goal === 0 && tmpEvent.donation.balance >= tmpEvent.donation.goal) {
                                                    donationDiff = parseFloat((parseInt(tmpEvent.donation.balance) / parseInt(tmpEvent.donation.goal)) / 100);
                                                }
                                                let donationPayout = [];
                                                if(tmpEvent.payouts !== null) {
                                                    if(tmpEvent.payouts.length >= 1) {
                                                        tmpEvent.payouts.forEach((payoutVal, payoutIndex) => {
                                                            if(payoutVal.strategy === "percentage") {
                                                                donationPayout.push(payoutVal.title + ": " + parseFloat(payoutVal.payout)/100 + "%");
                                                            } else {
                                                                donationPayout.push(payoutVal.title + ": " + "$" + parseFloat(payoutVal.payout)/100);
                                                            }
                                                        });
                                                    } else {
                                                        donationPayout.push("None Set");
                                                    }
                                                } else {
                                                    donationPayout.push("None Set");
                                                }
                                                let createDate = tmpEvent.createdAt, startDate = tmpEvent.startAt;
                                                tmpDate = moment();
                                                if(
                                                    moment(createDate).isAfter(tmpDate.startOf("week")) ||
                                                    moment(startDate).isAfter(tmpDate.startOf("week")) ||
                                                    (!eventGoalMet && moment(startDate).isAfter(tmpDate.startOf("month")))
                                                ) {
                                                    //it is after, add content to array
                                                    let fullContent = "";
                                                    fullContent += "**Created By: ** " + creator;
                                                    fullContent += "\n**Game**: " + game;
                                                    fullContent += "\n**Goal**: " + metaGoal;
                                                    fullContent += "\n**Link**: <" + bountyLink + ">";
                                                    fullContent += "\n**Title**: " + bountyTitle;
                                                    fullContent += "\n**Donation Amount**: " + donationAmount;
                                                    fullContent += "\n**Donation Goal**: " + donationGoal;
                                                    fullContent += "\n**Donation Difference**: " + donationDiff;
                                                    fullContent += "\n**Start Date**: " + moment(startDate).format("MM/DD/YYYY h:mm:ss a");

                                                    fullContent += "\n\n**Payouts**: \n- " + donationPayout.join("\n- ");
                                                    displayEvent.push(fullContent);
                                                    displayEventLen.push(fullContent.length);
                                                }
                                            });
                                            embed.setDescription("Here are the events for this week.");
                                            console.log(displayEvent.length);
                                            if(displayEvent.length >= 1) {
                                                let distroArr = BotSettings.resolve.distributeArray(displayEvent, 5);
                                                distroArr.forEach((distro, index) => {
                                                    console.log(distroArr[index].join("\n\n").length)
                                                    embed.addField("Event List " + index, distroArr[index].join("\n\n"), true);
                                                });
                                                embed.setThumbnail("https://static-cdn.jtvnw.net/jtv_user_pictures/matcherino-profile_image-5061fb0685d4ad37-300x300.png");
                                            } else {
                                                embed.setDescription("There were **no** results found");
                                                embed.setThumbnail('https://i.imgur.com/eOoFlam.png?width=80&height=80');
                                            }
                                        }
                                        return resolve({response: message.author, embed: embed, silent: false});
                                    }).catch(eventErr => {
                                        Logger.sendLog("There was an error.... " + eventErr, "CRITICAL", __filename);
                                        BotSettings.assist.error("There was an error when trying to obtain the data for some reason.  Please try again shortly.", message.channel, message.author);
                                        return resolve({response: "", silent: true});
                                    })
                                }
                            } else {
                                BotSettings.assist.error("Unable to find the game that you were looking for.  Please try again.", message.channel, message.author);
                                return resolve({response: "", silent: true});
                            }
                        }).catch(errData => {
                            BotSettings.assist.error("Unable to process the data request because..... " + errData, message.channel, message.author);
                            return resolve({response: "", silent: true});
                        })
                    }
                } else {
                    BotSettings.assist.error("We were unable to figure out your options for some reason.  Available options are: \n" + displayOpts.join("\n"), message.channel, message.author);
                    return resolve({response: "", silent: true});
                }
            } else {
                BotSettings.assist.error("We were unable to figure out your options for some reason.  Available options are: \n" + displayOpts.join("\n"), message.channel, message.author);
                return resolve({response: "", silent: true});
            }
        }
    });
}

matcherinoSearch = (input, _data) => {
    let matchInfo = null, maxCompare = .85;
    function checkSim(comp1, comp2, isArr2=false) {
        let sim = require("string-similarity");
        let highestNum = 0;
        if(isArr2) {
            comp2.forEach(stuff => {
                let simComp = sim.compareTwoStrings(comp1, stuff.toLowerCase());
                if(simComp > highestNum) {
                    highestNum = simComp;
                }
            })
        } else {
            highestNum = sim.compareTwoStrings(comp1, comp2);
        }
        return highestNum;
    }
    let reasonWhy = "";
    let reasonExpanded = "None";
    let percentage = "None";
    Object.keys(_data).forEach((data) => {
        let content = _data[data];
        let shorthandTmp = content.shorthand;
        if(
            (BotSettings.assist.validateNumber(input) && content.id === parseInt(input)) ||
            (content.title.toLowerCase().includes(input.toLowerCase()) && parseFloat(checkSim(input.toLowerCase(), content.title.toLowerCase())).toFixed(2) >= maxCompare) ||
            (shorthandTmp.includes(input.toLowerCase()) && parseFloat(checkSim(input.toLowerCase(), shorthandTmp, true)).toFixed(2) >= maxCompare)
        ) {
            if((BotSettings.assist.validateNumber(input) && content.id === parseInt(input))) {
                reasonWhy = "Number";
            } else if((content.title.toLowerCase().includes(input.toLowerCase()) && parseFloat(checkSim(input.toLowerCase(), content.title.toLowerCase())).toFixed(2) >= maxCompare)) {
                reasonWhy = "Title close to matching....";
                if(content.title.toLowerCase().includes(input.toLowerCase())) {

                    reasonExpanded = "Title content `" + content.title.toLowerCase() + "` contains #### of words from `" + input.toLowerCase() + "`"
                }
                percentage = parseFloat(checkSim(input.toLowerCase(), content.title.toLowerCase())).toFixed(2);
            } else if((shorthandTmp.includes(input.toLowerCase()) && parseFloat(checkSim(input.toLowerCase(), shorthandTmp, true)).toFixed(2) >= maxCompare)) {
                reasonWhy = "Short hand version.....";
            }
            matchInfo = content;
        }
    });
    if(matchInfo !== null) {
        console.log(matchInfo.id + " | " + reasonWhy + " | " + reasonExpanded + " | " + percentage)
    }
    return matchInfo;
}

requestData = (_link, _id) => {
    return new Promise((resolve, reject) => {
        let request = require("request");
        request.get(_link, (err, response, body) => {
            let x = {error: err, response: response, body: body, errorThrown: true, id: _id};
            if(response.statusCode === 200) {
                x.errorThrown = false
            }
            return resolve(x);
        });
    })
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageMatcherino.aliases, args: usageMatcherino.args, usage: usageMatcherino, run: matcherinoCmd}
];
