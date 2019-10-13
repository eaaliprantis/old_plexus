const moduleInfo = {
    name: "pubg",
    truename: "pubg",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "pubg",
    cmdName: "pubg",
    aliases: ["pubg", "pubglookup", "pubgstats"],
    args: {min: 1, max: 3},
    description: "Lookup stats on PUBG",
    usage: "[command:str]",
    exampleUsage: "pubg eaaliprantis solo",
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

pubgLookupCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        if(!BotSettings.games.hasOwnProperty("pubg")) {
            BotSettings.games.pubg = {};
            let {PubgAPI, PubgAPIErrors, REGION, SEASON, MATCH} = require('pubg-api-redis');
            BotSettings.games.pubg.api = new PubgAPI({
                apikey: BotSettings.assist.getConstants("pubg-api"),
                redisConfig: {
                    host: '127.0.0.1',
                    port: 6379,
                    expiration: 300,
                }
            });
            BotSettings.games.pubg.PubgAPIErrors = PubgAPIErrors;
            BotSettings.games.pubg.REGION = REGION;
            BotSettings.games.pubg.SEASON = SEASON;
            BotSettings.games.pubg.MATCH = MATCH;
        }
        //pubg = pc ONLY
        //pubg <username|id> [match] [region]
        let steamInfo = "", matchInfo = BotSettings.games.pubg.MATCH['SOLO'], regionInfo = null;

        let playerChoice = args.shift();
        playerChoice = playerChoice.toLowerCase();

        if(args.length >= 1) {
            //match or region
            let matchRestrict = Object.keys(BotSettings.games.pubg.MATCH);
            let regionRestrict = Object.keys(BotSettings.games.pubg.REGION);
            let matchVal = "", matchValSet = false, regionVal = "", regionValSet = false;
            args.forEach(argVal => {
                let matchOrRegion = argVal.toUpperCase();
                if(matchRestrict.includes(matchOrRegion) || regionRestrict.includes(matchOrRegion)) {
                    if(matchRestrict.includes(matchOrRegion) && matchValSet === false) {
                        matchVal = BotSettings.games.pubg.MATCH[matchOrRegion];
                        matchValSet = true;
                    }
                    if(regionRestrict.includes(matchOrRegion) && regionValSet === false) {
                        regionVal = BotSettings.games.pubg.MATCH[matchOrRegion];
                        regionValSet = true;
                    }
                }
            });
            if(
                (((matchValSet === false && regionValSet === true) || (regionValSet === false && matchValSet === true) || (regionValSet === true && matchValSet === true && args.length === 2)) && args.length >= 1)
            ) {
                //something was set
                if(matchValSet) {
                    matchInfo = matchVal;
                }
                if(regionValSet) {
                    regionInfo = regionVal;
                }
            } else {
                //unable to detect, throw error
                BotSettings.assist.error("We were unable to detect which match or which region you were wanting to search.\nAvailable Options: \n-> Matches: " + matchRestrict.filter(x => "`" + x.toLowerCase() + "`").join(", ") + "\n-> Regions: " + regionRestrict.filter(y => "`" + y.toLowerCase() + "`").join(", "), message.channel);
                return resolve({response: "", silent: true});
            }
        } else {
            //default stuff, nothing
        }


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
        if(vanityURL === null) {
            steamInfo = finalPlayer;
            getPubgStats(steamInfo, matchInfo, regionInfo, message).then((resp) => {
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
                getPubgStats(steamInfo, matchInfo, regionInfo, message).then((resp) => {
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
                        getPubgStats(steamInfo, matchInfo, regionInfo, message).then((resp) => {
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

getPubgStats = (steamId, matchId, regionId, message) => {
    return new Promise((resolve, reject) => {
        let S = require("string");
        BotSettings.games.pubg.api.getAccountBySteamID(steamId).then((account) => {
            BotSettings.games.pubg.api.getProfileByNickname(account.Nickname).then((profile) => {
                //avatarURL = account.AvatarUrl;
                //State = account.State;
                let data = profile.content;
                if(profile.stats === [] || profile.stats.length === 0) {
                    //No data
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle("[" + S(matchId).capitalize().s + "] for " + data.PlayerName);
                    let regionResp = "";
                    if(regionId === null) {
                        if(data.selectedRegion === null) {
                            regionResp = "Not Assigned";
                        } else {
                            regionResp = S(data.selectedRegion).capitalize().s;
                        }
                    }
                    embed.setColor("RANDOM");
                    embed.setDescription("**There were no stats available.**");
                    embed.addField("State", account.State, true);
                    embed.addField("Season", data.defaultSeason, true);
                    embed.addField("Region", regionResp, true);
                    let inviteAllow = "Disabled";
                    if(account.InviteAllow !== null) {
                        inviteAllow = "Enabled";
                    }
                    embed.addField("InviteAllow", inviteAllow, true);
                    embed.setThumbnail(account.AvatarUrl);
                    return resolve({response: message.author, embed: embed, silent: false});
                } else {
                    //there was stats
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle("[" + S(matchId).capitalize().s + "] for " + data.PlayerName);
                    embed.setThumbnail(account.AvatarUrl);
                    let regionResp = "";
                    if(regionId === null) {
                        if(data.selectedRegion === null) {
                            regionResp = BotSettings.games.pubg.REGION["ALL"];
                        } else {
                            regionResp = BotSettings.games.pubg.REGION[data.selectedRegion.toUpperCase()];
                        }
                    }
                    let seasonId = data.defaultSeason;
                    let stats = profile.getStats({
                        region: regionResp,
                        seasion: seasonId,
                        match: matchId
                    });
                    let inviteAllow = "Disabled";
                    if(account.InviteAllow !== null) {
                        inviteAllow = "Enabled";
                    }
                    let descStat = "";
                    descStat += "• State: " + account.State;
                    descStat += "\n• InviteAllow: " + inviteAllow;
                    embed.setDescription("Current stats for Season **__" + S(seasonId).capitalize().s + "__**\n" + descStat);
                    embed.setFooter("Powered by PUBGTracker | https://pubgtracker.com/site-api")
                    function formatDataStr(statLookup, numConvert=false, customDisplay=false) {
                        let sCount = 0;
                        let finalText = "";
                        let dot = "• ";
                        Object.keys(statLookup).forEach((key) => {
                            let nlineChar = "\n";
                            let convertData = "";
                            if(numConvert === false) {
                                convertData = statLookup[key];
                            } else {
                                if(customDisplay === true) {
                                    if(key.toLowerCase().endsWith("ratio") || key.toLowerCase().includes("ratio")) {
                                        convertData = statLookup[key] + "%";
                                    } else if(key.toLowerCase().startsWith("time") || key.toLowerCase().endsWith("time") || key.toLowerCase().includes("time")) {
                                        let numConvert = Math.ceil(parseFloat(parseInt(statLookup[key]) / 60));
                                        convertData = numConvert + " minutes";
                                    } else if(key.toLowerCase().startsWith("move") || key.toLowerCase().endsWith("distance") || key.toLowerCase().includes("distance")) {
                                        let KmtoMiles = require("kilometers-to-miles");
                                        let ktm = new KmtoMiles();
                                        let numConvert = parseFloat(ktm.get(parseInt(statLookup[key])));
                                        convertData = numConvert.toFixed(3) + " miles";
                                    } else if(key.toLowerCase() === "days") {
                                            convertData = statLookup[key];
                                    } else {
                                        convertData = statLookup[key];
                                    }
                                } else {
                                    if(key.toLowerCase() === "days") {
                                        convertData = statLookup[key];
                                    } else {
                                        convertData = statLookup[key];
                                    }
                                }
                            }
                            let tmpStr = dot + "**" + S(key).capitalize().s + "**: `" + convertData + "`";
                            finalText += (Object.keys(statLookup).length - 1 !== sCount) ? tmpStr + nlineChar : tmpStr;
                            sCount++;
                        });
                        return finalText;
                    }
                    //formatDataStr(statLookup, numConvert=false, customDisplay=false, numTypeFrom="seconds", numTypeTo="minutes")
                    let skillRatingStats = stats.skillRating;
                    let performanceStats = stats.performance;
                    let pergameStats = stats.perGame;
                    let combatStats = stats.combat;
                    let survivalStats = stats.survival; //convert seconds to minutes
                    let distanceStats = stats.distance; //convert km to miles
                    let supportStats = stats.support;

                    /*
                    :chart_with_upwards_trend: Skill Rating
                    :part_alternation_mark: Performance
                    :crossed_swords: Combat
                    :ambulance: Support
                    :lifter: Survival
                    :video_game: Per Game Stats
                    :blue_car: Distance Travelled
                    */

                    embed.addField(":chart_with_upwards_trend: Skill Rating", formatDataStr(skillRatingStats), true);
                    embed.addField(":part_alternation_mark: Performance", formatDataStr(performanceStats, true, true), true);
                    embed.addField(":crossed_swords: Combat", formatDataStr(combatStats, true, true), true);
                    embed.addField(":ambulance: Support", formatDataStr(supportStats), true);
                    embed.addField(":lifter: Survival", formatDataStr(survivalStats, true, true), true);
                    embed.addField(":video_game: Per Game Stats", formatDataStr(pergameStats, true, true), true);
                    embed.addField(":blue_car: Distance Travelled", formatDataStr(distanceStats, true, true), true);
                    return resolve({response: message.author, embed: embed, silent: false});
                }
            }).catch(errProf => {
                BotSettings.assist.error("There was an error retrieving the profile information.... " + errProf, message.channel);
                return resolve({response: "", silent: true});
            });
        }).catch(errAccount => {
            BotSettings.assist.error("There was an error retrieving the profile information.... " + errAccount, message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: pubgLookupCmd}
];
