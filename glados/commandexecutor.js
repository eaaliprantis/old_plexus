'use strict';
const Eris = require("eris");
var fs = require('fs');
//commandfile import
var help_file = require('./commands/help.js');
var id_file = require('./commands/id.js');
var invite_file = require('./commands/invite.js');
var stats_file = require('./commands/stats.js');
var dab_file = require('./commands/megadab.js');
var love_file = require('./commands/love.js');
var coinflip_file = require('./commands/coinflip.js');
var eightball_file = require('./commands/eightball.js');
var rr_file = require('./commands/rr.js');
var leet_file = require('./commands/leet.js');
var slap_file = require('./commands/slap.js');
var joingame_file = require('./commands/joingame.js');
var uinfo_file = require('./commands/uinfo.js');
var buycity_file = require('./commands/buycity.js');
var buyprov_file = require('./commands/buyprov.js');
var setname_file = require('./commands/setname.js');
var setbio_file = require('./commands/setbio.js');
var eval_file = require('./commands/eval.js');
var work_file = require('./commands/work.js');
var bal_file = require('./commands/bal.js');
var me_file = require('./commands/me.js');
var sellres_file = require('./commands/sellres.js');
var getres_file = require("./commands/getres.js");
var getprov = require("./commands/prov.js");
var getcity = require("./commands/city.js");
var getxp_file = require("./commands/myxp.js");

function genRandomXP() {
    var Random = require("random-js");
    var random = new Random(Random.engines.mt19937().autoSeed());
    return parseInt(random.integer(1, 5)) + parseInt(random.integer(1, 2.5));
}

function checkXPLevel(num, xp, addedXp) {
    let level = parseInt(num);
    let xpSource = require("./Utils/xpalgo.js");
    let currentLevelReq = xpSource.randomFlux(level);
    let nextLevelReq = getNextXPLevel(level);
    let currentXp = parseInt(xp);
    let addXp = parseInt(addedXp);
    if(parseInt(currentXp) + parseInt(addXp) >= parseInt(nextLevelReq)) {
        return true;
    }
    return false;
}

function getNextXPLevel(num) {
    let level = parseInt(num);
    let xpSource = require("./Utils/xpalgo.js");
    return xpSource.randomFlux(level + 1);
}

function assignRandomXP(bot, msg) {
    let randomXP = genRandomXP();
    let path = "./logchannels/gamedata.json";
    let commands = require(path);
    let user = extractUser(msg);

    if(!commands[user]) {
        return false;
    }
    let cmd = "xpgen";
    let response = cooldownAssist(cmd, user, 60, true);
    if(response[0] === true) {
        //valid
        delete require.cache[commands];
        return false;
    }
    let userLevel = parseInt(commands[user]['stats']['level']);
    let currentXP = parseInt(commands[user]['stats']['xp']);
    let notify = false;
    if(checkXPLevel(userLevel, currentXP, randomXP)) {
        commands[user]['stats']['level'] = userLevel + 1;
        notify = true;
    }
    commands[user]['stats']['xp'] += parseInt(randomXP);
    fs.writeFile(path, JSON.stringify(commands), (err) => {
        if (err) {
            console.log(err.message);
            return null;
        }
    });
    if(notify === true) {
        bot.createMessage(msg.channel.id, "Congrats, you have leveled up to " + (userLevel + 1) + "!");
    }
    delete require.cache[commands];
    return true;
}

function extractUser(msg) {
    let user = msg.author.id;
    let user2 = user.replace("<@", "");
    let user3 = user2.replace(">", "");
    user3 = user3.replace("!", "");
    return user3;
}

function convertSecToMilli(cusSecs) {
    return parseInt(cusSecs * 1000);
}

function cooldownAssist(cmd, userId, customSeconds, active=false) {
    //default seconds = 5
    if(checkBotId(userId) === false) {
        //not the bot - - user
        var moment = require("moment");
        var time = "seconds";
        var cooldownFile = "./logchannels/cooldown.json";
        var cooldownRequire = require(cooldownFile);
        var cooldown = cooldownRequire;
        var response = false;
        var timeLeft = "";
        if(active === false) {
            return [response, null]; //no cooldown trigger
        }
        if(!cooldown[userId]) {
            cooldown[userId] = {};
        }
        if(!cooldown[userId][cmd]) {
            cooldown[userId][cmd] = {}
        }
        if(!cooldown[userId][cmd]["date"]) {
            cooldown[userId][cmd]["date"] = moment();
        } else {
            var cooldownTime = cooldown[userId][cmd]["date"];
            var currentTime = moment();
            var duration = currentTime.diff(cooldownTime);
            if(duration >= convertSecToMilli(customSeconds)) { //because diff returns milliseconds - - 5k milliseconds = 5 seconds
                cooldown[userId][cmd]["date"] = currentTime;
            } else {
                response = true;
                timeLeft = Math.round((duration / 1000) % 60);
            }
        }
        fs.writeFile(cooldownFile, JSON.stringify(cooldown), (err) => {
            if (err) {
                console.log(err.message);
                return [false, null];
            }
        });
        delete require.cache[cooldown];
        return [response, timeLeft];
    } else {
        return [null, null];
    }
}

let second = 5;

function checkBotId(id) {
    var config = require("./settings.json");
    if(id === config.test_id || id === config.live_id) {
        return true;
    }
    return false;
}

module.exports = {
    onmsg: function (msg, bot, cmdexec) {
        cmdexec = cmdexec.toLowerCase();
        if(msg.content.startsWith(cmdexec + "help")) {
            var cooldownResponse = cooldownAssist("help", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                help_file.get_help(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "id")) {
            var cooldownResponse = cooldownAssist("id", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                id_file.get_id(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "invite")) {
            var cooldownResponse = cooldownAssist("invite", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                invite_file.get_invite(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "info")) {
            var cooldownResponse = cooldownAssist("info", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                stats_file.get_stats(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "megadab")) {
            var cooldownResponse = cooldownAssist("megadab", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                dab_file.get_dab(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "love")) {
            var cooldownResponse = cooldownAssist("love", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                love_file.get_love(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "coinflip")) {
            var cooldownResponse = cooldownAssist("coinflip", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                coinflip_file.get_coinflip(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "8ball")) {
            var cooldownResponse = cooldownAssist("8ball", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                eightball_file.get_eightball(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "rr")) {
            var cooldownResponse = cooldownAssist("rr", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                rr_file.get_rr(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "leet")) {
            var cooldownResponse = cooldownAssist("leet", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                leet_file.get_leet(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "slap")) {
            var cooldownResponse = cooldownAssist("slap", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                slap_file.get_slap(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "eval")) {
            var cooldownResponse = cooldownAssist("eval", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                eval_file.get_eval(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "joingame")) {
            var cooldownResponse = cooldownAssist("joingame", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                assignRandomXP(bot, msg);
                joingame_file.get_joingame(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "uinfo")) {
            var cooldownResponse = cooldownAssist("uinfo", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                assignRandomXP(bot, msg);
                uinfo_file.get_uinfo(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "buycity")) {
            var cooldownResponse = cooldownAssist("buycity", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                assignRandomXP(bot, msg);
                buycity_file.get_buycity(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "buyprov")) {
            var cooldownResponse = cooldownAssist("buyprov", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                assignRandomXP(bot, msg);
                buyprov_file.get_buyprov(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "setname")) {
            var cooldownResponse = cooldownAssist("setname", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                assignRandomXP(bot, msg);
                setname_file.get_setname(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "setbio")) {
            var cooldownResponse = cooldownAssist("setbio", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                assignRandomXP(bot, msg);
                setbio_file.get_setbio(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "work")) {
            var cooldownResponse = cooldownAssist("work", msg.author.id, second, true);
            if(cooldownResponse[0] === false) {
                assignRandomXP(bot, msg);
                work_file.get_work(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "bal")) {
            var cooldownResponse = cooldownAssist("bal", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                assignRandomXP(bot, msg);
                bal_file.get_bal(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "me")) {
            var cooldownResponse = cooldownAssist("me", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                assignRandomXP(bot, msg);
                me_file.get_me(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "sellres")) {
            var cooldownResponse = cooldownAssist("sellres", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                assignRandomXP(bot, msg);
                sellres_file.get_sellres(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "getres")) {
            var cooldownResponse = cooldownAssist("getres", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                assignRandomXP(bot, msg);
                getres_file.get_res(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "myxp")) {
            var cooldownResponse = cooldownAssist("myxp", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                assignRandomXP(bot, msg);
                getxp_file.get_xp(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "prov")) {
            var cooldownResponse = cooldownAssist("prov", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                assignRandomXP(bot, msg);
                getprov.get_prov_info(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
        if(msg.content.startsWith(cmdexec + "city")) {
            var cooldownResponse = cooldownAssist("city", msg.author.id, second);
            if(cooldownResponse[0] === false) {
                assignRandomXP(bot, msg);
                getcity.get_city_info(msg, bot, cmdexec);
            } else if(cooldownResponse[0] === true) {
                bot.createMessage(msg.channel.id, "There is currently " + (second - cooldownResponse[1]) + " seconds remaining on the cooldown!");
            }
            return;
        }
    }
};
