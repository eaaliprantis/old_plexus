function HelperClass() {}

this.preventInviteLink = (message) => {
    let content = message.content;
    var re = /(discord(\.gg|app\.com\/invite)\/([\w]{16}|([\w]+-?){3}))/
    if(re.test(content)) {
        return false;
    } else {
        return true;
    }
}

this.checkImage = (message) => {
    return new Promise((resolve, reject) => {

    })
}

class Assist {
    constructor() {}

    get ArrayMove(input, fromIndex, toIndex) {
        if(Array.isArray(input) === true) {
            input.splice(toIndex, 0, input.splice(fromIndex, 1)[0]);
            return input;
        }
        return false;
    }

    get createJson(input) {
        let jsonParse = null;
        try {
            jsonParse = JSON.parse(JSON.stringify(input));
        } catch(e) {
            jsonParse = null;
        }
        return jsonParse;
    }

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

    get escapeStr(input) {
        let SqlString = require("sqlstring");
        return SqlString.escape(input);
    }

    get KeyByValue(input, search, multi=false) {
        let keyLst = [];
        for(let prop in input) {
            if(input.hasOwnProperty(prop)) {
                if(input[prop] === search) {
                    if(multi === true) {
                        keyLst.push(prop);
                    } else {
                        return prop;
                    }
                }
            }
        }
        if(keyLst.length === 0) {
            return null;
        }
        return keyLst;
    }

    get GroupArray(arr) {
        let history = {};
        if(Array.isArray(arr)) {
            history = arr.reduce( function (prev, item) {
                if ( item in prev ) prev[item] ++;
                else prev[item] = 1;
                return prev;
            }, {} );
        } else {
            return null;
        }
        return history;
    }

    get findgcd(input, maxRange) {
        let mathjs = require("mathjs");
        let maxNumber = 1;
        for(let i = 1; i <= maxRange; i++) {
            let mathGcd = mathjs.gcd(input, i);
            if(mathGcd >= maxNumber) {
                maxNumber = mathGcd;
            }
        }
        return maxNumber;
    }

    get findgcf(input1, maxRange) {
        let highestGCF = 1;
        for(let j = 1; j <= maxRange; j++) {
            let num1 = input1;
            let num2 = j;

            var gcf = 1;
            var higher = num2;
            var lower = num1;

            if ( num1 > num2 ) {
                higher = num1;
                lower = num2;
            };

            for ( var i = 0; i < lower; i++ ) {
                if ( lower % i == 0 && higher % i == 0 && i > gcf ) {
                    gcf = i;
                };
            };
            if(gcf > highestGCF) {
                highestGCF = gcf;
            }
        }
        return highestGCF;
    }

    get toCapFirstLetter(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    get matchStr(string, find) {
        return (string.match(new RegExp(find, "g")) || []).length;
    }

    get convertTimeZone(time) {
        let timeSplit = time.split(":");
        let hourParsed = parseInt(timeSplit[0]);
        let minuteParsed = parseInt(timeSplit[1]);
        return parseInt(hourParsed * 60) + parseInt(minuteParsed * 1);
    }

    get getTime(unixTime, details=false) {
        let d = Math.abs(parseInt(unixTime) - new Date().getTime()) / 1000;
        let r = {};
        var s = { // structure
            year: 31536000,
            month: 2592000,
            week: 604800, // uncomment row to ignore
            day: 86400,   // feel free to add your own row
            hour: 3600,
            minute: 60,
            second: 1
        };
        Object.keys(s).forEach((key) => {
            r[key] = Math.floor(d / s[key]);
            d -= r[key] * s[key];
        });

        if(details === true) {
            let finalStr = "";
            if(r.year !== 0) {
                let sPart = (r.year >= 1) ? "s" : "";
                finalStr += r.year + " year" + sPart;
            }
            if(r.month !== 0) {
                let sPart = (r.month >= 1) ? "s" : "";
                if(r.year !== 0) {
                    finalStr += ", ";
                }
                finalStr += r.month + " month" + sPart;
            }
            if(r.week !== 0) {
                let sPart = (r.week >= 1) ? "s" : "";
                if(r.year !== 0 || r.month !== 0) {
                    finalStr += ", ";
                }
                finalStr += r.week + " week" + sPart;
            }
            if(r.day !== 0) {
                let sPart = (r.day >= 1) ? "s" : "";
                if(r.year !== 0 || r.month !== 0 || r.week !== 0) {
                    finalStr += ", ";
                }
                finalStr += r.day + " day" + sPart;
            }
            if(r.hour !== 0) {
                let sPart = (r.hour >= 1) ? "s" : "";
                if(r.year !== 0 || r.month !== 0 || r.week !== 0 || r.day !== 0) {
                    finalStr += ", ";
                }
                finalStr += r.hour + " hour" + sPart;
            }
            if(r.minute !== 0) {
                let sPart = (r.minute >= 1) ? "s" : "";
                if(r.year !== 0 || r.month !== 0 || r.week !== 0 || r.day !== 0 || r.hour !== 0) {
                    finalStr += ", ";
                }
                finalStr += r.minute + " minute" + sPart;
            }
            if(r.second !== 0) {
                let sPart = (r.second >= 1) ? "s" : "";
                if(r.year !== 0 || r.month !== 0 || r.week !== 0 || r.day !== 0 || r.hour !== 0 || r.minute !== 0) {
                    finalStr += ", ";
                }
                finalStr += r.second + " second" + sPart;
            }
            return finalStr;
        }
        return r;
    }

    get decodeHTML(text) {
        var map = {"gt":">" /* , … */};
        return text.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
            if ($1[0] === "#") {
                return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16)  : parseInt($1.substr(1), 10));
            } else {
                return map.hasOwnProperty($1) ? map[$1] : $0;
            }
        });
    }

    get replaceAll(str, search, replacement) {
        return str.replace(new RegExp(search, 'g'), replacement);
    }

    get sentenceSplit(input) {
        let str = input;
        if(this.isHTML(input) === true) {
            return null;
        }
        return str.match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g);
    }

    get isHTML(input) {
        let html = input;

        var openingTags, closingTags;

        html        = html.replace(/<[^>]*\/\s?>/g, '');      // Remove all self closing tags
        html        = html.replace(/<(br|hr|img).*?>/g, '');  // Remove all <br>, <hr>, and <img> tags
        openingTags = html.match(/<[^\/].*?>/g) || [];        // Get remaining opening tags
        closingTags = html.match(/<\/.+?>/g) || [];           // Get remaining closing tags

        return openingTags.length === closingTags.length ? true : false;
    }
}

class StringAssist {
    constructor() {}

    get toDecimal(roman, checkIsValid = true) {
        if(typeof(roman) !== "string") {
            return "Roman numbers must be a string!";
        }
        roman = roman.trim();
        let value = 0;
        for(var i = 0; i < roman.length; i++) {
            let ch = this.romanToDecimal[roman[i]];
            if(!ch) {
                return "Unknown roman numberal: " + roman[i] + " at position " + (i + 1);
            }
            if(roman[i+1] === '̅') {
                ch *= 1000;
                i++;
            }
            let next = this.romanToDecimal[roman[i+1]];
            if(roman[i+2] === '̅') {
                next *= 1000;
            }
            if(!next || ch >= next) {
                value += ch;
            } else {
                value -= ch;
            }
        }
        if(checkIsValid) {
            let validRoman = this.toRoman(value);
            if(validRoman !== roman) {
                return roman + ' is not a valid Roman Numerals.  Should be ' + validRoman;
            }
        }
        return value;
    }

    get toRoman(value) {
        let reg = /^\d+$/;
        if(reg.test(value) === true) {
            value = parseInt(value, 10);
            if(value <= 0) {
                return '';
            }
            let roman = '';
            this.decimalToRoman().forEach((numeral) => {
                while(value >= numeral.v) {
                    roman += numeral.r;
                    value -= numeral.v;
                }
            });
            return roman;
        } else {
            return '';
        }
    }

    get romanToDecimal() {
        return {
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000
        };
    }

    get decimalToRoman() {
        return [
            { v: 1000000, r: 'M̅' },
            { v: 900000, r: 'X̅M̅' },
            { v: 500000, r: 'D̅' },
            { v: 400000, r: 'C̅D̅' },
            { v: 100000, r: 'C̅' },
            { v: 90000, r: 'X̅C̅' },
            { v: 50000, r: 'L̅' },
            { v: 40000, r: 'X̅L̅' },
            { v: 10000, r: 'X̅' },
            { v: 9000, r: 'I̅X̅' },
            { v: 5000, r: 'V̅' },
            { v: 4000, r: 'I̅V̅' },
            { v: 1000, r: 'M' },
            { v: 900, r: 'CM' },
            { v: 500, r: 'D' },
            { v: 400, r: 'CD' },
            { v: 100, r: 'C' },
            { v: 90, r: 'XC' },
            { v: 50, r: 'L' },
            { v: 40, r: 'XL' },
            { v: 10, r: 'X' },
            { v: 9, r: 'IX' },
            { v: 5, r: 'V' },
            { v: 4, r: 'IV' },
            { v: 1, r: 'I' }
        ];
    }
}

class Validate {
    constructor() {}

    get SpotifyFormat(input) {
        let regex = new RegExp(/((artist)(:|\s+)([A-Za-z0-9]+))|((track)(:|\s+)([A-Za-z0-9]+))/, 'g');
        if(regex.test(input)) {
            let regexMatch = input.match(regex);
            let finalMatch = [];
            regexMatch.forEach((val) => {
                let regex2 = new RegExp(/((artist)(\s+)([A-Za-z0-9]+))|((track)(\s+)([A-Za-z0-9]+))/, 'g');
                if(regex2.test(val)) {
                    finalMatch.push(val.replace(new RegExp(/\s+/, 'g'), ":"));
                }
            });
            return finalMatch.join(" ");
        } else {
            return input;
        }
    }

    get vDate(input) {
        if(/([0-9][1-2]|[0-9])\/([0-2][0-9]|[3][0-1])\/((19|20)[0-9]{2})/.test(input)){
            var tokens = input.split('/');  //  text.split('\/');
            var day    = parseInt(tokens[0], 10);
            var month  = parseInt(tokens[1], 10);
            var year   = parseInt(tokens[2], 10);
            return true;
        } else {
            //show error
            //Invalid date forma
            return false;
        }
    }

    get vPort(input) {
        return port > 0 && port <= 65535;
    }

    get validateNumber(num) {
        if(num === undefined) {
            return false;
        }
        if(typeof(num) === "number") {
            return true;
        }
        if(num.match(/^\d+$/)){
            return true;
        }
        return false;
    }

    get validateColor(input) {
        if(this.validateNumber(input) === true) {
            let inputParsed = parseInt(input);
            if(inputParsed >= 0 && inputParsed <= 255) {
                return true;
            }
        }
        return false;
    }

    get validateHex(input) {
        var re  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)|(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i;
        if(re.test(input) === true) {
            return true;
        }
        return false;
    }

    get validateInteger(input) {
        return this.validateNumber(input);
    }

    get validateFloat(input, unrestricted=false) {
        let n = "";
        if(!unrestricted) {
            n = /^((\.\d+)|(\d+(\.\d+)?))$/;
        } else {
            n = /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/
        }
        if(n.test(input) === true) {
            return true;
        }
        return false;
    }

    get numberArr(input, arr, arrType="string") {
        if(arrType.toLowerCase() === "integer") {
            let num = (this.validateNumber(input)) === true ? parseInt(input) : null;
            if(num === null) {
                return false;
            } else {
                if(Array.isArray(arr) === true) {
                    if(arr.includes(num)) {
                        return true;
                    }
                    return false;
                }
                return false;
            }
        }
        if(arrType.toLowerCase() === "float") {
            let num = (this.validateFloat(input) === true) ? parseFloat(input) : null;
            if(num === null) {
                return false;
            }
            if(Array.isArray(arr) === true) {
                if(arr.includes(num) === true) {
                    return true;
                }
                return false;
            }
            return false;
        }
        if(arrType.toLowerCase() === "string") {
            if(Array.isArray(arr) === true) {
                if(arr.includes(input)) {
                    return true;
                }
                return false;
            }
            return false;
        }
    }

    get validateRange(input, start, end, validInput=false, typeInput="integer") {
        if(validInput === true) {
            if(input >= start && input <= end) {
                return true;
            }
        } else {
            if(
                this.validateNumber(input) === true ||
                this.validateFloat(input) === true ||
                this.validateFloat(input, true)) {
                let inputParsed = "";
                if(this.validateNumber(input) === true && typeInput.toLowerCase() === "integer") {
                    inputParsed = parseInt(input);
                } else if(this.validateFloat(input) === true && typeInput.toLowerCase() === "float") {
                    inputParsed = parseFloat(input);
                } else if(this.validateFloat(input, true) && typeInput.toLowerCase() === "floatun") {
                    inputParsed = parseFloat(input);
                }
                if(inputParsed >= start && inputParsed <= end) {
                    return true;
                }
            }
        }
        return false;
    }
}

class Resolve {
    constructor() {}

    get RNumber(num) {
        if(num === undefined) {
            return false;
        }
        if(typeof(num) === "number") {
            return true;
        }
        if(num.match(/^\d+$/)){
            return true;
        }
        return false;
    }

    get Int(input) {
        var regex = new RegExp(/([0-9]*)/);
        if(regex.test(input)){
            return parseInt(input);
        } else {
            return false;
        }
    }

    get Bool(input) {
        let yesnowords = require("yes-no-words");
        if(yesnowords.yes.map(z => {return z.toLowerCase()}).includes(input) === true || input == "true" || input == "1" || input == "on" || input == "t" || input == "yes" || input == "y") {
            return true;
        } else if(yesnowords.no.map(z => {return z.toLowerCase()}).includes(input) === true) {
            return false;
        } else {
            return false;
        }
    }

    get BoolAct(input) {
        if(input == "true" || input == "1" || input == "on" || input == "t" || input == "yes" || input == "y"){
            return true;
        } else if(input == "false" || input == "0" || input == "off" || input == "f" || input == "no" || input == "n") {
            return false;
        } else {
            return null;
        }
    }

    get distributeArray(input, divider, balanced=true) {
        if( divider < 2) {
            return [input];
        }
        let len = input.length, out = [], i = 0, size;

        if(len % divider === 0) {
            size = Math.floor(len / divider);
            while (i < len) {
                out.push(input.slice(i, i += size));
            }
        } else if(balanced) {
            while (i < len) {
                size = Math.ceil((len - i) / divider--);
                out.push(input.slice(i, i += size));
            }
        } else {
            divider--;
            size = Math.floor(len / divider);
            if(len % size === 0) {
                size--;
            }
            while( i < size * divider) {
                out.push(input.slice(i, i += size));
            }
            out.push(input.slice(size * n));
        }

        return out;
    }

    get characterLimitHandler(input, maxCharLimit, maxArrLen=-1) {
        let str = input;
        let chunks = [];

        if(Array.isArray(str) === true) {
            for(let i = 0; i < str.length; i++) {
                let words = str[i];
                if(chunks.length === 0) {
                    chunks.push(words + "\n");
                } else {
                    let currentWords = chunks[chunks.length - 1];
                    if(currentWords.length + words.length + "\n".length > maxCharLimit) {
                        chunks.push(words + "\n");
                    } else {
                        chunks[chunks.length - 1] = currentWords + words + "\n";
                    }
                }
            }
            if(chunks.length > maxArrLen && maxArrLen !== -1) {
                return [];
            }
            return chunks;
        } else {
            let splitArr = str.match(new RegExp('.{1,' + maxCharLimit + '}', 'g'));
            if(splitArr.length >= maxArrLen) {
                return [];
            }
            return splitArr;
        }
    }

    get RTime(input, to12=true) {
        if(to12 === true) {
            let splitTime = input.split(":");
            let hours = parseInt(splitTime[0]);
            let minutes = parseInt(splitTime[1]);
            let ampm = "am";
            if(hours > 12) {
                hours -= 12;
                ampm = "pm";
            }
            if(hours < 10) {
                hours = "0" + hours;
            }
            if(minutes < 10) {
                minutes = "0" + minutes;
            }
            return hours + ":" + minutes + " " + ampm;
        } else {
            let hours = "", minutes = "";
            if(input.toLowerCase().includes("pm")) {
                let splitColon = input.toLowerCase().split(":");
                hours = parseInt(splitColon[0]);
                if(hours < 12) {
                    hours += 12;
                }
                if(hours < 10) {
                    hours = "0" + hours;
                }
                minutes = parseInt(splitColon[1].replace("pm", ""));
                if(minutes < 10) {
                    minutes = "0" + minutes;
                }
            } else if(input.toLowerCase().includes("am")) {
                let splitColon = input.toLowerCase().split(":");
                hours = parseInt(splitColon[0]);
                if(hours == 12) {
                    hours -= 12;
                }
                if(hours < 10) {
                    hours = "0" + hours;
                }
                minutes = parseInt(splitColon[1].replace("am", ""));
                if(minutes < 10) {
                    minutes = "0" + minutes;
                }
            } else {
                return null;
            }
            return hours + ":" + minutes;
        }
    }

    get TimeFormat(input) {
        let regex = new RegExp(/^(([1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)?)|(([01]?[0-9]|2[0-3]):[0-5][0-9])$/, "i");
        if(regex.test(input) === true) {
            let hours = 0, minutes = 0;
            if(input.toLowerCase().includes("pm")) {
                let splitColon = input.toLowerCase().split(":");
                hours = parseInt(splitColon[0]);
                if(hours < 12) {
                    hours += 12;
                }
                if(hours < 10) {
                    hours = "0" + hours;
                }
                minutes = parseInt(splitColon[1].replace("pm", ""));
                if(minutes < 10) {
                    minutes = "0" + minutes;
                }
            } else if(input.toLowerCase().includes("am")) {
                let splitColon = input.toLowerCase().split(":");
                hours = parseInt(splitColon[0]);
                if(hours == 12) {
                    hours -= 12;
                }
                if(hours < 10) {
                    hours = "0" + hours;
                }
                minutes = parseInt(splitColon[1].replace("am", ""));
                if(minutes < 10) {
                    minutes = "0" + minutes;
                }
            } else {
                let splitColon = input.toLowerCase().split(":");
                hours = parseInt(splitColon[0]);
                minutes = parseInt(splitColon[1].replace("am", ""));
                if(hours < 10) {
                    hours = "0" + hours;
                }
                if(minutes < 10) {
                    minutes = "0" + minutes;
                }
            }
            return hours + ":" + minutes;
        } else {
            return null;
        }
    }
}

class DiscordResolve {
    constructor() {}

    get extractUser(input) {
        var userreg = new RegExp(/<@!?([0-9]{17,21})>/);
        var userreg2 = new RegExp(/id\:([0-9]{17,21})/);
        var userid = input;

        if(userreg.test(input)) {
            var reg = userreg.exec(input);
            userid = reg[1];
        } else if(userreg2.test(input)){
            userid = userreg2.exec(input)[1];
        } else {
            userid = input;
        }
        return userid;
    }

    get RoleArr(input) {
        let tmpArray = [];
        Object.keys(input).forEach(key => { if(input[key] === true) {tmpArray.push(key)}});
        return tmpArray;
    }
}
