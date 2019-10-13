'use strict';
let Eris = require("eris");
var CronJob = require('cron').CronJob;
var fs = require('fs');
var config = require("./settings.json");
var bot = "";
if(config.active === false) {
    bot = new Eris(config.test);
} else {
    bot = new Eris(config.live);
}
var cmdexec = config.prefix;

//command executor file import//
var cmdexecutor = require('./commandexecutor.js');

bot.on("messageCreate", (msg) => {
  cmdexecutor.onmsg(msg, bot, cmdexec);
});

///////////bot automatic functinos

bot.on("ready", () => {
    console.log("Ready!");
    bot.editStatus("online", {name: "Type " + cmdexec + "help for info"});
});

function totalCities(obj) {
    let number = 0;
    Object.keys(obj["list"]).forEach((key) => {
        number += parseInt(obj["list"][key].cityCount);
    });
    return number;
}
function totalProvinces(obj) {
    return parseInt(obj.size);
}

//start gold timer

var schedule = require('node-schedule');
let sPath = "./logchannels/gamedata.json";
let json = require(sPath)
let json2 = json;
var j = schedule.scheduleJob('*/5 * * * *', function() {
    Object.keys(json2).forEach(key => {
        var mm = (parseInt(totalCities(json2[key]['stats']['provinces'])) * .10) + 1;
        let value = parseInt(json2[key]['stats']['gold']) + 50 * parseInt(totalProvinces(json2[key]['stats']['provinces'])) * mm;
        json2[key]['stats']['gold'] = value;   //run gold through equation here
    });
    fs.writeFile(sPath, JSON.stringify(json2), (err) => {
        if (err) {
            console.log(err.message);
            return;
        }
    });
    delete require.cache[json];
});

bot.connect();
