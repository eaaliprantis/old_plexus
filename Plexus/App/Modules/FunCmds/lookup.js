const moduleInfo = {
    name: "search",
    truename: "lookup",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usageRandomWord = {
    name: "randomword",
    cmdName: "randomword",
    aliases: ["randomword", "wordrandom", "rword"],
    args: {min: 0, max: 0},
    description: "Find a random English Word",
    exampleUsage: "randomword",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Search",
    example: "randomword",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageRoblox = {
    name: "roblox",
    cmdName: "roblox",
    aliases: ["roblox", "robloxsearch"],
    args: {min: 3, max: 3},
    description: "Find a roblox player",
    exampleUsage: "roblox user info eaaliprantis",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Search",
    example: "roblox user info {username}\nroblox user exists {username}",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageGShorten = {
    name: "google",
    cmdName: "gshorten",
    aliases: ["gshorten", "googleshorten", "shorten"],
    args: {min: 1, max: 1},
    description: "Shorten a google link",
    exampleUsage: "gshorten https://goo.gl/675fbm",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Search",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageGSearch = {
    name: "google",
    cmdName: "search",
    aliases: ["search", "google", "gsearch", "googlesearch"],
    args: {min: 1, max: 100},
    description: "Search something on google",
    exampleUsage: "search Taylor Swift",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Search",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageYTSearch = {
    name: "ytsearch",
    cmdName: "ytsearch",
    aliases: ["ytsearch"],
    args: {min: 1, max: 25},
    description: "Search for something on Youtube.",
    exampleUsage: "ytsearch Taylor Swift",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Search",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageItunes = {
    name: "itunes",
    cmdName: "itunes",
    aliases: ["searchitunes", "itunes", "itunessearch", "appstore"],
    args: {min: 1, max: 25},
    description: "Searches for anything in the iTunes store",
    exampleUsage: "searchitunes Discord",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Search",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageGPlay = {
    name: "googleplay",
    cmdName: "googleplay",
    aliases: ["searchgoogleplay", "gplay", "googleplay", "googleplaystore", "playstore"],
    args: {min: 1, max: 25},
    description: "Searches for anything in the Google Play store",
    exampleUsage: "gplay Discord",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Search",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageImdb = {
    name: "imdb",
    cmdName: "imdb",
    aliases: ["imdb", "imdbsearch"],
    args: {min: 1, max: 25},
    description: "Searches for anything in the IMDB store",
    exampleUsage: "imdb Michael Bay",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Search",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageSpotify = {
    name: "spotify",
    cmdName: "spotify",
    aliases: ["spotify", "spotifysearch"],
    args: {min: 1, max: 25},
    description: "Searches for anything via the Spotify API",
    exampleUsage: "spotify music Taylor Swift",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Search",
    availOpts: {
        availList: ['music', 'search', 'playlist', 'personalize', 'browse'],
        musicSearch: ["albums", "artists", "tracks"],
        musicSearchMulti: true,
        search: ["albums", "artists", "tracks", "playlists"],
        playlist: ["get", "create", "change", "add", "remove", "replace", "reorder"],
        ownerPlaylist: true,
        personalize: ["top", "recent"],
        browse: ["new", "featured", "category", "recommendation", "genre"]
    },
    permlvl: 0,
    premiumLvl: 0,
    enabled: false,
    contributors: [""]
}

const usageFortune = {
    name: "fortune",
    cmdName: "fortune",
    aliases: ["fortune", "fortunesearch"],
    args: {min: 1, max: 1},
    description: "Searches for anything in the Fortune Machine",
    exampleUsage: "fortune all",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Search",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageUrban = {
    name: "urban",
    cmdName: "urban",
    aliases: ["urban", "urbandict", "urbanlookup"],
    args: {min: 1, max: 10},
    description: "Fetch information from urban dictionary",
    exampleUsage: "urban Plexus",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Search",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageMsTranslate = {
    name: "translator",
    cmdName: "translator",
    aliases: ["mstranslator", "translate", "translator"],
    args: {min: 3, max: 50},
    description: "Translator your text from one language to another",
    example: "translate en fr Hello my name is Manny\ntranslate ? fr Hello my name is Manny",
    exampleUsage: "translate en fr Hello my name is Manny\ntranslate ? fr Hello my name is Manny",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Translate",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageTime = {
    name: "time",
    cmdName: "time",
    aliases: ["time", "timeassist", "converttime"],
    args: {min: 3, max: 3},
    description: "Converts one timezone to another timezone",
    exampleUsage: "time 12:00pm EDT PDT",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "Search",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageNPMLookup = {
    name: "npmname",
    cmdName: "npmname",
    aliases: ["npmname", "npmnamelookup", "npmnameavail", "npmavail"],
    args: {min: 1, max: 50},
    description: "Checks to see if the npm module name is available or not",
    exampleUsage: "npmname Billy abc1234",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Search",
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

getAppList = (suffix) => {
    let apps = suffix;
    let i = 0;
    while(i<apps.length) {
        if(!apps[i] || apps.indexOf(apps[i]) !== i) {
            apps.splice(i, 1);
        } else {
            apps[i] = apps[i].trim();
            i++;
        }
    }
    return apps;
}

itunesCmds = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let itunes = require("searchitunes");
        let apps = getAppList(args);
        if(apps.length > 0) {
            let results = [];
            let fetchApp = (i, callback) => {
                if(i >= apps.length) {
                    callback();
                } else {
                    itunes({
                        entity: "software",
                        country: "US",
                        term: apps[i],
                        limit: 1
                    }, (err, data) => {
                        if(err) {
                            results.push(`No results found for \`${apps[i]}\``);
                        } else {
                            results.push(`**${data.results[0].trackCensoredName}** by ${data.results[0].artistName}, ${data.results[0].formattedPrice} and rated ${data.results[0].averageUserRating} stars: <${data.results[0].trackViewUrl}>`);
                        }
                        fetchApp(++i, callback);
                    });
                }
            }
            fetchApp(0, () => {
                let embed = new Discord.MessageEmbed();
                embed.setColor(0x2885bd);
                embed.setThumbnail("https://support.apple.com/content/dam/edam/applecare/images/en_US/itunes/featured-contetn-itunes-icon_2x.jpg");
                embed.addField("List", results.join("\n"));
                message.channel.send("", {embed: embed});
            });
            return resolve({response: "", silent: true});
        } else {
            let embed = new Discord.MessageEmbed();
            embed.setColor('RANDOM');
            embed.addField("Content", "http://www.apple.com/itunes/charts/free-apps/");
            return resolve({response: "", embed: embed, silent: false});
        }
    });
}

robloxCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let unirest = require("unirest");
        let userArg = args.shift();
        if(userArg.toLowerCase() === "user") {
            let typeArg = args.shift();
            let userName = args.shift();
            if(typeArg.toLowerCase() === "exists") {
                unirest.get('http://api.roblox.com/users/get-by-username?username='+userName).header("Accept", "application/json").end(res => {
                    console.log(res.body);
                    if(res.status === 200) {
                        let resp = "";
                        try {
                            resp = JSON.parse(JSON.stringify(res.body));
                        } catch(e) {
                            BotSettings.assist.error("The API returned an unconventional response", message.channel);
                            return resolve({response: "", silent: true});
                        }
                        if(resp.Username) {
                            return resolve({response: "User does exist.", silent: false});
                        } else {
                            return resolve({response: "User does not exist.", silent: false});
                        }
                    } else if(res.status === 404) {
                        BotSettings.assist.error("User does not exist", message.channel);
                        return resolve({response: "", silent: true});
                    } else {
                        BotSettings.assist.error("User does not exist or has returned an error", message.channel);
                        return resolve({response: "", silent: true});
                    }
                });
            } else if(typeArg.toLowerCase() === "info") {
                unirest.get('http://api.roblox.com/users/get-by-username?username='+userName).header("Accept", "application/json").end(res => {
                    console.log(res.body);
                    if(res.status === 200) {
                        let resp = "";
                        let userId = "";
                        try {
                            resp = JSON.parse(JSON.stringify(res.body));
                        } catch(e) {
                            console.log(e);
                            BotSettings.assist.error("The API returned an unconventional response.", message.channel);
                            return resolve({response: "", silent: true});
                        }
                        if(resp.Id) {
                            userId = resp.Id;
                            unirest.get("https://www.roblox.com/users/"+userId+"/profile").end(profileRes => {
                                let cheerio = require("cheerio");
                                if(profileRes.status === 200) {
                                    let $ = cheerio.load(profileRes.body);

                                    var status = $("[profile-header-data]").attr("data-statustext") || "N/A";
                    				var username = $("[profile-header-data]").attr("data-profileusername") || "N/A";
                    				var pastnicknames = $(".tooltip-pastnames").attr("title") || "N/A";
                    				var fc1 = $("[profile-header-data]").attr("data-friendscount") || "N/A";
                    				var fc2 = $("[profile-header-data]").attr("data-followingscount") || "N/A";
                    				var fc3 = $("[profile-header-data]").attr("data-followerscount") || "N/A";
                    				var avatar = $(".avatar-card-image.profile-avatar-thumb").attr("src") || "N/A";
                    				var bio = $(".profile-about-content-text").html() || "N/A";
                    				var onlinestatus = "Offline";
                    				var pre_online = $(".profile-avatar-status").attr('class') || "N/A";
                    				if(pre_online != undefined){
                    					var online = pre_online.split(/\s+/);
                    					if(online.indexOf("icon-online") > -1){
                    						onlinestatus = "Online";
                    					} else if(online.indexOf("icon-game") > -1){
                    						onlinestatus = "In game";
                    					} else if(online.indexOf("icon-studio") > -1){
                    						onlinestatus = "In studio";
                    					}
                    				}

                                    let embed = new Discord.MessageEmbed();
                                    embed.setTitle("Information about " + username);

                                    bio = BotSettings.assist.decodeHTML(bio);
                                    if(bio.length > parseInt(BotSettings.discordServers.limits.description)) {
                                        //greater than 2000
                                        bio = bio.substring(0, 1900) + "...";
                                    }
                                    embed.setDescription(bio);
                                    embed.setURL("https://www.roblox.com/users/"+userId+"/profile");
                                    embed.setAuthor(username, "https://www.roblox.com/users/"+userId+"/profile", avatar);
                                    embed.addField("Username", username, true);
                                    embed.addField("Status", onlinestatus, true);
                                    embed.addField("Friends", fc1, true);
                                    embed.addField("Followers", fc3, true);
                                    embed.addField("Following", fc2, true);
                                    embed.addField("Nicknames", pastnicknames, true);
                                    embed.setThumbnail(avatar);
                                    return resolve({response: "", embed: embed, silent: false});
                                } else {
                                    BotSettings.assist.error("The API returned an unconventional response.", message.channel);
                                    return resolve({response: "", silent: true});
                                }
                            });
                        } else {
                            BotSettings.assist.error("User does not exist or is banned", message.channel);
                            return resolve({response: "", silent: true});
                        }
                    } else if(res.status === 404) {
                        BotSettings.assist.error("User does not exist or is banned", message.channel);
                        return resolve({response: "", silent: true});
                    } else if(res.status === 400) {
                        BotSettings.assist.error("400 bad request returned", message.channel);
                        return resolve({response: "", silent: true});
                    } else {
                        BotSettings.assist.error("User does not exist or has returned an error", message.channel);
                        return resolve({response: "", silent: true});
                    }
                });
            } else {
                BotSettings.assist.error("Usage: " + usageRoblox.example, message.channel);
                return resolve({response: "", silent: true});
            }
        } else {
            BotSettings.assist.error("Usage: " + usageRoblox.example, message.channel);
            return resolve({response: "", silent: true});
        }
    });
}

shortnCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let googl = require("goo.gl");
        let response = args.join(" ");
        if(response) {
            googl.setKey(BotSettings.assist.getConstants("youtube"));
            if(response.toLowerCase().indexOf("http://goo.gl/") == 0 || response.toLowerCase().indexOf("https://goo.gl/") == 0 || response.toLowerCase().indexOf("goo.gl/") == 0) {
                googl.expand(response).then(url => {
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle("Expanded URL");
                    embed.setDescription("Your expanded url is: " + url);
                    embed.setColor("RANDOM");
                    return resolve({response: "", embed: embed, silent: false});
                }).catch(err => {
                    BotSettings.assist.error("An error occurred.  That is all that we know that has happened.", message.channel);
                    return resolve({response: "", silent: true});
                })
            } else {
                googl.shorten(response).then(url => {
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle("Shortened URL");
                    embed.setDescription("Your shortened url is: " + url);
                    embed.setColor("RANDOM");
                    return resolve({response: "", embed: embed, silent: false});
                }).catch(err => {
                    BotSettings.assist.error("An error occurred.  That is all that we know that has happened.", message.channel);
                    return resolve({response: "", silent: true});
                });
            }
        }
    });
}

imdbCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let query = args.join(" ");
        let type = "";
        if(query.toLowerCase().indexOf("series ") === 0 || query.toLowerCase().indexOf("episode ") === 0 || query.toLowerCase().indexOf("movie ") === 0) {
            type = `&type=${query.substring(0,query.indexOf(" ")).toLowerCase()}`;
            query = query.substring(query.indexOf(" ") + 1);
        }
        if(query) {
            let unirest = require("unirest");
            unirest.get(`http://www.omdbapi.com/?t=${encodeURIComponent(query)}&r=json${type}`).header("Accept", "application/json").end(res => {
                if(res.status === 200 && res.body.Response === "True") {
                    let embed = new Discord.MessageEmbed();
                    embed.setURL(`http://www.imdb.com/title/${res.body.imdbID}/`);
                    embed.setColor("RANDOM");
                    embed.setTitle(`__**${res.body.Title}${type ? "" : (` (${res.body.Type.charAt(0).toUpperCase()}${res.body.Type.slice(1)})`)}**__`);
                    embed.setDescription("**Plot**:" + res.body.Plot);
                    embed.addField("**Year**", res.body.Year, true);
                    embed.addField("**Rated**", res.body.Rated, true);
                    embed.addField("**Runtime**", res.body.Runtime, true);
                    embed.addField("**Actors**", res.body.Actors.replaceAll(", ", "\n\t"), true);
                    embed.addField("**Director**", res.body.Director, true);
                    embed.addField("**Writer**", res.body.Writer, true);
                    embed.addField("**Genre(s)**", res.body.Genre.replaceAll(", ", "\n\t"), true);
                    embed.addField("**Rating**", res.body.imdbRating + " out of " + res.body.imdbVotes + " votes", true);
                    embed.addField("**Awards**", res.body.Awards, true);
                    embed.addField("**Country**", res.body.Country, true);
                    return resolve({response: "", embed: embed, silent: false});
                } else {
                    return resolve({response: "Nothing found in IMDB", silent: false});
                }
            });
        } else {
            return resolve({response: "You cannot have an empty query.", silent: false});
        }
    });
}

fortuneCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        const categories = ["all", "computers", "cookie", "definitions", "miscellaneous", "people", "platitudes", "politics", "science", "wisdom"];
        let suffix = args.join(" ");
        if(suffix) {
            let category_suffix = suffix.trim().toLowerCase();
            if(categories.includes(category_suffix)) {
                let unirest = require("unirest");
                unirest.get(`http://yerkee.com/api/fortune/${category_suffix}`).header("Accept", "application/json").end(res => {
                    if(res.status === 200) {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle('The Fortune Machine says:');
                        embed.setDescription(res.body.fortune);
                        return resolve({response: "", embed: embed, silent: false});
                    } else {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("The Fortune Machine says...");
                        embed.setDescription("I don't know what is happening....");
                        return resolve({response: "", embed: embed, silent: false});
                    }
                });
            } else {
                return resolve({response: `**${category_suffix}** isn't part of the available categories. Please use one of these categories: \`\`\`css\n${categories.join(", ")}\`\`\``, silent: false});
            }
        } else {
            return resolve({response: `Please use one of these categories: \`\`\`css\n${categories.join(", ")}\`\`\``, silent: false});
        }
    });
}

gPlayCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let gplay = require("google-play-scraper")
        let apps = getAppList(args);
        if(apps.length > 0) {
            let results = [];
            let fetchApp = (i, callback) => {
                if(i >= apps.length) {
                    callback();
                } else {
                    gplay.search({
                        term: apps[i],
                        num: 1
                    }).then((err, data) => {
                        if(!err && data.length > 0) {
                            let info = `**${data[0].title}** by ${data[0].developer}, `;
                            if(data[0].free) {
                                info += "free";
                            } else {
                                info += data[0].price;
                            }
                            info += ` and rated ${data[0].score} stars.  Url: <${data[0].url}>`;
                        } else {
                            results.push("No results were found for " + apps[i]);
                        }
                        fetchApp(++i, callback);
                    });
                }
            };
            fetchApp(0, () => {
                let embed = new Discord.MessageEmbed();
                embed.setColor(0x2885bd);
                embed.setThumbnail("https://support.apple.com/content/dam/edam/applecare/images/en_US/itunes/featured-contetn-itunes-icon_2x.jpg");
                embed.addField("List", results.join("\n"));
                message.channel.send("", {embed: embed});
            });
            return resolve({response: "", silent: true});
        } else {
            let embed = new Discord.MessageEmbed();
            embed.setColor('RANDOM');
            embed.addField("Content", "https://play.google.com/store/apps/");
            return resolve({response: "", embed: embed, silent: false});
        }
    });
}

spotifyCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let SpotifyWebApi = require("spotify-web-api-node");

        let spotifyApi = new SpotifyWebApi({
            clientId: BotSettings.assist.getConstants("spotify-client-id"),
            clientSecret: BotSettings.assist.getConstants("spotify-client-secret")
        });
        let availOptions = usageSpotify.availOpts;
        let searchType = args.shift();
        if(availOptions.availList.includes(searchType.toLowerCase()) === true) {
            if(args.length >= 2) {
                if(searchType.toLowerCase() === "music" || searchType.toLowerCase() === "search") {
                    let searchArgType = args.shift();
                    if(availOptions.musicSearch.includes(searchArgType.toLowerCase()) === true) {
                        let q = args.join(" ");
                        let spotifyFormat = BotSettings.validate.SpotifyFormat(q);
                        if(Array.isArray(spotifyFormat) === true) {
                            spotifyFormat = spotifyFormat.join(" ");
                        }
                        if(searchArgType.toLowerCase() === "albums" || searchArgType.toLowerCase() === "album") {
                            spotifyApi.searchTracks(spotifyFormat).then(data => {
                                let embed = new Discord.MessageEmbed();
                                embed.setTitle("Album request");
                                embed.setDescription(data.body);
                                return resolve({response: "", embed: embed, silent: false});
                            }).catch(err => {
                                BotSettings.assist.error("There has been an error: " + err, message.channel);
                                return resolve({response: "", silent: true});
                            });
                        } else if(searchArgType.toLowerCase() === "artists" || searchArgType.toLowerCase() === "artist") {
                            console.log(spotifyFormat);
                            spotifyApi.searchArtists(spotifyFormat).then(data => {
                                let embed = new Discord.MessageEmbed();
                                embed.setTitle("Artist request");
                                embed.setDescription(data.body);
                                return resolve({response: "", embed: embed, silent: false});
                            }).catch(err => {
                                BotSettings.assist.error("There has been an error: " + err, message.channel);
                                return resolve({response: "", silent: true});
                            });
                        } else if(searchArgType.toLowerCase() === "tracks" || searchArgType.toLowerCase() === "track"){
                            spotifyApi.searchTracks(spotifyFormat).then(data => {
                                let embed = new Discord.MessageEmbed();
                                embed.setTitle("Track request");
                                embed.setDescription(data.body);
                                return resolve({response: "", embed: embed, silent: false});
                            }).catch(err => {
                                BotSettings.assist.error("There has been an error: " + err, message.channel);
                                return resolve({response: "", silent: true});
                            });
                        } else if(searchArgType.toLowerCase() === "playlists" || searchArgType.toLowerCase() === "playlist") {
                            spotifyApi.searchPlaylists(spotifyFormat).then(data => {
                                let embed = new Discord.MessageEmbed();
                                embed.setTitle("Playlist request");
                                embed.setDescription(data.body);
                                return resolve({response: "", embed: embed, silent: false});
                            }).catch(err => {
                                BotSettings.assist.error("There has been an error: " + err, message.channel);
                                return resolve({response: "", silent: true});
                            });
                        }
                    } else {
                        BotSettings.assist.error("We were unable to find your search type request.  Please use the following: " + availOptions.musicSearch.join(", "), message.channel);
                        return resolve({response: "", silent: true});
                    }
                }
            } else {
                BotSettings.assist.error("You must have at least 3 args in order to search something via the Spotify API", message.channel);
                return resolve({response: "", silent: true});
            }
        } else {
            BotSettings.assist.error("We were unable to find your search type request.  Please use the following: " + availOptions.availList.join(", "), message.channel);
            return resolve({response: "", silent: true});
        }
        /*
        availList: ['music', 'search', 'playlist', 'personalize', 'browse'],
        musicSearch: ["albums", "album", "artists", "artist", "tracks", "track", "playlists", "playlist"],
        musicSearchMulti: true,
        search: ["albums", "artists", "tracks", "playlists"],
        playlist: ["get", "create", "change", "add", "remove", "replace", "reorder"],
        ownerPlaylist: true,
        personalize: ["top", "recent"],
        browse: ["new", "featured", "category", "recommendation", "genre"]
        */
    });
}

ytSearchCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let yt = require("youtube-node");
        let youTube = new yt();
        youTube.setKey(BotSettings.assist.getConstants("google"));
        let searchQuery = args.join(" ");
        youTube
        youTube.search(searchQuery, 1, (err, res) => {
            if(err) {
                BotSettings.assist.error("**No Results found**", message.channel);
                return resolve({response: "", silent: true});
            }
            if(!res) {
                BotSettings.assist.error("**No Results found**", message.channel);
                return resolve({response: "", silent: true});
            }
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Youtube Result Found");
            embed.setDescription("Here are your YT result for **" + args.join(" ") + "**");
            if(res.items === "undefined" || res.items === undefined) {
                BotSettings.assist.error("**No Results found**", message.channel);
                return resolve({response: "", silent: true});
            }
            if(res.items[0].id.kind.indexOf("#channel") >= 0) {
                //channel info
                embed.addField("ID", res.items[0].id.channelId, true);
                embed.addField("Title", res.items[0].snippet.title, true);
                //https://www.youtube.com/watch?v=
                if(res.items[0].snippet.description.length > 0) {
                    embed.addField("Description", res.items[0].snippet.description, true);
                } else {
                    embed.addField("Description", "Description not found");
                }
                embed.setThumbnail(res[0].items[0].snippet.thumbnails.default.url);
                embed.setURL("https://www.youtube.com/channel/" + res[0].items[0].snippet.channelId);
            } else if(res.items[0].id.kind.indexOf("#video") >= 0) {
                //video info
                embed.addField("ID", res.items[0].id.videoId, true);
                embed.addField("Channel Title", res.items[0].snippet.channelTitle, true);
                embed.addField("Title", res.items[0].snippet.title, true);
                if(res.items[0].snippet.description.length > 0) {
                    embed.addField("Description", res.items[0].snippet.description, true);
                } else {
                    embed.addField("Description", "Description not found");
                }
                embed.addField("URL", "https://www.youtube.com/watch?v=" + res.items[0].id.videoId, true);
                embed.setThumbnail(res.items[0].snippet.thumbnails.default.url);
                embed.setURL("https://www.youtube.com/watch?v=" + res.items[0].id.videoId);
                let livebroadcast = res.items[0].snippet.liveBroadcastContent === "none" ? ":red_circle: No Live Broadcast" : ":movie_camera: " + res.items[0].snippet.liveBroadcastContent;
                embed.addField("Live Broadcast", livebroadcast, true)
            }
            return resolve({response: "", embed: embed, silent: false});
        });
    });
}

googleSearchCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let cheerio = require("cheerio");
        let snekfetch = require("snekfetch");
        let querystring = require("querystring");

        let queryParams = {
            key: BotSettings.assist.getConstants("google"),
            cx: BotSettings.assist.getConstants("google"),
            safe: "medium",
            q: encodeURI(args.join(" "))
        }
        let search = args.join(" ");
        message.channel.send(":arrows_counterclockwise: Searching...").then(m => {
            snekfetch.get(`https://www.googleapis.com/customsearch/v1?${querystring.stringify(queryParams)}`).then(res => {
                if(res.body.queries.request[0].totalResults === '0') {
                    BotSettings.assist.error("No results found....", message.channel);
                    return resolve({response: "", silent: true});
                } else {
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle(res.body.items[0].title);
                    embed.setURL(res.body.items[0].link);
                    embed.setDescription(res.body.items[0].snippet);
                    embed.setThumbnail(res.body.items[0].pagemap.cse_image[0].src);
                    m.edit("", {embed: embed});
                    return resolve({response: "", silent: true});
                }
            }).catch(err => {
                snekfetch.get(`https://www.google.com/search?safe=medium&q=${encodeURI(search)}`).then(res => {
                    const $ = cheerio.load(res.text); // eslint-disable-line id-length
        			let href = $('.r')
        				.first()
        				.find('a')
        				.first()
        				.attr('href');
        			const title = $('.r')
        				.first()
        				.find('a')
        				.text();
        			const description = $('.st')
        				.first()
        				.text();
        			if (!href) {
                        BotSettings.assist.error("No results found....", message.channel);
                        return resolve({response: "", silent: true});
                    }
        			href = querystring.parse(href.replace('/url?', ''));
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle(title);
                    embed.setDescription(description);
                    embed.setURL(href.q);
                    m.edit("", {embed: embed});
                    return resolve({response: "", silent: true});
                }).catch(err2 => {
                    BotSettings.assist.error("No results found....", message.channel);
                    return resolve({response: "", silent: true});
                });
            });
        });
    });
}

translateCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let S = require("string");
        const MsTranslator = require("mstranslator");
        const mstranslator = new MsTranslator({api_key: BotSettings.assist.getConstants("azure")}, true);
        let newArgs = args.map(function(x) {return x.trim()});
        let source = newArgs.shift();
        let dest = newArgs.shift();
        let data = newArgs.join(" ");
        console.log(source + " | " + dest + " | " + data);
        if((source.toLowerCase().includes("?") || source.toLowerCase() === "?") && dest && data) {
            mstranslator.initialize_token((err2, keys) => {
                if(err2) {
                    BotSettings.assist.error(`Failed to translate language for ${data}`, message.channel);
                    Logger.sendLog('-> Unable to translate because... ' + err2, "CRITICAL", __filename);
                    return resolve({response: "", silent: true});
                } else {
                    Database.callStatement("SELECT * FROM languages WHERE name='" + S(dest).capitalize().s + "' OR abbr='" + dest.toLowerCase() + "' LIMIT 1").then(rows => {
                        if(rows.length === 1) {
                            let rowData = rows[0];
                            let abbr = rowData.abbr;
                            mstranslator.detect({text: data}, (err, res) => {
                                if(err) {
                                    BotSettings.assist.error(`Failed to detect language for ${data}`, message.channel);
                                    Logger.sendLog('-> Unable to translate because... ' + err, "CRITICAL", __filename);
                                    return resolve({response: "", silent: true});
                                }
                                mstranslator.translate({text: data, from: res, to: abbr}, (error, result) => {
                                    if(error) {
                                        BotSettings.assist.error(`Failed to translate ${data}`, message.channel);
                                        return resolve({response: "", silent: true});
                                    }
                                    Database.callStatement("INSERT INTO translated (sourceAbbr, destAbbr, sourceLang, destLang) VALUES ('" + res + "', '" + abbr + "', '" + data + "', '" + result + "'" + ")").then(updated => {
                                        let embed = new Discord.MessageEmbed();
                                        embed.setTitle(`Translating text from ${res} to ${dest}`);
                                        embed.setColor('RANDOM');
                                        embed.setDescription(result);
                                        return resolve({response: "", embed: embed, silent: false});
                                    }).catch(errUpdate => {
                                        Logger.sendLog("-> Unable to update the database for translations because.... " + errUpdate, "CRITICAL", __filename);
                                        let embed = new Discord.MessageEmbed();
                                        embed.setTitle(`Translating text from ${res} to ${dest}`);
                                        embed.setColor('RANDOM');
                                        embed.setDescription(result);
                                        return resolve({response: "", embed: embed, silent: false});
                                    });
                                });
                            });
                        } else {
                            BotSettings.assist.error("We were unable to find the language that you were looking for.", message.channel);
                            return resolve({response: "", silent: true});
                        }
                    });
                }
            });
        } else if(dest && source && data) {
            mstranslator.initialize_token((err2, keys) => {
                if(err2) {
                    BotSettings.assist.error(`Failed to translate language for ${data}`, message.channel);
                    Logger.sendLog('-> Unable to translate because... ' + err2, "CRITICAL", __filename);
                    return resolve({response: "", silent: true});
                }
                Database.callStatement("SELECT * FROM languages WHERE name='" + S(source).capitalize().s + "' OR abbr='" + source.toLowerCase() + "' LIMIT 1").then(sourceRow => {
                    if(sourceRow.length === 1) {
                        Database.callStatement("SELECT * FROM languages WHERE name='" + S(dest).capitalize().s + "' OR abbr='" + dest.toLowerCase() + "' LIMIT 1").then(rows => {
                            if(rows.length === 1) {
                                let rowData = rows[0];
                                let abbr = rowData.abbr;
                                let sourceData = sourceRow[0];
                                let sourceAbbr = sourceData.abbr;
                                mstranslator.translate({text: data, from: sourceAbbr, to: abbr}, (error, result) => {
                                    if(error) {
                                        BotSettings.assist.error(`Failed to translate ${data}`, message.channel);
                                        Logger.sendLog("-> There was an error when trying to translate.  Error: " + error, "CRITICAL", __filename);
                                        return resolve({response: "", silent: true});
                                    }
                                    Database.callStatement("INSERT INTO translated (sourceAbbr, destAbbr, sourceLang, destLang) VALUES ('" + res + "', '" + abbr + "', '" + data + "', '" + result + "'" + ")").then(updated => {
                                        let embed = new Discord.MessageEmbed();
                                        embed.setTitle(`Translating text from ${res} to ${dest}`);
                                        embed.setColor('RANDOM');
                                        embed.setDescription(result);
                                        return resolve({response: "", embed: embed, silent: false});
                                    }).catch(errUpdate => {
                                        Logger.sendLog("-> Unable to update the database for translations because.... " + errUpdate, "CRITICAL", __filename);
                                        let embed = new Discord.MessageEmbed();
                                        embed.setTitle(`Translating text from ${res} to ${dest}`);
                                        embed.setColor('RANDOM');
                                        embed.setDescription(result);
                                        return resolve({response: "", embed: embed, silent: false});
                                    });
                                });
                            } else {
                                BotSettings.assist.error("We were unable to find the language that you were looking for.", message.channel);
                                return resolve({response: "", silent: true});
                            }
                        });
                    } else {
                        BotSettings.assist.error("We were unable to find the language that you were looking for.", message.channel);
                        return resolve({response: "", silent: true});
                    }
                }).catch(sourceErr => {
                    Logger.sendLog("-> Error when looking up languages. " + sourceErr, "CRITICAL", __filename);
                    BotSettings.assist.error("Unable to detect what language that you are wanting.  Please try another language.", message.channel);
                    return resolve({response: "", silent: true});
                });
            });
        } else {
            return resolve({response: "Please take a look at this example: " + usageMsTranslate.example, silent: false});
        }
    });
}

urbanDictionary = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let request = require("request");
        request('http://api.urbandictionary.com/v0/define?term=' + args.join(" "), (error, response, body) => {
            if(!error && response.statusCode === 200) {
                let resp;
                try {
                    resp = JSON.parse(body);
                } catch(e) {
                    return resolve({response: "The API returned an unconventional response.", silent: false});
                }
                if(resp.resolt_type !== "no_results") {
                    let embed = new Discord.MessageEmbed();
                    embed.setDescription(":closed_book: Defintion of **" + resp.list[0].word + "**");
                    embed.addField("**Definition**", resp.list[0].definition);
                    embed.addField("**Example**", resp.list[0].example);
                    embed.addField(":thumbsup:", resp.list[0].thumbs_up, true);
                    embed.addField(":thumbsdown:", resp.list[0].thumbs_down, true);
                    embed.setURL(`http://www.urbandictionary.com/define.php?term=${uD.list[0].word}`);
                    return resolve({response: "", embed: embed, silent: false});
                } else {
                    return resolve({response: args.join(" ") + ": this word was not found in Urban Dictionary", silent: false});
                }
            }
        });
    });
}

truckWotCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let request = require("request");
        let S = require("string");
        let optChoice = args.shift();

        let resp = args.join("");
        if(BotSettings.resolve.validateNumber(resp)) {
            request("https://wotapi.thor.re/api/wot/player/" + resp, (err, resp, body) => {
                if(err) {
                    BotSettings.assist.error("An error occurred. " + err, message.channel);
                    return resolve({response: "", silent: true});
                } else {
                    let data = JSON.parse(body);
                    if(data.error === undefined) {
                        BotSettings.assist.error(data.error, message.channel);
                        return resolve({response: "", silent: true});
                    } else {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("Profile on: " + data.username);
                        embed.setDescription(data.username + " has spent " + data.stats.timeOnDuty + " travelling " + data.stats.totalDistance + " and averaging " + data.stats.averageDistance + " carrying " + data.stats.mass + " while doing " + data.stats.jobs + " jobs");
                        embed.setImage(data.plates.atsPlateUrl);
                        embed.setThumbnail(data.plates.eut2PlateUrl);
                        let ets2Data = "", atsData = "", globalData = "";
                        ets2Data = "Time on Duty: **" + data.details.ets2.timeOnDuty + "**\n" +
                        "Total Mass transported: **" + data.details.ets2.totalMassTransported + "**\n" +
                        "Average Delivery distance: **" + data.details.ets2.averageDeliveryDistance + "**\n" +
                        "Longest job completed: **" + data.details.ets2.longestJobCompleted + "**\n" +
                        "Jobs Accomplished: **" + data.details.ets2.jobsAccomplished + "**\n" +
                        "Total distance: **" + data.details.ets2.totalDistance + "**";
                        atsData = "Time on Duty: **" + data.details.ats.timeOnDuty + "**\n" +
                        "Total Mass transported: **" + data.details.ats.totalMassTransported + "**\n" +
                        "Average Delivery distance: **" + data.details.ats.averageDeliveryDistance + "**\n" +
                        "Longest job completed: **" + data.details.ats.longestJobCompleted + "**\n" +
                        "Jobs Accomplished: **" + data.details.ats.jobsAccomplished + "**\n" +
                        "Total distance: **" + data.details.ats.totalDistance + "**";
                        globalData = "Time on Duty: **" + data.details.global.timeOnDuty + "**\n" +
                        "Total Mass transported: **" + data.details.global.totalMassTransported + "**\n" +
                        "Average Delivery distance: **" + data.details.global.averageDeliveryDistance + "**\n" +
                        "Longest job completed: **" + data.details.global.longestJobCompleted + "**\n" +
                        "Jobs Accomplished: **" + data.details.global.jobsAccomplished + "**\n" +
                        "Total distance: **" + data.details.global.totalDistance + "**";
                        embed.addField("Data from ETS2", ets2Data.replaceAll("-", "No data"), true);
                        embed.addField("Data from ATS", atsData.replaceAll("-", "No data"), true);
                        embed.addField("Global Data", globalData.replaceAll("-", "No data"), true);
                        embed.setURL("https://wotapi.thor.re/api/wot/player/" + resp);
                        return resolve({response: "", embed: embed, silent: false});
                    }
                }
            });
        } else {
            BotSettings.assist.error("It must be all numbers", message.channel);
            return resolve({response: "", silent: true});
        }
    });
}

truckMPCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let optChoice = args.shift();
        let request = require("request");
        let moment = require("moment");
        let momenttz = require("moment-timezone");

        if(optChoice.toLowerCase() === "lookup" && args.length === 1) {
            let profId = args.shift();
            request("https://api.truckersmp.com/v2/player/" + profId, (err, res, body) => {
                if(err) {
                    BotSettings.assist.error("An error occurred. " + err, message.channel);
                    return resolve({response: "", silent: true});
                } else {
                    let data = JSON.parse(body);
                    if(data.error === false) {
                        let embed = new Discord.MessageEmbed();
                        embed.setThumbnail(data.response.avatar);
                        embed.setImage(data.response.avatar);
                        embed.setFooter(moment(data.response.joinDate, "YYYY-MM-DD hh:mm:ss").format("LLLL") + " EST");
                        embed.setTitle("TruckersMP Stats for **" + data.response.name + "** - - **" + data.response.steamID64 + "**");
                        embed.setDescription("Group Name: " + data.response.groupName);
                        return resolve({response: "", embed: embed, silent: false});
                    } else {
                        Logger.sendLog("-> There was an error coming from the response in the error message", "CRITICAL", __filename);
                        console.log(data);
                        BotSettings.assist.error("There was an error retrieving the profile that you have requested.", message.channel);
                        return resolve({response: "", silent: true});
                    }
                }
            });
        } else if(optChoice.toLowerCase() === "bans" && args.length === 1) {
            let profId = args.shift();
            request("https://api.truckersmp.com/v2/bans/" + profId, (err, res, body) => {
                if(err) {
                    BotSettings.assist.error("An error occurred. " + err, message.channel);
                    return resolve({response: "", silent: true});
                } else {
                    let data = JSON.parse(body);
                    /*
                    {
                        "error": false,
                        "response": [
                            {
                                "expiration": "2014-12-05 18:58:12",
                                "timeAdded": "2014-12-05 18:57:12",
                                "active": true,
                                "reason": "test",
                                "adminName": "RootKiller",
                                "adminID": 1
                            },
                            {
                                "expiration": "2014-12-05 18:50:48",
                                "timeAdded": "2014-12-05 18:49:48",
                                "active": true,
                                "reason": "test",
                                "adminName": "RootKiller",
                                "adminID": 1
                            },
                            {
                                "expiration": null,
                                "timeAdded": "2014-09-27 19:22:27",
                                "active": false,
                                "reason": "test permban",
                                "adminName": "mwl4",
                                "adminID": 2
                            },
                            {
                                "expiration": "2014-09-27 19:23:00",
                                "timeAdded": "2014-09-27 19:18:00",
                                "active": false,
                                "reason": "tescik",
                                "adminName": "mwl4",
                                "adminID": 2
                            }
                        ]
                    }
                    */
                }
            });
        } else if(optChoice.toLowerCase() === "servers" && args.length === 1) {
            request("https://api.truckersmp.com/v2/servers", (err, res, body) => {
                if(err) {
                    BotSettings.assist.error("An error occurred. " + err, message.channel);
                    return resolve({response: "", silent: true});
                } else {
                    let data = JSON.parse(body);
                    /*
                    {
                        "error": "false",
                        "response": [
                            {
                                "id": 3,
                                "game": "ETS2",
                                "ip": "191.101.3.39",
                                "port": 42860,
                                "name": "United States",
                                "shortname": "US 1",
                                "online": true,
                                "players": 20,
                                "queue": 0,
                                "maxplayers": 512,
                                "speedlimiter": 0,
                                "collisions": true,
                                "carsforplayers": true,
                                "policecarsforplayers": false,
                                "afkenabled": true,
                                "syncdelay": 100
                            },
                            {
                                "id": 4,
                                "game": "ETS2",
                                "ip": "37.187.170.151",
                                "port": 42880,
                                "name": "Europe 2",
                                "shortname": "EU #2",
                                "online": true,
                                "players": 2055,
                                "queue": 0,
                                "maxplayers": 2300,
                                "speedlimiter": 0,
                                "collisions": true,
                                "carsforplayers": true,
                                "policecarsforplayers": false,
                                "afkenabled": true,
                                "syncdelay": 100
                            },
                            {
                                "id": 10,
                                "game": "ATS",
                                "ip": "167.114.245.202",
                                "port": 42850,
                                "name": "Europe 2",
                                "shortname": "EU 2",
                                "online": true,
                                "players": 0,
                                "queue": 0,
                                "maxplayers": 2000,
                                "speedlimiter": 0,
                                "collisions": true,
                                "carsforplayers": true,
                                "policecarsforplayers": false,
                                "afkenabled": true,
                                "syncdelay": 100
                            },
                            {
                                "id": 11,
                                "game": "ATS",
                                "ip": "191.101.3.39",
                                "port": 42850,
                                "name": "United States",
                                "shortname": "US 1",
                                "online": true,
                                "players": 3,
                                "queue": 0,
                                "maxplayers": 2000,
                                "speedlimiter": 0,
                                "collisions": true,
                                "carsforplayers": true,
                                "policecarsforplayers": false,
                                "afkenabled": true,
                                "syncdelay": 100
                            },
                        ]
                    }
                    */
                }
            });
        } else if(optChoice.toLowerCase() === "gametime") {
            request("https://api.truckersmp.com/v2/game_time", (err, res, body) => {
                if(err) {
                    BotSettings.assist.error("An error occurred. " + err, message.channel);
                    return resolve({response: "", silent: true});
                } else {
                    let data = JSON.parse(body);
                    let staticTime = momentTz.tz("2015-25-10 15:48:32", "YYYY-DD-MM hh:mm:ss", "Africa/Algiers");
                    let guessTZ = momentTz.tz.guess();
                    let guessTime = staticTime.tz(guessTZ);

                    /*
                    Game time is expressed in minutes, where 10 real seconds is 1 minute of in-game time. It is number of minutes since 2015-25-10 15:48:32 CET.
                    Game time returned in minutes (10 real seconds is 1 minute in-game).
                    */


                    if(data.error === false) {
                        let timedata = data.game_time;
                        let realMins = timedata / 6;
                        //add minutes to guessTime
                        let timeConvert = moment(guessTime);
                        timeConvert = timeConvert.add(realMins, "minutes");
                        let embed = new Discord.MessageEmbed();
                        embed.setDescription("Current in-game time is **" + timeConvert.format("LTS") + "**");
                        return resolve({response: "", embed: embed, silent: false});
                    } else {
                        BotSettings.assist.error("There was an error when retrieving the time for some reason.", message.channel);
                        return resolve({response: "", silent: true});
                    }
                }
            });
        } else if(optChoice.toLowerCase() === "version") {
            request("https://api.truckersmp.com/v2/version", (err, res, body) => {
                if(err) {
                    BotSettings.assist.error("An error occurred. " + err, message.channel);
                    return resolve({response: "", silent: true});
                } else {
                    let data = JSON.parse(body);
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle("TruckersMP version " + data.name + " on stage " + data.stage);
                    embed.setFooter(moment(data.time, "YYYY-MM-DD hh:mm:ss").format("LLLL"));
                    embed.setDescription("ETS2MP Checksum DLL: ** " + data.ets2mp_checksum.dll + "**\nETS2MP Checksum ADB: **" + data.ets2mp_checksum.adb + "**\nATSMP Checksum DLL: **" + data.atsmp_checksum.dll + "**\nATSMP Checksum ADB: **" + data.atsmp_checksum.adb);
                    embed.addField("Supported game version", data.supported_game_version, true);
                    embed.addField("Supported ATS game version", data.supported_ats_game_version, true);
                    return resolve({response: "", embed: embed, silent: false});
                }
            });
        } else if(optChoice.toLowerCase() === "rules") {
            request("https://api.truckersmp.com/v2/rules", (err, res, body) => {
                if(err) {
                    BotSettings.assist.error("An error occurred. " + err, message.channel);
                    return resolve({response: "", silent: true});
                } else {
                    let data = JSON.parse(body);
                    if(data.error === false) {
                        let rules = data.rules;
                        let revision = data.revision;
                        let ruleSplit = rules.split("\r\n");
                        /*
                            {"error":false,"rules":"# Official Rules\r\nWhile Driving in TruckersMP, users are required to follow the traffic laws of the respective country.\r\n \r\n \r\n#### Horn Spamming\r\n- Purposely holding your horn down for an prolonged period of time or anything similar.\r\n \r\n \r\n#### Username\/Tag\/Avatar - _UPDATED_\r\n- Having inappropriate usernames\/tags\/avatars including those with insults, usernames with no text, any with swearing in them, names matching administration, law enforcement organizations, any current living or deceased political leader, otherwise inappropriate content and symbols, or similar. This also includes tags or usernames that would indicate that you are a \"Forum Mod\", \"TS3 Admin\", \"Admin\", \"Police\", \"Security\" or similar and in any language.\r\n \r\n \r\n#### Inappropriate License\/Interior Plates\r\n- Having inappropriate text on license plates on your truck, either as your licence plate or interior to your vehicle. This includes swearing, and anything that lists you as a staff member, insults or otherwise offensive text.\r\n \r\n \r\n#### Impersonating Administration\r\n- It is forbidden to impersonate administration or act as law enforcement such as police. This includes tags, username, paintjobs, lights, etc that would indicate you are an administrator.\r\n \r\n \r\n#### Racing\r\n- Having races or anything similar. This excludes races occurring on the Arizona Race Track.\r\n \r\n \r\n#### Incorrect Way\r\n- Traveling the incorrect way down the road or anything similar.\r\n \r\n \r\n#### Inappropriate Overtaking\r\n- Overtaking in an area of extremely low FPS, in areas with large amounts of traffic such as in Europoort, overtaking resulting in an accident or anything similar. This also includes overtaking on any 1 lane in each direction road where there is excessive traffic.\r\n \r\n \r\n#### Profanity\r\n- Swearing or using any words that are discriminatory, against religion or race and that may be deemed inappropriate or anything similar.\r\n \r\n \r\n#### Insulting - _UPDATED_\r\n- Swearing or using words that may be deemed inappropriate towards other users, staff, or others. This can situationally apply on other services as well as TruckersMP.\r\n \r\n \r\n#### Chat Spamming\r\n- Using the in-game chat abusively, repeating the same message 3+ times in a row in 1 minute within a populated area. Convoy control exempt for the purposes of directing a convoy alone.\r\n\r\n \r\n#### Ramming\r\n- Purposely causing damage to another user's truck, attempting to cause a collision into another users truck or anything similar.\r\n \r\n \r\n#### Blocking \r\n- Restricting a user's travel path, blocking entrances to highways or other entry points or anything similar.\r\n \r\n \r\n#### Hacking\/Speedhacking\/Bug abusing\r\n- Using artificial tools to change gameplay, using cheat engine in order to bypass the speeding limiter or anything similar.\r\n \r\n \r\n#### Inappropriate Parking\r\n- Parking or stopping in areas of high population for no reason such as Rotterdam Port or anything similar, using the designated car parks is fine (This is fine when there is low traffic in the area). Parking or stopping is always forbidden in [No Parking Zones](https:\/\/forum.truckersmp.com\/index.php?\/topic\/15-in-game-rules-en-26-05-2016\/&do=findComment&comment=241513) (pictures in second post, see forum thread In-game rules). This now includes the Calais to Duisburg road during excessive traffic.\r\n \r\n \r\n#### Report Spamming or Abuse - _UPDATED_\r\n- Spam use of the report function in game or on the website\r\n- Reporting a user multiple times with the same evidence through web reports.\r\n- Using web reports to complain about bans.\r\n \r\n \r\n#### Unsupported Mods\r\n- Using unsupported mods that cause game crashes. \r\n \r\n \r\n#### Ban Evading\r\n- Creating another account to get around a temp ban \/ perm ban.\r\n \r\n \r\n#### Driving without lights or Ghost driving\r\n- Driving in the dark (between 7PM and 7AM game time) without lights is forbidden. From 7PM (19:00) to 7AM (07:00), headlights must be on. \r\n \r\n \r\n#### Exiting map boundaries\r\n- It is forbidden to drive outside of the map boundaries, including spots inaccessible by normal driving, unless the player is an official In-Game Admin or anything similar.\r\n \r\n \r\n#### Useless traffic in excessively high population areas\r\n- Useless traffic in excessively high population areas such as Europoort, Rotterdam or the Calais to Duisburg road. Driving without reason to and from or anything similar. If you are in the area of Europort, you are expected to use the port or you are running the risk of punishment.\r\n \r\n \r\n#### Inappropriate Convoy Management\r\n- Groups (And Individuals) which offer services such as piloting a convoy, or directing trucks during a convoy are not allowed to block, or slow down, traffic in any way, shape, or form. \r\n #### Bullying\/Harrassment\r\n- Leaving abusive comments on report videos and otherwise continually harrassing users.\r\n \r\n \r\n \r\n#### Trolling\r\n- Trolling other users\/annoying\/blocking\/ramming in the goal of disturbing other players or by pretending to be someone you are not or similar. Kicks may happen depending on severity.\r\n \r\n \r\n \r\n#### CB Abuse\r\n- Trolling the voice chat in any way. Harrassing other users, mic spam etc.\r\n \r\n \r\n \r\n#### Car with trailer\r\n- Cars are not allowed to pull trailers. It looks weird and can actually cause reckless driving.\r\n \r\n \r\n \r\n#### Car Abuse of Pilot Paintjob\r\n- Acting as administration, or otherwise abusing the Pilot paintjob. Please note: We prefer only 2 Pilot cars per convoy depending on size.\r\n \r\n \r\n \r\n#### Excessive Save Editing - _UPDATED (again)_\r\n- Modifying your vehicle to include car parts on your truck or truck parts on your car. This includes paintjobs.\r\n- Adding an excessive amount of beacons, lights, bullbars, horns, or similar to your truck and also includes any large horns or beacons on your bullbar or front bar.\r\n- When editing a truck, trailer, or other content through save editing, you must follow the [Mod Guidelines](https:\/\/forum.truckersmp.com\/index.php?\/topic\/6812-allowed-mods-mod-guidelines\/).  \r\n- No more beacons than allowed by the game by default, no changing the vehicles hitbox, no beacons on bullbars\/bumpers or similar.\r\n- Your vehicle must be functional.\r\n- Only one [full-length trailer](http:\/\/i.imgur.com\/jD9IqQc.jpg) is allowed.\r\n \r\n \r\n#### Reckless Driving\r\n- Driving in such a way that is considered unsafe, driving backwards, wrong way, failing to yield, ignoring other players and rules. \r\n \r\n \r\n#### Excessive use of beacons \r\n- You may not use\/turn on any beacons in high traffic areas, such as Rotterdam, Europoort, and the Calais-Duisburg road.  \r\n \r\n#### Freeroam and Non Collision Servers - _NEW_\r\n- Driving rules, such as wrong way, blocking, ramming, inappropriate overtaking, reckless driving, etc. do not apply on servers highlighted as either Freeroam or Non Collision (in their name).\r\n- Other rules (such as hacking, CB radio abuse, insulting, and everything else) still apply.\r\n\r\n \r\n## Desync Exploiting\r\nAttempting to use desync in order to cause damage to another users truck is forbidden.\r\n \r\n \r\n## Ping Issues\r\nIf your ping is over 600ms to the server you will be disconnected from the server in order to avoid desync issues for others. This ping check is taken as an average.\r\n \r\n## Overtaking\r\n*(Author: VavelOnline)*\r\nThis is a very simple how-to guide on how to overtake (and be overtaken) properly. The first thing you should be aware of is DESYNC. Basically, what you see on your screen is not always what the other players are seeing. This might cause (unintentional) ramming in many situations. To counter that effect, here's some practical information that you should always follow.\r\n \r\nWhen overtaking\r\n \r\n- Start your overtaking maneuver when you are at least 60m from the truck in front of you (you can always check the distances using the TAB key).\r\n- Stay in line\r\n- When you checked that the other driver is 100m behind you, you can start merging back.\r\n- Alternatively, if you see the other driver turn its lights on, or hear him honk 2 short times, it means that you can merge back safely from his point of view, even if you're not 100m ahead. In that case, it's nice to thank him using the left-right-left-right blinker signal. Note that high beams would normally be used IRL, but cannot be seen for now in the MP game.\r\n \r\nWhen being overtaken\r\n \r\n- Stay in line\r\n- If you're riding at 90 km\/h, it is nice to slow down a little so the other driver has a chance to overtake you.\r\n- When there's enough distance between you and the overtaker (60m should be enough), turn your lights on (or honk 2 short times if it's night time and your lights are already turned on) to signal that he can merge back safely.\r\n \r\nLet's hope everybody follow these rules, and the road will be a lot safer.\r\n \r\n## How bans are issued\r\nThe first 3 bans issued are at admin discretion.\r\nThe 4th ban is 1 month.\r\nThe 5th ban is 3 months.\r\nThe 6th ban is permanent with no chance of undo.\r\nAny bans further than 12 months before the current ban are ignored under this rule. This is considered the cooling off period.\r\nUser has 3 bans, all within a year, add the 4th ban. User has 3 bans, first ban is over a year old. Then new ban is 3rd.\r\n \r\n## Reporting users\r\nIf you are reporting users, please note that most rules do require video evidence to see clearly what is happening. Offenses such as insulting and such are fine with screenshots but as a general rule of thumb, video is better.\r\n \r\n## Other Notes\r\nAdministrators reserve the right to kick or ban you from the Truckers MP servers at any point if needed. We ask that if you are banned that you create a ban appeal and not private message any member of the staff team. We don't delete a user's account at the request of. We can only perm ban him.  \r\nIf you have been banned, you have a right of appeal at [http:\/\/truckersmp.com\/appeals](http:\/\/truckersmp.com\/appeals). If you feel that your ban appeal is not handled correctly, contact the [feedback email](https:\/\/forum.truckersmp.com\/index.php?\/topic\/39652-user-feedback-contacting-upper-staff).\r\nIf you have been permanently banned, creating a new account is deemed as Ban Evasion, if evidence points that you have ban evaded Administrators reserve the right to ban you again without notification.  \r\n \r\n**The servers, mod and admins are provided free of charge for everyone and in that sense, everyone is a guest on the servers and it is a privilege that can be removed at any time. No form of persecution or offence toward any other members or staff team members will be permitted. We reserve the right to remove your right to access the servers at anytime and at our discretion. Please note that the creators of the TruckersMP mod are not linked to SCS in any way, shape, or form.**","revision":15}
                        */
                    } else {
                        BotSettings.assist.error("There was an error when retrieving the time for some reason.", message.channel);
                        return resolve({response: "", silent: true});
                    }
                }
            });
        } else {
            BotSettings.assist.error("You have chose an invalid argument.  Available options are: `lookup`, `bans`, `servers`, `gametime`, `version`, and `rules`", message.channel);
            return resolve({response: "", silent: true});
        }
    });
}

truckCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let request = require("request");
        let cheerio = require("cheerio");
        let S = require("string");

        let response = args.join(" ");
        request("https://worldoftrucks.com/en/search.php?text=" + encodeURIComponent(response) + "&type=users", (err, resp, body) => {
            if(err) {
                BotSettings.assist.error("There was an error when trying to obtain the data.  " + err, message.channel);
                return resolve({response: "", silent: true});
            } else {
                let $ = cheerio.load(resp.body);
                if($("#search-result-error").text().trim() !== "") {
                    BotSettings.assist.error($("#search-result-error").text().trim(), message.channel);
                    return resolve({response: "", silent: true});
                } else {
                    let info3 = $(".search-result-more");
                    if(info3.text().trim() === "") {
                        BotSettings.assist.error(info3.text().trim(), message.channel);
                        return resolve({response: "", silent: true});
                    } else {
                        let info2 = $(".search-result");
                        let embed = new Discord.MessageEmbed();

                        if(info2.length === 1) {
                            let name = $(info2[0]).text().trim();
                            let image = $(info2[0]).find("img").attr("src");
                            let id = $(info2[0]).find("a").attr("href").split("=");
                            embed.setDescription(":closed_book: Profile of **" + S(response).capitalize().s + "**");
                            embed.setURL("http://worldoftrucks.com/en/" + id.join("="));
                            embed.addField("Name", S(name).capitalize().s, true);
                            embed.addField("Id", id[1], true);
                            embed.setThumbnail(image);
                            return resolve({response: "", embed: embed, silent: false});
                        } else {
                            embed.setDescription(":closed_book: Profile of **" + S(response).capitalize().s + "**");
                            info2.each((i, elem) => {
                                let name = $(info[i]).text().trim();
                                let image = $(info2[0]).find("img").attr("src");
                                let id = $(info[i]).find("a").attr("href").split("=");
                                embed.setDescription(":closed_book: Profile List of **" + S(response).capitalize().s + "**");
                                embed.addField("Profile #" + (i + 1), "**Name**: " + S(name).capitalize().s + "\nProfile Link: " + "http://worldoftrucks.com/en/" + id.join("=") + "\nProfile Image: [here](" + image + ")\nId: " + id, true);
                            });
                            return resolve({response: "", embed: embed, silent: false});
                        }
                    }
                }
            }
        });
    });
}

timeCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let timeWant = args.shift();
        let orgTime = timeWant;
        let parsedTime = BotSettings.resolve.TimeFormat(timeWant);
        if(parsedTime !== null) {
            timeWant = parsedTime;
        } else {
            BotSettings.assist.error("That is an incorrect time that you are wanting to convert.  Please try again", message.channel);
            return resolve({response: "", silent: true});
        }
        let tz1 = args.shift();
        let tz2 = args.shift();
        let timezone1 = BotSettings.assist.getKeyByValue(BotSettings.moment.timezone, tz1.toUpperCase(), true);
        let tz1Arr = [], tz2Arr = [], tz1Zone = "", tz2Zone = "";
        let tmpMomentTz = require("moment-timezone");
        let moment = require("moment");
        let currentDate = moment();
        let currentTime = currentDate.format("YYYY-MM-DD HH:MM");
        if(Array.isArray(timezone1)) {
            timezone1.forEach((val) => {
                let offset = tmpMomentTz.tz(currentTime, val).format('Z');
                if(!tz1Arr.includes(offset)) {
                    tz1Arr.push(offset);
                    tz1Zone = val;
                }
            });
        }
        let timezone2 = BotSettings.assist.getKeyByValue(BotSettings.moment.timezone, tz2.toUpperCase(), true);
        if(Array.isArray(timezone2)) {
            timezone2.forEach((val) => {
                let offset = tmpMomentTz.tz(currentTime, val).format('Z');
                if(!tz2Arr.includes(offset)) {
                    tz2Arr.push(offset);
                    tz2Zone = val;
                }
            });
        }
        if(Array.isArray(tz1Arr) && Array.isArray(tz2Arr) && (tz1Arr.length >= 2 || tz2Arr.length >= 2)) {
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Multiple times found...");
            embed.addField("First arg", tz1Arr.join("\n"));
            embed.addField("Second arg", tz2Arr.join("\n"));
            embed.setDescription("We have found multiple timezones that you were searching for.");
            return resolve({response: "", embed: embed, silent: false});
        } else if((Array.isArray(tz1Arr) && Array.isArray(tz2Arr) && tz1Arr.length === tz2Arr.length && tz1Arr.length === 1) || (timezone1 !== null && timezone2 !== null)) {
            //found only 1 instance
            let tmpDate = currentDate.format("YYYY-MM-DD");
            let tz1Resp = tz1Arr[0] || timezone1;
            let tz2Resp = tz2Arr[0] || timezone2;
            let tzOffset1 = BotSettings.assist.convertTimeZone(tz1Arr[0]);
            let tzOffset2 = BotSettings.assist.convertTimeZone(tz2Arr[0]);
            let tzOffsetDiff = 0;
            if(tzOffset1 > tzOffset2) {
                tzOffsetDiff = tzOffset2 - tzOffset1;
            } else if(tzOffset1 < tzOffset2) {
                tzOffsetDiff = tzOffset1 - tzOffset2;
            } else {
                tzOffsetDiff = tzOffset1 - tzOffset2;
            }
            let mytimezone = tmpMomentTz.tz(tmpDate + " " + timeWant, tz1Zone).add(tzOffsetDiff, "minutes").format();
            let timeConverted = tmpMomentTz.tz(tmpDate + " " + timeWant, tz1Zone).add(tzOffsetDiff, "minutes").format();
            let convertedTime = BotSettings.resolve.Time(timeConverted.split("T")[1]);
            return resolve({response: "Time converted from " + tz1 + " at **" + orgTime + "** to " + tz2 + " is **" + convertedTime + "**", silent: false});
        } else {
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Unable to find an answer.....");
            embed.setDescription("We did not find the current time conversion for the zones that you have requested.");
            return resolve({response: "", embed: embed, silent: false});
        }
        return resolve({response: "Command is being developed", silent: false});
    });
}

randomWordCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let randomWord = require("random-word");
        let wordnet = require("wordnet")
        let embed = new Discord.MessageEmbed();
        embed.setTitle("Random English Word");
        let zzz = randomWord();
        embed.setDescription("Your Random English Word is: **__" + zzz + "__**");
        embed.setColor("RANDOM");
        wordnet.lookup(zzz, (err, definitions) => {
            if(err) {
                mwLookup(zzz).then(resp => {
                    if(resp.error === true) {
                        return resolve({response: "", embed: embed, silent: false});
                    } else {
                        console.log(resp.resultLen);
                        if(resp.resultLen >= 1) {
                            let respFirst = resp.response[0];
                            embed.addField("Definition", respFirst.definition, true);
                            embed.addField("Part of Speech", respFirst.partOfSpeech, true);
                            embed.addField("Pronunciation", respFirst.pronunce, true);
                            embed.setURL(respFirst.audioUrl);
                            embed.addField("Audio Url", respFirst.audioUrl, true);
                            return resolve({response: "", embed: embed, silent: false});
                        } else {
                            //less than 1
                            return resolve({response: "", embed: embed, silent: false});
                        }
                    }
                }).catch(errResp => {
                    Logger.sendLog("-> Error when trying to obtain the information.  " + errResp, "CRITICAL", __filename);
                    return resolve({response: "", embed: embed, silent: false});
                });
            } else {
                embed.addField("Definition", definitions[0].glossary, true);
                embed.setFooter("Powered by: Princeton University \"About WordNet.\" WordNet. Princeton University. 2010.");
                return resolve({response: "", embed: embed, silent: false});
            }
        });
    });
}

npmLookupCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let npmName = require("npm-name");
        if(args.length === 1) {
            let argName = args.shift();
            npmName(argName).then(available => {
                let embed = new Discord.MessageEmbed();
                embed.setTitle("NPM Module: " + argName);
                let availability = (available === false) ? "**__unavailable__**" : "**__available__**";
                embed.setDescription("The NPM module named **" + argName + "** is currently " + availability);
                return resolve({response: "", embed: embed, silent: false});
            });
        } else {
            npmName.many(args).then(result => {
                let embed = new Discord.MessageEmbed();
                embed.setTitle("NPM Modules");
                let availLst = [], unavailLst = [];
                result.forEach((value, key) => {
                    if(value === true) {
                        availLst.push(key);
                    } else {
                        unavailLst.push(key);
                    }
                });
                embed.setDescription("Here is a list of NPM Module names that are available");
                embed.addField("Available", availLst.join("\n"), true);
                embed.addField("Not Available", unavailLst.join("\n"), true);
                return resolve({response: "", embed: embed, silent: false});
            });
        }
    });
}

mwLookup = (word, lookupChoice="collegiate") => {
    return new Promise((resolve, reject) => {
        let options = ['thesaurus', 'collegiate', 'spanish', 'medical', 'learners', 'sd2', 'sd3', 'ithesaurus', 'sd4'];
        if(options.includes(lookupChoice.toLowerCase()) === true) {
            let request = require("request");
            let xml = require("xml2js");
            getSearchUrl(word, lookupChoice).then(mainResp => {
                if(mainResp.error === false) {
                    //no error
                    request(mainResp.response, (err, resp, body) => {
                        console.log(!err + " | " + resp.statusCode);
                        if(!err && resp.statusCode === 200) {
                            xml.parseString(body, (errParse, resultParse) => {
                                if(errParse === null) {
                                    let results = [];
                                    let result = resultParse;
                                    if(result.entry_list.entry !== undefined) {
                                        let entries = result.entry_list.entry;
                                        let S = require("string");
                                        for(let i = 0; i < entries.length; i++) {
                                            //remove erroneous results (doodle != Yankee Doodle)
                                            console.log("i: " + i + " | " + entries.length );
                                            console.log(entries[i].ew + " | " + word.toLowerCase());
                                            let entryString = S(entries[i].ew).toString();
                                            if(entryString.toLowerCase() === word.toLowerCase()) {
                                                let definition = entries[i].def[0].dt;
                                                console.log("Def: " + definition);
                                                let partOfSpeech = entries[i].fl[0];
                                                console.log("POS: " + partOfSpeech);
                                                let pronunce = entries[i].pr[0];
                                                console.log("Pronunce: " + pronunce);
                                                let soundFile = entries[i].sound[0].wav[0];
                                                console.log("Sound: " + soundFile);
                                                let audioFile = getAudioUrl(soundFile);
                                                results.push({
                                                    partOfSpeech: entries[i].fl[0],
                                                    definition: entries[i].def[0].dt.map(entry => {
                                                        if(typeof(entry) === "string") {
                                                            return entry;
                                                        }
                                                        if(entry['_']) {
                                                            return entry['_'];
                                                        }
                                                    }).join("\n"),
                                                    audioUrl: audioFile,
                                                    pronunciation: pronunce
                                                })
                                            }
                                        }
                                        console.log("Results length: " + results.length)
                                        if(results.length === 0) {
                                            return resolve({response: "Unable to find exact definition", error: true});
                                        }
                                        return resolve({response: results, resultLen: results.length, filter: results.filter(entry => entry.definition), error: false})
                                    } else if(resultParse.entry_list.suggestion != undefined) {
                                        return resolve({response: "Suggestions: " + resultParse.entry_list.suggestion, error: false});
                                    } else {
                                        return resolve({response: "Unable to find definition", error: true});
                                    }
                                } else {
                                    return resolve({response: "Unable to find definition", error: true});
                                }
                            });
                        } else if(resp.statusCode !== 200) {
                            Logger.sendLog("-> Status Code for Merriam Webster is: " + resp.statusCode, "CRITICAL", __filename);
                            return resolve({response: "Unable to find a definition due to a weird status code returned.", error: true})
                        } else {
                            return resolve({response: "Unable to find a definition due to an error", error: true});
                        }
                    });
                } else {
                    return resolve({response: "No definition(s) found", error: true});
                }
            }).catch(errResp => {
                return resolve({response: "No definition(s) found", error: true});
            });
        } else {
            return resolve({response: "No definiton(s) found", error: true});
        }
    });
}

function getAudioUrl(word) {
    let url = "http://media.merriam-webster.com/soundc11/";
    let subdir = "";
    if(word.toLowerCase().startsWith("bix")) {
        subdir = "bix";
    } else if(word.toLowerCase().startsWith("gg")) {
        subdir = "gg";
    } else {
        //check if it begins with numbers
        if(word.toLowerCase().match(/^\d+/)) {
            subdir = "number";
        } else {
            //grab first character
            subdir = word.charAt(0);
        }
    }
    return url + subdir + "/" + word;
}

function getSearchUrl(word, wordLook) {
    return new Promise((resolve, reject) => {
        let link = "", key = "";
        if(wordLook.toLowerCase() === "collegiate") {
            link = "http://www.dictionaryapi.com/api/v1/references/collegiate/xml/";
            key = BotSettings.assist.getConstants("mw_collegiate");
        } else if(wordLook.toLowerCase() === "thesaurus") {
            link = "http://www.dictionaryapi.com/api/v1/references/thesaurus/xml/";
            key = BotSettings.assist.getConstants("mw_thesaurus");
        } else if(wordLook.toLowerCase() === "spanish") {
            link = "http://www.dictionaryapi.com/api/v1/references/spanish/xml/";
            key = BotSettings.assist.getConstants("mw_spanish");
        } else if(wordLook.toLowerCase() === "medical") {
            link = "http://www.dictionaryapi.com/api/references/medical/v2/xml/";
            key = BotSettings.assist.getConstants("mw_medical");
        } else if(wordLook.toLowerCase() === "learners") {
            link = "http://www.dictionaryapi.com/api/v1/references/learners/xml/";
            key = BotSettings.assist.getConstants("mw_leaners");
        } else if(wordLook.toLowerCase() === "sd2") {
            link = "http://www.dictionaryapi.com/api/v1/references/sd2/xml/";
            key = BotSettings.assist.getConstants("mw_sd2");
        } else if(wordLook.toLowerCase() === "sd3") {
            link = "http://www.dictionaryapi.com/api/v1/references/sd3/xml/";
            key = BotSettings.assist.getConstants("mw_sd3");
        } else if(wordLook.toLowerCase() === "ithesaurus") {
            link = "http://www.dictionaryapi.com/api/v1/references/ithesaurus/xml/";
            key = BotSettings.assist.getConstants("mw_ithesaurus");
        } else if(wordLook.toLowerCase() === "sd4") {
            link = "http://www.dictionaryapi.com/api/v1/references/sd4/xml/";
            key = BotSettings.assist.getConstants("mw_sd4");
        } else {
            return resolve({response: "Unable to compile list", error: true});
        }
        if(key === undefined) {
            return resolve({response: "Key was not assigned.", error: true});
        }
        return resolve({response: link + word + "?key=" + key, error: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageItunes.aliases, args: usageItunes.args, usage: usageItunes, run: itunesCmds},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageGPlay.aliases, args: usageGPlay.args, usage: usageGPlay, run: gPlayCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageImdb.aliases, args: usageImdb.args, usage: usageImdb, run: imdbCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageFortune.aliases, args: usageFortune.args, usage: usageFortune, run: fortuneCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageGSearch.aliases, args: usageGSearch.args, usage: usageGSearch, run: googleSearchCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageYTSearch.aliases, args: usageYTSearch.args, usage: usageYTSearch, run: ytSearchCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageRoblox.aliases, args: usageRoblox.args, usage: usageRoblox, run: robloxCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageGShorten.aliases, args: usageGShorten.args, usage: usageGShorten, run: shortnCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageUrban.aliases, args: usageUrban.args, usage: usageUrban, run: urbanDictionary},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageSpotify.aliases, args: usageSpotify.args, usage: usageSpotify, run: spotifyCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageMsTranslate.aliases, args: usageMsTranslate.args, usage: usageMsTranslate, run: translateCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageTime.aliases, args: usageTime.args, usage: usageTime, run: timeCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageRandomWord.aliases, args: usageRandomWord.args, usage: usageRandomWord, run: randomWordCmd},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageNPMLookup.aliases, args: usageNPMLookup.args, usage: usageNPMLookup, run: npmLookupCmd}
];
