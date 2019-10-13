const moduleInfo = {
    name: "Overwatch",
    truename: "Overwatch",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "Overwatch",
    cmdName: "Overwatch",
    aliases: ["overwatch", "ow"],
    args: {min: 1, max: 3},
    description: "Gets your OW stats",
    usage: "[command:str]",
    exampleUsage: "ow eaaliprantis_1524 [pc] [stats]",
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

owRequest = (bot, message, args, time, prefixUsed, platform, playerName, statType='stats', custom=null) => {
    return new Promise((resolve, reject) => {
        let request = require("request");
        let options = {}
        options.url = "";
        let urlLink = "";
        let finalStat = "";
        if(custom === true || statType === "most" || statType === "mostplayed" || statType === "heroes") {
            urlLink = "https://owapi.net/api/v3/u/" + playerName + "/heroes";
            if(statType === "most" || statType === "mostplayed") {
                finalStat = "most";
            } else {
                finalStat = "heroes";
            }
        } else if(statType === "stats"){
            urlLink = "https://owapi.net/api/v3/u/" + playerName + "/stats";
            finalStat = "stats";
        } else if(statType === "achievements") {
            urlLink = "https://owapi.net/api/v3/u/" + playerName + "/achievements";
            finalStat = "achievements";
        } else if(statType === "heroes") {
            urlLink = "https://owapi.net/api/v3/u/" + playerName + "/heroes";
            finalStat = "heroes";
        } else {
            BotSettings.assist.error("We were unable to find your stats for some reason.", message.channel);
            return resolve({response: "", silent: true});
        }

        if(platform !== "pc" && statType !== "achievements") {
            urlLink += "?platform=" + platform + "&format=json_pretty";
        } else {
            urlLink += "?format=json_pretty"
        }
        console.log(urlLink)
        options.url = urlLink;
        options.headers = {
            'User-Agent': 'Plexus'
        }
        Logger.sendLog("Final URL for OW lookup: " + urlLink, "INFO", __filename);
        /*
        Stats: https://owapi.net/api/v3/u/eaaliprantis-1524/stats
        Achievements: https://owapi.net/api/v3/u/eaaliprantis-1524/achievements
        Heroes: https://owapi.net/api/v3/u/eaaliprantis-1524/heroes
        */
        request.get(options, (err, resp, body) => {
            if(err) {
                BotSettings.assist.error("There was an error when trying to receive your data.... " + err, message.channel);
                return resolve({response: "", silent: true});
            }
            let resultBody;
            try {
                resultBody = JSON.parse(body);
            } catch(e) {
                BotSettings.assist.error("There was an error when trying to retrieve the data that you requested.... " + e, message.channel);
                return resolve({response: "", silent: true});
            }
            if(resultBody.hasOwnProperty("error") && parseInt(resultBody.error) === 404) {
                let errorCode = resultBody.error;
                let S = require("string");
                let errorMsg = resultBody.hasOwnProperty("msg") ? S(resultBody.msg).capitalize().s : "Profile was not able to be found...." ;
                BotSettings.assist.error(errorMsg, message.channel);
                return resolve({response: "", silent: true});
            }
            owExtractInfo(bot, message, resultBody, finalStat).then((finalData) => {
                return resolve(finalData);
            }).catch(errData => {
                return reject(errData);
            });
        });
    });
}

owExtractInfo = (bot, message, body, keyword="stats") => {
    return new Promise((resolve, reject) => {
        let anyData = {any: null, eu: null, kr: null, us: null};
        let bodyData = Object.keys(anyData);
        bodyData.forEach((data) => {
            if(body.hasOwnProperty(data)) {
                if(body[data] !== null) {
                    anyData[data] = true;
                }
            }
        })
        //hero portrait: "https://blzgdapipro-a.akamaihd.net/hero/" + heroName + "/hero-select-portrait.png"
        //https://blzgdapipro-a.akamaihd.net/hero/doomfist/hero-select-portrait.png
        console.log(anyData);
        let trueValues = Object.keys(anyData).filter(x => { if(anyData[x] === null) {return false;} else {return anyData[x]}});
        let owHighest = {};
        trueValues.forEach(y => {
            owHighest[y] = {};
        });
        if(keyword === "heroes" || keyword === "most" || keyword === "stats") {
            trueValues.forEach(z => {
                if(keyword === "heroes" || keyword === "most") {
                    owHighest[z] = owGetHighestTime(z, body[z].heroes, keyword);
                } else {
                    owHighest[z] = owGetHighestTime(z, body[z], keyword);
                }
            });
        } else if(keyword === "achievements") {
            //achievements
            trueValues.forEach(z => {
                owHighest[z] = owAchievementLst(z, body[z])
            });
        }
        let responseData = formatOverWatchData(owHighest);
        return resolve({response: message.author + ", the command is not finished yet.  Patience please...", silent: false});
    });
}

formatOverWatchData = (content) => {
    let embed = new Discord.MessageEmbed();
    Object.keys(content).forEach((key, index) => {
        //empty
    });
    return embed;
}

owAchievementLst = (region, input, keyword) => {
    let response = {};
    let S = require("string");
    Object.keys(input.achievements).forEach((category) => {
        Object.keys(input.achievements[category]).forEach((value) => {
            if(input.achievements[category][value] === "true" || input.achievements[category][value] === true) {
                if(!response.hasOwnProperty(category)) {
                    response[category] = [];
                }
                let tmpValue = value;
                if(tmpValue.includes("_")) {
                    tmpValue = S(tmpValue.split("_").join(" ")).capitalize().s;
                } else {
                    tmpValue = S(tmpValue).capitalize().s;
                }
                response[category].push(tmpValue);
            }
        });
    });
    return response;
}

owGetHighestTime = (region, input, keyword) => {
    let prettyMs = require("pretty-ms");
    let response = {qp: {}, comp: {}};

    function highTime(data) {
        return Object.keys(data).sort((x,y) => {
            if(data[x] > data[y]) return -1;
            if(data[y] > data[x]) return 1;
            return 0;
        });
    }
    let tmpQp = 0;
    if(keyword === "heroes" || keyword === "most") {
        response.comp.data = highTime(input.playtime.competitive);
        response.comp.character = response.comp.data[0];
        response.qp.data = highTime(input.playtime.quickplay);
        if(response.comp.character === response.qp.data[0]) {
            //same character
            response.qp.character = response.qp.data[1];
            tmpQp = 1;
        } else {
            response.qp.character = response.qp.data[0];
            tmpQp = 0;
        }
    }
    response.comp.fullStats = (keyword === "heroes" || keyword === "most") ? input.stats.competitive[response.comp.character] : input.stats.competitive;
    response.qp.fullStats = (keyword === "heroes" || keyword === "most") ? input.stats.quickplay[response.qp.character] : input.stats.quickplay;
    response.qp.hoursPlayed = (keyword === "heroes" || keyword === "most") ? prettyMs(parseFloat(input.playtime.quickplay[response.qp.data[tmpQp]]) * 60 * 60 * 1000) : null;
    response.comp.hoursPlayed = (keyword === "heroes" || keyword === "most") ? prettyMs(parseFloat(input.playtime.competitive[response.comp.data[0]]) * 60 * 60 * 1000) : null;
    response.comp.stats = (keyword === "heroes" || keyword === "most") ? owGetImportantStats(input.stats.competitive[response.comp.character], keyword) : owGetImportantStats(input.stats.competitive, keyword);
    response.qp.stats = (keyword === "heroes" || keyword === "most") ? owGetImportantStats(input.stats.quickplay[response.qp.character], keyword) : owGetImportantStats(input.stats.quickplay, keyword);
    return response;
}

owGetImportantStats = (input, keyword) => {
    let response = {};
    let keyStats = "";
    if(keyword === "heroes" || keyword === "most") {
        keyStats = "general_stats";
    } else if(keyword === "stats") {
        keyStats = "game_stats";
    }
    response.kpd = input[keyStats].hasOwnProperty("kpd") ? input[keyStats].kpd : null;
    response.dmg_Done = input[keyStats].hasOwnProperty("all_damage_done") ? input[keyStats].all_damage_done : 0;
    response.dmg_Avg = input[keyStats].hasOwnProperty("all_damage_done_avg_per_10_min") ? input[keyStats].all_damage_done_avg_per_10_min : 0;
    response.hero_Dmg_Done = input[keyStats].hasOwnProperty("hero_damage_done") ? input[keyStats].hero_damage_done : 0;
    response.hero_Dmg_Avg = input[keyStats].hasOwnProperty("hero_damage_done_avg_per_10_min") ? input[keyStats].hero_damage_done_avg_per_10_min : 0;
    response.critical_Hits = input[keyStats].hasOwnProperty("critical_hits") ? input[keyStats].critical_hits : 0;
    response.critical_Hit_Avg = input[keyStats].hasOwnProperty("critical_hits_avg_per_10_min") ? input[keyStats].critical_hits_avg_per_10_min : 0;
    response.deaths = input[keyStats].hasOwnProperty("deaths") ? input[keyStats].deaths : 0;
    response.death_Avg = input[keyStats].hasOwnProperty("deaths_avg_per_10_min") ? input[keyStats].deaths_avg_per_10_min : 0;
    response.games_Lost = input[keyStats].hasOwnProperty("games_lost") ? input[keyStats].games_lost : 0;
    response.games_Won = input[keyStats].hasOwnProperty("games_won") ? input[keyStats].games_won : 0;
    response.games_Played = input[keyStats].hasOwnProperty("games_played") ? input[keyStats].games_played : 0;
    response.kill_Streak_Best = input[keyStats].hasOwnProperty("kill_streak_best") ? input[keyStats].kill_streak_best : 0;
    response.medals_Total = input[keyStats].hasOwnProperty("medals") ? input[keyStats].medals : 0;
    response.medals_Bronze = input[keyStats].hasOwnProperty("medals_bronze") ? input[keyStats].medals_bronze : 0;
    response.medals_Silver = input[keyStats].hasOwnProperty("medals_silver") ? input[keyStats].medals_silver : 0;
    response.medals_Gold = input[keyStats].hasOwnProperty("medals_gold") ? input[keyStats].medals_gold : 0;
    response.multi_Kill_Best = input[keyStats].hasOwnProperty("multikill_best") ? input[keyStats].multikill_best : 0;
    response.multi_Kills = input[keyStats].hasOwnProperty("multikills") ? input[keyStats].multikills : 0;
    response.weapon_Accuracy = input[keyStats].hasOwnProperty("weapon_accuracy") ? (parseInt(parseFloat(input[keyStats].weapon_accuracy) * 100) + "%") : 0;
    response.weapon_Accuracy_Best = input[keyStats].hasOwnProperty("weapon_accuracy_best_in_game") ? (parseInt(parseFloat(input[keyStats].weapon_accuracy_best_in_game) * 100) + "%") : 0;
    response.win_Percent = input[keyStats].hasOwnProperty("win_percentage") ? (parseInt(parseFloat(input[keyStats].win_percentage) * 100) + "%") : 0;
    response.object_Kills = input[keyStats].hasOwnProperty("objective_kills") ? input[keyStats].objective_kills : 0;
    response.object_Kill_Avg = input[keyStats].hasOwnProperty("objective_kills_avg_per_10_min") ? input[keyStats].objective_kills_avg_per_10_min : 0;
    response.object_Kills_Best = input[keyStats].hasOwnProperty("objective_kills_most_in_game") ? input[keyStats].objective_kills_most_in_game : 0;

    response.time_Played = input[keyStats].hasOwnProperty("time_played") ? input[keyStats].time_played : 0;
    response.time_Played_Fire = input[keyStats].hasOwnProperty("time_spent_on_fire") ? input[keyStats].time_spent_on_fire : 0;
    response.time_Played_Fire_Avg = input[keyStats].hasOwnProperty("time_spent_on_fire_avg_per_10_min") ? input[keyStats].time_spent_on_fire_avg_per_10_min : 0;
    response.time_Played_Fire_Most = input[keyStats].hasOwnProperty("time_spent_on_fire_most_in_game") ? input[keyStats].time_spent_on_fire_most_in_game : 0;

    response.solo_Kills = input[keyStats].hasOwnProperty("solo_kills") ? input[keyStats].solo_kills : 0;
    response.solo_Kills_Avg = input[keyStats].hasOwnProperty("solo_kills_avg_per_10_min") ? input[keyStats].solo_kills_avg_per_10_min : 0;
    response.solo_Kills_Most = input[keyStats].hasOwnProperty("solo_kills_most_in_game") ? input[keyStats].solo_kills_most_in_game : 0;

    if(keyword === "heroes" || keyword === "most") {
        response.hero_Stats = input.hasOwnProperty("hero_stats") ? input.hero_stats : "No Hero Stats";
    } else if(keyword === "stats") {
        response.overall_Stats = input.hasOwnProperty("overall_stats") ? input.overall_stats : "No overall stats";
    }
    return response;
}

owLookupCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let owPlats = [["pc", "steam"], ["xb1", "xbox"], ["psn", "ps4"], ["all"]];
        let availStatType = [["stats", "statistics"], ["most", "mostplayed"], ["achievements", "rewards", "reward"], ["heroes", "hero"]];
        let owSearch = args.shift();
        if((owSearch.includes("_") === true && owSearch.indexOf("_") >= 0) || (owSearch.includes("#") === true && owSearch.indexOf("#") >= 0) ) {
            if(owSearch.includes("_") === true) {
                owSearch = owSearch.replace("_", "-");
            } else if(owSearch.includes("#") === true) {
                owSearch = owSearch.replace("#", "-");
            } else {
                BotSettings.assist.error("Unable to find your username.  Please try again with the correct format.  Example:\n" + prefixUsed + usage.exampleUsage, message.channel);
                return resolve({response: "", silent: true});
            }
        }
        let owPlatPick = null;
        let statTypeStr = null, statTypeCust = null;
        if(args.length >= 1) {
            owPlatPick = args.shift();
            let hasEnteredPick = false;
            owPlatPick = owPlatPick.toLowerCase();
            for(let i = 0; i < owPlats.length; i++) {
                if(owPlats[i].includes(owPlatPick)) {
                    if(i === 0 && hasEnteredPick === false) {
                        owPlatPick = "pc";
                        hasEnteredPick = true;
                    } else if(i === 1 && hasEnteredPick === false) {
                        owPlatPick = "xb1";
                        hasEnteredPick = true;
                    } else if(i === 2 && hasEnteredPick === false) {
                        owPlatPick = "psn";
                        hasEnteredPick = true;
                    } else if(i === 3 && hasEnteredPick === false) {
                        owPlatPick = "all";
                        hasEnteredPick = true;
                    }
                }
            };
            if(args.length === 1) {
                let tmpStatReq = args.shift();
                tmpStatReq = tmpStatReq.toLowerCase();
                let hasAlreadyPicked = false;
                for(let i = 0; i < availStatType.length; i++) {
                    if(availStatType[i].includes(tmpStatReq)) {
                        if(tmpStatReq.startsWith("stats") || tmpStatReq.startsWith("most") || tmpStatReq.startsWith("reward") || tmpStatReq.startsWith("heroes")) {
                            statTypeStr = availStatType[i][0];
                            if(tmpStatReq === "most" || tmpStatReq === "mostplayed") {
                                statTypeCust = true;
                            }
                        }
                    }
                }
            } else {
                if(hasEnteredPick === true) {
                    statTypeStr = "stats";
                } else {
                    let tmpStatReq = owPlatPick;
                    owPlatPick = null;
                    let hasAlreadyPicked = false;
                    for(let i = 0; i < availStatType.length; i++) {
                        if(availStatType[i].includes(tmpStatReq)) {
                            if(tmpStatReq.startsWith("stats") || tmpStatReq.startsWith("most") || tmpStatReq.startsWith("reward") || tmpStatReq.startsWith("heroes")) {
                                statTypeStr = availStatType[i][0];
                                if(tmpStatReq === "most" || tmpStatReq === "mostplayed") {
                                    statTypeCust = true;
                                }
                            }
                        }
                    }
                }
            }
        }
        if(statTypeStr === null) {
            statTypeStr = "stats";
        }
        if(owPlatPick === null) {
            //just get stats
            owPlatPick = "all";
            owRequest(bot, message, args, time, prefixUsed, owPlatPick, owSearch, statTypeStr, statTypeCust).then((owData) => {
                return resolve(owData);
            }).catch(owErr => {
                return reject(owErr);
            });
        } else {
            owRequest(bot, message, args, time, prefixUsed, owPlatPick, owSearch, statTypeStr, statTypeCust).then((owData) => {
                return resolve(owData);
            }).catch(owErr => {
                return reject(owErr);
            });
        }
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: owLookupCmd}
];
