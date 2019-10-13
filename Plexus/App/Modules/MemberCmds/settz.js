const moduleInfo = {
    name: "settz",
    truename: "settz",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "settz",
    cmdName: "settz",
    aliases: ["settz", "settimezone", "settime"],
    args: {min: 0, max: 1},
    description: "Set the user's timezone",
    exampleUsage: "settz -4:00",
    usage: "[command]",
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

validateTimeZone = (time, message) => {
    let timeReq = time;
    let firstCharApp = ["+", "-"];
    let validRangeStart = -12, validateRangeEnd = 14;
    let validRange_inc = 1; //1 hour
    let validRangeOdd = [   "-9:30", "-09:30", "-3:30", "-03:30", "+0:00", "+00:00",
                            "+3:30", "+03:30", "+4:30", "+04:30", "+5:30", "+05:30",
                            "+5:45", "+05:45", "+6:30", "+06:30", "+8:30", "+08:30",
                            "+9:30", "+09:30", "+10:30", "+12:45"];
    let timeParsedInfo = {};
    if(timeReq.length >= 1 && BotSettings.assist.validateCorrectTimeZone(time) === true) {
        if(firstCharApp.includes(timeReq.charAt(0)) && timeReq.includes(":") && BotSettings.assist.matchStr(timeReq, ":") === 1) {
            timeParsedInfo["sign"] = timeReq.charAt(0);
            if(validRangeOdd.includes(timeReq)) {
                //in the valid odd range
                timeReq = timeReq.slice(1);
                timeParsedInfo["time"] = timeReq;
                timeParsedInfo["orgTime"] = timeParsedInfo["sign"] + timeReq;
                return [true, timeParsedInfo];
            } else {
                //not in the valid odd range - - checking regular range
                timeReq = timeReq.slice(1);
                let colonSplit = timeReq.split(":");
                let leftSide = colonSplit[0];
                let rightSide = colonSplit[1];
                if(rightSide.length === 2 && rightSide === "00") {
                    //valid
                    let leftSideVal = parseInt(leftSide);
                    let leftSideFound = false;
                    for(let i = validRangeStart; i <= validateRangeEnd; i++) {
                        if(leftSideVal === i && leftSideFound === false) {
                            leftSideFound = true;
                            break;
                        }
                    }
                    if(leftSideFound === true) {
                        //valid
                        timeParsedInfo["time"] = timeReq;
                        timeParsedInfo["orgTime"] = timeParsedInfo["sign"] + timeReq;
                        return [true, timeParsedInfo];
                    } else {
                        BotSettings.assist.error("Incorrect format for timezone.  Example: -4:00 or -04:00", message.channel);
                        return [false, null];
                    }
                } else {
                    BotSettings.assist.error("Incorrect format for timezone.  Example: -4:00 or -04:00", message.channel);
                    return [false, null];
                }
            }
        } else {
            BotSettings.assist.error("Incorrect format for timezone.  Example: -4:00 or -04:00", message.channel);
            return [false, null];
        }
    } else {
        if(BotSettings.assist.validateCorrectTimeZone(time) === false) {
            BotSettings.assist.error("Incorrect format for timezone.  Example: -4:00 or -04:00", message.channel);
            return [false, null];
        }
    }
    return [false, null];
}

setmytz = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        if(args.length === 1) {
            let timezoneRQ = args.shift();
            let timezoneResp = validateTimeZone(timezoneRQ, message);
            if( timezoneResp[0] === true) {
                let userInfo = message.author.id;

                Database.callStatement("SELECT * FROM TimezoneT WHERE platform='discord' AND userid='" + userInfo + "'").then((rows) => {
                    if(rows.length === 1) {
                        rows.forEach(row => {
                            let info = row;
                            if(info.time !== timezoneResp[1]["time"]) {
                                //difference, update
                                Database.callStatement("UPDATE TimezoneT SET sign='" + timezoneResp[1]['sign'] + "', time='" + timezoneResp[1]['time'] + "', orgTime='" + timezoneResp[1]['orgTime']+ "' WHERE userid='" + userInfo + "'");
                                return resolve({response: "We have updated your timezone from **" + info.orgTime + "** to **" + timezoneResp[1]['orgTime'] + "**.", silent: false});
                            } else {
                                if(info.sign !== timezoneResp[1]['sign']) {
                                    //difference, update
                                    Database.callStatement("UPDATE TimezoneT SET sign='" + timezoneResp[1]['sign'] + "', time='" + timezoneResp[1]['time'] + "', orgTime='" + timezoneResp[1]['orgTime']+ "' WHERE userid='" + userInfo + "'");
                                    return resolve({response: "We have updated your timezone from **" + info.orgTime + "** to **" + timezoneResp[1]['orgTime'] + "**.", silent: false});
                                } else {
                                    //same, don't bother
                                    BotSettings.assist.error("You have entered the same timezone that has already been stored.  Ignoring request to change.", message.channel);
                                    return resolve({response: "", embed: "", silent: true});
                                }
                            }
                        });
                    } else {
                        //user not in here, add them
                        Database.callStatement("INSERT INTO TimezoneT (platform, userid, sign, time, orgTime) VALUES ('discord', '" + userInfo + "', '" + timezoneResp[1]['sign'] + "', '" + timezoneResp[1]['time'] + "', '" + timezoneResp[1]['orgTime'] + "')")
                        return resolve({response: "Added your timezone to our database.  Thank you", silent: false});
                    }
                }).catch(err => {
                    console.log(err.message);
                    BotSettings.assist.error("There was an error when retrieving some information..... " + err.message, message.channel);
                    return resolve({response: "", silent: true});
                });
            } else {
                //invalid, return resolve, but silent
                return resolve({response: "", embed: "", silent: true});
            }
        } else {
            BotSettings.assist.error("Please input a timezone.  Example: -4:00 or -04:00", message.channel);
            return resolve({response: "", embed: "", silent: true});
        }
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: setmytz}
];
