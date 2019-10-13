//var Random = require("random-js");
//var random = new Random(Random.engines.mt19937().autoSeed());
function erratic(level) {
    let n = parseInt(level);
    let x = 0, y = 0, result = 0;
    if(n <= 50) {
        x = (n*n*n)*(100-n);
        y = 50;
        result = x / y;
    } else if(50 <= n <= 68) {
        x = (n*n*n)*(150-n);
        y = 100;
        result = x / y;
    } else if(68 <= n <= 98) {
        x = (n*n*n)*((Math.floor(1911-(18*n)))/3);
        y = 500;
        result = x / y;
    } else if(98 <= n <= 100) {
        x = (n*n*n)*(160-n);
        y = 100;
        result = x / y;
    } else {
        let multiple = 1;
        let defaultNum = 160;
        if(n >= 100000) {
            multiple = 2;
            defaultNum = n + 7.5;
        } else if(n >= 50000) {
            multiple = 1.875;
            defaultNum = n + 7.5;
        } else if(n >= 25000) {
            multiple = 1.75;
            defaultNum = n + 7.5;
        } else if(n >= 10000) {
            multiple = 1.625;
            defaultNum = n + 7.5;
        } else if(n >= 5000) {
            multiple = 1.5;
            defaultNum = n + 7.5;
        } else if(n >= 2500) {
            multiple = 1.375;
            defaultNum = n + 7.5;
        } else if(n >= 1000) {
            multiple = 1.25;
            defaultNum = n + 7.5;
        } else if(n >= defaultNum){
            multiple = 1.125;
            defaultNum = n + 7.5;
        } else {
            multiple = 1;
            defaultNum = n + 7.5;
        }
        x = (n*n*n)*((defaultNum*multiple)-n);
        y = 100*multiple;
        result = x / y;
    }
    return Math.round(result);
}

function fast(level) {
    let n = parseInt(level);
    return Math.round(((4*(n*n*n))/5));
}

function medium_fast(level) {
    let n = parseInt(level);
    return Math.round((n*n*n));
}

function medium_slow(level) {
    let n = parseInt(level);
    let x = (6/5)*(n*n*n);
    let y = (15*(n*n));
    let z = (100*n);
    return Math.round(x - y + z - 140);
}

function slow(level) {
    let n = parseInt(level);
    let result = (5/4)*(n*n*n);
    return Math.round(result);
}

function fluctuating(level) {
    let n = parseInt(level);
    let x = 0, y = 0, z = 0, result = 0;
    if(n <= 15) {
        x = (n*n*n);
        y = (Math.floor((n+1)/3) + 24);
        z = 50;
        result = (x * y) / z;
    } else if( 15 <= n <= 36) {
        x = (n*n*n);
        y = (n + 14);
        z = 50;
        result = (x * y) / z;
    } else if( 36 <= n <= 100) {
        x = (n*n*n);
        y = Math.floor(n/2) + 32;
        z = 50;
        result = (x * y) / z;
    } else {
        //greater than 100
        x = (n*n*n);
        y = Math.floor(n/2) + 48;
        z = 50;
        result = (x * y) / z;
    }
    return Math.round(result);
}

function randomFlux(level) {
    let n = parseInt(level);
    let a = erratic(n), b = fast(n), c = medium_fast(n), d = medium_slow(n), e = slow(n), f = fluctuating(n);
    if(n >= 3) {
        return 3500 + parseInt(parseInt(a + b + c + d + e + f)/2.5);
    } else {
        return 25 + parseInt(parseInt(a + b + c + e + f)/2.5);
    }
}

module.exports = {
    erratic: erratic,
    fast: fast,
    medium_fast: medium_fast,
    medium_slow: medium_slow,
    slow: slow,
    fluctuating: fluctuating,
    randomFlux: randomFlux
};

function test() {
    for(let i = 0; i <= 100; i++) {
        console.log(erratic(i) + " | " + fast(i) + " | " + medium_fast(i) + " | " + medium_slow(i) + " | " + slow(i) + " | " + fluctuating(i))
    }
}
