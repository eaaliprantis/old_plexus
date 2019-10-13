const moduleInfo = {
    name: "csgo",
    truename: "csgo",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "csgo",
    cmdName: "csgo",
    aliases: ["csgo", "csgolookup", "csgostats"],
    args: {min: 1, max: 1},
    description: "Gets your csgo stats",
    usage: "[command:str]",
    exampleUsage: "csgo eaaliprantis",
    runIn: ["dm", "text"],
    categories: "Game Lookup",
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

csgoLookupCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let playerChoice = args.shift();
        playerChoice = playerChoice.toLowerCase();

        let finalPlayer = "", vanityURL = false;
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
        console.log(finalPlayer + " | " + vanityURL);
        let steamInfo = "";
        if(vanityURL === null) {
            steamInfo = finalPlayer;
            getCsgoStats(steamInfo, message).then((resp) => {
                return resolve(resp);
            }).catch(errResp => {
                return reject(errResp);
            })
        } else if(vanityURL === false) {
            let steamConvert = require("steamidconvert")(BotSettings.assist.getConstants("steam"));
            steamConvert.convertVanity(finalPlayer, (err, res) => {
                if(err) {
                    BotSettings.assist.error("We were unable to find the player ID that you were looking for.  Please try again.", message.channel);
                    return resolve({response: "", silent: true});
                }
                steamInfo = res;
                getCsgoStats(steamInfo, message).then((resp) => {
                    return resolve(resp);
                }).catch(errResp => {
                    return reject(errResp);
                })
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
                        steamInfo = data.steamid;
                        getCsgoStats(steamInfo, message).then((resp) => {
                            return resolve(resp);
                        }).catch(errResp => {
                            return reject(errResp);
                        })
                    } else {
                        BotSettings.assist.error("There was an error with setting up steam for some reason...." + err2, message.channel);
                        return resolve({response: "", silent: true});
                    }
                });
            })
        }
    });
}

getCsgoStats = (playerId, message) => {
    return new Promise((resolve, reject) => {
        let steamData = require("steam-webapi");
        let S = require("string");
        steamData.key = BotSettings.assist.getConstants("steam");
        steamData.ready((err) => {
            if(err) {
                BotSettings.assist.error("There was an error setting up steam for some reason...." + err, message.channel);
                return resolve({response: "", silent: true});
            }
            let steam = new steamData();

            let steamInfo = require("steam-userinfo");
            steamInfo.setup(BotSettings.assist.getConstants("steam"));
            steamInfo.getUserInfo(playerId, (err, data) => {
                if(err) {
                    BotSettings.assist.error("There was an error retreiving the steam information..... " + err, message.channel);
                    return resolve({response: "", silent: true});
                }
                let dataResp = data.response;
                let steamObj = {
                    key: BotSettings.assist.getConstants("steam"),
                    steamid: playerId,
                    include_appinfo: true,
                    include_played_free_games: false,
                    appids_filter: [steamData.CSGO]
                };
                steam.getOwnedGames(steamObj, (err2, data2) => {
                    if(err2) {
                        BotSettings.assist.error("There was an error retrieving the owned games for this player.... " + err2, message.channel);
                        return resolve({response: "", silent: true});
                    }
                    if(data2.games === undefined) {
                        BotSettings.assist.error("There were no results found.", message.channel, message.author);
                        return resolve({response: "", silent: true});
                    }
                    console.log("-------DATA-------");
                    let csgoData = data2.games.filter(x => {
                        console.log(x.appid + " | " + steamData.CSGO);
                        if(x.appid === steamData.CSGO || parseInt(x.appid) === parseInt(steamData.CSGO)) {
                            return true;
                        }
                        return false;
                    });
                    console.log(csgoData);
                    console.log("-------DATA-------");
                    let playtimeAccount = 0;
                    if(parseInt(csgoData[0].playtime_forever) === 0) {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("Unable to find any stats....");
                        embed.setDescription("We are unable to find any stats on " + dataResp.players[0].personaname);
                        embed.setThumbnail(dataResp.players[0].avatarfull);
                        embed.addField("Last played", "Never", true);
                        embed.setColor("RANDOM");
                        return resolve({response: message.author, embed: embed, silent: false});
                    } else {
                        playtimeAccount = Math.floor(parseInt(csgoData[0].playtime_forever) / 60);
                    }
                    let csgoStats = require("csgo-stats");
                    csgoStats.load({
                        key: BotSettings.assist.getConstants("steam"),
                        id: playerId
                    }).then(r => {
                        if(r.body.playerstats.hasOwnProperty("stats")) {
                            let sortData = r.body.playerstats.stats.sort((a, b) => {
                                if(a.name > b.name) return -1;
                                if(a.name < b.name) return 1;
                                return 0;
                            })
                            sortData = sortData.filter(x => {
                                if(x.value === 0 || x.value === "0" || parseInt(x.value) === 0) {
                                    return false;
                                }
                                return true;
                            });
                            //console.log(sortData);
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("CS:GO Stats for **__" + dataResp.players[0].personaname + "__** (" + playerId + ")");
                            embed.setDescription("More information coming soon");
                            /*
                            :globe_with_meridians: General Stats
                            :video_game: Steam Info
                            */
                            let organizedStats = {};
                            let generalStats = sortData.filter(x => {
                                if(
                                    x.name === "total_kills" ||
                                    x.name === "total_deaths" ||
                                    x.name === "total_planted_bombs" ||
                                    x.name === "total_time_played" ||
                                    x.name === "total_mvps" ||
                                    x.name === "total_matches_won" ||
                                    x.name === "total_matches_played" ||
                                    x.name === "total_revenges"
                                ) {
                                    organizedStats[x.name] = x.value;
                                    return true;
                                }
                                return false;
                            });
                            //console.log(generalStats);
                            let properFormat = [];
                            Object.keys(organizedStats).forEach((key) => {
                                let finalKey = "**" + S(key.split("_")[0]).capitalize().s + " " + key.split("_").splice(1, key.split("_").length).join(" ") + "**: ";
                                let finalVal = "`" + organizedStats[key] + "`";
                                if(key === "total_time_played") {
                                    //convert seconds to pretty format
                                    let x = parseInt(organizedStats[key]) * 1000;
                                    let prettyMs = require("pretty-ms");
                                    finalVal = "`" + prettyMs(x, {verbose: true}) + "`";
                                }
                                properFormat.push(finalKey + finalVal);
                            });
                            //console.log(dataResp.players[0]);
                            let dot = "• ";
                            let steamInfoData = [];
                            let moment = require("moment");
                            let personaState = {
                                0: "Offline",
                                1: "Online",
                                2: "Busy",
                                3: "Away",
                                4: "Snooze",
                                5: "Looking to Trade",
                                6: "Looking to Play"
                            };
                            steamInfoData.push({title: "Profile Name: ", value: dataResp.players[0].personaname});
                            steamInfoData.push({title: "Last Online: ", value: moment(parseInt(dataResp.players[0].lastlogoff*1000)).format("MMMM Do YYYY, h:mm:ss a")});
                            steamInfoData.push({title: "Current Status: ", value: personaState[parseInt(dataResp.players[0].personastate)]});
                            steamInfoData.push({title: "Created Profile:  ", value: moment(parseInt(dataResp.players[0].timecreated)*1000).format("MMMM Do YYYY, h:mm:ss a")});
                            steamInfoData.push({title: "Profile Url:       ", value: "[Click here](" + dataResp.players[0].profileurl + ")"});

                            let finalData = [];
                            steamInfoData.filter(x => {
                                finalData.push(dot + "**" + x.title + "**" + x.value);
                                return dot + "**" + x.title + "**" + x.value;
                            });
                            console.log(finalData.join("\n"));

                            embed.addField(":globe_with_meridians: General Stats", properFormat.join("\n"), true);
                            embed.addField(":video_game: Steam Info", finalData.join("\n"), true);
                            embed.setThumbnail(dataResp.players[0].avatarfull);
                            embed.setColor("RANDOM");
                            return resolve({response: message.author, embed: embed, silent: false});
                        } else {
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle("Unable to find any stats....");
                            embed.setDescription("We are unable to find any stats on " + dataResp.players[0].personaname);
                            embed.setThumbnail(dataResp.players[0].avatarfull);
                            embed.addField("Last played", "Never", true);
                            embed.setColor("RANDOM");
                            return resolve({response: message.author, embed: embed, silent: false});
                        }
                    }).catch(e => {
                        BotSettings.assist.error("There was an error retreiving the CSGO stats.... " + e, message.channel);
                        return resolve({response: "", silent: true});
                    });
                });
            });
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: csgoLookupCmd}
];
