const moduleInfo = {
    name: "user",
    truename: "user",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "usersettings",
    cmdName: "usersettings",
    aliases: ["usersettings", "usersets"],
    args: {min: 2, max: 500},
    description: "Sets the user settings",
    exampleUsage: "usersettings set birthday MM/DD/YYYY\nusersettings set language English\nusersettings set private yes\nusersettings set prefix .",
    usage: "[command:str]",
    runIn: ["dm", "text"],
    categories: "Settings",
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

let availOpts = ['set', 'get'];
let secondOpts = [['birthday', 'dob', 'birth'], ['language', 'lang'], ['private', 'private account', 'accountprivate'], ['prefix'], ['prefixgame'], ["description", "desc"], ['makerkey', 'maker_key', 'ifttt', 'ifttt_key']];

let moment = require("moment");

setUser = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let choice = args.shift();
        let choice2 = args.shift();
        let S = require("string");
        let sim = require("string-similarity");
        message.delete().then((m) => {
            Logger.sendLog("-> Userset validate: " + availOpts.includes(choice.toLowerCase()), "INFO", __filename);
            if(availOpts.includes(choice.toLowerCase())) {
                if(choice.toLowerCase() === "set") {
                    if(secondOpts[0].includes(choice2.toLowerCase())) {
                        //birthday
                        Database.callStatement("SELECT * FROM usersettings WHERE platform='discord' AND userid='" + message.author.id + "' LIMIT 1").then((rows) => {
                            let birthday = "", validDate = false;
                            console.log("birthday..... args: " + args.length + " | args: " + args);
                            if(args.length === 1) {
                                birthday = args.shift();
                                if(BotSettings.validate.MomentDate(birthday, "MM/DD/YYYY") === true) {
                                    validDate = true;
                                } else {
                                    BotSettings.assist.error("Invalid birthday format.  The correct format is: `MM/DD/YYYY`", message.channel);
                                    return resolve({response: "", silent: true});
                                }
                            } else {
                                BotSettings.assist.error("No birthday argument.  Please try again with entering your birthdate correctly in the format `MM/DD/YYYY`", message.channel);
                                return resolve({response: "", silent: true});
                            }
                            if(validDate === false) {
                                BotSettings.assist.error("Birthday was invalid or in the wrong format.  Please try again with entering your birthdate correctly in the format `MM/DD/YYYY`", message.channel);
                                return resolve({response: "", silent: true});
                            }
                            let convertedDate = moment(birthday, "MM/DD/YYYY");
                            if(rows.length === 1 && validDate === true) {
                                //account already exist
                                Database.callStatement("UPDATE usersettings SET birthday='" + convertedDate.format("YYYY-MM-DD") + "' WHERE platform='discord' AND userid='" + message.author.id + "'").then(row => {
                                    Logger.sendLog("-> Birthday for " + message.author.tag + " updated successfully.", "INFO", __filename);
                                    return resolve({response: "Your birthday was updated successfully", silent: false});
                                });
                            } else {
                                Database.callStatement("INSERT INTO usersettings (platform, userid, birthday) VALUES ('discord', '" + message.author.id + "', '" + convertedDate.format("YYYY-MM-DD") + "')").then((row) => {
                                    Logger.sendLog("-> Birthday for " + message.author.tag + " was updated successfully.", "INFO", __filename);
                                    return resolve({response: "Your birthday was updated successfully", silent: false});
                                });
                            }
                        })
                    } else if(secondOpts[1].includes(choice2.toLowerCase())) {
                        //language
                        let langChoice = "";
                        if(args.length === 1) {
                            langChoice = args.shift();
                        } else {
                            Logger.sendLog('-> Invalid number of arguments.', "INFO", __filename);
                            BotSettings.assist.error("Invalid number of arguments.", message.channel);
                            return resolve({response: "", silent: true});
                        }
                        Database.callStatement("SELECT * FROM usersettings WHERE platform='discord' AND userid='" + message.author.id + "' LIMIT 1").then((userInfo) => {
                            if(userInfo.length === 1 || userInfo.length === 0) {
                                //account already exist
                                Database.callStatement("SELECT * FROM languages WHERE supported='1'").then((rows) => {
                                    if(rows.length >= 1) {
                                        let langListName = rows.map(x => {return x.name});
                                        let langListAbbr = rows.map(x => {return x.abbr.split(",");});
                                        let nameCase = S(langChoice).capitalize().s;
                                        if(langListName.includes(nameCase) === true || langListAbbr.includes(langChoice.toLowerCase())) {
                                            //valid language
                                            //grab id of language
                                            let info = rows.filter(y => {
                                                return y.name.toLowerCase() === nameCase.toLowerCase() ||
                                                y.abbr.toLowerCase() === langChoice.toLowerCase() ||
                                                sim.compareTwoStrings(y.name.toLowerCase(), nameCase.toLowerCase()) >= .85 ||
                                                sim.compareTwoStrings(y.abbr.toLowerCase(), langChoice.toLowerCase()) >= .975;
                                            });
                                            if(Array.isArray(info)) {
                                                if(info.length === 1) {
                                                    info = info.shift();
                                                    Logger.sendLog("-> Valid language choice.  Choice: " + nameCase + " | Abbr: " + info.abbr + " | id: " + info.id + " | Name: " + info.name, "INFO", __filename);
                                                    if(userInfo.length === 1) {
                                                        Database.callStatement("UPDATE usersettings SET language='" + info.id + "' WHERE platform='discord' AND userid='" + message.author.id + "'").then((infoData) => {
                                                            Logger.sendLog("-> Supported Language updated for " + message.author.id + " with tag " + message.author.tag, "INFO", __filename);
                                                            return resolve({response: "Your language has been updated.", silent: false});
                                                        }).catch(errData => {
                                                            Logger.sendLog("-> Error when trying to add data.  Error Data: " + errData.message, "CRITICAL", __filename);
                                                            return resolve({response: "We were unable to update the data due to an error.  " + errData.message, silent: false});
                                                        });
                                                    } else {
                                                        Database.callStatement("INSERT INTO usersettings (platform, userid, language) VALUES ('discord', '" + message.author.id + "', '" + info.id + "')").then((infoData2) => {
                                                            Logger.sendLog("-> Supported Language updated for " + message.author.id + " with tag " + message.author.tag, "INFO", __filename);
                                                            return resolve({response: "Your language has been updated.", silent: false});
                                                        }).catch(errData2 => {
                                                            Logger.sendLog("-> Error when trying to add data.  Error Data: " + errData2.message, "CRITICAL", __filename);
                                                            return resolve({response: "We were unable to update the data due to an error.  " + errData2.message, silent: false});
                                                        });
                                                    }
                                                } else {
                                                    //what do i do when there is multiple choices? Display them and have them choose?
                                                    let embed = new Discord.MessageEmbed();
                                                    embed.setTitle("Multiple languages Detected");
                                                    embed.setDescription("There was multiple languages that have been detected.  Please choose the appropriate language by the number. **Example**: 1");
                                                    let numLst = info.map(z => {
                                                        return z.id;
                                                    });
                                                    embed.addField("Languages", info.map(z => {return "**" + z.id + "** - " + S(z.name).capitalize().s + " - " + z.abbr;}), true);
                                                    embed.setFooter("Type Q for Quit");
                                                    message.channel.send(message.author, {embed}).then(msg => {
                                                        let collector = msg.channel.createCollector(m2 => {
                                                            if(m2.author.id === message.author.id && m2.cleanContent.length >= 1 && m2.author.id !== message.client.user.id &&
                                                            ((BotSettings.resolve.Number(m2.content) && BotSettings.resolve.NumberArr(m2.content, numLst, "integer")) ||
                                                            (m2.cleanContent.length === 1 && m2.content.toLowerCase() === "q")) ) {
                                                                return m2;
                                                            } else {
                                                                if(m2.author.id === message.author.id) {
                                                                    m2.delete();
                                                                }
                                                            }
                                                        }, {time: 60*1000}
                                                        );
                                                        collector.on("collect", (m5) => {
                                                            if(m5.content.length === 1 && m5.content.toLowerCase() === "q") {
                                                                return resolve({response: "Language chosen cancelled.", silent: false});
                                                            } else {
                                                                if(BotSettings.resolve.Number(m5.content) && BotSettings.resolve.NumberArr(m5.content, numLst, "integer")) {
                                                                    //valid number
                                                                    if(userInfo.length === 1) {
                                                                        Database.callStatement("UPDATE usersettings SET languageId='" + parseInt(m5.content) + "', language='" + info.filter(z => {return z.id === parseInt(m5.content)}).name + "' WHERE platform='discord' AND userid='" + message.author.id + "'").then((infoData) => {
                                                                            Logger.sendLog("-> Supported Language updated for " + message.author.id + " with tag " + message.author.tag, "INFO", __filename);
                                                                            return resolve({response: "Your language has been updated.", silent: false});
                                                                        }).catch(errData => {
                                                                            Logger.sendLog("-> Error when trying to add data.  Error Data: " + errData.message, "CRITICAL", __filename);
                                                                            return resolve({response: "We were unable to update the data due to an error.  " + errData.message, silent: false});
                                                                        });
                                                                    } else {
                                                                        Database.callStatement("INSERT INTO usersettings (platform, userid, language, languageId) VALUES ('discord', '" + message.author.id + "', '" + info.filter(z => {return z.id === parseInt(m5.content)}).name + "', '" + parseInt(m5.content) + "')").then((infoData2) => {
                                                                            Logger.sendLog("-> Supported Language updated for " + message.author.id + " with tag " + message.author.tag, "INFO", __filename);
                                                                            return resolve({response: "Your language has been updated.", silent: false});
                                                                        }).catch(errData2 => {
                                                                            Logger.sendLog("-> Error when trying to add data.  Error Data: " + errData2.message, "CRITICAL", __filename);
                                                                            return resolve({response: "We were unable to update the data due to an error.  " + errData2.message, silent: false});
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                        });
                                                        collector.on("end", (collected, reason) => {
                                                            if(reason === "time") {
                                                                return resolve({response: "No response was given.  Language chosen cancelled.", silent: false});
                                                            }
                                                        });
                                                        //globe
                                                        //https://i.imgur.com/ooyTfe1.png?width=80&height=80
                                                    });
                                                }
                                            }
                                        } else {
                                            BotSettings.assist.error("No valid language available at the moment", message.channel);
                                            return resolve({response: "", silent: true});
                                        }
                                    } else {
                                        BotSettings.assist.error("No valid language available at the moment", message.channel);
                                        return resolve({response: "", silent: true});
                                    }
                                });
                            } else {
                                Logger.sendLog("-> User info doesn't exist....", "INFO", __filename);
                            }
                        })
                    } else if(secondOpts[2].includes(choice2.toLowerCase())) {
                        //private account
                        Database.callStatement("SELECT * FROM usersettings WHERE platform='discord' AND userid='" + message.author.id + "' LIMIT 1").then((rows) => {
                            let dataChoice = "", validChoice = false;
                            if(args.length === 1) {
                                dataChoice = args.shift();
                                if(BotSettings.resolve.Bool(dataChoice) === true) {
                                    validChoice = true;
                                }
                            } else {
                                BotSettings.assist.error("You have too many arguments for this variable.", message.channel);
                                return resolve({response: "", silent: true});
                            }
                            let tmpVal = (validChoice === true) ? 1 : 0;
                            if(rows.length === 1) {
                                Database.callStatement("UPDATE usersettings SET privateAcc='" + tmpVal + "' WHERE platform='discord' AND userid='" + message.author.id + "'").then(dataEnter => {
                                    Logger.sendLog("-> Private info has changed.", "INFO", __filename);
                                    return resolve({response: "Your private account settings have been changed.", silent: false});
                                }).catch(dataError => {
                                    Logger.sendLog("-> There was an error for some reason.  " + dataError.message, "CRITICAL", __filename);
                                    return resolve({response: "There was an error for some reason.  We apologize.  "  + dataError.message, silent: false});
                                });
                            } else {
                                //no account, create account
                                Database.callStatement("INSERT INTO usersettings (platform, userid, privateAcc) VALUES ('discord', '" + message.author.id + "', '" + tmpVal + "')").then(data2 => {
                                    Logger.sendLog("-> Private info has changed.", "INFO", __filename);
                                    return resolve({response: "Your private account settings have been changed.", silent: false});
                                }).catch(err2 => {
                                    Logger.sendLog("-> There was an error for some reason.  " + err2.message, "CRITICAL", __filename);
                                    return resolve({response: "There was an error for some reason.  We apologize.  " + err2.message, silent: false});
                                });
                            }
                        }).catch(errRow2 => {
                            Logger.sendLog("-> An error occurred. " + errRow2.message, "CRITICAL", __filename);
                            return resolve({response: "There was an error with retrieving data.  " + errRow2.message, silent: false});
                        });

                    } else if(secondOpts[3].includes(choice2.toLowerCase()) || secondOpts[4].includes(choice2.toLowerCase())) {
                        Database.callStatement("SELECT * FROM usersettings WHERE platform='discord' AND userid='" + message.author.id + "' LIMIT 1").then((rows) => {
                            let dataChoice = "", validChoice = false;
                            if(args.length === 1) {
                                dataChoice = args.shift();
                                if(dataChoice.length >= 1) {
                                    validChoice = true;
                                }
                            } else {
                                BotSettings.assist.error("You have too many arguments for this variable.", message.channel);
                                return resolve({response: "", silent: true});
                            }
                            if(validChoice === false) {
                                BotSettings.assist.error("You must provide one argument.", message.channel, message.author);
                                return resolve({response: "", silent: true});
                            }
                            let tmpVal = dataChoice;
                            if(rows.length === 1) {
                                let oldPrefix = rows[0][choice2.toLowerCase()];
                                let newPrefix = dataChoice;
                                if(oldPrefix === newPrefix) {
                                    BotSettings.assist.error("Your old prefix is the same as the new one that you are requesting.  No change.", message.channel, message.author);
                                    return resolve({response: "", silent: true});
                                } else {
                                    Database.callStatement("UPDATE usersettings SET " + choice2.toLowerCase() + "='" + dataChoice + "' WHERE platform='discord' AND userid='" + message.author.id + "'").then(contentData => {
                                        Logger.sendLog("-> Private info has changed.", "INFO", __filename);
                                        return resolve({response: "Your personal " + choice2.toLowerCase() + " settings have been changed from `" + oldPrefix + "` to `" + newPrefix + "`.", silent: false});
                                    }).catch(dataError => {
                                        Logger.sendLog("-> There was an error for some reason.  " + dataError.message, "CRITICAL", __filename);
                                        return resolve({response: "There was an error for some reason.  We apologize.  "  + dataError.message, silent: false});
                                    });
                                }
                            } else {
                                //no account, create account
                                Database.callStatement("INSERT INTO usersettings (platform, userid, " + choice2.toLowerCase() + ") VALUES ('discord', '" + message.author.id + "', '" + tmpVal + "')").then(data2 => {
                                    Logger.sendLog("-> Private info has changed.", "INFO", __filename);
                                    return resolve({response: "Your personal " + choice2.toLowerCase() + " settings have been changed.", silent: false});
                                }).catch(err2 => {
                                    Logger.sendLog("-> There was an error for some reason.  " + err2.message, "CRITICAL", __filename);
                                    return resolve({response: "There was an error for some reason.  We apologize.  " + err2.message, silent: false});
                                });
                            }
                        }).catch(errRow2 => {
                            Logger.sendLog("-> An error occurred. " + errRow2.message, "CRITICAL", __filename);
                            return resolve({response: "There was an error with retrieving data.  " + errRow2.message, silent: false});
                        });
                    } else if(secondOpts[5].includes(choice2.toLowerCase())) {
                        //description
                        Database.callStatement("SELECT * FROM usersettings WHERE platform='discord' AND userid='" + message.author.id + "' LIMIT 1").then(rows => {
                            let dataChoice = "", validChoice = false;
                            if(args.length === 0) {
                                dataChoice = "No description set";
                                validChoice = true;
                            } else if(args.length <= parseInt(usage.args.max)) {
                                dataChoice = args.join(" ");
                                validChoice = true;
                            } else {
                                BotSettings.assist.error("Not enough arguments.  You must include a description of yourself.", message.channel, message.author);
                                return resolve({response: "", silent: true});
                            }
                            if(validChoice === false) {
                                BotSettings.assist.error("You must provide at **least** one argument.", message.channel, message.author);
                                return resolve({response: "", silent: true});
                            }
                            let dataLength = dataChoice.length;
                            dataChoice = BotSettings.assist.escapeStr(dataChoice); //escaping properly
                            let maxLen = 1500;
                            if(dataLength <= maxLen) {
                                if(rows.length === 1) {
                                    //found profile
                                    let row = rows.shift();
                                    if(row.description === dataChoice) {
                                        BotSettings.assist.error("The description is the same thing, no change made.", message.channel, message.author);
                                        return resolve({response: "", silent: true});
                                    } else {
                                        Database.callStatement("UPDATE usersettings SET description=" + dataChoice + " WHERE platform='discord' AND userid='" + message.author.id + "'").then(rowAdd => {
                                            Logger.sendLog("-> Update successful for user description.", "INFO", __filename);
                                            return resolve({response: message.author + ", profile description was updated.", silent: false});
                                        }).catch(dataError => {
                                            Logger.sendLog("-> There was an error for some reason.  " + dataError.message, "CRITICAL", __filename);
                                            return resolve({response: "There was an error for some reason.  We apologize.  "  + dataError.message, silent: false});
                                        });
                                    }
                                } else {
                                    //create profile
                                    Database.callStatement("INSERT INTO usersettings (platform, userid, description) VALUES ('discord', '" + message.author.id + "'," + dataChoice + ")").then(rowAdd => {
                                        Logger.sendLog("-> Update successful for user description.", "INFO", __filename);
                                        return resolve({response: message.author + ", profile description was updated.", silent: false});
                                    }).catch(dataError => {
                                        Logger.sendLog("-> There was an error for some reason.  " + dataError.message, "CRITICAL", __filename);
                                        return resolve({response: "There was an error for some reason.  We apologize.  "  + dataError.message, silent: false});
                                    });
                                }
                            } else {
                                BotSettings.assist.error("The length of the description that you are wanting to have must be less than " + maxLen + " characters.  Please shorten your description by " + parseInt(maxLen - dataLength) + " characters.", message.channel, message.author);
                                return resolve({response: "", silent: true});
                            }
                        }).catch(errRow2 => {
                            Logger.sendLog("-> An error occurred. " + errRow2.message, "CRITICAL", __filename);
                            return resolve({response: "There was an error with retrieving data.  " + errRow2.message, silent: false});
                        });
                    } else if(secondOpts[6].includes(choice2.toLowerCase())) {
                        console.log(choice2.toLowerCase());
                        Database.callStatement("SELECT * FROM usersettings WHERE platform='discord' AND userid='" + message.author.id + "' LIMIT 1").then(rows => {
                            let dataChoice = "";
                            if(args.length === 1) {
                                dataChoice = args.shift();
                            } else {
                                BotSettings.assist.error("You must include your makerkey token.", message.channel, message.author);
                                return resolve({response: "", silent: true});
                            }
                            if(rows.length === 1) {
                                let row = rows.shift();
                                if(row.makerkey === dataChoice) {
                                    BotSettings.assist.error("The maker key was the same as before.  No change necessary", message.channel, message.author);
                                    return resolve({response: "", silent: true});
                                } else {
                                    Database.callStatement("UPDATE usersettings SET makerkey='" + dataChoice + "' WHERE platform='discord' AND userid='" + message.author.id + "'").then(rowAdd => {
                                        Logger.sendLog("-> Update successful for user makerkey.", "INFO", __filename);
                                        return resolve({response: message.author + ", profile description was updated.", silent: false});
                                    }).catch(dataError => {
                                        Logger.sendLog("-> There was an error for some reason.  " + dataError.message, "CRITICAL", __filename);
                                        return resolve({response: "There was an error for some reason.  We apologize.  "  + dataError.message, silent: false});
                                    });
                                }
                            } else {
                                //create profile
                                Database.callStatement("INSERT INTO usersettings (platform, userid, makerkey) VALUES ('discord', '" + message.author.id + "', '" + dataChoice + "')").then(rowAdd => {
                                    Logger.sendLog("-> Update successful for user makerkey.", "INFO", __filename);
                                    return resolve({response: message.author + ", profile description was updated.", silent: false});
                                }).catch(dataError => {
                                    Logger.sendLog("-> There was an error for some reason.  " + dataError.message, "CRITICAL", __filename);
                                    return resolve({response: "There was an error for some reason.  We apologize.  "  + dataError.message, silent: false});
                                });
                            }
                        }).catch(errRow2 => {
                            Logger.sendLog("-> An error occurred. " + errRow2.message, "CRITICAL", __filename);
                            return resolve({response: "There was an error with retrieving data.  " + errRow2.message, silent: false});
                        })
                    } else {
                        BotSettings.assist.error("Unable to determine what choice you were trying to make.\nAvailable options are: " + secondOpts.map(x => {return x.join(", ")}).join(" "), message.channel);
                        return resolve({response: "", silent: true});
                    }
                } else if(choice.toLowerCase() === "get") {

                }
            } else {
                BotSettings.assist.error("Unable to determine what choice you were making.\nAvailable options are: " + availOpts.join(", "), message.channel);
                return resolve({response: "", silent: true});
            }
        }).catch(e => {
            Logger.sendLog("-> Error when deleting message because...." + e.message, "CRITICAL", __filename);
            BotSettings.assist.error("We were unable to delete the message for some reason.  " + e.message, message.channel);
            return resolve({response: "", silent: true});
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: setUser}
];
