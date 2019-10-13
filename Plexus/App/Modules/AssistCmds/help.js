let moduleInfo = {
    name: "Help",
    truename: "help",
    platformOnly: "discord",
    author: "Manny",
    contributors: ["Tyler R."]
};

let usage = {
    name: "help",
    cmdName: "help",
    aliases: ["help", "?"],
    args: {min: 0, max: 10},
    description: "Get help.",
    exampleUsage: "help",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "General",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
};

this.setupCommands = function(file) {
    this.file = file;
    return new Promise((resolve, reject) => {
        return resolve({file: this.file, moduleInfo: moduleInfo, commands: this.commands});
    });
}

function getInfo() {
    return {commands: this.commands, usage: usage, moduleInfo: moduleInfo};
}

help = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let emoji = require("node-emoji");
        let discordEmoji = require("discord-emoji");
        if(args.length >= 1) {
            two(bot, message, args, time, {resolve: resolve, reject: reject}, prefixUsed, shardId).then(respObj => {
                if(respObj.resolveable === true) {
                    if(respObj.hasOwnProperty("silent") && respObj.silent === false) {
                        if(respObj.embed === true) {
                            let embedMsg = new Discord.MessageEmbed();
                            embedMsg.setTitle("Command: " + getInfo().moduleInfo.truename);
                            embedMsg.setColor("#4D90F4");
                            (respObj.error) ? embedMsg.addField("Error: " + respObj.response) : embedMsg.setDescription(respObj.response);
                            message.channel.send("", {embed: embedMsg});
                        } else {
                            message.channel.send(respObj.response);
                        }
                    }
                    return respObj.promise({response: "", embed: "", silent: true});
                } else {
                    if(respObj.hasOwnProperty("silent") && respObj.silent === false) {
                        if(respObj.embed === true) {
                            let embedMsg = new Discord.MessageEmbed();
                            embedMsg.setTitle("Command: " + getInfo().moduleInfo.truename);
                            embedMsg.setColor("#4D90F4");
                            (respObj.error) ? embedMsg.addField("Error: " + respObj.response) : embedMsg.setDescription(respObj.response);
                            message.channel.send("", {embed: embedMsg});
                        } else {
                            message.channel.send(respObj.response);
                        }
                    }
                    return respObj.promise({response: "", embed: "", silent: true});
                }
            });
        } else {
            let x = ["one", "two", "three", "four"];
            let y = ['**1** - Available Commands',
            '**2** - List of Categories',
            '**3** - About the Bot',
            '**4** - Invite'];
            let z = ['Get Commands',
            'List Categories',
            'Learn more about the bot',
            'Invite to your server'];

            let embed = new Discord.MessageEmbed();
            embed.setColor('#006400');
            embed.setTitle('How can we help you?');
            embed.setDescription("I didn't understand what you meant.  Here is a list of what I __do__ understand.  Click the corresponding number for more information about the command.");

            for(let i = 0; i < y.length; i++) {
                embed.addField(y[i], z[i]);
            }

            message.channel.send("", {
                disableEveryone: true,
                embed: embed
            }).then(m => {
                collector = m.createReactionCollector(
                    (reaction, user) => {
                        console.log("emoji.name: " + reaction.emoji.name + " | matching ids: " + (user.id === message.author.id));
                        function getKeyByValue(object, value) {
                            return Object.keys(object).find(key => object[key] === value);
                        }
                        let response = getKeyByValue(discordEmoji.symbols, reaction.emoji.name)
                        let emojiNameValid = reaction.emoji.name === discordEmoji.symbols[response];
                        if(x.includes(response)) {
                            return reaction.emoji.name === discordEmoji.symbols[response] && user.id === message.author.id
                        } else {
                            //remove reaction
                            reaction.fetchUsers().then(reactionUsers => {
                                let me = reactionUsers.filter(rUser => { return rUser.id !== message.author.id || rUser.id !== bot.user.id})[0];
                                console.log(me);
                                reaction.remove(me).catch(removeErr => {Logger.sendLog("-> Unable to remove reaction due to " + removeErr.message, "CRITICAL", __filename);});
                            });
                        }
                        return false;
                    },
                    { time: 15000 }
                );
                collector.on('collect', r => {
                    console.log(`Collected ${r.emoji.name}`);
                    collector.stop("user selected option")
                });
                collector.on('end', collected => {
                    console.log(`Collected ${collected.size} items`);
                    function getKeyByValue2(object, value) {
                        return Object.keys(object).find(key => object[key] === value);
                    }
                    if(collected.size === 1) {
                        let response = getKeyByValue2(discordEmoji.symbols, collected.array()[0]._emoji.name);
                        let functArr = {one: one, two: two, three: three, four: four};
                        functArr[response](bot, message, args, time, {resolve: resolve, reject: reject}, prefixUsed, shardId).then(respObj => {
                            if(respObj.resolveable === true) {
                                if(respObj.hasOwnProperty("silent") && respObj.silent === false) {
                                    if(respObj.embed === true) {
                                        if(respObj.hasOwnProperty("embedObj") && respObj.embedObj === true) {
                                            return respObj.promise({response: "", embed: respObj.response, silent: false});
                                        }
                                        let embedMsg = new Discord.MessageEmbed();
                                        embedMsg.setTitle("Command: " + getInfo().moduleInfo.truename);
                                        embedMsg.setColor("#4D90F4");
                                        (respObj.error) ? embedMsg.addField("Error: " + respObj.response) : embedMsg.setDescription(respObj.response);
                                        m.channel.send("", {embed: embedMsg});
                                    } else {
                                        m.channel.send(respObj.response);
                                    }
                                }
                                return respObj.promise({response: "", embed: "", silent: true});
                            } else {
                                if(respObj.hasOwnProperty("silent") && respObj.silent === false) {
                                    if(respObj.embed === true) {
                                        if(respObj.hasOwnProperty("embedObj") && respObj.embedObj === true) {
                                            return respObj.promise({response: "", embed: respObj.response, silent: false});
                                        }
                                        let embedMsg = new Discord.MessageEmbed();
                                        embedMsg.setTitle("Command: " + getInfo().moduleInfo.truename);
                                        embedMsg.setColor("#4D90F4");
                                        (respObj.error) ? embedMsg.addField("Error: " + respObj.response) : embedMsg.setDescription(respObj.response);
                                        message.channel.send("", {embed: embedMsg});
                                    } else {
                                        message.channel.send(respObj.response);
                                    }
                                }
                                return respObj.promise({response: "", embed: "", silent: true});
                            }
                        });
                    } else {
                        //Nothing was selected.  Delete it
                        m.delete();
                        message.delete();
                    }
                });
                function doReaction(reaction)
                {
                    m.react(discordEmoji.symbols[reaction]);
                }

                for(var i in x) {
                    setTimeout(doReaction, 500*i, x[i]);
                }
            });
        }
    });
}

function one(bot, message, args, time, promiseOpt, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        if(args.length === 0) {
            let moduleResponse = Loader.findAllModules("discord");
            if(moduleResponse[0] === true) {
                buildHelper(moduleResponse[1], "discord", message, prefixUsed).then(buildHelp => {
                    let helpMsg = [];
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle("Command: " + getInfo().moduleInfo.truename);
                    embed.setColor("#4D90F4");
                    for(let key in buildHelp) {
                        if(key.toLowerCase() === "owner") {
                            continue;
                        }
                        let tmpResp = "";
                        if(buildHelp[key].sort().join("\n").length > BotSettings.discordServers.limits.field.value) {
                            tmpResp = BotSettings.resolve.characterLimitHandler(buildHelp[key].sort(), BotSettings.discordServers.limits.field.value, 2);
                        }
                        console.log(tmpResp.length);
                        if(tmpResp.length !== 0) {
                            for(let resp in tmpResp) {
                                embed.addField("**__" + key.toCapFirstLetter() + " Commands__** #" + (parseInt(resp) + 1), tmpResp[resp], true);
                            }
                        } else {
                            embed.addField("**__" + key.toCapFirstLetter() + " Commands__**", buildHelp[key].sort().join("\n"), true);
                        }
                        helpMsg.push("**__" + key.toCapFirstLetter() + " Commands__**:\n" + buildHelp[key].sort().join("\n") + "\n");
                        helpMsg.join("\n");
                    }
                    message.channel.send("", {embed: embed});
                    return resolve({response: helpMsg, promise: promiseOpt.resolve, resolveable: true, embed: true, error: false, silent: true});
                }).catch(err => {
                    return resolve({response: err, promise: promiseOpt.reject, resolveable: false, embed: true, error: false, silent: false});
                });
            } else {
                return resolve({response: "Command not found...", promise: promiseOpt.reject, resolveable: false, embed: true, error: false, silent: false});
            }
        } else {
            let moduleObj = Loader.findModules("discord", args.join(" "));
            if(moduleObj[0] === true) {
                let helpMsg = prefixUsed + moduleObj[2].usage.cmdName + " -- " + moduleObj[2].usage.description;
                return resolve({response: helpMsg, promise: promiseOpt.resolve, resolveable: true, embed: true, error: false, silent: false});
            }
            return resolve({response: "Command not found...", promise: promiseOpt.reject, resolveable: false, embed: true, error: false, silent: false});
        }
    });
}

function buildHelper(modules, platform, message, prefixUsed, shardId) {
    let helperArr = [];
    return new Promise((resolve, reject) => {
        BotSettings.assist.permissionHelper(message).then(permVal => {
            modules.forEach((tmodule) => {
                tmodule.commands.forEach((command) => {
                    if(parseInt(permVal) >= command.usage.permlvl && command.usage.enabled === true) {
                        let category = command.usage.categories;
                        if(command.usage.enabled === true) {
                            if(!helperArr.hasOwnProperty(category)) {
                                helperArr[category] = [];
                            }
                            helperArr[category].push(prefixUsed + command.usage.cmdName + " -- " + command.usage.description);
                        }
                    }
                });
            });
            return resolve(helperArr);
        }).catch(err => {
            return reject(err);
        });
    });
}

function two(bot, message, args, time, promiseOpt, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        if(args.length === 0) {
            let moduleResponse = Loader.findAllModules("discord");
            if(moduleResponse[0] === true) {
                buildHelper(moduleResponse[1], "discord", message, prefixUsed).then(buildHelp => {
                    let helpMsg = [];
                    for(let key in buildHelp) {
                        if(key.toLowerCase() === "owner") {
                            continue;
                        }
                        helpMsg.push("**__" + key.toCapFirstLetter() + " Category__**");
                        helpMsg.join("\n");
                    }
                    return resolve({response: helpMsg, promise: promiseOpt.resolve, resolveable: true, embed: true, error: false, silent: false});
                }).catch(err => {
                    return resolve({response: err, promise: promiseOpt.reject, resolveable: false, embed: true, error: false, silent: false});
                });
            } else {
                return resolve({response: "Category not found...", promise: promiseOpt.reject, resolveable: false, embed: true, error: false, silent: false});
            }
        } else {
            let moduleObj = Loader.findModules("discord", args.join(" ").trim().toLowerCase());
            if(moduleObj[0] === true) {
                let helpMsg = prefixUsed + moduleObj[2].usage.cmdName + " -- " + moduleObj[2].usage.description;
                if(moduleObj[2].usage.hasOwnProperty("exampleUsage")) {
                    if(moduleObj[2].usage.hasOwnProperty("exampleDesc")) {
                        helpMsg += "\n" + moduleObj[2].usage.exampleDesc + "\n";
                    }
                    if(moduleObj[2].usage.exampleUsage.indexOf("\n") >= 0) {
                        helpMsg += "\n" + moduleObj[2].usage.exampleUsage.split("\n").join("\n" + prefixUsed);
                    } else {
                        helpMsg += "\n" + prefixUsed + moduleObj[2].usage.exampleUsage;
                    }
                }
                return resolve({response: helpMsg, promise: promiseOpt.resolve, resolveable: true, embed: true, error: false, silent: false});
            }
            return resolve({response: "Category not found...", promise: promiseOpt.reject, resolveable: false, embed: true, error: false, silent: false});
        }
    });
}

function three(bot, message, args, time, promiseOpt, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let returnMsg = "This is a **multi-service** bot.  It works across a ton of platforms like __Discord, Twitch, YouTube, Mixer,__ and thats not all!\n";
        returnMsg += "\nSome of the other crazy stuff this bot can do are things like Moderation for your server, random fun commands, some game integrations (like *Overwatch and Rocket League*) and even more to come!\n";
        returnMsg += "\nThink that's it? Pfft, nah. We have a lot of features to come in the future!\n";
        returnMsg += "\n*Why aren't you using it yet?!*";
        let embed = new Discord.MessageEmbed();
        embed.setAuthor("About " + bot.user.username, "https://cdn.discordapp.com/attachments/256992617345187842/342506102363258881/1080x1080_Avatar.png");
        embed.setColor("RANDOM");
        embed.setThumbnail("https://cdn.discordapp.com/attachments/256992617345187842/342506099527778305/Logo.png");
        embed.setDescription("\n" + returnMsg);
        embed.setURL("http://discord.gg/XyTNwVz");
        return resolve({response: embed, promise: promiseOpt.resolve, resolvable: true, embed: true, embedObj: true, error: false, silent: false});
    });
}

function four(bot, message, args, time, promiseOpt, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let embed = new Discord.MessageEmbed();
        embed.setDescription("Invite the wonderful [Plexus](http:\/\/discordapp.com/oauth2/authorize?&client_id=" + bot.user.id + "&scope=bot&permissions=2146958463) bot to your server!");
        embed.setColor("RANDOM");
        embed.setURL("http:\/\/discordapp.com/oauth2/authorize?&client_id=" + bot.user.id + "&scope=bot&permissions=2146958463");
        embed.setTitle("Invite");
        embed.setAuthor(bot.user.username, "https://cdn.discordapp.com/attachments/256992617345187842/342506102363258881/1080x1080_Avatar.png");
        embed.setThumbnail("https://cdn.discordapp.com/attachments/256992617345187842/342506099527778305/Logo.png");
        return resolve({response: embed, promise: promiseOpt.resolve, resolvable: true, embed: true, embedObj: true, error: false, silent: false});
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: help}
];
