const moduleInfo = {
    name: "mysettings",
    truename: "mysettings",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "mysettings",
    cmdName: "mysettings",
    aliases: ["myprofile", "mysettings", "myself", "mysetting"],
    args: {min: 0, max: 1},
    description: "This returns the profile settings or the profile it wants.",
    usage: "[command:str]",
    exampleUsage: "myprofile",
    runIn: ["dm", "text"],
    categories: "User Settings",
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

myprofileCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let user = "";
        if(message.mentions.members !== null && message.mentions.members.size === 2) {
            //itself and another tag.....
            let enteredLoop = false;
            message.mentions.members.forEach((member) => {
                if(BotSettings.assist.isSelfBot(member, shardId) === false && enteredLoop === false) {
                    user = member;
                    enteredLoop = true;
                }
            });
        } else {
            if(message.mentions.members !== null && message.mentions.members.size === 1) {
                user = message.mentions.members.first();
                if(BotSettings.assist.isSelfBot(user, shardId) === true) {
                    user = message.member;
                }
            }
        }
        if(args.length === 1) {
            let userArg = args.shift();
            let userResp = BotSettings.resolve.User(userArg, message, "User", shardId);
            if(userResp === false) {
                user = "";
            } else {
                user = userResp;
            }
        }
        if(!user || user === "") {
            user = message.author;
        }
        Database.callStatement("SELECT a.platform, a.userid, DATE_FORMAT(a.birthday, '%m/%d/%Y') as birthday, b.name as language, a.privateAcc, a.prefix, a.prefixgame, a.description, a.premium, DATE_FORMAT(a.createdAt, '%m/%d/%Y %H:%i:%s') as createdAt, DATE_FORMAT(a.updatedAt, '%m/%d/%Y %H:%i:%s') as updatedAt FROM usersettings a, languages b WHERE a.platform='discord' AND a.userid='" + user.id + "' AND b.id = a.language LIMIT 1").then(rows => {
            if(rows.length === 1) {
                //found a profile
                let userData = rows[0];
                if(parseInt(userData.privateAcc) === 1) {
                    BotSettings.assist.error("We were unable to pull the account up because the account is set to **private**.", message.channel, message.author);
                    return resolve({response: "", silent: true});
                }
                let privateAccount = (parseInt(userData.privateAcc) === 1) ? "Yes" : "No";
                let embed = new Discord.MessageEmbed();
                embed.setThumbnail(user.displayAvatarURL);
                let languageName = "English"; //default
                let embedOrder = [];
                let S = require("string"), moment = require("moment");
                Object.keys(userData).forEach((columnStuff, index) => {
                    if(columnStuff.toLowerCase() === "description") {
                        embed.setDescription(userData[columnStuff]);
                    } else if(columnStuff.toLowerCase() === "language" || columnStuff.toLowerCase() === "name") {
                        languageName = userData[columnStuff];
                        embedOrder.push({title: "Language", value: userData[columnStuff], inline: true, order: 1});
                    } else if(columnStuff.endsWith("At")) {
                        let atSplit = columnStuff.split(/(?=[A-Z])/g);
                        atSplit[0] = S(atSplit[0]).capitalize().s;
                        atSplit[1] = "profile";
                        embedOrder.push({title: atSplit.join(" "), value: moment(userData[columnStuff], "MM/DD/YYYY hh:mm:ss").format("MM/DD/YYYY hh:mm:ss a"), inline: true, order: 3});
                    } else if(columnStuff.toLowerCase() !== "privateacc" && columnStuff.toLowerCase() !== "description") {
                        let getOrder = embedOrder.length - 1;
                        getOrder += 1;
                        if(columnStuff.toLowerCase().endsWith("game")) {
                            let gSplit = columnStuff.replace("g", "G").split(/(?=[A-Z])/g);
                            gSplit = gSplit.reverse();
                            gSplit[0] = S(gSplit[0]).capitalize().s;
                            embedOrder.push({title: gSplit.join(" "), value: userData[columnStuff], inline: true, order: getOrder});
                        } else {
                            embedOrder.push({title: S(columnStuff).capitalize().s, value: S(userData[columnStuff]).capitalize().s, inline: true, order: getOrder});
                        }
                    }
                });
                embed.setTitle(S(userData.platform).capitalize().s + " User Profile for " + user.tag + " | " + userData.userid);

                let orderEmbed = embedOrder.sort((a, b) => {
                    if(a.order > b.order) return 1;
                    if(b.order > a.order) return -1;
                    return 0;
                });
                orderEmbed.forEach((embedContent) => {
                    embed.addField(embedContent.title, embedContent.value, embedContent.inline);
                });
                return resolve({response: message.author, embed: embed, silent: false});

            } else {
                BotSettings.assist.error("The user's profile was not set up yet.", message.channel, message.author);
                return resolve({response: "", silent: true});
            }
        }).catch(errData => {
            Logger.sendLog("There was an error with getting the data.... " + errData.message, "CRITICAL", __filename);
            BotSettings.assist.error("There was an error retrieving the information.  Please try again shortly.", message.channel, message.author);
            return resolve({response: "", silent: true});
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: myprofileCmd}
];
