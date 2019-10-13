const moduleInfo = {
    name: "RL Lookup",
    truename: "rllookup",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usageComp = {
    name: "rlcomp",
    cmdName: "rlcomp",
    aliases: ["rlcomp", "rllookup", "rlcomps"],
    args: {min: 3, max: 3},
    description: "Get Rocket League competitive stats",
    usage: "[command:str]",
    exampleUsage: "rlstats pc 1v1 kronovirl",
    runIn: ["text"],
    categories: "Game Lookup",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageStats = {
    name: "rlstat",
    cmdName: "rlstat",
    aliases: ["rlstat", "rlstats"],
    args: {min: 3, max: 3},
    description: "Get Rocket League stats",
    usage: "[command:str]",
    exampleUsage: "rlstats pc 1v1 kronovirl",
    runIn: ["text"],
    categories: "Game Lookup",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageReplays = {
    name: "rlreplay",
    cmdName: "rlreplay",
    aliases: ["rlreplay", "rlreplays"],
    args: {min: 0, max: 1},
    description: "Get Rocket League replay stats",
    usage: "[command:str]",
    exampleUsage: "rlreplay <file|url>",
    runIn: ["text"],
    categories: "Game Lookup",
    permlvl: 0,
    premiumLvl: 0,
    enabled: false,
    contributors: [""]
}

this.setupCommands = function(file) {
    this.file = file;
    return new Promise((resolve, reject) => {
        return resolve({file: this.file, moduleInfo: moduleInfo, commands: this.commands});
    });
}

getAllTiers = function() {
    return [
        {"tierid": 1, "tierRanks": [
            {"tierid": 0, "tierName": "Unranked" },
            {"tierid": 1, "tierName": "Bronze I" },
            {"tierid": 2, "tierName": "Bronze II" },
            {"tierid": 3, "tierName": "Bronze III" },
            {"tierid": 4, "tierName": "Silver I" },
            {"tierid": 5, "tierName": "Silver II" },
            {"tierid": 6, "tierName": "Silver III" },
            {"tierid": 7, "tierName": "Gold I" },
            {"tierid": 8, "tierName": "Gold II" },
            {"tierid": 9, "tierName": "Gold III" },
            {"tierid": 10, "tierName": "Platinum"}
        ]},
        {"tierid": 2, "tierRanks": [
            {"tierid": 0, "tierName": "Unranked" },
            {"tierid": 1, "tierName": "Prospect I" },
            {"tierid": 2, "tierName": "Prospect II" },
            {"tierid": 3, "tierName": "Prospect III" },
            {"tierid": 4, "tierName": "Prospect Elite" },
            {"tierid": 5, "tierName": "Challenger I" },
            {"tierid": 6, "tierName": "Challenger II"},
            {"tierid": 7, "tierName": "Challenger III"},
            {"tierid": 8, "tierName": "Challenger Elite"},
            {"tierid": 9, "tierName": "Rising Star"},
            {"tierid": 10, "tierName": "All Star"},
            {"tierid": 11, "tierName": "Superstar"},
            {"tierid": 12, "tierName": "Champion"},
            {"tierid": 13, "tierName": "Super Champion"},
            {"tierid": 14, "tierName": "Grand Champion"}
        ]},
        {"tierid": 3, "tierRanks": [
            {"tierid": 0, "tierName": "Unranked" },
            {"tierid": 1, "tierName": "Prospect I" },
            {"tierid": 2, "tierName": "Prospect II" },
            {"tierid": 3, "tierName": "Prospect III" },
            {"tierid": 4, "tierName": "Prospect Elite" },
            {"tierid": 5, "tierName": "Challenger I" },
            {"tierid": 6, "tierName": "Challenger II"},
            {"tierid": 7, "tierName": "Challenger III"},
            {"tierid": 8, "tierName": "Challenger Elite"},
            {"tierid": 9, "tierName": "Rising Star"},
            {"tierid": 10, "tierName": "All Star"},
            {"tierid": 11, "tierName": "Superstar"},
            {"tierid": 12, "tierName": "Champion"},
            {"tierid": 13, "tierName": "Super Champion"},
            {"tierid": 14, "tierName": "Grand Champion"}
        ]},
        {"tierid": 4, "tierRanks": [
            {"tierid": 0, "tierName": "Unranked" },
            {"tierid": 1, "tierName": "Bronze I" },
            {"tierid": 2, "tierName": "Bronze II" },
            {"tierid": 3, "tierName": "Bronze III" },
            {"tierid": 4, "tierName": "Silver I" },
            {"tierid": 5, "tierName": "Silver II" },
            {"tierid": 6, "tierName": "Silver III"},
            {"tierid": 7, "tierName": "Gold I"},
            {"tierid": 8, "tierName": "Gold II"},
            {"tierid": 9, "tierName": "Gold III"},
            {"tierid": 10, "tierName": "Platinum I"},
            {"tierid": 11, "tierName": "Platinum II"},
            {"tierid": 12, "tierName": "Platinum III"},
            {"tierid": 13, "tierName": "Diamond I"},
            {"tierid": 14, "tierName": "Diamond II"},
            {"tierid": 15, "tierName": "Diamond III"},
            {"tierid": 16, "tierName": "Champion I"},
            {"tierid": 17, "tierName": "Champion II"},
            {"tierid": 18, "tierName": "Champion III"},
            {"tierid": 19, "tierName": "Grand Champion"}
        ]},
        {"tierid": 5, "tierRanks": [
            {"tierid": 0, "tierName": "Unranked" },
            {"tierid": 1, "tierName": "Bronze I" },
            {"tierid": 2, "tierName": "Bronze II" },
            {"tierid": 3, "tierName": "Bronze III" },
            {"tierid": 4, "tierName": "Silver I" },
            {"tierid": 5, "tierName": "Silver II" },
            {"tierid": 6, "tierName": "Silver III"},
            {"tierid": 7, "tierName": "Gold I"},
            {"tierid": 8, "tierName": "Gold II"},
            {"tierid": 9, "tierName": "Gold III"},
            {"tierid": 10, "tierName": "Platinum I"},
            {"tierid": 11, "tierName": "Platinum II"},
            {"tierid": 12, "tierName": "Platinum III"},
            {"tierid": 13, "tierName": "Diamond I"},
            {"tierid": 14, "tierName": "Diamond II"},
            {"tierid": 15, "tierName": "Diamond III"},
            {"tierid": 16, "tierName": "Champion I"},
            {"tierid": 17, "tierName": "Champion II"},
            {"tierid": 18, "tierName": "Champion III"},
            {"tierid": 19, "tierName": "Grand Champion"}
        ]},
        {"tierid": 6, "tierRanks": [
            {"tierid": 0, "tierName": "Unranked" },
            {"tierid": 1, "tierName": "Bronze I" },
            {"tierid": 2, "tierName": "Bronze II" },
            {"tierid": 3, "tierName": "Bronze III" },
            {"tierid": 4, "tierName": "Silver I" },
            {"tierid": 5, "tierName": "Silver II" },
            {"tierid": 6, "tierName": "Silver III"},
            {"tierid": 7, "tierName": "Gold I"},
            {"tierid": 8, "tierName": "Gold II"},
            {"tierid": 9, "tierName": "Gold III"},
            {"tierid": 10, "tierName": "Platinum I"},
            {"tierid": 11, "tierName": "Platinum II"},
            {"tierid": 12, "tierName": "Platinum III"},
            {"tierid": 13, "tierName": "Diamond I"},
            {"tierid": 14, "tierName": "Diamond II"},
            {"tierid": 15, "tierName": "Diamond III"},
            {"tierid": 16, "tierName": "Champion I"},
            {"tierid": 17, "tierName": "Champion II"},
            {"tierid": 18, "tierName": "Champion III"},
            {"tierid": 19, "tierName": "Grand Champion"}
        ]},
        {"tierid": 7, "tierRanks": [
            {"tierid": 0, "tierName": "Unranked" },
            {"tierid": 1, "tierName": "Bronze I" },
            {"tierid": 2, "tierName": "Bronze II" },
            {"tierid": 3, "tierName": "Bronze III" },
            {"tierid": 4, "tierName": "Silver I" },
            {"tierid": 5, "tierName": "Silver II" },
            {"tierid": 6, "tierName": "Silver III"},
            {"tierid": 7, "tierName": "Gold I"},
            {"tierid": 8, "tierName": "Gold II"},
            {"tierid": 9, "tierName": "Gold III"},
            {"tierid": 10, "tierName": "Platinum I"},
            {"tierid": 11, "tierName": "Platinum II"},
            {"tierid": 12, "tierName": "Platinum III"},
            {"tierid": 13, "tierName": "Diamond I"},
            {"tierid": 14, "tierName": "Diamond II"},
            {"tierid": 15, "tierName": "Diamond III"},
            {"tierid": 16, "tierName": "Champion I"},
            {"tierid": 17, "tierName": "Champion II"},
            {"tierid": 18, "tierName": "Champion III"},
            {"tierid": 19, "tierName": "Grand Champion"}
        ]}
    ];
};

rlLookupCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let rlsApi = require("rls-api");
        let client = new rlsApi.Client({
            token: BotSettings.assist.getConstants("rls-api")
        });
        let platform = "pc";
        let platChoice = args.shift();
        platChoice = platChoice.toLowerCase();
        if(platChoice === "pc" || platChoice === "steam") {
            platform = rlsApi.platforms.STEAM;
        } else if(platChoice === "xb1" || platChoice === "xb") {
            platform = rlsApi.platforms.XB1;
        } else if(platChoice === "ps4" || platChoice === "psn") {
            platform = rlsApi.platforms.PS4;
        } else {
            BotSettings.assist.error("Platform choices for RL tracker is: pc, xb1, ps4", message.channel);
            return resolve({response: "", silent: true});
        }

        let gamemode = args.shift();
        //1v1, 2v2, 3v3, 3v3s
        let getAvailPlatforms = {};
        getAvailPlatforms["rl"] = rlsApi.platforms;
        let getAvailPlaylists = {};
        getAvailPlaylists["rl"] = rlsApi.rankedPlaylists;
        let getAvailStats = {};
        getAvailStats["rl"] = rlsApi.statType;

        let finalGameMode = "";
        gamemode = gamemode.toLowerCase();
        if(gamemode === "1v1" || gamemode === "duel") {
            finalGameMode = getAvailPlaylists["rl"].DUEL;
        } else if(gamemode === "2v2" || gamemode === "double" || gamemode === "doubles") {
            finalGameMode = getAvailPlaylists["rl"].DOUBLES;
        } else if(gamemode === "3v3" || gamemode === "standard") {
            finalGameMode = getAvailPlaylists["rl"].STANDARD;
        } else if(gamemode === "3v3s" || gamemode === "solo_standard" || gamemode === "solo") {
            finalGameMode = getAvailPlaylists["rl"].SOLO_STANDARD;
        } else if(gamemode === "all") {
            finalGameMode = "all";
        } else {
            BotSettings.assist.error("Available playlist for RL tracker is: 1v1, 2v2, 3v3, 3v3s", message.channel);
            return resolve({response: "", silent: true});
        }

        let playerChoice = args.shift();
        playerChoice = playerChoice.toLowerCase();

        let finalPlayer = "";
        let vanityURL = false;
        if(playerChoice.includes("http://steamcommunity.com/id/") || playerChoice.includes("https://steamcommunity.com/id/")) {
            finalPlayer = playerChoice.split("\/")[playerChoice.split("\/").length - 1];
            vanityURL = true;
        } else if(playerChoice.includes("http://steamcommunity.com/profiles/") || playerChoice.includes("https://steamcommunity.com/profiles/")) {
            finalPlayer = playerChoice.split("\/")[playerChoice.split("\/").length - 1];
            vanityURL = null;
        } else {
            if(playerChoice.includes("http")) {
                let validLinks = ["http://steamcommunity.com/id/{username here}", "http://steamcommunity.com/profiles/{steam64ID}"];
                BotSettings.assist.error("The links that are valid to type in are: " + validLinks.join(", "), message.channel);
                return resolve({response: "", silent: true});
            } else {
                finalPlayer = playerChoice;
                if(!finalPlayer.startsWith("765")) {
                    vanityURL = true;
                } else {
                    vanityURL = null;
                }
            }
        }
        if(vanityURL === null) {
            let steamId = finalPlayer;
            getFinalPlayerData(client, steamId, platform, finalGameMode, getAvailPlatforms, getAvailPlaylists, getAvailStats, message).then((finalOutput) => {
                return resolve(finalOutput);
            }).catch(errOutput => {
                return reject(finalOutput);
            });
        } else if(vanityURL === false) {
            let steamConvert = require("steamidconvert")(BotSettings.assist.getConstants("steam"));
            steamConvert.convertVanity(finalPlayer, (err, res) => {
                if(err) {
                    BotSettings.assist.error("We were unable to find the player ID that you were looking for.  Please try again.", message.channel);
                    return resolve({response: "", silent: true});
                }
                let steamId = res;
                getFinalPlayerData(client, steamId, platform, finalGameMode, getAvailPlatforms, getAvailPlaylists, getAvailStats, message).then((finalOutput) => {
                    return resolve(finalOutput);
                }).catch(errOutput => {
                    return reject(finalOutput);
                });
            });
        } else {
            let Steam = require("steam-webapi");
            Steam.key = BotSettings.assist.getConstants("steam");
            Steam.ready((err) => {
                if(err) {
                    BotSettings.assist.error("There was an error with setting up steam for some reason...." + err, message.channel);
                    return resolve({response: "", silent: true});
                }
                let steam = new Steam();
                steam.resolveVanityURL({vanityurl: finalPlayer}, (err2, data) => {
                    if(err2) {
                        BotSettings.assist.error("There was an error with setting up steam for some reason...." + err2, message.channel);
                        return resolve({response: "", silent: true});
                    }
                    if(data.success === 1 || data.success === "1") {
                        //valid
                        let steamId = data.steamid;
                        getFinalPlayerData(client, steamId, platform, finalGameMode, getAvailPlatforms, getAvailPlaylists, getAvailStats, message).then((finalOutput) => {
                            return resolve(finalOutput);
                        }).catch(errOutput => {
                            return reject(finalOutput);
                        });
                    }
                });
            })
        }
    });
}

rlReplay = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let attachment = null, attachLink = "", fileName = "";
        Logger.sendLog("RL Replay Args: " + args.length + " | length: " + message.attachments.size, "INFO", __filename);
        if(message.attachments.size === 1) {
            attachment = message.attachments.first();
            attachLink = attachment.url;
            fileName = attachment.filename;
        } else if(args.length === 1) {
            attachLink = args.shift();
            fileName = attachLink.split("/")[attachLink.split("/").length - 1];
        } else {
            BotSettings.assist.error("You must attach a file or provide a url link.", message.channel, message.author);
            return resolve({response: "", silent: true});
        }
        if(rlReplayValidate(attachLink, fileName)) {
            rlReplayAnalysis(attachLink).then(rlData => {
                return resolve({response: message.author + ", this command is still being worked on.", silent: false});
            }).catch(errData => {
                Logger.sendLog("There was an error parsing the data for some reason.... " + errData, "CRITICAL", __filename);
                BotSettings.assist.error("There was an error parsing the replay file.  Please try again.", message.channel, message.author);
                return resolve({response: "", silent: true});
            });
        } else {
            BotSettings.assist.error("A proper Rocket League replay file name ends with `.replay`.  Please upload a proper file.", message.channel, message.author);
            return resolve({response: "", silent: true});
        }
    });
}

rlReplayAnalysis = (url) => {
    return new Promise((resolve, reject) => {
        let Replay = require("rl-replay");
        console.log(url);
        let replay = new Replay(url);
        replay.load().then(() => {
            Logger.sendLog("Replay loaded successfully.", "INFO", __filename);
            return resolve({replay: replay, url: url});
        }, (err) => {
            Logger.sendLog("There was an error with parsing the data.... " + err, "CRITICAL", __filename);
            return reject(err);
        }, (progress) => {
            Logger.sendLog("Progress on loading replay: " + (progress * 100) + "%", "INFO", __filename);
        });
    });
}

rlReplayValidate = (url, _filename) => {
    if(url.toLowerCase().endsWith(".replay") || _filename.toLowerCase().endsWith(".replay")) {
        return true;
    }
    return false;
}

getFinalPlayerData = (client, playerId, platform, finalGameMode, getAvailPlatforms, getAvailPlaylists, getAvailStats, message) => {
    return new Promise((resolve, reject) => {
        client.getTiersData((status2, data2) => {
            if(status2 === 200) {
                client.getPlayer(playerId, platform, (status, data) => {
                    if(status === 200) {
                        let S = require("string");
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("Competitive Stats for " + data.displayName + " on " + data.platform.name);
                        embed.setAuthor(data.displayName, data.avatar);
                        embed.setColor("RANDOM");
                        embed.setFooter("Requested by " + message.author.username + " | " + message.author.id);
                        embed.setURL(data.profileUrl);
                        embed.setImage(data.signatureUrl);

                        let rankedSeasonData = data.rankedSeasons;
                        if(Object.keys(rankedSeasonData).length === 0) {
                            embed.setDescription("There was no available data for **" + data.displayName + "**.");
                            return resolve({response: message.author, embed: embed, silent: false});
                        }
                        let highestSeason = Object.keys(rankedSeasonData).reduce((a, b) => {
                            return rankedSeasonData[a] > rankedSeasonData[b] ? a : b;
                        });

                        if(finalGameMode === "all") {
                            let duelData = rankedSeasonData[highestSeason][getAvailPlaylists["rl"].DUEL];
                            let doubleData = rankedSeasonData[highestSeason][getAvailPlaylists["rl"].DOUBLES];
                            let soloData = rankedSeasonData[highestSeason][getAvailPlaylists['rl'].SOLO_STANDARD];
                            let standardData = rankedSeasonData[highestSeason][getAvailPlaylists['rl'].STANDARD];

                            let duelText = "Duel", doubleText = "Double", soloText = "Solo standard", standardText = "Standard";


                            function formatData(contentData) {
                                let tmpContent = "";
                                let dot = "• ";
                                let highSeason2 = getAllTiers()[highestSeason - 1]['tierRanks'][contentData['tier']].tierName;
                                let division2 = (contentData['division'] === "0" || contentData['division'] === 0) ? BotSettings.roman.toRoman(contentData['division'] + 1) : BotSettings.roman.toRoman(contentData['division']);

                                tmpContent += dot + "**MMR**: " + contentData['rankPoints'] + "\n";
                                tmpContent += dot + "**Matches Played**: " + contentData['matchesPlayed'] + "\n";
                                tmpContent += dot + "**Tier**: " + highSeason2 + "\n";
                                tmpContent += dot + "**Division**: " + division2 + "\n";
                                return tmpContent;
                            }
                            let duelContent = formatData(duelData), doubleContent = formatData(doubleData), soloContext = formatData(soloData), standardContext = formatData(standardData);

                            embed.addField(duelText + " Stats", duelContent, true);
                            embed.addField(doubleText + " Stats", doubleContent, true);
                            embed.addField(soloText + " Stats", soloContext, true);
                            embed.addField(standardText + " Stats", standardContext, true);
                            return resolve({response: message.author, embed: embed, silent: false});
                        } else {
                            let requestData = rankedSeasonData[highestSeason][finalGameMode];
                            console.log(Object.keys(getAvailPlaylists['rl']).filter(x => {return getAvailPlaylists['rl'][x] === finalGameMode;})[0].replace("_", " "));
                            let finalGMRank = S(Object.keys(getAvailPlaylists['rl']).filter(x => {return getAvailPlaylists['rl'][x] === finalGameMode;})[0].replace("_", " ")).capitalize().s;
                            if(requestData !== undefined) {
                                let highSeason = getAllTiers()[highestSeason - 1]['tierRanks'][requestData['tier']].tierName;
                                embed.addField(finalGMRank + " MMR", requestData['rankPoints'], true);
                                embed.addField(finalGMRank + " matches played", requestData['matchesPlayed'], true);
                                embed.addField(finalGMRank + " tier", highSeason, true);
                                let division = (requestData['division'] === "0" || requestData['division'] === 0) ? BotSettings.roman.toRoman(requestData['division'] + 1) : BotSettings.roman.toRoman(requestData['division']);
                                embed.addField(finalGMRank + " division", division, true);
                                return resolve({response: message.author, embed: embed, silent: false});
                            } else {
                                embed.setDescription("We were unable to find any data for **__" + finalGMRank + "__**.  We apologize.");
                                return resolve({response: message.author, embed: embed, silent: false});
                            }
                        }
                    } else {
                        BotSettings.assist.error("There was an error retrieving the profile for some reason.  Please try again.", message.channel);
                        return resolve({response: "", silent: true});
                    }
                });
            } else {
                BotSettings.assist.error("There was an error retrieving the profile for some reason.  Please try again.", message.channel);
                return resolve({response: "", silent: true});
            }
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageComp.aliases, args: usageComp.args, usage: usageComp, run: rlLookupCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageReplays.aliases, args: usageReplays.args, usage: usageReplays, run: rlReplay}
];
