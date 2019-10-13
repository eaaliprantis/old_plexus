const moduleInfo = {
    name: "pokedex",
    truename: "pokedex",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "pokedex",
    cmdName: "pokedex",
    aliases: ["pokedex"],
    args: {min: 1, max: 1},
    description: "Grabs statistics about the pokemon that one is searching for",
    exampleUsage: "pokedex pikachu",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Fun",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usagePokemon = {
    name: "pokemon",
    cmdName: "pokemon",
    aliases: ["pokemon", "pokemonlookup"],
    args: {min: 1, max: 3},
    description: "Finds information about the pokemon based on either ID or by the name with language support",
    example: "pokemon name Snorlax de",
    exampleUsage: "pokemon name Snorlax\npokemon id 147\npokemon name Snorlax de",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Fun",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usagePokeGif = {
    name: "pokemongif",
    cmdName: "pokemongif",
    aliases: ["pokemongif", "pokegif"],
    args: {min: 1, max: 3},
    description: "Finds information about the pokemon based on either ID or by the name with language support",
    exampleUsage: "pokemongif Pikachu\npokegif Snorlax",
    example: "pokegif Snorlax",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Fun",
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

pokemonCmd = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        let pokemon = require("pokemon");
        let pokeGif = require("pokemon-gif");
        let embed = new Discord.MessageEmbed();
        if(args.length >= 1) {
            let optChoice = args.shift();
            if(optChoice.toLowerCase() === "langlist") {
                let pokeLook = pokemon.languages;
                embed.setTitle("List of supported Languages");
                embed.setDescription("Here is a list of supported languages:\n" + pokeLook.join("\n"));
                return resolve({response: "", embed: embed, silent: false});
            } else if(optChoice.toLowerCase() === "haslang") {
                let langChoice = args.shift();
                let pokeLook = pokemon.languages.has(langChoice);
                if(pokeLook === true) {
                    embed.setTitle("Language Support");
                    embed.setDescription("The language that you were looking up is **available**");
                    return resolve({response: "", embed: embed, silent: false});
                } else {
                    embed.setTitle("Language Not Supported");
                    embed.setDescription("The language that you were looking up is **__not__** **available**");
                    return resolve({response: "", embed: embed, silent: false});
                }
            } else if(optChoice.toLowerCase() === "name") {
                let pokechoice = args.shift();
                if(BotSettings.validate.Integer(pokechoice) === true) {
                    pokechoice = parseInt(pokechoice);
                } else {
                    BotSettings.assist.error("You must enter a number.", message.channel);
                    return resolve({response: "", silent: true});
                }
                let pokeResp = "";
                if(args.length === 1) {
                    //language choice
                    let langChoice = args.shift();
                    if(pokemon.languages.has(langChoice) === true) {
                        pokeResp = pokemon.getName(pokechoice, langChoice);
                    } else {
                        pokeResp = pokemon.getName(pokechoice);
                    }
                } else {
                    //just pokemon
                    pokeResp = pokemon.getName(pokechoice);
                }
                embed.setDescription("The Pokemon ID that you entered (" + pokechoice + ") is " + pokeResp);
                embed.setColor("RANDOM");
                return resolve({response: "", embed: embed, silent: false});
            } else if(optChoice.toLowerCase() === "id") {
                let S = require("string");
                let pokechoice = args.shift();
                pokechoice = S(pokechoice).capitalize().s;
                let pokeResp = "";
                if(args.length === 1) {
                    //language
                    let langChoice = args.shift();
                    if(pokemon.languages.has(langChoice) === true) {
                        pokeResp = pokemon.getId(pokechoice, langChoice);
                    } else {
                        pokeResp = pokemon.getId(pokechoice);
                    }
                } else {
                    //pokemon lookup
                    pokeResp = pokemon.getId(pokechoice);
                }
                embed.setDescription("The Pokemon ID that you entered (" + pokechoice + ") is " + pokeResp);
                return resolve({response: "", embed: embed, silent: false});
            } else {
                BotSettings.assist.error("There was an error when trying to search the pokemon", message.channel);
                return resolve({response: "", silent: true});
            }
        } else {
            BotSettings.assist.error("There was no additional arguments.  Please try again with either using a name and an id or an id and the pokemon\nExample: {prefix}pokemon name 100\nExample: {prefix}pokemon id Snorlax", message.channel);
            return resolve({response: "", silent: true});
        }
    });
}

requestAsync = function(options) {
    return new Promise((resolve, reject) => {
        var superagent = require('superagent');
        require("superagent-cache")(superagent);
        console.log("Superagent cache enabled");
        superagent.get(options.url).end((error, response) => {
            if(error) {
                return resolve({response: response, error: error, errorThrown: true});
            };
            return resolve({response: response, error: error, errorThrown: false});
        });
    });
};

pokedexCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let pokemonArg = args[0];
        let options = {
            url: `http://pokeapi.co/api/v2/pokemon-species/${encodeURIComponent(pokemonArg.toLowerCase())}`,
            headers: {
                "Accept": "application/json"
            }
        };
        let tmpEmbed = new Discord.MessageEmbed();
        tmpEmbed.setDescription("Please wait while we try and find more information about the pokemon that you have requested.....");
        tmpEmbed.setImage("http://www.lanlinglaurel.com/data/out/98/4797638-waiting-images.png");
        message.channel.send("", {embed: tmpEmbed}).then(m => {
            requestAsync(options).then((response) => {
                console.log("Status code: " + response.response.statusCode);
                if(response.response && response.response.statusCode === 200 && response.response.text) {
                    //valid
                    if(response.response.headers['content-type'] === "application/json") {
                        let jsonBody = JSON.parse(response.response.text);
                        let promiseArray = [];
                        let embed = new Discord.MessageEmbed();
                        let S = require("string");
                        if((jsonBody.evolution_chain !== undefined && jsonBody.evolution_chain !== "") && (jsonBody.evolution_chain.url !== "" || jsonBody.evolution_chain.url !== null || jsonBody.evolution_chain.url !== undefined)) {
                            console.log("Promise Array initialized");
                            options.url = jsonBody.evolution_chain.url;
                            promiseArray.push(requestAsync(options));
                            console.log("Promise array length: " + promiseArray.length);
                        }
                        let pokemonName = jsonBody.names[0].name;
                        embed.setAuthor(jsonBody.names[0].name);
                        embed.setColor(jsonBody.color.name);
                        embed.setFooter((jsonBody.gender_rate === -1) ? `${jsonBody.names[0].name} is a genderless Pokemon` : `${(jsonBody.gender_rate / 8) * 100}% Female and ${((8 - jsonBody.gender_rate) / 8) * 100}% Male`);
                        embed.setThumbnail(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${jsonBody.id}.png`);
                        embed.setDescription("**First seen in Generation: **",`${jsonBody.generation.name.substring(jsonBody.generation.name.indexOf("-") + 1).toUpperCase()}`);
                        embed.addField("**Capture Rate**", `${jsonBody.capture_rate} of 255 (higher is better)`, true);
                        embed.addField("**Base Happiness**", `${jsonBody.base_happiness}`, true);
                        embed.addField("**Base Steps to Hatch**", `${(parseInt(jsonBody.hatch_counter) * 255) + 1}`, true);
                        embed.addField("**Growth Rate**", `${S(jsonBody.growth_rate.name).capitalize().s}`, true);
                        embed.addField("**Color / Shape**", `${S(jsonBody.color.name).capitalize().s} ${S(jsonBody.shape.name).capitalize().s}`, true);
                        embed.addField("**Habitat**", `${jsonBody.habitat ? S(jsonBody.habitat.name).capitalize().s : "None"}`, true);
                        embed.addField("**Egg Groups**", `${jsonBody.egg_groups.map(data => data.name).sort().join("\n")}`, true);
                        embed.addField("**Evolves From Species**", (jsonBody.evolves_from_species !== null) ? `${S(jsonBody.evolves_from_species.name).capitalize().s }` : 'None', true);

                        if(promiseArray.length === 1) {
                            Promise.all(promiseArray).then((values) => {
                                console.log(values.length + " - we have entered the promise array");
                                if(values.length === 1) {
                                    if(values[0].response && values[0].response.statusCode === 200 && values[0].response.text) {
                                        if(values[0].response.headers['content-type'] === 'application/json') {
                                            console.log("Getting evolution tree");
                                            let data = JSON.parse(values[0].response.text);
                                            console.log(data.chain);
                                            let responseVal = getEvolutionTree(data.chain, pokemonName);
                                            console.log("Result: " + responseVal + " | length: " + responseVal.length);
                                            let responseValSplit = responseVal[0].toString();
                                            console.log(responseValSplit);
                                            responseVal = responseValSplit.split(",").join("\n");
                                            embed.addField("**Evolution Tree**", responseVal);
                                            m.edit("", {embed: embed});
                                            return resolve({response: "", embed: "", silent: true});
                                        }
                                    }
                                }
                            }).catch(errorValues => {
                                console.log(errorValues);
                            });
                        } else {
                            m.edit("", {embed: embed});
                            return resolve({response: "", embed: "", silent: true});
                        }
                    }
                } else if(response.response.statusCode === 404) {
                    let embed = new Discord.MessageEmbed();
                    embed.setDescription("We were unable to find the pokemon that you were requesting.  We apologize.");
                    m.edit("", {embed: embed});
                    return resolve({response: "", embed: "", silent: true});
                } else {
                    let embed = new Discord.MessageEmbed();
                    embed.setAuthor("Status Code: " + response.response.statusCode);
                    m.edit("", {embed: embed});
                    return resolve({response: "", embed: "", silent: true});
                }
            });
        });
    });
}

getEvolutionTree = (unparsedData, pokemonName="") => {
    let finalResp = [];
    let data = unparsedData
    let S = require("string");
    //same pokemon, get next chain
    let evolutionTree = data.evolves_to;
    console.log("Pokemon: " + pokemonName + " | evolutionTree: " + evolutionTree.length);
    if(evolutionTree.length >= 1) {
        evolutionTree.forEach((pokemonEvolve2) => {
            console.log(S(pokemonEvolve2.species.name).capitalize().s + " | length: " + pokemonEvolve2.evolves_to.length);
            if(pokemonEvolve2.evolves_to.length === 0) {
                //no more evolving
                if(pokemonName !== "" && pokemonEvolve2.species.name !== pokemonName.toLowerCase()) {
                    finalResp.push(S(data.species.name).capitalize().s + " -> " + S(pokemonEvolve2.species.name).capitalize().s)
                    return finalResp;
                } else if(pokemonName === ""){
                    finalResp.push(S(data.species.name).capitalize().s + " -> " + S(pokemonEvolve2.species.name).capitalize().s)
                    return finalResp;
                }
            } else {
                finalResp.push(getEvolutionTree(pokemonEvolve2, pokemonName));
            }
        });
    } else {
        finalResp.push(S(data.species.name).capitalize().s);
        return finalResp;
    }
    return finalResp;
}

getEvolutionDetails = (pokemonDetails) => {
    //assuming evolution_details is passed in
    let response = []
    let responseTxt = [];
    if(pokemonDetails.length !== 1) {
        return [response, responseTxt];
    }
    let minLevel = (pokemonDetails[0].min_level !== null) ? pokemonDetails[0].min_level : "None";
    response.push(minLevel);
    responseTxt.push("Min Level");
    let minBeauty = (pokemonDetails[0].min_beauty !== null) ? pokemonDetails[0].min_beauty : "None";
    response.push(minBeauty);
    responseTxt.push("Min Beauty");
    let gender = (pokemonDetails[0].gender !== null) ? pokemonDetails[0].gender : "N/A";
    response.push(gender);
    responseTxt.push("Gender");
    let physStats = (pokemonDetails[0].relative_physical_stats !== null) ? pokemonDetails[0].relative_physical_stats : "None";
    response.push(physStats);
    responseTxt.push("Relative Physical Stats");
    let overworldRain = (pokemonDetails[0].needs_overworld_rain === true) ? "Yes" : "No";
    response.push(overworldRain);
    responseTxt.push("Needs overworld rain?");
    let upsideDown = (pokemonDetails[0].turn_upside_down === true) ? "Yes" : "No";
    response.push(upsideDown);
    responseTxt.push("Need to be upside down?");
    let item = (pokemonDetails[0].item !== null) ? pokemonDetails[0].item.name : "None";
    response.push(item);
    responseTxt.push("Item needed");
    let trigger = (pokemonDetails[0].trigger !== null) ? pokemonDetails[0].trigger.name : "None";
    response.push(trigger);
    responseTxt.push("Trigger needed");
    let moveType = (pokemonDetails[0].known_move_type !== null) ? pokemonDetails[0].known_move_type : "None";
    response.push(moveType);
    responseTxt.push("Need to know move type?");
    let minAffection = (pokemonDetails[0].minAffection !== null) ? pokemonDetails[0].minAffection : "None";
    response.push(minAffection);
    responseTxt.push("Min Affection");
    let partyType = (pokemonDetails[0].party_type !== null) ? pokemonDetails[0].party_type : "None";
    response.push(partyType);
    responseTxt.push("Party type?");
    let tradeSpecies = (pokemonDetails[0].trade_species !== null) ? pokemonDetails[0].trade_species : "None";
    response.push(tradeSpecies);
    responseTxt.push("Trade Species?");
    let partySpecies = (pokemonDetails[0].party_species !== null) ? pokemonDetails[0].party_species : "None";
    response.push(partySpecies);
    responseTxt.push("Party Species?");
    let minHappy = (pokemonDetails[0].min_happiness !== null) ? pokemonDetails[0].min_happiness : "None";
    response.push(minHappy);
    responseTxt.push("Min Happy?");
    let heldItem = (pokemonDetails[0].held_item !== null) ? pokemonDetails[0].held_item.name : "None";
    response.push(heldItem);
    responseTxt.push("Held item?");
    let knownMove = (pokemonDetails[0].known_move !== null) ? pokemonDetails[0].known_move.name : "None";
    response.push(knownMove);
    responseTxt.push("Known move?");
    let location = (pokemonDetails[0].location !== null) ? pokemonDetails[0].location : "None";
    response.push(location);
    responseTxt.push("Location?");
    return [response, responseTxt];
}

process.on('uncaughtException', function (err) {
  console.log(err);
})

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: pokedexCmd}
];
