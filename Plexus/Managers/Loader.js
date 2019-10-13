function Loader() { }

this.setupLoader = function() {
    return new Promise((resolve, reject) => {
        this.loadList().then(() => {
            global.Loader = this;
            this.getAllStats();
            return resolve();
        });
    });
};

this.loadOS = function() {
  var os = require('os');

  this.os = {type: os.type(), release: os.release(), platform: os.platform(), obj: os};
}

this.isWin = function() {
  return (this.os.platform === 'win32');
}

this.getSlash = function() {
  if(this.isWin() === true) {
    return "\\";
  }
  return "/";
}

this.loadList = function() {
    return new Promise((resolve, reject) => {
        this.loadOS();
        this.setGlobals();
        this.loadModules().then(() => {
            return resolve();
        }).catch((err) => {
            return reject(err);
        });
    });
}

this.clearAllStats = function() {
  Managers.Stats = [];
};

this.clearStats = function(name) {
  for(let i = 0; i < Managers.Stats.length; i++) {
    if(Managers.Stats[i].name.includes(name.toUpperCase())) {
      delete Managers.Stats[i];
      return true;
    }
  }
  return null;
}

this.addStats = function(obj) {
  if(Array.isArray(obj)) {
    obj.forEach((theobj) => {
      Managers.Stats.push(theobj);
    });
  } else {
    Managers.Stats.push(obj);
  }
};

this.getStats = (name) => {
    for(let i = 0; i < Managers.Stats.length; i++) {
        if(name.toLowerCase() === Managers.Stats[i].name.toLowerCase()) {
            return [true, Manager.Stats[i]];
        }
    }
    return [false, null];
};

this.getAllStats = function() {
  for(let i = 0; i < Managers.Stats.length; i++) {
    Logger.sendLog("-> " + Managers.Stats[i].name + " stats is: " + Managers.Stats[i].passed + "/" + Managers.Stats[i].failed + "/" + (Number(Managers.Stats[i].passed) + Number(Managers.Stats[i].failed)), "STATS", __filename);
  }
}

this.setGlobals = function() {
  global.Managers = {};
  global.Managers.Modules = [];
  global.Managers.Commands = [];
  global.Managers.Apis = [];
  global.Managers.Platforms = [];
  global.Managers.Utilities = [];
  global.Managers.Stats = [];
}

this.addModules = (list) => {
  if(Array.isArray(list)) {
    list.forEach((tModule) => {
      Managers.Modules.push(tModule);
    });
  } else {
    Managers.Modules.push(list);
  }
};

this.loadModules = function(self) {
    return new Promise((resolve, reject) => {
        if(self === undefined) {
            self = this;
        }
        let path = __dirname.split(self.getSlash());
        let index = path.indexOf(path[path.length - 1]); path.splice(index, 1);
        path = path.join(self.getSlash()); path = path + self.getSlash() + "App" + self.getSlash() + "Modules" + self.getSlash();

        let modules = self.getFiles(path);
        Logger.sendLog("-> Number of Modules to load: " + modules.length, "INIT", __filename);
        let modpassed = 0, modfailed = 0;

        let promiseArray = [];
        modules.forEach((lmod) => {
            let tmpModule = "", valid = false;
            try {
                if(lmod.subfile !== undefined) {
                    tmpModule = require(".." + self.getSlash() + "App" + self.getSlash() + "Modules" + self.getSlash() + lmod.subfile + self.getSlash() + lmod.file);
                } else {
                    tmpModule = require(".." + self.getSlash() + "App" + self.getSlash() + "Modules" + self.getSlash() + lmod.file);
                }
                valid = true;
            } catch(err) {
                console.log(err.stack);
                Logger.sendLog("-> Failed to load " + lmod.file + " => " + err.message, "CRITICAL", __filename);
                modfailed++;
                promiseArray.push(reject(err.message));
            }
            if(valid === true) {
                modpassed++;
                if(BotSettings.config.debug) {
                    Logger.sendLog("-> Pushing modules to promiseArray...", "INIT", __filename);
                }
                promiseArray.push(tmpModule.setupCommands(lmod.file));
            }
        });

        Promise.all(promiseArray).then(values => {
            values.forEach((moduleResp) => {
                self.addModules(moduleResp);
                Logger.sendLog("-> Loaded " + moduleResp.file + " fully", "LOADED", __filename);
            });
            let obj = {name: "MODULES", passed: modpassed, failed: modfailed, total: (Number(modpassed) + Number(modfailed))};
            self.addStats(obj);
            Logger.sendLog("-> Promise complete for Modules...", "LOADED", __filename);
            return resolve();
        }).catch(error => {
            Logger.sendLog("-> Error: " + error.message, "CRITICAL", __filename);
            return reject();
        });
    });
};

this.findModules = (platName="all", command) => {
    if(platName.toLowerCase() === "all".toLowerCase()) {
        //no restrictive lookup
        for(let i = 0; i < Managers.Modules.length; i++) {
            let response = this.findModuleCommandName(command, i);
            if(response[0] === true) {
                return [true, Managers.Modules[i], response[1]];
            }
        }
    } else {
        //restrictive lookup
        for(let i = 0; i < Managers.Modules.length; i++) {
            if(platName.toLowerCase() === Managers.Modules[i].moduleInfo.platformOnly.toLowerCase()) {
                //valid, now find commands in here
                let response = this.findModuleCommandName(command, i);
                if(response[0] === true) {
                    return [true, Managers.Modules[i], response[1]];
                }
            }
        }
    }
    return [false, null, null];
};

this.findAllModules = (platName) => {
    let moduleArrayObj = [];
    for(let i = 0; i < Managers.Modules.length; i++) {
        if(platName.toLowerCase() === Managers.Modules[i].moduleInfo.platformOnly.toLowerCase() || "all".toLowerCase() === Managers.Modules[i].moduleInfo.platformOnly.toLowerCase()) {
            moduleArrayObj.push(Managers.Modules[i]);
        }
    }
    return [true, moduleArrayObj];
};

this.findModuleCommandName = (cmdName, index) => {
    for(let i = 0; i < Managers.Modules[index].commands.length; i++) {
        for(let j = 0; j < Managers.Modules[index].commands[i].names.length; j++) {
            if(cmdName.toLowerCase() === Managers.Modules[index].commands[i].names[j].toLowerCase()) {
                return [true, Managers.Modules[index].commands[i]];
            }
        }
    }
    return [false, null];
}


// Files in Path via Array
this.getFiles = function(dir, check=undefined) {
	let filelist = [];
	var path = path || require('path'); var os = os || require("os"); var fs = fs || require('fs'), files = fs.readdirSync(dir); filelist = filelist || [];
	files.map((file) => {
		if(fs.statSync(path.join(dir, file)).isDirectory()) {
			this.getFiles(path.join(dir, file), check, filelist).map((subfile) => {
				if(typeof(subfile) === "object") {
                    var slash = "";
                    if(os.platform() === 'win32') {
                        slash = "\\";
                    } else {
                        slash = "/";
                    }
                    var lastPart = subfile.dir.split(slash).pop();
					if(subfile.subfile === undefined) {
						filelist.push({dir: subfile.dir, file: subfile.file, subfile: lastPart});
					} else {
						filelist.push({dir: subfile.dir, file: subfile.file, subfile: subfile.subfile});
					}
				} else {
					if(subfile === undefined) {
						filelist.push({dir: dir, file: file, subfile: file, lastpart: lastPart});
					} else {
						filelist.push({dir: dir, file: file, subfile: subfile, lastpart: lastPart});
					}
				}
			});
		}
		else {
			filelist.push({dir: dir, file: file});
		}
	});
	return filelist;
}
