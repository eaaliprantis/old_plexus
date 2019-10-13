let request = require("request");
let cheerio = require("cheerio");

let x = "kittykonspiracy";
let y = "kitty";

request("https://worldoftrucks.com/en/search.php?text=" + x + "&type=users", (err, resp, body) => {
    if(err) {
        console.log("Error: " + err);
    } else {
        let $ = cheerio.load(resp.body);
        let errorInfo = $("#search-result-error").html();
        if(errorInfo.trim() !== "") {
            let errorTxt = $("#search-result-error").text();
            console.log(errorTxt); //Error works great
        }
        let info = $("table", "#search-results").html()
        let $2 = cheerio.load(info);
        console.log("----------------------");
        console.log(info);
        let info2 = $(".search-result");
        let info3 = $(".search-result-more");
        console.log("-----------------------");
        info2.each((i, elem) => {
            console.log($(info2[i]).find("a").attr("href").split("=")[1]);
            console.log($(info2[i]).text().trim() + " - " + $(info2[i]).find("img").attr("src"));
        });
        console.log("----------------------");
        console.log(info3.text().trim() === "");
    }
});
