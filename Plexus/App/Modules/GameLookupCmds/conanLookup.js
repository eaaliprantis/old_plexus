const moduleInfo = {
    name: "Game Lookup",
    truename: "Game Lookup",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usageConan = {
    name: "conanservers",
    cmdName: "conanservers",
    aliases: ["conanservers", "conan"],
    args: {min: 1, max: 2},
    description: "Get information about a Conan Exile Server",
    usage: "[command:str]",
    exampleUsage: "conanservers 158.69.16.107:27015",
    example: "conanservers <ip|hostname>[:port] [players]",
    runIn: ["text"],
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

let geoip = require("geoip-lite");

conanServersCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let dns = require("dns");
        if(args.length >= 1) {
            let addrInfo = args.shift().split(":");
            dns.lookup(addrInfo[0], {
                family: 4
            }, (err, ip) => {
                if(err) {
                    BotSettings.assist.error("Not a valid IP address.  Invalid server", message.channel);
                    return resolve({response: "", silent: true});
                }
                let port = 27015;
                if(addrInfo.length === 2) {
                    port = parseInt(addrInfo[1], 10);
                    if(!BotSettings.validate.Port(port)) {
                        port = 27015;
                    }
                }
                queryServer(message, ip, port, args, prefixUsed).then((resp) => {
                    return resolve(resp);
                }).catch(errResp => {
                    console.log("Error in response");
                    BotSettings.assist.error("There was an error with the conan lookup..... " + errResp, message.channel);
                    return resolve({response: "", silent: true});
                });
            });
        }
    });
}

queryServer = (message, ip, port, args, prefixUsed, overAPI) => {
    return new Promise((resolve, reject) => {
        let Gamedig = require("gamedig");
        Logger.sendLog("-> [SERVER] Querying Data on " + ip + ":" + port, "INFO", __filename);
        Gamedig.query({
            type: "protocol-valve",
            host: ip,
            port_query: port
        }, (state) => {
            if(state.error) {
                if(!overAPI) {
                    return getServers(message, ip, port, args, prefixUsed);
                }
            } else if(state.raw.folder === "conanexiles" && state.raw.gameid === "440900") {
                let gametype = "server";
                if(args.length > 0) {
                    gametype = args.shift().toLowerCase();
                }
                if(gametype === "players") {
                    parsePlayers(message, state, prefixUsed).then(playerData => {
                        return resolve(playerData);
                    });
                } else {
                    parseServer(message, state, prefixUsed).then(serverData => {
                        return resolve(serverData);
                    });
                }
            } else {
                return resolve({response: "Unknown server!", serverInfo: null, error: false});
            }
        });
    });
}

getServers = (message, ip, port, args, prefixUsed) => {
    return new Promise((resolve, reject) => {
        Logger.sendLog("-> Looking up using the steam web api.....", "INFO", __filename);
        let SteamWebApi = require("steam-webapi");
        let api = new SteamWebApi(BotSettings.assist.getConstants("steam"));
        api.get("SteamApps", "GetServersAtAddress", 1, {
            addr: ip
        }, (err, res) => {
            console.log("Any errors when looking up with steam web api....");
            if(err || !res.success) {
                return resolve({response: "Unable to get servers", serverInfo: null, error: true});
            }
            let conanServers = res.servers.filter((server) => {
                return server.appid === 440900 && server.gamedir == 'conanexiles';
            });

            let gameportSevers = conanServers.find((server) => {
                return server.gameport = port;
            });
            if(gameportSevers) {
                let gInfo = gameportSevers.addr.split(":");
                return queryServer(message, gInfo[0], gInfo[1], args, prefixUsed, 1);
            }
            console.log("Conan Servers length: " + conanServers.length);
            if(conanServers.length === 0) {
                return resolve({response: "Server not found", serverInfo: null, error: false});
            } else if(conanServers.length === 1) {
                let cInfo = conanServers[0].addr.split(":");
                return queryServer(message, cInfo[0], cInfo[1], args, prefixUsed, 1);
            } else {
                let msg = "__Please specify your Server:__";
                conanServers.forEach((server) => {
                    msg += `\n${prefixUsed + usageConan.aliases[0]} ${server.addr}`;
                });
                return resolve({response: msg, serverInfo: null, error: false});
            }
        });
    });
}

parseServer = (message, state, prefixUsed) => {
    return new Promise((resolve, reject) => {
        let connect = state.query.address + ":" + state.query.port_query;
        let geo = geoip.lookup(state.query.address);
        let flag = "";
        if(geo.country) {
            flag = `:flag_${geo.country.toLowerCase()}:`;
        }
        let embed = new Discord.MessageEmbed();
        embed.setColor(0x661d11);
        embed.setAuthor("Conan Exiles Server", "https://i.imgur.com/8oUpjeb.png");
        embed.addField("Game", state.raw.folder, true);
        embed.addField("Game Mode", state.raw.game, true);
        embed.addField("Map", ":map: " + state.map, true);
        embed.addField("Server Name", state.name);
        embed.addField("IP", state.query.address, true);
        let vacEnabled = (state.raw.secure === 1) ? "Enabled" : "Disabled";
        embed.addField("VAC", vacEnabled, true);
        embed.addField("Location", `${flag}`, true);
        embed.addField("Connect", `[[Connect]](steam://connect/${connect})`, true);
        embed.setImage(`https://topconanservers.com/api/graph/players/${connect}/24/graph.png`);
        embed.addField("Players", ":busts_in_silhouette: " + state.raw.numplayers + "/" + state.maxplayers, true);
        let pwState = state.password ? ":lock: Protected" : ":unlock: Open";
        embed.addField("Password", pwState, true);
        embed.setFooter(`Write "${prefixUsed + usageConan.aliases[0]} ${connect} players" for more details`);
        return resolve({response: message.author, embed: embed, silent: false, serverInfo: true});
    });
}

parsePlayers = (message, state, prefixUsed) => {
    return new Promise((resolve, reject) => {
        let connect = state.query.address + ":" + state.query.port_query;
        let geo = geoip.lookup(state.query.address);
        let flag = "";
        if(geo.country) {
            flag = `:flag_${geo.country.toLowerCase()}:`;
        }
        let players = [];
        if(state.players) {
            state.players.forEach((player) => {
                let time = moment.duration(player.time, "seconds").asMilliseconds();
                players.push(`${player.name} (${BotSettings.assist.prettyTime(time)})`);
            });
        } else {
            players.push("Unknown");
        }
        let embed = new Discord.MessageEmbed();
        embed.setColor(0x661d11)
        embed.setAuthor("Conan Exiles Server", "https://i.imgur.com/8oUpjeb.png");
        embed.setTitle(state.name);
        embed.setAuthor("Conan Exiles Server", "https://i.imgur.com/8oUpjeb.png");
        embed.addField("Game", state.raw.folder, true);
        embed.addField("Game Mode", state.raw.game, true);
        embed.addField("Map", ":map: " + state.map, true);
        embed.addField("Server Name", state.name);
        embed.addField("IP", state.query.address, true);
        let vacEnabled = (state.raw.secure === 1) ? "Enabled" : "Disabled";
        embed.addField("VAC", vacEnabled, true);
        embed.addField("Location", `${flag}`, true);
        embed.addField("Connect", `[[Connect]](steam://connect/${connect})`, true);
        embed.addField("Password", pwState, true);
        embed.addField("Players", ":busts_in_silhouette: " + state.raw.numplayers + "/" + state.maxplayers, true);
        embed.addField("Current Players", players.join(", "));
        embed.setImage(`https://topconanservers.com/api/graph/players/${connect}/24/graph.png`);
        let pwState = state.password ? ":lock: Protected" : ":unlock: Open";
        embed.setFooter(`Write "${prefixUsed + usageConan.aliases[0]} ${connect} players" for more details`);
        return resolve({response: message.author, embed: embed, serverInfo: true, silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageConan.aliases, args: usageConan.args, usage: usageConan, run: conanServersCmd}
];
