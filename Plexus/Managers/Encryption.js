function CryptoClass() {}

this.setupEncrypt = () => {
    return new Promise((resolve, reject) => {
        loadList().then(() => {
            global.Encryption = this;
            return resolve();
        }).catch(e => {
            return reject();
        });
    });
}

loadList = () => {
    return new Promise((resolve, reject) => {
        this.crypto = require("crypto");
        this.algorithm = "aes-128-ctr";

        this.generateSalt = (maxLen=12) => {
            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*%";

            for(let i = 0; i < maxLen; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }

        this.encrypt = (toHash, algorithm=null, salt=undefined) => {
            if(algorithm === null) {
                algorithm = this.algorithm;
            }
            return new Promise((resolve, reject) => {
                if(!salt) {
                    salt = this.generateSalt() + this.generateSalt();
                }
                try {
                    let cipher = this.crypto.createCipher(algorithm.toLowerCase(), salt);
                    let encrypted = "";

                    cipher.on("readable", () => {
                        let data = cipher.read();
                        if(data) {
                            encrypted += data.toString("hex");
                        }
                    }).on("end", () => {
                        return resolve({
                            salt: salt,
                            algo: algorithm,
                            hash: encrypted
                        })
                    });
                    cipher.write(toHash);
                    cipher.end();
                } catch(e) {
                    return reject(e);
                }
            });

            this.decrypt = (hash, algorithm=null, salt) => {
                if(algorithm === null) {
                    algorithm = this.algorithm;
                }
                return new Promise((resolve, reject) => {
                    try {
                        let cipher = this.crypto.createDecipher(algorithm.toLowerCase(), salt);
                        let decrypt = "";
                        cipher.on("readable", () => {
                            let data = cipher.read();
                            if(data) {
                                decrypt += data.toString("utf8");
                            }
                        }).on("end", () => {
                            resolve({original: decrypt});
                        });
                    } catch(e) {
                        return reject(e);
                    }
                });
            }
        }

        this.encryptPedall = (text, algorithm, password) => {
            let cipher = this.crypto.createCipher(algorithm, password);
            return cipher.update(text, 'utf8', 'hex') + cipher.final("hex");
        }

        this.decryptPedall = (text, algorithm, password) => {
            let decipher = this.crypto.createDecipher(algorithm, password);
            return decipher.update(text, "hex", "utf8") + decipher.final("utf8");
        }
        return resolve();
    });
}
