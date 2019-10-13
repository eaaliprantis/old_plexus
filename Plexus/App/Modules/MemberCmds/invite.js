const moduleInfo = {
    name: "invitebot",
    truename: "invitebot",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usageInvite = {
    name: "invitebot",
    cmdName: "invitebot",
    aliases: ["addbot", "invitebot"],
    args: {min: 0, max: 0},
    description: "Requesting the bot to be added to a server",
    exampleUsage: "addbot",
    usage: "[command]",
    runIn: ["dm", "text"],
    categories: "General",
    permlvl: 0,
    premiumLvl: 0,
    enabled: true,
    contributors: [""]
}

const usageInviteGuild = {
    name: "invite",
    cmdName: "invite",
    aliases: ["inviteme", "invite", "inviteserver", "guildinvite"],
    args: {min: 0, max: 3},
    description: "Create an instant invite link",
    exampleUsage: "invite\ninvite 0 0 yes",
    exampleDesc: "Note: the example here would say: max time=0,  max uses=0, temporary=true",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "General",
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

inviteBot = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let startMsg = "Invite " + bot.user.username + " to your server: <https:/\/discordapp.com/oauth2/authorize?&client_id=" + bot.user.id + "&scope=bot&permissions=2146958463>";
        return resolve({response: startMsg, silent: false});
    });
}

inviteDiscord = (bot, message, args, time, prefixUsed, shardId) => {
    return new Promise((resolve, reject) => {
        if(!message.channel.permissionsFor(bot.user).has("CREATE_INSTANT_INVITE")) {
            let errorMsg = "I do not have permission to create an invite link.  Please provide me with the correct permissions so I am able to create the invite link for you. (CREATE_INSTANT_INVITE)";
            return resolve({response: errorMsg, silent: false});
        } else {
            let invite1 = 'http://discord.gg';
            if(args.length === 0) {
                message.guild.channels.get(message.channel.id).createInvite().then(invite => {
                    return resolve({response: "Your invite link for this server is: " + invite1 + "/" + invite.code, silent: false});
                });
            } else {
                let determineResults = {
                    temporary: "",
                    maxAge: "",
                    maxUses: ""
                };

                let error1 = "", error2 = "", error3 = "";
                let errorVal1 = false, errorVal2 = false, errorVal3 = false;
                let assign1 = false, assign2 = false, assign3 = false;

                if(args.length === 3) {
                    let firstArg = args.shift();
                    let secondArg = args.shift();
                    let thirdArg = args.shift();


                    if(validateNumber(firstArg) === true && validateBoolean(firstArg) === null) {
                        if(parseInt(firstArg) >= 0) {
                            determineResults["maxAge"] = parseInt(firstArg);
                            assign1 = true;
                        } else {
                            determineResults["maxAge"] = 86400;
                            assign1 = true;
                        }
                    } else if(validateBoolean(firstArg) === true) {
                        determineResults["temporary"] = true;
                    } else if(validateBoolean(firstArg) === false) {
                        determineResults["temporary"] = false;
                    } else if(validateBoolean(firstArg) === null && assign1 === false) {
                        error1 = "Did not match the criteria.  Possible answers: # or true/false/yes/no "
                        errorVal1 = true;
                    }
                    if(validateNumber(secondArg) === true && validateBoolean(secondArg) === null) {
                        if(parseInt(secondArg) >= 0) {
                            if(determineResults["maxAge"] !== "" && assign1 === false) {
                                determineResults["maxAge"] = parseInt(secondArg);
                                assign2 = true;
                            } else {
                                if(determineResults["maxUses"] !== "") {
                                    determineResults["maxUses"] = parseInt(secondArg);
                                    assign2 = true;
                                } else {
                                    determineResults["maxUses"] = 0;
                                    assign2 = true;
                                }
                            }
                        } else {
                            determineResults["maxUses"] = 0;
                        }
                    } else if(validateBoolean(secondArg) === true) {
                        determineResults["temporary"] = true;
                    } else if(validateBoolean(secondArg) === false) {
                        determineResults["temporary"] = false;
                    } else if(validateBoolean(secondArg) === null && assign2 === false) {
                        error2 = "Did not match the criteria.  Possible answers: # or true/false/yes/no "
                        errorVal2 = true;
                    }

                    if(validateNumber(thirdArg) === true && validateBoolean(thirdArg) === null) {
                        if(parseInt(thirdArg) >= 0) {
                            if(determineResults["maxAge"] !== "" && (assign1 === false || assign2 === false)) {
                                determineResults["maxAge"] = parseInt(thirdArg);
                                assign3 = true;
                            } else {
                                if(determineResults["maxUses"] !== "") {
                                    determineResults["maxUses"] = parseInt(thirdArg);
                                    assign3 = true;
                                } else {
                                    determineResults["maxUses"] = 0;
                                }
                            }
                        } else {
                            determineResults["maxUses"] = 0;
                        }
                    } else if(validateBoolean(thirdArg) === true) {
                        determineResults["temporary"] = true;
                    } else if(validateBoolean(thirdArg) === false) {
                        determineResults["temporary"] = false;
                    } else if(validateBoolean(thirdArg) === null && assign3 === false) {
                        error2 = "Did not match the criteria.  Possible answers: # or true/false/yes/no "
                        errorVal3 = true;
                    }

                } else if(args.length === 2) {
                    let firstArg = args.shift();
                    let secondArg = args.shift();

                    if(validateNumber(firstArg) === true && validateBoolean(firstArg) === null) {
                        if(parseInt(firstArg) >= 0) {
                            determineResults["maxAge"] = parseInt(firstArg);
                            assign1 = true;
                        } else {
                            determineResults["maxAge"] = 86400;
                            assign1 = true;
                        }
                    } else if(validateBoolean(firstArg) === true) {
                        determineResults["temporary"] = true;
                    } else if(validateBoolean(firstArg) === false) {
                        determineResults["temporary"] = false;
                    } else if(validateBoolean(firstArg) === null && assign1 === false) {
                        error1 = "Did not match the criteria.  Possible answers: # or true/false/yes/no "
                        errorVal1 = true;
                    }
                    if(validateNumber(secondArg) === true && validateBoolean(secondArg) === null) {
                        if(parseInt(secondArg) >= 0) {
                            if(determineResults["maxAge"] !== "" && assign1 === false) {
                                determineResults["maxAge"] = parseInt(secondArg);
                                assign2 = true;
                            } else {
                                if(determineResults["maxUses"] !== "") {
                                    determineResults["maxUses"] = parseInt(secondArg);
                                    assign2 = true;
                                } else {
                                    determineResults["maxUses"] = 0;
                                }
                            }
                        } else {
                            determineResults["maxUses"] = 0;
                        }
                    } else if(validateBoolean(secondArg) === true) {
                        determineResults["temporary"] = true;
                    } else if(validateBoolean(secondArg) === false) {
                        determineResults["temporary"] = false;
                    } else if(validateBoolean(secondArg) === null && (assign2 === false || assign1 === false)) {
                        error2 = "Did not match the criteria.  Possible answers: # or true/false/yes/no "
                        errorVal2 = true;
                    }

                } else if(args.length === 1) {
                    let firstArg = args.shift();

                    if(validateNumber(firstArg) === true && validateBoolean(firstArg) === null) {
                        if(parseInt(firstArg) >= 0) {
                            determineResults["maxAge"] = parseInt(firstArg);
                            assign1 = true;
                        } else {
                            determineResults["maxAge"] = 86400;
                            assign1 = true;
                        }
                    } else if(validateBoolean(firstArg) === true) {
                        determineResults["temporary"] = true;
                    } else if(validateBoolean(firstArg) === false) {
                        determineResults["temporary"] = false;
                    } else if(validateBoolean(firstArg) === null && assign1 === false) {
                        error1 = "Did not match the criteria.  Possible answers: # or true/false/yes/no "
                        errorVal1 = true;
                    }
                }
                if(determineResults["maxAge"] === "") {
                    determineResults["maxAge"] = 86400; //default value
                }
                if(determineResults["maxUses"] === "") {
                    determineResults["maxUses"] = 0; //default value
                }
                if(determineResults["temporary"] === "") {
                    determineResults["temporary"] = false; //default value
                }
                console.log(determineResults);
                if(errorVal1 === true || errorVal2 === true || errorVal3 === true) {
                    return resolve({response: error1, silent: false});
                } else {
                    message.guild.channels.get(message.channel.id).createInvite(determineResults).then(invite => {
                        return resolve({response: "Your invite link for this server is: " + invite1 + "/" + invite.code + " with your settings.", silent: false});
                    });
                }
            }
        }
    });
}

function validateNumber(num) {
    if(num.match(/^\d+$/)){
        return true;
    }
    return false;
}

function validateBoolean(val) {
    if(val.toLowerCase() === "true" || val.toLowerCase() === "yes" || val.toLowerCase() === "y") {
        return true;
    } else if(val.toLowerCase() === "false" || val.toLowerCase() === "no" || val.toLowerCase() === "n") {
        return false;
    } else {
        return null;
    }
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageInvite.aliases, args: usageInvite.args, usage: usageInvite, run: inviteBot},
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usageInviteGuild.aliases, args: usageInviteGuild.args, usage: usageInviteGuild, run: inviteDiscord}
];
