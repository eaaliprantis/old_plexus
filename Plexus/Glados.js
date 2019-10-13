console.log("<== STARTING MODULAR BOT ==>");

// Loading Requirements
global.Discord = require("discord.js");
require("./Managers/Logger.js").setupLogger({
  loadAdditional: true,
  additionalColors: true
});
const settings = require("./settings.json");
const timezoneArr = require("./timezoneArr.json");
const compTZs = require("./timezones-dst.json");
const fs = require("fs");
const bot = new Discord.Client({ fetchAllMembers: true });
console.log("Setup √");
let token = "",
  live_token_id = "",
  inactive_token_id = "";

let tmpMoment = require("moment");
if (!tmpMoment().isDST()) {
  let tmpMomentTz = require("moment-timezone");
  Object.keys(compTZs).forEach(val => {
    compTZs[val] = tmpMomentTz
      .tz(tmpMoment().format("YYYY-MM-DD HH:MM"), val)
      .format("z");
  });
  let fs = require("fs");
  let sPath = "./timezones-non-dst.json";
  fs.writeFile(sPath, JSON.stringify(compTZs), err => {
    if (err) {
      console.log(err.message);
    }
  });
}

/*
http://tineye.com/search?url=https://cdn.discordapp.com/attachments/440255430833340427/459416519277936661/Va0khqS.jpg
https://github.com/austinhuang0131/metagon/blob/master/index.js
https://api.bunnies.io/v2/loop/random/?media=gif,mp4
*/

global.BotSettings = {
  config: settings,
  color: "",
  assist: {},
  gameTick: 0,
  roman: {},
  loginType: "",
  premium: {
    max: 10,
    min: 0
  },
  default: {
    prefix: "p!",
    prefixGame: "g!",
    shardCount: 1
  },
  moment: {
    timezone: compTZs,
    timezoneArr: timezoneArr
  },
  games: {},
  discordServers: {
    brazil: { location: "Sao Paulo", timezone: "America/Sao_Paulo" },
    "eu-central": { location: "Luxembourg", timezone: "Europe/Luxembourg" },
    hongkong: { location: "hongkong", timezone: "Asia/Hong_Kong" },
    russia: { location: "moscow", timezone: "Europe/Moscow" },
    singapore: { location: "Lion City", timezone: "Asia/Singapore" },
    sydney: { location: "australia", timezone: "Australia/Sydney" },
    "us-central": { location: "chicago", timezone: "America/Chicago" },
    "us-east": { location: "Buffalo, NY", timezone: "America/New_York" },
    "vip-us-east": { location: "Buffalo, NY", timezone: "America/New_York" },
    "us-south": { location: "Texas", timezone: "America/Chicago" },
    "us-west": { location: "California", timezone: "America/Los_Angeles" },
    "vip-us-west": { location: "California", timezone: "America/Los_Angeles" },
    "eu-west": { location: "London", timezone: "Europe/London" },
    "vip-amsteram": { location: "Amsterdam", timezone: "Europe/Amsterdam" },
    limits: {
      title: 256,
      description: 2000,
      field: {
        title: 256,
        value: 1024
      },
      footer: 2048,
      messages: 2000
    },
    ban: {
      duration: [0, 1, 2, 3, 4, 5, 6, 7],
      default: 1,
      maxsize: 512
    }
  },
  resolve: {},
  validate: {},
  discordRoles: {
    ADMINISTRATOR: "admin",
    CREATE_INSTANT_INVITE: "misc",
    KICK_MEMBERS: "mod",
    BAN_MEMBERS: "admin",
    MANAGE_CHANNELS: "admin",
    MANAGE_GUILD: "admin",
    ADD_REACTIONS: "misc",
    VIEW_AUDIT_LOG: "mod",
    READ_MESSAGES: "general",
    SEND_MESSAGES: "general",
    SEND_TTS_MESSAGES: "general",
    MANAGE_MESSAGES: "mod",
    EMBED_LINKS: "general",
    ATTACH_FILES: "general",
    READ_MESSAGE_HISTORY: "general",
    MENTION_EVERYONE: "admin",
    USE_EXTERNAL_EMOJIS: "misc",
    CONNECT: "general",
    SPEAK: "general",
    MUTE_MEMBERS: "mod",
    DEAFEN_MEMBERS: "mod",
    MOVE_MEMBERS: "admin",
    USE_VAD: "general",
    CHANGE_NICKNAME: "general",
    MANAGE_NICKNAMES: "mod",
    MANAGE_ROLES: "admin",
    MANAGE_WEBHOOKS: "admin",
    MANAGE_EMOJIS: "mod"
  },
  discordDefaultRoles: {
    ADMINISTRATOR: false,
    CREATE_INSTANT_INVITE: false,
    KICK_MEMBERS: false,
    BAN_MEMBERS: false,
    MANAGE_CHANNELS: false,
    MANAGE_GUILD: false,
    ADD_REACTIONS: false,
    VIEW_AUDIT_LOG: false,
    READ_MESSAGES: true,
    SEND_MESSAGES: true,
    SEND_TTS_MESSAGES: false,
    MANAGE_MESSAGES: false,
    EMBED_LINKS: false,
    ATTACH_FILES: false,
    READ_MESSAGE_HISTORY: true,
    MENTION_EVERYONE: false,
    USE_EXTERNAL_EMOJIS: false,
    CONNECT: false,
    SPEAK: false,
    MUTE_MEMBERS: false,
    DEAFEN_MEMBERS: false,
    MOVE_MEMBERS: false,
    USE_VAD: false,
    CHANGE_NICKNAME: false,
    MANAGE_NICKNAMES: false,
    MANAGE_ROLES: false,
    MANAGE_WEBHOOKS: false,
    MANAGE_EMOJIS: false
  },
  discordRoleCat: ["admin", "mod", "general", "misc"],
  discord: {},
  get: {}
};
//https://www.reddit.com/r/discordapp/comments/6bzm5r/server_locations/ - - source
console.log("Commands loaded √");
require("./Managers/Database.js").setupDatabase();

Logger.sendLog("=> Generated Global Objects [Database]", "GLOBAL", __filename);

let attempts = 0;
(function awaitDatabaseConnection() {
  attempts++;
  Logger.sendLog(
    "-> Waiting Database Connecton... [Try: " + attempts + "]",
    "TASK_AWAIT(Connect)",
    __filename
  );
  if (!Database.isConnected) {
    setTimeout(awaitConnection, 2000);
  } else {
    Logger.sendLog(
      "-> Database Connected!",
      "TASK_FINISH(Connect)",
      __filename
    );
    awaitCommands();
  }
})();

function awaitCommands() {
  require("./Managers/Encryption.js")
    .setupEncrypt()
    .then(() => {
      require("./Managers/Constants.js")
        .setupConstants()
        .then(() => {
          BotSettings.default.prefix = BotSettings.assist.getConstants(
            "discord_prefix"
          );
          BotSettings.default.prefixGame = BotSettings.assist.getConstants(
            "discord_prefixgame"
          );
          BotSettings.default.shardCount = BotSettings.assist.getConstants(
            "discord_shard_count"
          );
          BotSettings.default.shards = BotSettings.assist.getConstants(
            "discord_shards"
          );
          require("./Managers/Loader.js")
            .setupLoader()
            .then(() => {
              newLogic();
            });
        })
        .catch(err => {
          Logger.sendLog("-> Error message: " + err, "CRITICAL", __filename);
        });
    })
    .catch(err => {
      Logger.sendLog(
        "There was an error for some reason.... " + err,
        "CRITICAL",
        __filename
      );
      return;
    });
}

function newLogic() {
  BotSettings.loginType = "discord_live";
  BotSettings.assist.shardBuilder(parseInt(BotSettings.default.shardCount));
  BotSettings.assist.shardReg(parseInt(BotSettings.default.shardCount));
  BotSettings.assist.shardAuth(
    parseInt(BotSettings.default.shardCount),
    BotSettings.loginType
  );
}

BotSettings.assist.shardBuilder = shardCount => {
  for (let i = 0; i < parseInt(shardCount); i++) {
    BotSettings.assist.shardBuild(i, shardCount);
  }
};

BotSettings.assist.shardBuild = (i, shardCount) => {
  BotSettings.discord["client-" + i] = new Discord.Client({
    messageCacheLifetime: 300,
    messageSweepInterval: 60,
    messageCacheMaxSize: 6000,
    shardId: i,
    shardCount: parseInt(shardCount),
    fetchAllMembers: false
  });
};

BotSettings.assist.shardAuth = (shardCount, loginType = "discord_live") => {
  for (let i = 0; i < shardCount; i++) {
    BotSettings.assist.shardAuthLoop(i, loginType);
  }
};

BotSettings.assist.shardAuthLoop = (
  i,
  loginType = "discord_live",
  custom = false
) => {
  let id = i;
  if (custom === false) {
    BotSettings.discord["client-" + i]
      .login(BotSettings.assist.getConstants(loginType))
      .then(() => {
        Logger.sendLog(
          "Platform: Discord; on [Shard: " +
            id +
            "] - Authorized on: " +
            BotSettings.discord["client-" + i].user.tag,
          "INFO",
          __filename
        );
      })
      .catch(err => {
        Logger.sendLog(
          "Platform: Discord; with Error: Invalid Token or ECONN to API",
          "CRITICAL",
          __filename
        );
        Logger.sendStackTrace(err);
      });
  } else {
    return BotSettings.discord["client-" + i]
      .login(BotSettings.assist.getConstants(loginType))
      .then(() => {
        Logger.sendLog(
          "Platform: Discord; on [Shard: " +
            id +
            "] - Authorized on: " +
            BotSettings.discord["client-" + i].user.tag,
          "INFO",
          __filename
        );
      })
      .catch(err => {
        Logger.sendLog(
          "Platform: Discord; with Error: Invalid Token or ECONN to API",
          "CRITICAL",
          __filename
        );
        Logger.sendStackTrace(err);
      });
  }
};

BotSettings.assist.shardDirect = i => {
  return new Promise((resolve, reject) => {
    BotSettings.assist.shardBuild(i, BotSettings.default.shardCount);
    BotSettings.assist.startShard(i);
    BotSettings.assist
      .shardAuthLoop(i, BotSettings.loginType, true)
      .then(() => {
        Logger.sendLog("Shard " + i + " restarted", "CRITICAL", __filename);
        return resolve();
      })
      .catch(err => {
        return reject(err);
      });
  });
};

BotSettings.assist.postCheck = message => {
  return new Promise((resolve, reject) => {
    //check the following:
    //1.  Invite link
    //2.  Channel settings (image only channels, text only channels, both) - DB settings
    //3.  Any other features
    //2 needs to be done first before 3 since 2 doesn't have this support yet
  });
};

BotSettings.assist.startShard = i => {
  try {
    let id = i;
    BotSettings.discord["client-" + i].on("message", message => {
      /*
            console.log(BotSettings.assist.preventInviteLink(message));
            if(BotSettings.assist.preventInviteLink(message) === false && message.author.id === bot.user.id) {
                message.delete().then(m => {
                    BotSettings.assist.error("Your invite link was deleted, no advertising.", message.channel);
                }).catch(err => {
                    console.log(err.message);
                    BotSettings.assist.error("Unable to delete message for some reason: " + err.message, message.channel);
                })
                return;
            }
            */
      BotSettings.assist
        .parseMessage(message, id)
        .then(parseObj => {
          if (parseObj === undefined || parseObj === null) {
            return;
          }
          if (parseObj.command === null) {
            return;
          }
          let moduleObj = Loader.findModules("discord", parseObj.command);
          if (moduleObj[0] === false) {
            moduleObj = Loader.findModules("all", parseObj.command);
          }
          if (moduleObj[0] === true) {
            BotSettings.assist
              .permissionHelper(message)
              .then(permValue => {
                let premiumPerm = false;
                if (
                  parseInt(parseObj.premium) >= moduleObj[2].usage.premiumLvl
                ) {
                  premiumPerm = true;
                } else {
                  BotSettings.assist.error(
                    "Access Denied:  You do not have permission to use the command since it is a premium command.",
                    message.channel
                  );
                  return;
                }
                if (
                  (premiumPerm === true ||
                    parseInt(permValue) >=
                      parseInt(moduleObj[2].usage.permlvl)) &&
                  BotSettings.assist.canRunIn(message, moduleObj[2].usage)
                ) {
                  if (moduleObj[2].usage.enabled === false) {
                    BotSettings.assist.error(
                      "Command is locked by developer owners of the bot.",
                      message.channel
                    );
                    return;
                  }
                  Logger.sendLog(
                    "Platform ~ Discord ~ [Shard: " +
                      id +
                      "] Triggered Command by " +
                      message.author.tag +
                      "|" +
                      message.author.id +
                      ":" +
                      parseObj.command,
                    "INFO",
                    __filename
                  );
                  if (
                    parseObj.args.length >= moduleObj[2].args.min &&
                    parseObj.args.length <= moduleObj[2].args.max
                  ) {
                    let argMinMax =
                      moduleObj[2].args.min === 0 &&
                      moduleObj[2].args.max === 0;
                    let argMsg = [];
                    if (!argMinMax) {
                      argMinMax = parseObj.args;
                    }
                    let botUser = "";
                    if (BotSettings.discord.hasOwnProperty("client-" + id)) {
                      botUser = BotSettings.discord["client-" + id];
                    } else {
                      botUser = bot;
                    }
                    moduleObj[2]
                      .run(
                        botUser,
                        message,
                        argMinMax,
                        new Date(),
                        parseObj.prefix,
                        id
                      )
                      .then(response => {
                        if (
                          typeof response === "object" &&
                          response.hasOwnProperty("silent") &&
                          response.silent === true
                        ) {
                          Logger.sendLog(
                            "-> Module ran with args but silented",
                            "INFO",
                            __filename
                          );
                        } else if (
                          typeof response === "object" &&
                          response.hasOwnProperty("embed") &&
                          typeof response.embed === "object"
                        ) {
                          Logger.sendLog(
                            "-> Module ran with args but not silented, sending embed",
                            "INFO",
                            __filename
                          );
                          if (response.silent !== true) {
                            if (
                              response.response !== "" ||
                              response.response.length >= 1
                            ) {
                              message.channel.send(response.response, {
                                embed: response.embed
                              });
                            } else {
                              message.channel.send("", {
                                embed: response.embed
                              });
                            }
                          }
                        } else {
                          Logger.sendLog(
                            "-> Module ran with args but not silented",
                            "INFO",
                            __filename
                          );
                          message.channel.send(response.response);
                        }
                      })
                      .catch(error => {
                        console.log(error.message);
                        if (
                          typeof error === "object" &&
                          error.hasOwnProperty("silent") &&
                          error.silent === true
                        ) {
                          Logger.sendLog(
                            "-> Module ran with args but silented and has errors",
                            "INFO",
                            __filename
                          );
                        } else {
                          Logger.sendLog(
                            "-> Module ran with args but not silented and has errors",
                            "INFO",
                            __filename
                          );
                        }
                      });
                  } else {
                    Logger.sendLog(
                      "-> Arg out of bounds; " +
                        moduleObj[2].args.min +
                        "/" +
                        moduleObj[2].args.max +
                        " | " +
                        parseObj.args.length,
                      "CRITICAL",
                      __filename
                    );
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle("Invalid Input");
                    let exDesc =
                      moduleObj[2].usage.hasOwnProperty("exampleDesc") === true
                        ? moduleObj[2].usage.exampleDesc
                        : "";
                    embed.setDescription(
                      "Here are some examples:\n" +
                        parseObj.prefix +
                        moduleObj[2].usage.exampleUsage
                          .split("\n")
                          .join("\n" + parseObj.prefix) +
                        exDesc
                    );
                    embed.setColor("RED");
                    embed.addField(
                      "Additional Information",
                      "Min Words:  " +
                        moduleObj[2].args.min +
                        "\nMax Words: " +
                        moduleObj[2].args.max,
                      true
                    );
                    message.channel.send("", { embed: embed });
                    return;
                  }
                } else {
                  Logger.sendLog(
                    "-> Unauthorized to use command " +
                      parseObj.command +
                      " | Level: " +
                      permValue,
                    "CRITICAL",
                    __filename
                  );
                  BotSettings.assist.error(
                    "Access Denied:  You do not have permission to use the command.",
                    message.channel
                  );
                  return;
                }
              })
              .catch(permErr => {
                console.log(permErr);
                return;
              });
          } else {
            Logger.sendLog(
              "-> Unable to find command in any existing module",
              "CRITICAL",
              __filename
            );
            //message.reply("Unable to find command in any existing module.");
            return;
          }
        })
        .catch(parseErr => {
          console.log(parseErr);
          Logger.sendLog(
            "-> Error produced when trying to parse message",
            "CRITICAL",
            __filename
          );
          return;
        });
    });
  } catch (e) {
    Logger.sendStackTrace(e);
  }
};

BotSettings.assist.shardReg = shardCount => {
  for (let i = 0; i < shardCount; i++) {
    let id = i;
    BotSettings.assist.startShard(id);
  }
};

BotSettings.resolve.BotUser = id => {
  let botUser = null;
  if (BotSettings.discord.hasOwnProperty("client-" + id)) {
    botUser = BotSettings.discord["client-" + id].user.id;
  } else {
    botUser = bot.user.id;
  }
  return botUser;
};

BotSettings.assist.escapeStr = input => {
  let SqlString = require("sqlstring");
  return SqlString.escape(input);

  /*
    //Example 1
    var userId = 'some user provided value';
    var sql    = 'SELECT * FROM users WHERE id = ' + SqlString.escape(userId);
    console.log(sql); // SELECT * FROM users WHERE id = 'some user provided value'

    //Example 2
    var userId = 1;
    var sql    = SqlString.format('SELECT * FROM users WHERE id = ?', [userId]);
    console.log(sql); // SELECT * FROM users WHERE id = 1

    //Example 3
    var userId = 1;
    var sql    = SqlString.format('UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?', ['a', 'b', 'c', userId]);
    console.log(sql); // UPDATE users SET foo = 'a', bar = 'b', baz = 'c' WHERE id = 1

    //Example 4
    var post  = {id: 1, title: 'Hello MySQL'};
    var sql = SqlString.format('INSERT INTO posts SET ?', post);
    console.log(sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'

    //Example 5
    var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };
    var sql = SqlString.format('UPDATE posts SET modified = ? WHERE id = ?', [CURRENT_TIMESTAMP, 42]);
    console.log(sql); // UPDATE posts SET modified = CURRENT_TIMESTAMP() WHERE id = 42

    //Example 6
    var sql = 'SELECT * FROM posts WHERE title=' + SqlString.escape('Hello MySQL');
    console.log(sql); // SELECT * FROM posts WHERE title='Hello MySQL'

    //More Examples: https://github.com/mysqljs/sqlstring
    */
};

BotSettings.assist.parseMessage = (message, id) => {
  return BotSettings.assist
    .getGuildPrefix(message)
    .then(prefixResp => {
      let botUser = BotSettings.resolve.BotUser(id);
      if (message.author.id === botUser) {
        let serverPrefix =
          prefixResp.valid === true
            ? prefixResp.prefix
            : BotSettings.default.prefix;
        return {
          message: message,
          args: null,
          command: null,
          parsed: false,
          prefix: serverPrefix,
          premium: prefixResp.premium
        };
      }
      return BotSettings.assist
        .getUserPrefix(message)
        .then(userResp => {
          let serverPrefix =
            prefixResp.valid === true
              ? prefixResp.prefix
              : BotSettings.default.prefix;
          let userPrefix =
            userResp.valid === true
              ? userResp.prefix
              : BotSettings.default.prefix;
          let mainPrefix = "";

          let botUser = BotSettings.resolve.BotUser(id);
          if (message.author.id === botUser) {
            return {
              message: message,
              args: null,
              command: null,
              parsed: false,
              prefix: mainPrefix,
              premium: prefixResp.premium
            };
          }
          let messContent = message.content;
          messContent = messContent.split(" ");
          messContent[0] = messContent[0].toLowerCase();
          messContent = messContent.join(" ");
          message.content = messContent;
          if (
            message.content.startsWith(serverPrefix.toLowerCase()) ||
            message.content.startsWith(userPrefix.toLowerCase()) ||
            (message.mentions.users.first() &&
              message.mentions.users.first().id === botUser)
          ) {
            //extract bot tag
            let args = BotSettings.assist.removeBotArg(message, id);
            let command = "";
            let userPrefixChoice = false;
            if (args.length >= 1) {
              if (message.content.startsWith(serverPrefix.toLowerCase())) {
                command = args.shift().slice(serverPrefix.length);
                mainPrefix = serverPrefix.toLowerCase();
              } else if (message.content.startsWith(userPrefix.toLowerCase())) {
                command = args.shift().slice(userPrefix.length);
                mainPrefix = userPrefix.toLowerCase();
                userPrefixChoice = true;
              } else {
                command = args.shift();
                mainPrefix = serverPrefix.toLowerCase();
              }
              let tmpArgs = args.join(" ");
              let jsonContent = BotSettings.validate.JsonStr(tmpArgs);
              if (!jsonContent.valid) {
                //invalid
                Logger.sendLog(
                  "-> " + command + " - " + jsonContent.response,
                  "INFO",
                  __filename
                );
              }
              Logger.sendLog(
                "-> " + command + " - " + args,
                "INFO",
                __filename
              );

              return {
                message: message,
                args: args,
                json: jsonContent.valid,
                jsonResp: jsonContent.response,
                command: command,
                parsed: true,
                prefix: mainPrefix,
                premium: prefixResp.premium
              };
            }
          }
          mainPrefix = serverPrefix;
          return {
            message: message,
            args: null,
            command: null,
            parsed: false,
            prefix: mainPrefix,
            premium: prefixResp.premium
          };
        })
        .catch(errResp => {
          console.log(errResp);
          return {
            message: message,
            args: null,
            command: null,
            parsed: false,
            prefix: BotSettings.default.prefix,
            premium: 0
          };
        });
    })
    .catch(prefixErr => {
      console.log(prefixErr);
      return {
        message: message,
        args: null,
        command: null,
        parsed: false,
        prefix: BotSettings.default.prefix,
        premium: 0
      };
    });
};

BotSettings.validate.JsonStr = (input, inputType = "any") => {
  //how do i validate json object?
  let validate = require("validator");
  if (validate.isJSON(input) || BotSettings.assist.createJson(input) !== null) {
    return { valid: true, response: BotSettings.assist.createJson(input) };
  } else {
    return { valid: false, response: "JSON has the errors." };
  }
};

BotSettings.assist.createJson = input => {
  let jsonParse = null;
  try {
    jsonParse = JSON.parse(JSON.stringify(input));
  } catch (e) {
    jsonParse = null;
  }
  return jsonParse;
};

BotSettings.assist.getDiscrims = input => {
  return new Promise((resolve, reject) => {
    let userLst = [];
    for (let i = 0; i < BotSettings.default.shardCount; i++) {
      let users = BotSettings.discord["client-" + i].users
        .filter(u => u.discriminator === input)
        .map(u => u.username);
      if (users.length >= 1) {
        for (let j = 0; j < users.length; j++) {
          userLst.push(users[j]);
        }
      }
    }
    return resolve(userLst);
  });
};

BotSettings.validate.MomentDate = (input, dateFormat = "MM/DD/YYYY") => {
  let moment = require("moment");
  return moment(input, dateFormat, true).isValid();
};

BotSettings.assist.isGuildPremium = message => {
  return new Promise((resolve, reject) => {
    console.log(
      "SELECT premium FROM settings WHERE platform='discord' AND server='" +
        message.guild.id +
        "' LIMIT 1"
    );
    Database.callStatement(
      "SELECT premium FROM settings WHERE platform='discord' AND server='" +
        message.guild.id +
        "' LIMIT 1"
    )
      .then(rows => {
        if (rows.length === 1) {
          rows.forEach(row => {
            let info = row;
            return resolve({
              response: "Your premium is: " + info.premium,
              error: false,
              valid: true,
              premium: info.premium
            });
          });
        } else {
          return resolve({
            response: "Your premium is: 0",
            error: false,
            valid: true,
            premium: 0
          });
        }
      })
      .catch(errRow => {
        return resolve({
          response: errRow.message,
          error: true,
          valid: false,
          premium: 0
        });
      });
  });
};

checkDiscordDM = message => {
  if (message.channel.type === "dm") {
    return true;
  }
  return false;
};

BotSettings.assist.setUserPrefix = (message, args, argType = "main") => {
  return new Promise((resolve, reject) => {
    Database.callStatement(
      "SELECT * FROM usersettings WHERE platform='discord' AND userid='" +
        message.author.id +
        "' LIMIT 1"
    )
      .then(rows => {
        if (rows.length === 1) {
          let rowContent = rows[0];
          let oldPrefix = rowContent.prefix;
          let setPrefixType = "";
          if (argType === "main") {
            oldPrefix = rowContent.prefix;
            setPrefixType = "prefix";
          } else if (argType === "game") {
            oldPrefix = rowContent.prefixgame;
            setPrefixType = "prefixgame";
          }
          let newPrefix = args.join(" ");
          if (oldPrefix !== newPrefix) {
            Database.callStatement(
              "UPDATE usersettings SET " +
                setPrefixType +
                "='" +
                newPrefix +
                "' WHERE platform='discord' AND userid='" +
                message.author.id +
                "'"
            )
              .then(() => {
                return resolve({
                  response:
                    "Prefix updated from `" +
                    oldPrefix +
                    "` to `" +
                    newPrefix +
                    "`",
                  error: false,
                  valid: false,
                  prefix: newPrefix,
                  premium: 0
                });
              })
              .catch(errRow2 => {
                return resolve({
                  response:
                    "Your prefix setting became an issue because.... " +
                    errRow2,
                  error: true,
                  valid: false,
                  prefix: BotSettings.default.prefix
                });
              });
          } else {
            return resolve({
              response: "Your prefix is exactly the same",
              error: false,
              valid: false,
              prefix: BotSettings.default.prefix,
              premium: 0
            });
          }
        } else {
          Database.callStatement(
            "INSERT INTO usersettings (platform, userid, prefix) VALUES ('discord', '" +
              message.author.id +
              "', 'p!')"
          )
            .then(() => {
              return resolve({
                response:
                  "Prefix is set to the default value: `" +
                  BotSettings.default.prefix +
                  "`",
                error: false,
                valid: false,
                prefix: BotSettings.default.prefix,
                premium: 0
              });
            })
            .catch(errRow => {
              Logger.sendLog(
                "The row was unable to be created because..... " + errRow,
                "CRITICAL",
                __filename
              );
              return resolve({
                response:
                  "Prefix is set to the default value: `" +
                  BotSettings.default.prefix +
                  "`",
                error: false,
                valid: false,
                prefix: BotSettings.default.prefix,
                premium: 0
              });
            });
        }
      })
      .catch(errRows => {
        Logger.sendLog(
          "Unable to find prefix for some reason..... " + errRows,
          "CRITICAL",
          __filename
        );
        return resolve({ response: err.message, error: true, valid: false });
      });
  });
};

BotSettings.assist.getUserPrefix = message => {
  return new Promise((resolve, reject) => {
    Database.callStatement(
      "SELECT * FROM usersettings WHERE platform='discord' AND userid='" +
        message.author.id +
        "' LIMIT 1"
    )
      .then(rows => {
        if (rows.length === 1) {
          return resolve({
            response: "Your personal prefix is " + rows[0].prefix,
            error: false,
            valid: true,
            prefix: rows[0].prefix,
            prefixgame: rows[0].prefixgame,
            premium: 0
          });
        } else {
          //prefix not set, adding default prefix
          Database.callStatement(
            "INSERT INTO usersettings (platform, userid) VALUES ('discord','" +
              message.author.id +
              "')"
          )
            .then(rows => {
              Database.callStatement(
                "SELECT * FROM usersettings WHERE platform='discord' AND server='" +
                  message.author.id +
                  "' LIMIT 1"
              )
                .then(rowData => {
                  if (rowData.length === 1) {
                    return resolve({
                      response: "Your personal prefix is " + rowData[0].prefix,
                      error: false,
                      valid: true,
                      prefix: rowData[0].prefix,
                      prefixgame: rowData[0].prefixgame,
                      premium: rowData[0].premium
                    });
                  } else {
                    return resolve({
                      response:
                        "Your personal prefix is " + BotSettings.default.prefix,
                      error: false,
                      valid: true,
                      prefix: BotSettings.default.prefix,
                      premium: 0
                    });
                  }
                })
                .catch(errData => {
                  return resolve({
                    response:
                      "Prefix is set to the default value: `" +
                      BotSettings.default.prefix +
                      "`",
                    error: false,
                    valid: false,
                    prefix: BotSettings.default.prefix,
                    premium: 0
                  });
                });
            })
            .catch(err => {
              Logger.sendLog(
                "-> Error message: " + err,
                "CRITICAL",
                __filename
              );
              return resolve({
                response: err.message,
                error: true,
                valid: false
              });
            });
        }
      })
      .catch(errRows => {
        Logger.sendLog("-> Error message: " + errRows, "CRITICAL", __filename);
        return resolve({
          response: errRows.message,
          error: true,
          valid: false
        });
      });
  });
};

BotSettings.assist.getGuildPrefix = message => {
  return new Promise((resolve, reject) => {
    if (checkDiscordDM(message) === true) {
      return resolve({
        response: "Your prefix is: " + BotSettings.default.prefix,
        error: false,
        valid: true,
        prefix: BotSettings.default.prefix,
        premium: 0
      });
    }
    Database.callStatement(
      "SELECT * FROM settings WHERE platform='discord' AND server='" +
        message.guild.id +
        "'"
    )
      .then(rows => {
        if (rows.length === 1) {
          rows.forEach(row => {
            let info = row;
            let oldPrefix = row.prefix;
            return resolve({
              response: "Your guild prefix is " + oldPrefix,
              error: false,
              valid: true,
              prefix: oldPrefix,
              premium: info.premium
            });
          });
        } else {
          //prefix not set, adding default prefix
          Database.callStatement(
            "INSERT INTO settings (platform, server) VALUES ('discord','" +
              message.guild.id +
              "')"
          )
            .then(rows => {
              Database.callStatement(
                "SELECT * FROM settings WHERE platform='discord' AND server='" +
                  message.guild.id +
                  "' LIMIT 1"
              )
                .then(rowData => {
                  if (rowData.length === 1) {
                    return resolve({
                      response: "Your guild prefix is " + rowData[0].prefix,
                      error: false,
                      valid: true,
                      prefix: rowData[0].prefix,
                      premium: rowData[0].premium
                    });
                  } else {
                    return resolve({
                      response:
                        "Your guild prefix is " + BotSettings.default.prefix,
                      error: false,
                      valid: true,
                      prefix: BotSettings.default.prefix,
                      premium: 0
                    });
                  }
                })
                .catch(errData => {
                  return resolve({
                    response:
                      "Prefix is set to the default value: `" +
                      BotSettings.default.prefix +
                      "`",
                    error: false,
                    valid: false,
                    prefix: BotSettings.default.prefix,
                    premium: 0
                  });
                });
            })
            .catch(err => {
              Logger.sendLog(
                "-> Error message: " + err,
                "CRITICAL",
                __filename
              );
              return resolve({
                response: err.message,
                error: true,
                valid: false
              });
            });
        }
      })
      .catch(err => {
        Logger.sendLog("-> Error message: " + err, "CRITICAL", __filename);
        return resolve({ response: err.message, error: true, valid: false });
      });
  });
};

BotSettings.assist.setGuildPrefix = (message, args, argType = "main") => {
  return new Promise((resolve, reject) => {
    Database.callStatement(
      "SELECT * FROM settings WHERE platform='discord' AND server='" +
        message.guild.id +
        "'"
    )
      .then(rows => {
        if (rows.length === 1) {
          rows.forEach(row => {
            let info = row;
            let oldPrefix = "";
            let setPrefixType = "";
            if (argType === "main") {
              oldPrefix = row.prefix;
              setPrefixType = "prefix";
            } else if (argType === "game") {
              oldPrefix = row.prefixgame;
              setPrefixType = "prefixgame";
            }
            let newPrefix = args.join(" ");
            if (oldPrefix !== newPrefix) {
              Database.callStatement(
                "UPDATE settings SET " +
                  setPrefixType +
                  "='" +
                  newPrefix +
                  "' WHERE platform='discord' AND server='" +
                  message.guild.id +
                  "'"
              ).then(innerRows => {
                return resolve({
                  response:
                    "Your guild prefix has been changed from " +
                    oldPrefix +
                    " to " +
                    newPrefix,
                  error: false,
                  valid: true
                });
              });
            } else {
              return resolve({
                response:
                  "The prefix you are requesting to add is the exact same."
              });
            }
          });
        } else {
          //prefix not set, adding default prefix
          let newPrefix = args.join(" ");
          Database.callStatement(
            "INSERT INTO settings (platform, server, prefix, prefixgame) VALUES ('discord','" +
              message.guild.id +
              "', '" +
              newPrefix +
              "', '" +
              BotSettings.config.prefixGame +
              "')"
          )
            .then(rows => {
              return resolve({
                response:
                  "Prefix is set to the default value " +
                  BotSettings.config.prefix,
                error: false,
                valid: false
              });
            })
            .catch(err => {
              return resolve({
                response: err.message,
                error: true,
                valid: false
              });
            });
        }
      })
      .catch(err => {
        return resolve({ response: err.message, error: true, valid: false });
      });
  });
};

BotSettings.assist.isSelfBot = (user, id) => {
  let botUser = "";
  if (BotSettings.discord.hasOwnProperty("client-" + id)) {
    botUser = BotSettings.discord["client-" + id].user.id;
  } else {
    botUser = bot.user.id;
  }
  if (user.user.id === botUser) {
    return true;
  }
  return false;
};

BotSettings.assist.removeBotArg = (message, id) => {
  let args = message.content.split(" ");
  let botUser = "";
  if (BotSettings.discord.hasOwnProperty("client-" + id)) {
    botUser = BotSettings.discord["client-" + id].user.id;
  } else {
    botUser = bot.user.id;
  }
  if (
    args.includes("<@" + botUser + ">") ||
    args.includes("<@!" + botUser + ">")
  ) {
    for (let i = 0; i < args.length; i++) {
      if (
        args[i] === "<@" + botUser + ">" ||
        args[i] === "<@!" + botUser + ">"
      ) {
        delete args.splice(i, 1);
        break;
      }
    }
  }
  return args;
};

BotSettings.assist.permission = function(user) {
  return new Promise((resolve, reject) => {
    let discordOwners = BotSettings.assist
      .getConstants("discord_owners")
      .split(",");
    if (discordOwners.includes(user.id)) return resolve(7);
    if (!user.guild) return resolve(0);
    if (user.id === user.guild.ownerID) return resolve(6);
    Database.callStatement(
      "SELECT * FROM settings WHERE platform='discord' AND server='" +
        user.guild.id +
        "'"
    )
      .then(rows => {
        if (rows.length === 1) {
          if (user.roles.find(role => role.id === rows[0].masterRank))
            return resolve(5); //Supreme
          if (user.roles.find(role => role.id === rows[0].adminRank))
            return resolve(4);
          if (user.roles.find(role => role.id === rows[0].modRank))
            return resolve(3);
          if (user.roles.find(role => role.id === rows[0].supportRank))
            return resolve(2);
          if (user.roles.find(role => role.id === rows[0].djRank))
            return resolve(1);
        } else {
          if (user.roles.find(role => role.name.toLowerCase() === "master"))
            return resolve(5); //Supreme
          if (user.roles.find(role => role.name.toLowerCase() === "admin"))
            return resolve(4);
          if (user.roles.find(role => role.name.toLowerCase() === "mod"))
            return resolve(3);
          if (user.roles.find(role => role.name.toLowerCase() === "support"))
            return resolve(2);
          if (user.roles.find(role => role.name.toLowerCase() === "dj"))
            return resolve(1);
        }
        return resolve(0);
      })
      .catch(err => {
        console.log(err);
        return resolve(0);
      });
  });
};

BotSettings.assist.permRange = input => {
  if (input.toLowerCase() === "owner") {
    return 6;
  } else if (input.toLowerCase() === "master") {
    return 5;
  } else if (input.toLowerCase() === "admin") {
    return 4;
  } else if (input.toLowerCase() === "mod") {
    return 3;
  } else if (input.toLowerCase() === "support") {
    return 2;
  } else if (input.toLowerCase() === "dj") {
    return 1;
  }
  return 0;
};

BotSettings.assist.validSupportRole = input => {
  if (input.toLowerCase() === "support") {
    return true;
  }
  return false;
};

BotSettings.assist.validateRoles = roleName => {
  if (roleName.toLowerCase() === "master") {
    return true;
  } else if (roleName.toLowerCase() === "admin") {
    return true;
  } else if (roleName.toLowerCase() === "mod") {
    return true;
  } else if (roleName.toLowerCase() === "support") {
    return true;
  } else if (roleName.toLowerCase() === "dj") {
    return true;
  } else if (roleName.toLowerCase() === "mute") {
    return true;
  } else if (roleName.toLowerCase() === "autorole") {
    return true;
  } else if (roleName.toLowerCase() === "patreon") {
    return true;
  }
  return false;
};

BotSettings.assist.getAvailRoles = () => {
  return [
    "Master",
    "Admin",
    "Mod",
    "Support",
    "DJ",
    "Mute",
    "Autorole",
    "patreon"
  ];
};

BotSettings.resolve.Server = input => {
  for (let i = 0; i < parseInt(BotSettings.default.shardCount); i++) {
    try {
      if (BotSettings.discord["client-" + i].guilds.size > 0) {
        let content = BotSettings.discord["client-" + i].guilds.filter(x => {
          console.log(x.id + " | " + input);
          if (x.id === input || x.id + "" === input + "") {
            return true;
          }
          return false;
        });
        if (content !== []) {
          return { found: true, data: content, shard: i };
        }
      }
    } catch (e) {
      return { found: false, data: null, shard: null };
    }
  }
  return { found: false, data: null, shard: null };
};

BotSettings.assist.extractInfo = (info, argType, platform) => {
  if (platform.toLowerCase() === "discord") {
    if (argType.toLowerCase() === "roles") {
      let tmpResp = info;
      tmpResp = tmpResp.replace("<@&", "");
      tmpResp = tmpResp.replace(">", "");
      tmpResp = tmpResp.replace("!", "");
      return tmpResp;
    } else if (argType.toLowerCase() === "channel") {
      let tmpResp2 = info;
      tmpResp2 = tmpResp2.replace("<#", "");
      tmpResp2 = tmpResp2.replace(">", "");
      tmpResp2 = tmpResp2.replace("!", "");
      return tmpResp2;
    } else if (argType.toLowerCase() === "users") {
      let tmpResp3 = info;
      tmpResp3 = tmpResp3.replace("<#", "");
      tmpResp3 = tmpResp3.replace("<@", "");
      tmpResp3 = tmpResp3.replace("!", "");
      tmpResp3 = tmpResp3.replace(">", "");
      return tmpResp3;
    } else if (argType.toLowerCase() === "members") {
      let tmpResp4 = info;
      tmpResp4 = tmpResp3.replace("<@", "");
      tmpResp4 = tmpResp3.replace("!", "");
      tmpResp4 = tmpResp3.replace(">", "");
      return tmpResp4;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

BotSettings.assist.validateNumber = num => {
  if (num === undefined) {
    return false;
  }
  if (typeof num === "number") {
    return true;
  }
  if (num.match(/^\d+$/)) {
    return true;
  }
  return false;
};

BotSettings.resolve.Number = num => {
  if (num === undefined) {
    return false;
  }
  if (typeof num === "number") {
    return true;
  }
  if (num.match(/^\d+$/)) {
    return true;
  }
  return false;
};

BotSettings.resolve.extractUser = input => {
  var userreg = new RegExp(/<@!?([0-9]{17,21})>/);
  var userreg2 = new RegExp(/id\:([0-9]{17,21})/);
  var userid = input;

  if (userreg.test(input)) {
    var reg = userreg.exec(input);
    userid = reg[1];
  } else if (userreg2.test(input)) {
    userid = userreg2.exec(input)[1];
  } else {
    userid = input;
  }

  return userid;
};

BotSettings.resolve.User = (input, message = "None", typeUser = "user", id) => {
  var userreg = new RegExp(/<@!?([0-9]{17,21})>/);
  var userreg2 = new RegExp(/id\:([0-9]{17,21})/);
  var userid = input;

  if (userreg.test(input)) {
    var reg = userreg.exec(input);
    userid = reg[1];
  } else if (userreg2.test(input)) {
    userid = userreg2.exec(input)[1];
  } else {
    userid = input;
  }

  var user = "";
  if (typeUser.toLowerCase() === "guild") {
    user = message.guild.members.filter(z => {
      return userid === z.user.id;
    });
    if (user.size === 1) {
      user = user.first();
    }
    if (user === undefined) {
      return false;
    }
    return user;
  } else {
    let botUser = "";
    if (BotSettings.discord.hasOwnProperty("client-" + id)) {
      botUser = BotSettings.discord["client-" + id];
    } else {
      botUser = bot;
    }
    user = botUser.users.get(userid);
    if (user == undefined) {
      //unable to find, more in-depth search
      user = BotSettings.resolve.fullUser(userid);
      if (user === false) {
        return false;
      }
      return user;
    } else {
      return user;
    }
  }
};

BotSettings.resolve.fullUser = input => {
  let finalUser = false;
  for (let i = 0; i < BotSettings.default.shardCount; i++) {
    if (BotSettings.discord.hasOwnProperty("client-" + i)) {
      let user = BotSettings.discord["client-" + i].users.get(input);
      if (user !== undefined) {
        return user;
      }
    }
  }
  return finalUser;
};

BotSettings.resolve.Channel = (input, id) => {
  let channel = "";
  let botUser = "";
  if (BotSettings.discord.hasOwnProperty("client-" + id)) {
    botUser = BotSettings.discord["client-" + id];
  } else {
    botUser = bot;
  }
  if (input.includes("name:") === true) {
    let colonSplit = input.split(":");
    channel = botUser.channels.get({ name: colonSplit[1] });
  } else {
    let channelId = BotSettings.assist.extractInfo(input, "channel", "discord");
    channel = botUser.channels.get(channelId);
  }
  if (channel === undefined) {
    return false;
  }
  return channel;
};

/*
BotSettings.resolve.Channel = (input, guild) => {
    var regex = new RegExp(/<\#([0-9]{17,21})>/);
	if(guild){
		if(regex.test(input)){
			id = regex.exec(input)[1];
			var channel = guild.channels.get(id);
			if(channel == undefined){
				return false;
			} else {
				return channel;
			}
		}
		var channel = guild.channels.find((c)=>{return c.name.toLowerCase() == input.toLowerCase() && c.type == "0"});
		if(channel){
			return channel;
		} else {
			return false;
		}
	} else {
		var id = input;
		if(regex.test(input)){
			id = regex.exec(input)[1];
		}

		var guildid = bot.channelGuildMap[id];
		var guild = bot.guilds.get(guildid);
		if(guildid == undefined || guild == undefined){
			return false;
		}
		var channel = guild.channels.get(id);
		if(channel == undefined){
			return false;
		} else {
			return channel;
		}
	}
}
*/

BotSettings.resolve.Int = input => {
  var regex = new RegExp(/([0-9]*)/);
  if (regex.test(input)) {
    return parseInt(input);
  } else {
    return false;
  }
};

BotSettings.resolve.Bool = input => {
  let yesnowords = require("yes-no-words");
  if (
    yesnowords.yes
      .map(z => {
        return z.toLowerCase();
      })
      .includes(input) === true ||
    input == "true" ||
    input == "1" ||
    input == "on" ||
    input == "t" ||
    input == "yes" ||
    input == "y"
  ) {
    return true;
  } else if (
    yesnowords.no
      .map(z => {
        return z.toLowerCase();
      })
      .includes(input) === true
  ) {
    return false;
  } else {
    return false;
  }
};

BotSettings.assist.getKeyByValue = (input, search, multi = false) => {
  let keyLst = [];
  for (let prop in input) {
    if (input.hasOwnProperty(prop)) {
      if (input[prop] === search) {
        if (multi === true) {
          keyLst.push(prop);
        } else {
          return prop;
        }
      }
    }
  }
  if (keyLst.length === 0) {
    return null;
  }
  return keyLst;
};

BotSettings.resolve.BoolAct = input => {
  if (
    input == "true" ||
    input == "1" ||
    input == "on" ||
    input == "t" ||
    input == "yes" ||
    input == "y"
  ) {
    return true;
  } else if (
    input == "false" ||
    input == "0" ||
    input == "off" ||
    input == "f" ||
    input == "no" ||
    input == "n"
  ) {
    return false;
  } else {
    return null;
  }
};

BotSettings.resolve.RoleArr = input => {
  let tmpArray = [];
  Object.keys(input).forEach(key => {
    if (input[key] === true) {
      tmpArray.push(key);
    }
  });
  return tmpArray;
};

BotSettings.resolve.distributeArray = (input, divider, balanced = true) => {
  if (divider < 2) {
    return [input];
  }
  let len = input.length,
    out = [],
    i = 0,
    size;

  if (len % divider === 0) {
    size = Math.floor(len / divider);
    while (i < len) {
      out.push(input.slice(i, (i += size)));
    }
  } else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / divider--);
      out.push(input.slice(i, (i += size)));
    }
  } else {
    divider--;
    size = Math.floor(len / divider);
    if (len % size === 0) {
      size--;
    }
    while (i < size * divider) {
      out.push(input.slice(i, (i += size)));
    }
    out.push(input.slice(size * i));
  }

  return out;
};

BotSettings.assist.GroupArray = arr => {
  let history = {};
  if (Array.isArray(arr)) {
    history = arr.reduce(function(prev, item) {
      if (item in prev) prev[item]++;
      else prev[item] = 1;
      return prev;
    }, {});
  } else {
    return null;
  }
  return history;
};

BotSettings.validate.SpotifyFormat = input => {
  let regex = new RegExp(
    /((artist)(:|\s+)([A-Za-z0-9]+))|((track)(:|\s+)([A-Za-z0-9]+))/,
    "g"
  );
  if (regex.test(input)) {
    let regexMatch = input.match(regex);
    let finalMatch = [];
    regexMatch.forEach(val => {
      let regex2 = new RegExp(
        /((artist)(\s+)([A-Za-z0-9]+))|((track)(\s+)([A-Za-z0-9]+))/,
        "g"
      );
      if (regex2.test(val)) {
        finalMatch.push(val.replace(new RegExp(/\s+/, "g"), ":"));
      }
    });
    return finalMatch.join(" ");
  } else {
    return input;
  }
};

BotSettings.validate.Date = input => {
  if (
    /([0-9][1-2]|[0-9])\/([0-2][0-9]|[3][0-1])\/((19|20)[0-9]{2})/.test(input)
  ) {
    var tokens = input.split("/"); //  text.split('\/');
    var day = parseInt(tokens[0], 10);
    var month = parseInt(tokens[1], 10);
    var year = parseInt(tokens[2], 10);
    return true;
  } else {
    //show error
    //Invalid date forma
    return false;
  }
};

BotSettings.resolve.characterLimitHandler = (
  input,
  maxCharLimit,
  maxArrLen = -1
) => {
  let str = input;
  let chunks = [];

  if (Array.isArray(str) === true) {
    for (let i = 0; i < str.length; i++) {
      let words = str[i];
      if (chunks.length === 0) {
        chunks.push(words + "\n");
      } else {
        let currentWords = chunks[chunks.length - 1];
        if (currentWords.length + words.length + "\n".length > maxCharLimit) {
          chunks.push(words + "\n");
        } else {
          chunks[chunks.length - 1] = currentWords + words + "\n";
        }
      }
    }
    if (chunks.length > maxArrLen && maxArrLen !== -1) {
      return [];
    }
    return chunks;
  } else {
    let splitArr = str.match(new RegExp(".{1," + maxCharLimit + "}", "g"));
    if (splitArr.length >= maxArrLen) {
      return [];
    }
    return splitArr;
  }
};

BotSettings.get.CommandsList = (modules, platform, message) => {
  let helperArr = [];
  return new Promise((resolve, reject) => {
    BotSettings.assist
      .permissionHelper(message)
      .then(permVal => {
        modules.forEach(tmodule => {
          tmodule.commands.forEach(command => {
            if (parseInt(permVal) >= command.usage.permlvl) {
              let category = command.usage.categories;
              if (command.usage.enabled === true) {
                if (!helperArr.hasOwnProperty(category)) {
                  helperArr[category] = [];
                }
                helperArr[category].push(
                  BotSettings.config.prefix +
                    command.usage.cmdName +
                    " -- " +
                    command.usage.description
                );
              }
            }
          });
        });
        return resolve(helperArr);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

BotSettings.assist.findgcd = (input, maxRange) => {
  let mathjs = require("mathjs");
  let maxNumber = 1;
  for (let i = 1; i <= maxRange; i++) {
    let mathGcd = mathjs.gcd(input, i);
    if (mathGcd >= maxNumber) {
      maxNumber = mathGcd;
    }
  }
  return maxNumber;
};

BotSettings.assist.findgcf = (input1, maxRange) => {
  let highestGCF = 1;
  for (let j = 1; j <= maxRange; j++) {
    let num1 = input1;
    let num2 = j;

    var gcf = 1;
    var higher = num2;
    var lower = num1;

    if (num1 > num2) {
      higher = num1;
      lower = num2;
    }

    for (var i = 0; i < lower; i++) {
      if (lower % i == 0 && higher % i == 0 && i > gcf) {
        gcf = i;
      }
    }
    if (gcf > highestGCF) {
      highestGCF = gcf;
    }
  }
  return highestGCF;
};

BotSettings.assist.tzAbbr = input => {
  var abbrs = {
    EST: "Eastern Standard Time",
    EDT: "Eastern Daylight Time",
    CST: "Central Standard Time",
    CDT: "Central Daylight Time",
    MST: "Mountain Standard Time",
    MDT: "Mountain Daylight Time",
    PST: "Pacific Standard Time",
    PDT: "Pacific Daylight Time"
  };
  return abbrs[input] || input;
};

BotSettings.resolve.Time = (input, to12 = true) => {
  if (to12 === true) {
    let splitTime = input.split(":");
    let hours = parseInt(splitTime[0]);
    let minutes = parseInt(splitTime[1]);
    let ampm = "am";
    if (hours > 12) {
      hours -= 12;
      ampm = "pm";
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    return hours + ":" + minutes + " " + ampm;
  } else {
    let hours = "",
      minutes = "";
    if (input.toLowerCase().includes("pm")) {
      let splitColon = input.toLowerCase().split(":");
      hours = parseInt(splitColon[0]);
      if (hours < 12) {
        hours += 12;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      minutes = parseInt(splitColon[1].replace("pm", ""));
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
    } else if (input.toLowerCase().includes("am")) {
      let splitColon = input.toLowerCase().split(":");
      hours = parseInt(splitColon[0]);
      if (hours == 12) {
        hours -= 12;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      minutes = parseInt(splitColon[1].replace("am", ""));
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
    } else {
      return null;
    }
    return hours + ":" + minutes;
  }
};

BotSettings.resolve.TimeFormat = input => {
  let regex = new RegExp(
    /^(([1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)?)|(([01]?[0-9]|2[0-3]):[0-5][0-9])$/,
    "i"
  );
  if (regex.test(input) === true) {
    let hours = 0,
      minutes = 0;
    if (input.toLowerCase().includes("pm")) {
      let splitColon = input.toLowerCase().split(":");
      hours = parseInt(splitColon[0]);
      if (hours < 12) {
        hours += 12;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      minutes = parseInt(splitColon[1].replace("pm", ""));
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
    } else if (input.toLowerCase().includes("am")) {
      let splitColon = input.toLowerCase().split(":");
      hours = parseInt(splitColon[0]);
      if (hours == 12) {
        hours -= 12;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      minutes = parseInt(splitColon[1].replace("am", ""));
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
    } else {
      let splitColon = input.toLowerCase().split(":");
      hours = parseInt(splitColon[0]);
      minutes = parseInt(splitColon[1].replace("am", ""));
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
    }
    return hours + ":" + minutes;
  } else {
    return null;
  }
};

BotSettings.assist.RandomColor = () => {
  let randomColor = require("random-color");

  let color = randomColor();
  if (color.hexString() === BotSettings.color) {
    return BotSettings.assist.RandomColor();
  } else {
    BotSettings.color = color.hexString();
    return color;
  }
};

BotSettings.assist.sentenceSplit = input => {
  let str = input;
  if (BotSettings.assist.isHTML(input) === true) {
    return null;
  }
  return str.match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g);
};

BotSettings.assist.isHTML = input => {
  let html = input;

  var openingTags, closingTags;

  html = html.replace(/<[^>]*\/\s?>/g, ""); // Remove all self closing tags
  html = html.replace(/<(br|hr|img).*?>/g, ""); // Remove all <br>, <hr>, and <img> tags
  openingTags = html.match(/<[^\/].*?>/g) || []; // Get remaining opening tags
  closingTags = html.match(/<\/.+?>/g) || []; // Get remaining closing tags

  return openingTags.length === closingTags.length ? true : false;
};

BotSettings.assist.RandomHex = () => {
  let random = require("random-number");
  let colorArr = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F"
  ];
  let options = {
    min: 0,
    max: colorArr.length - 1,
    integer: true
  };
  let colorChoice = "";
  for (let i = 0; i < 6; i++) {
    colorChoice += colorArr[random(options)] + "";
  }
  return colorChoice;
};

BotSettings.random = {};
BotSettings.random.Number = maxLimit => {
  var Random = require("random-js");
  var random = new Random(Random.engines.mt19937().autoSeed());
  if (maxLimit === undefined) {
    maxLimit = 10000;
  }
  return random.integer(1, maxLimit);
};

BotSettings.assist.RandomNumArr = input => {
  let random = require("random-number");
  if (Array.isArray(input)) {
    let options = {
      min: 0,
      max: input.length - 1,
      integer: true
    };
    return input[random(options)];
  } else {
    return false;
  }
};

BotSettings.resolve.Role = (input, guild) => {
  if (input == undefined || guild == undefined) {
    return false;
  }
  var r = guild.roles.map(g => g);
  var possible = [];
  for (var i in r) {
    if (r[i].name.toLowerCase() == input.toLowerCase()) {
      return r[i];
    }
    if (r[i].name.toLowerCase().indexOf(input.toLowerCase()) > -1) {
      possible.push(r[i]);
    }
    if (r[i].id === input.toLowerCase()) {
      return r[i];
    }
  }
  if (possible.length == 0 || possible.length > 1) {
    return false;
  } else {
    return possible[0];
  }
  return false;
};

BotSettings.wait = t => {
  return new Promise((y, n) => {
    setTimeout(y, t);
  });
};

BotSettings.resolve.Color = (input, colorType = "rgb", objReq = false) => {
  let convert = require("color-convert");
  let colorText = "";
  try {
    colorText = convert.keyword.hex(input.toLowerCase());
  } catch (e) {
    Logger.sendLog(
      "-> Couldn't detect color based on input. Resorting to the rest of the code.",
      "CRITICAL",
      __filename
    );
  }
  if (colorText !== "") {
    return colorText;
  }
  if (colorType.toLowerCase() === "rgb") {
    let redColor = input.red;
    let greenColor = input.green;
    let blueColor = input.blue;
    let validColors = false;
    let validAlpha = false;
    if (
      BotSettings.validate.Color(redColor) === true &&
      BotSettings.validate.Color(greenColor) === true &&
      BotSettings.validate.Color(blueColor) === true
    ) {
      validColors = true;
    }
    let alpha =
      input.alpha !== undefined || input.alpha !== null ? input.alpha : null;
    if (alpha !== null) {
      if (BotSettings.validate.Float(alpha) === true) {
        let alphaParsed = parseFloat(alpha);
        validAlpha = BotSettings.validate.Range(alphaParsed, 0, 100, true);
      }
    }
    let rgbHex = require("rgb-hex");
    if (alpha !== null) {
      return rgbHex(redColor, greenColor, blueColor, alpha);
    } else {
      return rgbHex(redColor, greenColor, blueColor);
    }
  } else if (colorType.toLowerCase() === "hex") {
    if (BotSettings.validate.Hex(input) === true) {
      let hexRgb = require("hex-rgb");
      let rgbCode = hexRgb(input);
      if (objReq === true) {
        return { red: rgbCode[0], green: rgbCode[1], blue: rgbCode[2] };
      } else {
        return rgbCode;
      }
    }
  }
  return false;
};

BotSettings.validate.Color = input => {
  if (BotSettings.assist.validateNumber(input) === true) {
    let inputParsed = parseInt(input);
    if (inputParsed >= 0 && inputParsed <= 255) {
      return true;
    }
  }
  return false;
};

BotSettings.validate.Hex = input => {
  var re = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)|(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i;
  if (re.test(input) === true) {
    return true;
  }
  return false;
};

BotSettings.validate.Integer = input => {
  return BotSettings.assist.validateNumber(input);
};

BotSettings.resolve.MinMax = (input1, input2, choice = "float") => {
  if (choice.toLowerCase() === "float") {
    if (
      BotSettings.validate.FloatUnrestrict(input1) &&
      BotSettings.validate.FloatUnrestrict(input2)
    ) {
      let num1 = parseFloat(input1);
      let num2 = parseFloat(input2);
      if (num1 > num2) {
        return { min: num2, max: num1 };
      } else if (num1 < num2) {
        return { min: num1, max: num2 };
      } else {
        return { min: num1, max: num2 };
      }
    }
  } else if (choice.toLowerCase() === "int") {
    if (
      BotSettings.validate.Integer(input1) &&
      BotSettings.validate.Integer(input2)
    ) {
      let num1 = parseInt(input1);
      let num2 = parseInt(input2);
      if (num1 > num2) {
        return { min: num2, max: num1 };
      } else if (num1 < num2) {
        return { min: num1, max: num2 };
      } else {
        return { min: num1, max: num2 };
      }
    }
  }
  return null;
};

BotSettings.validate.Float = input => {
  var n = /^((\.\d+)|(\d+(\.\d+)?))$/;
  //var n = /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/;
  if (n.test(input) === true) {
    return true;
  }
  return false;
};

BotSettings.validate.FloatUnrestrict = input => {
  var n = /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/;
  if (n.test(input) === true) {
    return true;
  }
  return false;
};

BotSettings.resolve.NumberArr = (input, arr, arrType = "string") => {
  if (arrType.toLowerCase() === "integer") {
    let num =
      BotSettings.assist.validateNumber(input) === true
        ? parseInt(input)
        : null;
    if (num === null) {
      return false;
    } else {
      if (Array.isArray(arr) === true) {
        if (arr.includes(num)) {
          return true;
        }
        return false;
      }
      return false;
    }
  } else if (arrType.toLowerCase() === "float") {
    let num =
      BotSettings.validate.Float(input) === true ? parseFloat(input) : null;
    if (num === null) {
      return false;
    } else {
      if (Array.isArray(arr) === true) {
        if (arr.includes(num) === true) {
          return true;
        }
        return false;
      }
      return false;
    }
  } else if (arrType.toLowerCase() === "string") {
    if (Array.isArray(arr) === true) {
      if (arr.includes(input)) {
        return true;
      }
      return false;
    }
    return false;
  }
  return false;
};

BotSettings.validate.Range = (
  input,
  start,
  end,
  validInput = false,
  typeInput = "integer"
) => {
  if (validInput === true) {
    if (input >= start && input <= end) {
      return true;
    }
  } else {
    if (
      BotSettings.assist.validateNumber(input) === true ||
      BotSettings.validate.Float(input) === true ||
      BotSettings.validate.FloatUnrestrict(input) === true
    ) {
      let inputParsed = "";
      if (
        BotSettings.assist.validateNumber(input) === true &&
        typeInput.toLowerCase() === "integer"
      ) {
        inputParsed = parseInt(input);
      } else if (
        BotSettings.validate.Float(input) === true &&
        typeInput.toLowerCase() === "float"
      ) {
        inputParsed = parseFloat(input);
      } else if (
        BotSettings.validate.FloatUnrestrict(input) === true &&
        typeInput.toLowerCase() === "floatun"
      ) {
        inputParsed = parseFloat(input);
      }
      if (inputParsed >= start && inputParsed <= end) {
        return true;
      }
    }
  }
  return false;
};

BotSettings.assist.ArrayMove = (input, fromIndex, toIndex) => {
  if (Array.isArray(input) === true) {
    let from = fromIndex,
      to = toIndex;
    input.splice(to, 0, input.splice(from, 1)[0]);
    return input;
  }
  return false;
};

BotSettings.assist.canRunIn = (data, cmdObj) => {
  if (cmdObj.runIn.includes(data.channel.type)) return true;
  else return false;
};

BotSettings.assist.permissionHelper = data => {
  let user = data.member;
  if (!user) user = data.author;
  return BotSettings.assist.permission(user);
};

BotSettings.assist.permissionCheck = function(data, permlvl) {
  let user = data.member;
  if (!user) user = data.author;
  return BotSettings.assist
    .permission(user)
    .then(value => {
      if (parseInt(value) < permlvl) return false;
      else return true;
    })
    .catch(err => {
      console.log(err);
      return false;
    });
};

String.prototype.toCapFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

BotSettings.assist.findUser = (message, args) => {
  return (
    message.mentions.users.first() ||
    message.client.users.get(args) ||
    message.client.users.find(userino =>
      userino.username.toLowerCase().includes(args.toLowerCase())
    )
  );
};

BotSettings.assist.error = (
  errorText,
  channel,
  initMsg = "",
  imgLink = null
) => {
  let embed = new Discord.MessageEmbed();
  embed.setColor(0xee3737);
  if (imgLink !== null) {
    embed.setImage(imgLink);
  }
  embed.setDescription(`:x: ${errorText}`);
  channel.send(initMsg, { embed: embed });
};

BotSettings.assist.serverSpecs = guild => {
  let stats = {
    presence: {},
    member: { total: 0 },
    channels: { voice: 0, text: 0, total: 0 }
  };
  stats["presence"]["online"] = guild.members.filter(
    x => x.user.presence.status === "online"
  ).size;
  stats["presence"]["dnd"] = guild.members.filter(
    x => x.user.presence.status === "dnd"
  ).size;
  stats["presence"]["idle"] = guild.members.filter(
    x => x.user.presence.status === "idle"
  ).size;
  stats["presence"]["offline"] = guild.members.filter(
    x => x.user.presence.status === "offline"
  ).size;
  stats["member"]["botCount"] = guild.members.filter(
    x => x.user.bot === true
  ).size;
  stats["member"]["memberCount"] = guild.members.filter(
    x => x.user.bot === false
  ).size;
  stats["member"]["total"] =
    parseInt(stats["member"]["botCount"]) +
    parseInt(stats["member"]["memberCount"]);
  stats["channels"]["text"] = guild.channels.filter(
    x => x.type === "text"
  ).size;
  stats["channels"]["voice"] = guild.channels.filter(
    x => x.type === "voice"
  ).size;
  stats["channels"]["total"] =
    parseInt(stats.channels.text) + parseInt(stats.channels.voice);
  return stats;
};

BotSettings.assist.matchStr = (string, find) => {
  return (string.match(new RegExp(find, "g")) || []).length;
};

BotSettings.assist.validateCorrectTimeZone = time => {
  let pattern = new RegExp(/(\+|\-)(((0|1)\d)|(\d{1}))\:(\d{2})/, "g");
  return pattern.test(time);
};

BotSettings.assist.getPresence = (member, option = "status") => {
  switch (option) {
    case "status":
      return member.user.presence.status;
    case "game":
      return member.user.presence.game;
    default:
      return member.user.presence.status;
  }
};

process.on("uncaughtException", function(err) {
  console.log(err);
});

BotSettings.assist.getRegion = (region, option = "no format") => {
  let momentTz = require("moment-timezone");
  if (option.toLowerCase() === "no format") {
    return momentTz().tz(BotSettings.discordServers[region].timezone);
  } else if (option.toLowerCase() === "default") {
    return momentTz()
      .tz(BotSettings.discordServers[region].timezone)
      .format("MMMM Do YYYY, h:mm:ss a");
  } else if (option.toLowerCase() === "value") {
    return BotSettings.discordServers[region].timezone;
  } else if (option.toLowerCase() === "format") {
    return momentTz()
      .tz(BotSettings.discordServers[region].timezone)
      .format();
  } else {
    return momentTz()
      .tz(BotSettings.discordServers[region].timezone)
      .format("ha z");
  }
};

BotSettings.assist.convertTimeZone = time => {
  let timeSplit = time.split(":");
  let hourParsed = parseInt(timeSplit[0]);
  let minuteParsed = parseInt(timeSplit[1]);
  return parseInt(hourParsed * 60) + parseInt(minuteParsed * 1);
};

BotSettings.assist.checkCmd = cmdName => {
  let moduleObj = Loader.findModules("discord", cmdName);
  return moduleObj;
};

BotSettings.assist.getUpTime = () => {
  var d = Math.floor(process.uptime() / 86400);
  var hrs = Math.floor((process.uptime() % 86400) / 3600);
  var min = Math.floor(((process.uptime() % 86400) % 3600) / 60);
  var sec = Math.floor(((process.uptime() % 86400) % 3600) % 60);

  if (d === 0 && hrs !== 0) {
    return `${hrs} hrs, ${min} mins, ${sec} seconds`;
  } else if (d === 0 && hrs === 0 && min !== 0) {
    return `${min} mins, ${sec} seconds`;
  } else if (d === 0 && hrs === 0 && min === 0) {
    return `${sec} seconds`;
  } else {
    return `${d} days, ${hrs} hrs, ${min} mins, ${sec} seconds`;
  }
};

BotSettings.roman.toDecimal = (roman, checkIsValid = true) => {
  if (typeof roman !== "string") {
    return "Roman numerals must be a string!";
  }
  roman = roman.trim();
  var value = 0;
  for (var i = 0; i < roman.length; i++) {
    var ch = BotSettings.roman.romanToDecimal[roman[i]];

    if (!ch) {
      return "Unknown roman numeral: " + roman[i] + " at position " + (i + 1);
    }
    if (roman[i + 1] === "̅") {
      ch *= 1000;
      i++;
    }
    var next = BotSettings.roman.romanToDecimal[roman[i + 1]];
    if (roman[i + 2] === "̅") {
      next *= 1000;
    }
    if (!next || ch >= next) {
      value += ch;
    } else {
      value -= ch;
    }
  }
  if (checkIsValid) {
    let validRoman = BotSettings.roman.toRoman(value);
    if (validRoman !== roman) {
      return roman + " is not a valid Roman Numerals.  Should be " + validRoman;
    }
  }
  return value;
};

BotSettings.roman.toRoman = value => {
  var reg = /^\d+$/;
  if (reg.test(value) === true) {
    value = parseInt(value, 10);
    if (value <= 0) {
      return "";
    }
    var roman = "";
    BotSettings.roman.decimalToRoman.forEach(numeral => {
      while (value >= numeral.v) {
        roman += numeral.r;
        value -= numeral.v;
      }
    });
    return roman;
  } else {
    return "";
  }
};

BotSettings.roman.romanToDecimal = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000
};

BotSettings.roman.decimalToRoman = [
  { v: 1000000, r: "M̅" },
  { v: 900000, r: "X̅M̅" },
  { v: 500000, r: "D̅" },
  { v: 400000, r: "C̅D̅" },
  { v: 100000, r: "C̅" },
  { v: 90000, r: "X̅C̅" },
  { v: 50000, r: "L̅" },
  { v: 40000, r: "X̅L̅" },
  { v: 10000, r: "X̅" },
  { v: 9000, r: "I̅X̅" },
  { v: 5000, r: "V̅" },
  { v: 4000, r: "I̅V̅" },
  { v: 1000, r: "M" },
  { v: 900, r: "CM" },
  { v: 500, r: "D" },
  { v: 400, r: "CD" },
  { v: 100, r: "C" },
  { v: 90, r: "XC" },
  { v: 50, r: "L" },
  { v: 40, r: "XL" },
  { v: 10, r: "X" },
  { v: 9, r: "IX" },
  { v: 5, r: "V" },
  { v: 4, r: "IV" },
  { v: 1, r: "I" }
];

BotSettings.validate.Port = port => {
  return port > 0 && port <= 0xffff;
};

BotSettings.assist.prettyTime = (unixTime, verbose = false) => {
  let prettyMs = require("pretty-ms");
  if (verbose === false) {
    return prettyMs(parseInt(unixTime));
  }
  return prettyMs(parseInt(unixTime / 1000), { verbose: verbose });
};

BotSettings.assist.getTime = (unixTime, details = false) => {
  let d = Math.abs(parseInt(unixTime) - new Date().getTime()) / 1000;
  let r = {};
  var s = {
    // structure
    year: 31536000,
    month: 2592000,
    week: 604800, // uncomment row to ignore
    day: 86400, // feel free to add your own row
    hour: 3600,
    minute: 60,
    second: 1
  };
  Object.keys(s).forEach(key => {
    r[key] = Math.floor(d / s[key]);
    d -= r[key] * s[key];
  });

  if (details === true) {
    let finalStr = "";
    if (r.year !== 0) {
      let sPart = r.year >= 1 ? "s" : "";
      finalStr += r.year + " year" + sPart;
    }
    if (r.month !== 0) {
      let sPart = r.month >= 1 ? "s" : "";
      if (r.year !== 0) {
        finalStr += ", ";
      }
      finalStr += r.month + " month" + sPart;
    }
    if (r.week !== 0) {
      let sPart = r.week >= 1 ? "s" : "";
      if (r.year !== 0 || r.month !== 0) {
        finalStr += ", ";
      }
      finalStr += r.week + " week" + sPart;
    }
    if (r.day !== 0) {
      let sPart = r.day >= 1 ? "s" : "";
      if (r.year !== 0 || r.month !== 0 || r.week !== 0) {
        finalStr += ", ";
      }
      finalStr += r.day + " day" + sPart;
    }
    if (r.hour !== 0) {
      let sPart = r.hour >= 1 ? "s" : "";
      if (r.year !== 0 || r.month !== 0 || r.week !== 0 || r.day !== 0) {
        finalStr += ", ";
      }
      finalStr += r.hour + " hour" + sPart;
    }
    if (r.minute !== 0) {
      let sPart = r.minute >= 1 ? "s" : "";
      if (
        r.year !== 0 ||
        r.month !== 0 ||
        r.week !== 0 ||
        r.day !== 0 ||
        r.hour !== 0
      ) {
        finalStr += ", ";
      }
      finalStr += r.minute + " minute" + sPart;
    }
    if (r.second !== 0) {
      let sPart = r.second >= 1 ? "s" : "";
      if (
        r.year !== 0 ||
        r.month !== 0 ||
        r.week !== 0 ||
        r.day !== 0 ||
        r.hour !== 0 ||
        r.minute !== 0
      ) {
        finalStr += ", ";
      }
      finalStr += r.second + " second" + sPart;
    }
    return finalStr;
  }
  return r;
};

BotSettings.assist.decodeHTML = text => {
  var map = { gt: ">" /* , … */ };
  return text.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
    if ($1[0] === "#") {
      return String.fromCharCode(
        $1[1].toLowerCase() === "x"
          ? parseInt($1.substr(2), 16)
          : parseInt($1.substr(1), 10)
      );
    } else {
      return map.hasOwnProperty($1) ? map[$1] : $0;
    }
  });
};

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

BotSettings.assist.getConstants = name => {
  if (
    ConstantVars.hasOwnProperty(name) === true ||
    ConstantVars.hasOwnProperty(name.toLowerCase()) === true
  ) {
    if (ConstantVars.hasOwnProperty(name) === true) {
      return ConstantVars[name];
    } else if (ConstantVars.hasOwnProperty(name.toLowerCase())) {
      return ConstantVars[name];
    }
  } else {
    return undefined;
  }
};
