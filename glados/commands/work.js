'use strict';
let fs = require('fs');
var jsonFile = require('jsonfile')
var data = 'gamedata.json'

function getTotalWorkers(obj) {
    let number = 0;

    Object.keys(obj["list"]).forEach((key) => {
        Object.keys(obj['list'][key]['cities']).forEach((city) => {
            number += parseInt(obj['list'][key]['cities'][city].workers);
        });
    });
    return number;
}

function getTotalCities(obj) {
    let number = 0;

    Object.keys(obj["list"]).forEach((key) => {
        number += parseInt(obj['list'][key].cityCount);
    });
    return number;
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = {
    get_work: function (msg, bot, cmdexec) {
        let args = msg.content.split(" ").slice(1);
        if(args.length == 0) {
            let path = "../logchannels/gamedata.json";
            let sPath = "./logchannels/gamedata.json";
            let commands = require(path);
            let user = msg.author.id;
            let user2 = user.replace("<@", "");
            let user3 = user2.replace(">", "");
            user3 = user3.replace("!", "");
            if(!commands[user3]) {
                bot.createMessage(msg.channel.id, "User does not exist in database!");
                return
            } else {
                let workersused = parseInt(randomIntFromInterval(10, getTotalWorkers(commands[user3]['stats']['provinces'])));
                let newgold = Math.round((workersused / 4) + Math.floor(Math.random() * 25) + 1);
                commands[user3]['stats']["resources"] += newgold
                bot.createMessage(msg.channel.id, "Your `"+ workersused+"` workers produced `"+ newgold+ "` resources in your `" + getTotalCities(commands[user3]['stats']['provinces']) + "` cities!")
            }
            fs.writeFile(sPath, JSON.stringify(commands), (err) => {
                if (err) {
                    console.log(err.message);
                    return;
                }
            });
            delete require.cache[commands];
        } else {
            bot.createMessage(msg.channel.id, "Usage: " + cmdexec + "work");
        }
    }
};
