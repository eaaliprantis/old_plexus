const moduleInfo = {
    name: "userinfo",
    truename: "userinfo",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "userinfo",
    cmdName: "userinfo",
    aliases: ["userinfo", "uinfo", "user"],
    args: {min: 0, max: 1},
    description: "Displays information about the discord server",
    exampleUsage: "userinfo @eaaliprantis#2160\nuserinfo",
    usage: "[command]",
    runIn: ["text"],
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

getTimezone2 = (user) => {
    return new Promise((resolve, reject) => {
        Database.callStatement("SELECT * FROM TimezoneT WHERE platform='discord' AND userid='" + user + "'").then((rows) => {
            if(rows.length === 1) {
                rows.forEach(row => {
                    return resolve({response: row, error: false, valid: true});
                });
            } else {
                return resolve({response: "User not set", error: false, valid: false});
            }
        }).catch(err => {
            return resolve({response: err.message, error: true, valid: false});
        });
    });
}

userStats = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let moment = require("moment");
        let embed = new Discord.MessageEmbed();
        let user = "";
        if(message.mentions.members.size === 2) {
            //itself and another tag.....
            let enteredLoop = false;
            message.mentions.members.forEach((member) => {
                if(BotSettings.assist.isSelfBot(member, shardId) === false && enteredLoop === false) {
                    user = member;
                    enteredLoop = true;
                }
            });
        } else {
            if(message.mentions.members.size === 1) {
                user = message.mentions.members.first();
                if(BotSettings.assist.isSelfBot(user, shardId) === true) {
                    user = message.member;
                }
            }
        }
        if(!user || user === "") {
            user = message.member;
        }
        let roles = user.roles;
        /*
        let roles = user.roles.array().join(' ');
        if(roles.length > 500) {
            roles = roles.substr(0, 500) + "...";
        }
        */
        let roleNames = [], roleCount = 0;
        roles.forEach((role) => {
            if(roleCount >= 0 && roleCount <= 50) {
                roleNames.push(role.name);
            }
            roleCount++;
        });
        getTimezone2(user.user.id).then((response) => {
            let mytimezone = "";
            let timeOffset = "";
            if(response.valid === true) {
                let timeResp = response.response.orgTime;
                timeOffset = BotSettings.assist.convertTimeZone(timeResp);
                let currentTime = BotSettings.assist.getRegion(message.guild.region, "format");
                mytimezone = moment.utc(currentTime).add(timeOffset, "minutes").format("MMMM Do YYYY, h:mm:ss a");
            } else {
                mytimezone = "**User timezone not set**";
            }

            let currentDate = moment();
            let createdDate = moment(user.user.createdAt);
            let joinedDate = moment(user.joinedAt);

            let createdDateDiff = currentDate.diff(createdDate, "days");
            let joinedDateDiff = currentDate.diff(joinedDate, "days");

            embed.setColor('RANDOM');
            embed.setTitle(`User information for ${user.user.tag}`);
            embed.setDescription(`Name: ${user.user.username} - Status: ${user.presence.status.toCapFirstLetter()}`)
            embed.setThumbnail(user.user.avatarURL);
            console.log(user.user.createdAt);
            embed.addField("Creation Date", (timeOffset !== "") ? "• " + moment.utc(user.user.createdAt).add(timeOffset, "minutes").format('MM/DD/YYYY, HH:mm:ss a') + "\n• (" + createdDateDiff + " days ago)" :
            "• " + moment.utc(user.user.createdAt).format('MM/DD/YYYY, HH:mm:ss a') + "\n• (" + createdDateDiff + " days ago)", true);
            embed.addField("Joined on", (timeOffset !== "") ? "• " + moment.utc(user.joinedAt).add(timeOffset, "minutes").format('MM/DD/YYYY, HH:mm:ss a') + "\n• (" + joinedDateDiff + " days ago)" :
            "• " + moment.utc(user.joinedAt).format('MM/DD/YYYY, HH:mm:ss a')  + "\n• (" + joinedDateDiff + " days ago)" , true);
            embed.addField("Id", user.id)
            embed.addField("Playing", (user.user.presence.game !== null) ? user.user.presence.game.name : "None", true);
            embed.addField("Roles", roleNames, true);
            embed.addField('Miscellaneous', `• Server Region: ${message.guild.region}\n• Region Timezone: ${BotSettings.assist.getRegion(message.guild.region, "default")}\n• ${user.user.tag}'s timezone: ${mytimezone}\n\u200b`);
            return resolve({response: "", embed: embed, silent: false});
        }).catch(err => {
            console.log(err.response);
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: userStats}
];
