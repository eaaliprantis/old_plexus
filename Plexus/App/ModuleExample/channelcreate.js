if(message.content.toLowerCase().startsWith('!channel') && message.member.roles.find('name', 'Donator') != null){
           var channelName = 'Private lobby: ' + message.author.username;
           if (!message.member.voiceChannel) {
               return message.reply('Please be in a voice channel first!');
           }
           var channelCheck = message.member.guild.channels.find('name', channelName);
           if(channelCheck !== null){
               return message.reply("You cannot have more than one currently active private channel.")
           }
           message.guild.createChannel(channelName, 'voice')
            .then(channel => {
               message.member.setVoiceChannel(channel)
               var ownerPerms = {'CONNECT':true}
               var everyonePerms = {'CONNECT':false}
               channel.overwritePermissions(message.author, ownerPerms)
               channel.overwritePermissions(message.guild.id, everyonePerms)
               message.reply("Channel created")
           })
            .catch(console.error);
       }
       else if(message.content.toLowerCase().startsWith('!channel') && message.member.roles.find('name', 'Donator') == null){
           return message.reply('Sorry, you need to have donated at least $10 for the Donator role. Please type !donate for more information.')
       }

if(message.content.toLowerCase().startsWith('!add') && message.member.roles.find('name', 'Donator') != null) {
    var channelName = 'Private lobby: ' + message.author.username;
    var channel = message.member.guild.channels.find('name', channelName);
    if(channel == null){
        return message.reply("You do not have a currently active private channel")
    }

    var result = message.content.split(" ");
    if(result.length != 2){
        return message.reply("Invalid format.")
    }

    var name = message.mentions.users.first();
    if(name == null){
        return message.reply("Invalid format.")
    }
    var joinPerms = {'CONNECT':true}
    channel.overwritePermissions(name, joinPerms)
    return message.reply("Permissions granted")
}

if(message.content.toLowerCase().startsWith('!remove') && message.member.roles.find('name', 'Donator') != null){
    var channelName = 'Private lobby: ' + message.author.username;
    var channel = message.member.guild.channels.find('name', channelName);
    if(channel == null){
       return message.reply("You do not have a currently active private channel")
    }

    var result = message.content.split(" ");
    if(result.length != 2){
       return message.reply("Invalid format.")
    }

    var name = message.mentions.users.first()
    if(name == null){
       return message.reply("Invalid format.")
    }
    name = message.guild.members.find('user', message.mentions.users.first());
    var joinPerms = {'CONNECT':false}
    channel.overwritePermissions(name, joinPerms)
    if(channel.members.find('user',message.mentions.users.first()) !== null){
       name.setVoiceChannel(message.member.guild.channels.find('name', 'Main Lobby'))
    }
    return message.reply("Permissions removed.")
}
