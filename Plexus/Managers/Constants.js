
function Constants() {
}

this.setupConstants = () => {
    return new Promise((resolve, reject) => {
        Database.callStatement("SELECT * FROM API").then((rows) => {
            global.ConstantVars = {};
            if(rows.length >= 1) {
                rows.forEach(row => {
                    ConstantVars[row.name] = row.value;
                });
                return resolve();
            } else {
                return resolve();
            }
        }).catch(err => {
            console.log(err);
            return reject();
        });
    });
}
