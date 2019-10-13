'use strict';
var request = require('request');
var unirest = require('unirest');

module.exports = {
    get_love: function (msg, bot, cmdexec) {
        let args = msg.content.split(" ").slice(1);
        if(2 != args.length) {
            bot.createMessage(msg.channel.id, "Usage: "+cmdexec+"love name name2")
        }
        if(2 == args.length) {
            unirest.get("https://love-calculator.p.mashape.com/getPercentage?fname="+args[0]+"&sname="+args[1])
            .header("X-Mashape-Key", "f1KtDKhsfCmshixzgWMmDknLSAiXp18kr1ZjsnZQMk6cOVuRyF")
            .header("Accept", "application/json")
            .end(function (result) {
            bot.createMessage(msg.channel.id, result.body.percentage + "%" + " chance of love!");
            })
        }
    }
};
