var path = require('path');
var color = require('colors/safe');
var multicolors = require("ansi-256-colors");

function Logger() { }

this.setupLogger = function(opts={}) {
    this.colors = color;
    this.list = this.getAvailColors();
    this.loadAdditional = (opts.hasOwnProperty("loadAdditional")) ? opts.loadAdditional : true;
    this.additionalColors = (opts.hasOwnProperty("additionalColors")) ? opts.additionalColors : true;
    this.original = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        colors: require("colors/safe")
    }
    this.opts = opts;
    this.requirements = {
        colors: require("colors/safe")
    }
    //this.loadLogger();
    global.Logger = this;
};

this.loadLogger = () => {
    console.log = (message) => this.original.log((this.customFormat(message, new Date(), 'info')));
    console.warn = (message) => this.original.warn((this.customFormat(message, new Date(), "warn")));
    console.error = (message) => this.original.error((this.customFormat(message, new Date(), "critical")));
    console.stacktrace = (errorObject) => console.error(errorObject.message + "\n" + errorObject.stack);
}

this.getAvailColors = function() {
    let obj = [
      {color: "red", meaning: ["CRITICAL", "TIME"], default: false, obj: this.colors.red},
      {color: "yellow", meaning: ["WARNING", "LOADING", "RELOAD"], default: false, obj: this.colors.yellow},
      {color: "white", meaning: ["INFO"], default: true, obj: this.colors.white},
      {color: "magenta", meaning: ["GLOBAL"], default: false, obj: this.colors.magenta},
      {color: "white", meaning: ["BBB"], default: false, obj: this.colors.white},
      {color: "cyan", meaning: ["INIT"], default: false, obj: this.colors.cyan},
      {color: "gray", meaning: ["DDD"], default: false, obj: this.colors.gray},
      {color: "blue", meaning: ["EEE"], default: false, obj: this.colors.blue},
      {color: "green", meaning: ["TASK_AWAIT(CONNECT)", "TASK_FINISH(CONNECT)", "LOADED", "CMD", "STATS"], default: false, obj: this.colors.green},
    ];
    return obj;
}

this.componentToHex = function(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

this.rgbToHex = function(r,g,b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
}

this.hexToRgb = function(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

this.getColor = function(meaning) {
  for(let i = 0; i < this.list.length; i++) {
    if(this.list[i].meaning.includes(meaning.toUpperCase())) {
      return this.list[i];
    }
  }
  //doesn't exist, therefore get default color
  return this.getDefaultColor();
}

this.getDefaultColor = function() {
  for(let i = 0; i < this.list.length; i++) {
    if(this.list[i].default === true) {
      return this.list[i];
    }
  }
  return null;
}

this.replaceAll = (find, replace, str) => {
    find = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return str.replace(new RegExp(find, 'g'), replace);
}

this.sendStackTrace = (stack) => {
    console.stacktrace(stack);
}

this.customFormat = (message, timestamp, level) => {
    if(message === "" || message === undefined || message === null) { return; }
    let chosenColorObj = this.getColor(level);
    timestamp = timestamp.toString().substr(4, 20);
    let date = timestamp.split(" ");
    let t1 = this.requirements.colors.green(date[0] + " " + date[1]);
    let time = this.requirements.colors.green(date[3]);

    let finalLevel = chosenColorObj.obj(level.toUpperCase());

    let dash = this.requirements.colors.cyan("-");
    let line = this.requirements.colors.cyan("|");
    message = this.requirements.colors.white(message);
    level = finalLevel;

    if(this.opts.additionalColors) {
        message = this.replaceAll('System ~', this.requirements.colors.blue('System ~'), message);
        message = this.replaceAll('Mod ~', this.requirements.colors.magenta('Mod ~'), message);
        message = this.replaceAll('Database ~', this.requirements.colors.yellow('Database ~'), message);
        message = this.replaceAll('Platform ~', this.requirements.colors.red('Platform ~'), message);
        message = this.replaceAll('|-->', this.requirements.colors.cyan('|-->'), message);
    }

    return `${t1} ${dash} ${time} ${dash} ${level} ${line} ${message}`;
}

this.sendLog = function(message, level="info", filename="UNDEFINED") {
    if(message === "" || message === undefined || message === null) { return; }
    let chosenColorObj = this.getColor(level);
    let finalLevel = chosenColorObj.obj(level.toUpperCase());
    let timestamp = (new Date()).toString().substr(16, 8);
    let finalTimeStamp = this.getColor("TIME").obj(timestamp);
    let location = path.basename(filename); location = location.replace('.js', '');
    let finalLocation = this.colors.green(location.toUpperCase());
    console.log(`<${finalLocation}>(${finalTimeStamp})[${finalLevel}] ${message}`);
};
