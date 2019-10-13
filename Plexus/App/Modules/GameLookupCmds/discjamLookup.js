const moduleInfo = {
    name: "discjam",
    truename: "discjam",
    platformOnly: "discord",
    author: "Manny",
    contributors: [""]
}

const usage = {
    name: "discjam",
    cmdName: "discjam",
    aliases: ["discjam", "disctionary"],
    args: {min: 1, max: 3},
    description: "Finds something on the Disc Jam Disctionary",
    usage: "[command:str]",
    exampleUsage: "disctionary Hasher",
    runIn: ["dm", "text"],
    categories: "Game Lookup",
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

discCmd = function(bot, message, args, time, prefixUsed, shardId) {
    return new Promise((resolve, reject) => {
        let sPath = "./../../Storage/PlexusBot-2b3c7c63f1a3.json";
        if(!BotSettings.games.hasOwnProperty("discjam")) {
            let cred = require(sPath);
            BotSettings.games.discjam = {}
            BotSettings.games.discjam.cred = cred;
            let GSpread = require("google-spreadsheet");
            BotSettings.games.discjam.spreadsheet = new GSpread("10x159dVPtLWXmwxv8SOZfVBGo3XylJoeLiOwhQEix_8");
            BotSettings.games.discjam.spreadsheet.useServiceAccountAuth(BotSettings.games.discjam.cred, (err, data) => {
                if(err) {
                    Logger.sendLog("Error when loading spreadsheet.... " + err, "CRITICAL", __filename);
                    delete BotSettings.games.discjam;
                    BotSettings.assist.error("There was an error when trying to set up the google spreadsheet logger.... " + err, message.channel);
                    return resolve({response: "", silent: true});
                } else {
                    //loaded correctly
                    disctionaryCmd(bot, message, args, time, prefixUsed).then((resp) => {
                        return resolve(resp);
                    }).catch(err2 => {
                        return reject(err2);
                    })
                }
            });
        } else {
            disctionaryCmd(bot, message, args, time, prefixUsed).then((resp) => {
                return resolve(resp);
            }).catch(err2 => {
                return reject(err2);
            })
        }
    });
}

disctionaryCmd = (bot, message, args, time, prefixUsed) => {
    return new Promise((resolve, reject) => {
        message.reply("getting information about your request for you shortly....").then((msgObj) => {
            let discSearch = args.join().replace(/,/g, ' ').trim();

            let cellMax = 10;
            let promiseArray = [];
            let rowArr = [];
            let exactRowArr = [];
            BotSettings.games.discjam.spreadsheet.getInfo((err, info) => {
                Logger.sendLog("Loaded Doc: " + info.title + " by " + info.author.email);
                let sheet = info.worksheets[0];

                sheet.getCells({
                    'min-row': 4,
                    'max-col': cellMax
                }, (err2, cells) => {
                    if(err2) {
                        Logger.sendLog("There was an error when getting the cell Data.... " + err2, "CRITICAL", __filename);
                        BotSettings.assist.error("There was an error when trying to retrieve the cell data.  Please try again.... ", message.channel);
                        return resolve({response: "", silent: true});
                    }
                    for(let i = 0; i < cells.length; i++) {
                        let cell = cells[i];
                        //9 = keyword
                        if(cell.col === 1 || cell.col === 9) {
                            //shot terminology or keyword
                            let cellVal = cell.value;
                            cellVal = cellVal.toLowerCase();
                            if(cellVal === discSearch.toLowerCase() || cellVal.indexOf(discSearch.toLowerCase()) >= 0) {
                                //matches
                                if(!((!rowArr.includes(cell.row) && exactRowArr.includes(cell.row)) || (rowArr.includes(cell.row) && !exactRowArr.includes(cell.row)))) {
                                    //not in array
                                    if(cellVal === discSearch.toLowerCase()) {
                                        //exact match
                                        exactRowArr.push(cell.row);
                                    } else {
                                        rowArr.push(cell.row);
                                    }
                                    promiseArray.push(getRowCell(cell.row, cellMax, sheet));
                                }
                            }
                        }
                    }

                    Promise.all(promiseArray).then((values) => {
                        let x = false;
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle("Disc-Jam Disctionary");
                        embed.setColor("RANDOM");
                        embed.setURL('https://docs.google.com/spreadsheets/d/10x159dVPtLWXmwxv8SOZfVBGo3XylJoeLiOwhQEix_8/edit#gid=0');
                        embed.setTimestamp();
                        values.forEach((value) => {
                            let twitchMsg = "";
                            twitchMsg += "Disc-Jam Disctionary";
                            Object.keys(value).forEach((key) => {
                                if(discSearch.toLowerCase() === key.toLowerCase() || key.toLowerCase().indexOf(discSearch.toLowerCase()) >= 0) {
                                    //exact
                                    let entireMessage = "";
                                    embed.addField("Found exact result on the shot", (value[key].shot !== null) ? value[key].shot : "");
                                    entireMessage += (value[key].shot !== null) ? "Shot: " + value[key].shot + "\n" : "";
                                    twitchMsg += "\n\t" + (value[key].shot !== null) ? "Shot: " + value[key].shot + "\n" : "";
                                    entireMessage += (value[key].desc !== null) ? "Desc: " + value[key].desc + "\n" : "";
                                    twitchMsg += "\n\t" + (value[key].desc !== null) ? "Desc: " + value[key].desc + "\n" : "";
                                    entireMessage += (value[key].img !== null) ? "Img Link: " + value[key].img + "\n" : "";
                                    if(value[key].img !== null) {
                                        let imageLink = value[key].img;
                                        if( (imageLink.indexOf("http") === 0 || imageLink.indexOf("https") && imageLink.indexOf("imgur.com") >= 0)) {
                                            //set the image after adding the modifications
                                            imageLink = imageLink.replace("imgur.com", "i.imgur.com");
                                            imageLink = imageLink + ".png";
                                            embed.setImage(imageLink);
                                            twitchMsg += "\n\t" + (value[key].img !== null) ? "Img Link: " + imageLink + "\n" : "";
                                        }
                                    }
                                    entireMessage += (value[key].date !== null) ? "Date added: " + value[key].date + "\n" : "";
                                    twitchMsg += "\n\t" + (value[key].date !== null) ? "Date added: " + value[key].date + "\n" : "";
                                    entireMessage += (value[key].keyword !== null) ? "Keyword: " + value[key].keyword + "\n" : "";
                                    twitchMsg += "\n\t" + (value[key].keyword !== null) ? "Keyword: " + value[key].keyword + "\n" : "";

                                    embed.addField("Info", entireMessage);
                                } else {
                                    let entireMessage = "";
                                    embed.addField("Found additional result on the shot", (value[key].shot !== null) ? value[key].shot : "");
                                    entireMessage += (value[key].shot !== null) ? "Shot: " + value[key].shot + "\n" : "";
                                    twitchMsg += "\n\t" + (value[key].shot !== null) ? "Shot: " + value[key].shot + "\n" : "";
                                    entireMessage += (value[key].desc !== null) ? "Desc: " + value[key].desc + "\n" : "";
                                    twitchMsg += "\n\t" + (value[key].desc !== null) ? "Desc: " + value[key].desc + "\n" : "";
                                    if(value[key].img !== null) {
                                        let imageLink = value[key].img;
                                        if( (imageLink.indexOf("http") === 0 || imageLink.indexOf("https") && imageLink.indexOf("imgur.com") >= 0)) {
                                            //set the image after adding the modifications
                                            imageLink = imageLink.replace("imgur.com", "i.imgur.com");
                                            imageLink = imageLink + ".png";
                                            entireMessage += (value[key].img !== null) ? "Img Link: " + imageLink + "\n" : "";
                                            twitchMsg += "\n\t" + (value[key].img !== null) ? "Img Link: " + imageLink + "\n" : "";
                                        } else {
                                            entireMessage += (value[key].img !== null) ? "Img Link: " + value[key].img + "\n" : "";
                                            twitchMsg += "\n\t" + (value[key].img !== null) ? "Img Link: " + value[key].img + "\n" : "";
                                        }
                                    }
                                    entireMessage += (value[key].date !== null) ? "Date added: " + value[key].date + "\n" : "";
                                    twitchMsg += "\n\t" + (value[key].date !== null) ? "Date added: " + value[key].date + "\n" : "";
                                    entireMessage += (value[key].keyword !== null) ? "Keyword: " + value[key].keyword + "\n" : "";
                                    twitchMsg += "\n\t" + (value[key].keyword !== null) ? "Keyword: " + value[key].keyword + "\n" : "";

                                    embed.addField("Info", entireMessage);
                                }
                            });
                        });
                        msgObj.delete();
                        return resolve({response: message.author, embed: embed, silent: false});
                    }).catch(errVals => {
                        Logger.sendLog("There was an error making a lot of promises... " + errVals, "CRITICAL", __filename);
                        BotSettings.assist.error("There was an error thrown for some reason.  Please try again.", message.channel);
                        return resolve({response: "", silent: true});
                    });
                });
            });
        }).catch(errMsg => {
            Logger.sendLog("Error sending message for some reason....", "CRITICAL", __filename);
            return resolve({response: "", silent: true});
        });
    });
}

function getRowCell(row, col, sheet) {
    return new Promise((resolve, reject) => {
        sheet.getCells({
            'min-row': row,
            'max-row': row,
            'max-col': col
        }, function(err, cells) {
            if(err) {
                console.log("error: " + err);
                return reject(err);
            } else {
                let cellArray = {};
                //default: shot, desc, keyword
                //always there
                //tricky cases: img, date
                //3, default
                //4, either no img or no date
                //5, img, date, and keyword
                switch(cells.length) {
                    case 3:
                        //no img, date, but keyword
                        let shot_trick3 = cells[0].value;
                        let desc3 = cells[1].value;
                        let keyword3 = cells[2].value;
                        cellArray[keyword3] = {shot: shot_trick3, desc: desc3, img: null, date: null, keyword: keyword3};
                        break;
                    case 4:
                        let httpLink4 = "http";
                        let httpsLink4 = "https";
                        let shot_trick4 = cells[0].value;
                        let desc4 = cells[1].value;
                        let imgordate4 = cells[2].value;
                        let keyword4 = cells[3].value;
                        if((imgordate4.indexOf(httpLink4) === 0 || imgordate4.indexOf(httpsLink4) === 0)) {
                            cellArray[keyword4] = {shot: shot_trick4, desc: desc4, img: imgordate4, date: null, keyword: keyword4};
                        } else if((imgordate4.indexOf(httpLink4) !== 0 || imgordate4.indexOf(httpsLink4) !== 0)) {
                            cellArray[keyword4] = {shot: shot_trick4, desc: desc4, img: null, date: imgordate4, keyword: keyword4};
                        }
                        break;
                    case 5:
                        let httpLink5 = "http";
                        let httpsLink5 = "https";
                        let shot_trick5 = cells[0].value;
                        let desc5 = cells[1].value;
                        let img5 = cells[2].value;
                        let date5 = cells[3].value;
                        let keyword5 = cells[4].value;
                        cellArray[keyword5] = {shot: shot_trick5, desc: desc5, img: img5, date: date5, keyword: keyword5};
                        break;
                    default:
                        let shot_trick1 = cells[0].value;
                        let desc1 = "", keyword1 = "";
                        if(cells.length === 1) {
                            cellArray[shot_trick1] = {shot: shot_trick1, desc: desc1, img: null, date: null, keyword: shot_trick1};
                        } else {
                            let desc1 = cells[1].value;
                            let keyword1 = cells[2].value;
                            cellArray[keyword1] = {shot: shot_trick1, desc: desc1, img: null, date: null, keyword: keyword1};
                        }
                        break;
                }
                return resolve(cellArray);
            }
        });
    });
}

this.commands = [
    {module: moduleInfo.truename, moduleInfo: moduleInfo, names: usage.aliases, args: usage.args, usage: usage, run: discCmd}
];
