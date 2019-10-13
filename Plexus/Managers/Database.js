
// Load Requirements
const sql = require('promise-mysql');

var path = require('path');

// Class Function
function Database() {
}

this.setupDatabase = function(_hostname = "158.69.209.32", _username = "eaaliprantis", _password = "6EE1014&28a", _database = "Glados_server", _port = 23306) {
  this.hostname = _hostname;
	this.database = _database;
	this.username = _username;
	this.password = _password;
    this.port = _port;
	this.connection;
  this.openConnection();
  global.Database = this;
}

this.openConnection = function() {
	this.connection = sql.createPool({
		host     : this.hostname,
		user     : this.username,
		password : this.password,
		database : this.database,
        port: this.port
	}); this.isReady = this.isConnected = true;
};

this.callStatement = function(sql) { return this.connection.query(sql); }

this.callPreparedStatement = function(sql, values) { return this.connection.query(sql, values); };

// Files in Path via Array
this.getFiles = function(dir, check=undefined) {
    let filelist = [];
    var path = path || require('path'); var fs = fs || require('fs'), files = fs.readdirSync(dir); filelist = filelist || [];
    files.map((file) => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            this.getFiles(path.join(dir, file), check, filelist).map((subfile) => {
                if(subfile !== undefined && subfile !== null && subfile.includes(check)) {
                    filelist.push({ dir: dir, file: file, subfile: subfile });
                } else {
                    if(check === undefined) { filelist.push({ dir: dir, file: file, subfile: subfile }); } else { }
                }
                }); } else { filelist.push(file); }});
    return filelist;
};

// Split a String
this.splitString = ((string, num) => {
  let length = string.length,
      output = [],
      currentStr = string;
  while(currentStr.length !== 0) {
    output.push(currentStr.substring(0, num));
    currentStr = currentStr.substring(num, -1);
  } return output;
});

// Walks Array Recursively
this.arrayWalkRecursive = ((array, funcname, userdata) => {
  if(!array || typeof array !== 'object') { return false; }
  if(typeof func !== 'function') { return false; }

	for (let key in array) {
		if (Object.prototype.toString.call(array[key]) === '[object Array]') {
			let funcArgs = [array[key], funcname];
			if (arguments.length > 2) { funcArgs.push(userdata); }
			if (this.arrayWalkRecursive.apply(null, funcArgs) === false) { return false; } continue;
		}
		try { if (arguments.length > 2) { funcname(array[key], key, userdata); } else { funcname(array[key], key); }
		} catch (e) { return false; }
	} return true;
});

this.splitSentenceStr = (string) => {
	let sentences = string.match(/\(?[^\.\?\!]+[\.!\?]\)?/g);
	this.arrayWalkRecursive(sentences, this.encodeItems); return sentences;
};

this.splitHtmlStr = (string) => {
	let sentences = string.match(/<([^\s]+)(\s[^>]*?)?(?<!\/)>/i);
	this.arrayWalkRecursive(sentences, this.encodeItems); return sentences;
};

this.encodeItems = (item, keys) => { return unescape(encodeURIComponent(item)); };

this.encodeUTF8 = (str) => { return unescape(encodeURIComponent(str)); };

this.decodeUTF8 = (str) => { return decodeURIComponent(escape(str)); };
