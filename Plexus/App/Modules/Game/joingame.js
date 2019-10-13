const moduleInfo = {
    name: "joingame",
    truename: "joingame",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "joingame",
    cmdName: "joingame",
    aliases: ["joingame"],
    args: {min: 0, max: 0},
    description: "Joins the game",
    usage: "[command]",
    runIn: ["text"],
    categories: "Game",
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

balCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let path = "./../../Storage/game.json";
        let sPath = "./App/Storage/game.json";

        let data = require(path);
        let user = message.author.id;

        let embed = new Discord.MessageEmbed();
        embed.setColor("RANDOM");
        if(data[user]) {
            embed.setDescription("User already exist in database.");
            delete require.cache[data];
            return resolve({response: embed, embed: embed, silent: false});
        } else {
            embed.setColor("GREEN");
            data[user] = {};
            if(!data[user]['stats']) {
                data[user]['stats'] = {};
            }
            if(!data[user]['stats']['provinces']) {
                data[user]['stats']['provinces']['size'] = 1;
                data[user]['stats']['provinces']['list'] = {};
                let capitalSpecs = {
                    health: 1000,
                    maxHealth: 1000,
                    workers: 100,
                    attack: 4,
                    defense: 4
                };
                let citySpecs = {
                    health: 250,
                    maxHealth: 250,
                    workers: 25,
                    attack: 1,
                    defense: 1,
                    isCap: true,
                    capital: capitalSpecs
                };
                let provinceSpecs = {
                    cities: {},
                    cityCount: 1,
                    minCities: 1,
                    maxCities: 10
                };
                provinceSpecs.cities[1] = citySpecs;
                data[user]['stats']['provinces']['list'][1] = provinceSpecs;
            }
            if(!data[user]['stats']['gold']) {
                data[user]['stats']['gold'] = 1000;
            }
            if(!data[user]['stats']['resources']) {
                data[user]['stats']['resources'] = 0;
            }
            if(!data[user]['stats']['bio']) {
                data[user]['stats']['bio'] = "N/A";
            }
            if(!data[user]['stats']['name']) {
                data[user]['stats']['name'] = "N/A";
            }
            if(!data[user]['stats']['alliance']) {
                data[user]['stats']['alliance'] = {}
            }
            if(!data[user]['stats']['xp']) {
                data[user]['stats']['xp'] = 0;
            }
            if(!data[user]['stats']['level']) {
                data[user]['stats']['level'] = 1;
            }
            let isInAlliance = (data[user]['stats']['alliance'] !== undefined && data[user]['stats']['alliance']['owner'] === true) ? "Yes" : "Not in one";

        }
        delete require.cache[data];
        return resolve({response: embed, embed: embed, silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: balCmd}
];
