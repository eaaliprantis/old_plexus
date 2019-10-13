const moduleInfo = {
    name: "stream",
    truename: "stream",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usageTwitch = {
    name: "twitch",
    cmdName: "twitch",
    aliases: ["twitch", "twitchstatus", "twitchlive"],
    args: {min: 1, max: 1},
    description: "Checks if a twitch user is streaming",
    exampleUsage: "twitch eaaliprantis",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Stream",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageTwitchC = {
    name: "twitch channel",
    cmdName: "twitchchannel",
    aliases: ['twitchchannel', 'twitchinfo', 'twitchchannelinfo'],
    args: {min: 1, max: 1},
    description: "Gets some background information on a twitch channel.",
    exampleUsage: "twitchchannel eaaliprantis",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Stream",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageYoutube = {
    name: "youtube",
    cmdName: "youtube",
    aliases: ["youtube", "youtubestatus", "youtubelive"],
    args: {min: 1, max: 1},
    description: "Checks if a youtube user is streaming",
    exampleUsage: "youtube jacksepticeye",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Stream",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageBeam = {
    name: "mixer",
    cmdName: "mixer",
    aliases: ["mixer", "mixerstatus", "mixerlive"],
    args: {min: 1, max: 1},
    description: "Checks if a Mixer user is streaming",
    exampleUsage: "mixer eaaliprantis",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Stream",
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

streamNotifyCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {

    })
}

twitchLookup = (name) => {
    return new Promise((resolve, reject) => {
        let username = name.trim();
        let url = 'https://api.twitch.tv/kraken/streams/' + username;
        let request = require("request");
        request({
            url: url,
            headers: {
                'Accept': 'application/vnd.twitchtv.v3+json',
                'Client-ID': BotSettings.assist.getConstants("twitch")
            }
        }, (error, response, body) => {
            if(error) {
                return reject({response: error});
            }
            if(!error && response.statusCode === 200) {
                let resp;
                try {
                    resp = JSON.parse(body);
                } catch(e) {
                    return resolve({response: "The API returned an unconventional response.", silent: false});
                }
                let embed = new Discord.MessageEmbed();
                embed.setColor("#6441a5");
                embed.setTitle(username);
                let streamResp = "No";
                if(resp.stream !== null) {
                    streamResp = "Yes";
                    //gather more data
                    embed.setTitle(username + " is playing " + resp.stream.channel.status);
                    embed.addField("Streaming?", streamResp, true);
                    embed.setImage(resp.stream.preview.medium);
                    embed.addField("Current Game", resp.stream.game, true);
                    embed.addField("Current Viewers", resp.stream.viewers, true);
                    embed.addField("Total Viewers", resp.stream.channel.views, true);
                    embed.addField("Total followers", resp.stream.channel.followers, true);
                    let maturity = (resp.stream.channel.mature === true) ? "Yes" : "No";
                    let partner = (resp.stream.channel.partner === true) ? "Yes" : "No";
                    embed.addField("Mature", maturity, true);
                    embed.addField("Partner", partner, true);
                    embed.setThumbnail(resp.stream.channel.logo);
                    embed.setURL(resp.stream.channel.url);
                    let teamURL = resp.stream.channel._links.teams;
                    let commUrl = "https://api.twitch.tv/kraken/channels/" + resp.stream.channel._id + '/communities';
                    let commHeader = {
                        'Accept': 'application/vnd.twitchtv.v5+json',
                        'Client-ID': BotSettings.assist.getConstants("twitch")
                    };
                    let teamHeader = {
                        'Accept': 'application/vnd.twitchtv.v3+json',
                        'Client-ID': BotSettings.assist.getConstants("twitch")
                    }
                    let promiseArr = [];
                    promiseArr.push(getMoreData(teamURL, teamHeader));
                    promiseArr.push(getMoreData(commUrl, commHeader));
                    promiseArr.push(Database.callStatement("SELECT name FROM languages WHERE abbr='" + resp.stream.channel.broadcaster_language + "' OR abbr='" + resp.stream.channel.language + "' LIMIT 1"));
                    Promise.all(promiseArr).then(values => {
                        let idCounter = 1;
                        let promiseOrder = [];
                        values.forEach(valueData => {
                            let S = require("string");
                            let searchTitle = "";
                            let data;
                            let errorThrown = false;
                            try {
                                data = JSON.parse(valueData.body);
                            } catch(e2) {
                                errorThrown = true;
                                if(Array.isArray(valueData)) {
                                    //is an array
                                    promiseOrder.push({id: 1, title: "Broadcaster Language", value: valueData[0].name, inline: true});
                                } else {
                                    return resolve({response: "{message.author}", embed: embed, silent: false});
                                }
                            }
                            if(errorThrown === false) {
                                if(data.hasOwnProperty("teams") && valueData.title.toLowerCase() === "teams") {
                                    searchTitle = "teams";
                                } else if(data.hasOwnProperty("communities") && valueData.title.toLowerCase() === "communities") {
                                    searchTitle = "communities";
                                } else {
                                    searchTitle = null;
                                }
                                if(searchTitle !== null) {
                                    //has teams
                                    let searchBool = (Array.isArray(data[searchTitle]) && data[searchTitle].length >= 1) ? "True" : "False";
                                    if(Array.isArray(data[searchTitle]) && data[searchTitle].length >= 1) {
                                        let teamLstDName = [];
                                        let teamLstName = [];
                                        data[searchTitle].forEach(teamInfo => {
                                            teamLstDName.push(teamInfo.display_name);
                                            teamLstName.push(teamInfo.name);
                                        });
                                        if(teamLstDName.length === 0) {
                                            promiseOrder.push({id: (idCounter + 1), title: S(valueData.title).capitalize().s + "?", value: "There were no " + valueData.title + " found", inline: true});
                                        } else {
                                            promiseOrder.push({id: (idCounter + 1), title: S(valueData.title).capitalize().s + "?", value: teamLstDName.join("\n"), inline: true});
                                        }
                                    } else {
                                        promiseOrder.push({id: (idCounter + 1), title: S(valueData.title).capitalize().s + "?", value: "There were no " + valueData.title + " found", inline: true});
                                    }
                                    idCounter++;
                                } else {
                                    promiseOrder.push({id: (idCounter + 1), title: S(valueData.title).capitalize().s + "?", value: "There were no " + valueData.title + " found", inline: true});
                                    idCounter++;
                                }
                            }
                        });
                        let sortOrder = promiseOrder.sort((a, b) => {
                            let idA = a.id;
                            let idB = b.id;
                            if(idA < idB) return -1;
                            if(idA > idB) return 1;
                            return 0;
                        });
                        sortOrder.forEach(orderData => {
                            embed.addField(orderData.title, orderData.value, orderData.inline);
                        });
                        return resolve({response: "{message.author}", embed: embed, silent: false});
                    }).catch(errValues => {
                        embed.setDescription("We were unable to find out what team and communities that " + username + " is apart of.  We apologize for this issue.");
                        return resolve({response: "{message.author}", embed: embed, silent: false});
                    });
                } else if(resp.stream === null) {
                    //data unavailable
                    embed.setDescription(username + " is currently not streaming.");
                    embed.addField("Streaming?", streamResp, true);
                    return resolve({response: "{message.author}", embed: embed, silent: false});
                } else {
                    embed.setDescription(username + " is currently not streaming.");
                    return resolve({response: "{message.author}", embed: embed, silent: false});
                }

            } else if(!error && response.statusCode === 404) {
                return resolve({response: "Channel does not exist.", silent: false});
            }
        });
    });
}

twitchCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        twitchLookup(args[0]).then(data => {
            if(data.response === "{message.author}") {
                data.response = message.author;
            }
            return resolve(data);
        }).catch(err => {
            console.log(err.response);
            BotSettings.assist.error(err.response, message.channel);
            return resolve({response: "", silent: true, error: true});
        })
    });
}

getMoreData = (_url, _headers) => {
    return new Promise((resolve, reject) => {
        let urlTerm = _url.split("/")[_url.split("/").length - 1];
        let request = require("request");
        request({
            url: _url,
            headers: _headers
        }, (error, response, body) => {
            if(error) {
                console.log(error);
                return reject({response: "", error: true, title: urlTerm, status: response.statusCode});
            }
            if(!error && response.statusCode === 200) {
                return resolve({response: response, body: body, error: false, title: urlTerm, status: response.statusCode})
            } else {
                return reject({response: "", error: true, status: response.statusCode, title: urlTerm});
            }
        });
    })
}

youtubeCmd = (bot, message, args, time, prefixUsed, shardId) => {
    //https://www.googleapis.com/youtube/v3/channels?key={}&forUsername=exuviax&part=id
    //https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCXswCcAMb5bvEUIDEzXFGYg&type=video&eventType=live&key=[API_KEY]
    let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=' + args[0].trim() + "&type=video&eventType=live&key=" + BotSettings.assist.getConstants("youtube");
    request({
        url: url
    }, (error, response, body) => {
        if(error) {
            console.log(error.message);
            BotSettings.assist.error(error.message, message.channel);
            return resolve({response: "", silent: true});
        } else {
            if(!error && response.statusCode === 200) {
                let resp;
                try {
                    resp = JSON.parse(body);
                } catch(e) {
                    return resolve({response: "The API returned an unconventional response", silent: false});
                }
                if(resp.items.length === 0) {
                    return resolve({response: "No results found.", silent: false});
                } else {
                    if(resp.items.length === 1) {
                        let itemResp = resp.items[0];
                        let videoId = itemResp.id.videoId;
                        let channelInfo = itemResp.snippet.channelId;
                        let videoTitle = itemResp.snippet.title;
                        let videoDesc = itemResp.snippet.description;
                        let thumbnail = itemResp.snippet.thumbnails.default.url;
                        let isLive = itemResp.snippet.liveBroadcastContent;
                        if(isLive !== undefined && isLive !== null && isLive.toLowerCase() === "live") {
                            let embed = new Discord.MessageEmbed();
                            embed.setTitle((itemResp.channelTitle !== "") ? itemResp.channelTitle : videoTitle);
                            embed.setDescription(videoDesc);
                            embed.setThumbnail(thumbnail);
                            embed.addField("**Status**", "Users channel is currently live");
                            embed.setURL("https://www.youtube.com/watch?v=" + videoId);
                            return resolve({response: "", embed: embed, silent: false});
                        } else {
                            return resolve({response: "User requested is not currently live", silent: false});
                        }
                    }
                }
            }
        }
    });
}

beamCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let url = 'https://mixer.com/api/v1/channels/' + args[0].trim();
        let request = require("request");
        request({
            url: url,
        }, (error, response, body) => {
            if(error) {
                console.log(error);
                BotSettings.assist.error(error, message.channel);
                return resolve({response: "", silent: true, error: true});
            }
            if(!error && response.statusCode === 200) {
                let resp;
                try {
                    resp = JSON.parse(body);
                } catch(e) {
                    return resolve({response: "The API returned an unconventional response.", silent: false});
                }
                if(resp && resp.online) {
                    let embed = new Discord.MessageEmbed();
                    embed.setThumbnail(resp.thumbnail.url);
                    embed.setDescription(args[0].trim() + " is currently live at https://mixer.com/" + args[0].trim());
                    return resolve({response: "", embed: embed, silent: false});
                } else if(resp.online === false) {
                    return resolve({response: args[0].trim() + ' is not currently streaming or is offline.', silent: false});
                } else {
                    return resolve({response: args[0].trim() + ' does not exist.', silent: false});
                }
            } else if(!error && response.statusCode === 404) {
                return resolve({response: "Channel does not exist."});
            }
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageTwitch.aliases, args: usageTwitch.args, usage: usageTwitch, run: twitchCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageBeam.aliases, args: usageBeam.args, usage: usageBeam, run: beamCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageYoutube.aliases, args: usageYoutube.args, usage: usageYoutube, run: youtubeCmd}
];
