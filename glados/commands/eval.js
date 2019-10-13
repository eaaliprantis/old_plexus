    module.exports = {
    get_eval: function (msg, bot, cmdexec) {
        var args = msg.content.split(' ').slice(1);

        function clean(text) {
            if (typeof(text) === 'string') {
            return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
            } else {

            }
            return text;
        }

        if(msg.author.id !== '174511937151827969' || msg.author.id !== "121928183531569153") {
            bot.createMessage("This command can only be used by developers.")
            return;
        }
        try {
            var code = args.join(' ');
            var evaled = eval(code);

            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled);
            }
            console.log(evaled);
            bot.createMessage(msg.channel.id, evaled);
        } catch (err) {
            bot.createMessage(msg.channel.id, `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
    }
};
